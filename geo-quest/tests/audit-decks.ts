// Content audit (npm run audit): parse every deck the way the app does and flag empty answers, leftover markup,
// front/back cards, headings that give the answer away, "also in" targets that don't exist, unknown languages.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseDeck } from '../src/notes';
import { parseFlow } from '../src/flow';
import { parseGraph } from '../src/graph';
import katex from 'katex';
import { parseEquations } from '../src/equations';
import { geotimeDeck, epochDeck } from '../src/geotime';
const ROOT = join(process.cwd(), 'decks');
const walk = (d: string): string[] => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.md$/.test(f) && !/README/i.test(f) ? [p] : []; });
const files: [string, string][] = walk(ROOT).map(f => ['../decks/' + f.slice(ROOT.length + 1), readFileSync(f, 'utf8')]);
files.push(['../decks/Earth history/Geologic time scale.md', geotimeDeck()], ['../decks/Earth history/Epochs of the Cenozoic.md', epochDeck()]);
const decks = files.map(([f, t]) => ({ f, d: parseDeck(f, t) }));
const issues: string[] = []; const pics = new Set<string>(); const urls = new Set<string>();
const titles = new Set(decks.map(x => x.d.title.toLowerCase()));
const ids = new Map<string, string>();
let n = 0;
// Math: every $…$, $$…$$ and derivation line must be valid TeX (KaTeX would otherwise show it in red).
const MATH = /\$\$([\s\S]+?)\$\$|\$(?=[^\s$])((?:\\\$|[^$])+?)(?<=[^\s\\])\$(?!\d)/g;
function checkTex(src: string, where: string) { try { katex.renderToString(src.replace('\u0000', '\\boxed{?}'), { throwOnError: true, strict: false }); } catch (e) { issues.push(`TEX ${where}: ${(e as Error).message.slice(0, 120)}`); } }
function checkMath(text: string, where: string) { for (const m of text.matchAll(MATH)) checkTex(m[1] ?? m[2], where); }
// A graph: every line readable, every shift and equilibrium names a curve.
function checkGraph(text: string, where: string) { for (const e of parseGraph(text).errors) issues.push(`GRAPH ${where}: ${e}`); }
function checkDerive(text: string, where: string) { for (const l of text.split('\n').filter(x => x.trim() && !/^#\s/.test(x.trim()))) checkTex(l.split('::')[0], where); }
// A flow diagram: two or more actors, and every step names one of them (a typo would draw an arrow to nowhere).
function checkFlow(text: string, where: string) {
  const { actors, steps } = parseFlow(text);
  if (actors.length < 2) issues.push(`FLOW needs two or more actors ${where}`);
  for (const s of steps) if (s.from < 0 || s.to < 0) issues.push(`FLOW step names no actor ${where}: "${s.label.slice(0, 50)}"`);
}
// Equation definitions: every formula and symbol valid TeX; every eq: tag on a card has a definition (checked below).
const eqDir = join(process.cwd(), 'equations');
const defs = existsSync(eqDir) ? readdirSync(eqDir).filter(x => x.endsWith('.md')).flatMap(x => parseEquations(readFileSync(join(eqDir, x), 'utf8'))) : [];
const defNames = new Set(defs.map(d => d.name.toLowerCase()));
for (const d of defs) {
  checkTex(d.tex, `equation ${d.name}`);
  for (const s of d.symbols) checkTex(s.sym, `equation ${d.name}, symbol`);
  if (d.example) checkMath(d.example, `equation ${d.name}, example`); else issues.push(`EQUATION no example: ${d.name}`);
  if (!d.symbols.length) issues.push(`EQUATION no symbols: ${d.name}`);
}
for (const { f, d } of decks) {
  // A lesson's flows are checked the same way; and a lesson needs cards to go with it.
  for (const m of (d.lesson ?? '').matchAll(/```flow\n([\s\S]*?)\n```/g)) checkFlow(m[1], `${f} (lesson)`);
  for (const m of (d.lesson ?? '').matchAll(/```graph\n([\s\S]*?)\n```/g)) checkGraph(m[1], `${f} (lesson)`);
  for (const m of (d.lesson ?? '').matchAll(/```derive\n([\s\S]*?)\n```/g)) checkDerive(m[1], `${f} (lesson)`);
  checkMath((d.lesson ?? '').replace(/```[\s\S]*?```/g, ''), `${f} (lesson)`);
  if (d.lesson && !d.cards.length) issues.push(`LESSON without cards ${f}`);
  // A lens deck (History of AI) has no cards of its own: other decks' cards are shown in it ("also in").
  if (!d.cards.length && !decks.some(x => x.d.cards.some(c => c.card.also?.some(t => t.toLowerCase() === d.title.toLowerCase())))) issues.push(`EMPTY deck: ${f}`);
  for (const { id, card: c } of d.cards) {
    n++;
    if (ids.has(id)) issues.push(`DUP id ${id}: ${f} & ${ids.get(id)}`); ids.set(id, f);
    const text = `${c.pre} ${c.answer} ${c.post}`;
    if (!c.answer?.trim() && !c.strata) issues.push(`NO ANSWER ${f}: ${c.pre.slice(0, 60)}`);
    if ((/\{\{|::/.test(text) || (/\}\}/.test(text) && !text.includes('$'))) && !c.front) issues.push(`MARKUP LEFT ${f}: ${text.slice(0, 80)}`); // TeX may end in }}
    if (c.front && !c.strata && !c.pictureFirst) issues.push(`FRONT/BACK ${f}: ${c.pre.slice(0, 70)}`);
    // The question must not give the answer away: an acronym answer followed by its spelled-out name, "{{DNS}} (Domain
    // Name System)", or the answer written out elsewhere on the card. The expansion belongs in the answer, shown on the flip.
    if (!c.front && !c.practice && !c.parts) {
      const acr = /^[A-Z][A-Za-z0-9-]{1,9}$/.test(c.answer.trim()) && /[A-Z].*[A-Z]/.test(c.answer);
      if (acr && /^\s*\(/.test(c.post)) issues.push(`GIVEAWAY ${f}: "${c.answer}" is spelled out right after the blank: ${c.post.slice(0, 50)}`);
      const rest = `${c.pre} ${c.post}`.toLowerCase(), a2 = c.answer.toLowerCase().replace(/^(the|a|an) /, '').replace(/[`"]/g, '');
      // (A quoted value read out of code shown on the card, `["blue", "fin"][1]` → "fin", is the skill, not a give-away.)
      if (a2.length > 2 && !/^\d+$/.test(a2) && !/^`["']/.test(c.answer.trim()) && new RegExp(`(^|[^a-z0-9])${a2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(rest)) issues.push(`GIVEAWAY ${f}: the answer "${c.answer}" also appears in the question`);
    }
    // the heading must not give the answer away
    const ans = c.answer.toLowerCase().replace(/^(the|a|an) /, '');
    if (c.context && ans.length > 3 && c.context.toLowerCase().includes(ans) && !c.strata) issues.push(`SPOILER ${f}: heading "${c.context}" ⊇ answer "${c.answer}"`);
    for (const a of c.also ?? []) if (!titles.has(a.toLowerCase())) issues.push(`ALSO-IN target missing ${f}: ${a}`);
    // Code quoted from the app (Under the hood): the file must exist and still contain the code, blank filled in, so a card
    // never teaches a line that has since changed. Spacing is ignored.
    if (c.code && /\{\{/.test(c.code.text)) issues.push(`MARKUP LEFT in code ${f}: ${c.pre.slice(0, 60)}`);
    if (c.source) {
      const path = [join(process.cwd(), c.source), join(process.cwd(), '..', c.source)].find(existsSync);
      const squash = (x: string) => x.replace(/\s+/g, ' ').trim();
      if (!path) issues.push(`SOURCE missing ${f}: ${c.source}`);
      else if (!c.code) issues.push(`SOURCE without code ${f}: ${c.pre.slice(0, 60)}`);
      else if (!squash(readFileSync(path, 'utf8')).includes(squash(c.code.text.replace('\u0000', c.answer)))) issues.push(`CODE CHANGED ${f}: ${c.source} no longer has "${squash(c.code.text.replace('\u0000', c.answer)).slice(0, 70)}"`);
    }
    // Practice cards: the solution must pass every test, run with the same runner the app uses (public/practice-runner.py);
    // and the starting code alone must not, or there'd be nothing to do.
    if (c.practice) {
      const p = c.practice;
      const run = (src: string) => {
        const r = spawnSync('python3', ['-I', join(process.cwd(), 'public/practice-runner.py')], { input: JSON.stringify({ src, cases: p.cases.length ? p.cases : [{ input: '' }], check: p.check }), encoding: 'utf8', timeout: 10000 });
        const results: { output: string; error: { type: string; message: string } | null }[] = JSON.parse(r.stdout || '[]');
        const norm = (x: string) => x.split('\n').map(l => l.trimEnd()).join('\n').replace(/\n+$/, '');
        return (p.cases.length ? p.cases : [{ input: '', output: null }]).map((k, i) => !results[i] ? 'no result' : results[i].error ? `${results[i].error!.type}: ${results[i].error!.message}` : k.output != null && norm(results[i].output) !== norm(k.output) ? `printed "${norm(results[i].output)}", not "${norm(k.output)}"` : null);
      };
      if (!p.solution) issues.push(`PRACTICE no solution ${f}: ${c.pre.slice(0, 50)}`);
      else if (!p.cases.length && !p.check) issues.push(`PRACTICE no tests ${f}: ${c.pre.slice(0, 50)}`);
      else {
        const bad = run(p.solution).map((x, i) => x && `test ${i + 1}: ${x}`).filter(Boolean);
        if (bad.length) issues.push(`PRACTICE solution fails ${f}: ${c.pre.slice(0, 40)}… ${bad.join('; ')}`);
        if (run(p.starter).every(x => !x)) issues.push(`PRACTICE starter already passes ${f}: ${c.pre.slice(0, 50)}`);
      }
    }
    if (c.eq && !defNames.has(c.eq.name.toLowerCase())) issues.push(`EQUATION undefined ${f}: "${c.eq.name}" (add it to equations/)`);
    // TeX in an answer must sit inside a formula, or it shows as raw text ("1-\alpha").
    const inMath = ((c.pre.replace(/\\\$/g, '').match(/\$/g) ?? []).length % 2) === 1;
    if (!c.code && !inMath && /\\[a-zA-Z]/.test(c.answer) && !c.answer.includes('$')) issues.push(`TEX OUTSIDE MATH ${f}: answer "${c.answer}"`);
    if (c.code?.lang === 'flow') checkFlow(c.code.text, `${f}: ${c.pre.slice(0, 40)}`);
    if (c.code?.lang === 'graph') checkGraph(c.code.text, `${f}: ${c.pre.slice(0, 40)}`);
    if (c.code?.lang === 'derive') checkDerive(c.code.text, `${f}: ${c.pre.slice(0, 40)}`);
    checkMath(`${c.pre}\u0000${c.post}`, `${f}: ${c.pre.slice(0, 40)}`); checkMath(c.answer, `${f}: ${c.pre.slice(0, 40)}`); if (c.note) checkMath(c.note, `${f} note`);
    if (c.picture?.file) pics.add(c.picture.file);
    if (c.picture?.url) urls.add(c.picture.url);
    for (const nn of c.native) if (!nn.code) issues.push(`NATIVE no lang code ${f}: ${nn.name} (${nn.lang})`);
    if (c.native.length && !c.front && ans && !c.native.some(() => true)) {}
  }
}
console.log(`${decks.length} decks, ${n} cards`);
console.log(issues.join('\n') || 'no issues');
require('fs').writeFileSync(join(process.cwd(), 'tests/.deck-pics.json'), JSON.stringify({ files: [...pics], urls: [...urls] }));
if (issues.length) process.exitCode = 1;
