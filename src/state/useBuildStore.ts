import { create } from 'zustand'
import type { Build, Category, Part } from '@/data/types'
import { isCPU, isGPU } from '@/data/types'
import { computeWattage, type WattageResult } from '@/engine/wattage'
import { checkCompatibility, type CompatReport } from '@/engine/compatibility'
import { computeBenchmarks, type BenchResult } from '@/engine/benchmarks'
import { readBuildFromUrl, syncUrl } from '@/engine/share'

interface Derived {
  wattage: WattageResult
  report: CompatReport
  bench: BenchResult | null
  msrpTotal: number
  partCount: number
}

function derive(build: Build): Derived {
  const wattage = computeWattage(build)
  const report = checkCompatibility(build, wattage)
  const cpu = build.cpu
  const gpu = build.gpu
  const bench = isCPU(cpu) && isGPU(gpu) ? computeBenchmarks(cpu, gpu) : null

  let msrpTotal = 0
  let partCount = 0
  for (const p of Object.values(build)) {
    if (!p) continue
    msrpTotal += p.price
    partCount++
  }
  return { wattage, report, bench, msrpTotal, partCount }
}

interface BuildStore extends Derived {
  build: Build
  selectPart: (part: Part) => void
  removeCategory: (category: Category) => void
  clear: () => void
  setBuild: (build: Build) => void
}

const initialBuild = readBuildFromUrl()

export const useBuildStore = create<BuildStore>((set, get) => ({
  build: initialBuild,
  ...derive(initialBuild),

  selectPart: (part) => {
    const build: Build = { ...get().build, [part.category]: part }
    set({ build, ...derive(build) })
    syncUrl(build)
  },

  removeCategory: (category) => {
    const build: Build = { ...get().build }
    delete build[category]
    set({ build, ...derive(build) })
    syncUrl(build)
  },

  clear: () => {
    const build: Build = {}
    set({ build, ...derive(build) })
    syncUrl(build)
  },

  setBuild: (build) => {
    set({ build, ...derive(build) })
    syncUrl(build)
  },
}))
