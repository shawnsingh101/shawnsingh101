// Code on cards: a block of code (a program, a line of the app's own source) in a fixed-width font with simple colors,
// and `inline code` inside a card's sentence. A blank can sit inside either: "for i in ____:" until you flip it.
import { Fragment, type ReactNode } from 'react';
import katex from 'katex';

/** Where the app's code lives, for "see it in the code" links on Under the hood cards. */
// Paths are from geo-quest/ (src/tree.ts); the robots' folder sits beside it, at the top of the repo (.github/…).
export const REPO_FILE = (path: string) => `https://github.com/shawnsingh101/shawnsingh101/blob/main/${path.startsWith('.github/') ? '' : 'geo-quest/'}${path.replace(/^geo-quest\//, '')}`;

const KEYWORDS: Record<string, string[]> = {
  python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'import', 'from', 'as', 'class', 'True', 'False', 'None', 'break', 'continue', 'pass', 'lambda', 'with', 'try', 'except', 'is'],
  ts: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'of', 'in', 'while', 'import', 'export', 'from', 'type', 'interface', 'new', 'true', 'false', 'null', 'undefined', 'async', 'await', 'continue', 'break'],
};
const LANG: Record<string, string> = { python: 'python', py: 'python', ts: 'ts', typescript: 'ts', tsx: 'ts', js: 'ts', javascript: 'ts' };

/** Split code into colored pieces: comments, strings, numbers, keywords. Good enough for short snippets, not a parser. */
function paint(text: string, lang: string): ReactNode[] {
  const kw = KEYWORDS[LANG[lang] ?? ''] ?? [];
  const comment = LANG[lang] === 'python' || /^(yaml|yml|bash|sh|toml)$/.test(lang) ? '#[^\\n]*' : LANG[lang] === 'ts' ? '\\/\\/[^\\n]*' : '(?!)';
  const re = new RegExp(`(${comment})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`[^\`]*\`)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b(?:${kw.join('|') || '(?!)'})\\b)`, 'g');
  const out: ReactNode[] = []; let at = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > at) out.push(text.slice(at, m.index));
    out.push(<span key={m.index} className={m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-n' : 'tk-k'}>{m[0]}</span>);
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}

/** A code block. A \u0000 in the text is the card's blank: `blank` (the hint, or the answer once flipped) goes there. */
export function CodeBlock({ text, lang, blank }: { text: string; lang: string; blank?: ReactNode }) {
  const [a, b] = text.split('\u0000');
  return (
    <pre className={'code-block lang-' + lang} onClick={e => e.stopPropagation()}>
      {lang !== 'text' && <span className="code-lang">{lang === 'ts' || lang === 'tsx' ? 'TypeScript' : lang === 'py' ? 'Python' : lang.charAt(0).toUpperCase() + lang.slice(1)}</span>}
      <code>{paint(a, lang)}{b !== undefined && <>{blank}{paint(b, lang)}</>}</code>
    </pre>
  );
}

/** Math: $…$ inline and $$…$$ on its own line, in KaTeX. The common Markdown rule keeps prices as text: an opening $ is
 *  followed by a non-space, a closing $ follows a non-space and isn't followed by a digit ("$4 trillion … $5" is text). */
export const MATH = /\$\$([\s\S]+?)\$\$|\$(?=[^\s$])((?:\\\$|[^$])+?)(?<=[^\s\\])\$(?!\d)/g;
export const tex = (src: string, display: boolean) => katex.renderToString(src, { throwOnError: false, displayMode: display, strict: false, trust: false });
/** What a blank looks like inside a formula: a box with its hint, then the green answer once flipped. */
export const blankTex = (revealed: boolean, answer: string, hint: string) =>
  revealed ? `\\textcolor{#1e8a5a}{\\mathbf{${answer}}}` : `\\boxed{\\scriptsize\\text{${hint.replace(/[\\{}$&#^_%~]/g, '')}}}`;

/** Text with math in it: KaTeX for the math, the blank (\u0000) as `blank` in text or `blankTeX` inside a formula. */
function withMath(text: string, blank: ReactNode, blankTeX: string | undefined, key: number): ReactNode {
  if (!text.includes('$')) { const p = text.split('\u0000'); return p.length > 1 ? <Fragment key={key}>{p[0]}{blank}{p[1]}</Fragment> : <Fragment key={key}>{text}</Fragment>; }
  const out: ReactNode[] = []; let at = 0, m: RegExpExecArray | null;
  MATH.lastIndex = 0;
  const plain = (t: string) => { const p = t.split('\u0000'); out.push(p.length > 1 ? <Fragment key={out.length}>{p[0]}{blank}{p[1]}</Fragment> : <Fragment key={out.length}>{t}</Fragment>); };
  while ((m = MATH.exec(text))) {
    if (m.index > at) plain(text.slice(at, m.index));
    const display = m[1] !== undefined, src = (m[1] ?? m[2]).replace('\u0000', blankTeX ?? '\\boxed{?}');
    out.push(<span key={out.length} className={display ? 'math-display' : 'math'} dangerouslySetInnerHTML={{ __html: tex(src, display) }} />);
    at = m.index + m[0].length;
  }
  if (at < text.length) plain(text.slice(at));
  return <Fragment key={key}>{out}</Fragment>;
}

/** A card sentence with `inline code` and $math$: before + blank + after, where the backticks or dollar signs may open
 *  before the blank and close after it (`print({{"Hello"}})`, $N^{ {{1-\alpha}} }$), so the blank sits inside them. */
export function Rich({ before, blank, after, blankTeX }: { before: string; blank?: ReactNode; after?: string; blankTeX?: string }) {
  const whole = before + (blank !== undefined ? '\u0000' : '') + (after ?? '');
  if (!whole.includes('`') && !whole.includes('$')) return <>{before}{blank}{after}</>;
  return <>{whole.split('`').map((seg, i) => {
    if (i % 2) { const parts = seg.split('\u0000'); return <code key={i} className="inline-code">{parts.length > 1 ? <>{parts[0]}{blank}{parts[1]}</> : seg}</code>; }
    return withMath(seg, blank, blankTeX, i);
  })}</>;
}
