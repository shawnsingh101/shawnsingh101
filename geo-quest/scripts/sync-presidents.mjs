#!/usr/bin/env node
// US presidents: the hand-checked list in data/presidents.json, plus each person's portrait (Wikidata P18) and
// Wikipedia article. Writes public/data/presidents.json. If Wikidata can't be reached, the last pictures are kept.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/data/presidents.json');
const { terms } = JSON.parse(readFileSync(join(ROOT, 'data/presidents.json'), 'utf8'));
const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).people : [];
const ids = [...new Set(terms.map(t => t.id))];
const facts = new Map(old.map(p => [p.id, { image: p.image, wiki: p.wiki }]));
try {
  const q = `SELECT ?p ?img ?article WHERE { VALUES ?p { ${ids.map(i => `wd:${i}`).join(' ')} } OPTIONAL { ?p wdt:P18 ?img }
    OPTIONAL { ?article schema:about ?p ; schema:isPartOf <https://en.wikipedia.org/> } }`;
  const r = await fetch('https://query.wikidata.org/sparql', { method: 'POST', headers: { 'User-Agent': 'GeoQuestStudyApp/0.1 (personal flashcard app)', Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ query: q }) });
  if (!r.ok) throw new Error(`Wikidata ${r.status}`);
  for (const b of (await r.json()).results.bindings) {
    const id = b.p.value.split('/').pop(), f = facts.get(id) ?? {};
    facts.set(id, { image: b.img ? decodeURIComponent(b.img.value.split('/').pop()) : f.image ?? null, wiki: b.article ? decodeURIComponent(b.article.value.split('/wiki/')[1]) : f.wiki ?? null });
  }
} catch (e) { console.warn(`${e.message}: keeping the last pictures`); }
// One entry per person, with every presidency they held.
const people = ids.map(id => {
  const ts = terms.filter(t => t.id === id);
  return { id, name: ts[0].name, ...facts.get(id), terms: ts.map(({ n, from, to, party, vp }) => ({ n, from, to, party, vp })) };
});
writeFileSync(OUT, JSON.stringify({ source: 'data/presidents.json; portraits from Wikidata (CC0) / Wikimedia Commons', people }, null, 1) + '\n');
console.log(`${people.length} presidents (${terms.length} presidencies) → public/data/presidents.json`);
