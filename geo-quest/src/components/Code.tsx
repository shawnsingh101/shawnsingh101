// Code on cards: a block of code (a program, a line of the app's own source) in a fixed-width font with simple colors,
// and `inline code` inside a card's sentence. A blank can sit inside either: "for i in ____:" until you flip it.
import { Fragment, type ReactNode } from 'react';

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

/** A card sentence with `inline code`: before + blank + after, where the backticks may open before the blank and close
 *  after it (`print({{"Hello"}})`), so the blank sits inside the code. */
export function Rich({ before, blank, after }: { before: string; blank?: ReactNode; after?: string }) {
  if (!before.includes('`') && !(after ?? '').includes('`')) return <>{before}{blank}{after}</>;
  const whole = before + (blank !== undefined ? '\u0000' : '') + (after ?? '');
  return <>{whole.split('`').map((seg, i) => {
    const parts = seg.split('\u0000');
    const inner = parts.length > 1 ? <>{parts[0]}{blank}{parts[1]}</> : seg;
    return i % 2 ? <code key={i} className="inline-code">{inner}</code> : <Fragment key={i}>{inner}</Fragment>;
  })}</>;
}
