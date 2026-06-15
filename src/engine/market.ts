import type { Part } from '@/data/types'

/**
 * Client-side "realtime" market simulation.
 *
 * No backend: each part gets a live quote whose price performs a bounded,
 * mean-reverting random walk around its MSRP, with fluctuating stock and the
 * occasional flash deal. `stepQuotes` nudges a random subset each tick and
 * preserves object identity for untouched quotes so React only re-renders the
 * cards that actually changed.
 *
 * Swapping in a real pricing API later means replacing `stepQuotes` with a
 * fetch + reconcile — the Quote shape and store contract stay identical.
 */

export type Trend = 'up' | 'down' | 'flat'

export interface Quote {
  price: number
  basePrice: number
  prevPrice: number
  /** Percentage delta vs MSRP. */
  changePct: number
  trend: Trend
  stock: number
  /** True when the live price dips meaningfully below MSRP. */
  hot: boolean
}

export type QuoteMap = Record<string, Quote>

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n))

export function createInitialQuotes(parts: Part[]): QuoteMap {
  const quotes: QuoteMap = {}
  for (const p of parts) {
    quotes[p.id] = {
      price: p.price,
      basePrice: p.price,
      prevPrice: p.price,
      changePct: 0,
      trend: 'flat',
      stock: 4 + Math.floor(Math.random() * 38),
      hot: false,
    }
  }
  return quotes
}

/** How many parts get re-priced per tick. */
const PARTS_PER_TICK = 11

export function stepQuotes(prev: QuoteMap): QuoteMap {
  const ids = Object.keys(prev)
  if (ids.length === 0) return prev

  const next: QuoteMap = { ...prev }

  for (let i = 0; i < PARTS_PER_TICK; i++) {
    const id = ids[Math.floor(Math.random() * ids.length)]
    const q = next[id]

    // Mean-reverting walk: pull toward MSRP, add bounded noise.
    const reversion = (q.basePrice - q.price) * 0.06
    const noise = q.basePrice * (Math.random() - 0.5) * 0.022
    const raw = q.price + reversion + noise
    const price = Math.round(clamp(raw, q.basePrice * 0.82, q.basePrice * 1.13))

    // Stock drifts: occasional sale, occasional restock.
    const roll = Math.random()
    let stock = q.stock
    if (roll < 0.45) stock = Math.max(0, stock - 1)
    else if (roll > 0.82) stock = Math.min(60, stock + 1 + Math.floor(Math.random() * 6))

    const changePct = ((price - q.basePrice) / q.basePrice) * 100
    const trend: Trend =
      price > q.price + 0.5 ? 'up' : price < q.price - 0.5 ? 'down' : 'flat'

    next[id] = {
      ...q,
      prevPrice: q.price,
      price,
      changePct,
      trend,
      stock,
      hot: changePct <= -5,
    }
  }

  return next
}
