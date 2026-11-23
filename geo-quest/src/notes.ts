// Note decks: plain Markdown files in geo-quest/decks/, one deck per file. See decks/README.md for the format.
// Each card becomes a small "item" (layer 'note') so it schedules, quizzes and shows progress like a place does.
import type { Place } from './types';
import { GROUPS, SECTIONS, SECTION_PARENT } from './cards';
import { epochDeck, geotimeDeck } from './geotime';

export interface NoteCard {
  pre: string; answer: string; post: string;  // cloze: "pre [answer] post"; front/back: pre = front, answer = back
  front: boolean;                              // a front :: back card (answer shown under the question)
  pictureFirst?: boolean;
  hint?: string;                               // what the blank says before you flip: {{Milan|what city?}} → "what city?"
  also?: string[];                             // an "also in: Philadelphia" line after it: the card is also in that deck
  species?: string;                            // a "species: Juniperus communis" line: the scientific name of the plant or animal                      // "[picture]" in the question: the heading's picture is the question
  context: string | null;                      // the ## heading it sits under
  picture: { file?: string | null; url?: string | null; caption: string } | null;
  note: string | null;                         // a "> …" line: shown after the answer
  related: string[];                           // a "related: A, B" line under the heading: links to other things you're learning
  native: { name: string; lang: string; code?: string; roman?: string }[]; // a "native: الكعبة (Arabic)" line: the name in its own language
  fp: string;                                  // fingerprint: changes when the card's text changes
}
export interface Deck { file: string; id: string; title: string; subject: string; path: string[]; intro: string | null; cards: { id: string; card: NoteCard }[] }

// Language names a deck can use → codes for the device voice.
const LANG_CODE: Record<string, string> = { arabic: 'ar', punjabi: 'pa', hebrew: 'he', italian: 'it', hindi: 'hi', greek: 'el', latin: 'it', sanskrit: 'hi', japanese: 'ja', chinese: 'zh', mandarin: 'zh', spanish: 'es', french: 'fr', german: 'de', persian: 'fa', portuguese: 'pt', russian: 'ru', korean: 'ko', turkish: 'tr', urdu: 'ur', tibetan: 'bo', thai: 'th', dutch: 'nl' };

/** Short, stable hash for card ids (FNV-1a, base 36). */
function hash(s: string) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function parseDeck(file: string, text: string): Deck {
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const meta: Record<string, string> = {};
  for (const line of fm?.[1].split('\n') ?? []) { const m = /^(\w+):\s*(.*)$/.exec(line); if (m) meta[m[1]] = m[2].trim(); }
  const body = fm ? text.slice(fm[0].length) : text;
  // A number in front of a folder or file name only sets the order ("2 Ancient China" → Ancient China, second).
  const parts = file.replace(/^.*decks\//, '').replace(/\.md$/, '').split('/').map(p => p.replace(/^\d+\s+/, ''));
  const subject = meta.subject || parts[0];
  const path = meta.path ? meta.path.split('/').map(s => s.trim()).filter(Boolean) : parts.slice(1, -1);
  const title = meta.title || parts[parts.length - 1].replace(/[-_]/g, ' ');
  const id = slug([subject, ...path, title].join(' '));
  const cards: Deck['cards'] = [];
  // Lines like related: / native: / species: apply to the cards under *this* heading, wherever they sit in it. The same
  // heading can appear twice ("Which spirit?"), so cards remember which occurrence they're under.
  let section = 0; const secOf = new Map<string, number>();
  let context: string | null = null, picture: NoteCard['picture'] = null, related: string[] = [], native: NoteCard['native'] = [], species: string | undefined, intro: string[] = [], seenHeading = false;
  const add = (c: Omit<NoteCard, 'context' | 'picture' | 'note' | 'fp' | 'related' | 'native'>, key: string) => {
    const card: NoteCard = { ...c, context, picture, related, native, ...(species ? { species } : {}), note: null, fp: `${c.pre}|${c.answer}|${c.post}` };
    // The id ignores the answer, so fixing an answer keeps your progress (the fingerprint re-queues the card).
    let cid = `N-${id}-${hash((context ?? '') + '|' + key)}`;
    while (cards.some(x => x.id === cid)) cid += 'x';
    cards.push({ id: cid, card }); secOf.set(cid, section);
  };
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const h = /^#{1,3}\s+(.*)$/.exec(line);
    if (h) { section++; context = h[1]; picture = null; related = []; native = []; species = undefined; seenHeading = true; continue; }
    // "native: الكعبة (Arabic); Kaʿbah (Arabic, in Latin letters)": shown with a speaker button after the answer.
    // "species: Juniperus communis": the scientific name of the plant or animal, shown in italics after the answer.
    const sp = /^species:\s*(.+)$/i.exec(line);
    if (sp) { species = sp[1].trim(); for (const c of cards) if (secOf.get(c.id) === section) c.card.species = species; continue; }
    const nat = /^(?:native|local):\s*(.+)$/i.exec(line);
    if (nat) {
      native = nat[1].split(';').map(x => /^(.*?)\s*\(([^)]+)\)\s*$/.exec(x.trim())).filter((m): m is RegExpExecArray => !!m)
        .map(m => {
          // "夏朝 Xià Cháo (Chinese)": the script first, then its romanization (pinyin, romaji…), shown under it.
          const sr = /^(.*?[^\x00-\u024f\s'’-])\s+([\x00-\u024f'’ -]+)$/.exec(m[1]);
          return { name: sr ? sr[1] : m[1], ...(sr ? { roman: sr[2].trim() } : {}), lang: m[2], code: LANG_CODE[m[2].toLowerCase().replace(/^(ancient|classical|modern) /, '')] };
        });
      for (const c of cards) if (secOf.get(c.id) === section) c.card.native = native;
      continue;
    }
    const rel = /^related:\s*(.+)$/i.exec(line);
    // Applies to every card under this heading, wherever the line sits.
    if (rel) { related = rel[1].split(',').map(x => x.trim()).filter(Boolean); for (const c of cards) if (secOf.get(c.id) === section) c.card.related = related; continue; }
    const img = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
    if (img) { const src = img[2]; picture = src.startsWith('commons:') ? { file: src.slice(8), caption: img[1] || context || '' } : { url: src, caption: img[1] || context || '' }; continue; }
    // "also in: Philadelphia, New Jersey" after a card: it also appears in those decks (by title), e.g. History by place.
    const alsoIn = /^also in:\s*(.+)$/i.exec(line);
    if (alsoIn) { const last = cards[cards.length - 1]; if (last) last.card.also = alsoIn[1].split(',').map(x => x.trim()).filter(Boolean); continue; }
    if (line.startsWith('>')) { const last = cards[cards.length - 1]; if (last) last.card.note = (last.card.note ? last.card.note + ' ' : '') + line.replace(/^>\s?/, ''); continue; }
    const b = /^[-*]\s+(.*)$/.exec(line);
    if (!b) { if (!seenHeading) intro.push(line); continue; }
    const t = b[1];
    const fb = /^(.*?)\s+(:::|::)\s+(.*)$/.exec(t);
    if (fb) {
      // "What is made from this? [picture] :: gin": the picture is shown as the question.
      if (/\[picture\]/i.test(fb[1])) { add({ pre: fb[1].replace(/\s*\[picture\]\s*/i, ' ').trim(), answer: fb[3], post: '', front: true, pictureFirst: true }, fb[1]); continue; }
      add({ pre: fb[1], answer: fb[3], post: '', front: true }, fb[1]);
      if (fb[2] === ':::') add({ pre: fb[3], answer: fb[1], post: '', front: true }, '↺' + fb[3]); // both directions
      continue;
    }
    // {{answer}} or {{answer|hint}}: the hint ("what city?") replaces the plain "what?" until the card is flipped.
    const blanks = [...t.matchAll(/\{\{([^|}]*)(?:\|([^}]*))?\}\}/g)];
    if (!blanks.length) continue; // a plain bullet is just a note to yourself
    const plain = (x: string) => x.replace(/\{\{([^|}]*)(?:\|[^}]*)?\}\}/g, '$1');
    blanks.forEach((m, i) => {
      const before = plain(t.slice(0, m.index)), after = plain(t.slice(m.index! + m[0].length));
      add({ pre: before, answer: m[1], post: after, front: false, ...(m[2] ? { hint: m[2].trim() } : {}) }, t.replace(/\{\{[^}]*\}\}/g, '_') + '#' + i);
    });
  }
  return { file, id, title, subject, path, intro: intro.join(' ') || null, cards };
}

// Every deck file under geo-quest/decks (bundled at build time; README files are documentation, not decks).
// (Outside Vite, e.g. in a test script, import.meta.glob doesn't exist: no decks.)
let files: Record<string, string> = {};
try { files = import.meta.glob('../decks/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>; } catch { /* not built by Vite */ }
// Decks built from data in the app itself (the geologic time scale, shared with its chart).
const BUILT: [string, string][] = [['../decks/Earth history/Geologic time scale.md', geotimeDeck()], ['../decks/Earth history/Epochs of the Cenozoic.md', epochDeck()]];
export const DECKS: Deck[] = [...Object.entries(files).filter(([f]) => !/README\.md$/i.test(f)), ...BUILT].map(([f, t]) => parseDeck(f, t))
  .sort((a, b) => a.file.replace(/^.*decks\//, '').localeCompare(b.file.replace(/^.*decks\//, ''), 'en', { numeric: true })); // folder & file order (numbers first)
export const NOTE_SUBJECTS = [...new Set(DECKS.map(d => d.subject))];

/** Register note decks as sections (subject › path…) and groups (one per deck), and return their cards as items. */
export function registerNotes(): Place[] {
  const out: Place[] = [];
  for (const d of DECKS) {
    const chain = [d.subject, ...d.path];
    chain.forEach((sec, i) => { if (!SECTIONS.includes(sec)) SECTIONS.push(sec); if (i) SECTION_PARENT[sec] = chain[i - 1]; });
    const gid = 'n-' + d.id;
    if (!GROUPS.some(g => g.id === gid)) GROUPS.push({ id: gid, section: chain[chain.length - 1], name: d.title, layer: 'note', topics: [{ id: 'notes', name: 'Cards', icon: 'book' }], note: d.intro ?? undefined });
    for (const { id, card } of d.cards) out.push({ id, layer: 'note', group: gid, name: card.context ?? d.title, capitals: [], capitalAnswer: null, card, deckTitle: d.title, deckPath: [d.subject, ...d.path], native: card.native.length ? card.native : undefined, species: card.species } as unknown as Place);
  }
  // Cards tagged "also in: <deck title>" are listed in that deck too (one set of progress).
  const byTitle = new Map(DECKS.map(d => [d.title.toLowerCase(), 'n-' + d.id]));
  for (const p of out) {
    const also = (p as unknown as { card?: NoteCard }).card?.also;
    if (also?.length) p.alsoIn = also.map(t => byTitle.get(t.toLowerCase())).filter((g): g is string => !!g);
  }
  return out;
}
