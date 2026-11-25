// Warung Hantu — suara: semua bunyi disintesis dengan WebAudio,
// tanpa file suara. Diam total kalau konteks audio belum diizinkan.

export function makeSfx() {
  let ctx = null;

  function audio() {
    if (!ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC();
      } catch (err) {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  function tone(freq, dur, type, vol, slideTo) {
    const ac = audio();
    if (!ac) return;
    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + dur);
      gain.gain.setValueAtTime(vol || 0.08, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + dur);
    } catch (err) { /* abaikan */ }
  }

  return {
    tap() { tone(520, 0.07, 'triangle', 0.06); },
    ding() { tone(880, 0.18, 'sine', 0.09); tone(1320, 0.22, 'sine', 0.06); },
    chop() { tone(180, 0.06, 'square', 0.05, 90); },
    sizzle() { tone(2400, 0.25, 'sawtooth', 0.02, 1800); },
    serve() {
      tone(523, 0.12, 'sine', 0.09);
      setTimeout(() => tone(659, 0.12, 'sine', 0.09), 110);
      setTimeout(() => tone(784, 0.2, 'sine', 0.09), 220);
    },
    perfect() {
      tone(523, 0.12, 'sine', 0.09);
      setTimeout(() => tone(659, 0.12, 'sine', 0.09), 100);
      setTimeout(() => tone(784, 0.12, 'sine', 0.09), 200);
      setTimeout(() => tone(1046, 0.28, 'sine', 0.1), 300);
    },
    angry() { tone(220, 0.35, 'sawtooth', 0.07, 110); },
  };
}
