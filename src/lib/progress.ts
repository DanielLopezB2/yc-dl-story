import { CLUES } from './config'

export type Stage =
  | 'welcome'
  | 'intro'
  | 'dashboard'
  | 'clue'
  | 'reasons'
  | 'proposalIntro'
  | 'proposalQuestion'
  | 'celebration'

export const STAGE_ORDER: Stage[] = [
  'welcome',
  'intro',
  'dashboard',
  'clue',
  'reasons',
  'proposalIntro',
  'proposalQuestion',
  'celebration',
]

export interface Progress {
  unlockedCount: number
  furthestStage: Stage
  proposalAccepted: boolean
}

const STORAGE_KEY = 'nuestro-comienzo:progress'

const DEFAULT_PROGRESS: Progress = {
  unlockedCount: 0,
  furthestStage: 'welcome',
  proposalAccepted: false,
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROGRESS

    const parsed = JSON.parse(raw) as Partial<Progress>
    const unlockedCount =
      typeof parsed.unlockedCount === 'number'
        ? Math.min(Math.max(parsed.unlockedCount, 0), CLUES.length)
        : 0
    const furthestStage = STAGE_ORDER.includes(parsed.furthestStage as Stage)
      ? (parsed.furthestStage as Stage)
      : 'welcome'

    return {
      unlockedCount,
      furthestStage,
      proposalAccepted: Boolean(parsed.proposalAccepted),
    }
  } catch {
    return DEFAULT_PROGRESS
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage unavailable (private mode, quota) — progress stays in-memory only
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable — nothing to clear
  }
}

export function isStageFurther(a: Stage, b: Stage): boolean {
  return STAGE_ORDER.indexOf(a) > STAGE_ORDER.indexOf(b)
}

export function resumeStage(stage: Stage): Stage {
  return stage === 'clue' ? 'dashboard' : stage
}
