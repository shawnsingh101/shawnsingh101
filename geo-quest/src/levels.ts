// Levels: named gem tiers earned with XP, plus a weekly XP target taken from your own recent weeks.
import type { Progress } from './srs';

export interface Gem { name: string; color: string }
// Cheapest to most precious. Past Diamond the levels keep going as Diamond 2, 3, …
export const GEMS: Gem[] = [
  { name: 'Quartz', color: '#b9b1cf' },
  { name: 'Agate', color: '#c98a5e' },
  { name: 'Amethyst', color: '#9466d1' },
  { name: 'Topaz', color: '#eda23a' },
  { name: 'Garnet', color: '#a3304a' },
  { name: 'Sapphire', color: '#2f62c9' },
  { name: 'Emerald', color: '#23a067' },
  { name: 'Ruby', color: '#d8344f' },
  { name: 'Diamond', color: '#7fd0ec' },
];
export const gemOf = (n: number): Gem => n <= GEMS.length ? GEMS[n - 1] : { ...GEMS[GEMS.length - 1], name: `Diamond ${n - GEMS.length + 1}` };

// The first level takes 10,000 XP and each one after takes a fifth more (rounded to 500). At the pace of the first
// two weeks (~13,500 XP a week) that's a new level about every week at first, then every two or three.
const FIRST = 10_000, GROWTH = 1.2;
export const levelCost = (n: number) => Math.round((FIRST * GROWTH ** (n - 1)) / 500) * 500;

export function levelOf(xp: number) {
  let n = 1, start = 0;
  while (xp >= start + levelCost(n)) { start += levelCost(n); n++; }
  const need = levelCost(n);
  return { n, gem: gemOf(n), next: gemOf(n + 1), into: xp - start, need, left: start + need - xp };
}

// ---- XP per day and week ------------------------------------------------------------
const ymd = (d: Date) => d.toLocaleDateString('en-CA');
/** Monday of the week a date falls in (local time). */
export function weekStart(d = new Date()) { const m = new Date(d); m.setHours(0, 0, 0, 0); m.setDate(m.getDate() - ((m.getDay() + 6) % 7)); return m; }

/**
 * XP per day. Days from v1.41 on record it; earlier days only counted answers, so the XP not accounted for by
 * recorded days is shared among them by how many cards (and how many right) each had. The days add up to your total.
 */
export function dailyXp(p: Progress): Record<string, number> {
  const out: Record<string, number> = {};
  let known = 0, weight = 0;
  const est = (d: Progress['days'][string]) => d.correct * 10 + (d.reviews - d.correct) * 3;
  for (const [k, d] of Object.entries(p.days)) if (d.xp !== undefined) { out[k] = d.xp; known += d.xp; } else weight += est(d);
  const rest = Math.max(0, p.xp - known);
  for (const [k, d] of Object.entries(p.days)) if (d.xp === undefined) out[k] = weight ? Math.round((rest * est(d)) / weight) : 0;
  return out;
}

export function weekXp(p: Progress, start = weekStart(), daily = dailyXp(p)) {
  let n = 0; const d = new Date(start);
  for (let i = 0; i < 7; i++) { n += daily[ymd(d)] ?? 0; d.setDate(d.getDate() + 1); }
  return n;
}

/** The weekly target: the average of your last four full weeks (only weeks since you started), rounded to 500. */
export function weeklyTarget(p: Progress, daily = dailyXp(p)) {
  const first = Object.keys(p.days).sort()[0];
  const weeks: number[] = [];
  const w = weekStart(); w.setDate(w.getDate() - 7);
  for (let i = 0; i < 4 && first && ymd(new Date(w.getTime() + 6 * 864e5)) >= first; i++) { weeks.push(weekXp(p, w, daily)); w.setDate(w.getDate() - 7); }
  if (!weeks.length) return 5000; // a first week: a gentle start
  return Math.max(1000, Math.round(weeks.reduce((a, b) => a + b, 0) / weeks.length / 500) * 500);
}
