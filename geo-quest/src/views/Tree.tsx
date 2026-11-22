import { useState } from 'react';
import { CONTINENTS, GROUPS, nodeId, TOPICS, countriesIn } from '../cards';
import { isUnlocked, nodeStats, update, useProgress } from '../srs';
import { sounds } from '../sound';
import type { Dataset } from '../types';

export function Tree({ ds }: { ds: Dataset }) {
  const p = useProgress();
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (n: string) => {
    update(x => { x.active = x.active.includes(n) ? x.active.filter(a => a !== n) : [...x.active, n]; });
    if (p.settings.sound && !p.active.includes(n)) sounds.level();
  };

  return (
    <div className="tree">
      <h1>Skill tree</h1>
      <p className="muted">Each region has three branches. <b>Countries</b> is always open; <b>Capitals</b> and <b>Flags</b> unlock once you know half of a region's countries{p.settings.locks ? '' : ' (locks are off in the ribbon)'}. Tap a skill to start or stop learning it.</p>
      {CONTINENTS.map(cont => (
        <section key={cont} className="continent">
          <h2>{cont}</h2>
          <div className="groups">
            {GROUPS.filter(g => g.continent === cont).map(g => {
              const n = countriesIn(ds, g.id).length;
              return (
                <div key={g.id} className="group">
                  <div className="group-head" onClick={() => setOpen(open === g.id ? null : g.id)}>
                    <b>{g.name}</b><small>{n} countries</small>
                  </div>
                  <div className="branch">
                    {TOPICS.map(t => {
                      const id = nodeId(g.id, t.id);
                      const s = nodeStats(ds, p, id);
                      const unlocked = isUnlocked(ds, p, id);
                      const active = p.active.includes(id);
                      const pct = s.total ? s.known / s.total : 0;
                      const done = s.total > 0 && s.mastered === s.total;
                      return (
                        <button key={t.id} disabled={!unlocked}
                          className={'skill' + (active ? ' active' : '') + (done ? ' done' : '') + (unlocked ? '' : ' locked')}
                          onClick={() => toggle(id)} title={unlocked ? '' : `Know half of ${g.name}'s countries to unlock`}>
                          <svg viewBox="0 0 36 36" className="ring"><circle cx="18" cy="18" r="15" className="track" /><circle cx="18" cy="18" r="15" className="val" style={{ strokeDasharray: `${pct * 94.2} 94.2` }} /></svg>
                          <span className="icon">{unlocked ? t.icon : '🔒'}</span>
                          <span className="label">{t.name}</span>
                          <small>{s.known}/{s.total}{s.due ? ` · ${s.due} due` : ''}</small>
                        </button>
                      );
                    })}
                  </div>
                  {open === g.id && <p className="group-list">{countriesIn(ds, g.id).map(c => c.name).join(' · ')}</p>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
