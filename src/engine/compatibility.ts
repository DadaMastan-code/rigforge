import type { Build, Category } from '@/data/types'
import type { WattageResult } from './wattage'

export type IssueLevel = 'error' | 'warn'

export interface Issue {
  level: IssueLevel
  /** Categories this issue should badge in the builder. */
  categories: Category[]
  message: string
}

export interface CompatReport {
  issues: Issue[]
  errors: number
  warnings: number
  /** No hard errors (warnings are allowed). */
  ok: boolean
  /** Categories that carry at least one error. */
  errorCategories: Set<Category>
  warnCategories: Set<Category>
}

/**
 * Pure compatibility engine. `wattage` is passed in (already computed by the
 * store) so PSU adequacy is reported here without recomputing draw.
 */
export function checkCompatibility(
  build: Build,
  wattage: WattageResult,
): CompatReport {
  const issues: Issue[] = []
  const add = (level: IssueLevel, categories: Category[], message: string) =>
    issues.push({ level, categories, message })

  const { cpu, motherboard: mb, memory, gpu, cooler, storage, psu, case: pcCase } = build

  // --- CPU ↔ Motherboard socket ---
  if (cpu && mb && cpu.category === 'cpu' && mb.category === 'motherboard') {
    if (cpu.socket !== mb.socket) {
      add('error', ['cpu', 'motherboard'], `${cpu.name} (${cpu.socket}) doesn't fit the ${mb.socket} socket on the ${mb.name}.`)
    }
    if (cpu.memoryType !== mb.memoryType) {
      add('error', ['cpu', 'motherboard'], `${cpu.name} needs ${cpu.memoryType}, but the ${mb.name} is ${mb.memoryType}.`)
    }
  }

  // --- Memory ↔ Motherboard ---
  if (memory && mb && memory.category === 'memory' && mb.category === 'motherboard') {
    if (memory.type !== mb.memoryType) {
      add('error', ['memory', 'motherboard'], `${memory.type} memory won't fit the ${mb.memoryType} slots on the ${mb.name}.`)
    }
    if (memory.modules > mb.memorySlots) {
      add('error', ['memory', 'motherboard'], `${memory.name} needs ${memory.modules} slots; the ${mb.name} only has ${mb.memorySlots}.`)
    }
    if (memory.capacityGb > mb.maxMemoryGb) {
      add('error', ['memory', 'motherboard'], `${memory.capacityGb}GB exceeds the ${mb.name}'s ${mb.maxMemoryGb}GB maximum.`)
    }
    if (memory.type === mb.memoryType && memory.speedMhz > mb.maxMemorySpeed) {
      add('warn', ['memory', 'motherboard'], `${memory.name} runs at ${memory.speedMhz}MT/s; the ${mb.name} is rated to ${mb.maxMemorySpeed}. It may downclock or need manual tuning.`)
    }
  }

  // --- Motherboard ↔ Case form factor ---
  if (mb && pcCase && mb.category === 'motherboard' && pcCase.category === 'case') {
    if (!pcCase.supportedFormFactors.includes(mb.formFactor)) {
      add('error', ['motherboard', 'case'], `The ${pcCase.name} doesn't support ${mb.formFactor} boards.`)
    }
  }

  // --- GPU ↔ Case clearance ---
  if (gpu && pcCase && gpu.category === 'gpu' && pcCase.category === 'case') {
    if (gpu.lengthMm > pcCase.maxGpuLengthMm) {
      add('error', ['gpu', 'case'], `${gpu.name} is ${gpu.lengthMm}mm long; the ${pcCase.name} fits up to ${pcCase.maxGpuLengthMm}mm.`)
    }
  }

  // --- Cooler ↔ CPU socket, Case clearance, CPU thermals ---
  if (cooler && cooler.category === 'cooler') {
    if (cpu && cpu.category === 'cpu' && !cooler.sockets.includes(cpu.socket)) {
      add('error', ['cooler', 'cpu'], `${cooler.name} has no ${cpu.socket} mounting bracket.`)
    }
    if (pcCase && pcCase.category === 'case') {
      if (cooler.type === 'Air' && cooler.heightMm > pcCase.maxCoolerHeightMm) {
        add('error', ['cooler', 'case'], `${cooler.name} is ${cooler.heightMm}mm tall; the ${pcCase.name} clears ${pcCase.maxCoolerHeightMm}mm.`)
      }
      if (cooler.type === 'Liquid AIO' && cooler.radiatorMm > pcCase.maxRadiatorMm) {
        add('error', ['cooler', 'case'], `The ${cooler.radiatorMm}mm radiator won't fit the ${pcCase.name} (max ${pcCase.maxRadiatorMm}mm).`)
      }
    }
    if (cpu && cpu.category === 'cpu' && cooler.tdpRating < cpu.tdp) {
      add('warn', ['cooler', 'cpu'], `${cooler.name} is rated for ${cooler.tdpRating}W; ${cpu.name} can pull ${cpu.tdp}W+ under load.`)
    }
  }

  // --- Storage ↔ Motherboard M.2 ---
  if (storage && mb && storage.category === 'storage' && mb.category === 'motherboard') {
    if (storage.usesM2 && mb.m2Slots < 1) {
      add('error', ['storage', 'motherboard'], `${storage.name} needs an M.2 slot; the ${mb.name} has none.`)
    }
  }

  // --- Power ---
  if (psu && psu.category === 'psu') {
    if (wattage.status === 'danger') {
      add('error', ['psu'], `Estimated draw of ${wattage.estimatedW}W exceeds the ${psu.wattage}W PSU. Step up to ~${wattage.recommendedW}W.`)
    } else if (wattage.status === 'warn') {
      add('warn', ['psu'], `The ${psu.wattage}W PSU runs at ${Math.round((wattage.loadFraction ?? 0) * 100)}% load. ${wattage.recommendedW}W gives healthier headroom.`)
    }
    if (gpu && gpu.category === 'gpu' && psu.wattage < gpu.recommendedPsu) {
      add('warn', ['psu', 'gpu'], `${gpu.name} recommends a ${gpu.recommendedPsu}W supply; you have ${psu.wattage}W.`)
    }
  }

  // --- Sort: errors first ---
  issues.sort((a, b) => (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1))

  const errorCategories = new Set<Category>()
  const warnCategories = new Set<Category>()
  let errors = 0
  let warnings = 0
  for (const issue of issues) {
    if (issue.level === 'error') {
      errors++
      issue.categories.forEach((c) => errorCategories.add(c))
    } else {
      warnings++
      issue.categories.forEach((c) => warnCategories.add(c))
    }
  }

  return {
    issues,
    errors,
    warnings,
    ok: errors === 0,
    errorCategories,
    warnCategories,
  }
}
