// Chinese names everywhere get Hanyu Pinyin with tone marks, generated from the characters (pinyin-pro).
// Shared by the syncs; also runnable on its own to fill in pinyin in the data files already there:
//   node scripts/lib/chinese.mjs public/data/sites.json public/data/peaks.json …   (--refresh re-spells existing pinyin too)
import { pinyin } from 'pinyin-pro';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PINYIN_FIX = { 内蒙古: 'Nèi Měnggǔ', 黑龙江: 'Hēilóngjiāng' }; // the province is one word
// Words are spelled together and capitalised, as in place names: 清明上河图 → Qīngmíng Shànghé Tú, 北京故宫 → Běijīng Gùgōng.
// Word breaks come from the built-in segmenter (Intl.Segmenter); a run of one-character pieces is one transliterated name
// (珠穆朗玛 → Zhūmùlǎngmǎ). Tones are read from the whole name at once, so characters with two readings come out right.
const seg = new Intl.Segmenter('zh', { granularity: 'word' });
const SOUND = '阿埃艾奥巴拜贝比波布达德迪多厄尔法菲弗哈赫胡基吉加卡科克库拉莱兰勒雷里利洛鲁伦罗马麦曼梅蒙米摩姆穆纳内尼努帕佩皮普齐萨塞桑森沙什斯索塔特提图瓦威维沃乌西希谢休亚扬耶伊因约扎泽兹';
const GENERIC = ['山脉', '高原', '盆地', '沙漠', '山', '岭', '峰', '湖', '河', '江', '宫', '寺', '庙', '窟', '陵', '岛'];
export function toPinyin(h) {
  if (PINYIN_FIX[h]) return PINYIN_FIX[h];
  const syl = pinyin(h, { type: 'array', nonZh: 'consecutive' });
  if (syl.length !== [...h].length) return cap(syl.join(''));
  const words = [];
  let i = 0, run = '';
  // A name + a generic word is written as two words: 昆仑山脉 → Kūnlún Shānmài, 武夷山 → Wǔyí Shān, 布达拉宫 → Bùdálā Gōng.
  // A foreign name written with sound characters (布拉马普特拉 Brahmaputra) is one word: the segmenter would cut it up.
  const foreign = [...h].filter(c => SOUND.includes(c)).length >= 3;
  const parts = foreign ? [{ segment: h, isWordLike: true }] : [...seg.segment(h)];
  const pieces = [];
  for (const { segment, isWordLike } of parts) {
    let g = isWordLike && !/运河$/.test(segment) && GENERIC.find(x => segment.endsWith(x) && [...segment].length - [...x].length >= 2); // 大运河 Dà Yùnhé: 运河 is one word
    // …also when the transliterated name came in single characters: 珠|穆|朗|玛|峰 → Zhūmùlǎngmǎ Fēng
    if (!g && isWordLike && [...segment].length === 1 && GENERIC.includes(segment) && pieces.length >= 2 && pieces.slice(-2).every(x => [...x.segment].length === 1 && !x.generic)) { pieces.push({ segment, isWordLike, generic: true }); continue; }
    if (g) pieces.push({ segment: segment.slice(0, -g.length), isWordLike }, { segment: g, isWordLike, generic: true });
    else pieces.push({ segment, isWordLike });
  }
  for (const { segment, isWordLike, generic } of pieces) {
    const n = [...segment].length, py = syl.slice(i, i + n); i += n;
    if (generic && run) { words.push(run); run = ''; }
    if (!isWordLike) { if (run) { words.push(run); run = ''; } continue; }
    const w = py.map((x, k) => (k && /^[aoeāáǎàōóǒòēéěè]/.test(x) ? "'" : '') + x).join('');
    if (n === 1 && !generic) { run += (run && /^[aoeāáǎàōóǒòēéěè]/.test(w) ? "'" : '') + w; continue; }
    if (run) { words.push(run); run = ''; }
    words.push(w);
  }
  if (run) words.push(run);
  return words.map(cap).join(' ');
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const isChinese = n => /^zh/.test(n.code ?? '') || n.lang === 'Chinese';

/** Anything with a Chinese local name (a site, peak, river, capital, artwork…) gets `zh: { han, pinyin }` too. */
export function addChinese(x, refresh = false) {
  if (Array.isArray(x)) { x.forEach(y => addChinese(y, refresh)); return x; }
  if (!x || typeof x !== 'object') return x;
  if (refresh && x.zh?.han && typeof x.zh.pinyin === 'string') x.zh.pinyin = toPinyin(x.zh.han); // --refresh: re-spell after a rule change
  if (Array.isArray(x.native) && !x.zh) {
    const n = x.native.find(isChinese);
    if (n && /[一-鿿]/.test(n.name)) x.zh = { han: n.name, pinyin: toPinyin(n.name) };
  }
  for (const [k, v] of Object.entries(x)) if (v && typeof v === 'object' && k !== 'audio') addChinese(v, refresh);
  return x;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const refresh = process.argv.includes('--refresh');
  for (const f of process.argv.slice(2).filter(a => !a.startsWith('--'))) {
    const raw = readFileSync(f, 'utf8'), d = JSON.parse(raw);
    const before = JSON.stringify(d);
    addChinese(d, refresh);
    if (JSON.stringify(d) !== before) { writeFileSync(f, raw.includes('\n ') ? JSON.stringify(d, null, 1) + '\n' : JSON.stringify(d)); console.log('pinyin added:', f); }
  }
}
