export interface Capital {
  id: string; name: string; preferred: boolean; role: string | null;
  image: string | null; lon?: number; lat?: number; wiki: string | null;
}

export type Status = 'un' | 'observer' | 'disputed';
export type Layer = 'country' | 'water' | 'cn';

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
}
export type Country = Place;

export interface Change { date: string; id: string; name: string; field: string; from: string | null; to: string | null }

export interface Dataset { countries: Place[]; places: Place[]; byId: Map<string, Place>; changes: Change[] }
