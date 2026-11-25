// Warung Hantu — program penyerahan entry (Node 22, stdlib only).
// Menyalin game/ dan screenshots/ dari repo ini ke direktori output
// (MAKEFUN_OUTPUT_DIR, atau /output di grader) lalu menulis
// dossier.json dengan buildDossier dari vendor/makefun-game.ts.
//
// Jalankan di luar grader dengan:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const REPO_ROOT = fileURLToPath(new URL('.', import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function countTree(dir) {
  let files = 0;
  let bytes = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const info = statSync(full);
    if (info.isDirectory()) {
      const sub = countTree(full);
      files += sub.files;
      bytes += sub.bytes;
    } else if (info.isFile()) {
      files += 1;
      bytes += info.size;
    }
  }
  return { files, bytes };
}

function preflightChecks() {
  const problems = [];
  const indexHtml = join(REPO_ROOT, 'game', 'index.html');
  if (!existsSync(indexHtml)) problems.push('game/index.html hilang');
  const shotsDir = join(REPO_ROOT, 'screenshots');
  if (!existsSync(shotsDir)) {
    problems.push('screenshots/ hilang');
  } else {
    const shots = readdirSync(shotsDir).filter((n) => !n.startsWith('.'));
    if (shots.length < 3 || shots.length > 4) {
      problems.push(`screenshots/ harus berisi 3-4 gambar, ada ${shots.length}`);
    }
    for (const name of shots) {
      const size = statSync(join(shotsDir, name)).size;
      if (size > 262144) problems.push(`screenshot ${name} melebihi 256 KiB (${size} byte)`);
    }
  }
  if (problems.length > 0) {
    throw new Error('Preflight gagal: ' + problems.join('; '));
  }
}

function handIn() {
  preflightChecks();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  cpSync(join(REPO_ROOT, 'game'), join(OUTPUT_DIR, 'game'), { recursive: true });
  const shotsDir = join(REPO_ROOT, 'screenshots');
  mkdirSync(join(OUTPUT_DIR, 'screenshots'), { recursive: true });
  if (existsSync(shotsDir)) {
    cpSync(shotsDir, join(OUTPUT_DIR, 'screenshots'), { recursive: true });
  }
  const dossier = buildDossier(OUTPUT_DIR, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
  return { game: countTree(join(OUTPUT_DIR, 'game')), dossierBytes: Buffer.byteLength(dossier) };
}

const result = handIn();
console.log(
  `Warung Hantu handed in: game/ ${result.game.files} files, ${result.game.bytes} bytes; ` +
  `dossier.json ${result.dossierBytes} bytes -> ${OUTPUT_DIR}`,
);
