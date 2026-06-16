import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useBuildStore } from '@/state/useBuildStore'
import { useCurrency, formatUsdIn } from '@/state/useCurrencyStore'
import {
  BUILD_CATEGORIES,
  categoryBuild,
  categoryTotalUsd,
  type BuildCategory,
} from '@/lib/buildCategories'

function CategoryCard({ cat }: { cat: BuildCategory }) {
  const setBuild = useBuildStore((s) => s.setBuild)
  const cur = useCurrency()
  const build = categoryBuild(cat)
  const cpu = build.cpu?.name ?? '—'
  const gpu = build.gpu?.name ?? 'Integrated graphics'

  const onBuild = () => {
    setBuild(build)
    document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.button
      onClick={onBuild}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-ink-850 text-left"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={cat.image}
          alt={`${cat.name} PC build`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
            {cat.tagline}
          </div>
          <h3 className="font-display text-xl font-semibold text-white">{cat.name}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-relaxed text-fg-muted">{cat.blurb}</p>

        <div className="mt-3 space-y-1 font-mono text-[11px] text-fg-dim">
          <div className="truncate">
            <span className="text-fg-muted">CPU</span> &nbsp;{cpu}
          </div>
          <div className="truncate">
            <span className="text-fg-muted">GPU</span> &nbsp;{gpu}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <div className="kicker">From</div>
            <div className="font-display text-xl font-semibold tabular-nums text-fg">
              {formatUsdIn(categoryTotalUsd(cat), cur)}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-fg px-3.5 py-2 text-sm font-semibold text-ink-950 transition-colors group-hover:bg-accent">
            Build this
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.button>
  )
}

export function BuildCategories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16">
      <div className="mb-8">
        <span className="kicker">Curated builds</span>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Build for <span className="italic font-medium text-accent">what you do</span>
        </h2>
        <p className="mt-2 max-w-xl text-fg-muted">
          Start from a proven, compatibility-checked configuration — then open it in the builder
          and make it yours.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {BUILD_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  )
}
