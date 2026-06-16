import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { useQuote } from '@/state/useMarketStore'
import { AnimatedNumber } from './AnimatedNumber'
import { signedPct } from '@/lib/format'
import { useCurrency, formatAmount } from '@/state/useCurrencyStore'
import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZE: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
}

interface Props {
  id: string
  basePrice: number
  size?: Size
  showChange?: boolean
  showStock?: boolean
}

/** Live price with directional flash + percent-vs-MSRP indicator. */
export function PriceTag({
  id,
  basePrice,
  size = 'md',
  showChange = true,
  showStock = false,
}: Props) {
  const quote = useQuote(id)
  const cur = useCurrency()
  const price = quote?.price ?? basePrice
  const trend = quote?.trend ?? 'flat'
  const changePct = quote?.changePct ?? 0
  const stock = quote?.stock

  const up = trend === 'up'
  const down = trend === 'down'

  return (
    <div className="flex flex-col items-end leading-tight">
      <div className="relative inline-flex items-baseline">
        <span
          key={price}
          aria-hidden
          className="absolute -inset-x-1.5 -inset-y-1 rounded-md"
          style={{
            animation:
              trend !== 'flat'
                ? `${up ? 'flash-up' : 'flash-down'} 0.7s ease-out`
                : undefined,
          }}
        />
        <AnimatedNumber
          value={price * cur.rate}
          format={(n) => formatAmount(n, cur)}
          className={cn('relative font-mono font-semibold tabular-nums text-fg', SIZE[size])}
        />
      </div>

      {showChange && (
        <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px]">
          {up ? (
            <ArrowUpRight className="h-3 w-3 text-ok" />
          ) : down ? (
            <ArrowDownRight className="h-3 w-3 text-danger" />
          ) : (
            <Minus className="h-3 w-3 text-fg-dim" />
          )}
          <span className={up ? 'text-ok' : down ? 'text-danger' : 'text-fg-dim'}>
            {signedPct(changePct)}
          </span>
          {showStock && stock != null && (
            <span className="text-fg-dim">
              · {stock > 0 ? `${stock} in stock` : 'backorder'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
