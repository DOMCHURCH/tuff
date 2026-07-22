import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Chapter from './Chapter'
import Work from './Work'
import MagneticButton from './MagneticButton'

const CAPABILITIES = [
  'Direction',
  'Brand Identity',
  'Motion',
  'Film',
  'Art Direction',
  'Campaigns',
]

export default function Chapters() {
  const hero = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = hero.current
    if (!el) return
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-hero]', el)
      gsap.set(items, { y: 40, autoAlpha: 0, filter: 'blur(12px)' })
      gsap.to(items, {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 0.3,
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* HERO */}
      <section ref={hero} className="chapter chapter--hero">
        <div className="hero-top">
          <p className="eyebrow" data-hero>
            Creative studio — worldwide
          </p>
          <h1 className="display" data-hero>
            We bend light
            <br />
            <em>into stories.</em>
          </h1>
        </div>
        <div className="hero-bottom">
          <p className="lede" data-hero>
            Prisma is an independent studio for directors, filmmakers and designers — making work
            that refracts the ordinary into something luminous.
          </p>
          <div className="hero-cta" data-hero>
            <MagneticButton href="#work" variant="primary">
              View work
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Get in touch
            </MagneticButton>
          </div>
        </div>
        <div className="scroll-hint" data-hero>
          <span>Scroll</span>
          <i />
        </div>
      </section>

      {/* 01 — MANIFESTO */}
      <Chapter id="studio" align="left">
        <p className="eyebrow" data-animate>
          01 — Studio
        </p>
        <h2 className="headline" data-animate>
          A small studio with an obsessive eye for motion and light.
        </h2>
        <p className="body" data-animate>
          We partner with a handful of clients a year, going deep rather than wide. Every frame is a
          decision; nothing is decorative. The result feels inevitable — the quiet signature of work
          made by hand.
        </p>
      </Chapter>

      {/* 02 — SELECTED WORK */}
      <Chapter id="work" align="left" className="chapter--flow">
        <div className="full">
          <div className="section-head" data-animate>
            <p className="eyebrow">02 — Selected work</p>
            <h2 className="headline">Recent chapters.</h2>
          </div>
          <Work />
        </div>
      </Chapter>

      {/* 03 — CAPABILITIES */}
      <Chapter id="capabilities" align="left">
        <p className="eyebrow" data-animate>
          03 — Capabilities
        </p>
        <h2 className="headline" data-animate>
          What we shape.
        </h2>
        <ul className="disciplines" data-animate>
          {CAPABILITIES.map((d, i) => (
            <li key={d}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {d}
            </li>
          ))}
        </ul>
      </Chapter>

      {/* CONTACT */}
      <Chapter id="contact" align="center" solid>
        <p className="eyebrow" data-animate>
          Let&rsquo;s talk
        </p>
        <h2 className="display display--sm" data-animate>
          Make something
          <br />
          <em>luminous.</em>
        </h2>
        <div className="hero-cta" data-animate>
          <MagneticButton href="mailto:hello@prisma.studio" variant="primary">
            hello@prisma.studio
          </MagneticButton>
        </div>
        <div className="footer-meta" data-animate>
          <span>© Prisma Studio</span>
          <span>Refracting light, worldwide</span>
        </div>
      </Chapter>
    </>
  )
}
