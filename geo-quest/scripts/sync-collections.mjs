#!/usr/bin/env node
// Collections: lists of Wikipedia things (artworks first) kept as Markdown in collections/.
// For every entry this finds its Wikidata id (writing it back into the list), then pulls the facts a card needs:
// name, picture, who made it, when, and where it is now. Writes public/data/collections.json.
//
//   node scripts/sync-collections.mjs
//
// If Wikidata can't be reached, the facts already in collections.json are kept.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'collections');
const OUT = join(ROOT, 'public/data/collections.json');
const UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)';

async function sparql(query) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch('https://query.wikidata.org/sparql', {
        method: 'POST',
        headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ query }), signal: AbortSignal.timeout(90000),
      });
      if (res.ok) return (await res.json()).results.bindings;
      console.warn(`Wikidata answered ${res.status}, retry ${attempt}/4`);
    } catch (e) { console.warn(`Wikidata unreachable (${e.message}), retry ${attempt}/4`); }
    await new Promise(r => setTimeout(r, 15000 * attempt));
  }
  throw new Error('Wikidata query failed');
}
const qid = uri => uri && uri.split('/').pop();
const file = uri => uri && decodeURIComponent(uri.split('/').pop());
const point = wkt => { const m = wkt && /Point\(([-\d.eE]+) ([-\d.eE]+)\)/.exec(wkt); return m ? { lon: +(+m[1]).toFixed(3), lat: +(+m[2]).toFixed(3) } : null; };
const val = (b, k) => b[k]?.value;
const label = (b, k) => { const x = val(b, k); return x && !/^Q\d+$/.test(x) && !/^https?:/.test(x) ? x : null; }; // not a bare id, not an "unknown value"
// The town: walk up "located in" past districts and boroughs (Louvre → 1st arrondissement → Paris).
const SMALL = /arrondissement|borough|district|ward\b|centrum|mitte|quarter|neighbo|municipality of|Manhattan|Kensington|Westminster|Camden|Vatican Museums|Bezirk|Innere Stadt|Landstraße|^Centro|Sestiere|Quartiere|Retiro|Mid-?town|Downtown|Loop/i;
const town = (b, keys) => keys.map(k => label(b, k)).find(x => x && !SMALL.test(x)) ?? null;
const yearOf = d => { const m = /^(-?\d+)-/.exec(d ?? ''); return m ? +m[1] : null; };
const chunks = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

// ---- 1. Read the lists -----------------------------------------------------------------------
function walk(dir) { return readdirSync(dir).flatMap(f => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.md$/.test(f) && !/^README\.md$/i.test(f) ? [p] : []; }); }
const files = walk(DIR);
const lists = files.map(path => {
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n');
  const entries = [];
  let heading = null, inFm = false;
  lines.forEach((line, i) => {
    if (i === 0 && line === '---') { inFm = true; return; }
    if (inFm) { if (line === '---') inFm = false; return; }
    const h = /^##\s+(.*)$/.exec(line); if (h) { heading = h[1].trim(); return; }
    const m = /^-\s+(?:(Q\d+)\s*)?(.*)$/.exec(line.trim()); if (!m) return;
    entries.push({ line: i, id: m[1] ?? null, text: m[2].trim(), heading });
  });
  return { path, lines, entries };
});

// ---- 2. Find ids for entries written as Wikipedia titles, and write them back --------------------
const unresolved = lists.flatMap(l => l.entries.filter(e => !e.id && e.text));
if (unresolved.length) {
  const enc = t => `<https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_')).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}>`;
  const found = new Map();
  for (const part of chunks(unresolved, 60)) {
    // Titles may be redirects ("Guernica (Picasso)" → "Guernica (Picasso painting)"): follow them.
    const rows = await sparql(`SELECT ?a ?item WHERE { VALUES ?a { ${part.map(e => enc(e.text)).join(' ')} } ?a schema:isPartOf <https://en.wikipedia.org/> .
      { ?a schema:about ?item } }`);
    for (const r of rows) found.set(decodeURIComponent(r.a.value.split('/wiki/')[1]).replace(/_/g, ' '), qid(r.item.value));
  }
  // Redirects aren't in Wikidata: ask Wikipedia where they lead.
  const missing = unresolved.filter(e => !found.has(e.text));
  if (missing.length) {
    try {
      for (const part of chunks(missing, 40)) {
        const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(part.map(e => e.text).join('|'))}`;
        const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
        const back = new Map();
        for (const r of [...(j.query.normalized ?? []), ...(j.query.redirects ?? [])]) back.set(r.to, back.get(r.from) ?? r.from);
        for (const p of Object.values(j.query.pages ?? {})) if (p.pageprops?.wikibase_item) {
          let t = p.title; const chain = [t]; while (back.has(t)) { t = back.get(t); chain.push(t); }
          for (const c of chain) found.set(c, p.pageprops.wikibase_item);
        }
      }
    } catch (e) { console.warn('Wikipedia lookup failed:', e.message); }
  }
  for (const l of lists) {
    let changed = false;
    for (const e of l.entries) if (!e.id && found.has(e.text)) { e.id = found.get(e.text); l.lines[e.line] = `- ${e.id} ${e.text}`; changed = true; }
    if (changed) writeFileSync(l.path, l.lines.join('\n'));
  }
  for (const e of unresolved.filter(e => !e.id)) console.warn(`Not found on Wikipedia: "${e.text}" — check the title`);
}

// ---- 3. Facts for every id ---------------------------------------------------------------------
const ids = [...new Set(lists.flatMap(l => l.entries.map(e => e.id).filter(Boolean)))];
const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { items: {} };
const items = {};
try {
  for (const part of chunks(ids, 50)) {
    const values = part.map(q => `wd:${q}`).join(' ');
    // Basics: name, Wikipedia article, picture, date, what it is, how well known.
    const basics = await sparql(`SELECT ?item ?itemLabel ?article ?image ?inception ?typeLabel ?links WHERE { VALUES ?item { ${values} }
      OPTIONAL { ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> }
      OPTIONAL { ?item wdt:P18 ?image } OPTIONAL { ?item wdt:P571 ?inception } OPTIONAL { ?item wdt:P31 ?type }
      OPTIONAL { ?item wikibase:sitelinks ?links }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
    // Who made it (an artist, or for ancient work, the culture).
    const makers = await sparql(`SELECT ?item ?maker ?makerLabel ?culture ?cultureLabel WHERE { VALUES ?item { ${values} }
      OPTIONAL { ?item wdt:P170 ?maker . FILTER(isIRI(?maker)) FILTER NOT EXISTS { ?maker wdt:P31 wd:Q4233718 } }
      OPTIONAL { ?item wdt:P2596 ?culture }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
    // Where it is: the museum that holds it (P195 collection, else P276 location), its city and country; or the work's own spot.
    // A "Department of Paintings of the Louvre" or a gallery room is part of (P361) the museum: use the museum.
    const where = await sparql(`SELECT ?item ?prop ?place ?placeLabel ?coord ?c1Label ?c2Label ?c3Label ?o1Label ?o2Label ?o3Label ?country ?countryLabel ?ownCoord ?ownCountry ?ownCountryLabel WHERE { VALUES ?item { ${values} }
      OPTIONAL { VALUES ?prop { "P195" "P276" } ?item ?p ?held . FILTER(?p = IRI(CONCAT(STR(wdt:), ?prop)))
        OPTIONAL { ?held wdt:P361 ?whole . ?held rdfs:label ?hl . FILTER(LANG(?hl) = "en" && REGEX(?hl, "^(Department|Room|Salle|Gallery [0-9])", "i")) }
        BIND(COALESCE(?whole, ?held) AS ?place)
        OPTIONAL { ?place wdt:P625 ?coord } OPTIONAL { ?place wdt:P131 ?c1 . OPTIONAL { ?c1 wdt:P131 ?c2 . OPTIONAL { ?c2 wdt:P131 ?c3 } } }
        OPTIONAL { ?place wdt:P17 ?country } }
      OPTIONAL { ?item wdt:P625 ?ownCoord } OPTIONAL { ?item wdt:P131 ?o1 . OPTIONAL { ?o1 wdt:P131 ?o2 . OPTIONAL { ?o2 wdt:P131 ?o3 } } }
      OPTIONAL { ?item wdt:P17 ?ownCountry }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
    for (const q of part) {
      const b = basics.filter(r => qid(r.item.value) === q);
      if (!b.length) continue;
      const year = b.map(r => yearOf(val(r, 'inception'))).filter(y => y != null).sort((a, z) => a - z)[0];
      const types = [...new Set(b.map(r => label(r, 'typeLabel')).filter(Boolean))];
      const mk = makers.filter(r => qid(r.item.value) === q);
      const artists = [...new Map(mk.filter(r => r.maker && label(r, 'makerLabel')).map(r => [qid(r.maker.value), label(r, 'makerLabel')])).values()];
      const cultures = [...new Set(mk.map(r => label(r, 'cultureLabel')).filter(Boolean))];
      const w = where.filter(r => qid(r.item.value) === q);
      // Prefer the collection (the museum) if it has a position, then the location.
      const spot = ['P195', 'P276'].map(p => w.find(r => val(r, 'prop') === p && r.coord)).find(Boolean) ?? null;
      const own = w.find(r => r.ownCoord) ?? w[0];
      const coord = point(spot ? val(spot, 'coord') : own && val(own, 'ownCoord'));
      const country = spot?.country ? { id: qid(spot.country.value), name: label(spot, 'countryLabel') } : own?.ownCountry ? { id: qid(own.ownCountry.value), name: label(own, 'ownCountryLabel') } : null;
      items[q] = {
        // The Wikipedia title reads best ("Nefertiti Bust", "Moai"); Wikidata labels can be lower-case or in Spanish.
        name: b[0].article ? decodeURIComponent(b[0].article.value.split('/wiki/')[1]).replace(/_/g, ' ').replace(/ \(.*\)$/, '') : label(b[0], 'itemLabel'),
        wiki: b[0].article ? decodeURIComponent(b[0].article.value.split('/wiki/')[1]) : null,
        image: b.map(r => file(val(r, 'image'))).find(Boolean) ?? null,
        year: year ?? null,
        types,
        artists,
        culture: cultures[0] ?? null,
        museum: spot ? label(spot, 'placeLabel') : null,
        city: spot ? town(spot, ['c1Label', 'c2Label', 'c3Label']) : own ? town(own, ['o1Label', 'o2Label', 'o3Label']) : null,
        country: country?.id ?? null, countryName: country?.name ?? null,
        lon: coord?.lon ?? null, lat: coord?.lat ?? null,
        links: +(val(b[0], 'links') ?? 0),
      };
    }
  }
} catch (e) {
  console.warn(`${e.message}: keeping the facts from the last sync`);
  Object.assign(items, old.items);
}
for (const q of ids) if (!items[q] && old.items[q]) items[q] = old.items[q]; // a lookup that failed this time keeps last time's facts

// Fixes kept by hand (Wikidata sometimes lists a room, or a museum without a city).
const fixes = JSON.parse(readFileSync(join(ROOT, 'data/collection-fixes.json'), 'utf8'));
for (const x of Object.values(items)) if (x.city && fixes._cities?.[x.city]) x.city = fixes._cities[x.city];
for (const [q, f] of Object.entries(fixes)) if (items[q] && !q.startsWith('_')) Object.assign(items[q], f);

writeFileSync(OUT, JSON.stringify({ source: 'Wikidata (CC0)', items }));
const missing = ids.filter(q => !items[q]);
console.log(`${files.length} list(s), ${ids.length} entries → ${relative(ROOT, OUT)}${missing.length ? ` (no facts for ${missing.join(', ')})` : ''}`);
for (const [q, x] of Object.entries(items)) {
  const gaps = [!x.image && 'picture', !x.artists.length && !x.culture && 'maker', !x.museum && !x.city && 'place', !x.country && 'country'].filter(Boolean);
  if (gaps.length) console.log(`  ${q} ${x.name}: no ${gaps.join(', ')}`);
}
