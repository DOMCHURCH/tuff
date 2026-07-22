// Placeholder selected-work — swap titles/thumbnails for real projects later.
// Thumbnails reuse stills from the film sequence so the set feels art-directed
// and cohesive rather than stock.
const PROJECTS = [
  { n: '01', title: 'Aurora', cat: 'Film · Direction', year: '2025', img: '/frames/frame_0042.webp' },
  { n: '02', title: 'Meridian', cat: 'Brand Identity', year: '2025', img: '/frames/frame_0104.webp' },
  { n: '03', title: 'Halcyon', cat: 'Motion', year: '2024', img: '/frames/frame_0168.webp' },
  { n: '04', title: 'Solstice', cat: 'Campaign', year: '2024', img: '/frames/frame_0224.webp' },
  { n: '05', title: 'Lumen', cat: 'Art Direction', year: '2024', img: '/frames/frame_0272.webp' },
  { n: '06', title: 'Numen', cat: 'Film', year: '2023', img: '/frames/frame_0306.webp' },
]

export default function Work() {
  return (
    <div className="work-grid">
      {PROJECTS.map((p) => (
        <a key={p.n} href="#contact" className="work-card" data-animate>
          <div className="work-thumb">
            <img src={p.img} alt={p.title} loading="lazy" decoding="async" />
            <span className="work-arrow" aria-hidden>
              ↗
            </span>
          </div>
          <div className="work-meta">
            <span className="work-index">{p.n}</span>
            <h3 className="work-title">{p.title}</h3>
            <span className="work-cat">{p.cat}</span>
            <span className="work-year">{p.year}</span>
          </div>
        </a>
      ))}
    </div>
  )
}
