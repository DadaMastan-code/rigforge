import { motion } from 'framer-motion'
import { Check, Plus, Star, AlertTriangle } from 'lucide-react'
import type { Part } from '@/data/types'
import { CATEGORY_META } from '@/data/catalog'
import { ACCENT, CategoryIcon } from '@/lib/icons'
import { CATEGORY_IMAGE } from '@/lib/componentImages'
import { specChips } from '@/lib/specs'
import { PriceTag } from '@/components/ui/PriceTag'
import { cn } from '@/lib/cn'

interface Props {
  part: Part
  selected: boolean
  incompatible?: string | null
  onSelect: () => void
}

export function PartCard({ part, selected, incompatible, onSelect }: Props) {
  const meta = CATEGORY_META[part.category]
  const accent = ACCENT[meta.accent]
  const chips = specChips(part).slice(0, 4)

  return (
    <motion.button
      layout
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl border bg-ink-850/70 text-left transition-colors',
        selected ? accent.border : 'border-white/8 hover:border-white/16',
      )}
      style={selected ? { boxShadow: `0 0 0 1px ${accent.hex}, 0 0 28px -8px ${accent.hex}` } : undefined}
    >
      {/* Photo banner */}
      <div className="relative h-32 w-full overflow-hidden bg-ink-900">
        <img
          src={CATEGORY_IMAGE[part.category]}
          alt={part.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/25 to-transparent" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)` }}
        />

        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-ink-950/70 px-2 py-1 text-[10px] font-semibold backdrop-blur"
          style={{ color: accent.hex }}
        >
          <CategoryIcon category={part.category} className="h-3 w-3" />
          {meta.label}
        </span>

        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-ink-950/70 px-1.5 py-1 text-[11px] text-fg-muted backdrop-blur">
          <Star className="h-3 w-3 fill-warn text-warn" />
          {part.rating.toFixed(1)}
        </span>

        {incompatible && (
          <div
            className="absolute bottom-2 right-3 inline-flex items-center gap-1 rounded-md border border-danger/40 bg-danger/25 px-2 py-1 text-[10px] font-semibold text-danger backdrop-blur"
            title={incompatible}
          >
            <AlertTriangle className="h-3 w-3" />
            Incompatible
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
          {part.brand}
        </div>
        <div className="font-display text-[15px] font-semibold leading-tight text-fg">
          {part.name}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c.label}
              className="rounded-md border border-white/6 bg-white/[0.03] px-2 py-1 text-[11px] text-fg-muted"
            >
              <span className="text-fg-dim">{c.label}</span>{' '}
              <span className="font-medium text-fg">{c.value}</span>
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <PriceTag id={part.id} basePrice={part.price} size="lg" showStock />
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
              selected ? 'bg-white/10 text-fg' : 'bg-gradient-to-r from-cyan to-violet text-ink-950',
            )}
          >
            {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {selected ? 'Selected' : 'Add'}
          </span>
        </div>
      </div>
    </motion.button>
  )
}
