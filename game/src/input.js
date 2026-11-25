// Warung Hantu — input: keyboard (WASD/panah + E) dan mouse (klik jalan,
// klik stasiun untuk jalan lalu berinteraksi otomatis).

import { interactNearest, stationAt } from './kitchen.js';
import { startGame } from './state.js';

export function bindInput(canvas, gameRef, sfx) {
  const keys = new Set();

  function currentGame() {
    return gameRef.game;
  }

  function keyDir() {
    let dx = 0, dy = 0;
    if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
    if (keys.has('arrowright') || keys.has('d')) dx += 1;
    if (keys.has('arrowup') || keys.has('w')) dy -= 1;
    if (keys.has('arrowdown') || keys.has('s')) dy += 1;
    return { dx, dy };
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault();
    }
    const game = currentGame();
    if (key === 'enter' && game.phase === 'title') {
      gameRef.game = startGame(game);
      sfx.ding();
      return;
    }
    if (key === 'r' && game.phase === 'over') {
      gameRef.game = startGame(game);
      return;
    }
    if (key === 'm') {
      game.muted = !game.muted;
      return;
    }
    if (game.phase !== 'playing') return;
    if (key === 'e' || key === ' ') {
      if (!e.repeat) {
        interactNearest(game);
        sfx.tap();
      }
      return;
    }
    keys.add(key);
  });

  window.addEventListener('keyup', (e) => {
    keys.delete(e.key.toLowerCase());
  });

  function canvasPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    const game = currentGame();
    if (game.phase === 'title') {
      gameRef.game = startGame(game);
      sfx.ding();
      return;
    }
    if (game.phase === 'over') return;
    const pt = canvasPoint(e);
    const station = stationAt(game, pt.x, pt.y);
    if (station) {
      // Berdiri di tengah depan stasiun, lalu interaksi saat sampai.
      game.player.moveTarget = {
        x: station.x + station.w / 2,
        y: station.y + station.h + 34,
      };
      game.player.interactTarget = station;
    } else {
      game.player.moveTarget = pt;
      game.player.interactTarget = null;
    }
  });

  return { keys, keyDir };
}
