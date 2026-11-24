// Content audit (npm run audit): parse every deck the way the app does and flag empty answers, leftover markup,
// front/back cards, headings that give the answer away, "also in" targets that don't exist, unknown languages.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseDeck } from '../src/notes';
import { geotimeDeck, epochDeck } from '../src/geotime';
import { treeDeck } from '../src/tree';
const ROOT = join(process.cwd(), 'decks');
const walk = (d: string): string[] => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.md$/.test(f) && !/README/i.test(f) ? [p] : []; });
const files: [string, string][] = walk(ROOT).map(f => ['../decks/' + f.slice(ROOT.length + 1), readFileSync(f, 'utf8')]);
files.push(['../decks/Life/The tree of life.md', treeDeck()], ['../decks/Earth history/Geologic time scale.md', geotimeDeck()], ['../decks/Earth history/Epochs of the Cenozoic.md', epochDeck()]);
const decks = files.map(([f, t]) => ({ f, d: parseDeck(f, t) }));
const issues: string[] = []; const pics = new Set<string>(); const urls = new Set<string>();
const titles = new Set(decks.map(x => x.d.title.toLowerCase()));
const ids = new Map<string, string>();
let n = 0;
for (const { f, d } of decks) {
  // A lens deck (History of AI) has no cards of its own: other decks' cards are shown in it ("also in").
  if (!d.cards.length && !decks.some(x => x.d.cards.some(c => c.card.also?.some(t => t.toLowerCase() === d.title.toLowerCase())))) issues.push(`EMPTY deck: ${f}`);
  for (const { id, card: c } of d.cards) {
    n++;
    if (ids.has(id)) issues.push(`DUP id ${id}: ${f} & ${ids.get(id)}`); ids.set(id, f);
    const text = `${c.pre} ${c.answer} ${c.post}`;
    if (!c.answer?.trim() && !c.strata && !c.tree) issues.push(`NO ANSWER ${f}: ${c.pre.slice(0, 60)}`);
    if (/\{\{|\}\}|::/.test(text) && !c.front) issues.push(`MARKUP LEFT ${f}: ${text.slice(0, 80)}`);
    if (c.front && !c.strata && !c.tree && !c.pictureFirst) issues.push(`FRONT/BACK ${f}: ${c.pre.slice(0, 70)}`);
    // the heading must not give the answer away
    const ans = c.answer.toLowerCase().replace(/^(the|a|an) /, '');
    if (c.context && ans.length > 3 && c.context.toLowerCase().includes(ans) && !c.strata && !c.tree) issues.push(`SPOILER ${f}: heading "${c.context}" ⊇ answer "${c.answer}"`);
    for (const a of c.also ?? []) if (!titles.has(a.toLowerCase())) issues.push(`ALSO-IN target missing ${f}: ${a}`);
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
