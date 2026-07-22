import { useRef } from 'react'
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// A magnetic button: the label leans toward the cursor on a snappy spring and
// springs back on leave. Press feedback is <250ms. Small, deliberate, premium.
export default function MagneticButton({
  children,
  href,
  variant = 'primary',
}: {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'ghost'
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springCfg = { stiffness: 220, damping: 15, mass: 0.4 }
  const sx = useSpring(x, springCfg)
  const sy = useSpring(y, springCfg)

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={`magnetic ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`}
    >
      <span>{children}</span>
    </motion.a>
  )
}
