import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// A scroll chapter. Children marked [data-animate] rise, unblur and fade in on a
// swift ease-out-expo curve as the chapter enters — and reverse on the way back,
// so scrubbing up feels as intentional as scrubbing down. gsap.context keeps
// StrictMode's double-mount clean.
export default function Chapter({
  id,
  children,
  align = 'center',
  solid = false,
  className = '',
}: {
  id?: string
  children: ReactNode
  align?: 'center' | 'left'
  solid?: boolean
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-animate]', el)
      if (!items.length) return
      gsap.set(items, { y: 44, autoAlpha: 0, filter: 'blur(10px)' })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 78%',
        onEnter: () =>
          gsap.to(items, {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.08,
          }),
        onLeaveBack: () =>
          gsap.to(items, {
            y: 44,
            autoAlpha: 0,
            filter: 'blur(10px)',
            duration: 0.4,
            ease: 'power2.in',
            stagger: 0.03,
          }),
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      className={`chapter ${align === 'center' ? 'chapter--center' : 'chapter--left'} ${
        solid ? 'chapter--solid' : ''
      } ${className}`}
    >
      {children}
    </section>
  )
}
