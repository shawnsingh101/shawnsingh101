// Search: find cards anywhere in the app by what they say, and study or quiz exactly those. A search isn't a deck:
// nothing is copied, and each card keeps its one set of progress wherever it's filed. A pinned search is only the
// words, so cards added later that match join it by themselves.
//
// Query: words (all must match; accents and case ignored), quoted phrases ("Great Wall"), and filters:
//   era:prehistory   subject:art   in:China (anywhere in the section path or the deck name)
import { GROUPS, cardsForNode, groupById, nodeId, parseNode, sectionChain, type CardRef } from './cards';
import { DECKS, ERAS } from './notes';
import { subjectOfSection } from './subjects';
import type { Dataset, Place } from './types';

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’ʻ]/g, '').toLowerCase();
/** Words are matched from their start ("art" finds Art Institute, not "start"); text in scripts without spaces (中文) anywhere. */
const words = (s: string) => ' ' + s.replace(/[^\p{L}\p{N}]+/gu, ' ') + ' ';
const hasWord = (text: string, w: string) => (/^[\p{Script=Latin}\p{N} ]+$/u.test(w) ? text.includes(' ' + w) : text.includes(w));

interface Entry { ref: CardRef; text: string; subject: string; path: string; eras: string[]; node: string; order: number }
let cache: { ds: Dataset; entries: Entry[] } | null = null;

/** Everything a card can be found by: names (also in their own language), what it says, where it's filed. */
function textOf(p: Place): string {
  const x = p as Place & { card?: { pre: string; answer: string; post: string; context?: string | null; parts?: (string | { answer: string })[] }; artists?: string[]; museumName?: string | null; city?: string | null; culture?: string | null; species?: string; origin?: string | null };
  const bits: (string | null | undefined)[] = [p.name, p.nameThe, p.officialName, p.capitalAnswer, p.facts, p.countryName, p.type, p.office, p.party,
    ...(p.capitals ?? []).map(c => c.name), ...(p.native ?? []).flatMap(n => [n.name, n.roman]), p.zh?.han, p.zh?.pinyin,
    ...(x.artists ?? []), x.museumName, x.city, x.culture, x.species, x.origin,
    x.card?.pre, x.card?.answer, x.card?.post, x.card?.context, ...(x.card?.parts ?? []).map(q => (typeof q === 'string' ? q : q.answer))];
  return words(fold(bits.filter(Boolean).join(' ')));
}

function index(ds: Dataset): Entry[] {
  if (cache?.ds === ds) return cache.entries;
  const eraOf = new Map(DECKS.map(d => ['n-' + d.id, d.eras.map(e => fold(e))]));
  const entries: Entry[] = [];
  for (const g of GROUPS) {
    const chain = sectionChain(g.section);
    const subject = subjectOfSection(g.section).name;
    const path = words(fold([...chain, g.name].join(' ')));
    for (const t of g.topics) {
      const node = nodeId(g.id, t.id);
      const texts = new Map<string, string>();
      for (const ref of cardsForNode(ds, node)) {
        let text = texts.get(ref.country.id);
        if (text === undefined) { text = textOf(ref.country); texts.set(ref.country.id, text); }
        entries.push({ ref, text, subject: fold(subject), path, eras: eraOf.get(g.id) ?? [], node, order: entries.length });
      }
    }
  }
  cache = { ds, entries };
  return entries;
}

export interface Query { words: string[]; era?: string; subject?: string; within?: string }
export function parseQuery(q: string): Query {
  const out: Query = { words: [] };
  for (const m of fold(q).matchAll(/(\w+):("[^"]*"|\S+)|"([^"]+)"|(\S+)/g)) {
    const val = (m[2] ?? '').replace(/"/g, '');
    if (m[1] === 'era') out.era = val.replace(/-/g, ' ');
    else if (m[1] === 'subject') out.subject = val;
    else if (m[1] === 'in') out.within = val;
    else out.words.push(...(m[3] ? [words(m[3]).trim()] : words(m[4] ?? m[0]).trim().split(' ').filter(Boolean)));
  }
  return out;
}

export interface Hit { node: string; group: string; path: string; refs: CardRef[] }
/** The cards matching a query, one entry per card (a card filed in two decks counts once), grouped by deck. */
export function search(ds: Dataset, q: string): { refs: CardRef[]; byDeck: Hit[] } {
  const qq = parseQuery(q);
  if (!qq.words.length && !qq.era && !qq.subject && !qq.within) return { refs: [], byDeck: [] };
  // Per deck: the cards that match by what they say; if none do but the deck's name or place does ("Ming dynasty",
  // "in:"), the whole deck. So "Washington" finds George Washington, not all 74 cards of "Washington to Buchanan".
  const own = new Map<string, Entry[]>(), byName = new Map<string, Entry[]>();
  for (const e of index(ds)) {
    if (qq.era && !e.eras.some(x => x.startsWith(qq.era!))) continue;
    if (qq.subject && !e.subject.startsWith(qq.subject)) continue;
    if (qq.within && !e.path.includes(words(qq.within).trimEnd())) continue;
    if (qq.words.every(w => hasWord(e.text, w))) (own.get(e.node) ?? own.set(e.node, []).get(e.node)!).push(e);
    else if (qq.words.every(w => hasWord(e.text, w) || hasWord(e.path, w))) (byName.get(e.node) ?? byName.set(e.node, []).get(e.node)!).push(e);
  }
  const seen = new Set<string>(), refs: CardRef[] = [], decks = new Map<string, Hit>();
  for (const [node, list] of [...[...byName.entries()].filter(([n]) => !own.has(n)), ...own.entries()].sort((a, b) => a[1][0].order - b[1][0].order)) {
    const g = groupById(parseNode(node).groupId);
    const h: Hit = { node, group: g.topics.length > 1 ? `${g.name} · ${g.topics.find(t => node === nodeId(g.id, t.id))?.name}` : g.name, path: sectionChain(g.section).join(' › '), refs: [] };
    for (const e of list) if (!seen.has(e.ref.id)) { seen.add(e.ref.id); refs.push(e.ref); h.refs.push(e.ref); }
    if (h.refs.length) decks.set(node, h);
  }
  return { refs, byDeck: [...decks.values()].sort((a, b) => b.refs.length - a.refs.length) };
}

/** Example searches shown under the box. */
export const EXAMPLES = ['era:prehistory', 'Washington', 'Ming', 'juniper', 'in:"History of China" emperor', 'subject:art Paris'];
export const ERA_KEYS = ERAS.map(e => e.key);
