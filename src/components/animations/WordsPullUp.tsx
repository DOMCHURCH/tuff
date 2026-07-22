import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  text: string
  className?: string
  delay?: number
  stagger?: number
  showAsterisk?: boolean
}

/**
 * Splits text by spaces; each word slides up (y:20 → 0) with a staggered delay,
 * triggered once when scrolled into view. `showAsterisk` places a superscript *
 * on the final word (used on "Prisma").
 */
export default function WordsPullUp({
  text,
  className = '',
  delay = 0,
  stagger = 0.08,
  showAsterisk = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
          >
            <motion.span
              className="inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
            {isLast && showAsterisk && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">
                *
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
