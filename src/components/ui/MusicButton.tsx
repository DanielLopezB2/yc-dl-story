import { useYouTubePlayer } from '../../hooks/useYouTubePlayer'
import { YOUTUBE_VIDEO_ID } from '../../lib/config'

export default function MusicButton() {
  const { containerRef, toggle, isPlaying } = useYouTubePlayer(YOUTUBE_VIDEO_ID)

  return (
    <>
      <div ref={containerRef} className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        aria-pressed={isPlaying}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105"
      >
        <span aria-hidden="true" className="text-lg">
          {isPlaying ? '❙❙' : '♪'}
        </span>
      </button>
    </>
  )
}
