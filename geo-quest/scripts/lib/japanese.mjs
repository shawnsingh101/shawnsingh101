// Japanese names get Hepburn romaji, the way Chinese ones get pinyin: 神奈川沖浪裏 → Kanagawa Oki Nami Ura, 東京 → Tōkyō.
// Wikidata's own romanization (P2125, "Revised Hepburn") wins where it has one; otherwise kuroshiro reads the kanji.
// Used by the syncs; also runnable on its own to fill in the data files already there:
//   node scripts/lib/japanese.mjs public/data/*.json
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuro = null;
async function engine() {
  if (!kuro) { const K = Kuroshiro.default ?? Kuroshiro, A = KuromojiAnalyzer.default ?? KuromojiAnalyzer; kuro = new K(); await kuro.init(new A()); }
  return kuro;
}
const isJa = n => n && typeof n === 'object' && n.code === 'ja' && typeof n.name === 'string';
const cap = w => w.charAt(0).toUpperCase() + w.slice(1);

/** Every Japanese local name in `data` (anywhere inside it). */
function collect(x, out = new Set()) {
  if (Array.isArray(x)) x.forEach(y => collect(y, out));
  else if (x && typeof x === 'object') { for (const n of x.native ?? []) if (isJa(n)) out.add(n.name); for (const [k, v] of Object.entries(x)) if (k !== 'audio') collect(v, out); }
  return out;
}
/** Readings for names: words spaced and capitalised ("Kamakura Daibutsu"). `known` (name → romaji) takes precedence. */
export async function romajiFor(names, known = new Map()) {
  const k = await engine(), out = new Map();
  for (const n of names) {
    if (known.has(n)) { out.set(n, known.get(n)); continue; }
    const r = await k.convert(n, { to: 'romaji', mode: 'spaced', romajiSystem: 'hepburn' });
    out.set(n, r.split(/\s+/).filter(Boolean).map(cap).join(' ').replace(/ ([,.])/g, '$1'));
  }
  return out;
}
/** Add `roman` to each Japanese local name (refresh = re-spell ones already there). */
export async function addRomaji(data, known, refresh = false) {
  const names = [...collect(data)];
  const map = await romajiFor(names, known);
  const walk = x => {
    if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === 'object') { for (const n of x.native ?? []) if (isJa(n) && (refresh || !n.roman)) n.roman = map.get(n.name); for (const [k, v] of Object.entries(x)) if (k !== 'audio') walk(v); }
  };
  walk(data);
  return data;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const refresh = process.argv.includes('--refresh');
  for (const f of process.argv.slice(2).filter(a => !a.startsWith('--'))) {
    const raw = readFileSync(f, 'utf8'), d = JSON.parse(raw), before = JSON.stringify(d);
    await addRomaji(d, undefined, refresh);
    if (JSON.stringify(d) !== before) { writeFileSync(f, raw.includes('\n ') ? JSON.stringify(d, null, 1) + '\n' : JSON.stringify(d)); console.log('romaji added:', f); }
  }
}
