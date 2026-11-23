// Me: progress across everything you learn. Two measures per area:
//   covered = share of its cards you know (reviewed and spaced out at least a few days),
//   memory  = how likely you are to remember the cards you've started, right now (FSRS retrievability).
// Strong and weak areas, then the weakest decks with a one-tap session, and a calendar of study days.
import { useMemo, useState } from 'react';
import { GROUPS, cardsForNode, nodeId, sectionChain, type CardRef } from '../cards';
import { SUBJECTS } from '../subjects';
import { level, scheduler, State, streak, useProgress, type Progress } from '../srs';
import { Icon } from '../components/Icons';
import type { Dataset } from '../types';

interface Stat { total: number; started: number; known: number; memSum: number; due: number }
const empty = (): Stat => ({ total: 0, started: 0, known: 0, memSum: 0, due: 0 });
const add = (a: Stat, b: Stat) => { a.total += b.total; a.started += b.started; a.known += b.known; a.memSum += b.memSum; a.due += b.due; };
const pct = (n: number) => `${Math.round(n * 100)}%`;
const pctFine = (n: number) => (n > 0 && n < 0.01 ? '<1%' : pct(n));
const covered = (s: Stat) => (s.total ? s.known / s.total : 0);
const memory = (s: Stat) => (s.started ? s.memSum / s.started : 0);

function statOf(cards: CardRef[], p: Progress, now: Date): Stat {
  const s = empty();
  for (const c of cards) {
    s.total++;
    const r = p.cards[c.id];
    if (!r || r.c.state === State.New) continue;
    s.started++;
    if (level(p, c.id) >= 2) s.known++;
    s.memSum += scheduler.get_retrievability(r.c, now, false);
    if (r.c.due <= now) s.due++;
  }
  return s;
}

export function Me({ ds, startStudy }: { ds: Dataset; startStudy: (nodes?: string[]) => void }) {
  const p = useProgress();
  const [open, setOpen] = useState<string | null>(null);
  const data = useMemo(() => {
    const now = new Date();
    // Every deck (node), its stats, and where it sits.
    const nodes = GROUPS.flatMap(g => g.topics.map(t => {
      const id = nodeId(g.id, t.id), s = statOf(cardsForNode(ds, id), p, now);
      return { id, g, name: g.topics.length > 1 ? `${g.name} · ${t.name}` : g.name, top: sectionChain(g.section)[0], sec: g.section, s };
    })).filter(n => n.s.total);
    const subjects = SUBJECTS.map(sub => {
      const tops = sub.sections();
      const mine = nodes.filter(n => tops.includes(n.top));
      const s = empty(); mine.forEach(n => add(s, n.s));
      // one level down: the subject's own sections (continents, Physical geography, History of China…)
      // Its parts, one level down: Geography's continents and themes; a notes subject's first-level sections or decks.
      const parts = tops.length > 1
        ? tops.map(sec => { const ss = empty(); mine.filter(n => n.top === sec).forEach(n => add(ss, n.s)); return { sec, s: ss }; })
        : [...new Set(mine.map(n => sectionChain(n.sec)[1] ?? n.name))].map(sec => { const ss = empty(); mine.filter(n => (sectionChain(n.sec)[1] ?? n.name) === sec).forEach(n => add(ss, n.s)); return { sec, s: ss }; });
      return { sub, s, parts };
    }).filter(x => x.s.total);
    const weakest = nodes.filter(n => n.s.started >= 3).sort((a, b) => memory(a.s) - memory(b.s)).slice(0, 6);
    const all = empty(); nodes.forEach(n => add(all, n.s));
    return { subjects, weakest, all };
  }, [ds, p]);

  const days = Object.entries(p.days);
  const last30 = days.filter(([d]) => Date.now() - Date.parse(d) < 30 * 864e5).reduce((a, [, v]) => a + v.reviews + v.fresh, 0);

  return (
    <div className="me">
      <h1>Me</h1>
      <p className="muted">How much of each area you know, and how well you remember it right now. <b>Covered</b>: cards you know, of all there are. <b>Memory</b>: the chance you'd recall the cards you've started, today.</p>
      <div className="me-totals">
        <div><b>{data.all.known.toLocaleString('en-US')}</b><small>cards known</small></div>
        <div><b>{data.all.started.toLocaleString('en-US')}</b><small>started</small></div>
        <div><b>{data.all.started ? pct(memory(data.all)) : '–'}</b><small>memory</small></div>
        <div><b>{streak(p)}</b><small>day streak</small></div>
        <div><b>{last30.toLocaleString('en-US')}</b><small>cards in 30 days</small></div>
      </div>
      <div className="me-grid">
        <Radar items={data.subjects.map(x => ({ name: x.sub.name, a: covered(x.s), b: memory(x.s), started: x.s.started > 0 }))} />
        <div className="me-subjects">
          {data.subjects.map(({ sub, s, parts }) => (
            <div key={sub.id} className="me-row-wrap">
              <button className="me-row" onClick={() => setOpen(open === sub.id ? null : sub.id)} aria-expanded={open === sub.id}>
                <span className="me-name"><Icon name={sub.icon} size={16} />{sub.name}</span>
                <Bars c={covered(s)} m={s.started ? memory(s) : null} />
                <small className="muted">{pctFine(covered(s))} covered{s.started ? ` · ${pct(memory(s))} memory` : ''}{s.due ? ` · ${s.due} due` : ''}<br />{s.known.toLocaleString('en-US')} of {s.total.toLocaleString('en-US')} cards</small>
              </button>
              {open === sub.id && <div className="me-parts">
                {parts.map(({ sec, s: ps }) => (
                  <div key={sec} className="me-row small"><span className="me-name">{sec}</span><Bars c={covered(ps)} m={ps.started ? memory(ps) : null} /><small className="muted">{ps.known}/{ps.total}</small></div>
                ))}
              </div>}
            </div>
          ))}
        </div>
      </div>
      {data.weakest.length > 0 && <section>
        <h2>Weakest decks</h2>
        <p className="muted small">The decks you've started that you'd remember least today. One tap reviews them.</p>
        <div className="me-weak">
          {data.weakest.map(n => (
            <button key={n.id} className="me-weak-card" onClick={() => startStudy([n.id])}>
              <b>{n.name}</b><small className="muted">{n.top !== n.sec ? `${n.top} › ` : ''}{n.sec}</small>
              <span className="me-weak-mem">{pct(memory(n.s))} memory · {n.s.started} started{n.s.due ? ` · ${n.s.due} due` : ''}</span>
            </button>
          ))}
        </div>
      </section>}
      <section>
        <h2>Study days</h2>
        <Calendar p={p} />
      </section>
    </div>
  );
}

function Bars({ c, m }: { c: number; m: number | null }) {
  return (
    <span className="me-bars" title={`Covered ${pct(c)}${m != null ? ` · memory ${pct(m)}` : ''}`}>
      <span className="me-bar"><i className="cov" style={{ width: pct(c) }} /></span>
      <span className="me-bar"><i className="mem" style={{ width: m == null ? 0 : pct(m) }} /></span>
    </span>
  );
}

/** Strengths at a glance: one spoke per subject, outer = 100%. Filled: covered; outline: memory. */
function Radar({ items }: { items: { name: string; a: number; b: number; started: boolean }[] }) {
  const n = items.length, R = 110, c = 150;
  if (n < 3) return null;
  const pt = (i: number, v: number) => { const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [c + R * v * Math.cos(ang), c + R * v * Math.sin(ang)]; };
  // Coverage starts tiny (8 of 7,000 cards), so the chart uses a square-root scale: early progress shows.
  const poly = (k: 'a' | 'b') => items.map((it, i) => pt(i, Math.max(0.02, k === 'a' ? Math.sqrt(it.a) : it.b)).join(',')).join(' ');
  return (
    <figure className="me-radar">
      <svg viewBox="-45 -10 390 320" role="img" aria-label="Strength by subject">
        {[0.25, 0.5, 0.75, 1].map(r => <polygon key={r} points={items.map((_, i) => pt(i, r).join(',')).join(' ')} className="ring" />)}
        {items.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={c} y1={c} x2={x} y2={y} className="spoke" />; })}
        <polygon points={poly('a')} className="cov" />
        <polygon points={poly('b')} className="mem" />
        {items.map((it, i) => { const [x, y] = pt(i, 1.18); return <text key={it.name} x={x} y={y} textAnchor={Math.abs(x - c) < 10 ? 'middle' : x > c ? 'start' : 'end'} dominantBaseline="middle" className="lbl">{it.name}</text>; })}
      </svg>
      <figcaption><span><i className="cov" />covered (√ scale)</span><span><i className="mem" />memory</span></figcaption>
    </figure>
  );
}

/** The last 26 weeks, a square per day, darker for more cards. */
function Calendar({ p }: { p: Progress }) {
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const start = new Date(today); start.setDate(start.getDate() - 7 * 26 + 1);
  start.setDate(start.getDate() - start.getDay()); // begin on a Sunday so each column is a week
  const cells = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toLocaleDateString('en-CA'), v = p.days[key], n = v ? v.reviews + v.fresh : 0;
    cells.push({ key, n, lvl: n === 0 ? 0 : n < 10 ? 1 : n < 30 ? 2 : n < 60 ? 3 : 4 });
  }
  return <div className="me-cal" role="img" aria-label="Study days, last six months">{cells.map(c => <i key={c.key} className={'l' + c.lvl} title={`${c.key}: ${c.n} cards`} />)}</div>;
}
