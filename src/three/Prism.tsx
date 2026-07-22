import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import { scrollStore, Spring } from '../lib/scroll'

// The reference render is a four-sided glass pyramid with heavy dispersion.
// A low-radial-segment cone gives exactly that silhouette; flat shading keeps
// the facets crisp so reflections read as sharp glass rather than a blob.
export default function Prism({ mobile }: { mobile: boolean }) {
  const group = useRef<Group>(null)
  const mesh = useRef<Mesh>(null)

  // Real spring, not a lerp — the prism carries a little inertia so it "settles"
  // into each scroll position with weight instead of tracking linearly.
  const spinY = useMemo(() => new Spring(0, 70, 14), [])
  const clock = useRef(0)
  const intro = useRef(0)

  useFrame((_state, delta) => {
    const g = group.current
    const m = mesh.current
    if (!g || !m) return
    clock.current += delta

    // Scroll drives ~2.5 full turns across the whole page. Spring interpolation
    // means fast scrolls overshoot slightly and ease back — the handcrafted feel.
    spinY.target = scrollStore.progress * Math.PI * 5
    m.rotation.y = spinY.step(delta)

    // Idle life: a slow breathing tilt so the prism never looks frozen, while
    // staying centred and stable as the brief demands.
    m.rotation.x = 0.08 + Math.sin(clock.current * 0.45) * 0.035
    m.rotation.z = Math.cos(clock.current * 0.32) * 0.02
    g.position.y = Math.sin(clock.current * 0.6) * 0.04

    // One-shot scale/opacity intro so it doesn't just pop in.
    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + delta * 0.9)
      const e = 1 - Math.pow(1 - intro.current, 3) // ease-out-cubic
      g.scale.setScalar(0.6 + e * 0.4)
    }
  })

  return (
    <group ref={group} scale={0.6}>
      <mesh ref={mesh}>
        <coneGeometry args={[1.16, 1.95, 4, 1]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.25}
          roughness={0.02}
          ior={1.5}
          chromaticAberration={mobile ? 0.5 : 0.95}
          anisotropicBlur={0.1}
          distortion={0.2}
          distortionScale={0.35}
          temporalDistortion={0.06}
          samples={mobile ? 5 : 9}
          resolution={mobile ? 256 : 512}
          clearcoat={1}
          clearcoatRoughness={0.06}
          attenuationColor="#f2f5ff"
          attenuationDistance={3.2}
          color="#ffffff"
          flatShading
        />
      </mesh>
    </group>
  )
}
