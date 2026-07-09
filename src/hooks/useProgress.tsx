import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CLUES } from '../lib/config'
import {
  isStageFurther,
  loadProgress,
  resumeStage,
  saveProgress,
  type Progress,
  type Stage,
} from '../lib/progress'

interface ProgressContextValue {
  stage: Stage
  unlockedCount: number
  proposalAccepted: boolean
  goTo: (stage: Stage) => void
  unlockNextClue: () => void
  acceptProposal: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [stage, setStage] = useState<Stage>(() => resumeStage(progress.furthestStage))

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const goTo = useCallback((next: Stage) => {
    setStage(next)
    setProgress((prev) =>
      isStageFurther(next, prev.furthestStage) ? { ...prev, furthestStage: next } : prev,
    )
  }, [])

  const unlockNextClue = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      unlockedCount: Math.min(prev.unlockedCount + 1, CLUES.length),
    }))
  }, [])

  const acceptProposal = useCallback(() => {
    setProgress((prev) => ({ ...prev, proposalAccepted: true }))
    goTo('celebration')
  }, [goTo])

  const value = useMemo<ProgressContextValue>(
    () => ({
      stage,
      unlockedCount: progress.unlockedCount,
      proposalAccepted: progress.proposalAccepted,
      goTo,
      unlockNextClue,
      acceptProposal,
    }),
    [stage, progress.unlockedCount, progress.proposalAccepted, goTo, unlockNextClue, acceptProposal],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}
