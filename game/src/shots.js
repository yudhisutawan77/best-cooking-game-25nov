// Warung Hantu — adegan screenshot: parameter ?scene= di URL menyemai
// satu keadaan permainan yang sibuk dan mudah dibaca, supaya screenshot
// menunjukkan dapur lengkap (papan pesanan, bahan, hidangan setengah jadi,
// timer, piring siap saji). Tanpa parameter, game mulai normal dari judul.

import { GHOSTS, RECIPES } from './config.js';
import { makeRng } from './state.js';

function seedOrder(game, recipeId, ghostName, whisperId, patienceFrac, age) {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  const ghost = GHOSTS.find((g) => g.name === ghostName);
  game.orders.push({
    id: 'shot-' + recipeId,
    recipe, ghost, whisper: whisperId,
    patience: 52 * patienceFrac, patienceMax: 52,
    age, served: false, angry: patienceFrac < 0.25,
    bob: game.rng() * Math.PI * 2,
  });
}

// Adegan "cover": dapur sibuk — 3 pesanan, bisikan terlihat, satu hidangan
// setengah jadi di piring, wajan sedang memasak, koki membawa masakan.
export function sceneCover(game) {
  game.phase = 'playing';
  game.time = 48;
  game.shiftLeft = 132;
  game.score = 450;
  game.coins = 450;
  game.served = 4;
  game.perfect = 1;
  game.hearts = 3;
  seedOrder(game, 'nasi-goreng', 'Kuntilanak', 'sayur', 0.72, 3);
  seedOrder(game, 'mie-ayam', 'Pocong', 'cabai', 0.55, 2);
  seedOrder(game, 'sate-tuyul', 'Tuyul', 'telur', 0.85, 1);
  game.plate = ['nasi', 'telur'];
  game.wok.item = { stage: 'chopped', id: 'cabai' };
  game.wok.progress = 1.4;
  game.board.item = { stage: 'raw', id: 'ayam' };
  game.board.progress = 0.9;
  game.player.x = 800;
  game.player.y = 480;
  game.player.hands = { stage: 'cooked', id: 'ayam' };
  game.player.facing = 1;
  game.nextOrderIn = 9;
}

// Adegan "serve": piring lengkap sesuai resep + bisikan, siap disajikan.
export function sceneServe(game) {
  game.phase = 'playing';
  game.time = 96;
  game.shiftLeft = 84;
  game.score = 890;
  game.coins = 890;
  game.served = 8;
  game.perfect = 3;
  game.hearts = 3;
  seedOrder(game, 'mie-ayam', 'Genderuwo', 'cabai', 0.66, 4);
  seedOrder(game, 'sup-pocong', 'Wewe', 'nasi', 0.8, 2);
  game.plate = ['mie', 'ayam', 'sayur', 'cabai'];
  game.player.x = 1060;
  game.player.y = 470;
  game.player.hands = null;
  game.player.facing = -1;
  game.toast = {
    text: '✓ Mie Ayam Kuntilanak + bisikan Cabai!',
    sub: 'Sajikan ke Genderuwo di jendela (E)',
    life: 99, color: '#8affc1',
  };
  game.nextOrderIn = 7;
}

// Adegan "rush": akhir shift, timer menipis, satu hantu hampir kabur.
export function sceneRush(game) {
  game.phase = 'playing';
  game.time = 138;
  game.shiftLeft = 42;
  game.score = 1250;
  game.coins = 1250;
  game.served = 12;
  game.perfect = 4;
  game.hearts = 1;
  seedOrder(game, 'nasi-goreng', 'Banaspati', 'sayur', 0.18, 30);
  seedOrder(game, 'sup-pocong', 'Kuntilanak', 'cabai', 0.45, 22);
  seedOrder(game, 'sate-tuyul', 'Pocong', 'telur', 0.7, 9);
  game.plate = ['sayur', 'telur'];
  game.wok.item = { stage: 'cooked', id: 'nasi' };
  game.wok.progress = 2.6;
  game.wok.doneAt = 2.6;
  game.player.x = 640;
  game.player.y = 560;
  game.player.hands = { stage: 'chopped', id: 'ayam' };
  game.nextOrderIn = 5;
}

export function applyScene(game, name) {
  // RNG deterministik supaya tiap screenshot stabil.
  game.rng = makeRng(20261125);
  if (name === 'cover') sceneCover(game);
  else if (name === 'serve') sceneServe(game);
  else if (name === 'rush') sceneRush(game);
  else if (name === 'title') game.phase = 'title';
}
