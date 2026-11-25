// Note decks: plain Markdown files in geo-quest/decks/, one deck per file. See decks/README.md for the format.
// Each card becomes a small "item" (layer 'note') so it schedules, quizzes and shows progress like a place does.
import type { Place } from './types';
import { GROUPS, claimSection } from './cards';
import { epochDeck, geotimeDeck } from './geotime';
import { chapterName, objectiveName } from './secplus';
import { bureauOf, bureauAnswer } from './bureaus';

export interface NoteCard {
  pre: string; answer: string; post: string;  // cloze: "pre [answer] post"; front/back: pre = front, answer = back
  front: boolean;                              // a front :: back card (answer shown under the question)
  pictureFirst?: boolean;
  hint?: string;                               // what the blank says before you flip: {{Milan|what city?}} → "what city?"
  parts?: (string | { answer: string; hint?: string })[]; // a grouped cloze ({{c1::…}}): the sentence with several blanks
  strata?: string;                             // "[strata: Phanerozoic]": a geologic time card showing the unit's blocks (src/geotime.ts)
  also?: string[];                             // an "also in: Philadelphia" line after it: the card is also in that deck
  species?: string;                            // a "species: Juniperus communis" line: the scientific name of the plant or animal
  eq?: { name: string; tex: string | null };   // an "eq: IS curve | Y = C + I + G" line: the card is about that equation (the Equations lens)
  asOf?: string;                               // an "as of: November 2026" line: true for now, not for good (a live topic's current state)
  code?: { lang: string; text: string };       // a fenced code block: shown with the question. A \u0000 in it marks the card's blank
  bureau?: string;                             // "[bureau: EGY] Which bureau covers Egypt?": a map card (src/bureaus.ts), the country's ISO code
  recall?: Recall;                             // a parts card: a ```parts block under a plain bullet, recalled one part at a time
  practice?: Practice;                         // a "[practice]" card: write a program; it's run and checked (src/python.ts)
  source?: string;                             // a "source: src/tree.ts" line: the file the code is quoted from (linked on GitHub)
  context: string | null;                      // the ## heading it sits under
  picture: { file?: string | null; url?: string | null; caption: string } | null;
  note: string | null;                         // a "> …" line: shown after the answer
  related: string[];                           // a "related: A, B" line under the heading: links to other things you're learning
  native: { name: string; lang: string; code?: string; roman?: string; for?: string }[]; // a "native: الكعبة (Arabic)" line: the name in its own language
  fp: string;                                  // fingerprint: changes when the card's text changes
}
/** A practice problem: the code you start from, the cases it's tested on (the lines it reads with input(), and what it
 *  should print), asserts run after it, and a model solution (shown on request, and checked by the audit). */
/** A parts card: 2 to 5 parts recalled one at a time (each with an optional cue), graded by how many you got. */
export interface Recall { steps: { cue: string | null; answer: string }[]; anyOrder: boolean }
/** At most this many parts on a card: about what working memory holds. Longer processes are split into stages. */
export const RECALL_MAX = 5;
export function parseRecall(text: string): Recall {
  let anyOrder = false; const steps: Recall['steps'] = [];
  for (const raw of text.split('\n')) {
    const l = raw.trim(); if (!l) continue;
    if (/^#\s*any order$/i.test(l)) { anyOrder = true; continue; }
    const m = /^(.*?)\s+::\s+(.+)$/.exec(l);
    steps.push(m ? { cue: m[1].trim(), answer: m[2].trim() } : { cue: null, answer: l });
  }
  return { steps, anyOrder };
}
export interface Practice { starter: string; cases: { input: string; output: string | null }[]; check: string; solution: string }
export interface Deck { file: string; id: string; title: string; subject: string; path: string[]; intro: string | null; eras: string[]; deep: boolean;
  lesson: string | null;                     // a `:::lesson … :::` block: a short read that comes before the cards
  objectives: string[]; chapter: string | null; // Security+ tags (src/secplus.ts): exam objectives, study-guide chapter
  follows: string[]; checked: string | null; // a live topic: the Wikipedia articles the weekly briefing reads, and when it last did
  cards: { id: string; card: NoteCard }[] }

// Language names a deck can use → codes for the device voice.
const LANG_CODE: Record<string, string> = { maori: 'mi', 'māori': 'mi', catalan: 'ca', croatian: 'hr', czech: 'cs', danish: 'da', swedish: 'sv', arabic: 'ar', punjabi: 'pa', hebrew: 'he', italian: 'it', hindi: 'hi', greek: 'el', latin: 'it', sanskrit: 'hi', japanese: 'ja', chinese: 'zh', mandarin: 'zh', spanish: 'es', french: 'fr', german: 'de', persian: 'fa', portuguese: 'pt', russian: 'ru', korean: 'ko', turkish: 'tr', urdu: 'ur', polish: 'pl', hungarian: 'hu', vietnamese: 'vi', swahili: 'sw', amharic: 'am', armenian: 'hy', georgian: 'ka', tibetan: 'bo', thai: 'th', dutch: 'nl' };

/** Short, stable hash for card ids (FNV-1a, base 36). */
function hash(s: string) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function parseDeck(file: string, text: string): Deck {
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const meta: Record<string, string> = {};
  for (const line of fm?.[1].split('\n') ?? []) { const m = /^(\w+):\s*(.*)$/.exec(line); if (m) meta[m[1]] = m[2].trim(); }
  let body = fm ? text.slice(fm[0].length) : text;
  // A lesson: everything between a `:::lesson` line and a `:::` line, read before the cards (components/Lesson.tsx).
  let lesson: string | null = null;
  body = body.replace(/^:::lesson[ \t]*\n([\s\S]*?)\n:::[ \t]*$/m, (_w, l: string) => { lesson = l.trim(); return ''; });
  // A number in front of a folder or file name only sets the order ("2 Ancient China" → Ancient China, second).
  const parts = file.replace(/^.*decks\//, '').replace(/\.md$/, '').split('/').map(p => p.replace(/^\d+\s+/, ''));
  const subject = meta.subject || parts[0];
  const path = meta.path ? meta.path.split('/').map(s => s.trim()).filter(Boolean) : parts.slice(1, -1);
  const title = meta.title || parts[parts.length - 1].replace(/[-_]/g, ' ');
  const id = slug([subject, ...path, title].join(' '));
  // era: Prehistory, Ancient… (front matter): files the deck under its subject's "By era" lens as well.
  const eras = (meta.era ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const cards: Deck['cards'] = [];
  // Lines like related: / native: / species: apply to the cards under *this* heading, wherever they sit in it. The same
  // heading can appear twice ("Which spirit?"), so cards remember which occurrence they're under.
  let section = 0; const secOf = new Map<string, number>();
  let context: string | null = null, picture: NoteCard['picture'] = null, related: string[] = [], native: NoteCard['native'] = [], species: string | undefined, intro: string[] = [], seenHeading = false;
  const add = (c: Omit<NoteCard, 'context' | 'picture' | 'note' | 'fp' | 'related' | 'native'>, key: string) => {
    const card: NoteCard = { ...c, context, picture, related, native, ...(species ? { species } : {}), note: null, fp: `${c.pre}|${c.answer}|${c.post}` };
    // The id ignores the answer, so fixing an answer keeps your progress (the fingerprint re-queues the card).
    // Cards were once written in British spelling; the app now uses American. The id reads the new spellings as the old
    // ones, so changing "flavour" to "flavor" keeps your progress on the card. (Only words that were changed; add any
    // future respelling here the same way.)
    const stable = key.replace(/\bflavor/g, 'flavour').replace(/\bcolorful/g, 'colourful').replace(/\bmodeled/g, 'modelled').replace(/\btraveler/g, 'traveller');
    let cid = `N-${id}-${hash((context ?? '') + '|' + stable)}`;
    while (cards.some(x => x.id === cid)) cid += 'x';
    cards.push({ id: cid, card }); secOf.set(cid, section);
  };
  // Code: a fenced block (```python … ```) right after a card is shown with that card ("This prints {{7}}." + the
  // program). A block with blanks in it is a card of its own, asked by the plain bullet above it ("- Fill in the loop:").
  let fence: { lang: string; lines: string[]; afterCard: boolean } | null = null, prompt: string | null = null;
  // An answer may hold one level of braces, for TeX: {{\frac{1}{1+g}|which factor?}}.
  const BLANK = /\{\{((?:[^|{}]|\{[^{}]*\})*)(?:\|([^}]*))?\}\}/g;
  let lastWasCard = false; // native: / a picture / also in: / > right after a card apply to that card (every card from that line)
  let lineFrom = 0;         // where the last bullet's cards start
  const lastCards = () => cards.slice(lineFrom);
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (fence) {
      if (!line.startsWith('```')) { fence.lines.push(raw); continue; }
      // Close the block: drop the indentation the whole block shares (it sits under a bullet), keep the rest.
      const ls = fence.lines; while (ls.length && !ls[ls.length - 1].trim()) ls.pop();
      const pad = Math.min(...ls.filter(l => l.trim()).map(l => /^\s*/.exec(l)![0].length));
      const text = ls.map(l => l.slice(pad)).join('\n'), lang = fence.lang, afterCard: boolean = fence.afterCard; fence = null;
      // A parts card: "- How a treaty takes effect" then a ```parts block, one "cue :: answer" per line.
      if (lang === 'parts' && prompt) {
        lineFrom = cards.length;
        const recall = parseRecall(text);
        add({ pre: prompt, answer: recall.steps.map(s => s.answer).join(' · '), post: '', front: true, recall }, 'parts:' + prompt);
        cards[cards.length - 1].card.fp += '|' + text;
        prompt = null; lastWasCard = true; continue;
      }
      const blanks = [...text.matchAll(BLANK)];
      if (blanks.length && prompt) {
        // One card per blank; the other blanks show their answers.
        lineFrom = cards.length;
        const keyText = prompt + '|' + text.replace(BLANK, '_');
        blanks.forEach((m, i) => {
          let k = 0;
          const shown = text.replace(BLANK, (_w, a: string) => (k++ === i ? '\u0000' : a));
          add({ pre: prompt!, answer: m[1], post: '', front: false, ...(m[2] ? { hint: m[2].trim() } : {}), code: { lang, text: shown } }, keyText + '#' + i);
        });
        for (const c of lastCards()) c.card.fp += '|' + text;
        prompt = null; lastWasCard = true; continue;
      }
      // A practice card's blocks: ```python (the starting code), ```input / ```output (a test case, as many as you like),
      // ```check (asserts), ```solution.
      const pr = afterCard ? lastCards().find(c => c.card.practice)?.card.practice : undefined;
      if (pr) {
        const last = pr.cases[pr.cases.length - 1];
        if (lang === 'input') pr.cases.push({ input: text, output: null });
        else if (lang === 'output') { if (last && last.output === null) last.output = text; else pr.cases.push({ input: '', output: text }); }
        else if (lang === 'check') pr.check = text;
        else if (lang === 'solution') pr.solution = text;
        else pr.starter = text;
        for (const c of lastCards()) c.card.fp += '|' + text;
        lastWasCard = true; continue;
      }
      if (afterCard) for (const c of lastCards()) { c.card.code = { lang, text }; c.card.fp += '|' + text; }
      lastWasCard = afterCard; continue;
    }
    if (line.startsWith('```')) { fence = { lang: line.slice(3).trim().toLowerCase() || 'text', lines: [], afterCard: lastWasCard }; continue; }
    if (!line) continue;
    const wasCard: boolean = lastWasCard; lastWasCard = false;
    // "source: src/tree.ts": where the code on the card above comes from; the card links to it on GitHub.
    // "as of: November 2026": the card is about the current state of things; shown on the card, rewritten when it changes.
    // "eq: Cobb-Douglas production function | Y = A K^{\alpha} N^{1-\alpha}": the cards above are about that equation;
    // all such cards, from any deck or course, are gathered under Equations. The formula after | is TeX.
    const eqLine = /^eq:\s*([^|]+?)\s*(?:\|\s*(.+))?$/i.exec(line);
    if (eqLine) { for (const c of lastCards()) c.card.eq = { name: eqLine[1], tex: eqLine[2]?.trim() ?? null }; lastWasCard = wasCard; continue; }
    const asOf = /^as of:\s*(.+)$/i.exec(line);
    if (asOf) { for (const c of lastCards()) { c.card.asOf = asOf[1].trim(); c.card.fp += '|' + asOf[1].trim(); } lastWasCard = wasCard; continue; }
    const srcLine = /^source:\s*(\S+)$/i.exec(line);
    if (srcLine) { for (const c of lastCards()) c.card.source = srcLine[1]; lastWasCard = wasCard; continue; }
    const h = /^#{1,3}\s+(.*)$/.exec(line);
    if (h) { prompt = null; section++; context = h[1]; picture = null; related = []; native = []; species = undefined; seenHeading = true; continue; }
    // "native: الكعبة (Arabic); Kaʿbah (Arabic, in Latin letters)": shown with a speaker button after the answer.
    // "species: Juniperus communis": the scientific name of the plant or animal, shown in italics after the answer.
    const sp = /^species:\s*(.+)$/i.exec(line);
    if (sp) {
      if (wasCard) { for (const c of lastCards()) c.card.species = sp[1].trim(); lastWasCard = true; continue; } // right after a card: that card only
      species = sp[1].trim(); for (const c of cards) if (secOf.get(c.id) === section) c.card.species = species; continue;
    }
    const nat = /^(?:native|local):\s*(.+)$/i.exec(line);
    if (nat) {
      // "Milan = Milano (Italian)": for the card whose answer is Milan only (a line with two blanks makes two cards).
      const forOf = new Map<object, string>();
      native = nat[1].split(';').map(x => { const k = /^([^=]+?)\s*=\s*(.+)$/.exec(x.trim()); const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(k ? k[2] : x.trim()); if (m && k) forOf.set(m, k[1].trim().toLowerCase()); return m; }).filter((m): m is RegExpExecArray => !!m)
        .map(m => {
          // "夏朝 Xià Cháo (Chinese)": the script first, then its romanization (pinyin, romaji…), shown under it.
          const sr = /^(.*?[^\x00-\u024f\s'’-])\s+([\x00-\u024f'’ -]+)$/.exec(m[1]);
          return { name: sr ? sr[1] : m[1], ...(sr ? { roman: sr[2].trim() } : {}), lang: m[2], code: LANG_CODE[m[2].toLowerCase().replace(/^(ancient|classical|modern) /, '')], ...(forOf.has(m) ? { for: forOf.get(m) } : {}) };
        });
      // Right after a card: that card only (the card whose answer is the name). Under the heading, before any card: all of them.
      const mine = (answer: string) => native.filter(n => !n.for || n.for === answer.toLowerCase()).map(({ for: _f, ...n }) => n);
      if (wasCard) { for (const c of lastCards()) c.card.native = mine(c.card.answer); native = []; lastWasCard = true; continue; }
      for (const c of cards) if (secOf.get(c.id) === section) c.card.native = mine(c.card.answer);
      continue;
    }
    const rel = /^related:\s*(.+)$/i.exec(line);
    // Applies to every card under this heading, wherever the line sits.
    if (rel) { related = rel[1].split(',').map(x => x.trim()).filter(Boolean); for (const c of cards) if (secOf.get(c.id) === section) c.card.related = related; continue; }
    const img = /^!\[([^\]]*)\]\((.+)\)$/.exec(line); // file names can contain brackets: "Golden Temple (Amritsar).jpg"
    if (img) {
      const src = img[2], pic = src.startsWith('commons:') ? { file: src.slice(8), caption: img[1] || context || '' } : { url: src, caption: img[1] || context || '' };
      // Right after a card: that card's own picture (the oracle bone on the card about Shang writing). Otherwise the heading's.
      if (wasCard) { for (const c of lastCards()) c.card.picture = pic; lastWasCard = true; continue; }
      picture = pic; continue;
    }
    // "also in: Philadelphia, New Jersey" after a card: it also appears in those decks (by title), e.g. History by place.
    const alsoIn = /^also in:\s*(.+)$/i.exec(line);
    if (alsoIn) { for (const c of lastCards()) c.card.also = alsoIn[1].split(',').map(x => x.trim()).filter(Boolean); lastWasCard = wasCard; continue; }
    if (line.startsWith('>')) { for (const c of lastCards()) c.card.note = (c.card.note ? c.card.note + ' ' : '') + line.replace(/^>\s?/, ''); lastWasCard = wasCard; continue; }
    const b = /^[-*]\s+(.*)$/.exec(line);
    if (!b) { if (!seenHeading) intro.push(line); continue; }
    let t = b[1];
    lastWasCard = true; lineFrom = cards.length; prompt = null;
    // "[practice] Ask for a name and greet it": a practice card (its code blocks follow).
    const prac = /^\[practice\]\s*(.+)$/i.exec(t);
    if (prac) { add({ pre: prac[1], answer: 'its solution', post: '', front: false, practice: { starter: '', cases: [], check: '', solution: '' } }, 'practice:' + prac[1]); continue; }
    // "[strata: Mesozoic]": a time-scale card drawn from src/geotime.ts (the unit's place and its blank parts).
    const st = /^\[strata:\s*([^\]]+)\]\s*(.*)$/i.exec(t);
    if (st) { add({ pre: st[2] || `The parts of the ${st[1]}, oldest at the bottom`, answer: st[1], post: '', front: true, strata: st[1].trim() }, 'strata:' + st[1]); continue; }
    // "[bureau: EGY] Which regional bureau covers Egypt?": a map card; the answer comes from src/bureaus.ts.
    const bu = /^\[bureau:\s*([A-Za-z]{3})\]\s*(.+)$/i.exec(t);
    if (bu) { const b = bureauOf(bu[1]); add({ pre: bu[2], answer: b ? bureauAnswer(b) : '', post: '', front: true, bureau: bu[1].toUpperCase() }, 'bureau:' + bu[1].toUpperCase()); continue; }
    // "[picture]" in a cloze: the heading's picture is shown as the question.
    const picFirst = /\[picture\]/i.test(t) && /\{\{/.test(t);
    if (picFirst) t = t.replace(/\s*\[picture\]\s*/i, ' ').trim();
    const fb = /^(.*?)\s+(:::|::)\s+(.*)$/.exec(t);
    if (fb) {
      // "What is made from this? [picture] :: gin": the picture is shown as the question.
      if (/\[picture\]/i.test(fb[1])) { add({ pre: fb[1].replace(/\s*\[picture\]\s*/i, ' ').trim(), answer: fb[3], post: '', front: true, pictureFirst: true }, fb[1]); continue; }
      add({ pre: fb[1], answer: fb[3], post: '', front: true }, fb[1]);
      if (fb[2] === ':::') add({ pre: fb[3], answer: fb[1], post: '', front: true }, '↺' + fb[3]); // both directions
      continue;
    }
    // {{answer}} or {{answer|hint}}: the hint ("what city?") replaces the plain "what?" until the card is flipped.
    const blanks = [...t.matchAll(/\{\{((?:[^|{}]|\{[^{}]*\})*)(?:\|([^}]*))?\}\}/g)];
    if (!blanks.length) { prompt = t; continue; } // a plain bullet is a note to yourself, or the question for a code block below it
    // {{c1::order}} … {{c1::sensitivity}}: blanks with the same number are hidden together on one card (a short list
    // learned as one fact); unnumbered blanks each make their own card.
    const group = (m: RegExpMatchArray) => /^c(\d+)::/.exec(m[1])?.[1] ?? null;
    const strip = (x: string) => x.replace(/^c\d+::/, '');
    const keyText = t.replace(/\{\{(?:[^{}]|\{[^{}]*\})*\}\}/g, '_');
    const plainAll = (x: string) => x.replace(/\{\{(?:c\d+::)?((?:[^|{}]|\{[^{}]*\})*)(?:\|[^}]*)?\}\}/g, '$1');
    const done = new Set<string>();
    blanks.forEach((m, i) => {
      const g = group(m);
      if (!g) {
        const before = plainAll(t.slice(0, m.index)), after = plainAll(t.slice(m.index! + m[0].length));
        add({ pre: before, answer: m[1], post: after, front: false, ...(m[2] ? { hint: m[2].trim() } : {}), ...(picFirst ? { pictureFirst: true } : {}) }, keyText + '#' + i);
        return;
      }
      if (done.has(g)) return;
      done.add(g);
      const parts: NonNullable<NoteCard['parts']> = [];
      let at = 0;
      for (const n of blanks) {
        parts.push(plainAll(t.slice(at, n.index)));
        parts.push(group(n) === g ? { answer: strip(n[1]), ...(n[2] ? { hint: n[2].trim() } : {}) } : strip(n[1]));
        at = n.index! + n[0].length;
      }
      parts.push(plainAll(t.slice(at)));
      const answers = blanks.filter(n => group(n) === g).map(n => strip(n[1]));
      add({ pre: plainAll(t), answer: answers.join(', '), post: '', front: false, parts, ...(picFirst ? { pictureFirst: true } : {}) }, keyText + '#c' + g);
    });
  }
  // The intro keeps its lines (a book's summary page has paragraphs); `depth: deep` marks a deck of deep cuts.
  return { file, id, title, subject, path, intro: intro.join('\n') || null, eras, deep: meta.depth === 'deep', lesson,
    objectives: (meta.objectives ?? '').split(',').map(s => s.trim()).filter(Boolean), chapter: meta.chapter || null, follows: (meta.follows ?? '').split(';').map(s => s.trim()).filter(Boolean), checked: meta.checked || null, cards };
}

// Every deck file under geo-quest/decks (bundled at build time; README files are documentation, not decks).
// (Outside Vite, e.g. in a test script, import.meta.glob doesn't exist: no decks.)
let files: Record<string, string> = {};
try { files = import.meta.glob('../decks/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>; } catch { /* not built by Vite */ }
// Decks built from data in the app itself (the geologic time scale, shared with its chart).
const BUILT: [string, string][] = [['../decks/Earth history/Geologic time scale.md', geotimeDeck()], ['../decks/Earth history/Epochs of the Cenozoic.md', epochDeck()]];
export const DECKS: Deck[] = [...Object.entries(files).filter(([f]) => !/README\.md$/i.test(f)), ...BUILT].map(([f, t]) => parseDeck(f, t))
  // Folder and file order (numbers first). Compared without ".md", so "Hashing" comes before "Hashing - going further".
  .sort((a, b) => a.file.replace(/^.*decks\//, '').replace(/\.md$/, '').localeCompare(b.file.replace(/^.*decks\//, '').replace(/\.md$/, ''), 'en', { numeric: true }));
export const NOTE_SUBJECTS = [...new Set(DECKS.map(d => d.subject))];
/** The Live topics lens: every deck that follows an ongoing story. */
export const LIVE = 'Live topics';
export const HAS_LIVE = DECKS.some(d => d.follows.length);
/** The Equations lens: every card tagged `eq:`, grouped by equation, under the course it first appears in. */
export const EQUATIONS = 'Equations';
export const HAS_EQUATIONS = DECKS.some(d => d.cards.some(c => c.card.eq));

/** The world eras a deck can be tagged with (`era:`), oldest first. Rough world-history spans; a deck can name two. */
export const ERAS = [
  { key: 'prehistory', section: 'All prehistory', span: 'before writing' },
  { key: 'ancient', section: 'All ancient history', span: 'to about AD 500' },
  { key: 'medieval', section: 'All medieval history', span: 'about 500–1500' },
  { key: 'early modern', section: 'All early modern history', span: 'about 1500–1800' },
  { key: 'modern', section: 'All modern history', span: 'about 1800–1945' },
  { key: 'contemporary', section: 'All contemporary history', span: '1945 to today' },
];

/** Register note decks as sections (subject › path…) and groups (one per deck), and return their cards as items. */
export function registerNotes(): Place[] {
  const out: Place[] = [];
  for (const d of DECKS) {
    const chain: string[] = [];
    for (const sec of [d.subject, ...d.path]) chain.push(claimSection(sec, chain.length ? chain[chain.length - 1] : null));
    const gid = 'n-' + d.id;
    // Deep cuts unlock once half of the core deck beside them (same folder, not deep) is known.
    const core = d.deep ? DECKS.find(x => !x.deep && x.subject === d.subject && x.path.join('/') === d.path.join('/') && d.title.startsWith(x.title)) ?? DECKS.find(x => !x.deep && x.subject === d.subject && x.path.join('/') === d.path.join('/')) : undefined;
    if (!GROUPS.some(g => g.id === gid)) GROUPS.push({ id: gid, section: chain[chain.length - 1], name: d.title, layer: 'note', topics: [{ id: 'notes', name: 'Cards', icon: 'book' }], note: d.intro ?? undefined, ...(core ? { requires: `n-${core.id}/notes` } : {}),
      ...(d.lesson ? { lesson: d.lesson } : {}), ...(d.objectives.length || d.chapter ? { secplus: { objectives: d.objectives, chapter: d.chapter } } : {}) });
    for (const { id, card } of d.cards) out.push({ id, layer: 'note', group: gid, name: card.context ?? d.title, capitals: [], capitalAnswer: null, card, deckTitle: d.title, deckPath: [d.subject, ...d.path], native: card.native.length ? card.native : undefined, species: card.species } as unknown as Place);
  }
  // Lenses: a deck tagged `era: Prehistory` is also listed under <subject> › By era › All prehistory, next to every
  // other deck of that era from any country (China's Paleolithic, the Americas' first peoples…). Filed once, shown in
  // both places, one set of progress; the eras are a fixed list, so the lens reads in time order.
  for (const era of ERAS) for (const d of DECKS.filter(x => x.eras.some(e => e.toLowerCase() === era.key))) {
    const g = GROUPS.find(x => x.id === 'n-' + d.id)!;
    const sec = claimSection(era.section, claimSection('By era', d.subject));
    if (!g.alsoInSections?.includes(sec)) g.alsoInSections = [...(g.alsoInSections ?? []), sec];
  }
  // Security+ lenses: a lesson tagged `objectives: 1.4` is also listed under Cybersecurity › By exam objective ›
  // "1.4 Cryptographic solutions", and `chapter: 7` under By book chapter › "Ch. 7 Cryptography and the PKI", in exam
  // order, so it lines up with the owner's Study Lab. Filed once, one set of progress.
  const byCode = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true });
  for (const code of [...new Set(DECKS.flatMap(d => d.objectives))].sort(byCode)) for (const d of DECKS.filter(x => x.objectives.includes(code))) {
    const g = GROUPS.find(x => x.id === 'n-' + d.id)!, sec = claimSection(objectiveName(code), claimSection('By exam objective', d.subject));
    if (!g.alsoInSections?.includes(sec)) g.alsoInSections = [...(g.alsoInSections ?? []), sec];
  }
  for (const ch of [...new Set(DECKS.map(d => d.chapter).filter((c): c is string => !!c))].sort(byCode)) for (const d of DECKS.filter(x => x.chapter === ch)) {
    const g = GROUPS.find(x => x.id === 'n-' + d.id)!, sec = claimSection(chapterName(ch), claimSection('By book chapter', d.subject));
    if (!g.alsoInSections?.includes(sec)) g.alsoInSections = [...(g.alsoInSections ?? []), sec];
  }
  // Live topics: a deck that follows Wikipedia articles (`follows:`) is also listed under Live topics, its own subject,
  // beside every other ongoing story. The weekly briefing reads those articles and suggests cards (scripts/briefing.mjs).
  for (const d of DECKS.filter(x => x.follows.length)) {
    const g = GROUPS.find(x => x.id === 'n-' + d.id)!, sec = claimSection(LIVE, null);
    if (!g.alsoInSections?.includes(sec)) g.alsoInSections = [...(g.alsoInSections ?? []), sec];
  }
  // Equations: one group per equation, filed under Equations › <the course it first appears in> (Macroeconomics for
  // Public Policy…), and also under every other course that uses it. A card's progress is shared with its own deck.
  const eqGroups = new Map<string, string>();
  const display = (t: string) => '$$' + t + '$$';
  for (const d of DECKS) for (const { id, card } of d.cards) {
    if (!card.eq) continue;
    const course = d.path[0] ?? d.subject, gid = 'eq-' + slug(card.eq.name);
    const sec = claimSection(course, claimSection(EQUATIONS, null));
    let g = GROUPS.find(x => x.id === gid);
    if (!g) { g = { id: gid, section: sec, name: card.eq.name, layer: 'note', topics: [{ id: 'notes', name: 'Cards', icon: 'book' }], ...(card.eq.tex ? { note: display(card.eq.tex) } : {}) }; GROUPS.push(g); }
    else if (g.section !== sec && !g.alsoInSections?.includes(sec)) g.alsoInSections = [...(g.alsoInSections ?? []), sec];
    if (card.eq.tex && !g.note) g.note = display(card.eq.tex);
    eqGroups.set(id, gid);
  }
  // Cards tagged "also in: <deck title>" are listed in that deck too (one set of progress).
  const byTitle = new Map(DECKS.map(d => [d.title.toLowerCase(), 'n-' + d.id]));
  for (const p of out) {
    const also = (p as unknown as { card?: NoteCard }).card?.also;
    if (also?.length) p.alsoIn = also.map(t => byTitle.get(t.toLowerCase())).filter((g): g is string => !!g);
    const eg = eqGroups.get(p.id); if (eg) p.alsoIn = [...(p.alsoIn ?? []), eg];
  }
  return out;
}
