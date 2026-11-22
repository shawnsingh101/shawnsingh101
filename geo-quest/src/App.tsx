import { useEffect, useState } from 'react';
import { loadDataset } from './data';
import { reconcile, useProgress } from './srs';
import { unlockAudio } from './sound';
import { Quiz } from './views/Quiz';
import { Landing } from './views/Landing';
import type { QuizSpec } from './components/Study';
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
  const [landing, setLanding] = useState(true); // the title screen shows every time the app opens
  const [menu, setMenu] = useState(false);
  const [session, setSession] = useState<null | { quiz?: QuizSpec; nodes?: string[] }>(null);
  const p = useProgress();

  useEffect(() => { loadDataset().then(d => { reconcile(d); setDs(d); }).catch(e => setErr(String(e))); }, []);
  useEffect(() => { history.replaceState(null, '', '#' + tab); }, [tab]);
  // Phones only allow sound that starts from a tap: unlock audio on the first one.
  useEffect(() => {
    const h = () => unlockAudio();
    window.addEventListener('pointerdown', h, { once: true });
    window.addEventListener('keydown', h, { once: true });
    return () => { window.removeEventListener('pointerdown', h); window.removeEventListener('keydown', h); };
  }, []);
  useEffect(() => {
    const t = p.settings.theme;
    if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  }, [p.settings.theme]);

  if (err) return <div className="splash">Couldn't load the data: {err}</div>;
  if (!ds) return <div className="splash">Loading the world…</div>;
  if (landing) return <Landing ds={ds} onStart={() => { setLanding(false); setMenu(false); }} onSettings={() => { setLanding(false); setMenu(true); }} />;
  if (session) return <Study key={session.quiz?.key ?? 'srs'} ds={ds} quiz={session.quiz} nodes={session.nodes} onExit={() => setSession(null)} goQuiz={() => { setSession(null); setTab('quiz'); }} />;
  const startQuiz = (quiz: QuizSpec) => setSession({ quiz });
  const startStudy = (nodes?: string[]) => setSession({ nodes });

  return (
    <div className="app">
      <Ribbon tab={tab} setTab={setTab} menu={menu} setMenu={setMenu} goHome={() => setLanding(true)} />
      <main className={'tab-' + tab}>
        {tab === 'home' && <Home ds={ds} onStudy={() => startStudy()} goTree={() => setTab('tree')} goQuiz={() => setTab('quiz')} />}
        {tab === 'tree' && <Tree ds={ds} startQuiz={startQuiz} startStudy={startStudy} />}
        {tab === 'quiz' && <Quiz ds={ds} start={startQuiz} />}
        {tab === 'map' && <MapView ds={ds} />}
        {tab === 'atlas' && <Atlas ds={ds} />}
      </main>
    </div>
  );
}
