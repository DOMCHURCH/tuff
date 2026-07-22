// ---------------------------------------------------------------------------
// Single source of truth for the scroll timeline.
//
// Everything cinematic — the frame background, the prism rotation, the orbiting
// cards, and the camera — reads from this module every animation frame. We keep
// it OUTSIDE React state on purpose: driving 60fps motion through React renders
// would thrash. Lenis writes here on scroll; consumers read in their RAF/useFrame.
// ---------------------------------------------------------------------------

export const scrollStore = {
  progress: 0, // normalised 0..1 across the whole document
  velocity: 0, // signed scroll velocity from Lenis
  raw: 0, // absolute scroll position in px
}

// Normalised pointer, -1..1 on each axis, origin at viewport centre.
// Used for gentle camera parallax.
export const pointer = { x: 0, y: 0 }

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Frame-rate independent exponential damping. `lambda` is the approach rate.
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * Math.min(dt, 1 / 30)))

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

// A real second-order spring (position + velocity). Feels weightier and more
// "handcrafted" than a plain lerp for the prism rotation and card motion.
export class Spring {
  value: number
  target: number
  velocity = 0
  private stiffness: number
  private damping: number

  constructor(value = 0, stiffness = 90, damping = 16) {
    this.value = value
    this.target = value
    this.stiffness = stiffness
    this.damping = damping
  }

  step(dt: number) {
    // Sub-step + clamp for stability when the tab was backgrounded.
    const h = Math.min(dt, 1 / 30)
    const accel = (this.target - this.value) * this.stiffness - this.velocity * this.damping
    this.velocity += accel * h
    this.value += this.velocity * h
    return this.value
  }
}
