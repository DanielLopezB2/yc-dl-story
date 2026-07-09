import { useEffect } from 'react'
import { CLUES } from '../../lib/config'
import { useProgress } from '../../hooks/useProgress'
import CodeInput from '../ui/CodeInput'

export default function ClueScreen() {
  const { unlockedCount, unlockNextClue, goTo } = useProgress()
  const clue = CLUES[unlockedCount]

  useEffect(() => {
    if (!clue) goTo('dashboard')
  }, [clue, goTo])

  if (!clue) return null

  const handleSuccess = () => {
    unlockNextClue()
    goTo('dashboard')
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <span className="font-subheading text-sm uppercase tracking-widest text-text-secondary">
        Pista {clue.id} de {CLUES.length}
      </span>
      <h2 className="font-heading text-4xl text-text">{clue.place}</h2>
      <p className="font-body text-text-secondary">Busca cerca de: {clue.object}</p>
      <CodeInput expectedCode={clue.code} onSuccess={handleSuccess} />
      <button
        type="button"
        onClick={() => goTo('dashboard')}
        className="font-body text-sm text-text-secondary underline underline-offset-4"
      >
        Volver
      </button>
    </section>
  )
}
