import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ProgressProvider, useProgress } from '../hooks/useProgress'
import FloatingHearts from './ui/FloatingHearts'
import FallingPetals from './ui/FallingPetals'
import MusicButton from './ui/MusicButton'
import Welcome from './screens/Welcome'
import Intro from './screens/Intro'
import Dashboard from './screens/Dashboard'
import ClueScreen from './screens/ClueScreen'
import Reasons from './screens/Reasons'
import ProposalIntro from './screens/ProposalIntro'
import ProposalQuestion from './screens/ProposalQuestion'
import Celebration from './screens/Celebration'

function renderScreen(
  stage: ReturnType<typeof useProgress>['stage'],
  goTo: ReturnType<typeof useProgress>['goTo'],
  acceptProposal: ReturnType<typeof useProgress>['acceptProposal'],
): ReactNode {
  switch (stage) {
    case 'welcome':
      return <Welcome onStart={() => goTo('intro')} />
    case 'intro':
      return <Intro onContinue={() => goTo('dashboard')} />
    case 'dashboard':
      return <Dashboard onOpenClue={() => goTo('clue')} onContinue={() => goTo('reasons')} />
    case 'clue':
      return <ClueScreen />
    case 'reasons':
      return <Reasons onContinue={() => goTo('proposalIntro')} />
    case 'proposalIntro':
      return <ProposalIntro onContinue={() => goTo('proposalQuestion')} />
    case 'proposalQuestion':
      return <ProposalQuestion onAccept={acceptProposal} />
    case 'celebration':
      return <Celebration />
  }
}

function Stages() {
  const { stage, goTo, acceptProposal } = useProgress()

  return (
    <motion.div
      key={stage}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderScreen(stage, goTo, acceptProposal)}
    </motion.div>
  )
}

export default function Experience() {
  return (
    <ProgressProvider>
      <div className="relative min-h-screen">
        <FloatingHearts />
        <FallingPetals />
        <Stages />
        <MusicButton />
      </div>
    </ProgressProvider>
  )
}
