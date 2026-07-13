import { motion } from 'framer-motion'
import ConfettiBurst from '../ui/ConfettiBurst'
import { useElapsedSince, formatElapsed } from '../../hooks/useElapsedSince'
import { RELATIONSHIP_START_DATE } from '../../lib/config'
import { useProgress } from '../../hooks/useProgress'

export default function Celebration() {
  const { resetProgress } = useProgress()
  const elapsed = useElapsedSince(RELATIONSHIP_START_DATE)
  const { days, hours, minutes, seconds } = formatElapsed(elapsed)

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-linear-to-b from-secondary via-background to-primary/10 px-6 text-center">
      <ConfettiBurst />
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="font-heading text-5xl text-text sm:text-6xl"
      >
        ¡Ahora es oficial!
      </motion.h1>
      <p className="max-w-md font-body text-lg text-text-secondary">
        Gracias por decir que sí. Este es solo el comienzo de nuestra historia.
      </p>

      <p className="font-subheading text-sm text-text-secondary">
        Llevamos {days} días, {hours} h, {minutes} m y {seconds} s juntos
      </p>

      <button
        type="button"
        onClick={resetProgress}
        className="mt-8 font-body text-xs text-text-secondary/60 underline underline-offset-4"
      >
        Reiniciar experiencia
      </button>
    </section>
  )
}
