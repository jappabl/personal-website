# Design

Design system of record for the "Schematic" personal site. Static HTML/CSS/JS. Tokens live in
`site.css` `:root`.

## Concept

A technical drawing. Stark white "paper", a faint contour backdrop, crop marks, a top status
bar, A1–A4 coordinate "sheets", a numbered nav ledger, a title-block footer, and a docked
console. One registration-red signal. Minimal, technical, a little playful.

## Color tokens

| Token | Value | Role |
|---|---|---|
| `--paper` | `#ffffff` | Canvas |
| `--surface` / `--surface-2` | `#f6f6f8` / `#eeeef1` | Hover / insets |
| `--ink` / `--ink-2` | `#0a0a0c` / `#232329` | Text |
| `--muted` | `#5a5a63` | Secondary text (~6.6:1) |
| `--faint` | `#6a6a73` | Tertiary labels (~5:1 — was #9c9ca6 at 2.7:1) |
| `--line` / `--line-2` | `#e4e4e9` / `#cdcdd4` | Hairlines / backdrop strokes |
| `--signal` | `#e5372a` | Registration red — dots, fills, hover, hero `·` |
| `--signal-ink` | `#c5281c` | Darker red for **small text** (coordinates, periods) — AA |

All text meets WCAG AA on the white canvas (measured: ink ~19:1, muted ~6.6:1, faint ~5:1,
signal-ink ~5:1+).

## Typography

| Family | Use | Source |
|---|---|---|
| Archivo | Display: hero, section titles, names (uppercase, industrial grotesque) | Google Fonts |
| JetBrains Mono | Body, labels, console — mono is *earned* (technical brand) | Google Fonts |

Grotesque + mono is a contrast-axis pairing. Hero caps at **120px** (was 184px). Uppercase is
reserved for headings and short labels; body is sentence case. No em-dashes (en-dashes for
ranges, commas/periods otherwise).

## Backdrop

`background.js` renders a static canvas backdrop in the schematic palette — **contour**
(default, marching-squares topo), **dots**, or **grid** — switchable via the console `bg`
command (persisted to localStorage). Rendered once on load/resize (no continuous loop). A
white text-halo (`text-shadow` on `.shell`/`.titleblock`) keeps copy crisp over it.

## Motion

Reveals are **transform-only** (opacity always 1 → never ships invisible, even JS-off/headless),
via IntersectionObserver with a timeout safety net. `prefers-reduced-motion` disables reveals,
smooth scroll, and the scroll-cue shimmer. Easing `cubic-bezier(.16,1,.3,1)`.

## Interaction & a11y

- **Nav ledger** — real `<a href>` + smooth scroll; **console `goto`** navigates too.
- **Project rows** — `role="button"`, `tabindex`, `aria-expanded`/`aria-controls`, Enter/Space.
- **Console** — toggle bar is keyboard-operable; commands: `help`, `whoami`, section dumps,
  `goto a1–a4`, `cv` (print), `bg`, `clear`, hidden `art`, `play` (Snake).
- **Easter egg** — Konami code → assembly mode (sections shift, stamp).
- Visible `:focus-visible` ring (registration red). Status-bar scroll readout + active "SHEET".

## Layout

Ledger/grid rows with hairlines (nav, parts list, CV, channels) — not a card grid. Max width
1240px, fluid `--pad`. Semantic z-scale (bg 0 → content 1 → statusbar 50 → crop 60 → console
70 → stamp 80). Responsive collapses columns and hides crop marks / secondary labels on small
screens; Resume prints clean (`@media print`).

## Ban list (do not regress)

Light-grey + blue "Material" look; playful/toy aesthetics; gradient text; identical card grids;
hero-metric blocks; em-dashes in copy; ultra-light gray text (<4.5:1); Space Grotesk; multiple
competing accent colors.
