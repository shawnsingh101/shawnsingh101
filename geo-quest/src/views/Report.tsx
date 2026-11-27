// Me › Reports: what you did over a chosen period, from the answer log (v1.41 on) and the daily totals (all along).
// "Save as PDF" prints just the report; the browser's print window has "Save as PDF".
import { useEffect, useMemo, useRef, useState } from 'react';
import { face, groupById, nodeOfCard, parseNode, refFromId } from '../cards';
import { subjectOfSection } from '../subjects';
import { dailyXp, levelOf } from '../levels';
import { useProgress, type Progress } from '../srs';
import { Gem } from '../components/Level';
import { Icon } from '../components/Icons';
import type { Dataset } from '../types';

type RangeId = '24h' | 'week' | 'month' | '3m' | 'ytd' | 'year' | 'custom';
const RANGES: [RangeId, string][] = [['24h', 'Past 24 hours'], ['week', 'Week'], ['month', 'Month'], ['3m', '3 months'], ['ytd', 'Year to date'], ['year', '1 year'], ['custom', 'Custom']];
const DAY = 864e5;
const ymd = (d: Date) => d.toLocaleDateString('en-CA');
const midnight = (d: Date) => { const m = new Date(d); m.setHours(0, 0, 0, 0); return m; };
const addDays = (d: Date, n: number) => { const m = new Date(d); m.setDate(m.getDate() + n); return m; };
const num = (n: number) => Math.round(n).toLocaleString('en-US');
const fmtDay = (d: Date, year = false) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}) });

/** The period as [from, to) in local time, and how it's split into columns. */
function period(id: RangeId, custom: { from: string; to: string }) {
  const now = new Date(), end = addDays(midnight(now), 1);
  if (id === '24h') return { from: new Date(now.getTime() - DAY), to: now, hourly: true };
  if (id === 'custom') {
    const f = custom.from ? new Date(custom.from + 'T00:00') : addDays(end, -30), t = custom.to ? addDays(new Date(custom.to + 'T00:00'), 1) : end;
    return f < t ? { from: f, to: t, hourly: false } : { from: addDays(t, -1), to: t, hourly: false };
  }
  const from = id === 'ytd' ? new Date(now.getFullYear(), 0, 1) : addDays(end, -({ week: 7, month: 30, '3m': 91, year: 365 } as const)[id]);
  return { from, to: end, hourly: false };
}

interface Bucket { label: string; xp: number; answers: number }
interface Totals { answers: number; right: number; fresh: number; xp: number; days: number }

/** Daily totals between two dates: every answer since the start (days), XP shared out for days before v1.41. */
function dayTotals(p: Progress, daily: Record<string, number>, from: Date, to: Date): Totals {
  const t: Totals = { answers: 0, right: 0, fresh: 0, xp: 0, days: 0 };
  for (let d = midnight(from); d < to; d = addDays(d, 1)) {
    const k = ymd(d), v = p.days[k];
    if (!v) continue;
    t.answers += v.reviews; t.right += v.correct; t.fresh += v.fresh; t.xp += daily[k] ?? 0; if (v.reviews) t.days++;
  }
  return t;
}

export function Report({ ds }: { ds: Dataset }) {
  const p = useProgress();
  const [range, setRange] = useState<RangeId>('week');
  const [custom, setCustom] = useState({ from: '', to: '' });
  const [hover, setHover] = useState<number | null>(null);

  const r = useMemo(() => {
    const { from, to, hourly } = period(range, custom);
    const daily = dailyXp(p);
    const f = from.getTime() / 1000, t = to.getTime() / 1000;
    const log = p.log.filter(e => e[0] >= f && e[0] < t);
    const logStart = p.log.length ? new Date(p.log[0][0] * 1000) : null;

    // Headline numbers. The 24-hour view counts the log; longer views use the daily totals (they go back further).
    let tot: Totals, prev: Totals | null;
    if (hourly) {
      const study = log.filter(e => !e[4]);
      tot = { answers: study.length, right: study.filter(e => e[2] >= 3).length, fresh: 0, xp: log.reduce((a, e) => a + e[3], 0), days: 1 };
      prev = null;
    } else {
      tot = dayTotals(p, daily, from, to);
      const span = to.getTime() - from.getTime();
      prev = dayTotals(p, daily, new Date(from.getTime() - span), from);
    }

    // Columns: hours for the past day, days up to three months, weeks beyond.
    const buckets: Bucket[] = [];
    if (hourly) {
      for (let i = 0; i < 24; i++) {
        const a = f + i * 3600, b = a + 3600, h = log.filter(e => e[0] >= a && e[0] < b);
        buckets.push({ label: new Date(a * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }), xp: h.reduce((s, e) => s + e[3], 0), answers: h.filter(e => !e[4]).length });
      }
    } else {
      const days = Math.round((to.getTime() - from.getTime()) / DAY), step = days > 100 ? 7 : 1;
      for (let d = midnight(from); d < to; d = addDays(d, step)) {
        const e = addDays(d, step), s = dayTotals(p, daily, d, e < to ? e : to);
        buckets.push({ label: step === 7 ? `Week of ${fmtDay(d)}` : fmtDay(d), xp: s.xp, answers: s.answers });
      }
    }

    // From the log: time spent (gaps between answers, each capped at two minutes), subjects, and the cards you missed.
    let seconds = 0;
    for (let i = 1; i < log.length; i++) seconds += Math.min(120, log[i][0] - log[i - 1][0]);
    if (log.length) seconds += 10; // the first answer of the period
    const bySubject = new Map<string, { name: string; answers: number; right: number; xp: number }>();
    const missed = new Map<string, number>();
    for (const e of log) {
      const ref = refFromId(ds, e[1]);
      const name = ref ? subjectOfSection(groupById(parseNode(nodeOfCard(ref)).groupId)?.section ?? '').name : 'Other';
      const s = bySubject.get(name) ?? { name, answers: 0, right: 0, xp: 0 };
      s.answers++; if (e[2] >= 3) s.right++; s.xp += e[3]; bySubject.set(name, s);
      if (e[2] === 1) missed.set(e[1], (missed.get(e[1]) ?? 0) + 1);
    }
    const subjects = [...bySubject.values()].sort((a, b) => b.answers - a.answers);
    const hardest = [...missed.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).flatMap(([id, n]) => {
      const ref = refFromId(ds, id); if (!ref) return [];
      const fc = face(ref);
      if (fc.mode === 'tap') return [{ id, n, text: 'Find on the map: ', answer: ref.country.name, post: '' }];
      return [{ id, n, text: `${fc.pre}${fc.frontBack ? ' → ' : ''}`, answer: fc.answerFlag ? ref.country.name + "'s flag" : fc.answer, post: fc.post }];
    });
    const quiz = log.filter(e => e[4]).length;

    const xpAfter = hourly ? log.reduce((a, e) => a + e[3], 0) + p.log.filter(e => e[0] >= t).reduce((a, e) => a + e[3], 0)
      : Object.entries(daily).filter(([k]) => k >= ymd(from)).reduce((a, [, v]) => a + v, 0);
    const lvFrom = levelOf(Math.max(0, p.xp - xpAfter)), lvTo = levelOf(Math.max(0, p.xp - (xpAfter - tot.xp)));
    return { from, to, hourly, tot, prev, buckets, seconds, subjects, hardest, quiz, logStart, lvFrom, lvTo, partialLog: !logStart || logStart > from };
  }, [p, ds, range, custom]);

  const max = Math.max(1, ...r.buckets.map(b => b.xp));
  const shown = hover != null ? r.buckets[hover] : null;
  const change = (a: number, b?: number) => { if (b === undefined || !b) return null; const c = Math.round((100 * (a - b)) / b); return c === 0 ? 'same as the period before' : `${c > 0 ? '+' : ''}${c}% on the period before`; };
  const lastDay = addDays(r.to, -1);
  const title = r.hourly ? `Past 24 hours, to ${r.to.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
    : `${fmtDay(r.from, true)} – ${fmtDay(lastDay < r.from ? r.from : lastDay, true)}`;
  const hours = Math.floor(r.seconds / 3600), mins = Math.round((r.seconds % 3600) / 60);

  return (
    <div className="report">
      <div className="report-controls no-print">
        <div className="report-ranges" role="group" aria-label="Period">
          {RANGES.map(([id, l]) => <button key={id} className={'pick' + (range === id ? ' on' : '')} aria-pressed={range === id} onClick={() => setRange(id)}>{l}</button>)}
        </div>
        {range === 'custom' && (
          <div className="report-custom">
            <label>From <input type="date" value={custom.from} max={custom.to || ymd(new Date())} onChange={e => setCustom(c => ({ ...c, from: e.target.value }))} /></label>
            <label>To <input type="date" value={custom.to} min={custom.from} max={ymd(new Date())} onChange={e => setCustom(c => ({ ...c, to: e.target.value }))} /></label>
          </div>
        )}
      </div>

      <header className="report-head">
        <div><small>Intelligence Quest report</small><h2>{title}</h2></div>
        <button className="btn small no-print" onClick={() => window.print()}><Icon name="save" size={16} /> Save as PDF</button>
      </header>

      <div className="report-tiles">
        <div><b>{num(r.tot.xp)}</b><small>XP earned</small>{r.prev && <em>{change(r.tot.xp, r.prev.xp)}</em>}</div>
        <div><b>{num(r.tot.answers)}</b><small>cards answered</small>{r.prev && <em>{change(r.tot.answers, r.prev.answers)}</em>}</div>
        <div><b>{r.tot.answers ? Math.round((100 * r.tot.right) / r.tot.answers) + '%' : '–'}</b><small>answered right</small></div>
        {!r.hourly && <div><b>{num(r.tot.fresh)}</b><small>new cards started</small></div>}
        {!r.hourly && <div><b>{r.tot.days}</b><small>days studied</small></div>}
        <div><b>{r.seconds ? (hours ? `${hours} h ${mins} min` : `${mins} min`) : '–'}</b><small>time studying{r.partialLog && r.logStart && !r.hourly ? ` (from ${fmtDay(r.logStart)})` : ''}</small></div>
      </div>

      <div className="report-level">
        <Gem gem={r.lvFrom.gem} size={26} /><span>{r.lvFrom.gem.name}</span>
        {r.lvTo.n > r.lvFrom.n ? <><span className="arrow">→</span><Gem gem={r.lvTo.gem} size={26} /><span><b>{r.lvTo.gem.name}</b> · {r.lvTo.n - r.lvFrom.n === 1 ? 'a new level' : `${r.lvTo.n - r.lvFrom.n} new levels`}</span></> : <span className="muted">· {num(r.lvTo.left)} XP to {r.lvTo.next.name}</span>}
      </div>

      <section className="report-chart">
        <div className="report-readout">
          {shown ? <><b>{shown.label}</b> · {num(shown.xp)} XP · {num(shown.answers)} answers</> : <><b>XP {r.hourly ? 'by hour' : r.buckets.length > 0 && r.buckets[0].label.startsWith('Week') ? 'by week' : 'by day'}</b><span className="muted"> · tap a column for its numbers</span></>}
        </div>
        <Columns buckets={r.buckets} max={max} hover={hover} setHover={setHover} />
      </section>

      <section>
        <h3>By subject</h3>
        {r.subjects.length ? (
          <table className="report-table">
            <thead><tr><th>Subject</th><th>Answers</th><th>Right</th><th>XP</th></tr></thead>
            <tbody>
              {r.subjects.map(s => (
                <tr key={s.name}>
                  <td><div className="report-subj"><span className="report-bar"><i style={{ width: `${(100 * s.answers) / r.subjects[0].answers}%` }} /></span>{s.name}</div></td>
                  <td>{num(s.answers)}</td><td>{Math.round((100 * s.right) / s.answers)}%</td><td>{num(s.xp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="muted small">No answers recorded in this period yet.</p>}
        {r.quiz > 0 && <p className="muted small">Includes {num(r.quiz)} quiz answers.</p>}
      </section>

      {r.hardest.length > 0 && <section>
        <h3>Missed most</h3>
        <ul className="report-missed">
          {r.hardest.map(h => <li key={h.id}><span>{h.text}<b>{h.answer}</b>{h.post}</span><small>{h.n}×</small></li>)}
        </ul>
      </section>}

      {r.partialLog && <p className="muted small report-note">
        {r.logStart ? `Subjects, time and missed cards come from the answer log, which began on ${fmtDay(r.logStart, true)}. ` : 'Subjects, time and missed cards will appear as you study (the answer log is new). '}
        XP, answers and days before then come from the daily totals{r.hourly ? '' : '; XP on days before v1.41 is your total shared out by how much you did each day'}.
      </p>}
    </div>
  );
}

/** One column per hour, day or week: XP, with its numbers on hover or tap. */
function Columns({ buckets, max: most, hover, setHover }: { buckets: Bucket[]; max: number; hover: number | null; setHover: (i: number | null) => void }) {
  // Drawn at its real width in pixels, so labels keep their size on a phone and on a laptop.
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300); // until measured: small, so it never pushes its box wider
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(200, e.contentRect.width))); ro.observe(el); return () => ro.disconnect();
  }, []);
  const L = 44, W = width - L - 4, H = 160, n = Math.max(1, buckets.length), gap = W / n > 8 ? 2 : 1, bw = Math.max(1, W / n - gap);
  // Gridlines at round numbers: a 1, 2 or 5 step that gives two or three lines.
  const mag = 10 ** Math.floor(Math.log10(Math.max(1, most / 2))), step = [1, 2, 5, 10].map(m => m * mag).find(s => most / s <= 3)!;
  const top = Math.max(most, Math.ceil(most / step) * step), ticks: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  const max = top;
  return (
    <div ref={box} className="report-colbox">
    <svg width={width} height={H + 30} viewBox={`${-L} -8 ${width} ${H + 30}`} className="report-cols" role="img" aria-label="XP per period" onMouseLeave={() => setHover(null)}>
      {ticks.map(v => { const y = H - (H * v) / max; return <g key={v}><line x1={0} x2={W} y1={y} y2={y} className="grid" /><text x={-6} y={y} className="tick" textAnchor="end" dominantBaseline="middle">{num(v)}</text></g>; })}
      {buckets.map((b, i) => {
        const h = (H * b.xp) / max, x = i * (W / n) + gap / 2, r = Math.min(4, bw / 2, h);
        const d = h > 0 ? `M${x},${H}V${H - h + r}Q${x},${H - h} ${x + r},${H - h}H${x + bw - r}Q${x + bw},${H - h} ${x + bw},${H - h + r}V${H}Z` : '';
        return (
          <g key={i} onMouseEnter={() => setHover(i)} onClick={() => setHover(hover === i ? null : i)}>
            <rect x={i * (W / n)} y={0} width={W / n} height={H} fill="transparent" />
            {d && <path d={d} className={'col' + (hover === i ? ' on' : '')} />}
          </g>
        );
      })}
      <line x1={0} x2={W} y1={H} y2={H} className="base" />
      {buckets.length > 0 && <><text x={0} y={H + 18} className="tick">{buckets[0].label.replace('Week of ', '')}</text><text x={W} y={H + 18} className="tick" textAnchor="end">{buckets[buckets.length - 1].label.replace('Week of ', '')}</text></>}
    </svg>
    </div>
  );
}
