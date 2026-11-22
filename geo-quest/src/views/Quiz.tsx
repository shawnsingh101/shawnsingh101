import { useEffect, useState } from 'react';
import { CONTINENTS, GROUPS, type Topic } from '../cards';
import { makeQuiz, quizKey, quizPool, quizTitle, scopeTopics, type Scope } from '../quiz';
import { useProgress } from '../srs';
import { Icon } from '../components/Icons';
import type { QuizSpec } from '../components/Study';
import type { Dataset } from '../types';

const LENGTHS: (number | 'all')[] = [10, 25, 50, 'all'];

export function Quiz({ ds, start }: { ds: Dataset; start: (q: QuizSpec) => void }) {
  const p = useProgress();
  const [scope, setScope] = useState<Scope>('sec:Europe');
  const [topics, setTopics] = useState<Topic[]>(['countries']);
  const [len, setLen] = useState<number | 'all'>(25);
  const [openCont, setOpenCont] = useState<string | null>(null);

  const offered = scopeTopics(scope);
  // Keep the topic selection valid when the scope changes (e.g. Countries → Oceans).
  useEffect(() => {
    const ids = offered.map(t => t.id);
    const keep = topics.filter(t => ids.includes(t));
    if (keep.length !== topics.length || !keep.length) setTopics(keep.length ? keep : [ids[0]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  const pool = quizPool(ds, scope, topics).length;
  const best = p.quizBest[quizKey(scope, topics)];
  const pct = (b: { best: number; total: number }) => Math.round((100 * b.best) / b.total);
  const toggle = (t: Topic) => setTopics(ts => (ts.includes(t) ? (ts.length > 1 ? ts.filter(x => x !== t) : ts) : [...ts, t]));
  const Chip = ({ s, label }: { s: Scope; label: string }) => {
    const medal = Object.entries(p.quizBest).some(([k, b]) => k.startsWith(s + '|') && pct(b) >= 90);
    return <button className={'pick' + (scope === s ? ' on' : '')} onClick={() => setScope(s)}>{medal && <Icon name="medal" size={14} className="gold" />}{label}</button>;
  };

  const records = Object.entries(p.quizBest).sort((a, b) => pct(b[1]) - pct(a[1]));

  return (
    <div className="quiz">
      <h1>Quiz</h1>
      <p className="muted">Test yourself on any mix — a region, a continent, or the whole world. Quizzes are practice: they don't change your review schedule. Score 90% or more to earn a medal; a good path is regions → continents → the world.</p>

      <section className="quiz-block">
        <h3>Where</h3>
        <div className="picks">
          <Chip s="world" label="Whole world" />
          {CONTINENTS.map(c => <Chip key={c} s={`sec:${c}`} label={c} />)}
        </div>
        <div className="picks sub">
          {CONTINENTS.map(c => (
            <button key={c} className={'pick ghost' + (openCont === c ? ' on' : '')} onClick={() => setOpenCont(openCont === c ? null : c)}>{c} regions ▾</button>
          ))}
        </div>
        {openCont && <div className="picks sub">{GROUPS.filter(g => g.section === openCont).map(g => <Chip key={g.id} s={`grp:${g.id}`} label={g.name} />)}</div>}
        <div className="picks">
          <Chip s="sec:Oceans & Seas" label="All oceans & seas" />
          {GROUPS.filter(g => g.layer === 'water').map(g => <Chip key={g.id} s={`grp:${g.id}`} label={g.name} />)}
        </div>
        <div className="picks"><Chip s="grp:cn" label="China's provinces" /></div>
      </section>

      <section className="quiz-block">
        <h3>What</h3>
        <div className="picks">
          {offered.map(t => (
            <button key={t.id} className={'pick' + (topics.includes(t.id) ? ' on' : '')} onClick={() => toggle(t.id)}>
              {topics.includes(t.id) && <Icon name="check" size={14} />}{t.name}
            </button>
          ))}
        </div>
      </section>

      <section className="quiz-block">
        <h3>How many cards</h3>
        <div className="picks">
          {LENGTHS.map(l => <button key={l} className={'pick' + (len === l ? ' on' : '')} onClick={() => setLen(l)}>{l === 'all' ? `All ${pool}` : l}</button>)}
        </div>
      </section>

      <div className="quiz-go">
        <button className="btn primary big" disabled={!pool} onClick={() => start(makeQuiz(ds, scope, topics, len))}>
          <Icon name="play" /> Start: {quizTitle(scope, topics)}
        </button>
        <span className="muted small">{Math.min(pool, len === 'all' ? pool : len)} of {pool} cards{best ? ` · best ${best.best}/${best.total} (${pct(best)}%)` : ''}</span>
      </div>

      {records.length > 0 && (
        <section className="records">
          <h3>Your records</h3>
          <ul>
            {records.map(([k, b]) => {
              const [s, t] = k.split('|');
              return <li key={k}>{pct(b) >= 90 ? <Icon name="medal" className="gold" /> : <Icon name="target" />}
                <span className="grow">{quizTitle(s as Scope, t.split('+') as Topic[])}</span><b>{pct(b)}%</b><small>{b.best}/{b.total}</small></li>;
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
