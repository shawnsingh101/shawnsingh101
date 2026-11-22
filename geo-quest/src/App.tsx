import { useEffect, useState } from 'react';
import { loadDataset } from './data';
import { reconcile, useProgress } from './srs';
import type { Dataset } from './types';
import { Ribbon, type Tab } from './components/Ribbon';
import { Study } from './components/Study';
import { Home } from './views/Home';
import { Tree } from './views/Tree';
import { MapView } from './views/MapView';
import { Atlas } from './views/Atlas';

export function App() {
  const [ds, setDs] = useState<Dataset | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(() => (location.hash.slice(1) as Tab) || 'home');
  const [studying, setStudying] = useState(false);
  const p = useProgress();

  useEffect(() => { loadDataset().then(d => { reconcile(d); setDs(d); }).catch(e => setErr(String(e))); }, []);
  useEffect(() => { history.replaceState(null, '', '#' + tab); }, [tab]);
  useEffect(() => {
    const t = p.settings.theme;
    if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  }, [p.settings.theme]);

  if (err) return <div className="splash">Couldn't load the data: {err}</div>;
  if (!ds) return <div className="splash">Loading the world…</div>;
  if (studying) return <Study ds={ds} onExit={() => setStudying(false)} />;

  return (
    <div className="app">
      <Ribbon tab={tab} setTab={setTab} />
      <main className={'tab-' + tab}>
        {tab === 'home' && <Home ds={ds} onStudy={() => setStudying(true)} goTree={() => setTab('tree')} />}
        {tab === 'tree' && <Tree ds={ds} />}
        {tab === 'map' && <MapView ds={ds} />}
        {tab === 'atlas' && <Atlas ds={ds} />}
      </main>
    </div>
  );
}
