#!/usr/bin/env node
// Builds public/data/dashboard.json: markets, rates, inflation, jobs, oil and the world's largest economies.
// Sources (all free; none need a key): FRED's public CSV download, the World Bank API.
// EIA petroleum trade needs a free key: set EIA_API_KEY (a GitHub Actions secret) to switch that section on.
// Run: node scripts/sync-dashboard.mjs   (the nightly workflow runs it after the Wikidata sync)
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/data/dashboard.json');
const UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)';
const today = new Date();
const iso = d => d.toISOString().slice(0, 10);

async function get(url, as = 'text') {
  for (let a = 1; a <= 4; a++) {
    try { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (r.ok) return as === 'json' ? r.json() : r.text(); console.warn(`  ${r.status} ${url.slice(0, 90)}`); }
    catch (e) { console.warn(`  ${e.message} ${url.slice(0, 90)}`); }
    await new Promise(res => setTimeout(res, 4000 * a));
  }
  return null;
}

/** A FRED series as [{date, value}] (missing days dropped). */
async function fred(id, years = 6) {
  const from = new Date(today); from.setFullYear(from.getFullYear() - years);
  const csv = await get(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=${iso(from)}`);
  if (!csv) return null;
  return csv.trim().split('\n').slice(1).map(l => l.split(',')).filter(([, v]) => v && v !== '.').map(([d, v]) => ({ date: d, value: +v }));
}
const onOrBefore = (s, date) => { let best = null; for (const x of s) { if (x.date <= date) best = x; else break; } return best; };
const back = (date, { days = 0, months = 0, years = 0 }) => { const d = new Date(date + 'T12:00:00Z'); d.setUTCFullYear(d.getUTCFullYear() - years); d.setUTCMonth(d.getUTCMonth() - months); d.setUTCDate(d.getUTCDate() - days); return iso(d); };

/** Latest value and its change over the usual windows. 'pct' for prices, 'pp' (percentage points) for rates. */
function changes(s, mode) {
  const last = s.at(-1), prevDay = s.at(-2);
  const ch = ref => (ref == null ? null : mode === 'pct' ? +((100 * (last.value - ref.value)) / ref.value).toFixed(2) : +(last.value - ref.value).toFixed(2));
  return {
    value: last.value, asOf: last.date,
    d1: ch(prevDay), m1: ch(onOrBefore(s, back(last.date, { months: 1 }))), m3: ch(onOrBefore(s, back(last.date, { months: 3 }))),
    ytd: ch(onOrBefore(s, `${+last.date.slice(0, 4) - 1}-12-31`)), y1: ch(onOrBefore(s, back(last.date, { days: 365 }))), y5: ch(onOrBefore(s, back(last.date, { years: 5 }))),
  };
}
/** Year-over-year % change of a monthly index (CPI, PCE…): latest and the month before. */
function yoy(s) {
  const at = i => { const x = s[i]; const ref = onOrBefore(s, back(x.date, { years: 1 })); return ref ? +((100 * (x.value - ref.value)) / ref.value).toFixed(1) : null; };
  return { value: at(s.length - 1), prev: at(s.length - 2), asOf: s.at(-1).date };
}

const sections = [];
async function series(rows, mode, years) {
  const out = [];
  for (const [id, name, unit] of rows) {
    const s = await fred(id, years);
    if (!s?.length) { out.push({ id, name, unit, missing: true }); continue; }
    out.push({ id, name, unit, ...changes(s, mode) });
  }
  return out;
}

console.log('Markets…');
sections.push({ id: 'markets', title: 'Markets', mode: 'pct', source: 'FRED (S&P Dow Jones Indices, Nasdaq, Cboe)',
  rows: await series([['SP500', 'S&P 500', ''], ['DJIA', 'Dow Jones', ''], ['NASDAQCOM', 'Nasdaq', ''], ['VIXCLS', 'VIX', '']], 'pct', 6) });
console.log('Oil…');
sections.push({ id: 'oil', title: 'Oil', mode: 'pct', source: 'FRED (US Energy Information Administration)',
  rows: await series([['DCOILWTICO', 'WTI crude', '$/barrel'], ['DCOILBRENTEU', 'Brent crude', '$/barrel']], 'pct', 6) });
console.log('Treasury yields…');
sections.push({ id: 'treasury', title: 'US Treasury yields', mode: 'pp', source: 'FRED (US Treasury)', note: 'Changes are in percentage points.',
  rows: await series([['DGS1MO', '1 month', '%'], ['DGS1', '1 year', '%'], ['DGS2', '2 years', '%'], ['DGS5', '5 years', '%'], ['DGS10', '10 years', '%'], ['DGS30', '30 years', '%']], 'pp', 6) });
console.log('Policy rates…');
sections.push({ id: 'rates', title: 'Policy & money-market rates', mode: 'pp', source: 'FRED (Federal Reserve, NY Fed, ECB)', note: 'Changes are in percentage points.',
  rows: await series([['DFF', 'Fed funds (effective)', '%'], ['SOFR', 'SOFR', '%'], ['ECBDFR', 'ECB deposit rate', '%'], ['ECBMRRFR', 'ECB main refi rate', '%'],
    ['MORTGAGE30US', '30-year mortgage', '%'], ['MORTGAGE15US', '15-year mortgage', '%']], 'pp', 6) });

console.log('Inflation & jobs…');
const infl = [];
for (const [id, name] of [['CPIAUCSL', 'CPI (headline)'], ['CPILFESL', 'Core CPI (excl. food & energy)'], ['PCEPI', 'PCE prices (headline)'], ['PCEPILFE', 'Core PCE (the Fed\'s 2% target)']]) {
  const s = await fred(id, 3); infl.push(s?.length ? { id, name, unit: '% y/y', ...yoy(s) } : { id, name, missing: true });
}
sections.push({ id: 'inflation', title: 'US inflation', kind: 'yoy', source: 'FRED (BLS, BEA)', rows: infl });
const jobs = [];
{ const s = await fred('UNRATE', 2); if (s?.length) jobs.push({ id: 'UNRATE', name: 'Unemployment rate', unit: '%', value: s.at(-1).value, prev: s.at(-2).value, asOf: s.at(-1).date }); }
{ const s = await fred('CES0500000003', 3); if (s?.length) jobs.push({ id: 'CES0500000003', name: 'Average hourly earnings, total private', unit: '$', value: s.at(-1).value, prev: s.at(-2).value, asOf: s.at(-1).date, yoy: yoy(s).value }); }
sections.push({ id: 'jobs', title: 'US jobs', kind: 'monthly', source: 'FRED (BLS)', rows: jobs });

console.log('World Bank…');
{
  const meta = await get('https://api.worldbank.org/v2/country?format=json&per_page=400', 'json');
  const real = new Set((meta?.[1] ?? []).filter(c => c.region?.id !== 'NA').map(c => c.id));
  const latest = async ind => {
    const j = await get(`https://api.worldbank.org/v2/country/all/indicator/${ind}?format=json&per_page=20000&mrnev=1`, 'json');
    return Object.fromEntries((j?.[1] ?? []).filter(r => r.value != null).map(r => [r.countryiso3code, { value: r.value, year: r.date, name: r.country.value }]));
  };
  const gdp = await latest('NY.GDP.MKTP.CD');
  const top = Object.entries(gdp).filter(([k]) => real.has(k)).sort((a, b) => b[1].value - a[1].value).slice(0, 10).map(([k]) => k);
  const [pc, pop, un] = [await latest('NY.GDP.PCAP.CD'), await latest('SP.POP.TOTL'), await latest('SL.UEM.TOTL.ZS')];
  sections.push({ id: 'world', title: "The world's 10 largest economies", kind: 'table', source: 'World Bank (World Development Indicators); unemployment is the ILO modelled estimate',
    world: { population: pop.WLD ?? null, gdp: gdp.WLD ?? null },
    rows: top.map(k => ({ iso3: k, name: gdp[k].name, gdp: gdp[k], gdpPerCapita: pc[k] ?? null, population: pop[k] ?? null, unemployment: un[k] ?? null })) });
}

// Petroleum trade (EIA) needs a key; until then the app shows how to add one.
sections.push({ id: 'petroleum', title: 'US petroleum trade', kind: 'pending', source: 'US Energy Information Administration',
  note: process.env.EIA_API_KEY ? 'Coming next: imports, exports and top partners.' : 'Needs a free EIA API key (eia.gov/opendata), saved as the EIA_API_KEY secret for the nightly job.' });

writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), sections }, null, 1) + '\n');
const missing = sections.flatMap(s => s.rows ?? []).filter(r => r.missing).map(r => r.id);
console.log(`Wrote ${OUT}${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`);
