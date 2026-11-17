# Hao Lin, personal site

Static HTML/CSS/JS, no build step. Pixel RPG style: dialogue boxes, a battle-style menu,
an inventory of projects, and a small dodge minigame in the footer.

- `index.html`: all content
- `site.css`: styles
- `app.js`: typewriter dialogue, menu tabs, project inventory, sound toggle, minigame

Run locally:

```bash
python3 -m http.server 8000
```

To add a project, copy an `<article class="item">` block in `index.html`. The list builds itself.
