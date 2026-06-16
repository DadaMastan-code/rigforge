import { motion } from 'framer-motion'
import { Gauge, Cpu, Monitor } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { useBuildStore } from '@/state/useBuildStore'

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

function Bar({
  label,
  value,
  max,
  suffix,
  color,
}: {
  label: string
  value: number
  max: number
  suffix: string
  color: string
}) {
  const pct = clamp(value / max, 0, 1) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-fg-muted">{label}</span>
        <span className="font-mono font-semibold text-fg">
          {value}
          <span className="text-fg-dim">{suffix}</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/6">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>
    </div>
  )
}

export function PerformancePanel() {
  const bench = useBuildStore((s) => s.bench)

  return (
    <div id="performance" className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-fg">
          <Gauge className="h-4 w-4 text-cyan" /> Performance
        </h3>
        {bench && (
          <span className="rounded-md bg-violet/15 px-2 py-0.5 text-[11px] font-semibold text-violet">
            {bench.tier} class
          </span>
        )}
      </div>

      {!bench ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-ink/8 bg-ink/[0.02] px-3 py-4 text-sm text-fg-muted">
          <div className="flex gap-1">
            <Cpu className="h-4 w-4 text-fg-dim" />
            <Monitor className="h-4 w-4 text-fg-dim" />
          </div>
          Add a CPU and GPU to estimate frame rates and spot bottlenecks.
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3.5">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-fg-dim">
              Avg FPS · AAA workload
            </div>
            <Bar label="1080p" value={bench.fps1080} max={240} suffix=" fps" color="#be4626" />
            <Bar label="1440p" value={bench.fps1440} max={240} suffix=" fps" color="#9a6b3f" />
            <Bar label="4K" value={bench.fps4k} max={240} suffix=" fps" color="#6b5d4a" />
          </div>

          <div className="mt-4 border-t border-ink/8 pt-4">
            <Bar
              label="Productivity index"
              value={bench.productivity}
              max={100}
              suffix=" / 100"
              color="#5d7a4d"
            />
          </div>

          {/* Bottleneck balance */}
          <div className="mt-4 border-t border-ink/8 pt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-fg-muted">Balance</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                style={
                  bench.bottleneck.component === 'balanced'
                    ? { color: '#5d7a4d', backgroundColor: '#5d7a4d1f' }
                    : { color: '#b1812c', backgroundColor: '#b1812c1f' }
                }
              >
                {bench.bottleneck.component === 'balanced'
                  ? 'Balanced'
                  : bench.bottleneck.component === 'cpu'
                    ? 'CPU-bound'
                    : 'GPU-bound'}
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-gradient-to-r from-cyan/40 via-ink/10 to-violet/40">
              <motion.div
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink-950 bg-fg shadow-lg"
                initial={false}
                animate={{
                  left: `${clamp(
                    bench.bottleneck.component === 'cpu'
                      ? 50 - bench.bottleneck.severityPct
                      : bench.bottleneck.component === 'gpu'
                        ? 50 + bench.bottleneck.severityPct
                        : 50,
                    6,
                    94,
                  )}%`,
                }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ marginLeft: -8 }}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-fg-dim">
              <span>CPU</span>
              <span>GPU</span>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-fg-muted">
              {bench.bottleneck.text}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
