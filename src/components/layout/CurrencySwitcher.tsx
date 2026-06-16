import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { CURRENCIES, useCurrencyStore, useCurrency } from '@/state/useCurrencyStore'
import { cn } from '@/lib/cn'

export function CurrencySwitcher() {
  const code = useCurrencyStore((s) => s.code)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)
  const cur = useCurrency()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-medium text-fg transition-colors hover:bg-ink/5"
        aria-label="Change currency"
      >
        <span className="font-mono">{cur.symbol}</span>
        <span className="hidden sm:inline">{cur.code}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-fg-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[70]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 z-[71] mt-2 w-52 overflow-hidden rounded-xl border border-ink/12 bg-ink-850 p-1 shadow-lg"
            >
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-ink/5',
                    c.code === code ? 'text-fg' : 'text-fg-muted',
                  )}
                >
                  <span className="w-5 text-center font-mono text-fg">{c.symbol}</span>
                  <span className="font-medium">{c.code}</span>
                  <span className="truncate text-xs text-fg-dim">{c.name}</span>
                  {c.code === code && <Check className="ml-auto h-4 w-4 text-accent" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
