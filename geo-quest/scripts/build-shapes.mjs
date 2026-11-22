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
import { mergeArcs } from 'topojson-client';
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
  features = features.map(f => ({ ...f, geometry: rewind(f.geometry) }));
  let topo = topology({ f: { type: 'FeatureCollection', features } }, 1e5);
  topo = presimplify(topo);
  topo = simplify(topo, quantile(topo, keep));
  const byId = new Map();
  for (const g of topo.objects.f.geometries) byId.set(g.properties.id, [...(byId.get(g.properties.id) ?? []), g]);
  const geometries = [...byId].map(([id, gs]) => ({ ...(gs.length > 1 ? mergeArcs(topo, gs) : gs[0]), properties: gs[0].properties }));
  topo.objects = { places: { type: 'GeometryCollection', geometries } };
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
console.log(`Wrote ${water.length} water features and ${cn.length} China features.`);
