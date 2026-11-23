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
import { addChinese } from './lib/chinese.mjs';
import { addRomaji } from './lib/japanese.mjs';

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
const LANG_NAMES = { grc: 'Ancient Greek', la: 'Latin', sa: 'Sanskrit', he: 'Hebrew', fa: 'Persian', akk: 'Akkadian', zh: 'Chinese', 'zh-hans': 'Chinese', 'zh-hant': 'Chinese', ja: 'Japanese', ko: 'Korean', it: 'Italian', fr: 'French', es: 'Spanish', de: 'German', nl: 'Dutch', no: 'Norwegian', nb: 'Norwegian', pt: 'Portuguese', ar: 'Arabic', el: 'Greek', hi: 'Hindi', ca: 'Catalan', la: 'Latin', ru: 'Russian', fa: 'Persian' };
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
  const kind = (/^kind:\s*(\w+)\s*$/m.exec(text.split('\n---')[0]) ?? [])[1];
  return { path, lines, entries, building: kind === 'building', book: kind === 'book', music: kind === 'music', person: kind === 'person' };
});
// Buildings stand where they are: their own place and town, never a "museum" (a location like Champ de Mars).
// (Filled in after step 2, once titles have their ids.)
const BUILDINGS = new Set();
// Books: the author is the maker, the date is when it was published, the language is the one it was written in.
const BOOKS = new Set();
// Music: the composer is the maker; the clips (♪ lines) are read by the app, not here.
const MUSIC = new Set();
// People: their portrait, life, birthplace (with its US state, or region) and instruments.
const PEOPLE = new Set();

// ---- 2. Find ids for entries written as Wikipedia titles, and write them back --------------------
const unresolved = lists.flatMap(l => l.entries.filter(e => !e.id && e.text));
if (unresolved.length) {
  // Wikidata writes article links the way MediaWiki does: percent-encoded, except ; : @ $ ! * ( ) , / ~ which stay as they are.
  const enc = t => `<https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_')).replace(/'/g, '%27').replace(/%(3B|3A|40|24|21|2A|28|29|2C|2F|7E)/g, (_, h) => String.fromCharCode(parseInt(h, 16)))}>`;
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

for (const l of lists) for (const e of l.entries) if (e.id) { if (l.building) BUILDINGS.add(e.id); if (l.book) BOOKS.add(e.id); if (l.music) MUSIC.add(e.id); if (l.person) PEOPLE.add(e.id); }

// ---- 3. Facts for every id ---------------------------------------------------------------------
const ids = [...new Set(lists.flatMap(l => l.entries.map(e => e.id).filter(Boolean)))];
const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { items: {} };
const items = {};
try {
  for (const part of chunks(ids, 50)) {
    const values = part.map(q => `wd:${q}`).join(' ');
    // Basics: name, Wikipedia article, picture, date, what it is, how well known.
    const basics = await sparql(`SELECT ?item ?itemLabel ?article ?image ?inception ?typeLabel ?links ?taxon WHERE { VALUES ?item { ${values} }
      OPTIONAL { ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> }
      OPTIONAL { ?item wdt:P18 ?image } OPTIONAL { ?item wdt:P571 ?inception } OPTIONAL { ?item wdt:P225 ?taxon } OPTIONAL { ?item wdt:P31 ?type }
      OPTIONAL { ?item wikibase:sitelinks ?links }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
    // Books: original language (P407, with its code for the name in that language), publication date, main subjects
    // and genres (turned into shelves by the app, through data/tags.json).
    const bookIds = part.filter(q => BOOKS.has(q));
    const bookInfo = bookIds.length ? await sparql(`SELECT ?item ?langLabel ?code ?pub ?subjectLabel ?genreLabel WHERE { VALUES ?item { ${bookIds.map(q => `wd:${q}`).join(' ')} }
      OPTIONAL { ?item wdt:P407 ?lang . OPTIONAL { ?lang wdt:P424 ?code } } OPTIONAL { ?item wdt:P577 ?pub }
      OPTIONAL { ?item wdt:P921 ?subject } OPTIONAL { ?item wdt:P136 ?genre }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`) : [];
    // Music: the composer's portrait, life and the (present-day) country of their birthplace, for the flag.
    const musicIds = part.filter(q => MUSIC.has(q));
    const composers = musicIds.length ? await sparql(`SELECT ?item ?c ?cLabel ?img ?born ?died ?land ?landLabel WHERE { VALUES ?item { ${musicIds.map(q => `wd:${q}`).join(' ')} }
      ?item wdt:P86 ?c . OPTIONAL { ?c wdt:P18 ?img } OPTIONAL { ?c wdt:P569 ?born } OPTIONAL { ?c wdt:P570 ?died }
      OPTIONAL { ?c wdt:P19 ?bp . ?bp wdt:P17 ?land . FILTER NOT EXISTS { ?land wdt:P576 [] } }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`) : [];
    const peopleIds = part.filter(q => PEOPLE.has(q));
    const people = peopleIds.length ? await sparql(`SELECT ?item ?born ?died ?bp ?bpLabel ?state ?stateLabel ?land ?landLabel ?instLabel WHERE { VALUES ?item { ${peopleIds.map(q => `wd:${q}`).join(' ')} }
      OPTIONAL { ?item wdt:P569 ?born } OPTIONAL { ?item wdt:P570 ?died } OPTIONAL { ?item wdt:P1303 ?inst }
      OPTIONAL { ?item wdt:P19 ?bp . OPTIONAL { ?bp wdt:P17 ?land } OPTIONAL { ?bp wdt:P131* ?state . ?state wdt:P31 wd:Q35657 } }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`) : [];
    // A building's architectural style (P149).
    const styles = await sparql(`SELECT ?item ?styleLabel WHERE { VALUES ?item { ${values} } ?item wdt:P149 ?style .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
    // Who made it (an artist or, for a building, its architect; for ancient work, the culture).
    const makers = await sparql(`SELECT ?item ?maker ?makerLabel ?culture ?cultureLabel WHERE { VALUES ?item { ${values} }
      OPTIONAL { ?item wdt:P170|wdt:P84|wdt:P50|wdt:P86 ?maker . FILTER(isIRI(?maker)) FILTER NOT EXISTS { ?maker wdt:P31 wd:Q4233718 } }
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
    // The name in its own language: the language of the country the work comes from (P495 country of origin, else the
    // artist's country, else the country it stands in), never the museum's. Chinese also gets pinyin (lib/chinese.mjs).
    const origins = await sparql(`SELECT ?item ?origin ?citizen ?own WHERE { VALUES ?item { ${values} }
      OPTIONAL { ?item wdt:P495 ?origin } OPTIONAL { ?item wdt:P170 ?m . ?m wdt:P27 ?citizen } OPTIONAL { ?item wdt:P17 ?own } }`);
    const lands = [...new Set(origins.flatMap(r => ['origin', 'citizen', 'own'].map(k => r[k] && qid(r[k].value))).filter(Boolean))];
    const landLangs = new Map(); // country → its first official language code ('' for English-speaking ones)
    if (lands.length) for (const r of await sparql(`SELECT ?c ?code WHERE { VALUES ?c { ${lands.map(q => `wd:${q}`).join(' ')} } ?c p:P37 ?st . ?st ps:P37 ?l . ?l wdt:P424 ?code . FILTER NOT EXISTS { ?st pq:P582 [] } }`)) {
      const c = qid(r.c.value), code = val(r, 'code');
      const prev = landLangs.get(c);
      if (prev === undefined || (prev === '' && false)) landLangs.set(c, /^en/.test(code) ? '' : code);
    }
    landLangs.set('Q148', 'zh-hans'); landLangs.set('Q40', 'de'); landLangs.set('Q30', ''); landLangs.set('Q145', ''); landLangs.set('Q408', '');
    const langOf = q => {
      if (BOOKS.has(q)) { const code = bookInfo.find(r => qid(r.item.value) === q && val(r, 'code'))?.code?.value; if (code) return /^en/.test(code) ? '' : code === 'zh' ? 'zh-hans' : code; }
      const rs = origins.filter(r => qid(r.item.value) === q);
      for (const k of ['origin', 'citizen', 'own']) for (const r of rs) { const c = r[k] && qid(r[k].value); if (c && landLangs.has(c)) return landLangs.get(c); }
      return null;
    };
    const wantCodes = [...new Set(part.map(langOf).filter(Boolean).flatMap(c => (c === 'zh-hans' ? ['zh-hans', 'zh'] : [c])))];
    const localLabels = wantCodes.length ? await sparql(`SELECT ?item ?l WHERE { VALUES ?item { ${values} } { ?item rdfs:label ?l } UNION { ?item wdt:P1476 ?l } FILTER(LANG(?l) IN (${wantCodes.map(c => `"${c}"`).join(',')})) }`) : [];
    for (const q of part) {
      const b = basics.filter(r => qid(r.item.value) === q);
      if (!b.length) continue;
      const bi = bookInfo.filter(r => qid(r.item.value) === q);
      const year = [...b.map(r => yearOf(val(r, 'inception'))), ...bi.map(r => yearOf(val(r, 'pub')))].filter(y => y != null).sort((a, z) => a - z)[0];
      const types = [...new Set(b.map(r => label(r, 'typeLabel')).filter(Boolean))];
      const mk = makers.filter(r => qid(r.item.value) === q);
      const artists = [...new Map(mk.filter(r => r.maker && label(r, 'makerLabel')).map(r => [qid(r.maker.value), label(r, 'makerLabel')])).values()];
      const cultures = [...new Set(mk.map(r => label(r, 'cultureLabel')).filter(Boolean))];
      const w = where.filter(r => qid(r.item.value) === q);
      // Prefer the collection (the museum) if it has a position, then the location.
      const spot = BUILDINGS.has(q) || BOOKS.has(q) || MUSIC.has(q) || PEOPLE.has(q) ? null : ['P195', 'P276'].map(p => w.find(r => val(r, 'prop') === p && r.coord)).find(Boolean) ?? null;
      const own = w.find(r => r.ownCoord) ?? w[0];
      const coord = point(spot ? val(spot, 'coord') : own && val(own, 'ownCoord'));
      const country = spot?.country ? { id: qid(spot.country.value), name: label(spot, 'countryLabel') } : own?.ownCountry ? { id: qid(own.ownCountry.value), name: label(own, 'ownCountryLabel') } : null;
      items[q] = {
        // The Wikipedia title reads best ("Nefertiti Bust", "Moai"); Wikidata labels can be lower-case or in Spanish.
        name: b[0].article ? decodeURIComponent(b[0].article.value.split('/wiki/')[1]).replace(/_/g, ' ').replace(/ \(.*\)$/, '') : label(b[0], 'itemLabel'),
        wiki: b[0].article ? decodeURIComponent(b[0].article.value.split('/wiki/')[1]) : null,
        image: b.map(r => file(val(r, 'image'))).find(Boolean) ?? null,
        species: b.map(r => val(r, 'taxon')).find(Boolean) ?? null, // plants and animals: the scientific name (Juniperus communis)
        year: year ?? null,
        types,
        artists,
        culture: cultures[0] ?? null,
        ...(BOOKS.has(q) ? { book: true, language: bi.map(r => label(r, 'langLabel')).find(Boolean) ?? null,
          subjects: [...new Set(bi.map(r => label(r, 'subjectLabel')).filter(Boolean))], genres: [...new Set(bi.map(r => label(r, 'genreLabel')).filter(Boolean))] } : {}),
        ...(PEOPLE.has(q) ? { person: (() => { const rs = people.filter(x => qid(x.item.value) === q); const r = rs.find(x => x.state) ?? rs[0]; return r ? {
          born: yearOf(val(r, 'born')), died: yearOf(val(r, 'died')), birthplace: label(r, 'bpLabel'), state: label(r, 'stateLabel'), stateId: r.state ? qid(r.state.value) : null,
          country: r.land ? qid(r.land.value) : null, countryName: label(r, 'landLabel'), instruments: [...new Set(rs.map(x => label(x, 'instLabel')).filter(Boolean))] } : null; })() } : {}),
        ...(MUSIC.has(q) ? { composer: (() => { const r = composers.find(x => qid(x.item.value) === q); return r ? { id: qid(r.c.value), name: label(r, 'cLabel'), image: file(val(r, 'img')) ?? null, born: yearOf(val(r, 'born')), died: yearOf(val(r, 'died')), country: r.land ? qid(r.land.value) : null, countryName: label(r, 'landLabel') } : null; })() } : {}),
        style: styles.filter(r => qid(r.item.value) === q).map(r => label(r, 'styleLabel')).find(Boolean) ?? null, // architecture: Gothic, Beaux-Arts…
        museum: spot ? label(spot, 'placeLabel') : null,
        museumId: spot ? qid(spot.place.value) : null, museumWiki: null, // its Wikipedia article (below), for the Related links
        city: spot ? town(spot, ['c1Label', 'c2Label', 'c3Label']) : own ? town(own, ['o1Label', 'o2Label', 'o3Label']) : null,
        country: country?.id ?? null, countryName: country?.name ?? null,
        lon: coord?.lon ?? null, lat: coord?.lat ?? null,
        links: +(val(b[0], 'links') ?? 0),
        native: (() => {
          const code = langOf(q);
          if (!code) return [];
          const name = b[0].article ? decodeURIComponent(b[0].article.value.split('/wiki/')[1]).replace(/_/g, ' ').replace(/ \(.*\)$/, '') : '';
          // The shortest name in that language reads best ("De Nachtwacht", not the 150-character catalogue title).
          const ls = localLabels.filter(r => qid(r.item.value) === q && (r.l['xml:lang'] === code || (code === 'zh-hans' && r.l['xml:lang'] === 'zh'))).map(r => r.l.value).sort((x, y) => x.length - y.length);
          const text = ls[0];
          if (!text || text.toLowerCase() === name.toLowerCase()) return [];
          return [{ name: text, lang: LANG_NAMES[code] ?? LANG_NAMES[code.split('-')[0]] ?? code, code }];
        })(),
      };
    }
  }
  // The museums' Wikipedia articles ("Belvedere" → "Österreichische Galerie Belvedere"), in one small query.
  const mids = [...new Set(Object.values(items).map(x => x.museumId).filter(Boolean))];
  const arts = new Map();
  for (const part of chunks(mids, 80)) for (const r of await sparql(`SELECT ?m ?a WHERE { VALUES ?m { ${part.map(q => `wd:${q}`).join(' ')} } ?a schema:about ?m ; schema:isPartOf <https://en.wikipedia.org/> }`))
    arts.set(qid(r.m.value), decodeURIComponent(r.a.value.split('/wiki/')[1]).replace(/_/g, ' '));
  for (const x of Object.values(items)) x.museumWiki = arts.get(x.museumId) ?? null;
} catch (e) {
  console.warn(`${e.message}: keeping the facts from the last sync`);
  Object.assign(items, old.items);
}
for (const q of ids) if (!items[q] && old.items[q]) items[q] = old.items[q]; // a lookup that failed this time keeps last time's facts

// Fixes kept by hand (Wikidata sometimes lists a room, or a museum without a city).
const fixes = JSON.parse(readFileSync(join(ROOT, 'data/collection-fixes.json'), 'utf8'));
for (const x of Object.values(items)) if (x.city && fixes._cities?.[x.city]) x.city = fixes._cities[x.city];
// A museum set by hand replaces Wikidata's, and its article with it (unless the fix names the article too).
for (const [q, f] of Object.entries(fixes)) if (items[q] && !q.startsWith('_')) Object.assign(items[q], 'museum' in f && !('museumWiki' in f) ? { museumWiki: null } : {}, f);

await addRomaji(items);
writeFileSync(OUT, JSON.stringify(addChinese({ source: 'Wikidata (CC0)', items })));
const missing = ids.filter(q => !items[q]);
console.log(`${files.length} list(s), ${ids.length} entries → ${relative(ROOT, OUT)}${missing.length ? ` (no facts for ${missing.join(', ')})` : ''}`);
for (const [q, x] of Object.entries(items)) {
  const gaps = [!x.image && !x.composer && 'picture', !x.person && !x.artists.length && !x.culture && 'maker', !x.book && !x.composer && !x.person && !x.museum && !x.city && 'place', !x.book && !x.composer && !x.person && !x.country && 'country', x.book && !x.language && 'language'].filter(Boolean);
  if (gaps.length) console.log(`  ${q} ${x.name}: no ${gaps.join(', ')}`);
}
