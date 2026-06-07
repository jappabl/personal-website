import type { SectionKey } from '../../lib/nav'

/**
 * One cohesive transition: a near-black panel wipes across with a thin ember leading
 * seam. The Stage runs cover -> swap -> reveal; only the wipe DIRECTION varies per section,
 * which keeps the set sleek and unified rather than four competing spectacles.
 */
export type WipeDir = 'up' | 'down' | 'left' | 'right'

export interface TransitionDef {
  coverMs: number
  revealMs: number
  dir: WipeDir
}

export const transitionTiming: Record<SectionKey, TransitionDef> = {
  projects: { coverMs: 440, revealMs: 560, dir: 'up' },
  about: { coverMs: 460, revealMs: 580, dir: 'down' },
  resume: { coverMs: 440, revealMs: 560, dir: 'left' },
  contact: { coverMs: 460, revealMs: 560, dir: 'right' },
}

/** Reduced-motion: a single quick crossfade for both phases. */
export const REDUCED_MS = 150
