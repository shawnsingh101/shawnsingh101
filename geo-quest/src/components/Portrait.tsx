import { useState } from 'react';

/**
 * A dossier-style portrait: an anonymous silhouette until the answer is revealed,
 * then the official photo ("declassified").
 */
export function Portrait({ photo, show, name, party }: { photo: string; show: boolean; name?: string; party?: string }) {
  const [loaded, setLoaded] = useState(false);
  const tint = party === 'Democrat' ? 'dem' : party === 'Republican' ? 'rep' : 'ind';
  return (
    <div className={'portrait ' + tint + (show ? ' shown' : '')}>
      <div className="frame">
        <svg className="silhouette" viewBox="0 0 100 120" aria-hidden="true">
          <circle cx="50" cy="44" r="21" /><path d="M12 120c0-25 17-40 38-40s38 15 38 40z" />
        </svg>
        {show && <img src={photo} alt={name ?? 'Senator'} onLoad={() => setLoaded(true)} className={loaded ? 'loaded' : ''} />}
        {!show && <span className="stamp">Classified</span>}
      </div>
      <div className="caption">{show && name ? name : 'Subject: ?'}</div>
    </div>
  );
}
