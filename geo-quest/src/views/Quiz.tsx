import { useState } from 'react';
import { CONTINENTS, GROUPS, groupsShownIn, placesIn, childSections, sectionChain, type Topic } from '../cards';
import { COUNTRY_FILTER_LAYERS, makeQuiz, placeCountries, quizKey, quizPool, quizTitle, scopeGroups, scopeTopics, type Scope } from '../quiz';
import { skipped, useProgress } from '../srs';
import { Icon, type IconName } from '../components/Icons';
import type { QuizSpec } from '../components/Study';
import type { Dataset } from '../types';

const LENGTHS: (number | 'all')[] = [10, 25, 50, 'all'];

/** Step 1 is "what subject": Countries (continents, and the countries/states studied in depth inside them), or a theme. */
interface Subject { id: string; name: string; icon: IconName; sections: string[] }
const THEME_ICON: Record<string, IconName> = { Territories: 'pin', 'World Heritage': 'temple', Mountains: 'mountain', 'Oceans & Seas': 'wave', Rivers: 'river', Lakes: 'drop' };
const subjects = (): Subject[] => [
  { id: 'countries', name: 'Countries', icon: 'globe', sections: CONTINENTS },
  ...childSections(null).filter(s => !CONTINENTS.includes(s)).map(s => ({ id: s, name: s, sections: [s], icon: THEME_ICON[s] ?? 'book' })),
];
const sectionOf = (scope: Scope) => (scope === 'world' ? null : scope.startsWith('sec:') ? scope.slice(4) : GROUPS.find(g => g.id === scope.slice(4))!.section);
const subjectOf = (scope: Scope) => { const sec = sectionOf(scope); const top = sec ? sectionChain(sec)[0] : CONTINENTS[0]; return subjects().find(s => s.sections.includes(top))!; };
/** The scope covering a whole section: all its groups, or its only group. */
const allOf = (sec: string): Scope => { const gs = groupsShownIn(sec); return gs.length === 1 && !childSections(sec).length ? `grp:${gs[0].id}` : `sec:${sec}`; }; // a level with deeper levels means all of it
const allScope = (sub: Subject): Scope => (sub.id === 'countries' ? 'world' : allOf(sub.sections[0]));
const shortName = (name: string) => name.replace(/^(Rivers|Lakes) of /, '').replace(/ territories$/, '').replace(/^the /, '').replace(/^./, c => c.toUpperCase());
const SAVED = 'geoquest:quiz-setup';

export function Quiz({ ds, start }: { ds: Dataset; start: (q: QuizSpec) => void }) {
  const p = useProgress();
  // Remember the last setup on this device, so "the same again" is one tap.
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVED) ?? 'null'); } catch { return null; } })();
  const [scope, setScope] = useState<Scope>(saved?.scope ?? 'sec:Europe');
  const [picked, setTopics] = useState<Topic[]>(saved?.topics ?? ['countries']);
  const [len, setLen] = useState<number | 'all'>(saved?.len ?? 25);
  const [pickedCountry, setCountry] = useState<string | null>(saved?.country ?? null);
  // Which subject tile is selected: normally the one the area belongs to; a group listed in two places keeps the one you chose.
  const [subjectPick, setSubjectPick] = useState<string | null>(null);
  const subject = (() => {
    const own = subjectOf(scope);
    const pick = subjects().find(s => s.id === subjectPick);
    const g = scope.startsWith('grp:') ? GROUPS.find(x => x.id === scope.slice(4)) : null;
    return pick && g?.alsoInSections?.some(sec => pick.sections.includes(sec)) ? pick : own;
  })();

  const offered = scopeTopics(scope).filter(t => quizPool(ds, scope, [t.id]).length > 0); // no empty question types (Punjab districts whose headquarters share their name)
  // Only questions this area offers count; if none are left (Countries → Rivers), take its first.
  const valid = picked.filter(t => offered.some(o => o.id === t));
  const topics: Topic[] = valid.length ? valid : offered.length ? [offered[0].id] : [];

  // Optional "just one country" filter for World Heritage, mountains, rivers and lakes.
  const filterable = scopeGroups(scope).some(g => COUNTRY_FILTER_LAYERS.includes(g.layer));
  const countryCounts = new Map<string, number>();
  if (filterable) for (const c of quizPool(ds, scope, topics)) for (const id of new Set(placeCountries(ds, c.country))) countryCounts.set(id, (countryCounts.get(id) ?? 0) + 1);
  const country = pickedCountry && countryCounts.has(pickedCountry) ? pickedCountry : null;
  const countryOptions = [...countryCounts].map(([id, n]) => ({ id, n, name: ds.byId.get(id)?.name ?? id })).sort((a, b) => a.name.localeCompare(b.name));

  const pool = quizPool(ds, scope, topics, country).filter(c => !skipped(p, c.kind)).length; // same filter the quiz itself uses
  const best = p.quizBest[quizKey(scope, topics, country)];
  const pct = (b: { best: number; total: number }) => Math.round((100 * b.best) / b.total);
  const toggle = (t: Topic) => setTopics(topics.includes(t) ? (topics.length > 1 ? topics.filter(x => x !== t) : topics) : [...topics, t]);
  const medal = (s: Scope) => Object.entries(p.quizBest).some(([k, b]) => k.startsWith(s + '|') && pct(b) >= 90);
  const Chip = ({ s, label, sub }: { s: Scope; label: string; sub?: boolean }) => (
    <button className={'pick' + (sub ? ' small' : '') + (scope === s ? ' on' : '')} onClick={() => setScope(s)}>{medal(s) && <Icon name="medal" size={14} className="gold" />}{label}</button>
  );
  const go = () => {
    try { localStorage.setItem(SAVED, JSON.stringify({ scope, topics, len, country })); } catch { /* ignore */ }
    start(makeQuiz(ds, scope, topics, len, country));
  };

  // Area: one row per level, e.g. Americas › United States › New Jersey. Each row offers that level's groups
  // and the places inside it studied in depth, so the list can keep growing downwards.
  const groupsOf = groupsShownIn;
  // A group filed in two places (Rivers of the United States) stays in whichever subject you picked it from.
  const g0 = scope.startsWith('grp:') ? GROUPS.find(g => g.id === scope.slice(4)) : null;
  const cur = g0?.alsoInSections?.includes(subject.sections[0]) ? subject.sections[0] : sectionOf(scope);
  const chain = cur ? sectionChain(cur) : [];
  const records = Object.entries(p.quizBest).sort((a, b) => pct(b[1]) - pct(a[1]));
  const n = Math.min(pool, len === 'all' ? pool : len);

  return (
    <div className="quiz">
      <h1>Quiz</h1>
      <p className="muted">Three steps: a subject, how much of it, and which questions. Quizzes don't add new cards, but answers on cards you're learning count as reviews. 90%+ earns a medal.</p>

      <section className="quiz-step">
        <h3><span className="step">1</span> Subject</h3>
        <div className="subjects">
          {subjects().map(sub => (
            <button key={sub.id} className={'subject' + (subject.id === sub.id ? ' on' : '')} onClick={() => { setSubjectPick(sub.id); if (subject.id !== sub.id) setScope(sub.id === 'countries' ? 'sec:Europe' : allScope(sub)); }}>
              <Icon name={sub.icon} size={20} /><span>{sub.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="quiz-step">
        <h3><span className="step">2</span> Area</h3>
        {subject.id === 'countries' && <div className="picks">
          <Chip s="world" label="Whole world" />
          {CONTINENTS.map(c => <Chip key={c} s={`sec:${c}`} label={c} />)}
        </div>}
        {chain.map((sec, i) => {
          const gs = groupsOf(sec), kids = childSections(sec);
          const pickGroups = gs.length > 1 || (gs.length === 1 && kids.length > 0); // Rivers of the Americas: its own deck beside the drill-down
          const showAll = !(subject.id === 'countries' && i === 0) && pickGroups;
          if (!showAll && gs.length <= 1 && !kids.length) return null; // a single-group level (New Jersey counties) needs no row
          return (
            <div key={sec} className={'picks' + (i > 0 || subject.id === 'countries' ? ' sub' : '')}>
              {(i > 0 || subject.id === 'countries') && <span className="muted small">{i === 0 ? 'Or one region:' : `${sec}:`}</span>}
              {showAll && <Chip s={`sec:${sec}`} label={i === 0 && subject.id !== 'countries' ? `All ${sec.toLowerCase()}` : 'All'} sub={i > 0} />}
              {pickGroups && gs.map(g => <Chip key={g.id} s={`grp:${g.id}`} label={g.id === 'u-icons' ? 'Heritage icons' : g.section === 'Lakes' || g.section === 'Territories' ? shortName(g.name) : g.name} sub={i > 0 || subject.id === 'countries'} />)}
              {kids.map(k => <Chip key={k} s={allOf(k)} label={`${k} ›`} sub />)}
            </div>
          );
        })}
        {subject.id !== 'countries' && groupsOf(subject.sections[0]).length === 1 && !childSections(subject.sections[0]).length && <p className="muted small">All {placesIn(ds, groupsOf(subject.sections[0])[0].id).length} of them.</p>}
        {filterable && countryOptions.length > 1 && (
          <label className="country-filter">
            <span className="muted small">Just one country</span>
            <select value={country ?? ''} onChange={e => setCountry(e.target.value || null)}>
              <option value="">All countries ({countryOptions.length})</option>
              {countryOptions.map(o => <option key={o.id} value={o.id}>{o.name} ({o.n})</option>)}
            </select>
          </label>
        )}
      </section>

      <section className="quiz-step">
        <h3><span className="step">3</span> Questions <small className="muted">pick one or more</small></h3>
        <div className="picks">
          {offered.map(t => (
            <button key={t.id} className={'pick check' + (topics.includes(t.id) ? ' on' : '')} onClick={() => toggle(t.id)}>
              <span className="box">{topics.includes(t.id) && <Icon name="check" size={12} />}</span>{t.name}
            </button>
          ))}
        </div>
        <div className="len-row">
          <span className="muted small">How many</span>
          <div className="segmented">
            {LENGTHS.map(l => <button key={l} className={len === l ? 'on' : ''} onClick={() => setLen(l)}>{l === 'all' ? `All ${pool}` : l}</button>)}
          </div>
        </div>
      </section>

      <div className="quiz-bar">
        <div className="grow">
          <b>{quizTitle(scope, topics, country ? ds.byId.get(country)?.name : null)}</b>
          <span className="muted small">{n} card{n === 1 ? '' : 's'}{best ? ` · your best ${pct(best)}%` : ''}</span>
        </div>
        <button className="btn primary" disabled={!pool} onClick={go}><Icon name="play" /> Start</button>
      </div>

      {records.length > 0 && (
        <section className="records">
          <h3>Your records <small className="muted">tap one to set it up again</small></h3>
          <ul>
            {records.map(([k, b]) => {
              const [s, t, cty] = k.split('|');
              if (s !== 'world' && !(s.startsWith('sec:') || GROUPS.some(g => g.id === s.slice(4)))) return null; // a quiz from a deck that no longer exists
              return <li key={k}><button onClick={() => { setScope(s as Scope); setTopics(t.split('+') as Topic[]); setCountry(cty ?? null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                {pct(b) >= 90 ? <Icon name="medal" className="gold" /> : <Icon name="target" />}
                <span className="grow">{quizTitle(s as Scope, t.split('+') as Topic[], cty ? ds.byId.get(cty)?.name : null)}</span><b>{pct(b)}%</b><small>{b.best}/{b.total}</small></button></li>;
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
