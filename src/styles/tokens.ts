/**
 * JS-side mirror of motion + physics constants.
 * Visual colors live in CSS custom properties (index.css); because the
 * physics bodies are rendered as real DOM elements (not via matter's canvas
 * renderer), matter never needs color values — only geometry + tuning.
 */

/** Transition durations in seconds (consumed by motion / Framer Motion). */
export const duration = {
  fast: 0.18,
  mid: 0.4,
  scatter: 0.7,
  converge: 0.75,
  stack: 0.85,
  fold: 0.8,
} as const

/** Cubic-bezier easing tuples (ease-out family — no bounce/elastic). */
export const ease = {
  outQuart: [0.25, 1, 0.5, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.6, 0, 0.4, 1],
} as const

/** Spring presets for entrances / settling. */
export const spring = {
  settle: { type: 'spring', stiffness: 260, damping: 30 } as const,
  bounce: { type: 'spring', stiffness: 320, damping: 24 } as const,
  snappy: { type: 'spring', stiffness: 420, damping: 32 } as const,
}
