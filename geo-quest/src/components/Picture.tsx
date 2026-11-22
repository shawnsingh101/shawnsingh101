import { useEffect, useRef, useState } from 'react';
import { commonsUrl, wikiGallery, wikiUrl, type Photo } from '../data';

/**
 * Photos of a place: the Wikipedia article's infobox collage as a swipeable strip,
 * falling back to the single Wikidata image if the article has no photos.
 */
export function Picture({ file, wiki, url, caption, hideCaption }: { file?: string | null; wiki?: string | null; url?: string | null; caption: string; hideCaption?: boolean }) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [idx, setIdx] = useState(0);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    setPhotos(null); setIdx(0);
    const fallback = file ? [{ src: commonsUrl(file, 800), caption }] : url ? [{ src: url, caption }] : [];
    if (!wiki) { setPhotos(fallback); return; }
    wikiGallery(wiki).then(g => { if (live) setPhotos(g.length ? g : fallback); });
    return () => { live = false; };
  }, [file, wiki, url, caption]);

  if (!photos?.length) return photos === null ? <div className="gallery loading" /> : null;
  const go = (i: number) => { const el = strip.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' }); };

  return (
    <figure className="gallery" onClick={e => e.stopPropagation()}>
      <div className="strip" ref={strip} onScroll={e => { const el = e.currentTarget; setIdx(Math.round(el.scrollLeft / el.clientWidth)); }}>
        {photos.map((p, i) => <img key={p.src} src={p.src} alt={p.caption} loading={i ? 'lazy' : 'eager'} onLoad={e => e.currentTarget.classList.add('loaded')} />)}
      </div>
      {photos.length > 1 && <>
        <button className="nav prev" aria-label="Previous photo" disabled={idx === 0} onClick={() => go(idx - 1)}>‹</button>
        <button className="nav next" aria-label="Next photo" disabled={idx === photos.length - 1} onClick={() => go(idx + 1)}>›</button>
        <div className="dots">{photos.map((_, i) => <i key={i} className={i === idx ? 'on' : ''} />)}</div>
      </>}
      {!hideCaption && <figcaption>
        <span className="cap">{photos[idx]?.caption || caption}</span>
        {wiki && <a href={wikiUrl(wiki)} target="_blank" rel="noreferrer">Wikipedia ↗</a>}
      </figcaption>}
    </figure>
  );
}

export function Flag({ file, name, size = 320, className, eager }: { file: string | null; name: string; size?: number; className?: string; eager?: boolean }) {
  if (!file) return <div className={'flag flag-missing ' + (className ?? '')}>no flag on file</div>;
  return <img className={'flag ' + (className ?? '')} src={commonsUrl(file, size)} alt={`Flag of ${name}`} loading={eager ? 'eager' : 'lazy'} />;
}
