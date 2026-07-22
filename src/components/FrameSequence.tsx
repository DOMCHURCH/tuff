import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  /** Number of frames in the sequence. */
  frameCount: number
  /** Given a 1-based frame number, return its URL. */
  framePath: (i: number) => string
  /** Fired once the first frame is drawable (safe to reveal the page). */
  onReady?: () => void
  /** Fired as frames finish decoding, for a loading indicator. */
  onProgress?: (loaded: number, total: number) => void
  className?: string
}

/**
 * Scroll-scrubbed image sequence rendered to a single fixed <canvas>.
 * One draw call per changed frame — no per-frame DOM, compositor-friendly.
 * The frame index is mapped from whole-page scroll progress via GSAP ScrollTrigger,
 * which is kept in sync with Lenis smooth-scroll in App.
 */
export default function FrameSequence({
  frameCount,
  framePath,
  onReady,
  onProgress,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Keep latest callbacks/path without re-running the heavy effect.
  const framePathRef = useRef(framePath)
  framePathRef.current = framePath
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let cancelled = false
    const images: HTMLImageElement[] = new Array(frameCount)
    const loaded: boolean[] = new Array(frameCount).fill(false)
    let loadedCount = 0
    let readyFired = false

    const state = { index: 0 }
    let lastDrawn = -1
    let rafId = 0

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const ratio = getDpr()
      canvas.width = Math.round(w * ratio)
      canvas.height = Math.round(h * ratio)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      lastDrawn = -1 // force a redraw at the new size
    }

    const nearestLoaded = (i: number): number => {
      if (loaded[i]) return i
      for (let d = 1; d < frameCount; d++) {
        if (i - d >= 0 && loaded[i - d]) return i - d
        if (i + d < frameCount && loaded[i + d]) return i + d
      }
      return -1
    }

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      if (!iw || !ih) return
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    const render = () => {
      rafId = requestAnimationFrame(render)
      if (state.index === lastDrawn) return
      const src = nearestLoaded(state.index)
      if (src < 0) return
      drawCover(images[src])
      lastDrawn = state.index
    }

    // Preload every frame.
    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (cancelled) return
        loaded[i] = true
        loadedCount += 1
        onProgressRef.current?.(loadedCount, frameCount)
        if (i === 0) lastDrawn = -1 // draw the first frame the moment it's ready
        if (!readyFired && loaded[0]) {
          readyFired = true
          onReadyRef.current?.()
        }
      }
      img.src = framePathRef.current(i + 1)
      images[i] = img
    }

    resize()
    render()

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        state.index = Math.min(
          frameCount - 1,
          Math.max(0, Math.round(self.progress * (frameCount - 1)))
        )
      },
    })

    const onResize = () => {
      resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    // Re-measure once layout/fonts settle so scrub maps to the true page height.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 250)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(refreshId)
      window.removeEventListener('resize', onResize)
      st.kill()
    }
  }, [frameCount])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
