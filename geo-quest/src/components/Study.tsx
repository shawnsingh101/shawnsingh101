import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { face, groupOf, countriesIn, KIND_LABEL, type CardRef } from '../cards';
import { answer, buildQueue, getProgress, previews, Rating, State, useProgress, type Grade } from '../srs';
import { sounds } from '../sound';
import type { Dataset } from '../types';
import { WorldMap, type MapHit, type Tone } from './WorldMap';
import { Flag, Picture } from './Picture';

interface Item { ref: CardRef; isNew: boolean }

export function Study({ ds, onExit }: { ds: Dataset; onExit: () => void }) {
  const p = useProgress();
  const s = p.settings;
  // Snapshot the queue when the session starts; cards you miss come back later in the session.
  const [queue, setQueue] = useState<Item[]>(() => {
    const q = buildQueue(ds, getProgress());
    const due = q.due.map(ref => ({ ref, isNew: false }));
    const fresh = q.fresh.map(ref => ({ ref, isNew: true }));
    // Mix: a few reviews, then a new card, and so on.
    const out: Item[] = [];
    while (due.length || fresh.length) { out.push(...due.splice(0, 3)); if (fresh.length) out.push(fresh.shift()!); }
    return out;
  });
  const [done, setDone] = useState(0);
  const [total] = useState(queue.length);
  const [revealed, setRevealed] = useState(false);
  const [tapResult, setTapResult] = useState<{ ok: boolean; hit: MapHit } | null>(null);
  const [sessionXp, setSessionXp] = useState(0);
  const item = queue[0];
  const f = item ? face(item.ref) : null;
  const c = item?.ref.country;

  const next = useCallback((grade: Grade) => {
    if (!item) return;
    const before = getProgress().xp;
    const card = answer(item.ref, grade, item.isNew);
    setSessionXp(x => x + getProgress().xp - before);
    setRevealed(false); setTapResult(null); setDone(d => d + 1);
    setQueue(q => {
      const rest = q.slice(1);
      // Still in a learning step (minutes away)? Bring it back a few cards later.
      if (card.state !== State.Review && card.due.getTime() - Date.now() < 20 * 60000) {
        const pos = Math.min(rest.length, 4);
        return [...rest.slice(0, pos), { ref: item.ref, isNew: false }, ...rest.slice(pos)];
      }
      return rest;
    });
  }, [item]);

  const reveal = useCallback(() => { if (!revealed) { setRevealed(true); if (s.sound) sounds.flip(); } }, [revealed, s.sound]);

  const onTap = (hit: MapHit) => {
    if (!f || f.mode !== 'tap' || tapResult) return;
    const ok = hit.countryId === c!.id;
    setTapResult({ ok, hit }); setRevealed(true);
    if (s.sound) (ok ? sounds.right : sounds.wrong)();
  };

  // Keyboard: space/enter to reveal, 1-4 to grade.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!f) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter') && f.mode === 'reveal') { e.preventDefault(); reveal(); }
      else if (revealed && ['1', '2', '3', '4'].includes(e.key)) next(+e.key as Grade);
      else if (revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); next(tapResult ? (tapResult.ok ? Rating.Good : Rating.Again) : Rating.Good); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [f, revealed, reveal, next, tapResult]);

  const group = c ? groupOf(c) : null;
  const regionIds = useMemo(() => (group ? countriesIn(ds, group.id).map(x => x.id) : []), [ds, group]);
  const focus = useMemo(() => {
    if (!item || !f || f.map === 'none') return null;
    if (f.map === 'highlight') return { ids: [c!.id, ...regionIds], key: item.ref.id + ':h' };
    return { ids: regionIds, key: group!.id };
  }, [item, f, c, regionIds, group]);

  const tones: Record<string, Tone> = {};
  const labels: Record<string, string> = {};
  if (c && f?.map === 'highlight') { tones[c.id] = 'accent'; if (revealed) labels[c.id] = c.name; }
  if (c && tapResult) {
    tones[c.id] = 'right'; labels[c.id] = c.name;
    if (!tapResult.ok && tapResult.hit.countryId) { tones[tapResult.hit.countryId] = 'wrong'; labels[tapResult.hit.countryId] = tapResult.hit.name; }
  }
  const cap = c?.capitals[0];
  const pins = c && revealed && item.ref.kind.startsWith('capital') && cap?.lon != null ? [{ lon: cap.lon, lat: cap.lat!, label: cap.name }] : [];

  if (!item || !f || !c) {
    return (
      <div className="study-done">
        <div className="big">{total ? '🎉' : '🌍'}</div>
        <h2>{total ? 'Session complete' : 'Nothing due right now'}</h2>
        <p>{total ? `${done} answers${s.gamify ? ` · +${sessionXp} XP` : ''}. Come back tomorrow for your reviews.` : 'Pick something to learn in the Skill tree, or come back when reviews are due.'}</p>
        <button className="btn primary" onClick={onExit}>Back</button>
      </div>
    );
  }

  const pv = revealed ? previews(item.ref) : null;
  const showMap = f.map !== 'none';
  const wrongName = tapResult && !tapResult.ok ? tapResult.hit.name : null;

  return (
    <div className={'study' + (showMap ? ' with-map' : ' no-map')}>
      <div className="study-top">
        <button className="btn ghost" onClick={onExit} aria-label="End session">✕</button>
        <div className="bar"><div style={{ width: `${(done / Math.max(1, done + queue.length)) * 100}%` }} /></div>
        <span className="count">{queue.length} left</span>
      </div>

      {showMap && (
        <WorldMap ds={ds} className="study-map" tones={tones} labels={labels} pins={pins} focus={focus}
          dim={id => !regionIds.includes(id)} onTap={f.mode === 'tap' ? onTap : undefined} />
      )}

      <div className="card-wrap">
        <article className={'card' + (revealed ? ' revealed' : '')} onClick={() => f.mode === 'reveal' && reveal()}>
          <div className="card-meta">
            <span>{group?.name}</span><span>{KIND_LABEL[item.ref.kind]}</span>{item.isNew && <span className="new">new</span>}
          </div>
          {f.promptFlag && <Flag file={c.flag} name="?" className="prompt-flag" size={480} eager />}
          <p className="cloze">
            {f.pre}
            {f.answerFlag
              ? (revealed ? <span className="fill"><Flag file={c.flag} name={c.name} className="answer-flag" eager /></span> : <span className="blank">{f.blank}</span>)
              : (revealed ? <span className={'fill' + (tapResult && !tapResult.ok ? ' missed' : '')}>{f.answer}</span> : <span className="blank">{f.blank}</span>)}
            {f.post}
          </p>
          {wrongName && <p className="miss">You tapped <b>{wrongName}</b>.</p>}
          {revealed && f.note && <p className="note">ⓘ {f.note}</p>}
          {revealed && s.pictures && f.picture && <Picture {...f.picture} />}
          {revealed && !f.picture && !f.promptFlag && !f.answerFlag && s.pictures && <div className="mini-flag"><Flag file={c.flag} name={c.name} size={160} /></div>}
          {!revealed && f.mode === 'reveal' && <p className="hint">Tap the card (or press space) to reveal</p>}
          {!revealed && f.mode === 'tap' && <p className="hint">Tap the right country on the map{regionIds.length > 1 ? ` — zoomed to ${group?.name}` : ''}</p>}
        </article>

        {revealed && f.mode === 'reveal' && pv && (
          <div className="grades">
            {([[Rating.Again, 'Again'], [Rating.Hard, 'Hard'], [Rating.Good, 'Good'], [Rating.Easy, 'Easy']] as [Grade, string][]).map(([g, label]) => (
              <button key={g} className={'grade g' + g} onClick={() => next(g)}>
                <b>{label}</b><small>{pv[g]}</small>
              </button>
            ))}
          </div>
        )}
        {revealed && f.mode === 'tap' && (
          <div className="grades">
            {tapResult?.ok
              ? <>
                  <button className="grade g3 wide" onClick={() => next(Rating.Good)}><b>Correct — next</b><small>{pv?.[Rating.Good]}</small></button>
                  <button className="grade g4" onClick={() => next(Rating.Easy)}><b>Too easy</b><small>{pv?.[Rating.Easy]}</small></button>
                </>
              : <button className="grade g1 full" onClick={() => next(Rating.Again)}><b>Got it — next</b><small>see again soon</small></button>}
          </div>
        )}
      </div>
    </div>
  );
}
