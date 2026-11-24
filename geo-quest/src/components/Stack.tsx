// A stack: things that sit on top of each other, drawn as colored blocks in the style of the time-scale and lineage cards.
// The OSI model's seven layers; a certificate's chain of trust. One row per line: "label | name | detail".
//
//   ```stack
//   # The OSI model
//   7 | Application | HTTP, DNS, SMTP
//   4 | {{Transport|which layer?}} | TCP, UDP, ports
//   ```
import { type ReactNode } from 'react';
import { Rich } from './Code';

const PALETTE = ['#3d6fd6', '#2a8fb8', '#1f8f62', '#7d9a2c', '#c49a1d', '#c46f1d', '#c2443c', '#8a56c9'];

export function parseStack(text: string) {
  let lines = text.split('\n').filter(l => l.trim());
  const title = /^#\s+(.*)$/.exec(lines[0]?.trim() ?? '')?.[1] ?? null;
  if (title) lines = lines.slice(1);
  return { title, rows: lines.map(l => { const [label, name, detail] = l.split('|').map(x => x.trim()); return { label: label ?? '', name: name ?? '', detail: detail ?? '' }; }) };
}

export function Stack({ text, blank }: { text: string; blank?: ReactNode }) {
  const { title, rows } = parseStack(text);
  const show = (s: string) => { const [a, b] = s.split('\u0000'); return b === undefined ? <Rich before={a} /> : <Rich before={a} blank={blank} after={b} />; };
  return (
    <figure className="stack" onClick={e => e.stopPropagation()}>
      {title && <figcaption className="flow-title">{title}</figcaption>}
      <ol>
        {rows.map((r, i) => (
          <li key={i} style={{ ['--c' as string]: PALETTE[Math.round((i * (PALETTE.length - 1)) / Math.max(1, rows.length - 1)) % PALETTE.length] }}>
            <span className="stack-label">{show(r.label)}</span>
            <span className="stack-block"><b>{show(r.name)}</b>{r.detail && <small>{show(r.detail)}</small>}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
