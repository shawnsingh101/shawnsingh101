/** One recording of a piece (or of one movement of it), from a music list's "♪ label | file" lines. */
export interface MusicClip {
  work: string; workId: string; label: string | null; file: string; start: number;
  era: string | null; composer: Composer;
  siblings: { id: string; label: string | null; file: string; start: number }[]; // every clip of the same work, in order
}
/** Where a person is from: their birthplace, the state it belonged to in their birth year (with that state's flag then:
 *  the Holy Roman Empire's banner for Mozart's Salzburg), and the country it's in today. */
export interface Origin { place: string | null; born: number | null; then: string | null; thenId: string | null; state: string | null; flag: string | null; today: string | null; todayId: string | null }
export interface PersonFacts { born: number | null; died: number | null; birthplace: string | null; state: string | null; stateId: string | null; country: string | null; countryName: string | null; instruments: string[]; native?: NativeName[]; origin?: Origin }
export interface Composer { id: string; name: string; image: string | null; born: number | null; died: number | null; country: string | null; countryName: string | null; native?: NativeName[]; origin?: Origin }
export interface NativeName { name: string; lang: string; code?: string; roman?: string } // roman: romaji / pinyin / transliteration
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
export type Layer = 'country' | 'water' | 'cn' | 'river' | 'lake' | 'us' | 'senate' | 'terr' | 'site' | 'peak' | 'range' | 'sub' | 'note' | 'art' | 'road' | 'desert' | 'person';

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
  card?: import('./notes').NoteCard; // a card from a note deck (layer 'note')
  stateIds?: string[];      // US rivers: the states they run through (from the map)
  source?: string;          // rivers: where they rise
  alsoIn?: string[];        // extra decks it appears in (a US river in Rivers of the United States)
  population?: number;      // latest official figure (Wikidata)
  populationYear?: number | null;
  admin1?: string;          // sites & peaks: the state / province ("Maharashtra")
  admin1Ids?: string[];
  deckTitle?: string;       // note cards: which deck, and where it sits (subject › sections)
  deckPath?: string[];
  noun?: string;            // regions inside a country ('sub'): "prefecture", "county"
  capWord?: string;         // …and what their capital is called: "capital", "county seat"
  parent?: string;          // …and the country / state they belong to
  parentName?: string;
  highestShared?: boolean; // another country shares the same highest point (Everest: Nepal & China)
  manyPlaces?: boolean;    // a leader who holds the same office in several countries
  artists?: string[];      // artworks: who made it… (buildings: the architect)
  makerOrigin?: Origin;      // where the artist / author / architect is from (when there's one maker)
  makerNative?: NativeName[]; // the artist / author / architect in their own language (for the speaker on 'who made it?')
  taxon?: { branch: string | null; note: string | null; rangeMap: string | null; status: string | null; group: string | null; genusOnly: boolean; epoch?: string | null; ages?: string[]; fossil?: string | null };
  music?: MusicClip;
  person?: PersonFacts & { scene: string | null }; // from a `kind: person` collection (scene: the heading it's under)        // a clip from a `kind: music` collection (one card set per clip)
  book?: boolean; fiction?: boolean; language?: string | null; shelves?: string[]; // books: first written in; nonfiction topics
  building?: boolean;      // from a `kind: building` collection: it stands somewhere (no museum), was designed, has a style
  style?: string | null;   // a building's architectural style (Wikidata P149): Gothic, Beaux-Arts…
  qid?: string;            // the Wikidata id, when the id had to differ (a collection entry that is also a World Heritage site)
  culture?: string | null; // …or, for ancient work, which culture
  year?: number | null;    // when (negative = BC)
  museum?: string | null;  // where it is now: "the Louvre Museum, Paris"
  museumName?: string | null; museumWiki?: string | null; city?: string | null; // …its parts, for the Related links
  terms?: { n: number; from: string; to: string | null; party: string; vp: string[] }[]; // presidents: each presidency they held
  number?: number; short?: string; direction?: string; // Interstates: 95, "I-95", "north–south"
  plural?: boolean;        // "the moai were…"
  species?: string;        // plants and animals: the scientific name, shown in italics (Juniperus communis)
  origin?: string | null;  // where it comes from (the heading in the list): "Europe", "East Asia"
  highest?: { id: string; name: string; elevation: number | null; lat: number; lon: number; image: string | null; wiki: string | null; note: string | null };
  largestCity?: { name: string; population: number; lat: number; lon: number; image: string | null; wiki: string | null; isCapital: boolean };
}
export type Country = Place;

export interface Change { date: string; id: string; name: string; field: string; from: string | null; to: string | null }

export interface Lookalike { codes: string[]; tip: string }
export interface Dataset { countries: Place[]; places: Place[]; byId: Map<string, Place>; changes: Change[]; lookalikes: Lookalike[] }
