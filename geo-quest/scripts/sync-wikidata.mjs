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
import { pinyin } from 'pinyin-pro';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const v = (b, k) => b[k]?.value;

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
    flag: file(v(b, 'flag')) || null,
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
    c.capitalAnswer = main.length ? main.map(x => x.name).join(' and ') : null;
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
const PINYIN_FIX = { 内蒙古: 'Nèi Měnggǔ' };
const toPinyin = h => {
  if (PINYIN_FIX[h]) return PINYIN_FIX[h];
  const syl = pinyin(h, { type: 'array' });
  const s = syl.map((x, i) => (i && /^[aoeāáǎàōóǒòēéěè]/.test(x) ? "'" : '') + x).join('');
  return s.charAt(0).toUpperCase() + s.slice(1);
};
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
  const main = pref.length ? pref : p.capitals;
  p.capitals = main;
  p.capitalAnswer = main.length ? main.map(x => x.name).join(' and ') : null;
  if (!p.capitalAnswer && (p.type === 'province' || p.type === 'autonomous region')) warnings.push(`${p.name}: no capital in Wikidata`);
}


// ---- rivers & lakes ---------------------------------------------------------------
// Which ones exist comes from the shapes (data/rivers.json, Natural Earth lakes); everything
// else comes from Wikidata, including the tiers: the 20 longest rivers / 20 largest lakes are
// the "great" tier, the rest are grouped by continent and unlock after it.
const shapeIds = f => JSON.parse(readFileSync(join(ROOT, `public/data/shapes-${f}.json`), 'utf8')).objects.places.geometries.map(g => g.properties.id);
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
  list.forEach((p, i) => {
    const o = overrides[p.id];
    if (o?.name) p.name = o.name;
    const region = mainRegion(p.countries, p.lon);
    if (i < 20) p.group = `${prefix}-great`;
    else {
      const g = `${prefix}-${CONT_GROUP[region]}`;
      const famous = (overrides._lakesAlways ?? []).includes(p.id); // small but well-known (Dead Sea, Lake Geneva…)
      if (kind === 'lake' && !famous && /r[eé]servoir| bay$/i.test(p.name)) return; // man-made lakes only count if they're among the very largest
      if (kind === 'lake' && !famous && (perContinent[g] = (perContinent[g] ?? 0) + 1) > 15) return; // keep the 15 largest lakes per continent
      p.group = g;
    }
    p.nameThe = kind === 'river' ? (o?.nameThe ?? `the ${p.name}`) : (o?.nameThe ?? (/ Sea$|^Great Salt/.test(p.name) ? `the ${p.name}` : p.name));
    const where = countryNames(p.countries);
    p.facts = kind === 'river'
      ? [`${fmt(p.len / 1000)} km long`, p.mouth && `flows into ${/^(the |Lake )/i.test(p.mouth) ? p.mouth : 'the ' + p.mouth}`, where.length && where.slice(0, 4).join(', ') + (where.length > 4 ? '…' : '')].filter(Boolean).join(' · ')
      : [`${fmt(p.area / 1e6)} km²`, where.length && where.slice(0, 4).join(', ')].filter(Boolean).join(' · ');
    p.size = Math.round(kind === 'river' ? p.len / 1000 : p.area / 1e6);
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
console.log('Querying Wikidata for pronunciations…');
await attachAudio([...countries.values(), ...[...countries.values()].flatMap(c => c.capitals), ...cn.values(), ...[...cn.values()].flatMap(p => p.capitals), ...rivers, ...lakes]);
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

// ---- diff against previous snapshots ------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const changes = [];
function diffAndWrite(path, list, fields) {
  const prev = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')).places ?? JSON.parse(readFileSync(path, 'utf8')).countries : null;
  if (prev) {
    const prevById = Object.fromEntries(prev.map(c => [c.id, c]));
    const ids = new Set(list.map(c => c.id));
    for (const c of list) {
      const p = prevById[c.id];
      if (!p) { changes.push({ date: today, id: c.id, name: c.name, field: 'added', from: null, to: c.name }); continue; }
      const val = (x, f) => (f === 'zhHan' ? x.zh?.han : x[f]);
      for (const f of fields) if (val(p, f) !== val(c, f)) changes.push({ date: today, id: c.id, name: c.name, field: f === 'zhHan' ? 'Chinese name' : f, from: val(p, f) ?? null, to: val(c, f) ?? null });
    }
    for (const p of prev) if (!ids.has(p.id)) changes.push({ date: today, id: p.id, name: p.name, field: 'removed', from: p.name, to: null });
  }
  return () => writeFileSync(path, JSON.stringify(path === OUT ? { source: 'Wikidata (CC0)', countries: list } : { source: 'Wikidata (CC0)', places: list }, null, 1) + '\n');
}
const writers = [
  diffAndWrite(OUT, list, ['name', 'capitalAnswer', 'flag']),
  diffAndWrite(join(ROOT, 'public/data/water.json'), [...water.values()].sort((a, b) => a.name.localeCompare(b.name)), ['name']),
  diffAndWrite(join(ROOT, 'public/data/rivers.json'), rivers, ['name', 'group']),
  diffAndWrite(join(ROOT, 'public/data/lakes.json'), lakes, ['name', 'group']),
  diffAndWrite(join(ROOT, 'public/data/cn.json'), [...cn.values()].sort((a, b) => a.name.localeCompare(b.name)), ['name', 'capitalAnswer', 'zhHan']),
];

warnings.forEach(w => console.warn('⚠ ' + w));
changes.forEach(ch => console.log(`Δ ${ch.name}: ${ch.field} ${JSON.stringify(ch.from)} → ${JSON.stringify(ch.to)}`));
console.log(`${list.length} countries, ${water.size} waters, ${rivers.length} rivers, ${lakes.length} lakes, ${cn.size} China divisions, ${changes.length} changes, ${warnings.length} warnings`);

if (!DRY) {
  writers.forEach(w => w());
  if (changes.length || !existsSync(CHANGES)) {
    const all = existsSync(CHANGES) ? JSON.parse(readFileSync(CHANGES, 'utf8')) : [];
    writeFileSync(CHANGES, JSON.stringify([...changes, ...all].slice(0, 500), null, 1) + '\n');
  }
}
