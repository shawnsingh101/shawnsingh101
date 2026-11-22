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
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ query }),
    });
    if (res.ok) return (await res.json()).results.bindings;
    console.warn(`Wikidata answered ${res.status}, retry ${attempt}/4 in ${15 * attempt}s`);
    await new Promise(r => setTimeout(r, 15000 * attempt));
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

// ---- diff against previous snapshot ------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).countries : null;
const changes = [];
if (prev) {
  const prevById = Object.fromEntries(prev.map(c => [c.id, c]));
  for (const c of list) {
    const p = prevById[c.id];
    if (!p) { changes.push({ date: today, id: c.id, name: c.name, field: 'added', from: null, to: c.name }); continue; }
    for (const f of ['name', 'capitalAnswer', 'flag']) {
      if (p[f] !== c[f]) changes.push({ date: today, id: c.id, name: c.name, field: f, from: p[f], to: c[f] });
    }
  }
  for (const p of prev) if (!countries.has(p.id)) changes.push({ date: today, id: p.id, name: p.name, field: 'removed', from: p.name, to: null });
}

warnings.forEach(w => console.warn('⚠ ' + w));
changes.forEach(ch => console.log(`Δ ${ch.name}: ${ch.field} ${JSON.stringify(ch.from)} → ${JSON.stringify(ch.to)}`));
console.log(`${list.length} countries, ${changes.length} changes, ${warnings.length} warnings`);

if (!DRY) {
  writeFileSync(OUT, JSON.stringify({ source: 'Wikidata (CC0)', countries: list }, null, 1) + '\n');
  if (changes.length || !existsSync(CHANGES)) {
    const all = existsSync(CHANGES) ? JSON.parse(readFileSync(CHANGES, 'utf8')) : [];
    writeFileSync(CHANGES, JSON.stringify([...changes, ...all].slice(0, 500), null, 1) + '\n');
  }
}
