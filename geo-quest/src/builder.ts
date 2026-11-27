// The Builder's plain parts: a card form → the deck lines it stands for (decks/README.md syntax), where those lines go
// in a deck file, new deck files, and Add from Wikipedia (Wikipedia and Wikidata both answer requests from a web page).
import { DECKS, parseDeck, type Deck } from './notes';

export type CardType = 'cloze' | 'qa' | 'parts' | 'recipe' | 'picture';
export const CARD_TYPES: [CardType, string, string][] = [
  ['cloze', 'Fill in the blank', 'A sentence with one part hidden'],
  ['qa', 'Question & answer', 'A question on the front, the answer on the back'],
  ['parts', 'Parts', 'A short list or process, recalled one part at a time'],
  ['recipe', 'Recipe', 'A drink: what goes in, then how it is served'],
  ['picture', 'Picture', 'Name it from its picture'],
];
export const RECIPE_ROLE_LIST = ['spirit', 'liqueur', 'vermouth', 'wine', 'sour', 'sweet', 'bitters', 'juice', 'top', 'cream', 'other', 'method', 'glass', 'garnish', 'rim'];

export interface Draft {
  type: CardType;
  sentence: string; answer: string; hint: string;          // fill in the blank (answer: words from the sentence)
  question: string; back: string; both: boolean;           // question & answer (also the picture card's question/answer)
  parts: { cue: string; answer: string }[]; anyOrder: boolean;
  drink: string; recipe: { role: string; text: string }[];
  picture: string; caption: string;                        // a Commons file name or an image address
  note: string; nativeName: string; nativeLang: string; source: string;
}
export const emptyDraft = (type: CardType = 'cloze'): Draft => ({
  type, sentence: '', answer: '', hint: '', question: '', back: '', both: false,
  parts: [{ cue: '', answer: '' }, { cue: '', answer: '' }, { cue: '', answer: '' }], anyOrder: false,
  drink: '', recipe: [{ role: 'spirit', text: '' }, { role: 'sour', text: '' }, { role: 'sweet', text: '' }, { role: 'method', text: '' }, { role: 'glass', text: '' }],
  picture: '', caption: '', note: '', nativeName: '', nativeLang: '', source: '',
});

const one = (s: string) => s.replace(/\s+/g, ' ').trim();
/** "File:Negroni.jpg", "Negroni.jpg" or an address → what goes between the brackets of a picture line. */
export const pictureRef = (p: string) => /^https?:\/\//i.test(p.trim()) ? p.trim() : 'commons:' + p.trim().replace(/^(File|Image):/i, '').replace(/_/g, ' ');

/** The lines for one card, or why it can't be made yet. */
export function cardLines(d: Draft): { lines: string[]; error: string | null } {
  const out: string[] = [];
  const fail = (error: string) => ({ lines: [], error });
  if (d.type === 'cloze') {
    const s = one(d.sentence);
    if (!s) return fail('Write the sentence.');
    if (s.includes('{{')) out.push('- ' + s); // written with its own {{blanks}}
    else {
      const a = one(d.answer);
      if (!a) return fail('Type the words to hide (they must be in the sentence).');
      const at = s.toLowerCase().indexOf(a.toLowerCase());
      if (at < 0) return fail('The words to hide must appear in the sentence, spelled the same.');
      const word = s.slice(at, at + a.length);
      out.push(`- ${s.slice(0, at)}{{${word}${one(d.hint) ? '|' + one(d.hint) : ''}}}${s.slice(at + a.length)}`);
    }
  } else if (d.type === 'qa') {
    const q = one(d.question), b = one(d.back);
    if (!q || !b) return fail('Write the question and the answer.');
    if (q.includes('::') || b.includes('::')) return fail('“::” separates question from answer, so it can’t be inside either.');
    out.push(`- ${q} ${d.both ? ':::' : '::'} ${b}`);
  } else if (d.type === 'parts') {
    const q = one(d.question), ps = d.parts.filter(p => one(p.answer));
    if (!q) return fail('Write the question (what the parts make up).');
    if (ps.length < 2 || ps.length > 5) return fail('A parts card has 2 to 5 parts.');
    out.push(`- ${q}`, '```parts', ...(d.anyOrder ? ['# any order'] : []), ...ps.map(p => one(p.cue) ? `${one(p.cue)} :: ${one(p.answer)}` : one(p.answer)), '```');
  } else if (d.type === 'recipe') {
    const name = one(d.drink), rs = d.recipe.filter(r => one(r.text));
    if (!name) return fail('Name the drink.');
    if (!rs.some(r => !['method', 'glass', 'garnish', 'rim'].includes(r.role))) return fail('Add at least one ingredient.');
    out.push(`- A ${name.replace(/^an?\s+/i, '')}`, '```recipe', ...rs.map(r => `${r.role}: ${one(r.text)}`), '```');
  } else {
    const q = one(d.question) || 'Name it from the picture', a = one(d.back);
    if (!d.picture.trim() || !a) return fail('Choose the picture and type the answer.');
    out.push(`- ${q} [picture] :: ${a}`);
  }
  // A card's own extras: picture, its name in its own language, a note after the answer, where it comes from.
  if (d.picture.trim()) out.push(`![${one(d.caption) || (d.type === 'picture' ? one(d.back) : '')}](${pictureRef(d.picture)})`);
  if (one(d.nativeName)) out.push(`native: ${one(d.nativeName)}${one(d.nativeLang) ? ` (${one(d.nativeLang)})` : ''}`);
  if (one(d.note)) out.push('> ' + one(d.note));
  if (one(d.source)) { if (!/^https?:\/\//i.test(one(d.source))) return fail('The source should be a web address (https://…).'); out.push('source: ' + one(d.source)); }
  return { lines: out, error: null };
}

/** Put a card's lines at the end of its heading's part of a deck (a new heading goes at the end of the file). */
export function insertLines(text: string, heading: string, lines: string[]): string {
  const ls = text.replace(/\s+$/, '').split('\n'), h = heading.trim();
  const at = ls.findIndex(l => /^#{1,3}\s+/.test(l) && l.replace(/^#{1,3}\s+/, '').trim() === h);
  if (at < 0) return [...ls, '', `## ${h}`, ...lines].join('\n') + '\n';
  let end = ls.findIndex((l, i) => i > at && (/^#{1,3}\s+/.test(l) || /^:::/.test(l)));
  if (end < 0) end = ls.length;
  while (end > at + 1 && !ls[end - 1].trim()) end--;
  return [...ls.slice(0, end), ...lines, ...ls.slice(end)].join('\n') + '\n';
}

/** A new deck file. */
export function newDeckText(o: { title: string; icon: string; intro: string; heading: string; cards: string[][] }) {
  return ['---', `title: ${one(o.title)}`, `icon: ${o.icon}`, '---', ...(one(o.intro) ? [one(o.intro), ''] : []), `## ${one(o.heading)}`, ...o.cards.flat()].join('\n') + '\n';
}

/** Where a new deck's file goes: existing folders keep their number prefixes ("2 Ancient China"); new ones are as typed. */
export function newDeckFile(subject: string, path: string[], title: string) {
  const segs = [subject, ...path], out: string[] = [];
  for (let i = 0; i < segs.length; i++) {
    const match = DECKS.map(d => d.file.replace(/^.*decks\//, '').split('/')).find(f => f.length > i + 1 && f.slice(0, i + 1).every((x, j) => x.replace(/^\d+\s+/, '') === segs[j]));
    out.push(match ? match[i] : segs[i].replace(/[\\/:*?"<>|]/g, '-'));
  }
  return `../decks/${out.join('/')}/${one(title).replace(/[\\/:*?"<>|]/g, '-')}.md`;
}

/** What saving would do: how many cards the deck gains, and any card that gives its answer away. */
export function check(deck: Deck | null, file: string, before: string | null, after: string) {
  const d = parseDeck(file, after), was = before ? parseDeck(file, before).cards.length : 0;
  const old = new Set(before ? parseDeck(file, before).cards.map(c => c.id) : []);
  const fresh = d.cards.filter(c => !old.has(c.id));
  const leaks = fresh.filter(c => !c.card.front && c.card.answer.length > 2 && (c.card.pre + ' ' + c.card.post).toLowerCase().includes(c.card.answer.toLowerCase()));
  return { added: d.cards.length - was, id: d.id, clash: !deck && DECKS.some(x => x.id === d.id), leaks: leaks.map(c => c.card.answer) };
}

// ---- Add from Wikipedia --------------------------------------------------------------
export interface WikiHit { title: string; description: string; thumb: string | null }
export async function wikiSearch(q: string): Promise<WikiHit[]> {
  const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrlimit=6&gsrsearch=${encodeURIComponent(q)}&prop=description|pageimages&piprop=thumbnail&pithumbsize=96`;
  const r = await fetch(u); if (!r.ok) throw new Error('Wikipedia did not answer. Try again in a moment.');
  const pages = Object.values((await r.json()).query?.pages ?? {}) as { title: string; index: number; description?: string; thumbnail?: { source: string } }[];
  return pages.sort((a, b) => a.index - b.index).map(p => ({ title: p.title, description: p.description ?? '', thumb: p.thumbnail?.source ?? null }));
}

export interface WikiFill { title: string; description: string; url: string; picture: string | null; native: { name: string; lang: string } | null; species: string | null }
/** The title, its one-line description, its picture (from Commons when it has one), and its name in its own language. */
export async function wikiFill(title: string): Promise<WikiFill> {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
  if (!r.ok) throw new Error('Could not read that Wikipedia article.');
  const s = await r.json();
  const out: WikiFill = { title: s.title, description: s.description ?? '', url: s.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`, picture: s.originalimage?.source ?? null, native: null, species: null };
  if (s.wikibase_item) {
    try {
      const w = await (await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${s.wikibase_item}.json`)).json();
      const claims = w.entities?.[s.wikibase_item]?.claims ?? {};
      const val = (p: string) => claims[p]?.[0]?.mainsnak?.datavalue?.value;
      if (typeof val('P18') === 'string') out.picture = val('P18');
      const nat = val('P1705') ?? val('P1559');
      if (nat?.text && nat.language && nat.language !== 'en' && nat.text !== out.title) {
        let lang = nat.language; try { lang = new Intl.DisplayNames(['en'], { type: 'language' }).of(nat.language) ?? lang; } catch { /* keep the code */ }
        out.native = { name: nat.text, lang };
      }
      if (typeof val('P225') === 'string') out.species = val('P225');
    } catch { /* Wikidata is extra: the Wikipedia part is enough */ }
  }
  return out;
}
