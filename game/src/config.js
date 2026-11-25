// Warung Hantu — data statis: bahan, resep, hantu dan tata letak dapur.
// Semua nama dan resep adalah karangan sendiri untuk game ini.

export const VIEW_W = 1280;
export const VIEW_H = 720;
export const HUD_H = 64;
export const SHIFT_SECONDS = 180;
export const MAX_HEARTS = 3;
export const MAX_ORDERS = 3;

// Bahan: id, nama, warna, rasa yang dibawanya (untuk bisikan hantu).
export const INGREDIENTS = {
  nasi:   { id: 'nasi',   name: 'Nasi',   color: '#f5efe0', dark: '#c9b98f', flavor: 'gurih' },
  mie:    { id: 'mie',    name: 'Mie',    color: '#f7c948', dark: '#c98f1b', flavor: 'gurih' },
  ayam:   { id: 'ayam',   name: 'Ayam',   color: '#e8a87c', dark: '#a8663a', flavor: 'gurih' },
  sayur:  { id: 'sayur',  name: 'Sayur',  color: '#7bc96f', dark: '#3e7d32', flavor: 'segar' },
  telur:  { id: 'telur',  name: 'Telur',  color: '#fff3c4', dark: '#d9a441', flavor: 'gurih' },
  cabai:  { id: 'cabai',  name: 'Cabai',  color: '#e53935', dark: '#8e1414', flavor: 'pedas' },
};
export const INGREDIENT_IDS = ['nasi', 'mie', 'ayam', 'sayur', 'telur', 'cabai'];

// Resep: nama hidangan + bahan yang harus ada di piring (sudah dimasak).
export const RECIPES = [
  { id: 'nasi-goreng', name: 'Nasi Goreng Hantu', items: ['nasi', 'telur', 'cabai'], price: 100 },
  { id: 'mie-ayam',    name: 'Mie Ayam Kuntilanak', items: ['mie', 'ayam', 'sayur'], price: 110 },
  { id: 'sup-pocong',  name: 'Sup Pocong Hangat', items: ['sayur', 'telur', 'nasi'], price: 90 },
  { id: 'sate-tuyul',  name: 'Sate Tuyul Bara', items: ['ayam', 'cabai', 'mie'], price: 120 },
];

// Hantu pelanggan: nama, warna badan, warna mata.
export const GHOSTS = [
  { name: 'Pocong',     body: '#f2f2f2', glow: '#bfe3ff', eye: '#222222' },
  { name: 'Kuntilanak', body: '#ffffff', glow: '#ffc7dd', eye: '#7a1030' },
  { name: 'Tuyul',      body: '#fff8d6', glow: '#ffe27a', eye: '#222222' },
  { name: 'Genderuwo',  body: '#c9b8ff', glow: '#8f7bff', eye: '#2a1650' },
  { name: 'Wewe',       body: '#c8f7c5', glow: '#7ddb7a', eye: '#123f10' },
  { name: 'Banaspati',  body: '#ffd9a0', glow: '#ff9d45', eye: '#4a2400' },
];

// Stasiun dapur: posisi dan ukuran di kanvas (x, y, lebar, tinggi).
// Susunannya: rak bahan di kiri, talenan + wajan di tengah,
// meja plating + tong sampah di kanan, jendela saji di kanan atas.
export const STATIONS = {
  binNasi:  { kind: 'bin',   item: 'nasi',  x: 296, y: 208, w: 116, h: 92, label: 'Nasi' },
  binMie:   { kind: 'bin',   item: 'mie',   x: 424, y: 208, w: 116, h: 92, label: 'Mie' },
  binAyam:  { kind: 'bin',   item: 'ayam',  x: 552, y: 208, w: 116, h: 92, label: 'Ayam' },
  binSayur: { kind: 'bin',   item: 'sayur', x: 296, y: 316, w: 116, h: 92, label: 'Sayur' },
  binTelur: { kind: 'bin',   item: 'telur', x: 424, y: 316, w: 116, h: 92, label: 'Telur' },
  binCabai: { kind: 'bin',   item: 'cabai', x: 552, y: 316, w: 116, h: 92, label: 'Cabai' },
  board:    { kind: 'board', x: 700, y: 208, w: 128, h: 92, label: 'Talenan' },
  wok:      { kind: 'wok',   x: 700, y: 316, w: 128, h: 92, label: 'Wajan' },
  plate:    { kind: 'plate', x: 860, y: 208, w: 124, h: 92, label: 'Meja Plating' },
  trash:    { kind: 'trash', x: 872, y: 316, w: 80,  h: 92, label: 'Sampah' },
  window:   { kind: 'window', x: 1000, y: 208, w: 256, h: 200, label: 'Jendela Saji' },
};

export const PLAYER_START = { x: 640, y: 560 };
export const PLAYER_SPEED = 265;
export const CHOP_SECONDS = 1.6;
export const COOK_SECONDS = 2.6;
export const BURN_SECONDS = 5.0;
export const ORDER_PATIENCE = 52;
export const FIRST_ORDER_DELAY = 2.5;
