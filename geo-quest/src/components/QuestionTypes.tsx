import { DIRECTIONS, KIND_SHORT, type Kind } from '../cards';
import { update, useProgress } from '../srs';
import { Icon } from './Icons';

/** Switch question directions (and individual card types) on or off. Off cards simply wait. */
export function QuestionTypes() {
  const p = useProgress();
  const off = new Set(p.settings.kindsOff);
  const set = (kinds: Kind[], on: boolean) => update(x => {
    const s = new Set(x.settings.kindsOff);
    for (const k of kinds) { if (on) s.delete(k); else s.add(k); }
    x.settings.kindsOff = [...s];
  });
  const allOff = DIRECTIONS.every(d => d.kinds.every(k => off.has(k)));
  return (
    <div className="qtypes">
      {DIRECTIONS.map(d => {
        const onCount = d.kinds.filter(k => !off.has(k)).length;
        const state = onCount === d.kinds.length ? 'on' : onCount ? 'some' : 'off';
        return (
          <div key={d.id} className={'qdir ' + state}>
            <button className="qdir-head" onClick={() => set(d.kinds, state !== 'on')} aria-pressed={state === 'on'}>
              <span className="box">{state === 'on' ? <Icon name="check" size={13} /> : state === 'some' ? '–' : ''}</span>
              <span><b>{d.name}</b><small>{d.hint}</small></span>
            </button>
            <div className="qkinds">
              {d.kinds.map(k => (
                <button key={k} className={'pick' + (off.has(k) ? '' : ' on')} onClick={() => set([k], off.has(k))}>{KIND_SHORT[k]}</button>
              ))}
            </div>
          </div>
        );
      })}
      {allOff && <p className="note">Everything is switched off — turn a type back on to study.</p>}
      <p className="muted small">Switched-off cards keep their place in your schedule and come back when you turn them on. Applies to study sessions and quizzes.</p>
    </div>
  );
}
