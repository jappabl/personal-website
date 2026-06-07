import type { GlyphName } from '../components/Landing/icons'

export interface Channel {
  label: string
  value: string
  href: string
  icon: GlyphName
}

export const contactContent = {
  lede: 'Have something to build, or just want to say hello?',
  email: 'hello@haolin.dev',
  channels: [
    { label: 'Email', value: 'hello@haolin.dev', href: 'mailto:hello@haolin.dev', icon: 'mail' },
    { label: 'GitHub', value: 'github.com/haolin', href: 'https://github.com/', icon: 'github' },
    { label: 'LinkedIn', value: 'in/haolin', href: 'https://linkedin.com/', icon: 'linkedin' },
  ] as Channel[],
}
