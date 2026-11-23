// The search box at the top of the Library: type a word, see the cards that match across every subject, then Study
// or Quiz exactly those. Pin a search to keep it (only the words are saved, so new matching cards join it).
import { useDeferredValue, useMemo, useState } from 'react';
import { search, EXAMPLES } from '../search';
import { update, useProgress } from '../srs';
import { Icon } from './Icons';
import type { QuizSpec } from './Study';
import type { CardRef } from '../cards';
import type { Dataset } from '../types';

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export function Search({ ds, startCards, startQuiz }: { ds: Dataset; startCards: (cards: CardRef[]) => void; startQuiz: (q: QuizSpec) => void }) {
  const p = useProgress();
  const pins = p.pins ?? [];
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q.trim());
  const res = useMemo(() => (dq.length >= 2 ? search(ds, dq) : null), [ds, dq]);
  const pinned = pins.includes(dq);
  const started = res ? res.refs.filter(r => p.cards[r.id]).length : 0;
  const togglePin = () => update(x => { const cur = x.pins ?? []; x.pins = cur.includes(dq) ? cur.filter(s => s !== dq) : [...cur, dq]; });

  return (
    <div className="search">
      <label className="search-box">
        <Icon name="search" size={18} />
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search every card: Ming, Washington, juniper, era:prehistory…" aria-label="Search cards" />
        {q && <button className="linkish" onClick={() => setQ('')} aria-label="Clear">✕</button>}
      </label>
      {!q && <div className="search-chips">
        {pins.map(s => <button key={s} className="chip on" onClick={() => setQ(s)}><Icon name="pin" size={13} />{s}</button>)}
        {!pins.length && <><span className="muted small">Try</span>{EXAMPLES.map(s => <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>)}</>}
      </div>}
      {res && (
        <div className="search-results">
          {res.refs.length === 0
            ? <p className="muted small">No cards match “{dq}”. Words must all appear; filters: <code>era:</code>, <code>subject:</code>, <code>in:</code>.</p>
            : <>
              <div className="search-head">
                <span><b>{res.refs.length.toLocaleString('en-US')} card{res.refs.length === 1 ? '' : 's'}</b> in {res.byDeck.length} deck{res.byDeck.length === 1 ? '' : 's'}{started ? ` · ${started} started` : ''}</span>
                <span className="row">
                  <button className="btn small primary" onClick={() => startCards(res.refs)}><Icon name="play" size={15} /> Study</button>
                  <button className="btn small" onClick={() => startQuiz({ key: 'search:' + dq.toLowerCase(), title: `“${dq}”`, draw: () => shuffle(res.refs).slice(0, 25) })}><Icon name="target" size={15} /> Quiz</button>
                  <button className={'btn small' + (pinned ? ' on' : '')} onClick={togglePin} aria-pressed={pinned}><Icon name="pin" size={15} /> {pinned ? 'Pinned' : 'Pin'}</button>
                </span>
              </div>
              <p className="muted small">Progress counts wherever the cards are filed. Study brings in what's due and up to 20 new cards; Quiz is practice.</p>
              <div className="search-decks">
                {res.byDeck.slice(0, 12).map(h => (
                  <div key={h.node} className="search-deck">
                    <b>{h.group}</b> <small className="muted">{h.path} · {h.refs.length}</small>
                    <small className="muted examples">{[...new Set(h.refs.map(r => r.country.name))].slice(0, 5).join(' · ')}</small>
                  </div>
                ))}
                {res.byDeck.length > 12 && <p className="muted small">and {res.byDeck.length - 12} more decks</p>}
              </div>
            </>}
        </div>
      )}
    </div>
  );
}
