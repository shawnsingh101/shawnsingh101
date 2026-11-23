// Settings → Sound lab: listen to the alternatives for each kind of sound and pick the one you like.
import { ROLES, preview, unlockAudio, type Role } from '../sound';
import { update, useProgress } from '../srs';
import { Icon } from './Icons';

const label = (file: string) => file.replace(/^lab\/(ui-)?/, '').replace(/_0*(\d+)$/, ' $1').replace(/(\D)(\d+)$/, '$1 $2').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

export function SoundLab() {
  const sfx = useProgress().settings.sfx ?? {};
  const pick = (role: Role, file: string | null) => {
    unlockAudio(); preview(role, file);
    update(x => { const next = { ...(x.settings.sfx ?? {}) }; if (file) next[role] = file; else delete next[role]; x.settings.sfx = next; });
  };
  return (
    <div className="sound-lab">
      <p className="muted small">Tap a sound to hear it; the one you tap last is used. All are free (CC0) sounds by Kenney.</p>
      {ROLES.map(r => (
        <div key={r.id} className="lab-row">
          <span className="lab-role"><b>{r.name}</b><small className="muted">{r.when}</small></span>
          <div className="lab-options">
            {[null, ...r.options].map(f => {
              const on = (sfx[r.id] ?? null) === f;
              return <button key={f ?? 'default'} data-sfx="none" className={'chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => pick(r.id, f)}>
                <Icon name="play" size={11} />{f ? label(f) : 'default'}</button>;
            })}
          </div>
        </div>
      ))}
      {Object.keys(sfx).length > 0 && <button className="btn small" onClick={() => update(x => { x.settings.sfx = {}; })}>Back to the defaults</button>}
    </div>
  );
}
