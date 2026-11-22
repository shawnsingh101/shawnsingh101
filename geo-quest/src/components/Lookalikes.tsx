import type { Dataset, Place } from '../types';
import { Flag } from './Picture';

/** After a flag card: "Don't confuse with…" — the look-alike flags side by side, with how to tell them apart. */
export function Lookalikes({ ds, place }: { ds: Dataset; place: Place }) {
  const groups = ds.lookalikes.filter(g => place.iso3 && g.codes.includes(place.iso3));
  if (!groups.length) return null;
  const byIso = new Map(ds.countries.map(c => [c.iso3, c]));
  return (
    <div className="lookalikes" onClick={e => e.stopPropagation()}>
      <small>Don't confuse with</small>
      {groups.map(g => (
        <div key={g.codes.join()} className="lookalike">
          <div className="lookalike-flags">
            {g.codes.map(code => byIso.get(code)).filter((c): c is Place => !!c).map(c => (
              <figure key={c.id} className={c.id === place.id ? 'me' : ''}><Flag file={c.flag ?? null} name={c.name} size={160} /><figcaption>{c.name}</figcaption></figure>
            ))}
          </div>
          <p className="muted small">{g.tip}</p>
        </div>
      ))}
    </div>
  );
}
