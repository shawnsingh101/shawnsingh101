#!/usr/bin/env node
// Builds public/data/dashboard.json: markets, rates, inflation, jobs, oil and the world's largest economies.
// Sources (all free): FRED (public CSV; FRED_KEY optional), World Bank (incl. Quarterly External Debt Statistics),
// BIS central bank policy rates, UN Comtrade (public preview: top traded goods and petroleum partners),
// EIA (US petroleum trade; needs the EIA_KEY secret).
// Run: node scripts/sync-dashboard.mjs   (the nightly workflow runs it after the Wikidata sync)
import { readFileSync, writeFileSync } from 'node:fs';
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
  if (process.env.FRED_KEY) {
    const j = await get(`https://api.stlouisfed.org/fred/series/observations?series_id=${id}&observation_start=${iso(from)}&file_type=json&api_key=${process.env.FRED_KEY}`, 'json');
    if (j?.observations) return j.observations.filter(o => o.value !== '.').map(o => ({ date: o.date, value: +o.value }));
  }
  const csv = await get(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=${iso(from)}`);
  if (!csv) return null;
  return csv.trim().split('\n').slice(1).map(l => l.split(',')).filter(([, v]) => v && v !== '.').map(([d, v]) => ({ date: d, value: +v }));
}
const onOrBefore = (s, date) => { let best = null; for (const x of s) { if (x.date <= date) best = x; else break; } return best; };
const back = (date, { days = 0, months = 0, years = 0 }) => { const d = new Date(date + 'T12:00:00Z'); d.setUTCFullYear(d.getUTCFullYear() - years); d.setUTCMonth(d.getUTCMonth() - months); d.setUTCDate(d.getUTCDate() - days); return iso(d); };

/** History for charts: daily for the last year, weekly before that (keeps the file small). [[date, value], …] */
function hist(s) {
  if (!s?.length) return [];
  const cut = back(s.at(-1).date, { years: 1 });
  const out = []; let lastWeek = null;
  for (const x of s) {
    if (x.date >= cut) { out.push([x.date, x.value]); continue; }
    const wk = Math.floor(Date.parse(x.date) / (7 * 864e5));
    if (wk !== lastWeek) { out.push([x.date, x.value]); lastWeek = wk; }
  }
  return out;
}
/** CSV line → fields (handles quoted fields with commas, as in the BIS titles). */
function csvSplit(line) { const out = []; let cur = '', q = false; for (const ch of line) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; }
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
const PARTNER = { USA: 'United States', 'Russian Federation': 'Russia', 'Rep. of Korea': 'South Korea', 'Türkiye': 'Türkiye', 'United Rep. of Tanzania': 'Tanzania', 'China, Hong Kong SAR': 'Hong Kong', 'Viet Nam': 'Vietnam', 'Iran (Islamic Rep. of)': 'Iran', 'Bolivarian Rep. of Venezuela': 'Venezuela', 'United Kingdom': 'United Kingdom', 'Dem. Rep. of the Congo': 'DR Congo' };
// EIA uses ISO alpha-3 codes for partner countries.
const COUNTRY3 = { CAN: 'Canada', MEX: 'Mexico', VEN: 'Venezuela', BRA: 'Brazil', GUY: 'Guyana', SAU: 'Saudi Arabia', IRQ: 'Iraq', COL: 'Colombia', ECU: 'Ecuador', NGA: 'Nigeria', NLD: 'Netherlands', JPN: 'Japan', CHN: 'China', KOR: 'South Korea', IND: 'India', GBR: 'United Kingdom', FRA: 'France', DEU: 'Germany', ITA: 'Italy', ESP: 'Spain', SGP: 'Singapore', PAN: 'Panama', CHL: 'Chile', PER: 'Peru', ARG: 'Argentina', TWN: 'Taiwan', THA: 'Thailand', NOR: 'Norway', RUS: 'Russia', KWT: 'Kuwait', ARE: 'United Arab Emirates', LBY: 'Libya', AGO: 'Angola', DZA: 'Algeria', GTM: 'Guatemala', DOM: 'Dominican Republic', BHS: 'Bahamas', TTO: 'Trinidad and Tobago', JAM: 'Jamaica', HND: 'Honduras', SLV: 'El Salvador', CRI: 'Costa Rica', NIC: 'Nicaragua', CUW: 'Curaçao', ABW: 'Aruba', VIR: 'US Virgin Islands', PRI: 'Puerto Rico', BEL: 'Belgium', TUR: 'Türkiye', ISR: 'Israel', EGY: 'Egypt', AUS: 'Australia', NZL: 'New Zealand', VNM: 'Vietnam', IDN: 'Indonesia', MYS: 'Malaysia', PHL: 'Philippines', KAZ: 'Kazakhstan', GAB: 'Gabon', CMR: 'Cameroon', GNQ: 'Equatorial Guinea', COG: 'Republic of the Congo', TCD: 'Chad', GHA: 'Ghana', SEN: 'Senegal', CIV: 'Ivory Coast', MAR: 'Morocco', TUN: 'Tunisia', POL: 'Poland', SWE: 'Sweden', DNK: 'Denmark', FIN: 'Finland', PRT: 'Portugal', GRC: 'Greece', IRL: 'Ireland', CHE: 'Switzerland', AUT: 'Austria', URY: 'Uruguay', PRY: 'Paraguay', BOL: 'Bolivia', HTI: 'Haiti', BRB: 'Barbados', BMU: 'Bermuda', CYM: 'Cayman Islands', SUR: 'Suriname', LCA: 'Saint Lucia', GRD: 'Grenada', ATG: 'Antigua and Barbuda', VCT: 'Saint Vincent', KNA: 'Saint Kitts and Nevis', DMA: 'Dominica', BLZ: 'Belize' };
async function series(rows, mode, years) {
  const out = [];
  for (const [id, name, unit] of rows) {
    const s = await fred(id, years);
    if (!s?.length) { out.push({ id, name, unit, missing: true }); continue; }
    out.push({ id, name, unit, ...changes(s, mode), hist: hist(s) });
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
  const s = await fred(id, 7);
  const yh = s?.length ? s.map((x, i) => { const ref = onOrBefore(s, back(x.date, { years: 1 })); return ref && ref.date < x.date ? [x.date, +((100 * (x.value - ref.value)) / ref.value).toFixed(2)] : null; }).filter(x => x && x[0] >= back(s.at(-1).date, { years: 5 })) : [];
  infl.push(s?.length ? { id, name, unit: '% y/y', ...yoy(s), hist: yh } : { id, name, missing: true });
}
sections.push({ id: 'inflation', title: 'US inflation', kind: 'yoy', source: 'FRED (BLS, BEA)', rows: infl });
const jobs = [];
{ const s = await fred('UNRATE', 6); if (s?.length) jobs.push({ id: 'UNRATE', name: 'Unemployment rate', unit: '%', value: s.at(-1).value, prev: s.at(-2).value, asOf: s.at(-1).date, hist: s.map(x => [x.date, x.value]) }); }
{ const s = await fred('CES0500000003', 3); if (s?.length) jobs.push({ id: 'CES0500000003', name: 'Average hourly earnings, total private', unit: '$', value: s.at(-1).value, prev: s.at(-2).value, asOf: s.at(-1).date, yoy: yoy(s).value }); }
sections.push({ id: 'jobs', title: 'US jobs', kind: 'monthly', source: 'FRED (BLS)', rows: jobs });

let topIso = [], topNames = {};
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
  // Gross external debt (all sectors), quarterly, from the World Bank's Quarterly External Debt Statistics.
  const debtJ = await get(`https://api.worldbank.org/v2/country/${top.join(';')}/indicator/DT.DOD.DECT.CD.AR.US?source=22&format=json&mrnev=1&per_page=50`, 'json');
  const debt = Object.fromEntries((debtJ?.[1] ?? []).filter(r => r.value != null).map(r => [r.countryiso3code, { value: r.value, year: r.date }]));
  sections.push({ id: 'world', title: "The world's 10 largest economies", kind: 'table', source: 'World Bank (World Development Indicators); unemployment is the ILO modelled estimate',
    world: { population: pop.WLD ?? null, gdp: gdp.WLD ?? null },
    rows: top.map(k => ({ iso3: k, name: PARTNER[gdp[k].name] ?? gdp[k].name, gdp: gdp[k], gdpPerCapita: pc[k] ?? null, population: pop[k] ?? null, unemployment: un[k] ?? null,
      externalDebt: debt[k] ?? null, debtToGdp: debt[k] ? +((100 * debt[k].value) / gdp[k].value).toFixed(0) : null })) });
  topIso = top; topNames = Object.fromEntries(top.map(k => [k, PARTNER[gdp[k].name] ?? gdp[k].name]));
}

// ---- central bank policy rates (BIS) ----
console.log('Policy rates (BIS)…');
{
  const areas = { US: 'United States (Fed)', XM: 'Euro area (ECB)', CN: 'China (PBoC)', JP: 'Japan (BoJ)', GB: 'United Kingdom (BoE)', IN: 'India (RBI)', CA: 'Canada (BoC)', RU: 'Russia (CBR)', BR: 'Brazil (BCB)', KR: 'South Korea (BoK)' };
  const from = new Date(today); from.setFullYear(from.getFullYear() - 5);
  const csv = await get(`https://stats.bis.org/api/v2/data/dataflow/BIS/WS_CBPOL/1.0/D.${Object.keys(areas).join('+')}?startPeriod=${iso(from)}&format=csv`);
  const by = {};
  if (csv) {
    const lines = csv.trim().split('\n'), head = csvSplit(lines[0]);
    const iA = head.indexOf('REF_AREA'), iT = head.indexOf('TIME_PERIOD'), iV = head.indexOf('OBS_VALUE');
    for (const l of lines.slice(1)) { const c = csvSplit(l); if (c[iV] !== '' && isFinite(+c[iV]) && /^\d{4}-\d\d-\d\d$/.test(c[iT])) (by[c[iA]] ??= []).push({ date: c[iT], value: +c[iV] }); }
  }
  const rows = Object.entries(areas).map(([a, name]) => {
    const s = (by[a] ?? []).sort((x, y) => x.date.localeCompare(y.date));
    if (!s.length) return { id: a, name, missing: true };
    const last = s.at(-1);
    let i = s.length - 1; while (i > 0 && s[i - 1].value === last.value) i--;
    const yearAgo = onOrBefore(s, back(last.date, { years: 1 }));
    // History: only the days the rate changed (plus the ends), which is all a step chart needs.
    const steps = s.filter((x, j) => j === 0 || j === s.length - 1 || x.value !== s[j - 1].value).map(x => [x.date, x.value]);
    return { id: a, name, value: last.value, asOf: last.date, since: i > 0 ? s[i].date : null, from: i > 0 ? s[i - 1].value : null, y1: yearAgo ? +(last.value - yearAgo.value).toFixed(2) : null, hist: steps };
  });
  sections.push({ id: 'cbpol', title: 'Central bank policy rates', kind: 'policy', source: 'Bank for International Settlements (central bank policy rates)', rows });
}

// ---- US petroleum trade (EIA) ----
const EIA = process.env.EIA_KEY ?? process.env.EIA_API_KEY;
console.log('US petroleum (EIA)…');
if (EIA) {
  const eia = (path, q) => get(`https://api.eia.gov/v2/${path}?api_key=${EIA}&${q}`, 'json');
  // Weekly totals: imports, exports, net imports of crude oil and petroleum products (thousand barrels a day).
  const weekly = [];
  for (const [id, name] of [['WTTIMUS2', 'Gross imports'], ['WTTEXUS2', 'Gross exports'], ['WTTNTUS2', 'Net imports']]) {
    const j = await eia(`seriesid/PET.${id}.W`, 'length=270'); // ~5 years of weeks
    const d = (j?.response?.data ?? []).map(x => ({ date: x.period, value: +x.value })).sort((a, b) => a.date.localeCompare(b.date));
    if (!d.length) { weekly.push({ id, name, missing: true }); continue; }
    const last = d.at(-1), yr = onOrBefore(d, back(last.date, { days: 364 }));
    const avg4 = d.slice(-4).reduce((a, x) => a + x.value, 0) / Math.min(4, d.length);
    weekly.push({ id, name, unit: 'thousand barrels/day', value: last.value, asOf: last.date, avg4: Math.round(avg4), y1: yr ? Math.round(last.value - yr.value) : null, hist: d.map(x => [x.date, x.value]) });
  }
  // Monthly partners: where US imports come from and where exports go (per-day series, countries only).
  const partners = async (route) => {
    const j = await eia(`petroleum/move/${route}/data/`, 'frequency=monthly&data[0]=value&facets[product][]=EP00&sort[0][column]=period&sort[0][direction]=desc&length=600');
    const d = (j?.response?.data ?? []).filter(x => x.units === 'MBBL/D');
    const period = d[0]?.period;
    const rows = d.filter(x => x.period === period);
    const total = rows.find(x => x.duoarea === 'NUS-Z00')?.value;
    const countries = rows.filter(x => /^NUS-N/.test(x.duoarea) && x.value != null).sort((a, b) => b.value - a.value).slice(0, 5)
      .map(x => ({ name: x['area-name'].length === 3 ? COUNTRY3[x['area-name']] ?? x['area-name'] : x['area-name'], value: +x.value, share: total ? +((100 * x.value) / total).toFixed(1) : null }));
    return { period, total: total != null ? +total : null, countries };
  };
  const imp = await partners('impcus'), exp = await partners('expc');
  sections.push({ id: 'petroleum', title: 'US petroleum trade', kind: 'petroleum', source: 'US Energy Information Administration (crude oil and petroleum products)', weekly, imports: imp, exports: exp });
} else {
  sections.push({ id: 'petroleum', title: 'US petroleum trade', kind: 'pending', source: 'US Energy Information Administration',
    note: 'Needs the EIA_KEY secret (a free key from eia.gov/opendata) for the nightly job.' });
}

// ---- what the largest economies trade (UN Comtrade public preview; annual) ----
console.log('Trade (UN Comtrade)…');
{
  const ref = await get('https://comtradeapi.un.org/files/v1/app/reference/Reporters.json', 'json');
  const codeOf = Object.fromEntries((ref?.results ?? []).filter(r => r.reporterCodeIsoAlpha3 && !r.isGroup && !r.entryExpiredDate).map(r => [r.reporterCodeIsoAlpha3, r.reporterCode])); // current codes only (USA 842, not 841)
  const pause = () => new Promise(r => setTimeout(r, 6000)); // the public preview is rate-limited (429s at ~1/s)
  const comtrade = async (q) => { await pause(); const j = await get(`https://comtradeapi.un.org/public/v1/preview/C/A/HS?${q}&includeDesc=true`, 'json'); return j?.data ?? []; };
  const HS = {"02": "Meat", "03": "Fish & seafood", "08": "Fruit & nuts", "10": "Cereals", "12": "Oil seeds", "15": "Fats & oils", "22": "Beverages", "26": "Ores", "27": "Mineral fuels & oil", "28": "Inorganic chemicals", "29": "Organic chemicals", "30": "Pharmaceuticals", "33": "Perfumes & cosmetics", "38": "Chemical products", "39": "Plastics", "40": "Rubber", "44": "Wood", "48": "Paper", "52": "Cotton", "61": "Knitted clothing", "62": "Clothing", "64": "Footwear", "71": "Gold, gems & jewellery", "72": "Iron & steel", "73": "Iron & steel goods", "74": "Copper", "76": "Aluminium", "84": "Machinery & computers", "85": "Electrical & electronics", "86": "Railway equipment", "87": "Vehicles", "88": "Aircraft & spacecraft", "89": "Ships & boats", "90": "Optical & medical instruments", "94": "Furniture & lighting", "95": "Toys & sports goods", "99": "Other"}; // plain names for the common HS chapters
  const shortDesc = d => d.replace(/;.*$/, '').replace(/,? (and|or) (parts|articles|products) (thereof|of their distillation).*$/i, '').replace(/\s*\(.*?\)/g, '').slice(0, 70);
  const countries = [];
  for (const iso3 of topIso) {
    const code = codeOf[iso3]; if (!code) continue;
    let year = null, goods = {};
    for (const y of [today.getFullYear() - 1, today.getFullYear() - 2, today.getFullYear() - 3]) {
      const [x, m] = [await comtrade(`reporterCode=${code}&period=${y}&partnerCode=0&flowCode=X&cmdCode=AG2`), await comtrade(`reporterCode=${code}&period=${y}&partnerCode=0&flowCode=M&cmdCode=AG2`)];
      if (x.length && m.length) {
        const top5 = rows => { const tot = rows.reduce((a, r) => a + (r.primaryValue ?? 0), 0); return rows.sort((a, b) => b.primaryValue - a.primaryValue).slice(0, 5).map(r => ({ code: r.cmdCode, name: HS[r.cmdCode] ?? shortDesc(r.cmdDesc ?? r.cmdCode), value: r.primaryValue, share: +((100 * r.primaryValue) / tot).toFixed(1) })); };
        goods = { exports: top5(x), imports: top5(m) }; year = y; break;
      }
    }
    if (!year) { countries.push({ iso3, name: topNames[iso3], missing: true, note: iso3 === 'RUS' ? 'Russia has not published customs data since 2022.' : 'No recent figures reported.' }); continue; }
    // Petroleum (HS 2709 crude + 2710 refined) partners, same year.
    const oil = async flow => {
      const rows = await comtrade(`reporterCode=${code}&period=${year}&flowCode=${flow}&cmdCode=2709,2710`);
      const byP = {}; let tot = 0;
      for (const r of rows) { if (r.partnerCode === 0) { tot += r.primaryValue; continue; } if (r.partnerDesc && !/areas|n\.e\.s|bunkers|free zones/i.test(r.partnerDesc)) { const n = PARTNER[r.partnerDesc] ?? r.partnerDesc; byP[n] = (byP[n] ?? 0) + r.primaryValue; } }
      return Object.entries(byP).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value, share: tot ? +((100 * value) / tot).toFixed(1) : null }));
    };
    countries.push({ iso3, name: topNames[iso3], year, ...goods, oilFrom: await oil('M'), oilTo: await oil('X') });
  }
  // Annual figures: if a country couldn't be fetched tonight (rate limits), keep last night's.
  try {
    const prev = JSON.parse(readFileSync(OUT, 'utf8')).sections.find(x => x.id === 'trade')?.countries ?? [];
    countries.forEach((c, i) => { if (c.missing) { const p = prev.find(x => x.iso3 === c.iso3 && !x.missing); if (p) countries[i] = p; } });
  } catch { /* first run */ }
  sections.push({ id: 'trade', title: 'What the largest economies trade', kind: 'trade', source: 'UN Comtrade (annual, HS chapters; petroleum = HS 2709 crude + 2710 refined)', countries });
}

writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), sections }) + '\n'); // compact: it holds chart history
const missing = sections.flatMap(s => s.rows ?? []).filter(r => r.missing).map(r => r.id);
console.log(`Wrote ${OUT}${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`);
