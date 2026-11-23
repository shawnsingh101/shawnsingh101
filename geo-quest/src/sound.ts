// Sound: short effects (Kenney's CC0 packs, public/sfx/), a start-up chime and optional background music.
// The chime and the music are synthesized here, so they cost no downloads.
//
// Phones are picky about web audio:
//  • iOS/Android only let a page start audio from inside a tap, so we create
//    and "unlock" the audio context on the very first tap anywhere (unlockAudio).
//  • iOS treats web audio like a ringtone and mutes it when the silent switch is
//    on. Declaring the audio session as "playback" (Safari 16.4+) makes it behave
//    like a game or video instead, so the in-app toggles are what decide.
let ctx: AudioContext | null = null;
let fx: GainNode | null = null;    // effects bus
let verb: ConvolverNode | null = null;

type AudioSessionNav = Navigator & { audioSession?: { type: string } };

export function unlockAudio() {
  try {
    const nav = navigator as AudioSessionNav;
    if (nav.audioSession) nav.audioSession.type = 'playback';
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state !== 'running') void ctx.resume();
    // Play one silent sample: required by older iOS versions to fully unlock.
    const b = ctx.createBuffer(1, 1, 22050);
    const s = ctx.createBufferSource();
    s.buffer = b; s.connect(ctx.destination); s.start(0);
    void loadSamples();
  } catch { /* audio not available */ }
}
const ac = () => { if (!ctx) unlockAudio(); if (ctx && ctx.state !== 'running') void ctx.resume(); return ctx; }; // iOS suspends it in the background

/** A soft hall: decaying noise as an impulse response. */
function reverb(c: AudioContext) {
  if (verb) return verb;
  const len = c.sampleRate * 3.2, ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  verb = c.createConvolver(); verb.buffer = ir;
  const wet = c.createGain(); wet.gain.value = 0.55;
  verb.connect(wet).connect(c.destination);
  return verb;
}

// ---- effects (files) -------------------------------------------------------------------------
const FILES = ['tap', 'toggle', 'open', 'back', 'right', 'wrong', 'medal', 'unlock', 'flip', 'deal', 'shuffle'] as const;
type Sfx = typeof FILES[number];
const LEVEL: Partial<Record<Sfx, number>> = { tap: 0.35, toggle: 0.4, open: 0.35, back: 0.35, flip: 0.7, deal: 0.55, shuffle: 0.6, right: 0.45, wrong: 0.4, medal: 0.5, unlock: 0.45 };
const buffers = new Map<Sfx, AudioBuffer>();
let loading: Promise<void> | null = null;
function loadSamples() {
  const c = ctx;
  if (!c) return Promise.resolve();
  return (loading ??= Promise.all(FILES.map(name => fetch(`sfx/${name}.mp3`).then(r => r.arrayBuffer())
    .then(b => new Promise<AudioBuffer>((ok, no) => c.decodeAudioData(b, ok, no))).then(buf => { buffers.set(name, buf); }).catch(() => {}))).then(() => {}));
}
function play(name: Sfx) {
  const c = ac(); if (!c) return;
  const buf = buffers.get(name);
  if (!buf) { void loadSamples(); return; } // first tap: still loading, stay quiet
  fx ??= (() => { const g = c.createGain(); g.gain.value = 0.9; g.connect(c.destination); return g; })();
  const s = c.createBufferSource(), g = c.createGain();
  s.buffer = buf; g.gain.value = LEVEL[name] ?? 0.5;
  s.connect(g).connect(fx); s.start();
}

export const sounds = {
  tap: () => play('tap'), toggle: () => play('toggle'), open: () => play('open'), back: () => play('back'),
  right: () => play('right'), wrong: () => play('wrong'),
  flip: () => play('flip'), deal: () => play('deal'), shuffle: () => play('shuffle'),
  medal: () => play('medal'), level: () => play('unlock'),
  startup,
};

// ---- the start-up chime --------------------------------------------------------------------------
// A deep swell that blooms into a bright chord, then a sparkle of bells: about four seconds, made from scratch.
function startup() {
  const c = ac(); if (!c) return;
  const t = c.currentTime + 0.05, out = c.createGain(), hall = reverb(c);
  out.gain.value = 0.9; out.connect(c.destination); out.connect(hall);
  // 1. a low swell
  const sub = c.createOscillator(), sg = c.createGain();
  sub.frequency.setValueAtTime(49, t); sub.frequency.exponentialRampToValueAtTime(73.4, t + 1.4);
  sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.32, t + 1.1); sg.gain.exponentialRampToValueAtTime(0.0001, t + 4);
  sub.connect(sg).connect(out); sub.start(t); sub.stop(t + 4.1);
  // 2. a warm chord opening up (D, A, F♯, E: Dadd9), slightly detuned pairs through a sweeping filter
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2;
  lp.frequency.setValueAtTime(260, t + 0.3); lp.frequency.exponentialRampToValueAtTime(3200, t + 1.9); lp.frequency.exponentialRampToValueAtTime(900, t + 4.2);
  const pg = c.createGain(); pg.gain.setValueAtTime(0.0001, t + 0.3); pg.gain.exponentialRampToValueAtTime(0.09, t + 1.6); pg.gain.exponentialRampToValueAtTime(0.0001, t + 4.6);
  lp.connect(pg).connect(out);
  for (const f of [146.8, 220, 369.99, 659.3]) for (const d of [-6, 6]) {
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d;
    o.connect(lp); o.start(t + 0.3); o.stop(t + 4.7);
  }
  // 3. bells rising on top
  [880, 1174.7, 1480, 1760, 2349.3].forEach((f, i) => {
    const at = t + 1.25 + i * 0.11;
    for (const [mult, lvl] of [[1, 0.06], [2.01, 0.015]] as const) {
      const o = c.createOscillator(), g = c.createGain(); o.frequency.value = f * mult;
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(lvl, at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, at + 1.8);
      o.connect(g).connect(out); o.start(at); o.stop(at + 1.9);
    }
  });
}

// ---- background music (optional, off by default) ---------------------------------------------------
// Slow, quiet chords with the odd bell, generated as it plays: it never loops the same way twice.
let music: { stop: () => void } | null = null;
const CHORDS = [[146.8, 220, 277.2, 329.6, 440], [123.5, 185, 246.9, 293.7, 370], [98, 146.8, 196, 246.9, 370], [110, 164.8, 220, 277.2, 329.6]]; // Dmaj9 · Bm9 · Gmaj9 · A
const BELLS = [587.3, 659.3, 740, 880, 987.8, 1174.7, 1318.5];
export function startMusic() {
  const c = ac(); if (!c || music) return;
  const bus = c.createGain(); bus.gain.setValueAtTime(0.0001, c.currentTime); bus.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 3);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100;
  lp.connect(bus); bus.connect(c.destination); bus.connect(reverb(c));
  let i = 0, alive = true;
  const chord = () => {
    if (!alive) return;
    const t = c.currentTime + 0.05, len = 9;
    for (const f of CHORDS[i++ % CHORDS.length]) for (const type of ['triangle', 'sine'] as const) {
      const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f; o.detune.value = (Math.random() - 0.5) * 10;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.022, t + 3); g.gain.setValueAtTime(0.022, t + len - 3); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 2);
      o.connect(g).connect(lp); o.start(t); o.stop(t + len + 2.1);
    }
    for (let k = 0; k < 2; k++) if (Math.random() < 0.7) {
      const at = t + 1.5 + Math.random() * 6, o = c.createOscillator(), g = c.createGain();
      o.frequency.value = BELLS[Math.floor(Math.random() * BELLS.length)];
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.018, at + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, at + 2.5);
      o.connect(g).connect(bus); o.start(at); o.stop(at + 2.6);
    }
  };
  chord();
  const timer = setInterval(chord, 8000);
  // Quiet while the app is in the background.
  const vis = () => { if (document.hidden) void c.suspend(); else void c.resume(); };
  document.addEventListener('visibilitychange', vis);
  music = { stop: () => {
    alive = false; clearInterval(timer); document.removeEventListener('visibilitychange', vis);
    bus.gain.cancelScheduledValues(c.currentTime); bus.gain.setValueAtTime(bus.gain.value, c.currentTime); bus.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.2);
    setTimeout(() => bus.disconnect(), 1500);
  } };
}
export function stopMusic() { music?.stop(); music = null; }
