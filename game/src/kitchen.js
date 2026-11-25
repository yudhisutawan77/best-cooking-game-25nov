// Warung Hantu — dapur: gerakan koki, jarak ke stasiun, dan semua interaksi
// (ambil bahan, cincang, masak, plating, buang, sajikan).

import { PLAYER_SPEED, STATIONS } from './config.js';
import { addFloater, servePlate, showToast } from './state.js';

export function stationAt(game, x, y) {
  for (const key of Object.keys(STATIONS)) {
    const s = STATIONS[key];
    if (x >= s.x - 6 && x <= s.x + s.w + 6 && y >= s.y - 6 && y <= s.y + s.h + 6) {
      return { key, ...s };
    }
  }
  return null;
}

export function nearestStation(game) {
  const p = game.player;
  let best = null;
  let bestD = 1e9;
  for (const key of Object.keys(STATIONS)) {
    const s = STATIONS[key];
    const cx = Math.max(s.x, Math.min(p.x, s.x + s.w));
    const cy = Math.max(s.y, Math.min(p.y, s.y + s.h));
    const d = Math.hypot(p.x - cx, p.y - cy);
    if (d < bestD) { bestD = d; best = { key, ...s }; }
  }
  return bestD <= 78 ? best : null;
}

function clampPlayer(p) {
  p.x = Math.max(300, Math.min(1264, p.x));
  p.y = Math.max(96, Math.min(700, p.y));
}

// Gerakkan koki ke arah (dx, dy) ternormalisasi selama dt.
export function movePlayer(game, dx, dy, dt) {
  const p = game.player;
  if (dx === 0 && dy === 0) { p.walking = false; return; }
  const len = Math.hypot(dx, dy);
  p.x += (dx / len) * PLAYER_SPEED * dt;
  p.y += (dy / len) * PLAYER_SPEED * dt;
  p.facing = dx !== 0 ? Math.sign(dx) : p.facing;
  p.walking = true;
  clampPlayer(p);
}

// Klik: jalan otomatis menuju titik, lalu interaksi saat sampai.
export function updateAutoWalk(game, dt) {
  const p = game.player;
  if (!p.moveTarget) return;
  const dx = p.moveTarget.x - p.x;
  const dy = p.moveTarget.y - p.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 10) {
    p.moveTarget = null;
    p.walking = false;
    if (p.interactTarget) {
      const target = p.interactTarget;
      p.interactTarget = null;
      interactWith(game, target);
    }
    return;
  }
  movePlayer(game, dx, dy, dt);
}

// Ambil bahan mentah dari rak.
function takeFromBin(game, station) {
  const p = game.player;
  if (p.hands) { addFloater(game, p.x, p.y - 40, 'Tangan penuh!', '#ffcc80'); return; }
  p.hands = { stage: 'raw', id: station.item };
  addFloater(game, station.x + station.w / 2, station.y - 8, station.label, '#ffffff');
}

// Talenan: taruh bahan mentah, atau ambil cincangan yang sudah jadi.
function useBoard(game, station) {
  const p = game.player;
  if (game.board.item && game.board.item.stage === 'chopped' && !p.hands) {
    p.hands = game.board.item;
    game.board.item = null;
    game.board.progress = 0;
    addFloater(game, station.x + 60, station.y - 8, 'Cincangan diambil', '#ffffff');
    return;
  }
  if (!game.board.item && p.hands && p.hands.stage === 'raw') {
    game.board.item = p.hands;
    game.board.progress = 0;
    p.hands = null;
    addFloater(game, station.x + 60, station.y - 8, 'Mencincang...', '#ffffff');
    return;
  }
  if (game.board.item && game.board.item.stage === 'raw') {
    addFloater(game, station.x + 60, station.y - 8, 'Masih dicincang...', '#ffcc80');
    return;
  }
  addFloater(game, station.x + 60, station.y - 8, 'Butuh bahan mentah', '#ffcc80');
}

// Wajan: taruh cincangan, atau ambil masakan yang sudah matang.
function useWok(game, station) {
  const p = game.player;
  if (game.wok.item && game.wok.item.stage === 'cooked' && !p.hands) {
    p.hands = game.wok.item;
    game.wok.item = null;
    game.wok.progress = 0;
    addFloater(game, station.x + 60, station.y - 8, 'Masakan diambil', '#ffffff');
    return;
  }
  if (game.wok.item && game.wok.item.stage === 'burnt') {
    addFloater(game, station.x + 60, station.y - 8, 'GOSONG! Buang dulu', '#ff8a80');
    return;
  }
  if (!game.wok.item && p.hands && p.hands.stage === 'chopped') {
    game.wok.item = p.hands;
    game.wok.progress = 0;
    p.hands = null;
    addFloater(game, station.x + 60, station.y - 8, 'Memasak...', '#ffffff');
    return;
  }
  if (game.wok.item && game.wok.item.stage === 'chopped') {
    addFloater(game, station.x + 60, station.y - 8, 'Masih dimasak...', '#ffcc80');
    return;
  }
  addFloater(game, station.x + 60, station.y - 8, 'Butuh cincangan', '#ffcc80');
}

// Meja plating: taruh masakan ke piring, atau ambil kembali item terakhir.
function usePlate(game, station) {
  const p = game.player;
  if (p.hands && p.hands.stage === 'cooked') {
    if (game.plate.length >= 4) {
      addFloater(game, station.x + 80, station.y - 8, 'Piring penuh!', '#ffcc80');
      return;
    }
    game.plate.push(p.hands.id);
    addFloater(game, station.x + 80, station.y - 8, '+ ' + p.hands.id, '#ffffff');
    p.hands = null;
    return;
  }
  if (!p.hands && game.plate.length > 0) {
    const last = game.plate.pop();
    p.hands = { stage: 'cooked', id: last };
    addFloater(game, station.x + 80, station.y - 8, 'Diambil lagi', '#ffffff');
    return;
  }
  addFloater(game, station.x + 80, station.y - 8, 'Butuh masakan matang', '#ffcc80');
}

// Tong sampah: buang yang ada di tangan, atau gosong di wajan, atau piring.
function useTrash(game, station) {
  const p = game.player;
  if (p.hands) { p.hands = null; addFloater(game, station.x + 40, station.y - 8, 'Dibuang', '#b0bec5'); return; }
  if (game.wok.item && game.wok.item.stage === 'burnt') {
    game.wok.item = null; game.wok.progress = 0;
    addFloater(game, station.x + 40, station.y - 8, 'Gosong dibuang', '#b0bec5');
    return;
  }
  if (game.plate.length > 0) {
    game.plate = [];
    addFloater(game, station.x + 40, station.y - 8, 'Piring dikosongkan', '#b0bec5');
    return;
  }
  addFloater(game, station.x + 40, station.y - 8, 'Tidak ada yang dibuang', '#b0bec5');
}

// Jendela saji: sajikan piring. Hantu yang pesanannya tidak terpenuhi
// bisikannya akan murka: pesanan berikutnya menguras dua kali cepat.
function useWindow(game) {
  const result = servePlate(game);
  if (result === 'perfect' || result === 'ok') {
    // Hantu lain yang sudah menunggu lama jadi tidak sabar.
    for (const o of game.orders) {
      if (o.age > 20 && !o.angry) o.angry = true;
    }
  } else if (game.plate.length >= 2) {
    game.shake = 0.4;
    showToast(game, 'Bukan itu pesanannya!', 'Cek papan pesanan di kiri', '#ff8a80');
  } else {
    addFloater(game, 1120, 260, 'Piring masih kosong', '#ffcc80');
  }
}

export function interactWith(game, station) {
  if (!station) return;
  switch (station.kind) {
    case 'bin': takeFromBin(game, station); break;
    case 'board': useBoard(game, station); break;
    case 'wok': useWok(game, station); break;
    case 'plate': usePlate(game, station); break;
    case 'trash': useTrash(game, station); break;
    case 'window': useWindow(game); break;
    default: break;
  }
}

// Interaksi keyboard: pakai stasiun terdekat.
export function interactNearest(game) {
  const station = nearestStation(game);
  if (station) interactWith(game, station);
}
