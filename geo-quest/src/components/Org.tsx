// An org chart: who reports to whom, drawn as nested blocks in the style of the stack and lineage cards. One office per
// line, indented two spaces under the office it reports to; "name | detail" puts a title or a note under the name.
// A parent whose children are all leaves shows them as a wrap of tiles, so a long list (six regional bureaus) still fits
// a phone. With {{blanks}} it's a card of its own, like a flow or a stack: one card per blank.
//
//   ```org
//   # Who the regional bureaus report to
//   Secretary of State (S)
//     {{Under Secretary for Political Affairs (P)|which under secretary?}}
//       African Affairs (AF) | Assistant Secretary
//       Near Eastern Affairs (NEA) | Assistant Secretary
//   ```
import { type ReactNode } from 'react';
import { Rich } from './Code';

const PALETTE = ['#3d6fd6', '#1f8f62', '#c49a1d', '#8a56c9', '#c2443c', '#2a8fb8'];

export interface OrgNode { name: string; detail: string; children: OrgNode[] }

export function parseOrg(text: string): { title: string | null; roots: OrgNode[] } {
  let lines = text.split('\n').filter(l => l.trim());
  const title = /^#\s+(.*)$/.exec(lines[0]?.trim() ?? '')?.[1] ?? null;
  if (title) lines = lines.slice(1);
  const roots: OrgNode[] = [];
  const stack: { depth: number; node: OrgNode }[] = [];
  for (const l of lines) {
    const depth = /^\s*/.exec(l)![0].length;
    const [name, ...rest] = l.trim().split(' | ');
    const node: OrgNode = { name: name.trim(), detail: rest.join(' | ').trim(), children: [] };
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    (stack.length ? stack[stack.length - 1].node.children : roots).push(node);
    stack.push({ depth, node });
  }
  return { title, roots };
}

export function Org({ text, blank }: { text: string; blank?: ReactNode }) {
  const { title, roots } = parseOrg(text);
  const show = (s: string) => { const [a, b] = s.split('\u0000'); return b === undefined ? <Rich before={a} /> : <Rich before={a} blank={blank} after={b} />; };
  const box = (n: OrgNode, depth: number, tile = false) => (
    <div className={'org-box' + (tile ? ' org-tile' : '')} style={{ ['--c' as string]: PALETTE[depth % PALETTE.length] }}>
      <b>{show(n.name)}</b>{n.detail && <small>{show(n.detail)}</small>}
    </div>
  );
  const node = (n: OrgNode, depth: number, key: number): ReactNode => {
    const leaves = n.children.length > 0 && n.children.every(c => !c.children.length);
    return (
      <li key={key}>
        {box(n, depth)}
        {n.children.length > 0 && (leaves
          ? <div className="org-tiles">{n.children.map((c, i) => <div key={i}>{box(c, depth + 1, true)}</div>)}</div>
          : <ul>{n.children.map((c, i) => node(c, depth + 1, i))}</ul>)}
      </li>
    );
  };
  return (
    <figure className="org" onClick={e => e.stopPropagation()}>
      {title && <figcaption className="flow-title">{title}</figcaption>}
      <ul className="org-root">{roots.map((r, i) => node(r, 0, i))}</ul>
    </figure>
  );
}
