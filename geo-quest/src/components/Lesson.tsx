// A lesson: the short read before a deck's cards, like a textbook section. What it is, why it exists, how it works, where
// it fits, what it's confused with, with flow diagrams to step through. Written in a deck's `:::lesson … :::` block in
// plain Markdown: ## and ### headings, paragraphs, - lists, > callouts, **bold**, `code`, pictures, | tables |,
// ```flow, ```stack, ```org and code blocks.
import { Fragment, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CodeBlock, Rich } from './Code';
import { Flow } from './Flow';
import { Stack } from './Stack';
import { Org } from './Org';
import { Picture } from './Picture';
import { Graph } from './Graph';
import { Derive } from './Derive';
import { Icon } from './Icons';
import { chapterName, objectiveName } from '../secplus';

/** **bold** and `code` inside a line. */
const inline = (s: string): ReactNode => s.split('**').map((part, i) => (i % 2 ? <b key={i}><Rich before={part} /></b> : <Fragment key={i}><Rich before={part} /></Fragment>));

export function LessonBody({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const lines = text.split('\n');
  let para: string[] = [], list: string[] = [];
  const flush = () => {
    if (para.length) { out.push(<p key={out.length}>{inline(para.join(' '))}</p>); para = []; }
    if (list.length) { out.push(<ul key={out.length}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>); list = []; }
  };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith('```')) {
      flush();
      const lang = l.slice(3).trim() || 'text', body: string[] = [];
      while (++i < lines.length && !lines[i].trim().startsWith('```')) body.push(lines[i]);
      out.push(lang === 'flow' ? <Flow key={out.length} text={body.join('\n')} stepper /> : lang === 'stack' ? <Stack key={out.length} text={body.join('\n')} /> : lang === 'org' ? <Org key={out.length} text={body.join('\n')} /> : lang === 'graph' ? <Graph key={out.length} text={body.join('\n')} interactive /> : lang === 'derive' ? <Derive key={out.length} text={body.join('\n')} stepper /> : <CodeBlock key={out.length} text={body.join('\n')} lang={lang} />);
      continue;
    }
    // A picture: ![caption](commons:File.svg), shown whole (a diagram), tap to enlarge.
    const img = /^!\[([^\]]*)\]\((?:commons:)?(.+)\)$/.exec(l);
    if (img) { flush(); out.push(<div key={out.length} className="lesson-picture"><Picture file={img[2]} caption={img[1]} single /></div>); continue; }
    const h = /^(#{2,3})\s+(.*)$/.exec(l);
    if (h) { flush(); out.push(h[1] === '##' ? <h2 key={out.length}>{inline(h[2])}</h2> : <h3 key={out.length}>{inline(h[2])}</h3>); continue; }
    // A table: | a | b | rows, the first is the header, a |---| row under it is skipped.
    if (l.startsWith('|')) {
      flush();
      const rows: string[][] = [];
      for (; i < lines.length && lines[i].trim().startsWith('|'); i++) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        if (!cells.every(c => /^:?-+:?$/.test(c))) rows.push(cells);
      }
      i--;
      const [head, ...body] = rows;
      out.push(<div key={out.length} className="lesson-table"><table>
        <thead><tr>{head.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr></thead>
        <tbody>{body.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>)}</tbody>
      </table></div>);
      continue;
    }
    if (l.startsWith('> ')) { flush(); out.push(<aside key={out.length} className="lesson-callout"><Icon name="info" size={15} /> <span>{inline(l.slice(2))}</span></aside>); continue; }
    if (/^- /.test(l)) { if (para.length) { const p = para; para = []; out.push(<p key={out.length}>{inline(p.join(' '))}</p>); } list.push(l.slice(2)); continue; }
    if (!l) { flush(); continue; }
    if (list.length) flush();
    para.push(l);
  }
  flush();
  return <div className="lesson-body">{out}</div>;
}

export function LessonReader({ title, text, secplus, onClose, onStudy }: { title: string; text: string; secplus?: { objectives: string[]; chapter: string | null }; onClose: () => void; onStudy?: () => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return createPortal(
    <div className="lesson" role="dialog" aria-label={`Lesson: ${title}`}>
      <div className="lesson-inner">
        <button className="btn ghost close icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        <p className="muted small lesson-kicker">Lesson</p>
        <h1>{title}</h1>
        {secplus && <p className="lesson-tags">{secplus.objectives.map(o => <span key={o}>Objective {objectiveName(o)}</span>)}{secplus.chapter && <span>{chapterName(secplus.chapter)}</span>}</p>}
        <LessonBody text={text} />
        <div className="lesson-end">
          {onStudy && <button className="btn primary" onClick={onStudy}><Icon name="play" /> Study these cards</button>}
          {secplus && <p className="muted small">Ready for exam-style practice? In your Study Lab: {[secplus.chapter && chapterName(secplus.chapter), ...secplus.objectives.map(o => `objective ${o}`)].filter(Boolean).join(' · ')}.</p>}
        </div>
      </div>
    </div>, document.body);
}
