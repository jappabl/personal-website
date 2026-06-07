# Hao Lin — personal website

A dark, editorial developer portfolio. A deep warm near-black canvas, a high-contrast serif
name, a slow generative "ink" light field behind it, one warm ember accent, and a refined
numbered nav. Sleek and considered rather than playful.

## Stack

- React 19 + TypeScript + Vite
- [ogl](https://github.com/oframe/ogl) — the landing's generative WebGL "ink" field
- [motion](https://motion.dev/) (Framer Motion) — the unified section transition + entrances
- Fonts: Bodoni Moda (display) + Hanken Grotesk (body), via Google Fonts

## Develop

```bash
npm install
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
npm run lint
```

## Editing content

All copy lives in `src/content/` — one file per section plus `site.ts` (name, tagline,
status). Swap your real projects, bio, resume, and links there; no component changes needed.

## Design system

See `DESIGN.md` for tokens (OKLCH dark palette + ember accent), typography, the landing ink
field, the unified wipe transition, and accessibility commitments. `PRODUCT.md` covers the
audience and design principles.

## Accessibility

WCAG AA (measured AAA for most text on the dark canvas). The ink field is decorative over a
real `<nav>`; everything is keyboard-operable with a visible ember focus ring, and
`prefers-reduced-motion` swaps the field for a static gradient and the transitions for quick
crossfades.
