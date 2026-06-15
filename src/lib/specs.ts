import type { Part } from '@/data/types'
import {
  isCPU,
  isGPU,
  isMobo,
  isMemory,
  isStorage,
  isPSU,
  isCase,
  isCooler,
} from '@/data/types'
import { capacityLabel } from './format'

export interface SpecChip {
  label: string
  value: string
}

/** Derive the headline spec chips shown on cards and in the detail view. */
export function specChips(part: Part): SpecChip[] {
  if (isCPU(part)) {
    return [
      { label: 'Cores', value: `${part.cores}C / ${part.threads}T` },
      { label: 'Boost', value: `${part.boostClock} GHz` },
      { label: 'Socket', value: part.socket },
      { label: 'Memory', value: part.memoryType },
      { label: 'TDP', value: `${part.tdp}W` },
    ]
  }
  if (isGPU(part)) {
    return [
      { label: 'VRAM', value: `${part.vram}GB` },
      { label: 'Power', value: `${part.tdp}W` },
      { label: 'Length', value: `${part.lengthMm}mm` },
      { label: 'Ray Tracing', value: part.rayTracing ? 'Yes' : 'No' },
    ]
  }
  if (isMobo(part)) {
    return [
      { label: 'Socket', value: part.socket },
      { label: 'Chipset', value: part.chipset },
      { label: 'Form', value: part.formFactor },
      { label: 'Memory', value: `${part.memorySlots}× ${part.memoryType}` },
      { label: 'Wi-Fi', value: part.wifi ? 'Yes' : 'No' },
    ]
  }
  if (isMemory(part)) {
    return [
      { label: 'Capacity', value: `${part.capacityGb}GB` },
      { label: 'Kit', value: `${part.modules}× ${part.capacityGb / part.modules}GB` },
      { label: 'Speed', value: `${part.speedMhz} MT/s` },
      { label: 'Latency', value: `CL${part.casLatency}` },
      { label: 'Type', value: part.type },
    ]
  }
  if (isStorage(part)) {
    return [
      { label: 'Type', value: part.kind },
      { label: 'Capacity', value: capacityLabel(part.capacityGb) },
      { label: 'Interface', value: part.interface },
      { label: 'Read', value: `${part.readMBps.toLocaleString('en-US')} MB/s` },
    ]
  }
  if (isPSU(part)) {
    return [
      { label: 'Wattage', value: `${part.wattage}W` },
      { label: 'Rating', value: part.efficiency },
      { label: 'Modular', value: part.modular },
      { label: 'Form', value: part.formFactor },
    ]
  }
  if (isCase(part)) {
    return [
      { label: 'Supports', value: part.supportedFormFactors.join(' · ') },
      { label: 'Max GPU', value: `${part.maxGpuLengthMm}mm` },
      { label: 'Max Cooler', value: `${part.maxCoolerHeightMm}mm` },
      { label: 'Color', value: part.color },
    ]
  }
  if (isCooler(part)) {
    return [
      { label: 'Type', value: part.type },
      {
        label: part.type === 'Air' ? 'Height' : 'Radiator',
        value: part.type === 'Air' ? `${part.heightMm}mm` : `${part.radiatorMm}mm`,
      },
      { label: 'Capacity', value: `${part.tdpRating}W` },
      { label: 'RGB', value: part.rgb ? 'Yes' : 'No' },
    ]
  }
  return []
}
