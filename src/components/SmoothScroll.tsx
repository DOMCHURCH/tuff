import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollStore, pointer, clamp } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// The canonical Lenis + GSAP marriage.
//   - Lenis drives the real window scroll (buttery inertia).
//   - GSAP's ticker drives Lenis' RAF so there is ONE clock.
//   - ScrollTrigger.update() fires on every Lenis scroll so scrubbed triggers
//     never displace or jitter.
//   - We mirror the normalised progress into scrollStore for the WebGL stage.
// ---------------------------------------------------------------------------
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.09,
      smoothWheel: !reduce,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    // Lenis 1.x passes the instance to the scroll callback.
    const onScroll = (e: { scroll: number; limit: number; velocity: number; progress: number }) => {
      ScrollTrigger.update()
      scrollStore.raw = e.scroll
      scrollStore.progress = clamp(Number.isFinite(e.progress) ? e.progress : e.scroll / (e.limit || 1))
      scrollStore.velocity = e.velocity
    }
    lenis.on('scroll', onScroll)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Expose the instance for anchor links + automated visual QA.
    ;(window as unknown as { __lenis?: unknown }).__lenis = lenis

    // Pointer parallax — normalised to -1..1, centre origin.
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    // Smooth in-page anchor navigation through Lenis.
    const onClick = (ev: MouseEvent) => {
      const anchor = (ev.target as HTMLElement)?.closest?.('a[href^="#"]')
      const id = anchor?.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (target) {
        ev.preventDefault()
        lenis.scrollTo(target as HTMLElement)
      }
    }
    document.addEventListener('click', onClick)

    // Re-measure once fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh()
    const rid = window.setTimeout(refresh, 300)

    return () => {
      window.clearTimeout(rid)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return <>{children}</>
}
