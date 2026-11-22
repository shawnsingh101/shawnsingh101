// Tiny synthesized blips — no audio files needed.
//
// Phones are picky about web audio:
//  • iOS/Android only let a page start audio from inside a tap, so we create
//    and "unlock" the audio context on the very first tap anywhere (unlockAudio).
//  • iOS treats web audio like a ringtone and mutes it when the silent switch is
//    on. Declaring the audio session as "playback" (Safari 16.4+) makes it behave
//    like a game or video instead, so the in-app Sound toggle is what decides.
let ctx: AudioContext | null = null;

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
  } catch { /* audio not available */ }
}

function tone(freqs: number[], dur = 0.09, type: OscillatorType = 'sine', gain = 0.06) {
  try {
    if (!ctx) unlockAudio();
    if (!ctx) return;
    if (ctx.state !== 'running') void ctx.resume(); // iOS suspends it when the app goes to the background
    let t = ctx.currentTime + 0.01;
    for (const f of freqs) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.6);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur * 1.7);
      t += dur;
    }
  } catch { /* audio not available */ }
}

export const sounds = {
  right: () => tone([660, 880]),
  wrong: () => tone([220, 180], 0.12, 'triangle'),
  flip: () => tone([520], 0.05, 'sine', 0.03),
  level: () => tone([523, 659, 784, 1047], 0.08),
};
