// Small SVG charts for the Dashboard: a line chart (with series and range toggles, crosshair tooltip)
// and a horizontal bar chart. One y-axis only; colours follow the series, never its rank.
import { useEffect, useMemo, useRef, useState } from 'react';

export type Pt = [string, number]; // [YYYY-MM-DD, value]
export interface Series { id: string; name: string; points: Pt[] }
export const SERIES_COLORS = 8; // --series-1 … --series-8 in styles.css

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

const t = (d: string) => Date.parse(d + 'T12:00:00Z');
const fmtDate = (ms: number, span: number) => new Date(ms).toLocaleDateString('en-US', span > 400 * 864e5 ? { month: 'short', year: 'numeric', timeZone: 'UTC' } : { month: 'short', day: 'numeric', timeZone: 'UTC' });
function niceTicks(lo: number, hi: number, n = 4) {
  if (lo === hi) { lo -= 1; hi += 1; }
  const step0 = (hi - lo) / n, mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= step0)!;
  const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}

export const RANGES = [['1M', 31], ['3M', 92], ['1Y', 366], ['5Y', 1830]] as const;
export type Range = typeof RANGES[number][0];

/** A toggle row: one chip per series (colour swatch + name), click to show / hide. */
export function SeriesToggles({ series, on, setOn, colorOf }: { series: Series[]; on: Set<string>; setOn: (s: Set<string>) => void; colorOf: (id: string) => number }) {
  return (
    <div className="chart-toggles" role="group" aria-label="Series">
      {series.map(s => (
        <button key={s.id} className={'chart-chip' + (on.has(s.id) ? ' on' : '')} aria-pressed={on.has(s.id)}
          onClick={() => { const n = new Set(on); if (n.has(s.id)) { if (n.size > 1) n.delete(s.id); } else n.add(s.id); setOn(n); }}>
          <i style={{ background: `var(--series-${colorOf(s.id)})` }} />{s.name}
        </button>
      ))}
    </div>
  );
}
export function RangeToggle({ range, setRange, ranges = RANGES.map(r => r[0]) }: { range: Range; setRange: (r: Range) => void; ranges?: Range[] }) {
  return <div className="segmented small">{ranges.map(r => <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>)}</div>;
}

/**
 * Line chart. `indexed` rebases every series to 0% at the start of the range (so the S&P 500 and the Dow share one axis).
 * `step` draws a staircase (policy rates change on a date and hold). `refLine` draws a labelled horizontal line (a 2% target).
 */
export function LineChart({ series, colorOf, range, unit = '', indexed, step, refLine, height = 220, decimals = 2 }: {
  series: Series[]; colorOf: (id: string) => number; range: Range; unit?: string; indexed?: boolean; step?: boolean;
  refLine?: { value: number; label: string }; height?: number; decimals?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null); // ms on the x-axis
  const days = RANGES.find(r => r[0] === range)![1];
  const data = useMemo(() => {
    const end = Math.max(...series.flatMap(s => s.points.length ? [t(s.points[s.points.length - 1][0])] : [0]));
    const start = end - days * 864e5;
    return series.map(s => {
      let pts = s.points.map(([d, v]) => [t(d), v] as [number, number]);
      const before = pts.filter(p => p[0] < start).pop(); // carry the last value in, so step charts start at the right level
      pts = pts.filter(p => p[0] >= start);
      if (before && (step || !pts.length || pts[0][0] > start)) pts.unshift([start, before[1]]);
      if (step && pts.length) pts.push([end, pts[pts.length - 1][1]]);
      if (indexed && pts.length) { const b = pts[0][1]; pts = pts.map(([x, v]) => [x, (100 * (v - b)) / b]); }
      return { ...s, pts };
    });
  }, [series, days, indexed, step]);

  const pad = { l: 44, r: 12, t: 10, b: 24 };
  const W = Math.max(0, width), H = height;
  const xs = data.flatMap(s => s.pts.map(p => p[0])), ys = data.flatMap(s => s.pts.map(p => p[1])).concat(refLine ? [refLine.value] : []).concat(indexed ? [0] : []);
  if (!xs.length) return <div ref={ref} className="chart empty">No data for this range.</div>;
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = Math.min(...ys), y1 = Math.max(...ys); const yp = (y1 - y0) * 0.08 || 1; y0 -= yp; y1 += yp;
  const ticks = niceTicks(y0, y1); y0 = Math.min(y0, ticks[0]); y1 = Math.max(y1, ticks[ticks.length - 1]);
  const X = (v: number) => pad.l + ((v - x0) / (x1 - x0 || 1)) * (W - pad.l - pad.r);
  const Y = (v: number) => pad.t + (1 - (v - y0) / (y1 - y0 || 1)) * (H - pad.t - pad.b);
  const path = (pts: [number, number][]) => pts.map(([x, v], i) => (i === 0 ? `M${X(x)},${Y(v)}` : step ? `H${X(x)}V${Y(v)}` : `L${X(x)},${Y(v)}`)).join('');
  const fmtV = (v: number) => (indexed ? `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}%` : `${v.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: Math.min(decimals, 2) })}${unit}`);
  const xTicks = Array.from({ length: W < 420 ? 3 : 5 }, (_, i) => x0 + ((x1 - x0) * i) / (W < 420 ? 2 : 4));
  // Hover: nearest point (at or before) per series.
  const at = (pts: [number, number][], x: number) => { let best: [number, number] | null = null; for (const p of pts) { if (p[0] <= x) best = p; else break; } return best ?? pts[0]; };
  const hx = hover != null ? Math.min(Math.max(hover, x0), x1) : null;

  return (
    <div ref={ref} className="chart">
      {W > 0 && <svg width={W} height={H} role="img" aria-label={`Line chart: ${series.map(s => s.name).join(', ')}`}
        onPointerMove={e => { const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect(); const px = e.clientX - r.left; if (px >= pad.l && px <= W - pad.r) setHover(x0 + ((px - pad.l) / (W - pad.l - pad.r)) * (x1 - x0)); }}
        onPointerLeave={() => setHover(null)}>
        {ticks.map(v => <g key={v}><line x1={pad.l} x2={W - pad.r} y1={Y(v)} y2={Y(v)} className={'grid' + (v === 0 ? ' zero' : '')} /><text x={pad.l - 6} y={Y(v) + 4} className="axis" textAnchor="end">{indexed ? `${v}%` : `${v}${unit}`}</text></g>)}
        {xTicks.map((v, i) => <text key={i} x={X(v)} y={H - 6} className="axis" textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}>{fmtDate(v, x1 - x0)}</text>)}
        {refLine && <g><line x1={pad.l} x2={W - pad.r} y1={Y(refLine.value)} y2={Y(refLine.value)} className="ref" /><text x={W - pad.r} y={Y(refLine.value) - 4} className="axis" textAnchor="end">{refLine.label}</text></g>}
        {data.map(s => <path key={s.id} d={path(s.pts)} className="line" style={{ stroke: `var(--series-${colorOf(s.id)})` }} />)}
        {hx != null && <g>
          <line x1={X(hx)} x2={X(hx)} y1={pad.t} y2={H - pad.b} className="cross" />
          {data.map(s => { const p = at(s.pts, hx); return p ? <circle key={s.id} cx={X(p[0])} cy={Y(p[1])} r={4} className="dot" style={{ fill: `var(--series-${colorOf(s.id)})` }} /> : null; })}
        </g>}
      </svg>}
      {hx != null && W > 0 && (
        <div className="chart-tip" style={{ left: Math.min(X(hx) + 10, W - 170) }}>
          <b>{new Date(hx).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</b>
          {data.map(s => { const p = at(s.pts, hx); return p ? <span key={s.id}><i style={{ background: `var(--series-${colorOf(s.id)})` }} />{s.name} <b>{fmtV(p[1])}</b></span> : null; })}
        </div>
      )}
    </div>
  );
}

/** Horizontal bars: one per item, value labelled at the end. */
export function BarChart({ items, format, color = 1 }: { items: { label: string; value: number; note?: string }[]; format: (v: number) => string; color?: number }) {
  const max = Math.max(...items.map(i => i.value), 0) || 1;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="bars" role="list">
      {items.map((it, i) => (
        <div key={it.label} className={'bar-row' + (hover === i ? ' hover' : '')} role="listitem" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} title={`${it.label}: ${format(it.value)}${it.note ? ` (${it.note})` : ''}`}>
          <span className="bar-label">{it.label}</span>
          <span className="bar-track"><span className="bar" style={{ width: `${Math.max(0.5, (100 * Math.max(0, it.value)) / max)}%`, background: `var(--series-${color})` }} /></span>
          <span className="bar-value">{format(it.value)}{it.note ? <small> {it.note}</small> : null}</span>
        </div>
      ))}
    </div>
  );
}
