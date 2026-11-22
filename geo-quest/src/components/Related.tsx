import type { Dataset, Place } from '../types';
import { relatedFor, type RelLink } from '../related';
import { wikiUrl } from '../data';
import { Icon } from './Icons';
import { LAYER_ICON } from '../cards';

/** "Related" chips: tap one to open that place's sheet (or its Wikipedia page if the app doesn't teach it). */
export function Related({ ds, place, onOpen, links }: { ds: Dataset; place?: Place; onOpen: (placeId: string) => void; links?: RelLink[] }) {
  const ls = links ?? (place ? relatedFor(ds, place) : []);
  if (!ls.length) return null;
  return (
    <div className="related" onClick={e => e.stopPropagation()}>
      <span className="related-label">Related</span>
      {ls.map(l => l.placeId
        ? <button key={l.label} className="rel-chip" onClick={() => onOpen(l.placeId!)}><Icon name={LAYER_ICON[ds.byId.get(l.placeId)?.layer ?? 'country']} size={13} />{l.label}</button>
        : <a key={l.label} className="rel-chip ext" href={wikiUrl(l.wiki ?? l.label)} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
    </div>
  );
}
