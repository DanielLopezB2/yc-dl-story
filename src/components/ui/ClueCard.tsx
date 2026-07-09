import { motion } from 'framer-motion'
import type { Clue } from '../../lib/config'

export type ClueCardStatus = 'locked' | 'active' | 'completed'

interface ClueCardProps {
  clue: Clue
  status: ClueCardStatus
  onOpen: () => void
}

const STATUS_STYLES: Record<ClueCardStatus, string> = {
  completed: 'border-primary/30 bg-secondary text-text',
  active: 'border-gold bg-white text-text shadow-lg shadow-primary/10 cursor-pointer',
  locked: 'border-locked bg-white/60 text-text-secondary cursor-not-allowed opacity-60',
}

export default function ClueCard({ clue, status, onOpen }: ClueCardProps) {
  const isInteractive = status === 'active'

  return (
    <motion.button
      type="button"
      disabled={!isInteractive}
      onClick={onOpen}
      whileHover={isInteractive ? { scale: 1.03 } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-center transition-colors duration-300 ${STATUS_STYLES[status]}`}
      aria-disabled={!isInteractive}
    >
      <span className="font-subheading text-lg">Pista {clue.id}</span>
      {status === 'completed' && (
        <span aria-hidden="true" className="text-2xl text-gold">
          ✓
        </span>
      )}
      {status === 'locked' && (
        <span aria-hidden="true" className="text-2xl">
          🔒
        </span>
      )}
      {status === 'active' && <span className="font-body text-sm text-text-secondary">Toca para abrir</span>}
    </motion.button>
  )
}
