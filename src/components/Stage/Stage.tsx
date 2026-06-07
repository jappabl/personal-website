import { useCallback, useEffect, useReducer } from 'react'
import type { SectionKey } from '../../lib/nav'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import Landing from '../Landing/Landing'
import SectionPage from '../Sections/SectionPage'
import TransitionLayer from './TransitionLayer'
import { REDUCED_MS, transitionTiming } from './transitions'

interface Transition {
  section: SectionKey
  dir: 'enter' | 'leave'
  step: 'cover' | 'reveal'
}

interface State {
  phase: 'landing' | 'section'
  section: SectionKey | null
  transition: Transition | null
  /** When we return to the landing, the nav row to restore keyboard focus to. */
  focusKey: SectionKey | null
}

type Action =
  | { type: 'BEGIN_ENTER'; section: SectionKey }
  | { type: 'BEGIN_LEAVE' }
  | { type: 'COVERED' }
  | { type: 'DONE' }

const initial: State = { phase: 'landing', section: null, transition: null, focusKey: null }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BEGIN_ENTER':
      if (state.phase !== 'landing' || state.transition) return state
      return { ...state, focusKey: null, transition: { section: action.section, dir: 'enter', step: 'cover' } }
    case 'BEGIN_LEAVE':
      if (state.phase !== 'section' || state.transition || !state.section) return state
      return { ...state, transition: { section: state.section, dir: 'leave', step: 'cover' } }
    case 'COVERED': {
      const t = state.transition
      if (!t) return state
      const revealing: Transition = { ...t, step: 'reveal' }
      return t.dir === 'enter'
        ? { ...state, phase: 'section', section: t.section, transition: revealing }
        : { ...state, phase: 'landing', section: null, transition: revealing, focusKey: t.section }
    }
    case 'DONE':
      return { ...state, transition: null }
    default:
      return state
  }
}

export default function Stage() {
  const [state, dispatch] = useReducer(reducer, initial)
  const reduced = usePrefersReducedMotion()
  const { phase, section, transition } = state

  // Drive the cover -> swap -> reveal lifecycle with timers matched to the animation.
  useEffect(() => {
    if (!transition) return
    const t = transitionTiming[transition.section]
    const ms = reduced ? REDUCED_MS : transition.step === 'cover' ? t.coverMs : t.revealMs
    const id = window.setTimeout(() => {
      dispatch({ type: transition.step === 'cover' ? 'COVERED' : 'DONE' })
    }, ms)
    return () => window.clearTimeout(id)
  }, [transition, reduced])

  const handleNavigate = useCallback((s: SectionKey) => {
    dispatch({ type: 'BEGIN_ENTER', section: s })
  }, [])

  const handleBack = useCallback(() => {
    dispatch({ type: 'BEGIN_LEAVE' })
  }, [])

  return (
    <>
      {phase === 'landing' && <Landing onNavigate={handleNavigate} focusKey={state.focusKey} />}
      {phase === 'section' && section && <SectionPage sectionKey={section} onBack={handleBack} />}
      {transition && <TransitionLayer section={transition.section} step={transition.step} reduced={reduced} />}
    </>
  )
}
