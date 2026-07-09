import { useCallback, useEffect, useRef, useState } from 'react'

interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  destroy(): void
}

interface YTPlayerEvent {
  data: number
}

interface YTNamespace {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string
      playerVars?: Record<string, number>
      events?: {
        onReady?: () => void
        onStateChange?: (event: YTPlayerEvent) => void
      }
    },
  ) => YTPlayer
  PlayerState: { PLAYING: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YTNamespace> | null = null

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT as YTNamespace)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })

  return apiPromise
}

export function useYouTubePlayer(videoId: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let cancelled = false
    // YouTube's IFrame API replaces its mount node with an <iframe>, which would
    // desync React's fiber tree if that node were React-managed. Mounting on a
    // plain DOM node created outside React's tree keeps the two isolated.
    const mountPoint = document.createElement('div')
    containerRef.current?.appendChild(mountPoint)

    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      playerRef.current = new YT.Player(mountPoint, {
        videoId,
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (event) => setIsPlaying(event.data === YT.PlayerState.PLAYING),
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
      mountPoint.remove()
    }
  }, [videoId])

  const toggle = useCallback(() => {
    if (!playerRef.current || !isReady) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying, isReady])

  return { containerRef, isReady, isPlaying, toggle }
}
