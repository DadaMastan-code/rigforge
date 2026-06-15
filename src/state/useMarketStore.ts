import { create } from 'zustand'
import { CATALOG } from '@/data/catalog'
import {
  createInitialQuotes,
  stepQuotes,
  type Quote,
  type QuoteMap,
} from '@/engine/market'
import { useBuildStore } from './useBuildStore'

const TICK_MS = 2000

interface MarketStore {
  quotes: QuoteMap
  running: boolean
  start: () => void
  stop: () => void
}

let timer: ReturnType<typeof setInterval> | undefined

export const useMarketStore = create<MarketStore>((set, get) => ({
  quotes: createInitialQuotes(CATALOG),
  running: false,

  start: () => {
    if (get().running) return
    set({ running: true })
    timer = setInterval(
      () => set((s) => ({ quotes: stepQuotes(s.quotes) })),
      TICK_MS,
    )
  },

  stop: () => {
    if (timer) clearInterval(timer)
    timer = undefined
    set({ running: false })
  },
}))

/** Subscribe to a single part's live quote (re-renders only when it changes). */
export const useQuote = (id: string): Quote | undefined =>
  useMarketStore((s) => s.quotes[id])

/** Live total of the current build using market prices (MSRP fallback). */
export function useLiveTotal(): number {
  const build = useBuildStore((s) => s.build)
  const quotes = useMarketStore((s) => s.quotes)
  let total = 0
  for (const p of Object.values(build)) {
    if (!p) continue
    total += quotes[p.id]?.price ?? p.price
  }
  return total
}
