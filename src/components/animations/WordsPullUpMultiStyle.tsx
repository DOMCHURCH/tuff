import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export type Segment = { text: string; className?: string }

type Props = {
  segments: Segment[]
  className?: string
  delay?: number
  stagger?: number
}

/**
 * Like WordsPullUp, but takes styled segments. All segments are split into
 * individual words (preserving each segment's className) and animated with the
 * same staggered pull-up. Words wrap and center as a group.
 */
export default function WordsPullUpMultiStyle({
  segments,
  className = '',
  delay = 0,
  stagger = 0.08,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  const words: Segment[] = []
  segments.forEach((seg) => {
    seg.text
      .split(' ')
      .filter(Boolean)
      .forEach((w) => words.push({ text: w, className: seg.className }))
  })

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ marginRight: '0.25em' }}
        >
          <motion.span
            className={`inline-block ${w.className ?? ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {w.text}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
