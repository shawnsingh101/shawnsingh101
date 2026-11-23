// Music cards: the clip that is the question, and on the reveal the composer (portrait is the card's picture; here the
// flag, life and era) and every recorded part of the same work, each playable, the current one marked. One player for
// the whole app, so starting a clip stops the one before.
import { useEffect, useState } from 'react';
import { getProgress, update, useProgress } from '../srs';
import { Flag } from './Picture';
import { Icon } from './Icons';
import { stopMusic } from '../sound';
import { md5 } from '../md5';
import type { Dataset, Place } from '../types';

const CLIP_SECONDS = 30;
/**
 * Where a recording can be played from, best first. Most are Ogg, which iPhones don't play, so first the MP3 copy
 * Wikimedia makes of every audio file, then the original. Files live under the MD5 of their name.
 */
export function audioUrls(file: string): string[] {
  const name = file.replace(/ /g, '_').replace(/^./, c => c.toUpperCase());
  const h = md5(name), dir = `${h[0]}/${h.slice(0, 2)}`, enc = encodeURIComponent(name);
  const original = `https://upload.wikimedia.org/wikipedia/commons/${dir}/${enc}`;
  const mp3 = `https://upload.wikimedia.org/wikipedia/commons/transcoded/${dir}/${enc}/${enc}.mp3`;
  return /\.mp3$/i.test(name) ? [original] : [mp3, original];
}

let player: HTMLAudioElement | null = null;
let stopAt = 0, startAt = 0;
let current: string | null = null; // the clip playing: "file@start" (one recording can give two clips: Boléro's opening and climax)
let tries: string[] = [];
const failed = new Set<string>(); // clips that wouldn't load anywhere: the card says so
const listeners = new Set<(f: string | null) => void>();
const announce = () => listeners.forEach(l => l(current));
export const clipKey = (file: string, start: number) => `${file}@${start}`;
/** Where you've chosen a clip should start (Settings ride along in your progress), else where the list says. */
const startOf = (file: string, start: number) => getProgress().clipStarts?.[clipKey(file, start)] ?? start;

export function play(file: string, start = 0, from?: number) {
  stopMusic(); // the background music would talk over it
  if (!player) {
    player = new Audio();
    player.addEventListener('timeupdate', () => { if (player && player.currentTime >= stopAt) stop(); });
    player.addEventListener('ended', () => stop());
    player.addEventListener('loadedmetadata', () => { if (player && startAt) player.currentTime = startAt; });
    // This address didn't work (no MP3 copy yet, or the browser can't play it): try the next.
    player.addEventListener('error', () => {
      const next = tries.shift();
      if (next && player) { player.src = next; player.play().catch(() => {}); return; }
      if (current) failed.add(current);
      stop();
    });
  }
  const key = clipKey(file, start);
  startAt = from ?? startOf(file, start); stopAt = startAt + CLIP_SECONDS; failed.delete(key);
  if (current && current.startsWith(file + '@') && player.src) { player.currentTime = startAt; current = key; announce(); player.play().catch(() => {}); return; } // same recording: just jump
  [player.src, ...tries] = audioUrls(file);
  current = key; announce();
  player.play().catch(e => { if ((e as Error).name === 'NotAllowedError') { current = null; announce(); } }); // autoplay blocked: tap the button
}
export function stop() { player?.pause(); current = null; announce(); }
/** Move within the playing clip (and give it another 30 seconds from there). */
function seek(by: number) { if (!player) return; player.currentTime = Math.max(0, player.currentTime + by); stopAt = player.currentTime + CLIP_SECONDS; }

function usePlaying() {
  const [f, setF] = useState<string | null>(current);
  useEffect(() => { listeners.add(setF); return () => { listeners.delete(setF); }; }, []);
  return f;
}
const mmss = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/**
 * The question: plays by itself when the card appears. While it plays: the time, back 10 s / on 15 s, and
 * "Start here" (when a clip misses the best part, move to it and keep that as this clip's start from now on).
 */
export function ClipPlayer({ file, start }: { file: string; start: number }) {
  const p = useProgress();
  const key = clipKey(file, start), now = usePlaying(), playing = now === key;
  const [t, setT] = useState(0);
  const mine = p.clipStarts?.[key];
  useEffect(() => { play(file, start); return () => stop(); }, [file, start]);
  useEffect(() => { if (!playing) return; const h = setInterval(() => setT(player?.currentTime ?? 0), 250); return () => clearInterval(h); }, [playing]);
  const keep = (v: number | null) => update(x => { const m = { ...(x.clipStarts ?? {}) }; if (v == null) delete m[key]; else m[key] = v; x.clipStarts = m; });
  const stopProp = (f: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); f(); };
  return (
    <div className="clip-wrap" onClick={e => e.stopPropagation()}>
      <button className={'clip-player' + (playing ? ' on' : '')} onClick={stopProp(() => (playing ? stop() : play(file, start)))} aria-label={playing ? 'Stop the music' : 'Play the music'}>
        <span className="clip-icon"><Icon name={playing ? 'x' : 'play'} size={22} /></span>
        <span>{playing ? `Playing · ${mmss(t)}` : failed.has(key) && !now ? "Couldn't load this recording: tap to try again" : 'Play again'}</span>
        {playing && <span className="clip-bars" aria-hidden><i /><i /><i /><i /></span>}
      </button>
      {playing && <div className="clip-tools">
        <button className="btn small ghost" onClick={stopProp(() => seek(-10))}>−10 s</button>
        <button className="btn small ghost" onClick={stopProp(() => seek(15))}>+15 s</button>
        <button className="btn small" onClick={stopProp(() => keep(Math.floor(player?.currentTime ?? 0)))} title="Start this clip here from now on">Start here</button>
        {mine != null && <button className="btn small ghost" onClick={stopProp(() => keep(null))} title={`Your start: ${mmss(mine)}. Back to the list's start.`}>Reset</button>}
      </div>}
    </div>
  );
}

/** After the answer: who wrote it (flag, life, era) and the whole work, part by part. */
export function MusicReveal({ ds, place }: { ds: Dataset; place: Place }) {
  const m = place.music!;
  const playing = usePlaying();
  const flag = m.composer.country ? ds.byId.get(m.composer.country)?.flag : null;
  return (
    <div className="music-reveal" onClick={e => e.stopPropagation()}>
      {/* Always the piece (and the part) as well as who wrote it, whatever the card asked. */}
      <p className="work-line"><b>{m.work.replace(/^the /, 'The ')}</b>{m.label ? ` · ${m.label}` : ''}{place.year ? ` · ${place.year < 1000 ? place.year : `c. ${place.year}`}` : ''}</p>
      <p className="composer-line">
        {flag && <Flag file={flag} name={m.composer.countryName ?? ''} size={60} />}
        <span><b>{m.composer.name}</b>{m.composer.born ? ` (${m.composer.born}–${m.composer.died ?? ''})` : ''}{m.composer.countryName ? ` · ${m.composer.countryName}` : ''}{m.era ? ` · ${m.era}` : ''}</span>
      </p>
      {m.siblings.length > 1 && <div className="movement-strip">
        <small className="muted">{m.work}: {m.siblings.length} parts here</small>
        <ol>
          {m.siblings.map(s => (
            <li key={s.id} className={(s.id === place.id ? 'this' : '') + (playing === clipKey(s.file, s.start) ? ' on' : '')}>
              <button onClick={() => (playing === clipKey(s.file, s.start) ? stop() : play(s.file, s.start))} aria-label={`Play ${s.label ?? m.work}`}>
                <Icon name={playing === clipKey(s.file, s.start) ? 'x' : 'play'} size={14} />
              </button>
              <span>{s.label ?? m.work}</span>{s.id === place.id && <em>this one</em>}
            </li>
          ))}
        </ol>
      </div>}
    </div>
  );
}
