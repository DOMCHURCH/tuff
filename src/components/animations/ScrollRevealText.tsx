import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

function AnimatedLetter({
  char,
  progress,
  range,
}: {
  char: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

/**
 * Progressive character reveal driven by scroll. Each character's opacity
 * eases from 0.2 → 1 as the paragraph passes through the viewport, staggered
 * by the character's position in the string.
 */
export default function ScrollRevealText({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const words = text.split(' ')
  const totalLetters = text.replace(/ /g, '').length
  let idx = 0

  return (
    <p ref={ref} className={className}>
      {words.map((word, wi) => {
        const letters = word.split('').map((ch) => {
          const cp = idx / totalLetters
          const range: [number, number] = [cp - 0.1, cp + 0.05]
          const node = (
            <AnimatedLetter
              key={idx}
              char={ch}
              progress={scrollYProgress}
              range={range}
            />
          )
          idx += 1
          return node
        })
        return (
          <span key={wi}>
            <span className="inline-block">{letters}</span>
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </p>
  )
}
