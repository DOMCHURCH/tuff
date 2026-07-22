import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { label: 'HOME', href: '#top', active: true },
  { label: 'STUDIO', href: '#studio' },
  { label: 'ABOUT', href: '#about' },
  { label: 'JOURNAL', href: '#journal' },
  { label: 'REACH US', href: '#reach' },
]

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-white bg-black/30">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl uppercase leading-none tracking-tight text-white text-cine sm:text-3xl">
            Velorah<sup className="text-xs text-acid">®</sup>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 lg:inline">
            [EST. MMXXVI]
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={cn(
                'font-mono text-[11px] uppercase tracking-[0.2em] transition-colors text-cine',
                l.active ? 'text-acid' : 'text-white/70 hover:text-white'
              )}
            >
              {l.label}
            </a>
          ))}
        </div>

        <Button variant="outline" size="nav">
          Begin Journey →
        </Button>
      </nav>
    </header>
  )
}
