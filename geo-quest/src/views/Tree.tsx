import { useState } from 'react';
import { GROUPS, groupsShownIn, nodeId, parseNode, placesIn, slotOf, groupById, LAYER_NOUN, childSections, sectionAndDescendants, SECTION_PARENT, sectionChain } from '../cards';
import { DECKS, ERAS, NOTE_SUBJECTS, LIVE, EQUATIONS, deckText, repoPath, type Deck } from '../notes';
import { Builder } from '../components/Builder';
import { Popup } from '../components/Settings';
import { TokenSetup } from '../components/EditCard';
import { getToken, proposeChange, type Sent } from '../github';
import { buildQueue, isUnlocked, learnMore, nodeStats, reloadApp, removeDeviceDecks, update, useProgress } from '../srs';
import { makeQuiz, scopeGroups, type Scope } from '../quiz';
import { sounds } from '../sound';
import { Icon, type IconName } from '../components/Icons';
import type { QuizSpec } from '../components/Study';
import type { Dataset } from '../types';
import { COLLECTION_SUBJECTS } from '../collections';
import { GeoTime } from '../components/GeoTime';
import { SUBJECTS, isGeography } from '../subjects';
import { Search } from '../components/Search';
import { LessonReader } from '../components/Lesson';
import { Rich } from '../components/Code';
import { EquationPanel } from '../components/EquationDef';
import { equationDef } from '../equations';
import type { CardRef } from '../cards';

function NodeSheet({ ds, node, onClose, startQuiz, startStudy }: { ds: Dataset; node: string; onClose: () => void; startQuiz: (q: QuizSpec) => void; startStudy: (nodes?: string[]) => void }) {
  const p = useProgress();
  const { groupId, topic } = parseNode(node);
  const g = groupById(groupId);
  const slot = slotOf(node);
  const s = nodeStats(ds, p, node);
  const active = p.active.includes(node);
  const unlocked = isUnlocked(ds, p, node);
  const [reading, setReading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const deck = groupId.startsWith('n-') ? DECKS.find(d => 'n-' + d.id === groupId) : undefined;
  const toggle = () => {
    update(x => { x.active = x.active.includes(node) ? x.active.filter(a => a !== node) : [...x.active, node]; });
    if (p.settings.sound && !active) sounds.level();
  };
  const study = () => { if (!active) toggle(); else if (!s.due && !buildQueue(ds, p, [node]).fresh.length && s.started < s.total) learnMore(10); startStudy([node]); };
  return (
    <div className="sheet" role="dialog">
      {reading && g.lesson && <LessonReader title={g.name} text={g.lesson} secplus={g.secplus} onClose={() => setReading(false)} onStudy={unlocked ? study : undefined} />}
      <button className="btn ghost close icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
      <div className="node-head"><span className="node-icon"><Icon name={slot.icon} size={22} /></span><div><h2>{g.name}</h2><p className="muted">{slot.name}</p></div></div>
      <div className="node-stats">
        <div><b>{s.started}</b><span>started</span></div>
        <div><b>{s.known}</b><span>known</span></div>
        <div><b>{s.mastered}</b><span>mastered</span></div>
        <div><b>{s.due}</b><span>due</span></div>
      </div>
      <div className="mini-bar"><i style={{ width: `${(s.known / s.total) * 100}%` }} /><em style={{ width: `${(s.mastered / s.total) * 100}%` }} /></div>
      <p className="muted small">{s.total} cards · {[...new Set(placesIn(ds, groupId).map(c => c.name))].join(' · ')}</p>
      {!unlocked && <p className="note"><Icon name="lock" size={15} /> {g.requires ? `Know half of “${groupById(parseNode(g.requires).groupId).name}” to unlock this` : `Know half of ${g.name}'s ${g.topics[0].name.toLowerCase()} to unlock this`} (or turn skill locks off in Settings). You can still practise it as a quiz.</p>}
      <div className="sheet-actions">
        {/* Two verbs everywhere: Study (adds the deck and starts; if nothing is waiting, it brings in new cards) and Quiz. */}
        {/* A deck with a lesson: read it first (it's the primary button until you've started the cards). */}
        {g.lesson && <button className={'btn' + (s.started ? '' : ' primary')} onClick={() => setReading(true)}><Icon name="book" /> Read the lesson</button>}
        {unlocked && <button className={'btn' + (g.lesson && !s.started ? '' : ' primary')} onClick={study}><Icon name="play" /> Study</button>}
        <button className="btn" onClick={() => startQuiz(makeQuiz(ds, `grp:${groupId}`, [topic], 'all'))}><Icon name="target" /> Quiz</button>
        {unlocked && active && <button className="btn ghost" onClick={toggle}>Stop learning</button>}
      </div>
      {deck && deckText(deck) !== null && <div className="sheet-actions">
        <button className="btn small" onClick={() => setBuilding(true)}><Icon name="plus" size={15} /> Add cards</button>
        {deck.device && <button className="btn small" onClick={() => setPublishing(true)}><Icon name="save" size={15} /> Publish to GitHub</button>}
        {deck.device && <button className="btn small ghost" onClick={() => { if (confirm(`Delete “${deck.title}” from this device? Its cards and your progress on them go too. (A backup made earlier still has it.)`)) { removeDeviceDecks([deck.file]); reloadApp(); } }}>Delete</button>}
      </div>}
      {deck?.device && <p className="muted small"><Icon name="lock" size={14} /> Kept on this device only, and in your backups.</p>}
      {building && deck && <Builder deckId={deck.id} onClose={() => setBuilding(false)} />}
      {publishing && deck && <Publish deck={deck} onClose={() => setPublishing(false)} />}
      {/* An equation's page (Equations › …): its formula, symbols and worked example. */}
      {groupId.startsWith('eq-') && equationDef(g.name) ? <EquationPanel def={equationDef(g.name)!} showFormula /> : <>
      {/* A deck's intro: one line for most decks; for a book's notes, its summary page (read any time, never reviewed). */}
      {g.note && (g.note.includes('\n')
        ? <details className="deck-summary" open><summary>Summary</summary>{g.note.split('\n').map((l, i) => <p key={i}>{l}</p>)}</details>
        : <p className="muted small"><Rich before={g.note} /></p>)}</>}
    </div>
  );
}

/** Publish a device deck: it goes to GitHub as a new deck file. Once merged, the repo's copy takes over (same cards,
 *  same progress) and this device's copy is removed. */
function Publish({ deck, onClose }: { deck: Deck; onClose: () => void }) {
  const [tokenOk, setTokenOk] = useState(!!getToken());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent | null>(null);
  const go = async () => {
    setBusy(true); setErr(null);
    try {
      const text = deckText(deck)!;
      setSent(await proposeChange({ path: repoPath(deck.file), title: `New deck: ${deck.subject} › ${deck.title}`,
        body: `**File:** \`${repoPath(deck.file)}\`\n\nA deck made in Intelligence Quest and kept on one device, now published (${deck.cards.length} cards). Progress carries over: the card ids are the same.\n\n_The audit runs on this pull request; merge it when it passes._`,
        apply: current => { if (current !== null) throw new Error('A deck file with this name is already on GitHub.'); return text; } }));
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <Popup title="Publish to GitHub" onClose={onClose}>
      {sent ? <div className="edit-sent">
        <p><Icon name="check" size={18} /> Sent as pull request <a href={sent.url} target="_blank" rel="noreferrer">#{sent.number}</a>.</p>
        <p className="muted small">Merge it when the check is green. A few minutes later the deck comes from GitHub, and this device's copy is removed by itself; your progress stays.</p>
        <button className="btn primary" onClick={onClose}>Done</button>
      </div> : <>
        <p>“{deck.title}” ({deck.cards.length} cards) goes to GitHub as a new deck, as a pull request for you to merge. Then it's on every device and can be improved like any other deck.</p>
        <p className="muted small">The repository is public: once merged, anyone can see these cards.</p>
        {!tokenOk ? <TokenSetup onDone={() => setTokenOk(true)} /> : <div className="row edit-actions"><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy} onClick={go}>{busy ? 'Sending…' : 'Publish'}</button></div>}
        {err && <p className="token-err">{err}</p>}
      </>}
    </Popup>
  );
}

/** "3 works", "1 work", "1 country" */
const countOf = (n: number, plural: string) => `${n} ${n !== 1 ? plural : plural.replace(/ies$/, 'y').replace(/(ches|shes|sses|xes)$/, m => m.slice(0, -2)).replace(/([^s])s$/, '$1')}`;
const SECTION_ICON: Record<string, IconName> = { 'Oceans & Seas': 'wave', Rivers: 'river', Lakes: 'drop', China: 'map', 'United States': 'capitol', Territories: 'pin', 'World Heritage': 'temple', Mountains: 'mountain', Deserts: 'sun', 'Physical geography': 'mountain', 'Interstate Highways': 'road' };
const OPEN_KEY = 'geoquest:tree-open2'; // v2: the set holds sections flipped from their default (see section())
const secKey = (sec: string) => 'sec-' + sec.replace(/\W/g, '');

const SUBJECT_KEY = 'geoquest:subject';

export function Tree({ ds, startQuiz, startStudy, startCards, goDashboard }: { ds: Dataset; startQuiz: (q: QuizSpec) => void; startStudy: (nodes?: string[]) => void; startCards: (cards: CardRef[]) => void; goDashboard?: () => void }) {
  const p = useProgress();
  const [builder, setBuilder] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  // Library → subject: which subject's tree is open (remembered per device; none = the Library itself).
  const [subjectId, setSubjectId] = useState<string | null>(() => { try { return localStorage.getItem(SUBJECT_KEY); } catch { return null; } });
  const openSubject = (id: string | null) => { setSubjectId(id); try { if (id) localStorage.setItem(SUBJECT_KEY, id); else localStorage.removeItem(SUBJECT_KEY); } catch { /* ignore */ } window.scrollTo({ top: 0 }); };
  const subject = SUBJECTS.find(s => s.id === subjectId) ?? null;
  // Which sections are expanded: remembered per device; by default the ones you're learning in (and their parents).
  const [open, setOpen] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem(OPEN_KEY); if (v) return new Set(JSON.parse(v)); } catch { /* ignore */ }
    const s = new Set<string>();
    for (const n of p.active) { let sec: string | undefined = groupById(parseNode(n).groupId)?.section; while (sec) { if (isGeography(sec)) s.add(sec); sec = SECTION_PARENT[sec]; } }
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

  /** A deck with one skill (every note deck and collection): one row, not a box with a single button inside. */
  const deckRow = (g: (typeof GROUPS)[number], sec: string, from?: string) => {
    const id = nodeId(g.id, g.topics[0].id), st = nodeStats(ds, p, id), active = p.active.includes(id), locked = !isUnlocked(ds, p, id);
    const elsewhere = from ?? (g.section !== sec ? sectionChain(g.section)[1] ?? g.section : null);
    return (
      <button key={g.id} className={'deck-row' + (active ? ' active' : '') + (locked ? ' locked' : '')} onClick={() => setSel(id)} title={locked ? 'Unlocks once you know half of the deck before it' : undefined}>
        <span className="ring-wrap">
          <svg viewBox="0 0 36 36" className="ring"><circle cx="18" cy="18" r="15" className="track" /><circle cx="18" cy="18" r="15" className="val" style={{ strokeDasharray: `${(st.total ? st.known / st.total : 0) * 94.2} 94.2` }} /></svg>
          <Icon name={locked ? 'lock' : g.topics[0].icon} size={15} />
        </span>
        <span className="grow"><b>{g.name}</b>{elsewhere && <small className="muted from">{elsewhere}</small>}</span>
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
    const geo = subject?.id === 'geography';
    // A small sub-section (one or two decks, under 30 cards, nothing inside) isn't worth a fold of its own: its decks are
    // listed here, labelled with where they sit (By place › New York › New York City). It gets its fold back by itself
    // once it grows: a third deck, 30 cards, or a sub-folder.
    const small = (k: string) => {
      if (geo || childSections(k).length) return false;
      const gs = groupsShownIn(k);
      return gs.length <= 2 && gs.reduce((n, g) => n + nodeStats(ds, p, nodeId(g.id, g.topics[0].id)).total, 0) < 30;
    };
    // A subject's top level is its outline, so it's all folds or all rows, never a mix: Life's three domains (Bacteria ·
    // Archaea · Eukaryotes) stay three folds even while two of them hold one small deck.
    const mixedTop = depth === 0 && childSections(sec).some(k => !small(k));
    const tiny = (k: string) => !mixedTop && small(k);
    const kids = childSections(sec).filter(k => !tiny(k));
    const inlined = childSections(sec).filter(tiny).flatMap(k => groupsShownIn(k).map(g => ({ g, from: k })));
    // Study: every deck in this section and below it (all of History of China, all prehistory…), one session. In
    // Geography it follows the quiz's rule (a continent's countries, not every US county inside it) and takes the first
    // skill of each group (the places, not capitals/flags, which unlock later).
    const branch = (geo ? scopeGroups(`sec:${sec}`) : all).map(g => nodeId(g.id, g.topics[0].id)).filter(n => isUnlocked(ds, p, n));
    const branchOn = branch.filter(n => p.active.includes(n));
    const studyAll = () => { update(x => { x.active = [...new Set([...x.active, ...branch])]; }); startStudy(branch); };
    // Open by default: a notes subject's first level (History of China), not deeper folds or the By era lens, so a
    // subject page stays short; Geography starts closed. `open` holds the sections you've flipped from their default.
    const byDefault = !geo && depth <= 1 && !/^By (era|exam objective|book chapter)/.test(sec); // lenses start closed
    const isOpen = open.has(sec) ? !byDefault : byDefault;
    const bare = !geo && depth === 0; // a notes subject's own section: the page title already names it
    return (
      <section key={sec} id={secKey(sec)} className={(bare ? 'bare' : depth ? 'subsection' : 'continent') + (isOpen || bare ? ' open' : '')}>
        {!bare && <button className="section-row" onClick={() => toggleSection(sec)} aria-expanded={isOpen}>
          <span className="node-icon"><Icon name={SECTION_ICON[sec] ?? (!geo ? 'book' : depth ? 'map' : 'globe')} /></span>
          <span className="grow">
            <b>{sec}</b>
            <span className="section-sub">{all.length > 1 ? `${all.length} ${geo ? 'groups' : 'decks'} · ` : ''}{tot.known}/{tot.total} known{learning ? ` · ${learning} learning` : ''}{tot.due ? ` · ${tot.due} due` : ''}</span>
            <span className="mini-bar"><i style={{ width: `${(tot.known / Math.max(1, tot.total)) * 100}%` }} /></span>
          </span>
          <span className={'chev' + (isOpen ? ' up' : '')}>›</span>
        </button>}
        {(isOpen || bare) && <div className="section-body">
          {branch.length > 0 && <div className="section-actions">
            <button className="btn small primary" onClick={studyAll}><Icon name="play" size={15} /> Study{branch.length > 1 ? ` all ${branch.length}` : ''}</button>
            <button className="btn small" onClick={() => startQuiz(makeQuiz(ds, (all.length === 1 ? `grp:${groups[0].id}` : `sec:${sec}`) as Scope, [(groups[0] ?? all[0]).topics[0].id], 25))}>
              <Icon name="target" size={15} /> Quiz
            </button>
            {branchOn.length > 0 && <button className="btn small ghost" onClick={() => update(x => { x.active = x.active.filter(a => !branch.includes(a)); })}>Stop{branchOn.length > 1 ? ' all' : ''}</button>}
          </div>}
          {ERAS.some(e => sec.startsWith(e.section)) ? <p className="muted small">Every deck from this era ({ERAS.find(e => sec.startsWith(e.section))!.span}), wherever it happened. Each is also in its own country's history; progress is shared.</p>
            : sec.startsWith('By era') ? <p className="muted small">The same decks again, by world era instead of by country.</p>
            : groups.length === 1 && groups[0].note && sec !== LIVE && <p className="muted small"><Rich before={groups[0].note.split('\n')[0]} /></p>}
          {(groups.some(g => g.topics.length === 1) || inlined.length > 0) && <div className="deck-rows">
            {groups.filter(g => g.topics.length === 1).map(g => deckRow(g, sec))}
            {inlined.map(({ g, from }) => deckRow(g, sec, from))}
          </div>}
          {groups.some(g => g.topics.length > 1) && <div className="groups">
            {groups.filter(g => g.topics.length > 1).map(g => (
              <div key={g.id} className="group">
                <div className="group-head"><b>{g.name}</b><small>{countOf(placesIn(ds, g.id).length, g.nouns ?? LAYER_NOUN[g.layer])}</small></div>
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
      <Search ds={ds} startCards={startCards} startQuiz={startQuiz} />
      <div className="row library-actions"><button className="btn small" onClick={() => setBuilder(true)}><Icon name="plus" size={15} /> New cards or deck</button></div>
      {builder && <Builder onClose={() => setBuilder(false)} />}
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
        ? <p className="muted">Tap a skill to study or quiz it, or <b>Study</b> a whole region at once. <b>Capitals</b> and <b>Flags</b> unlock once you know half of a region's places{p.settings.locks ? '' : ' (locks are currently off)'}. Countries and states you can study in depth sit inside their continent, under <b>In depth</b>.</p>
        : <p className="muted">Tap a deck, or <b>Study</b> a whole section at once. {subject.name === EQUATIONS ? <>Every equation from every course, each gathering its cards from wherever they are: how it's derived, the formula, what moves it, its graph. Open one to see what every symbol means and a worked example.</> : subject.name === 'Cybersecurity' ? <>Every deck starts with a short <b>lesson</b>: open a deck and tap <b>Read the lesson</b>, then study its cards. Diagrams step through who sends what to whom. Also listed by Security+ exam objective and by chapter of the study guide.</> : subject.name === 'Government' ? <>Organized by country, starting with the United States. Most decks open with a short <b>lesson</b>. New kinds of cards here: <b>parts</b> cards, where you recall a short list or process one part at a time and get partial credit; maps that ask which State Department bureau covers a country; and chains of command to fill in. Cards marked “as of” are checked every Wednesday.</> : subject.name === LIVE ? <>Ongoing stories, each filed in its own subject too. Every Wednesday the Wikipedia articles they follow are checked: up to two new cards a week, and updates to the cards marked “as of”, arrive as a pull request for you to approve.</> : subject.name === 'Earth history' ? <>The cards are made from the same data as the chart (<code>src/geotime.ts</code>), so they always agree.</> : COLLECTION_SUBJECTS.includes(subject.name) && NOTE_SUBJECTS.includes(subject.name) ? <>Lists of buildings or works come from <code>geo-quest/collections/{subject.name}/</code> (facts and pictures from Wikidata); the other decks from <code>geo-quest/decks/{subject.name}/</code>.</> : COLLECTION_SUBJECTS.includes(subject.name) ? <>Each deck is a list in <code>geo-quest/collections/{subject.name}/</code>; add a work by its Wikipedia title and the facts and picture are filled in from Wikidata.</> : <>These cards come from the note files in <code>geo-quest/decks/{subject.name}/</code>.</>}</p>}
      {subject.name === 'Earth history' && <GeoTime />}
      {top.length > 1 && <nav className="jumpbar">
        {top.map(sec => <button key={sec} className={'pick' + (open.has(sec) ? ' on' : '')} onClick={() => jump(sec)}><Icon name={SECTION_ICON[sec] ?? 'globe'} size={14} />{sec}</button>)}
      </nav>}
      {top.map(sec => section(sec, 0))}
      {sel && <NodeSheet ds={ds} node={sel} onClose={() => setSel(null)} startQuiz={q => { setSel(null); startQuiz(q); }} startStudy={n => { setSel(null); startStudy(n); }} />}
    </div>
  );
}
