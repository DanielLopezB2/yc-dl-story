import { motion } from 'framer-motion'

interface ProposalIntroProps {
  onContinue: () => void
}

export default function ProposalIntro({ onContinue }: ProposalIntroProps) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <p className="max-w-md font-subheading text-2xl leading-relaxed text-text">
        Después de todo este camino, hay algo que quiero preguntarte.
      </p>
      <motion.button
        type="button"
        onClick={onContinue}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full bg-primary px-10 py-3 font-body font-semibold text-white shadow-lg shadow-primary/30"
      >
        Continuar
      </motion.button>
    </section>
  )
}
