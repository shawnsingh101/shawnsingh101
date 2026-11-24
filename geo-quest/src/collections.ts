// Collections: lists of Wikipedia things kept as Markdown in geo-quest/collections/ (see collections/README.md).
// The lists give the structure (subject › sections › deck, and which works are in it); the facts for each entry
// come from public/data/collections.json, filled in from Wikidata by scripts/sync-collections.mjs.
import type { Chinese, Composer, NativeName, Origin, PersonFacts, Place } from './types';
import { GROUPS, claimSection, sectionChain } from './cards';
import { NOTE_SUBJECTS } from './notes';
import { languageOf, literatureOf, topicsOf } from './tags';
import { rangeFrom } from './geotime';
/** Subjects other than the collections' own (a shelf named like one is shown there too). */
const OTHER_SUBJECTS = () => NOTE_SUBJECTS;

export interface CollectionList { file: string; id: string; building: boolean; book: boolean; music: boolean; person: boolean; taxon: boolean; deep: boolean; title: string; subject: string; path: string[]; intro: string | null; entries: { id: string; heading: string | null; note?: string; branch?: string; age?: string; clips?: { label: string | null; file: string; start: number }[] }[] }
export interface ArtFacts {
  name: string | null; nameThe?: string | null; museumWiki?: string | null;
  plural?: boolean; species?: string | null; native?: NativeName[]; zh?: Chinese | null; // native: its name in its own language (Chinese with pinyin)
  wiki: string | null; image: string | null; year: number | null; types: string[];
  artists: string[]; culture: string | null; style?: string | null;
  museum: string | null; city: string | null;
  book?: boolean; language?: string | null; subjects?: string[]; genres?: string[]; topics?: string[]; // books
  composer?: Composer | null; // music
  makerNative?: NativeName[]; // the maker's name in their own language
  makerOrigin?: Origin;
  person?: PersonFacts | null; // people
  taxon?: boolean; rangeMap?: string | null; status?: string | null; fossil?: string | null; // animals and plants
  fossilRange?: { text: string; ma: number[] | null; source: string } | null; // when it lived, from its Wikipedia article
  country: string | null; countryName: string | null; lon: number | null; lat: number | null; links: number;
}

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function parseList(file: string, text: string): CollectionList {
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const meta: Record<string, string> = {};
  for (const line of fm?.[1].split('\n') ?? []) { const m = /^(\w+):\s*(.*)$/.exec(line); if (m) meta[m[1]] = m[2].trim(); }
  const body = fm ? text.slice(fm[0].length) : text;
  // A number in front of a folder or file name only sets the order ("3 European/1 Renaissance").
  const parts = file.replace(/^.*collections\//, '').replace(/\.md$/, '').split('/').map(p => p.replace(/^\d+\s+/, ''));
  const subject = parts[0], path = parts.slice(1, -1), title = meta.title || parts[parts.length - 1];
  const entries: CollectionList['entries'] = [], intro: string[] = [];
  let heading: string | null = null;
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    const h = /^##\s+(.*)$/.exec(line);
    if (h) { heading = h[1]; continue; }
    const e = /^-\s+(Q\d+)\b(.*)$/.exec(line); // lines without an id yet are waiting for the sync
    // "- Q42196 Blue whale | in every ocean…": the note after " | " (where it lives); a dinosaur adds its age (stage) after a
    // second " | " ("Maastrichtian", "Kimmeridgian–Tithonian"). "## Rorquals | Balaenopteridae": the heading names the
    // group's place in the tree of life (src/tree.ts).
    if (e) { const bits = e[2].split(' | ').map(x => x.trim()); if (!entries.some(x => x.id === e[1])) entries.push({ id: e[1], heading: heading?.split(' | ')[0] ?? null, branch: heading?.split(' | ')[1]?.trim(), note: bits[1] || undefined, age: bits[2] || undefined }); continue; }
    // Music: "♪ II. Adagio | File.ogg" (or "♪ II. Adagio | File.ogg @45" to start 45 seconds in) under its work.
    const clip = /^♪\s*([^|]*)\|\s*(.+?)(?:\s+@(\d+))?$/.exec(line);
    if (clip && entries.length) { const last = entries[entries.length - 1]; (last.clips ??= []).push({ label: clip[1].trim() || null, file: clip[2].trim(), start: +(clip[3] ?? 0) }); continue; }
    if (line && !heading && !line.startsWith('-') && !line.startsWith('#')) intro.push(line);
  }
  return { file, id: 'c-' + slug([subject, ...path, title].join(' ')), building: meta.kind === 'building', book: meta.kind === 'book', music: meta.kind === 'music', person: meta.kind === 'person', taxon: meta.kind === 'taxon', deep: meta.depth === 'deep', title, subject, path, intro: intro.join(' ') || null, entries };
}

let files: Record<string, string> = {};
try { files = import.meta.glob('../collections/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>; } catch { /* not built by Vite */ }
export const LISTS: CollectionList[] = Object.entries(files).filter(([f]) => !/README\.md$/i.test(f)).map(([f, t]) => parseList(f, t))
  // The first list holding a work owns its progress, so the starter list (no sub-folder) comes first, then folders in order.
  .sort((a, b) => a.subject.localeCompare(b.subject) || (a.path.length ? 1 : 0) - (b.path.length ? 1 : 0) || a.file.replace(/^.*collections\//, '').localeCompare(b.file.replace(/^.*collections\//, ''), 'en', { numeric: true }));
export const COLLECTION_SUBJECTS = [...new Set(LISTS.map(l => l.subject))];

// What it is, in a plain word: Wikidata says "fresco painting", "colossal statue", "group of casts", "emblem"…
const KINDS = ['triptych', 'fresco', 'mural', 'woodblock print', 'mosaic', 'death mask', 'mask', 'bust', 'statue', 'relief', 'sculpture', 'painting', 'gate', 'manuscript', 'stele'];
const kindOf = (types: string[]) => { for (const k of KINDS) if (types.some(t => t.toLowerCase().includes(k))) return k; return null; };
/** "c. 1503", "c. 2560 BC" */
export const fmtYear = (y: number | null | undefined) => (y == null ? null : y <= 0 ? `c. ${Math.abs(y) || 1} BC` : y < 1000 ? `c. AD ${y}` : `c. ${y}`);

/** Register each list as a deck (group) under its subject › sections, and return its works as places. */
export function registerCollections(facts: Record<string, ArtFacts>, countryName: (id: string) => string | undefined, regionOf: (id: string) => string | undefined = () => undefined, taken: Set<string> = new Set()): Place[] {
  const out = new Map<string, Place>();
  for (const l of LISTS) {
    const chain: string[] = [];
    for (const sec of [l.subject, ...l.path]) chain.push(claimSection(sec, chain.length ? chain[chain.length - 1] : null));
    const sec = chain[chain.length - 1];
    // `depth: deep` (deep cuts): unlocks once half of the core list beside it is known.
    const core = l.deep ? LISTS.find(x => !x.deep && x.subject === l.subject && x.path.join('/') === l.path.join('/')) : undefined;
    const noun = l.taxon ? ['species', 'Species', 'eye'] as const : l.person ? ['people', 'People', 'person'] as const : l.music ? ['pieces', 'Pieces', 'music'] as const : l.building ? ['buildings', 'Buildings', 'landmark'] as const : l.book ? ['books', 'Books', 'book'] as const : ['works', 'Works', 'image'] as const;
    if (!GROUPS.some(g => g.id === l.id)) GROUPS.push({ id: l.id, section: sec, name: l.title, layer: 'art', nouns: noun[0], topics: [{ id: 'art', name: noun[1], icon: noun[2] }], note: l.intro ?? undefined, ...(core ? { requires: `${core.id}/art` } : {}) });
    for (const e of l.entries) {
      const f = facts[e.id];
      if (!f?.name) continue; // not synced yet
      // Music: each recording is its own card subject (composer, piece, movement), knowing its siblings in the work.
      if (l.music) {
        if (!f.composer || !e.clips?.length) continue;
        const sib = e.clips.map((c, i) => ({ id: `${e.id}-${i + 1}`, ...c }));
        for (const c of sib) out.set(c.id, {
          id: c.id, qid: e.id, layer: 'art', group: l.id, name: f.name, nameThe: f.nameThe ?? undefined, wiki: f.wiki, image: null, capitals: [], capitalAnswer: null,
          native: f.native?.length ? f.native : undefined, zh: f.zh ?? null, artists: [], year: f.year, country: f.composer.country ?? undefined, countryName: f.composer.countryName ?? undefined,
          music: { work: f.nameThe ?? f.name, workId: e.id, label: c.label, file: c.file, start: c.start, era: e.heading, composer: f.composer, siblings: sib },
          facts: [fmtYear(f.year), e.heading].filter(Boolean).join(' · ') || undefined,
        } as Place);
        continue;
      }
      // People: their face, where they were born (to the state), what they played, the scene they belong to (the heading).
      if (l.person) {
        if (!f.person) continue;
        const pp = f.person, pid = taken.has(e.id) ? `${e.id}-${slug(l.subject)}` : e.id;
        if (out.has(pid)) { out.get(pid)!.alsoIn = [...(out.get(pid)!.alsoIn ?? []), l.id]; continue; }
        out.set(pid, {
          id: pid, qid: e.id, layer: 'art', group: l.id, name: f.name, wiki: f.wiki, image: f.image, capitals: [], capitalAnswer: null, artists: [],
          native: f.native?.length ? f.native : undefined, city: pp.birthplace, country: pp.stateId ?? pp.country ?? undefined, countryName: pp.state ?? pp.countryName ?? undefined,
          person: { ...pp, scene: e.heading }, year: pp.born,
          facts: [pp.born ? `${pp.born}–${pp.died ?? ''}` : null, pp.instruments.join(', ') || null, e.heading].filter(Boolean).join(' · ') || undefined,
        } as Place);
        continue;
      }
      // Animals and plants: the photo, the scientific name, the branch of the tree, where (or when) it lives.
      if (l.taxon) {
        const pid = taken.has(e.id) ? `${e.id}-${slug(l.subject)}` : e.id;
        if (out.has(pid)) { out.get(pid)!.alsoIn = [...(out.get(pid)!.alsoIn ?? []), l.id]; continue; }
        const genusOnly = !!f.species && f.species.split(' ')[0] === f.name; // a dinosaur's name is its genus
        const first = f.name.split(' ')[0];
        const article = /^(North|South)$|'s$/.test(first) ? f.name : f.name.charAt(0).toLowerCase() + f.name.slice(1);
        out.set(pid, {
          id: pid, qid: e.id, layer: 'art', group: l.id, name: f.name, nameThe: f.nameThe ?? (genusOnly ? undefined : `${/^[aeiou]/i.test(f.name) ? 'an' : 'a'} ${article}`),
          wiki: f.wiki, image: f.image, capitals: [], capitalAnswer: null, artists: [], species: f.species ?? undefined, native: f.native?.length ? f.native : undefined,
          taxon: { branch: e.branch ?? null, note: e.note ?? null, rangeMap: f.rangeMap ?? null, status: f.status ?? null, group: e.heading, genusOnly,
            // When it lived: as its Wikipedia article says (synced nightly), else the list's own range.
            ...(e.age ? { when: true, fossil: f.fossil ?? null, time: ((w, l) => (w ? { ...w, from: f.fossilRange!.source } : l ? { ...l, from: null } : null))(f.fossilRange ? rangeFrom(f.fossilRange.text, f.fossilRange.ma) : null, rangeFrom(e.age)) } : {}) },
          facts: [e.heading, f.status && f.status !== 'least concern' ? f.status : null].filter(Boolean).join(' · ') || undefined,
        } as Place);
        continue;
      }
      // Ids are global: if a work or building is already in the app as something else (the Taj Mahal is a World Heritage
      // site), the collection's entry gets its own id so the two never overwrite each other. Facts stay keyed by Q-id.
      const pid = taken.has(e.id) ? `${e.id}-${slug(l.subject)}` : e.id;
      const seen = out.get(pid);
      if (seen) { seen.alsoIn = [...(seen.alsoIn ?? []), l.id]; continue; } // one work, one set of progress
      // "the Louvre Museum, Paris": museums take "the" (not churches, temples or mountains named for a saint or a place).
      const museum = f.museum && !/^(the |Santa |San |St\.? |Saint |Corcovado|Kōtoku-in|Rijksmuseum|Mauritshuis)/i.test(f.museum) ? `the ${f.museum}` : f.museum;
      const where = [museum, f.city && !f.museum?.includes(f.city) ? f.city : null].filter(Boolean).join(', ');
      const cName = (f.country && countryName(f.country)) || f.countryName || null;
      out.set(pid, {
        id: pid, qid: e.id, makerNative: f.makerNative?.length ? f.makerNative : undefined, makerOrigin: f.artists.length === 1 ? f.makerOrigin : undefined, building: l.building || undefined, style: f.style ?? null, layer: 'art',
        ...(l.book ? { book: true, language: languageOf(f.language), fiction: e.heading === 'Fiction', shelves: e.heading === 'Fiction' ? [] : f.topics ?? topicsOf(f.subjects, f.genres) } : {}), group: l.id, name: f.name, nameThe: f.nameThe ?? undefined, species: f.species ?? undefined, native: f.native?.length ? f.native : undefined, zh: f.zh ?? null, museumName: f.museum, museumWiki: f.museumWiki ?? null, city: f.city, plural: f.plural, wiki: f.wiki, image: f.image, capitals: [], capitalAnswer: null,
        lon: f.lon ?? undefined, lat: f.lat ?? undefined, country: f.country ?? undefined, countryName: cName ?? undefined,
        artists: f.artists, culture: f.culture, year: f.year, museum: where || null, origin: e.heading,
        facts: l.book ? [fmtYear(f.year), languageOf(f.language), e.heading?.toLowerCase()].filter(Boolean).join(' · ') : [fmtYear(f.year), l.building ? f.types[0] ?? null : kindOf(f.types), f.style ?? null, e.heading && !l.building ? `from ${e.heading.replace(/^The /, 'the ')}` : null].filter(Boolean).join(' · ') || undefined,
      });
    }
  }
  // Music by composer: Music › By composer › one deck per composer ("all of Beethoven").
  for (const p of out.values()) {
    if (!p.music) continue;
    const subject = sectionChain(GROUPS.find(g => g.id === p.group)!.section)[0];
    const s = claimSection('By composer', subject), gid = 'cc-' + slug(`${subject} ${p.music.composer.name}`);
    if (!GROUPS.some(g => g.id === gid)) GROUPS.push({ id: gid, section: s, name: p.music.composer.name, layer: 'art', nouns: 'pieces', topics: [{ id: 'art', name: 'Pieces', icon: 'music' }] });
    p.alsoIn = [...(p.alsoIn ?? []), gid];
  }
  // People by scene: Music › By scene › "New Orleans", "Bebop"… (the headings of the list).
  for (const p of out.values()) {
    if (!p.person?.scene) continue;
    const subject = sectionChain(GROUPS.find(g => g.id === p.group)!.section)[0];
    const s = claimSection('By scene', subject), gid = 'cp-' + slug(`${subject} ${p.person.scene}`);
    if (!GROUPS.some(g => g.id === gid)) GROUPS.push({ id: gid, section: s, name: p.person.scene, layer: 'art', nouns: 'people', topics: [{ id: 'art', name: 'People', icon: 'person' }] });
    p.alsoIn = [...(p.alsoIn ?? []), gid];
  }
  // Dinosaurs also live in Earth history (Earth history › Dinosaurs): their cards ask when they lived. One deck, not one per
  // period, so its name never gives the answer away.
  for (const p of out.values()) {
    if (!p.taxon?.time || !NOTE_SUBJECTS.includes('Earth history')) continue;
    const s = claimSection('Earth history', null), gid = 'cd-dinosaurs';
    if (!GROUPS.some(g => g.id === gid)) GROUPS.push({ id: gid, section: s, name: 'Dinosaurs through time', layer: 'art', nouns: 'dinosaurs', topics: [{ id: 'art', name: 'Dinosaurs', icon: 'mountain' }] });
    p.alsoIn = [...(p.alsoIn ?? []), gid];
  }
  // Shelves, made from the tags (src/tags.ts): Books › Fiction by language › "Italian literature"; Books › Nonfiction by
  // topic › "Philosophy". A topic that is also a subject (Philosophy, Economics, History…) shows its shelf there too, as
  // "Philosophy: reading list". Each book is filed once (its list) and shown on every shelf it belongs to.
  for (const p of out.values()) {
    if (!p.book) continue;
    const subject = sectionChain(GROUPS.find(g => g.id === p.group)!.section)[0];
    const shelves = p.fiction ? (p.language ? [literatureOf(p.language)] : []) : p.shelves ?? [];
    for (const shelf of shelves) {
      const secName = p.fiction ? 'Fiction by language' : 'Nonfiction by topic';
      const s = claimSection(secName, subject), gid = 'cs-' + slug(`${subject} ${shelf}`);
      let g = GROUPS.find(x => x.id === gid);
      if (!g) {
        g = { id: gid, section: s, name: shelf, layer: 'art', nouns: 'books', topics: [{ id: 'art', name: 'Books', icon: 'book' }] };
        if (!p.fiction && OTHER_SUBJECTS().includes(shelf)) g.alsoInSections = [claimSection(`${shelf}: reading list`, shelf)];
        GROUPS.push(g);
      }
      p.alsoIn = [...(p.alsoIn ?? []), gid];
    }
  }
  // "Where to see it", made from the facts: subject › Where to see it › continent › country › one deck per museum (or site).
  // Every work with a known place lands here by itself; nothing to file by hand. Names are prefixed ("Art in France") so
  // they never clash with the geography sections of the same name.
  for (const p of out.values()) {
    const subject = sectionChain(GROUPS.find(g => g.id === p.group)!.section)[0];
    if (p.book || !p.country || !p.museumName) continue; // books are read, not visited
    const cont = regionOf(p.country), cname = countryName(p.country) ?? p.countryName;
    if (!cont || !cname) continue;
    const the = /^(United States|United Kingdom|Netherlands|Philippines|Czech Republic)$/.test(cname) ? `the ${cname}` : cname;
    const top = 'Where to see it', contSec = `${subject} in ${cont === 'Americas' ? 'the Americas' : cont}`, countrySec = `${subject} in ${the}`;
    const topS = claimSection(top, subject), contS = claimSection(contSec, topS), countryS = claimSection(countrySec, contS);
    const gid = 'cw-' + slug(`${subject} ${cname} ${p.museumName}`);
    if (!GROUPS.some(g => g.id === gid)) GROUPS.push({ id: gid, section: countryS, name: p.museumName.replace(/^the /i, ''), layer: 'art', nouns: 'works', topics: [{ id: 'art', name: 'Works', icon: 'image' }] });
    if (p.group !== gid) p.alsoIn = [...(p.alsoIn ?? []), gid];
  }
  return [...out.values()];
}
