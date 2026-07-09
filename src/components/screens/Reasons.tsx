import { motion } from 'framer-motion'
import { REASONS } from '../../lib/config'

interface ReasonsProps {
  onContinue: () => void
}

export default function Reasons({ onContinue }: ReasonsProps) {
  return (
    <section className="flex min-h-screen flex-col items-center gap-10 bg-background px-6 py-16 text-center">
      <h2 className="font-subheading text-3xl text-text">11 razones</h2>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {REASONS.map((reason, index) => (
          <motion.div
            key={reason}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="rounded-2xl border border-primary/20 bg-secondary/50 p-5 text-left font-body text-text"
          >
            <span className="mr-2 font-subheading text-gold">{index + 1}.</span>
            {reason}
          </motion.div>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={onContinue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: REASONS.length * 0.08 + 0.2 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full bg-primary px-10 py-3 font-body font-semibold text-white shadow-lg shadow-primary/30"
      >
        Continuar
      </motion.button>
    </section>
  )
}
