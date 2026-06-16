import { create } from 'zustand'

/**
 * Display currency. All prices are stored internally in USD (catalog MSRP +
 * market simulation); only presentation converts. Rates are static, approximate
 * reference values — consistent with the simulated pricing model.
 */
export interface Currency {
  code: string
  symbol: string
  /** USD → currency multiplier. */
  rate: number
  locale: string
  name: string
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, locale: 'en-US', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-DE', name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB', name: 'British Pound' },
  { code: 'INR', symbol: '₹', rate: 83, locale: 'en-IN', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', rate: 150, locale: 'ja-JP', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', rate: 1.36, locale: 'en-CA', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', rate: 1.52, locale: 'en-AU', name: 'Australian Dollar' },
]

const byCode = new Map(CURRENCIES.map((c) => [c.code, c]))
const KEY = 'rigforge.currency'

function initialCode(): string {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved && byCode.has(saved)) return saved
  } catch {
    /* unavailable */
  }
  return 'USD'
}

interface CurrencyStore {
  code: string
  setCurrency: (code: string) => void
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  code: initialCode(),
  setCurrency: (code) => {
    try {
      localStorage.setItem(KEY, code)
    } catch {
      /* ignore */
    }
    set({ code })
  },
}))

/** Subscribe to the active currency (re-renders on change). */
export const useCurrency = (): Currency =>
  useCurrencyStore((s) => byCode.get(s.code) ?? CURRENCIES[0])

/** Format an amount that is already in the target currency. */
export function formatAmount(amount: number, c: Currency): string {
  return `${c.symbol}${Math.round(amount).toLocaleString(c.locale)}`
}

/** Convert a USD amount into the target currency and format it. */
export function formatUsdIn(usdAmount: number, c: Currency): string {
  return formatAmount(usdAmount * c.rate, c)
}
