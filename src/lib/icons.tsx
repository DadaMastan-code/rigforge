import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  Monitor,
  Fan,
  HardDrive,
  Power,
  Box,
  type LucideIcon,
} from 'lucide-react'
import type { Category } from '@/data/types'
import type { Accent } from '@/data/catalog'

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  cpu: Cpu,
  motherboard: CircuitBoard,
  memory: MemoryStick,
  gpu: Monitor,
  cooler: Fan,
  storage: HardDrive,
  psu: Power,
  case: Box,
}

export interface AccentTokens {
  text: string
  bgSoft: string
  border: string
  dot: string
  hex: string
  rgb: string
}

/**
 * Literal class strings (not interpolated) so Tailwind's scanner emits them.
 * `hex`/`rgb` drive inline glow + gradient styles that can't be class-based.
 */
export const ACCENT: Record<Accent, AccentTokens> = {
  cyan: { text: 'text-cyan', bgSoft: 'bg-cyan/10', border: 'border-cyan/40', dot: 'bg-cyan', hex: '#22d3ee', rgb: '34,211,238' },
  violet: { text: 'text-violet', bgSoft: 'bg-violet/10', border: 'border-violet/40', dot: 'bg-violet', hex: '#a855f7', rgb: '168,85,247' },
  forge: { text: 'text-forge', bgSoft: 'bg-forge/10', border: 'border-forge/40', dot: 'bg-forge', hex: '#ff7a18', rgb: '255,122,24' },
  ok: { text: 'text-ok', bgSoft: 'bg-ok/10', border: 'border-ok/40', dot: 'bg-ok', hex: '#34d399', rgb: '52,211,153' },
}

export function CategoryIcon({
  category,
  className,
  strokeWidth = 1.6,
}: {
  category: Category
  className?: string
  strokeWidth?: number
}) {
  const Icon = CATEGORY_ICON[category]
  return <Icon className={className} strokeWidth={strokeWidth} />
}

/** Inline glow shadow for a given accent rgb triple. */
export const glow = (rgb: string, strength = 0.5, spread = 24): string =>
  `0 0 ${spread}px -2px rgba(${rgb}, ${strength}), 0 0 0 1px rgba(${rgb}, ${strength * 0.7})`
