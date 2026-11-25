// Economics graphs, described in a few lines (components/Graph.tsx draws them): axes, curves, and the shifts a shock
// causes. Plain TypeScript, so the deck audit can check every graph.
//
//   ```graph
//   # Government purchases rise
//   axes: Y | r                 (horizontal | vertical)
//   IS: down                    (a name, then down, up, vertical X or horizontal Y; optionally steep or flat,
//   LM: up                       and a center point "at 0.4 0.6"; the default center is the middle of the graph)
//   FE: vertical 0.55
//   shift IS: right             (right, left, up or down; as many as the shock causes)
//   ```
export type Kind = 'down' | 'up' | 'vertical' | 'horizontal';
export interface Curve { name: string; kind: Kind; slope: number; cx: number; cy: number; at: number }
export interface GraphSpec { title: string | null; x: string; y: string; curves: Curve[]; shifts: { name: string; dir: 'right' | 'left' | 'up' | 'down' }[]; equilibrium: string[]; errors: string[] }

export function parseGraph(text: string): GraphSpec {
  const g: GraphSpec = { title: null, x: 'Q', y: 'P', curves: [], shifts: [], equilibrium: [], errors: [] };
  for (const raw of text.split('\n')) {
    const l = raw.trim(); if (!l) continue;
    let m: RegExpExecArray | null;
    if ((m = /^#\s+(.*)$/.exec(l))) g.title = m[1];
    else if ((m = /^axes:\s*(.+?)\s*\|\s*(.+)$/i.exec(l))) { g.x = m[1]; g.y = m[2]; }
    else if ((m = /^shift\s+(.+?):\s*(right|left|up|down)$/i.exec(l))) g.shifts.push({ name: m[1].trim(), dir: m[2].toLowerCase() as 'right' });
    else if ((m = /^equilibrium:\s*(.+)$/i.exec(l))) g.equilibrium = m[1].split(',').map(s => s.trim());
    else if ((m = /^(.+?):\s*(down|up|vertical|horizontal)\b(.*)$/i.exec(l))) {
      const rest = m[3], num = /^\s*(-?[\d.]+)/.exec(rest), at = /at\s+([\d.]+)\s+([\d.]+)/.exec(rest);
      const kind = m[2].toLowerCase() as Kind;
      g.curves.push({ name: m[1].trim(), kind, slope: /steep/.test(rest) ? 1.6 : /flat/.test(rest) ? 0.35 : 0.8,
        cx: at ? +at[1] : 0.5, cy: at ? +at[2] : 0.5, at: num ? +num[1] : 0.5 });
    } else g.errors.push(`can't read "${l}"`);
  }
  for (const s of g.shifts) if (!g.curves.some(c => c.name === s.name)) g.errors.push(`shift names no curve: ${s.name}`);
  for (const e of g.equilibrium) if (!g.curves.some(c => c.name === e)) g.errors.push(`equilibrium names no curve: ${e}`);
  if (!g.equilibrium.length) g.equilibrium = g.curves.slice(0, 2).map(c => c.name);
  return g;
}

/** How far a shift moves a curve, in the graph's 0–1 units. */
export const SHIFT = 0.17;
/** A curve after its shifts (if `shifted`). */
export function moved(c: Curve, shifts: GraphSpec['shifts'], shifted: boolean): Curve {
  if (!shifted) return c;
  let { cx, cy, at } = c;
  for (const s of shifts.filter(s => s.name === c.name)) {
    const d = s.dir === 'right' || s.dir === 'up' ? SHIFT : -SHIFT;
    if (c.kind === 'vertical') { if (s.dir === 'right' || s.dir === 'left') at += d; }
    else if (c.kind === 'horizontal') { if (s.dir === 'up' || s.dir === 'down') at += d; }
    else if (s.dir === 'right' || s.dir === 'left') cx += d; else cy += d;
  }
  return { ...c, cx, cy, at };
}
/** y at x for a sloped curve. */
export const yAt = (c: Curve, x: number) => c.cy + (c.kind === 'up' ? 1 : -1) * c.slope * (x - c.cx);
/** Where two curves cross, if they do. */
export function cross(a: Curve, b: Curve): { x: number; y: number } | null {
  const v = [a, b].find(c => c.kind === 'vertical'), h = [a, b].find(c => c.kind === 'horizontal');
  if (v && h) return { x: v.at, y: h.at };
  if (v) { const o = v === a ? b : a; return o.kind === 'vertical' ? null : { x: v.at, y: yAt(o, v.at) }; }
  if (h) { const o = h === a ? b : a; if (o.kind === 'horizontal') return null; const s = (o.kind === 'up' ? 1 : -1) * o.slope; return { x: o.cx + (h.at - o.cy) / s, y: h.at }; }
  const sa = (a.kind === 'up' ? 1 : -1) * a.slope, sb = (b.kind === 'up' ? 1 : -1) * b.slope;
  if (sa === sb) return null;
  const x = (b.cy - sb * b.cx - a.cy + sa * a.cx) / (sa - sb);
  return { x, y: yAt(a, x) };
}
