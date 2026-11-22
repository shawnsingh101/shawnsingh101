import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { commonsUrl, wikiGallery, wikiUrl, type Photo } from '../data';

/**
 * Photos of a place: the Wikipedia article's infobox collage as a swipeable strip,
 * falling back to the single Wikidata image if the article has no photos.
 */
/** `single`: just this one picture (an artwork), shown whole rather than cropped to a strip; the Wikipedia link stays.
 *  Any picture opens full screen when tapped. */
export function Picture({ file, wiki, url, caption, hideCaption, single }: { file?: string | null; wiki?: string | null; url?: string | null; caption: string; hideCaption?: boolean; single?: boolean }) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<Photo | null>(null); // the picture open full screen
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    setPhotos(null); setIdx(0);
    const fallback = file ? [{ src: commonsUrl(file, 800), big: commonsUrl(file, 1600), caption }] : url ? [{ src: url, caption }] : [];
    if (!wiki || (single && fallback.length)) { setPhotos(fallback); return; }
    wikiGallery(wiki).then(g => { if (live) setPhotos(g.length ? g : fallback); });
    return () => { live = false; };
  }, [file, wiki, url, caption, single]);

  if (!photos?.length) return photos === null ? <div className="gallery loading" /> : null;
  const go = (i: number) => { const el = strip.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' }); };

  return (
    <figure className={'gallery' + (single ? ' whole' : '')} onClick={e => e.stopPropagation()}>
      <div className="strip" ref={strip} onScroll={e => { const el = e.currentTarget; setIdx(Math.round(el.scrollLeft / el.clientWidth)); }}>
        {photos.map((p, i) => <img key={p.src} src={p.src} alt={p.caption} loading={i ? 'lazy' : 'eager'} title="Tap to see it full screen" onClick={() => setZoom(p)} onLoad={e => e.currentTarget.classList.add('loaded')} />)}
      </div>
      {photos.length > 1 && <>
        <button className="nav prev" aria-label="Previous photo" disabled={idx === 0} onClick={() => go(idx - 1)}>‹</button>
        <button className="nav next" aria-label="Next photo" disabled={idx === photos.length - 1} onClick={() => go(idx + 1)}>›</button>
        <div className="dots">{photos.map((_, i) => <i key={i} className={i === idx ? 'on' : ''} />)}</div>
      </>}
      {zoom && <Lightbox src={zoom.src} big={zoom.big} alt={hideCaption ? '' : caption} onClose={() => setZoom(null)} />}
      {!hideCaption && <figcaption>
        <span className="cap">{photos[idx]?.caption || caption}</span>
        {wiki && <a href={wikiUrl(wiki)} target="_blank" rel="noreferrer">Wikipedia ↗</a>}
      </figcaption>}
    </figure>
  );
}

/** The whole picture on a dark backdrop, as large as the screen allows. Tap anywhere or press Esc to close. */
function Lightbox({ src, big, alt, onClose }: { src: string; big?: string; alt: string; onClose: () => void }) {
  // Show the copy already on screen at once, then swap in the sharper one when it has arrived.
  const [shown, setShown] = useState(src);
  useEffect(() => { if (!big) return; const im = new Image(); im.onload = () => setShown(big); im.src = big; }, [big]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', k, true);
    return () => window.removeEventListener('keydown', k, true);
  }, [onClose]);
  return createPortal(
    <div className="lightbox" role="dialog" aria-label="Picture, full screen" onClick={e => { e.stopPropagation(); onClose(); }}>
      <img src={shown} alt={alt} />
      <button className="lightbox-close" aria-label="Close">×</button>
    </div>, document.body);
}

export function Flag({ file, name, size = 320, className, eager }: { file: string | null; name: string; size?: number; className?: string; eager?: boolean }) {
  if (!file) return <div className={'flag flag-missing ' + (className ?? '')}>no flag on file</div>;
  return <img className={'flag ' + (className ?? '')} src={commonsUrl(file, size)} alt={`Flag of ${name}`} loading={eager ? 'eager' : 'lazy'} />;
}
