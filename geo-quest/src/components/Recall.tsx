// A parts card: a question whose answer is 2 to 5 parts (the steps of a process, the members of a set). You recall
// them one at a time: show a part, say whether you had it (red or green), then the next. The score sets the grade:
// all of them Good, half or more Hard, fewer Again (recallGrade).
import { useEffect, useState } from 'react';
import { Rating } from 'ts-fsrs';
import type { Recall } from '../notes';
import { Rich } from './Code';
import { Icon } from './Icons';

export type RecallGrade = Rating.Again | Rating.Hard | Rating.Good;
export const recallGrade = (got: number, total: number): RecallGrade => (got === total ? Rating.Good : got * 2 >= total ? Rating.Hard : Rating.Again);
export const RECALL_LABEL: Record<RecallGrade, string> = { [Rating.Good]: 'Full credit', [Rating.Hard]: 'Partial credit', [Rating.Again]: 'No credit' };

export function RecallCard({ r, prompt, done, onDone }: { r: Recall; prompt: string; done: boolean; onDone: (got: number, total: number) => void }) {
  const n = r.steps.length;
  const [marks, setMarks] = useState<boolean[]>([]); // one per part already graded
  const [shown, setShown] = useState(false);          // the current part's answer is showing
  const at = marks.length;
  const show = () => { if (!done && at < n) setShown(true); };
  const mark = (ok: boolean) => {
    if (!shown) return;
    const m = [...marks, ok]; setMarks(m); setShown(false);
    if (m.length === n) onDone(m.filter(Boolean).length, n);
  };
  useEffect(() => {
    if (done) return;
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;
      if (!shown && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); show(); }
      else if (shown && (e.key === '1' || e.key === 'ArrowLeft')) mark(false);
      else if (shown && (e.key === '3' || e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight')) { e.preventDefault(); mark(true); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });
  const got = marks.filter(Boolean).length;
  return (
    <div className="recall" onClick={e => e.stopPropagation()}>
      <p className="cloze front"><Rich before={prompt} /></p>
      <p className="recall-how muted small">{n} parts{r.anyOrder ? ', in any order' : ', in order'}{done ? '' : ': recall each one, then check it'}</p>
      <ol className={'recall-steps' + (r.anyOrder ? ' any' : '')}>
        {r.steps.map((s, i) => {
          const state = i < at ? (marks[i] ? 'got' : 'missed') : i === at && !done ? (shown ? 'open' : 'current') : 'later';
          return (
            <li key={i} className={'recall-step ' + state} onClick={() => i === at && show()}>
              <span className="recall-num">{i < at ? <Icon name={marks[i] ? 'check' : 'x'} size={14} /> : i + 1}</span>
              <span className="recall-body">
                {s.cue && <span className="recall-cue"><Rich before={s.cue} /></span>}
                {i < at || state === 'open' ? <span className="recall-answer"><Rich before={s.answer} /></span>
                  : state === 'current' ? <button className="btn small recall-show" onClick={show}>Show part {i + 1}<kbd className="kbd-only">space</kbd></button>
                  : <span className="recall-later">…</span>}
              </span>
            </li>
          );
        })}
      </ol>
      {shown && !done && (
        <div className="grades two recall-marks">
          <button className="grade g1" onClick={() => mark(false)}><b>Missed it</b><kbd>1</kbd></button>
          <button className="grade g3" onClick={() => mark(true)}><b>Got it</b><kbd>3 · space</kbd></button>
        </div>
      )}
      {done && <p className="recall-score"><b>{got} of {n}</b> · {RECALL_LABEL[recallGrade(got, n)]}</p>}
    </div>
  );
}
