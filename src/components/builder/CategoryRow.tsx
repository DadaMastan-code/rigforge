import { motion } from 'framer-motion'
import { Plus, X, AlertTriangle, AlertCircle, Check } from 'lucide-react'
import type { Category } from '@/data/types'
import { CATEGORY_META } from '@/data/catalog'
import { useBuildStore } from '@/state/useBuildStore'
import { ACCENT, CategoryIcon } from '@/lib/icons'
import { CATEGORY_IMAGE } from '@/lib/componentImages'
import { specChips } from '@/lib/specs'
import { PriceTag } from '@/components/ui/PriceTag'
import { cn } from '@/lib/cn'

export function CategoryRow({
  category,
  index,
  onOpen,
}: {
  category: Category
  index: number
  onOpen: () => void
}) {
  const part = useBuildStore((s) => s.build[category])
  const report = useBuildStore((s) => s.report)
  const removeCategory = useBuildStore((s) => s.removeCategory)

  const meta = CATEGORY_META[category]
  const accent = ACCENT[meta.accent]
  const hasError = report.errorCategories.has(category)
  const hasWarn = report.warnCategories.has(category)

  return (
    <motion.div
      layout
      className={cn(
        'group relative flex items-center gap-4 rounded-2xl border bg-ink-850/50 p-4 transition-colors',
        hasError ? 'border-danger/40' : part ? 'border-ink/10' : 'border-dashed border-ink/12',
      )}
    >
      <span className="hidden w-6 shrink-0 text-center font-mono text-sm text-fg-dim sm:block">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-ink/10">
        {part ? (
          <img
            src={CATEGORY_IMAGE[category]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span
            className={cn('grid h-full w-full place-items-center', accent.bgSoft)}
            style={{ color: accent.hex }}
          >
            <CategoryIcon category={category} className="h-6 w-6" />
          </span>
        )}
      </div>

      {part ? (
        <>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
                {meta.label} · {part.brand}
              </span>
              {hasError ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-danger/15 px-1.5 py-0.5 text-[10px] font-semibold text-danger">
                  <AlertCircle className="h-3 w-3" /> Issue
                </span>
              ) : hasWarn ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-warn/15 px-1.5 py-0.5 text-[10px] font-semibold text-warn">
                  <AlertTriangle className="h-3 w-3" /> Check
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-ok/15 px-1.5 py-0.5 text-[10px] font-semibold text-ok">
                  <Check className="h-3 w-3" /> OK
                </span>
              )}
            </div>
            <div className="truncate font-display text-base font-semibold text-fg">
              {part.name}
            </div>
            <div className="mt-1 hidden truncate text-[11px] text-fg-muted sm:block">
              {specChips(part)
                .slice(0, 3)
                .map((c) => c.value)
                .join('  ·  ')}
            </div>
          </div>

          <PriceTag id={part.id} basePrice={part.price} size="lg" />

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onOpen}
              className="rounded-lg border border-ink/10 px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:bg-ink/5 hover:text-fg"
            >
              Change
            </button>
            <button
              onClick={() => removeCategory(category)}
              aria-label={`Remove ${meta.label}`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 text-fg-dim transition-colors hover:border-danger/40 hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <button onClick={onOpen} className="flex flex-1 items-center justify-between">
          <div className="text-left">
            <div className="font-display text-base font-semibold text-fg">{meta.label}</div>
            <div className="text-sm text-fg-muted">{meta.blurb}</div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 px-3 py-2 text-sm font-medium text-fg transition-colors group-hover:bg-ink/5"
            style={{ color: accent.hex }}
          >
            <Plus className="h-4 w-4" /> Choose
          </span>
        </button>
      )}
    </motion.div>
  )
}
