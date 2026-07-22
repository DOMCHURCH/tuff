import SmoothScroll from './components/SmoothScroll'
import FrameBackground from './components/FrameBackground'
import Atmosphere from './components/Atmosphere'
import Nav from './components/Nav'
import Chapters from './components/Chapters'
import ScrollProgress from './components/ScrollProgress'

// Lean luxury portfolio:
//   z0   scroll-scrubbed cinematic film (2D canvas — GPU-cheap)
//   z5   atmosphere — vignette + grain for legibility and film feel
//   z20  editorial content: hero, studio, selected work, capabilities, contact
export default function App() {
  return (
    <SmoothScroll>
      <span id="top" />
      <ScrollProgress />
      <FrameBackground />
      <Atmosphere />
      <Nav />
      <main className="relative z-20">
        <Chapters />
      </main>
    </SmoothScroll>
  )
}
