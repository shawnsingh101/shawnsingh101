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

// A recipe's pour card is drawn as a glass that fills up, one colored block per ingredient, sized by how much goes in.
const FRACTIONS: Record<string, number> = { '¼': .25, '½': .5, '¾': .75, '⅓': 1 / 3, '⅔': 2 / 3 };
export function ounces(answer: string): number {
  const m = /^(\d+)?\s*([¼½¾⅓⅔])?\s*(oz|tsp|teaspoons?|tbsp|tablespoons?|shots?|parts?|dash(?:es)?)?/i.exec(answer.trim());
  const n = (m?.[1] ? +m[1] : 0) + (m?.[2] ? FRACTIONS[m[2]] : 0), unit = (m?.[3] || '').toLowerCase();
  if (/^fill|^top|^splash/i.test(answer)) return /^splash/i.test(answer) ? .5 : 3;
  if (!n) return /dash|drop/i.test(answer) ? .1 : 1;
  return unit.startsWith('t') && unit !== 'tbsp' && !unit.startsWith('table') ? n / 8 : unit.startsWith('tb') || unit.startsWith('table') ? n * 3 / 8
    : unit.startsWith('shot') ? n * 1.5 : unit.startsWith('dash') ? n * .1 : n;
}
const blockHeight = (answer: string) => `${(2.3 + Math.min(ounces(answer), 4) * 1.1).toFixed(2)}rem`;

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
      <p className="recall-how muted small">{r.recipe === 'pour' ? `${n} ingredients, with how much of each` : r.recipe === 'serve' ? `${n} parts` : `${n} parts${r.anyOrder ? ', in any order' : ', in order'}`}{done ? '' : ': recall each one, then check it'}</p>
      <ol className={'recall-steps' + (r.anyOrder ? ' any' : '') + (r.recipe ? ' recipe-' + r.recipe : '')}>
        {r.steps.map((s, i) => {
          const state = i < at ? (marks[i] ? 'got' : 'missed') : i === at && !done ? (shown ? 'open' : 'current') : 'later';
          return (
            <li key={i} className={'recall-step ' + state + (s.role ? ' role-' + s.role : '')} onClick={() => i === at && show()}
              style={r.recipe === 'pour' ? { minHeight: blockHeight(s.answer) } : undefined}>
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
