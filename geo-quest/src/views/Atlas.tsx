import { useState } from 'react';
import { CONTINENTS, GROUPS, countriesIn, cardId, KIND_LABEL, TOPICS } from '../cards';
import { level, useProgress } from '../srs';
import type { Dataset } from '../types';
import { Flag, Picture } from '../components/Picture';
import { wikiUrl } from '../data';

const LEVEL = ['not started', 'learning', 'known', 'mastered'];

export function CountrySheet({ ds, id, onClose }: { ds: Dataset; id: string; onClose: () => void }) {
  const p = useProgress();
  const c = ds.byId.get(id)!;
  return (
    <div className="sheet" role="dialog">
      <button className="btn ghost close" onClick={onClose} aria-label="Close">✕</button>
      <div className="sheet-head">
        <Flag file={c.flag} name={c.name} size={240} className="sheet-flag" />
        <div>
          <h2>{c.name}</h2>
          {c.officialName !== c.name && <p className="muted small">{c.officialName}</p>}
          <p>Capital: <b>{c.capitalAnswer}</b></p>
          {c.statusNote && <p className="note">ⓘ {c.statusNote}</p>}
          {c.capitalNote && <p className="note">ⓘ {c.capitalNote}</p>}
        </div>
      </div>
      {p.settings.pictures && c.capitals[0] && <Picture file={c.capitals[0].image} wiki={c.capitals[0].wiki} caption={c.capitals[0].name} />}
      <ul className="card-levels">
        {TOPICS.flatMap(t => t.kinds).map(k => { const l = level(p, cardId(c.id, k)); return <li key={k} className={'lv' + l}><span>{KIND_LABEL[k]}</span><small>{LEVEL[l]}</small></li>; })}
      </ul>
      {c.wiki && <a className="btn" href={wikiUrl(c.wiki)} target="_blank" rel="noreferrer">Read about {c.name} on Wikipedia ↗</a>}
    </div>
  );
}

/** Browse like an iPod: continent → region → country. */
export function Atlas({ ds }: { ds: Dataset }) {
  const [cont, setCont] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const crumbs = [
    <button key="w" className="crumb" onClick={() => { setCont(null); setGroup(null); }}>World</button>,
    cont && <button key="c" className="crumb" onClick={() => setGroup(null)}>{cont}</button>,
    group && <span key="g" className="crumb">{GROUPS.find(g => g.id === group)!.name}</span>,
  ];
  return (
    <div className="atlas">
      <nav className="crumbs">{crumbs}</nav>
      {!cont && <div className="tiles">{CONTINENTS.map(c => (
        <button key={c} className={'tile cont-' + c.toLowerCase()} onClick={() => setCont(c)}>
          <b>{c}</b><small>{ds.countries.filter(x => x.region === c).length} countries</small>
        </button>))}</div>}
      {cont && !group && <div className="tiles">{GROUPS.filter(g => g.continent === cont).map(g => (
        <button key={g.id} className="tile" onClick={() => setGroup(g.id)}>
          <div className="tile-flags">{countriesIn(ds, g.id).slice(0, 6).map(c => <Flag key={c.id} file={c.flag} name={c.name} size={80} />)}</div>
          <b>{g.name}</b><small>{countriesIn(ds, g.id).length} countries</small>
        </button>))}</div>}
      {group && <div className="country-list">{countriesIn(ds, group).sort((a, b) => a.name.localeCompare(b.name)).map(c => (
        <button key={c.id} className="country-row" onClick={() => setCountry(c.id)}>
          <Flag file={c.flag} name={c.name} size={80} />
          <span className="grow"><b>{c.name}</b><small>{c.capitalAnswer && c.capitalAnswer.length < 40 ? c.capitalAnswer : c.capitals.map(x => x.name).join(' / ')}</small></span>
          {c.status !== 'un' && <span className="tag">{c.status}</span>}
        </button>))}</div>}
      {country && <CountrySheet ds={ds} id={country} onClose={() => setCountry(null)} />}
    </div>
  );
}
