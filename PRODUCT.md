# Product

## Register

brand

## Users

Recruiters, collaborators, and fellow builders who reach the site from a resume, GitHub, or
a referral. They skim fast and want one answer quickly: is Hao good, and interesting to work
with?

## Product Purpose

A personal site for **Hao Lin** — founder of tolus.dev, ISEF researcher. It makes a sharp
first impression and routes visitors to Projects, Resume, About, and Contact. Success = the
visitor remembers it, can recall what Hao builds, and reaches out.

## Brand Personality

Minimal, experimental, technical. A engineer's POV rendered as a **technical drawing**:
precise, a little playful, confident without filler. Voice is plain and declarative.

## Anti-references

The clean light-grey + blue "Material/Google" look; playful toy aesthetics (physics, springs,
bright primary chips); generic SaaS templates (identical icon-card grids, hero-metric blocks,
gradient text, particle fields). One restrained signal color, not a rainbow.

## Design Principles

1. **The drawing is the concept.** Blueprint/schematic system: coordinate sheets (A1–A4),
   crop marks, a title block, a contour backdrop.
2. **One signal color.** Registration red, used sparingly. Everything else is ink on paper.
3. **Signatures earn their place.** A typeable console and a hidden assembly-mode egg say
   "developer" without explaining it.
4. **Legible first.** Cleverness never costs readability; labels meet contrast.
5. **Accessible + robust.** Real controls, keyboard + screen-reader operable, reduced-motion
   parity, content readable even if JS never runs.

## Accessibility & Inclusion

WCAG 2.1 AA. Body/labels ≥ 4.5:1 on the white canvas (ink ~19:1; `--faint` ~5:1; red text uses
`--signal-ink`). Project rows and the console are keyboard/SR operable with a visible focus
ring. Reveals are transform-only (content never ships invisible); `prefers-reduced-motion`
disables motion.

## Content

All copy lives in `index.html`. **Projects and the "Example Labs" resume row are still
placeholders** — swap in real work, roles, and the real LinkedIn before sharing widely.
