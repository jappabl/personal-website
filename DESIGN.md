# Design

Design system of record for the "Dark editorial luxe" portfolio. Visual values live as CSS
custom properties in `src/index.css`; motion constants mirror in `src/styles/tokens.ts`.

## Concept

Dark, editorial, refined. A deep warm near-black canvas, a high-contrast serif name, a slow
generative "ink" light field behind it, and one warm ember accent. Sophisticated and sleek,
not playful and not the clean light+blue "Material" look it replaced.

## Theme

Dark. Scene: a recruiter at night, skimming portfolios, pausing on one that feels like a
considered object rather than a template. Warmth comes from the near-black's warm hue and the
ember accent, never from bright color.

Color strategy: **committed dark + one restrained accent.** The dark surface carries the
brand; ember is used sparingly (hover, focus, links, the transition seam, the cursor glow).

## Color tokens (OKLCH)

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(17% 0.012 60)` | Deep warm near-black canvas |
| `--surface` / `--surface-2` | `oklch(21% / 26% …)` | Raised panels / insets |
| `--ink` | `oklch(93% 0.012 80)` | Warm off-white text + serif headings |
| `--ink-muted` | `oklch(76% 0.014 72)` | Body / secondary |
| `--ink-faint` | `oklch(62% 0.014 70)` | Tracked labels, indices, dates |
| `--line` / `--line-strong` | `oklch(31% / 42% …)` | Hairlines |
| `--accent` | `oklch(82% 0.12 74)` | Warm ember/amber-gold (hover, focus, links, seam) |
| `--accent-strong` | `oklch(74% 0.14 66)` | Deeper accent |
| `--accent-ink` | `oklch(20% 0.03 60)` | Dark text on an accent fill |

### Contrast (measured from the rendered build, on the dark canvas)
- `--ink` on `--bg` = **15.6:1** ✓ (AAA)
- `--ink-muted` on `--bg` = **8.9:1** ✓ (AAA)
- `--ink-faint` on `--bg` = **5.3:1** ✓ (AA)
- `--accent` is light (L82) → high contrast as text/links on the dark canvas ✓

## Typography

| Family | Use | Source |
|---|---|---|
| Bodoni Moda | Name + headings + project/role titles + the email (high-contrast serif) | Google Fonts (`opsz,wght`) |
| Hanken Grotesk | Body, nav meta, tracked labels, UI | Google Fonts |

Serif (display) + grotesque (body) is a contrast-axis pairing. Labels are tracked uppercase
Hanken (the pixel mono was dropped). Fluid scale `--step--1 … --step-4`; hero name caps at
5.5rem. The serif is used for impact; the grotesque is the workhorse.

## Signature — the landing "ink field"

`src/components/Landing/InkField.tsx` (WebGL via [`ogl`](https://github.com/oframe/ogl)): a slow,
domain-warped flow field over the near-black canvas with faint warm variation, ember blooms, and
a soft glow that eases toward the cursor. Deliberately low-contrast atmosphere behind the
editorial type. DPR capped at 1.5, paused when the tab is hidden. Reduced motion / no WebGL →
a static CSS radial gradient (the content is identical and fully usable).

## Motion — one cohesive transition

`src/components/Stage/` runs cover → swap → reveal. A single near-black panel wipes across with
a thin ember leading seam; only the **direction** varies per section (Projects up, About down,
Resume left, Contact right). Slow ease-out (`outExpo`). Reduced motion → a quick crossfade.
Section content enters with a restrained rise (About surfaces with a brief blur-to-sharp).

## Components

- **Landing** — `InkField` backdrop + editorial composition: tracked wordmark/status, serif
  name, and a numbered nav list (`01 — Projects …`) with hairline rules and ember hover.
- **Stage** — phase machine + the unified wipe `TransitionLayer`.
- **SectionPage** — shared shell: BackButton + section index, dark, token-based.
- **Sections** — non-card-grid layouts: Projects = serif ledger; About = editorial two-column +
  facts; Resume = timeline (`@media print` friendly); Contact = oversized serif email + channels.

## Layout

Warm-dark canvas, generous fluid spacing, reading column ~72ch in sections, sharper radii
(3–12px). Semantic z-index scale (bg → content → nav → transition → overlay).

## Ban list (do not regress)

The light+blue "Material/Google" look; playful/toy aesthetics (physics, springs, bright chips);
gradient text; identical icon-heading-text card grids; tiny tracked uppercase eyebrows on every
section; hero-metric blocks; drifting particle fields; decorative glassmorphism; side-stripe
borders; multiple competing accent colors.
