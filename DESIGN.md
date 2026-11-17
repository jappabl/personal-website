# Design

Pixel RPG theme, inspired by old-school text-box RPGs. Original take: no characters, art,
music, fonts or menu labels lifted from any specific game.

## Look

- Black screen, white text, one accent: yellow `#ffe14d` (selection, hover, cursor, links).
- Fonts: Silkscreen (headings, menu, labels) + VT323 (body). Both Google Fonts.
- Everything sits in 4px white-bordered boxes. No radius, no shadows, no gradients.
- Cursor is a yellow pixel arrow.

## Interaction

- Dialogue boxes type text out one line at a time. Intro advances on click, Z or Enter.
  Reduced motion shows text instantly. Full intro text is in a screen-reader-only paragraph.
- Menu = ARIA tablist (WORK / RESUME / ABOUT / CONTACT). Arrow keys move, Enter/Z selects.
  Selected tab is written to the URL hash, so links like `/#about` work.
- Work panel: an inventory list on the left built by JS from the `<article class="item">`
  elements; arrow up/down to browse.
- Sound: square-wave text blips, off by default, toggle top right (saved in localStorage).
- Footer easter egg: INVESTIGATE opens a 20-second dodge minigame (falling syntax).
- Without JS, every panel and project is simply shown in order.
