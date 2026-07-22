import { useThree, useFrame } from '@react-three/fiber'
import { scrollStore, pointer, damp } from '../lib/scroll'

// Subtle, cinematic camera. It orbits the prism a little as you scroll and
// answers gently to the pointer for parallax — but it always looks back at the
// origin, so the prism stays locked to the centre as the focal point while the
// world drifts around it. Never enough movement to distract.
export default function CameraRig() {
  const { camera } = useThree()

  useFrame((_state, delta) => {
    const p = scrollStore.progress

    // A gentle arc: swing ~±0.4rad across the page, plus pointer nudge.
    const orbit = Math.sin(p * Math.PI * 2) * 0.4 + pointer.x * 0.22
    const lift = Math.sin(p * Math.PI) * 0.35 + -pointer.y * 0.16
    const radius = 6.2 - p * 0.7 // ease closer as the story progresses

    const tx = Math.sin(orbit) * radius
    const tz = Math.cos(orbit) * radius
    const ty = 0.15 + lift

    camera.position.x = damp(camera.position.x, tx, 2.6, delta)
    camera.position.y = damp(camera.position.y, ty, 2.6, delta)
    camera.position.z = damp(camera.position.z, tz, 2.6, delta)
    camera.lookAt(0, 0, 0)
  })

  return null
}
