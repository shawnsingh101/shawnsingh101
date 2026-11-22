import { useState } from 'react';
import { CONTINENTS, GROUPS, SECTIONS, placesIn, type Topic } from '../cards';
import { makeQuiz, quizKey, quizPool, quizTitle, scopeTopics, type Scope } from '../quiz';
import { useProgress } from '../srs';
import { Icon, type IconName } from '../components/Icons';
import type { QuizSpec } from '../components/Study';
import type { Dataset } from '../types';

const LENGTHS: (number | 'all')[] = [10, 25, 50, 'all'];

/** Step 1 is "what subject"; every scope belongs to exactly one subject. */
interface Subject { id: string; name: string; icon: IconName; sections: string[] }
const SUBJECTS: Subject[] = [
  { id: 'countries', name: 'Countries', icon: 'globe', sections: CONTINENTS },
  ...SECTIONS.filter(s => !CONTINENTS.includes(s)).map(s => ({
    id: s, name: s === 'China' ? "China's provinces" : s, sections: [s],
    icon: ({ 'United States': 'capitol', Territories: 'pin', 'World Heritage': 'temple', Mountains: 'mountain', 'Oceans & Seas': 'wave', Rivers: 'river', Lakes: 'drop', China: 'map' } as Record<string, IconName>)[s] ?? 'globe',
  })),
];
const sectionOf = (scope: Scope) => (scope === 'world' ? CONTINENTS[0] : scope.startsWith('sec:') ? scope.slice(4) : GROUPS.find(g => g.id === scope.slice(4))!.section);
const subjectOf = (scope: Scope) => SUBJECTS.find(s => s.sections.includes(sectionOf(scope)))!;
const allScope = (sub: Subject): Scope => (sub.id === 'countries' ? 'world' : GROUPS.filter(g => g.section === sub.sections[0]).length > 1 ? `sec:${sub.sections[0]}` : `grp:${GROUPS.find(g => g.section === sub.sections[0])!.id}`);
const shortName = (name: string) => name.replace(/^(Rivers|Lakes) of /, '').replace(/ territories$/, '').replace(/^the /, '').replace(/^./, c => c.toUpperCase());
const SAVED = 'geoquest:quiz-setup';

export function Quiz({ ds, start }: { ds: Dataset; start: (q: QuizSpec) => void }) {
  const p = useProgress();
  // Remember the last setup on this device, so "the same again" is one tap.
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVED) ?? 'null'); } catch { return null; } })();
  const [scope, setScope] = useState<Scope>(saved?.scope ?? 'sec:Europe');
  const [picked, setTopics] = useState<Topic[]>(saved?.topics ?? ['countries']);
  const [len, setLen] = useState<number | 'all'>(saved?.len ?? 25);
  const subject = subjectOf(scope);

  const offered = scopeTopics(scope);
  // Only questions this area offers count; if none are left (Countries → Rivers), take its first.
  const valid = picked.filter(t => offered.some(o => o.id === t));
  const topics: Topic[] = valid.length ? valid : offered.length ? [offered[0].id] : [];

  const pool = quizPool(ds, scope, topics).length;
  const best = p.quizBest[quizKey(scope, topics)];
  const pct = (b: { best: number; total: number }) => Math.round((100 * b.best) / b.total);
  const toggle = (t: Topic) => setTopics(topics.includes(t) ? (topics.length > 1 ? topics.filter(x => x !== t) : topics) : [...topics, t]);
  const medal = (s: Scope) => Object.entries(p.quizBest).some(([k, b]) => k.startsWith(s + '|') && pct(b) >= 90);
  const Chip = ({ s, label, sub }: { s: Scope; label: string; sub?: boolean }) => (
    <button className={'pick' + (sub ? ' small' : '') + (scope === s ? ' on' : '')} onClick={() => setScope(s)}>{medal(s) && <Icon name="medal" size={14} className="gold" />}{label}</button>
  );
  const go = () => {
    try { localStorage.setItem(SAVED, JSON.stringify({ scope, topics, len })); } catch { /* ignore */ }
    start(makeQuiz(ds, scope, topics, len));
  };

  // Countries: whole world → continent → region. Others: all → group.
  const cont = subject.id === 'countries' && scope !== 'world' ? sectionOf(scope) : null;
  const groupsOf = (sec: string) => GROUPS.filter(g => g.section === sec);
  const records = Object.entries(p.quizBest).sort((a, b) => pct(b[1]) - pct(a[1]));
  const n = Math.min(pool, len === 'all' ? pool : len);

  return (
    <div className="quiz">
      <h1>Quiz</h1>
      <p className="muted">Three steps: a subject, how much of it, and which questions. Quizzes don't add new cards, but answers on cards you're learning count as reviews. 90%+ earns a medal.</p>

      <section className="quiz-step">
        <h3><span className="step">1</span> Subject</h3>
        <div className="subjects">
          {SUBJECTS.map(sub => (
            <button key={sub.id} className={'subject' + (subject.id === sub.id ? ' on' : '')} onClick={() => subject.id !== sub.id && setScope(sub.id === 'countries' ? 'sec:Europe' : allScope(sub))}>
              <Icon name={sub.icon} size={20} /><span>{sub.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="quiz-step">
        <h3><span className="step">2</span> Area</h3>
        {subject.id === 'countries' ? <>
          <div className="picks">
            <Chip s="world" label="Whole world" />
            {CONTINENTS.map(c => <Chip key={c} s={`sec:${c}`} label={c} />)}
          </div>
          {cont && <div className="picks sub">
            <span className="muted small">Or one region:</span>
            {groupsOf(cont).map(g => <Chip key={g.id} s={`grp:${g.id}`} label={g.name} sub />)}
          </div>}
        </> : groupsOf(subject.sections[0]).length > 1 ? (
          <div className="picks">
            <Chip s={allScope(subject)} label={`All ${subject.name.toLowerCase().replace('united states', '50 states')}`} />
            {groupsOf(subject.sections[0]).map(g => <Chip key={g.id} s={`grp:${g.id}`} label={g.id === 'u-icons' ? 'Heritage icons' : shortName(g.name)} />)}
          </div>
        ) : <p className="muted small">All {placesIn(ds, groupsOf(subject.sections[0])[0].id).length} of them.</p>}
      </section>

      <section className="quiz-step">
        <h3><span className="step">3</span> Questions <small className="muted">pick one or more</small></h3>
        <div className="picks">
          {offered.map(t => (
            <button key={t.id} className={'pick check' + (topics.includes(t.id) ? ' on' : '')} onClick={() => toggle(t.id)}>
              <span className="box">{topics.includes(t.id) && <Icon name="check" size={12} />}</span>{t.name}
            </button>
          ))}
        </div>
        <div className="len-row">
          <span className="muted small">How many</span>
          <div className="segmented">
            {LENGTHS.map(l => <button key={l} className={len === l ? 'on' : ''} onClick={() => setLen(l)}>{l === 'all' ? `All ${pool}` : l}</button>)}
          </div>
        </div>
      </section>

      <div className="quiz-bar">
        <div className="grow">
          <b>{quizTitle(scope, topics)}</b>
          <span className="muted small">{n} card{n === 1 ? '' : 's'}{best ? ` · your best ${pct(best)}%` : ''}</span>
        </div>
        <button className="btn primary" disabled={!pool} onClick={go}><Icon name="play" /> Start</button>
      </div>

      {records.length > 0 && (
        <section className="records">
          <h3>Your records <small className="muted">tap one to set it up again</small></h3>
          <ul>
            {records.map(([k, b]) => {
              const [s, t] = k.split('|');
              return <li key={k}><button onClick={() => { setScope(s as Scope); setTopics(t.split('+') as Topic[]); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                {pct(b) >= 90 ? <Icon name="medal" className="gold" /> : <Icon name="target" />}
                <span className="grow">{quizTitle(s as Scope, t.split('+') as Topic[])}</span><b>{pct(b)}%</b><small>{b.best}/{b.total}</small></button></li>;
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
