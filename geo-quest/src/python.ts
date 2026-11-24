// Python in the browser, for practice cards: real Python (Pyodide), loaded from the app's own pyodide/ folder (copied in
// at build time from the pinned npm package; see vite.config.ts) the first time it's needed, run in a worker so a never-ending loop can be stopped. The same runner (public/practice-runner.py) checks the decks'
// solutions in the audit, so what passes there passes here.
// Full addresses: the worker resolves them from its own location, not the page's.
const here = (path: string) => new URL(import.meta.env.BASE_URL + path, location.href).href;

export interface RunError { type: string; message: string; line: number | null; inCheck?: boolean }
export interface RunResult { output: string; error: RunError | null }
export interface Case { input: string; output: string | null }

let worker: Worker | null = null, loading: Promise<unknown> | null = null, seq = 0;
const waiting = new Map<number, (r: { results?: RunResult[]; failed?: string }) => void>();
const stop = () => { worker?.terminate(); worker = null; loading = null; };
function send(msg: object, limit: number, onTimeout: () => RunResult[]): Promise<RunResult[]> {
  if (!worker) { worker = new Worker(import.meta.env.BASE_URL + 'py-worker.js', { type: 'module' }); worker.onmessage = ({ data }) => { waiting.get(data.id)?.(data); waiting.delete(data.id); }; }
  const id = ++seq, w = worker;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { waiting.delete(id); stop(); try { resolve(onTimeout()); } catch (e) { reject(e); } }, limit);
    waiting.set(id, r => { clearTimeout(timer); if (r.failed) { stop(); reject(new Error(r.failed)); } else resolve(r.results!); });
    w.postMessage({ ...msg, id, indexURL: here('pyodide/'), runnerURL: here('practice-runner.py') });
  });
}
/** Load Python (about 13 MB, once; the browser caches it). Called when a practice card opens, so it's ready to run. */
export function loadPython() {
  return (loading ??= send({ init: true }, 120000, () => { throw new Error('Python took too long to load: check your connection'); }).catch(e => { loading = null; throw e; }));
}

/** Run a program against each case (its input lines). Stops it after `limit` ms: an endless loop gives a TimeoutError. */
export async function runPython(src: string, cases: Case[], check = '', limit = 5000): Promise<RunResult[]> {
  await loadPython();
  return send({ src, cases, check }, limit, () => cases.map(() => ({ output: '', error: { type: 'TimeoutError', message: 'your program took too long: is there a loop that never ends?', line: null } })));
}

/** Printed output, compared fairly: spaces at the ends of lines and blank lines at the end don't count. */
export const sameOutput = (got: string, want: string) => {
  const norm = (s: string) => s.replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').replace(/\n+$/, '');
  return norm(got) === norm(want);
};
/** "NameError on line 2: name 'nme' is not defined" */
export const describe = (e: RunError) => `${e.type}${e.line ? ` on line ${e.line}` : ''}${e.inCheck ? ' (in the check)' : ''}: ${e.message}`;
