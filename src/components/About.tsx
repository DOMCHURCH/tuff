import WordsPullUpMultiStyle from './animations/WordsPullUpMultiStyle'
import ScrollRevealText from './animations/ScrollRevealText'

export default function About() {
  return (
    <section className="bg-black px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-6 py-16 text-center md:rounded-[2rem] md:px-16 md:py-24">
        <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
          Visual arts
        </p>

        <h2
          className="mx-auto max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          style={{ color: '#E1E0CC' }}
        >
          <WordsPullUpMultiStyle
            segments={[
              { text: 'I am Marcus Chen,', className: 'font-normal' },
              {
                text: 'a self-taught director.',
                className: 'italic font-serif',
              },
              {
                text: 'I have skills in color grading, visual effects, and narrative design.',
                className: 'font-normal',
              },
            ]}
          />
        </h2>

        <div className="mx-auto mt-12 max-w-2xl">
          <ScrollRevealText
            text="Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
            className="text-xs leading-relaxed text-[#DEDBC8] sm:text-sm md:text-base"
          />
        </div>
      </div>
    </section>
  )
}
