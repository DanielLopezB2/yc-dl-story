import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { START_DATE } from '../../lib/config'

function useElapsedSince(dateString: string) {
  const [elapsed, setElapsed] = useState(() => Date.now() - new Date(dateString).getTime())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsed(Date.now() - new Date(dateString).getTime())
    }, 1000)
    return () => window.clearInterval(interval)
  }, [dateString])

  return elapsed
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

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

      <p className="max-w-md font-body text-text-secondary">
        Una historia que empieza en nuestro apartamento y termina con una pregunta.
      </p>

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
