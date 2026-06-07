import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { SectionKey } from '../../lib/nav'
import { ease } from '../../styles/tokens'
import { REDUCED_MS, transitionTiming, type WipeDir } from './transitions'

interface Props {
  section: SectionKey
  step: 'cover' | 'reveal'
  reduced: boolean
}

const containerStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 'var(--z-transition)' as unknown as number,
  pointerEvents: 'auto',
  overflow: 'hidden',
}

// Panel near-black so it reads as a dark veil over the dark page; the ember seam is the accent.
const panelStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'oklch(10% 0.012 60)',
}

// Where the panel sits before cover (offscreen, opposite the travel direction).
const fromOffset: Record<WipeDir, { x?: string; y?: string }> = {
  up: { y: '100%' },
  down: { y: '-100%' },
  left: { x: '100%' },
  right: { x: '-100%' },
}
// Where it exits to on reveal (continuing the travel direction).
const toOffset: Record<WipeDir, { x?: string; y?: string }> = {
  up: { y: '-100%' },
  down: { y: '100%' },
  left: { x: '-100%' },
  right: { x: '100%' },
}

// Ember seam pinned to the leading edge.
function seamStyle(dir: WipeDir): CSSProperties {
  const base: CSSProperties = {
    position: 'absolute',
    background: 'var(--accent)',
    boxShadow: '0 0 22px 2px var(--accent-line)',
  }
  if (dir === 'up') return { ...base, top: 0, left: 0, right: 0, height: 2 }
  if (dir === 'down') return { ...base, bottom: 0, left: 0, right: 0, height: 2 }
  if (dir === 'left') return { ...base, left: 0, top: 0, bottom: 0, width: 2 }
  return { ...base, right: 0, top: 0, bottom: 0, width: 2 }
}

export default function TransitionLayer({ section, step, reduced }: Props) {
  const t = transitionTiming[section]
  const coverS = (reduced ? REDUCED_MS : t.coverMs) / 1000
  const revealS = (reduced ? REDUCED_MS : t.revealMs) / 1000

  if (reduced) {
    return (
      <motion.div
        aria-hidden="true"
        style={{ ...containerStyle, ...panelStyle }}
        initial={{ opacity: 0 }}
        animate={{ opacity: step === 'cover' ? 1 : 0 }}
        transition={{ duration: step === 'cover' ? coverS : revealS }}
      />
    )
  }

  const target = step === 'cover' ? { x: 0, y: 0 } : toOffset[t.dir]
  const duration = step === 'cover' ? coverS : revealS

  return (
    <div style={containerStyle} aria-hidden="true">
      <motion.div
        style={panelStyle}
        initial={fromOffset[t.dir]}
        animate={target}
        transition={{ duration, ease: ease.outExpo }}
      >
        <div style={seamStyle(t.dir)} />
      </motion.div>
    </div>
  )
}
