/* Hao Lin · site interactions (vanilla, no deps) */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  /* ---------- text blips (off by default) ---------- */
  let soundOn = store.get('sound') === 'on';
  let actx = null;
  const soundBtn = $('#sound');
  function paintSound() {
    soundBtn.textContent = 'SOUND: ' + (soundOn ? 'ON' : 'OFF');
    soundBtn.setAttribute('aria-pressed', String(soundOn));
  }
  paintSound();
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn; store.set('sound', soundOn ? 'on' : 'off'); paintSound();
    if (soundOn) blip(520, 0.06);
  });
  function blip(freq, len) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'square'; o.frequency.value = freq || 440 + Math.random() * 60;
      g.gain.setValueAtTime(0.04, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (len || 0.04));
      o.connect(g).connect(actx.destination);
      o.start(); o.stop(actx.currentTime + (len || 0.04));
    } catch (e) { /* no audio, no problem */ }
  }

  /* ---------- dialogue boxes ---------- */
  // Each .talk box shows one <p> at a time, typed out. Full text stays in the DOM for screen readers.
  function Talk(box, opts) {
    const lines = $$('p', box);
    const more = document.createElement('span');
    more.className = 'more'; more.setAttribute('aria-hidden', 'true'); more.textContent = '▼';
    let i = -1, timer = 0, typing = false, full = '';

    function show(n) {
      clearInterval(timer);
      lines.forEach((p) => {
        p.classList.remove('on');
        if (p.dataset.full) p.textContent = p.dataset.full;
      });
      i = n;
      const p = lines[i];
      p.dataset.full = p.dataset.full || p.textContent;
      full = p.dataset.full;
      p.classList.add('on');
      more.remove();
      if (reduce) { done(); return; }
      let k = 0;
      typing = true;
      p.textContent = '';
      timer = setInterval(() => {
        k++;
        p.textContent = full.slice(0, k);
        const ch = full[k - 1];
        if (k % 2 === 0 && ch && ch !== ' ') blip();
        if (k >= full.length) done();
      }, 28);
    }
    function done() {
      clearInterval(timer); typing = false;
      lines[i].textContent = full;
      if (i < lines.length - 1 && opts && opts.interactive) box.appendChild(more);
    }
    function next() {
      if (typing) { done(); return; }
      if (i < lines.length - 1) show(i + 1);
    }
    if (opts && opts.interactive) {
      box.addEventListener('click', next);
      // Z / Enter advance when nothing else has focus (like a game)
      document.addEventListener('keydown', (e) => {
        const idle = document.activeElement === document.body || !document.activeElement;
        if (idle && (e.key === 'Enter' || e.key === 'z' || e.key === 'Z')) { e.preventDefault(); next(); }
      });
    }
    return { start: () => show(0), next, say(text) { lines.forEach((p, n) => n && p.remove()); lines.length = 1; lines[0].dataset.full = text; lines[0].textContent = text; show(0); } };
  }

  const intro = Talk($('#intro-talk'), { interactive: true });
  intro.start();

  /* ---------- menu tabs ---------- */
  const tabs = $$('.menu .opt');
  const panels = $$('.panel');
  const panelTalks = new Map(panels.map((p) => [p.id, Talk($('.talk', p))]));

  function select(id, opts) {
    if (!panels.some((p) => p.id === id)) id = 'work';
    tabs.forEach((t) => {
      const on = t.dataset.panel === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => p.classList.toggle('on', p.id === id));
    panelTalks.get(id).start();
    if (opts && opts.user) {
      history.replaceState(null, '', '#' + id);
      blip(660, 0.05);
      const panel = $('#' + id);
      if (panel.getBoundingClientRect().top > window.innerHeight * 0.7) panel.scrollIntoView({ block: 'start' });
    }
  }
  tabs.forEach((t, n) => {
    t.addEventListener('click', (e) => { e.preventDefault(); select(t.dataset.panel, { user: true }); });
    t.addEventListener('keydown', (e) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (dir) {
        e.preventDefault();
        const nt = tabs[(n + dir + tabs.length) % tabs.length];
        nt.focus(); blip(440, 0.03);
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault(); select(t.dataset.panel, { user: true });
      }
    });
  });
  select((location.hash || '#work').slice(1));

  /* ---------- inventory (work panel) ---------- */
  const inv = $('#inv');
  const items = $$('.item', inv);
  const list = document.createElement('div');
  list.className = 'list';
  list.setAttribute('aria-label', 'Projects');
  const btns = items.map((it, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = it.dataset.name;
    b.addEventListener('click', () => pick(n, true));
    b.addEventListener('keydown', (e) => {
      const dir = { ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (dir) { e.preventDefault(); const m = (n + dir + btns.length) % btns.length; btns[m].focus(); pick(m, true); }
    });
    list.appendChild(b);
    return b;
  });
  inv.prepend(list);
  inv.classList.add('ready');
  items.forEach((it) => it.setAttribute('aria-live', 'polite'));
  function pick(n, user) {
    btns.forEach((b, m) => b.setAttribute('aria-pressed', String(m === n)));
    items.forEach((it, m) => it.classList.toggle('on', m === n));
    if (user) blip(560, 0.04);
  }
  pick(0);

  /* ---------- minigame: dodge the syntax ---------- */
  const dlg = $('#fight');
  const cv = $('#arena');
  const ctx = cv.getContext('2d');
  const talk = Talk($('#fightTalk'));
  const hpEl = $('#hp'), clockEl = $('#clock');
  const startBtn = $('#fightStart'), closeBtn = $('#fightClose');
  const W = cv.width, H = cv.height, LEN = 20;
  const GLYPHS = [';', '{', '}', '<', '/>', '!', 'NaN', '()', '[]', '=>'];
  let game = null;

  $('#bugBtn').addEventListener('click', () => {
    if (typeof dlg.showModal !== 'function') return;
    dlg.showModal();
    reset();
    talk.say('* a bug blocks the way. it smells like a missing semicolon.');
    startBtn.focus();
  });
  closeBtn.addEventListener('click', () => { stop(); dlg.close(); });
  dlg.addEventListener('close', stop);
  startBtn.addEventListener('click', () => { start(); cv.focus(); });

  function reset() {
    stop();
    game = { x: W / 2, y: H / 2, hp: 5, t0: 0, last: 0, shots: [], spawn: 0, keys: {}, inv: 0, over: true };
    hpEl.textContent = '5'; clockEl.textContent = String(LEN);
    draw();
  }
  function start() {
    reset();
    game.over = false;
    game.t0 = game.last = performance.now();
    startBtn.textContent = 'DODGE';
    talk.say('* dodge the syntax. arrow keys or WASD. drag on touch.');
    game.raf = requestAnimationFrame(tick);
  }
  function stop() { if (game && game.raf) cancelAnimationFrame(game.raf); if (game) game.over = true; }
  function end(won) {
    stop();
    startBtn.textContent = 'AGAIN';
    talk.say(won ? '* you survived. the bug gives up and files itself as a feature.' : '* you got hit by one too many semicolons.');
    blip(won ? 880 : 180, 0.25);
    startBtn.focus();
  }

  function tick(now) {
    const g = game;
    const dt = Math.min(0.05, (now - g.last) / 1000); g.last = now;
    const left = LEN - (now - g.t0) / 1000;
    clockEl.textContent = String(Math.max(0, Math.ceil(left)));
    if (left <= 0) { draw(); end(true); return; }

    const sp = 140;
    const k = g.keys;
    g.x += ((k.ArrowRight || k.d ? 1 : 0) - (k.ArrowLeft || k.a ? 1 : 0)) * sp * dt;
    g.y += ((k.ArrowDown || k.s ? 1 : 0) - (k.ArrowUp || k.w ? 1 : 0)) * sp * dt;
    g.x = Math.max(6, Math.min(W - 6, g.x)); g.y = Math.max(6, Math.min(H - 6, g.y));

    const level = 1 - left / LEN; // 0 → 1
    g.spawn -= dt;
    if (g.spawn <= 0) {
      g.spawn = 0.55 - level * 0.35;
      const side = Math.random();
      const txt = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      const v = 70 + level * 90 + Math.random() * 40;
      if (side < 0.6) g.shots.push({ x: 10 + Math.random() * (W - 20), y: -10, vx: 0, vy: v, txt });
      else if (side < 0.8) g.shots.push({ x: -20, y: 10 + Math.random() * (H - 20), vx: v, vy: 0, txt });
      else g.shots.push({ x: W + 20, y: 10 + Math.random() * (H - 20), vx: -v, vy: 0, txt });
    }
    g.inv = Math.max(0, g.inv - dt);
    for (const s of g.shots) {
      s.x += s.vx * dt; s.y += s.vy * dt;
      const hw = 5 + s.txt.length * 4;
      if (!g.inv && Math.abs(s.x - g.x) < hw && Math.abs(s.y - g.y) < 10) {
        g.hp--; g.inv = 1; hpEl.textContent = String(g.hp); blip(160, 0.12);
        if (g.hp <= 0) { draw(); end(false); return; }
      }
    }
    g.shots = g.shots.filter((s) => s.x > -40 && s.x < W + 40 && s.y < H + 30);
    draw();
    g.raf = requestAnimationFrame(tick);
  }

  function draw() {
    const g = game;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.font = '20px VT323, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    for (const s of g.shots) ctx.fillText(s.txt, s.x, s.y);
    if (g.inv && ((g.inv * 10) | 0) % 2) return; // flicker after a hit
    ctx.fillStyle = g.inv ? '#ff5a4f' : '#ffe14d';
    ctx.fillRect((g.x - 5) | 0, (g.y - 5) | 0, 10, 10);
  }

  const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
  dlg.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (KEYS.includes(key) && game && !game.over) { e.preventDefault(); game.keys[key] = true; }
  });
  dlg.addEventListener('keyup', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (game) game.keys[key] = false;
  });
  // touch / mouse drag: player follows the pointer
  cv.tabIndex = 0;
  cv.addEventListener('pointermove', (e) => {
    if (!game || game.over || (e.pointerType === 'mouse' && !e.buttons)) return;
    const r = cv.getBoundingClientRect();
    game.x = ((e.clientX - r.left) / r.width) * W;
    game.y = ((e.clientY - r.top) / r.height) * H;
  });
})();
