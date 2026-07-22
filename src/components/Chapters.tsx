import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Chapter from './Chapter'
import MagneticButton from './MagneticButton'

const DISCIPLINES = ['Direction', 'Motion', 'Identity', 'Film', 'Sound', 'Story', 'Light', 'Form']

export default function Chapters() {
  const hero = useRef<HTMLElement>(null)

  // Hero animates on load (not scroll) — a composed, unhurried entrance.
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
      {/* HERO — text hugs the frame so the prism owns the centre */}
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
            Prisma is a global collective of directors, filmmakers and designers crafting work that
            refracts the ordinary into something luminous.
          </p>
          <div className="hero-cta" data-hero>
            <MagneticButton href="#work" variant="primary">
              Enter the studio
            </MagneticButton>
            <MagneticButton href="#disciplines" variant="ghost">
              Watch showreel
            </MagneticButton>
          </div>
        </div>
        <div className="scroll-hint" data-hero>
          <span>Scroll</span>
          <i />
        </div>
      </section>

      {/* 01 — ETHOS */}
      <Chapter id="ethos" align="left">
        <p className="eyebrow" data-animate>
          01 — Ethos
        </p>
        <h2 className="headline" data-animate>
          Every frame is a decision.
        </h2>
        <p className="body" data-animate>
          We treat motion as language. Nothing is decorative; every cut, every glint of dispersion
          earns its place. The result feels inevitable — the quiet signature of work made by hand.
        </p>
      </Chapter>

      {/* 02 — DISCIPLINES */}
      <Chapter id="disciplines" align="left">
        <p className="eyebrow" data-animate>
          02 — Disciplines
        </p>
        <h2 className="headline" data-animate>
          Eight ways we shape light.
        </h2>
        <ul className="disciplines" data-animate>
          {DISCIPLINES.map((d, i) => (
            <li key={d}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {d}
            </li>
          ))}
        </ul>
      </Chapter>

      {/* 03 — WORK */}
      <Chapter id="work" align="left">
        <p className="eyebrow" data-animate>
          03 — Selected work
        </p>
        <h2 className="headline" data-animate>
          Made for brands who refuse the ordinary.
        </h2>
        <p className="body" data-animate>
          Campaigns, films and identities for people who understand that the way a thing moves is
          the way it is remembered.
        </p>
      </Chapter>

      {/* CONTACT — solid panel closes over the stage */}
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
