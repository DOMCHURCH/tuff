import { useEffect, useRef } from 'react'
import { scrollStore } from '../lib/scroll'

// Hairline progress rule at the very top — reads directly from the scroll store,
// no React re-renders.
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    let alive = true
    const tick = () => {
      if (!alive) return
      const el = ref.current
      if (el) el.style.transform = `scaleX(${scrollStore.progress})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-50 h-px w-full origin-left bg-white/60"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}
