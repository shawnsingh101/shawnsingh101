// A flow diagram: who sends what to whom, in order. Security is mostly systems passing things back and forth (a key, a
// certificate, a ticket), so the actors are columns and each step is an arrow between two of them, or a note on one.
// In a lesson you step through it; as a card, one step's label is blank until you flip it.
//
//   ```flow
//   Browser | Server | Certificate authority
//   Browser -> Server: Hello: the TLS versions and ciphers I support
//   Server -> Browser: My certificate, signed by {{a certificate authority|whom?}}
//   Browser: checks the signature with the CA's public key
//   ```
import { useState, type ReactNode } from 'react';
import { Rich } from './Code';
import { parseFlow } from '../flow';

// One soft color per actor, as in a clean textbook diagram: a pastel fill for its box and notes, the full color for its arrows.
const COLORS = ['#3d6fd6', '#1f8f62', '#8a56c9', '#c46f1d', '#c2443c'];

/** `blank`: what goes where the card's blank (\u0000) is. `stepper`: reveal the steps one at a time (lessons). */
export function Flow({ text, blank, stepper }: { text: string; blank?: ReactNode; stepper?: boolean }) {
  const { title, actors, steps } = parseFlow(text);
  const [shown, setShown] = useState(stepper ? 1 : steps.length);
  const n = actors.length, col = (i: number) => `${((i + 0.5) / n) * 100}%`;
  const label = (s: string) => { const [a, b] = s.split('\u0000'); return b === undefined ? <Rich before={a} /> : <Rich before={a} blank={blank} after={b} />; };
  return (
    <figure className={'flow' + (stepper ? ' stepper' : '')} onClick={e => e.stopPropagation()} style={{ ['--n' as string]: n }}>
      {title && <figcaption className="flow-title">{title}</figcaption>}
      <div className="flow-actors">{actors.map((a, i) => <span key={a} style={{ ['--c' as string]: COLORS[i % COLORS.length] }}>{a}</span>)}</div>
      <ol className="flow-steps">
        {steps.slice(0, shown).map((s, i) => {
          const note = s.from === s.to, left = Math.min(s.from, s.to), right = Math.max(s.from, s.to);
          return (
            <li key={i} className={note ? 'flow-step-note' : s.to > s.from ? 'right' : 'left'}>
              <span className="flow-lines">{actors.map((_, k) => <i key={k} style={{ left: col(k) }} />)}</span>
              {note
                ? <span className="flow-note" style={{ left: `max(0%, min(${col(s.from)} - 30%, 40%))`, ['--c' as string]: COLORS[s.from % COLORS.length] }}><b>{i + 1}</b> {label(s.label)}</span>
                : <>
                    <span className="flow-label" style={{ marginLeft: col(left), marginRight: `calc(100% - ${col(right)})` }}><span className="flow-text"><b>{i + 1}</b> {label(s.label)}</span></span>
                    <span className="flow-arrow" style={{ marginLeft: col(left), marginRight: `calc(100% - ${col(right)})`, ['--c' as string]: COLORS[s.from % COLORS.length] }} />
                  </>}
            </li>
          );
        })}
      </ol>
      {stepper && steps.length > 1 && <div className="flow-controls">
        <button className="btn small ghost" disabled={shown <= 1} onClick={() => setShown(shown - 1)}>Back</button>
        <span className="muted small">Step {shown} of {steps.length}</span>
        {shown < steps.length ? <button className="btn small primary" onClick={() => setShown(shown + 1)}>Next</button> : <button className="btn small ghost" onClick={() => setShown(1)}>Start over</button>}
      </div>}
    </figure>
  );
}
