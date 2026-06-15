/**
 * RigForge domain model.
 *
 * Every part shares a small base; each category extends it with the typed
 * fields the compatibility / wattage / benchmark engines actually consume.
 * Display spec chips are derived from these fields in `lib/specs.ts` rather
 * than hand-written per part.
 */

export type Category =
  | 'cpu'
  | 'motherboard'
  | 'cooler'
  | 'memory'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'case'

export type Socket = 'AM5' | 'AM4' | 'LGA1700' | 'LGA1851'
export type MemoryType = 'DDR4' | 'DDR5'
export type FormFactor = 'E-ATX' | 'ATX' | 'Micro-ATX' | 'Mini-ITX'
export type StorageKind = 'NVMe SSD' | 'SATA SSD' | 'HDD'
export type CoolerType = 'Air' | 'Liquid AIO'
export type Efficiency =
  | '80+ Bronze'
  | '80+ Gold'
  | '80+ Platinum'
  | '80+ Titanium'

export interface BasePart {
  id: string
  category: Category
  brand: string
  name: string
  /** Base MSRP in USD. Live price comes from the market simulation. */
  price: number
  /** Power contribution in watts (0 for PSU). */
  tdp: number
  releaseYear: number
  /** Editorial score 0–5. */
  rating: number
}

export interface CPU extends BasePart {
  category: 'cpu'
  socket: Socket
  cores: number
  threads: number
  baseClock: number
  boostClock: number
  memoryType: MemoryType
  igpu: boolean
  /** Relative performance scores, 0–100. */
  gamingScore: number
  productivityScore: number
}

export interface GPU extends BasePart {
  category: 'gpu'
  vram: number
  lengthMm: number
  recommendedPsu: number
  powerConnector: string
  /** Relative raster gaming score, 0–115 (drives FPS estimates). */
  gamingScore: number
  rayTracing: boolean
}

export interface Motherboard extends BasePart {
  category: 'motherboard'
  socket: Socket
  chipset: string
  formFactor: FormFactor
  memoryType: MemoryType
  memorySlots: number
  maxMemoryGb: number
  maxMemorySpeed: number
  m2Slots: number
  wifi: boolean
}

export interface Memory extends BasePart {
  category: 'memory'
  type: MemoryType
  capacityGb: number
  modules: number
  speedMhz: number
  casLatency: number
  rgb: boolean
}

export interface Storage extends BasePart {
  category: 'storage'
  kind: StorageKind
  capacityGb: number
  interface: string
  readMBps: number
  usesM2: boolean
}

export interface PSU extends BasePart {
  category: 'psu'
  wattage: number
  efficiency: Efficiency
  modular: 'Full' | 'Semi' | 'No'
  formFactor: 'ATX' | 'SFX'
}

export interface Case extends BasePart {
  category: 'case'
  supportedFormFactors: FormFactor[]
  maxGpuLengthMm: number
  maxCoolerHeightMm: number
  maxRadiatorMm: number
  fanMounts: number
  color: string
}

export interface Cooler extends BasePart {
  category: 'cooler'
  type: CoolerType
  /** Air cooler height in mm (0 for AIO). */
  heightMm: number
  /** AIO radiator length in mm (0 for air). */
  radiatorMm: number
  /** Cooling capacity in watts. */
  tdpRating: number
  sockets: Socket[]
  rgb: boolean
}

export type Part =
  | CPU
  | GPU
  | Motherboard
  | Memory
  | Storage
  | PSU
  | Case
  | Cooler

/** A build is a partial map of category → chosen part. */
export type Build = Partial<Record<Category, Part>>

/** Narrowing helpers (cheaper than repeated `as` casts at call sites). */
export const isCPU = (p: Part | undefined): p is CPU => p?.category === 'cpu'
export const isGPU = (p: Part | undefined): p is GPU => p?.category === 'gpu'
export const isMobo = (p: Part | undefined): p is Motherboard =>
  p?.category === 'motherboard'
export const isMemory = (p: Part | undefined): p is Memory =>
  p?.category === 'memory'
export const isStorage = (p: Part | undefined): p is Storage =>
  p?.category === 'storage'
export const isPSU = (p: Part | undefined): p is PSU => p?.category === 'psu'
export const isCase = (p: Part | undefined): p is Case => p?.category === 'case'
export const isCooler = (p: Part | undefined): p is Cooler =>
  p?.category === 'cooler'
