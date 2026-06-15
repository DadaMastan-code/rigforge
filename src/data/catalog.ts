import type {
  CPU,
  GPU,
  Motherboard,
  Memory,
  Storage,
  PSU,
  Case,
  Cooler,
  Part,
  Category,
} from './types'

/* ----------------------------------------------------------------------------
   Category metadata — drives the builder rows, ordering and theming.
---------------------------------------------------------------------------- */
export type Accent = 'cyan' | 'violet' | 'forge' | 'ok'

export interface CategoryMeta {
  category: Category
  label: string
  blurb: string
  accent: Accent
}

export const CATEGORY_ORDER: Category[] = [
  'cpu',
  'motherboard',
  'memory',
  'gpu',
  'cooler',
  'storage',
  'psu',
  'case',
]

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  cpu: { category: 'cpu', label: 'Processor', blurb: 'The brain of the build', accent: 'forge' },
  motherboard: { category: 'motherboard', label: 'Motherboard', blurb: 'The nervous system', accent: 'cyan' },
  memory: { category: 'memory', label: 'Memory', blurb: 'Fast working storage', accent: 'ok' },
  gpu: { category: 'gpu', label: 'Graphics Card', blurb: 'Pixels & parallel power', accent: 'violet' },
  cooler: { category: 'cooler', label: 'CPU Cooler', blurb: 'Keep it frosty', accent: 'cyan' },
  storage: { category: 'storage', label: 'Storage', blurb: 'Where everything lives', accent: 'violet' },
  psu: { category: 'psu', label: 'Power Supply', blurb: 'Clean, stable watts', accent: 'forge' },
  case: { category: 'case', label: 'Case', blurb: 'The chassis & airflow', accent: 'cyan' },
}

/* ----------------------------------------------------------------------------
   Processors
---------------------------------------------------------------------------- */
const cpus: CPU[] = [
  { id: 'cpu-r5-7600', category: 'cpu', brand: 'AMD', name: 'Ryzen 5 7600', price: 199, tdp: 65, releaseYear: 2023, rating: 4.4, socket: 'AM5', cores: 6, threads: 12, baseClock: 3.8, boostClock: 5.1, memoryType: 'DDR5', igpu: true, gamingScore: 78, productivityScore: 60 },
  { id: 'cpu-r7-7800x3d', category: 'cpu', brand: 'AMD', name: 'Ryzen 7 7800X3D', price: 389, tdp: 120, releaseYear: 2023, rating: 4.9, socket: 'AM5', cores: 8, threads: 16, baseClock: 4.2, boostClock: 5.0, memoryType: 'DDR5', igpu: true, gamingScore: 96, productivityScore: 78 },
  { id: 'cpu-r7-9800x3d', category: 'cpu', brand: 'AMD', name: 'Ryzen 7 9800X3D', price: 479, tdp: 120, releaseYear: 2024, rating: 5.0, socket: 'AM5', cores: 8, threads: 16, baseClock: 4.7, boostClock: 5.2, memoryType: 'DDR5', igpu: true, gamingScore: 100, productivityScore: 85 },
  { id: 'cpu-r9-9950x', category: 'cpu', brand: 'AMD', name: 'Ryzen 9 9950X', price: 599, tdp: 170, releaseYear: 2024, rating: 4.8, socket: 'AM5', cores: 16, threads: 32, baseClock: 4.3, boostClock: 5.7, memoryType: 'DDR5', igpu: true, gamingScore: 93, productivityScore: 100 },
  { id: 'cpu-r5-5600x', category: 'cpu', brand: 'AMD', name: 'Ryzen 5 5600X', price: 139, tdp: 65, releaseYear: 2020, rating: 4.5, socket: 'AM4', cores: 6, threads: 12, baseClock: 3.7, boostClock: 4.6, memoryType: 'DDR4', igpu: false, gamingScore: 66, productivityScore: 52 },
  { id: 'cpu-i5-14600k', category: 'cpu', brand: 'Intel', name: 'Core i5-14600K', price: 279, tdp: 125, releaseYear: 2023, rating: 4.5, socket: 'LGA1700', cores: 14, threads: 20, baseClock: 3.5, boostClock: 5.3, memoryType: 'DDR5', igpu: true, gamingScore: 84, productivityScore: 80 },
  { id: 'cpu-i7-14700k', category: 'cpu', brand: 'Intel', name: 'Core i7-14700K', price: 379, tdp: 125, releaseYear: 2023, rating: 4.6, socket: 'LGA1700', cores: 20, threads: 28, baseClock: 3.4, boostClock: 5.6, memoryType: 'DDR5', igpu: true, gamingScore: 88, productivityScore: 91 },
  { id: 'cpu-i9-14900k', category: 'cpu', brand: 'Intel', name: 'Core i9-14900K', price: 549, tdp: 125, releaseYear: 2023, rating: 4.4, socket: 'LGA1700', cores: 24, threads: 32, baseClock: 3.2, boostClock: 6.0, memoryType: 'DDR5', igpu: true, gamingScore: 92, productivityScore: 96 },
  { id: 'cpu-cu7-265k', category: 'cpu', brand: 'Intel', name: 'Core Ultra 7 265K', price: 394, tdp: 125, releaseYear: 2024, rating: 4.2, socket: 'LGA1851', cores: 20, threads: 20, baseClock: 3.9, boostClock: 5.5, memoryType: 'DDR5', igpu: true, gamingScore: 85, productivityScore: 92 },
  { id: 'cpu-cu9-285k', category: 'cpu', brand: 'Intel', name: 'Core Ultra 9 285K', price: 589, tdp: 125, releaseYear: 2024, rating: 4.3, socket: 'LGA1851', cores: 24, threads: 24, baseClock: 3.7, boostClock: 5.7, memoryType: 'DDR5', igpu: true, gamingScore: 89, productivityScore: 99 },
]

/* ----------------------------------------------------------------------------
   Graphics cards
---------------------------------------------------------------------------- */
const gpus: GPU[] = [
  { id: 'gpu-rtx4060', category: 'gpu', brand: 'NVIDIA', name: 'GeForce RTX 4060', price: 289, tdp: 115, releaseYear: 2023, rating: 4.0, vram: 8, lengthMm: 245, recommendedPsu: 550, powerConnector: '1× 8-pin', gamingScore: 60, rayTracing: true },
  { id: 'gpu-rtx4070s', category: 'gpu', brand: 'NVIDIA', name: 'GeForce RTX 4070 SUPER', price: 599, tdp: 220, releaseYear: 2024, rating: 4.7, vram: 12, lengthMm: 305, recommendedPsu: 650, powerConnector: '1× 16-pin', gamingScore: 80, rayTracing: true },
  { id: 'gpu-rtx4080s', category: 'gpu', brand: 'NVIDIA', name: 'GeForce RTX 4080 SUPER', price: 999, tdp: 320, releaseYear: 2024, rating: 4.6, vram: 16, lengthMm: 310, recommendedPsu: 750, powerConnector: '1× 16-pin', gamingScore: 92, rayTracing: true },
  { id: 'gpu-rtx4090', category: 'gpu', brand: 'NVIDIA', name: 'GeForce RTX 4090', price: 1599, tdp: 450, releaseYear: 2022, rating: 4.8, vram: 24, lengthMm: 336, recommendedPsu: 850, powerConnector: '1× 16-pin', gamingScore: 100, rayTracing: true },
  { id: 'gpu-rtx5070ti', category: 'gpu', brand: 'NVIDIA', name: 'GeForce RTX 5070 Ti', price: 749, tdp: 300, releaseYear: 2025, rating: 4.7, vram: 16, lengthMm: 300, recommendedPsu: 750, powerConnector: '1× 16-pin', gamingScore: 90, rayTracing: true },
  { id: 'gpu-rtx5090', category: 'gpu', brand: 'NVIDIA', name: 'GeForce RTX 5090', price: 1999, tdp: 575, releaseYear: 2025, rating: 4.9, vram: 32, lengthMm: 360, recommendedPsu: 1000, powerConnector: '1× 16-pin', gamingScore: 112, rayTracing: true },
  { id: 'gpu-rx7800xt', category: 'gpu', brand: 'AMD', name: 'Radeon RX 7800 XT', price: 489, tdp: 263, releaseYear: 2023, rating: 4.5, vram: 16, lengthMm: 320, recommendedPsu: 700, powerConnector: '2× 8-pin', gamingScore: 78, rayTracing: true },
  { id: 'gpu-rx7900xtx', category: 'gpu', brand: 'AMD', name: 'Radeon RX 7900 XTX', price: 899, tdp: 355, releaseYear: 2022, rating: 4.6, vram: 24, lengthMm: 287, recommendedPsu: 800, powerConnector: '2× 8-pin', gamingScore: 94, rayTracing: true },
  { id: 'gpu-arcb580', category: 'gpu', brand: 'Intel', name: 'Arc B580', price: 249, tdp: 190, releaseYear: 2024, rating: 4.2, vram: 12, lengthMm: 272, recommendedPsu: 600, powerConnector: '1× 8-pin', gamingScore: 58, rayTracing: true },
]

/* ----------------------------------------------------------------------------
   Motherboards
---------------------------------------------------------------------------- */
const motherboards: Motherboard[] = [
  { id: 'mb-tuf-b650', category: 'motherboard', brand: 'ASUS', name: 'TUF Gaming B650-PLUS WiFi', price: 189, tdp: 50, releaseYear: 2022, rating: 4.6, socket: 'AM5', chipset: 'B650', formFactor: 'ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 192, maxMemorySpeed: 6400, m2Slots: 2, wifi: true },
  { id: 'mb-tomahawk-b650', category: 'motherboard', brand: 'MSI', name: 'MAG B650 Tomahawk WiFi', price: 219, tdp: 55, releaseYear: 2022, rating: 4.7, socket: 'AM5', chipset: 'B650', formFactor: 'ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 256, maxMemorySpeed: 6600, m2Slots: 3, wifi: true },
  { id: 'mb-x670e-master', category: 'motherboard', brand: 'Gigabyte', name: 'X670E AORUS Master', price: 329, tdp: 80, releaseYear: 2022, rating: 4.5, socket: 'AM5', chipset: 'X670E', formFactor: 'ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 256, maxMemorySpeed: 6666, m2Slots: 4, wifi: true },
  { id: 'mb-b650i-ultra', category: 'motherboard', brand: 'Gigabyte', name: 'B650I AORUS Ultra', price: 259, tdp: 45, releaseYear: 2023, rating: 4.4, socket: 'AM5', chipset: 'B650', formFactor: 'Mini-ITX', memoryType: 'DDR5', memorySlots: 2, maxMemoryGb: 96, maxMemorySpeed: 6400, m2Slots: 2, wifi: true },
  { id: 'mb-b550a-pro', category: 'motherboard', brand: 'MSI', name: 'B550-A PRO', price: 129, tdp: 45, releaseYear: 2020, rating: 4.4, socket: 'AM4', chipset: 'B550', formFactor: 'ATX', memoryType: 'DDR4', memorySlots: 4, maxMemoryGb: 128, maxMemorySpeed: 4400, m2Slots: 2, wifi: false },
  { id: 'mb-z790-a', category: 'motherboard', brand: 'ASUS', name: 'ROG STRIX Z790-A', price: 329, tdp: 60, releaseYear: 2022, rating: 4.6, socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 192, maxMemorySpeed: 7800, m2Slots: 4, wifi: true },
  { id: 'mb-b760m-a', category: 'motherboard', brand: 'MSI', name: 'PRO B760M-A WiFi', price: 149, tdp: 45, releaseYear: 2023, rating: 4.3, socket: 'LGA1700', chipset: 'B760', formFactor: 'Micro-ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 192, maxMemorySpeed: 7000, m2Slots: 2, wifi: true },
  { id: 'mb-z890-tomahawk', category: 'motherboard', brand: 'MSI', name: 'MAG Z890 Tomahawk WiFi', price: 329, tdp: 65, releaseYear: 2024, rating: 4.5, socket: 'LGA1851', chipset: 'Z890', formFactor: 'ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 256, maxMemorySpeed: 8200, m2Slots: 4, wifi: true },
  { id: 'mb-z890e', category: 'motherboard', brand: 'ASUS', name: 'ROG STRIX Z890-E', price: 499, tdp: 70, releaseYear: 2024, rating: 4.6, socket: 'LGA1851', chipset: 'Z890', formFactor: 'ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 256, maxMemorySpeed: 8400, m2Slots: 5, wifi: true },
]

/* ----------------------------------------------------------------------------
   Memory
---------------------------------------------------------------------------- */
const memory: Memory[] = [
  { id: 'mem-fury-16-5600', category: 'memory', brand: 'Kingston', name: 'Fury Beast 16GB', price: 54, tdp: 6, releaseYear: 2022, rating: 4.5, type: 'DDR5', capacityGb: 16, modules: 2, speedMhz: 5600, casLatency: 36, rgb: false },
  { id: 'mem-veng-32-6000', category: 'memory', brand: 'Corsair', name: 'Vengeance 32GB', price: 104, tdp: 6, releaseYear: 2023, rating: 4.8, type: 'DDR5', capacityGb: 32, modules: 2, speedMhz: 6000, casLatency: 30, rgb: false },
  { id: 'mem-tridz5-32-6400', category: 'memory', brand: 'G.Skill', name: 'Trident Z5 RGB 32GB', price: 129, tdp: 8, releaseYear: 2023, rating: 4.8, type: 'DDR5', capacityGb: 32, modules: 2, speedMhz: 6400, casLatency: 32, rgb: true },
  { id: 'mem-ripjaws-64-6000', category: 'memory', brand: 'G.Skill', name: 'Ripjaws S5 64GB', price: 189, tdp: 10, releaseYear: 2023, rating: 4.7, type: 'DDR5', capacityGb: 64, modules: 2, speedMhz: 6000, casLatency: 30, rgb: false },
  { id: 'mem-dom-64-6000', category: 'memory', brand: 'Corsair', name: 'Dominator Platinum 64GB', price: 249, tdp: 14, releaseYear: 2023, rating: 4.6, type: 'DDR5', capacityGb: 64, modules: 4, speedMhz: 6000, casLatency: 30, rgb: true },
  { id: 'mem-lpx-16-3600', category: 'memory', brand: 'Corsair', name: 'Vengeance LPX 16GB', price: 39, tdp: 5, releaseYear: 2019, rating: 4.6, type: 'DDR4', capacityGb: 16, modules: 2, speedMhz: 3600, casLatency: 18, rgb: false },
  { id: 'mem-tridz-32-3600', category: 'memory', brand: 'G.Skill', name: 'Trident Z 32GB', price: 79, tdp: 6, releaseYear: 2020, rating: 4.7, type: 'DDR4', capacityGb: 32, modules: 2, speedMhz: 3600, casLatency: 16, rgb: true },
]

/* ----------------------------------------------------------------------------
   Storage
---------------------------------------------------------------------------- */
const storage: Storage[] = [
  { id: 'ssd-sn850x-1tb', category: 'storage', brand: 'WD', name: 'Black SN850X 1TB', price: 89, tdp: 7, releaseYear: 2022, rating: 4.8, kind: 'NVMe SSD', capacityGb: 1000, interface: 'M.2 PCIe 4.0', readMBps: 7300, usesM2: true },
  { id: 'ssd-990pro-2tb', category: 'storage', brand: 'Samsung', name: '990 PRO 2TB', price: 169, tdp: 8, releaseYear: 2023, rating: 4.9, kind: 'NVMe SSD', capacityGb: 2000, interface: 'M.2 PCIe 4.0', readMBps: 7450, usesM2: true },
  { id: 'ssd-t700-2tb', category: 'storage', brand: 'Crucial', name: 'T700 2TB', price: 209, tdp: 10, releaseYear: 2023, rating: 4.6, kind: 'NVMe SSD', capacityGb: 2000, interface: 'M.2 PCIe 5.0', readMBps: 12400, usesM2: true },
  { id: 'ssd-990pro-4tb', category: 'storage', brand: 'Samsung', name: '990 PRO 4TB', price: 309, tdp: 8, releaseYear: 2023, rating: 4.8, kind: 'NVMe SSD', capacityGb: 4000, interface: 'M.2 PCIe 4.0', readMBps: 7450, usesM2: true },
  { id: 'ssd-870evo-1tb', category: 'storage', brand: 'Samsung', name: '870 EVO 1TB', price: 79, tdp: 3, releaseYear: 2021, rating: 4.7, kind: 'SATA SSD', capacityGb: 1000, interface: 'SATA III', readMBps: 560, usesM2: false },
  { id: 'hdd-barracuda-2tb', category: 'storage', brand: 'Seagate', name: 'BarraCuda 2TB', price: 54, tdp: 8, releaseYear: 2019, rating: 4.3, kind: 'HDD', capacityGb: 2000, interface: 'SATA III', readMBps: 220, usesM2: false },
]

/* ----------------------------------------------------------------------------
   Power supplies
---------------------------------------------------------------------------- */
const psus: PSU[] = [
  { id: 'psu-evga-600br', category: 'psu', brand: 'EVGA', name: '600 BR', price: 54, tdp: 0, releaseYear: 2019, rating: 4.2, wattage: 600, efficiency: '80+ Bronze', modular: 'No', formFactor: 'ATX' },
  { id: 'psu-bq-650', category: 'psu', brand: 'be quiet!', name: 'Pure Power 12 M 650W', price: 89, tdp: 0, releaseYear: 2023, rating: 4.6, wattage: 650, efficiency: '80+ Gold', modular: 'Full', formFactor: 'ATX' },
  { id: 'psu-rm750e', category: 'psu', brand: 'Corsair', name: 'RM750e', price: 99, tdp: 0, releaseYear: 2023, rating: 4.7, wattage: 750, efficiency: '80+ Gold', modular: 'Full', formFactor: 'ATX' },
  { id: 'psu-rm850x', category: 'psu', brand: 'Corsair', name: 'RM850x', price: 139, tdp: 0, releaseYear: 2023, rating: 4.8, wattage: 850, efficiency: '80+ Gold', modular: 'Full', formFactor: 'ATX' },
  { id: 'psu-hx1200', category: 'psu', brand: 'Corsair', name: 'HX1200', price: 229, tdp: 0, releaseYear: 2022, rating: 4.8, wattage: 1200, efficiency: '80+ Platinum', modular: 'Full', formFactor: 'ATX' },
  { id: 'psu-prime-1000', category: 'psu', brand: 'Seasonic', name: 'PRIME TX-1000', price: 269, tdp: 0, releaseYear: 2021, rating: 4.9, wattage: 1000, efficiency: '80+ Titanium', modular: 'Full', formFactor: 'ATX' },
  { id: 'psu-sf750', category: 'psu', brand: 'Corsair', name: 'SF750', price: 149, tdp: 0, releaseYear: 2020, rating: 4.7, wattage: 750, efficiency: '80+ Platinum', modular: 'Full', formFactor: 'SFX' },
]

/* ----------------------------------------------------------------------------
   Cases
---------------------------------------------------------------------------- */
const cases: Case[] = [
  { id: 'case-4000d', category: 'case', brand: 'Corsair', name: '4000D Airflow', price: 94, tdp: 6, releaseYear: 2020, rating: 4.8, supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 360, maxCoolerHeightMm: 170, maxRadiatorMm: 360, fanMounts: 6, color: 'Black' },
  { id: 'case-north', category: 'case', brand: 'Fractal', name: 'Design North', price: 139, tdp: 6, releaseYear: 2023, rating: 4.7, supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 355, maxCoolerHeightMm: 170, maxRadiatorMm: 280, fanMounts: 5, color: 'Walnut' },
  { id: 'case-h7flow', category: 'case', brand: 'NZXT', name: 'H7 Flow', price: 129, tdp: 6, releaseYear: 2022, rating: 4.7, supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 400, maxCoolerHeightMm: 185, maxRadiatorMm: 360, fanMounts: 7, color: 'White' },
  { id: 'case-o11evo', category: 'case', brand: 'Lian Li', name: 'O11 Dynamic EVO', price: 169, tdp: 6, releaseYear: 2022, rating: 4.9, supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 426, maxCoolerHeightMm: 167, maxRadiatorMm: 360, fanMounts: 10, color: 'White' },
  { id: 'case-y60', category: 'case', brand: 'HYTE', name: 'Y60', price: 199, tdp: 6, releaseYear: 2022, rating: 4.6, supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 375, maxCoolerHeightMm: 160, maxRadiatorMm: 280, fanMounts: 7, color: 'Black' },
  { id: 'case-nr200p', category: 'case', brand: 'Cooler Master', name: 'NR200P', price: 109, tdp: 4, releaseYear: 2020, rating: 4.8, supportedFormFactors: ['Mini-ITX'], maxGpuLengthMm: 330, maxCoolerHeightMm: 155, maxRadiatorMm: 280, fanMounts: 4, color: 'Black' },
  { id: 'case-a4h2o', category: 'case', brand: 'Lian Li', name: 'A4-H2O', price: 129, tdp: 3, releaseYear: 2021, rating: 4.5, supportedFormFactors: ['Mini-ITX'], maxGpuLengthMm: 322, maxCoolerHeightMm: 70, maxRadiatorMm: 240, fanMounts: 2, color: 'Silver' },
]

/* ----------------------------------------------------------------------------
   CPU coolers
---------------------------------------------------------------------------- */
const allSockets = ['AM5', 'AM4', 'LGA1700', 'LGA1851'] as const
const coolers: Cooler[] = [
  { id: 'cool-pa120', category: 'cooler', brand: 'Thermalright', name: 'Peerless Assassin 120', price: 35, tdp: 4, releaseYear: 2022, rating: 4.8, type: 'Air', heightMm: 155, radiatorMm: 0, tdpRating: 220, sockets: [...allSockets], rgb: false },
  { id: 'cool-nhd15', category: 'cooler', brand: 'Noctua', name: 'NH-D15', price: 109, tdp: 5, releaseYear: 2014, rating: 4.9, type: 'Air', heightMm: 165, radiatorMm: 0, tdpRating: 250, sockets: [...allSockets], rgb: false },
  { id: 'cool-darkrock', category: 'cooler', brand: 'be quiet!', name: 'Dark Rock Pro 4', price: 89, tdp: 5, releaseYear: 2018, rating: 4.7, type: 'Air', heightMm: 163, radiatorMm: 0, tdpRating: 250, sockets: [...allSockets], rgb: false },
  { id: 'cool-nhl9', category: 'cooler', brand: 'Noctua', name: 'NH-L9x65', price: 55, tdp: 3, releaseYear: 2016, rating: 4.6, type: 'Air', heightMm: 65, radiatorMm: 0, tdpRating: 95, sockets: [...allSockets], rgb: false },
  { id: 'cool-lf3-360', category: 'cooler', brand: 'Arctic', name: 'Liquid Freezer III 360', price: 109, tdp: 12, releaseYear: 2024, rating: 4.9, type: 'Liquid AIO', heightMm: 0, radiatorMm: 360, tdpRating: 350, sockets: [...allSockets], rgb: false },
  { id: 'cool-h150i', category: 'cooler', brand: 'Corsair', name: 'iCUE H150i Elite 360', price: 189, tdp: 14, releaseYear: 2022, rating: 4.6, type: 'Liquid AIO', heightMm: 0, radiatorMm: 360, tdpRating: 330, sockets: [...allSockets], rgb: true },
  { id: 'cool-kraken240', category: 'cooler', brand: 'NZXT', name: 'Kraken 240', price: 129, tdp: 11, releaseYear: 2023, rating: 4.5, type: 'Liquid AIO', heightMm: 0, radiatorMm: 240, tdpRating: 280, sockets: [...allSockets], rgb: true },
]

/* ----------------------------------------------------------------------------
   Aggregates & lookups
---------------------------------------------------------------------------- */
export const CATALOG: Part[] = [
  ...cpus,
  ...motherboards,
  ...memory,
  ...gpus,
  ...coolers,
  ...storage,
  ...psus,
  ...cases,
]

export const partsByCategory: Record<Category, Part[]> = {
  cpu: cpus,
  motherboard: motherboards,
  memory,
  gpu: gpus,
  cooler: coolers,
  storage,
  psu: psus,
  case: cases,
}

const partIndex = new Map<string, Part>(CATALOG.map((p) => [p.id, p]))

export function getPart(id: string): Part | undefined {
  return partIndex.get(id)
}
