import { useCallback, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { navItems, type SectionKey } from '../../lib/nav'
import { siteContent } from '../../content/site'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import InkField from './InkField'
import { Icon } from './icons'
import './Landing.css'

interface LandingProps {
  onNavigate: (section: SectionKey) => void
  /** If set, restore keyboard focus to this nav row on mount (after Back). */
  focusKey?: SectionKey | null
}

export default function Landing({ onNavigate, focusKey }: LandingProps) {
  const reduced = usePrefersReducedMotion()

  const handleActivate = useCallback(
    (key: SectionKey, e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      onNavigate(key)
    },
    [onNavigate],
  )

  useEffect(() => {
    if (focusKey) {
      document.querySelector<HTMLElement>(`[data-nav="${focusKey}"]`)?.focus({ preventScroll: true })
    }
  }, [focusKey])

  return (
    <div className="landing">
      <InkField reduced={reduced} />

      <div className="landing__inner">
        <header className="landing__top">
          <span className="landing__wordmark">{siteContent.wordmark}</span>
          <span className="landing__status">
            <span className="landing__dot" />
            {siteContent.status}
          </span>
        </header>

        <div className="landing__hero">
          <p className="landing__tagline">{siteContent.tagline}</p>
          <h1 className="landing__name">{siteContent.name}</h1>

          <nav className="landing__nav" aria-label="Sections">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                data-nav={item.key}
                className="nav-row"
                aria-label={`${item.label} — ${item.hint}`}
                onClick={(e) => handleActivate(item.key, e)}
              >
                <span className="nav-row__index">{item.index}</span>
                <span className="nav-row__label">{item.label}</span>
                <span className="nav-row__end">
                  <span className="nav-row__meta">{item.hint}</span>
                  <span className="nav-row__arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" size={17} />
                  </span>
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
