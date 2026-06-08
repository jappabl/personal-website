/* ============================================================
   Hao Lin — "Schematic" · interactions (vanilla)
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad3 = (n) => String(Math.max(0, Math.round(n))).padStart(3, '0');

  /* ---------- CAD readout (scroll depth) ---------- */
  const ry = $('#ry');

  /* ---------- scroll % + active sheet ---------- */
  const rscroll = $('#rscroll'), sheetLabel = $('#sheetLabel');
  const sections = $$('section[data-sheet]');
  let rafScroll = 0;
  function onScroll() {
    rafScroll = 0;
    const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    if (rscroll) rscroll.textContent = pad3(pct).slice(1) + '%';
    if (ry) ry.textContent = String(Math.round(y)).padStart(4, '0');
    // active section = the last one whose top has passed 45% of viewport
    let active = sections[0];
    const probe = window.innerHeight * 0.45;
    for (const s of sections) { if (s.getBoundingClientRect().top <= probe) active = s; }
    if (active && sheetLabel) sheetLabel.textContent = 'SHEET ' + active.getAttribute('data-sheet');
  }
  window.addEventListener('scroll', () => { if (!rafScroll) rafScroll = requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveals (transform-only) ---------- */
  const rv = $$('.rv');
  if (!reduce && 'IntersectionObserver' in window) {
    rv.forEach((e) => e.classList.add('pending'));
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove('pending'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    rv.forEach((e) => io.observe(e));
    // above-the-fold now; safety net later
    requestAnimationFrame(() => {
      const vh = innerHeight;
      rv.forEach((e) => { if (e.getBoundingClientRect().top < vh * 0.95) { e.classList.remove('pending'); io.unobserve(e); } });
    });
    setTimeout(() => rv.forEach((e) => e.classList.remove('pending')), 1800);
  }

  /* ---------- project rows expand/collapse (keyboard + SR accessible) ---------- */
  $$('.part').forEach((part, idx) => {
    const row = $('.row', part), detail = $('.detail', part), inner = $('.inner', part);
    const did = 'part-detail-' + (idx + 1);
    detail.id = did;
    detail.inert = true; // collapsed: out of the tab order until opened
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-controls', did);
    row.setAttribute('aria-expanded', 'false');
    function toggle() {
      const open = part.classList.toggle('open');
      row.setAttribute('aria-expanded', open ? 'true' : 'false');
      detail.inert = !open;
      if (open) {
        $$('.part.open').forEach((p) => {
          if (p !== part) {
            p.classList.remove('open');
            const d = $('.detail', p); d.style.height = '0px'; d.inert = true;
            $('.row', p).setAttribute('aria-expanded', 'false');
          }
        });
        detail.style.height = inner.offsetHeight + 'px';
      } else {
        detail.style.height = '0px';
      }
    }
    row.addEventListener('click', toggle);
    row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  window.addEventListener('resize', () => {
    const open = $('.part.open');
    if (open) $('.detail', open).style.height = $('.inner', open).offsetHeight + 'px';
  });

  /* ---------- smooth nav + cv print ---------- */
  $$('[data-goto]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('data-goto');
      const t = document.getElementById(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    });
  });
  const cvDl = $('#cvDownload');
  if (cvDl) cvDl.addEventListener('click', (e) => { e.preventDefault(); window.print(); });

  /* ============================================================
     CONSOLE
     ============================================================ */
  const con = $('#console'), conBar = $('#consoleBar'), conBody = $('#consoleBody'),
        conInput = $('#consoleInput'), conHint = $('#consoleHint'), conInputRow = $('.inputrow', con);
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function out(html, cls) {
    const d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    conBody.appendChild(d);
    conBody.scrollTop = conBody.scrollHeight;
    return d;
  }
  function setMin(min) {
    con.classList.toggle('min', min);
    conBar.setAttribute('aria-expanded', String(!min));
    conBody.inert = min; conInputRow.inert = min; // off-screen when minimized: leave the tab order
    conHint.textContent = min ? 'click to open · type help' : 'esc to close';
    if (!min) setTimeout(() => conInput.focus(), 300);
  }
  conBar.setAttribute('role', 'button');
  conBar.setAttribute('tabindex', '0');
  conBar.setAttribute('aria-controls', 'consoleBody');
  conBar.setAttribute('aria-expanded', 'false');
  conBody.inert = true; conInputRow.inert = true; // starts minimized
  conBar.addEventListener('click', () => setMin(!con.classList.contains('min')));
  conBar.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMin(!con.classList.contains('min')); } });

  const SECTIONS = { a1: 'projects', a2: 'resume', a3: 'about', a4: 'contact',
    projects: 'projects', resume: 'resume', about: 'about', contact: 'contact', cover: 'cover', top: 'cover' };
  const PROJECTS = [
    ['P-01', 'Latticework', '2025', 'real-time collaborative graph editor · CRDT · WebGL'],
    ['P-02', 'Halfstep', '2024', 'ear-training app that listens · Web Audio · DSP'],
    ['P-03', 'Drift', '2024', 'self-hosted read-later · Go · SQLite'],
    ['P-04', 'Plumb', '2023', 'monorepo dependency-graph visualizer · D3 · CLI'],
  ];

  /* ---------- hidden ASCII art ---------- */
  const ART = {
    cat: " /\\_/\\\n( o.o )\n > ^ <   meow.",
    coffee: "    ( (\n     ) )\n  ........\n  |      |]\n  \\      /\n   `----'   refuel.",
    rocket: "    /\\\n   /  \\\n  | HL |\n  |    |\n /|_##_|\\\n/  |  |  \\\n   /__\\\n  ship it.",
    v: "\\            /\n \\          /\n  \\        /\n   \\      /\n    \\    /\n     \\  /\n      \\/   understanding.",
    skull: "   ______\n  /      \\\n |  X  X  |\n |   ||   |\n  \\ ---- /\n   |||||| ",
    hi: "  _   _ _\n | | | (_)\n | |_| | |\n |  _  | |\n |_| |_|_|  hey.",
  };
  function printArt(arg) {
    const keys = Object.keys(ART);
    let key = (arg || '').toLowerCase().trim();
    if (!key) key = keys[(Math.random() * keys.length) | 0];
    if (!ART[key]) { out('<span class="dim">no art for that. try:</span> <span class="ok">art ' + keys.join('</span> · <span class="ok">art ') + '</span>'); return; }
    const d = out('', 'ok');
    d.style.whiteSpace = 'pre';
    d.style.lineHeight = '1.15';
    d.textContent = ART[key];
  }

  const commands = {
    help() {
      out('<span class="dim">commands</span>');
      out('  <span class="ok">whoami</span>     who is this');
      out('  <span class="ok">projects</span>   list selected work');
      out('  <span class="ok">resume</span>     experience summary');
      out('  <span class="ok">about</span>      the short version');
      out('  <span class="ok">contact</span>    how to reach me');
      out('  <span class="ok">goto</span> &lt;a1-a4&gt; jump to a sheet');
      out('  <span class="ok">ls</span>         list sheets');
      out('  <span class="ok">cv</span>         print / save the resume');
      out('  <span class="ok">bg</span> &lt;style&gt;  backdrop: contour · dots · grid');
      out('  <span class="ok">clear</span>      wipe the console');
      out('  <span class="ok">play</span>       ▦ boot the hidden game');
    },
    whoami() {
      out('<span class="wt">hao lin</span> · founder @ <span class="ok">tolus.dev</span>, isef researcher.');
      out('<span class="dim">toronto. builds real-time systems, dev tools, and tolus.</span>');
    },
    projects() { PROJECTS.forEach((p) => out('<span class="dim">' + p[0] + '</span>  <span class="ok">' + p[1] + '</span> <span class="dim">(' + p[2] + ')</span>  ' + p[3])); },
    resume() {
      out('<span class="ok">2024–now</span>  Founder · Tolus');
      out('<span class="ok">2023–24 </span>  Software Engineer · Example Labs');
      out('<span class="ok">2022–23 </span>  Research Assistant · ISEF');
      out('<span class="dim">type</span> <span class="ok">cv</span> <span class="dim">to save the full pdf.</span>');
    },
    about() { out('developer at the seam where engineering meets craft. likes the whole stack, db query to animation curve. learns by building, then rebuilding.'); },
    contact() { out('email <span class="ok">hao@tolus.dev</span> · github <span class="ok">github.com/jappabl</span>'); },
    ls() { out('cover/  <span class="ok">projects/</span>  resume/  about/  contact/  <span class="dim">.assembly/</span>'); },
    cv() { out('<span class="dim">opening print dialog…</span>'); setTimeout(() => window.print(), 350); },
    clear() { conBody.innerHTML = ''; },
    goto(arg) {
      const key = (arg || '').toLowerCase().replace('#', '');
      const id = SECTIONS[key];
      if (!id) { out('<span class="dim">unknown sheet:</span> ' + esc(arg || '') + ' <span class="dim">— try</span> <span class="ok">ls</span>'); return; }
      out('<span class="dim">→ navigating to</span> <span class="ok">' + id + '</span>');
      document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    },
    play() { startGame(); },
    art(arg) { printArt(arg); },
    bg(arg) {
      const m = (arg || '').toLowerCase().trim();
      if (window.setBackground && window.setBackground(m)) out('<span class="dim">backdrop →</span> <span class="ok">' + m + '</span>');
      else out('<span class="dim">usage:</span> <span class="ok">bg contour</span> · <span class="ok">bg dots</span> · <span class="ok">bg grid</span>');
    },
    sudo() { out('<span class="dim">permission denied. this is a portfolio, not a kernel.</span>'); },
    assembly() { toggleAssembly(true); out('<span class="ok">assembly mode engaged.</span> <span class="dim">(or press ↑↑↓↓←→←→ b a)</span>'); },
  };
  function run(raw) {
    const cmd = raw.trim();
    out('<span class="pr">›</span> <span class="wt">' + esc(cmd) + '</span>');
    if (!cmd) return;
    const [name, ...rest] = cmd.split(/\s+/);
    const fn = commands[name.toLowerCase()];
    if (fn) fn(rest.join(' '));
    else out('<span class="dim">command not found:</span> ' + esc(name) + ' <span class="dim">— try</span> <span class="ok">help</span>');
  }
  const history = []; let hi = -1;
  conInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const v = conInput.value; if (v.trim()) { history.push(v); hi = history.length; } run(v); conInput.value = ''; }
    else if (e.key === 'ArrowUp') { if (hi > 0) { hi--; conInput.value = history[hi] || ''; e.preventDefault(); } }
    else if (e.key === 'ArrowDown') { if (hi < history.length - 1) { hi++; conInput.value = history[hi] || ''; } else { hi = history.length; conInput.value = ''; } }
    else if (e.key === 'Escape') { setMin(true); }
  });

  /* ============================================================
     EASTER EGG — konami → assembly mode
     ============================================================ */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kbuf = [];
  let assemblyOn = false;
  const stamp = $('#stamp');
  function toggleAssembly(force) {
    assemblyOn = force === undefined ? !assemblyOn : force;
    document.body.classList.toggle('assembly', assemblyOn);
    if (assemblyOn) {
      sections.forEach((s, i) => { s.style.transform = reduce ? 'none' : 'translateX(' + ((i % 2 ? 1 : -1) * 10) + 'px)'; });
      stamp.textContent = 'Assembly mode';
      stamp.classList.add('show');
      setTimeout(() => stamp.classList.remove('show'), 1600);
    } else {
      sections.forEach((s) => { s.style.transform = ''; });
    }
  }
  window.addEventListener('keydown', (e) => {
    if (document.activeElement === conInput) return;
    kbuf.push(e.key); kbuf = kbuf.slice(-KONAMI.length);
    if (KONAMI.every((k, i) => (kbuf[i] || '').toLowerCase() === k.toLowerCase())) { toggleAssembly(); kbuf = []; }
  });

  /* ============================================================
     HIDDEN GAME — minimal mono "snake" in the console
     ============================================================ */
  let game = null;
  function startGame() {
    if (!con.classList.contains('min')) {} else setMin(false);
    if (game) { out('<span class="dim">game already running. arrow keys to steer.</span>'); return; }
    out('<span class="ok">▦ snake</span> <span class="dim">— arrow keys / wasd · eat the red cell · esc to quit</span>');
    const cv = document.createElement('canvas');
    const N = 16, S = 13; cv.width = N * S; cv.height = N * S;
    conBody.appendChild(cv); conBody.scrollTop = conBody.scrollHeight;
    const ctx = cv.getContext('2d');
    let snake = [{ x: 7, y: 8 }], dir = { x: 1, y: 0 }, next = { x: 1, y: 0 },
        food = { x: 11, y: 8 }, score = 0, dead = false;
    function place() { food = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0 }; }
    function draw() {
      ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#1c1c22';
      for (let i = 0; i <= N; i++) { ctx.fillRect(i * S, 0, 1, cv.height); ctx.fillRect(0, i * S, cv.width, 1); }
      ctx.fillStyle = '#e5372a'; ctx.fillRect(food.x * S + 2, food.y * S + 2, S - 4, S - 4);
      ctx.fillStyle = '#e7e7ea';
      snake.forEach((p, i) => { ctx.fillStyle = i === 0 ? '#fff' : '#9c9ca6'; ctx.fillRect(p.x * S + 1, p.y * S + 1, S - 2, S - 2); });
    }
    function step() {
      if (dead) return;
      dir = next;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || snake.some((p) => p.x === head.x && p.y === head.y)) {
        dead = true; clearInterval(game.timer); game = null;
        out('<span class="dim">game over · score</span> <span class="ok">' + score + '</span><span class="dim">. type</span> <span class="ok">play</span> <span class="dim">to retry.</span>');
        cv.style.opacity = .4; window.removeEventListener('keydown', key); return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; place(); } else snake.pop();
      draw();
    }
    function key(e) {
      const k = e.key.toLowerCase();
      const map = { arrowup: [0,-1], w: [0,-1], arrowdown: [0,1], s: [0,1], arrowleft: [-1,0], a: [-1,0], arrowright: [1,0], d: [1,0] };
      if (k === 'escape') { dead = true; clearInterval(game.timer); game = null; cv.remove(); window.removeEventListener('keydown', key); out('<span class="dim">quit.</span>'); return; }
      if (map[k]) { const [x, y] = map[k]; if (x !== -dir.x || y !== -dir.y) next = { x, y }; e.preventDefault(); }
    }
    window.addEventListener('keydown', key);
    draw();
    game = { timer: setInterval(step, 120) };
  }

  // open console on first scroll to hint at it (once)
  let hinted = false;
  window.addEventListener('scroll', () => {
    if (hinted) return; hinted = true;
    conHint.textContent = 'click to open · type help';
  }, { passive: true, once: true });
})();
