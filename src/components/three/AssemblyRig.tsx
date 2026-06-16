import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, Material, MeshBasicMaterial } from 'three'
import { PART_SLOTS } from './parts'

const DURATION = 5.0
const CASE_WIN: [number, number] = [0.0, 0.16]

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const window01 = (p: number, [a, b]: [number, number]) => clamp01((p - a) / (b - a))

/**
 * The build assembling itself from real component shapes: each part eases from
 * an offset into its slot across a staggered timeline driven by `playToken`.
 * A new (non-zero) token restarts it; token 0 holds it disassembled.
 */
export function AssemblyRig({ playToken }: { playToken: number }) {
  const group = useRef<Group>(null)
  const chassis = useRef<Mesh>(null)
  const groups = useRef<(Group | null)[]>([])
  const tokenRef = useRef<number>(-1)
  const startRef = useRef<number | null>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (playToken !== tokenRef.current) {
      tokenRef.current = playToken
      startRef.current = playToken > 0 ? t : null
    }
    const p = startRef.current === null ? 0 : Math.min((t - startRef.current) / DURATION, 1)

    if (group.current) group.current.rotation.y = -0.5 + t * 0.12

    if (chassis.current) {
      const e = easeOut(window01(p, CASE_WIN))
      chassis.current.scale.setScalar(0.82 + 0.18 * e)
      ;(chassis.current.material as MeshBasicMaterial).opacity = 0.5 * e
    }

    PART_SLOTS.forEach((slot, i) => {
      const g = groups.current[i]
      if (!g) return
      const e = easeOut(window01(p, slot.win))
      g.position.set(
        slot.pos[0] + slot.from[0] * (1 - e),
        slot.pos[1] + slot.from[1] * (1 - e),
        slot.pos[2] + slot.from[2] * (1 - e),
      )
      g.visible = e > 0.001
      const op = Math.min(e * 1.5, 1)
      g.traverse((o) => {
        const mat = (o as Mesh).material as Material | undefined
        if (mat) mat.opacity = op
      })
    })
  })

  return (
    <group ref={group} rotation={[0.12, -0.5, 0]}>
      <mesh ref={chassis}>
        <boxGeometry args={[4.2, 4.7, 2.3]} />
        <meshBasicMaterial wireframe color="#be4626" transparent opacity={0} />
      </mesh>

      {PART_SLOTS.map((slot, i) => (
        <group
          key={slot.key}
          ref={(el) => {
            groups.current[i] = el
          }}
          visible={false}
        >
          <slot.Comp />
        </group>
      ))}
    </group>
  )
}
