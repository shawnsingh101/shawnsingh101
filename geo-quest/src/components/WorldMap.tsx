import { useEffect, useMemo, useRef, useState } from 'react';
import { geoEqualEarth, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import type { Dataset, Layer } from '../types';
import { dataUrl } from '../data';

// Shapes are loaded lazily: countries ship with the app, oceans and China's
// provinces are only fetched the first time they're shown.
type Extra = Exclude<Layer, 'country'>;
const cache: Partial<Record<Layer, Promise<Topology>>> = {};
const loadLayer = (l: Layer) => (cache[l] ??= l === 'country'
  ? import('world-atlas/countries-50m.json').then(m => m.default as unknown as Topology)
  : fetch(dataUrl(`shapes-${l}.json`)).then(r => r.json()));

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
  focus?: { ids: string[]; key: string; pad?: number } | null; // pad: share of the screen the focus should fill (default .85)
  dim?: (placeId: string) => boolean;   // fade places outside the current question's region
  onTap?: (hit: MapHit) => void;
  onHover?: (hit: MapHit | null, x: number, y: number) => void; // mouse only
  className?: string;
  hide?: (placeId: string) => boolean;  // leave some rivers/lakes out (e.g. other regions during a quiz)
  detailByZoom?: boolean;               // smaller rivers only appear once you zoom in
  recenter?: boolean;                   // rotate the globe so the focused region is centred
}

interface Shape { key: string; name: string; placeId: string | null; layer: Layer; d: string; bounds: [[number, number], [number, number]]; centroid: [number, number] }
interface Dot { placeId: string; x: number; y: number }

// The map's centre line can move: studying China re-centres the map on ~105°E so the
// region sits upright in the middle instead of slanting at the edge of the world.
const makeProjection = (lambda: number) => geoEqualEarth().rotate([-lambda, 0]).fitSize([W, H], { type: 'Sphere' });
type Proj = ReturnType<typeof makeProjection>;

type Feat = Feature<Geometry, Record<string, string>>;
const featCache = new WeakMap<Topology, Feat[]>();
function features(topo: Topology): Feat[] {
  if (!featCache.has(topo)) {
    const objName = Object.keys(topo.objects)[0];
    featCache.set(topo, (feature(topo, topo.objects[objName] as GeometryCollection) as unknown as { features: Feat[] }).features
      .filter(f => f.properties?.name !== 'Antarctica'));
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
    return { key: `${layer}${i}`, name: f.properties?.name ?? '', placeId: resolve(f), layer, d: path(f) ?? '', bounds: path.bounds(main), centroid: path.centroid(main) };
  });
}

export function WorldMap({ ds, layers = [], fill, tones = {}, labels = {}, pins = [], focus, dim, onTap, onHover, className, recenter = false, hide, detailByZoom = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [topos, setTopos] = useState<Partial<Record<Layer, Topology>>>({});
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const [animating, setAnimating] = useState(false);

  const wanted: Layer[] = ['country', ...layers];
  useEffect(() => {
    for (const l of wanted) if (!topos[l]) loadLayer(l).then(tp => setTopos(prev => ({ ...prev, [l]: tp })));
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

  const [lambda, setLambda] = useState(0);
  const recentered = useRef(false);
  const projection = useMemo(() => makeProjection(lambda), [lambda]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const shapes = useMemo(() => {
    const out: Partial<Record<Layer, Shape[]>> = {};
    if (topos.country) out.country = toShapes(topos.country, 'country', path, f => shapeToCountry.get(f.id ? 'id:' + f.id : 'name:' + f.properties.name) ?? null);
    for (const l of ['water', 'cn', 'lake', 'river'] as Extra[]) if (topos[l]) out[l] = toShapes(topos[l]!, l, path, f => (ds.byId.has(f.properties.id) ? f.properties.id : null));
    return out;
  }, [topos, shapeToCountry, ds, path]);

  const visible = useMemo(() => wanted.flatMap(l => shapes[l] ?? []), [shapes, wanted.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tiny places (and countries with no shape) also get a dot that's easy to tap.
  const dots = useMemo(() => {
    const out: Dot[] = [];
    const byPlace = new Map(visible.filter(s => s.placeId).map(s => [s.placeId!, s]));
    const candidates = [...ds.countries, ...ds.places.filter(p => p.layer === 'cn' && layers.includes('cn'))];
    for (const c of candidates) {
      const s = byPlace.get(c.id);
      const tiny = !s || Math.max(s.bounds[1][0] - s.bounds[0][0], s.bounds[1][1] - s.bounds[0][1]) < (c.layer === 'cn' ? 1.5 : 4);
      if (!tiny || (!s && c.layer !== 'country')) continue;
      const p = s ? s.centroid : c.lon != null ? projection([c.lon, c.lat!]) : null;
      if (p && isFinite(p[0])) out.push({ placeId: c.id, x: p[0], y: p[1] });
    }
    return out;
  }, [visible, ds, layers.join(), projection]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pan & pinch-zoom.
  useEffect(() => {
    if (!svgRef.current || !size.w) return;
    const k0 = fitScale(size);
    const z = zoom<SVGSVGElement, unknown>().scaleExtent([k0 * 0.9, k0 * 80])
      .translateExtent([[-W * 0.1, -H * 0.1], [W * 1.1, H * 1.1]])
      .on('start', ev => { if (ev.sourceEvent) setAnimating(false); })
      .on('zoom', ev => setT(ev.transform));
    zoomRef.current = z;
    select(svgRef.current).call(z).on('dblclick.zoom', null);
  }, [size.w, size.h]);

  const home = () => { const k0 = fitScale(size); return zoomIdentity.translate((size.w - W * k0) / 2, (size.h - H * k0) / 2).scale(k0); };

  // Fly to whatever the current question is about.
  const ready = !!shapes.country && layers.every(l => shapes[l]);
  useEffect(() => {
    if (!ready || !svgRef.current || !zoomRef.current || !size.w) return;
    if (recenter) {
      const lons = (focus?.ids ?? []).map(id => ds.byId.get(id)?.lon).filter((l): l is number => l != null);
      const want = focus ? meanLon(lons) : lambda;
      if (want !== lambda) { recentered.current = true; setLambda(want); return; } // re-runs once the map is re-drawn
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
        const minSpan = W * (focus.ids.length === 1 ? 0.035 : 0.05);
        const bw = Math.max(x1 - x0, minSpan), bh = Math.max(y1 - y0, minSpan * 0.6);
        const k = Math.min(k0 * 40, Math.max(k0, (focus.pad ?? 0.85) * Math.min(size.w / bw, size.h / bh)));
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        target = zoomIdentity.translate(size.w / 2 - k * cx, size.h / 2 - k * cy).scale(k);
      }
    }
    // Right after re-centring, jump straight there (the map fades in) instead of flying from the old view.
    const jump = recentered.current;
    recentered.current = false;
    setAnimating(!jump);
    select(svgRef.current).call(zoomRef.current.transform, target);
    const tm = setTimeout(() => setAnimating(false), 700);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.key, ready, size.w, size.h, lambda]);

  const k = t.k;
  const nameOf = (s: { placeId: string | null; name: string }) => (s.placeId ? ds.byId.get(s.placeId)!.name : s.name);
  const cls = (id: string | null) => (id && tones[id] ? ` tone-${tones[id]}` : '') + (id && dim?.(id) ? ' dim' : '');
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
    if (detailByZoom && !/-great$/.test(ds.byId.get(s.placeId)?.group ?? '') && k < k0 * 2.5) return false;
    return true;
  };
  const riverEl = (s: Shape) => {
    const great = /-great$/.test(ds.byId.get(s.placeId!)?.group ?? '');
    return (
      <g key={s.key} className={'river' + (great ? ' great' : '') + cls(s.placeId)} {...events({ countryId: s.placeId, name: nameOf(s) })}>
        <path d={s.d} className="hit" />
        <path d={s.d} className="vis" />
      </g>
    );
  };
  const shapeEl = (s: Shape, base: string) => (
    <path key={s.key} d={s.d} className={base + (s.placeId ? ' place' : ' other') + cls(s.placeId)} style={style(s.placeId)}
      {...events({ countryId: s.placeId, name: nameOf(s) })} />
  );

  return (
    <div ref={wrap} className={'worldmap ' + (className ?? '')}>
      <svg ref={svgRef} width={size.w} height={size.h} role="img" aria-label="World map">
        <g key={lambda} className="map-g" style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${k})`, transformOrigin: '0 0', transition: animating ? 'transform 650ms cubic-bezier(.3,.7,.2,1)' : 'none' }}>
          <path d={path({ type: 'Sphere' }) ?? ''} className="ocean" />
          {shapes.water && layers.includes('water') && shapes.water.map(s => shapeEl(s, 'water'))}
          <path d={path(geoGraticule10()) ?? ''} className="graticule" />
          {shapes.country?.map(s => shapeEl(s, 'land' + (s.placeId ? ' country' : '')))}
          {shapes.cn && layers.includes('cn') && shapes.cn.map(s => shapeEl(s, 'land sub'))}
          {shapes.lake && layers.includes('lake') && shapes.lake.map(s => (s.placeId && showWaterway(s) ? shapeEl(s, 'lake') : <path key={s.key} d={s.d} className="lake other" />))}
          {shapes.river && layers.includes('river') && shapes.river.filter(showWaterway).map(riverEl)}
          {dots.map(d => (
            <g key={d.placeId} className={'dot' + cls(d.placeId)} {...events({ countryId: d.placeId, name: ds.byId.get(d.placeId)!.name })}>
              <circle cx={d.x} cy={d.y} r={13 / k} className="hit" />
              <circle cx={d.x} cy={d.y} r={4 / k} className="vis" style={style(d.placeId)} />
            </g>
          ))}
          {pins.map((p, i) => {
            const xy = projection([p.lon, p.lat]);
            if (!xy) return null;
            return <g key={i} className="pin">
              <circle cx={xy[0]} cy={xy[1]} r={4.5 / k} />
              {p.label && <text x={xy[0] + 7 / k} y={xy[1] + 4 / k} style={{ fontSize: 12 / k, strokeWidth: 3 / k }}>{p.label}</text>}
            </g>;
          })}
          {Object.entries(labels).map(([id, text]) => {
            const s = visible.find(s => s.placeId === id);
            const d = dots.find(d => d.placeId === id);
            const xy = d ? [d.x, d.y - 10 / k] : s?.centroid;
            if (!xy || !isFinite(xy[0])) return null;
            return <text key={id} className="maplabel" x={xy[0]} y={xy[1]} style={{ fontSize: 14 / k, strokeWidth: 3.5 / k }}>{text}</text>;
          })}
        </g>
      </svg>
      {!ready && <div className="map-loading">Loading map…</div>}
      <div className="map-zoom">
        <button aria-label="Zoom in" onClick={() => svgRef.current && zoomRef.current && select(svgRef.current).call(zoomRef.current.scaleBy, 1.6)}>+</button>
        <button aria-label="Zoom out" onClick={() => svgRef.current && zoomRef.current && select(svgRef.current).call(zoomRef.current.scaleBy, 1 / 1.6)}>−</button>
        <button aria-label="Whole world" onClick={() => { if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, home()); }}>◎</button>
      </div>
    </div>
  );
}
