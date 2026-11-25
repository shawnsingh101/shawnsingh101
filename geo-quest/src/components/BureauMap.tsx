// "Which regional bureau covers this country?": the country lit up on a world map; on the flip, the world colored by
// the State Department's six regional bureaus (src/bureaus.ts), the answer's bureau strongest, with a legend.
import { useMemo } from 'react';
import type { Dataset } from '../types';
import { REGIONAL_BUREAUS, bureauOf } from '../bureaus';
import { WorldMap } from './WorldMap';

export function BureauMap({ ds, iso3, revealed }: { ds: Dataset; iso3: string; revealed: boolean }) {
  const idOf = useMemo(() => new Map(ds.countries.filter(c => c.iso3).map(c => [c.iso3!, c.id])), [ds]);
  const bureauById = useMemo(() => new Map(REGIONAL_BUREAUS.flatMap(b => b.iso3.map(i => [idOf.get(i), b] as const)).filter(([id]) => id)), [idOf]);
  const target = idOf.get(iso3);
  const mine = bureauOf(iso3);
  if (!target || !mine) return null;
  const mineIds = mine.iso3.map(i => idOf.get(i)).filter((x): x is string => !!x);
  const fill = (id: string) => {
    if (!revealed) return undefined;
    const b = bureauById.get(id);
    if (!b) return undefined;
    return b === mine ? b.color : `color-mix(in srgb, ${b.color} 28%, var(--land, #e8e2d6))`;
  };
  return (
    <div className="bureau-map" onClick={e => revealed && e.stopPropagation()}>
      <WorldMap ds={ds} className="bureau-world" fill={fill} tones={{ [target]: revealed ? 'right' : 'accent' }} target={revealed ? null : { id: target }}
        focus={revealed ? { ids: mineIds, key: iso3 + ':r', pad: 0.8 } : { ids: [target], key: iso3, pad: 0.18 }} />
      {revealed && <ul className="bureau-legend">
        {REGIONAL_BUREAUS.map(b => <li key={b.code} className={b === mine ? 'mine' : ''}><i style={{ background: b.color }} />{b.code}<span> · {b.name}</span></li>)}
      </ul>}
    </div>
  );
}
