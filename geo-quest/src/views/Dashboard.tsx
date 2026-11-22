import { useEffect, useState } from 'react';
import { dataUrl } from '../data';
import { Icon } from '../components/Icons';
import { BarChart, LineChart, RangeToggle, SeriesToggles, type Pt, type Range } from '../components/Charts';

// A view-only page of numbers worth knowing, refreshed nightly by scripts/sync-dashboard.mjs.
type Ch = { d1: number | null; m1: number | null; m3: number | null; ytd: number | null; y1: number | null; y5: number | null };
type Wb = { value: number; year: string; name?: string } | null;
interface Row { id: string; name: string; unit?: string; missing?: boolean; value?: number | null; prev?: number | null; asOf?: string; yoy?: number | null; hist?: Pt[];
  d1?: number | null; m1?: number | null; m3?: number | null; ytd?: number | null; y1?: number | null; y5?: number | null;
  since?: string | null; from?: number | null; avg4?: number;
  iso3?: string; gdp?: Wb; gdpPerCapita?: Wb; population?: Wb; unemployment?: Wb; externalDebt?: Wb; debtToGdp?: number | null }
interface Partner { name: string; value: number; share: number | null }
interface TradeCountry { iso3: string; name: string; year?: number; missing?: boolean; note?: string; exports?: Partner[]; imports?: Partner[]; oilFrom?: Partner[]; oilTo?: Partner[] }
interface Section { id: string; title: string; mode?: 'pct' | 'pp'; kind?: 'yoy' | 'monthly' | 'table' | 'pending' | 'policy' | 'petroleum' | 'trade'; source: string; note?: string; rows?: Row[];
  world?: { population: Wb; gdp: Wb }; weekly?: Row[]; imports?: { period: string; total: number | null; countries: Partner[] }; exports?: { period: string; total: number | null; countries: Partner[] }; countries?: TradeCountry[] }
interface Dash { updated: string; sections: Section[] }

const COLS: [keyof Ch, string][] = [['d1', '1D'], ['m1', '1M'], ['m3', '3M'], ['ytd', 'YTD'], ['y1', '1Y'], ['y5', '5Y']];
const num = (v: number, d = 2) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const month = (iso?: string | null) => (iso ? new Date(iso.length === 7 ? iso + '-15' : iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
const day = (iso?: string | null) => (iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '');
const big = (v: number) => (v >= 1e12 ? `$${num(v / 1e12, 2)} tn` : `$${num(v / 1e9, 0)} bn`);
const people = (v: number) => (v >= 1e9 ? `${num(v / 1e9, 2)} bn` : `${num(v / 1e6, 0)} m`);
const kbd = (v: number) => `${num(v, 0)}k b/d`;

// Which series are switched on at first (the rest are one tap away). Colours follow the series' place in its list.
const DEFAULT_ON: Record<string, string[]> = {
  markets: ['SP500', 'DJIA', 'NASDAQCOM'], treasury: ['DGS2', 'DGS10', 'DGS30'], rates: ['DFF', 'ECBDFR', 'MORTGAGE30US'],
  cbpol: ['US', 'XM', 'GB', 'JP', 'CN', 'IN'],
};
const DEFAULT_RANGE: Record<string, Range> = { markets: '1Y', oil: '1Y', treasury: '1Y', rates: '5Y', cbpol: '5Y', inflation: '5Y', jobs: '5Y', petroleum: '1Y' };

function Change({ v, mode, k }: { v: number | null | undefined; mode: 'pct' | 'pp'; k: string }) {
  if (v == null) return <td className={'ch none c-' + k}>–</td>;
  const cls = v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
  return <td className={'ch ' + cls + ' c-' + k}>{v > 0 ? '+' : v < 0 ? '−' : ''}{num(Math.abs(v), 2)}{mode === 'pct' ? '%' : ''}</td>;
}

/** A line chart over a section's rows, with series and range toggles. */
function SeriesChart({ s, rows, unit = '', indexed, step, refLine, ranges, decimals }: { s: Section; rows: Row[]; unit?: string; indexed?: boolean; step?: boolean; refLine?: { value: number; label: string }; ranges?: Range[]; decimals?: number }) {
  const withHist = rows.filter(r => r.hist?.length);
  const [on, setOn] = useState<Set<string>>(() => new Set(DEFAULT_ON[s.id]?.filter(id => withHist.some(r => r.id === id)) ?? withHist.map(r => r.id)));
  const [range, setRange] = useState<Range>(DEFAULT_RANGE[s.id] ?? '1Y');
  if (!withHist.length) return null;
  const colorOf = (id: string) => (withHist.findIndex(r => r.id === id) % 8) + 1;
  const series = withHist.map(r => ({ id: r.id, name: r.name, points: r.hist! }));
  return <>
    <div className="chart-controls">
      {series.length > 1 ? <SeriesToggles series={series} on={on} setOn={setOn} colorOf={colorOf} /> : <span />}
      <RangeToggle range={range} setRange={setRange} ranges={ranges} />
    </div>
    <LineChart series={series.filter(x => on.has(x.id))} colorOf={colorOf} range={range} unit={unit} indexed={indexed} step={step} refLine={refLine} decimals={decimals} />
    {indexed && <p className="muted tiny">Change since the start of the range, so indexes of very different size share one scale.</p>}
  </>;
}

function ChangeTable({ s }: { s: Section }) {
  return <div className="table-scroll"><table>
    <thead><tr><th></th><th>Last</th>{COLS.map(([k, l]) => <th key={l} className={'c-' + k}>{l}</th>)}</tr></thead>
    <tbody>{s.rows!.map(r => r.missing ? <tr key={r.id}><td>{r.name}</td><td colSpan={7} className="muted">not available today</td></tr> : (
      <tr key={r.id}>
        <td>{r.name}<small className="muted asof">{r.unit && r.unit !== '%' ? `${r.unit} · ` : ''}{day(r.asOf).replace(/, \d{4}$/, '')}</small></td>
        <td className="big">{num(r.value!, 2)}{r.unit === '%' ? '%' : ''}</td>
        {COLS.map(([k]) => <Change key={k} k={k} v={r[k]} mode={s.mode ?? 'pct'} />)}
      </tr>))}</tbody>
  </table></div>;
}

const WORLD_METRICS: { id: string; name: string; get: (r: Row) => number | null | undefined; fmt: (v: number) => string }[] = [
  { id: 'gdp', name: 'GDP', get: r => r.gdp?.value, fmt: big },
  { id: 'pc', name: 'GDP per person', get: r => r.gdpPerCapita?.value, fmt: v => `$${num(v, 0)}` },
  { id: 'pop', name: 'Population', get: r => r.population?.value, fmt: people },
  { id: 'un', name: 'Unemployment', get: r => r.unemployment?.value, fmt: v => `${num(v, 1)}%` },
  { id: 'debt', name: 'External debt', get: r => r.externalDebt?.value, fmt: big },
  { id: 'debtgdp', name: 'Ext. debt % GDP', get: r => r.debtToGdp, fmt: v => `${num(v, 0)}%` },
];

function WorldCard({ s }: { s: Section }) {
  const [metric, setMetric] = useState('gdp');
  const m = WORLD_METRICS.find(x => x.id === metric)!;
  const items = s.rows!.map(r => ({ label: r.name, value: m.get(r) ?? 0, ok: m.get(r) != null })).filter(x => x.ok).sort((a, b) => b.value - a.value);
  return <>
    {s.world?.population && <p className="small">World population <b>{people(s.world.population.value)}</b> ({s.world.population.year}){s.world.gdp ? <> · world GDP <b>{big(s.world.gdp.value)}</b></> : null}</p>}
    <div className="segmented small wrap">{WORLD_METRICS.map(x => <button key={x.id} className={metric === x.id ? 'on' : ''} onClick={() => setMetric(x.id)}>{x.name}</button>)}</div>
    <BarChart items={items} format={m.fmt} />
    <details className="table-view"><summary>Table</summary><div className="table-scroll"><table>
      <thead><tr><th>Country</th><th>GDP</th><th>GDP per person</th><th>Population</th><th>Unemployment</th><th>Gross external debt</th><th>% of GDP</th></tr></thead>
      <tbody>{s.rows!.map((r, i) => <tr key={r.iso3}>
        <td><span className="rank">{i + 1}</span>{r.name}</td>
        <td>{r.gdp ? big(r.gdp.value) : '–'}</td><td>{r.gdpPerCapita ? `$${num(r.gdpPerCapita.value, 0)}` : '–'}</td>
        <td>{r.population ? people(r.population.value) : '–'}</td><td>{r.unemployment ? `${num(r.unemployment.value, 1)}%` : '–'}</td>
        <td>{r.externalDebt ? <>{big(r.externalDebt.value)} <small className="muted">{r.externalDebt.year}</small></> : '–'}</td><td>{r.debtToGdp != null ? `${r.debtToGdp}%` : '–'}</td>
      </tr>)}</tbody>
    </table></div></details>
    <p className="muted tiny">GDP in current US dollars, {s.rows![0]?.gdp?.year}. External debt: all sectors, latest quarter, compared with annual GDP.</p>
  </>;
}

function PetroleumCard({ s }: { s: Section }) {
  const [side, setSide] = useState<'imports' | 'exports'>('imports');
  const p = side === 'imports' ? s.imports : s.exports;
  return <>
    <SeriesChart s={s} rows={s.weekly ?? []} decimals={0} ranges={['3M', '1Y', '5Y']} />
    <table><tbody>{(s.weekly ?? []).map(r => r.missing ? null : <tr key={r.id}><td>{r.name}<small className="muted asof">week to {day(r.asOf)}</small></td><td className="big">{kbd(r.value!)}</td><td className="muted">4-week avg {kbd(r.avg4!)}</td><td className="muted">{r.y1 != null ? `${r.y1 > 0 ? '+' : '−'}${num(Math.abs(r.y1), 0)}k vs a year ago` : ''}</td></tr>)}</tbody></table>
    <div className="chart-controls" style={{ marginTop: '.8rem' }}>
      <b className="small">{side === 'imports' ? 'Top 5 sources of US imports' : 'Top 5 destinations of US exports'} · {month(p?.period)}</b>
      <div className="segmented small"><button className={side === 'imports' ? 'on' : ''} onClick={() => setSide('imports')}>Imports from</button><button className={side === 'exports' ? 'on' : ''} onClick={() => setSide('exports')}>Exports to</button></div>
    </div>
    {p && <BarChart items={p.countries.map(c => ({ label: c.name, value: c.value, note: c.share != null ? `${c.share}%` : undefined }))} format={kbd} color={side === 'imports' ? 1 : 2} />}
    {p?.total != null && <p className="muted tiny">Total {side} {kbd(p.total)} that month (crude oil and petroleum products).</p>}
  </>;
}

const TRADE_VIEWS = [['exports', 'Top exports'], ['imports', 'Top imports'], ['oilFrom', 'Oil bought from'], ['oilTo', 'Oil sold to']] as const;
function TradeCard({ s }: { s: Section }) {
  const list = s.countries ?? [];
  const [iso, setIso] = useState(list[0]?.iso3 ?? '');
  const [view, setView] = useState<typeof TRADE_VIEWS[number][0]>('exports');
  const c = list.find(x => x.iso3 === iso) ?? list[0];
  if (!c) return <p className="muted">Trade data isn't available yet.</p>;
  const rows = c.missing ? [] : c[view] ?? [];
  if (c.missing) return <>
    <div className="chart-controls"><select value={c.iso3} onChange={e => setIso(e.target.value)} aria-label="Country">{list.map(x => <option key={x.iso3} value={x.iso3}>{x.name}</option>)}</select></div>
    <p className="muted small"><Icon name="info" size={15} /> {c.note ?? 'No figures for this country.'}</p>
  </>;
  return <>
    <div className="chart-controls">
      <select value={c.iso3} onChange={e => setIso(e.target.value)} aria-label="Country">{list.map(x => <option key={x.iso3} value={x.iso3}>{x.name}</option>)}</select>
      <div className="segmented small wrap">{TRADE_VIEWS.map(([k, l]) => <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{l}</button>)}</div>
    </div>
    {rows.length ? <BarChart items={rows.map(r => ({ label: r.name, value: r.value, note: r.share != null ? `${r.share}%` : undefined }))} format={big} color={view === 'exports' || view === 'oilTo' ? 2 : 1} />
      : <p className="muted small">No figures for this view.</p>}
    <p className="muted tiny">{c.name}, {c.year}. Shares are of the country's total {view === 'exports' ? 'exports' : view === 'imports' ? 'imports' : view === 'oilFrom' ? 'petroleum imports' : 'petroleum exports'}.</p>
  </>;
}

export function Dashboard() {
  const [d, setD] = useState<Dash | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => { fetch(dataUrl('dashboard.json')).then(r => r.json()).then(setD).catch(() => setErr(true)); }, []);
  if (err) return <div className="dashboard"><h1>Dashboard</h1><p className="muted">The dashboard data hasn't been built yet.</p></div>;
  if (!d) return <div className="dashboard"><h1>Dashboard</h1><p className="muted">Loading…</p></div>;
  const wide = (s: Section) => ['markets', 'oil', 'world', 'trade', 'petroleum', 'cbpol'].includes(s.id);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="muted small">Numbers worth knowing, refreshed every night · last update {new Date(d.updated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}. Tap the coloured chips to show or hide lines; hover or touch a chart for values.</p>
      <div className="dash-grid">
        {d.sections.map(s => (
          <section key={s.id} className={'dash-card' + (wide(s) ? ' wide' : '')}>
            <h2>{s.title}</h2>
            {s.kind === 'pending' ? <p className="muted"><Icon name="info" size={15} /> {s.note}</p>
            : s.kind === 'table' ? <WorldCard s={s} />
            : s.kind === 'trade' ? <TradeCard s={s} />
            : s.kind === 'petroleum' ? <PetroleumCard s={s} />
            : s.kind === 'policy' ? <>
                <SeriesChart s={s} rows={s.rows!} unit="%" step ranges={['1Y', '5Y']} />
                <div className="table-scroll"><table>
                  <thead><tr><th>Central bank</th><th>Rate</th><th>Last change</th><th>1Y</th></tr></thead>
                  <tbody>{s.rows!.map(r => r.missing ? null : <tr key={r.id}><td>{r.name}</td><td className="big">{num(r.value!, 2)}%</td>
                    <td className="muted">{r.since ? `${day(r.since)}${r.from != null ? ` (from ${num(r.from, 2)}%)` : ''}` : '–'}</td><Change k="y1" v={r.y1} mode="pp" /></tr>)}</tbody>
                </table></div>
              </>
            : s.kind === 'yoy' ? <>
                <SeriesChart s={s} rows={s.rows!} unit="%" refLine={{ value: 2, label: 'Fed target 2%' }} ranges={['1Y', '5Y']} decimals={1} />
                <table>
                  <thead><tr><th></th><th>Year on year</th><th>Month before</th><th></th></tr></thead>
                  <tbody>{s.rows!.map(r => <tr key={r.id}><td>{r.name}</td><td className="big">{r.value != null ? `${num(r.value, 1)}%` : '–'}</td><td className="muted">{r.prev != null ? `${num(r.prev, 1)}%` : '–'}</td><td className="muted tiny">{month(r.asOf)}</td></tr>)}</tbody>
                </table>
              </>
            : s.kind === 'monthly' ? <>
                <SeriesChart s={s} rows={s.rows!.filter(r => r.id === 'UNRATE')} unit="%" ranges={['1Y', '5Y']} decimals={1} />
                <table>
                  <tbody>{s.rows!.map(r => <tr key={r.id}><td>{r.name}</td>
                    <td className="big">{r.unit === '$' ? `$${num(r.value!, 2)}` : `${num(r.value!, 1)}%`}</td>
                    <td className="muted">{r.yoy != null ? `${r.yoy > 0 ? '+' : ''}${num(r.yoy, 1)}% y/y` : r.prev != null ? `prev. ${num(r.prev, 1)}%` : ''}</td>
                    <td className="muted tiny">{month(r.asOf)}</td></tr>)}</tbody>
                </table>
              </>
            : <>
                <SeriesChart s={s} rows={s.rows!} unit={s.mode === 'pp' ? '%' : ''} indexed={s.id === 'markets'} />
                <ChangeTable s={s} />
              </>}
            {s.note && s.kind !== 'pending' && <p className="muted tiny">{s.note}</p>}
            <p className="muted tiny source">Source: {s.source}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
