import { motion } from 'motion/react'
import { resumeContent, type ResumeEntry } from '../../content/resume'
import { Icon } from '../Landing/icons'
import { containerVariants } from './variants'
import type { SectionContentProps } from './SectionPage'

function Timeline({ entries, item }: { entries: ResumeEntry[]; item: SectionContentProps['item'] }) {
  return (
    <motion.ol className="timeline" variants={containerVariants}>
      {entries.map((e) => (
        <motion.li className="timeline__row" key={`${e.org}-${e.period}`} variants={item}>
          <span className="timeline__period">{e.period}</span>
          <span className="timeline__body">
            <span className="timeline__role">{e.role}</span>
            <span className="timeline__org">{e.org}</span>
            <span className="timeline__detail">{e.detail}</span>
          </span>
        </motion.li>
      ))}
    </motion.ol>
  )
}

export default function Resume({ item }: SectionContentProps) {
  return (
    <>
      <motion.div className="resume__top" variants={item}>
        <p className="lede">Where I have worked and studied.</p>
        <a className="btn-ghost" href={resumeContent.resumeUrl} download>
          <Icon name="file" size={16} />
          Download PDF
        </a>
      </motion.div>

      <motion.h2 className="resume__head" variants={item}>
        Experience
      </motion.h2>
      <Timeline entries={resumeContent.experience} item={item} />

      <motion.h2 className="resume__head" variants={item}>
        Education
      </motion.h2>
      <Timeline entries={resumeContent.education} item={item} />
    </>
  )
}
