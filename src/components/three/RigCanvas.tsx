import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RigModel } from './RigModel'

interface Props {
  interactive?: boolean
  className?: string
}

export function RigCanvas({ interactive = false, className }: Props) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [5.6, 2.4, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 9, 5]} intensity={1.4} />
        <pointLight position={[-6, -2, 4]} intensity={55} color="#a855f7" distance={24} />
        <pointLight position={[6, 4, -3]} intensity={55} color="#22d3ee" distance={24} />

        <RigModel spin={!interactive} />

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={0.5}
            maxPolarAngle={2.3}
            autoRotate
            autoRotateSpeed={0.6}
          />
        )}
      </Canvas>
    </div>
  )
}
