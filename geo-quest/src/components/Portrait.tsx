import { useEffect, useState } from 'react';
import { wikiThumb } from '../data';

/** Party colour key: blue Democrat, red Republican, purple independent; neutral grey for parties elsewhere. */
export function partyTone(party?: string) {
  if (!party) return 'none';
  if (/^Democrat/i.test(party)) return 'dem';
  if (/^Republican/i.test(party)) return 'rep';
  if (/^Independent/i.test(party)) return 'ind';
  return 'other';
}

export function PartyPill({ party, label }: { party?: string; label?: string }) {
  if (!party) return null;
  return <span className={'party-pill ' + partyTone(party)}><i />{label ?? party}</span>;
}

/** A portrait: an anonymous silhouette until the answer is revealed, then the official photo. */
/** A person's photo: the official one, or — if that's missing (e.g. a newly appointed senator) — the main image on their Wikipedia page. */
export function usePersonPhoto(photo?: string | null, wiki?: string | null) {
  const [src, setSrc] = useState<string | null>(photo ?? null);
  // `live` guards against a slow lookup for the previous card landing on this one.
  useEffect(() => { let live = true; setSrc(photo || null); if (!photo && wiki) wikiThumb(wiki.replace(/ /g, '_')).then(u => { if (live) setSrc(u); }); return () => { live = false; }; }, [photo, wiki]);
  const onError = () => { if (wiki) wikiThumb(wiki.replace(/ /g, '_')).then(u => setSrc(u && u !== src ? u : null)); else setSrc(null); };
  return { src, onError };
}

export function PersonPhoto({ photo, wiki, name, className }: { photo?: string | null; wiki?: string | null; name: string; className?: string }) {
  const { src, onError } = usePersonPhoto(photo, wiki);
  return src ? <img src={src} alt={name} loading="lazy" onError={onError} className={className} /> : <span className={'row-glyph ' + (className ?? '')}>?</span>;
}

export function Portrait({ photo, wiki, show, name, party }: { photo: string; wiki?: string | null; show: boolean; name?: string; party?: string }) {
  const [loaded, setLoaded] = useState(false);
  const { src, onError } = usePersonPhoto(photo, wiki);
  return (
    <div className={'portrait ' + partyTone(party) + (show ? ' shown' : '')}>
      <div className="frame">
        <svg className="silhouette" viewBox="0 0 100 120" aria-hidden="true">
          <circle cx="50" cy="44" r="21" /><path d="M12 120c0-25 17-40 38-40s38 15 38 40z" />
        </svg>
        {show && src && <img src={src} alt={name ?? 'Portrait'} onLoad={() => setLoaded(true)} onError={onError} className={loaded ? 'loaded' : ''} />}
      </div>
      {show && name && <div className="caption">{name}</div>}
      {show && name && <PartyPill party={party} />}
    </div>
  );
}

/** "Incoming January 2027: Mary Peltola (Democrat)" — an election winner who hasn't taken office yet. */
export function Incoming({ inc, current }: { inc: { name: string; party: string | null; wiki: string | null; from: string }; current: string }) {
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => { let live = true; if (inc.wiki) wikiThumb(inc.wiki.replace(/ /g, '_')).then(u => live && setImg(u)); return () => { live = false; }; }, [inc.wiki]);
  return (
    <div className="incoming" onClick={e => e.stopPropagation()}>
      <div className="incoming-photo">{img ? <img src={img} alt={inc.name} /> : <svg viewBox="0 0 100 120"><circle cx="50" cy="44" r="21" /><path d="M12 120c0-25 17-40 38-40s38 15 38 40z" /></svg>}</div>
      <div>
        <small>Incoming · takes office {inc.from}</small>
        <b>{inc.name}</b> <PartyPill party={inc.party ?? undefined} />
        <p className="muted small">Won the 2026 election; replaces {current}.</p>
      </div>
    </div>
  );
}
