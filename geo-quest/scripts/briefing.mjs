#!/usr/bin/env node
// The weekly briefing's input: for every live-topic deck (front matter `follows:` and `checked:`), what changed in the
// Wikipedia articles it follows since it was last checked, plus the deck's "as of" cards, which may need updating.
//
//   node scripts/briefing.mjs            → Markdown on stdout
//
// Only text that has stood for a week counts: it compares each article as it was a week before the last check with how
// it was a week ago. Fresh edits to articles on ongoing events are often early reports, disputed or vandalism; a week
// filters most of that out, and the next check still picks up whatever survives. Read by the weekly briefing session
// (GUIDELINES.md, "Live topics"), which writes at most two new cards a week across all decks and opens a pull request.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)';
const LAG = 7 * 864e5;

async function api(params) {
  const u = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  for (let attempt = 1; attempt <= 6; attempt++) {
    try { const r = await fetch(u, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) }); if (r.ok) return await r.json(); console.error(`Wikipedia answered ${r.status}, retry ${attempt}/6`); }
    catch (e) { console.error(`Wikipedia unreachable (${e.message}), retry ${attempt}/6`); }
    await new Promise(res => setTimeout(res, 15000 * attempt));
  }
  throw new Error('Wikipedia could not be reached');
}
/** The article's text as it stood at a moment (the last revision before it). */
async function textAt(title, when) {
  const q = await api({ action: 'query', prop: 'revisions', titles: title, redirects: '1', rvlimit: '1', rvdir: 'older', rvstart: when.toISOString(), rvprop: 'ids|timestamp|content', rvslots: 'main' });
  const rev = q.query.pages[0]?.revisions?.[0];
  return rev ? { id: rev.revid, at: rev.timestamp, text: rev.slots.main.content } : null;
}
/** Wikitext → readable paragraphs: no references, templates, tables, files or markup. */
function paragraphs(wt) {
  let s = wt.replace(/<!--[\s\S]*?-->/g, '').replace(/<ref[^>]*\/>/g, '').replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
  for (let prev = ''; prev !== s;) { prev = s; s = s.replace(/\{\{[^{}]*\}\}/g, '').replace(/\{\|[^{}]*?\|\}/g, ''); }
  s = s.replace(/\[\[(?:File|Image|Category):[^\]]*(?:\[\[[^\]]*\]\][^\]]*)*\]\]/gi, '').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/\[https?:\/\/\S+ ([^\]]*)\]/g, '$1').replace(/<[^>]+>/g, '').replace(/'{2,}/g, '');
  let section = '';
  const out = [];
  for (const line of s.split('\n')) {
    const h = /^(=+)\s*(.*?)\s*\1$/.exec(line.trim());
    if (h) { section = h[2]; continue; }
    const t = line.replace(/\s+/g, ' ').trim();
    if (t.length > 40 && !/^[|!*#:;{]/.test(t)) out.push({ section, text: t });
  }
  return out;
}

const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.md$/.test(f) && !/README/i.test(f) ? [p] : []; });
const decks = walk(join(ROOT, 'decks')).map(file => {
  const text = readFileSync(file, 'utf8'), fm = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
  const meta = Object.fromEntries(fm.split('\n').map(l => /^(\w+):\s*(.*)$/.exec(l)).filter(Boolean).map(m => [m[1], m[2].trim()]));
  const lines = text.split('\n');
  const asOf = lines.flatMap((l, i) => (/^as of:/i.test(l.trim()) ? [`${lines[i - 1].trim().replace(/^- /, "")}  (${l.trim()})`] : []));
  return { file: relative(ROOT, file), title: meta.title, follows: (meta.follows ?? '').split(';').map(s => s.trim()).filter(Boolean), checked: meta.checked, asOf };
}).filter(d => d.follows.length);

const now = new Date();
console.log(`# Weekly briefing input, ${now.toISOString().slice(0, 10)}\n`);
console.log('Text that stood for a week: each article a week before its deck was last checked, compared with the article a week ago.\n');
for (const d of decks) {
  const since = new Date(new Date(d.checked ?? now.toISOString().slice(0, 10)).getTime() - LAG), until = new Date(now.getTime() - LAG);
  console.log(`## ${d.title}  (${d.file})\nLast checked ${d.checked ?? 'never'}; comparing ${since.toISOString().slice(0, 10)} → ${until.toISOString().slice(0, 10)}.\n`);
  console.log(`### Its "as of" cards (update any that are no longer true)\n${d.asOf.map(a => `- ${a}`).join('\n') || '(none)'}\n`);
  for (const title of d.follows) {
    try {
      const [a, b] = [await textAt(title, since), await textAt(title, until)];
      if (!b) { console.log(`### ${title}\n(no such article)\n`); continue; }
      const before = new Set((a ? paragraphs(a.text) : []).map(p => p.text));
      const after = paragraphs(b.text);
      const added = after.filter(p => !before.has(p.text));
      const kept = new Set(after.map(p => p.text));
      const removed = a ? paragraphs(a.text).filter(p => !kept.has(p.text)) : [];
      console.log(`### ${title}\nRevisions ${a?.id ?? '(none)'} (${a?.at ?? '-'}) → ${b.id} (${b.at}): ${added.length} paragraphs new or changed, ${removed.length} gone or changed.\n`);
      for (const p of added.slice(0, 40)) console.log(`+ [${p.section || 'lead'}] ${p.text.slice(0, 900)}\n`);
      if (added.length > 40) console.log(`(…${added.length - 40} more)\n`);
      if (removed.length) console.log(`Gone or reworded (first lines): ${removed.slice(0, 15).map(p => `[${p.section || 'lead'}] ${p.text.slice(0, 160)}`).join(' | ')}\n`);
      await new Promise(res => setTimeout(res, 3000));
    } catch (e) { console.log(`### ${title}\n(could not read it: ${e.message})\n`); }
  }
}
