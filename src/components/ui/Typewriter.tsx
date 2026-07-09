import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  onDone?: () => void
}

export default function Typewriter({ text, speed = 35, className, onDone }: TypewriterProps) {
  const reducedMotion = useReducedMotion()
  const [visibleChars, setVisibleChars] = useState(reducedMotion ? text.length : 0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (reducedMotion) {
      setVisibleChars(text.length)
      onDoneRef.current?.()
      return
    }

    setVisibleChars(0)
    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setVisibleChars(index)
      if (index >= text.length) {
        window.clearInterval(interval)
        onDoneRef.current?.()
      }
    }, speed)

    return () => window.clearInterval(interval)
  }, [text, speed, reducedMotion])

  return (
    <p className={className}>
      {text.slice(0, visibleChars)}
      {visibleChars < text.length && (
        <span aria-hidden="true" className="animate-pulse">
          |
        </span>
      )}
    </p>
  )
}
