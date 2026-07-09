import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface CodeInputProps {
  expectedCode: string
  onSuccess: () => void
}

type ValidationStatus = 'idle' | 'error' | 'success'

export default function CodeInput({ expectedCode, onSuccess }: CodeInputProps) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<ValidationStatus>('idle')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const normalized = value.trim().toUpperCase()

    if (normalized === expectedCode.toUpperCase()) {
      setStatus('success')
      navigator.vibrate?.(80)
      window.setTimeout(onSuccess, 700)
    } else {
      setStatus('error')
      navigator.vibrate?.([50, 40, 50])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <motion.input
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          if (status !== 'idle') setStatus('idle')
        }}
        placeholder="Código"
        aria-label="Código de la pista"
        aria-invalid={status === 'error'}
        disabled={status === 'success'}
        animate={status === 'error' ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-48 rounded-full border border-primary/40 bg-white px-5 py-3 text-center font-body text-lg tracking-widest text-text outline-none focus-visible:border-gold"
      />

      <AnimatePresence mode="wait">
        {status === 'error' && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-body text-sm text-primary"
            role="alert"
          >
            Ese no es el código. Intenta de nuevo.
          </motion.p>
        )}
        {status === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl text-gold"
            aria-hidden="true"
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === 'success' || value.trim() === ''}
        className="rounded-full bg-primary px-8 py-2 font-body font-semibold text-white transition-opacity duration-300 disabled:opacity-40"
      >
        Validar
      </button>
    </form>
  )
}
