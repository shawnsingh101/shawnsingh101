import { useMemo, useState } from 'react';
import { WorldMap } from '../components/WorldMap';
import { level, useProgress } from '../srs';
import { cardId, TOPICS, type Kind } from '../cards';
import type { Dataset } from '../types';
import { CountrySheet } from './Atlas';

const ALL_KINDS: Kind[] = TOPICS.flatMap(t => t.kinds);
const SCALE = ['var(--m0)', 'var(--m1)', 'var(--m2)', 'var(--m3)'];

/** Average mastery of all a country's cards → 0..3 */
export function countryMastery(p: ReturnType<typeof useProgress>, countryId: string) {
  let sum = 0;
  for (const k of ALL_KINDS) sum += level(p, cardId(countryId, k));
  return sum / ALL_KINDS.length;
}

export function MapView({ ds }: { ds: Dataset }) {
  const p = useProgress();
  const [sel, setSel] = useState<string | null>(null);
  const mastery = useMemo(() => new Map(ds.countries.map(c => [c.id, countryMastery(p, c.id)])), [ds, p]);
  const fill = (id: string) => {
    const m = mastery.get(id) ?? 0;
    if (m === 0) return undefined;
    return `color-mix(in oklab, ${SCALE[Math.floor(m)]} ${100 - (m % 1) * 100}%, ${SCALE[Math.min(3, Math.floor(m) + 1)]})`;
  };
  const counts = [0, 0, 0, 0];
  mastery.forEach(m => counts[m === 0 ? 0 : m < 1.5 ? 1 : m < 2.5 ? 2 : 3]++);

  return (
    <div className="mapview">
      <WorldMap ds={ds} className="full-map" fill={fill} tones={sel ? { [sel]: 'accent' } : {}}
        focus={sel ? { ids: [sel], key: sel } : null} onTap={h => h.countryId && setSel(h.countryId)} />
      <div className="legend">
        {['Not started', 'Learning', 'Known', 'Mastered'].map((l, i) => <span key={l}><i style={{ background: i ? SCALE[i] : 'var(--land)' }} />{l} {counts[i]}</span>)}
      </div>
      {sel && <CountrySheet ds={ds} id={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
