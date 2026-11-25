// Warung Hantu — semua gambar: lantai dapur, stasiun, hantu pelanggan,
// papan pesanan, koki, HUD, layar judul dan layar akhir. Kanvas 2D saja.

import { INGREDIENTS, RECIPES, STATIONS, VIEW_H, VIEW_W } from './config.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, align, weight) {
  ctx.fillStyle = color;
  ctx.font = (weight || '700') + ' ' + size + 'px Verdana, sans-serif';
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// --- Ikon bahan, digambar sebagai vektor (tanpa file gambar) ---
export function drawIngredientIcon(ctx, id, cx, cy, s) {
  const ing = INGREDIENTS[id];
  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineWidth = Math.max(1.5, s * 0.06);
  if (id === 'nasi') {
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath(); ctx.ellipse(0, s * 0.18, s * 0.42, s * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ing.color;
    ctx.beginPath(); ctx.ellipse(0, s * 0.02, s * 0.34, s * 0.26, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(-s * 0.08, -s * 0.06, s * 0.1, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'mie') {
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath(); ctx.ellipse(0, s * 0.18, s * 0.42, s * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ing.color; ctx.lineWidth = s * 0.09; ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, s * 0.02 + i * s * 0.09);
      ctx.bezierCurveTo(-s * 0.1, s * 0.1 + i * s * 0.09, s * 0.1, -s * 0.06 + i * s * 0.09, s * 0.3, s * 0.02 + i * s * 0.09);
      ctx.stroke();
    }
  } else if (id === 'ayam') {
    ctx.fillStyle = ing.color;
    ctx.beginPath(); ctx.ellipse(-s * 0.05, -s * 0.05, s * 0.3, s * 0.24, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f5efe0'; ctx.lineWidth = s * 0.09; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s * 0.18, s * 0.12); ctx.lineTo(s * 0.36, s * 0.32); ctx.stroke();
    ctx.fillStyle = '#f5efe0';
    ctx.beginPath(); ctx.arc(s * 0.38, s * 0.34, s * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.3, s * 0.4, s * 0.08, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'sayur') {
    ctx.fillStyle = ing.color;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.16, s * 0.34, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.16, s * 0.34, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ing.dark; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.3); ctx.lineTo(0, s * 0.34); ctx.stroke();
  } else if (id === 'telur') {
    ctx.fillStyle = ing.color;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.26, s * 0.32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f7c948';
    ctx.beginPath(); ctx.arc(0, s * 0.05, s * 0.11, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'cabai') {
    ctx.fillStyle = ing.color;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.1);
    ctx.quadraticCurveTo(0, -s * 0.42, s * 0.32, -s * 0.05);
    ctx.quadraticCurveTo(s * 0.36, s * 0.28, s * 0.1, s * 0.3);
    ctx.quadraticCurveTo(s * 0.22, s * 0.05, -s * 0.3, -s * 0.1);
    ctx.fill();
    ctx.strokeStyle = '#3e7d32'; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s * 0.3, -s * 0.08); ctx.quadraticCurveTo(s * 0.42, -s * 0.24, s * 0.36, -s * 0.34); ctx.stroke();
  }
  ctx.restore();
}

function drawGhost(ctx, ghost, x, y, s, t, mood) {
  const bob = Math.sin(t * 2 + x * 0.01) * 4;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.shadowColor = ghost.glow;
  ctx.shadowBlur = 18;
  ctx.fillStyle = ghost.body;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.55);
  ctx.arc(0, -s * 0.1, s * 0.45, Math.PI, 0);
  ctx.lineTo(s * 0.45, s * 0.4);
  for (let i = 0; i < 3; i++) {
    const wx = s * 0.45 - (i + 0.5) * s * 0.3;
    ctx.quadraticCurveTo(wx, s * 0.22, wx - s * 0.15, s * 0.4);
  }
  ctx.lineTo(-s * 0.45, s * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  // Mata dan mulut mengikuti suasana hati.
  ctx.fillStyle = ghost.eye;
  const eyeY = -s * 0.12;
  if (mood === 'angry') {
    ctx.beginPath(); ctx.moveTo(-s * 0.26, eyeY - s * 0.08); ctx.lineTo(-s * 0.08, eyeY + s * 0.02); ctx.lineTo(-s * 0.26, eyeY + s * 0.06); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.26, eyeY - s * 0.08); ctx.lineTo(s * 0.08, eyeY + s * 0.02); ctx.lineTo(s * 0.26, eyeY + s * 0.06); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.16, s * 0.07, Math.PI, 0); ctx.fill();
  } else if (mood === 'happy') {
    ctx.beginPath(); ctx.arc(-s * 0.16, eyeY, s * 0.06, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.16, eyeY, s * 0.06, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.12, 0, Math.PI); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(-s * 0.16, eyeY, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.16, eyeY, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, s * 0.14, s * 0.06, s * 0.09, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawStationBase(ctx, s, highlight) {
  ctx.fillStyle = highlight ? '#5d4037' : '#4e342e';
  roundRect(ctx, s.x - 4, s.y - 4, s.w + 8, s.h + 8, 10);
  ctx.fill();
  ctx.fillStyle = '#6d4c41';
  roundRect(ctx, s.x, s.y, s.w, s.h, 8);
  ctx.fill();
}

function drawBoard(ctx, game, s, t) {
  drawStationBase(ctx, s, false);
  text(ctx, 'TALENAN', s.x + s.w / 2, s.y + 14, 12, '#d7ccc8', 'center', '700');
  ctx.fillStyle = '#d7a05b';
  roundRect(ctx, s.x + 14, s.y + 26, s.w - 28, s.h - 38, 6);
  ctx.fill();
  const item = game.board.item;
  if (item) {
    if (item.stage === 'raw') {
      drawIngredientIcon(ctx, item.id, s.x + s.w / 2, s.y + 46, 36);
      const p = Math.min(1, game.board.progress / 1.6);
      ctx.fillStyle = '#3e2723';
      roundRect(ctx, s.x + 18, s.y + s.h - 14, s.w - 36, 7, 3);
      ctx.fill();
      ctx.fillStyle = '#ffd54a';
      roundRect(ctx, s.x + 18, s.y + s.h - 14, (s.w - 36) * p, 7, 3);
      ctx.fill();
      text(ctx, 'CINCANG...', s.x + s.w / 2, s.y + s.h - 26, 11, '#3e2723', 'center', '800');
    } else {
      drawIngredientIcon(ctx, item.id, s.x + s.w / 2, s.y + 46, 36);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(s.x + 20, s.y + 30, s.w - 40, s.h - 44);
      ctx.setLineDash([]);
      text(ctx, 'SIAP!', s.x + s.w / 2, s.y + s.h - 26, 11, '#3e2723', 'center', '800');
    }
  } else {
    text(ctx, 'taruh bahan', s.x + s.w / 2, s.y + s.h / 2 + 6, 12, '#8d6e63', 'center', '600');
    text(ctx, 'mentah di sini', s.x + s.w / 2, s.y + s.h / 2 + 24, 12, '#8d6e63', 'center', '600');
  }
}

function drawWok(ctx, game, s, t) {
  drawStationBase(ctx, s, false);
  text(ctx, 'WAJAN', s.x + s.w / 2, s.y + 14, 12, '#d7ccc8', 'center', '700');
  // Api di bawah wajan.
  const flame = 0.7 + Math.sin(t * 9) * 0.3;
  ctx.fillStyle = '#ff7043';
  ctx.beginPath();
  ctx.moveTo(s.x + 24, s.y + s.h - 12);
  ctx.quadraticCurveTo(s.x + s.w / 2, s.y + s.h - 12 - 26 * flame, s.x + s.w - 24, s.y + s.h - 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#37474f';
  ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 52, s.w / 2 - 14, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#263238';
  ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 48, s.w / 2 - 20, 15, 0, 0, Math.PI * 2); ctx.fill();
  const item = game.wok.item;
  if (item) {
    drawIngredientIcon(ctx, item.id, s.x + s.w / 2, s.y + 44, 36);
    if (item.stage === 'chopped') {
      const p = Math.min(1, game.wok.progress / 2.6);
      ctx.fillStyle = '#3e2723';
      roundRect(ctx, s.x + 18, s.y + s.h - 14, s.w - 36, 7, 3);
      ctx.fill();
      ctx.fillStyle = '#ff7043';
      roundRect(ctx, s.x + 18, s.y + s.h - 14, (s.w - 36) * p, 7, 3);
      ctx.fill();
    } else if (item.stage === 'cooked') {
      const left = Math.max(0, 5 - (game.wok.progress - game.wok.doneAt));
      text(ctx, 'MATANG! ' + left.toFixed(0) + ' dtk', s.x + s.w / 2, s.y + s.h - 26, 11, '#ffe082', 'center', '800');
    } else {
      text(ctx, 'GOSONG!', s.x + s.w / 2, s.y + s.h - 26, 12, '#ff8a80', 'center', '800');
    }
  } else {
    text(ctx, 'taruh cincangan', s.x + s.w / 2, s.y + 50, 12, '#90a4ae', 'center', '600');
  }
}

function drawPlateStation(ctx, game, s) {
  drawStationBase(ctx, s, false);
  text(ctx, 'MEJA PLATING', s.x + s.w / 2, s.y + 14, 12, '#d7ccc8', 'center', '700');
  // Piring putih besar.
  ctx.fillStyle = '#eceff1';
  ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 56, 52, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 54, 44, 18, 0, 0, Math.PI * 2); ctx.fill();
  const items = game.plate;
  if (items.length === 0) {
    text(ctx, 'piring kosong', s.x + s.w / 2, s.y + 56, 11, '#90a4ae', 'center', '600');
  } else {
    items.forEach((id, i) => {
      const ox = (i - (items.length - 1) / 2) * 26;
      drawIngredientIcon(ctx, id, s.x + s.w / 2 + ox, s.y + 54, 26);
    });
  }
  const recipe = items.length >= 2 ? recipeByIdMatch(items) : null;
  if (recipe) {
    text(ctx, '✓ SIAP DISAJIKAN!', s.x + s.w / 2, s.y + s.h - 10, 11, '#8affc1', 'center', '800');
  } else if (items.length > 0) {
    text(ctx, items.length + '/3 bahan', s.x + s.w / 2, s.y + s.h - 10, 11, '#ffe082', 'center', '700');
  }
}

function recipeByIdMatch(items) {
  // Dipakai render saja: cocokkan piring dengan resep (tanpa efek samping).
  for (const r of RECIPES) if (r.items.every((id) => items.includes(id))) return r;
  return null;
}

function drawBin(ctx, s) {
  drawStationBase(ctx, s, false);
  drawIngredientIcon(ctx, s.item, s.x + s.w / 2, s.y + 38, 46);
  text(ctx, s.label.toUpperCase(), s.x + s.w / 2, s.y + s.h - 14, 13, '#ffecb3', 'center', '800');
}

function drawWindow(ctx, game, t) {
  const s = STATIONS.window;
  drawStationBase(ctx, s, false);
  text(ctx, 'JENDELA SAJI', s.x + s.w / 2, s.y + 14, 12, '#d7ccc8', 'center', '700');
  // Hantu-hantu menunggu di balik jendela, satu per pesanan.
  game.orders.forEach((order, i) => {
    const gx = s.x + 48 + i * 88;
    const gy = s.y + 118;
    const mood = order.patience < 12 ? 'angry' : (order.age < 3 ? 'happy' : 'neutral');
    drawGhost(ctx, order.ghost, gx, gy, 52, t + order.bob, mood);
    text(ctx, order.ghost.name, gx, s.y + s.h - 12, 11, '#ffffff', 'center', '700');
  });
  if (game.orders.length === 0) {
    text(ctx, 'belum ada hantu...', s.x + s.w / 2, s.y + 120, 13, '#90a4ae', 'center', '600');
  }
  // Panah "sajikan di sini" kalau piring sudah lengkap.
  if (game.plate.length >= 2) {
    const pulse = 0.6 + Math.sin(t * 5) * 0.4;
    ctx.globalAlpha = pulse;
    text(ctx, '▼ SAJIKAN (E)', s.x + s.w / 2, s.y + s.h + 16, 13, '#8affc1', 'center', '800');
    ctx.globalAlpha = 1;
  }
}

function drawOrderBoard(ctx, game, t) {
  const x = 16, y = 80, w = 264;
  ctx.fillStyle = '#3e2723';
  roundRect(ctx, x, y, w, 624, 14);
  ctx.fill();
  ctx.fillStyle = '#5d4037';
  roundRect(ctx, x + 6, y + 6, w - 12, 612, 10);
  ctx.fill();
  text(ctx, '📋 PAPAN PESANAN', x + w / 2, y + 26, 15, '#ffecb3', 'center', '800');
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x + 16, y + 44); ctx.lineTo(x + w - 16, y + 44); ctx.stroke();

  if (game.orders.length === 0) {
    text(ctx, 'Hantu pertama segera', x + w / 2, y + 120, 13, '#d7ccc8', 'center', '600');
    text(ctx, 'datang memesan...', x + w / 2, y + 142, 13, '#d7ccc8', 'center', '600');
  }
  game.orders.forEach((order, i) => {
    const ty = y + 58 + i * 168;
    const urgent = order.patience < 12;
    ctx.fillStyle = urgent ? '#4a1f1a' : '#fff8e1';
    roundRect(ctx, x + 12, ty, w - 24, 154, 10);
    ctx.fill();
    const ink = urgent ? '#ffffff' : '#3e2723';
    const inkSoft = urgent ? '#ffcdd2' : '#5d4037';
    const inkFaint = urgent ? '#ef9a9a' : '#8d6e63';
    // Kepala hantu kecil + nama.
    drawGhost(ctx, order.ghost, x + 44, ty + 40, 44, t + order.bob, urgent ? 'angry' : 'neutral');
    text(ctx, order.ghost.name, x + 76, ty + 22, 14, ink, 'left', '800');
    text(ctx, order.recipe.name, x + 76, ty + 44, 12, inkSoft, 'left', '700');
    // Bahan resep.
    text(ctx, 'BAHAN:', x + 20, ty + 76, 11, inkFaint, 'left', '700');
    order.recipe.items.forEach((id, j) => {
      drawIngredientIcon(ctx, id, x + 86 + j * 34, ty + 76, 26);
    });
    // Bisikan rahasia: terlihat 8 detik pertama, lalu "?" — kecuali
    // koki berdiri dekat jendela saji (mengintip lagi).
    const nearWindow = game.player.x > 950 && game.player.y < 430;
    const showWhisper = order.age < 8 || nearWindow;
    const wx = x + 12, wy = ty + 98;
    ctx.fillStyle = showWhisper ? '#e3f2fd' : '#eceff1';
    roundRect(ctx, wx + 8, wy, w - 40, 28, 14);
    ctx.fill();
    if (showWhisper) {
      text(ctx, '💬 bisik: + ' + INGREDIENTS[order.whisper].name + ' = BONUS x2!', wx + 14, wy + 14, 11, '#1565c0', 'left', '700');
    } else {
      text(ctx, '💬 bisik: ???  (dekati jendela untuk mengintip)', wx + 14, wy + 14, 10, '#78909c', 'left', '700');
    }
    // Bar kesabaran.
    const frac = Math.max(0, order.patience / order.patienceMax);
    ctx.fillStyle = '#d7ccc8';
    roundRect(ctx, x + 20, ty + 140, w - 40, 8, 4);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#66bb6a' : frac > 0.25 ? '#ffa726' : '#ef5350';
    roundRect(ctx, x + 20, ty + 140, (w - 40) * frac, 8, 4);
    ctx.fill();
    if (order.angry) text(ctx, 'MURKA! 2x lebih cepat', x + w / 2, ty + 132, 10, urgent ? '#ff8a80' : '#c62828', 'center', '800');
  });

  // Cara main singkat di bawah papan.
  const hy = y + 540;
  ctx.fillStyle = '#4e342e';
  roundRect(ctx, x + 12, hy, w - 24, 66, 8);
  ctx.fill();
  text(ctx, 'WASD / klik: jalan  •  E: pakai stasiun', x + w / 2, hy + 16, 11, '#ffecb3', 'center', '700');
  text(ctx, 'Ambil → cincang → masak → plating', x + w / 2, hy + 34, 11, '#ffecb3', 'center', '700');
  text(ctx, '→ sajikan ke hantu yang memesan', x + w / 2, hy + 52, 11, '#ffecb3', 'center', '700');
}

function drawChef(ctx, game, t) {
  const p = game.player;
  const bob = p.walking ? Math.sin(t * 12) * 3 : Math.sin(t * 2) * 1.5;
  ctx.save();
  ctx.translate(p.x, p.y + bob * 0.3);
  // Bayangan.
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(0, 26, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
  // Badan koki.
  ctx.fillStyle = '#f5f5f5';
  roundRect(ctx, -18, -6, 36, 34, 10);
  ctx.fill();
  ctx.fillStyle = '#e53935';
  ctx.fillRect(-18, 8, 36, 5);
  // Kepala + topi koki.
  ctx.fillStyle = '#ffcc9e';
  ctx.beginPath(); ctx.arc(0, -16, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-8, -26, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -30, 9, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(8, -26, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-14, -28, 28, 6);
  // Mata.
  ctx.fillStyle = '#222222';
  ctx.beginPath(); ctx.arc(-5 + p.facing * 2, -16, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5 + p.facing * 2, -16, 1.8, 0, Math.PI * 2); ctx.fill();
  // Bahan di tangan.
  if (p.hands) {
    const hx = p.facing * 24;
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.arc(hx, -2, 17, 0, Math.PI * 2); ctx.fill();
    drawIngredientIcon(ctx, p.hands.id, hx, -2, 26);
    if (p.hands.stage === 'burnt') {
      text(ctx, '✖', hx, -2, 16, '#ff5252', 'center', '800');
    } else if (p.hands.stage === 'chopped') {
      text(ctx, '✂', hx + 10, -14, 12, '#ffffff', 'center', '800');
    }
  }
  ctx.restore();
  // Target jalan (klik).
  if (p.moveTarget) {
    ctx.strokeStyle = 'rgba(255,213,74,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.moveTarget.x, p.moveTarget.y, 8 + Math.sin(t * 6) * 2, 0, Math.PI * 2); ctx.stroke();
  }
}

function drawHud(ctx, game) {
  ctx.fillStyle = '#2b1a12';
  ctx.fillRect(0, 0, VIEW_W, 64);
  ctx.fillStyle = '#ff7043';
  ctx.fillRect(0, 60, VIEW_W, 4);
  text(ctx, '👻 WARUNG HANTU', 16, 32, 20, '#ffd54a', 'left', '800');
  text(ctx, 'Dapur Pasar Malam', 236, 34, 13, '#ffcc80', 'left', '600');
  // Timer shift.
  const frac = game.shiftLeft / 180;
  const bx = 420, bw = 280;
  ctx.fillStyle = '#4e342e';
  roundRect(ctx, bx, 18, bw, 28, 14);
  ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#66bb6a' : frac > 0.25 ? '#ffa726' : '#ef5350';
  roundRect(ctx, bx, 18, bw * frac, 28, 14);
  ctx.fill();
  const mm = Math.floor(game.shiftLeft / 60);
  const ss = Math.floor(game.shiftLeft % 60).toString().padStart(2, '0');
  text(ctx, '⏱ ' + mm + ':' + ss, bx + bw / 2, 33, 16, '#ffffff', 'center', '800');
  text(ctx, 'SKOR ' + game.score, 740, 32, 18, '#ffffff', 'left', '800');
  text(ctx, '🪙 ' + game.coins, 900, 32, 18, '#ffd54a', 'left', '800');
  // Nyawa: hati merah untuk sisa nyawa, abu-abu untuk yang hilang.
  for (let i = 0; i < 3; i++) {
    text(ctx, '♥', 1036 + i * 28, 32, 22, i < game.hearts ? '#ef5350' : '#5d4037', 'center', '400');
  }
  text(ctx, '🍽 ' + game.served + ' tersaji', 1264, 32, 13, '#ffcc80', 'right', '700');
}

function drawFloaters(ctx, game) {
  for (const f of game.floaters) {
    ctx.globalAlpha = Math.min(1, f.life);
    text(ctx, f.text, f.x, f.y - (1.4 - f.life) * 30, 15, f.color, 'center', '800');
  }
  ctx.globalAlpha = 1;
}

function drawToast(ctx, game) {
  if (!game.toast) return;
  const a = Math.min(1, game.toast.life);
  ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  roundRect(ctx, VIEW_W / 2 - 260, 84, 520, 56, 12);
  ctx.fill();
  ctx.strokeStyle = game.toast.color;
  ctx.lineWidth = 2;
  roundRect(ctx, VIEW_W / 2 - 260, 84, 520, 56, 12);
  ctx.stroke();
  text(ctx, game.toast.text, VIEW_W / 2, 104, 17, game.toast.color, 'center', '800');
  if (game.toast.sub) text(ctx, game.toast.sub, VIEW_W / 2, 126, 12, '#ffffff', 'center', '600');
  ctx.globalAlpha = 1;
}

function drawTitle(ctx, game, t) {
  ctx.fillStyle = 'rgba(20,8,4,0.82)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // Hantu-hantu hiasan.
  drawGhost(ctx, { body: '#ffffff', glow: '#ffc7dd', eye: '#7a1030' }, 300, 220, 90, t, 'happy');
  drawGhost(ctx, { body: '#fff8d6', glow: '#ffe27a', eye: '#222222' }, 980, 220, 90, t + 1.5, 'happy');
  text(ctx, '👻 WARUNG HANTU 👻', VIEW_W / 2, 300, 52, '#ffd54a', 'center', '800');
  text(ctx, 'DAPUR PASAR MALAM', VIEW_W / 2, 348, 24, '#ffcc80', 'center', '700');
  text(ctx, 'Masak hidangan untuk menenangkan hantu-hantu lapar.', VIEW_W / 2, 398, 17, '#ffffff', 'center', '600');
  text(ctx, 'Setiap hantu membisikkan satu bahan rahasia —', VIEW_W / 2, 428, 17, '#8affc1', 'center', '700');
  text(ctx, 'sajikan dengan bahan itu untuk BONUS GANDA!', VIEW_W / 2, 452, 17, '#8affc1', 'center', '700');
  const pulse = 0.65 + Math.sin(t * 4) * 0.35;
  ctx.globalAlpha = pulse;
  text(ctx, '▶  KLIK atau tekan ENTER untuk mulai memasak', VIEW_W / 2, 520, 20, '#ffffff', 'center', '800');
  ctx.globalAlpha = 1;
  text(ctx, 'WASD / panah: jalan  •  E / klik: pakai stasiun  •  R: ulangi', VIEW_W / 2, 566, 14, '#bcaaa4', 'center', '600');
  text(ctx, 'Ambil bahan → cincang di talenan → masak di wajan → tata di piring → sajikan!', VIEW_W / 2, 592, 14, '#bcaaa4', 'center', '600');
}

function drawGameOver(ctx, game) {
  ctx.fillStyle = 'rgba(20,8,4,0.85)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  const won = game.shiftLeft <= 0 && game.hearts > 0;
  text(ctx, won ? '🌙 SHIFT SELESAI!' : '👻 DAPUR TUTUP...', VIEW_W / 2, 220, 44, won ? '#8affc1' : '#ff8a80', 'center', '800');
  text(ctx, won ? 'Para hantu pulang dengan perut kenyang.' : 'Para hantu pergi dengan marah dan lapar.', VIEW_W / 2, 268, 17, '#ffffff', 'center', '600');
  text(ctx, 'SKOR AKHIR: ' + game.score, VIEW_W / 2, 340, 30, '#ffd54a', 'center', '800');
  text(ctx, '🪙 ' + game.coins + ' koin   •   🍽 ' + game.served + ' hidangan tersaji   •   ✨ ' + game.perfect + ' sempurna', VIEW_W / 2, 392, 17, '#ffffff', 'center', '700');
  text(ctx, '😡 ' + game.angry + ' hantu kabur karena marah', VIEW_W / 2, 424, 15, '#ffcc80', 'center', '600');
  text(ctx, 'Tekan R untuk memasak lagi', VIEW_W / 2, 500, 18, '#ffffff', 'center', '800');
}

export function render(ctx, game, t) {
  ctx.save();
  if (game.shake > 0) {
    ctx.translate((Math.random() - 0.5) * game.shake * 14, (Math.random() - 0.5) * game.shake * 14);
  }
  // Lantai dapur: ubin kotak-kotak hangat.
  ctx.fillStyle = '#3b2a20';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  const tile = 64;
  for (let y = 64; y < VIEW_H; y += tile) {
    for (let x = 0; x < VIEW_W; x += tile) {
      ctx.fillStyle = ((x / tile + y / tile) % 2 === 0) ? '#4a3428' : '#433025';
      ctx.fillRect(x, y, tile, tile);
    }
  }
  // Karpet lorong dapur.
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(292, 440, 972, 110);
  ctx.fillStyle = '#6d4c41';
  for (let x = 300; x < 1260; x += 48) ctx.fillRect(x, 488, 28, 12);

  drawOrderBoard(ctx, game, t);

  // Stasiun dapur.
  drawBin(ctx, STATIONS.binNasi);
  drawBin(ctx, STATIONS.binMie);
  drawBin(ctx, STATIONS.binAyam);
  drawBin(ctx, STATIONS.binSayur);
  drawBin(ctx, STATIONS.binTelur);
  drawBin(ctx, STATIONS.binCabai);
  drawBoard(ctx, game, STATIONS.board, t);
  drawWok(ctx, game, STATIONS.wok, t);
  drawPlateStation(ctx, game, STATIONS.plate);
  drawTrash(ctx, STATIONS.trash);
  drawWindow(ctx, game, t);

  drawChef(ctx, game, t);
  drawFloaters(ctx, game);
  drawHud(ctx, game);
  drawToast(ctx, game);

  if (game.phase === 'title') drawTitle(ctx, game, t);
  if (game.phase === 'over') drawGameOver(ctx, game);
  ctx.restore();
}

function drawTrash(ctx, s) {
  drawStationBase(ctx, s, false);
  ctx.fillStyle = '#37474f';
  roundRect(ctx, s.x + 16, s.y + 30, s.w - 32, s.h - 42, 6);
  ctx.fill();
  ctx.fillStyle = '#546e7a';
  ctx.fillRect(s.x + 12, s.y + 24, s.w - 24, 8);
  text(ctx, 'SAMPAH', s.x + s.w / 2, s.y + 14, 11, '#d7ccc8', 'center', '700');
  text(ctx, '🗑', s.x + s.w / 2, s.y + 58, 26, '#ffffff', 'center', '400');
}
