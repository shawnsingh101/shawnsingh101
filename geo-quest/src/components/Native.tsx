import type { Audio, Capital, Chinese, NativeName, Place } from '../types';
import { useProgress } from '../srs';
import { Icon } from './Icons';

// ---- pronunciation ------------------------------------------------------------------
// A real recording from Wikimedia Commons when Wikidata has one in that language,
// otherwise the device's own text-to-speech voice (good on phones, incl. Mandarin tones).
const bcp47 = (code?: string) => (!code ? undefined : code === 'zh-hans' || code === 'zh' ? 'zh-CN' : code === 'zh-hant' ? 'zh-TW' : code);

function speak(text: string, code?: string) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  const lang = bcp47(code);
  if (lang) {
    u.lang = lang;
    // Prefer the device's best voices (Apple "Premium/Enhanced", Google, Microsoft "Natural"/neural) over the basic default.
    const all = speechSynthesis.getVoices();
    const match = all.filter(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    const pool = match.length ? match : all.filter(v => v.lang.toLowerCase().startsWith(lang.split('-')[0]));
    const score = (v: SpeechSynthesisVoice) => (/premium/i.test(v.name) ? 5 : /enhanced|natural|neural/i.test(v.name) ? 4 : /google/i.test(v.name) ? 3 : /siri/i.test(v.name) ? 2 : 0) + (v.localService ? 0 : 0.5);
    const v = [...pool].sort((a, b) => score(b) - score(a))[0];
    if (v) u.voice = v;
  }
  u.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function play(urls: string[], fallback: () => void) {
  if (!urls.length) return fallback();
  const a = new window.Audio(urls[0]);
  let done = false;
  const next = () => { if (!done) { done = true; play(urls.slice(1), fallback); } };
  a.addEventListener('error', next);
  a.play().catch(next);
}

export function Say({ text, code, audio }: { text: string; code?: string; audio?: Audio }) {
  const base = code?.split('-')[0];
  const urls = audio && base ? Object.entries(audio).find(([k]) => k.split('-')[0] === base)?.[1] ?? [] : [];
  return (
    <button className={'say' + (urls.length ? ' rec' : '')} aria-label={`Pronounce ${text}`} title={urls.length ? 'Recording by a native speaker' : 'Device voice'}
      onClick={e => { e.stopPropagation(); play(urls, () => speak(text, code)); }}>
      <Icon name="sound" size={14} />
    </button>
  );
}

/** 山西 Shānxī 🔈 */
export function Zh({ zh, audio, className }: { zh?: Chinese | null; audio?: Audio; className?: string }) {
  if (!zh) return null;
  return <span className={'zh ' + (className ?? '')} lang="zh-Hans"><span className="han">{zh.han}</span><span className="py">{zh.pinyin}</span><Say text={zh.han} code="zh" audio={audio} /></span>;
}

/** Deutschland 🔈 · ישראל 🔈 … each in its own script, language on hover. */
export function Natives({ list, audio, max = 3, showLang = false, voice = true }: { list?: NativeName[]; audio?: Audio; max?: number; showLang?: boolean; voice?: boolean }) {
  if (!list?.length) return null;
  return (
    <span className="natives">
      {list.slice(0, max).map(n => (
        <span key={n.name} className="native" title={n.lang}><bdi>{n.name}</bdi>{n.roman && <span className="py">{n.roman}</span>}{showLang && <small>{n.lang}</small>}{voice && <Say text={n.name} code={n.code} audio={audio} />}</span>
      ))}
    </span>
  );
}

/** The local-language line for a place (or one of its capitals). Chinese always shows; other languages follow the setting. */
export function LocalName({ place, capital, showLang, voice = true }: { place: Place; capital?: Capital; showLang?: boolean; voice?: boolean }) {
  const on = useProgress().settings.nativeNames;
  const owner = capital ?? place;
  // Chinese: characters with pinyin; any other languages (a river through China and Laos) follow it.
  const others = owner.zh ? owner.native?.filter(n => !/^zh/.test(n.code ?? '') && n.lang !== 'Chinese') : owner.native;
  const zh = owner.zh ? (voice ? <Zh zh={owner.zh} audio={owner.audio} /> : <span className="zh" lang="zh-Hans"><span className="han">{owner.zh.han}</span><span className="py">{owner.zh.pinyin}</span></span>) : null;
  if (!on) return zh;
  return <>{zh}<Natives list={others} audio={owner.audio} showLang={showLang} voice={voice} /></>;
}
