// Where a person is from, with the flag of the time: "born in Salzburg, Holy Roman Empire (Prince-Archbishopric of
// Salzburg) · today Austria" under the imperial banner. With no flag of the time (Chopin's Duchy of Warsaw, anyone
// ancient), today's country's flag; the country today always named, so the history never hides the map.
import { Flag } from './Picture';
import type { Dataset, Origin } from '../types';

export function OriginLine({ ds, o, name }: { ds: Dataset; o: Origin; name?: string }) {
  const today = o.todayId ? ds.byId.get(o.todayId) : undefined;
  const todayName = today?.name ?? o.today;
  const flag = o.flag ?? today?.flag ?? null;
  const then = o.then && o.then !== todayName ? o.then : null;
  return (
    <p className="origin-line" onClick={e => e.stopPropagation()}>
      {flag && <Flag file={flag} name={then ?? todayName ?? ''} size={80} />}
      <span>
        {name && <b>{name} </b>}
        {o.place ? `born in ${o.place}` : 'from'}{then ? `, ${then}` : !o.place && todayName ? ` ${todayName}` : ''}
        {o.state && <span className="muted"> ({o.state})</span>}
        {todayName && (then || o.place) && <span className="muted"> · today {todayName}</span>}
      </span>
    </p>
  );
}
