import type { CPU, GPU } from '@/data/types'

export type BottleneckComponent = 'cpu' | 'gpu' | 'balanced'

export interface BenchResult {
  /** Average FPS estimates across a mixed AAA workload. */
  fps1080: number
  fps1440: number
  fps4k: number
  /** Multi-core productivity index, 0–100. */
  productivity: number
  tier: string
  bottleneck: {
    component: BottleneckComponent
    severityPct: number
    text: string
  }
}

const round5 = (n: number) => Math.round(n)

function tierFor(score: number): string {
  if (score < 55) return 'Entry'
  if (score < 72) return '1080p'
  if (score < 88) return '1440p'
  if (score < 100) return 'High-refresh'
  return '4K Ultra'
}

/**
 * Lightweight performance model. GPU score sets the raster ceiling at each
 * resolution; the CPU caps frame delivery, which matters most at 1080p and
 * fades by 4K where the GPU dominates.
 */
export function computeBenchmarks(cpu: CPU, gpu: GPU): BenchResult {
  const g = gpu.gamingScore
  const c = cpu.gamingScore

  // GPU-bound ceilings per resolution.
  const gpu1080 = g * 1.95
  const gpu1440 = g * 1.45
  const gpu4k = g * 0.82

  // CPU frame-delivery cap (dominates at low resolution).
  const cpuCap = c * 2.25

  const fps1080 = round5(Math.min(gpu1080, cpuCap))
  const fps1440 = round5(Math.min(gpu1440, cpuCap * 1.25))
  const fps4k = round5(gpu4k) // effectively always GPU-bound

  const productivity = Math.round(cpu.productivityScore * 0.9 + gpu.gamingScore * 0.1)

  // Bottleneck: relative balance of the pair at high refresh.
  const diff = g - c
  let component: BottleneckComponent = 'balanced'
  let text =
    'Well matched — the CPU and GPU keep pace with each other across resolutions.'
  if (diff > 12) {
    component = 'cpu'
    text = `${cpu.name} can hold back ${gpu.name} at 1080p and high frame rates. The pairing shines at 1440p/4K where the GPU leads.`
  } else if (diff < -14) {
    component = 'gpu'
    text = `${gpu.name} is the limiter — ${cpu.name} has headroom to spare. A stronger GPU would lift frame rates.`
  }
  const severityPct = Math.min(45, Math.round(Math.abs(diff) * 1.4))

  return {
    fps1080,
    fps1440,
    fps4k,
    productivity,
    tier: tierFor(g),
    bottleneck: { component, severityPct, text },
  }
}
