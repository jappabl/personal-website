import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { navByKey, type SectionKey } from '../../lib/nav'
import { siteContent } from '../../content/site'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import BackButton from '../primitives/BackButton'
import { containerVariants, itemVariants } from './variants'
import Projects from './Projects'
import About from './About'
import Resume from './Resume'
import Contact from './Contact'
import './Sections.css'

export interface SectionContentProps {
  item: Variants
}

const sectionComponents: Record<SectionKey, React.FC<SectionContentProps>> = {
  projects: Projects,
  about: About,
  resume: Resume,
  contact: Contact,
}

interface Props {
  sectionKey: SectionKey
  onBack: () => void
}

export default function SectionPage({ sectionKey, onBack }: Props) {
  const reduced = usePrefersReducedMotion()
  const nav = navByKey[sectionKey]
  const Content = sectionComponents[sectionKey]
  const item = itemVariants(sectionKey, reduced)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Move focus to the section heading so keyboard / screen-reader users land correctly.
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="section">
      <header className="section__bar">
        <BackButton onBack={onBack} />
        <span className="section__index">
          {nav.index} <span className="section__slash">/</span> {nav.label}
        </span>
        <span className="section__brand">{siteContent.wordmark}</span>
      </header>

      <motion.main
        className="section__main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="section__title" variants={item} tabIndex={-1} ref={titleRef}>
          {nav.label}
        </motion.h1>
        <Content item={item} />
      </motion.main>
    </div>
  )
}
