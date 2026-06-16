import type { Build } from '@/data/types'
import { getPart } from '@/data/catalog'
import gamingImg from '@/assets/builds/gaming.jpg'
import editingImg from '@/assets/builds/editing.jpg'
import workstationImg from '@/assets/builds/workstation.jpg'
import officeImg from '@/assets/builds/budget.jpg'

export interface BuildCategory {
  id: string
  name: string
  tagline: string
  blurb: string
  image: string
  /** Commons source file title (for attribution). */
  credit: string
  /** Catalog part ids that make up the curated build. */
  ids: string[]
}

export const BUILD_CATEGORIES: BuildCategory[] = [
  {
    id: 'gaming',
    name: 'Gaming',
    tagline: 'High-refresh 1440p / 4K',
    blurb: 'A 3D V-Cache CPU paired with a fast GPU for maximum frames in modern titles.',
    image: gamingImg,
    credit: 'Astaroth- Inside the Finished Build.jpg',
    ids: ['cpu-r7-9800x3d', 'mb-tomahawk-b650', 'mem-veng-32-6000', 'gpu-rtx5070ti', 'cool-lf3-360', 'ssd-990pro-2tb', 'psu-rm850x', 'case-h7flow'],
  },
  {
    id: 'editing',
    name: 'Video Editing',
    tagline: 'Timeline-crushing creator rig',
    blurb: 'Many cores, 64GB of memory and PCIe 5.0 storage for 4K/8K edits and fast exports.',
    image: editingImg,
    credit: 'HTPC Innards.jpg',
    ids: ['cpu-i9-14900k', 'mb-z790-a', 'mem-ripjaws-64-6000', 'gpu-rtx4070s', 'cool-lf3-360', 'ssd-t700-2tb', 'psu-rm850x', 'case-4000d'],
  },
  {
    id: 'workstation',
    name: 'Workstation / AI',
    tagline: 'No-compromise compute',
    blurb: '16 cores, 64GB and a 32GB-VRAM flagship GPU for 3D, simulation and local AI.',
    image: workstationImg,
    credit: 'Mac Pro (2010).jpg',
    ids: ['cpu-r9-9950x', 'mb-x670e-master', 'mem-dom-64-6000', 'gpu-rtx5090', 'cool-lf3-360', 'ssd-990pro-4tb', 'psu-hx1200', 'case-o11evo'],
  },
  {
    id: 'office',
    name: 'Office / Everyday',
    tagline: 'Silent · integrated graphics',
    blurb: 'A tidy, quiet build for work, web and media — no discrete GPU required.',
    image: officeImg,
    credit: 'Desktop Pc S At Mozilla Taiwan Office (72739533).jpeg',
    ids: ['cpu-r5-7600', 'mb-tuf-b650', 'mem-fury-16-5600', 'cool-pa120', 'ssd-sn850x-1tb', 'psu-bq-650', 'case-4000d'],
  },
]

export function categoryBuild(cat: BuildCategory): Build {
  const b: Build = {}
  for (const id of cat.ids) {
    const p = getPart(id)
    if (p) b[p.category] = p
  }
  return b
}

export function categoryTotalUsd(cat: BuildCategory): number {
  let t = 0
  for (const id of cat.ids) {
    const p = getPart(id)
    if (p) t += p.price
  }
  return t
}

export interface BuildCredit {
  name: string
  url: string
}

export const BUILD_CREDITS: BuildCredit[] = BUILD_CATEGORIES.map((c) => ({
  name: c.name,
  url: `https://commons.wikimedia.org/wiki/File:${c.credit.replace(/ /g, '_')}`,
}))
