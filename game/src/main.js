// Warung Hantu — titik masuk game: loop requestAnimationFrame,
// membaca input tiap frame, menjalankan tick logika, lalu menggambar.

import { VIEW_H, VIEW_W } from './config.js';
import { makeSfx } from './audio.js';
import { bindInput } from './input.js';
import { movePlayer, updateAutoWalk } from './kitchen.js';
import { render } from './render.js';
import { applyScene } from './shots.js';
import { newGame, tickGame } from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW_W;
canvas.height = VIEW_H;

const gameRef = { game: newGame() };
const sfx = makeSfx();
const input = bindInput(canvas, gameRef, sfx);

// Adegan screenshot (?scene=cover|serve|rush|title) menyemai keadaan.
const params = new URLSearchParams(window.location.search);
const scene = params.get('scene');
if (scene) applyScene(gameRef.game, scene);

let last = performance.now();
let elapsed = 0;

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  elapsed += dt;
  const game = gameRef.game;

  if (game.phase === 'playing') {
    const { dx, dy } = input.keyDir();
    if (dx !== 0 || dy !== 0) {
      game.player.moveTarget = null;
      game.player.interactTarget = null;
      movePlayer(game, dx, dy, dt);
    } else {
      updateAutoWalk(game, dt);
    }
    // Bunyi saat talenan / wajan selesai tepat di frame ini.
    const boardStage = game.board.item ? game.board.item.stage : null;
    const wokStage = game.wok.item ? game.wok.item.stage : null;
    tickGame(game, dt);
    if (!game.muted) {
      if (boardStage === 'raw' && game.board.item && game.board.item.stage === 'chopped') sfx.chop();
      if (wokStage === 'chopped' && game.wok.item && game.wok.item.stage === 'cooked') sfx.sizzle();
    }
  }

  render(ctx, gameRef.game, elapsed);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
