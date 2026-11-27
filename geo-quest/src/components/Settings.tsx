// Settings: one clean list. On/off settings are sliding switches; anything with choices opens its own popup.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { exportProgress, importProgress, reloadApp, update, useProgress, type Settings as S } from '../srs';
import { Icon, type IconName } from './Icons';
import { VERSION } from '../views/Landing';
import { QuestionTypes } from './QuestionTypes';
import { SoundLab } from './SoundLab';
import { TokenSetup } from './EditCard';
import { getToken, sentEdits } from '../github';

// The backup's file name carries the local date and time, e.g. geoquest-backup-2026-11-27_14-05-32.json
// (dashes, not colons, so the name is valid on every system), so several backups a day sort in order.
const backupStamp = (d: Date) => { const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`; };

type BoolKey = { [K in keyof S]: S[K] extends boolean ? K : never }[keyof S];
const set = <K extends keyof S>(k: K, v: S[K]) => update(x => { x.settings[k] = v; });

/** A popup over the screen (rendered on <body>, so no parent can trap it). Escape or the backdrop closes it. */
export function Popup({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return createPortal(
    <div className="pop-back" onClick={onClose}>
      <div className="pop" role="dialog" aria-label={title} onClick={e => e.stopPropagation()}>
        <div className="pop-head"><b>{title}</b><button className="btn ghost small" data-sfx="back" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button></div>
        {children}
      </div>
    </div>, document.body);
}

function Switch({ k, icon, label, hint }: { k: BoolKey; icon: IconName; label: string; hint?: string }) {
  const on = useProgress().settings[k];
  return (
    <button className="set-row" role="switch" aria-checked={on} data-sfx="toggle" onClick={() => set(k, !on)}>
      <Icon name={icon} size={18} />
      <span className="set-label">{label}{hint && <small>{hint}</small>}</span>
      <span className={'switch' + (on ? ' on' : '')} aria-hidden="true"><span /></span>
    </button>
  );
}

function Opener({ icon, label, value, onClick }: { icon: IconName; label: string; value: string; onClick: () => void }) {
  return (
    <button className="set-row" data-sfx="open" onClick={onClick} aria-haspopup="dialog">
      <Icon name={icon} size={18} />
      <span className="set-label">{label}</span>
      <span className="set-value">{value}</span><span className="set-chev" aria-hidden="true">›</span>
    </button>
  );
}

function Choice<T extends string>({ value, options, onPick }: { value: T; options: readonly (readonly [T, string])[]; onPick: (v: T) => void }) {
  return (
    <div className="pop-choices">
      {options.map(([v, l]) => (
        <button key={v} className={'pop-choice' + (value === v ? ' on' : '')} aria-pressed={value === v} onClick={() => onPick(v)}>
          {l}{value === v && <Icon name="check" size={16} />}
        </button>
      ))}
    </div>
  );
}

const THEMES = [['auto', 'Auto (follow the device)'], ['light', 'Light'], ['dark', 'Dark']] as const;
const MAP_MODES = [['tap', 'Tap the map'], ['flip', 'Flip like flashcards'], ['skip', 'Skip them']] as const;
type Pop = 'theme' | 'new' | 'map' | 'types' | 'lab' | 'github';

export function Settings() {
  const s = useProgress().settings;
  const [pop, setPop] = useState<Pop | null>(null);
  const [backup, setBackup] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const close = () => setPop(null);
  const label = <T extends string>(opts: readonly (readonly [T, string])[], v: T) => opts.find(o => o[0] === v)?.[1].replace(/ \(.*\)/, '') ?? v;
  const labCount = Object.keys(s.sfx ?? {}).length;

  const download = () => {
    setBackup(false);
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `geoquest-backup-${backupStamp(new Date())}.json`; a.click();
  };

  return (
    <div className="menu settings">
      <div className="set-list">
        <Switch k="sound" icon="sound" label="Sound effects" />
        <Switch k="music" icon="music" label="Music" />
        <Switch k="gamify" icon="star" label="XP, levels & streaks" />
        <Switch k="pictures" icon="image" label="Pictures" />
        <Switch k="locks" icon="lock" label="Skill locks" hint="Deeper decks open once you know half the basics" />
        <Switch k="nativeNames" icon="globe" label="Names in their own language" hint="Deutschland, 日本, Ελλάδα after each answer" />
        <Switch k="targetBox" icon="target" label="Target brackets on the map" hint="With ✓ / ✗ after map answers" />
      </div>
      <div className="set-list">
        <Opener icon="theme" label="Theme" value={label(THEMES, s.theme)} onClick={() => setPop('theme')} />
        <Opener icon="plus" label="New cards per day" value={String(s.newPerDay)} onClick={() => setPop('new')} />
        <Opener icon="map" label="“Find it on the map” questions" value={label(MAP_MODES, s.mapMode)} onClick={() => setPop('map')} />
        <Opener icon="sliders" label="Question types" value={s.kindsOff.length ? `${s.kindsOff.length} off` : 'All on'} onClick={() => setPop('types')} />
        <Opener icon="music" label="Sound lab" value={labCount ? `${labCount} changed` : 'Defaults'} onClick={() => setPop('lab')} />
        <Opener icon="pencil" label="Editing on GitHub" value={getToken() ? 'Set up' : 'Not set up'} onClick={() => setPop('github')} />
        <div className="set-drop">
          <button className="set-row" aria-haspopup="menu" aria-expanded={backup} onClick={() => setBackup(!backup)}>
            <Icon name="save" size={18} />
            <span className="set-label">Backup<small>Keep a copy, or move to another device</small></span>
            <span className={'set-chev' + (backup ? ' open' : '')} aria-hidden="true">›</span>
          </button>
          {backup && (
            <div className="set-menu" role="menu">
              <button role="menuitem" onClick={download}>Download backup</button>
              <button role="menuitem" onClick={() => { setBackup(false); file.current?.click(); }}>Restore from a file</button>
            </div>
          )}
          <input ref={file} type="file" accept="application/json" hidden onChange={async e => {
            const f = e.target.files?.[0]; if (!f) return;
            try { importProgress(await f.text()); alert('Progress restored.'); reloadApp(); /* its device decks load at start-up */ } catch (err) { alert('That file could not be read: ' + (err as Error).message); }
            e.target.value = '';
          }} />
        </div>
      </div>
      <p className="muted small">Intelligence Quest v{VERSION.version} · build {VERSION.commit} · Facts: <a href="https://www.wikidata.org" target="_blank" rel="noreferrer">Wikidata</a> (CC0) · Photos & flags: Wikimedia Commons · Map & Interstates: Natural Earth · Sounds: <a href="https://kenney.nl" target="_blank" rel="noreferrer">Kenney</a> (CC0)</p>

      {pop === 'theme' && <Popup title="Theme" onClose={close}><Choice value={s.theme} options={THEMES} onPick={v => { set('theme', v); close(); }} /></Popup>}
      {pop === 'new' && (
        <Popup title="New cards per day" onClose={close}>
          <p className="muted small">How many cards you haven't seen join your reviews each day. “Learn more” at the end of a session adds extra.</p>
          <label className="pop-range">
            <input type="range" min={0} max={50} step={5} value={s.newPerDay} onChange={e => set('newPerDay', +e.target.value)} />
            <b>{s.newPerDay}</b>
          </label>
        </Popup>
      )}
      {pop === 'map' && <Popup title="“Find it on the map” questions" onClose={close}><Choice value={s.mapMode} options={MAP_MODES} onPick={v => { set('mapMode', v); close(); }} /></Popup>}
      {pop === 'types' && <Popup title="Question types" onClose={close}><QuestionTypes /></Popup>}
      {pop === 'github' && (
        <Popup title="Editing on GitHub" onClose={close}>
          <p className="muted small">After you flip a hand-written card, <b>Edit</b> lets you fix it. The fix goes to GitHub as a pull request for you to approve.</p>
          <TokenSetup />
          {sentEdits().length > 0 && <div className="sent-list"><b>Sent from this device</b>
            <ul>{sentEdits().slice(0, 10).map(e => <li key={e.url}><a href={e.url} target="_blank" rel="noreferrer">Pull request #{e.number}</a> <span className="muted">· {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></li>)}</ul></div>}
        </Popup>
      )}
      {pop === 'lab' && <Popup title="Sound lab: choose your sounds" onClose={close}><SoundLab /></Popup>}
    </div>
  );
}
