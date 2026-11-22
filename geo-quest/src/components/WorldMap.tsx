import { useEffect, useMemo, useRef, useState } from 'react';
import { geoEqualEarth, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import 'd3-transition';
import { easeCubicOut } from 'd3-ease';
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
  target?: { id: string; status?: 'right' | 'wrong' } | null; // "lock-on" brackets around the place in question
  focus?: { ids: string[]; key: string; pad?: number; keepCenter?: boolean } | null; // keepCenter: zoom without re-centring (so it can animate) // pad: share of the screen the focus should fill (default .85)
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

export function WorldMap({ ds, layers = [], fill, tones = {}, labels = {}, pins = [], target, focus, dim, onTap, onHover, className, recenter = false, hide, detailByZoom = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [topos, setTopos] = useState<Partial<Record<Layer, Topology>>>({});
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);

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
      .on('zoom', ev => setT(ev.transform));
    zoomRef.current = z;
    select(svgRef.current).call(z).on('dblclick.zoom', null);
  }, [size.w, size.h]);

  const home = () => { const k0 = fitScale(size); return zoomIdentity.translate((size.w - W * k0) / 2, (size.h - H * k0) / 2).scale(k0); };

  // Fly to whatever the current question is about.
  const ready = !!shapes.country && layers.every(l => shapes[l]);
  useEffect(() => {
    if (!ready || !svgRef.current || !zoomRef.current || !size.w) return;
    if (recenter && !focus?.keepCenter) {
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
      <g key={s.key} className={'river' + (great ? ' great' : '') + cls(s.placeId)} data-name={nameOf(s)} {...events({ countryId: s.placeId, name: nameOf(s) })}>
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
