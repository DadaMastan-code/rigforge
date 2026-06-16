import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useMarketStore } from '@/state/useMarketStore'
import { getPart } from '@/data/catalog'
import type { QuoteMap } from '@/engine/market'
import { signedPct } from '@/lib/format'
import { useCurrency, formatUsdIn, type Currency } from '@/state/useCurrencyStore'

const FEATURED = [
  'gpu-rtx5090',
  'cpu-r7-9800x3d',
  'gpu-rtx4090',
  'cpu-i9-14900k',
  'gpu-rx7900xtx',
  'cpu-cu9-285k',
  'gpu-rtx5070ti',
  'cpu-r9-9950x',
  'gpu-rtx4080s',
  'cpu-r7-7800x3d',
  'gpu-rx7800xt',
  'gpu-rtx4070s',
]

function Row({ quotes, cur }: { quotes: QuoteMap; cur: Currency }) {
  return (
    <div className="flex shrink-0 items-center gap-7 px-3.5">
      {FEATURED.map((id) => {
        const part = getPart(id)
        if (!part) return null
        const q = quotes[id]
        const up = (q?.changePct ?? 0) >= 0
        return (
          <div key={id} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span className="font-mono text-[11px] uppercase tracking-wide text-fg-dim">
              {part.brand}
            </span>
            <span className="text-sm text-fg-muted">{part.name}</span>
            <span className="font-mono text-sm font-semibold text-fg">
              {formatUsdIn(q?.price ?? part.price, cur)}
            </span>
            <span
              className={`flex items-center gap-0.5 font-mono text-[11px] ${
                up ? 'text-ok' : 'text-danger'
              }`}
            >
              {up ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {signedPct(q?.changePct ?? 0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Auto-scrolling live marketplace ribbon. Pauses on hover. */
export function TickerBar() {
  const quotes = useMarketStore((s) => s.quotes)
  const cur = useCurrency()
  return (
    <div
      id="ticker"
      className="marquee-pause relative overflow-hidden border-y border-ink/5 bg-ink-900/40 py-2.5 backdrop-blur"
    >
      <div className="flex w-max animate-marquee">
        <Row quotes={quotes} cur={cur} />
        <Row quotes={quotes} cur={cur} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink-950 to-transparent" />
    </div>
  )
}
