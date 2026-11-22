import { useEffect, useMemo, useRef, useState } from 'react';
import { WorldMap, type MapHit } from '../components/WorldMap';
import { level, update, useProgress, type Settings } from '../srs';
import { cardId, kindsFor } from '../cards';
import { Icon, type IconName } from '../components/Icons';
import type { Dataset, Place } from '../types';
import { PlaceSheet } from './Atlas';

const SCALE = ['var(--m0)', 'var(--m1)', 'var(--m2)', 'var(--m3)'];

/** Average mastery of all of a place's cards → 0..3 */
export function placeMastery(p: ReturnType<typeof useProgress>, place: Place) {
  const ks = kindsFor(place);
  let sum = 0;
  for (const k of ks) sum += level(p, cardId(place.id, k));
  return sum / ks.length;
}

type MapKey = 'mapNames' | 'mapCapitals' | 'mapWater' | 'mapCn';
const TOGGLES: { k: MapKey; label: string; icon: IconName; kind: 'label' | 'layer' }[] = [
  { k: 'mapNames', label: 'Names', icon: 'tag', kind: 'label' },
  { k: 'mapCapitals', label: 'Capitals', icon: 'landmark', kind: 'label' },
  { k: 'mapWater', label: 'Oceans & seas', icon: 'wave', kind: 'layer' },
  { k: 'mapCn', label: 'China provinces', icon: 'layers', kind: 'layer' },
];

export function MapView({ ds }: { ds: Dataset }) {
  const p = useProgress();
  const s = p.settings;
  const [sel, setSel] = useState<string | null>(null);
  const [tip, setTip] = useState<{ id: string | null; name: string; x: number; y: number; touch?: boolean } | null>(null);
  const lastPointer = useRef('mouse');
  useEffect(() => {
    const h = (e: PointerEvent) => { lastPointer.current = e.pointerType; };
    window.addEventListener('pointerdown', h, true);
    return () => window.removeEventListener('pointerdown', h, true);
  }, []);

  const mastery = useMemo(() => new Map(ds.places.map(c => [c.id, placeMastery(p, c)])), [ds, p]);
  const fill = (id: string) => {
    const m = mastery.get(id) ?? 0;
    if (m === 0) return undefined;
    return `color-mix(in oklab, ${SCALE[Math.floor(m)]} ${100 - (m % 1) * 100}%, ${SCALE[Math.min(3, Math.floor(m) + 1)]})`;
  };
  const counts = [0, 0, 0, 0];
  ds.countries.forEach(c => { const m = mastery.get(c.id) ?? 0; counts[m === 0 ? 0 : m < 1.5 ? 1 : m < 2.5 ? 2 : 3]++; });
  const set = (k: keyof Settings, v: boolean) => update(x => { (x.settings as unknown as Record<string, boolean>)[k] = v; });
  const labelsOn = s.mapNames || s.mapCapitals;
  const layers = [...(s.mapWater ? ['water' as const] : []), ...(s.mapCn ? ['cn' as const] : [])];

  const onTap = (h: MapHit) => {
    if (!h.countryId) return;
    // On a phone there's no hover, so with labels on a tap shows the label first.
    if (labelsOn && lastPointer.current !== 'mouse') { setTip({ id: h.countryId, name: h.name, x: 0, y: 0, touch: true }); return; }
    setSel(h.countryId);
  };
  const tipPlace = tip?.id ? ds.byId.get(tip.id) : null;
  const tipBody = (pl: Place | null | undefined, name: string) => (
    <>
      {s.mapNames && <b>{pl?.name ?? name}</b>}
      {s.mapCapitals && pl?.capitalAnswer && <span><Icon name="landmark" size={13} /> {pl.capitals.map(c => c.name).join(' / ')}</span>}
      {s.mapCapitals && !s.mapNames && !pl?.capitalAnswer && <span className="muted">{pl?.name ?? name}</span>}
    </>
  );

  return (
    <div className="mapview">
      <WorldMap ds={ds} className="full-map" layers={layers} fill={fill} tones={sel ? { [sel]: 'accent' } : tip?.touch && tip.id ? { [tip.id]: 'accent' } : {}}
        focus={sel ? { ids: [sel], key: sel } : null} onTap={onTap}
        onHover={labelsOn ? (h, x, y) => setTip(h ? { id: h.countryId, name: h.name, x, y } : null) : undefined} />

      <div className="map-toggles">
        {TOGGLES.map(t => (
          <button key={t.k} className={'chip' + (s[t.k] ? ' on' : '') + (t.kind === 'layer' ? ' layer' : '')} onClick={() => set(t.k, !s[t.k])} aria-pressed={s[t.k]}>
            <Icon name={t.icon} size={15} /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {tip && !tip.touch && labelsOn && (
        <div className="map-tip" style={{ left: tip.x + 14, top: tip.y + 14 }}>{tipBody(tipPlace, tip.name)}</div>
      )}
      {tip?.touch && (
        <div className="map-tip touch">
          {tipBody(tipPlace, tip.name)}
          <button className="btn small" onClick={() => { setSel(tip.id); setTip(null); }}>Details ›</button>
        </div>
      )}

      <div className="legend">
        {['Not started', 'Learning', 'Known', 'Mastered'].map((l, i) => <span key={l}><i style={{ background: i ? SCALE[i] : 'var(--land)' }} />{l} {counts[i]}</span>)}
      </div>
      {sel && <PlaceSheet ds={ds} id={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
