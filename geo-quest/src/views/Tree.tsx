import { useState } from 'react';
import { GROUPS, nodeId, parseNode, placesIn, SECTIONS, slotOf, groupById } from '../cards';
import { isUnlocked, learnMore, nodeStats, update, useProgress } from '../srs';
import { makeQuiz, type Scope } from '../quiz';
import { sounds } from '../sound';
import { Icon } from '../components/Icons';
import type { QuizSpec } from '../components/Study';
import type { Dataset } from '../types';

function NodeSheet({ ds, node, onClose, startQuiz, startStudy }: { ds: Dataset; node: string; onClose: () => void; startQuiz: (q: QuizSpec) => void; startStudy: () => void }) {
  const p = useProgress();
  const { groupId, topic } = parseNode(node);
  const g = groupById(groupId);
  const slot = slotOf(node);
  const s = nodeStats(ds, p, node);
  const active = p.active.includes(node);
  const unlocked = isUnlocked(ds, p, node);
  const toggle = () => {
    update(x => { x.active = x.active.includes(node) ? x.active.filter(a => a !== node) : [...x.active, node]; });
    if (p.settings.sound && !active) sounds.level();
  };
  return (
    <div className="sheet" role="dialog">
      <button className="btn ghost close icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
      <div className="node-head"><span className="node-icon"><Icon name={slot.icon} size={22} /></span><div><h2>{g.name}</h2><p className="muted">{slot.name}</p></div></div>
      <div className="node-stats">
        <div><b>{s.started}</b><span>started</span></div>
        <div><b>{s.known}</b><span>known</span></div>
        <div><b>{s.mastered}</b><span>mastered</span></div>
        <div><b>{s.due}</b><span>due</span></div>
      </div>
      <div className="mini-bar"><i style={{ width: `${(s.known / s.total) * 100}%` }} /><em style={{ width: `${(s.mastered / s.total) * 100}%` }} /></div>
      <p className="muted small">{s.total} cards · {placesIn(ds, groupId).map(c => c.name).join(' · ')}</p>
      {!unlocked && <p className="note"><Icon name="lock" size={15} /> Know half of {g.name}'s {g.topics[0].name.toLowerCase()} to unlock this (or turn skill locks off in the ribbon). You can still practise it as a quiz.</p>}
      <div className="sheet-actions">
        {unlocked && <button className={'btn' + (active ? '' : ' primary')} onClick={toggle}>{active ? 'Stop learning' : 'Start learning'}</button>}
        {active && s.started < s.total && <button className="btn" onClick={() => { learnMore(10); startStudy(); }}><Icon name="plus" /> Learn 10 more now</button>}
        <button className="btn" onClick={() => startQuiz(makeQuiz(ds, `grp:${groupId}`, [topic], 'all'))}><Icon name="target" /> Practice quiz</button>
      </div>
    </div>
  );
}

export function Tree({ ds, startQuiz, startStudy }: { ds: Dataset; startQuiz: (q: QuizSpec) => void; startStudy: () => void }) {
  const p = useProgress();
  const [sel, setSel] = useState<string | null>(null);

  return (
    <div className="tree">
      <h1>Skill tree</h1>
      <p className="muted">Tap a skill to start learning it, practise it, or learn more today. <b>Capitals</b> and <b>Flags</b> unlock once you know half of a region's places{p.settings.locks ? '' : ' (locks are currently off)'}.</p>
      {SECTIONS.map(sec => {
        const groups = GROUPS.filter(g => g.section === sec);
        const base = groups.map(g => nodeId(g.id, g.topics[0].id));
        const allOn = base.every(n => p.active.includes(n));
        return (
          <section key={sec} className="continent">
            <div className="section-head">
              <h2>{sec}</h2>
              <div className="section-actions">
                <button className="btn small" onClick={() => update(x => { x.active = allOn ? x.active.filter(a => !base.includes(a)) : [...new Set([...x.active, ...base])]; })}>
                  {allOn ? 'Stop all' : `Learn all ${groups[0].topics[0].name.toLowerCase()}`}
                </button>
                <button className="btn small" onClick={() => startQuiz(makeQuiz(ds, (groups.length > 1 ? `sec:${sec}` : `grp:${groups[0].id}`) as Scope, [groups[0].topics[0].id], 25))}>
                  <Icon name="target" size={15} /> Quiz
                </button>
              </div>
            </div>
            {groups[0].note && <p className="muted small">{groups[0].note}</p>}
            <div className="groups">
              {groups.map(g => (
                <div key={g.id} className="group">
                  <div className="group-head"><b>{g.name}</b><small>{placesIn(ds, g.id).length} {g.layer === 'water' ? 'waters' : g.layer === 'cn' ? 'divisions' : 'countries'}</small></div>
                  <div className={'branch n' + g.topics.length}>
                    {g.topics.map(t => {
                      const id = nodeId(g.id, t.id);
                      const s = nodeStats(ds, p, id);
                      const unlocked = isUnlocked(ds, p, id);
                      const active = p.active.includes(id);
                      const pct = s.total ? s.known / s.total : 0;
                      const done = s.total > 0 && s.mastered === s.total;
                      return (
                        <button key={t.id} className={'skill' + (active ? ' active' : '') + (done ? ' done' : '') + (unlocked ? '' : ' locked')} onClick={() => setSel(id)}>
                          <svg viewBox="0 0 36 36" className="ring"><circle cx="18" cy="18" r="15" className="track" /><circle cx="18" cy="18" r="15" className="val" style={{ strokeDasharray: `${pct * 94.2} 94.2` }} /></svg>
                          <span className="skill-icon"><Icon name={unlocked ? t.icon : 'lock'} size={20} /></span>
                          <span className="label">{t.name}</span>
                          <small>{s.known}/{s.total}{s.due ? ` · ${s.due} due` : ''}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {sel && <NodeSheet ds={ds} node={sel} onClose={() => setSel(null)} startQuiz={q => { setSel(null); startQuiz(q); }} startStudy={() => { setSel(null); startStudy(); }} />}
    </div>
  );
}
