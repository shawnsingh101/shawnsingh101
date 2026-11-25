// Equation definitions (geo-quest/equations/<Subject>.md): each equation's formula, what every symbol means, and a worked
// example with real numbers. Shown on the back of every card tagged with that equation (`eq:`), and on its page under
// Equations. Defined once here, so the explanation is the same wherever the equation turns up.
export interface EquationDef { name: string; tex: string; symbols: { sym: string; meaning: string }[]; example: string | null }

export function parseEquations(text: string): EquationDef[] {
  const out: EquationDef[] = [];
  let cur: EquationDef | null = null;
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    const h = /^##\s+(.+)$/.exec(l);
    if (h) { cur = { name: h[1].trim(), tex: '', symbols: [], example: null }; out.push(cur); continue; }
    if (!cur || !l) continue;
    const sym = /^-\s+(.+?)\s+\|\s+(.+)$/.exec(l);
    if (sym) { cur.symbols.push({ sym: sym[1], meaning: sym[2] }); continue; }
    const ex = /^example:\s*(.+)$/i.exec(l);
    if (ex) { cur.example = ex[1]; continue; }
    if (!cur.tex) cur.tex = l;
  }
  return out;
}

let files: Record<string, string> = {};
try { files = import.meta.glob('../equations/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>; } catch { /* not built by Vite */ }
export const EQUATION_DEFS = new Map(Object.values(files).flatMap(parseEquations).map(d => [d.name.toLowerCase(), d]));
export const equationDef = (name: string) => EQUATION_DEFS.get(name.toLowerCase());
