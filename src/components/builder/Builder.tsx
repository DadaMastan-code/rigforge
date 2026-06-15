import { Suspense, lazy, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sparkles, Move } from 'lucide-react'
import type { Build, Category } from '@/data/types'
import { CATEGORY_ORDER, getPart } from '@/data/catalog'
import { useBuildStore } from '@/state/useBuildStore'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { CategoryRow } from './CategoryRow'
import { PartPicker } from './PartPicker'
import { SummaryPanel } from './SummaryPanel'
import { WattageGauge } from './WattageGauge'
import { CompatibilityPanel } from './CompatibilityPanel'
import { PerformancePanel } from './PerformancePanel'
import { cn } from '@/lib/cn'

const RigCanvas = lazy(() =>
  import('@/components/three/RigCanvas').then((m) => ({ default: m.RigCanvas })),
)

const PRESETS: { id: string; name: string; tag: string; ids: string[] }[] = [
  {
    id: 'budget',
    name: 'Budget',
    tag: 'Entry · 1080p',
    ids: ['cpu-r5-7600', 'mb-tuf-b650', 'mem-fury-16-5600', 'gpu-rtx4060', 'cool-pa120', 'ssd-sn850x-1tb', 'psu-bq-650', 'case-4000d'],
  },
  {
    id: 'balanced',
    name: 'Balanced',
    tag: 'Sweet spot · 1440p',
    ids: ['cpu-r7-7800x3d', 'mb-tomahawk-b650', 'mem-veng-32-6000', 'gpu-rtx4070s', 'cool-lf3-360', 'ssd-990pro-2tb', 'psu-rm750e', 'case-h7flow'],
  },
  {
    id: 'extreme',
    name: 'Extreme',
    tag: 'Flagship · 4K',
    ids: ['cpu-r7-9800x3d', 'mb-x670e-master', 'mem-tridz5-32-6400', 'gpu-rtx5090', 'cool-lf3-360', 'ssd-t700-2tb', 'psu-hx1200', 'case-o11evo'],
  },
]

function buildFromIds(ids: string[]): Build {
  const b: Build = {}
  for (const id of ids) {
    const p = getPart(id)
    if (p) b[p.category] = p
  }
  return b
}

export function Builder() {
  const [picker, setPicker] = useState<Category | null>(null)
  const setBuild = useBuildStore((s) => s.setBuild)

  return (
    <section id="builder" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Configure your <span className="text-gradient">build</span>
          </h2>
          <p className="mt-2 max-w-md text-fg-muted">
            Choose each component — compatibility, power and performance update instantly.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 self-center pr-1 text-xs text-fg-dim">
            <Sparkles className="h-3.5 w-3.5" /> Quick start
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setBuild(buildFromIds(p.ids))}
              className="group rounded-xl border border-white/10 bg-ink-850/60 px-3 py-2 text-left transition-colors hover:border-cyan/40 hover:bg-white/5"
            >
              <div className="text-sm font-semibold text-fg">{p.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-fg-dim">
                {p.tag}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Rows */}
        <div className="flex flex-col gap-3">
          {CATEGORY_ORDER.map((category, i) => (
            <CategoryRow
              key={category}
              category={category}
              index={i}
              onOpen={() => setPicker(category)}
            />
          ))}
        </div>

        {/* Rail */}
        <div
          className={cn(
            'flex flex-col gap-4',
            'lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1 no-scrollbar',
          )}
        >
          <div className="glass rounded-2xl p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="font-display text-sm font-semibold text-fg">Live 3D preview</h3>
              <span className="flex items-center gap-1 font-mono text-[10px] text-fg-dim">
                <Move className="h-3 w-3" /> drag to orbit
              </span>
            </div>
            <div className="relative h-[260px] overflow-hidden rounded-xl bg-ink-950/40">
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="grid h-full place-items-center text-xs text-fg-dim">
                      Loading…
                    </div>
                  }
                >
                  <RigCanvas interactive className="h-full w-full" />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          <SummaryPanel />
          <WattageGauge />
          <CompatibilityPanel />
          <PerformancePanel />
        </div>
      </div>

      <AnimatePresence>
        {picker && <PartPicker category={picker} onClose={() => setPicker(null)} />}
      </AnimatePresence>
    </section>
  )
}
