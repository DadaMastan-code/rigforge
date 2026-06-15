import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Edges, Sparkles } from '@react-three/drei'
import type { Group } from 'three'
import { useBuildStore } from '@/state/useBuildStore'
import type { Category } from '@/data/types'

const COLOR = {
  cpu: '#ff7a18',
  motherboard: '#22d3ee',
  cooler: '#67e8f9',
  memory: '#34d399',
  gpu: '#a855f7',
  storage: '#c084fc',
  psu: '#ff9a3c',
} as const

type Vec3 = [number, number, number]

function Block({
  position,
  size,
  color,
  active,
  radius = 0.05,
}: {
  position: Vec3
  size: Vec3
  color: string
  active: boolean
  radius?: number
}) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={3} position={position}>
      <meshStandardMaterial
        color={active ? color : '#0e121b'}
        emissive={active ? color : '#000000'}
        emissiveIntensity={active ? 0.55 : 0}
        metalness={0.55}
        roughness={0.35}
        transparent
        opacity={active ? 1 : 0.28}
      />
      <Edges threshold={15} color={active ? color : '#2a3040'} />
    </RoundedBox>
  )
}

/** Stylized PC build that fills in and glows as parts are chosen. */
export function RigModel({ spin = true }: { spin?: boolean }) {
  const build = useBuildStore((s) => s.build)
  const group = useRef<Group>(null)
  const has = (c: Category) => Boolean(build[c])

  useFrame((_, dt) => {
    if (spin && group.current) group.current.rotation.y += dt * 0.25
  })

  return (
    <group ref={group} rotation={[0.12, -0.5, 0]}>
      {/* Chassis wireframe */}
      <mesh>
        <boxGeometry args={[4.2, 4.7, 2.3]} />
        <meshBasicMaterial wireframe color="#1b2230" transparent opacity={0.22} />
        <Edges threshold={15} color={has('case') ? '#22d3ee' : '#283042'} />
      </mesh>

      {/* Motherboard back panel */}
      <Block position={[-0.15, 0.15, -0.95]} size={[3.4, 3.9, 0.14]} color={COLOR.motherboard} active={has('motherboard')} radius={0.03} />

      {/* CPU + cooler tower */}
      <Block position={[-0.65, 0.95, -0.5]} size={[0.85, 0.85, 0.4]} color={COLOR.cpu} active={has('cpu')} />
      <Block position={[-0.65, 0.95, 0.05]} size={[1.05, 1.5, 1.0]} color={COLOR.cooler} active={has('cooler')} />

      {/* RAM sticks */}
      {[0, 1].map((i) => (
        <Block key={i} position={[0.65 + i * 0.3, 0.95, -0.45]} size={[0.16, 1.7, 0.62]} color={COLOR.memory} active={has('memory')} radius={0.02} />
      ))}

      {/* GPU */}
      <Block position={[0.05, -0.55, 0.05]} size={[3.0, 0.5, 1.25]} color={COLOR.gpu} active={has('gpu')} />

      {/* Storage */}
      <Block position={[1.35, -1.05, 0.65]} size={[0.95, 0.14, 1.3]} color={COLOR.storage} active={has('storage')} radius={0.02} />

      {/* PSU */}
      <Block position={[0, -1.95, -0.2]} size={[3.2, 0.7, 1.7]} color={COLOR.psu} active={has('psu')} />

      <Sparkles count={36} scale={[5.5, 5.5, 4]} size={2.2} speed={0.3} color="#67e8f9" opacity={0.4} />
    </group>
  )
}
