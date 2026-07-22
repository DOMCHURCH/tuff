import { cn } from '@/lib/utils'

type Props = {
  items: string[]
  className?: string
}

/** Infinite brutalist ticker. The list is duplicated so translateX(-50%) loops seamlessly. */
export default function Marquee({ items, className }: Props) {
  const seq = [...items, ...items]
  return (
    <div
      className={cn(
        'overflow-hidden border-y-2 border-white bg-black/85 py-3',
        className
      )}
    >
      <div className="flex w-max animate-marquee">
        {seq.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-6 whitespace-nowrap px-6 font-mono text-xs uppercase tracking-[0.25em] text-white sm:text-sm"
          >
            {t}
            <span className="text-acid">✳</span>
          </span>
        ))}
      </div>
    </div>
  )
}
