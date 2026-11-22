import { useEffect, useRef } from 'react';
import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import { buildQueue, useProgress } from '../srs';
import { CHANGELOG } from '../changelog';
import { Icon } from '../components/Icons';
import type { Dataset } from '../types';
import { placeMastery } from './MapView';

declare const __APP_VERSION__: string;
declare const __COMMIT__: string;
declare const __BUILD_DATE__: string;
export const VERSION = { version: __APP_VERSION__, commit: __COMMIT__, date: new Date(__BUILD_DATE__) };

type Countries = FeatureCollection<Geometry, { name: string }> & { features: (FeatureCollection['features'][number] & { id?: string })[] };
let worldP: Promise<Countries> | null = null;
const loadWorld = () => (worldP ??= import('world-atlas/countries-110m.json').then(m => {
  const t = m.default as unknown as Topology;
  return feature(t, t.objects.countries as GeometryCollection) as unknown as Countries;
}));

/** A slowly turning globe, drawn on a canvas. Countries you've mastered are coloured in. */
function Globe({ ds }: { ds: Dataset }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useProgress();
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0, world: Countries | null = null, alive = true;
    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    const colors = { ocean: v('--ocean'), land: v('--land'), border: v('--bg'), grat: v('--grat'), rim: v('--line'), m: [v('--m0'), v('--m1'), v('--m2'), v('--m3')] };
    // Mastery colour per map shape (matched by ISO numeric code).
    const byNum = new Map(ds.countries.filter(c => c.topo?.id).map(c => [c.topo!.id!, placeMastery(p, c)]));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    loadWorld().then(w => { world = w; });
    const t0 = performance.now();
    const draw = (now: number) => {
      if (!alive) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const r = Math.min(w, h) * 0.46;
      const proj = geoOrthographic().scale(r).translate([w / 2, h / 2]).rotate([(reduce ? 0 : (now - t0) / 1000 * 5) - 20, -18]).clipAngle(90);
      const path = geoPath(proj, ctx);
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = colors.ocean; ctx.fill();
      ctx.beginPath(); path(geoGraticule10()); ctx.strokeStyle = colors.grat; ctx.lineWidth = 0.6; ctx.stroke();
      if (world) {
        for (const f of world.features) {
          const m = byNum.get(String(f.id)) ?? 0;
          ctx.beginPath(); path(f);
          ctx.fillStyle = m >= 2.5 ? colors.m[3] : m >= 1.5 ? colors.m[2] : m > 0 ? colors.m[1] : colors.land;
          ctx.fill();
          ctx.strokeStyle = colors.border; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.strokeStyle = colors.rim; ctx.lineWidth = 1.5; ctx.stroke();
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    if (reduce) loadWorld().then(() => requestAnimationFrame(draw));
    return () => { alive = false; cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds]);
  return <canvas ref={ref} className="globe" aria-hidden="true" />;
}

export function Landing({ ds, onStart, onSettings }: { ds: Dataset; onStart: () => void; onSettings: () => void }) {
  const p = useProgress();
  const q = buildQueue(ds, p);
  const latest = CHANGELOG[0];
  return (
    <div className="landing">
      <Globe ds={ds} />
      <div className="landing-content">
        <h1 className="landing-title">Intelligence <span>Quest</span></h1>
        <p className="landing-sub">Know the world.</p>
        <div className="landing-actions">
          <button className="btn primary big" onClick={onStart}><Icon name="play" /> Start</button>
          <button className="btn big ghost-light" onClick={onSettings}><Icon name="gear" /> Settings</button>
        </div>
        <p className="landing-due">{q.due.length || q.fresh.length ? `${q.due.length} reviews due · ${q.fresh.length} new cards ready` : p.active.length ? 'All caught up for today' : 'Pick something to learn to get started'}</p>
      </div>
      <footer className="landing-version">
        <span>v{VERSION.version} · build {VERSION.commit} · {VERSION.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <span className="muted">What's new: {latest.notes}</span>
      </footer>
    </div>
  );
}
