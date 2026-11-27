// Edit a card: change a hand-written card's lines in its deck file and send the change to GitHub as a pull request.
// The owner merges it there; a GitHub Action checks it with `npm run audit` first.
import { useMemo, useState } from 'react';
import { cardBlock, cardSource, parseDeck } from '../notes';
import { checkToken, getToken, OWNER, proposeEdit, REPO, setToken, type Sent } from '../github';
import { Popup } from './Settings';
import { Icon } from './Icons';

/** How to make a fine-grained token, then a box to paste it in. Used by the editor and by Settings. */
export function TokenSetup({ onDone }: { onDone?: () => void }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [has, setHas] = useState(!!getToken());
  const save = async () => {
    setBusy(true); setErr(null);
    try { await checkToken(value.trim()); setToken(value.trim()); setHas(true); setValue(''); onDone?.(); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  if (has) return (
    <div className="token">
      <p><Icon name="check" size={16} /> This device can send edits to GitHub.</p>
      <button className="btn small" onClick={() => { setToken(null); setHas(false); }}>Remove the token from this device</button>
    </div>
  );
  return (
    <div className="token">
      <p>To send edits, the app needs a key from GitHub (a “fine-grained token”) that can change only this app's repository. You make it once:</p>
      <ol className="token-steps">
        <li>Open <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">GitHub › New fine-grained token</a> and sign in as {OWNER}.</li>
        <li><b>Token name</b>: Intelligence Quest edits. <b>Expiration</b>: 90 days, or a date up to a year away (you'll make a new one then).</li>
        <li><b>Repository access</b>: choose <i>Only select repositories</i>, then pick <b>{OWNER}/{REPO}</b>.</li>
        <li><b>Permissions</b> › Repository permissions: set <b>Contents</b> to <i>Read and write</i> and <b>Pull requests</b> to <i>Read and write</i>. Leave everything else alone.</li>
        <li>Press <b>Generate token</b>, copy it (it starts with <code>github_pat_</code>) and paste it here.</li>
      </ol>
      <label className="token-field">
        <input type="password" autoComplete="off" spellCheck={false} placeholder="github_pat_…" value={value} onChange={e => setValue(e.target.value)} />
        <button className="btn small primary" disabled={!value.trim() || busy} onClick={save}>{busy ? 'Checking…' : 'Save'}</button>
      </label>
      {err && <p className="token-err">{err}</p>}
      <p className="muted small">The token stays on this device only: it isn't in backups and goes nowhere but GitHub. Anyone using this device could send edits with it; remove it here any time.</p>
    </div>
  );
}

/** The editor for one card. `cardId` is a note card's id; cards without a deck file (built ones) can't be edited. */
export function EditCard({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const src = useMemo(() => cardSource(cardId), [cardId]);
  const lines = useMemo(() => src?.text.split('\n') ?? [], [src]);
  const [start, end] = useMemo(() => (src ? cardBlock(src.text, src.line) : [0, 0]), [src]);
  const original = lines.slice(start, end).join('\n');
  const [text, setText] = useState(original);
  const [why, setWhy] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent | null>(null);
  const [tokenOk, setTokenOk] = useState(!!getToken());

  // What the edit does to your progress: parse the deck as it would be, and look for this card's id.
  const effect = useMemo(() => {
    if (!src || text === original) return null;
    const next = [...lines.slice(0, start), ...text.split('\n'), ...lines.slice(end)].join('\n');
    const d = parseDeck(src.deck.file, next), before = src.deck.cards.filter(c => c.card.line === src.line).length;
    const after = d.cards.filter(c => c.card.line === src.line).length;
    if (!after) return { kind: 'gone' as const };
    return d.cards.some(c => c.id === cardId) ? { kind: 'keep' as const, more: after - before } : { kind: 'new' as const, more: after - before };
  }, [src, lines, start, end, text, original, cardId]);

  if (!src) return <Popup title="Edit card" onClose={onClose}><p>This card is built by the app (not written in a deck file), so it can't be edited here.</p></Popup>;
  const heading = src.deck.cards.find(c => c.id === cardId)?.card.context;
  const title = `Edit card: ${src.deck.title}${heading ? ' › ' + heading : ''}`;
  const send = async () => {
    setBusy(true); setErr(null);
    try {
      const body = [why.trim() && `**Why:** ${why.trim()}`, `**File:** \`${src.path}\`, line ${src.line}`, effect?.kind === 'new' ? '**Note:** the question\'s wording changed, so this becomes a new card (progress on the old wording is set aside).' : '**Progress:** kept (only the answer or details changed).',
        '**Before**\n```markdown\n' + original + '\n```', '**After**\n```markdown\n' + text + '\n```', '_Sent from Intelligence Quest (Edit a card). The audit runs on this pull request; merge it when it passes._'].filter(Boolean).join('\n\n');
      setSent(await proposeEdit({ path: src.path, oldText: original, newText: text, title, body, card: cardId }));
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Popup title="Edit card" onClose={onClose}>
      {sent ? (
        <div className="edit-sent">
          <p><Icon name="check" size={18} /> Sent as pull request <a href={sent.url} target="_blank" rel="noreferrer">#{sent.number}</a>.</p>
          <p className="muted small">GitHub checks it (the audit) in a minute or two. Open it and press <b>Merge</b> when the check is green; the app updates a few minutes after that.</p>
          <button className="btn primary" onClick={onClose}>Back to studying</button>
        </div>
      ) : (<>
        <p className="muted small edit-where">{src.deck.subject} › {src.deck.title}{heading ? ` › ${heading}` : ''} · <a href={`https://github.com/${OWNER}/${REPO}/blob/main/${src.path}#L${src.line}`} target="_blank" rel="noreferrer">line {src.line}</a></p>
        <textarea className="edit-text" value={text} onChange={e => setText(e.target.value)} rows={Math.min(14, Math.max(3, text.split('\n').length + 1))} spellCheck autoFocus />
        <p className={'edit-effect' + (effect?.kind === 'new' || effect?.kind === 'gone' ? ' warn' : '')}>
          {!effect ? 'Fixing an answer keeps your progress. Rewording the question makes it a new card.'
            : effect.kind === 'keep' ? 'Keeps your progress: only the answer or details change. The card comes back once to show you the fix.'
            : effect.kind === 'new' ? 'Becomes a new card: the question\'s wording changed, so it starts fresh (progress on the old wording is set aside).'
            : 'This no longer makes a card. Check the format (a line starting with "- ", blanks in {{double braces}}).'}
          {effect && effect.kind !== 'gone' && effect.more > 0 ? ` It also adds ${effect.more} card${effect.more > 1 ? 's' : ''}.` : ''}
        </p>
        <input className="edit-why" placeholder="What's wrong with it? (optional, for the pull request)" value={why} onChange={e => setWhy(e.target.value)} />
        {!tokenOk ? <TokenSetup onDone={() => setTokenOk(true)} /> : (
          <div className="row edit-actions">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" disabled={!effect || effect.kind === 'gone' || busy} onClick={send}>{busy ? 'Sending…' : 'Send for review'}</button>
          </div>
        )}
        {err && <p className="token-err">{err}</p>}
        <p className="muted small">The change goes to GitHub as a pull request; nothing changes in the app until you merge it. The repository is public, so the edit can be seen by anyone.</p>
      </>)}
    </Popup>
  );
}
