export interface Capital {
  id: string; name: string; preferred: boolean; role: string | null;
  image: string | null; lon?: number; lat?: number; wiki: string | null;
}

export type Status = 'un' | 'observer' | 'disputed';

export interface Country {
  id: string;               // Wikidata id, e.g. Q183 — the stable key for everything
  name: string; officialName: string;
  iso2: string | null; iso3: string | null;
  status: Status; statusNote: string | null;
  region: string; subregion: string;
  topo: { id?: string; name?: string } | null;
  flag: string | null;
  lon?: number; lat?: number;
  wiki: string | null;
  capitals: Capital[];
  capitalAnswer: string | null;
  capitalNote?: string | null;
}

export interface Change { date: string; id: string; name: string; field: string; from: string | null; to: string | null }

export interface Dataset { countries: Country[]; byId: Map<string, Country>; changes: Change[] }
