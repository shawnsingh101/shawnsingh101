import { useEffect, useState } from 'react';
import { loadDataset } from './data';
import { reconcile, useProgress } from './srs';
import { sounds, startMusic, stopMusic, unlockAudio } from './sound';
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
import { Dashboard } from './views/Dashboard';

export function App() {
  const [ds, setDs] = useState<Dataset | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(() => (location.hash.slice(1) as Tab) || 'home');
  const [landing, setLanding] = useState(true); // the title screen shows every time the app opens
  const [leaving, setLeaving] = useState(false); // the title screen fading out after Start
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
  // Music plays once you're past the title screen, if it's switched on.
  useEffect(() => { if (p.settings.music && !landing) startMusic(); else stopMusic(); }, [p.settings.music, landing]);
  // A soft click for buttons and tabs (the study screen and toggles choose their own sounds: data-sfx).
  const soundOn = p.settings.sound;
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!soundOn) return;
      const b = (e.target as HTMLElement).closest('button, a.btn, [role="tab"]') as HTMLElement | null;
      if (!b || b.closest('.study') || (b as HTMLButtonElement).disabled) return;
      const kind = b.dataset.sfx;
      if (kind === 'none') return;
      (kind === 'toggle' ? sounds.toggle : kind === 'open' ? sounds.open : kind === 'back' ? sounds.back : sounds.tap)();
    };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, [soundOn]);
  useEffect(() => {
    const t = p.settings.theme;
    if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  }, [p.settings.theme]);

  if (err) return <div className="splash">Couldn't load the data: {err}</div>;
  if (!ds) return <div className="splash">Loading the world…</div>;
  // Start: the chime plays, the globe swells and the title fades, then the app rises into place.
  const leave = (then: () => void) => {
    if (leaving) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLeaving(true);
    setTimeout(() => { setLanding(false); setLeaving(false); then(); }, reduce ? 0 : 650);
  };
  if (landing) return <Landing ds={ds} leaving={leaving}
    onStart={() => { if (p.settings.sound) sounds.startup(); leave(() => { setMenu(false); if (!p.active.length) setTab('tree'); }); }}
    onSettings={() => leave(() => setMenu(true))} />;
  if (session) return <Study key={session.quiz?.key ?? 'srs'} ds={ds} quiz={session.quiz} nodes={session.nodes} onExit={() => setSession(null)} goQuiz={() => { setSession(null); setTab('quiz'); }} />;
  const startQuiz = (quiz: QuizSpec) => setSession({ quiz });
  const startStudy = (nodes?: string[]) => setSession({ nodes });

  return (
    <div className="app app-enter">
      <Ribbon tab={tab} setTab={setTab} menu={menu} setMenu={setMenu} goHome={() => setLanding(true)} />
      <main className={'tab-' + tab}>
        {tab === 'home' && <Home ds={ds} onStudy={() => startStudy()} goTree={() => setTab('tree')} goQuiz={() => setTab('quiz')} />}
        {tab === 'tree' && <Tree ds={ds} startQuiz={startQuiz} startStudy={startStudy} goDashboard={() => setTab('dash')} />}
        {tab === 'quiz' && <Quiz ds={ds} start={startQuiz} />}
        {tab === 'map' && <MapView ds={ds} />}
        {tab === 'atlas' && <Atlas ds={ds} />}
        {tab === 'dash' && <Dashboard />}
      </main>
    </div>
  );
}
