/* ============================================================
   Hao Lin — site backdrop. Canvas backgrounds in the schematic
   palette. Modes: contour (default) · dots · grid. Static + calm.
   ============================================================ */
(function () {
  'use strict';
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  const css = getComputedStyle(document.body);
  const cv = (n, f) => { const v = css.getPropertyValue(n).trim(); return v || f; };
  const COL = cv('--line-2', '#cdcdd4');
  const COLF = cv('--line', '#e4e4e9');
  const SIG = cv('--signal', '#e5372a');

  let mode = localStorage.getItem('hl-bg') || 'contour';
  let seed = 1;

  function hexA(hex, a) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  // deterministic rng so a redraw on resize keeps the same map
  function rng() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }

  /* ---------- value noise (smooth blobs) ---------- */
  function buildField(cell) {
    const cols = Math.ceil(W / cell) + 2, rows = Math.ceil(H / cell) + 2;
    const nc = 11, nr = Math.max(6, Math.round(nc * H / W));
    const g = [];
    for (let i = 0; i <= nr; i++) { const r = []; for (let j = 0; j <= nc; j++) r.push(rng()); g.push(r); }
    const ss = (t) => t * t * (3 - 2 * t);
    function noise(u, v) {
      const fx = u * nc, fy = v * nr;
      const x0 = Math.min(Math.floor(fx), nc - 1), y0 = Math.min(Math.floor(fy), nr - 1);
      const tx = ss(fx - x0), ty = ss(fy - y0);
      const a = g[y0][x0], b = g[y0][x0 + 1], c = g[y0 + 1][x0], d = g[y0 + 1][x0 + 1];
      return a * (1 - tx) * (1 - ty) + b * tx * (1 - ty) + c * (1 - tx) * ty + d * tx * ty;
    }
    const f = [];
    for (let i = 0; i < rows; i++) { const r = []; for (let j = 0; j < cols; j++) r.push(noise((j * cell) / W, (i * cell) / H)); f.push(r); }
    return { f, cols, rows, cell };
  }
  const ip = (a, b, l) => { const d = b - a; const t = d === 0 ? 0.5 : (l - a) / d; return t < 0 ? 0 : t > 1 ? 1 : t; };

  function contour() {
    seed = 20260607; // fixed seed → same landscape every render
    const { f, cols, rows, cell } = buildField(18);
    const levels = [];
    for (let L = 0.16; L < 0.9; L += 0.12) levels.push(L);
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = hexA(COL, 0.75);
    levels.forEach((lev) => {
      ctx.beginPath();
      for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < cols - 1; j++) {
          const x = j * cell, y = i * cell;
          const tl = f[i][j], tr = f[i][j + 1], br = f[i + 1][j + 1], bl = f[i + 1][j];
          let idx = 0; if (tl > lev) idx |= 8; if (tr > lev) idx |= 4; if (br > lev) idx |= 2; if (bl > lev) idx |= 1;
          if (idx === 0 || idx === 15) continue;
          const T = [x + cell * ip(tl, tr, lev), y];
          const R = [x + cell, y + cell * ip(tr, br, lev)];
          const B = [x + cell * ip(bl, br, lev), y + cell];
          const Lf = [x, y + cell * ip(tl, bl, lev)];
          const seg = (a, b) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); };
          switch (idx) {
            case 1: case 14: seg(Lf, B); break;
            case 2: case 13: seg(B, R); break;
            case 3: case 12: seg(Lf, R); break;
            case 4: case 11: seg(T, R); break;
            case 5: seg(Lf, T); seg(B, R); break;
            case 6: case 9: seg(T, B); break;
            case 7: case 8: seg(Lf, T); break;
            case 10: seg(T, R); seg(Lf, B); break;
          }
        }
      }
      ctx.stroke();
    });
  }

  function dots() {
    const s = 26;
    ctx.fillStyle = hexA(COL, 1);
    for (let y = s; y < H; y += s) for (let x = s; x < W; x += s) ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
    ctx.strokeStyle = hexA(COL, 1); ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = s; y < H; y += s * 5) for (let x = s; x < W; x += s * 5) {
      ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4);
    }
    ctx.stroke();
    seed = 4410; ctx.fillStyle = hexA(SIG, 0.7);
    for (let k = 0; k < 3; k++) { const x = rng() * W, y = rng() * H; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill(); }
  }

  function grid() {
    ctx.strokeStyle = hexA(COLF, 1); ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < W; x += 40) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = 0; y < H; y += 40) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke();
    ctx.strokeStyle = hexA(COL, 0.7);
    ctx.beginPath();
    for (let x = 0; x < W; x += 200) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = 0; y < H; y += 200) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    if (mode === 'dots') dots();
    else if (mode === 'grid') grid();
    else contour();
  }

  let rt = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 160); });

  window.setBackground = function (m) {
    if (!['contour', 'dots', 'grid'].includes(m)) return false;
    mode = m; localStorage.setItem('hl-bg', m); render(); return true;
  };
  window.getBackground = () => mode;

  resize();
})();
