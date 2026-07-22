import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, MeshBasicMaterial, MeshPhysicalMaterial } from 'three'
import { scrollStore, smoothstep } from '../lib/scroll'

const LABELS = ['Direction', 'Motion', 'Identity', 'Film', 'Sound', 'Story', 'Light', 'Form']

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

// A crisp, Queue-inspired card face painted to a canvas so text stays sharp and
// unlit (readable) rather than smeared through the glass.
function makeCardTexture(label: string, idx: number) {
  const w = 512
  const h = 690
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!

  const grad = g.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, 'rgba(255,255,255,0.12)')
  grad.addColorStop(1, 'rgba(210,225,255,0.03)')
  roundRect(g, 2, 2, w - 4, h - 4, 46)
  g.fillStyle = grad
  g.fill()
  g.lineWidth = 2
  g.strokeStyle = 'rgba(255,255,255,0.32)'
  g.stroke()

  g.fillStyle = 'rgba(255,255,255,0.72)'
  g.font = '600 28px Inter, system-ui, sans-serif'
  g.fillText(String(idx + 1).padStart(2, '0'), 44, 72)

  g.beginPath()
  g.arc(w - 56, 60, 7, 0, Math.PI * 2)
  g.fillStyle = 'rgba(170,210,255,0.95)'
  g.fill()

  g.fillStyle = 'rgba(255,255,255,0.97)'
  g.font = '400 74px "Instrument Serif", Georgia, serif'
  g.fillText(label, 42, h * 0.6)

  g.strokeStyle = 'rgba(255,255,255,0.16)'
  g.lineWidth = 1
  g.beginPath()
  g.moveTo(44, h * 0.71)
  g.lineTo(w - 44, h * 0.71)
  g.stroke()

  g.fillStyle = 'rgba(255,255,255,0.5)'
  g.font = '500 22px Inter, system-ui, sans-serif'
  g.fillText('PRISMA · STUDIO', 44, h * 0.8)

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 4
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

// ---------------------------------------------------------------------------
// A single orbiting card. Each card lives on a 180° arc that begins directly
// BEHIND the prism (occluded by the shared depth buffer), swings out to the
// side, and arrives in front of it — then dissolves, wrapping seamlessly. With
// several cards evenly phased, one always enters as another leaves, so the
// stream reads as endless and nothing is ever visibly born or destroyed.
// ---------------------------------------------------------------------------
function Card({ index, count }: { index: number; count: number }) {
  const group = useRef<Group>(null)
  const glass = useRef<MeshPhysicalMaterial>(null)
  const face = useRef<MeshBasicMaterial>(null)
  const { camera } = useThree()

  const tex = useMemo(() => makeCardTexture(LABELS[index % LABELS.length], index), [index])
  const side = index % 2 === 0 ? 1 : -1
  const radius = 2.5 + (index % 3) * 0.22 // layered depth
  const yOff = ((index % 3) - 1) * 0.42
  const speed = 0.045 * (1 + (index % 4) * 0.07) // slightly different speeds
  const phase0 = index / count // even spacing = seamless replacement
  const t = useRef(0)

  useFrame((_state, delta) => {
    const g = group.current
    if (!g) return
    t.current += delta

    // Scroll advances the orbit; a slow autonomous drift keeps it alive at rest.
    let p = (phase0 + scrollStore.progress * 1.5 + t.current * speed) % 1
    if (p < 0) p += 1

    const angle = Math.PI * (1 - p) // p:0 -> behind prism, p:1 -> in front
    g.position.set(
      side * radius * Math.sin(angle),
      yOff + Math.sin(t.current * 0.5 + index) * 0.06,
      radius * Math.cos(angle),
    )

    // Tilt toward the camera, then add a subtle orbital yaw + drift so it never
    // reads as a flat billboard — weightless but physically believable.
    g.lookAt(camera.position)
    g.rotateY(side * (1 - Math.abs(Math.cos(angle))) * 0.32)
    g.rotateZ(Math.sin(t.current * 0.6 + index) * 0.05)
    g.rotateX(-0.09)

    const opacity = smoothstep(0, 0.12, p) * (1 - smoothstep(0.86, 1, p))
    if (glass.current) glass.current.opacity = opacity * 0.92
    if (face.current) face.current.opacity = opacity
  })

  return (
    <group ref={group}>
      <RoundedBox args={[1.15, 1.55, 0.06]} radius={0.09} smoothness={4}>
        <meshPhysicalMaterial
          ref={glass}
          transmission={0.68}
          thickness={0.5}
          roughness={0.26}
          ior={1.3}
          clearcoat={1}
          clearcoatRoughness={0.35}
          reflectivity={0.45}
          color="#dfe8ff"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[1.05, 1.42]} />
        <meshBasicMaterial ref={face} map={tex} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function Cards({ mobile }: { mobile: boolean }) {
  const count = mobile ? 5 : 7
  const cards = useMemo(() => Array.from({ length: count }, (_, i) => i), [count])
  return (
    <group>
      {cards.map((i) => (
        <Card key={i} index={i} count={count} />
      ))}
    </group>
  )
}
