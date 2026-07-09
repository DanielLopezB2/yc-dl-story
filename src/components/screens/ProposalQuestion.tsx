import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TENDER_PHRASES } from '../../lib/config'

interface ProposalQuestionProps {
  onAccept: () => void
}

function pickTenderPhrase(exclude: string | null) {
  const options = exclude ? TENDER_PHRASES.filter((phrase) => phrase !== exclude) : TENDER_PHRASES
  return options[Math.floor(Math.random() * options.length)]
}

export default function ProposalQuestion({ onAccept }: ProposalQuestionProps) {
  const [phrase, setPhrase] = useState<string | null>(null)
  const lastPhrase = useRef<string | null>(null)

  const handleNeedHug = () => {
    const next = pickTenderPhrase(lastPhrase.current)
    lastPhrase.current = next
    setPhrase(next)
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="font-heading text-4xl text-text sm:text-5xl"
      >
        ¿Quieres ser mi novia?
      </motion.h1>

      <div className="flex flex-col gap-4 sm:flex-row">
        <motion.button
          type="button"
          onClick={onAccept}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-primary px-10 py-3 font-body font-semibold text-white shadow-lg shadow-primary/30"
        >
          Sí ❤️
        </motion.button>
        <motion.button
          type="button"
          onClick={handleNeedHug}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-primary/40 bg-white px-10 py-3 font-body font-semibold text-text"
        >
          Necesito abrazarte primero 🤍
        </motion.button>
      </div>

      <AnimatePresence>
        {phrase && (
          <motion.p
            key={phrase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-sm font-subheading text-lg text-primary"
          >
            {phrase}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}
