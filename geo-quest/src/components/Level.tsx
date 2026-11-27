// The gem for your level, and the bar to the next one (end of sessions and quizzes, and on Me).
import { dailyXp, levelOf, weeklyTarget, weekXp, type Gem as GemT } from '../levels';
import { useProgress } from '../srs';

/** A flat, faceted gem: a lighter crown over the pavilion, thin facet lines. */
export function Gem({ gem, size = 22 }: { gem: GemT; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="gem" aria-hidden="true">
      <path d="M12 21.5 1.8 9h20.4z" fill={gem.color} />
      <path d="M6 3h12l4.2 6H1.8z" fill={`color-mix(in srgb, ${gem.color} 62%, #fff)`} />
      <path d="M1.8 9h20.4M8.6 3 7 9l5 12.5L17 9l-1.6-6M7 9l5-6 5 6" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth=".9" strokeLinejoin="round" />
    </svg>
  );
}

const n = (x: number) => x.toLocaleString('en-US');

/** "+340 XP" with the gem, then the level and its bar; `gained` marks a level reached this session. */
export function LevelProgress({ gained }: { gained?: number }) {
  const p = useProgress();
  const lv = levelOf(p.xp), before = gained !== undefined ? levelOf(p.xp - gained) : lv;
  const daily = dailyXp(p), week = weekXp(p, undefined, daily), target = weeklyTarget(p, daily);
  return (
    <div className="level">
      {gained !== undefined && gained > 0 && <div className="xp-gain"><Gem gem={lv.gem} size={18} />+{n(gained)} XP</div>}
      {lv.n > before.n && <div className="level-up">New level: {lv.gem.name}</div>}
      <div className="level-row">
        <Gem gem={lv.gem} size={34} />
        <div className="level-main">
          <div className="level-name"><b>{lv.gem.name}</b><span>Level {lv.n}</span></div>
          <div className="level-bar" role="progressbar" aria-valuemin={0} aria-valuemax={lv.need} aria-valuenow={lv.into} aria-label={`Level ${lv.n}`}>
            <div style={{ width: `${(100 * lv.into) / lv.need}%`, background: lv.gem.color }} />
          </div>
          <small>{n(lv.left)} XP to {lv.next.name}</small>
        </div>
        <Gem gem={lv.next} size={20} />
      </div>
      <div className="level-week">
        <span>This week</span>
        <div className="level-bar thin"><div style={{ width: `${Math.min(100, (100 * week) / target)}%` }} /></div>
        <small>{n(week)} / {n(target)} XP{week >= target ? ' · target met' : ''}</small>
      </div>
    </div>
  );
}
