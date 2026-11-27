// The Builder: make new cards (fill in the blank, question & answer, parts, recipe, picture) and new decks, inside
// the app. Cards for a deck in the repo go to GitHub as one pull request; a deck can instead be kept on this device
// only (private, in progress and backups) and published later.
import { useMemo, useState } from 'react';
import { DECKS, deckText, repoPath, type Deck } from '../notes';
import { SUBJECTS } from '../subjects';
import { CARD_TYPES, RECIPE_ROLE_LIST, cardLines, check, emptyDraft, insertLines, newDeckFile, newDeckText, wikiFill, wikiSearch, type CardType, type Draft, type WikiHit } from '../builder';
import { getToken, proposeChange, type Sent } from '../github';
import { reloadApp, saveDeviceDeck } from '../srs';
import { Popup } from './Settings';
import { TokenSetup } from './EditCard';
import { Icon, type IconName } from './Icons';

const ICONS: IconName[] = ['book', 'star', 'globe', 'landmark', 'music', 'image', 'drop', 'coin', 'capitol', 'temple', 'mountain', 'tree', 'layers', 'chart', 'lock', 'person', 'map', 'flame'];
const NEW = '\u0000new'; // the "New …" choice in a list

export function Builder({ onClose, deckId }: { onClose: () => void; deckId?: string }) {
  const editable = useMemo(() => DECKS.filter(d => deckText(d) !== null), []);
  const [mode, setMode] = useState<'add' | 'new'>(deckId || editable.length ? 'add' : 'new');
  // Adding to a deck
  const [deckSel, setDeckSel] = useState(deckId ?? '');
  const deck: Deck | null = mode === 'add' ? editable.find(d => d.id === deckSel) ?? null : null;
  const headings = useMemo(() => deck ? [...new Set(deck.cards.map(c => c.card.context).filter((x): x is string => !!x))] : [], [deck]);
  const [headSel, setHeadSel] = useState('');
  const [headNew, setHeadNew] = useState('');
  // A new deck
  const [subject, setSubject] = useState(SUBJECTS.find(s => s.id !== 'geography')?.name ?? '');
  const [subjectNew, setSubjectNew] = useState('');
  const [sections, setSections] = useState('');
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState<IconName>('book');
  const [intro, setIntro] = useState('');
  const [device, setDevice] = useState(false);
  // The card being written, and the ones already added to this batch
  const [d, setD] = useState<Draft>(emptyDraft());
  const [batch, setBatch] = useState<string[][]>([]);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD(x => ({ ...x, [k]: v }));
  // Wikipedia
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<WikiHit[] | null>(null);
  const [wikiBusy, setWikiBusy] = useState(false);
  // Saving
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent | null>(null);
  const [tokenOk, setTokenOk] = useState(!!getToken());

  const heading = mode === 'add' ? (headSel === NEW || !headings.length ? headNew : headSel || headings[headings.length - 1] || '') : headNew;
  const subj = subject === NEW ? subjectNew.trim() : subject;
  const local = mode === 'add' ? !!deck?.device : device;
  const cur = cardLines(d);
  const empty = !(d.sentence || d.question || d.back || d.drink || d.picture || d.parts.some(p => p.answer));
  const cards = [...batch, ...(cur.error || empty ? [] : [cur.lines])];

  // The deck file as it would be after saving (from the copy built into the app: GitHub gets the change applied fresh).
  const plan = useMemo(() => {
    if (mode === 'add') {
      if (!deck) return { error: 'Choose a deck.' };
      if (!heading.trim()) return { error: 'Choose or name the heading the card goes under.' };
      const before = deckText(deck)!, after = cards.reduce((t, c) => insertLines(t, heading, c), before);
      return { file: deck.file, before, after, ...check(deck, deck.file, before, after) };
    }
    if (!subj) return { error: 'Choose or name the subject.' };
    if (!title.trim()) return { error: 'Name the deck.' };
    if (!heading.trim()) return { error: 'Name the first heading (the topic its cards are about).' };
    const path = sections.split('/').map(s => s.trim()).filter(Boolean);
    const file = newDeckFile(subj, path, title), after = newDeckText({ title, icon, intro, heading, cards });
    const c = check(null, file, null, after);
    if (c.clash) return { error: 'There is already a deck with that name in that place. Choose another name, or add to that deck.' };
    return { file, before: null, after, ...c };
  }, [mode, deck, heading, cards, subj, title, sections, icon, intro]);

  const addToBatch = () => { if (cur.error || empty) return; setBatch(b => [...b, cur.lines]); setD(emptyDraft(d.type)); };
  const pickWiki = async (t: string) => {
    setWikiBusy(true); setErr(null);
    try {
      const w = await wikiFill(t);
      setD(x => ({ ...emptyDraft(w.picture ? 'picture' : 'qa'), ...(w.picture ? { question: x.question || 'Name it from the picture', back: w.title, picture: w.picture, caption: w.title } : { question: `What is ${w.title}?`, back: w.description }),
        note: w.description ? w.description[0].toUpperCase() + w.description.slice(1) : '', nativeName: w.native?.name ?? '', nativeLang: w.native?.lang ?? '', source: w.url }));
      setHits(null);
    } catch (e) { setErr((e as Error).message); } finally { setWikiBusy(false); }
  };
  const save = async () => {
    if ('error' in plan || !cards.length) return;
    setBusy(true); setErr(null);
    try {
      if (local) { saveDeviceDeck(plan.file, plan.after); reloadApp(); return; }
      const n = cards.length, where = mode === 'add' ? `${deck!.title} › ${heading}` : `${subj} › ${title}`;
      const titleLine = mode === 'add' ? `Add ${n} card${n > 1 ? 's' : ''}: ${where}` : `New deck: ${where}`;
      const body = [`**File:** \`${repoPath(plan.file)}\``, '**Cards**\n```markdown\n' + cards.map(c => c.join('\n')).join('\n') + '\n```', '_Made in Intelligence Quest (Builder). The audit runs on this pull request; merge it when it passes._'].join('\n\n');
      const deckLines = cards;
      setSent(await proposeChange({ path: repoPath(plan.file), title: titleLine, body, apply: current => {
        if (mode === 'add') { if (current === null) throw new Error('That deck is no longer on GitHub.'); return deckLines.reduce((t, c) => insertLines(t, heading, c), current); }
        if (current !== null) throw new Error('A deck with that name was just added on GitHub. Choose another name.');
        return plan.after;
      } }));
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  if (sent) return (
    <Popup title="New cards" onClose={onClose}>
      <div className="edit-sent">
        <p><Icon name="check" size={18} /> Sent as pull request <a href={sent.url} target="_blank" rel="noreferrer">#{sent.number}</a>.</p>
        <p className="muted small">GitHub checks it in a minute or two. Open it and press <b>Merge</b> when the check is green; the cards appear in the app a few minutes after that.</p>
        <button className="btn primary" onClick={onClose}>Done</button>
      </div>
    </Popup>
  );

  const field = (k: 'sentence' | 'answer' | 'hint' | 'question' | 'back' | 'drink' | 'picture' | 'caption' | 'note' | 'nativeName' | 'nativeLang' | 'source', label: string, ph = '', area = false) => (
    <label className="b-field"><span>{label}</span>{area ? <textarea rows={2} value={d[k]} placeholder={ph} onChange={e => set(k, e.target.value)} /> : <input value={d[k]} placeholder={ph} onChange={e => set(k, e.target.value)} />}</label>
  );
  const bySubject = SUBJECTS.map(s => ({ s, decks: editable.filter(x => x.subject === s.name || (s.sections().includes(x.subject))) })).filter(x => x.decks.length);

  return (
    <Popup title="New cards" onClose={onClose}>
      <div className="seg b-mode">
        <button className={mode === 'add' ? 'on' : ''} onClick={() => setMode('add')} disabled={!editable.length}>Add to a deck</button>
        <button className={mode === 'new' ? 'on' : ''} onClick={() => setMode('new')}>New deck</button>
      </div>

      {mode === 'add' ? (<>
        <label className="b-field"><span>Deck</span>
          <select value={deckSel} onChange={e => { setDeckSel(e.target.value); setHeadSel(''); }}>
            <option value="">Choose a deck…</option>
            {bySubject.map(({ s, decks }) => <optgroup key={s.id} label={s.name}>{decks.map(x => <option key={x.id} value={x.id}>{[...x.path, x.title].join(' › ')}{x.device ? ' (this device)' : ''}</option>)}</optgroup>)}
          </select>
        </label>
        {deck && <label className="b-field"><span>Under the heading</span>
          {headings.length > 0 && <select value={headSel || headings[headings.length - 1]} onChange={e => setHeadSel(e.target.value)}>
            {headings.map(h => <option key={h} value={h}>{h}</option>)}<option value={NEW}>New heading…</option>
          </select>}
          {(headSel === NEW || !headings.length) && <input value={headNew} placeholder="A neutral topic, e.g. “Which spirit?”" onChange={e => setHeadNew(e.target.value)} />}
        </label>}
      </>) : (<>
        <div className="b-row">
          <label className="b-field"><span>Subject</span>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              {SUBJECTS.filter(s => s.id !== 'geography' && !/^(Live topics|Equations)$/.test(s.name)).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}<option value={NEW}>New subject…</option>
            </select>
            {subject === NEW && <input value={subjectNew} placeholder="e.g. Astronomy" onChange={e => setSubjectNew(e.target.value)} />}
          </label>
          <label className="b-field"><span>Section <small>(optional)</small></span><input value={sections} placeholder="e.g. Cocktails / Stirred" onChange={e => setSections(e.target.value)} /></label>
        </div>
        <label className="b-field"><span>Deck name</span><input value={title} placeholder="e.g. Tiki drinks" onChange={e => setTitle(e.target.value)} /></label>
        <div className="b-field"><span>Icon</span>
          <div className="b-icons" role="radiogroup" aria-label="Icon">{ICONS.map(i => <button key={i} role="radio" aria-checked={icon === i} className={icon === i ? 'on' : ''} onClick={() => setIcon(i)} title={i}><Icon name={i} size={18} /></button>)}</div>
        </div>
        <label className="b-field"><span>One line about it <small>(optional)</small></span><input value={intro} onChange={e => setIntro(e.target.value)} /></label>
        <label className="b-field"><span>First heading</span><input value={headNew} placeholder="The topic its first cards are about" onChange={e => setHeadNew(e.target.value)} /></label>
        <label className="b-check"><input type="checkbox" checked={device} onChange={e => setDevice(e.target.checked)} /> Keep this deck on this device only (private: not on GitHub, kept in your backups; you can publish it later)</label>
      </>)}

      <details className="b-wiki">
        <summary><Icon name="search" size={15} /> Add from Wikipedia</summary>
        <div className="b-wiki-row">
          <input value={q} placeholder="A name: Negroni, Mona Lisa, Ada Lovelace…" onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && q.trim()) { setWikiBusy(true); wikiSearch(q).then(setHits).catch(x => setErr(x.message)).finally(() => setWikiBusy(false)); } }} />
          <button className="btn small" disabled={!q.trim() || wikiBusy} onClick={() => { setWikiBusy(true); wikiSearch(q).then(setHits).catch(x => setErr(x.message)).finally(() => setWikiBusy(false)); }}>{wikiBusy ? '…' : 'Search'}</button>
        </div>
        {hits && (hits.length ? <ul className="b-hits">{hits.map(h => <li key={h.title}><button onClick={() => pickWiki(h.title)}>{h.thumb ? <img src={h.thumb} alt="" /> : <span className="b-nothumb" />}<span><b>{h.title}</b><small>{h.description}</small></span></button></li>)}</ul> : <p className="muted small">Nothing found.</p>)}
        <p className="muted small">Fills in the card with the title, picture, description and its name in its own language; adjust anything before saving.</p>
      </details>

      <div className="b-types" role="tablist" aria-label="Kind of card">
        {CARD_TYPES.map(([t, l, hint]) => <button key={t} role="tab" aria-selected={d.type === t} className={'pick' + (d.type === t ? ' on' : '')} title={hint} onClick={() => set('type', t as CardType)}>{l}</button>)}
      </div>
      <div className="b-card">
        {d.type === 'cloze' && <>{field('sentence', 'The sentence', 'A Negroni is equal parts gin, Campari and sweet vermouth.', true)}{field('answer', 'Words to hide', 'Campari')}{field('hint', 'What kind of answer? (optional)', 'which liqueur?')}</>}
        {d.type === 'qa' && <>{field('question', 'Question', 'What glass is a Negroni served in?')}{field('back', 'Answer', 'A rocks glass')}<label className="b-check"><input type="checkbox" checked={d.both} onChange={e => set('both', e.target.checked)} /> Ask it both ways</label></>}
        {d.type === 'parts' && <>{field('question', 'Question', 'The three steps of a treaty')}
          <div className="b-list">{d.parts.map((p, i) => <div key={i} className="b-list-row">
            <input value={p.cue} placeholder={`Cue ${i + 1} (optional)`} onChange={e => set('parts', d.parts.map((x, j) => j === i ? { ...x, cue: e.target.value } : x))} />
            <input value={p.answer} placeholder={`Part ${i + 1}`} onChange={e => set('parts', d.parts.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} />
            {d.parts.length > 2 && <button className="btn ghost small" aria-label="Remove" onClick={() => set('parts', d.parts.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button>}
          </div>)}</div>
          {d.parts.length < 5 && <button className="btn small ghost" onClick={() => set('parts', [...d.parts, { cue: '', answer: '' }])}><Icon name="plus" size={14} /> Another part</button>}
          <label className="b-check"><input type="checkbox" checked={d.anyOrder} onChange={e => set('anyOrder', e.target.checked)} /> Any order (a set, not a sequence)</label></>}
        {d.type === 'recipe' && <>{field('drink', 'The drink', 'Negroni')}
          <div className="b-list">{d.recipe.map((r, i) => <div key={i} className="b-list-row">
            <select value={r.role} onChange={e => set('recipe', d.recipe.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}>{RECIPE_ROLE_LIST.map(x => <option key={x}>{x}</option>)}</select>
            <input value={r.text} placeholder={['method', 'glass', 'garnish', 'rim'].includes(r.role) ? 'e.g. stirred' : 'e.g. 1 oz gin'} onChange={e => set('recipe', d.recipe.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} />
            <button className="btn ghost small" aria-label="Remove" onClick={() => set('recipe', d.recipe.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button>
          </div>)}</div>
          {d.recipe.length < 10 && <button className="btn small ghost" onClick={() => set('recipe', [...d.recipe, { role: 'other', text: '' }])}><Icon name="plus" size={14} /> Another line</button>}</>}
        {d.type === 'picture' && <>{field('picture', 'Picture', 'A Wikimedia Commons file name, or an image address')}{field('question', 'Question', 'Name it from the picture')}{field('back', 'Answer', 'Negroni')}</>}
        <details className="b-more">
          <summary>More: {d.type !== 'picture' ? 'picture, ' : ''}note, own-language name, source</summary>
          {d.type !== 'picture' && field('picture', 'Picture (optional)', 'A Wikimedia Commons file name, or an image address')}
          {d.picture && field('caption', 'Picture caption', '')}
          {field('note', 'Note shown after the answer', 'A little context: dates, who made it…')}
          <div className="b-row">{field('nativeName', 'Name in its own language', 'Milano')}{field('nativeLang', 'Language', 'Italian')}</div>
          {field('source', 'Source', 'https://… (shown on the back)')}
        </details>
      </div>

      {(cur.error && !empty) && <p className="edit-effect warn">{cur.error}</p>}
      <div className="row b-batch-actions">
        <button className="btn small" disabled={!!cur.error || empty} onClick={addToBatch}><Icon name="plus" size={14} /> Add and write another</button>
        {batch.length > 0 && <span className="muted small">{batch.length} card{batch.length > 1 ? 's' : ''} ready</span>}
      </div>
      {cards.length > 0 && <details className="b-preview"><summary>What will be saved</summary><pre>{(mode === 'add' ? `## ${heading}\n` : '') + cards.map(c => c.join('\n')).join('\n')}</pre></details>}
      {'error' in plan ? <p className="edit-effect warn">{plan.error}</p>
        : cards.length > 0 && <p className={'edit-effect' + (plan.leaks.length ? ' warn' : '')}>
          {plan.added > 0 ? `Makes ${plan.added} card${plan.added > 1 ? 's' : ''}.` : 'This doesn’t make a card yet: check the format.'}
          {plan.leaks.length > 0 && ` The question gives away “${plan.leaks[0]}”: hide every place it appears, or reword.`}
        </p>}
      {!local && !tokenOk ? <TokenSetup onDone={() => setTokenOk(true)} /> : (
        <div className="row edit-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={'error' in plan || !cards.length || plan.added < 1 || busy} onClick={save}>{busy ? 'Sending…' : local ? 'Save on this device' : 'Send for review'}</button>
        </div>
      )}
      {err && <p className="token-err">{err}</p>}
      <p className="muted small">{local ? 'Kept on this device and in your backups only. The app restarts to load it.' : 'Saved to GitHub as a pull request for you to merge. The repository is public: anyone can see these cards, so keep private notes in a device-only deck.'}</p>
    </Popup>
  );
}
