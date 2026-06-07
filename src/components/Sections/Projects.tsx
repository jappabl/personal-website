import { motion } from 'motion/react'
import { projectsContent } from '../../content/projects'
import { Icon } from '../Landing/icons'
import { containerVariants } from './variants'
import type { SectionContentProps } from './SectionPage'

export default function Projects({ item }: SectionContentProps) {
  return (
    <>
      <motion.p className="lede" variants={item}>
        {projectsContent.intro}
      </motion.p>

      <motion.ol className="ledger" variants={containerVariants}>
        {projectsContent.items.map((p) => (
          <motion.li key={p.index} className="ledger__row" variants={item}>
            <a className="ledger__link" href={p.href} target="_blank" rel="noreferrer">
              <span className="ledger__index">{p.index}</span>
              <span className="ledger__body">
                <span className="ledger__head">
                  <span className="ledger__name">{p.name}</span>
                  <span className="ledger__year">{p.year}</span>
                </span>
                <span className="ledger__blurb">{p.blurb}</span>
                <span className="ledger__tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </span>
              </span>
              <span className="ledger__arrow" aria-hidden="true">
                <Icon name="arrow-up-right" size={20} />
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ol>
    </>
  )
}
