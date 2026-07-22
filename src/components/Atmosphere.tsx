// Cinematic overlays that sit above the WebGL stage but below the copy:
// a vignette to focus the eye on the prism, and a whisper of film grain so the
// footage never reads as flat digital video.
export default function Atmosphere() {
  return (
    <>
      <div className="bg-vignette pointer-events-none fixed inset-0 z-[5]" />
      <div className="grain pointer-events-none fixed inset-0 z-[5]" />
    </>
  )
}
