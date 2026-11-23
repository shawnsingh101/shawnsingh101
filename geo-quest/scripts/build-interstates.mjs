#!/usr/bin/env node
// The primary Interstate Highways (one- and two-digit numbers, lower 48): their lines from Natural Earth's roads,
// facts from Wikidata (via each "Interstate N" Wikipedia article), and the states each one runs through (from the map).
// Writes public/data/shapes-road.json and public/data/roads.json. Run by hand; the routes rarely change.
//
//   node scripts/build-interstates.mjs           (NE_DIR=/path reuses a downloaded ne_10m_roads.geojson)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { topology } from 'topojson-server';
import { presimplify, simplify, quantile } from 'topojson-simplify';
import { feature } from 'topojson-client';
import { geoArea, geoContains, geoLength } from 'd3-geo';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_roads.geojson';
const UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)';

async function sparql(query) {
  for (let a = 1; a <= 4; a++) {
    const r = await fetch('https://query.wikidata.org/sparql', { method: 'POST', headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ query }) });
    if (r.ok) return (await r.json()).results.bindings;
    console.warn(`Wikidata ${r.status}, retry ${a}/4`); await new Promise(z => setTimeout(z, 15000 * a));
  }
  throw new Error('Wikidata failed');
}
const qid = u => u.split('/').pop();
const FIXES = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../data/interstates.json'), 'utf8'));

// ---- 1. lines ------------------------------------------------------------------------------------
const roadsFile = process.env.NE_DIR && join(process.env.NE_DIR, 'ne_10m_roads.geojson');
const roads = roadsFile && existsSync(roadsFile) ? JSON.parse(readFileSync(roadsFile, 'utf8')) : await (await fetch(NE)).json();
const byNum = new Map();
for (const f of roads.features) {
  const p = f.properties;
  if (p.sov_a3 !== 'USA' || p.level !== 'Interstate' || !/^\d{1,2}$/.test(p.name ?? '')) continue;
  const lines = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates;
  byNum.set(+p.name, [...(byNum.get(+p.name) ?? []), ...lines]);
}

// Natural Earth labels a few short stretches of other roads with an Interstate number (a bit of US-75 in Tulsa as
// "75"). Group each number's lines into connected pieces and drop pieces under 30 km that stand apart from the rest.
const near = (a, b) => Math.abs(a[0] - b[0]) < 0.12 && Math.abs(a[1] - b[1]) < 0.12;
for (const [n, lines] of byNum) {
  const comp = lines.map((_, i) => i);
  const root = i => (comp[i] === i ? i : (comp[i] = root(comp[i])));
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const a = lines[i], b = lines[j];
    if ([a[0], a.at(-1)].some(p => [b[0], b.at(-1)].some(q => near(p, q)))) comp[root(i)] = root(j);
  }
  const groups = new Map();
  lines.forEach((l, i) => groups.set(root(i), [...(groups.get(root(i)) ?? []), l]));
  const km = ls => geoLength({ type: 'MultiLineString', coordinates: ls }) * 6371;
  const kept = [...groups.values()].filter(g => km(g) >= 30);
  if (kept.length) byNum.set(n, kept.flat());
}

// ---- 2. facts ------------------------------------------------------------------------------------
const nums = [...byNum.keys()].sort((a, b) => a - b);
const rows = await sparql(`SELECT ?a ?i ?mi ?img ?tLabel ?dir WHERE { VALUES ?a { ${nums.map(n => `<https://en.wikipedia.org/wiki/Interstate_${n}>`).join(' ')} } ?a schema:about ?i .
  OPTIONAL { ?i p:P2043/psv:P2043 [ wikibase:quantityAmount ?mi ; wikibase:quantityUnit wd:Q253276 ] }
  OPTIONAL { ?i wdt:P14 ?img }
  OPTIONAL { ?i p:P609 ?ts . ?ts ps:P609 ?t . OPTIONAL { ?ts pq:P560 ?d . ?d rdfs:label ?dir FILTER(LANG(?dir) = "en") } }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
const facts = new Map();
for (const r of rows) {
  const n = +decodeURIComponent(r.a.value).split('_').pop();
  const x = facts.get(n) ?? { id: qid(r.i.value), mi: null, image: null, ends: {} };
  if (r.mi && !x.mi) x.mi = Math.round(+r.mi.value);
  if (r.img && !x.image) x.image = decodeURIComponent(r.img.value.split('/').pop());
  if (r.tLabel && r.dir && !/^Q\d+$/.test(r.tLabel.value)) x.ends[r.dir.value.toLowerCase()] ??= r.tLabel.value;
  facts.set(n, x);
}

// ---- 3. states, in order along the road ------------------------------------------------------------
const usTopo = JSON.parse(readFileSync(join(ROOT, 'public/data/shapes-us.json'), 'utf8'));
// A ring wound the wrong way means "everything but this state" (Maryland swallowed the country once): flip it back.
const flip = rings => (geoArea({ type: 'Polygon', coordinates: rings }) > 2 * Math.PI ? rings.map(x => [...x].reverse()) : rings);
const states = feature(usTopo, usTopo.objects[Object.keys(usTopo.objects)[0]]).features.map(f => ({ ...f, geometry: f.geometry.type === 'Polygon'
  ? { ...f.geometry, coordinates: flip(f.geometry.coordinates) } : { ...f.geometry, coordinates: f.geometry.coordinates.map(flip) } }));
const usPlaces = JSON.parse(readFileSync(join(ROOT, 'public/data/us.json'), 'utf8')).places;
const stateName = id => usPlaces.find(p => p.id === id)?.name ?? id;
function statesAlong(lines, odd) {
  // Points every ~2 km along the road, sorted west→east (even numbers) or south→north (odd); note each state in turn.
  const pts = [];
  for (const l of lines) for (let i = 1; i < l.length; i++) {
    const [a, b] = [l[i - 1], l[i]], steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.02));
    for (let k = 0; k < steps; k++) pts.push([a[0] + ((b[0] - a[0]) * k) / steps, a[1] + ((b[1] - a[1]) * k) / steps]);
  }
  pts.sort((a, b) => (odd ? a[1] - b[1] : a[0] - b[0]));
  const out = [], hits = new Map();
  let last = null;
  for (const p of pts) {
    const s = last && geoContains(last, p) ? last : states.find(f => geoContains(f, p));
    if (!s) continue;
    last = s;
    const id = s.properties.id;
    hits.set(id, (hits.get(id) ?? 0) + 1);
    if (!out.includes(id)) out.push(id);
  }
  // A single point over a border (a road hugging the state line) doesn't make it one of the road's states.
  return out.filter(id => hits.get(id) >= 4 || out.length === 1); // ≥ ~8 km inside it
}

// ---- 4. write ------------------------------------------------------------------------------------
const places = [], feats = [];
for (const n of nums) {
  const f = facts.get(n);
  if (!f) { console.warn(`Interstate ${n}: no Wikipedia article, skipped`); continue; }
  const lines = byNum.get(n);
  const km = Math.round(geoLength({ type: 'MultiLineString', coordinates: lines }) * 6371);
  if (km < 30) { console.warn(`Interstate ${n}: only ${km} km on the map, skipped`); continue; }
  const odd = n % 2 === 1;
  let stateIds = statesAlong(lines, odd);
  const fix = FIXES[n] ?? {};
  const idOf = name => usPlaces.find(p => p.name === name)?.id;
  stateIds = stateIds.filter(id => !(fix.remove ?? []).includes(stateName(id)));
  for (const a of fix.add ?? []) if (!stateIds.includes(idOf(a.state))) stateIds.splice(stateIds.indexOf(idOf(a.after)) + 1, 0, idOf(a.state));
  // Ends as Wikidata names them, when both are towns ("Miami to Houlton"), not counties or townships.
  const tidy = x => x?.replace(/^Canada–United States border$/, 'Canada').replace(/^Mexico–United States border$/, 'Mexico');
  let ends = (odd ? [f.ends.south, f.ends.north] : [f.ends.west, f.ends.east]).map(tidy);
  if (ends.some(e => !e || /County|Township/.test(e))) ends = [];
  if (FIXES[n]?.ends) ends = FIXES[n].ends;
  const mi = f.mi ?? Math.round(km / 1.609);
  const [lon, lat] = lines.flat().reduce((acc, p, _i, all) => [acc[0] + p[0] / all.length, acc[1] + p[1] / all.length], [0, 0]);
  places.push({
    id: f.id, layer: 'road', name: `Interstate ${n}`, number: n, short: `I-${n}`,
    image: f.image ?? `I-${n}.svg`, wiki: `Interstate_${n}`, lon: +lon.toFixed(2), lat: +lat.toFixed(2),
    group: n % 5 === 0 ? 'hw-main' : 'hw-more', capitals: [], capitalAnswer: null,
    stateIds, size: mi, direction: odd ? 'north–south' : 'east–west',
    facts: [`${mi.toLocaleString('en-US')} miles`, odd ? 'Runs north–south' : 'Runs east–west', ends[0] && ends[1] ? `${ends[0]} to ${ends[1]}` : null,
      `${stateIds.length} state${stateIds.length === 1 ? '' : 's'}: ${stateIds.map(stateName).join(', ')}`].filter(Boolean).join(' · '),
  });
  feats.push({ type: 'Feature', geometry: { type: 'MultiLineString', coordinates: lines }, properties: { id: f.id } });
}
let topo = presimplify(topology({ f: { type: 'FeatureCollection', features: feats } }, 1e5));
topo = simplify(topo, quantile(topo, 0.25));
topo.objects = { places: topo.objects.f };
writeFileSync(join(ROOT, 'public/data/shapes-road.json'), JSON.stringify(topo));
writeFileSync(join(ROOT, 'public/data/roads.json'), JSON.stringify({ source: 'Natural Earth (roads), Wikidata (CC0)', places }, null, 1) + '\n');
console.log(`${places.length} Interstates (${places.filter(p => p.group === 'hw-main').length} main corridors) → roads.json, shapes-road.json`);
