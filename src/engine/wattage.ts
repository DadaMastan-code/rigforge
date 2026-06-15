import type { Build } from '@/data/types'
import { isCPU, isGPU, isPSU } from '@/data/types'

export type WattageStatus = 'ok' | 'warn' | 'danger' | 'none'

export interface WattageResult {
  /** Estimated peak system draw in watts. */
  estimatedW: number
  /** Suggested PSU wattage (≈50% headroom, rounded). */
  recommendedW: number
  /** Selected PSU wattage, or null. */
  psuW: number | null
  /** PSU load fraction 0–1, or null. */
  loadFraction: number | null
  headroomPct: number | null
  status: WattageStatus
}

const BASE_OVERHEAD_W = 30 // fans, RGB, USB peripherals, board VRM losses

const roundUpTo = (n: number, step: number) => Math.ceil(n / step) * step
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n))

export function computeWattage(build: Build): WattageResult {
  let draw = BASE_OVERHEAD_W

  for (const part of Object.values(build)) {
    if (!part) continue
    if (isCPU(part)) draw += part.tdp * 1.3 // CPUs spike well above TDP
    else if (isGPU(part)) draw += part.tdp * 1.15 // transient GPU spikes
    else draw += part.tdp
  }

  const estimatedW = Math.round(draw)
  const recommendedW = clamp(roundUpTo(estimatedW * 1.5, 50), 450, 1600)

  const psu = build.psu
  const psuW = isPSU(psu) ? psu.wattage : null
  if (psuW == null) {
    return {
      estimatedW,
      recommendedW,
      psuW: null,
      loadFraction: null,
      headroomPct: null,
      status: 'none',
    }
  }

  const loadFraction = estimatedW / psuW
  const headroomPct = ((psuW - estimatedW) / Math.max(estimatedW, 1)) * 100
  const status: WattageStatus =
    estimatedW > psuW ? 'danger' : loadFraction > 0.85 ? 'warn' : 'ok'

  return { estimatedW, recommendedW, psuW, loadFraction, headroomPct, status }
}
