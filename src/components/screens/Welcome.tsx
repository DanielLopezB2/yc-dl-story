import { motion } from 'framer-motion'
import { START_DATE } from '../../lib/config'
import { useElapsedSince, formatElapsed } from '../../hooks/useElapsedSince'

interface WelcomeProps {
  onStart: () => void
}

export default function Welcome({ onStart }: WelcomeProps) {
  const elapsed = useElapsedSince(START_DATE)
  const { days, hours, minutes, seconds } = formatElapsed(elapsed)

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 bg-linear-to-b from-secondary via-background to-primary/10 px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="font-heading text-5xl text-text sm:text-6xl"
      >
        Nuestro Comienzo
      </motion.h1>

      <div className="flex max-w-md flex-col gap-4 font-body text-text-secondary">
        <p>Dicen que algunas historias comienzan con un instante inolvidable. La nuestra fue diferente.</p>
        <p>
          Todo surgió de la manera más natural: entre conversaciones, risas y momentos compartidos. Sin
          buscarlo, nuestra amistad fue creciendo hasta convertirse en algo mucho más especial, casi sin
          que nos diéramos cuenta.
        </p>
        <p>Cada paso nos acercará a un momento muy especial.</p>
        <p>¿Lista para comenzar? ❤️</p>
      </div>

      <p className="font-subheading text-sm text-text-secondary">
        Llevamos {days} días, {hours} h, {minutes} m y {seconds} s conociéndonos
      </p>

      <motion.button
        type="button"
        onClick={onStart}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full bg-primary px-10 py-3 font-body font-semibold text-white shadow-lg shadow-primary/30"
      >
        Comenzar
      </motion.button>
    </section>
  )
}
