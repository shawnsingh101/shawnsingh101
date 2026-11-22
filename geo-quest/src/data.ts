import type { Change, Dataset, Layer, Place } from './types';

export async function loadDataset(): Promise<Dataset> {
  const get = (f: string) => fetch(f).then(r => r.json());
  const [c, w, cn, ch] = await Promise.all([
    get('data/countries.json'), get('data/water.json'), get('data/cn.json'),
    get('data/changes.json').catch(() => []),
  ]);
  const norm = (layer: Layer) => (p: Place) => ({ ...p, layer, capitals: p.capitals ?? [], capitalAnswer: p.capitalAnswer ?? null });
  const countries: Place[] = c.countries.filter((x: Place) => x.capitalAnswer && x.region).map(norm('country'));
  const places = [...countries, ...w.places.map(norm('water')), ...cn.places.map(norm('cn'))];
  return { countries, places, byId: new Map(places.map(x => [x.id, x])), changes: ch as Change[] };
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
