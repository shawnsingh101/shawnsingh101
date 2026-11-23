// Music cards: the clip that is the question, and on the reveal the composer (portrait is the card's picture; here the
// flag, life and era) and every recorded part of the same work, each playable, the current one marked. One player for
// the whole app, so starting a clip stops the one before.
import { useEffect, useState } from 'react';
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
let current: string | null = null;
let tries: string[] = [];
const failed = new Set<string>(); // recordings that wouldn't load anywhere: the card says so
const listeners = new Set<(f: string | null) => void>();
const announce = () => listeners.forEach(l => l(current));

export function play(file: string, start = 0) {
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
  [player.src, ...tries] = audioUrls(file);
  startAt = start; stopAt = start + CLIP_SECONDS; failed.delete(file);
  current = file; announce();
  player.play().catch(e => { if ((e as Error).name === 'NotAllowedError') { current = null; announce(); } }); // autoplay blocked: tap the button
}
export function stop() { player?.pause(); current = null; announce(); }

function usePlaying() {
  const [f, setF] = useState<string | null>(current);
  useEffect(() => { listeners.add(setF); return () => { listeners.delete(setF); }; }, []);
  return f;
}

/** The question: plays by itself when the card appears; tap to play again or stop. */
export function ClipPlayer({ file, start }: { file: string; start: number }) {
  const now = usePlaying(), playing = now === file;
  useEffect(() => { play(file, start); return () => stop(); }, [file, start]);
  return (
    <button className={'clip-player' + (playing ? ' on' : '')} onClick={e => { e.stopPropagation(); if (playing) stop(); else play(file, start); }} aria-label={playing ? 'Stop the music' : 'Play the music'}>
      <span className="clip-icon"><Icon name={playing ? 'x' : 'play'} size={22} /></span>
      <span>{playing ? 'Playing… tap to stop' : failed.has(file) && !now ? "Couldn't load this recording: tap to try again" : 'Play again'}</span>
      {playing && <span className="clip-bars" aria-hidden><i /><i /><i /><i /></span>}
    </button>
  );
}

/** After the answer: who wrote it (flag, life, era) and the whole work, part by part. */
export function MusicReveal({ ds, place }: { ds: Dataset; place: Place }) {
  const m = place.music!;
  const playing = usePlaying();
  const flag = m.composer.country ? ds.byId.get(m.composer.country)?.flag : null;
  return (
    <div className="music-reveal" onClick={e => e.stopPropagation()}>
      <p className="composer-line">
        {flag && <Flag file={flag} name={m.composer.countryName ?? ''} size={60} />}
        <span><b>{m.composer.name}</b>{m.composer.born ? ` (${m.composer.born}–${m.composer.died ?? ''})` : ''}{m.composer.countryName ? ` · ${m.composer.countryName}` : ''}{m.era ? ` · ${m.era}` : ''}</span>
      </p>
      {m.siblings.length > 1 && <div className="movement-strip">
        <small className="muted">{m.work}: {m.siblings.length} parts here</small>
        <ol>
          {m.siblings.map(s => (
            <li key={s.id} className={(s.file === m.file ? 'this' : '') + (playing === s.file ? ' on' : '')}>
              <button onClick={() => (playing === s.file ? stop() : play(s.file, s.start))} aria-label={`Play ${s.label ?? m.work}`}>
                <Icon name={playing === s.file ? 'x' : 'play'} size={14} />
              </button>
              <span>{s.label ?? m.work}</span>{s.file === m.file && <em>this one</em>}
            </li>
          ))}
        </ol>
      </div>}
    </div>
  );
}
