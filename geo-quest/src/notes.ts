// Note decks: plain Markdown files in geo-quest/decks/, one deck per file. See decks/README.md for the format.
// Each card becomes a small "item" (layer 'note') so it schedules, quizzes and shows progress like a place does.
import type { Place } from './types';
import { GROUPS, SECTIONS, SECTION_PARENT } from './cards';

export interface NoteCard {
  pre: string; answer: string; post: string;  // cloze: "pre [answer] post"; front/back: pre = front, answer = back
  front: boolean;                              // a front :: back card (answer shown under the question)
  context: string | null;                      // the ## heading it sits under
  picture: { file?: string | null; url?: string | null; caption: string } | null;
  note: string | null;                         // a "> …" line: shown after the answer
  fp: string;                                  // fingerprint: changes when the card's text changes
}
export interface Deck { id: string; title: string; subject: string; path: string[]; intro: string | null; cards: { id: string; card: NoteCard }[] }

/** Short, stable hash for card ids (FNV-1a, base 36). */
function hash(s: string) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function parseDeck(file: string, text: string): Deck {
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const meta: Record<string, string> = {};
  for (const line of fm?.[1].split('\n') ?? []) { const m = /^(\w+):\s*(.*)$/.exec(line); if (m) meta[m[1]] = m[2].trim(); }
  const body = fm ? text.slice(fm[0].length) : text;
  const parts = file.replace(/^.*decks\//, '').replace(/\.md$/, '').split('/');
  const subject = meta.subject || parts[0];
  const path = meta.path ? meta.path.split('/').map(s => s.trim()).filter(Boolean) : parts.slice(1, -1);
  const title = meta.title || parts[parts.length - 1].replace(/[-_]/g, ' ');
  const id = slug([subject, ...path, title].join(' '));
  const cards: Deck['cards'] = [];
  let context: string | null = null, picture: NoteCard['picture'] = null, intro: string[] = [], seenHeading = false;
  const add = (c: Omit<NoteCard, 'context' | 'picture' | 'note' | 'fp'>, key: string) => {
    const card: NoteCard = { ...c, context, picture, note: null, fp: `${c.pre}|${c.answer}|${c.post}` };
    // The id ignores the answer, so fixing an answer keeps your progress (the fingerprint re-queues the card).
    let cid = `N-${id}-${hash((context ?? '') + '|' + key)}`;
    while (cards.some(x => x.id === cid)) cid += 'x';
    cards.push({ id: cid, card });
  };
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const h = /^#{1,3}\s+(.*)$/.exec(line);
    if (h) { context = h[1]; picture = null; seenHeading = true; continue; }
    const img = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
    if (img) { const src = img[2]; picture = src.startsWith('commons:') ? { file: src.slice(8), caption: img[1] || context || '' } : { url: src, caption: img[1] || context || '' }; continue; }
    if (line.startsWith('>')) { const last = cards[cards.length - 1]; if (last) last.card.note = (last.card.note ? last.card.note + ' ' : '') + line.replace(/^>\s?/, ''); continue; }
    const b = /^[-*]\s+(.*)$/.exec(line);
    if (!b) { if (!seenHeading) intro.push(line); continue; }
    const t = b[1];
    const fb = /^(.*?)\s+(:::|::)\s+(.*)$/.exec(t);
    if (fb) {
      add({ pre: fb[1], answer: fb[3], post: '', front: true }, fb[1]);
      if (fb[2] === ':::') add({ pre: fb[3], answer: fb[1], post: '', front: true }, '↺' + fb[3]); // both directions
      continue;
    }
    const blanks = [...t.matchAll(/\{\{(.*?)\}\}/g)];
    if (!blanks.length) continue; // a plain bullet is just a note to yourself
    blanks.forEach((m, i) => {
      const before = t.slice(0, m.index).replace(/\{\{(.*?)\}\}/g, '$1');
      const after = t.slice(m.index! + m[0].length).replace(/\{\{(.*?)\}\}/g, '$1');
      add({ pre: before, answer: m[1], post: after, front: false }, t.replace(/\{\{(.*?)\}\}/g, '_') + '#' + i);
    });
  }
  return { id, title, subject, path, intro: intro.join(' ') || null, cards };
}

// Every deck file under geo-quest/decks (bundled at build time; README files are documentation, not decks).
// (Outside Vite, e.g. in a test script, import.meta.glob doesn't exist: no decks.)
let files: Record<string, string> = {};
try { files = import.meta.glob('../decks/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>; } catch { /* not built by Vite */ }
export const DECKS: Deck[] = Object.entries(files).filter(([f]) => !/README\.md$/i.test(f)).map(([f, t]) => parseDeck(f, t))
  .sort((a, b) => a.subject.localeCompare(b.subject) || a.path.join('/').localeCompare(b.path.join('/')) || a.title.localeCompare(b.title));
export const NOTE_SUBJECTS = [...new Set(DECKS.map(d => d.subject))];

/** Register note decks as sections (subject › path…) and groups (one per deck), and return their cards as items. */
export function registerNotes(): Place[] {
  const out: Place[] = [];
  for (const d of DECKS) {
    const chain = [d.subject, ...d.path];
    chain.forEach((sec, i) => { if (!SECTIONS.includes(sec)) SECTIONS.push(sec); if (i) SECTION_PARENT[sec] = chain[i - 1]; });
    const gid = 'n-' + d.id;
    if (!GROUPS.some(g => g.id === gid)) GROUPS.push({ id: gid, section: chain[chain.length - 1], name: d.title, layer: 'note', topics: [{ id: 'notes', name: 'Cards', icon: 'book' }], note: d.intro ?? undefined });
    for (const { id, card } of d.cards) out.push({ id, layer: 'note', group: gid, name: card.context ?? d.title, capitals: [], capitalAnswer: null, card } as unknown as Place);
  }
  return out;
}
