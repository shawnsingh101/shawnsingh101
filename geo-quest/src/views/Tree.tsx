import { useState } from 'react';
import { GROUPS, nodeId, parseNode, placesIn, SECTIONS, slotOf, groupById, LAYER_NOUN } from '../cards';
import { buildQueue, isUnlocked, learnMore, nodeStats, update, useProgress } from '../srs';
import { makeQuiz, type Scope } from '../quiz';
import { sounds } from '../sound';
import { Icon, type IconName } from '../components/Icons';
import type { QuizSpec } from '../components/Study';
import type { Dataset } from '../types';

function NodeSheet({ ds, node, onClose, startQuiz, startStudy }: { ds: Dataset; node: string; onClose: () => void; startQuiz: (q: QuizSpec) => void; startStudy: (nodes?: string[]) => void }) {
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
      {!unlocked && <p className="note"><Icon name="lock" size={15} /> {g.requires ? `Know half of “${groupById(parseNode(g.requires).groupId).name}” to unlock this` : `Know half of ${g.name}'s ${g.topics[0].name.toLowerCase()} to unlock this`} (or turn skill locks off in the ribbon). You can still practise it as a quiz.</p>}
      <div className="sheet-actions">
        {unlocked && !active && <button className="btn primary" onClick={() => { toggle(); startStudy([node]); }}><Icon name="play" /> Start learning</button>}
        {active && (s.due > 0 || buildQueue(ds, p, [node]).fresh.length > 0) && <button className="btn primary" onClick={() => startStudy([node])}><Icon name="play" /> Study now</button>}
        {active && s.started < s.total && <button className="btn" onClick={() => { learnMore(10); startStudy([node]); }}><Icon name="plus" /> Learn 10 more now</button>}
        <button className="btn" onClick={() => startQuiz(makeQuiz(ds, `grp:${groupId}`, [topic], 'all'))}><Icon name="target" /> Practice quiz</button>
        {unlocked && active && <button className="btn ghost" onClick={toggle}>Stop learning</button>}
      </div>
    </div>
  );
}

const SECTION_ICON: Record<string, IconName> = { 'Oceans & Seas': 'wave', Rivers: 'river', Lakes: 'drop', China: 'map' };
const OPEN_KEY = 'geoquest:tree-open';

export function Tree({ ds, startQuiz, startStudy }: { ds: Dataset; startQuiz: (q: QuizSpec) => void; startStudy: (nodes?: string[]) => void }) {
  const p = useProgress();
  const [sel, setSel] = useState<string | null>(null);
  // Which sections are expanded: remembered per device; by default the ones you're learning.
  const [open, setOpen] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem(OPEN_KEY); if (v) return new Set(JSON.parse(v)); } catch { /* ignore */ }
    return new Set(SECTIONS.filter(sec => p.active.some(n => groupById(parseNode(n).groupId).section === sec)));
  });
  const setOpenSaved = (next: Set<string>) => { setOpen(next); try { localStorage.setItem(OPEN_KEY, JSON.stringify([...next])); } catch { /* ignore */ } };
  const toggleSection = (sec: string) => { const n = new Set(open); if (n.has(sec)) n.delete(sec); else n.add(sec); setOpenSaved(n); };
  const jump = (sec: string) => {
    if (!open.has(sec)) setOpenSaved(new Set([...open, sec]));
    setTimeout(() => document.getElementById('sec-' + sec.replace(/\W/g, ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  };

  return (
    <div className="tree">
      <h1>Skill tree</h1>
      <p className="muted">Tap a skill to start learning it, practise it, or learn more today. <b>Capitals</b> and <b>Flags</b> unlock once you know half of a region's places{p.settings.locks ? '' : ' (locks are currently off)'}.</p>
      <nav className="jumpbar">
        {SECTIONS.map(sec => <button key={sec} className={'pick' + (open.has(sec) ? ' on' : '')} onClick={() => jump(sec)}><Icon name={SECTION_ICON[sec] ?? 'globe'} size={14} />{sec}</button>)}
      </nav>
      {SECTIONS.map(sec => {
        const groups = GROUPS.filter(g => g.section === sec);
        const base = groups.map(g => nodeId(g.id, g.topics[0].id));
        const allOn = base.every(n => p.active.includes(n));
        const nodes = groups.flatMap(g => g.topics.map(t => nodeId(g.id, t.id)));
        const tot = nodes.reduce((a, n) => { const st = nodeStats(ds, p, n); return { known: a.known + st.known, total: a.total + st.total, due: a.due + st.due }; }, { known: 0, total: 0, due: 0 });
        const learning = nodes.filter(n => p.active.includes(n)).length;
        const isOpen = open.has(sec);
        return (
          <section key={sec} id={'sec-' + sec.replace(/\W/g, '')} className={'continent' + (isOpen ? ' open' : '')}>
            <button className="section-row" onClick={() => toggleSection(sec)} aria-expanded={isOpen}>
              <span className="node-icon"><Icon name={SECTION_ICON[sec] ?? 'globe'} /></span>
              <span className="grow">
                <b>{sec}</b>
                <span className="section-sub">{groups.length > 1 ? `${groups.length} groups · ` : ''}{tot.known}/{tot.total} known{learning ? ` · ${learning} learning` : ''}{tot.due ? ` · ${tot.due} due` : ''}</span>
                <span className="mini-bar"><i style={{ width: `${(tot.known / Math.max(1, tot.total)) * 100}%` }} /></span>
              </span>
              <span className={'chev' + (isOpen ? ' up' : '')}>›</span>
            </button>
            {isOpen && <div className="section-body">
              <div className="section-actions">
                <button className="btn small" onClick={() => update(x => { x.active = allOn ? x.active.filter(a => !base.includes(a)) : [...new Set([...x.active, ...base])]; })}>
                  {allOn ? 'Stop all' : `Learn all ${groups[0].topics[0].name.toLowerCase()}`}
                </button>
                <button className="btn small" onClick={() => startQuiz(makeQuiz(ds, (groups.length > 1 ? `sec:${sec}` : `grp:${groups[0].id}`) as Scope, [groups[0].topics[0].id], 25))}>
                  <Icon name="target" size={15} /> Quiz
                </button>
              </div>
              {groups[0].note && <p className="muted small">{groups[0].note}</p>}
              <div className="groups">
                {groups.map(g => (
                  <div key={g.id} className="group">
                    <div className="group-head"><b>{g.name}</b><small>{placesIn(ds, g.id).length} {LAYER_NOUN[g.layer]}</small></div>
                    <div className="skills">
                      {g.topics.map(t => {
                        const id = nodeId(g.id, t.id);
                        const st = nodeStats(ds, p, id);
                        const unlocked = isUnlocked(ds, p, id);
                        const active = p.active.includes(id);
                        const pct = st.total ? st.known / st.total : 0;
                        const done = st.total > 0 && st.mastered === st.total;
                        return (
                          <button key={t.id} className={'skill' + (active ? ' active' : '') + (done ? ' done' : '') + (unlocked ? '' : ' locked')} onClick={() => setSel(id)}>
                            <span className="ring-wrap">
                              <svg viewBox="0 0 36 36" className="ring"><circle cx="18" cy="18" r="15" className="track" /><circle cx="18" cy="18" r="15" className="val" style={{ strokeDasharray: `${pct * 94.2} 94.2` }} /></svg>
                              <Icon name={unlocked ? t.icon : 'lock'} size={15} />
                            </span>
                            <span className="label">{t.name}</span>
                            <span className="skill-meta">
                              {active && <i className="learning-dot" title="Learning" />}
                              {st.due > 0 && <b className="due-pill">{st.due} due</b>}
                              <small>{st.known}/{st.total}</small>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>}
          </section>
        );
      })}
      {sel && <NodeSheet ds={ds} node={sel} onClose={() => setSel(null)} startQuiz={q => { setSel(null); startQuiz(q); }} startStudy={n => { setSel(null); startStudy(n); }} />}
    </div>
  );
}
