import { useEffect, useState } from 'react'

export function useElapsedSince(dateString: string) {
  const [elapsed, setElapsed] = useState(() => Date.now() - new Date(dateString).getTime())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsed(Date.now() - new Date(dateString).getTime())
    }, 1000)
    return () => window.clearInterval(interval)
  }, [dateString])

  return elapsed
}

export function formatElapsed(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}
