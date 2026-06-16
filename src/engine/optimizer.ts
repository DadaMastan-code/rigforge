import type { Build, CPU, GPU, Motherboard } from '@/data/types'
import {
  isCPU,
  isGPU,
  isMobo,
  isMemory,
  isStorage,
  isPSU,
  isCase,
  isCooler,
} from '@/data/types'
import { partsByCategory } from '@/data/catalog'
import { checkCompatibility } from './compatibility'
import { computeWattage } from './wattage'

export type Priority = 'balanced' | 'gaming' | 'productivity'

const CPUS = partsByCategory.cpu.filter(isCPU)
const GPUS = partsByCategory.gpu.filter(isGPU)
const MOBOS = partsByCategory.motherboard.filter(isMobo)
const MEMS = partsByCategory.memory.filter(isMemory)
const STORES = partsByCategory.storage.filter(isStorage)
const PSUS = partsByCategory.psu.filter(isPSU)
const CASES = partsByCategory.case.filter(isCase)
const COOLERS = partsByCategory.cooler.filter(isCooler)

function totalUsd(b: Build): number {
  let t = 0
  for (const p of Object.values(b)) if (p) t += p.price
  return t
}

/** Performance score used to rank candidate builds. */
function perf(b: Build, priority: Priority): number {
  const cpu = isCPU(b.cpu) ? b.cpu : undefined
  const gpu = isGPU(b.gpu) ? b.gpu : undefined
  const g = gpu ? gpu.gamingScore : 0
  const cg = cpu ? cpu.gamingScore : 0
  const cp = cpu ? cpu.productivityScore : 0
  const gaming = cpu && gpu ? Math.min(g, cg * 2.2) : g

  let s: number
  if (priority === 'gaming') s = gaming * 1.6 + cp * 0.2
  else if (priority === 'productivity') s = cp * 1.6 + gaming * 0.3
  else s = gaming * 1.0 + cp * 0.6

  if (isMemory(b.memory)) s += Math.min(b.memory.capacityGb, 64) * 0.06
  if (isStorage(b.storage)) s += Math.min(b.storage.capacityGb / 1000, 4) * 1.2
  return s
}

/** The build's effective gaming tier (0–~112), used to balance auto-complete. */
function gamingTier(b: Build): number {
  const cpu = isCPU(b.cpu) ? b.cpu : undefined
  const gpu = isGPU(b.gpu) ? b.gpu : undefined
  if (cpu && gpu) return Math.min(gpu.gamingScore, cpu.gamingScore * 2.2)
  if (gpu) return gpu.gamingScore
  if (cpu) return cpu.gamingScore
  return 0
}

/** Weighted pick favoring higher scoreFn, preferring items within maxPrice. */
function pick<T extends { price: number }>(
  items: T[],
  scoreFn: (t: T) => number,
  maxPrice: number,
): T | undefined {
  if (items.length === 0) return undefined
  const affordable = items.filter((i) => i.price <= maxPrice)
  const pool = affordable.length ? affordable : items
  const weights = pool.map((i) => Math.max(0.01, scoreFn(i)))
  const sum = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * sum
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i]
    if (r <= 0) return pool[i]
  }
  return pool[pool.length - 1]
}

/** Build one feasible-ish candidate respecting `locked` parts and budget. */
function construct(locked: Build, budgetUsd: number, priority: Priority): Build | null {
  const b: Build = { ...locked }
  const remaining = Math.max(budgetUsd - totalUsd(locked), 0)

  // --- CPU (respect a locked motherboard's platform) ---
  let cpu: CPU | undefined = isCPU(b.cpu) ? b.cpu : undefined
  if (!cpu) {
    const mb = isMobo(b.motherboard) ? b.motherboard : undefined
    const pool = mb
      ? CPUS.filter((c) => c.socket === mb.socket && c.memoryType === mb.memoryType)
      : CPUS
    const cpuBudget = Math.max(remaining * (priority === 'gaming' ? 0.18 : 0.24), 120)
    cpu = pick(pool, (c) => (priority === 'productivity' ? c.productivityScore : c.gamingScore), cpuBudget)
    if (!cpu) return null
    b.cpu = cpu
  }

  // --- GPU ---
  let gpu: GPU | undefined = isGPU(b.gpu) ? b.gpu : undefined
  if (!gpu) {
    const gpuBudget = Math.max(
      remaining * (priority === 'gaming' ? 0.45 : priority === 'productivity' ? 0.22 : 0.38),
      200,
    )
    gpu = pick(GPUS, (x) => x.gamingScore, gpuBudget)
    if (!gpu) return null
    b.gpu = gpu
  }

  // --- Motherboard (match CPU platform; honour locked memory/case) ---
  let mb: Motherboard | undefined = isMobo(b.motherboard) ? b.motherboard : undefined
  if (!mb) {
    const lockedMem = isMemory(b.memory) ? b.memory : undefined
    const lockedCase = isCase(b.case) ? b.case : undefined
    const pool = MOBOS.filter(
      (m) =>
        m.socket === cpu.socket &&
        m.memoryType === cpu.memoryType &&
        (!lockedMem || lockedMem.type === m.memoryType) &&
        (!lockedCase || lockedCase.supportedFormFactors.includes(m.formFactor)),
    )
    mb = pick(pool, (x) => x.rating * 10, Math.max(remaining * 0.12, 120))
    if (!mb) return null
    b.motherboard = mb
  }

  // --- Memory ---
  if (!isMemory(b.memory)) {
    const pool = MEMS.filter(
      (m) => m.type === mb.memoryType && m.modules <= mb.memorySlots && m.capacityGb <= mb.maxMemoryGb,
    )
    const m = pick(pool, (x) => x.capacityGb + x.rating * 4, Math.max(remaining * 0.08, 50))
    if (!m) return null
    b.memory = m
  }

  // --- Case (fits board form factor + GPU length; honour locked cooler) ---
  if (!isCase(b.case)) {
    const lockedCooler = isCooler(b.cooler) ? b.cooler : undefined
    const pool = CASES.filter(
      (c) =>
        c.supportedFormFactors.includes(mb.formFactor) &&
        c.maxGpuLengthMm >= gpu.lengthMm &&
        (!lockedCooler ||
          (lockedCooler.type === 'Air'
            ? lockedCooler.heightMm <= c.maxCoolerHeightMm
            : lockedCooler.radiatorMm <= c.maxRadiatorMm)),
    )
    const c = pick(pool, (x) => x.rating * 10, Math.max(remaining * 0.08, 80))
    if (!c) return null
    b.case = c
  }
  const pcCase = isCase(b.case) ? b.case : null
  if (!pcCase) return null

  // --- Cooler (socket + fits case; prefer adequate cooling) ---
  if (!isCooler(b.cooler)) {
    const fits = COOLERS.filter(
      (cl) =>
        cl.sockets.includes(cpu.socket) &&
        (cl.type === 'Air' ? cl.heightMm <= pcCase.maxCoolerHeightMm : cl.radiatorMm <= pcCase.maxRadiatorMm),
    )
    const adequate = fits.filter((cl) => cl.tdpRating >= cpu.tdp)
    const pool = adequate.length ? adequate : fits
    const cl = pick(pool, (x) => x.tdpRating + x.rating * 4, Math.max(remaining * 0.06, 35))
    if (!cl) return null
    b.cooler = cl
  }

  // --- Storage ---
  if (!isStorage(b.storage)) {
    const s = pick(STORES, (x) => x.capacityGb / 100 + x.rating * 4, Math.max(remaining * 0.06, 60))
    if (!s) return null
    b.storage = s
  }

  // --- PSU (≥ ~1.25× estimated draw, prefer ~1.5× headroom) ---
  if (!isPSU(b.psu)) {
    const estW = computeWattage(b).estimatedW
    const adequate = PSUS.filter((p) => p.wattage >= estW * 1.25)
    const pool = adequate.length ? adequate : [...PSUS].sort((a, z) => z.wattage - a.wattage)
    const p = pick(pool, (x) => 1200 - Math.abs(x.wattage - estW * 1.5), Number.MAX_SAFE_INTEGER)
    if (!p) return null
    b.psu = p
  }

  return b
}

export interface OptimizeResult {
  build: Build
  totalUsd: number
}

/** Sample many candidates; keep the best conflict-free build within budget. */
export function optimizeBuild(opts: {
  locked?: Build
  budgetUsd?: number
  priority?: Priority
  iterations?: number
  /** When set, rank candidates by closeness to this gaming tier (balance), not max performance. */
  matchTier?: number
}): OptimizeResult | null {
  const locked = opts.locked ?? {}
  const priority = opts.priority ?? 'balanced'
  const budget = opts.budgetUsd ?? Number.POSITIVE_INFINITY
  const iterations = opts.iterations ?? 700

  let best: Build | null = null
  let bestScore = -Infinity

  for (let i = 0; i < iterations; i++) {
    const cand = construct(locked, Number.isFinite(budget) ? budget : 1e7, priority)
    if (!cand) continue
    const t = totalUsd(cand)
    if (t > budget) continue
    const report = checkCompatibility(cand, computeWattage(cand))
    if (report.errors > 0) continue
    const score =
      opts.matchTier != null
        ? -Math.abs(gamingTier(cand) - opts.matchTier) - totalUsd(cand) * 0.002 - report.warnings * 0.4
        : perf(cand, priority) - report.warnings * 0.4
    if (score > bestScore) {
      bestScore = score
      best = cand
    }
  }

  return best ? { build: best, totalUsd: totalUsd(best) } : null
}

/** Fill empty slots of `current`, scaling ambition to what's already chosen. */
export function autoComplete(current: Build, priority: Priority = 'balanced'): OptimizeResult | null {
  // Fill empty slots to match the build's existing tier (no budget cap), so a
  // high-end partial build gets high-end fills and vice-versa.
  const target = gamingTier(current) || 78
  return optimizeBuild({ locked: current, priority, matchTier: target, iterations: 800 })
}

/** Approx. floor for a complete build — guides the budget UI hint. */
export const MIN_BUILD_USD = 800
