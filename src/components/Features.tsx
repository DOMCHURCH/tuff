import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import WordsPullUpMultiStyle from './animations/WordsPullUpMultiStyle'

const CARD_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

const ICONS = {
  storyboard:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
  critiques:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
  capsule:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
}

const CARDS = [
  {
    num: '01',
    title: 'Project Storyboard.',
    icon: ICONS.storyboard,
    items: [
      'Drag-and-drop scene sequencing',
      'Frame-accurate shot planning',
      'Shared boards for your collective',
      'Version history on every cut',
    ],
  },
  {
    num: '02',
    title: 'Smart Critiques.',
    icon: ICONS.critiques,
    items: [
      'AI analysis of pacing and tone',
      'Creative notes from the network',
      'Integrations with your favorite tools',
    ],
  },
  {
    num: '03',
    title: 'Immersion Capsule.',
    icon: ICONS.capsule,
    items: [
      'Notification silencing for deep focus',
      'Ambient soundscapes to set the mood',
      'Schedule syncing across your team',
    ],
  },
]

const CARD_EASE = [0.22, 1, 0.36, 1] as const

function CardWrap({
  index,
  className,
  children,
}: {
  index: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: CARD_EASE }}
    >
      {children}
    </motion.div>
  )
}

export default function Features() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 py-20 md:px-6 md:py-28">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center gap-1 text-center md:mb-20">
          <WordsPullUpMultiStyle
            className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[
              {
                text: 'Studio-grade workflows for visionary creators.',
                className: 'text-primary',
              },
            ]}
          />
          <WordsPullUpMultiStyle
            className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            delay={0.2}
            segments={[
              {
                text: 'Built for pure vision. Powered by art.',
                className: 'text-gray-500',
              },
            ]}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:grid-cols-4 lg:h-[480px]">
          {/* Card 1 — video */}
          <CardWrap
            index={0}
            className="relative min-h-[280px] overflow-hidden rounded-2xl lg:min-h-0"
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src={CARD_VIDEO}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span
                className="text-lg font-medium"
                style={{ color: '#E1E0CC' }}
              >
                Your creative canvas.
              </span>
            </div>
          </CardWrap>

          {/* Cards 2–4 — checklist */}
          {CARDS.map((card, i) => (
            <CardWrap
              key={card.num}
              index={i + 1}
              className="flex flex-col rounded-2xl bg-[#212121] p-6"
            >
              <div className="mb-6 flex items-start justify-between">
                <img
                  src={card.icon}
                  alt=""
                  loading="lazy"
                  className="h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12"
                />
                <span className="text-xs text-gray-500">{card.num}</span>
              </div>

              <h3
                className="mb-5 text-lg font-medium"
                style={{ color: '#E1E0CC' }}
              >
                {card.title}
              </h3>

              <ul className="flex-1 space-y-3">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm text-primary"
              >
                Learn more
                <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:rotate-0" />
              </a>
            </CardWrap>
          ))}
        </div>
      </div>
    </section>
  )
}
