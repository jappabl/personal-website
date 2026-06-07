# Hao Lin — personal site

A static personal site in a **"Schematic"** blueprint / technical-drawing style: stark grid,
Space Grotesk × JetBrains Mono, a registration-red signal accent, and A1–A4 "sheet" sections
(Projects, Resume, About, Contact). Built from a Claude Design handoff.

No build step — it's plain HTML/CSS/JS.

## Files

- `index.html` — the page (all four sections + the title block)
- `site.css` — the full Schematic design system
- `app.js` — interactions: scroll readout + active sheet, project expand/collapse, the console, and the easter eggs

Fonts load from Google Fonts; everything else is self-contained.

## Run / deploy

Open `index.html` directly, or serve the folder with any static server:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deploy by uploading these files to any static host (GitHub Pages, Netlify, Vercel, …).

## The console

Click the panel docked bottom-right, then type. Commands: `help`, `whoami`, `projects`,
`resume`, `about`, `contact`, `goto a1`–`a4` (scrolls), `ls`, `cv`, `clear`, `play` (Snake),
and a hidden `art` (ASCII art). Easter egg: the Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) flips the
site into *assembly mode*.

## Editing content

All copy lives directly in `index.html` (projects, resume rows, about facts/skills, contact
channels). Update the email, links (`github.com/jappabl`), and project details there.
