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
export type Layer = 'country' | 'water' | 'cn' | 'river' | 'lake' | 'us' | 'senate' | 'terr' | 'site' | 'peak' | 'range';

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
  topic?: 'senate' | 'governors' | 'leaders';   // which kind of office a seat is
  whsId?: string; country?: string; countryName?: string; // World Heritage Sites (and peaks)
  elevation?: number;      // peaks, metres
  sovereign?: string; sovereignName?: string; terrStatus?: string | null; // territories: which country they belong to
  place?: string; placeName?: string;           // the state/country the office belongs to
  office?: string; rolePrefix?: string;         // "President of France", "President of"
  noFace?: boolean;                             // same person already has a "who is this?" card (e.g. Charles III)
  incoming?: { name: string; party: string | null; wiki: string | null; from: string }; // election winner taking over
  currency?: { id: string; name: string; code: string | null; symbol: string | null; wiki: string | null; shared: number; image?: string | null }[];
  highestShared?: boolean; // another country shares the same highest point (Everest: Nepal & China)
  manyPlaces?: boolean;    // a leader who holds the same office in several countries
  highest?: { id: string; name: string; elevation: number | null; lat: number; lon: number; image: string | null; wiki: string | null; note: string | null };
  largestCity?: { name: string; population: number; lat: number; lon: number; image: string | null; wiki: string | null; isCapital: boolean };
}
export type Country = Place;

export interface Change { date: string; id: string; name: string; field: string; from: string | null; to: string | null }

export interface Lookalike { codes: string[]; tip: string }
export interface Dataset { countries: Place[]; places: Place[]; byId: Map<string, Place>; changes: Change[]; lookalikes: Lookalike[] }
