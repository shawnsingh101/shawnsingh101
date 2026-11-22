import { useEffect, useState } from 'react';
import { dataUrl } from '../data';
import { Icon } from '../components/Icons';

// A view-only page of numbers worth knowing, refreshed nightly by scripts/sync-dashboard.mjs.
type Ch = { d1: number | null; m1: number | null; m3: number | null; ytd: number | null; y1: number | null; y5: number | null };
type Wb = { value: number; year: string; name?: string } | null;
interface Row { id: string; name: string; unit?: string; missing?: boolean; value?: number | null; prev?: number | null; asOf?: string; yoy?: number | null;
  d1?: number | null; m1?: number | null; m3?: number | null; ytd?: number | null; y1?: number | null; y5?: number | null;
  iso3?: string; gdp?: Wb; gdpPerCapita?: Wb; population?: Wb; unemployment?: Wb }
interface Section { id: string; title: string; mode?: 'pct' | 'pp'; kind?: 'yoy' | 'monthly' | 'table' | 'pending'; source: string; note?: string; rows?: Row[]; world?: { population: Wb; gdp: Wb } }
interface Dash { updated: string; sections: Section[] }

const COLS: [keyof Ch, string][] = [['d1', '1D'], ['m1', '1M'], ['m3', '3M'], ['ytd', 'YTD'], ['y1', '1Y'], ['y5', '5Y']];
const num = (v: number, d = 2) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const month = (iso?: string) => (iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
const day = (iso?: string) => (iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '');
const big = (v: number) => (v >= 1e12 ? `$${num(v / 1e12, 2)} tn` : `$${num(v / 1e9, 0)} bn`);
const people = (v: number) => (v >= 1e9 ? `${num(v / 1e9, 2)} bn` : `${num(v / 1e6, 0)} m`);

function Change({ v, mode, k }: { v: number | null | undefined; mode: 'pct' | 'pp'; k: string }) {
  if (v == null) return <td className={'ch none c-' + k}>–</td>;
  const cls = v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
  return <td className={'ch ' + cls + ' c-' + k}>{v > 0 ? '+' : v < 0 ? '−' : ''}{num(Math.abs(v), 2)}{mode === 'pct' ? '%' : ''}</td>;
}

export function Dashboard() {
  const [d, setD] = useState<Dash | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => { fetch(dataUrl('dashboard.json')).then(r => r.json()).then(setD).catch(() => setErr(true)); }, []);
  if (err) return <div className="dashboard"><h1>Dashboard</h1><p className="muted">The dashboard data hasn't been built yet.</p></div>;
  if (!d) return <div className="dashboard"><h1>Dashboard</h1><p className="muted">Loading…</p></div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="muted small">Numbers worth knowing, refreshed every night · last update {new Date(d.updated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
      <div className="dash-grid">
        {d.sections.map(s => (
          <section key={s.id} className={'dash-card' + (s.kind === 'table' || s.id === 'markets' || s.id === 'oil' ? ' wide' : '')}>
            <h2>{s.title}</h2>
            {s.kind === 'pending' ? <p className="muted"><Icon name="info" size={15} /> {s.note}</p>
            : s.kind === 'table' ? <>
              {s.world?.population && <p className="small">World population <b>{people(s.world.population.value)}</b> ({s.world.population.year}){s.world.gdp ? <> · world GDP <b>{big(s.world.gdp.value)}</b></> : null}</p>}
              <div className="table-scroll"><table>
                <thead><tr><th>Country</th><th>GDP</th><th>GDP per person</th><th>Population</th><th>Unemployment</th></tr></thead>
                <tbody>{s.rows!.map((r, i) => <tr key={r.iso3}>
                  <td><span className="rank">{i + 1}</span>{r.name}</td>
                  <td>{r.gdp ? big(r.gdp.value) : '–'}</td><td>{r.gdpPerCapita ? `$${num(r.gdpPerCapita.value, 0)}` : '–'}</td>
                  <td>{r.population ? people(r.population.value) : '–'}</td><td>{r.unemployment ? `${num(r.unemployment.value, 1)}%` : '–'}</td>
                </tr>)}</tbody>
              </table></div>
              <p className="muted tiny">GDP in current US dollars, {s.rows![0]?.gdp?.year}.</p>
            </>
            : s.kind === 'yoy' ? <table>
                <thead><tr><th></th><th>Year on year</th><th>Month before</th><th></th></tr></thead>
                <tbody>{s.rows!.map(r => <tr key={r.id}><td>{r.name}</td><td className="big">{r.value != null ? `${num(r.value, 1)}%` : '–'}</td><td className="muted">{r.prev != null ? `${num(r.prev, 1)}%` : '–'}</td><td className="muted tiny">{month(r.asOf)}</td></tr>)}</tbody>
              </table>
            : s.kind === 'monthly' ? <table>
                <tbody>{s.rows!.map(r => <tr key={r.id}><td>{r.name}</td>
                  <td className="big">{r.unit === '$' ? `$${num(r.value!, 2)}` : `${num(r.value!, 1)}%`}</td>
                  <td className="muted">{r.yoy != null ? `${r.yoy > 0 ? '+' : ''}${num(r.yoy, 1)}% y/y` : r.prev != null ? `prev. ${num(r.prev, 1)}%` : ''}</td>
                  <td className="muted tiny">{month(r.asOf)}</td></tr>)}</tbody>
              </table>
            : <div className="table-scroll"><table>
                <thead><tr><th></th><th>Last</th>{COLS.map(([k, l]) => <th key={l} className={'c-' + k}>{l}</th>)}</tr></thead>
                <tbody>{s.rows!.map(r => r.missing ? <tr key={r.id}><td>{r.name}</td><td colSpan={7} className="muted">not available today</td></tr> : (
                  <tr key={r.id}>
                    <td>{r.name}<small className="muted asof">{r.unit && r.unit !== '%' ? `${r.unit} · ` : ''}{day(r.asOf)}</small></td>
                    <td className="big">{num(r.value!, 2)}{r.unit === '%' ? '%' : ''}</td>
                    {COLS.map(([k]) => <Change key={k} k={k} v={r[k]} mode={s.mode ?? 'pct'} />)}
                  </tr>))}</tbody>
              </table></div>}
            {s.note && s.kind !== 'pending' && <p className="muted tiny">{s.note}</p>}
            <p className="muted tiny source">Source: {s.source}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
