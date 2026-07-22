import { useEffect, useState } from 'react'
import MagneticButton from './MagneticButton'

const LINKS = [
  { label: 'Studio', href: '#ethos' },
  { label: 'Disciplines', href: '#disciplines' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav-bar ${scrolled ? 'nav-bar--solid' : ''}`}>
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="brand">
          Prisma<span className="reg">®</span>
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} className="nav-link" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <MagneticButton href="#contact" variant="ghost">
          Start a project
        </MagneticButton>
      </nav>
    </header>
  )
}
