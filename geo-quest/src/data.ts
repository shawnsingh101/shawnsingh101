import type { Change, Dataset, Layer, Place } from './types';
import { groupOf, registerSubdivisions } from './cards';
import { registerNotes } from './notes';
import { registerCollections } from './collections';

declare const __BUILD_ID__: string;
export const dataUrl = (f: string) => `data/${f}?v=${__BUILD_ID__}`;

export async function loadDataset(): Promise<Dataset> {
  const get = (f: string) => fetch(dataUrl(f)).then(r => r.json());
  const [c, w, cn, rv, lk, us, sen, ld, la, tr, ws, pk, rg, ch, sb, col, rd, dz, pr] = await Promise.all([
    get('countries.json'), get('water.json'), get('cn.json'), get('rivers.json'), get('lakes.json'), get('us.json'), get('senate.json'), get('leaders.json'), get('flag-lookalikes.json').catch(() => ({ groups: [] })), get('territories.json').catch(() => ({ places: [] })), get('sites.json').catch(() => ({ places: [] })), get('peaks.json').catch(() => ({ places: [] })), get('ranges.json').catch(() => ({ places: [] })),
    get('changes.json').catch(() => []), get('subdivisions.json').catch(() => ({ sections: [], places: [] })), get('collections.json').catch(() => ({ items: {} })), get('roads.json').catch(() => ({ places: [] })), get('deserts.json').catch(() => ({ places: [] })), get('presidents.json').catch(() => ({ people: [] })),
  ]);
  registerSubdivisions(sb.sections); // prefectures, counties…: sections, groups and skills come with the data
  const norm = (layer: Layer) => (p: Place) => ({ ...p, layer, capitals: p.capitals ?? [], capitalAnswer: p.capitalAnswer ?? null });
  const countries: Place[] = c.countries.filter((x: Place) => x.capitalAnswer && x.region).map(norm('country'));
  const places = [...countries, ...w.places.map(norm('water')), ...cn.places.map(norm('cn')), ...rv.places.map(norm('river')), ...lk.places.map(norm('lake')), ...us.places.map(norm('us')), ...sen.places.map(norm('senate')), ...ld.places.map(norm('senate')), ...tr.places.map(norm('terr')), ...ws.places.map(norm('site')), ...pk.places.map(norm('peak')), ...rg.places.map(norm('range')), ...sb.places.map(norm('sub')), ...rd.places.map(norm('road')), ...dz.places.map(norm('desert')), ...presidents(pr.people), ...registerNotes(), ...registerCollections(col.items, id => countries.find(x => x.id === id)?.name, id => countries.find(x => x.id === id)?.region)];
  // A highest point shared by two countries (Everest, Mont Blanc) can't be asked in reverse.
  const hp = new Map<string, number>();
  for (const c of countries) if (c.highest) hp.set(c.highest.id, (hp.get(c.highest.id) ?? 0) + 1);
  for (const c of countries) if (c.highest && (hp.get(c.highest.id) ?? 0) > 1) c.highestShared = true;
  // One person can hold an office in several countries (Charles III is King of 15): "tap the country" would have many answers.
  const holders = new Map<string, number>();
  for (const p of places) if (p.topic === 'leaders') holders.set(p.name, (holders.get(p.name) ?? 0) + 1);
  for (const p of places) if (p.topic === 'leaders' && (holders.get(p.name) ?? 0) > 1) p.manyPlaces = true;
  // World leaders learn alongside their country's region (e.g. Western Europe → Leaders).
  const byIdTmp = new Map(places.map(x => [x.id, x]));
  for (const p of places) if (p.topic === 'leaders') { const c = byIdTmp.get(p.place!); if (c) p.group = groupOf(c).id; }
  return { countries, places, byId: new Map(places.map(x => [x.id, x])), changes: ch as Change[], lookalikes: la.groups };
}

/** US presidents (public/data/presidents.json): one card set per person, grouped by era. */
function presidents(people: { id: string; name: string; image: string | null; wiki: string | null; terms: NonNullable<Place['terms']> }[]): Place[] {
  const era = (n: number) => (n <= 15 ? 'pr-1' : n <= 25 ? 'pr-2' : n <= 32 ? 'pr-3' : 'pr-4');
  return people.map(p => ({ id: p.id, layer: 'person', name: p.name, wiki: p.wiki, image: p.image, photo: p.image ? commonsUrl(p.image, 360) : undefined,
    terms: p.terms, group: era(p.terms[0].n), capitals: [], capitalAnswer: null, party: p.terms[0].party }) as Place);
}

/** A Wikimedia image. "en:<file>" means a file kept on English Wikipedia itself (e.g. banknotes), not on Commons. */
export function commonsUrl(file: string, width = 640) {
  if (file.startsWith('en:')) return `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(file.slice(3))}?width=${width}`;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

export function wikiUrl(title: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
}

const summaryCache = new Map<string, Promise<string | null>>();
/** Fallback picture when Wikidata has none: the lead image of the Wikipedia article. */
export function wikiThumb(title: string): Promise<string | null> {
  if (!summaryCache.has(title)) {
    summaryCache.set(title, fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(j => j?.thumbnail?.source ?? j?.originalimage?.source ?? null) // the thumbnail: originals can be many MB
      .catch(() => null));
  }
  return summaryCache.get(title)!;
}

export interface Photo { src: string; big?: string; caption: string } // big: a larger copy for full screen
const galleryCache = new Map<string, Promise<Photo[]>>();
/**
 * The photos at the top of a Wikipedia article — for places this is the infobox
 * collage (e.g. Shanxi → Yanmen Pass, Yungang Grottoes, Mount Wutai …). Read live
 * from Wikipedia, so it follows whatever the article shows today.
 */
export function wikiGallery(title: string, max = 6): Promise<Photo[]> {
  if (!galleryCache.has(title)) {
    galleryCache.set(title, fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`)
      .then(r => (r.ok ? r.json() : { items: [] }))
      .then((j: { items: { type: string; title: string; srcset?: { src: string }[]; caption?: { text?: string } }[] }) => {
        const isPhoto = (t: string) => /\.(jpe?g|webp)$/i.test(t);
        const items = j.items.filter(i => i.type === 'image' && i.srcset?.length);
        const out: Photo[] = [];
        // 1) the leading run of photos = the infobox collage
        for (const i of items) { if (!isPhoto(i.title)) break; out.push(toPhoto(i)); }
        // 2) too few? top up with the next photos in the article
        for (const i of items) { if (out.length >= Math.max(3, Math.min(out.length, max))) break; if (isPhoto(i.title) && !out.some(o => o.src === toPhoto(i).src)) out.push(toPhoto(i)); }
        return out.slice(0, max);
      })
      .catch(() => []));
  }
  return galleryCache.get(title)!;
}
function toPhoto(i: { title: string; srcset?: { src: string }[]; caption?: { text?: string } }): Photo {
  const src = i.srcset![i.srcset!.length - 1].src;
  // Use the article's caption; otherwise the file name, but only if it reads like words (not "IMG 2041" or camera ids).
  const name = i.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/[_-]+/g, ' ').trim();
  const readable = !/\d{3,}|^(img|dsc|p\d)/i.test(name) && /[a-z]{3,}\s+[a-z]{3,}/i.test(name);
  return { src: src.startsWith('//') ? 'https:' + src : src, caption: i.caption?.text?.trim() || (readable ? name : '') };
}
