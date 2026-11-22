// Tiny synthesized blips — no audio files needed.
let ctx: AudioContext | null = null;
function tone(freqs: number[], dur = 0.09, type: OscillatorType = 'sine', gain = 0.06) {
  try {
    ctx ??= new AudioContext();
    let t = ctx.currentTime;
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
