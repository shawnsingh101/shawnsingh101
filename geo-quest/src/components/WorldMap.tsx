import { useEffect, useMemo, useRef, useState } from 'react';
import { geoEqualEarth, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import type { Dataset } from '../types';

// Natural Earth shapes (via world-atlas), loaded lazily as a separate chunk.
let topoPromise: Promise<Topology> | null = null;
const loadTopo = () => (topoPromise ??= import('world-atlas/countries-50m.json').then(m => m.default as unknown as Topology));

const W = 1000, H = 487; // world coordinate space (Equal Earth is ~2.05:1)
const fitScale = (s: { w: number; h: number }) => Math.min(s.w / W, s.h / H);

export type Tone = 'accent' | 'right' | 'wrong' | 'answer';
export interface MapHit { countryId: string | null; name: string }
export interface Pin { lon: number; lat: number; label?: string }

interface Props {
  ds: Dataset;
  fill?: (countryId: string) => string | undefined;
  tones?: Record<string, Tone>;
  labels?: Record<string, string>;
  pins?: Pin[];
  focus?: { ids: string[]; key: string } | null;
  dim?: (countryId: string) => boolean; // fade countries outside the current quiz region
  onTap?: (hit: MapHit) => void;
  className?: string;
}

interface Shape { key: string; name: string; countryId: string | null; d: string; bounds: [[number, number], [number, number]]; centroid: [number, number] }
interface Dot { countryId: string; x: number; y: number }

export function WorldMap({ ds, fill, tones = {}, labels = {}, pins = [], focus, dim, onTap, className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [topo, setTopo] = useState<Topology | null>(null);
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const [animating, setAnimating] = useState(false);

  useEffect(() => { loadTopo().then(setTopo); }, []);
  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Which Natural Earth shape belongs to which Wikidata country.
  const shapeToCountry = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of ds.countries) {
      if (c.topo?.id) m.set('id:' + c.topo.id, c.id);
      if (c.topo?.name) m.set('name:' + c.topo.name, c.id);
    }
    return m;
  }, [ds]);

  const geo = useMemo(() => {
    if (!topo) return null;
    const obj = topo.objects.countries as GeometryCollection<{ name: string }>;
    const feats = (feature(topo, obj) as unknown as { features: Feature<Geometry, { name: string }>[] }).features
      .filter(f => f.properties.name !== 'Antarctica');
    // Fixed world coordinates (W×H); the screen size only changes the zoom transform,
    // so resizing (e.g. the card growing on a phone) never shifts the map under you.
    const projection = geoEqualEarth().fitSize([W, H], { type: 'Sphere' });
    const path = geoPath(projection);
    const shapes: Shape[] = feats.map((f, i) => {
      const key = f.id ? 'id:' + f.id : 'name:' + f.properties.name;
      // Frame and label each country by its largest landmass (so France means
      // mainland France, not France + French Guiana).
      let main: Feature<Geometry> | Geometry = f;
      if (f.geometry?.type === 'MultiPolygon') {
        let best = -1;
        for (const coordinates of f.geometry.coordinates) {
          const poly: Geometry = { type: 'Polygon', coordinates };
          const a = path.area(poly);
          if (a > best) { best = a; main = poly; }
        }
      }
      return { key: key + i, name: f.properties.name, countryId: shapeToCountry.get(key) ?? null, d: path(f) ?? '', bounds: path.bounds(main), centroid: path.centroid(main) };
    });
    // Tiny countries (and ones with no shape) also get a dot that is easy to tap.
    const hasShape = new Map(shapes.filter(s => s.countryId).map(s => [s.countryId!, s]));
    const dots: Dot[] = [];
    for (const c of ds.countries) {
      const s = hasShape.get(c.id);
      const tiny = !s || Math.max(s.bounds[1][0] - s.bounds[0][0], s.bounds[1][1] - s.bounds[0][1]) < 4;
      if (!tiny) continue;
      const p = s ? s.centroid : c.lon != null ? projection([c.lon, c.lat!]) : null;
      if (p && isFinite(p[0])) dots.push({ countryId: c.id, x: p[0], y: p[1] });
    }
    return { shapes, dots, projection, sphere: path({ type: 'Sphere' }) ?? '', grat: path(geoGraticule10()) ?? '' };
  }, [topo, shapeToCountry, ds]);

  // Pan & pinch-zoom.
  useEffect(() => {
    if (!svgRef.current || !size.w) return;
    const k0 = fitScale(size);
    const z = zoom<SVGSVGElement, unknown>().scaleExtent([k0 * 0.9, k0 * 60])
      .translateExtent([[-W * 0.1, -H * 0.1], [W * 1.1, H * 1.1]])
      .on('start', ev => { if (ev.sourceEvent) setAnimating(false); })
      .on('zoom', ev => setT(ev.transform));
    zoomRef.current = z;
    select(svgRef.current).call(z).on('dblclick.zoom', null);
  }, [size.w, size.h]);

  // Fly to whatever the current question is about.
  useEffect(() => {
    if (!geo || !svgRef.current || !zoomRef.current || !size.w) return;
    const k0 = fitScale(size);
    let target = zoomIdentity.translate((size.w - W * k0) / 2, (size.h - H * k0) / 2).scale(k0);
    if (focus && focus.ids.length) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      const add = (x: number, y: number) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
      for (const id of focus.ids) {
        const c = ds.byId.get(id);
        const s = geo.shapes.find(s => s.countryId === id);
        const huge = s && s.bounds[1][0] - s.bounds[0][0] > W * 0.3; // e.g. Russia
        if (s && !huge) { add(s.bounds[0][0], s.bounds[0][1]); add(s.bounds[1][0], s.bounds[1][1]); }
        else if (c?.lon != null) { const p = geo.projection([c.lon, c.lat!]); if (p) add(p[0], p[1]); }
      }
      if (isFinite(x0)) {
        const minSpan = W * (focus.ids.length === 1 ? 0.035 : 0.05);
        const bw = Math.max(x1 - x0, minSpan), bh = Math.max(y1 - y0, minSpan * 0.6);
        const k = Math.min(k0 * 40, Math.max(k0, 0.85 * Math.min(size.w / bw, size.h / bh)));
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        target = zoomIdentity.translate(size.w / 2 - k * cx, size.h / 2 - k * cy).scale(k);
      }
    }
    setAnimating(true);
    select(svgRef.current).call(zoomRef.current.transform, target);
    const tm = setTimeout(() => setAnimating(false), 700);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.key, geo, size.w, size.h]);

  const k = t.k;
  const toneClass = (id: string | null) => (id && tones[id] ? ` tone-${tones[id]}` : '');
  const fillFor = (id: string | null) => (id ? fill?.(id) : undefined);

  return (
    <div ref={wrap} className={'worldmap ' + (className ?? '')}>
      <svg ref={svgRef} width={size.w} height={size.h} role="img" aria-label="World map">
        <g style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${k})`, transformOrigin: '0 0', transition: animating ? 'transform 650ms cubic-bezier(.3,.7,.2,1)' : 'none' }}>
          {geo && <>
            <path d={geo.sphere} className="ocean" />
            <path d={geo.grat} className="graticule" />
            {geo.shapes.map(s => (
              <path key={s.key} d={s.d}
                className={'land' + (s.countryId ? ' country' : ' other') + toneClass(s.countryId) + (s.countryId && dim?.(s.countryId) ? ' dim' : '')}
                style={fillFor(s.countryId) ? { fill: fillFor(s.countryId) } : undefined}
                onClick={() => onTap?.({ countryId: s.countryId, name: s.countryId ? ds.byId.get(s.countryId)!.name : s.name })}>
                <title>{onTap ? '' : s.countryId ? ds.byId.get(s.countryId)!.name : s.name}</title>
              </path>
            ))}
            {geo.dots.map(d => (
              <g key={d.countryId} className={'dot' + toneClass(d.countryId) + (dim?.(d.countryId) ? ' dim' : '')}
                onClick={() => onTap?.({ countryId: d.countryId, name: ds.byId.get(d.countryId)!.name })}>
                <circle cx={d.x} cy={d.y} r={13 / k} className="hit" />
                <circle cx={d.x} cy={d.y} r={4 / k} className="vis" style={fillFor(d.countryId) ? { fill: fillFor(d.countryId) } : undefined} />
              </g>
            ))}
            {pins.map((p, i) => {
              const xy = geo.projection([p.lon, p.lat]);
              if (!xy) return null;
              return <g key={i} className="pin">
                <circle cx={xy[0]} cy={xy[1]} r={5 / k} />
                {p.label && <text x={xy[0] + 8 / k} y={xy[1] + 4 / k} style={{ fontSize: 13 / k }}>{p.label}</text>}
              </g>;
            })}
            {Object.entries(labels).map(([id, text]) => {
              const s = geo.shapes.find(s => s.countryId === id);
              const d = geo.dots.find(d => d.countryId === id);
              const xy = d ? [d.x, d.y - 10 / k] : s?.centroid;
              if (!xy || !isFinite(xy[0])) return null;
              return <text key={id} className="maplabel" x={xy[0]} y={xy[1]} style={{ fontSize: 14 / k, strokeWidth: 3.5 / k }}>{text}</text>;
            })}
          </>}
        </g>
      </svg>
      {!geo && <div className="map-loading">Loading map…</div>}
      <div className="map-zoom">
        <button aria-label="Zoom in" onClick={() => svgRef.current && zoomRef.current && select(svgRef.current).call(zoomRef.current.scaleBy, 1.6)}>+</button>
        <button aria-label="Zoom out" onClick={() => svgRef.current && zoomRef.current && select(svgRef.current).call(zoomRef.current.scaleBy, 1 / 1.6)}>−</button>
        <button aria-label="Whole world" onClick={() => { const k0 = fitScale(size); if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, zoomIdentity.translate((size.w - W * k0) / 2, (size.h - H * k0) / 2).scale(k0)); }}>◎</button>
      </div>
    </div>
  );
}
