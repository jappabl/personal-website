import type { Variants } from 'motion/react'
import type { SectionKey } from '../../lib/nav'
import { ease, spring } from '../../styles/tokens'

/** Orchestrator: staggers its direct motion children. */
export const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

/**
 * Per-section item entrance — each echoes that section's transition so the page feels
 * like a continuation of the effect that opened it. Reduced motion collapses to a fade.
 */
export function itemVariants(section: SectionKey, reduced: boolean): Variants {
  if (reduced) {
    return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
  }
  switch (section) {
    case 'about': // surfaces out of the draining liquid (wet-to-sharp)
      return {
        hidden: { opacity: 0, y: 16, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: ease.outExpo } },
      }
    case 'resume': // dropped + stacked
      return { hidden: { opacity: 0, y: -22 }, visible: { opacity: 1, y: 0, transition: spring.bounce } }
    case 'contact': // unfolded
      return { hidden: { opacity: 0, rotateX: -34 }, visible: { opacity: 1, rotateX: 0, transition: spring.settle } }
    case 'projects': // scattered, reassembling from below
    default:
      return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: spring.settle } }
  }
}
