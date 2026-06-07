/**
 * Navigation model — single source of truth for the four sections.
 * Replaces the old theme.ts. Deliberately carries NO per-section accent
 * color: the redesign uses one shared accent, lit on hover only.
 */

export type SectionKey = 'projects' | 'about' | 'resume' | 'contact'
export type IconName = 'code' | 'user' | 'file' | 'mail'

export interface NavItem {
  key: SectionKey
  /** Two-digit ordinal shown in mono (e.g. "01"). */
  index: string
  label: string
  icon: IconName
  href: string
  /** One-line description used as the icon's accessible hint. */
  hint: string
}

export const navItems: NavItem[] = [
  { key: 'projects', index: '01', label: 'Projects', icon: 'code', href: '#projects', hint: 'Things I have built' },
  { key: 'about', index: '02', label: 'About', icon: 'user', href: '#about', hint: 'Who I am' },
  { key: 'resume', index: '03', label: 'Resume', icon: 'file', href: '#resume', hint: 'Experience and education' },
  { key: 'contact', index: '04', label: 'Contact', icon: 'mail', href: '#contact', hint: 'Get in touch' },
]

export const sectionKeys: SectionKey[] = navItems.map((n) => n.key)

export const navByKey: Record<SectionKey, NavItem> = navItems.reduce(
  (acc, item) => {
    acc[item.key] = item
    return acc
  },
  {} as Record<SectionKey, NavItem>,
)
