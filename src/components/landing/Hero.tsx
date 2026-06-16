import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CATALOG } from '@/data/catalog'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { PriceTag } from '@/components/ui/PriceTag'
import { EASE } from '@/lib/motion'

const RigCanvas = lazy(() =>
  import('@/components/three/RigCanvas').then((m) => ({ default: m.RigCanvas })),
)

const scrollTo = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }
const rise = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
}

const STATS = [
  { v: String(CATALOG.length), l: 'Components in stock' },
  { v: 'Live', l: 'Prices & availability' },
  { v: '3D', l: 'Build preview' },
]

export function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-7xl px-5 pt-32 pb-16 md:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={rise} className="flex items-center gap-4">
            <span className="kicker whitespace-nowrap">Realtime parts marketplace</span>
            <span className="rule flex-1" />
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-6 font-display text-[2.9rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
          >
            Forge your{' '}
            <span className="italic font-medium text-accent">perfect</span> rig.
          </motion.h1>

          <motion.p variants={rise} className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Choose every component and watch prices move in real time while RigForge
            verifies each socket, clearance and watt — rendered in living 3D as you build.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-6">
            <button
              onClick={scrollTo('builder')}
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-base font-medium text-ink-950 transition-colors hover:bg-accent"
            >
              Start building
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollTo('ticker')}
              className="group inline-flex items-center gap-1.5 text-base font-medium text-fg underline-offset-4 hover:underline"
            >
              View live market
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div variants={rise} className="mt-12">
            <span className="rule block" />
            <div className="mt-5 flex flex-wrap gap-x-12 gap-y-4">
              {STATS.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-semibold tabular-nums text-fg">
                    {s.v}
                  </div>
                  <div className="kicker mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="relative h-[360px] sm:h-[460px] lg:h-[540px]"
        >
          <div className="absolute inset-4 rounded-2xl border border-ink/10" />

          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="grid h-full place-items-center text-sm text-fg-dim">
                  Loading preview…
                </div>
              }
            >
              <RigCanvas demo className="h-full w-full" />
            </Suspense>
          </ErrorBoundary>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute bottom-3 left-3 rounded-xl border border-ink/12 bg-ink-850 px-4 py-3 shadow-sm sm:left-6"
          >
            <div className="kicker">RTX 5090 · live</div>
            <div className="mt-1">
              <PriceTag id="gpu-rtx5090" basePrice={1999} size="lg" showStock />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
