import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { face, groupOf, placesIn, KIND_LABEL, layerFor, type CardRef } from '../cards';
import { answer, buildQueue, getProgress, update, learnMore, previews, Rating, recordQuiz, restoreProgress, State, unseenCount, useProgress, type Grade, type Progress } from '../srs';
import { sounds } from '../sound';
import type { Dataset } from '../types';
import { WorldMap, type MapHit, type Tone } from './WorldMap';
import { Flag, Picture } from './Picture';
import { Icon } from './Icons';
import { LocalName } from './Native';

interface Item { ref: CardRef; isNew: boolean }

/** A practice quiz: any set of cards, scored, and it does NOT change your review schedule. */
export interface QuizSpec { key: string; title: string; draw: () => CardRef[] }

function srsQueue(ds: Dataset): Item[] {
  const q = buildQueue(ds, getProgress());
  const due = q.due.map(ref => ({ ref, isNew: false }));
  const fresh = q.fresh.map(ref => ({ ref, isNew: true }));
  // Mix: a few reviews, then a new card, and so on.
  const out: Item[] = [];
  while (due.length || fresh.length) { out.push(...due.splice(0, 3)); if (fresh.length) out.push(fresh.shift()!); }
  return out;
}

export function Study({ ds, onExit, quiz, goQuiz }: { ds: Dataset; onExit: () => void; quiz?: QuizSpec; goQuiz?: () => void }) {
  const p = useProgress();
  const s = p.settings;
  const [queue, setQueue] = useState<Item[]>(() => (quiz ? quiz.draw().map(ref => ({ ref, isNew: false })) : srsQueue(ds)));
  const [total, setTotal] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tapResult, setTapResult] = useState<{ ok: boolean; hit: MapHit } | null>(null);
  const [sessionXp, setSessionXp] = useState(0);
  const [results, setResults] = useState<{ ref: CardRef; ok: boolean }[]>([]);
  const [saved, setSaved] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  // Undo: a snapshot of the session (and your progress) before each answer.
  const history = useRef<{ queue: Item[]; done: number; results: typeof results; sessionXp: number; progress: Progress }[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const item = queue[0];
  // "Find it on the map" cards can be flipped like flashcards instead of tapped (Settings → map questions).
  const rawFace = item ? face(item.ref) : null;
  const flipped = !!rawFace && rawFace.mode === 'tap' && s.mapMode !== 'tap';
  const f = rawFace && flipped ? { ...rawFace, mode: 'reveal' as const, blank: 'where?', answer: 'here' } : rawFace;
  const c = item?.ref.country;

  const restart = (items: Item[]) => {
    history.current = []; setCanUndo(false);
    setQueue(items); setTotal(items.length); setDone(0); setResults([]); setSaved(false); setRevealed(false); setTapResult(null);
  };

  const next = useCallback((grade: Grade) => {
    if (!item) return;
    history.current.push({ queue, done, results, sessionXp, progress: getProgress() });
    if (history.current.length > 30) history.current.shift();
    setCanUndo(true);
    setRevealed(false); setTapResult(null); setDone(d => d + 1);
    if (quiz) {
      setResults(r => [...r, { ref: item.ref, ok: grade >= Rating.Good }]);
      setQueue(q => q.slice(1));
      return;
    }
    const before = getProgress().xp;
    const card = answer(item.ref, grade, item.isNew);
    setSessionXp(x => x + getProgress().xp - before);
    setQueue(q => {
      const rest = q.slice(1);
      // Still in a learning step (minutes away)? Bring it back a few cards later.
      if (card.state !== State.Review && card.due.getTime() - Date.now() < 20 * 60000) {
        const pos = Math.min(rest.length, 4);
        return [...rest.slice(0, pos), { ref: item.ref, isNew: false }, ...rest.slice(pos)];
      }
      return rest;
    });
  }, [item, quiz, queue, done, results, sessionXp]);

  const undo = useCallback(() => {
    // First undo a map tap that hasn't been graded yet; otherwise go back one answer.
    if (tapResult) { setTapResult(null); setRevealed(false); return; }
    const h = history.current.pop();
    if (!h) return;
    restoreProgress(h.progress);
    setQueue(h.queue); setDone(h.done); setResults(h.results); setSessionXp(h.sessionXp); setSaved(false);
    setRevealed(false); setTapResult(null);
    setCanUndo(history.current.length > 0);
  }, [tapResult]);

  const reveal = useCallback(() => { if (!revealed) { setRevealed(true); if (s.sound) sounds.flip(); } }, [revealed, s.sound]);

  /** "I don't know" on a map question: show where it is, counted as missed. */
  const dontKnow = () => {
    if (!f || f.mode !== 'tap' || tapResult) return;
    setTapResult({ ok: false, hit: { countryId: null, name: '' } }); setRevealed(true);
    if (s.sound) sounds.flip();
  };

  const onTap = (hit: MapHit) => {
    if (!f || f.mode !== 'tap' || tapResult) return;
    // A tap on a different kind of thing (a country while looking for a river) is a slip, not an answer.
    const hitLayer = hit.countryId ? ds.byId.get(hit.countryId)?.layer : 'country';
    if (hitLayer !== c!.layer) {
      setNudge(`Tap a ${{ country: 'country', water: 'sea or ocean', river: 'river', lake: 'lake', cn: 'province' }[c!.layer]}`);
      setTimeout(() => setNudge(null), 1400);
      return;
    }
    const ok = hit.countryId === c!.id;
    setTapResult({ ok, hit }); setRevealed(true);
    if (s.sound) (ok ? sounds.right : sounds.wrong)();
  };

  // Keyboard: space/enter to reveal, 1-4 to grade.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
      if (!f) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter') && f.mode === 'reveal') { e.preventDefault(); reveal(); }
      else if (!revealed && (e.key === ' ' || e.key === 'Enter') && f.mode === 'tap') { e.preventDefault(); dontKnow(); }
      else if (revealed && !quiz && ['1', '2', '3', '4'].includes(e.key)) next(+e.key as Grade);
      else if (revealed && quiz && (e.key === '1' || e.key === '2')) next(e.key === '1' ? Rating.Again : Rating.Good);
      else if (revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); next(tapResult ? (tapResult.ok ? Rating.Good : Rating.Again) : Rating.Good); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [f, revealed, reveal, next, tapResult, quiz, undo]); // eslint-disable-line react-hooks/exhaustive-deps

  const group = c ? groupOf(c) : null;
  const regionIds = useMemo(() => (group ? placesIn(ds, group.id).map(x => x.id) : []), [ds, group]);
  const focus = useMemo(() => {
    if (!item || !f || f.map === 'none') return null;
    // Flipped map card, now revealed: fly to the answer.
    if (flipped && revealed) return { ids: c!.layer === 'country' || c!.layer === 'cn' ? [c!.id] : [c!.id], key: item.ref.id + ':r', pad: c!.layer === 'lake' ? 0.3 : c!.layer === 'river' ? 0.55 : 0.5 };
    // Seas are small inside a big region: zoom right to them. Countries/provinces show their neighbourhood.
    // Rivers & lakes: centred, with some surroundings so you can get your bearings.
    if (f.map === 'highlight') return ['water', 'river', 'lake'].includes(c!.layer)
      ? { ids: [c!.id], key: item.ref.id + ':h', pad: c!.layer === 'water' ? 0.85 : c!.layer === 'river' ? 0.55 : 0.3 }
      : { ids: [c!.id, ...regionIds], key: item.ref.id + ':h' };
    return { ids: regionIds, key: group!.id };
  }, [item, f, c, regionIds, group, flipped, revealed]);

  // Save the quiz score once, when the last card is answered.
  useEffect(() => {
    if (quiz && !item && results.length && !saved) {
      recordQuiz(quiz.key, results.filter(r => r.ok).length, results.length);
      setSaved(true);
      if (s.sound && results.filter(r => r.ok).length / results.length >= 0.9) sounds.level();
    }
  }, [quiz, item, results, saved, s.sound]);

  if (!item || !f || !c) {
    if (quiz) {
      const score = results.filter(r => r.ok).length;
      const pct = results.length ? Math.round((100 * score) / results.length) : 0;
      const best = p.quizBest[quiz.key];
      const missed = results.filter(r => !r.ok);
      return (
        <div className="study-done">
          <div className={'medal-big' + (pct >= 90 ? ' gold' : '')}><Icon name={pct >= 90 ? 'medal' : 'target'} size={44} /></div>
          <h2>{quiz.title}</h2>
          <p className="score">{score} / {results.length} <span>({pct}%)</span></p>
          {best && <p className="muted">Best: {best.best}/{best.total} ({Math.round((100 * best.best) / best.total)}%){pct >= 90 ? ' · medal earned' : ' · 90% earns a medal'}</p>}
          {missed.length > 0 && (
            <div className="missed-list">
              <b>To review</b>
              <ul>{missed.map(m => { const mf = face(m.ref); return <li key={m.ref.id}>{mf.pre}<b>{mf.answerFlag ? m.ref.country.name + "'s flag" : mf.mode === 'tap' ? m.ref.country.name : mf.answer}</b>{mf.post}</li>; })}</ul>
            </div>
          )}
          <div className="row">
            <button className="btn" onClick={() => restart(quiz.draw().map(ref => ({ ref, isNew: false })))}>Try again</button>
            <button className="btn primary" onClick={onExit}>Done</button>
          </div>
          <p className="muted small">Practice quizzes don't change your review schedule.</p>
        </div>
      );
    }
    const more = unseenCount(ds, p);
    return (
      <div className="study-done">
        <div className="medal-big"><Icon name={total ? 'check' : 'globe'} size={44} /></div>
        <h2>{total ? 'Session complete' : 'Nothing due right now'}</h2>
        <p>{total ? `${done} answers${s.gamify ? ` · +${sessionXp} XP` : ''}.` : 'Your reviews are done for now.'}</p>
        <div className="row">
          {more > 0 && <button className="btn primary" onClick={() => { learnMore(10); restart(srsQueue(ds)); }}><Icon name="plus" /> Learn {Math.min(10, more)} more</button>}
          {goQuiz && <button className="btn" onClick={goQuiz}><Icon name="target" /> Practice quiz</button>}
          <button className="btn" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  const pv = revealed && !quiz ? previews(item.ref) : null;
  const showMap = f.map !== 'none';
  const wrongName = tapResult && !tapResult.ok ? tapResult.hit.name : null;
  const extra = layerFor(c);

  const tones: Record<string, Tone> = {};
  const labels: Record<string, string> = {};
  if (f.map === 'highlight') { tones[c.id] = 'accent'; if (revealed) labels[c.id] = c.name; }
  if (flipped && revealed) { tones[c.id] = 'right'; labels[c.id] = c.name; }
  if (tapResult) {
    tones[c.id] = 'right'; labels[c.id] = c.name;
    if (!tapResult.ok && tapResult.hit.countryId) { tones[tapResult.hit.countryId] = 'wrong'; labels[tapResult.hit.countryId] = tapResult.hit.name; }
  }
  // Lock-on brackets: around the place being asked about, then ✓ / ✗ once you've answered on the map.
  const target = !s.targetBox ? null
    : tapResult ? { id: c.id, status: tapResult.ok ? 'right' as const : 'wrong' as const }
    : f.map === 'highlight' || (flipped && revealed) ? { id: c.id } : null;
  const cap = c.capitals[0];
  const pins = revealed && item.ref.kind.startsWith('capital') && cap?.lon != null ? [{ lon: cap.lon, lat: cap.lat!, label: cap.name }] : [];

  return (
    <div className={'study' + (showMap ? ' with-map' : ' no-map')}>
      <div className="study-top">
        <button className="btn ghost icon-btn" onClick={onExit} aria-label="End session"><Icon name="x" /></button>
        <div className="bar"><div style={{ width: `${(done / Math.max(1, done + queue.length)) * 100}%` }} /></div>
        <span className="count">{quiz ? `${done + 1} / ${total}` : `${queue.length} left`}</span>
        {rawFace?.mode === 'tap' && (
          <button className="btn ghost small mode-toggle" title="How map questions work (also in Settings)"
            onClick={() => { update(x => { x.settings.mapMode = x.settings.mapMode === 'tap' ? 'flip' : 'tap'; }); setTapResult(null); setRevealed(false); }}>
            <Icon name={s.mapMode === 'tap' ? 'pin' : 'book'} size={15} /> {s.mapMode === 'tap' ? 'Tap mode' : 'Flip mode'}
          </button>
        )}
        {(canUndo || tapResult) && <button className="btn ghost small undo" onClick={undo} title="Undo (⌘Z / Ctrl+Z)"><Icon name="undo" size={15} /> Undo</button>}
      </div>
      {nudge && <div className="nudge">{nudge}</div>}

      {showMap && (
        <WorldMap ds={ds} className="study-map" recenter layers={extra === 'river' ? ['lake', 'river'] : extra ? [extra] : []} hide={id => !regionIds.includes(id)} tones={tones} labels={labels} pins={pins} target={target} focus={focus}
          dim={id => !regionIds.includes(id) && ds.byId.get(id)?.layer === c.layer} onTap={f.mode === 'tap' ? onTap : undefined} />
      )}

      <div className="card-wrap">
        <article className={'card' + (revealed ? ' revealed' : '')} onClick={() => f.mode === 'reveal' && reveal()}>
          <div className="card-meta">
            {quiz ? <span>{quiz.title}</span> : <span>{group?.name}</span>}<span>{KIND_LABEL[item.ref.kind]}</span>{item.isNew && <span className="new">new</span>}
          </div>
          {f.promptFlag && <Flag file={c.flag ?? null} name="?" className="prompt-flag" size={480} eager />}
          <p className="cloze">
            {f.pre}
            {f.answerFlag
              ? (revealed ? <span className="fill"><Flag file={c.flag ?? null} name={c.name} className="answer-flag" eager /></span> : <span className="blank">{f.blank}</span>)
              : (revealed ? <span className={'fill' + (tapResult && !tapResult.ok ? ' missed' : '')}>{f.answer}</span> : <span className="blank">{f.blank}</span>)}
            {f.post}
          </p>
          {revealed && (
            <div className="local">
              {item.ref.kind.startsWith('capital') && cap ? <>
                <LocalName place={c} capital={cap} showLang />
                {item.ref.kind !== 'capital' && <LocalName place={c} showLang />}
              </> : <LocalName place={c} showLang />}
            </div>
          )}
          {wrongName && <p className="miss">You tapped <b>{wrongName}</b>.</p>}
          {revealed && f.note && <p className="note"><Icon name="info" size={15} /> {f.note}</p>}
          {revealed && s.pictures && f.picture && <Picture {...f.picture} />}
          {revealed && !f.picture && c.flag && !f.promptFlag && !f.answerFlag && s.pictures && <div className="mini-flag"><Flag file={c.flag} name={c.name} size={160} /></div>}
          {!revealed && f.mode === 'reveal' && <p className="hint">{flipped ? 'Picture where it is, then tap the card to see it on the map' : 'Tap the card to reveal'}<span className="kbd-only"> (or press space)</span></p>}
          {!revealed && f.mode === 'tap' && <div className="tap-hint">
            <p className="hint">Tap the right place on the map{regionIds.length > 1 ? ` — zoomed to ${group?.name}` : ''}</p>
            <button className="btn small" onClick={e => { e.stopPropagation(); dontKnow(); }}>I don't know<kbd className="kbd-only">space</kbd></button>
          </div>}
        </article>

        {revealed && f.mode === 'reveal' && !quiz && pv && (
          <div className="grades">
            {([[Rating.Again, 'Again'], [Rating.Hard, 'Hard'], [Rating.Good, 'Good'], [Rating.Easy, 'Easy']] as [Grade, string][]).map(([g, label]) => (
              <button key={g} className={'grade g' + g} onClick={() => next(g)}><b>{label}</b><small>{pv[g]}</small><kbd>{g}</kbd></button>
            ))}
          </div>
        )}
        {revealed && f.mode === 'reveal' && quiz && (
          <div className="grades two">
            <button className="grade g1" onClick={() => next(Rating.Again)}><b>Missed it</b><kbd>1</kbd></button>
            <button className="grade g3" onClick={() => next(Rating.Good)}><b>Knew it</b><kbd>2 · space</kbd></button>
          </div>
        )}
        {revealed && f.mode === 'tap' && (
          <div className="grades">
            {tapResult?.ok
              ? (quiz
                  ? <button className="grade g3 full" onClick={() => next(Rating.Good)}><b>Correct — next</b><kbd>space</kbd></button>
                  : <>
                      <button className="grade g3 wide" onClick={() => next(Rating.Good)}><b>Correct — next</b><small>{pv?.[Rating.Good]}</small><kbd>space</kbd></button>
                      <button className="grade g4" onClick={() => next(Rating.Easy)}><b>Too easy</b><small>{pv?.[Rating.Easy]}</small></button>
                    </>)
              : <button className="grade g1 full" onClick={() => next(Rating.Again)}><b>Got it — next</b><small>{quiz ? 'counted as missed' : 'see again soon'}</small><kbd>space</kbd></button>}
          </div>
        )}
      </div>
    </div>
  );
}
