import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import FrameSequence from '@/components/FrameSequence'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import { Button } from '@/components/ui/button'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 105

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

type Statement = {
  id: string
  index: string
  kicker: string
  align: 'left' | 'right'
  lines: { text: string; accent?: 'acid' | 'hollow' }[]
  body: string
}

const STATEMENTS: Statement[] = [
  {
    id: 'studio',
    index: '01',
    kicker: 'The Studio',
    align: 'left',
    lines: [
      { text: 'In Stillness,' },
      { text: 'Ideas Find' },
      { text: 'Their Edges.', accent: 'acid' },
    ],
    body: 'We move slowly on purpose. Every surface, motion, and word is shaped until it earns its place — nothing louder than it needs to be.',
  },
  {
    id: 'about',
    index: '02',
    kicker: 'The Practice',
    align: 'right',
    lines: [
      { text: 'Depth' },
      { text: 'Over', accent: 'hollow' },
      { text: 'Speed.' },
    ],
    body: 'Built for the ones who go deep — makers who value focus over noise. We design the tools and spaces that protect the work.',
  },
  {
    id: 'journal',
    index: '03',
    kicker: 'The Journal',
    align: 'left',
    lines: [
      { text: 'Focus Is A' },
      { text: 'Form Of', accent: 'acid' },
      { text: 'Resistance.' },
    ],
    body: 'Notes from the quiet. Field studies on attention, craft, and the discipline of building things worth the silence.',
  },
]

export default function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(0)

  const framePath = useCallback(
    (i: number) => `/frames/frame_${String(i).padStart(4, '0')}.webp`,
    []
  )
  const handleReady = useCallback(() => setReady(true), [])
  const handleProgress = useCallback((n: number) => setLoaded(n), [])
  const progress = loaded / FRAME_COUNT

  // Smooth scroll (Lenis) synced to GSAP ticker + ScrollTrigger.
  useEffect(() => {
    if (prefersReducedMotion) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  // Scroll-driven brutalist reveals: hard clip-wipes + parallax numerals.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return
      gsap.utils.toArray<HTMLElement>('[data-wipe]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          }
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-num]').forEach((el) => {
        gsap.to(el, {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, appRef)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready])

  return (
    <div ref={appRef} className="relative">
      {/* Scroll-scrubbed frame sequence — the living background */}
      <FrameSequence
        frameCount={FRAME_COUNT}
        framePath={framePath}
        onReady={handleReady}
        onProgress={handleProgress}
        className="fixed inset-0 z-0"
      />

      {/* Brutalist loader */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-black p-6 transition-opacity duration-500 sm:p-8 ${
          ready ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
          <span>Velorah®</span>
          <span>Est. MMXXVI</span>
        </div>
        <h1 className="font-display text-[16vw] uppercase leading-none tracking-[-0.02em] text-white">
          Loading
        </h1>
        <div>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
            <span>Assets / Frame Sequence</span>
            <span className="text-acid">
              {String(loaded).padStart(3, '0')} / {FRAME_COUNT}
            </span>
          </div>
          <div className="mt-3 h-4 w-full border-2 border-white">
            <div
              className="h-full bg-acid transition-[width] duration-150 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero start={ready} />

        <Marquee
          items={[
            'Deep Work',
            'Sharp Focus',
            'Quiet Rebels',
            'Bold Creators',
            'Est. MMXXVI',
          ]}
        />

        {STATEMENTS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="relative flex min-h-screen items-center overflow-hidden px-5 sm:px-8"
          >
            {/* giant parallax numeral */}
            <span
              data-num
              className={`pointer-events-none absolute top-[6%] font-display text-hollow text-[34vw] leading-none text-white/10 ${
                s.align === 'left' ? 'right-[-2vw]' : 'left-[-2vw]'
              }`}
              aria-hidden="true"
            >
              {s.index}
            </span>

            <div
              className={`relative w-full max-w-2xl ${
                s.align === 'right' ? 'ml-auto' : ''
              }`}
            >
              <div
                data-wipe
                className="border-2 border-white bg-black/45 p-6 brut-shadow sm:p-10"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-acid">
                  [ {s.index} ] {s.kicker}
                </span>
                <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] tracking-[-0.02em] text-white sm:text-7xl">
                  {s.lines.map((l, i) => (
                    <span key={i} className="block">
                      {l.accent === 'acid' ? (
                        <span className="text-acid">{l.text}</span>
                      ) : l.accent === 'hollow' ? (
                        <span className="text-hollow">{l.text}</span>
                      ) : (
                        l.text
                      )}
                    </span>
                  ))}
                </h2>
                <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-white/75">
                  {s.body}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* Finale — solid acid block */}
        <section
          id="reach"
          className="flex min-h-screen items-center justify-center px-5 py-24 sm:px-8"
        >
          <div
            data-wipe
            className="w-full max-w-3xl border-2 border-black bg-acid p-8 brut-shadow sm:p-14"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/70">
              [ 04 ] Reach Us
            </span>
            <h2 className="mt-5 font-display text-4xl uppercase leading-[0.9] tracking-[-0.02em] text-ink sm:text-6xl">
              Let&rsquo;s Make Something Worth The Silence.
            </h2>
            <p className="mt-6 max-w-lg font-mono text-sm leading-relaxed text-ink/80">
              Tell us what you&rsquo;re building. We&rsquo;ll design the quiet
              space it deserves.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                variant="brutal"
                size="block"
                className="border-black bg-ink text-white hover:bg-white hover:text-ink"
              >
                Begin Journey
              </Button>
              <Button
                variant="brutal"
                size="block"
                className="bg-transparent text-ink shadow-none hover:bg-ink hover:text-white"
              >
                hello@velorah.studio
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t-2 border-white bg-black">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div>
              <div className="font-display text-3xl tracking-tight text-white">
                Velorah<sup className="text-xs text-acid">®</sup>
              </div>
              <p className="mt-3 max-w-xs normal-case tracking-normal">
                Digital spaces for deep thinkers, bold creators, and quiet
                rebels.
              </p>
            </div>
            <div className="flex gap-8">
              <span className="hover:text-acid">Instagram</span>
              <span className="hover:text-acid">Are.na</span>
              <span className="hover:text-acid">Email</span>
            </div>
            <div>© MMXXVI — All Rights Reserved</div>
          </div>
        </footer>
      </main>
    </div>
  )
}
