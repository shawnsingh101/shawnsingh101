import { activeNodes, buildQueue, learnMore, sessionDecks, streak, today, unseenCount, useProgress, nodeStats, update } from '../srs';
import { groupById, nodeId, parseNode, slotOf } from '../cards';
import { Icon } from '../components/Icons';
import { QuestionTypes } from '../components/QuestionTypes';
import { useState } from 'react';
import type { Dataset } from '../types';

export function Home({ ds, onStudy, goTree, goQuiz }: { ds: Dataset; onStudy: () => void; goTree: () => void; goQuiz: () => void }) {
  const p = useProgress();
  const q = buildQueue(ds, p);
  const d = p.days[today()];
  const st = streak(p);
  const active = activeNodes(p);
  const nothingActive = active.length === 0;
  const more = unseenCount(ds, p);
  const caughtUp = !q.due.length && !q.fresh.length;
  const [showTypes, setShowTypes] = useState(false);
  // Which decks this session covers (ticked in "Learning now"); null = all of them.
  const picked = new Set(sessionDecks(p));
  const partial = p.settings.sessionNodes !== null && picked.size < active.length;
  const pick = (n: string) => update(x => {
    const cur = new Set(sessionDecks(x));
    if (cur.has(n)) cur.delete(n); else cur.add(n);
    x.settings.sessionNodes = cur.size === activeNodes(x).length ? null : [...cur];
  });
  const kindsOff = p.settings.kindsOff.length;

  return (
    <div className="home">
      {p.updates.length > 0 && (
        <div className="updates">
          <b>The world changed</b>
          {p.updates.slice(0, 3).map((u, i) => <p key={i}><small>{u.date}</small> {u.text}</p>)}
          <button className="btn ghost small" onClick={() => update(x => { x.updates = []; })}>Dismiss</button>
        </div>
      )}

      <section className="today">
        <h1>Today</h1>
        <div className="stats">
          <div><b>{q.due.length}</b><span>reviews due</span></div>
          <div><b>{q.fresh.length}</b><span>new cards</span></div>
          <div><b>{d?.reviews ?? 0}</b><span>done today</span></div>
          {p.settings.gamify && <div><b className="with-icon">{st}<Icon name="flame" size={20} className="flame" /></b><span>day streak</span></div>}
          {p.settings.gamify && <div><b>{p.xp}</b><span>XP</span></div>}
        </div>
        <div className="row">
          {nothingActive
            ? <button className="btn primary big" onClick={goTree}>Choose what to learn →</button>
            : picked.size === 0
              ? <span className="caught-up muted">Tick at least one deck below</span>
            : caughtUp
              ? <>
                  <span className="caught-up"><Icon name="check" /> All caught up</span>
                  {more > 0 && <button className="btn primary" onClick={() => { learnMore(10); onStudy(); }}><Icon name="plus" /> Learn {Math.min(10, more)} more</button>}
                </>
              : <button className="btn primary big" onClick={onStudy}><Icon name="play" /> Start studying{partial ? ` (${picked.size} deck${picked.size === 1 ? '' : 's'})` : ''}</button>}
          <button className="btn" onClick={goQuiz}><Icon name="target" /> Practice quiz</button>
          <button className={'btn' + (showTypes ? ' on' : '')} onClick={() => setShowTypes(!showTypes)}><Icon name="sliders" /> Question types{kindsOff ? ` · ${kindsOff} off` : ''}</button>
        </div>
        {showTypes && <div className="types-panel"><QuestionTypes /></div>}
      </section>

      {!nothingActive && (
        <section>
          <div className="learning-head">
            <h2>Learning now</h2>
            <span className="muted small">Tick the decks for this session ·{' '}
              <button className="linkish" onClick={() => update(x => { x.settings.sessionNodes = null; })}>All</button>{' · '}
              <button className="linkish" onClick={() => update(x => { x.settings.sessionNodes = []; })}>None</button>
            </span>
          </div>
          <div className="active-list">
            {active.map(n => {
              const g = groupById(parseNode(n).groupId);
              const t = slotOf(n);
              const s = nodeStats(ds, p, n);
              return (
                <div key={n} className={'active-item' + (picked.has(n) ? ' picked' : '')} onClick={() => pick(n)} role="checkbox" aria-checked={picked.has(n)}>
                  <span className="tick">{picked.has(n) && <Icon name="check" size={14} />}</span>
                  <span className="node-icon"><Icon name={t.icon} /></span>
                  <div className="grow"><b>{g.name}</b> · {t.name}
                    <div className="mini-bar"><i style={{ width: `${(s.known / s.total) * 100}%` }} /><em style={{ width: `${(s.mastered / s.total) * 100}%` }} /></div>
                  </div>
                  <small>{s.known}/{s.total}{s.due ? ` · ${s.due} due` : ''}</small>
                </div>
              );
            })}
          </div>
          <p className="muted small">New cards per day: {p.settings.newPerDay} (change it in the settings menu). Progress is saved in this browser — use Settings → Backup to move it between phone and laptop.</p>
        </section>
      )}

      {nothingActive && (
        <section className="intro">
          <h2>How it works</h2>
          <ol>
            <li><b>Pick a region</b> in the Skill tree and start with its <i>Countries</i>.</li>
            <li>Answer cards: tap places on the map, or reveal cloze sentences like <i>“The capital of Germany is <u>what?</u>”</i> and grade yourself.</li>
            <li>Cards come back on a spaced-repetition schedule (the same FSRS method Anki uses).</li>
            <li>Know half a region's countries and its <b>Capitals</b> and <b>Flags</b> unlock. The map fills in colour as you master it.</li>
            <li>Ready for more? <b>Quiz</b> yourself on whole continents or the whole world.</li>
          </ol>
          <p className="muted small">All facts come from Wikidata and refresh automatically; if a capital or name changes, the affected cards are re-queued and you'll see a note here.</p>
          <button className="btn" onClick={() => { update(x => { x.active = [nodeId('eu-w', 'countries')]; }); }}>Quick start: Western Europe</button>
        </section>
      )}
    </div>
  );
}
