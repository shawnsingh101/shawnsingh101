// Connections between things you're learning: a card's "related" links, and the reverse ("also in your decks").
import type { Dataset, Place } from './types';
import { groupOf } from './cards';

export interface RelLink { label: string; placeId?: string; wiki?: string }

// Places by name, best kind first (a country before a lake of the same name).
const RANK: Place['layer'][] = ['country', 'us', 'cn', 'sub', 'terr', 'site', 'peak', 'range', 'river', 'lake', 'water'];
const byNameCache = new WeakMap<Dataset, Map<string, Place>>();
function byName(ds: Dataset) {
  let m = byNameCache.get(ds);
  if (!m) {
    m = new Map();
    const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    for (const layer of [...RANK].reverse()) for (const p of ds.places) if (p.layer === layer) { m.set(norm(p.name), p); if (p.nameThe) m.set(norm(p.nameThe), p); }
    for (const c of ds.countries) if (c.officialName) m.set(norm(c.officialName), c);
    byNameCache.set(ds, m);
  }
  return m;
}
export function findPlace(ds: Dataset, name: string): Place | undefined {
  return byName(ds).get(name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^the /, ''));
}
const link = (p: Place): RelLink => ({ label: p.name, placeId: p.id });
const named = (ds: Dataset, name: string): RelLink => { const p = findPlace(ds, name); return p ? link(p) : { label: name, wiki: name.replace(/ /g, '_') }; };

/** Country names mentioned in a sentence ("…in Saudi Arabia…"), for note cards. */
function mentionedCountries(ds: Dataset, text: string): Place[] {
  return ds.countries.filter(c => c.name.length > 3 && new RegExp(`\\b${c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text));
}

/** What a card's subject connects to. */
export function relatedFor(ds: Dataset, c: Place): RelLink[] {
  const out: RelLink[] = [];
  const add = (l: RelLink | null | undefined) => { if (l && l.placeId !== c.id && !out.some(o => o.label === l.label)) out.push(l); };
  const place = (id?: string | null) => { const p = id ? ds.byId.get(id) : undefined; if (p) add(link(p)); };
  switch (c.layer) {
    case 'note': {
      for (const r of c.card?.related ?? []) add(named(ds, r));
      const text = c.card ? `${c.card.context ?? ''} ${c.card.pre} ${c.card.answer} ${c.card.post}` : '';
      for (const p of mentionedCountries(ds, text)) add(link(p));
      break;
    }
    case 'site': case 'peak':
      for (const id of c.admin1Ids ?? []) place(id);                   // the state / province, when the app teaches it
      if (c.admin1 && !(c.admin1Ids ?? []).some(id => ds.byId.has(id))) for (const n of c.admin1.split(', ')) add({ label: n, wiki: n.replace(/ /g, '_') });
      for (const n of (c.countryName ?? '').split(/, | and /).filter(Boolean)) add(named(ds, n));
      if (c.layer === 'peak') { const range = (c.facts ?? '').split(' · ')[1]; if (range && !/^\d/.test(range)) add(named(ds, range)); }
      break;
    case 'art':
      // Where it is (the museum, the city, the country), then who made it.
      if (c.museumName) add({ label: c.museumName, wiki: (c.museumWiki ?? c.museumName).replace(/ /g, '_') });
      if (c.city && c.city !== c.museumName) add(named(ds, c.city));
      place(c.country);
      if (c.artists?.[0]) add({ label: c.artists[0], wiki: c.artists[0].replace(/ /g, '_') });
      break;
    case 'senate': place(c.place ?? c.state); break;                  // a senator, governor or leader → their state or country
    case 'terr': place(c.sovereign); break;
    case 'sub': place(c.parent); break;
    case 'us': place('Q30'); break;
    case 'cn': place('Q148'); break;
    case 'river': case 'lake': case 'range': case 'road':
      for (const id of c.stateIds ?? []) place(id);                    // US rivers: the states they run through
      for (const n of ((c.facts ?? '').split(' · ').pop() ?? '').replace(/…$/, '').split(', ')) { const p = findPlace(ds, n); if (p?.layer === 'country') add(link(p)); }
      break;
    case 'country': {
      if (c.highest) { const p = ds.byId.get(c.highest.id); add(p ? link(p) : { label: c.highest.name, wiki: c.highest.wiki ?? undefined }); }
      if (c.sovereign) place(c.sovereign);
      break;
    }
  }
  return out.slice(0, 8);
}

/** The reverse: note cards (and their decks) that point at this place. */
export function notesAbout(ds: Dataset, p: Place): { deck: string; path: string[]; topic: string; id: string }[] {
  const out: { deck: string; path: string[]; topic: string; id: string }[] = [];
  for (const n of ds.places) {
    if (n.layer !== 'note' || !n.card) continue;
    if (!relatedFor(ds, n).some(l => l.placeId === p.id)) continue;
    if (out.some(o => o.deck === n.deckTitle && o.topic === n.name)) continue; // one line per topic
    out.push({ deck: n.deckTitle ?? '', path: n.deckPath ?? [], topic: n.name, id: n.id });
  }
  return out;
}
export const groupName = (p: Place) => { try { return groupOf(p)?.name ?? null; } catch { return null; } };
