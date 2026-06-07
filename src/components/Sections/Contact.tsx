import { useState } from 'react'
import { motion } from 'motion/react'
import { contactContent } from '../../content/contact'
import { Icon } from '../Landing/icons'
import { containerVariants } from './variants'
import type { SectionContentProps } from './SectionPage'

export default function Contact({ item }: SectionContentProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactContent.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable; the mailto link still works */
    }
  }

  return (
    <>
      <motion.p className="lede" variants={item}>
        {contactContent.lede}
      </motion.p>

      <motion.div className="contact__email" variants={item}>
        <a href={`mailto:${contactContent.email}`} className="contact__mail">
          {contactContent.email}
        </a>
        <button className="contact__copy" onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'copy'} size={17} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </motion.div>

      <motion.ul className="channels" variants={containerVariants}>
        {contactContent.channels.map((c) => (
          <motion.li key={c.label} variants={item}>
            <a className="channel" href={c.href} target="_blank" rel="noreferrer">
              <span className="channel__icon" aria-hidden="true">
                <Icon name={c.icon} size={20} />
              </span>
              <span className="channel__text">
                <span className="channel__label">{c.label}</span>
                <span className="channel__value">{c.value}</span>
              </span>
              <span className="channel__arrow" aria-hidden="true">
                <Icon name="arrow-up-right" size={18} />
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </>
  )
}
