// An economics graph drawn from a few lines of text (src/graph.ts): axes, straight-line curves, the equilibrium where two
// cross, and a shock's shifts. On a card the graph is the question; flipping it animates the shift and marks the new
// equilibrium. In a lesson, "Show the shift" does the same.
import { useState } from 'react';
import { cross, moved, parseGraph, yAt, type Curve } from '../graph';

const COLORS = ['#3d6fd6', '#c2443c', '#1f8f62', '#8a56c9', '#c46f1d'];
const W = 320, H = 240, L = 34, B = 28, T = 10, R = 46; // plot area margins (room for labels)
const px = (x: number) => L + x * (W - L - R), py = (y: number) => H - B - y * (H - B - T);

function path(c: Curve) {
  if (c.kind === 'vertical') return `M${px(c.at)},${py(0.04)} L${px(c.at)},${py(0.96)}`;
  if (c.kind === 'horizontal') return `M${px(0.04)},${py(c.at)} L${px(0.96)},${py(c.at)}`;
  // Clip the line to the plot: x where y = 0.04 and 0.96.
  const s = (c.kind === 'up' ? 1 : -1) * c.slope, xs = [0.04, 0.96, c.cx + (0.04 - c.cy) / s, c.cx + (0.96 - c.cy) / s].filter(x => x >= 0.04 && x <= 0.96 && yAt(c, x) >= 0.039 && yAt(c, x) <= 0.961).sort((a, b) => a - b);
  const x0 = xs[0] ?? 0.04, x1 = xs[xs.length - 1] ?? 0.96;
  return `M${px(x0)},${py(yAt(c, x0))} L${px(x1)},${py(yAt(c, x1))}`;
}
/** Where to put a curve's name: its upper-right end. */
function labelAt(c: Curve) {
  if (c.kind === 'vertical') return { x: px(c.at), y: py(0.96) - 4, anchor: 'middle' };
  if (c.kind === 'horizontal') return { x: px(0.96) + 4, y: py(c.at) + 4, anchor: 'start' };
  const x = c.kind === 'up' ? Math.min(0.96, c.cx + (0.96 - c.cy) / c.slope) : 0.96;
  return { x: px(x) + 4, y: py(Math.min(0.96, yAt(c, x))) + 4, anchor: 'start' };
}

export function Graph({ text, revealed, interactive }: { text: string; revealed?: boolean; interactive?: boolean }) {
  const g = parseGraph(text);
  const [shown, setShown] = useState(false);
  const shifted = !!revealed || shown;
  const color = (name: string) => COLORS[g.curves.findIndex(c => c.name === name) % COLORS.length];
  const eqOf = (s: boolean) => { const [a, b] = g.equilibrium.map(n => moved(g.curves.find(c => c.name === n)!, g.shifts, s)); return a && b ? cross(a, b) : null; };
  const e0 = eqOf(false), e1 = g.shifts.length ? eqOf(true) : null;
  const guide = (e: { x: number; y: number }, i: number, cls: string) => (
    <g className={cls}>
      <path d={`M${px(e.x)},${py(e.y)} L${px(e.x)},${py(0)} M${px(e.x)},${py(e.y)} L${px(0)},${py(e.y)}`} className="graph-guide" />
      <circle cx={px(e.x)} cy={py(e.y)} r={4} className="graph-dot" />
      <text x={px(e.x)} y={py(0) + 13} textAnchor="middle" className="graph-tick">{g.x}<tspan baselineShift="sub" fontSize="8">{i}</tspan></text>
      <text x={px(0) - 4} y={py(e.y) + 4} textAnchor="end" className="graph-tick">{g.y}<tspan baselineShift="sub" fontSize="8">{i}</tspan></text>
    </g>
  );
  return (
    <figure className="graph" onClick={e => e.stopPropagation()}>
      {g.title && <figcaption className="flow-title">{g.title}</figcaption>}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${g.title ?? 'Graph'}: ${g.curves.map(c => c.name).join(', ')}`}>
        <path d={`M${px(0)},${py(1)} L${px(0)},${py(0)} L${px(1)},${py(0)}`} className="graph-axis" markerEnd="url(#arrow)" />
        <defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" className="graph-arrowhead" /></marker></defs>
        <text x={px(1)} y={py(0) + 13} textAnchor="end" className="graph-axis-label">{g.x}</text>
        <text x={px(0) - 6} y={py(1) + 4} textAnchor="end" className="graph-axis-label">{g.y}</text>
        {e0 && guide(e0, 0, 'graph-eq')}
        {g.curves.map(c => {
          const willMove = g.shifts.some(s => s.name === c.name), lab = labelAt(c);
          return <g key={c.name} style={{ color: color(c.name) }} className={shifted && willMove ? 'graph-old' : ''}>
            <path d={path(c)} className="graph-curve" />
            <text x={lab.x} y={lab.y} textAnchor={lab.anchor as 'start'} className="graph-label">{c.name}</text>
          </g>;
        })}
        {shifted && g.curves.filter(c => g.shifts.some(s => s.name === c.name)).map(c => {
          const n = moved(c, g.shifts, true), lab = labelAt(n);
          return <g key={c.name + "'"} style={{ color: color(c.name) }} className="graph-new">
            <path d={path(n)} className="graph-curve" />
            <text x={lab.x} y={lab.y} textAnchor={lab.anchor as 'start'} className="graph-label">{c.name}′</text>
          </g>;
        })}
        {shifted && e1 && guide(e1, 1, 'graph-eq graph-new')}
      </svg>
      {interactive && g.shifts.length > 0 && <div className="flow-controls"><button className={'btn small' + (shown ? ' ghost' : ' primary')} onClick={() => setShown(!shown)}>{shown ? 'Back to the start' : 'Show the shift'}</button></div>}
    </figure>
  );
}
