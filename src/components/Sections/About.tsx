import { motion } from 'motion/react'
import { aboutContent } from '../../content/about'
import { containerVariants } from './variants'
import type { SectionContentProps } from './SectionPage'

export default function About({ item }: SectionContentProps) {
  return (
    <>
      <motion.p className="lede" variants={item}>
        {aboutContent.lede}
      </motion.p>

      <div className="about">
        <motion.div className="about__prose" variants={item}>
          {aboutContent.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        <motion.dl className="about__facts" variants={containerVariants}>
          {aboutContent.facts.map((f) => (
            <motion.div className="fact" key={f.label} variants={item}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>

      <motion.div className="skills" variants={containerVariants}>
        {aboutContent.skills.map((g) => (
          <motion.div className="skills__group" key={g.group} variants={item}>
            <h2 className="skills__head">{g.group}</h2>
            <ul className="skills__list">
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}
