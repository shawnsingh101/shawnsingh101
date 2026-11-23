#!/usr/bin/env node
// Deserts: their shapes from Natural Earth (geography regions marked "Desert", matched by Wikidata id), facts from
// Wikidata (name, picture, area, countries), local names in the countries' languages (Chinese with pinyin, Japanese
// with romaji). Writes public/data/shapes-desert.json and public/data/deserts.json. Run by hand; deserts rarely move.
//
//   node scripts/build-deserts.mjs           (NE_DIR=/path reuses a downloaded ne_10m_geography_regions_polys.geojson)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { topology } from 'topojson-server';
import { presimplify, simplify, quantile } from 'topojson-simplify';
import { addLocalNames, rangeLangs } from './lib/local-names.mjs';
import { addRomaji } from './lib/japanese.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_geography_regions_polys.geojson';
// Natural Earth also marks a few things "Desert" that aren't one for a learner (salt pans, a farming region, a canyon bend).
const SKIP = new Set(['Q169132', 'Q3494060', 'Q76122', 'Q280231', 'Q533041', 'Q20155858', 'Q23782559', 'Q2088454']);
// The best-known deserts come first and unlock the rest.
const GREAT = new Set(['Q6583', 'Q42070', 'Q47700', 'Q229269', 'Q47141', 'Q131377', 'Q172691', 'Q132956', 'Q189429', 'Q855658', 'Q326896', 'Q145165', 'Q339162', 'Q172702', 'Q184364', 'Q162843', 'Q211839', 'Q749205']);

async function sparql(query) {
  for (let a = 1; a <= 4; a++) {
    const r = await fetch('https://query.wikidata.org/sparql', { method: 'POST', headers: { 'User-Agent': 'GeoQuestStudyApp/0.1 (personal flashcard app)', Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ query }) });
    if (r.ok) return (await r.json()).results.bindings;
    console.warn(`Wikidata ${r.status}, retry ${a}/4`); await new Promise(z => setTimeout(z, 15000 * a));
  }
  throw new Error('Wikidata failed');
}
const qid = u => u.split('/').pop();

const file = process.env.NE_DIR && join(process.env.NE_DIR, 'ne_10m_geography_regions_polys.geojson');
const regions = file && existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : await (await fetch(NE)).json();
const feats = regions.features.filter(f => f.properties.FEATURECLA === 'Desert' && f.properties.WIKIDATAID && !SKIP.has(f.properties.WIKIDATAID));
const ids = [...new Set(feats.map(f => f.properties.WIKIDATAID))];

const rows = await sparql(`SELECT ?i ?article ?img ?area ?c WHERE { VALUES ?i { ${ids.map(q => `wd:${q}`).join(' ')} }
  OPTIONAL { ?article schema:about ?i ; schema:isPartOf <https://en.wikipedia.org/> }
  OPTIONAL { ?i wdt:P18 ?img } OPTIONAL { ?i p:P2046/psn:P2046/wikibase:quantityAmount ?area } OPTIONAL { ?i wdt:P17 ?c } }`);
const countries = JSON.parse(readFileSync(join(ROOT, 'public/data/countries.json'), 'utf8')).countries;
const cName = new Map(countries.map(c => [c.id, c.name]));
const byName = new Map(countries.map(c => [c.name, c]));

const places = [];
for (const q of ids) {
  const r = rows.filter(x => qid(x.i.value) === q);
  const art = r.find(x => x.article)?.article.value;
  const name = art ? decodeURIComponent(art.split('/wiki/')[1]).replace(/_/g, ' ').replace(/ \(.*\)$/, '') : feats.find(f => f.properties.WIKIDATAID === q).properties.NAME;
  const areaM2 = r.map(x => +x.area?.value).filter(Boolean)[0]; // normalised to m²
  const area = areaM2 ? Math.round(areaM2 / 1e6) : null;
  const cs = [...new Set(r.map(x => x.c && qid(x.c.value)).filter(c => c && cName.has(c)))].map(c => cName.get(c)).sort();
  const pts = feats.filter(f => f.properties.WIKIDATAID === q).flatMap(f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates)).flat(2);
  const lon = pts.reduce((a, p) => a + p[0], 0) / pts.length, lat = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  places.push({
    id: q, layer: 'desert', name, nameThe: /^(the )?/i.test(name) && !/^Lut|^Dasht/.test(name) ? `the ${name}` : name,
    wiki: art ? decodeURIComponent(art.split('/wiki/')[1]) : null, image: r.find(x => x.img) ? decodeURIComponent(r.find(x => x.img).img.value.split('/').pop()) : null,
    lon: +lon.toFixed(2), lat: +lat.toFixed(2), size: area, group: GREAT.has(q) ? 'd-great' : 'd-more', capitals: [], capitalAnswer: null,
    // The last part lists the countries (the quiz's country filter and the Related links read it).
    facts: [area ? `${area.toLocaleString('en-US')} km²` : null, cs.length ? (cs.length > 5 ? cs.slice(0, 5).join(', ') + '…' : cs.join(', ')) : null].filter(Boolean).join(' · ') || undefined,
  });
}
places.sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
await addLocalNames(places, d => rangeLangs(d, byName), sparql);
await addRomaji(places);

let topo = presimplify(topology({ f: { type: 'FeatureCollection', features: feats.map(f => ({ type: 'Feature', geometry: f.geometry, properties: { id: f.properties.WIKIDATAID } })) } }, 1e5));
topo = simplify(topo, quantile(topo, 0.3));
topo.objects = { places: topo.objects.f };
writeFileSync(join(ROOT, 'public/data/shapes-desert.json'), JSON.stringify(topo));
writeFileSync(join(ROOT, 'public/data/deserts.json'), JSON.stringify({ source: 'Natural Earth, Wikidata (CC0)', places }, null, 1) + '\n');
console.log(`${places.length} deserts (${places.filter(p => p.group === 'd-great').length} best known) → deserts.json, shapes-desert.json`);
