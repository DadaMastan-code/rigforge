import { useBuildStore } from '@/state/useBuildStore'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import type { WattageStatus } from '@/engine/wattage'

const STATUS_COLOR: Record<WattageStatus, string> = {
  ok: '#5d7a4d',
  warn: '#b1812c',
  danger: '#a8392a',
  none: '#be4626',
}

const STATUS_LABEL: Record<WattageStatus, string> = {
  ok: 'Healthy headroom',
  warn: 'Running hot',
  danger: 'Underpowered',
  none: 'Estimate',
}

const R = 80
const C = 2 * Math.PI * R
const ARC = 0.75 * C // 270° sweep

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

export function WattageGauge() {
  const w = useBuildStore((s) => s.wattage)
  const denom = w.psuW ?? w.recommendedW
  const frac = clamp(w.estimatedW / denom, 0, 1)
  const color = STATUS_COLOR[w.status]

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-fg">Power Draw</h3>
        <span
          className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
          style={{ color, backgroundColor: `${color}1f` }}
        >
          {STATUS_LABEL[w.status]}
        </span>
      </div>

      <div className="relative mx-auto h-[150px] w-[200px]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <g transform="rotate(135 100 100)">
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="rgba(34,28,20,0.10)"
              strokeWidth="13"
              strokeDasharray={`${ARC} ${C - ARC}`}
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={color}
              strokeWidth="13"
              strokeDasharray={`${ARC} ${C - ARC}`}
              strokeDashoffset={ARC * (1 - frac)}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1), stroke 0.4s',
              }}
            />
          </g>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
          <div className="flex items-baseline gap-1">
            <AnimatedNumber
              value={w.estimatedW}
              className="font-mono text-4xl font-bold tabular-nums text-fg"
            />
            <span className="text-lg text-fg-muted">W</span>
          </div>
          <div className="mt-0.5 text-xs text-fg-dim">
            {w.psuW ? `of ${w.psuW}W supply` : `est. peak`}
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="text-fg-muted">
          Recommended{' '}
          <span className="font-mono font-semibold text-fg">{w.recommendedW}W</span>
        </span>
        {w.loadFraction != null && (
          <span className="text-fg-muted">
            Load{' '}
            <span className="font-mono font-semibold" style={{ color }}>
              {Math.round(w.loadFraction * 100)}%
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
