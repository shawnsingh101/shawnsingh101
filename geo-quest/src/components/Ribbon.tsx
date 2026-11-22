import { useRef, useState } from 'react';
import { exportProgress, importProgress, update, useProgress, type Settings } from '../srs';

const I = (d: string) => <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
const ICON = {
  sound: I('M11 5 6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13'),
  gamify: I('m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'),
  pictures: I('M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9.5h.01'),
  locks: I('M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3'),
  theme: I('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18v18'),
  gear: I('M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-1-3-2 .3-1.3-1.3L17 5l-3-1-1 2h-2L10 4 7 5l.3 2L6 8.3 4 8 3 11l2 1v0l-2 1 1 3 2-.3L7.3 17 7 19l3 1 1-2h2l1 2 3-1-.3-2 1.3-1.3 2 .3 1-3z'),
};

export type Tab = 'home' | 'tree' | 'map' | 'atlas';
const TABS: [Tab, string, string][] = [['home', 'Today', '☀︎'], ['tree', 'Skill tree', '✦'], ['map', 'Map', '◍'], ['atlas', 'Atlas', '▤']];

export function Ribbon({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const p = useProgress();
  const s = p.settings;
  const [menu, setMenu] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => update(x => { x.settings[k] = v; });
  const Toggle = ({ k, label }: { k: 'sound' | 'gamify' | 'pictures' | 'locks'; label: string }) => (
    <button className={'chip' + (s[k] ? ' on' : '')} onClick={() => set(k, !s[k])} aria-pressed={s[k]} title={label}>
      {ICON[k]}<span className="chip-label">{label}</span>
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
        <div className="brand">Geo<span>Quest</span></div>
        <nav className="tabs">
          {TABS.map(([id, label, icon]) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><span className="tab-icon">{icon}</span><span>{label}</span></button>
          ))}
        </nav>
        <div className="toggles">
          <Toggle k="sound" label="Sound" />
          <Toggle k="gamify" label="XP & streaks" />
          <Toggle k="pictures" label="Pictures" />
          <Toggle k="locks" label="Skill locks" />
          <button className="chip on" onClick={() => set('theme', s.theme === 'auto' ? 'dark' : s.theme === 'dark' ? 'light' : 'auto')} title="Theme">
            {ICON.theme}<span className="chip-label">{s.theme === 'auto' ? 'Auto' : s.theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
          <button className={'chip' + (menu ? ' on' : '')} onClick={() => setMenu(!menu)} title="More settings" aria-label="More settings">{ICON.gear}</button>
        </div>
      </div>
      {menu && (
        <div className="menu">
          <label>New cards per day
            <input type="range" min={0} max={50} step={5} value={s.newPerDay} onChange={e => set('newPerDay', +e.target.value)} />
            <b>{s.newPerDay}</b>
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
          <p className="muted small">Facts: <a href="https://www.wikidata.org" target="_blank" rel="noreferrer">Wikidata</a> (CC0) · Photos & flags: Wikimedia Commons · Map: Natural Earth</p>
        </div>
      )}
    </header>
  );
}
