import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const PETAL_COUNT = 10

export default function FallingPetals() {
  const reducedMotion = useReducedMotion()

  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 9 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 80,
        size: 8 + Math.random() * 8,
      })),
    [],
  )

  if (reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute top-0 rounded-full bg-primary/50"
          style={{ left: `${petal.left}%`, width: petal.size, height: petal.size * 1.6 }}
          initial={{ y: '-10vh', x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', x: petal.drift, opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
