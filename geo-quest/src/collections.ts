// Collections: lists of Wikipedia things kept as Markdown in geo-quest/collections/ (see collections/README.md).
// The lists give the structure (subject › sections › deck, and which works are in it); the facts for each entry
// come from public/data/collections.json, filled in from Wikidata by scripts/sync-collections.mjs.
import type { Chinese, NativeName, Place } from './types';
import { GROUPS, SECTIONS, SECTION_PARENT } from './cards';

export interface CollectionList { id: string; title: string; subject: string; path: string[]; intro: string | null; entries: { id: string; heading: string | null }[] }
export interface ArtFacts {
  name: string | null; nameThe?: string | null; museumWiki?: string | null;
  plural?: boolean; species?: string | null; native?: NativeName[]; zh?: Chinese | null; // native: its name in its own language (Chinese with pinyin)
  wiki: string | null; image: string | null; year: number | null; types: string[];
  artists: string[]; culture: string | null; museum: string | null; city: string | null;
  country: string | null; countryName: string | null; lon: number | null; lat: number | null; links: number;
}

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function parseList(file: string, text: string): CollectionList {
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const meta: Record<string, string> = {};
  for (const line of fm?.[1].split('\n') ?? []) { const m = /^(\w+):\s*(.*)$/.exec(line); if (m) meta[m[1]] = m[2].trim(); }
  const body = fm ? text.slice(fm[0].length) : text;
  const parts = file.replace(/^.*collections\//, '').replace(/\.md$/, '').split('/');
  const subject = parts[0], path = parts.slice(1, -1), title = meta.title || parts[parts.length - 1];
  const entries: CollectionList['entries'] = [], intro: string[] = [];
  let heading: string | null = null;
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    const h = /^##\s+(.*)$/.exec(line);
    if (h) { heading = h[1]; continue; }
    const e = /^-\s+(Q\d+)\b/.exec(line); // lines without an id yet are waiting for the sync
    if (e) { if (!entries.some(x => x.id === e[1])) entries.push({ id: e[1], heading }); continue; }
    if (line && !heading && !line.startsWith('-') && !line.startsWith('#')) intro.push(line);
  }
  return { id: 'c-' + slug([subject, ...path, title].join(' ')), title, subject, path, intro: intro.join(' ') || null, entries };
}

let files: Record<string, string> = {};
try { files = import.meta.glob('../collections/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>; } catch { /* not built by Vite */ }
export const LISTS: CollectionList[] = Object.entries(files).filter(([f]) => !/README\.md$/i.test(f)).map(([f, t]) => parseList(f, t))
  .sort((a, b) => a.subject.localeCompare(b.subject) || a.path.join('/').localeCompare(b.path.join('/')) || a.title.localeCompare(b.title));
export const COLLECTION_SUBJECTS = [...new Set(LISTS.map(l => l.subject))];

// What it is, in a plain word: Wikidata says "fresco painting", "colossal statue", "group of casts", "emblem"…
const KINDS = ['triptych', 'fresco', 'mural', 'woodblock print', 'mosaic', 'death mask', 'mask', 'bust', 'statue', 'relief', 'sculpture', 'painting', 'gate', 'manuscript', 'stele'];
const kindOf = (types: string[]) => { for (const k of KINDS) if (types.some(t => t.toLowerCase().includes(k))) return k; return null; };
/** "c. 1503", "c. 2560 BC" */
export const fmtYear = (y: number | null | undefined) => (y == null ? null : y <= 0 ? `c. ${Math.abs(y) || 1} BC` : y < 1000 ? `c. AD ${y}` : `c. ${y}`);

/** Register each list as a deck (group) under its subject › sections, and return its works as places. */
export function registerCollections(facts: Record<string, ArtFacts>, countryName: (id: string) => string | undefined): Place[] {
  const out = new Map<string, Place>();
  for (const l of LISTS) {
    const chain = [l.subject, ...l.path];
    chain.forEach((sec, i) => { if (!SECTIONS.includes(sec)) SECTIONS.push(sec); if (i) SECTION_PARENT[sec] = chain[i - 1]; });
    if (!GROUPS.some(g => g.id === l.id)) GROUPS.push({ id: l.id, section: chain[chain.length - 1], name: l.title, layer: 'art', nouns: 'works', topics: [{ id: 'art', name: 'Works', icon: 'image' }], note: l.intro ?? undefined });
    for (const e of l.entries) {
      const f = facts[e.id];
      if (!f?.name) continue; // not synced yet
      const seen = out.get(e.id);
      if (seen) { seen.alsoIn = [...(seen.alsoIn ?? []), l.id]; continue; } // one work, one set of progress
      // "the Louvre Museum, Paris": museums take "the" (not churches, temples or mountains named for a saint or a place).
      const museum = f.museum && !/^(the |Santa |San |St\.? |Saint |Corcovado|Kōtoku-in|Rijksmuseum|Mauritshuis)/i.test(f.museum) ? `the ${f.museum}` : f.museum;
      const where = [museum, f.city && !f.museum?.includes(f.city) ? f.city : null].filter(Boolean).join(', ');
      const cName = (f.country && countryName(f.country)) || f.countryName || null;
      out.set(e.id, {
        id: e.id, layer: 'art', group: l.id, name: f.name, nameThe: f.nameThe ?? undefined, species: f.species ?? undefined, native: f.native?.length ? f.native : undefined, zh: f.zh ?? null, museumName: f.museum, museumWiki: f.museumWiki ?? null, city: f.city, plural: f.plural, wiki: f.wiki, image: f.image, capitals: [], capitalAnswer: null,
        lon: f.lon ?? undefined, lat: f.lat ?? undefined, country: f.country ?? undefined, countryName: cName ?? undefined,
        artists: f.artists, culture: f.culture, year: f.year, museum: where || null, origin: e.heading,
        facts: [fmtYear(f.year), kindOf(f.types), e.heading ? `from ${e.heading.replace(/^The /, 'the ')}` : null].filter(Boolean).join(' · ') || undefined,
      });
    }
  }
  return [...out.values()];
}
