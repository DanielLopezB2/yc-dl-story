import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const CONFETTI_COUNT = 40
const COLORS = ['var(--color-gold)', '#f3d98b', 'var(--color-primary)']

export default function ConfettiBurst() {
  const reducedMotion = useReducedMotion()

  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.4,
        drift: (Math.random() - 0.5) * 200,
        rotate: Math.random() * 360,
        color: COLORS[index % COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    [],
  )

  if (reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.4,
            backgroundColor: piece.color,
          }}
          initial={{ y: '-5vh', x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '105vh', x: piece.drift, opacity: [1, 1, 0], rotate: piece.rotate }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
