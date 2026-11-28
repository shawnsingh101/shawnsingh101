// Membership map cards (src/memberships.ts). "[members: NATO]": the question names the group and the world waits blank;
// the flip lights every member and flies to them, with the count and a note. "[whose: NATO]": the members are lit
// from the start and the question is whose they are.
import { useMemo } from 'react';
import type { Dataset } from '../types';
import { membership } from '../memberships';
import { WorldMap } from './WorldMap';

export function MemberMap({ ds, code, whose, revealed }: { ds: Dataset; code: string; whose: boolean; revealed: boolean }) {
  const m = membership(code);
  const ids = useMemo(() => {
    const idOf = new Map(ds.countries.filter(c => c.iso3).map(c => [c.iso3!, c.id]));
    return (m?.iso3 ?? []).map(i => idOf.get(i)).filter((x): x is string => !!x);
  }, [ds, m]);
  if (!m || !ids.length) return null;
  const lit = whose || revealed;
  const set = new Set(ids);
  const fill = (id: string) => (lit && set.has(id) ? m.color : undefined);
  return (
    <div className="bureau-map member-map" onClick={e => revealed && e.stopPropagation()}>
      <WorldMap ds={ds} className="bureau-world" fill={fill} focus={lit ? { ids, key: code + (revealed ? ':r' : ''), pad: 0.8 } : null} />
      {revealed && <p className="member-note"><i style={{ background: m.color }} /><span><b>{whose ? `${m.iso3.length} members` : m.name}</b>{m.note ? ` · ${m.note}` : ''}</span></p>}
    </div>
  );
}
