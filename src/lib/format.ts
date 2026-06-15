export const usd = (n: number): string => `$${Math.round(n).toLocaleString('en-US')}`

export const usdCents = (n: number): string =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const signedPct = (n: number, digits = 1): string =>
  `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`

export const capacityLabel = (gb: number): string => {
  if (gb >= 1000) {
    const tb = gb / 1000
    return `${Number.isInteger(tb) ? tb : tb.toFixed(1)}TB`
  }
  return `${gb}GB`
}
