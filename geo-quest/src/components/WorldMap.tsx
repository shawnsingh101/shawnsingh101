import { useEffect, useMemo, useRef, useState } from 'react';
import { geoArea, geoCentroid, geoEqualEarth, geoPath, geoGraticule10, type GeoProjection } from 'd3-geo';
import { feature } from 'topojson-client';
import { polygonContains } from 'd3-polygon';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import 'd3-transition';
import { easeCubicOut } from 'd3-ease';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import type { Dataset, Layer } from '../types';
import { update, useProgress } from '../srs';
import { Icon } from './Icons';
import { dataUrl } from '../data';

// Shapes are loaded lazily: countries ship with the app, oceans and China's
// provinces are only fetched the first time they're shown.
type Extra = Exclude<Layer, 'country'>;
const cache: Partial<Record<Layer, Promise<Topology>>> = {};
const loaded: Partial<Record<Layer, Topology>> = {}; // already here: a new map starts with them, no blank frame
const loadLayer = (l: Layer) => (cache[l] ??= (l === 'country'
  ? import('world-atlas/countries-50m.json').then(m => m.default as unknown as Topology)
  : fetch(dataUrl(`shapes-${l}.json`)).then(r => r.json())).then((t: Topology) => (loaded[l] = t)));

// State / province borders (all countries, Natural Earth admin-1): only fetched once you zoom in, as a bearing.
let admin1P: Promise<Topology> | null = null;
const loadAdmin1 = () => (admin1P ??= fetch(dataUrl('shapes-admin1.json')).then(r => r.json()));

const W = 1000, H = 487; // world coordinate space (Equal Earth is ~2.05:1)
const fitScale = (s: { w: number; h: number }) => Math.min(s.w / W, s.h / H);

export type Tone = 'accent' | 'right' | 'wrong' | 'answer';
export interface MapHit { countryId: string | null; name: string }
export interface Pin { lon: number; lat: number; label?: string }

interface Props {
  ds: Dataset;
  layers?: Extra[];                     // extra layers to draw on top of countries
  fill?: (placeId: string) => string | undefined;
  tones?: Record<string, Tone>;
  labels?: Record<string, string>;
  pins?: Pin[];
  target?: { id: string; status?: 'right' | 'wrong' } | null; // "lock-on" brackets around the place in question
  focus?: { ids: string[]; key: string; pad?: number; keepCenter?: boolean } | null; // keepCenter: zoom without re-centring (so it can animate) // pad: share of the screen the focus should fill (default .85)
  dim?: (placeId: string) => boolean;   // fade places outside the current question's region
  strong?: (placeId: string) => boolean; // regions being studied: solid, darker borders (Uzbekistan's regions in an Uzbekistan quiz)
  outline?: string[];                    // places drawn with a bold outline on top (the country those regions belong to)
  subFilter?: (placeId: string) => boolean; // which regions-inside-a-country to draw (one level at a time: Punjab's districts, not also India's states)
  onTap?: (hit: MapHit) => void;
  onHover?: (hit: MapHit | null, x: number, y: number) => void; // mouse only
  className?: string;
  hide?: (placeId: string) => boolean;  // leave some rivers/lakes out (e.g. other regions during a quiz)
  detailByZoom?: boolean;               // smaller rivers only appear once you zoom in
  recenter?: boolean;                   // rotate the globe so the focused region is centred
  contextLabels?: false | 'countries' | 'states'; // offer a button that names the countries, or the US states, around (when they aren't the answer)
}

interface Shape { key: string; name: string; placeId: string | null; layer: Layer; d: string; bounds: [[number, number], [number, number]]; centroid: [number, number]; lon: number }
interface Dot { placeId: string; x: number; y: number; site?: boolean; peak?: boolean }

// The map's centre line can move: studying China re-centres the map on ~105°E so the
// region sits upright in the middle instead of slanting at the edge of the world.
const makeProjection = (lambda: number) => geoEqualEarth().rotate([-lambda, 0]).fitSize([W, H], { type: 'Sphere' });
type Proj = ReturnType<typeof makeProjection>;

type Feat = Feature<Geometry, Record<string, string>>;
const featCache = new WeakMap<Topology, Feat[]>();
/** Safety net: a polygon wound the wrong way covers the whole globe (once Maryland turned the world orange). Flip it back. */
function fixWinding(f: Feat): Feat {
  const g = f.geometry;
  const fix = (rings: number[][][]) => (geoArea({ type: 'Polygon', coordinates: rings }) > 2 * Math.PI ? rings.map(r => [...r].reverse()) : rings);
  if (g?.type === 'Polygon') return { ...f, geometry: { ...g, coordinates: fix(g.coordinates) } };
  if (g?.type === 'MultiPolygon') return { ...f, geometry: { ...g, coordinates: g.coordinates.map(fix) } };
  return f;
}

function features(topo: Topology): Feat[] {
  if (!featCache.has(topo)) {
    const objName = Object.keys(topo.objects)[0];
    featCache.set(topo, (feature(topo, topo.objects[objName] as GeometryCollection) as unknown as { features: Feat[] }).features
      .filter(f => f.properties?.name !== 'Antarctica').map(fixWinding));
  }
  return featCache.get(topo)!;
}

/** Average longitude of a set of places, done on the circle so the Pacific works. */
function meanLon(lons: number[]) {
  if (!lons.length) return 0;
  let x = 0, y = 0;
  for (const l of lons) { x += Math.cos((l * Math.PI) / 180); y += Math.sin((l * Math.PI) / 180); }
  return Math.round((Math.atan2(y, x) * 180) / Math.PI / 5) * 5; // snap to 5° so small moves don't re-draw
}

/** The point inside a polygon farthest from its edges ("pole of inaccessibility", after Mapbox's polylabel). */
function polylabel(rings: [number, number][][], precision = 0.5): [number, number] {
  const outer = rings[0];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of outer) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  const segDist = (px: number, py: number, a: [number, number], b: [number, number]) => {
    let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
    if (dx || dy) { const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy); if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; } }
    dx = px - x; dy = py - y; return dx * dx + dy * dy;
  };
  const dist = (x: number, y: number) => { // signed: positive inside
    let inside = false, min = Infinity;
    for (const ring of rings) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
      min = Math.min(min, segDist(x, y, a, b));
    }
    return (inside ? 1 : -1) * Math.sqrt(min);
  };
  type Cell = { x: number; y: number; h: number; d: number; max: number };
  const cell = (x: number, y: number, h: number): Cell => { const d = dist(x, y) || 0; return { x, y, h, d, max: d + h * Math.SQRT2 }; };
  const size = Math.min(maxX - minX, maxY - minY);
  if (!size) return [minX, minY];
  precision = Math.max(0.02, Math.min(precision, size / 50)); // small places (Northern Cyprus) need a finer search
  let h = size / 2, best = cell((minX + maxX) / 2, (minY + maxY) / 2, 0);
  const queue: Cell[] = [];
  for (let x = minX; x < maxX && queue.length < 64; x += size) for (let y = minY; y < maxY && queue.length < 64; y += size) queue.push(cell(x + h, y + h, h));
  for (let step = 0; queue.length && step < 400; step++) { // bounded: a label never holds up the map
    queue.sort((a, b) => b.max - a.max);
    const c = queue.shift()!;
    if (c.d > best.d) best = c;
    if (c.max - best.d <= precision) continue;
    h = c.h / 2;
    queue.push(cell(c.x - h, c.y - h, h), cell(c.x + h, c.y - h, h), cell(c.x - h, c.y + h, h), cell(c.x + h, c.y + h, h));
  }
  return [best.x, best.y];
}

// Projecting a layer is the slow part of drawing the map (the world at 1:50m, every county…). The result only depends
// on where the map is centred, so keep it: switching cards, quizzes or pages re-uses it instead of projecting again.
const shapeCache = new Map<string, Shape[]>();
const admin1Cache = new Map<number, string>();
function cachedShapes(topo: Topology, layer: Layer, lambda: number, path: ReturnType<typeof geoPath>, resolve: (f: Feat) => string | null): Shape[] {
  const key = `${layer}|${lambda}`;
  let v = shapeCache.get(key);
  if (!v) {
    v = toShapes(topo, layer, path, resolve); shapeCache.set(key, v);
    if (shapeCache.size > 30) shapeCache.delete(shapeCache.keys().next().value!); // keep the most recent few centrings
  }
  return v;
}
function toShapes(topo: Topology, layer: Layer, path: ReturnType<typeof geoPath>, resolve: (f: Feat) => string | null): Shape[] {
  return features(topo).map((f, i) => {
    // Frame and label each place by its largest piece (France = mainland France, not French Guiana).
    let main: Feature<Geometry> | Geometry = f;
    if (f.geometry?.type === 'MultiPolygon') {
      let best = -1;
      for (const coordinates of f.geometry.coordinates) {
        const poly: Geometry = { type: 'Polygon', coordinates };
        const a = path.area(poly);
        if (a > best) { best = a; main = poly; }
      }
    }
    // Label point: the place's real middle, projected. (The middle of the drawn shape goes wrong when the map's edge
    // cuts a country in two: Russia's label landed over Alaska on a map centred on the Americas.)
    const proj = path.projection() as GeoProjection;
    const geo = geoCentroid(main as Feature<Geometry>), p = proj(geo);
    let centroid: [number, number] = p && isFinite(p[0]) ? [p[0], p[1]] : path.centroid(main);
    // A curved or thin country (Vietnam, Israel, Chile) can have its middle outside itself: then use the point deepest
    // inside its main piece instead, so the name always sits on the place.
    const g = ('geometry' in main ? main.geometry : main) as Geometry;
    if (g.type === 'Polygon') {
      const rings = g.coordinates.map(r => r.map(pt => proj(pt as [number, number])));
      if (rings.every(r => r.every(pt => pt && isFinite(pt[0])))) {
        const R = rings as [number, number][][];
        if (!polygonContains(R[0], centroid)) centroid = polylabel(R);
      }
    }
    return { key: `${layer}${i}`, name: f.properties?.name ?? '', placeId: resolve(f), layer, d: path(f) ?? '', bounds: path.bounds(main), centroid, lon: geo[0] };
  });
}

export function WorldMap({ ds, layers = [], fill, tones = {}, labels = {}, pins = [], target, focus, dim, strong, outline = [], subFilter, onTap, onHover, className, recenter = false, hide, detailByZoom = false, contextLabels = false }: Props) {
  const showContext = !!(useProgress().settings.mapContext && contextLabels);
  const wrap = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [topos, setTopos] = useState<Partial<Record<Layer, Topology>>>(() => ({ ...loaded }));
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);

  const wanted: Layer[] = ['country', ...layers];
  useEffect(() => {
    for (const l of wanted) if (l !== 'site' && l !== 'peak' && !topos[l]) loadLayer(l).then(tp => setTopos(prev => ({ ...prev, [l]: tp })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted.join()]);

  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Which Natural Earth shape belongs to which Wikidata place.
  const shapeToCountry = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of ds.countries) {
      if (c.topo?.id) m.set('id:' + c.topo.id, c.id);
      if (c.topo?.name) m.set('name:' + c.topo.name, c.id);
    }
    return m;
  }, [ds]);

  // Start centred where the first question is (a map of New Jersey shouldn't be drawn for 0° first, then again for 75°W).
  const [lambda, setLambda] = useState(() => (recenter && focus ? meanLon(focus.ids.map(id => ds.byId.get(id)?.lon).filter((l): l is number => l != null)) : 0));
  const recentered = useRef(false);
  const projection = useMemo(() => makeProjection(lambda), [lambda]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const shapes = useMemo(() => {
    const out: Partial<Record<Layer, Shape[]>> = {};
    if (topos.country) out.country = cachedShapes(topos.country, 'country', lambda, path, f => shapeToCountry.get(f.id ? 'id:' + f.id : 'name:' + f.properties.name) ?? null);
    for (const l of ['water', 'cn', 'us', 'terr', 'sub', 'range', 'desert', 'lake', 'river', 'road'] as Extra[]) if (topos[l]) out[l] = cachedShapes(topos[l]!, l, lambda, path, f => (ds.byId.has(f.properties.id) || /-outline$/.test(f.properties.id ?? '') ? f.properties.id : null));
    return out;
  }, [topos, shapeToCountry, ds, path, lambda]);

  const zoomedIn = t.k >= fitScale(size) * 2.2;
  const [admin1, setAdmin1] = useState<Topology | null>(null);
  useEffect(() => { if (zoomedIn && !admin1) loadAdmin1().then(setAdmin1).catch(() => {}); }, [zoomedIn, admin1]);
  // The state borders of the whole world are a big drawing: make it after the map is on screen, and keep it.
  const [admin1D, setAdmin1D] = useState('');
  useEffect(() => {
    if (!admin1) return;
    const done = admin1Cache.get(lambda);
    if (done != null) { setAdmin1D(done); return; }
    const id = setTimeout(() => { const d = path(feature(admin1, admin1.objects.b) as unknown as Feature<Geometry>) ?? ''; admin1Cache.set(lambda, d); setAdmin1D(d); }, 50);
    return () => clearTimeout(id);
  }, [admin1, path, lambda]);

  const visible = useMemo(() => wanted.flatMap(l => shapes[l] ?? []), [shapes, wanted.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tiny places (and countries with no shape) also get a dot that's easy to tap.
  const dots = useMemo(() => {
    const out: Dot[] = [];
    const byPlace = new Map(visible.filter(s => s.placeId).map(s => [s.placeId!, s]));
    const candidates = [...ds.countries, ...ds.places.filter(p => (p.layer === 'cn' || p.layer === 'us' || p.layer === 'terr' || p.layer === 'sub') && layers.includes(p.layer) && (p.layer !== 'sub' || !subFilter || subFilter(p.id)))];
    for (const c of candidates) {
      const s = byPlace.get(c.id);
      const tiny = !s || Math.max(s.bounds[1][0] - s.bounds[0][0], s.bounds[1][1] - s.bounds[0][1]) < (c.layer === 'sub' ? 0.25 : c.layer === 'cn' || c.layer === 'us' ? 1.5 : 4);
      if (!tiny || (!s && c.layer !== 'country')) continue;
      const p = s ? s.centroid : c.lon != null ? projection([c.lon, c.lat!]) : null;
      if (p && isFinite(p[0])) out.push({ placeId: c.id, x: p[0], y: p[1] });
    }
    // World Heritage Sites are points: a small diamond marker each (only the ones in play)
    for (const c of ds.places) {
      if ((c.layer !== 'site' && c.layer !== 'peak') || !layers.includes(c.layer) || c.lon == null || (hide?.(c.id) && !tones[c.id])) continue;
      const p = projection([c.lon, c.lat!]);
      if (p && isFinite(p[0])) out.push({ placeId: c.id, x: p[0], y: p[1], site: c.layer === 'site', peak: c.layer === 'peak' });
    }
    return out;
  }, [visible, ds, layers.join(), projection, hide, tones]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pan & pinch-zoom.
  useEffect(() => {
    if (!svgRef.current || !size.w) return;
    const k0 = fitScale(size);
    const z = zoom<SVGSVGElement, unknown>().scaleExtent([k0 * 0.9, k0 * 300]) // deep enough for a county
      .translateExtent([[-W * 0.1, -H * 0.1], [W * 1.1, H * 1.1]])
      .on('zoom', ev => setT(ev.transform));
    zoomRef.current = z;
    select(svgRef.current).call(z).on('dblclick.zoom', null);
  }, [size.w, size.h]);

  const home = () => { const k0 = fitScale(size); return zoomIdentity.translate((size.w - W * k0) / 2, (size.h - H * k0) / 2).scale(k0); };

  // Fly to whatever the current question is about.
  const ready = !!shapes.country && layers.every(l => l === 'site' || l === 'peak' || shapes[l]);
  useEffect(() => {
    if (!ready || !svgRef.current || !zoomRef.current || !size.w) return;
    if (recenter) {
      const lons = (focus?.ids ?? []).map(id => ds.byId.get(id)?.lon).filter((l): l is number => l != null);
      const want = focus ? meanLon(lons) : lambda;
      // keepCenter zooms smoothly without re-centring — unless the target is far from the middle. Past ~70° the
      // projection leans shapes over (Japan tilted on a map centred on Africa), and near the edge they can split
      // across both sides (the Yukon when the map is centred on 46°E): then re-centre on it.
      const fromCentre = (l: number) => Math.abs((((l - lambda) % 360) + 540) % 360 - 180);
      const nearEdge = lons.some(l => fromCentre(l) > 70);
      if (want !== lambda && (!focus?.keepCenter || nearEdge)) { recentered.current = true; setLambda(want); return; } // re-runs once the map is re-drawn
    }
    const k0 = fitScale(size);
    let target = home();
    if (focus && focus.ids.length) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      const add = (x: number, y: number) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
      for (const id of focus.ids) {
        const c = ds.byId.get(id);
        const s = visible.find(s => s.placeId === id);
        // Frame the whole shape: big things (the Arctic Ocean, Russia) simply stay zoomed out.
        if (s) { add(s.bounds[0][0], s.bounds[0][1]); add(s.bounds[1][0], s.bounds[1][1]); }
        else if (c?.lon != null) { const p = projection([c.lon, c.lat!]); if (p) add(p[0], p[1]); }
      }
      if (isFinite(x0)) {
        // Don't zoom in absurdly far on a tiny country, but let counties and prefectures fill the screen.
        const small = focus.ids.every(id => ds.byId.get(id)?.layer === 'sub');
        const minSpan = W * (small ? (focus.ids.length === 1 ? 0.004 : 0.006) : focus.ids.length === 1 ? 0.035 : 0.05);
        const bw = Math.max(x1 - x0, minSpan), bh = Math.max(y1 - y0, minSpan * 0.6);
        const k = Math.min(k0 * 200, Math.max(k0, (focus.pad ?? 0.85) * Math.min(size.w / bw, size.h / bh)));
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        target = zoomIdentity.translate(size.w / 2 - k * cx, size.h / 2 - k * cy).scale(k);
      }
    }
    // Right after re-centring, jump straight there (the map fades in) instead of flying from the old view.
    // Otherwise a quick "fly-to" (d3's smooth zoom path: eases out and keeps the target in view).
    const jump = recentered.current;
    recentered.current = false;
    const sel = select(svgRef.current);
    sel.interrupt();
    if (jump) sel.call(zoomRef.current.transform, target);
    else sel.transition().duration(800).ease(easeCubicOut).call(zoomRef.current.transform, target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.key, ready, size.w, size.h, lambda]);

  const k = t.k;
  // Text labels (place names + pin labels like a capital): if two would overlap (Massachusetts and Boston),
  // nudge the later one up or down until it's clear.
  const placedLabels = (() => {
    type L = { key: string; x: number; y: number; text: string; size: number; anchor: 'start' | 'middle'; cls: string };
    const items: L[] = [];
    pins.forEach((p, i) => { const xy = projection([p.lon, p.lat]); if (xy && p.label) items.push({ key: 'pin' + i, x: xy[0] + 7 / k, y: xy[1] + 4 / k, text: p.label, size: 12 / k, anchor: 'start', cls: 'pinlabel' }); });
    for (const [id, text] of Object.entries(labels)) {
      const s = visible.find(s => s.placeId === id);
      const d = dots.find(d => d.placeId === id);
      const xy = d ? [d.x, d.y - 10 / k] : s?.centroid;
      if (xy && isFinite(xy[0])) items.push({ key: id, x: xy[0], y: xy[1], text, size: 14 / k, anchor: 'middle', cls: 'maplabel' });
    }
    const boxes: { x0: number; x1: number; y0: number; y1: number }[] = [];
    for (const it of items) {
      const w = it.text.length * it.size * 0.56, h = it.size * 1.2;
      const box = (y: number) => ({ x0: it.anchor === 'start' ? it.x : it.x - w / 2, x1: it.anchor === 'start' ? it.x + w : it.x + w / 2, y0: y - h * 0.85, y1: y + h * 0.15 });
      const clear = (b: ReturnType<typeof box>) => !boxes.some(o => b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0);
      const base = it.y;
      for (const step of [0, 1, -1, 2, -2, 3, -3]) { const b = box(base + step * h); if (clear(b)) { it.y = base + step * h; break; } }
      boxes.push(box(it.y));
    }
    return items;
  })();
  const nameOf = (s: { placeId: string | null; name: string }) => (s.placeId ? ds.byId.get(s.placeId)!.name : s.name);
  const cls = (id: string | null) => (id && tones[id] ? ` tone-${tones[id]}` : '') + (id && dim?.(id) ? ' dim' : '') + (id && strong?.(id) ? ' strong' : '');
  const style = (id: string | null) => { const f = id ? fill?.(id) : undefined; return f ? { fill: f } : undefined; };
  const events = (hit: MapHit) => ({
    onClick: () => onTap?.(hit),
    onPointerMove: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') onHover?.(hit, e.clientX, e.clientY); },
    onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') onHover?.(null, 0, 0); },
  });
  // Rivers: a thin visible line plus a wide invisible one, so they're easy to tap.
  const k0 = fitScale(size);
  const showWaterway = (s: Shape) => {
    if (!s.placeId) return false;
    if (tones[s.placeId] || labels[s.placeId]) return true;
    if (hide?.(s.placeId)) return false;
    if (detailByZoom && !/-great$|^m-ranges$|^hw-main$/.test(ds.byId.get(s.placeId)?.group ?? '') && k < k0 * 2.5) return false;
    return true;
  };
  const riverEl = (s: Shape, base = 'river') => {
    const great = /-great$|^hw-main$/.test(ds.byId.get(s.placeId!)?.group ?? '');
    return (
      <g key={s.key} className={base + (great ? ' great' : '') + cls(s.placeId)} data-name={nameOf(s)} {...events({ countryId: s.placeId, name: nameOf(s) })}>
        <path d={s.d} className="hit" />
        <path d={s.d} className="vis" />
      </g>
    );
  };
  const shapeEl = (s: Shape, base: string) => (
    <path key={s.key} d={s.d} className={base + (s.placeId ? ' place' : ' other') + cls(s.placeId)} style={style(s.placeId)} data-name={nameOf(s)}
      {...events({ countryId: s.placeId, name: nameOf(s) })} />
  );

  return (
    <div ref={wrap} className={'worldmap ' + (className ?? '')}>
      <svg ref={svgRef} width={size.w} height={size.h} role="img" aria-label="World map">
        <g key={lambda} className="map-g" style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${k})`, transformOrigin: '0 0' }}>
          <path d={path({ type: 'Sphere' }) ?? ''} className="ocean" />
          {shapes.water && layers.includes('water') && shapes.water.map(s => shapeEl(s, 'water'))}
          <path d={path(geoGraticule10()) ?? ''} className="graticule" />
          {shapes.country?.map(s => shapeEl(s, 'land' + (s.placeId ? ' country' : '')))}
          {zoomedIn && admin1D && <path d={admin1D} className="admin1" />}
          {shapes.cn && layers.includes('cn') && shapes.cn.map(s => shapeEl(s, 'land sub'))}
          {shapes.us && layers.includes('us') && shapes.us.map(s => shapeEl(s, 'land sub'))}
          {shapes.terr && layers.includes('terr') && shapes.terr.map(s => shapeEl(s, 'land sub terr'))}
          {shapes.sub && layers.includes('sub') && shapes.sub.filter(s => !!s.placeId && !/-outline$/.test(s.placeId) && (!subFilter || subFilter(s.placeId))).map(s => shapeEl(s, 'land sub'))}
          {shapes.desert && layers.includes('desert') && shapes.desert.map(s => (s.placeId && showWaterway(s) ? shapeEl(s, 'range desert') : null))}
          {shapes.range && layers.includes('range') && shapes.range.map(s => (s.placeId && showWaterway(s) ? shapeEl(s, 'range') : null))}
          {shapes.lake && layers.includes('lake') && shapes.lake.map(s => (s.placeId && showWaterway(s) ? shapeEl(s, 'lake') : <path key={s.key} d={s.d} className="lake other" />))}
          {shapes.river && layers.includes('river') && shapes.river.filter(showWaterway).map(s => riverEl(s))}
          {shapes.road && layers.includes('road') && shapes.road.filter(showWaterway).map(s => riverEl(s, 'river road'))}
          {outline.map(id => {
            // Prefer an outline built from the regions themselves (Punjab from its districts), so the edges line up.
            const all = Object.values(shapes).flat() as Shape[];
            const own = all.filter(s => s.placeId === `${id}-outline`);
            return (own.length ? own : all.filter(s => s.placeId === id)).map(s => <path key={'o' + s.key} d={s.d} className="focus-outline" />);
          })}
          {dots.map(d => (
            <g key={d.placeId} className={'dot' + cls(d.placeId)} {...events({ countryId: d.placeId, name: ds.byId.get(d.placeId)!.name })}>
              <circle cx={d.x} cy={d.y} r={13 / k} className="hit" />
              {d.peak
                ? <path d={`M${d.x} ${d.y - 6 / k}l${6 / k} ${10 / k}h${-12 / k}z`} className="vis peak" style={style(d.placeId)} />
                : d.site
                ? <path d={`M${d.x} ${d.y - 5.5 / k}l${5.5 / k} ${5.5 / k}l${-5.5 / k} ${5.5 / k}l${-5.5 / k} ${-5.5 / k}z`} className="vis site" style={style(d.placeId)} />
                : <circle cx={d.x} cy={d.y} r={4 / k} className="vis" style={style(d.placeId)} />}
            </g>
          ))}
          {pins.map((p, i) => {
            const xy = projection([p.lon, p.lat]);
            if (!xy) return null;
            return <g key={i} className="pin">
              <circle cx={xy[0]} cy={xy[1]} r={4.5 / k} />
            </g>;
          })}
          {target && (() => {
            // Corner brackets around the target, drawn in screen-sized units so they stay crisp at any zoom.
            const s = visible.find(x => x.placeId === target.id);
            const d = dots.find(x => x.placeId === target.id);
            let b: [[number, number], [number, number]] | null = s ? s.bounds : d ? [[d.x, d.y], [d.x, d.y]] : null;
            if (!b || !isFinite(b[0][0])) return null;
            const pad = 9 / k, minHalf = 9 / k;
            let [[x0, y0], [x1, y1]] = b;
            const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
            x0 = Math.min(x0 - pad, cx - minHalf); x1 = Math.max(x1 + pad, cx + minHalf);
            y0 = Math.min(y0 - pad, cy - minHalf); y1 = Math.max(y1 + pad, cy + minHalf);
            const L = Math.min(14 / k, (x1 - x0) / 3, (y1 - y0) / 3);
            const pl = ds.byId.get(target.id);
            const coord = pl?.lat != null && pl.lon != null ? `${Math.abs(pl.lat).toFixed(1)}°${pl.lat >= 0 ? 'N' : 'S'}  ${Math.abs(pl.lon).toFixed(1)}°${pl.lon >= 0 ? 'E' : 'W'}` : '';
            const st = target.status ?? 'lock';
            return (
              <g key={target.id + st} className={'target t-' + st}>
                <g className="brackets">
                  <path d={`M${x0} ${y0 + L}V${y0}H${x0 + L} M${x1 - L} ${y0}H${x1}V${y0 + L} M${x1} ${y1 - L}V${y1}H${x1 - L} M${x0 + L} ${y1}H${x0}V${y1 - L}`} />
                  <path className="ticks" d={`M${cx} ${y0 - 4 / k}V${y0 + 3 / k} M${cx} ${y1 - 3 / k}V${y1 + 4 / k} M${x0 - 4 / k} ${cy}H${x0 + 3 / k} M${x1 - 3 / k} ${cy}H${x1 + 4 / k}`} />
                </g>
                {coord && <text x={x0} y={y1 + 13 / k} style={{ fontSize: 9.5 / k, strokeWidth: 3 / k }}>{coord}</text>}
                {target.status && (
                  <g transform={`translate(${x1} ${y0}) scale(${1 / k})`}>
                    <g className="badge">
                      <circle r="10" />
                      <path d={target.status === 'right' ? 'M-4.5 0.5l3 3 6-6.5' : 'M-4 -4l8 8M4 -4l-8 8'} />
                    </g>
                  </g>
                )}
              </g>
            );
          })()}
          {showContext && (() => {
            // Country and state names for bearings, biggest first, skipping any that would overlap or are too small to read.
            const boxes: [number, number, number, number][] = [], out: JSX.Element[] = [];
            // Only what the deck is about: US states for a US deck, countries otherwise. Skip shapes cut by the map's edge.
            const fromCentre = (l: number) => Math.abs((((l - lambda) % 360) + 540) % 360 - 180);
            const pool = (contextLabels === 'states' ? shapes.us ?? [] : shapes.country ?? [])
              .filter(s => s.placeId && !labels[s.placeId] && !tones[s.placeId] && fromCentre(s.lon) < 100 && s.bounds[1][0] - s.bounds[0][0] < W / 2)
              .map(s => ({ s, w: (s.bounds[1][0] - s.bounds[0][0]) * k })).filter(x => x.w > 46).sort((a, b) => b.w - a.w);
            const size = 11 / k;
            for (const { s } of pool) {
              const name = ds.byId.get(s.placeId!)?.name ?? s.name, [x, y] = s.centroid, w = name.length * size * 0.55, h = size * 1.2;
              const b: [number, number, number, number] = [x - w / 2, y - h, x + w / 2, y];
              if (boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])) continue;
              boxes.push(b);
              out.push(<text key={'c' + s.key} className="ctxlabel" x={x} y={y} style={{ fontSize: size, strokeWidth: size / 4 }}>{name}</text>);
            }
            return out;
          })()}
          {placedLabels.map(t => (
            <text key={t.key} className={t.cls} x={t.x} y={t.y} style={{ fontSize: t.size, strokeWidth: t.size / 4, textAnchor: t.anchor }}>{t.text}</text>
          ))}
        </g>
      </svg>
      {!ready && <div className="map-loading">Loading map…</div>}
      <div className="map-zoom">
        {contextLabels && <button aria-label="Show place names" aria-pressed={showContext} title={showContext ? 'Hide country & state names' : 'Show country & state names'} className={showContext ? 'on' : ''}
          onClick={() => update(x => { x.settings.mapContext = !x.settings.mapContext; })}><Icon name="tag" size={16} /></button>}
        <button aria-label="Zoom in" onClick={() => svgRef.current && zoomRef.current && select(svgRef.current).call(zoomRef.current.scaleBy, 1.6)}>+</button>
        <button aria-label="Zoom out" onClick={() => svgRef.current && zoomRef.current && select(svgRef.current).call(zoomRef.current.scaleBy, 1 / 1.6)}>−</button>
        <button aria-label="Whole world" onClick={() => { if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, home()); }}>◎</button>
      </div>
    </div>
  );
}
