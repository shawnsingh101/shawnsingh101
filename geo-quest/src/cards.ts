import type { Dataset, Place } from './types';
import type { IconName } from './components/Icons';

// ---- Card kinds ---------------------------------------------------------------
// Every fact is asked in both directions, and every card has a stable id
// `${wikidataId}:${kind}` so progress survives renames and data refreshes.

export type Kind = 'locate' | 'identify' | 'capital' | 'capitalReverse' | 'capitalLocate' | 'flag' | 'flagReverse' | 'senator' | 'senatorFace' | 'senatorLocate'
  | 'currency' | 'currencyReverse' | 'largestCity' | 'largestCityReverse';
export type Topic = 'countries' | 'places' | 'capitals' | 'flags' | 'senate' | 'governors' | 'leaders' | 'currency' | 'cities';

export const TOPIC_KINDS: Record<Topic, Kind[]> = {
  countries: ['locate', 'identify'],
  places: ['locate', 'identify'],
  capitals: ['capital', 'capitalReverse', 'capitalLocate'],
  flags: ['flag', 'flagReverse'],
  senate: ['senator', 'senatorFace', 'senatorLocate'],
  governors: ['senator', 'senatorFace', 'senatorLocate'],
  leaders: ['senator', 'senatorFace', 'senatorLocate'],
  currency: ['currency', 'currencyReverse'],
  cities: ['largestCity', 'largestCityReverse'],
};

/** Cards answered by tapping the map (can be flipped like flashcards, or skipped, in settings). */
export const TAP_KINDS: Kind[] = ['locate', 'capitalLocate', 'senatorLocate'];

export const KIND_LABEL: Record<Kind, string> = {
  locate: 'Find it on the map', identify: 'Name it', capital: 'Name the capital',
  capitalReverse: 'Capital → name', capitalLocate: 'Capital → map', flag: 'Name the flag', flagReverse: 'Picture the flag',
  senator: 'Name the person', senatorFace: 'Who is this?', senatorLocate: 'Person → map',
  currency: 'Name the currency', currencyReverse: 'Currency → country', largestCity: 'Largest city', largestCityReverse: 'City → country',
};

/** Fingerprint of the facts a card depends on: if Wikidata changes it, the card is re-queued. */
export function fingerprint(kind: Kind, c: Place) {
  if (kind.startsWith('capital')) return `${c.name}|${c.capitalAnswer}`;
  if (kind.startsWith('flag')) return `${c.name}|${c.flag}`;
  if (kind.startsWith('senator')) return `${c.name}|${c.party}|${c.rank ?? c.office}`; // a new person in the seat re-queues it
  if (kind.startsWith('currency')) return `${c.name}|${c.currency?.map(x => x.name).join('/')}`;
  if (kind.startsWith('largestCity')) return `${c.name}|${c.largestCity?.name}`;
  return c.name;
}

// ---- Skill tree -----------------------------------------------------------------

export interface TopicSlot { id: Topic; name: string; icon: IconName; requires?: Topic }
export interface Group {
  id: string; section: string; name: string; layer: Place['layer'];
  subregions?: string[]; topics: TopicSlot[]; note?: string;
  requires?: string;   // a node from another group that must be half-known first (e.g. great rivers → more rivers)
}

const COUNTRY_TOPICS: TopicSlot[] = [
  { id: 'countries', name: 'Countries', icon: 'globe' },
  { id: 'capitals', name: 'Capitals', icon: 'landmark', requires: 'countries' },
  { id: 'flags', name: 'Flags', icon: 'flag', requires: 'countries' },
  { id: 'leaders', name: 'Leaders', icon: 'person', requires: 'countries' },
  { id: 'currency', name: 'Currencies', icon: 'coin', requires: 'countries' },
  { id: 'cities', name: 'Largest cities', icon: 'city', requires: 'countries' },
];
const cg = (id: string, section: string, name: string, subregions: string[]): Group =>
  ({ id, section, name, layer: 'country', subregions, topics: COUNTRY_TOPICS });
const wg = (id: string, name: string, topic = 'Seas & gulfs'): Group =>
  ({ id, section: 'Oceans & Seas', name, layer: 'water', topics: [{ id: 'places', name: topic, icon: 'wave' }] });

export const GROUPS: Group[] = [
  cg('eu-w', 'Europe', 'Western Europe', ['Western Europe']),
  cg('eu-n', 'Europe', 'Northern Europe', ['Northern Europe']),
  cg('eu-c', 'Europe', 'Central Europe', ['Central Europe']),
  cg('eu-s', 'Europe', 'Southern Europe', ['Southern Europe']),
  cg('eu-se', 'Europe', 'Balkans', ['Southeast Europe']),
  cg('eu-e', 'Europe', 'Eastern Europe', ['Eastern Europe']),
  cg('am-n', 'Americas', 'North & Central America', ['North America', 'Central America']),
  cg('am-c', 'Americas', 'Caribbean', ['Caribbean']),
  cg('am-s', 'Americas', 'South America', ['South America']),
  cg('as-w', 'Asia', 'Middle East', ['Western Asia']),
  cg('as-c', 'Asia', 'Central Asia', ['Central Asia']),
  cg('as-s', 'Asia', 'South Asia', ['Southern Asia']),
  cg('as-e', 'Asia', 'East Asia', ['Eastern Asia']),
  cg('as-se', 'Asia', 'Southeast Asia', ['South-Eastern Asia']),
  cg('af-n', 'Africa', 'North Africa', ['Northern Africa']),
  cg('af-w', 'Africa', 'West Africa', ['Western Africa']),
  cg('af-m', 'Africa', 'Central Africa', ['Middle Africa']),
  cg('af-e', 'Africa', 'East Africa', ['Eastern Africa']),
  cg('af-s', 'Africa', 'Southern Africa', ['Southern Africa']),
  cg('oc', 'Oceania', 'Oceania', ['Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia']),
  wg('w-oc', 'The five oceans', 'Oceans'),
  wg('w-eu', 'Europe & the Mediterranean'),
  wg('w-am', 'The Americas'),
  wg('w-in', 'Indian Ocean & Africa'),
  wg('w-ap', 'Asia-Pacific'),
  wg('w-po', 'Polar seas'),
  { id: 'r-great', section: 'Rivers', name: 'Great rivers of the world', layer: 'river', topics: [{ id: 'places', name: 'Great rivers', icon: 'river' }],
    note: "The world's 20 longest rivers (from Wikidata) come first; know half of them to unlock each continent's rivers." },
  ...([['r-eu', 'Rivers of Europe'], ['r-as', 'Rivers of Asia & Oceania'], ['r-af', 'Rivers of Africa'], ['r-am', 'Rivers of the Americas']] as const)
    .map(([id, name]): Group => ({ id, section: 'Rivers', name, layer: 'river', requires: 'r-great/places', topics: [{ id: 'places', name: 'Rivers', icon: 'river' }] })),
  { id: 'l-great', section: 'Lakes', name: "The world's largest lakes", layer: 'lake', topics: [{ id: 'places', name: 'Largest lakes', icon: 'drop' }],
    note: 'The 20 largest lakes by area come first; know half of them to unlock each continent’s lakes.' },
  ...([['l-eu', 'Lakes of Europe'], ['l-as', 'Lakes of Asia & Oceania'], ['l-af', 'Lakes of Africa'], ['l-am', 'Lakes of the Americas']] as const)
    .map(([id, name]): Group => ({ id, section: 'Lakes', name, layer: 'lake', requires: 'l-great/places', topics: [{ id: 'places', name: 'Lakes', icon: 'drop' }] })),
  ...([['us-ne', 'Northeast'], ['us-mw', 'Midwest'], ['us-s', 'South'], ['us-w', 'West']] as const).map(([id, name]): Group => ({
    id, section: 'United States', name, layer: 'us',
    topics: [
      { id: 'places', name: 'States', icon: 'map' },
      { id: 'capitals', name: 'Capitals', icon: 'landmark', requires: 'places' },
      { id: 'flags', name: 'Flags', icon: 'flag', requires: 'places' },
      { id: 'senate', name: 'Senators', icon: 'person', requires: 'places' },
      { id: 'governors', name: 'Governors', icon: 'capitol', requires: 'places' },
    ],
    note: id === 'us-ne' ? 'The 50 states by US Census region. Senators unlock once you know half a region’s states; their cards follow the seat, so when a seat changes hands the card comes back with a note.' : undefined,
  })),
  { id: 'cn', section: 'China', name: "China's provinces", layer: 'cn',
    note: 'Provinces, autonomous regions, municipalities and the two special administrative regions. The PRC also claims Taiwan as a province; Taiwan is covered under countries.',
    topics: [{ id: 'places', name: 'Provinces', icon: 'map' }, { id: 'capitals', name: 'Capitals', icon: 'landmark', requires: 'places' }] },
];

export const SECTIONS = ['Europe', 'Americas', 'Asia', 'Africa', 'Oceania', 'United States', 'Oceans & Seas', 'Rivers', 'Lakes', 'China'];
export const CONTINENTS = SECTIONS.slice(0, 5);

export function groupOf(c: Place): Group {
  if (c.layer === 'country') return GROUPS.find(g => g.subregions?.includes(c.subregion!))!;
  return GROUPS.find(g => g.id === c.group)!;
}
export function placesIn(ds: Dataset, groupId: string) {
  const g = GROUPS.find(x => x.id === groupId)!;
  return g.layer === 'country' ? ds.countries.filter(c => g.subregions!.includes(c.subregion!)) : ds.places.filter(p => p.group === g.id && p.layer === g.layer);
}
export const countriesIn = placesIn;

export const nodeId = (groupId: string, topic: Topic) => `${groupId}/${topic}`;
export const parseNode = (id: string) => { const [g, t] = id.split('/'); return { groupId: g, topic: t as Topic }; };
export const groupById = (id: string) => GROUPS.find(g => g.id === id)!;
export const slotOf = (node: string) => { const { groupId, topic } = parseNode(node); return groupById(groupId).topics.find(t => t.id === topic)!; };

export interface CardRef { id: string; kind: Kind; country: Place }
export const cardId = (placeId: string, kind: Kind) => `${placeId}:${kind}`;

/** Some card types only make sense for some places. */
export function kindApplies(k: Kind, c: Place) {
  if (k === 'senatorFace') return !c.noFace && !!c.photo;
  if (k === 'currencyReverse') return !!c.currency?.some(x => x.shared === 1); // "the euro is the currency of…" has 20 answers
  return true;
}
const cur1 = (c: Place) => c.currency?.find(x => x.shared === 1) ?? c.currency?.[0];
const curText = (x: NonNullable<Place['currency']>[number]) => `${x.name}${x.code ? ` (${[x.code, x.symbol].filter(Boolean).join(' ')})` : ''}`;
const fmtPop = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} million` : `${Math.round(n / 1000)},000`);
/** "the Netherlands", "the United States" — country names that take "the" mid-sentence. */
export const theName = (c: Place) => (/^(Netherlands|United States|United Kingdom|United Arab Emirates|Philippines|Bahamas|Gambia|Maldives|Comoros|Marshall Islands|Solomon Islands|Central African Republic|Dominican Republic|Czech Republic|Seychelles|Vatican City|DR Congo|Republic of the Congo|Sahrawi)/.test(c.name) ? `the ${c.name}` : c.name);

export function cardsForNode(ds: Dataset, node: string): CardRef[] {
  const { groupId, topic } = parseNode(node);
  const out: CardRef[] = [];
  const seatTopic = topic === 'senate' || topic === 'governors' || topic === 'leaders';
  const pool = seatTopic ? ds.places.filter(p => p.layer === 'senate' && (p.topic ?? 'senate') === topic && p.group === groupId) : placesIn(ds, groupId);
  for (const c of pool) {
    if (topic === 'flags' && !c.flag) continue;
    if (topic === 'capitals' && !c.capitalAnswer) continue;
    if (topic === 'currency' && !c.currency?.length) continue;
    if (topic === 'cities' && !c.largestCity) continue;
    for (const k of TOPIC_KINDS[topic]) if (kindApplies(k, c)) out.push({ id: cardId(c.id, k), kind: k, country: c });
  }
  return out;
}

/** All kinds a place can be asked about (for its mastery colour). */
export function kindsFor(p: Place): Kind[] {
  if (p.layer === 'senate') return TOPIC_KINDS.senate.filter(k => kindApplies(k, p));
  const ks: Kind[] = ['locate', 'identify'];
  if (p.capitalAnswer) ks.push(...TOPIC_KINDS.capitals);
  if (p.flag) ks.push(...TOPIC_KINDS.flags);
  if (p.currency?.length) ks.push(...TOPIC_KINDS.currency.filter(k => kindApplies(k, p)));
  if (p.largestCity) ks.push(...TOPIC_KINDS.cities);
  return ks;
}

export function refFromId(ds: Dataset, id: string): CardRef | null {
  const [cid, kind] = id.split(':');
  const country = ds.byId.get(cid);
  return country ? { id, kind: kind as Kind, country } : null;
}

// ---- What a card shows ------------------------------------------------------------
// Cards are written as cloze sentences, like Anki: the blank shows a hint
// ("what?") and fills in with the answer when revealed.

export interface CardFace {
  mode: 'reveal' | 'tap';
  pre: string; blank: string; post: string;
  answer: string;                 // text that fills the blank
  answerFlag?: boolean;           // the answer is the flag picture itself
  promptFlag?: boolean;           // show the flag as the question
  map: 'none' | 'highlight' | 'tap';
  picture?: { file?: string | null; wiki?: string | null; caption: string };
  note?: string | null;
  person?: { photo: string; when: 'before' | 'after' }; // a portrait: shown as the question, or revealed with the answer
  hidePostUntilReveal?: boolean;                          // e.g. "…, the senior senator from New York." only after reveal
}

const cap1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const noun = (p: Place) => ({ country: 'country', water: 'body of water', river: 'river', lake: 'lake', cn: p.type ?? 'region', us: 'state', senate: 'senator' })[p.layer];

export function face(ref: CardRef): CardFace {
  const c = ref.country;
  const cap = c.capitals[0];
  const capPic = cap ? { file: cap.image, wiki: cap.wiki, caption: cap.name } : undefined;
  const ownPic = c.image || (c.layer !== 'country' && c.wiki) ? { file: c.image, wiki: c.wiki, caption: c.name } : undefined;
  const note = c.layer === 'country' ? (c.status !== 'un' ? c.statusNote : null) : c.layer === 'cn' ? cap1(c.type ?? '') : c.facts ?? null;
  const title = c.nameThe ? cap1(c.nameThe) : c.name;
  const capWord = c.capitals.length > 1 ? 'a capital' : 'the capital';
  const whichNoun = c.layer === 'cn' ? 'which province?' : c.layer === 'us' ? 'which state?' : 'which country?';
  switch (ref.kind) {
    case 'locate':
      return { mode: 'tap', pre: `${title} is `, blank: 'where? tap the map', post: '.', answer: 'right here', map: 'tap', note, picture: c.layer !== 'country' ? ownPic ?? capPic : undefined };
    case 'identify':
      return { mode: 'reveal', pre: `The highlighted ${c.layer === 'cn' ? 'part of China' : noun(c)} is `, blank: 'what?', post: '.', answer: c.nameThe ?? c.name, map: 'highlight', note, picture: c.layer !== 'country' ? ownPic ?? capPic : undefined };
    case 'capital':
      return { mode: 'reveal', pre: `The capital of ${c.name} is `, blank: 'what?', post: '.', answer: c.capitalAnswer!, map: 'none', picture: capPic, note: c.capitalNote ?? note };
    case 'capitalReverse':
      return { mode: 'reveal', pre: `${cap?.name} is ${capWord} of `, blank: whichNoun, post: '.', answer: c.name, map: 'none', picture: capPic, note: c.capitalNote ?? note };
    case 'capitalLocate':
      return { mode: 'tap', pre: `${cap?.name} is ${capWord} of `, blank: c.layer === 'cn' ? 'tap the province' : c.layer === 'us' ? 'tap the state' : 'tap the country', post: '.', answer: c.name, map: 'tap', picture: capPic, note: c.capitalNote ?? note };
    case 'flag':
      return { mode: 'reveal', pre: 'This is the flag of ', blank: whichNoun, post: '.', answer: c.name, promptFlag: true, map: 'none', note };
    // People in office (senators, governors, world leaders): the card follows the office, not the person.
    case 'senator':
      return { mode: 'reveal', pre: `The ${c.office} is `, blank: 'who?', post: '.', answer: c.name, map: 'highlight', note: c.facts, person: c.photo ? { photo: c.photo, when: 'after' } : undefined };
    case 'senatorFace':
      return { mode: 'reveal', pre: 'This is ', blank: 'who?', post: `, the ${c.office}.`, answer: c.name, map: 'none', note: c.facts, person: { photo: c.photo!, when: 'before' }, hidePostUntilReveal: true };
    case 'senatorLocate': {
      const isState = c.topic !== 'leaders';
      return { mode: 'tap', pre: `${c.name} is the ${c.rolePrefix} `, blank: isState ? 'tap the state' : 'tap the country', post: '.', answer: c.placeName!, map: 'tap', note: c.facts, person: c.photo ? { photo: c.photo, when: 'after' } : undefined };
    }
    case 'currency': {
      const list = c.currency ?? [];
      const shared = list.find(x => x.shared > 1);
      return { mode: 'reveal', pre: `The currency of ${theName(c)} is `, blank: 'what?', post: '.', answer: list.map(x => 'the ' + curText(x)).join(' and '), map: 'none',
        picture: list[0]?.wiki ? { wiki: list[0].wiki, caption: list[0].name } : undefined,
        note: shared ? `The ${shared.name} is used by ${shared.shared} countries in this app.` : null };
    }
    case 'currencyReverse': {
      const x = cur1(c)!;
      return { mode: 'reveal', pre: `The ${x.name}${x.code ? ` (${x.code})` : ''} is the currency of `, blank: 'which country?', post: '.', answer: c.name, map: 'none',
        picture: x.wiki ? { wiki: x.wiki, caption: x.name } : undefined, note: null };
    }
    case 'largestCity': {
      const L = c.largestCity!;
      return { mode: 'reveal', pre: `The largest city in ${theName(c)} is `, blank: 'what?', post: '.', answer: L.name, map: 'none',
        picture: { file: L.image, wiki: L.wiki, caption: L.name },
        note: `${L.isCapital ? 'Also the capital' : `Not the capital — that's ${c.capitalAnswer}`} · about ${fmtPop(L.population)} people (city proper)` };
    }
    case 'largestCityReverse': {
      const L = c.largestCity!;
      return { mode: 'reveal', pre: `${L.name} is the largest city in `, blank: 'which country?', post: '.', answer: c.name, map: 'none',
        picture: { file: L.image, wiki: L.wiki, caption: L.name }, note: L.isCapital ? 'It is also the capital.' : `The capital is ${c.capitalAnswer}.` };
    }
    case 'flagReverse':
      return { mode: 'reveal', pre: `The flag of ${c.name} looks like `, blank: 'what?', post: '', answer: '', answerFlag: true, map: 'none', note };
  }
}

/** Which extra map layer a card needs. */
export const layerFor = (p: Place) => (p.layer === 'country' ? null : p.layer === 'senate' ? (p.topic === 'leaders' ? null : 'us') : p.layer);

export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

/** Plural noun and icon for a layer, for headings and lists. */
export const LAYER_NOUN: Record<Place['layer'], string> = { country: 'countries', water: 'waters', river: 'rivers', lake: 'lakes', cn: 'divisions', us: 'states', senate: 'senators' };
export const LAYER_ICON: Record<Place['layer'], IconName> = { country: 'globe', water: 'wave', river: 'river', lake: 'drop', cn: 'map', us: 'map', senate: 'person' };

// ---- question directions ------------------------------------------------------------
/** "What is this?" — you're shown the place/flag/capital and name it.
 *  "Where / what is it?" — you're given the name and find it, or name its capital/flag. */
export const DIRECTIONS: { id: 'recognise' | 'recall'; name: string; hint: string; kinds: Kind[] }[] = [
  { id: 'recognise', name: 'What is this?', hint: 'shown it → name it', kinds: ['identify', 'flag', 'capitalReverse', 'senatorFace', 'currencyReverse', 'largestCityReverse'] },
  { id: 'recall', name: 'Where / what is it?', hint: 'given the name → find or answer it', kinds: ['locate', 'capitalLocate', 'capital', 'flagReverse', 'senator', 'senatorLocate', 'currency', 'largestCity'] },
];
export const KIND_SHORT: Record<Kind, string> = {
  identify: 'Map → name', flag: 'Flag → country', capitalReverse: 'Capital → country',
  locate: 'Name → map', capitalLocate: 'Capital → map', capital: 'Country → capital', flagReverse: 'Country → flag',
  senatorFace: 'Photo → person', senator: 'Office → person', senatorLocate: 'Person → map',
  currency: 'Country → currency', currencyReverse: 'Currency → country', largestCity: 'Country → largest city', largestCityReverse: 'City → country',
};

/** The skill-tree node a card belongs to. */
export function nodeOfCard(ref: CardRef): string {
  const g = groupOf(ref.country);
  const topic: Topic = ref.kind.startsWith('senator') ? (ref.country.topic ?? 'senate') : ref.kind.startsWith('currency') ? 'currency' : ref.kind.startsWith('largestCity') ? 'cities' : ref.kind.startsWith('capital') ? 'capitals' : ref.kind.startsWith('flag') ? 'flags' : g.layer === 'country' ? 'countries' : 'places';
  return nodeId(g.id, topic);
}
