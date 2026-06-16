import type { FC } from 'react'
import { RoundedBox } from '@react-three/drei'
import type { Category } from '@/data/types'

type Vec3 = [number, number, number]

/**
 * Procedural, recognizable PC-component meshes in the site's matte palette.
 * Each is modelled around its local origin in its final orientation; the
 * AssemblyRig places + animates them. All materials are `transparent` so the
 * rig can fade each part in as it flies into place.
 */

const MAT = {
  pcb: { color: '#243026', metalness: 0.15, roughness: 0.7 },
  graphite: { color: '#2c2620', metalness: 0.35, roughness: 0.55 },
  metal: { color: '#b8b2a3', metalness: 0.65, roughness: 0.38 },
  bronze: { color: '#9a6b3f', metalness: 0.4, roughness: 0.5 },
  olive: { color: '#5d7a4d', metalness: 0.2, roughness: 0.6 },
  accent: { color: '#be4626', metalness: 0.25, roughness: 0.5 },
  fan: { color: '#1c1813', metalness: 0.2, roughness: 0.72 },
  hub: { color: '#3a332a', metalness: 0.45, roughness: 0.5 },
} as const

function M({ k }: { k: keyof typeof MAT }) {
  return <meshStandardMaterial {...MAT[k]} transparent />
}

/** A case/cooler/PSU fan — disc + rim + hub + angled blades. Axis is +Y. */
function Fan({ r = 0.45 }: { r?: number }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[r, r, 0.12, 28]} />
        <M k="fan" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r * 1.04, r * 1.04, 0.07, 28]} />
        <M k="hub" />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[r * 0.3, r * 0.3, 0.12, 18]} />
        <M k="hub" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r * 0.55, 0.05, Math.sin(a) * r * 0.55]}
            rotation={[0, -a, 0.42]}
          >
            <boxGeometry args={[r * 0.72, 0.02, 0.17]} />
            <M k="fan" />
          </mesh>
        )
      })}
    </group>
  )
}

/** Motherboard — PCB panel (thin in Z) with sockets, slots and heatsinks on +Z. */
export function Motherboard() {
  return (
    <group>
      <RoundedBox args={[3.4, 3.9, 0.12]} radius={0.04} smoothness={2}>
        <M k="pcb" />
      </RoundedBox>
      {/* CPU socket (upper-left) */}
      <mesh position={[-0.55, 0.85, 0.09]}>
        <boxGeometry args={[0.95, 0.95, 0.06]} />
        <M k="metal" />
      </mesh>
      {/* VRM heatsinks */}
      <mesh position={[-0.55, 1.55, 0.13]}>
        <boxGeometry args={[1.0, 0.45, 0.2]} />
        <M k="metal" />
      </mesh>
      <mesh position={[-1.3, 0.9, 0.13]}>
        <boxGeometry args={[0.35, 1.5, 0.2]} />
        <M k="metal" />
      </mesh>
      {/* I/O shroud */}
      <mesh position={[-1.45, 1.45, 0.16]}>
        <boxGeometry args={[0.55, 0.85, 0.26]} />
        <M k="graphite" />
      </mesh>
      {/* RAM slots */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.45 + i * 0.22, 0.9, 0.08]}>
          <boxGeometry args={[0.08, 1.7, 0.05]} />
          <M k="graphite" />
        </mesh>
      ))}
      {/* M.2 heatsink */}
      <mesh position={[0.2, -0.55, 0.1]}>
        <boxGeometry args={[1.5, 0.3, 0.08]} />
        <M k="metal" />
      </mesh>
      {/* PCIe slots */}
      {[0, 1].map((i) => (
        <mesh key={i} position={[0.15, -1.0 - i * 0.45, 0.08]}>
          <boxGeometry args={[2.2, 0.09, 0.05]} />
          <M k="accent" />
        </mesh>
      ))}
      {/* chipset heatsink */}
      <mesh position={[0.3, -1.55, 0.12]}>
        <boxGeometry args={[0.7, 0.6, 0.16]} />
        <M k="bronze" />
      </mesh>
    </group>
  )
}

/** CPU — small substrate + metal IHS, faces +Z onto the socket. */
export function Cpu() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.82, 0.82, 0.1]} />
        <M k="pcb" />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.6, 0.6, 0.07]} />
        <M k="metal" />
      </mesh>
    </group>
  )
}

/** Air-cooler tower — stacked fins, heatpipes, cold plate, front fan (faces +Z). */
export function CoolerTower() {
  return (
    <group>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[0, -0.55 + i * 0.16, 0]}>
          <boxGeometry args={[1.0, 0.06, 0.95]} />
          <M k="metal" />
        </mesh>
      ))}
      {/* heatpipes */}
      {[-0.28, 0, 0.28].map((x, i) => (
        <mesh key={i} position={[x, -0.2, 0.25]}>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 10]} />
          <M k="bronze" />
        </mesh>
      ))}
      {/* cold plate */}
      <mesh position={[0, -0.72, 0]}>
        <boxGeometry args={[0.5, 0.18, 0.5]} />
        <M k="metal" />
      </mesh>
      {/* front fan */}
      <group position={[0, 0.05, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <Fan r={0.52} />
      </group>
    </group>
  )
}

/** RAM stick — PCB + heatspreader + ridge + contacts. Thin in X, stands in Y. */
export function Ram() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.12, 1.6, 0.6]} />
        <M k="pcb" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.16, 1.4, 0.62]} />
        <M k="olive" />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.16, 0.14, 0.5]} />
        <M k="metal" />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.55]} />
        <M k="bronze" />
      </mesh>
    </group>
  )
}

/** Graphics card — shroud, twin top fans, accent stripe, backplate, bracket. */
export function Gpu() {
  return (
    <group>
      <RoundedBox args={[3.0, 0.5, 1.25]} radius={0.05} smoothness={2}>
        <M k="graphite" />
      </RoundedBox>
      <mesh position={[0, 0.12, 0.64]}>
        <boxGeometry args={[2.9, 0.05, 0.02]} />
        <M k="accent" />
      </mesh>
      <mesh position={[0, 0, -0.64]}>
        <boxGeometry args={[3.0, 0.5, 0.05]} />
        <M k="graphite" />
      </mesh>
      <group position={[-0.72, 0.26, 0]}>
        <Fan r={0.5} />
      </group>
      <group position={[0.72, 0.26, 0]}>
        <Fan r={0.5} />
      </group>
      {/* PCIe bracket */}
      <mesh position={[-1.55, -0.12, 0]}>
        <boxGeometry args={[0.06, 0.7, 1.2]} />
        <M k="metal" />
      </mesh>
    </group>
  )
}

/** 2.5" SSD — flat body with a label. */
export function Storage() {
  return (
    <group>
      <RoundedBox args={[0.95, 0.14, 1.3]} radius={0.03} smoothness={2}>
        <M k="graphite" />
      </RoundedBox>
      <mesh position={[0, 0.08, 0.1]}>
        <boxGeometry args={[0.6, 0.02, 0.8]} />
        <M k="accent" />
      </mesh>
    </group>
  )
}

/** Power supply — box with a top fan, a label and side venting. */
export function Psu() {
  return (
    <group>
      <RoundedBox args={[3.2, 0.7, 1.7]} radius={0.05} smoothness={2}>
        <M k="bronze" />
      </RoundedBox>
      <group position={[0.35, 0.36, 0]}>
        <Fan r={0.55} />
      </group>
      <mesh position={[-0.95, 0.36, 0]}>
        <boxGeometry args={[0.7, 0.02, 0.7]} />
        <M k="graphite" />
      </mesh>
      {[-0.5, -0.25, 0, 0.25, 0.5].map((z, i) => (
        <mesh key={i} position={[-1.59, 0, z]}>
          <boxGeometry args={[0.04, 0.5, 0.05]} />
          <M k="graphite" />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Shared rig layout — final position of each component, the category it maps
 * to, plus the assembly timeline window + fly-in offset. Used by both the live
 * 3D preview (show/hide by selection) and the assembly animation.
 */
export interface PartSlot {
  key: string
  Comp: FC
  category: Category
  pos: Vec3
  win: [number, number]
  from: Vec3
}

export const PART_SLOTS: PartSlot[] = [
  { key: 'motherboard', Comp: Motherboard, category: 'motherboard', pos: [-0.15, 0.15, -0.95], win: [0.08, 0.28], from: [0, 0, -2.8] },
  { key: 'cpu', Comp: Cpu, category: 'cpu', pos: [-0.7, 0.95, -0.78], win: [0.24, 0.38], from: [0, 3, 0] },
  { key: 'cooler', Comp: CoolerTower, category: 'cooler', pos: [-0.7, 0.95, -0.12], win: [0.36, 0.54], from: [0, 3.4, 0] },
  { key: 'ram0', Comp: Ram, category: 'memory', pos: [0.5, 0.95, -0.8], win: [0.5, 0.64], from: [0, 3, 0] },
  { key: 'ram1', Comp: Ram, category: 'memory', pos: [0.78, 0.95, -0.8], win: [0.53, 0.67], from: [0, 3, 0] },
  { key: 'gpu', Comp: Gpu, category: 'gpu', pos: [0.1, -0.55, -0.05], win: [0.64, 0.82], from: [0, 0.5, 3] },
  { key: 'storage', Comp: Storage, category: 'storage', pos: [1.4, -1.1, 0.5], win: [0.78, 0.9], from: [3, 0, 0] },
  { key: 'psu', Comp: Psu, category: 'psu', pos: [0, -1.95, -0.25], win: [0.86, 1.0], from: [0, -3, 0] },
]
