import { motion } from 'framer-motion'
import { Check, Plus, Star, AlertTriangle } from 'lucide-react'
import type { Part } from '@/data/types'
import { CATEGORY_META } from '@/data/catalog'
import { ACCENT } from '@/lib/icons'
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
  const chips = specChips(part).slice(0, 3)

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'group relative flex w-full items-center gap-4 rounded-2xl border bg-ink-850/70 p-3 text-left transition-colors',
        selected ? accent.border : 'border-ink/8 hover:border-ink/16',
      )}
      style={selected ? { boxShadow: `0 0 0 1.5px ${accent.hex}` } : undefined}
    >
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-900">
        <img
          src={CATEGORY_IMAGE[part.category]}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
              {part.brand}
            </div>
            <div className="truncate font-display text-[15px] font-semibold leading-tight text-fg">
              {part.name}
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-fg-muted">
            <Star className="h-3 w-3 fill-warn text-warn" />
            {part.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c.label}
              className="rounded-md border border-ink/6 bg-ink/[0.03] px-1.5 py-0.5 text-[10px] text-fg-muted"
            >
              <span className="text-fg-dim">{c.label}</span>{' '}
              <span className="font-medium text-fg">{c.value}</span>
            </span>
          ))}
          {incompatible && (
            <span
              className="inline-flex items-center gap-1 rounded-md border border-danger/40 bg-danger/10 px-1.5 py-0.5 text-[10px] font-semibold text-danger"
              title={incompatible}
            >
              <AlertTriangle className="h-3 w-3" />
              Incompatible
            </span>
          )}
        </div>
      </div>

      {/* Price + action */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <PriceTag id={part.id} basePrice={part.price} size="md" />
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
            selected ? 'bg-ink/10 text-fg' : 'bg-accent text-ink-950',
          )}
        >
          {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {selected ? 'Selected' : 'Add'}
        </span>
      </div>

      <span
        className={cn(
          'absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full opacity-0 transition-opacity',
          selected && 'opacity-100',
        )}
        style={{ background: accent.hex }}
      />
    </motion.button>
  )
}
