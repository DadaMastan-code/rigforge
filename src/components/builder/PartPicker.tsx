import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Build, Category, Part } from '@/data/types'
import { partsByCategory, CATEGORY_META } from '@/data/catalog'
import { useBuildStore } from '@/state/useBuildStore'
import { checkCompatibility } from '@/engine/compatibility'
import { computeWattage } from '@/engine/wattage'
import { ACCENT, CategoryIcon } from '@/lib/icons'
import { PartCard } from './PartCard'
import { cn } from '@/lib/cn'

type Sort = 'price-asc' | 'price-desc' | 'performance' | 'rating'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'performance', label: 'Performance' },
  { id: 'rating', label: 'Rating' },
]

function perfScore(p: Part): number {
  if (p.category === 'cpu') return p.gamingScore + p.productivityScore
  if (p.category === 'gpu') return p.gamingScore
  return p.rating * 20
}

/** Does picking `candidate` introduce a compatibility error tied to its slot? */
function incompatReason(build: Build, candidate: Part): string | null {
  const next: Build = { ...build, [candidate.category]: candidate }
  const report = checkCompatibility(next, computeWattage(next))
  const issue = report.issues.find(
    (i) => i.level === 'error' && i.categories.includes(candidate.category),
  )
  return issue ? issue.message : null
}

export function PartPicker({ category, onClose }: { category: Category; onClose: () => void }) {
  const build = useBuildStore((s) => s.build)
  const selectPart = useBuildStore((s) => s.selectPart)
  const [sort, setSort] = useState<Sort>('performance')

  const meta = CATEGORY_META[category]
  const accent = ACCENT[meta.accent]
  const selectedId = build[category]?.id

  const parts = useMemo(() => {
    const list = [...partsByCategory[category]]
    list.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default:
          return perfScore(b) - perfScore(a)
      }
    })
    return list
  }, [category, sort])

  const incompat = useMemo(() => {
    const map: Record<string, string | null> = {}
    for (const p of partsByCategory[category]) map[p.id] = incompatReason(build, p)
    return map
  }, [category, build])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        className="glass-strong fixed inset-y-0 right-0 z-[61] flex w-full max-w-lg flex-col shadow-2xl shadow-black/60"
      >
        <header className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className={cn('grid h-11 w-11 place-items-center rounded-xl', accent.bgSoft)}
              style={{ color: accent.hex }}
            >
              <CategoryIcon category={category} className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold">Choose a {meta.label}</h3>
              <p className="text-xs text-fg-muted">
                {partsByCategory[category].length} options · {meta.blurb}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-fg-muted transition-colors hover:text-fg"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex items-center gap-1.5 border-b border-white/8 px-5 py-3">
          <span className="mr-1 text-xs text-fg-dim">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                sort === s.id ? 'bg-white/12 text-fg' : 'text-fg-muted hover:bg-white/5',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto p-5">
          {parts.map((p) => (
            <PartCard
              key={p.id}
              part={p}
              selected={p.id === selectedId}
              incompatible={incompat[p.id]}
              onSelect={() => {
                selectPart(p)
                onClose()
              }}
            />
          ))}
        </div>
      </motion.aside>
    </>
  )
}
