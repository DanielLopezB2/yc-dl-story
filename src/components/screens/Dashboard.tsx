import { motion } from 'framer-motion'
import { CLUES } from '../../lib/config'
import { useProgress } from '../../hooks/useProgress'
import RoseProgress from '../ui/RoseProgress'
import ClueCard, { type ClueCardStatus } from '../ui/ClueCard'

interface DashboardProps {
  onOpenClue: () => void
  onContinue: () => void
}

export default function Dashboard({ onOpenClue, onContinue }: DashboardProps) {
  const { unlockedCount } = useProgress()
  const allDone = unlockedCount >= CLUES.length

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6 py-16 text-center">
      <h2 className="font-subheading text-3xl text-text">Nuestras pistas</h2>
      <RoseProgress total={CLUES.length} completed={unlockedCount} />

      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
        {CLUES.map((clue, index) => {
          const status: ClueCardStatus =
            index < unlockedCount ? 'completed' : index === unlockedCount ? 'active' : 'locked'
          return <ClueCard key={clue.id} clue={clue} status={status} onOpen={onOpenClue} />
        })}
      </div>

      {allDone && (
        <motion.button
          type="button"
          onClick={onContinue}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-primary px-10 py-3 font-body font-semibold text-white shadow-lg shadow-primary/30"
        >
          Continuar
        </motion.button>
      )}
    </section>
  )
}
