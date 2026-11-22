import { buildQueue, streak, today, useProgress, nodeStats, update } from '../srs';
import { GROUPS, nodeId, parseNode, TOPICS } from '../cards';
import type { Dataset } from '../types';

export function Home({ ds, onStudy, goTree }: { ds: Dataset; onStudy: () => void; goTree: () => void }) {
  const p = useProgress();
  const q = buildQueue(ds, p);
  const d = p.days[today()];
  const st = streak(p);
  const nothingActive = p.active.length === 0;

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
          {p.settings.gamify && <div><b>{st}🔥</b><span>day streak</span></div>}
          {p.settings.gamify && <div><b>{p.xp}</b><span>XP</span></div>}
        </div>
        {nothingActive
          ? <button className="btn primary big" onClick={goTree}>Choose what to learn →</button>
          : <button className="btn primary big" disabled={!q.due.length && !q.fresh.length} onClick={onStudy}>
              {q.due.length || q.fresh.length ? 'Start studying' : 'All caught up ✓'}
            </button>}
      </section>

      {!nothingActive && (
        <section>
          <h2>Learning now</h2>
          <div className="active-list">
            {p.active.map(n => {
              const { groupId, topic } = parseNode(n);
              const g = GROUPS.find(x => x.id === groupId)!;
              const t = TOPICS.find(x => x.id === topic)!;
              const s = nodeStats(ds, p, n);
              return (
                <div key={n} className="active-item">
                  <span className="icon">{t.icon}</span>
                  <div className="grow"><b>{g.name}</b> · {t.name}
                    <div className="mini-bar"><i style={{ width: `${(s.known / s.total) * 100}%` }} /><em style={{ width: `${(s.mastered / s.total) * 100}%` }} /></div>
                  </div>
                  <small>{s.known}/{s.total}</small>
                </div>
              );
            })}
          </div>
          <p className="muted small">New cards per day: {p.settings.newPerDay} (change it in the ribbon's ⚙ menu). Your progress is saved in this browser — use ⚙ → Backup to move it between phone and laptop.</p>
        </section>
      )}

      {nothingActive && (
        <section className="intro">
          <h2>How it works</h2>
          <ol>
            <li><b>Pick a region</b> in the Skill tree — start with its <i>Countries</i>.</li>
            <li>Answer cards: tap countries on the map, or reveal cloze sentences like <i>“The capital of Germany is <u>what?</u>”</i> and grade yourself.</li>
            <li>Cards come back on a spaced-repetition schedule (the same FSRS method Anki uses).</li>
            <li>Know half a region's countries and its <b>Capitals</b> and <b>Flags</b> branches unlock. The map fills in colour as you master it.</li>
          </ol>
          <p className="muted small">All facts come from Wikidata and refresh automatically; if a capital or name changes, the affected cards are re-queued and you'll see a note here.</p>
          <button className="btn" onClick={() => { update(x => { x.active = [nodeId('eu-w', 'countries')]; }); }}>Quick start: Western Europe</button>
        </section>
      )}
    </div>
  );
}
