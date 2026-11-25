// Warung Hantu — state permainan: pesanan hantu, bisikan rahasia, skor,
// nyawa, dan timer shift. Tidak ada gambar atau suara di sini, hanya aturan.

import {
  GHOSTS, INGREDIENT_IDS, MAX_HEARTS, MAX_ORDERS, ORDER_PATIENCE,
  PLAYER_START, RECIPES, SHIFT_SECONDS,
} from './config.js';

export function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function pickFrom(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

export function newGame() {
  return {
    phase: 'title', // title | playing | over
    time: 0,
    shiftLeft: SHIFT_SECONDS,
    score: 0,
    coins: 0,
    served: 0,
    perfect: 0,
    angry: 0,
    hearts: MAX_HEARTS,
    orders: [],
    nextOrderIn: 2.5,
    spawnGap: 14,
    player: {
      x: PLAYER_START.x, y: PLAYER_START.y,
      hands: null, // { stage: 'raw'|'chopped'|'cooked'|'burnt', id }
      moveTarget: null,
      interactTarget: null,
      facing: 1,
      walking: false,
    },
    board: { item: null, progress: 0 }, // item: { stage:'raw', id }
    wok: { item: null, progress: 0, doneAt: 0 }, // item: { stage:'chopped', id }
    plate: [], // cooked ingredient ids, max 4
    floaters: [], // { x, y, text, color, life }
    toast: null, // { text, sub, life, color }
    serveCooldown: 0,
    shake: 0,
    muted: false,
    rng: makeRng((Date.now() % 2147483647) + 7),
  };
}

export function recipeById(id) {
  return RECIPES.find((r) => r.id === id);
}

// Satu pesanan baru: pilih resep acak, lalu pilih satu bahan bisikan
// yang TIDAK ada di resep itu. Bisikan hanya terlihat beberapa detik.
export function spawnOrder(game) {
  const rng = game.rng;
  const recipe = pickFrom(rng, RECIPES);
  const ghost = pickFrom(rng, GHOSTS);
  const outside = INGREDIENT_IDS.filter((id) => !recipe.items.includes(id));
  const whisper = pickFrom(rng, outside);
  const patience = ORDER_PATIENCE + rng() * 8;
  game.orders.push({
    id: game.time + '-' + Math.floor(rng() * 1e9),
    recipe, ghost, whisper,
    patience, patienceMax: patience,
    age: 0,
    served: false,
    angry: false,
    bob: rng() * Math.PI * 2,
  });
}

export function addFloater(game, x, y, text, color) {
  game.floaters.push({ x, y, text, color: color || '#ffffff', life: 1.4 });
}

export function showToast(game, text, sub, color) {
  game.toast = { text, sub: sub || '', life: 2.6, color: color || '#ffd54a' };
}

// Apakah isi piring memenuhi resep (urutan bebas, bahan ekstra diabaikan
// kecuali untuk cek bisikan)? Kembalikan resepnya atau null.
export function matchRecipe(plate) {
  for (const recipe of RECIPES) {
    if (recipe.items.every((id) => plate.includes(id))) return recipe;
  }
  return null;
}

function orderByRecipe(game, recipe) {
  return game.orders.find((o) => o.recipe.id === recipe.id && !o.served);
}

// Sajikan piring ke jendela. Mengembalikan 'perfect' | 'ok' | 'nomatch'.
// Hidangan yang salah TIDAK dimakan: piring tetap utuh, hanya penalti kecil.
export function servePlate(game) {
  if (game.serveCooldown > 0 || game.plate.length < 2) return 'nomatch';
  const recipe = matchRecipe(game.plate);
  game.serveCooldown = 1.2;
  if (!recipe) {
    game.score = Math.max(0, game.score - 25);
    addFloater(game, 1120, 260, '-25  Bukan resep!', '#ff8a80');
    const first = game.orders[0];
    if (first) first.patience = Math.max(4, first.patience - 8);
    return 'nomatch';
  }
  const order = orderByRecipe(game, recipe);
  if (!order) {
    addFloater(game, 1120, 260, 'Tidak ada yang pesan ini', '#ffcc80');
    return 'nomatch';
  }
  const hasWhisper = game.plate.includes(order.whisper);
  const tip = Math.round(60 * (order.patience / order.patienceMax));
  let gained = recipe.price + tip;
  if (hasWhisper) {
    gained *= 2;
    game.perfect += 1;
    order.served = true;
    showToast(game, 'SEMPURNA! Bisikan terpenuhi', '+' + gained + ' koin  •  ' + order.ghost.name + ' tenang', '#8affc1');
    addFloater(game, 1120, 260, 'PERFECT +' + gained, '#8affc1');
  } else {
    order.served = true;
    showToast(game, 'Hidangan disajikan', '+' + gained + ' koin  •  ' + order.ghost.name + ' masih penasaran', '#ffd54a');
    addFloater(game, 1120, 260, '+' + gained, '#ffd54a');
  }
  game.score += gained;
  game.coins += gained;
  game.served += 1;
  game.plate = [];
  game.orders = game.orders.filter((o) => o !== order);
  return hasWhisper ? 'perfect' : 'ok';
}

// Satu tick logika (dt detik). Mengurus timer, pesanan, talenan, wajan.
export function tickGame(game, dt) {
  if (game.phase !== 'playing') return;
  game.time += dt;
  game.shiftLeft = Math.max(0, game.shiftLeft - dt);
  game.serveCooldown = Math.max(0, game.serveCooldown - dt);
  if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 3);

  for (const f of game.floaters) f.life -= dt;
  game.floaters = game.floaters.filter((f) => f.life > 0);
  if (game.toast) {
    game.toast.life -= dt;
    if (game.toast.life <= 0) game.toast = null;
  }

  // Talenan: bahan mentah berubah jadi cincangan setelah CHOP_SECONDS.
  if (game.board.item) {
    game.board.progress += dt;
    if (game.board.progress >= 1.6 && game.board.item.stage === 'raw') {
      game.board.item = { stage: 'chopped', id: game.board.item.id };
      game.board.progress = 0;
    }
  }
  // Wajan: masak lalu gosong kalau dibiarkan.
  if (game.wok.item) {
    game.wok.progress += dt;
    if (game.wok.progress >= 2.6 && game.wok.item.stage === 'chopped') {
      game.wok.item = { stage: 'cooked', id: game.wok.item.id };
      game.wok.doneAt = game.wok.progress;
    } else if (game.wok.item.stage === 'cooked' && game.wok.progress - game.wok.doneAt >= 5) {
      game.wok.item = { stage: 'burnt', id: game.wok.item.id };
    }
  }

  // Pesanan baru, makin cepat seiring waktu berjalan.
  game.spawnGap = Math.max(8, 14 - game.time / 30);
  game.nextOrderIn -= dt;
  if (game.nextOrderIn <= 0 && game.orders.length < MAX_ORDERS) {
    spawnOrder(game);
    game.nextOrderIn = game.spawnGap;
  }

  // Kesabaran hantu: hantu yang murka (bisikan diabaikan dua kali)
  // menguras dua kali lebih cepat.
  for (const order of game.orders) {
    order.age += dt;
    const drain = order.angry ? 2 : 1;
    order.patience -= dt * drain;
  }
  const left = game.orders.filter((o) => o.patience > 0);
  const expired = game.orders.filter((o) => o.patience <= 0);
  for (const o of expired) {
    game.hearts -= 1;
    game.angry += 1;
    game.shake = 0.6;
    showToast(game, o.ghost.name + ' pergi dengan marah!', 'Kesabaran habis  •  -1 nyawa', '#ff8a80');
    addFloater(game, 1120, 240, o.ghost.name + ' KABUR!', '#ff8a80');
  }
  game.orders = left;

  if (game.hearts <= 0 || game.shiftLeft <= 0) {
    game.phase = 'over';
  }
}

export function startGame(game) {
  const fresh = newGame();
  fresh.phase = 'playing';
  fresh.muted = game.muted;
  return fresh;
}
