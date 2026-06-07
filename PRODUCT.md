# Product

## Register

brand

## Users

Recruiters, hiring managers, and potential collaborators who land here after seeing
Hao Lin's name on a resume, GitHub, or a referral. They arrive curious and a little
skeptical, usually skimming many portfolios in a row. They want to answer one question
fast: "is this person good, and are they interesting to work with?"

## Product Purpose

A personal developer portfolio for **Hao Lin — Developer & Creator**. It exists to make
a strong, memorable first impression and route visitors to the four things they came for:
Projects, About, Resume, Contact. Success = a visitor remembers the site a day later, can
recall what Hao builds, and reaches out or saves the resume.

The impression is dark, editorial, and precise: a near-black canvas, a refined serif name,
a quiet generative light field, and one warm ember accent. The craft shows through restraint
and a single well-made signature, not through spectacle.

## Brand Personality

Refined, exact, quietly confident. Creative but never loud. The voice is plain and specific
(a real noun and a real verb, never marketing filler). Sophistication through typography,
negative space, and a single accent, not through color noise or playful gimmicks.

## Anti-references

The clean light-grey + blue "Material / Google" look (the previous direction). Playful or
toy-like aesthetics (physics playgrounds, bouncy springs, bright primary chips). Generic SaaS
templates: identical icon-heading-text card grids, tiny tracked uppercase eyebrows over every
section, big-number hero-metric blocks, gradient text, drifting particle fields. Loud spectacle
for its own sake.

## Design Principles

1. **Restraint, then one signature.** A calm, confident surface with a single creative moment
   (the landing's ink field) rather than effects everywhere.
2. **Typography and space carry it.** Hierarchy comes from a serif/grotesque pairing, scale,
   and generous negative space, not decoration.
3. **Warmth from dark + ember, not color.** One warm accent; no rainbow, no neon.
4. **Quiet, precise motion.** Slow ease-outs; every transition is the same cohesive gesture.
5. **Accessible by construction.** Real links, visible focus, reduced-motion parity, AA contrast.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text ≥ 4.5:1 (measured: 8.9:1; labels 5.3:1; headings 15.6:1 on the
dark canvas). Full keyboard navigation with a visible ember focus ring. The landing's WebGL
field is decorative over real `<nav>` links and is bypassed under `prefers-reduced-motion`
(a static gradient and quick crossfades are used instead).

## Content

Identity and all section content live in `src/content/*` (one file per section plus
`site.ts`). Swap real projects/bio/resume/links there without touching components.
