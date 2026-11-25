// The back of an equation card: what every symbol means, then a worked example with real numbers (src/equations.ts).
import type { EquationDef } from '../equations';
import { Rich, tex } from './Code';

export function EquationPanel({ def, showFormula }: { def: EquationDef; showFormula?: boolean }) {
  return (
    <div className="eqdef" onClick={e => e.stopPropagation()}>
      {showFormula && <span className="math-display" dangerouslySetInnerHTML={{ __html: tex(def.tex, true) }} />}
      {def.symbols.length > 0 && <dl className="eqdef-symbols">
        {def.symbols.map(s => <div key={s.sym}><dt dangerouslySetInnerHTML={{ __html: tex(s.sym, false) }} /><dd><Rich before={s.meaning} /></dd></div>)}
      </dl>}
      {def.example && <p className="eqdef-example"><b>Example</b> <Rich before={def.example} /></p>}
    </div>
  );
}
