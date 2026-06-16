import { Canvas } from '@react-three/fiber'
import { AssemblyRig } from './AssemblyRig'

export function AssemblyCanvas({ playToken, className }: { playToken: number; className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [5.6, 2.4, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.05} />
        <directionalLight position={[5, 8, 6]} intensity={2.2} />
        <directionalLight position={[-6, 2, -4]} intensity={0.6} color="#ffe9d2" />
        <pointLight position={[4, -3, 5]} intensity={18} color="#ffffff" distance={26} />

        <AssemblyRig playToken={playToken} />
      </Canvas>
    </div>
  )
}
