import { useEffect, useMemo, useState } from 'react';
import { geoArea, geoAzimuthalEqualArea, geoCentroid, geoPath } from 'd3-geo';
import { polygonHull } from 'd3-polygon';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import { dataUrl } from '../data';
import type { Place } from '../types';

// Detailed 1:10m outlines of small island countries, and the territory shapes — loaded only when needed.
type Feat = Feature<Geometry, { id: string }>;
const cache: Record<string, Promise<Map<string, Feat>>> = {};
const load = (f: 'small' | 'terr') => (cache[f] ??= fetch(dataUrl(`shapes-${f}.json`)).then(r => r.json()).then((t: Topology) => {
  const fs = (feature(t, t.objects.places as GeometryCollection) as unknown as { features: Feat[] }).features;
  return new Map(fs.map(x => [x.properties.id, x]));
}));

const SIZE = 168;

/**
 * A close-up box for places too small to see on the world map (Kiribati, Martinique, Tuvalu…):
 * the actual island outlines, centred on the place, plus a dashed line around the whole island group
 * so you can see how far it spreads across the ocean.
 */
export function Inset({ place, label }: { place: Place; label?: string }) {
  const [feat, setFeat] = useState<Feat | null>(null);
  useEffect(() => {
    let live = true;
    setFeat(null);
    const key = place.layer === 'terr' ? place.id : place.topo?.id;
    if (!key) return;
    load(place.layer === 'terr' ? 'terr' : 'small').then(m => { if (live) setFeat(m.get(key) ?? null); });
    return () => { live = false; };
  }, [place]);

  const drawn = useMemo(() => {
    if (!feat) return null;
    // Only for small places: larger ones are clear enough on the main map.
    if (geoArea(feat) > 6e-4 && feat.geometry.type !== 'MultiPolygon') return null;
    const [lon, lat] = geoCentroid(feat);
    const proj = geoAzimuthalEqualArea().rotate([-lon, -lat]).fitExtent([[16, 16], [SIZE - 16, SIZE - 16]], feat);
    const path = geoPath(proj);
    // The spread of an island group: a dashed hull around all its pieces.
    const pts: [number, number][] = [];
    const g = feat.geometry;
    const polys = g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : [];
    for (const poly of polys) for (const ring of poly.slice(0, 1)) for (const p of ring) { const xy = proj(p as [number, number]); if (xy) pts.push(xy); }
    const hull = polys.length > 1 ? polygonHull(pts) : null;
    // Tiny islands still need to be visible: mark each piece with a small ring as well.
    const dots = polys.length > 1 ? polys.map(poly => proj(geoCentroid({ type: 'Polygon', coordinates: poly }) as [number, number])).filter(Boolean) as [number, number][] : [];
    // Scale bar: how many km is 40px?
    const a = proj.invert?.([SIZE / 2 - 20, SIZE - 10]), b = proj.invert?.([SIZE / 2 + 20, SIZE - 10]);
    const km = a && b ? Math.round((Math.acos(Math.min(1, Math.sin(a[1] * Math.PI / 180) * Math.sin(b[1] * Math.PI / 180) + Math.cos(a[1] * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180) * Math.cos((b[0] - a[0]) * Math.PI / 180))) * 6371)) : null;
    return { d: path(feat) ?? '', hull, dots, km };
  }, [feat]);

  if (!drawn) return null;
  const nice = (n: number) => (n >= 100 ? Math.round(n / 50) * 50 : n >= 10 ? Math.round(n / 5) * 5 : n);
  return (
    <div className="inset" aria-label={`Close-up of ${label ?? 'the place'}`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <rect width={SIZE} height={SIZE} className="inset-sea" />
        {drawn.hull && <path d={`M${drawn.hull.map(p => p.join(',')).join('L')}Z`} className="inset-hull" />}
        <path d={drawn.d} className="inset-land" />
        {drawn.dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.2} className="inset-dot" />)}
        {drawn.km ? <g className="inset-scale"><path d={`M${SIZE / 2 - 20} ${SIZE - 10}h40`} /><text x={SIZE / 2} y={SIZE - 14}>{nice(drawn.km)} km</text></g> : null}
      </svg>
      <span className="inset-label">{label ?? 'Close-up'}</span>
    </div>
  );
}
