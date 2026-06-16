import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const AssemblyCanvas = lazy(() =>
  import('@/components/three/AssemblyCanvas').then((m) => ({ default: m.AssemblyCanvas })),
)

export function AssemblySection() {
  const ref = useRef<HTMLDivElement>(null)
  const [token, setToken] = useState(0)
  const playedRef = useRef(false)

  // Kick off the assembly the first time the section scrolls into view.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !playedRef.current) {
            playedRef.current = true
            setToken(Date.now())
          }
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="assembly" ref={ref} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16">
      <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="kicker">Assembly</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Watch it <span className="italic font-medium text-accent">come together</span>
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-fg-muted">
            Motherboard, processor, cooler, memory, graphics, storage and power — every part
            eases into its place. A live preview of the build taking shape.
          </p>
          <button
            onClick={() => setToken(Date.now())}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-ink/5"
          >
            <RotateCcw className="h-4 w-4" /> Replay assembly
          </button>
        </div>

        <div className="relative h-[360px] overflow-hidden rounded-2xl border border-ink/10 bg-ink-850 sm:h-[440px]">
          <div className="pointer-events-none absolute inset-4 rounded-xl border border-ink/8" />
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="grid h-full place-items-center text-sm text-fg-dim">
                  Loading preview…
                </div>
              }
            >
              <AssemblyCanvas playToken={token} className="h-full w-full" />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  )
}
