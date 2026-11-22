import { useRef } from 'react';
import { exportProgress, importProgress, update, useProgress, type Settings } from '../srs';
import { Icon, type IconName } from './Icons';
import { VERSION } from '../views/Landing';

export type Tab = 'home' | 'tree' | 'quiz' | 'map' | 'atlas';
const TABS: [Tab, string, IconName][] = [['home', 'Today', 'sun'], ['tree', 'Skills', 'tree'], ['quiz', 'Quiz', 'target'], ['map', 'Map', 'map'], ['atlas', 'Atlas', 'book']];
const TOGGLE_ICON: Record<'sound' | 'gamify' | 'pictures' | 'locks', IconName> = { sound: 'sound', gamify: 'star', pictures: 'image', locks: 'lock' };

export function Ribbon({ tab, setTab, menu, setMenu, goHome }: { tab: Tab; setTab: (t: Tab) => void; menu: boolean; setMenu: (v: boolean) => void; goHome: () => void }) {
  const p = useProgress();
  const s = p.settings;
  const file = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => update(x => { x.settings[k] = v; });
  const Toggle = ({ k, label }: { k: 'sound' | 'gamify' | 'pictures' | 'locks'; label: string }) => (
    <button className={'chip' + (s[k] ? ' on' : '')} onClick={() => set(k, !s[k])} aria-pressed={s[k]} title={label}>
      <Icon name={TOGGLE_ICON[k]} size={15} /><span className="chip-label">{label}</span>
    </button>
  );

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `geoquest-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };

  return (
    <header className="ribbon">
      <div className="ribbon-row">
        <button className="brand" onClick={goHome} title="Home">Geo<span>Quest</span></button>
        <nav className="tabs">
          {TABS.map(([id, label, icon]) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><span className="tab-icon"><Icon name={icon} size={18} /></span><span>{label}</span></button>
          ))}
        </nav>
        <div className="toggles">
          <Toggle k="sound" label="Sound" />
          <Toggle k="gamify" label="XP & streaks" />
          <Toggle k="pictures" label="Pictures" />
          <Toggle k="locks" label="Skill locks" />
          <button className="chip on" onClick={() => set('theme', s.theme === 'auto' ? 'dark' : s.theme === 'dark' ? 'light' : 'auto')} title="Theme">
            <Icon name="theme" size={15} /><span className="chip-label">{s.theme === 'auto' ? 'Auto' : s.theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
          <button className={'chip' + (menu ? ' on' : '')} onClick={() => setMenu(!menu)} title="More settings" aria-label="More settings"><Icon name="gear" size={15} /></button>
        </div>
      </div>
      {menu && (
        <div className="menu">
          <label>New cards per day
            <input type="range" min={0} max={50} step={5} value={s.newPerDay} onChange={e => set('newPerDay', +e.target.value)} />
            <b>{s.newPerDay}</b>
          </label>
          <div className="menu-row">
            <span>“Find it on the map” questions</span>
            <div className="seg">
              {([['tap', 'Tap the map'], ['flip', 'Flip like flashcards'], ['skip', 'Skip them']] as const).map(([v, l]) => (
                <button key={v} className={s.mapMode === v ? 'on' : ''} onClick={() => set('mapMode', v)}>{l}</button>
              ))}
            </div>
          </div>
          <label className="check">
            <input type="checkbox" checked={s.targetBox} onChange={e => set('targetBox', e.target.checked)} />
            Target brackets around the place in question, with ✓ / ✗ after map answers
          </label>
          <label className="check">
            <input type="checkbox" checked={s.nativeNames} onChange={e => set('nativeNames', e.target.checked)} />
            Show names in the local language (Deutschland, 日本, Ελλάδα) after each answer — Chinese characters & pinyin always show for China
          </label>
          <div className="menu-row">
            <span>Backup / move to another device</span>
            <button className="btn small" onClick={download}>Download backup</button>
            <button className="btn small" onClick={() => file.current?.click()}>Restore from file</button>
            <input ref={file} type="file" accept="application/json" hidden onChange={async e => {
              const f = e.target.files?.[0]; if (!f) return;
              try { importProgress(await f.text()); alert('Progress restored.'); } catch (err) { alert('That file could not be read: ' + (err as Error).message); }
            }} />
          </div>
          <p className="muted small">GeoQuest v{VERSION.version} · build {VERSION.commit} · Facts: <a href="https://www.wikidata.org" target="_blank" rel="noreferrer">Wikidata</a> (CC0) · Photos & flags: Wikimedia Commons · Map: Natural Earth</p>
        </div>
      )}
    </header>
  );
}
