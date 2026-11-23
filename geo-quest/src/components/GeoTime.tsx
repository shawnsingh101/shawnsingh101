// Earth's history as layers of rock: eons, eras, periods and epochs stacked like strata (youngest on top), in the
// official ICS colours, beside a 24-hour clock of the same history. Tap a layer to read about it.
import { useMemo, useRef, useState } from 'react';
import { AGE_OF_EARTH, MNEMONIC, UNITS, fmtMa, onTheClock, type Rank, type Unit } from '../geotime';

const RANKS: Rank[] = ['eon', 'era', 'period', 'epoch'];
const H = 560; // column height, px

// "Readable" gives every period and epoch room for its name (a stretched scale, pinned at the boundaries below);
// "True to scale" is plain time, where everything with a skeleton squeezes into the top eighth.
const PINS: [number, number][] = [[0, 0], [0.0117, 0.02], [2.58, 0.07], [5.333, 0.1], [23.03, 0.16], [33.9, 0.19], [56, 0.22], [66, 0.25], [145, 0.32], [201.4, 0.37],
  [251.902, 0.42], [298.9, 0.47], [358.9, 0.52], [419.2, 0.57], [443.8, 0.61], [485.4, 0.65], [538.8, 0.69], [635, 0.72], [1000, 0.76], [2500, 0.86], [4031, 0.96], [AGE_OF_EARTH, 1]];
const stretched = (ma: number) => { const i = PINS.findIndex(([m]) => m >= ma); if (i <= 0) return 0; const [m0, f0] = PINS[i - 1], [m1, f1] = PINS[i]; return f0 + ((ma - m0) / (m1 - m0)) * (f1 - f0); };
const scaleOf = (mode: 'readable' | 'true') => (ma: number) => (mode === 'true' ? ma / AGE_OF_EARTH : stretched(ma)) * H;

// Labels need a dark or light ink depending on the band colour.
const inkFor = (hex: string) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1d1d1f' : '#fff'; };

export function GeoTime() {
  const [mode, setMode] = useState<'readable' | 'true'>('readable');
  const [sel, setSel] = useState<Unit>(UNITS.find(u => u.name === 'Jurassic')!);
  const y = useMemo(() => scaleOf(mode), [mode]);
  const card = useRef<HTMLElement>(null);
  // On a phone the card sits under the layers: bring it into view when you pick one.
  const pick = (u: Unit) => { setSel(u); if (window.matchMedia('(max-width: 760px)').matches) setTimeout(() => card.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 30); };
  const chain = (u: Unit): Unit[] => { const p = UNITS.find(x => x.name === u.parent); return p ? [...chain(p), u] : [u]; };
  const inside = (u: Unit) => chain(sel).includes(u) || chain(u).includes(sel);

  return (
    <section className="geotime">
      <header className="geotime-head">
        <div>
          <h2>Earth’s history as layers of rock</h2>
          <p className="muted small">Youngest on top, like a cliff face. Tap a layer. Colours are the official ones on every geological map.</p>
        </div>
        <div className="segmented small" role="group" aria-label="Scale">
          <button className={mode === 'readable' ? 'on' : ''} onClick={() => setMode('readable')}>Readable</button>
          <button className={mode === 'true' ? 'on' : ''} onClick={() => setMode('true')}>True to scale</button>
        </div>
      </header>
      <div className="geotime-body">
        <div className="strata" style={{ height: H }}>
          {RANKS.map(rank => (
            <div key={rank} className={'stratum-col ' + rank}>
              <span className="col-head">{rank}s</span>
              {UNITS.filter(u => u.rank === rank).map(u => {
                const top = y(u.end), h = Math.max(1, y(u.start) - y(u.end));
                return (
                  <button key={u.name} className={'band' + (sel === u ? ' sel' : inside(u) ? ' in' : '')} title={`${u.name} · ${fmtMa(u.start)} years ago`}
                    style={{ top, height: h, background: u.color, color: inkFor(u.color) }} onClick={() => pick(u)}>
                    {h >= 15 && <span>{u.name}</span>}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="axis-col">
            {[0, 1, 10, 66, 252, 539, 1000, 2500, 4567].map(ma => (y(ma) <= H && (mode === 'readable' || ma === 0 || ma >= 539)) && (
              <span key={ma} style={{ top: y(ma) }}>{ma === 0 ? 'now' : ma >= 1000 ? `${ma / 1000} bn` : `${ma} M`}</span>
            ))}
          </div>
        </div>
        <aside className="geotime-card" ref={card}>
          <p className="crumbs">{chain(sel).map(u => u.name).join(' › ')}</p>
          <h3><i style={{ background: sel.color }} />{sel.name} <small>{sel.rank}</small></h3>
          <p className="when"><b>{fmtMa(sel.start)}</b> to {sel.end ? <b>{fmtMa(sel.end)}</b> : <b>now</b>} years ago <span className="muted">· lasted {fmtMa(sel.start - sel.end)} years</span></p>
          <p>{sel.known.charAt(0).toUpperCase() + sel.known.slice(1)}.</p>
          {sel.meaning && <p className="muted small">The name: {sel.meaning}.</p>}
          <Clock sel={sel} />
          <p className="small">If all of Earth’s history were one day, the {sel.name} would run from <b>{onTheClock(sel.start)}</b> to <b>{sel.end ? onTheClock(sel.end) : 'midnight'}</b>.</p>
        </aside>
      </div>
      <p className="mnemonic"><b>To remember the periods in order:</b> {MNEMONIC.split(' ').map((w, i) => <span key={i}><b>{w[0]}</b>{w.slice(1)} </span>)}
        <span className="muted small">(Cambrian, Ordovician, Silurian, Devonian, Carboniferous, Permian, Triassic, Jurassic, Cretaceous, Paleogene, Neogene, Quaternary)</span></p>
    </section>
  );
}

/** A 24-hour clock face: the eons as coloured arcs, the chosen time highlighted, a few moments marked. */
function Clock({ sel }: { sel: Unit }) {
  const R = 52, c = 64;
  const at = (ma: number) => { const a = (1 - ma / AGE_OF_EARTH) * 2 * Math.PI - Math.PI / 2; return [c + R * Math.cos(a), c + R * Math.sin(a)]; };
  const arc = (from: number, to: number) => {
    const [x0, y0] = at(from), [x1, y1] = at(Math.max(to, 0.001));
    const large = (from - to) / AGE_OF_EARTH > 0.5 ? 1 : 0;
    return `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1}`;
  };
  const MOMENTS: [number, string][] = [[3700, 'first life'], [2400, 'oxygen'], [538.8, 'animals boom'], [66, 'dinosaurs end']];
  return (
    <svg className="clock" viewBox="0 0 128 128" role="img" aria-label={`24-hour clock: the ${sel.name} from ${onTheClock(sel.start)} to ${sel.end ? onTheClock(sel.end) : 'midnight'}`}>
      {UNITS.filter(u => u.rank === 'eon').map(u => <path key={u.name} d={arc(u.start, u.end)} stroke={u.color} strokeWidth={8} fill="none" opacity={0.5} />)}
      <path d={arc(sel.start, sel.end)} stroke={sel.color} strokeWidth={14} fill="none" strokeLinecap="butt" className="clock-sel" />
      {MOMENTS.map(([ma, label]) => { const [x, y] = at(ma); return <circle key={label} cx={x} cy={y} r={1.8} className="clock-dot"><title>{label}: {onTheClock(ma)}</title></circle>; })}
      <text x={c} y={c - 2} textAnchor="middle" className="clock-big">{onTheClock(sel.start)}</text>
      <text x={c} y={c + 12} textAnchor="middle" className="clock-small">on Earth’s day</text>
    </svg>
  );
}

/**
 * A time-scale card: the unit's ancestors as labelled blocks (Phanerozoic › Mesozoic), then its parts as blank blocks,
 * youngest on top like the rock layers; flipped, the blocks fill in with their names and colours.
 */
export function StrataCard({ unit, revealed }: { unit: string; revealed: boolean }) {
  // "Earth" stands for the whole history: its parts are the four eons.
  const u = UNITS.find(x => x.name === unit);
  if (!u && unit !== 'Earth') return null;
  const chain: Unit[] = [];
  for (let p: Unit | undefined = u; p; p = UNITS.find(x => x.name === p!.parent)) chain.unshift(p);
  const kids = UNITS.filter(x => (u ? x.parent === u.name : x.rank === 'eon')).sort((a, b) => a.start - b.start); // youngest first
  const rank = kids[0]?.rank;
  return (
    <div className="strata-card">
      {chain.map(x => (
        <div key={x.name} className="sc-col">
          <span className="sc-head">{x.rank}</span>
          <div className="sc-block" style={{ background: x.color, color: inkFor(x.color) }}>{x.name}</div>
        </div>
      ))}
      <div className="sc-col kids">
        <span className="sc-head">{rank}s</span>
        {kids.map(k => (
          <div key={k.name} className={'sc-block' + (revealed ? ' shown' : ' blank')} style={revealed ? { background: k.color, color: inkFor(k.color) } : undefined}>
            {revealed ? <><b>{k.name}</b><small>{fmtMa(k.start)} years ago</small></> : '?'}
          </div>
        ))}
      </div>
    </div>
  );
}
