import { motion } from 'framer-motion'
import { Cpu, Code } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { useMarketStore } from '@/state/useMarketStore'
import { useBuildStore } from '@/state/useBuildStore'
import { CurrencySwitcher } from './CurrencySwitcher'

const scrollTo = (id: string) => () => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Navbar() {
  const running = useMarketStore((s) => s.running)
  const partCount = useBuildStore((s) => s.partCount)

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <div className="glass-strong flex w-full items-center justify-between rounded-2xl border border-ink/10 px-4 py-2.5 shadow-sm">
          {/* Brand */}
          <button onClick={scrollTo('top')} className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-accent">
              <Cpu className="h-5 w-5 text-ink-950" strokeWidth={2.2} />
              <span className="absolute inset-0 rounded-xl ring-1 ring-ink/30" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Rig<span className="text-gradient">Forge</span>
            </span>
          </button>

          {/* Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {[
              ['Builds', 'categories'],
              ['Builder', 'builder'],
              ['Performance', 'performance'],
              ['Reviews', 'reviews'],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={scrollTo(id)}
                className="rounded-lg px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-ink/5 hover:text-fg"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 rounded-full border border-ink/8 bg-ink-900/60 px-3 py-1.5 sm:flex">
              <span className="relative flex h-2 w-2">
                {running && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-fg-muted">
                Live market
              </span>
            </div>

            <CurrencySwitcher />

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 w-9 place-items-center rounded-xl border border-ink/8 text-fg-muted transition-colors hover:text-fg sm:grid"
              aria-label="Source"
            >
              <Code className="h-4 w-4" />
            </a>

            <button
              onClick={scrollTo('builder')}
              className="relative overflow-hidden rounded-xl bg-fg px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-accent"
            >
              Start build
              {partCount > 0 && (
                <span className="ml-2 rounded-md bg-ink-950/25 px-1.5 py-0.5 font-mono text-xs">
                  {partCount}/8
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
