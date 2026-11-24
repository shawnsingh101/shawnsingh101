// A practice card: write a small program, run it, and check it against the card's tests, in real Python (src/python.ts).
// Passing the tests flips the card (then grade it like any other); "Show a solution" flips it too, best graded Again.
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Practice } from '../notes';
import { describe, loadPython, runPython, sameOutput, type RunResult } from '../python';
import { CodeBlock, Rich } from './Code';

type Verdict = { kind: 'run'; result: RunResult; input: string } | { kind: 'check'; passed: number; total: number; fail?: { i: number; input: string; want: string | null; result: RunResult } };

export function PracticeCard({ p, prompt, revealed, onDone }: { p: Practice; prompt: string; revealed: boolean; onDone: () => void }) {
  const [code, setCode] = useState(p.starter ? p.starter + '\n' : '');
  const [busy, setBusy] = useState<'loading' | 'running' | null>('loading');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [solution, setSolution] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { let live = true; loadPython().then(() => live && setBusy(null), e => { if (live) { setBusy(null); setFailed(String(e.message ?? e)); } }); return () => { live = false; }; }, []);

  const go = async (all: boolean) => {
    setBusy('running'); setFailed(null);
    try {
      const cases = all ? p.cases : p.cases.slice(0, 1);
      const rs = await runPython(code, cases.length ? cases : [{ input: '', output: null }], all ? p.check : '');
      if (!all) { setVerdict({ kind: 'run', result: rs[0], input: cases[0]?.input ?? '' }); return; }
      const ok = rs.map((r, i) => !r.error && (cases[i]?.output == null || sameOutput(r.output, cases[i].output!)));
      const bad = ok.indexOf(false);
      setVerdict({ kind: 'check', passed: ok.filter(Boolean).length, total: ok.length, ...(bad >= 0 ? { fail: { i: bad, input: cases[bad]?.input ?? '', want: cases[bad]?.output ?? null, result: rs[bad] } } : {}) });
      if (bad < 0) onDone();
    } catch (e) { setFailed(String((e as Error).message ?? e)); } finally { setBusy(null); }
  };

  // An editor that behaves like one: Tab indents, Enter keeps the indentation (one more level after a colon),
  // Ctrl/Cmd+Enter checks.
  const keys = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const t = e.currentTarget, { selectionStart: a, selectionEnd: b, value: v } = t;
    const put = (s: string) => { const nv = v.slice(0, a) + s + v.slice(b); setCode(nv); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = a + s.length; }); };
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); if (!busy) go(true); }
    else if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); put('    '); }
    else if (e.key === 'Enter') {
      const line = v.slice(v.lastIndexOf('\n', a - 1) + 1, a), pad = /^\s*/.exec(line)![0];
      e.preventDefault(); put('\n' + pad + (/:\s*$/.test(line) ? '    ' : ''));
    }
  };
  const shown = (s: string) => (s === '' ? '(nothing)' : s.replace(/\n$/, ''));

  return (
    <div className="practice" onClick={e => e.stopPropagation()}>
      <p className="cloze front"><Rich before={prompt} /></p>
      <textarea ref={box} className="code-editor" value={code} onChange={e => setCode(e.target.value)} onKeyDown={keys} spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
        rows={Math.max(5, code.split('\n').length + 1)} aria-label="Your Python code" placeholder="# Write your Python here" />
      <div className="practice-actions">
        <button className="btn small" disabled={!!busy} onClick={() => go(false)}>Run</button>
        <button className="btn small primary" disabled={!!busy} onClick={() => go(true)}>Check<kbd className="kbd-only">Ctrl ⏎</kbd></button>
        {!revealed && <button className="btn small ghost" onClick={() => { setSolution(true); onDone(); }}>Show a solution</button>}
        {busy && <span className="muted small">{busy === 'loading' ? 'Loading Python (the first time takes a moment)…' : 'Running…'}</span>}
      </div>
      {failed && <p className="practice-out bad">Couldn't run Python: {failed}</p>}
      {verdict?.kind === 'run' && <div className="practice-out">
        {verdict.input && <p className="muted small">With the input <code className="inline-code">{verdict.input.split('\n').join(' ⏎ ')}</code>, it printed:</p>}
        <pre>{shown(verdict.result.output)}</pre>
        {verdict.result.error && <p className="bad">{describe(verdict.result.error)}</p>}
      </div>}
      {verdict?.kind === 'check' && (verdict.fail ? <div className="practice-out bad">
        <p><b>{verdict.passed} of {verdict.total} tests passed.</b> Test {verdict.fail.i + 1}{verdict.fail.input ? <>, with the input <code className="inline-code">{verdict.fail.input.split('\n').join(' ⏎ ')}</code></> : null}:</p>
        {verdict.fail.result.error ? <p>{describe(verdict.fail.result.error)}</p> : <>
          <p className="muted small">should print</p><pre>{shown(verdict.fail.want ?? '')}</pre>
          <p className="muted small">but printed</p><pre>{shown(verdict.fail.result.output)}</pre>
        </>}
      </div> : <p className="practice-out good">✓ All {verdict.total} test{verdict.total > 1 ? 's' : ''} passed.</p>)}
      {(revealed || solution) && p.solution && <>
        <p className="muted small practice-sol">{solution ? 'One way to write it (grade this Again, and try it yourself next time):' : 'One way to write it:'}</p>
        <CodeBlock text={p.solution} lang="python" />
      </>}
    </div>
  );
}
