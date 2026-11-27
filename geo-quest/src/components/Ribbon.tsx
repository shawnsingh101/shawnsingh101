import { Icon, type IconName } from './Icons';
import { Settings } from './Settings';

export type Tab = 'home' | 'tree' | 'quiz' | 'map' | 'atlas' | 'dash' | 'me';
// Five tabs. The Atlas (places as lists) lives inside Map; the Dashboard is a card in the Library.
const TABS: [Tab, string, IconName][] = [['home', 'Today', 'sun'], ['tree', 'Library', 'tree'], ['quiz', 'Quiz', 'target'], ['map', 'Map', 'map'], ['me', 'Me', 'person']];
const TAB_OF: Partial<Record<Tab, Tab>> = { atlas: 'map', dash: 'tree' };
export function Ribbon({ tab, setTab, menu, setMenu, goHome }: { tab: Tab; setTab: (t: Tab) => void; menu: boolean; setMenu: (v: boolean) => void; goHome: () => void }) {
  return (
    <header className="ribbon">
      <div className="ribbon-row">
        <button className="brand" onClick={goHome} title="Home"><span className="brand-full">Intelligence <span>Quest</span></span><span className="brand-short">I<span>Q</span></span></button>
        <nav className="tabs">
          {TABS.map(([id, label, icon]) => (
            <button key={id} className={(TAB_OF[tab] ?? tab) === id ? 'active' : ''} onClick={() => setTab(id)}><span className="tab-icon"><Icon name={icon} size={18} /></span><span>{label}</span></button>
          ))}
        </nav>
        <div className="toggles">
          {/* Only Settings up here: sound and every other switch live inside it. */}
          <button className={'chip' + (menu ? ' on' : '')} data-sfx="open" onClick={() => setMenu(!menu)} title="Settings" aria-label="Settings" aria-expanded={menu}><Icon name="gear" size={15} /><span className="chip-label">Settings</span></button>
        </div>
      </div>
      {menu && <Settings />}
    </header>
  );
}
