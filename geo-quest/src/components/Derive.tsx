// A derivation, stepped through: one formula per line, each with a plain-English reason. You don't have to be able to
// derive it, but seeing where an equation comes from makes it stick. As a card, one step (or reason) is blank.
//
//   ```derive
//   # Growth accounting
//   Y = A K^{\alpha} N^{1-\alpha} :: Start from the Cobb-Douglas production function.
//   \ln Y = \ln A + \alpha \ln K + (1-\alpha)\ln N :: Take logs: products become sums.
//   ```
import { useState, type ReactNode } from 'react';
import { Rich, tex } from './Code';

export const parseDerive = (text: string) => {
  let lines = text.split('\n').filter(l => l.trim());
  const title = /^#\s+(.*)$/.exec(lines[0]?.trim() ?? '')?.[1] ?? null;
  if (title) lines = lines.slice(1);
  return { title, steps: lines.map(l => { const [f, ...why] = l.split('::'); return { formula: f.trim(), why: why.join('::').trim() }; }) };
};

export function Derive({ text, blank, blankTeX, stepper }: { text: string; blank?: ReactNode; blankTeX?: string; stepper?: boolean }) {
  const { title, steps } = parseDerive(text);
  const [shown, setShown] = useState(stepper ? 1 : steps.length);
  return (
    <figure className="derive" onClick={e => e.stopPropagation()}>
      {title && <figcaption className="flow-title">{title}</figcaption>}
      <ol>
        {steps.slice(0, shown).map((s, i) => (
          <li key={i}>
            <span className="derive-n">{i + 1}</span>
            <span className="derive-body">
              <span className="math-display" dangerouslySetInnerHTML={{ __html: tex(s.formula.replace('\u0000', blankTeX ?? '\\boxed{?}'), true) }} />
              {s.why && <span className="derive-why">{s.why.includes('\u0000') ? <Rich before={s.why.split('\u0000')[0]} blank={blank} after={s.why.split('\u0000')[1]} /> : <Rich before={s.why} />}</span>}
            </span>
          </li>
        ))}
      </ol>
      {stepper && steps.length > 1 && <div className="flow-controls">
        <button className="btn small ghost" disabled={shown <= 1} onClick={() => setShown(shown - 1)}>Back</button>
        <span className="muted small">Step {shown} of {steps.length}</span>
        {shown < steps.length ? <button className="btn small primary" onClick={() => setShown(shown + 1)}>Next</button> : <button className="btn small ghost" onClick={() => setShown(1)}>Start over</button>}
      </div>}
    </figure>
  );
}
