import { useState } from 'react';
import { GROUPS, groupsShownIn, nodeId, parseNode, placesIn, slotOf, groupById, LAYER_NOUN, childSections, sectionAndDescendants, SECTION_PARENT } from '../cards';
import { buildQueue, isUnlocked, learnMore, nodeStats, update, useProgress } from '../srs';
import { makeQuiz, type Scope } from '../quiz';
import { sounds } from '../sound';
import { Icon, type IconName } from '../components/Icons';
import type { QuizSpec } from '../components/Study';
import type { Dataset } from '../types';
import { COLLECTION_SUBJECTS } from '../collections';
import { GeoTime } from '../components/GeoTime';
import { SUBJECTS } from '../subjects';

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

const SECTION_ICON: Record<string, IconName> = { 'Oceans & Seas': 'wave', Rivers: 'river', Lakes: 'drop', China: 'map', 'United States': 'capitol', Territories: 'pin', 'World Heritage': 'temple', Mountains: 'mountain' };
const OPEN_KEY = 'geoquest:tree-open';
const secKey = (sec: string) => 'sec-' + sec.replace(/\W/g, '');

const SUBJECT_KEY = 'geoquest:subject';

export function Tree({ ds, startQuiz, startStudy, goDashboard }: { ds: Dataset; startQuiz: (q: QuizSpec) => void; startStudy: (nodes?: string[]) => void; goDashboard?: () => void }) {
  const p = useProgress();
  const [sel, setSel] = useState<string | null>(null);
  // Library → subject: which subject's tree is open (remembered per device; none = the Library itself).
  const [subjectId, setSubjectId] = useState<string | null>(() => { try { return localStorage.getItem(SUBJECT_KEY); } catch { return null; } });
  const openSubject = (id: string | null) => { setSubjectId(id); try { if (id) localStorage.setItem(SUBJECT_KEY, id); else localStorage.removeItem(SUBJECT_KEY); } catch { /* ignore */ } window.scrollTo({ top: 0 }); };
  const subject = SUBJECTS.find(s => s.id === subjectId) ?? null;
  // Which sections are expanded: remembered per device; by default the ones you're learning in (and their parents).
  const [open, setOpen] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem(OPEN_KEY); if (v) return new Set(JSON.parse(v)); } catch { /* ignore */ }
    const s = new Set<string>();
    for (const n of p.active) { let sec: string | undefined = groupById(parseNode(n).groupId)?.section; while (sec) { s.add(sec); sec = SECTION_PARENT[sec]; } }
    return s;
  });
  const setOpenSaved = (next: Set<string>) => { setOpen(next); try { localStorage.setItem(OPEN_KEY, JSON.stringify([...next])); } catch { /* ignore */ } };
  const toggleSection = (sec: string) => { const n = new Set(open); if (n.has(sec)) n.delete(sec); else n.add(sec); setOpenSaved(n); };
  const jump = (sec: string) => {
    if (!open.has(sec)) setOpenSaved(new Set([...open, sec]));
    setTimeout(() => document.getElementById(secKey(sec))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  };

  // Plain render functions (not components defined in a component), so React doesn't rebuild the tree on every update.
  const skill = (id: string, t: { id: string; name: string; icon: IconName }) => {
    const st = nodeStats(ds, p, id);
    const unlocked = isUnlocked(ds, p, id);
    const active = p.active.includes(id);
    const pct = st.total ? st.known / st.total : 0;
    const done = st.total > 0 && st.mastered === st.total;
    return (
      <button key={id} className={'skill' + (active ? ' active' : '') + (done ? ' done' : '') + (unlocked ? '' : ' locked')} onClick={() => setSel(id)}>
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
  };

  /** One section: its own groups, then the places inside it studied in depth (each a section of its own). */
  const section = (sec: string, depth: number): JSX.Element => {
    const groups = groupsShownIn(sec);
    const all = [...new Set(sectionAndDescendants(sec).flatMap(x => groupsShownIn(x)))];
    const nodes = all.flatMap(g => g.topics.map(t => nodeId(g.id, t.id)));
    const tot = nodes.reduce((a, n) => { const st = nodeStats(ds, p, n); return { known: a.known + st.known, total: a.total + st.total, due: a.due + st.due }; }, { known: 0, total: 0, due: 0 });
    const learning = nodes.filter(n => p.active.includes(n)).length;
    const base = groups.filter(g => g.layer === groups[0]?.layer).map(g => nodeId(g.id, g.topics[0].id)); // "Learn all states" means the states, not the rivers deck beside them
    const allOn = base.length > 0 && base.every(n => p.active.includes(n));
    const kids = childSections(sec);
    const geo = subject?.id === 'geography';
    // Geography sections start closed (there are many); note-deck sections start open (the set then lists closed ones).
    const isOpen = geo ? open.has(sec) : !open.has(sec);
    const bare = !geo && depth === 0; // a notes subject's own section: the page title already names it
    return (
      <section key={sec} id={secKey(sec)} className={(bare ? 'bare' : depth ? 'subsection' : 'continent') + (isOpen || bare ? ' open' : '')}>
        {!bare && <button className="section-row" onClick={() => toggleSection(sec)} aria-expanded={isOpen}>
          <span className="node-icon"><Icon name={SECTION_ICON[sec] ?? (!geo ? 'book' : depth ? 'map' : 'globe')} /></span>
          <span className="grow">
            <b>{sec}</b>
            <span className="section-sub">{all.length > 1 ? `${all.length} groups · ` : ''}{tot.known}/{tot.total} known{learning ? ` · ${learning} learning` : ''}{tot.due ? ` · ${tot.due} due` : ''}</span>
            <span className="mini-bar"><i style={{ width: `${(tot.known / Math.max(1, tot.total)) * 100}%` }} /></span>
          </span>
          <span className={'chev' + (isOpen ? ' up' : '')}>›</span>
        </button>}
        {(isOpen || bare) && <div className="section-body">
          {groups.length > 0 && <div className="section-actions">
            <button className="btn small" onClick={() => update(x => { x.active = allOn ? x.active.filter(a => !base.includes(a)) : [...new Set([...x.active, ...base])]; })}>
              {allOn ? 'Stop all' : `Learn all ${groups[0].topics[0].name.toLowerCase()}`}
            </button>
            <button className="btn small" onClick={() => startQuiz(makeQuiz(ds, (groups.length > 1 ? `sec:${sec}` : `grp:${groups[0].id}`) as Scope, [groups[0].topics[0].id], 25))}>
              <Icon name="target" size={15} /> Quiz
            </button>
          </div>}
          {groups[0]?.note && <p className="muted small">{groups[0].note}</p>}
          {groups.length > 0 && <div className="groups">
            {groups.map(g => (
              <div key={g.id} className="group">
                <div className="group-head"><b>{g.name}</b><small>{placesIn(ds, g.id).length} {g.nouns ?? LAYER_NOUN[g.layer]}</small></div>
                <div className="skills">{g.topics.filter(t => nodeStats(ds, p, nodeId(g.id, t.id)).total > 0).map(t => skill(nodeId(g.id, t.id), t))}</div>
              </div>
            ))}
          </div>}
          {kids.length > 0 && <div className="in-depth">
            <h4 className="muted small">{geo ? 'In depth' : 'Topics'}</h4>
            {kids.map(k => section(k, depth + 1))}
          </div>}
        </div>}
      </section>
    );
  };

  const statsOf = (secs: string[]) => {
    const nodes = secs.flatMap(sectionAndDescendants).flatMap(x => GROUPS.filter(g => g.section === x)).flatMap(g => g.topics.map(t => nodeId(g.id, t.id)));
    return nodes.reduce((a, n) => { const st = nodeStats(ds, p, n); return { known: a.known + st.known, total: a.total + st.total, due: a.due + st.due, learning: a.learning + (p.active.includes(n) ? 1 : 0) }; }, { known: 0, total: 0, due: 0, learning: 0 });
  };

  if (!subject) return (
    <div className="tree library">
      <h1>Library</h1>
      <p className="muted">Everything you're learning, by subject. Reviews from all of them come together on <b>Today</b>.</p>
      <div className="subject-cards">
        {SUBJECTS.map(sub => {
          const st = statsOf(sub.sections());
          return (
            <button key={sub.id} className="subject-card" onClick={() => openSubject(sub.id)}>
              <span className="node-icon big"><Icon name={sub.icon} size={26} /></span>
              <b>{sub.name}</b>
              <small className="muted">{sub.blurb}</small>
              <span className="subject-stats">{st.known}/{st.total} known{st.learning ? ` · ${st.learning} learning` : ''}{st.due ? ` · ${st.due} due` : ''}</span>
              <span className="mini-bar"><i style={{ width: `${(st.known / Math.max(1, st.total)) * 100}%` }} /></span>
            </button>
          );
        })}
        {goDashboard && <button className="subject-card dash" onClick={goDashboard}>
          <span className="node-icon big"><Icon name="chart" size={26} /></span>
          <b>Dashboard</b>
          <small className="muted">Markets, rates, inflation and the world's biggest economies, refreshed every night</small>
        </button>}
      </div>
      <p className="muted small">New subjects come from note decks (plain files in <code>geo-quest/decks/</code>) and collections (lists in <code>geo-quest/collections/</code>); each folder has a README.</p>
      {sel && <NodeSheet ds={ds} node={sel} onClose={() => setSel(null)} startQuiz={q => { setSel(null); startQuiz(q); }} startStudy={n => { setSel(null); startStudy(n); }} />}
    </div>
  );

  const top = subject.sections();
  const isGeo = subject.id === 'geography';
  return (
    <div className="tree">
      <button className="crumb back" onClick={() => openSubject(null)}>‹ Library</button>
      <h1>{subject.name}</h1>
      {isGeo
        ? <p className="muted">Tap a skill to start learning it, practise it, or learn more today. <b>Capitals</b> and <b>Flags</b> unlock once you know half of a region's places{p.settings.locks ? '' : ' (locks are currently off)'}. Countries and states you can study in depth sit inside their continent, under <b>In depth</b>.</p>
        : <p className="muted">Tap a deck to start learning it. {subject.name === 'Earth history' ? <>The cards are made from the same data as the chart (<code>src/geotime.ts</code>), so they always agree.</> : COLLECTION_SUBJECTS.includes(subject.name) ? <>Each deck is a list in <code>geo-quest/collections/{subject.name}/</code>; add a work by its Wikipedia title and the facts and picture are filled in from Wikidata.</> : <>These cards come from the note files in <code>geo-quest/decks/{subject.name}/</code>.</>}</p>}
      {subject.name === 'Earth history' && <GeoTime />}
      {top.length > 1 && <nav className="jumpbar">
        {top.map(sec => <button key={sec} className={'pick' + (open.has(sec) ? ' on' : '')} onClick={() => jump(sec)}><Icon name={SECTION_ICON[sec] ?? 'globe'} size={14} />{sec}</button>)}
      </nav>}
      {top.map(sec => section(sec, 0))}
      {sel && <NodeSheet ds={ds} node={sel} onClose={() => setSel(null)} startQuiz={q => { setSel(null); startQuiz(q); }} startStudy={n => { setSel(null); startStudy(n); }} />}
    </div>
  );
}
