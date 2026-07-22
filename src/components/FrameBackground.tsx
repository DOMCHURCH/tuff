import { useEffect, useRef, useState } from 'react'
import { scrollStore, clamp } from '../lib/scroll'

const FRAME_COUNT = 313
const pad = (n: number) => String(n).padStart(4, '0')

// Lightweight, GPU-cheap cinematic background: a single 2D canvas whose visible
// frame is driven directly by scroll position. Not a <video> — every frame is a
// still, so scrolling scrubs forward and back deterministically. Frames stream
// in progressively; until the exact frame decodes we paint the nearest one.
export default function FrameBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const mobile = window.matchMedia('(max-width: 768px)').matches
    const dir = mobile ? '/frames-mobile' : '/frames'
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null)

    let disposed = false
    let raf = 0
    let lastIdx = -1
    let vw = 0
    let vh = 0
    let firstPainted = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      vw = window.innerWidth
      vh = window.innerHeight
      canvas.width = Math.floor(vw * dpr)
      canvas.height = Math.floor(vh * dpr)
      canvas.style.width = `${vw}px`
      canvas.style.height = `${vh}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#05060a'
      ctx.fillRect(0, 0, vw, vh)
      lastIdx = -1
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        images[i] = img
        if (!firstPainted) setReady(true)
      }
      img.src = `${dir}/frame_${pad(i + 1)}.webp`
    }

    const nearestLoaded = (idx: number) => {
      if (images[idx]) return idx
      for (let r = 1; r < FRAME_COUNT; r++) {
        if (idx - r >= 0 && images[idx - r]) return idx - r
        if (idx + r < FRAME_COUNT && images[idx + r]) return idx + r
      }
      return -1
    }

    const drawCover = (img: HTMLImageElement) => {
      const scale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (vw - w) / 2, (vh - h) / 2, w, h)
    }

    const tick = () => {
      if (disposed) return
      const idx = Math.round(clamp(scrollStore.progress) * (FRAME_COUNT - 1))
      if (idx !== lastIdx) {
        const use = nearestLoaded(idx)
        const img = use >= 0 ? images[use] : null
        if (img) {
          drawCover(img)
          firstPainted = true
          if (use === idx) lastIdx = idx
        }
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(tick)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full" />
}
