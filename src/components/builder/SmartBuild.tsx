import { useState } from 'react'
import { Sparkles, Wand2, CheckCheck } from 'lucide-react'
import { useBuildStore } from '@/state/useBuildStore'
import { useCurrency, formatAmount } from '@/state/useCurrencyStore'
import { optimizeBuild, autoComplete, MIN_BUILD_USD, type Priority } from '@/engine/optimizer'
import { cn } from '@/lib/cn'

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'balanced', label: 'Balance' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'productivity', label: 'Productivity' },
]

export function SmartBuild() {
  const build = useBuildStore((s) => s.build)
  const setBuild = useBuildStore((s) => s.setBuild)
  const partCount = useBuildStore((s) => s.partCount)
  const cur = useCurrency()

  const [budgetUsd, setBudgetUsd] = useState(1500)
  const [priority, setPriority] = useState<Priority>('balanced')
  const [error, setError] = useState<string | null>(null)

  const onGenerate = () => {
    const res = optimizeBuild({ budgetUsd, priority, iterations: 900 })
    if (res) {
      setBuild(res.build)
      setError(null)
    } else {
      setError(`No full build fits ${formatAmount(budgetUsd * cur.rate, cur)}. Try a higher budget.`)
    }
  }

  const onComplete = () => {
    const res = autoComplete(build, priority)
    if (res) {
      setBuild(res.build)
      setError(null)
    } else {
      setError('Couldn’t auto-complete — your selected parts conflict. Resolve the highlighted issues first.')
    }
  }

  const canComplete = partCount > 0 && partCount < 8

  return (
    <div className="mb-6 rounded-2xl border border-ink/10 bg-ink-850 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <h3 className="font-display text-base font-semibold text-fg">Smart build</h3>
        <span className="text-sm text-fg-muted">— auto-pick a compatible, balanced build</span>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-4">
        {/* Budget */}
        <div>
          <div className="kicker mb-1.5">Budget</div>
          <div className="flex items-center rounded-xl border border-ink/12 bg-ink-900/40 pl-3">
            <span className="font-mono text-sm text-fg-muted">{cur.symbol}</span>
            <input
              type="number"
              min={0}
              step={50}
              value={Math.round(budgetUsd * cur.rate)}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (Number.isFinite(v) && v >= 0) setBudgetUsd(v / cur.rate)
              }}
              className="w-32 bg-transparent px-2 py-2.5 font-mono text-sm text-fg outline-none"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <div className="kicker mb-1.5">Optimize for</div>
          <div className="flex gap-1 rounded-xl border border-ink/10 p-1">
            {PRIORITIES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPriority(p.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  priority === p.id ? 'bg-accent text-ink-950' : 'text-fg-muted hover:text-fg',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onGenerate}
            className="inline-flex items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-accent"
          >
            <Wand2 className="h-4 w-4" />
            Generate build
          </button>
          <button
            onClick={onComplete}
            disabled={!canComplete}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/12 bg-ink-900/40 px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-ink/5 disabled:opacity-40"
          >
            <CheckCheck className="h-4 w-4" />
            Auto-complete
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-danger">{error}</p>
      ) : (
        <p className="mt-3 text-xs text-fg-dim">
          Every generated build is socket-, clearance- and power-checked. A full build starts
          around {formatAmount(MIN_BUILD_USD * cur.rate, cur)}.
        </p>
      )}
    </div>
  )
}
