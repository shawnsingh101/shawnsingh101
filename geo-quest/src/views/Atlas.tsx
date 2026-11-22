import { useState } from 'react';
import { GROUPS, SECTIONS, placesIn, cardId, KIND_LABEL, kindsFor, LAYER_NOUN, LAYER_ICON } from '../cards';
import { level, useProgress } from '../srs';
import type { Dataset } from '../types';
import { Flag, Picture } from '../components/Picture';
import { Icon } from '../components/Icons';
import { wikiUrl } from '../data';
import { LocalName } from '../components/Native';
import { PartyPill } from '../components/Portrait';

const LEVEL = ['not started', 'learning', 'known', 'mastered'];
const cap1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function PlaceSheet({ ds, id, onClose }: { ds: Dataset; id: string; onClose: () => void }) {
  const p = useProgress();
  const c = ds.byId.get(id)!;
  const cap = c.capitals[0];
  const pic = cap ? { file: cap.image, wiki: cap.wiki, caption: cap.name } : { file: c.image, wiki: c.wiki, caption: c.name };
  return (
    <div className="sheet" role="dialog">
      <button className="btn ghost close icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
      <div className="sheet-head">
        {(c.layer === 'country' || c.layer === 'us') && <Flag file={c.flag ?? null} name={c.name} size={240} className="sheet-flag" />}
        <div>
          <h2>{c.name}</h2>
          <div className="local"><LocalName place={c} showLang /></div>
          {c.officialName && c.officialName !== c.name && <p className="muted small">{c.officialName}</p>}
          {c.type && <p className="muted small">{cap1(c.type)} of China</p>}
          {(c.layer === 'water' || c.layer === 'river' || c.layer === 'lake') && <p className="muted small">{GROUPS.find(g => g.id === c.group)?.name}</p>}
          {c.facts && <p>{c.facts}</p>}
          {c.layer === 'terr' && <p>Part of <b>{c.sovereignName}</b>{c.terrStatus ? <span className="muted"> · {c.terrStatus}</span> : null}</p>}
          {c.capitalAnswer && <p>Capital: <b>{c.capitalAnswer}</b>{cap && <span className="local inline"> <LocalName place={c} capital={cap} /></span>}</p>}
          {c.statusNote && <p className="note"><Icon name="info" size={15} /> {c.statusNote}</p>}
          {c.capitalNote && <p className="note"><Icon name="info" size={15} /> {c.capitalNote}</p>}
        </div>
      </div>
      {p.settings.pictures && <Picture {...pic} />}
      <ul className="card-levels">
        {kindsFor(c).map(k => { const l = level(p, cardId(c.id, k)); return <li key={k} className={'lv' + l}><span>{KIND_LABEL[k]}</span><small>{LEVEL[l]}</small></li>; })}
      </ul>
      {(c.currency?.length || c.largestCity) && <div className="facts-list">
        {c.currency?.length ? <p><Icon name="coin" size={15} /> Currency: <b>{c.currency.map(x => `${x.name}${x.code ? ` (${x.code})` : ''}`).join(', ')}</b></p> : null}
        {c.largestCity && <p><Icon name="city" size={15} /> Largest city: <b>{c.largestCity.name}</b>{c.largestCity.isCapital ? ' (the capital)' : ''}</p>}
      </div>}
      {(() => {
        const people = ds.places.filter(s => s.layer === 'senate' && (s.place ?? s.state) === c.id);
        if (!people.length) return null;
        return <div className="senators">
          <b>{c.layer === 'us' ? 'Governor & senators' : 'Leaders'}</b>
          {people.map(s => (
            <div key={s.id} className="senator-row">
              {s.photo ? <img src={s.photo} alt={s.name} loading="lazy" /> : <span className="row-glyph"><Icon name="person" /></span>}
              <div><b>{s.name}</b> <PartyPill party={s.party} /><p className="muted small">{s.topic === 'leaders' ? s.office : s.label}{s.facts && s.topic !== 'leaders' ? ` · ${s.facts}` : ''}</p>
                {s.incoming && <p className="small incoming-line">→ {s.incoming.name}{s.incoming.party ? ` (${s.incoming.party})` : ''} takes office {s.incoming.from}</p>}</div>
            </div>
          ))}
        </div>;
      })()}
      <ul className="card-levels" hidden>
      </ul>
      {c.wiki && <a className="btn" href={wikiUrl(c.wiki)} target="_blank" rel="noreferrer">Read about {c.name} on Wikipedia ↗</a>}
    </div>
  );
}
export const CountrySheet = PlaceSheet;

/** Browse like an iPod: section → region → place. */
export function Atlas({ ds }: { ds: Dataset }) {
  const [sec, setSec] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const sectionPlaces = (s: string) => GROUPS.filter(g => g.section === s).flatMap(g => placesIn(ds, g.id));
  const groups = sec ? GROUPS.filter(g => g.section === sec) : [];
  const g = group ?? (groups.length === 1 ? groups[0].id : null);
  return (
    <div className="atlas">
      <nav className="crumbs">
        <button className="crumb" onClick={() => { setSec(null); setGroup(null); }}>World</button>
        {sec && <button className="crumb" onClick={() => setGroup(null)}>{sec}</button>}
        {group && <span className="crumb">{GROUPS.find(x => x.id === group)!.name}</span>}
      </nav>
      {!sec && <div className="tiles">{SECTIONS.map(s => (
        <button key={s} className={'tile cont-' + s.toLowerCase().replace(/[^a-z]/g, '')} onClick={() => setSec(s)}>
          <b>{s}</b><small>{sectionPlaces(s).length} {s === 'China' ? 'provinces & regions' : LAYER_NOUN[GROUPS.find(g => g.section === s)!.layer]}</small>
        </button>))}</div>}
      {sec && !g && <div className="tiles">{groups.map(gr => (
        <button key={gr.id} className="tile" onClick={() => setGroup(gr.id)}>
          {gr.layer === 'country' && <div className="tile-flags">{placesIn(ds, gr.id).slice(0, 6).map(c => <Flag key={c.id} file={c.flag ?? null} name={c.name} size={80} />)}</div>}
          {gr.layer !== 'country' && <div className="tile-glyph"><Icon name={LAYER_ICON[gr.layer]} size={28} /></div>}
          <b>{gr.name}</b><small>{placesIn(ds, gr.id).length} {LAYER_NOUN[gr.layer]}</small>
        </button>))}</div>}
      {g && <div className="country-list">{placesIn(ds, g).sort((a, b) => a.name.localeCompare(b.name)).map(c => (
        <button key={c.id} className="country-row" onClick={() => setPlace(c.id)}>
          {c.flag ? <Flag file={c.flag ?? null} name={c.name} size={80} /> : <span className="row-glyph"><Icon name={LAYER_ICON[c.layer]} /></span>}
          <span className="grow"><b>{c.name} <span className="local inline"><LocalName place={c} voice={false} /></span></b><small>{c.capitalAnswer ? (c.capitalAnswer.length < 40 ? c.capitalAnswer : c.capitals.map(x => x.name).join(' / ')) : c.type ? cap1(c.type) : ''}</small></span>
          {c.status && c.status !== 'un' && <span className="tag">{c.status}</span>}
        </button>))}</div>}
      {place && <PlaceSheet ds={ds} id={place} onClose={() => setPlace(null)} />}
    </div>
  );
}
