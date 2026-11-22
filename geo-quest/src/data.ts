import type { Change, Country, Dataset } from './types';

export async function loadDataset(): Promise<Dataset> {
  const [c, ch] = await Promise.all([
    fetch('data/countries.json').then(r => r.json()),
    fetch('data/changes.json').then(r => r.json()).catch(() => []),
  ]);
  const countries: Country[] = c.countries.filter((x: Country) => x.capitalAnswer && x.region);
  return { countries, byId: new Map(countries.map(x => [x.id, x])), changes: ch as Change[] };
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
