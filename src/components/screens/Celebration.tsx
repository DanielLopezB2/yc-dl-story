import { motion } from 'framer-motion'
import ConfettiBurst from '../ui/ConfettiBurst'

export default function Celebration() {
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
    </section>
  )
}
