import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, Material, MeshBasicMaterial } from 'three'
import { useBuildStore } from '@/state/useBuildStore'
import type { Category } from '@/data/types'
import { PART_SLOTS } from './parts'

/**
 * Live 3D preview built from the real component models. Each part fades in
 * where it belongs as its category is selected (demo mode shows them all).
 */
export function RigModel({ spin = true, demo = false }: { spin?: boolean; demo?: boolean }) {
  const build = useBuildStore((s) => s.build)
  const group = useRef<Group>(null)
  const chassis = useRef<Mesh>(null)
  const slots = useRef<(Group | null)[]>([])
  const opac = useRef<number[]>(PART_SLOTS.map(() => 0))
  const caseOpac = useRef(0)
  const has = (c: Category) => demo || Boolean(build[c])

  useFrame((_, dt) => {
    const k = Math.min(1, dt * 6)
    if (spin && group.current) group.current.rotation.y += dt * 0.22

    // Chassis frame: faint by default, a clear cage once a case is chosen.
    const caseTarget = has('case') ? 0.55 : 0.16
    caseOpac.current += (caseTarget - caseOpac.current) * k
    if (chassis.current) {
      ;(chassis.current.material as MeshBasicMaterial).opacity = caseOpac.current
    }

    PART_SLOTS.forEach((slot, i) => {
      const g = slots.current[i]
      if (!g) return
      const target = has(slot.category) ? 1 : 0
      const cur = opac.current[i] + (target - opac.current[i]) * k
      opac.current[i] = cur
      g.visible = cur > 0.01
      g.scale.setScalar(0.9 + 0.1 * cur)
      g.traverse((o) => {
        const mat = (o as Mesh).material as Material | undefined
        if (mat) mat.opacity = cur
      })
    })
  })

  return (
    <group ref={group} rotation={[0.12, -0.5, 0]}>
      <mesh ref={chassis}>
        <boxGeometry args={[4.2, 4.7, 2.3]} />
        <meshBasicMaterial wireframe color="#be4626" transparent opacity={0.16} />
      </mesh>

      {PART_SLOTS.map((slot, i) => (
        <group
          key={slot.key}
          ref={(el) => {
            slots.current[i] = el
          }}
          position={slot.pos}
          visible={false}
        >
          <slot.Comp />
        </group>
      ))}
    </group>
  )
}
