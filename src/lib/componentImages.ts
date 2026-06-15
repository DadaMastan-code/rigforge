import type { Category } from '@/data/types'
import cpu from '@/assets/components/cpu.jpg'
import gpu from '@/assets/components/gpu.jpg'
import motherboard from '@/assets/components/motherboard.jpg'
import memory from '@/assets/components/memory.jpg'
import cooler from '@/assets/components/cooler.jpg'
import storage from '@/assets/components/storage.jpg'
import psu from '@/assets/components/psu.jpg'
import pcCase from '@/assets/components/case.jpg'
import attributions from '@/assets/components/ATTRIBUTIONS.json'

/** Category → bundled CC-licensed product photo (Vite hashes + base-rewrites). */
export const CATEGORY_IMAGE: Record<Category, string> = {
  cpu,
  gpu,
  motherboard,
  memory,
  cooler,
  storage,
  psu,
  case: pcCase,
}

export interface ImageCredit {
  category: Category
  author: string
  license: string
  source: string
}

type AttrEntry = { file: string; author: string; license: string; source: string }

export const IMAGE_CREDITS: ImageCredit[] = (
  Object.entries(attributions) as [Category, AttrEntry][]
).map(([category, v]) => ({
  category,
  author: v.author,
  license: v.license,
  source: v.source,
}))
