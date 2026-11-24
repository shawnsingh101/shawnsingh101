import { cardsForNode, GROUPS, groupsShownIn, LAYER_NOUN, SECTION_PARENT, sectionAndDescendants, nodeId, SECTIONS, shuffle, type Group, type Topic } from './cards';
import type { QuizSpec } from './components/Study';
import { getProgress, skipped } from './srs';
import type { Dataset, Place } from './types';

/** A quiz scope: the whole world, a section ("Europe", "Oceans & Seas", "China") or one group. */
export type Scope = 'world' | `sec:${string}` | `grp:${string}`;

export function scopeGroups(scope: Scope): Group[] {
  if (scope === 'world') return GROUPS.filter(g => g.layer === 'country');
  if (scope.startsWith('sec:')) {
    // A section's own groups; one with none of its own (Food & drink › Cocktails) covers what's nested inside it.
    // A section's own groups, plus those nested inside it that teach the same kind of thing: "Rivers of the Americas"
    // includes the US rivers deck, but "Americas" (countries) doesn't pull in US states. A section with no groups of its
    // own (Food & drink › Cocktails) covers everything inside it.
    const own = groupsShownIn(scope.slice(4));
    const nested = sectionAndDescendants(scope.slice(4)).slice(1).flatMap(x => GROUPS.filter(g => g.section === x));
    if (!own.length) return nested;
    const layers = new Set(own.map(g => g.layer));
    return [...own, ...nested.filter(g => layers.has(g.layer) && !own.includes(g))];
  }
  return GROUPS.filter(g => g.id === scope.slice(4));
}

export function scopeName(scope: Scope) {
  if (scope === 'world') return 'World';
  if (scope === 'sec:Oceans & Seas') return 'All oceans & seas';
  if (scope.startsWith('sec:')) return scope.slice(4);
  const g = GROUPS.find(g => g.id === scope.slice(4))!;
  // Regions inside a country studied in depth say which country: "Japan · Kantō", "United States · Northeast".
  return SECTION_PARENT[g.section] && !g.name.includes(g.section) ? `${g.section} · ${g.name}` : g.name;
}

/** Topics on offer for a scope, with the names used in that scope. */
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

export function scopeTopics(scope: Scope) {
  const seen = new Map<Topic, Set<string>>(), layer = new Map<Topic, string>();
  for (const g of scopeGroups(scope)) for (const t of g.topics) {
    if (!seen.has(t.id)) { seen.set(t.id, new Set()); layer.set(t.id, g.layer); }
    seen.get(t.id)!.add(t.id === 'places' && g.layer === 'water' ? 'Oceans & seas' : t.name);
  }
  // Groups can name the same topic differently ("Great rivers", "Rivers"): then use the plain noun.
  return [...seen].map(([id, names]) => ({ id, name: names.size === 1 ? [...names][0] : cap(LAYER_NOUN[layer.get(id) as keyof typeof LAYER_NOUN]) }));
}

/** Countries a site, peak, range, river or lake is in (from its country list / facts), as country ids. */
export function placeCountries(ds: Dataset, p: Place): string[] {
  const list = p.layer === 'site' || p.layer === 'peak' || p.layer === 'art' ? p.countryName ?? '' : (p.facts ?? '').split(' · ').pop() ?? '';
  const byName = new Map(ds.countries.map(c => [c.name, c.id]));
  return list.replace(/…$/, '').split(/, | and /).map(n => byName.get(n.trim())).filter((x): x is string => !!x);
}
/** Layers where "just one country" makes sense as a filter (World Heritage in China, peaks in Nepal…). */
export const COUNTRY_FILTER_LAYERS = ['site', 'peak', 'range', 'river', 'lake', 'art', 'desert'];

export function quizPool(ds: Dataset, scope: Scope, topics: Topic[], country?: string | null) {
  // Practice problems are worked through in Study, not timed in a quiz.
  const cards = scopeGroups(scope).flatMap(g => g.topics.filter(t => topics.includes(t.id)).flatMap(t => cardsForNode(ds, nodeId(g.id, t.id)))).filter(c => !c.country.card?.practice);
  return country ? cards.filter(c => placeCountries(ds, c.country).includes(country)) : cards;
}

export const quizKey = (scope: Scope, topics: Topic[], country?: string | null) => `${scope}|${[...topics].sort().join('+')}${country ? `|${country}` : ''}`;

export function quizTitle(scope: Scope, topics: Topic[], countryName?: string | null) {
  const names = scopeTopics(scope).filter(t => topics.includes(t.id)).map(t => t.name.toLowerCase());
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1] : names[0];
  const name = scopeName(scope);
  const base = list === 'cards' || name.toLowerCase().includes(list) || list === 'oceans & seas' && scope.startsWith('grp:w-') ? name : `${name}: ${list}`;
  return countryName ? `${base} · ${countryName}` : base;
}

export function makeQuiz(ds: Dataset, scope: Scope, topics: Topic[], length: number | 'all', country?: string | null): QuizSpec {
  const countryName = country ? ds.byId.get(country)?.name ?? null : null;
  return {
    key: quizKey(scope, topics, country), title: quizTitle(scope, topics, countryName),
    draw: () => { const pool = shuffle(quizPool(ds, scope, topics, country).filter(c => !skipped(getProgress(), c.kind))); return length === 'all' ? pool : pool.slice(0, length); },
  };
}

export const ALL_SCOPES: Scope[] = ['world', ...SECTIONS.map(s => `sec:${s}` as Scope), ...GROUPS.map(g => `grp:${g.id}` as Scope)];
