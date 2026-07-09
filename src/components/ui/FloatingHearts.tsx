import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const HEART_COUNT = 6

export default function FloatingHearts() {
  const reducedMotion = useReducedMotion()

  const hearts = useMemo(
    () =>
      Array.from({ length: HEART_COUNT }, (_, index) => ({
        id: index,
        left: 5 + Math.random() * 90,
        delay: Math.random() * 6,
        duration: 10 + Math.random() * 6,
        size: 14 + Math.random() * 12,
      })),
    [],
  )

  if (reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute bottom-0 text-primary/40"
          style={{ left: `${heart.left}%`, fontSize: heart.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: '-110vh', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}
