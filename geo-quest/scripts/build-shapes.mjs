#!/usr/bin/env node
// One-off: builds the map shapes for oceans/seas and China's provinces from
// Natural Earth (public domain) into compact TopoJSON files. Shapes almost never
// change, so this is run by hand; the *facts* are refreshed nightly by sync-wikidata.mjs.
//
//   node scripts/build-shapes.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { topology } from 'topojson-server';
import { presimplify, simplify, quantile } from 'topojson-simplify';
import { mergeArcs, feature } from 'topojson-client';
import { geoArea } from 'd3-geo';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const places = JSON.parse(readFileSync(join(ROOT, 'data/places.json'), 'utf8'));

async function get(file) {
  console.log('Downloading', file);
  const r = await fetch(NE + file);
  if (!r.ok) throw new Error(`${file}: ${r.status}`);
  return r.json();
}

/** d3 draws on a sphere, so a ring wound the "wrong" way means "everything except this
 *  shape". Natural Earth GeoJSON uses the opposite winding for some features; fix any
 *  polygon that claims to cover more than half the globe. */
function rewind(geometry) {
  const fix = coordinates => (geoArea({ type: 'Polygon', coordinates }) > 2 * Math.PI ? coordinates.map(r => [...r].reverse()) : coordinates);
  if (geometry.type === 'Polygon') return { ...geometry, coordinates: fix(geometry.coordinates) };
  if (geometry.type === 'MultiPolygon') return { ...geometry, coordinates: geometry.coordinates.map(fix) };
  return geometry;
}

/** Build a topology where all features sharing an id are merged into one shape. */
function build(features, keep) {
  features = features.map(f => ({ ...f, geometry: /Polygon/.test(f.geometry.type) ? rewind(f.geometry) : f.geometry }));
  // Natural Earth sometimes lists the same shape twice (e.g. Lake Volta); merging two identical
  // copies would cancel them out, so drop exact duplicates first.
  const seen = new Set();
  features = features.filter(f => { const k = f.properties.id + JSON.stringify(f.geometry); if (seen.has(k)) return false; seen.add(k); return true; });
  let topo = topology({ f: { type: 'FeatureCollection', features } }, 1e5);
  topo = presimplify(topo);
  // Never simplify small shapes (Strait of Gibraltar, Macau…): they'd collapse to nothing.
  const arcIds = a => (typeof a === 'number' ? [a < 0 ? ~a : a] : a.flatMap(arcIds));
  topo.objects.f.geometries.forEach((g, i) => {
    const f = features[i];
    const small = /Polygon/.test(f.geometry.type) ? geoArea(f) < 2e-5 : false;
    if (small && g.arcs) for (const ai of arcIds(g.arcs)) for (const pt of topo.arcs[ai]) pt[2] = Infinity;
  });
  topo = simplify(topo, quantile(topo, keep));
  const byId = new Map();
  for (const g of topo.objects.f.geometries) byId.set(g.properties.id, [...(byId.get(g.properties.id) ?? []), g]);
  const geometries = [...byId].map(([id, gs]) => ({ ...(gs.length > 1 ? mergeArcs(topo, gs) : gs[0]), properties: gs[0].properties }));
  topo.objects = { places: { type: 'GeometryCollection', geometries } };
  // Check every place still has a visible shape.
  for (const f of feature(topo, topo.objects.places).features) {
    const size = /Line/.test(f.geometry?.type ?? '') ? 1 : geoArea(f);
    if (!(size > 0)) console.warn('⚠ shape collapsed for', f.properties.id);
  }
  return topo;
}

// ---- oceans & seas ----
const waterIds = new Set(places.water.flatMap(g => g.members));
const marine = await get('ne_50m_geography_marine_polys.geojson');
const water = marine.features.filter(f => waterIds.has(f.properties.wikidataid))
  .map(f => ({ type: 'Feature', geometry: f.geometry, properties: { id: f.properties.wikidataid } }));
const missing = [...waterIds].filter(id => !water.some(f => f.properties.id === id));
if (missing.length) console.warn('No shape for', missing);
writeFileSync(join(ROOT, 'public/data/shapes-water.json'), JSON.stringify(build(water, 0.25)));

// ---- China: provinces, autonomous regions, municipalities, SARs ----
const admin1 = await get('ne_10m_admin_1_states_provinces.geojson');
const cn = admin1.features
  .filter(f => (f.properties.adm0_a3 === 'CHN' && f.properties.wikidataid) || f.properties.adm0_a3 === 'HKG' || f.properties.adm0_a3 === 'MAC')
  .map(f => {
    const p = f.properties;
    const type = p.adm0_a3 === 'CHN' ? p.type_en.toLowerCase() : 'special administrative region';
    return { type: 'Feature', geometry: f.geometry, properties: { id: p.adm0_a3 === 'HKG' ? places.cn.hongKong : p.wikidataid, type } };
  });
writeFileSync(join(ROOT, 'public/data/shapes-cn.json'), JSON.stringify(build(cn, 0.12)));

// ---- lakes: every Natural Earth 1:50m lake that has a Wikidata id (the sync picks which to teach, by area) ----
const lakesNE = await get('ne_50m_lakes.geojson');
const lakes = lakesNE.features.filter(f => /^Q\d+$/.test(f.properties.wikidataid ?? '') && !waterIds.has(f.properties.wikidataid))
  .map(f => ({ type: 'Feature', geometry: f.geometry, properties: { id: f.properties.wikidataid } }));
writeFileSync(join(ROOT, 'public/data/shapes-lake.json'), JSON.stringify(build(lakes, 0.3)));

// ---- rivers: curated in data/rivers.json (Natural Earth rivers carry no Wikidata id) ----
const curated = JSON.parse(readFileSync(join(ROOT, 'data/rivers.json'), 'utf8')).rivers;
// Resolve article titles → Wikidata ids via Wikipedia itself (follows redirects, so renamed articles keep working).
const qidOf = {};
for (let i = 0; i < curated.length; i += 50) {
  const batch = curated.slice(i, i + 50).map(r => r.wiki);
  const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(batch.join('|'))}`;
  const j = await (await fetch(u, { headers: { 'User-Agent': 'GeoQuestStudyApp/0.1 (personal flashcard app)' } })).json();
  const alias = {};
  for (const n of j.query.normalized ?? []) alias[n.to] = n.from;
  for (const r of j.query.redirects ?? []) alias[r.to] = alias[r.from] ?? r.from;
  for (const pg of Object.values(j.query.pages)) {
    const q = pg.pageprops?.wikibase_item;
    if (q) { qidOf[pg.title] = q; if (alias[pg.title]) qidOf[alias[pg.title]] = q; }
  }
}
const riversNE = await get('ne_10m_rivers_lake_centerlines.geojson');
const lines = g => (!g ? [] : g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []);
const inBox = (ls, b) => !b || ls.some(l => l.some(([x, y]) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]));
const rivers = [];
for (const r of curated) {
  const id = qidOf[r.wiki];
  if (!id) { console.warn('No Wikidata item for', r.wiki); continue; }
  const segs = riversNE.features.filter(f => (f.properties.featurecla === 'River' || f.properties.featurecla === 'Lake Centerline') && (r.ne.includes(f.properties.name_en) || r.ne.includes(f.properties.name)) && inBox(lines(f.geometry), r.bbox));
  if (!segs.length) { console.warn('No shape for', r.wiki); continue; }
  rivers.push({ type: 'Feature', geometry: { type: 'MultiLineString', coordinates: segs.flatMap(f => lines(f.geometry)) }, properties: { id } });
}
writeFileSync(join(ROOT, 'public/data/shapes-river.json'), JSON.stringify(build(rivers, 0.1)));

console.log(`Wrote ${water.length} water, ${cn.length} China, ${lakes.length} lake and ${rivers.length} river features.`);
