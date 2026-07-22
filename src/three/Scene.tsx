import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import FilmBackdrop from './FilmBackdrop'
import Prism from './Prism'
import Cards from './Cards'
import CameraRig from './CameraRig'

// The WebGL stage. Transparent canvas so the scrubbed film reads straight
// through the glass; the prism and cards share one depth buffer so occlusion is
// real, not faked. Sits above the frames, below the DOM copy, and ignores
// pointer events so scrolling and links stay native.
export default function Scene() {
  const mobile = useMemo(() => window.matchMedia('(max-width: 768px)').matches, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, mobile ? 1.3 : 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0.15, 6.2], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.08
          gl.setClearColor('#05060a', 1)
        }}
      >
        <Suspense fallback={null}>
          <FilmBackdrop mobile={mobile} />
          {/* Key + fill so the glass has crisp specular highlights. */}
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 5, 6]} intensity={1.1} />
          <directionalLight position={[-5, -2, -3]} intensity={0.4} color="#8ea8ff" />

          {/* Coloured light bars → iridescent reflections that feed the prism's
              chromatic dispersion. Baked once for performance. */}
          <Environment resolution={mobile ? 128 : 256} frames={1}>
            <color attach="background" args={['#05060a']} />
            <Lightformer intensity={2.2} position={[0, 3, 3]} scale={[7, 7, 1]} color="#cfe0ff" />
            <Lightformer intensity={1.6} position={[-4.5, 1, 2]} scale={[4, 8, 1]} color="#ff9ecb" />
            <Lightformer intensity={1.5} position={[4.5, -1.5, 2]} scale={[4, 8, 1]} color="#9dffe0" />
            <Lightformer intensity={2.6} position={[0, -3.5, -4]} scale={[10, 5, 1]} color="#ffffff" />
            <Lightformer intensity={1.2} position={[0, 4, -5]} scale={[10, 3, 1]} color="#a9c2ff" />
          </Environment>

          <Prism mobile={mobile} />
          <Cards mobile={mobile} />
          <CameraRig />
          <AdaptiveDpr pixelated={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
