import SmoothScroll from './components/SmoothScroll'
import Scene from './three/Scene'
import Atmosphere from './components/Atmosphere'
import Nav from './components/Nav'
import Chapters from './components/Chapters'
import ScrollProgress from './components/ScrollProgress'

// One scroll timeline, layered:
//   z0   WebGL stage — scrubbed film backdrop + glass prism + orbiting cards
//        (all share one depth buffer, so the prism truly refracts the film)
//   z5   atmosphere — vignette + grain
//   z20  narrative copy + micro-interactions
export default function App() {
  return (
    <SmoothScroll>
      <span id="top" />
      <ScrollProgress />
      <Scene />
      <Atmosphere />
      <Nav />
      <main className="relative z-20">
        <Chapters />
      </main>
    </SmoothScroll>
  )
}
