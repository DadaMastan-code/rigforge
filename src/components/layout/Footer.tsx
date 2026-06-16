import { Cpu } from 'lucide-react'
import { IMAGE_CREDITS } from '@/lib/componentImages'
import { BUILD_CREDITS } from '@/lib/buildCategories'

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-5 pb-10 pt-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan to-violet">
              <Cpu className="h-4 w-4 text-ink-950" strokeWidth={2.2} />
            </span>
            <span className="font-display font-semibold">
              Rig<span className="text-gradient">Forge</span>
            </span>
          </div>

          <p className="max-w-md text-xs leading-relaxed text-fg-dim">
            Prices and stock are simulated in real time for demonstration. Compatibility
            checks are heuristic — always verify specs with the manufacturer before buying.
          </p>

          <div className="font-mono text-[11px] text-fg-muted">
            React · Three.js · Framer Motion
          </div>
        </div>

        <details className="mt-5 border-t border-ink/8 pt-3">
          <summary className="cursor-pointer text-xs text-fg-muted transition-colors hover:text-fg">
            Image credits (Wikimedia Commons)
          </summary>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-fg-dim">
            {IMAGE_CREDITS.map((c) => (
              <a
                key={c.category}
                href={c.source}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-fg"
              >
                <span className="capitalize">{c.category}</span>: {c.author} · {c.license}
              </a>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-fg-dim">
            <span className="text-fg-muted">Build photos:</span>
            {BUILD_CREDITS.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-fg"
              >
                {c.name}
              </a>
            ))}
          </div>
        </details>
      </div>
    </footer>
  )
}
