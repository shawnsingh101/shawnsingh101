export interface NativeName { name: string; lang: string; code?: string }
/** Pronunciation recordings by language code → [mp3, original] */
export type Audio = Record<string, string[]>;
export interface Chinese { han: string; pinyin: string }

export interface Capital {
  id: string; name: string; preferred: boolean; role: string | null;
  image: string | null; lon?: number; lat?: number; wiki: string | null;
  native?: NativeName[];   // the city's name in the country's own language(s)
  zh?: Chinese | null;     // for China's provincial capitals
  audio?: Audio;
}

export type Status = 'un' | 'observer' | 'disputed';
export type Layer = 'country' | 'water' | 'cn' | 'river' | 'lake' | 'us' | 'senate';

/** Anything you can learn on the map: a country, a sea, a province… keyed by Wikidata id. */
export interface Place {
  id: string;               // Wikidata id, e.g. Q183 — the stable key for everything
  layer: Layer;
  name: string;
  nameThe?: string;         // "the Red Sea"
  type?: string;            // "province", "autonomous region" …
  group?: string;           // skill-tree group for non-country places
  officialName?: string;
  iso2?: string | null; iso3?: string | null;
  status?: Status; statusNote?: string | null;
  region?: string; subregion?: string;
  topo?: { id?: string; name?: string } | null;
  flag?: string | null;
  image?: string | null;
  lon?: number; lat?: number;
  wiki: string | null;
  capitals: Capital[];
  capitalAnswer: string | null;
  capitalNote?: string | null;
  native?: NativeName[];   // e.g. Deutschland (German), 日本 (Japanese)
  zh?: Chinese | null;     // China's provinces: 山西 Shānxī
  audio?: Audio;
  facts?: string;          // rivers & lakes: "6,650 km long · flows into the Mediterranean Sea"
  size?: number;           // km (rivers) or km² (lakes)
  code?: string;           // US state postal code
  // Senate seats (layer 'senate'): the place is the seat; these describe who holds it now.
  label?: string; state?: string; stateName?: string; rank?: 'senior' | 'junior';
  party?: string; partyLong?: string; since?: string; termEnd?: string; roles?: string[]; photo?: string;
}
export type Country = Place;

export interface Change { date: string; id: string; name: string; field: string; from: string | null; to: string | null }

export interface Dataset { countries: Place[]; places: Place[]; byId: Map<string, Place>; changes: Change[] }
