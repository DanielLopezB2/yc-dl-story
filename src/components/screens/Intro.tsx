import { motion } from 'framer-motion'
import Typewriter from '../ui/Typewriter'

interface IntroProps {
  onContinue: () => void
}

const INTRO_TEXT =
  'En el apartamento hay seis pistas escondidas. Cada una tiene un lugar, un objeto y un código. Encuéntralas, valida el código y una nueva parte de la historia se abrirá.'

export default function Intro({ onContinue }: IntroProps) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <h2 className="font-subheading text-3xl text-text">Antes de empezar</h2>
      <Typewriter text={INTRO_TEXT} className="max-w-lg font-body text-lg text-text-secondary" />
      <motion.button
        type="button"
        onClick={onContinue}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full bg-primary px-10 py-3 font-body font-semibold text-white shadow-lg shadow-primary/30"
      >
        Entendido
      </motion.button>
    </section>
  )
}
