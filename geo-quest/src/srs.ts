import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade } from 'ts-fsrs';
import { useSyncExternalStore } from 'react';
import { GROUPS, cardsForNode, fingerprint, legacyFingerprints, groupById, kindApplies, parseNode, refFromId, slotOf, nodeId, nodeOfCard, TAP_KINDS, type CardRef } from './cards';
import type { Dataset } from './types';

export { Rating, State };
export type { Grade };

// FSRS: the same scheduling algorithm modern Anki uses.
export const scheduler = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9 }));

export interface Settings {
  sound: boolean; music: boolean; sfx: Partial<Record<import('./sound').Role, string>>; /* sounds picked in the Sound lab */ gamify: boolean; pictures: boolean; locks: boolean;
  theme: 'auto' | 'light' | 'dark'; newPerDay: number;
  mapNames: boolean; mapCapitals: boolean; mapWater: boolean; mapCn: boolean; mapRivers: boolean; mapLakes: boolean; mapUs: boolean; mapTerr: boolean; mapSub: boolean; mapSites: boolean; mapMountains: boolean; mapRoads: boolean; mapDeserts: boolean; mapContext: boolean;
  nativeNames: boolean;
  mapMode: 'tap' | 'flip' | 'skip';
  kindsOff: string[];                 // question types switched off (they wait until switched back on)
  sessionNodes: string[] | null;      // decks picked for the next session on the Today screen (null = all)
  targetBox: boolean;                 // lock-on brackets around the place in question   // how "find it on the map" cards work
}
interface CardRec { c: Card; fp: string }
interface Day { reviews: number; fresh: number; correct: number; bonus?: number }
export interface QuizBest { best: number; total: number; date: string }
export interface Progress {
  v: 1;
  cards: Record<string, CardRec>;
  active: string[];          // skill-tree nodes you're currently learning
  settings: Settings;
  xp: number;
  days: Record<string, Day>;
  updates: { date: string; text: string }[]; // facts that changed under you
  quizBest: Record<string, QuizBest>;
  clipStarts?: Record<string, number>; // music: where you chose a clip should start ("file@listed start" → seconds)
  pins?: string[];           // searches pinned in the Library (just the words: matching cards are found fresh each time)
}

const KEY = 'geoquest:v1';
const DEFAULT: Progress = {
  v: 1, cards: {}, active: [], xp: 0, days: {}, updates: [], quizBest: {},
  settings: { sound: true, music: false, sfx: {}, gamify: true, pictures: true, locks: true, theme: 'auto', newPerDay: 15, mapNames: true, mapCapitals: false, mapWater: false, mapCn: false, mapRivers: true, mapLakes: true, mapUs: false, mapTerr: false, mapSub: false, mapSites: false, mapMountains: false, mapRoads: false, mapDeserts: false, mapContext: false, nativeNames: true, mapMode: 'tap', targetBox: true, kindsOff: [], sessionNodes: null },
};

function revive(p: Progress): Progress {
  for (const r of Object.values(p.cards)) {
    r.c.due = new Date(r.c.due);
    if (r.c.last_review) r.c.last_review = new Date(r.c.last_review);
  }
  return { ...DEFAULT, ...p, active: p.active ?? [], quizBest: p.quizBest ?? {}, settings: { ...DEFAULT.settings, ...p.settings, kindsOff: p.settings?.kindsOff ?? [], sessionNodes: p.settings?.sessionNodes ?? null } };
}

/** The skills you're learning that exist in the data loaded now. Unknown ones (a renamed group, or a data file
 *  that failed to load) are ignored but kept in your save, so nothing is lost if they come back. */
export function activeNodes(p: Progress) {
  const valid = new Set(GROUPS.flatMap(g => g.topics.map(t => nodeId(g.id, t.id))));
  return p.active.filter(n => valid.has(n));
}

function load(): Progress {
  try { const raw = localStorage.getItem(KEY); if (raw) return revive(JSON.parse(raw)); } catch { /* private mode etc. */ }
  return structuredClone(DEFAULT);
}

let state = load();
const listeners = new Set<() => void>();
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }
export function update(fn: (p: Progress) => void) {
  const next = structuredClone(state); fn(next); state = next; save(); listeners.forEach(l => l());
}
export function useProgress() {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, () => state);
}
export const getProgress = () => state;
/** Put back an earlier snapshot of progress (used by Undo). */
export function restoreProgress(p: Progress) { state = p; save(); listeners.forEach(l => l()); }

export const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

// ---- data refresh: re-queue cards whose underlying fact changed -------------------
export function reconcile(ds: Dataset) {
  const stale: string[] = [];
  for (const [id, rec] of Object.entries(state.cards)) {
    const ref = refFromId(ds, id);
    if (!ref) continue;
    if (rec.fp !== fingerprint(ref.kind, ref.country) && !legacyFingerprints(ref.kind, ref.country).includes(rec.fp)) stale.push(id);
  }
  if (!stale.length) return;
  update(p => {
    const names = new Set<string>();
    for (const id of stale) {
      const ref = refFromId(ds, id)!;
      p.cards[id] = { c: createEmptyCard(new Date()), fp: fingerprint(ref.kind, ref.country) };
      names.add(ref.country.name);
    }
    const ids = new Set(stale.map(id => id.split(':')[0]));
    const recent = ds.changes.filter(ch => ids.has(ch.id) || names.has(ch.name)).map(ch => `${ch.name}: ${ch.field} changed from “${ch.from}” to “${ch.to}”`);
    p.updates.unshift({ date: today(), text: recent.length ? recent.join(' · ') : `Facts updated for ${[...names].join(', ')} — those cards were re-queued.` });
  });
}

// ---- levels & progress ------------------------------------------------------------
/** 0 new · 1 learning · 2 known (in review) · 3 mastered (next review ≥ 3 weeks out) */
export function level(p: Progress, id: string): 0 | 1 | 2 | 3 {
  const r = p.cards[id];
  if (!r || r.c.state === State.New) return 0;
  if (r.c.state !== State.Review) return 1;
  return r.c.stability >= 21 ? 3 : 2;
}

export function nodeStats(ds: Dataset, p: Progress, node: string) {
  const cards = cardsForNode(ds, node);
  let started = 0, known = 0, mastered = 0, due = 0;
  const now = Date.now();
  for (const c of cards) {
    const l = level(p, c.id);
    if (l > 0) started++;
    if (l >= 2) known++;
    if (l === 3) mastered++;
    const r = p.cards[c.id];
    if (r && r.c.state !== State.New && r.c.due.getTime() <= now) due++;
  }
  return { total: cards.length, started, known, mastered, due };
}

export function isUnlocked(ds: Dataset, p: Progress, node: string) {
  if (!p.settings.locks) return true;
  const { groupId } = parseNode(node);
  const g = groupById(groupId);
  if (g.requires) { const r = nodeStats(ds, p, g.requires); if (r.total && r.known / r.total < 0.5) return false; }
  const req = slotOf(node).requires;
  if (!req) return true;
  const s = nodeStats(ds, p, nodeId(groupId, req));
  return !s.total || s.known / s.total >= 0.5; // an empty prerequisite never locks a skill for good
}

// ---- building a study session ---------------------------------------------------
/** With map questions set to "skip", tap-the-map cards wait on the side until you switch back. */
export const skipped = (p: Progress, kind: string) => (p.settings.mapMode === 'skip' && (TAP_KINDS as string[]).includes(kind)) || p.settings.kindsOff.includes(kind);

/** The decks a session covers: the ones passed in, else the Today-screen pick, else everything you're learning. */
export function sessionDecks(p: Progress, nodes?: string[]) {
  if (nodes) return nodes;
  const active = activeNodes(p);
  const pick = p.settings.sessionNodes?.filter(n => active.includes(n));
  return pick ?? active;
}

export function buildQueue(ds: Dataset, p: Progress, nodes?: string[]): { due: CardRef[]; fresh: CardRef[] } {
  const now = Date.now();
  const decks = new Set(sessionDecks(p, nodes));
  const all = !nodes && p.settings.sessionNodes === null; // "everything": include due reviews from decks you've stopped learning too
  const due: CardRef[] = [];
  for (const [id, r] of Object.entries(p.cards)) {
    if (r.c.due.getTime() <= now) { const ref = refFromId(ds, id); if (ref && !skipped(p, ref.kind) && kindApplies(ref.kind, ref.country) && (all || decks.has(nodeOfCard(ref)))) due.push(ref); }
  }
  due.sort((a, b) => p.cards[a.id].c.due.getTime() - p.cards[b.id].c.due.getTime());

  const d = p.days[today()];
  const budget = Math.max(0, p.settings.newPerDay + (d?.bonus ?? 0) - (d?.fresh ?? 0));
  // Mix card types, but never show the same country twice in a row: each card
  // type's list is rotated by a different offset, then we deal round-robin.
  const lists: CardRef[][] = [];
  for (const node of decks) {
    if (!isUnlocked(ds, p, node)) continue;
    let unseen = cardsForNode(ds, node).filter(c => (!p.cards[c.id] || p.cards[c.id].c.state === State.New) && !skipped(p, c.kind));
    // Note cards from the same topic (three blanks in one Negroni line) are spread out, not shown back to back.
    if (unseen.some(c => c.kind === 'note')) {
      const nth = new Map<string, number>();
      unseen = unseen.map((c, i) => { const k = c.country.name; const r = nth.get(k) ?? 0; nth.set(k, r + 1); return { c, r, i }; }).sort((a, b) => a.r - b.r || a.i - b.i).map(x => x.c);
    }
    const kinds = [...new Set(unseen.map(c => c.kind))];
    kinds.forEach((k, j) => {
      const l = unseen.filter(c => c.kind === k);
      const off = Math.floor((j * l.length) / kinds.length);
      lists.push([...l.slice(off), ...l.slice(0, off)]);
    });
  }
  const fresh: CardRef[] = [];
  for (let i = 0; lists.some(l => i < l.length); i++) for (const l of lists) if (i < l.length) fresh.push(l[i]);
  return { due, fresh: fresh.slice(0, budget) };
}

/** How many unseen cards are waiting in the skills you're learning (ignoring today's limit). */
export function unseenCount(ds: Dataset, p: Progress, nodes?: string[]) {
  let n = 0;
  for (const node of sessionDecks(p, nodes)) if (isUnlocked(ds, p, node)) n += cardsForNode(ds, node).filter(c => (!p.cards[c.id] || p.cards[c.id].c.state === State.New) && !skipped(p, c.kind)).length;
  return n;
}

/** "Learn 10 more" — raise today's allowance for new cards. */
/** Deal cards round-robin by place, so one country's five card types don't come in a row. */
function spread(refs: CardRef[]): CardRef[] {
  const by = new Map<string, CardRef[]>();
  for (const r of refs) { const l = by.get(r.country.id); if (l) l.push(r); else by.set(r.country.id, [r]); }
  const lists = [...by.values()], out: CardRef[] = [];
  for (let i = 0; out.length < refs.length; i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
}

/**
 * A session on chosen cards (a search): the ones due, then up to `newLimit` you haven't started. Chosen on purpose, so
 * new cards here don't wait for the daily budget. They join your schedule like any other card.
 */
export function queueForCards(p: Progress, refs: CardRef[], newLimit = 20): { due: CardRef[]; fresh: CardRef[] } {
  const now = Date.now(), ok = refs.filter(r => !skipped(p, r.kind) && kindApplies(r.kind, r.country));
  const due = ok.filter(r => { const c = p.cards[r.id]; return c && c.c.state !== State.New && c.c.due.getTime() <= now; });
  const fresh = spread(ok.filter(r => { const c = p.cards[r.id]; return !c || c.c.state === State.New; })).slice(0, newLimit);
  return { due: spread(due), fresh };
}

export function learnMore(n = 10) {
  update(p => { const d = (p.days[today()] ??= { reviews: 0, fresh: 0, correct: 0 }); d.bonus = (d.bonus ?? 0) + n; });
}

export function recordQuiz(key: string, score: number, total: number) {
  update(p => {
    const prev = p.quizBest[key];
    if (!prev || score / total > prev.best / prev.total || (score / total === prev.best / prev.total && total > prev.total)) p.quizBest[key] = { best: score, total, date: today() };
    p.xp += score * 2;
  });
}

/** Record an answer. Returns the updated FSRS card. */
export function answer(ref: CardRef, grade: Grade, isNew: boolean) {
  const now = new Date();
  update(p => {
    const prev = p.cards[ref.id]?.c ?? createEmptyCard(now);
    const next = scheduler.next(prev, now, grade).card;
    p.cards[ref.id] = { c: next, fp: fingerprint(ref.kind, ref.country) };
    const d = (p.days[today()] ??= { reviews: 0, fresh: 0, correct: 0 });
    d.reviews++;
    if (isNew) d.fresh++;
    if (grade >= Rating.Good) d.correct++;
    p.xp += grade === Rating.Again ? 1 : grade === Rating.Hard ? 5 : grade === Rating.Good ? 10 : 12;
  });
  return state.cards[ref.id].c;
}

/** "in 3d" style preview for each grade button. */
export function previews(ref: CardRef) {
  const now = new Date();
  const prev = state.cards[ref.id]?.c ?? createEmptyCard(now);
  const rec = scheduler.repeat(prev, now);
  const fmt = (d: Date) => {
    const m = (d.getTime() - now.getTime()) / 60000;
    if (m < 60) return `${Math.max(1, Math.round(m))}m`;
    if (m < 1440) return `${Math.round(m / 60)}h`;
    if (m < 1440 * 30) return `${Math.round(m / 1440)}d`;
    if (m < 1440 * 365) return `${Math.round(m / 43200)}mo`;
    return `${(m / 525600).toFixed(1)}y`;
  };
  return { [Rating.Again]: fmt(rec[Rating.Again].card.due), [Rating.Hard]: fmt(rec[Rating.Hard].card.due), [Rating.Good]: fmt(rec[Rating.Good].card.due), [Rating.Easy]: fmt(rec[Rating.Easy].card.due) } as Record<Grade, string>;
}

export function streak(p: Progress) {
  let n = 0; const d = new Date();
  if (!p.days[d.toLocaleDateString('en-CA')]) d.setDate(d.getDate() - 1); // today not done yet doesn't break it
  while (p.days[d.toLocaleDateString('en-CA')]?.reviews) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ---- backup / move between phone and laptop ----------------------------------------
export function exportProgress() { return JSON.stringify(state); }
export function importProgress(json: string) {
  const p = revive(JSON.parse(json));
  if (p.v !== 1 || typeof p.cards !== 'object') throw new Error('Not an Intelligence Quest backup');
  state = p; save(); listeners.forEach(l => l());
}
