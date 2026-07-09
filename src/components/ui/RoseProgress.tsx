import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface RoseProgressProps {
  total: number
  completed: number
}

type FlowerState = 'bloomed' | 'active' | 'locked'

function Flower({ state }: { state: FlowerState }) {
  const petalFill = state === 'locked' ? 'var(--color-locked)' : 'var(--color-primary)'
  const centerFill = state === 'locked' ? 'var(--color-locked)' : 'var(--color-gold)'
  const petalOpacity = state === 'locked' ? 0.6 : 1

  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <circle cx="12" cy="7" r="4" fill={petalFill} opacity={petalOpacity} />
      <circle cx="12" cy="17" r="4" fill={petalFill} opacity={petalOpacity} />
      <circle cx="7" cy="12" r="4" fill={petalFill} opacity={petalOpacity} />
      <circle cx="17" cy="12" r="4" fill={petalFill} opacity={petalOpacity} />
      <circle cx="12" cy="12" r="3" fill={centerFill} />
    </svg>
  )
}

export default function RoseProgress({ total, completed }: RoseProgressProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-4"
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${completed} de ${total} pistas completadas`}
    >
      {Array.from({ length: total }, (_, index) => {
        const state: FlowerState = index < completed ? 'bloomed' : index === completed ? 'active' : 'locked'
        const isPulsing = state === 'active' && !reducedMotion

        return (
          <motion.div
            key={index}
            className="h-8 w-8 sm:h-10 sm:w-10"
            initial={false}
            animate={
              isPulsing
                ? { scale: [1, 1.12, 1], opacity: 1 }
                : { scale: state === 'locked' ? 0.85 : 1, opacity: state === 'locked' ? 0.6 : 1 }
            }
            transition={
              isPulsing ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }
            }
          >
            <Flower state={state} />
          </motion.div>
        )
      })}
    </div>
  )
}
