import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Activity, Boxes } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { CATALOG } from '@/data/catalog'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { PriceTag } from '@/components/ui/PriceTag'

const RigCanvas = lazy(() =>
  import('@/components/three/RigCanvas').then((m) => ({ default: m.RigCanvas })),
)

const scrollTo = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const rise = {
  hidden: { y: 22, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
}

export function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-7xl px-5 pt-32 pb-12 md:pt-40">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={rise}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-fg-muted">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-cyan" />
              Realtime prices · Live compatibility · 3D preview
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-5 font-display text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl"
          >
            Forge your
            <br />
            <span className="text-gradient">perfect rig.</span>
          </motion.h1>

          <motion.p variants={rise} className="mt-5 max-w-xl text-lg text-fg-muted">
            Pick parts, watch prices move in real time, and let RigForge verify every
            socket, clearance and watt — visualized in living 3D as you build.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={scrollTo('builder')}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet px-5 py-3 font-semibold text-ink-950 transition-transform hover:scale-[1.03]"
            >
              Start building
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollTo('ticker')}
              className="rounded-xl border border-white/12 bg-white/5 px-5 py-3 font-semibold text-fg transition-colors hover:bg-white/10"
            >
              View live market
            </button>
          </motion.div>

          <motion.div variants={rise} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {(
              [
                { icon: Boxes, label: `${CATALOG.length} components` },
                { icon: Activity, label: 'Prices update live' },
                { icon: ShieldCheck, label: 'Compatibility verified' },
              ] as const
            ).map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-fg-muted">
                <Icon className="h-4 w-4 text-cyan" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="relative h-[360px] sm:h-[460px] lg:h-[540px]"
        >
          {/* conic glow ring */}
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl ring-conic animate-spin-slow" />

          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="grid h-full place-items-center text-sm text-fg-dim">
                  Booting visualizer…
                </div>
              }
            >
              <RigCanvas className="h-full w-full" />
            </Suspense>
          </ErrorBoundary>

          {/* floating live-price chip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="glass-strong absolute bottom-4 left-2 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl shadow-black/40 sm:left-6"
          >
            <div className="text-left">
              <div className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
                RTX 5090 · live
              </div>
              <PriceTag id="gpu-rtx5090" basePrice={1999} size="lg" showStock />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
