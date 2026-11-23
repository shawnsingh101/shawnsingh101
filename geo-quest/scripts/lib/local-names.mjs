// Local names for things that span or belong to other places: mountain ranges (the languages of the countries they
// cross: Alps → Alpen, Alpi, Alpes) and territories (their own official languages: Greenland → Kalaallit Nunaat).
// Used by sync-wikidata.mjs; also runnable on its own to fill in the data files already there:
//   node scripts/lib/local-names.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addChinese } from './chinese.mjs';

const qid = uri => uri && uri.split('/').pop();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
// "Saint-Barthélemy" is just "Saint Barthélemy": not worth showing as a local name.
const same = s => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9\u0370-\uffff]/g, '').replace(/^the/, '');

/** Give each item `native` names: its Wikidata label in each of `langsOf(item)` ([{ code, lang }], up to 3) that differs from English. */
export async function addLocalNames(items, langsOf, sparql) {
  const want = new Map(items.map(p => [p.id, langsOf(p).slice(0, 3)]));
  const codes = [...new Set([...want.values()].flat().flatMap(l => (l.code === 'zh-hans' ? ['zh-hans', 'zh'] : [l.code])))];
  if (!codes.length) return;
  const labels = {};
  const ids = items.map(p => p.id);
  for (let i = 0; i < ids.length; i += 100)
    for (const b of await sparql(`SELECT ?p ?l WHERE { VALUES ?p { ${ids.slice(i, i + 100).map(q => `wd:${q}`).join(' ')} } ?p rdfs:label ?l FILTER(lang(?l) IN (${codes.map(c => `"${c}"`).join(',')})) }`))
      (labels[qid(b.p.value)] ??= {})[b.l['xml:lang']] = b.l.value;
  for (const p of items) {
    const out = [];
    for (const l of want.get(p.id)) {
      let name = labels[p.id]?.[l.code] ?? (l.code === 'zh-hans' ? labels[p.id]?.zh : undefined);
      if (name) name = name.replace(/\s*\([^)]*\)\s*$/, ''); // "الصحراء الغربية (مصر)": drop the disambiguation
      if (name && same(name) !== same(p.name) && !out.some(n => same(n.name) === same(name))) out.push({ name, lang: l.lang, code: l.code });
    }
    if (out.length) p.native = out; else delete p.native;
  }
  addChinese(items);
}

/** Official languages of places (P37), English left out: Greenland → [Greenlandic], Aruba → [Papiamento, Dutch]. */
export async function officialLanguages(ids, sparql) {
  const out = new Map();
  for (const b of await sparql(`SELECT ?p ?code ?lLabel WHERE { VALUES ?p { ${ids.map(q => `wd:${q}`).join(' ')} } ?p wdt:P37 ?l . ?l wdt:P424 ?code .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`)) {
    const code = b.code.value;
    if (/^en/.test(code) || /[^a-z-]/.test(code)) continue;
    const list = out.get(qid(b.p.value)) ?? [];
    if (!list.some(l => l.code === code)) list.push({ code: code === 'zh' ? 'zh-hans' : code, lang: cap(b.lLabel.value.replace(/ language$/, '')) });
    out.set(qid(b.p.value), list);
  }
  return out;
}

/** A range's languages: the first language of each country it crosses (China → Chinese with pinyin). */
export function rangeLangs(range, countriesByName) {
  const names = ((range.facts ?? '').split(' · ').pop() ?? '').replace(/…$/, '').split(', ');
  const out = [];
  for (const n of names) {
    const c = countriesByName.get(n.trim());
    const l = c?.id === 'Q148' ? { code: 'zh-hans', lang: 'Chinese' } : c?.native?.[0]?.code ? { code: c.native[0].code === 'bar' ? 'de' : c.native[0].code, lang: c.native[0].code === 'bar' ? 'German' : c.native[0].lang } : null;
    if (l && !out.some(x => x.code === l.code)) out.push(l);
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
  const sparql = async query => {
    const r = await fetch('https://query.wikidata.org/sparql', { method: 'POST', headers: { 'User-Agent': 'GeoQuestStudyApp/0.1 (personal flashcard app)', Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ query }) });
    if (!r.ok) throw new Error(`Wikidata ${r.status}`);
    return (await r.json()).results.bindings;
  };
  const read = f => JSON.parse(readFileSync(join(ROOT, 'public/data', f), 'utf8'));
  const write = (f, d) => writeFileSync(join(ROOT, 'public/data', f), JSON.stringify(d, null, 1) + '\n');
  const countries = read('countries.json').countries;
  const byName = new Map(countries.map(c => [c.name, c]));
  const ranges = read('ranges.json');
  await addLocalNames(ranges.places, r => rangeLangs(r, byName), sparql);
  write('ranges.json', ranges);
  const terr = read('territories.json');
  const langs = await officialLanguages(terr.places.map(t => t.id), sparql);
  await addLocalNames(terr.places, t => langs.get(t.id) ?? [], sparql);
  write('territories.json', terr);
  console.log(`ranges: ${ranges.places.filter(p => p.native).length}/${ranges.places.length} · territories: ${terr.places.filter(p => p.native).length}/${terr.places.length} with local names`);
}
