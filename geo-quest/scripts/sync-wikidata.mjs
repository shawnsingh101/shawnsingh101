#!/usr/bin/env node
// Pulls country facts from Wikidata (the structured database behind Wikipedia)
// and writes public/data/countries.json. Any fact that changed since the last
// run is appended to public/data/changes.json so the app can tell you about it
// and re-queue the affected flashcards.
//
//   node scripts/sync-wikidata.mjs            # fetch + write
//   node scripts/sync-wikidata.mjs --dry-run  # fetch + print changes only

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { toPinyin, addChinese } from './lib/chinese.mjs';
import YAML from 'yaml';
import { unzipSync, strFromU8 } from 'fflate';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const andJoin = (acc, x, i, arr) => !i ? x : acc + (i === arr.length - 1 ? ' and ' : ', ') + x;

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/data/countries.json');
const CHANGES = join(ROOT, 'public/data/changes.json');
const DRY = process.argv.includes('--dry-run');

const overrides = JSON.parse(readFileSync(join(ROOT, 'data/overrides.json'), 'utf8'));
const extras = overrides._extras; // states outside UN membership we still want

const ENDPOINT = 'https://query.wikidata.org/sparql';
const UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)';

async function sparql(query) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ query }),
    });
    if (res.ok) return (await res.json()).results.bindings;
    console.warn(`Wikidata answered ${res.status}, retry ${attempt}/5 in ${30 * attempt}s`);
    await new Promise(r => setTimeout(r, 30000 * attempt));
  }
  throw new Error('Wikidata query failed after retries');
}

const qid = uri => uri && uri.split('/').pop();
const file = uri => uri && decodeURIComponent(uri.split('/').pop());
const point = wkt => { const m = wkt && /Point\(([-\d.eE]+) ([-\d.eE]+)\)/.exec(wkt); return m ? { lon: +(+m[1]).toFixed(3), lat: +(+m[2]).toFixed(3) } : {}; };
const v = (b, k) => {
  const x = b[k]?.value;
  // When Wikidata has no English label the label service returns the bare id ("Q29445"); fall back to the article title.
  if (k.endsWith('Label') && x && /^Q\d+$/.test(x)) {
    const art = b[k.replace('Label', 'Article')]?.value ?? b.article?.value;
    if (art) return decodeURIComponent(art.split('/wiki/')[1]).replace(/_/g, ' ').replace(/ \(.*\)$/, '').replace(/, .*$/, ''); // "Juneau, Alaska" → "Juneau"
  }
  return x;
};

const extraValues = Object.keys(extras).map(q => `wd:${q}`).join(' ');

const COUNTRY_Q = `
SELECT ?c ?cLabel ?iso2 ?iso3 ?isoNum ?flag ?coord ?article ?un WHERE {
  { ?c p:P463 ?m . ?m ps:P463 wd:Q1065 . FILTER NOT EXISTS { ?m pq:P582 [] } ?c wdt:P297 [] . BIND(true AS ?un) }
  UNION { VALUES ?c { ${extraValues} } }
  FILTER NOT EXISTS { ?c wdt:P576 [] }
  OPTIONAL { ?c wdt:P297 ?iso2 } OPTIONAL { ?c wdt:P298 ?iso3 } OPTIONAL { ?c wdt:P299 ?isoNum }
  OPTIONAL { ?c wdt:P41 ?flag } OPTIONAL { ?c wdt:P625 ?coord }
  OPTIONAL { ?article schema:about ?c ; schema:isPartOf <https://en.wikipedia.org/> }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

const CAPITAL_Q = `
SELECT ?c ?cap ?capLabel ?rank ?capImg ?capCoord ?capArticle (GROUP_CONCAT(DISTINCT ?roleLabel; separator="; ") AS ?roles) WHERE {
  VALUES ?c { %IDS% }
  ?c p:P36 ?st . ?st ps:P36 ?cap ; wikibase:rank ?rank .
  FILTER(?rank != wikibase:DeprecatedRank) FILTER NOT EXISTS { ?st pq:P582 [] }
  OPTIONAL { ?st pq:P3831|pq:P2868|pq:P1810 ?role . ?role rdfs:label ?roleLabel FILTER(lang(?roleLabel)="en") }
  OPTIONAL { ?cap wdt:P18 ?capImg } OPTIONAL { ?cap wdt:P625 ?capCoord }
  OPTIONAL { ?capArticle schema:about ?cap ; schema:isPartOf <https://en.wikipedia.org/> }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} GROUP BY ?c ?cap ?capLabel ?rank ?capImg ?capCoord ?capArticle`;

// ---- region lookup (UN geoscheme) + map shape ids ---------------------------
const wc = require('world-countries');
const byIso3 = Object.fromEntries(wc.map(c => [c.cca3, c]));
const topo = require('world-atlas/countries-50m.json');
const topoByNum = new Set(topo.objects.countries.geometries.map(g => g.id).filter(Boolean));
const topoByName = new Set(topo.objects.countries.geometries.map(g => g.properties.name));

// ---- run -------------------------------------------------------------------
console.log('Querying Wikidata for countries…');
const rows = await sparql(COUNTRY_Q);
const countries = new Map();
for (const b of rows) {
  const id = qid(v(b, 'c'));
  if (countries.has(id)) continue; // first row wins (multiple coords etc.)
  const ex = extras[id];
  const iso3 = v(b, 'iso3') || ex?.iso3 || null;
  const o = overrides[id] || {};
  const wcc = iso3 && byIso3[iso3];
  countries.set(id, {
    id,
    name: o.name || ex?.name || wcc?.name.common || v(b, 'cLabel'),
    officialName: v(b, 'cLabel'),
    iso2: v(b, 'iso2') || null,
    iso3,
    status: ex ? ex.status : 'un',
    statusNote: ex?.note || null,
    region: ex?.region || wcc?.region || null,
    subregion: ex?.subregion || wcc?.subregion || null,
    topo: (v(b, 'isoNum') && topoByNum.has(v(b, 'isoNum'))) ? { id: v(b, 'isoNum') } : (ex?.topoName && topoByName.has(ex.topoName) ? { name: ex.topoName } : null),
    flag: file(v(b, 'flag')) || ex?.flag || null, // an override only fills a missing flag
    ...point(v(b, 'coord')),
    wiki: v(b, 'article') ? decodeURIComponent(v(b, 'article').split('/wiki/')[1]) : null,
    capitals: [],
  });
}

const ids = [...countries.keys()].map(q => `wd:${q}`).join(' ');
console.log(`Found ${countries.size} countries. Querying capitals…`);
for (const b of await sparql(CAPITAL_Q.replace('%IDS%', ids))) {
  const c = countries.get(qid(v(b, 'c')));
  const capId = qid(v(b, 'cap'));
  const preferred = v(b, 'rank').endsWith('PreferredRank');
  const existing = c.capitals.find(x => x.id === capId);
  if (existing) { existing.preferred ||= preferred; continue; }
  c.capitals.push({
    id: capId, name: v(b, 'capLabel'), preferred, role: v(b, 'roles') || null,
    image: file(v(b, 'capImg')) || null, ...point(v(b, 'capCoord')),
    wiki: v(b, 'capArticle') ? decodeURIComponent(v(b, 'capArticle').split('/wiki/')[1]) : null,
  });
}

// ---- names in the local language & script ----------------------------------------
// Countries: the curated native names from the world-countries dataset (e.g. Deutschland,
// 日本, مصر). Capitals: the city's Wikidata label in those same languages.
const native = (c, name) => {
  const wcc = c.iso3 && byIso3[c.iso3];
  if (!wcc?.name.native) return [];
  const out = [];
  // Main language first where the dataset's alphabetical order would mislead (data/overrides.json → nativeLangs).
  const order = overrides[c.id]?.nativeLangs;
  const entries = Object.entries(wcc.name.native).filter(([l]) => !order || order.includes(l))
    .sort(([a], [b]) => (order ? order.indexOf(a) - order.indexOf(b) : 0));
  for (const [lang, n] of entries) {
    if (n.common.toLowerCase() === name.toLowerCase() || out.some(o => o.name === n.common)) continue;
    out.push({ name: n.common, lang: wcc.languages?.[lang] ?? lang, code: lang });
  }
  return out.slice(0, 3);
};
for (const c of countries.values()) c.native = native(c, c.name);

const iso3s = [...new Set([...countries.values()].flatMap(c => c.native.map(n => n.code)))];
const langRows = await sparql(`SELECT ?iso ?code WHERE { VALUES ?iso { ${iso3s.map(x => `"${x}"`).join(' ')} } ?l wdt:P220 ?iso ; wdt:P424 ?code . }`);
const wikiCode = {};
for (const b of langRows) wikiCode[v(b, 'iso')] ??= v(b, 'code');
const codeFor = (c, iso) => (iso === 'zho' ? (c.id === 'Q865' ? 'zh-hant' : 'zh-hans') : wikiCode[iso]);
const capIds = [...new Set([...countries.values()].flatMap(c => c.capitals.map(x => x.id)))];
const capLabels = {};
const codes = [...new Set([...countries.values()].flatMap(c => c.native.map(n => codeFor(c, n.code))).filter(Boolean))];
for (const b of await sparql(`SELECT ?c ?l WHERE { VALUES ?c { ${capIds.map(q => `wd:${q}`).join(' ')} } ?c rdfs:label ?l FILTER(lang(?l) IN (${codes.map(x => `"${x}"`).join(',')})) }`)) {
  (capLabels[qid(v(b, 'c'))] ??= {})[b.l['xml:lang']] = v(b, 'l');
}
for (const c of countries.values()) {
  for (const cap of c.capitals) {
    const out = [];
    for (const n of c.native) {
      let l = capLabels[cap.id]?.[codeFor(c, n.code)];
      if (l && /^(zho|jpn)$/.test(n.code) && l.length > 2) l = l.replace(/[市都]$/, ''); // 北京市 → 北京, 東京都 → 東京
      if (l && l.toLowerCase() !== cap.name.toLowerCase() && !out.some(o => o.name === l)) out.push({ name: l, lang: n.lang });
    }
    cap.native = out;
  }
  for (const cap of c.capitals) cap.native = cap.native.map(n => ({ ...n, code: codeFor(c, c.native.find(x => x.lang === n.lang)?.code) }));
  c.native = c.native.map(({ name, lang, code }) => ({ name, lang, code: codeFor(c, code) }));
}

// Build the human sentence for the capital answer. Overrides only apply while
// Wikidata still lists exactly the capitals the override was written for; if
// Wikidata changes, the override is ignored and flagged so it never goes stale.
const warnings = [];
for (const c of countries.values()) {
  c.capitals.sort((a, b) => (b.preferred - a.preferred) || a.name.localeCompare(b.name));
  // If Wikidata marks one capital as preferred, the others are usually seats of
  // government etc. Keep them but put the preferred one first.
  const names = c.capitals.map(x => x.name).sort();
  const o = overrides[c.id];
  if (o?.capitalAnswer) {
    const seen = [...o.capitalsSeen].sort();
    if (JSON.stringify(seen) === JSON.stringify(names)) {
      c.capitalAnswer = o.capitalAnswer;
      c.capitalNote = o.capitalNote || null;
    } else {
      warnings.push(`${c.name}: override was written for [${seen}] but Wikidata now says [${names}] — override ignored, please review data/overrides.json`);
    }
  }
  if (!c.capitalAnswer) {
    const pref = c.capitals.filter(x => x.preferred);
    const main = pref.length === 1 ? pref : c.capitals;
    c.capitalAnswer = main.length ? main.map(x => x.name).reduce(andJoin, '') : null;
    if (main.length > 1) warnings.push(`${c.name}: ${main.length} capitals and no override — consider adding wording to data/overrides.json`);
  }
  if (!c.capitalAnswer) warnings.push(`${c.name}: no capital in Wikidata`);
  if (!c.topo) warnings.push(`${c.name}: no map shape (will be shown as a dot)`);
  if (!c.region) warnings.push(`${c.name}: no region`);
}

const list = [...countries.values()].sort((a, b) => a.name.localeCompare(b.name));

// ---- oceans & seas, China's provinces ---------------------------------------------
const places = JSON.parse(readFileSync(join(ROOT, 'data/places.json'), 'utf8'));
const cnShapes = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-cn.json'), 'utf8')).objects.places.geometries;

const PLACE_Q = `
SELECT ?p ?pLabel ?img ?coord ?article WHERE {
  VALUES ?p { %IDS% }
  OPTIONAL { ?p wdt:P18 ?img } OPTIONAL { ?p wdt:P625 ?coord }
  OPTIONAL { ?article schema:about ?p ; schema:isPartOf <https://en.wikipedia.org/> }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

async function fetchPlaces(ids, layer, extra = () => ({})) {
  const out = new Map();
  for (const b of await sparql(PLACE_Q.replace('%IDS%', ids.map(q => `wd:${q}`).join(' ')))) {
    const id = qid(v(b, 'p'));
    if (out.has(id)) continue;
    out.set(id, {
      id, layer, name: v(b, 'pLabel'), image: file(v(b, 'img')) || null, ...point(v(b, 'coord')),
      wiki: v(b, 'article') ? decodeURIComponent(v(b, 'article').split('/wiki/')[1]) : null, ...extra(id),
    });
  }
  for (const id of ids) if (!out.has(id)) warnings.push(`${layer}: ${id} not found in Wikidata`);
  return out;
}

// Most water names take "the" ("the Red Sea"), bays named like "Hudson Bay" don't.
const withThe = name => (/^[A-Z][a-z]+ Bay$/.test(name) || /^(Baffin|Hudson|James)/.test(name) ? name : `the ${name}`);

console.log('Querying Wikidata for oceans & seas…');
const waterGroup = Object.fromEntries(places.water.flatMap(g => g.members.map(m => [m, g.id])));
const water = await fetchPlaces(Object.keys(waterGroup), 'water', id => ({ group: waterGroup[id] }));
for (const w of water.values()) {
  const o = overrides[w.id];
  if (o?.name) w.name = o.name;
  w.nameThe = o?.nameThe ?? withThe(w.name);
}

console.log('Querying Wikidata for China\'s provinces…');
const cnType = Object.fromEntries(cnShapes.map(g => [g.properties.id, g.properties.type]));
const cn = await fetchPlaces(Object.keys(cnType), 'cn', id => ({ group: 'cn', type: cnType[id], capitals: [] }));
for (const b of await sparql(CAPITAL_Q.replace('%IDS%', [...cn.keys()].map(q => `wd:${q}`).join(' ')))) {
  const p = cn.get(qid(v(b, 'c')));
  if (p.type === 'municipality' || p.type === 'special administrative region') continue; // they are cities themselves
  const capId = qid(v(b, 'cap'));
  if (p.capitals.some(x => x.id === capId)) continue;
  p.capitals.push({ id: capId, name: v(b, 'capLabel'), preferred: v(b, 'rank').endsWith('PreferredRank'), role: null,
    image: file(v(b, 'capImg')) || null, ...point(v(b, 'capCoord')),
    wiki: v(b, 'capArticle') ? decodeURIComponent(v(b, 'capArticle').split('/wiki/')[1]) : null });
}
// Chinese characters (Wikidata) + Hanyu Pinyin with tone marks (generated from the characters).
const shortHan = h => h.replace(/(维吾尔|壮族|回族)?自治区$|特别行政区$|省$|市$/, '');
const hanIds = [...cn.keys(), ...[...cn.values()].flatMap(p => p.capitals.map(c => c.id))];
const han = {};
for (const b of await sparql(`SELECT ?p ?l WHERE { VALUES ?p { ${hanIds.map(q => `wd:${q}`).join(' ')} } ?p rdfs:label ?l FILTER(lang(?l) IN ("zh-hans","zh-cn","zh")) }`)) {
  const id = qid(v(b, 'p')), lang = b.l['xml:lang'];
  if (!han[id] || lang === 'zh-hans') han[id] = v(b, 'l');
}
const chinese = id => { if (!han[id]) return null; const h = shortHan(han[id]); return { han: h, pinyin: toPinyin(h) }; };
for (const p of cn.values()) {
  p.zh = chinese(p.id);
  for (const c of p.capitals) c.zh = chinese(c.id);
  if (!p.zh) warnings.push(`${p.name}: no Chinese label in Wikidata`);
}
for (const p of cn.values()) {
  const o = overrides[p.id];
  if (o?.name) p.name = o.name;
  const pref = p.capitals.filter(x => x.preferred);
  const main = (pref.length ? pref : p.capitals).sort((a, b) => a.name.localeCompare(b.name)); // a fixed order, so nightly runs don't report a change
  p.capitals = main;
  p.capitalAnswer = main.length ? main.map(x => x.name).reduce(andJoin, '') : null;
  if (!p.capitalAnswer && (p.type === 'province' || p.type === 'autonomous region')) warnings.push(`${p.name}: no capital in Wikidata`);
}


// ---- rivers & lakes ---------------------------------------------------------------
// Which ones exist comes from the shapes (data/rivers.json, Natural Earth lakes); everything
// else comes from Wikidata, including the tiers: the 20 longest rivers / 20 largest lakes are
// the "great" tier, the rest are grouped by continent and unlock after it.
const shapeIds = f => JSON.parse(readFileSync(join(ROOT, `public/data/shapes-${f}.json`), 'utf8')).objects.places.geometries.map(g => g.properties.id);
// Rivers given a deck of their own in data/rivers.json (Rivers of the United States…) instead of their continent's.
const deckOf = Object.fromEntries(JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-river.json'), 'utf8')).objects.places.geometries.filter(g => g.properties.deck).map(g => [g.properties.id, g.properties.deck]));
const regionOfCountry = Object.fromEntries([...countries.values()].map(c => [c.id, c.region]));
const MEASURE_Q = `
SELECT ?p ?len ?area ?mouthLabel (GROUP_CONCAT(DISTINCT ?ctry; separator=" ") AS ?ctrys) WHERE {
  VALUES ?p { %IDS% }
  OPTIONAL { ?p p:P2043/psn:P2043/wikibase:quantityAmount ?len }
  OPTIONAL { ?p p:P2046/psn:P2046/wikibase:quantityAmount ?area }
  OPTIONAL { ?p wdt:P403 ?mouth . ?mouth rdfs:label ?mouthLabel FILTER(lang(?mouthLabel) = "en") }
  OPTIONAL { ?p wdt:P17 ?ctry }
} GROUP BY ?p ?len ?area ?mouthLabel`;
async function measures(ids) {
  const out = {};
  for (let i = 0; i < ids.length; i += 200) {
    for (const b of await sparql(MEASURE_Q.replace('%IDS%', ids.slice(i, i + 200).map(q => `wd:${q}`).join(' ')))) {
      const o = (out[qid(v(b, 'p'))] ??= { len: 0, area: 0, mouth: null, countries: [] });
      o.len = Math.max(o.len, +(v(b, 'len') ?? 0));
      o.area = Math.max(o.area, +(v(b, 'area') ?? 0));
      o.mouth ??= v(b, 'mouthLabel') ?? null;
      for (const c of (v(b, 'ctrys') ?? '').split(' ').filter(Boolean)) if (!o.countries.includes(qid(c))) o.countries.push(qid(c));
    }
  }
  return out;
}
const CONT_GROUP = { Europe: 'eu', Asia: 'as', Oceania: 'as', Africa: 'af', Americas: 'am' };
// Russia and Kazakhstan span two continents: east of the Urals (~60°E) counts as Asia.
const TRANSCONTINENTAL = new Set(['Q159', 'Q232']);
function mainRegion(cs, lon) {
  const n = {};
  for (const c of cs) {
    let r = regionOfCountry[c];
    if (TRANSCONTINENTAL.has(c) && lon != null) r = lon > 60 ? 'Asia' : 'Europe';
    if (r) n[r] = (n[r] ?? 0) + 1;
  }
  return Object.entries(n).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
const fmt = n => Math.round(n).toLocaleString('en-US');
const countryNames = cs => cs.map(c => countries.get(c)?.name).filter(Boolean);

async function waterways(kind) {
  const ids = shapeIds(kind);
  const ms = await measures(ids);
  const places = await fetchPlaces(ids, kind, () => ({}));
  const list = [...places.values()].map(p => ({ ...p, ...ms[p.id] })).filter(p => (kind === 'river' ? p.len : p.area) > 0 && mainRegion(p.countries ?? [], p.lon));
  const size = p => (kind === 'river' ? p.len : p.area);
  list.sort((a, b) => size(b) - size(a));
  const prefix = kind === 'river' ? 'r' : 'l';
  const perContinent = {};
  const kept = [];
  let rank = 0;
  list.forEach(p => {
    const o = overrides[p.id];
    if (o?.name) p.name = o.name;
    const region = mainRegion(p.countries, p.lon);
    const i = kind === 'river' && deckOf[p.id] ? Infinity : rank++;
    if (kind === 'river' && deckOf[p.id]) p.group = deckOf[p.id];
    else if (i < 20) p.group = `${prefix}-great`;
    else {
      const g = `${prefix}-${CONT_GROUP[region]}`;
      const famous = (overrides._lakesAlways ?? []).includes(p.id); // small but well-known (Dead Sea, Lake Geneva…)
      if (kind === 'lake' && !famous && /r[eé]servoir| bay$/i.test(p.name)) return; // man-made lakes only count if they're among the very largest
      if (kind === 'lake' && !famous && (perContinent[g] = (perContinent[g] ?? 0) + 1) > 15) return; // keep the 15 largest lakes per continent
      p.group = g;
    }
    // Big rivers through the US also appear in Rivers of the United States (same cards, one set of progress).
    if (kind === 'river' && !deckOf[p.id] && (p.countries ?? []).includes('Q30')) p.alsoIn = ['r-us'];
    p.nameThe = kind === 'river' ? (o?.nameThe ?? `the ${p.name}`) : (o?.nameThe ?? (/ Sea$|^Great Salt/.test(p.name) ? `the ${p.name}` : p.name));
    const where = countryNames(p.countries);
    p.facts = kind === 'river'
      ? [`${fmt(p.len / 1000)} km long`, p.mouth && `flows into ${/^(the |Lake )/i.test(p.mouth) || /^[A-Z][a-z]+ Bay$/.test(p.mouth) ? p.mouth : 'the ' + p.mouth}`, where.length && where.slice(0, 4).join(', ') + (where.length > 4 ? '…' : '')].filter(Boolean).join(' · ')
      : [`${fmt(p.area / 1e6)} km²`, where.length && where.slice(0, 4).join(', ')].filter(Boolean).join(' · ');
    p.size = Math.round(kind === 'river' ? p.len / 1000 : p.area / 1e6);
    if (kind === 'river' && p.mouth) p.mouthName = p.mouth; // kept for the facts line built later (with source and US states)
    delete p.len; delete p.area; delete p.mouth;
    kept.push(p);
  });
  return kept;
}
console.log('Querying Wikidata for rivers & lakes…');
const rivers = await waterways('river');
const lakes = await waterways('lake');

// Local names for rivers & lakes: the label in the main language of each country they touch
// (Danube → Donau, Dunărea, Duna…). Chinese ones get characters + pinyin like the provinces.
{
  const items = [...rivers, ...lakes];
  const codeOf = cid => {
    const n = countries.get(cid)?.native?.[0];
    if (!n) return null;
    return n.code === 'bar' ? { code: 'de', lang: 'German' } : { code: n.code, lang: n.lang }; // Austria's dataset entry is Austro-Bavarian
  };
  const wanted = new Set();
  for (const p of items) {
    p._langs = [];
    for (const cid of p.countries ?? []) {
      if (cid === 'Q148') { if (!p._langs.some(l => l.code === 'zh-hans')) p._langs.push({ code: 'zh-hans', lang: 'Chinese' }); continue; }
      const l = codeOf(cid);
      if (l?.code && !p._langs.some(x => x.code === l.code)) p._langs.push(l);
    }
    p._langs = p._langs.slice(0, 3);
    p._langs.forEach(l => wanted.add(l.code));
  }
  const labels = {};
  const ids = items.map(p => p.id);
  for (let i = 0; i < ids.length; i += 100) {
    for (const b of await sparql(`SELECT ?p ?l WHERE { VALUES ?p { ${ids.slice(i, i + 100).map(q => `wd:${q}`).join(' ')} } ?p rdfs:label ?l FILTER(lang(?l) IN (${[...wanted].map(x => `"${x}"`).join(',')})) }`)) {
      (labels[qid(v(b, 'p'))] ??= {})[b.l['xml:lang']] = v(b, 'l');
    }
  }
  for (const p of items) {
    const native = [];
    for (const l of p._langs) {
      const name = labels[p.id]?.[l.code];
      if (!name) continue;
      if (l.code === 'zh-hans') { p.zh = { han: name, pinyin: toPinyin(name) }; continue; }
      if (name.toLowerCase() !== p.name.toLowerCase() && !native.some(n => n.name === name)) native.push({ name, lang: l.lang, code: l.code });
    }
    if (native.length) p.native = native;
    delete p._langs;
  }
}

// ---- United States: states (Wikidata) & senators (@unitedstates/congress-legislators) ----
const usShapes = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-us.json'), 'utf8')).objects.places.geometries.map(g => g.properties);
const regionOfCode = Object.fromEntries(Object.entries(places.us.regions).flatMap(([g, codes]) => codes.map(c => [c, g])));
console.log('Querying Wikidata for US states…');
const states = await fetchPlaces(usShapes.map(s => s.id), 'us', id => {
  const code = usShapes.find(s => s.id === id).code;
  return { code, group: regionOfCode[code], capitals: [] };
});
for (const b of await sparql(CAPITAL_Q.replace('%IDS%', [...states.keys()].map(q => `wd:${q}`).join(' ')))) {
  const st = states.get(qid(v(b, 'c')));
  const capId = qid(v(b, 'cap'));
  if (st.capitals.some(x => x.id === capId)) continue;
  st.capitals.push({ id: capId, name: v(b, 'capLabel'), preferred: v(b, 'rank').endsWith('PreferredRank'), role: null,
    image: file(v(b, 'capImg')) || null, ...point(v(b, 'capCoord')),
    wiki: v(b, 'capArticle') ? decodeURIComponent(v(b, 'capArticle').split('/wiki/')[1]) : null });
}
for (const b of await sparql(`SELECT ?p ?flag WHERE { VALUES ?p { ${[...states.keys()].map(q => `wd:${q}`).join(' ')} } ?p wdt:P41 ?flag }`)) {
  states.get(qid(v(b, 'p'))).flag ??= file(v(b, 'flag'));
}
for (const st of states.values()) {
  const pref = st.capitals.filter(x => x.preferred);
  st.capitals = (pref.length ? pref : st.capitals).sort((a, b) => a.name.localeCompare(b.name)); // a fixed order, so nightly runs don't report a change
  st.capitalAnswer = st.capitals.map(x => x.name).reduce(andJoin, '') || null;
  if (!st.capitalAnswer) warnings.push(`${st.name}: no capital`);
  if (!st.flag) warnings.push(`${st.name}: no flag`);
}
const stateByCode = Object.fromEntries([...states.values()].map(s => [s.code, s]));

console.log('Downloading the current Congress (@unitedstates/congress-legislators)…');
const legRes = await fetch('https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml');
if (!legRes.ok) throw new Error('congress-legislators: ' + legRes.status);
const legislators = YAML.parse(await legRes.text());
const year = d => d.slice(0, 4);
const monthYear = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const senate = [];
for (const L of legislators) {
  const t = L.terms.at(-1);
  if (t.type !== 'sen') continue;
  const st = stateByCode[t.state];
  if (!st) { warnings.push(`Senator from unknown state ${t.state}`); continue; }
  const name = (L.id.wikipedia ?? `${L.name.nickname ?? L.name.first} ${L.name.last}`).replace(/ \(.*\)$/, '');
  const since = L.terms.find(x => x.type === 'sen').start;
  const roles = (L.leadership_roles ?? []).filter(r => r.chamber === 'senate' && !r.end).map(r => r.title);
  const party = t.party === 'Independent' && t.caucus ? `Independent (caucuses with the ${t.caucus}s)` : t.party;
  senate.push({
    id: `S-${t.state}-${t.state_rank}`,             // the seat, not the person: a new senator re-queues the card
    topic: 'senate', place: st.id, placeName: st.name,
    office: `${t.state_rank} senator from ${st.name}`, rolePrefix: `${t.state_rank} senator from`,
    label: `${t.state_rank === 'senior' ? 'Senior' : 'Junior'} senator from ${st.name}`,
    layer: 'senate', name, group: st.group, state: st.id, stateName: st.name, rank: t.state_rank,
    party: t.party, partyLong: party, since, termEnd: t.end, roles,
    photo: `https://raw.githubusercontent.com/unitedstates/images/gh-pages/congress/450x550/${L.id.bioguide}.jpg`,
    wiki: L.id.wikipedia ?? null, wikidata: L.id.wikidata ?? null, lon: st.lon, lat: st.lat,
    capitals: [], capitalAnswer: null,
    facts: [party, `Senator since ${monthYear(since)}`, roles.join(' · '), `Term ends ${year(t.end)}`].filter(Boolean).join(' · '),
  });
}
senate.sort((a, b) => a.stateName.localeCompare(b.stateName) || (a.rank === 'senior' ? -1 : 1));
// New senators often have no official portrait yet: drop the link so the app goes straight to the Wikipedia photo.
for (let i = 0; i < senate.length; i += 10) await Promise.all(senate.slice(i, i + 10).map(async x => {
  const r = await fetch(x.photo, { method: 'HEAD' }).catch(() => null);
  if (r && r.status === 404) x.photo = null;
}));
if (senate.length !== 100) warnings.push(`Expected 100 senators, found ${senate.length} (a seat may be vacant)`);

// ---- people in office: governors and heads of state/government ----
// Read from Wikipedia's closely-watched lists ("List of current United States governors",
// "List of current heads of state and government"); Wikidata's office statements are often stale.
const commonsThumb = f => f && `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=450`;
async function wikitext(page) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const r = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=wikitext&page=${encodeURIComponent(page)}`, { headers: { 'User-Agent': UA } });
    const t = await r.text();
    try { const j = JSON.parse(t); return j.parse ? j.parse.wikitext['*'] : null; } catch { /* rate limited — wait and retry */ }
    await new Promise(res => setTimeout(res, 10000 * attempt));
  }
  return null;
}
const norm = x => (x ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
const stripRefs = t => t.replace(/<ref[^>]*\/>/g, '').replace(/<ref[\s\S]*?<\/ref>/g, '');
const cap1s = x => x.charAt(0).toUpperCase() + x.slice(1);
/** Photo, party and Wikidata id for people, looked up by their English Wikipedia article. */
async function peopleInfo(titles) {
  const out = {};
  const ts = [...new Set(titles.filter(Boolean))];
  for (let i = 0; i < ts.length; i += 100) {
    const vals = ts.slice(i, i + 100).map(t => `<https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_')).replace(/%2F/g, '/').replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%27/g, "'").replace(/%28/g, '(').replace(/%29/g, ')')}>`);
    for (const b of await sparql(`SELECT ?a ?p ?img ?partyLabel ?prank ?pstart WHERE { VALUES ?a { ${vals.join(' ')} } ?a schema:about ?p .
        OPTIONAL { ?p wdt:P18 ?img }
        OPTIONAL { ?p p:P102 ?ps . ?ps ps:P102 ?party ; wikibase:rank ?prank . FILTER NOT EXISTS { ?ps pq:P582 [] } FILTER(?prank != wikibase:DeprecatedRank)
          OPTIONAL { ?ps pq:P580 ?pstart } OPTIONAL { ?party wdt:P576 ?dissolved } FILTER(!BOUND(?dissolved))
          ?party rdfs:label ?partyLabel FILTER(lang(?partyLabel) = "en") } }`)) {
      const t = decodeURIComponent(v(b, 'a').split('/wiki/')[1]).replace(/_/g, ' ');
      const o = (out[t] ??= { id: qid(v(b, 'p')), img: null, party: null, _score: -Infinity });
      o.img ??= file(v(b, 'img')) || null;
      // Several open-ended party statements (Hun Sen: the CPP and, unclosed, the Khmer Rouge): prefer the preferred one,
      // then the most recent start; dissolved parties are skipped.
      if (v(b, 'partyLabel')) {
        const score = (v(b, 'prank')?.endsWith('PreferredRank') ? 1e13 : 0) + (v(b, 'pstart') ? Date.parse(v(b, 'pstart')) || 0 : -1e12);
        if (score > o._score) { o.party = v(b, 'partyLabel'); o._score = score; }
      }
    }
  }
  for (const o of Object.values(out)) delete o._score;
  return out;
}

console.log('Reading current governors from Wikipedia…');
const governors = [];
{
  const text = stripRefs(await wikitext('List of current United States governors') ?? '');
  for (const row of text.split(/\n\|-/)) {
    const st = /^\s*\|\s*\[\[Governor of ([^|\]]+)\|/m.exec(row);
    const sn = /\{\{sortname\|([^|}]+)\|([^|}]+)(?:\|([^|}=]+))?/.exec(row);
    const ln = /!\s*scope="row"\s*\|\s*\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/.exec(row);
    if (!st || (!sn && !ln)) continue;
    const state = [...states.values()].find(s => s.name === st[1].trim());
    if (!state) continue;
    const name = sn ? `${sn[1]} ${sn[2]}`.trim() : (ln[2] ?? ln[1]).trim();
    const wiki = sn ? (sn[3]?.trim() || name) : ln[1].trim();
    const img = /\[\[File:([^|\]]+)/.exec(row)?.[1] ?? null;
    const partyM = /\|\s*\[\[[^|\]]*Party[^|\]]*\|([^\]]+)\]\]/.exec(row) ?? /\|\s*\[\[([^|\]]*Party[^|\]]*)\]\]/.exec(row);
    const party = partyM ? (/Democrat/.test(partyM[1]) ? 'Democrat' : /Republican/.test(partyM[1]) ? 'Republican' : partyM[1]) : null;
    const dts = /\{\{dts\|(\d{4})\|(\d{1,2})\|(\d{1,2})/.exec(row);
    const since = dts ? `${dts[1]}-${dts[2].padStart(2, '0')}-${dts[3].padStart(2, '0')}` : null;
    governors.push({
      id: `G-${state.code}`, topic: 'governors', layer: 'senate', label: `Governor of ${state.name}`,
      name, place: state.id, placeName: state.name, group: state.group, office: `Governor of ${state.name}`, rolePrefix: 'Governor of',
      party, partyLong: party, since, photo: commonsThumb(img), wiki, lon: state.lon, lat: state.lat,
      capitals: [], capitalAnswer: null,
      facts: [party, since && `Governor since ${monthYear(since)}`].filter(Boolean).join(' · '),
    });
  }
  if (governors.length !== 50) warnings.push(`Found ${governors.length} governors (expected 50)`);
}

console.log('Reading current heads of state and government from Wikipedia…');
const leaders = [];
{
  const text = stripRefs(await wikitext('List of current heads of state and government') ?? '');
  const byName = {};
  for (const c of list) for (const n of [c.name, c.officialName, c.wiki?.replace(/_/g, ' ')]) if (n) byName[norm(n)] = c;
  // Rows look like:  !scope="row" |{{flag|France}}  |[[President of France|President]] – [[Emmanuel Macron]]  |[[Prime Minister of France|Prime Minister]] – [[…]]
  // A country can continue on sub-rows (China: General Secretary, then President + Premier), and cells may be
  // "colspan=2" (one person is head of state and government). Footnote templates are stripped first.
  const stripTemplates = (t, name) => { // remove {{name …}} including nested braces
    let out = '', k = 0;
    while (k < t.length) {
      const m = t.indexOf('{{' + name, k);
      if (m < 0) { out += t.slice(k); break; }
      out += t.slice(k, m);
      let depth = 0, e = m;
      for (; e < t.length; e++) { if (t.startsWith('{{', e)) { depth++; e++; } else if (t.startsWith('}}', e)) { depth--; e++; if (!depth) { e++; break; } } }
      k = e;
    }
    return out;
  };
  const clean = stripTemplates(stripTemplates(text.replace(/<!--[\s\S]*?-->/g, ''), 'efn'), 'Efn');
  // Title as [[Office|Title]], [[Title]] or plain text, optionally closing a template (}}), then " – " and the person's link
  const pairRe = /(?:\[\[([^|\]]+)\|([^\]]+)\]\]|\[\[([^|\]]+)\]\]|([A-Z][A-Za-z' -]{2,40}?))(?:\}\})?\s*–\s*\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g;
  const slug = x => norm(x).replace(/ /g, '-');
  let country = null;
  for (const block of clean.split(/\n\|-/)) {
    const fl = /!\s*scope="row"[^|\n]*\|\s*\{\{flag\|([^}|]+)/.exec(block);
    if (fl) country = byName[norm(fl[1])] ?? null;
    else if (!/^\s*\n?\|/.test(block)) { country = null; continue; } // a heading or new table, not a sub-row
    const c = country;
    if (!c) continue;
    const cells = block.split('\n').filter(l => /^\|(?!-|\})/.test(l));
    cells.forEach((cell, idx) => {
      const combined = /^\|\s*(rowspan=\d+\s*)?colspan=2/.test(cell);
      pairRe.lastIndex = 0;
      let m;
      while ((m = pairRe.exec(cell))) {
        let title = cap1s((m[2] ?? m[3] ?? m[4]).replace(/\{\{.*?\}\}/g, '').trim()).replace(/^Co-presidents$/i, 'Co-President');
        const slugTitle = title;
        // Some rows name the ruling body instead of a job ("People's Party", "National Council for the Safeguard
        // of the Homeland", "Houthis"): ask for the country's leader and keep the body as a note.
        let body = null;
        if (/\b(Movement|Party|Dream|Council|Army|Houthis|Presidium|Junta|Committee)\b/.test(title) && !/^(President|Chairman|Chair|Chairperson|General Secretary|First Secretary|Secretary|Leader|Head)\b/.test(title)) { body = title; title = 'Leader'; }
        if (/governor-general|members|representative/i.test(title)) continue; // represents someone else; not a separate leader
        const target = m[1] ?? m[3] ?? '';
        let office;
        if (body) office = `Leader of the ${body.replace(/^the /i, '')}`;
        else if (/^(Pope)$/.test(title)) office = title;
        else if (target.toLowerCase().startsWith(title.toLowerCase() + ' of')) office = target;
        else if (/ of /.test(title)) office = title;
        else { const k = target.lastIndexOf(' of '); office = k > 0 ? `${title}${target.slice(k)}` : `${title} of ${c.name}`; }
        // "<title> of" + the country's own name ("the" is added by the app where English needs it).
        const rolePrefix = body ? `${office} in` : `${title} of`; // "Hun Sen is the Leader of the People's Party in Cambodia"
        const wiki = m[5].trim();
        const name = (m[6] ?? m[5]).replace(/\s*\(.*\)$/, '').trim();
        const id = `L-${c.id}-${slug(slugTitle)}`;
        if (leaders.some(l => l.id === id)) continue;
        leaders.push({ id, topic: 'leaders', layer: 'senate', label: office,
          name, wiki, place: c.id, placeName: c.name, office, rolePrefix, lon: c.lon, lat: c.lat, capitals: [], capitalAnswer: null,
          body, role: combined ? 'Head of state and government' : idx === 0 ? 'Head of state' : 'Head of government' });
      }
    });
  }
  // A row naming a ruling body for someone who is also listed under a real title (Libya's Presidential Council chair): keep the title.
  for (let i = leaders.length - 1; i >= 0; i--) {
    const l = leaders[i];
    if (l.topic === 'leaders' && l.body && leaders.some(o => o !== l && !o.body && o.place === l.place && o.wiki === l.wiki)) leaders.splice(i, 1);
  }
  // Photos & parties from Wikidata (via each person's Wikipedia article)
  const info = await peopleInfo(leaders.map(l => l.wiki));
  const seenFace = new Set();
  for (const l of leaders) {
    const i = info[l.wiki] ?? {};
    l.photo = commonsThumb(i.img); l.party = i.party ?? null; l.partyLong = l.party; l.wikidata = i.id ?? null;
    l.noFace = seenFace.has(l.name); seenFace.add(l.name); // e.g. Charles III heads 15 realms: one "who is this?" card
    l.facts = [l.office, l.party && cap1s(l.party)].filter(Boolean).join(' · ');
    delete l.role; delete l.body;
  }
  const missing = list.filter(c => !leaders.some(l => l.place === c.id)).map(c => c.name);
  if (missing.length) console.log('  (no individual leader listed for: ' + missing.join(', ') + ')');
}

// ---- territories: overseas regions & dependencies (shapes: Natural Earth map units; facts: Wikidata) ----
console.log('Querying Wikidata for territories…');
const territories = [];
{
  const shapes = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-terr.json'), 'utf8')).objects.places.geometries.map(g => g.properties);
  const GROUP_OF_SUB = { Caribbean: 't-car', Micronesia: 't-pac', Polynesia: 't-pac', Melanesia: 't-pac', 'Australia and New Zealand': 't-pac',
    'Northern Europe': 't-atl', 'Southern Europe': 't-atl', 'Northern America': 't-atl', 'South America': 't-atl', 'Western Africa': 't-atl',
    'Eastern Africa': 't-ind', 'South-Eastern Asia': 't-ind' };
  const GROUP_OVERRIDE = { Q35086: 't-atl', Q43448: 't-ind', Q129003: 't-ind' }; // the "open ocean" ones
  const sovOf = n => [...countries.values()].find(c => norm(c.name) === norm(n) || norm(c.officialName) === norm(n) || (n === 'United States of America' && c.iso3 === 'USA'));
  const ids = shapes.map(x => x.id);
  const facts = await fetchPlaces(ids, 'terr', id => ({ capitals: [] }));
  for (const b of await sparql(CAPITAL_Q.replace('%IDS%', ids.map(q => `wd:${q}`).join(' ')))) {
    const t = facts.get(qid(v(b, 'c')));
    const capId = qid(v(b, 'cap'));
    if (!t || t.capitals.some(x => x.id === capId)) continue;
    t.capitals.push({ id: capId, name: v(b, 'capLabel'), preferred: v(b, 'rank').endsWith('PreferredRank'), role: null,
      image: file(v(b, 'capImg')) || null, ...point(v(b, 'capCoord')), wiki: v(b, 'capArticle') ? decodeURIComponent(v(b, 'capArticle').split('/wiki/')[1]) : null });
  }
  // What kind of territory it is: "overseas region of France", "British Overseas Territory", …
  const status = {};
  for (const b of await sparql(`SELECT ?p ?tLabel WHERE { VALUES ?p { ${ids.map(q => `wd:${q}`).join(' ')} } ?p wdt:P31 ?t . ?t rdfs:label ?tLabel FILTER(lang(?tLabel) = "en") }`)) {
    const l = v(b, 'tLabel');
    if (/overseas|territory|dependenc|constituent|autonomous|collectivit|department|crown|commonwealth|unincorporated|special|region of|country of/i.test(l)) (status[qid(v(b, 'p'))] ??= []).push(l);
  }
  for (const sh of shapes) {
    const t = facts.get(sh.id);
    const sov = sovOf(sh.sov);
    if (!t || !sov) { warnings.push(`Territory ${sh.id} (${sh.sov}): missing facts or sovereign`); continue; }
    const pref = t.capitals.filter(x => x.preferred);
    t.capitals = (pref.length ? pref : t.capitals).sort((a, b) => a.name.localeCompare(b.name)); // a fixed order, so nightly runs don't report a change
    t.capitalAnswer = t.capitals.map(x => x.name).reduce(andJoin, '') || null;
    const st = (status[sh.id] ?? []).sort((a, b) => a.length - b.length)[0] ?? null;
    territories.push({ ...t, group: GROUP_OVERRIDE[sh.id] ?? GROUP_OF_SUB[sh.sub] ?? 't-atl', sovereign: sov.id, sovereignName: sov.name,
      terrStatus: st, facts: [st ? st.charAt(0).toUpperCase() + st.slice(1) : null, `Part of ${sov.name}`].filter(Boolean).join(' · ') });
  }
  territories.sort((a, b) => a.name.localeCompare(b.name));
}

// ---- UNESCO World Heritage Sites (Wikidata: heritage designation = World Heritage Site, with the UNESCO id) ----
// Fame tier = how many Wikipedia language editions have an article (sitelinks): the 50 most famous are
// "Icons"; then the 40 best-known per continent. Sites removed from the list (no end date check) drop out.
console.log('Querying Wikidata for World Heritage Sites…');
const sites = [];
{
  const rows = await sparql(`SELECT ?s ?sLabel ?whs ?links ?country ?coord ?img ?article WHERE {
    ?s p:P1435 ?h . ?h ps:P1435 wd:Q9259 . FILTER NOT EXISTS { ?h pq:P582 [] }
    ?s wdt:P757 ?whs ; wikibase:sitelinks ?links .
    OPTIONAL { ?s wdt:P17 ?country } OPTIONAL { ?s wdt:P625 ?coord } OPTIONAL { ?s wdt:P18 ?img }
    OPTIONAL { ?article schema:about ?s ; schema:isPartOf <https://en.wikipedia.org/> }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`);
  // Several items can share one listing (extensions "bis", components); keep the best-known item per listing.
  const byListing = {};
  for (const b of rows) {
    const base = v(b, 'whs').replace(/(bis|ter|rev|quater)+$/i, '');
    const links = +v(b, 'links');
    const cur = byListing[base];
    if (!cur || links > cur.links || (links === cur.links && !cur.coord)) {
      byListing[base] = { id: qid(v(b, 's')), name: v(b, 'sLabel'), whs: base, links, coord: v(b, 'coord') ?? cur?.coord, img: file(v(b, 'img')) || null,
        wiki: v(b, 'article') ? decodeURIComponent(v(b, 'article').split('/wiki/')[1]) : null, countries: new Set(cur?.id === qid(v(b, 's')) ? cur.countries : []) };
    }
    const keep = byListing[base];
    if (keep.id === qid(v(b, 's')) && v(b, 'country')) keep.countries.add(qid(v(b, 'country')));
    if (keep.id === qid(v(b, 's')) && !keep.img) keep.img = file(v(b, 'img')) || null;
  }
  const all = Object.values(byListing).filter(x => x.coord && !/^Q\d+$/.test(x.name)).map(x => ({ ...x, ...point(x.coord), countries: [...x.countries].filter(c => countries.has(c)) }))
    .filter(x => x.countries.length).sort((a, b) => b.links - a.links)
    .filter((x, i, arr) => arr.findIndex(y => y.id === x.id || y.name === x.name) === i); // one item can hold two listings (Drottningholm); two items one name (Kakadu)
  const perCont = {};
  all.forEach((x, i) => {
    const region = mainRegion(x.countries, x.lon);
    let group;
    if (i < 50) group = 'u-icons';
    else {
      group = `u-${({ Europe: 'eu', Asia: 'as', Africa: 'af', Americas: 'am', Oceania: 'oc' })[region] ?? 'as'}`;
      if ((perCont[group] = (perCont[group] ?? 0) + 1) > 40) return;
    }
    const where = x.countries.map(c => countries.get(c).name);
    sites.push({ id: x.id, layer: 'site', name: x.name, group, lon: x.lon, lat: x.lat, image: x.img, wiki: x.wiki, whsId: x.whs,
      country: x.countries[0], countryName: where.reduce(andJoin, ''), capitals: [], capitalAnswer: null,
      facts: [`UNESCO World Heritage Site #${x.whs}`, where.join(', ')].join(' · ') });
  });
}

// ---- mountains: peaks (Natural Earth elevation points + a few famous extras) and ranges (Natural Earth) ----
// Fame = Wikipedia language editions (sitelinks): the 40 best-known peaks are "Famous peaks"; then the
// best-known 25 per continent. Ranges: the major ones (Natural Earth rank 1–2) first, then the rest.
console.log('Querying Wikidata for mountains…');
const peaks = [], mranges = [];
{
  const ne = JSON.parse(readFileSync(join(ROOT, 'data/peaks-ne.json'), 'utf8'));
  const extraTitles = JSON.parse(readFileSync(join(ROOT, 'data/peaks-extra.json'), 'utf8')).peaks;
  // Wikipedia title → Wikidata id (follows redirects)
  const extraIds = [];
  let lookupFailed = false;
  for (let i = 0; i < extraTitles.length; i += 50) {
    const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(extraTitles.slice(i, i + 50).join('|'))}`;
    let ok = false;
    for (let attempt = 1; attempt <= 6 && !ok; attempt++) {
      try { const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json(); for (const pg of Object.values(j.query.pages)) if (pg.pageprops?.wikibase_item) extraIds.push(pg.pageprops.wikibase_item); ok = true; }
      catch { await new Promise(res => setTimeout(res, 15000 * attempt)); }
    }
    if (!ok) lookupFailed = true;
  }
  // If Wikipedia couldn't be reached for some titles, keep last run's peaks as candidates rather than dropping them.
  if (lookupFailed) {
    console.warn('  peak title lookup failed for some titles; keeping last run\'s peaks');
    try { for (const pk of JSON.parse(readFileSync(join(ROOT, 'public/data/peaks.json'), 'utf8')).places) extraIds.push(pk.id); } catch { /* none */ }
  }
  const prevPeaks = new Set();
  try { for (const pk of JSON.parse(readFileSync(join(ROOT, 'public/data/peaks.json'), 'utf8')).places) prevPeaks.add(pk.id); } catch { /* first run */ }
  const neById = Object.fromEntries(ne.map(p => [p.id, p]));
  const ids = [...new Set([...ne.map(p => p.id), ...extraIds])];
  const info = {};
  for (let i = 0; i < ids.length; i += 150) {
    for (const b of await sparql(`SELECT ?m ?mLabel ?links ?elev ?coord ?country ?img ?article ?rangeLabel WHERE {
        VALUES ?m { ${ids.slice(i, i + 150).map(x => `wd:${x}`).join(' ')} } ?m wikibase:sitelinks ?links .
        OPTIONAL { ?m p:P2044 ?es . ?es a wikibase:BestRank ; psn:P2044/wikibase:quantityAmount ?elev } OPTIONAL { ?m wdt:P625 ?coord } OPTIONAL { ?m wdt:P17 ?country } OPTIONAL { ?m wdt:P18 ?img }
        OPTIONAL { ?m wdt:P4552 ?range . ?range rdfs:label ?rangeLabel FILTER(lang(?rangeLabel) = "en") }
        OPTIONAL { ?article schema:about ?m ; schema:isPartOf <https://en.wikipedia.org/> }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`)) {
      const id = qid(v(b, 'm'));
      const o = (info[id] ??= { id, name: v(b, 'mLabel'), links: +v(b, 'links'), elev: null, coord: null, countries: [], img: null, wiki: null, range: null });
      o.elev = Math.max(o.elev ?? 0, +(v(b, 'elev') ?? 0)) || null; o.coord ??= v(b, 'coord') ?? null; o.img ??= file(v(b, 'img')) || null;
      o.wiki ??= v(b, 'article') ? decodeURIComponent(v(b, 'article').split('/wiki/')[1]) : null; o.range ??= v(b, 'rangeLabel') ?? null;
      if (v(b, 'country') && !o.countries.includes(qid(v(b, 'country')))) o.countries.push(qid(v(b, 'country')));
    }
  }
  const all = Object.values(info).map(o => {
    const n = neById[o.id];
    const pt = o.coord ? point(o.coord) : n ? { lon: +n.lon.toFixed(3), lat: +n.lat.toFixed(3) } : {};
    return { ...o, ...pt, elev: o.elev ?? n?.elevation ?? null, countries: o.countries.filter(c => countries.has(c)) };
  }).filter(o => o.lon != null && o.elev && !/^Q\d+$/.test(o.name) && o.countries.length)
    // Rank by Wikipedia coverage; last run's peaks get a small head start so borderline ones don't come and go nightly.
    .sort((a, b) => (b.links + (prevPeaks.has(b.id) ? 3 : 0)) - (a.links + (prevPeaks.has(a.id) ? 3 : 0)) || a.id.localeCompare(b.id));
  const perCont = {};
  all.forEach((o, i) => {
    let group;
    if (i < 40) group = 'm-icons';
    else {
      group = `m-${({ Europe: 'eu', Asia: 'as', Africa: 'af', Americas: 'am', Oceania: 'oc' })[mainRegion(o.countries, o.lon)] ?? 'as'}`;
      if ((perCont[group] = (perCont[group] ?? 0) + 1) > 25) return;
    }
    const where = o.countries.map(c => countries.get(c).name);
    peaks.push({ id: o.id, layer: 'peak', name: o.name, group, lon: o.lon, lat: o.lat, image: o.img, wiki: o.wiki, elevation: Math.round(o.elev),
      country: o.countries[0], countryName: where.reduce(andJoin, ''), capitals: [], capitalAnswer: null,
      facts: [`${Math.round(o.elev).toLocaleString('en-US')} m`, o.range, where.join(', ')].filter(Boolean).join(' · ') });
  });

  // Ranges
  const rshapes = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-range.json'), 'utf8')).objects.places.geometries.map(g => g.properties);
  const rankOf = Object.fromEntries(rshapes.map(r => [r.id, r.rank]));
  const rinfo = await fetchPlaces(rshapes.map(r => r.id), 'range', () => ({}));
  const rlinks = {}, rcountries = {};
  for (const b of await sparql(`SELECT ?m ?links ?country WHERE { VALUES ?m { ${rshapes.map(r => `wd:${r.id}`).join(' ')} } ?m wikibase:sitelinks ?links . OPTIONAL { ?m wdt:P17 ?country } }`)) {
    rlinks[qid(v(b, 'm'))] = +v(b, 'links');
    if (v(b, 'country')) (rcountries[qid(v(b, 'm'))] ??= new Set()).add(qid(v(b, 'country')));
  }
  [...rinfo.values()].filter(r => !/^Q\d+$/.test(r.name)).sort((a, b) => (rankOf[a.id] - rankOf[b.id]) || (rlinks[b.id] ?? 0) - (rlinks[a.id] ?? 0)).forEach((r, i) => {
    if (i >= 70) return;
    // Wikidata sometimes lists a far-off owner (France for the Appalachians, via Saint-Pierre and Miquelon):
    // drop a lone country from another continent when 2+ countries agree on where the range is.
    let rc = [...(rcountries[r.id] ?? [])];
    const regOf = c => regionOfCountry[c] ?? null;
    const main = mainRegion(rc);
    if (rc.filter(c => regOf(c) === main).length >= 2) rc = rc.filter(c => regOf(c) === main || TRANSCONTINENTAL.has(c) || rc.filter(d => regOf(d) === regOf(c)).length > 1);
    const where = rc.map(c => countries.get(c)?.name).filter(Boolean);
    mranges.push({ ...r, group: rankOf[r.id] <= 2 && i < 30 ? 'm-ranges' : 'm-ranges2', nameThe: /^(the )?/i.test(r.name) ? `the ${r.name}` : r.name,
      facts: where.length ? where.slice(0, 5).join(', ') + (where.length > 5 ? '…' : '') : null, capitals: [], capitalAnswer: null });
  });
}

// Two ranges called Sierra Nevada (Spain, US): add the country so "name it" has one answer.
for (const arr of [mranges, peaks]) {
  const count = {}; for (const x of arr) count[x.name] = (count[x.name] ?? 0) + 1;
  for (const x of arr) if (count[x.name] > 1) {
    const where = x.countryName ?? (x.facts ?? '').split(/, |…/)[0];
    if (where) { x.name = `${x.name} (${where})`; if (x.nameThe) x.nameThe = `the ${x.name}`; }
  }
}

// ---- highest point of each country (Wikidata P610) ----
console.log('Querying Wikidata for highest points…');
{
  const rows = await sparql(`SELECT ?c ?hp ?hpLabel ?rank ?elev ?coord ?img ?article WHERE {
    VALUES ?c { ${list.map(c => `wd:${c.id}`).join(' ')} }
    ?c p:P610 ?s . ?s ps:P610 ?hp ; wikibase:rank ?rank . FILTER(?rank != wikibase:DeprecatedRank)
    OPTIONAL { ?hp p:P2044 ?es . ?es a wikibase:BestRank ; psn:P2044/wikibase:quantityAmount ?elev } OPTIONAL { ?hp wdt:P625 ?coord } OPTIONAL { ?hp wdt:P18 ?img }  # psn = converted to metres
    OPTIONAL { ?article schema:about ?hp ; schema:isPartOf <https://en.wikipedia.org/> }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
  const prevHighest = {};
  try { for (const pc of JSON.parse(readFileSync(OUT, 'utf8')).countries) if (pc.highest) prevHighest[pc.id] = pc.highest.id; } catch { /* first run */ }
  const best = {};
  for (const b of rows) {
    const c = qid(v(b, 'c'));
    const cand = { id: qid(v(b, 'hp')), name: v(b, 'hpLabel'), elevation: Math.round(+(v(b, 'elev') ?? 0)) || null, ...point(v(b, 'coord')),
      image: file(v(b, 'img')) || null, wiki: v(b, 'article') ? decodeURIComponent(v(b, 'article').split('/wiki/')[1]) : null,
      preferred: v(b, 'rank').endsWith('PreferredRank') };
    const cur = best[c];
    // Same rank and height (Colombia's two 5,730 m peaks): keep last run's choice so it doesn't flip nightly.
    const tieWin = cur && cand.preferred === cur.preferred && (cand.elevation ?? 0) === (cur.elevation ?? 0) && cand.id !== cur.id && prevHighest[c] === cand.id;
    if (!cur || tieWin || (cand.preferred && !cur.preferred) || (cand.preferred === cur.preferred && (cand.elevation ?? 0) > (cur.elevation ?? 0))) best[c] = { ...cand, image: cand.image ?? cur?.image ?? null };
  }
  for (const c of list) {
    const h = best[c.id];
    if (!h || /^Q\d+$/.test(h.name) || h.lon == null) { delete c.highest; continue; }
    const { preferred, ...rest } = h;
    c.highest = { ...rest, note: overrides[c.id]?.highestNote ?? null }; // e.g. Australia's is on remote Heard Island
  }
}

// ---- election results: who takes over in January (Wikipedia race-summary tables) ----
// Rows like:  ! [[… election in Alaska|Alaska]]  | {{sortname|Dan|Sullivan}}  …  {{aye}} '''[[Mary Peltola]]''' (Democratic)
function raceRows(text) {
  const rows = [];
  for (const row of (text ?? '').split(/\n\|-/)) {
    const st = /^\s*!\s*\[\[[^|\]]*\|([^\]]+)\]\]/m.exec(row);
    const aye = row.split('\n').find(l => l.includes('{{aye}}'));
    if (!st || !aye) continue;
    const inc = /\{\{sortname\|([^|}]+)\|([^|}]+)/.exec(row);
    const link = /'''\[\[([^|\]]+)(?:\|([^\]]+))?\]\]'''/.exec(aye);
    const plain = /'''([^'[\]]+)'''/.exec(aye);
    const name = link ? (link[2] ?? link[1]) : plain?.[1];
    const party = /\(([^)]+)\)/.exec(aye.split("'''").pop() ?? '')?.[1] ?? null;
    if (!name) continue;
    rows.push({ state: st[1].replace(/\s*\(.*\)$/, '').trim(), incLast: inc?.[2] ?? null,
      winner: name.replace(/\s*\(.*\)$/, ''), wiki: link ? link[1] : null, party: /^(Democratic|DFL)$/.test(party ?? '') ? 'Democrat' : party });
  }
  return rows;
}
const ELECTION_YEAR = 2026, TAKES_OFFICE = '2027-01-03';
if (new Date().toISOString().slice(0, 10) < '2027-02-15') { // after that the new officeholders are in the main data anyway
  console.log('Reading election results from Wikipedia…');
  const stateCodeByName = Object.fromEntries([...states.values()].map(st => [st.name, st.code]));
  // If Wikipedia doesn't answer (rate limits), keep last run's results instead of wiping the "incoming" strips.
  const prevIncoming = {};
  try { for (const x of JSON.parse(readFileSync(join(ROOT, 'public/data/senate.json'), 'utf8')).places) if (x.incoming) prevIncoming[x.id] = x.incoming; } catch { /* first run */ }
  const senRows = raceRows(await wikitext(`${ELECTION_YEAR} United States Senate elections`));
  const govRows = raceRows(await wikitext(`${ELECTION_YEAR} United States gubernatorial elections`));
  if (!senRows.length) { warnings.push('Senate election results could not be read; kept last run\'s'); for (const x of senate) if (prevIncoming[x.id] && norm(prevIncoming[x.id].name) !== norm(x.name)) x.incoming = prevIncoming[x.id]; }
  if (!govRows.length) { warnings.push('Governor election results could not be read; kept last run\'s'); for (const x of governors) if (prevIncoming[x.id] && norm(prevIncoming[x.id].name) !== norm(x.name)) x.incoming = prevIncoming[x.id]; }
  for (const r of senRows) {
    const code = stateCodeByName[r.state];
    const seats = senate.filter(x => x.id.startsWith(`S-${code}-`));
    const seat = seats.find(x => r.incLast && norm(x.name).endsWith(norm(r.incLast))) ?? seats.find(x => x.termEnd === TAKES_OFFICE);
    if (!seat || norm(seat.name) === norm(r.winner)) continue; // re-elected or already sworn in
    seat.incoming = { name: r.winner, party: r.party, wiki: r.wiki, from: 'January 2027' };
  }
  for (const r of govRows) {
    const seat = governors.find(x => x.placeName === r.state);
    if (!seat || norm(seat.name) === norm(r.winner)) continue;
    seat.incoming = { name: r.winner, party: r.party, wiki: r.wiki, from: 'January 2027' };
  }
  console.log(`  ${senate.filter(x => x.incoming).length} Senate seats and ${governors.filter(x => x.incoming).length} governorships change hands`);
}

// ---- currencies (Wikidata P38) ----
console.log('Querying Wikidata for currencies…');
{
  const rows = await sparql(`SELECT ?c ?cur ?curLabel ?code ?rank ?article (SAMPLE(?sym) AS ?symbol) (SAMPLE(?cc) AS ?local) WHERE {
    VALUES ?c { ${list.map(c => `wd:${c.id}`).join(' ')} }
    ?c p:P38 ?s . ?s ps:P38 ?cur ; wikibase:rank ?rank . FILTER(?rank != wikibase:DeprecatedRank) FILTER NOT EXISTS { ?s pq:P582 [] }
    FILTER NOT EXISTS { ?cur wdt:P576 [] } FILTER NOT EXISTS { ?cur wdt:P582 [] }
    OPTIONAL { ?cur wdt:P17 ?cc FILTER(?cc = ?c) }
    OPTIONAL { ?cur wdt:P498 ?code } OPTIONAL { ?cur wdt:P5061 ?sym }
    OPTIONAL { ?article schema:about ?cur ; schema:isPartOf <https://en.wikipedia.org/> }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  } GROUP BY ?c ?cur ?curLabel ?code ?rank ?article`);
  const by = {};
  for (const b of rows) {
    const wiki = v(b, 'article') ? decodeURIComponent(v(b, 'article').split('/wiki/')[1]) : null;
    (by[qid(v(b, 'c'))] ??= []).push({ id: qid(v(b, 'cur')), name: wiki ? wiki.replace(/_/g, ' ').replace(/ \(.*\)$/, '') : v(b, 'curLabel'), code: v(b, 'code') ?? null, symbol: v(b, 'symbol') ?? null,
      preferred: v(b, 'rank').endsWith('PreferredRank'), local: !!v(b, 'local'), wiki });
  }
  const users = {};
  for (const c of list) {
    const all = by[c.id] ?? [];
    // Preferred statements first; otherwise the country's own currency; otherwise up to two listed ones.
    const pref = all.filter(x => x.preferred), local = all.filter(x => x.local);
    const cur = (pref.length ? pref : local.length ? local : all.slice(0, 2)).filter((x, i, a) => a.findIndex(y => y.id === x.id) === i);
    if (!cur.length) { delete c.currency; continue; }
    const only = overrides[c.id]?.currencyCodes;
    c.currency = cur.filter(x => !only || only.includes(x.code)).map(({ preferred, local: _l, ...x }) => x);
    for (const x of cur) (users[x.id] ??= []).push(c.id);
  }
  for (const c of list) if (c.currency) for (const x of c.currency) x.shared = users[x.id].length;
  // A picture of the money itself: the currency infobox's images, banknotes before coins.
  const curTitles = [...new Set(list.flatMap(c => c.currency ?? []).map(x => x.wiki).filter(Boolean))];
  const curImg = {};
  const prevCurImg = {};
  try { for (const pc of JSON.parse(readFileSync(OUT, 'utf8')).countries) for (const x of pc.currency ?? []) if (x.image) prevCurImg[x.id] = x.image; } catch { /* first run */ }
  for (let i = 0; i < curTitles.length; i += 40) {
    if (i) await new Promise(res => setTimeout(res, 1500)); // be gentle: Wikipedia rate-limits bursts
    const batch = curTitles.slice(i, i + 40);
    for (let attempt = 1; attempt <= 6; attempt++) {
      try {
        const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=revisions&rvprop=content&rvslots=main&rvsection=0&titles=${encodeURIComponent(batch.join('|'))}`, { headers: { 'User-Agent': UA } });
        const j = JSON.parse(await r.text());
        const back = {}; for (const m of [...(j.query.normalized ?? []), ...(j.query.redirects ?? [])]) back[m.to] = back[m.from] ?? m.from;
        for (const pg of Object.values(j.query.pages)) {
          const t = pg.revisions?.[0]?.slots?.main?.['*'] ?? '';
          const field = n => (t.match(new RegExp(`\\|\\s*${n}\\s*=\\s*([^\\n|]*)`)) ?? [])[1]?.trim().replace(/^\[\[/, '').replace(/^(File|Image):/i, '').replace(/\]\]$/, '');
          const imgs = [1, 2, 3].map(n => ({ file: field('image_' + n), title: field('image_title_' + n) ?? '' })).filter(x => x.file && /\.(png|jpe?g|svg|webp|gif|tiff?)$/i.test(x.file));
          if (!imgs.length && field('image')) imgs.push({ file: field('image').replace(/^(File|Image):/i, ''), title: '' });
          const isNote = x => /bank ?note|\bnotes?\b|\bbills?\b|paper/i.test(x.file + ' ' + x.title) && !/coin/i.test(x.file + ' ' + x.title);
          const ranked = [...imgs.filter(isNote), ...imgs.filter(x => !isNote(x) && !/coin/i.test(x.file + ' ' + x.title)), ...imgs.filter(x => /coin/i.test(x.file + ' ' + x.title))];
          let title = pg.title; while (back[title]) title = back[title];
          if (ranked.length) curImg[title.replace(/ /g, '_')] = ranked.map(x => x.file);
        }
        break;
      } catch { await new Promise(res => setTimeout(res, 15000 * attempt)); }
    }
  }
  // No usable infobox picture? Look through the article's other images for a banknote (then a coin).
  const noPic = curTitles.filter(t => !curImg[t.replace(/ /g, '_')]?.length);
  for (let i = 0; i < noPic.length; i += 20) {
    await new Promise(res => setTimeout(res, 1500));
    for (let attempt = 1; attempt <= 6; attempt++) {
      try {
        const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=images&imlimit=max&titles=${encodeURIComponent(noPic.slice(i, i + 20).join('|'))}`, { headers: { 'User-Agent': UA } });
        const j = JSON.parse(await r.text());
        const back = {}; for (const m of [...(j.query.normalized ?? []), ...(j.query.redirects ?? [])]) back[m.to] = back[m.from] ?? m.from;
        for (const pg of Object.values(j.query.pages)) {
          // Only files named after this currency ("naira", "Nigerian…"): shared boxes put e.g. a US penny on many pages.
          const plain = x => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
          const keys = plain(pg.title).split(/[^a-z]+/).filter(w => w.length >= 4 && !/^(dollars?|pounds?|francs?|dinars?|pesos?|rupees?|shillings?|riyals?|rials?|dirhams?|liras?|reals?|rubles?|roubles?|kronas?|krones?|korunas?|centavos?|coins?|sovereign|new|united|states)$/.test(w)).map(w => w.slice(0, 5));
          const names = (pg.images ?? []).map(x => x.title.replace(/^File:/, '')).filter(f => /\.(png|jpe?g|webp)$/i.test(f) && !/flag|map|logo|symbol|sign|icon|graph|chart|exchange/i.test(f) && keys.some(k => plain(f).includes(k)));
          const notes = names.filter(f => /bank ?note|\bnotes?\b|obverse|front|\d+[ _-]?[a-z]*[ _-]?(note|bill)/i.test(f) && !/coin/i.test(f));
          const coins = names.filter(f => /coin/i.test(f));
          let title = pg.title; while (back[title]) title = back[title];
          if (notes.length || coins.length) curImg[title.replace(/ /g, '_')] = [...notes, ...coins];
        }
        break;
      } catch { await new Promise(res => setTimeout(res, 15000 * attempt)); }
    }
  }
  // Check every candidate exists. Banknotes are often copyrighted, so many live on English Wikipedia
  // ("local", fair use) rather than Wikimedia Commons; those are stored as "en:<file>" for the app.
  const files = [...new Set(Object.values(curImg).flat())];
  const where = {};
  for (let i = 0; i < files.length; i += 45) {
    if (i) await new Promise(res => setTimeout(res, 1500));
    for (let attempt = 1; attempt <= 6; attempt++) {
      try {
        const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&titles=${encodeURIComponent(files.slice(i, i + 45).map(f => 'File:' + f).join('|'))}`, { headers: { 'User-Agent': UA } });
        const j = JSON.parse(await r.text());
        const back = {}; for (const m of j.query.normalized ?? []) back[m.to] = m.from;
        for (const pg of Object.values(j.query.pages)) {
          const asked = (back[pg.title] ?? pg.title).replace(/^File:/, '');
          where[asked] = pg.missing !== undefined && pg.imagerepository !== 'shared' ? null : pg.imagerepository === 'local' ? 'local' : 'commons';
        }
        break;
      } catch { await new Promise(res => setTimeout(res, 15000 * attempt)); }
    }
  }
  for (const c of list) for (const x of c.currency ?? []) {
    const cands = curImg[x.wiki?.replace(/ /g, '_')];
    const f = (cands ?? []).find(f => where[f]);
    // If Wikipedia couldn't be asked this time (rate limits), keep last run's picture rather than dropping it.
    const unchecked = !cands || cands.some(f => where[f] === undefined);
    x.image = f ? (where[f] === 'local' ? 'en:' : '') + f.replace(/_/g, ' ') : unchecked ? prevCurImg[x.id] ?? null : null;
  }
  const missing = files.filter(f => where[f] === null);
  if (missing.length) console.log(`  ${missing.length} currency images named in infoboxes don't exist: ${missing.slice(0, 5).join(', ')}`);
  console.log(`  money pictures for ${list.flatMap(c => c.currency ?? []).filter((x, i, a) => x.image && a.findIndex(y => y.id === x.id) === i).length}/${curTitles.length} currencies`);
}

// ---- largest city (GeoNames cities of 15,000+, linked to Wikidata via the GeoNames id) ----
console.log('Downloading GeoNames cities…');
{
  const zip = new Uint8Array(await (await fetch('https://download.geonames.org/export/dump/cities15000.zip')).arrayBuffer());
  const txt = strFromU8(unzipSync(zip)['cities15000.txt']);
  // GeoNames gives candidates; Wikidata's latest official population decides between the top few
  // (GeoNames figures can be stale — it once had Rotterdam bigger than Amsterdam).
  const cands = {};
  for (const line of txt.split('\n')) {
    const f = line.split('\t');
    if (f.length < 15 || f[6] !== 'P' || f[7] === 'PPLX') continue; // PPLX = a section of a city (neighbourhood)
    (cands[f[8]] ??= []).push({ gid: f[0], name: f[1], pop: +f[14], lat: +f[4], lon: +f[5], capital: f[7] === 'PPLC' });
  }
  for (const cc in cands) cands[cc] = cands[cc].sort((a, b) => b.pop - a.pop).slice(0, 4);
  const ccOf = c => c.iso2 ?? { Q1246: 'XK' }[c.id];
  const gids = [...new Set(list.flatMap(c => (cands[ccOf(c)] ?? []).map(t => t.gid)))];
  const wd = {};
  for (let i = 0; i < gids.length; i += 150) {
    for (const b of await sparql(`SELECT ?g ?item ?itemLabel ?img ?article ?pop WHERE { VALUES ?g { ${gids.slice(i, i + 150).map(g => `"${g}"`).join(' ')} } ?item wdt:P1566 ?g .
      ?item wdt:P31/wdt:P279* wd:Q486972 .  # a human settlement (not a building that shares the id)
      FILTER NOT EXISTS { ?item wdt:P31 wd:Q123705 }  # …and not a neighbourhood
      OPTIONAL { ?item wdt:P1082 ?pop }
      OPTIONAL { ?item wdt:P18 ?img } OPTIONAL { ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`)) {
      const g = v(b, 'g'), pop = +(v(b, 'pop') ?? 0);
      if (!wd[g] || pop > wd[g].pop) wd[g] = { id: qid(v(b, 'item')), name: v(b, 'itemLabel'), pop, image: file(v(b, 'img')) || wd[g]?.image || null, wiki: v(b, 'article') ? decodeURIComponent(v(b, 'article').split('/wiki/')[1]) : null };
    }
  }
  for (const c of list) {
    const cs = cands[ccOf(c)];
    if (!cs?.length) { delete c.largestCity; continue; }
    const popOf = t => wd[t.gid]?.pop || t.pop;
    // data/overrides.json can name the city when GeoNames lists a neighbourhood as a separate place (Guinea: Camayenne → Conakry)
    const forced = overrides[c.id]?.largestCity;
    const t = (forced && cs.find(x => norm(wd[x.gid]?.name ?? x.name) === norm(forced))) || [...cs].sort((a, b) => popOf(b) - popOf(a))[0];
    if (forced && norm(wd[t.gid]?.name ?? t.name) !== norm(forced)) warnings.push(`${c.name}: largest-city override "${forced}" not among the candidates`);
    t.pop = popOf(t);
    const w = wd[t.gid];
    const name = w?.name && !/^Q\d+$/.test(w.name) ? w.name : t.name;
    c.largestCity = { name, population: t.pop, lat: t.lat, lon: t.lon, image: w?.image ?? null, wiki: w?.wiki ?? null, id: w?.id ?? null,
      isCapital: t.capital || c.capitals.some(k => (w?.id && k.id === w.id) || norm(k.name) === norm(name)) };
  }
}

// ---- pronunciation recordings (Wikidata P443, mostly native speakers via Lingua Libre) ----
// Stored as { languageCode: [mp3 transcode, original] }; the app falls back to the
// device's own text-to-speech voice when there's no recording.
const commonsPath = f => { const n = f.replace(/ /g, '_'); const h = createHash('md5').update(n).digest('hex'); return { n, a: h[0], ab: h.slice(0, 2) }; };
const audioUrls = f => {
  const { n, a, ab } = commonsPath(f);
  const orig = `https://upload.wikimedia.org/wikipedia/commons/${a}/${ab}/${encodeURIComponent(n)}`;
  return /\.mp3$/i.test(n) ? [orig] : [`https://upload.wikimedia.org/wikipedia/commons/transcoded/${a}/${ab}/${encodeURIComponent(n)}/${encodeURIComponent(n)}.mp3`, orig];
};
async function attachAudio(items) {
  const byId = new Map(items.map(x => [x.id, x]));
  const ids = [...byId.keys()];
  for (let i = 0; i < ids.length; i += 250) {
    const rows = await sparql(`SELECT ?p ?a ?code WHERE { VALUES ?p { ${ids.slice(i, i + 250).map(q => `wd:${q}`).join(' ')} }
      ?p p:P443 ?s . ?s ps:P443 ?a . OPTIONAL { ?s pq:P407 ?l . ?l wdt:P424 ?code } }`);
    for (const b of rows) {
      const it = byId.get(qid(v(b, 'p')));
      const code = (v(b, 'code') || 'und').toLowerCase();
      (it.audio ??= {})[code] ??= audioUrls(file(v(b, 'a')));
    }
  }
}
// ---- local names for largest cities, peaks and World Heritage Sites (labels in the country's own languages) ----
console.log('Querying Wikidata for local names of cities, peaks and sites…');
{
  const jobs = [];
  for (const c of countries.values()) if (c.largestCity?.id && !c.largestCity.isCapital) jobs.push({ target: c.largestCity, id: c.largestCity.id, country: c });
  for (const x of [...sites, ...peaks]) { const c = countries.get(x.country); if (c) jobs.push({ target: x, id: x.id, country: c }); }
  const labels = {};
  const want = [...new Set(jobs.flatMap(j => j.country.native.map(n => n.code)).filter(Boolean))];
  for (let i = 0; i < jobs.length; i += 200)
    for (const b of await sparql(`SELECT ?c ?l WHERE { VALUES ?c { ${jobs.slice(i, i + 200).map(j => `wd:${j.id}`).join(' ')} } ?c rdfs:label ?l FILTER(lang(?l) IN (${want.map(x => `"${x}"`).join(',')})) }`))
      (labels[qid(v(b, 'c'))] ??= {})[b.l['xml:lang']] = v(b, 'l');
  for (const j of jobs) {
    const out = [];
    for (const n of j.country.native) {
      let l = labels[j.id]?.[n.code];
      if (l && /^(zh|ja)/.test(n.code ?? '') && l.length > 2) l = l.replace(/[市都]$/, ''); // 上海市 → 上海
      if (l && l.toLowerCase() !== j.target.name.toLowerCase() && !out.some(o => o.name === l)) out.push({ name: l, lang: n.lang, code: n.code });
    }
    if (out.length) j.target.native = out.slice(0, 2);
  }
}

// Mountain ranges (the languages of the countries they cross) and territories (their own official languages).
{
  const { addLocalNames, officialLanguages, rangeLangs } = await import('./lib/local-names.mjs');
  const byName = new Map([...countries.values()].map(c => [c.name, c]));
  await addLocalNames(mranges, r => rangeLangs(r, byName), sparql);
  const tl = await officialLanguages(territories.map(t => t.id), sparql);
  await addLocalNames(territories, t => tl.get(t.id) ?? [], sparql);
}

console.log('Querying Wikidata for pronunciations…');
await attachAudio([...countries.values(), ...[...countries.values()].flatMap(c => c.capitals), ...cn.values(), ...[...cn.values()].flatMap(p => p.capitals), ...rivers, ...lakes,
  ...[...countries.values()].map(c => c.largestCity).filter(x => x?.id && x.native), ...sites.filter(x => x.native), ...peaks.filter(x => x.native)]);
// Keep only the languages the app shows (the local-language names, Mandarin for China).
const base = code => code.split('-')[0];
const keep = (item, codes) => {
  if (!item.audio) return;
  const want = new Set(codes.map(base));
  const kept = Object.fromEntries(Object.entries(item.audio).filter(([k]) => want.has(base(k))));
  if (Object.keys(kept).length) item.audio = kept; else delete item.audio;
};
for (const c of countries.values()) {
  keep(c, c.native.map(n => n.code).filter(Boolean));
  for (const cap of c.capitals) keep(cap, (cap.native ?? []).map(n => n.code).filter(Boolean));
}
for (const p of cn.values()) { keep(p, ['zh']); for (const cap of p.capitals) keep(cap, ['zh']); }
for (const p of [...rivers, ...lakes]) keep(p, [...(p.native ?? []).map(n => n.code), ...(p.zh ? ['zh'] : [])]);
for (const p of [...sites, ...peaks, ...[...countries.values()].map(c => c.largestCity).filter(Boolean)]) keep(p, (p.native ?? []).map(n => n.code));

// ---- more pronunciation: search Wikimedia Commons for native-speaker recordings ----
// Lingua Libre uploads thousands of recordings ("LL-Q188 (deu)-Speaker-Deutschland.wav") that Wikidata
// never links, plus older Wiktionary-style files ("De-Deutschland.ogg"). Search for an exact match of each
// local name. Results are cached in data/audio-cache.json so each name is only searched once (misses are
// retried after 30 days) — Commons limits how fast we may ask.
{
  const CACHE = join(ROOT, 'data/audio-cache.json');
  const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  const iso3OfWiki = { de: 'deu', fr: 'fra', es: 'spa', it: 'ita', pt: 'por', ru: 'rus', ja: 'jpn', 'zh-hans': 'cmn', 'zh-hant': 'cmn', zh: 'cmn', ar: 'ara', he: 'heb', el: 'ell', nl: 'nld', sv: 'swe', no: 'nor', nb: 'nob', da: 'dan', fi: 'fin', pl: 'pol', cs: 'ces', sk: 'slk', hu: 'hun', ro: 'ron', bg: 'bul', uk: 'ukr', tr: 'tur', fa: 'fas', hi: 'hin', ko: 'kor', vi: 'vie', th: 'tha', id: 'ind', ms: 'msa', sw: 'swa', ka: 'kat', hy: 'hye', sr: 'srp', hr: 'hrv', sl: 'slv', lt: 'lit', lv: 'lav', et: 'est', is: 'isl', ga: 'gle', ca: 'cat', eu: 'eus', mn: 'mon', kk: 'kaz', uz: 'uzb', az: 'aze', ur: 'urd', bn: 'ben', ta: 'tam', am: 'amh', so: 'som', ne: 'nep', si: 'sin', km: 'khm', lo: 'lao', my: 'mya', tl: 'tgl' };
  const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const today = new Date().toISOString().slice(0, 10);
  const stale = d => (new Date(today) - new Date(d)) / 864e5 > 30;
  let asked = 0;
  async function findRecording(word, code) {
    const iso3 = iso3OfWiki[code] ?? iso3OfWiki[code?.split('-')[0]];
    if (!iso3 || !word) return null;
    const key = `${iso3}|${word}`;
    if (cache[key] && (cache[key].file || !stale(cache[key].date))) return cache[key].file;
    if (asked >= 150 || process.env.NO_AUDIO_SEARCH) return null; // spread the first big run over a few nights
    asked++;
    const u = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=50&format=json&srsearch=${encodeURIComponent(`intitle:"${word}" filetype:audio`)}`;
    let titles = [];
    for (let attempt = 1; attempt <= 4; attempt++) {
      const r = await fetch(u, { headers: { 'User-Agent': UA } });
      const t = await r.text();
      try { titles = JSON.parse(t).query.search.map(x => x.title.replace(/^File:/, '')); break; } catch { await new Promise(res => setTimeout(res, 15000 * attempt)); }
    }
    const ll = new RegExp(`^LL-Q\\d+ \\(${iso3}\\)-[^-]+-${esc(word)}\\.(wav|ogg|mp3|flac)$`, 'i');
    const wikt = new RegExp(`^${esc(code.split('-')[0])}-${esc(word)}\\.(ogg|wav|mp3)$`, 'i');
    const hit = titles.find(t => ll.test(t)) ?? titles.find(t => wikt.test(t)) ?? null;
    cache[key] = { file: hit, date: today };
    if (asked % 25 === 0) { writeFileSync(CACHE, JSON.stringify(cache, null, 0) + '\n'); console.log(`  …${asked} searched`); }
    await new Promise(res => setTimeout(res, 1200)); // be polite to Commons
    return hit;
  }
  console.log('Searching Wikimedia Commons for more pronunciations…');
  const want = [];
  const addWant = (item, word, code) => { if (word && code && !Object.keys(item.audio ?? {}).some(k => k.split('-')[0] === code.split('-')[0])) want.push([item, word, code]); };
  for (const c of countries.values()) { for (const n of c.native ?? []) addWant(c, n.name, n.code); for (const cap of c.capitals) for (const n of cap.native ?? []) addWant(cap, n.name, n.code); }
  for (const p of [...rivers, ...lakes]) { for (const n of p.native ?? []) addWant(p, n.name, n.code); if (p.zh) addWant(p, p.zh.han, 'zh'); }
  for (const p of cn.values()) { if (p.zh) addWant(p, p.zh.han, 'zh'); for (const cap of p.capitals) if (cap.zh) addWant(cap, cap.zh.han, 'zh'); }
  let found = 0;
  for (const [item, word, code] of want) {
    const f = await findRecording(word, code);
    if (f) { (item.audio ??= {})[code] = audioUrls(f); found++; }
  }
  writeFileSync(CACHE, JSON.stringify(cache, null, 0) + '\n');
  console.log(`  ${found} more recordings found (${asked} new searches; ${want.length} names without a Wikidata recording)`);
}

// ---- diff against previous snapshots ------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const changes = [];
function diffAndWrite(path, list, fields, extra = {}) {
  const prev = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')).places ?? JSON.parse(readFileSync(path, 'utf8')).countries : null;
  if (prev) {
    const prevById = Object.fromEntries(prev.map(c => [c.id, c]));
    const ids = new Set(list.map(c => c.id));
    for (const c of list) {
      const p = prevById[c.id];
      if (!p) { changes.push({ date: today, id: c.id, name: c.label ?? c.name, field: 'added', from: null, to: c.name }); continue; }
      const val = (x, f) => (f === 'zhHan' ? x.zh?.han : f === 'currencyName' ? x.currency?.map(c => c.name).join(' / ') : f === 'largestCityName' ? x.largestCity?.name : f === 'highestName' ? x.highest?.name : x[f]);
      for (const f of fields) if (val(p, f) !== val(c, f)) changes.push({ date: today, id: c.id, name: c.label ?? c.name, field: f === 'zhHan' ? 'Chinese name' : f, from: val(p, f) ?? null, to: val(c, f) ?? null });
    }
    for (const p of prev) if (!ids.has(p.id)) changes.push({ date: today, id: p.id, name: p.name, field: 'removed', from: p.name, to: null });
  }
  return () => writeFileSync(path, JSON.stringify(addChinese(path === OUT ? { source: 'Wikidata (CC0)', countries: list } : { source: 'Wikidata (CC0)', ...extra, places: list }), null, 1) + '\n'); // any Chinese local name also gets pinyin
}
// ---- rivers: where each one rises (Wikidata P885), and the US states a US river runs through (from the map) ----
console.log('River sources and US states…');
{
  const { feature: tf } = await import('topojson-client');
  const { geoContains } = await import('d3-geo');
  for (let i = 0; i < rivers.length; i += 150)
    for (const b of await sparql(`SELECT ?r ?sLabel WHERE { VALUES ?r { ${rivers.slice(i, i + 150).map(r => `wd:${r.id}`).join(' ')} } ?r wdt:P885 ?s . SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`)) {
      const r = rivers.find(x => x.id === qid(v(b, 'r')));
      if (r && !r.source && !/^Q\d+$/.test(v(b, 'sLabel'))) r.source = v(b, 'sLabel');
    }
  // States: walk along the river's line and note each state it enters (in map order), sampling every few points.
  const rt = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-river.json'), 'utf8'));
  const ut = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-us.json'), 'utf8'));
  const riverGeo = Object.fromEntries(tf(rt, rt.objects.places).features.map(f => [f.properties.id, f.geometry]));
  // Some state outlines are wound inside-out in the source (Maryland would "contain" the whole world): flip those back.
  const { geoArea } = await import('d3-geo');
  const fixRing = rings => (geoArea({ type: 'Polygon', coordinates: rings }) > 2 * Math.PI ? rings.map(r => [...r].reverse()) : rings);
  const stateF = tf(ut, ut.objects.places).features.filter(f => states.has(f.properties.id)).map(f => ({ ...f, geometry: f.geometry.type === 'Polygon' ? { ...f.geometry, coordinates: fixRing(f.geometry.coordinates) } : { ...f.geometry, coordinates: f.geometry.coordinates.map(fixRing) } }));
  for (const r of rivers) {
    if (!(r.countries ?? []).includes('Q30') || !riverGeo[r.id]) continue;
    const lines = riverGeo[r.id].type === 'LineString' ? [riverGeo[r.id].coordinates] : riverGeo[r.id].coordinates;
    const seen = [];
    for (const line of lines) for (let k = 0; k < line.length; k += 2) {
      // Look a little to each side too: rivers that form a border (the Delaware, the Ohio) belong to both banks.
      for (const [dx, dy] of [[0, 0], [0.03, 0], [-0.03, 0], [0, 0.03], [0, -0.03]]) {
        const st = stateF.find(f => geoContains(f, [line[k][0] + dx, line[k][1] + dy]));
        if (st && !seen.includes(st.properties.id)) seen.push(st.properties.id);
      }
    }
    if (seen.length) r.stateIds = seen;
  }
  // "the Gulf of Mexico", "the Monongahela River", but "Lake Itasca", "Delaware Bay", "La Poudre Pass".
  const theIf = x => (/^(the |Lake |Mount )/i.test(x) || /^[A-Z][a-z]+ (Bay|Pass|Spring|Springs|Glacier)$/.test(x) || /^[A-Z][a-z]+ [A-Z][a-z]+ Pass$/.test(x) || / (Lake|Creek)$/.test(x) || !/(River|Sea|Ocean|Gulf|Sound|Bay|Fork|Branch|Mountains|Range|Lakes|Icefield|Glacier)\b|^Gulf|^Bay|^Rio /.test(x) ? x : 'the ' + x);
  for (const r of rivers) {
    // US rivers: the states, then any other country they reach (the Columbia rises in Canada).
    const where = r.stateIds?.length ? [...r.stateIds.map(id => states.get(id).name), ...countryNames((r.countries ?? []).filter(c => c !== 'Q30'))] : countryNames(r.countries);
    const mouth = r.mouthName;
    r.facts = [`${fmt(r.size)} km long`, mouth && (r.source ? `from ${theIf(r.source)} to ${theIf(mouth)}` : `flows into ${theIf(mouth)}`),
      where.length && where.slice(0, 6).join(', ') + (where.length > 6 ? '…' : '')].filter(Boolean).join(' · ');
  }
}

// ---- which state / province each World Heritage Site and peak is in (Wikidata P131 → first-level division) ----
console.log('Finding states & provinces for sites and peaks…');
{
  const items = [...sites, ...peaks];
  const anc = {};
  for (let i = 0; i < items.length; i += 100)
    for (const b of await sparql(`SELECT ?s ?a WHERE { VALUES ?s { ${items.slice(i, i + 100).map(x => `wd:${x.id}`).join(' ')} } ?s wdt:P131+ ?a . }`))
      (anc[qid(v(b, 's'))] ??= new Set()).add(qid(v(b, 'a')));
  const all = [...new Set(Object.values(anc).flatMap(x => [...x]))];
  const first = {};
  for (let i = 0; i < all.length; i += 200)
    for (const b of await sparql(`SELECT ?a ?aLabel WHERE { VALUES ?a { ${all.slice(i, i + 200).map(x => `wd:${x}`).join(' ')} } ?a wdt:P31/wdt:P279* wd:Q10864048 . SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`))
      if (!/^Q\d+$/.test(v(b, 'aLabel'))) first[qid(v(b, 'a'))] = v(b, 'aLabel');
  for (const x of items) {
    // Some countries stack two "first-level" layers (Greece's decentralized administrations): drop those, keep at most two.
    const regs = [...(anc[x.id] ?? [])].filter(a => first[a] && !/^Decentralized Administration/.test(first[a])).map(a => ({ id: a, name: first[a] }));
    if (!regs.length || regs.length > 2) continue;
    x.admin1Ids = regs.map(r => r.id);
    x.admin1 = regs.map(r => r.name).join(', ');
    const where = x.countryName ?? '';
    if (where && !where.includes(' and ') && !where.includes(', ')) x.facts = x.facts.replace(new RegExp(`(· )?${where.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), `$1${x.admin1}, ${where}`);
  }
}

// ---- regions inside a country (data/subdivisions.json): prefectures, counties… ----
console.log('Querying Wikidata for regions inside countries…');
const subCfg = JSON.parse(readFileSync(join(ROOT, 'data/subdivisions.json'), 'utf8')).sections;
const subShapes = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-sub.json'), 'utf8')).objects.places.geometries.map(g => g.properties).filter(p => /^Q\d+$/.test(p.id)); // skip helper outlines ('Q22424-outline')
const subGroupCfg = Object.fromEntries(subCfg.flatMap(cfg => cfg.groups.map(g => [g.id, cfg])));
const subs = await fetchPlaces(subShapes.map(x => x.id), 'sub', id => {
  const grp = subShapes.find(x => x.id === id).group, cfg = subGroupCfg[grp];
  return { group: grp, noun: cfg.noun, capWord: cfg.capital, parent: cfg.country, capitals: [] };
});
for (const b of await sparql(CAPITAL_Q.replace('%IDS%', [...subs.keys()].map(q => `wd:${q}`).join(' ')))) {
  const p = subs.get(qid(v(b, 'c')));
  const capId = qid(v(b, 'cap'));
  if (!p || p.capitals.some(x => x.id === capId) || /^Q\d+$/.test(v(b, 'capLabel'))) continue;
  p.capitals.push({ id: capId, name: v(b, 'capLabel'), preferred: v(b, 'rank').endsWith('PreferredRank'), role: null,
    image: file(v(b, 'capImg')) || null, ...point(v(b, 'capCoord')),
    wiki: v(b, 'capArticle') ? decodeURIComponent(v(b, 'capArticle').split('/wiki/')[1]) : null });
}
const parentName = id => countries.get(id)?.name ?? states.get(id)?.name ?? subs.get(id)?.name ?? null; // a district's parent can itself be a region (Punjab)
for (const p of subs.values()) {
  const o = overrides[p.id];
  if (o?.name) p.name = o.name;
  if (/district$/i.test(p.name)) p.name = p.name.replace(/ District$/, ' district'); // "Jalandhar District" / "Sangrur district": one style
  if (!p.capitals.length && o?.capital) p.capitals.push({ ...o.capital, preferred: false, role: null }); // only fills a gap in Wikidata
  if (o?.capitalNote) p.capitalNote = o.capitalNote;
  if (o?.capitalKeep && p.capitals.some(x => x.id === o.capitalKeep)) p.capitals = p.capitals.filter(x => x.id === o.capitalKeep); // a second seat that isn't the capital people mean (Belagavi)
  const pref = p.capitals.filter(x => x.preferred);
  p.capitals = (pref.length ? pref : p.capitals).sort((a, b) => a.name.localeCompare(b.name));
  p.capitalAnswer = p.capitals.map(x => x.name).reduce(andJoin, '') || null;
  p.parentName = parentName(p.parent);
  const cfgOf = subGroupCfg[p.group];
  const grpName = cfgOf.groups.length > 1 ? cfgOf.groups.find(g => g.id === p.group)?.name : null; // "Jalandhar division", "Kantō"
  p.facts = [`${p.noun.charAt(0).toUpperCase() + p.noun.slice(1)} of ${p.parentName}`, grpName].filter(Boolean).join(' · ');
  if (!p.capitalAnswer) warnings.push(`${p.name}: no ${p.capWord} in Wikidata`);
}
// Local names in each country's own script (Punjab: Gurmukhi, Japan: kanji, Uzbekistan: Uzbek…), for regions and capitals.
{
  const langsOf = p => subGroupCfg[p.group]?.nativeLangs ?? [];
  const items = [...subs.values()].flatMap(p => [{ obj: p, id: p.id, langs: langsOf(p) }, ...p.capitals.filter(c => c.id).map(c => ({ obj: c, id: c.id, langs: langsOf(p) }))]).filter(x => x.langs.length);
  const codes = [...new Set(items.flatMap(x => x.langs.map(l => l[0])))];
  const labels = {};
  for (let i = 0; i < items.length; i += 200)
    for (const b of await sparql(`SELECT ?c ?l WHERE { VALUES ?c { ${[...new Set(items.slice(i, i + 200).map(x => `wd:${x.id}`))].join(' ')} } ?c rdfs:label ?l FILTER(lang(?l) IN (${codes.map(x => `"${x}"`).join(',')})) }`))
      (labels[qid(v(b, 'c'))] ??= {})[b.l['xml:lang']] = v(b, 'l');
  for (const x of items) {
    const out = [];
    for (const [code, lang] of x.langs) {
      let l = labels[x.id]?.[code];
      if (l && code === 'ja' && x.obj !== subs.get(x.id) && l.length > 2) l = l.replace(/[市町村]$/, ''); // 名古屋市 → 名古屋 (cities only; 愛知県 keeps 県)
      if (l && l.toLowerCase() !== x.obj.name.toLowerCase() && !out.some(o => o.name === l)) out.push({ name: l, lang, code });
    }
    if (out.length) x.obj.native = out;
  }
  // Native-speaker recordings where Wikidata has them (otherwise the app uses the device's voice).
  const withNames = items.filter(x => x.obj.native).map(x => x.obj);
  await attachAudio(withNames);
  for (const o of withNames) keep(o, o.native.map(n => n.code));
}
const subMeta = subCfg.map(({ source, _readme, groups, nativeLangs, ...cfg }) => ({ ...cfg, groups: groups.map(({ id, name }) => ({ id, name })) }));

// ---- population (Wikidata P1082, best-ranked, latest) for countries, US states, Chinese provinces, regions, territories ----
console.log('Querying Wikidata for populations…');
{
  const items = [...countries.values(), ...states.values(), ...cn.values(), ...subs.values(), ...territories];
  const pop = {};
  for (let i = 0; i < items.length; i += 200)
    for (const b of await sparql(`SELECT ?p ?n ?t WHERE { VALUES ?p { ${items.slice(i, i + 200).map(x => `wd:${x.id}`).join(' ')} } ?p p:P1082 ?s . ?s a wikibase:BestRank ; ps:P1082 ?n . OPTIONAL { ?s pq:P585 ?t } }`)) {
      const id = qid(v(b, 'p')), t = v(b, 't') ?? '', n = +v(b, 'n');
      if (!pop[id] || t > pop[id].t) pop[id] = { n, t };
    }
  for (const x of items) if (pop[x.id]?.n) { x.population = Math.round(pop[x.id].n); x.populationYear = pop[x.id].t ? +pop[x.id].t.slice(0, 4) : null; }
}

// A place is one card set: a site that's also a country, lake, range or peak (Vatican City, Lake Baikal, Western Ghats)
// stays in its own layer, otherwise the two would share card ids.
{
  const taken = new Set([...list, ...lakes, ...mranges, ...peaks, ...territories, ...rivers].map(x => x.id));
  const keep = sites.filter(x => !taken.has(x.id));
  if (keep.length !== sites.length) console.log(`  ${sites.length - keep.length} World Heritage Sites left to their own layer`);
  sites.splice(0, sites.length, ...keep);
  const pTaken = new Set([...list, ...lakes, ...mranges].map(x => x.id));
  const keepP = peaks.filter(x => !pTaken.has(x.id)); peaks.splice(0, peaks.length, ...keepP);
}
const writers = [
  diffAndWrite(OUT, list, ['name', 'capitalAnswer', 'flag', 'currencyName', 'largestCityName', 'highestName']),
  diffAndWrite(join(ROOT, 'public/data/water.json'), [...water.values()].sort((a, b) => a.name.localeCompare(b.name)), ['name']),
  diffAndWrite(join(ROOT, 'public/data/rivers.json'), rivers, ['name', 'group']),
  diffAndWrite(join(ROOT, 'public/data/us.json'), [...states.values()].sort((a, b) => a.name.localeCompare(b.name)), ['name', 'capitalAnswer', 'flag']),
  diffAndWrite(join(ROOT, 'public/data/senate.json'), [...senate, ...governors], ['name', 'party']),
  diffAndWrite(join(ROOT, 'public/data/leaders.json'), leaders, ['name']),
  diffAndWrite(join(ROOT, 'public/data/territories.json'), territories, ['name', 'capitalAnswer', 'sovereignName']),
  diffAndWrite(join(ROOT, 'public/data/sites.json'), sites, ['name']),
  diffAndWrite(join(ROOT, 'public/data/peaks.json'), peaks, ['name']),
  diffAndWrite(join(ROOT, 'public/data/ranges.json'), mranges, ['name']),
  diffAndWrite(join(ROOT, 'public/data/lakes.json'), lakes, ['name', 'group']),
  diffAndWrite(join(ROOT, 'public/data/subdivisions.json'), [...subs.values()].sort((a, b) => a.name.localeCompare(b.name)), ['name', 'capitalAnswer'], { sections: subMeta }),
  diffAndWrite(join(ROOT, 'public/data/cn.json'), [...cn.values()].sort((a, b) => a.name.localeCompare(b.name)), ['name', 'capitalAnswer', 'zhHan']),
];

warnings.forEach(w => console.warn('⚠ ' + w));
changes.forEach(ch => console.log(`Δ ${ch.name}: ${ch.field} ${JSON.stringify(ch.from)} → ${JSON.stringify(ch.to)}`));
console.log(`${list.length} countries, ${states.size} US states, ${senate.length} senators, ${governors.length} governors, ${leaders.length} world leaders, ${territories.length} territories, ${sites.length} World Heritage Sites, ${peaks.length} peaks, ${mranges.length} ranges, ${water.size} waters, ${rivers.length} rivers, ${lakes.length} lakes, ${cn.size} China divisions, ${changes.length} changes, ${warnings.length} warnings`);

if (!DRY) {
  writers.forEach(w => w());
  if (changes.length || !existsSync(CHANGES)) {
    const all = existsSync(CHANGES) ? JSON.parse(readFileSync(CHANGES, 'utf8')) : [];
    writeFileSync(CHANGES, JSON.stringify([...changes, ...all].slice(0, 500), null, 1) + '\n');
  }
}
