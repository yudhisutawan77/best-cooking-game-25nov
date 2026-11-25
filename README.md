# 👻 Warung Hantu — Dapur Pasar Malam

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/yudhisutawan77/best-cooking-game-25nov/rank.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/yudhisutawan77/best-cooking-game-25nov/reward.svg)](https://make.fun/c/best-cooking-game-20261125-0137)

Game masak original untuk bounty [Make the best cooking game](https://make.fun/c/best-cooking-game-20261125-0137) di make.fun.

## Cara main

Kamu koki di dapur pasar malam yang dihantui pelanggan lapar. Ambil bahan dari rak,
cincang di talenan, masak di wajan, tata di piring, lalu sajikan ke hantu yang memesan —
sebelum kesabarannya habis.

**Mekanik unik — Bisikan Hantu:** setiap hantu membisikkan satu bahan rahasia.
Sajikan hidangan dengan bahan bisikan itu untuk **bonus ganda**; kalau tidak, hantu
murka dan pesanan berikutnya menguras kesabaran dua kali lebih cepat. Bisikan hanya
terlihat beberapa detik — ingat-ingat, atau dekati jendela saji untuk mengintip lagi.

- **WASD / panah** — jalan; **klik** — jalan ke stasiun dan pakai otomatis
- **E / Spasi** — pakai stasiun terdekat
- **R** — ulangi setelah shift selesai; **M** — bisu

## Resep

| Hidangan | Bahan |
|---|---|
| Nasi Goreng Hantu | Nasi + Telur + Cabai |
| Mie Ayam Kuntilanak | Mie + Ayam + Sayur |
| Sup Pocong Hangat | Sayur + Telur + Nasi |
| Sate Tuyul Bara | Ayam + Cabai + Mie |

Masakan yang dibiarkan terlalu lama di wajan akan **gosong** — buang ke tong sampah.
Shift berlangsung 3 menit; kehabisan nyawa (3 hantu kabur) mengakhiri shift lebih awal.

## Menjalankan

Buka `game/index.html` di desktop Chrome — tanpa build, tanpa network request,
semua file statis. Suara disintesis dengan WebAudio, gambar digambar dengan Canvas 2D.

## Struktur

- `game/index.html` — halaman game
- `game/src/config.js` — bahan, resep, hantu, tata letak dapur
- `game/src/state.js` — pesanan, bisikan, skor, timer shift
- `game/src/kitchen.js` — gerakan koki dan interaksi stasiun
- `game/src/render.js` — semua gambar kanvas
- `game/src/input.js` — keyboard dan mouse
- `game/src/audio.js` — bunyi synth WebAudio
- `game/src/shots.js` — penyemaian adegan screenshot (`?scene=`)
- `game/src/main.js` — loop utama
- `main.ts` — program penyerahan (menyalin game + screenshot, menulis dossier.json)

## Lisensi

MIT — lihat `LICENSE`.
