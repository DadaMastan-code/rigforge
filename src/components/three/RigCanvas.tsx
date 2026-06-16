import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RigModel } from './RigModel'

interface Props {
  interactive?: boolean
  demo?: boolean
  className?: string
}

export function RigCanvas({ interactive = false, demo = false, className }: Props) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [5.6, 2.4, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
        style={{ background: 'transparent' }}
      >
        {/* Bright, neutral studio lighting for the light/matte scene. */}
        <ambientLight intensity={1.05} />
        <directionalLight position={[5, 8, 6]} intensity={2.2} />
        <directionalLight position={[-6, 2, -4]} intensity={0.6} color="#ffe9d2" />
        <pointLight position={[4, -3, 5]} intensity={18} color="#ffffff" distance={26} />

        <RigModel spin={!interactive} demo={demo} />

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
