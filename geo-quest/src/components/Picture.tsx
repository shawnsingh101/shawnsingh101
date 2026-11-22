import { useEffect, useState } from 'react';
import { commonsUrl, wikiThumb, wikiUrl } from '../data';

/** A photo from Wikimedia Commons (via Wikidata), falling back to the Wikipedia article's lead image. */
export function Picture({ file, wiki, caption }: { file?: string | null; wiki?: string | null; caption: string }) {
  const [src, setSrc] = useState<string | null>(file ? commonsUrl(file, 800) : null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    if (file) setSrc(commonsUrl(file, 800));
    else if (wiki) { setSrc(null); wikiThumb(wiki).then(setSrc); }
    else setSrc(null);
  }, [file, wiki]);
  if (!src) return null;
  return (
    <figure className={'picture' + (loaded ? ' loaded' : '')}>
      <img src={src} alt={caption} onLoad={() => setLoaded(true)} onError={() => (wiki && file ? wikiThumb(wiki).then(setSrc) : setSrc(null))} />
      <figcaption>{caption}{wiki && <> · <a href={wikiUrl(wiki)} target="_blank" rel="noreferrer">Wikipedia ↗</a></>}</figcaption>
    </figure>
  );
}

export function Flag({ file, name, size = 320, className, eager }: { file: string | null; name: string; size?: number; className?: string; eager?: boolean }) {
  if (!file) return <div className={'flag flag-missing ' + (className ?? '')}>no flag on file</div>;
  return <img className={'flag ' + (className ?? '')} src={commonsUrl(file, size)} alt={`Flag of ${name}`} loading={eager ? 'eager' : 'lazy'} />;
}
