import type { Change, Dataset, Layer, Place } from './types';
import { groupOf } from './cards';

declare const __BUILD_ID__: string;
export const dataUrl = (f: string) => `data/${f}?v=${__BUILD_ID__}`;

export async function loadDataset(): Promise<Dataset> {
  const get = (f: string) => fetch(dataUrl(f)).then(r => r.json());
  const [c, w, cn, rv, lk, us, sen, ld, la, tr, ws, pk, rg, ch] = await Promise.all([
    get('countries.json'), get('water.json'), get('cn.json'), get('rivers.json'), get('lakes.json'), get('us.json'), get('senate.json'), get('leaders.json'), get('flag-lookalikes.json').catch(() => ({ groups: [] })), get('territories.json').catch(() => ({ places: [] })), get('sites.json').catch(() => ({ places: [] })), get('peaks.json').catch(() => ({ places: [] })), get('ranges.json').catch(() => ({ places: [] })),
    get('changes.json').catch(() => []),
  ]);
  const norm = (layer: Layer) => (p: Place) => ({ ...p, layer, capitals: p.capitals ?? [], capitalAnswer: p.capitalAnswer ?? null });
  const countries: Place[] = c.countries.filter((x: Place) => x.capitalAnswer && x.region).map(norm('country'));
  const places = [...countries, ...w.places.map(norm('water')), ...cn.places.map(norm('cn')), ...rv.places.map(norm('river')), ...lk.places.map(norm('lake')), ...us.places.map(norm('us')), ...sen.places.map(norm('senate')), ...ld.places.map(norm('senate')), ...tr.places.map(norm('terr')), ...ws.places.map(norm('site')), ...pk.places.map(norm('peak')), ...rg.places.map(norm('range'))];
  // World leaders learn alongside their country's region (e.g. Western Europe → Leaders).
  const byIdTmp = new Map(places.map(x => [x.id, x]));
  for (const p of places) if (p.topic === 'leaders') { const c = byIdTmp.get(p.place!); if (c) p.group = groupOf(c).id; }
  return { countries, places, byId: new Map(places.map(x => [x.id, x])), changes: ch as Change[], lookalikes: la.groups };
}

/** Commons file → resized image URL (Commons does the resizing for us). */
export function commonsUrl(file: string, width = 640) {
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
      .then(j => j?.originalimage?.source ?? j?.thumbnail?.source ?? null)
      .catch(() => null));
  }
  return summaryCache.get(title)!;
}

export interface Photo { src: string; caption: string }
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
