import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'

export default function Hero({ start }: { start: boolean }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!start) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) return
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-line > span', {
        yPercent: 120,
        duration: 0.95,
        stagger: 0.1,
      })
        .from(
          '.hero-meta',
          { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 },
          '-=0.5'
        )
        .from('.hero-sub', { y: 20, opacity: 0, duration: 0.55 }, '-=0.35')
        .from(
          '.hero-cta',
          { y: 18, opacity: 0, duration: 0.45, stagger: 0.08 },
          '-=0.3'
        )
    }, ref)
    return () => ctx.revert()
  }, [start])

  return (
    <section
      id="top"
      ref={ref}
      className="relative z-10 flex min-h-screen flex-col justify-end px-5 pb-8 pt-28 sm:px-8"
    >
      {/* top metadata */}
      <div className="hero-meta mb-auto flex items-start justify-between pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
        <span className="text-cine">( 01 — Studio / Vol. 01 )</span>
        <span className="hidden text-cine sm:block">Digital Spaces / Deep Work</span>
      </div>

      {/* headline */}
      <h1 className="font-display uppercase leading-[0.84] tracking-[-0.02em] text-white text-cine">
        <span className="hero-line line-mask text-[14vw] md:text-[12.5vw]">
          <span className="inline-block">
            Where <span className="text-acid">Dreams</span>
          </span>
        </span>
        <span className="hero-line line-mask text-[14vw] md:text-[12.5vw]">
          <span className="inline-block">Rise Through</span>
        </span>
        <span className="hero-line line-mask text-[14vw] md:text-[12.5vw]">
          <span className="inline-block text-hollow">The Silence</span>
        </span>
      </h1>

      {/* bottom bar: subtext + CTAs */}
      <div className="mt-8 flex flex-col gap-6 border-t-2 border-white/80 pt-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <p className="hero-sub max-w-md font-mono text-sm leading-relaxed text-white/80 text-cine">
          We&rsquo;re designing tools for deep thinkers, bold creators, and quiet
          rebels — digital spaces for sharp focus and inspired work.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="hero-cta" variant="brutal" size="hero">
            Begin Journey
          </Button>
          <Button className="hero-cta" variant="outline" size="hero">
            View Studio
          </Button>
        </div>
      </div>
    </section>
  )
}
