import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ClipPlayer, MusicReveal } from './Music';
import { face, groupOf, placesIn, GROUPS, KIND_LABEL, LAYER_NOUN, layerFor, sectionChain, type CardRef } from '../cards';
const m0Layer = (c: { layer: string }) => c.layer;
import { answer, buildQueue, queueForCards, getProgress, update, learnMore, previews, Rating, recordQuiz, restoreProgress, State, unseenCount, useProgress, type Grade, type Progress } from '../srs';
import { sounds } from '../sound';
import type { Dataset } from '../types';
import { WorldMap, type MapHit, type Tone } from './WorldMap';
import { Flag, Picture } from './Picture';
import { Icon } from './Icons';
import { LocalName } from './Native';
import { Portrait, Incoming } from './Portrait';
import { Lookalikes } from './Lookalikes';
import { Inset } from './Inset';
import { Related } from './Related';
import { commonsUrl } from '../data';
import { StrataCard } from './GeoTime';
import { PlaceSheet } from '../views/Atlas';

interface Item { ref: CardRef; isNew: boolean }

/** A practice quiz: any set of cards, scored, and it does NOT change your review schedule. */
export interface QuizSpec { key: string; title: string; draw: () => CardRef[] }

function srsQueue(ds: Dataset, nodes?: string[], cards?: CardRef[]): Item[] {
  const q = cards ? queueForCards(getProgress(), cards) : buildQueue(ds, getProgress(), nodes);
  const due = q.due.map(ref => ({ ref, isNew: false }));
  const fresh = q.fresh.map(ref => ({ ref, isNew: true }));
  // Mix: a few reviews, then a new card, and so on.
  const out: Item[] = [];
  while (due.length || fresh.length) { out.push(...due.splice(0, 3)); if (fresh.length) out.push(fresh.shift()!); }
  return out;
}

export function Study({ ds, onExit: exit, quiz, goQuiz, nodes, cards }: { ds: Dataset; onExit: () => void; quiz?: QuizSpec; goQuiz?: () => void; nodes?: string[]; cards?: CardRef[] }) {
  const p = useProgress();
  const s = p.settings;
  const onExit = () => { if (s.sound) sounds.back(); exit(); };
  const [queue, setQueue] = useState<Item[]>(() => (quiz ? quiz.draw().map(ref => ({ ref, isNew: false })) : srsQueue(ds, nodes, cards)));
  const [total, setTotal] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tapResult, setTapResult] = useState<{ ok: boolean; hit: MapHit } | null>(null);
  const [sessionXp, setSessionXp] = useState(0);
  const [results, setResults] = useState<{ ref: CardRef; ok: boolean }[]>([]);
  const [saved, setSaved] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  const [sheet, setSheet] = useState<string | null>(null); // a related place opened from the card
  const [peek, setPeek] = useState(false);
  const wide = useWide(); // the answer map: every answer in this deck, session paused
  // Undo: a snapshot of the session (and your progress) before each answer.
  const history = useRef<{ queue: Item[]; done: number; results: typeof results; sessionXp: number; progress: Progress }[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const item = queue[0];
  // A shuffle as the deck comes out (once per session).
  useEffect(() => { if (s.sound && queue.length) sounds.shuffle(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // "Find it on the map" cards can be flipped like flashcards instead of tapped (Settings → map questions).
  const rawFace = item ? face(item.ref) : null;
  const flipped = !!rawFace && rawFace.mode === 'tap' && s.mapMode !== 'tap';
  const f = rawFace && flipped ? { ...rawFace, mode: 'reveal' as const, blank: rawFace.blank.startsWith('where?') ? 'where?' : rawFace.blank.replace(/^tap the /, 'which ') + '?', answer: rawFace.answer === 'right here' ? 'here' : rawFace.answer } : rawFace;
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
    if (s.sound && queue.length > 1) sounds.deal(); // the next card lands
    if (quiz) {
      setResults(r => [...r, { ref: item.ref, ok: grade >= Rating.Hard }]);
      setQueue(q => q.slice(1));
      // A quiz answer also counts as a review for cards you're already learning (it never adds new cards).
      const rec = getProgress().cards[item.ref.id];
      if (rec && rec.c.state !== State.New) answer(item.ref, grade, false);
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
  }, [item, quiz, queue, done, results, sessionXp, s.sound]);

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
    if (hitLayer !== mp!.layer) {
      setNudge(`Tap a ${{ note: 'card', sub: c?.noun ?? 'region', country: 'country', water: 'sea or ocean', river: 'river', lake: 'lake', cn: 'province', us: 'state', senate: 'state', terr: 'territory', site: 'site', peak: 'mountain', range: 'mountain range', art: 'work', road: 'highway', desert: 'desert', person: 'person' }[mp!.layer]}`);
      setTimeout(() => setNudge(null), 1400);
      return;
    }
    const ok = hit.countryId === mp!.id;
    setTapResult({ ok, hit }); setRevealed(true);
    if (s.sound) (ok ? sounds.right : sounds.wrong)();
  };

  // Keyboard: space/enter to reveal, 1-4 to grade.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (peek) { if (e.key === 'Escape') setPeek(false); return; } // paused while the answer map is open
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
      if (!f) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter') && f.mode === 'reveal') { e.preventDefault(); reveal(); }
      else if (!revealed && (e.key === ' ' || e.key === 'Enter') && f.mode === 'tap') { e.preventDefault(); dontKnow(); }
      // 1 Again · 2 Hard · 3 Good · 4 Easy (space = Good), like Anki. A missed map tap can only be "Again".
      else if (revealed && ['1', '2', '3', '4'].includes(e.key)) next((tapResult && !tapResult.ok ? Rating.Again : +e.key) as Grade);
      else if (revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); next(tapResult ? (tapResult.ok ? Rating.Good : Rating.Again) : Rating.Good); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [f, revealed, reveal, next, tapResult, quiz, undo, peek]); // eslint-disable-line react-hooks/exhaustive-deps

  // The place shown on the map: itself, or for a senator, their state.
  const mp = c ? (c.layer === 'senate' ? ds.byId.get(c.place ?? c.state!) ?? c : item.ref.kind === 'siteCountry' || item.ref.kind === 'artWhere' || item.ref.kind === 'personBorn' ? ds.byId.get(c.country!) ?? c : c) : null;
  const group = c ? groupOf(c) : null;
  const regionIds = useMemo(() => (group ? placesIn(ds, group.id).map(x => x.id) : []), [ds, group]);
  // For "reveal" map cards (capitals, cities) start wider than the region so the map doesn't give it away:
  // all 50 states, or the whole continent.
  const wideIds = useMemo(() => (group ? GROUPS.filter(g => g.section === group.section && g.layer === group.layer).flatMap(g => placesIn(ds, g.id).map(x => x.id)) : []), [ds, group]);
  const focus = useMemo(() => {
    if (!item || !f || f.map === 'none') return null;
    if (f.map === 'reveal') return revealed
      ? { ids: [mp!.id], key: item.ref.id + ':r', keepCenter: true, pad: 0.5 }
      : { ids: wideIds, key: (group?.section ?? '') + ':wide' };
    // Flipped map card, now revealed: fly to the answer.
    if (flipped && revealed) return { ids: [mp!.id], key: item.ref.id + ':r', keepCenter: true, pad: c!.layer === 'lake' ? 0.3 : c!.layer === 'river' ? 0.55 : 0.5 };
    // Seas are small inside a big region: zoom right to them. Countries/provinces show their neighbourhood.
    // Rivers & lakes: centred, with some surroundings so you can get your bearings.
    if (f.map === 'highlight') return ['water', 'river', 'lake', 'range', 'road', 'desert'].includes(c!.layer)
      ? { ids: [c!.id], key: item.ref.id + ':h', pad: c!.layer === 'water' ? 0.85 : c!.layer === 'river' || c!.layer === 'range' || c!.layer === 'road' || c!.layer === 'desert' ? 0.55 : 0.3 }
      : { ids: [mp!.id, ...regionIds], key: item.ref.id + ':h' };
    return { ids: regionIds, key: group!.id };
  }, [item, f, c, mp, regionIds, wideIds, group, flipped, revealed]);

  // Save the quiz score once, when the last card is answered.
  useEffect(() => {
    if (quiz && !item && results.length && !saved) {
      recordQuiz(quiz.key, results.filter(r => r.ok).length, results.length);
      setSaved(true);
      if (s.sound) (results.filter(r => r.ok).length / results.length >= 0.9 ? sounds.medal : sounds.level)();
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
              <ul>{missed.map(m => { const mf = face(m.ref); return <li key={m.ref.id}>{mf.pre}{mf.frontBack ? ' → ' : ''}<b>{mf.answerFlag ? m.ref.country.name + "'s flag" : mf.mode === 'tap' ? m.ref.country.name : mf.answer}</b>{mf.post}</li>; })}</ul>
            </div>
          )}
          <div className="row">
            <button className="btn" onClick={() => restart(quiz.draw().map(ref => ({ ref, isNew: false })))}>Try again</button>
            <button className="btn primary" onClick={onExit}>Done</button>
          </div>
          <p className="muted small">Quizzes don't add new cards to your schedule; answers on cards you're already learning count as reviews.</p>
        </div>
      );
    }
    const more = cards ? queueForCards(p, cards, Infinity).fresh.length : unseenCount(ds, p, nodes);
    return (
      <div className="study-done">
        <div className="medal-big"><Icon name={total ? 'check' : 'globe'} size={44} /></div>
        <h2>{total ? 'Session complete' : 'Nothing due right now'}</h2>
        <p>{total ? `${done} answers${s.gamify ? ` · +${sessionXp} XP` : ''}.` : 'Your reviews are done for now.'}</p>
        <div className="row">
          {more > 0 && <button className="btn primary" onClick={() => { if (!cards) learnMore(10); restart(srsQueue(ds, nodes, cards)); }}><Icon name="plus" /> Learn {Math.min(cards ? 20 : 10, more)} more</button>}
          {goQuiz && <button className="btn" onClick={goQuiz}><Icon name="target" /> Practice quiz</button>}
          <button className="btn" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  const pv = revealed ? previews(item.ref) : null;
  // Intervals only mean something for cards in your schedule (a quiz on unseen cards doesn't schedule them).
  const showIntervals = !quiz || (getProgress().cards[item.ref.id]?.c.state ?? State.New) !== State.New;
  const showMap = f.map !== 'none';
  // A US deck (US rivers, Interstates, anything under United States): its map shows state lines, and names states.
  const inUS = m0Layer(c) === 'road' || sectionChain(group?.section ?? '').some(x => /United States/.test(x));
  const sidePic = !showMap && wide && !!f.picture && (s.pictures || !!f.promptPicture);
  const wrongName = tapResult && !tapResult.ok ? tapResult.hit.name : null;
  const extra = layerFor(c);

  const tones: Record<string, Tone> = {};
  const labels: Record<string, string> = {};
  const m = mp!;
  if (f.map === 'highlight') { tones[m.id] = 'accent'; if (revealed) labels[m.id] = m.name; }
  if (flipped && revealed) { tones[m.id] = 'right'; labels[m.id] = m.name; }
  if (f.map === 'reveal' && revealed) { tones[m.id] = 'accent'; labels[m.id] = m.name; }
  if (tapResult) {
    tones[m.id] = 'right'; labels[m.id] = m.name;
    if (!tapResult.ok && tapResult.hit.countryId) { tones[tapResult.hit.countryId] = 'wrong'; labels[tapResult.hit.countryId] = tapResult.hit.name; }
  }
  // Lock-on brackets: around the place being asked about, then ✓ / ✗ once you've answered on the map.
  const target = !s.targetBox ? null
    : tapResult ? { id: m.id, status: tapResult.ok ? 'right' as const : 'wrong' as const }
    : f.map === 'highlight' || (flipped && revealed) || (f.map === 'reveal' && revealed) ? { id: m.id } : null;
  const cap = c.capitals[0];
  const pins = revealed && item.ref.kind.startsWith('capital') && cap?.lon != null ? [{ lon: cap.lon, lat: cap.lat!, label: cap.name }]
    : revealed && item.ref.kind.startsWith('largestCity') && c.largestCity ? [{ lon: c.largestCity.lon, lat: c.largestCity.lat, label: c.largestCity.name }]
    : revealed && item.ref.kind === 'siteCountry' && c.lon != null ? [{ lon: c.lon, lat: c.lat!, label: c.name }]
    : revealed && item.ref.kind === 'artWhere' && c.lon != null ? [{ lon: c.lon, lat: c.lat!, label: (c.museum ?? c.name).split(',')[0] }]
    : revealed && item.ref.kind.startsWith('highest') && c.highest ? [{ lon: c.highest.lon, lat: c.highest.lat, label: c.highest.name }] : [];

  return (
    <div className={'study' + (showMap ? ' with-map' : ' no-map') + (sidePic ? ' side-pic' : '')}>
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
        {f.map !== 'none' && <button className="btn ghost small" onClick={() => setPeek(true)} title="See every answer in this deck on the map (pauses the session)"><Icon name="eye" size={15} /> Peek</button>}
        {(canUndo || tapResult) && <button className="btn ghost small undo" onClick={undo} title="Undo (⌘Z / Ctrl+Z)"><Icon name="undo" size={15} /> Undo</button>}
      </div>
      {nudge && <div className="nudge">{nudge}</div>}
      {peek && (() => {
        // The answer map: every place in this deck named on the map (capitals pinned when the card is about capitals).
        // Cards can't be answered while it's open.
        const placesHere = GROUPS.filter(g => g.section === group!.section && g.layer === group!.layer).flatMap(g => placesIn(ds, g.id)).filter((x, i, all) => all.findIndex(y => y.id === x.id) === i);
        const capitals = item.ref.kind.startsWith('capital');
        const peekLayer = m.layer === 'senate' ? null : layerFor(m);
        const peekLayers = peekLayer === 'road' ? ['us', 'road'] : peekLayer === 'river' ? (inUS ? ['us', 'lake', 'river'] : ['lake', 'river']) : peekLayer === 'peak' ? ['range', 'peak'] : peekLayer === 'sub' && ds.byId.get(m.parent ?? '')?.layer === 'us' ? ['us', 'sub'] : peekLayer ? [peekLayer] : [];
        const ids = placesHere.map(x => (x.layer === 'senate' ? x.place ?? x.state ?? x.id : x.id));
        const names = Object.fromEntries(placesHere.map(x => [x.layer === 'senate' ? x.place ?? x.state ?? x.id : x.id, x.layer === 'road' ? x.short ?? x.name : x.layer === 'senate' ? x.name : x.name]));
        return (
          <div className="peek" role="dialog" aria-label="Answer map">
            <div className="peek-head">
              <span><Icon name="eye" size={16} /> <b>Answer map</b> · {group!.section} · {placesHere.length} {group!.nouns ?? LAYER_NOUN[group!.layer]} <span className="muted small">(session paused)</span></span>
              <button className="btn small primary" onClick={() => setPeek(false)}>Back to the cards</button>
            </div>
            <WorldMap ds={ds} className="peek-map" recenter layers={peekLayers as never} focus={{ ids, key: 'peek' }} hide={id => !ids.includes(id)}
              tones={Object.fromEntries(ids.map(id => [id, 'answer' as const]))} labels={capitals ? {} : names}
              pins={capitals ? placesHere.filter(x => x.capitals[0]?.lon != null).map(x => ({ lon: x.capitals[0].lon!, lat: x.capitals[0].lat!, label: x.capitals[0].name })) : []}
              outline={m.layer === 'sub' && m.parent ? [m.parent] : []} subFilter={m.layer === 'sub' ? (id => ds.byId.get(id)?.parent === m.parent) : undefined} contextLabels={inUS ? 'states' : 'countries'} />
          </div>
        );
      })()}

      {showMap && (<div className="map-wrap">
        <WorldMap ds={ds} className="study-map" recenter layers={extra === 'road' ? ['us', 'road'] : extra === 'river' ? (inUS ? ['us', 'lake', 'river'] : ['lake', 'river']) : extra === 'peak' ? ['range', 'peak'] : extra === 'us' ? ['us', 'lake'] : extra === 'sub' && ds.byId.get(c.parent ?? '')?.layer === 'us' ? ['us', 'sub'] : extra ? [extra] : []} hide={id => !regionIds.includes(id)} tones={tones} labels={labels} pins={pins} target={target} focus={focus}
          dim={id => group?.layer === m.layer && !(f.map === 'reveal' ? wideIds : regionIds).includes(id) && ds.byId.get(id)?.layer === m.layer}
          strong={['sub', 'us', 'cn'].includes(m.layer) ? (id => regionIds.includes(id) || wideIds.includes(id)) : undefined}
          outline={m.layer === 'sub' && m.parent ? [m.parent] : m.layer === 'us' ? ['Q30'] : m.layer === 'cn' ? ['Q148'] : []}
          subFilter={m.layer === 'sub' ? (id => ds.byId.get(id)?.parent === m.parent) : undefined} onTap={f.mode === 'tap' ? onTap : undefined}
          // Country & state names for bearings, offered only when they can't give the answer away (rivers, roads, peaks…).
          contextLabels={!['river', 'lake', 'road', 'range', 'peak', 'site', 'water', 'desert'].includes(m.layer) ? false : inUS ? 'states' : 'countries'} />
          {(f.map === 'highlight' || revealed || tapResult) && (m.layer === 'country' || m.layer === 'terr') && (
            <Inset place={m} label={revealed || tapResult ? m.name : 'Close-up'} />
          )}
        </div>
      )}

      {/* Laptop, no map: the picture fills the left half (where the map would be), so the card never needs scrolling. */}
      {sidePic && <div className="side-picture">
        {f.promptPicture || revealed ? <Picture {...f.picture!} caption={f.promptPicture && !revealed ? '?' : f.picture!.caption} hideCaption={f.promptPicture && !revealed} />
          : <div className="side-placeholder"><Icon name="image" size={28} /><span>The picture shows when you flip the card</span></div>}
      </div>}
      <div className="card-wrap">
        <article className={'card' + (revealed ? ' revealed' : '')} onClick={() => f.mode === 'reveal' && reveal()}>
          <div className="card-meta">
            {quiz ? <span>{quiz.title}</span> : <span>{group?.name}</span>}<span>{item.ref.kind === 'note' ? c.name : (c.building && item.ref.kind === 'artMaker' ? 'Who designed it?' : c.book && item.ref.kind === 'artMaker' ? 'Who wrote it?' : KIND_LABEL[item.ref.kind])}</span>{item.isNew && <span className="new">new</span>}
          </div>
          {f.audio && <ClipPlayer key={item.ref.id} file={f.audio.file} start={f.audio.start} />}
          {!sidePic && f.promptPicture && f.picture && <div className="prompt-picture"><Picture {...f.picture} caption={revealed ? f.picture.caption : '?'} hideCaption={!revealed} /></div>}
          {f.promptFlag && <Flag file={c.flag ?? null} name="?" className="prompt-flag" size={480} eager />}
          {/* Interstates: the route sign beside the question (once flipped when the number is what's being asked) */}
          {c.layer === 'road' && c.image && item.ref.kind !== 'roadShield' && (revealed || item.ref.kind === 'locate') && <img className="card-shield" src={commonsUrl(c.image, 160)} alt={`${c.short ?? c.name} sign`} />}
          {f.person && <Portrait photo={f.person.photo} wiki={c.wiki} show={f.person.when === 'before' || revealed} name={revealed ? c.name : undefined} party={c.party} />}
          {f.strata ? <>
            <p className="cloze front">{f.pre}</p>
            <StrataCard unit={f.strata} revealed={revealed} />
          </> : f.parts ? <p className="cloze">
            {f.parts.map((x, i) => typeof x === 'string' ? <span key={i}>{x}</span>
              : revealed ? <span key={i} className="fill">{x.answer}</span> : <span key={i} className="blank">{x.hint ?? 'what?'}</span>)}
          </p> : f.frontBack ? <>
            <p className="cloze front">{f.pre}</p>
            {revealed && <p className="back">{f.answer}</p>}
          </> : <p className="cloze">
            {f.pre}
            {f.answerFlag
              ? (revealed ? <span className="fill"><Flag file={c.flag ?? null} name={c.name} className="answer-flag" eager /></span> : <span className="blank">{f.blank}</span>)
              : (revealed ? <span className={'fill' + (tapResult && !tapResult.ok ? ' missed' : '')}>{f.answer}</span> : <span className="blank">{f.blank}</span>)}
            {f.hidePostUntilReveal && !revealed ? '.' : f.post}
          </p>}
          {revealed && (!/^(currency|senator|note)/.test(item.ref.kind) || (item.ref.kind === 'note' && (!!c.native?.length || !!c.species))) && (
            <div className="local">
              {c.species && <i className="species" title="Scientific name">{c.species}</i>}
              {item.ref.kind.startsWith('largestCity') && c.largestCity && !c.largestCity.isCapital ? <LocalName place={c} capital={c.largestCity as unknown as typeof cap} showLang />
              : item.ref.kind.startsWith('capital') && cap ? <>
                <LocalName place={c} capital={cap} showLang />
                {item.ref.kind !== 'capital' && <LocalName place={c} showLang />}
              </> : <LocalName place={c} showLang />}
            </div>
          )}
          {revealed && c.incoming && <Incoming inc={c.incoming} current={c.name} />}
          {revealed && item.ref.kind.startsWith('flag') && <Lookalikes ds={ds} place={c} />}
          {wrongName && <p className="miss">You tapped <b>{wrongName}</b>.</p>}
          {revealed && f.note && !c.music && <p className="note"><Icon name="info" size={15} /> {f.note}</p>}
          {revealed && c.music && <MusicReveal ds={ds} place={c} />}
          {revealed && <Related ds={ds} place={c} onOpen={setSheet} />}
          {!sidePic && revealed && s.pictures && f.picture && !f.promptPicture && <Picture {...f.picture} />}
          {revealed && !f.picture && c.flag && c.layer !== 'note' && !f.promptFlag && !f.answerFlag && s.pictures && <div className="mini-flag"><Flag file={c.flag} name={c.name} size={160} /></div>}
          {!revealed && f.mode === 'reveal' && <p className="hint">{flipped ? 'Picture where it is, then tap the card to see it on the map' : 'Tap the card to reveal'}<span className="kbd-only"> (or press space)</span></p>}
          {!revealed && f.mode === 'tap' && <div className="tap-hint">
            <p className="hint">Tap the right place on the map{regionIds.length > 1 ? ` — zoomed to ${group?.name}` : ''}</p>
            <button className="btn small" onClick={e => { e.stopPropagation(); dontKnow(); }}>I don't know<kbd className="kbd-only">space</kbd></button>
          </div>}
        </article>

        {revealed && f.mode === 'reveal' && (!quiz || pv) && pv && (
          <div className="grades">
            {([[Rating.Again, 'Again'], [Rating.Hard, 'Hard'], [Rating.Good, 'Good'], [Rating.Easy, 'Easy']] as [Grade, string][]).map(([g, label]) => (
              <button key={g} className={'grade g' + g} onClick={() => next(g)}><b>{label}</b>{showIntervals && <small>{pv[g]}</small>}<kbd>{g === Rating.Good ? '3 · space' : g}</kbd></button>
            ))}
          </div>
        )}

        {revealed && f.mode === 'tap' && (
          <div className="grades">
            {tapResult?.ok
              ? (quiz
                  ? <>
                      <button className="grade g2" onClick={() => next(Rating.Hard)}><b>Hard</b><kbd>2</kbd></button>
                      <button className="grade g3 wide2" onClick={() => next(Rating.Good)}><b>Correct</b><kbd>3 · space</kbd></button>
                      <button className="grade g4" onClick={() => next(Rating.Easy)}><b>Easy</b><kbd>4</kbd></button>
                    </>
                  : <>
                      <button className="grade g2" onClick={() => next(Rating.Hard)}><b>Hard</b><small>{pv?.[Rating.Hard]}</small><kbd>2</kbd></button>
                      <button className="grade g3 wide2" onClick={() => next(Rating.Good)}><b>Correct</b><small>{pv?.[Rating.Good]}</small><kbd>3 · space</kbd></button>
                      <button className="grade g4" onClick={() => next(Rating.Easy)}><b>Easy</b><small>{pv?.[Rating.Easy]}</small><kbd>4</kbd></button>
                    </>)
              : <button className="grade g1 full" onClick={() => next(Rating.Again)}><b>Got it — next</b><small>{quiz ? 'counted as missed' : 'see again soon'}</small><kbd>space</kbd></button>}
          </div>
        )}
      </div>
      {sheet && <PlaceSheet ds={ds} id={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}

/** Laptop-sized window (picture beside the card rather than inside it). */
function useWide() {
  const q = '(min-width: 900px) and (min-aspect-ratio: 1/1)';
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const h = () => setWide(m.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h); }, []);
  return wide;
}
