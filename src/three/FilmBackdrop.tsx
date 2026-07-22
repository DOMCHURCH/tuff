import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh, PerspectiveCamera } from 'three'
import { scrollStore, clamp } from '../lib/scroll'

const FRAME_COUNT = 313
const pad = (n: number) => String(n).padStart(4, '0')

// The scrubbed film, rendered INSIDE the WebGL scene as a plane locked to the
// camera and scaled to cover the frustum. Because it lives in the scene, the
// glass prism's transmission material refracts and disperses it — you see the
// sky bent through the crystal with chromatic fringing, like the reference.
//
// Note: the backing canvas is created ONCE at native frame size and never
// resized — reassigning canvas.width after a CanvasTexture binds to it blanks
// the GPU texture. Cover-fit is done with the plane's scale, not the canvas.
export default function FilmBackdrop({ mobile }: { mobile: boolean }) {
  const meshRef = useRef<Mesh>(null)
  const { camera, size } = useThree()
  const fwd = useMemo(() => new THREE.Vector3(), [])

  const cw = mobile ? 828 : 1600
  const ch = mobile ? 462 : 892
  const planeAspect = cw / ch

  const { ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = cw
    c.height = ch
    const g = c.getContext('2d', { alpha: false })!
    g.fillStyle = '#05060a'
    g.fillRect(0, 0, cw, ch)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    return { ctx: g, texture: t }
  }, [cw, ch])

  const dir = mobile ? '/frames-mobile' : '/frames'
  const images = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null))
  const lastIdx = useRef(-1)

  useEffect(() => {
    const imgs = images.current
    let disposed = false
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (!disposed) imgs[i] = img
      }
      img.src = `${dir}/frame_${pad(i + 1)}.webp`
    }
    return () => {
      disposed = true
    }
  }, [dir])

  const nearestLoaded = (idx: number) => {
    const imgs = images.current
    if (imgs[idx]) return idx
    for (let r = 1; r < FRAME_COUNT; r++) {
      if (idx - r >= 0 && imgs[idx - r]) return idx - r
      if (idx + r < FRAME_COUNT && imgs[idx + r]) return idx + r
    }
    return -1
  }

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return

    // Lock to the camera and cover the frustum at a fixed depth behind the prism.
    const dist = 16
    const vFov = ((camera as PerspectiveCamera).fov * Math.PI) / 180
    const frustumH = 2 * Math.tan(vFov / 2) * dist
    const frustumW = frustumH * (size.width / Math.max(1, size.height))
    const planeH = Math.max(frustumH, frustumW / planeAspect) * 1.04 // cover + margin
    const planeW = planeH * planeAspect

    fwd.set(0, 0, -1).applyQuaternion(camera.quaternion)
    mesh.position.copy(camera.position).addScaledVector(fwd, dist)
    mesh.lookAt(camera.position)
    mesh.scale.set(planeW, planeH, 1)

    const idx = Math.round(clamp(scrollStore.progress) * (FRAME_COUNT - 1))
    if (idx !== lastIdx.current) {
      const use = nearestLoaded(idx)
      const img = use >= 0 ? images.current[use] : null
      if (img) {
        ctx.drawImage(img, 0, 0, cw, ch)
        texture.needsUpdate = true
        if (use === idx) lastIdx.current = idx
      }
    }
  })

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
    </mesh>
  )
}
