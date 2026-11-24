import type { Dataset, NativeName, Origin, Place } from './types';
import { taxonSteps, type Step } from './tree';
import { timeSteps } from './geotime';
import type { IconName } from './components/Icons';

// ---- Card kinds ---------------------------------------------------------------
// Every fact is asked in both directions, and every card has a stable id
// `${wikidataId}:${kind}` so progress survives renames and data refreshes.

export type Kind = 'locate' | 'identify' | 'capital' | 'capitalReverse' | 'capitalLocate' | 'flag' | 'flagReverse' | 'senator' | 'senatorFace' | 'senatorLocate'
  | 'currency' | 'currencyReverse' | 'largestCity' | 'largestCityReverse' | 'belongsTo'
  | 'sitePhoto' | 'siteLocate' | 'siteCountry' | 'highest' | 'highestReverse' | 'note' | 'artPhoto' | 'artMaker' | 'artWhere' | 'artStyle' | 'bookLang' | 'musicComposer' | 'musicWork' | 'musicPart' | 'personFace' | 'personScene' | 'personBorn' | 'personPlays' | 'taxonId' | 'dinoTime' | 'roadShield' | 'presFace' | 'presName' | 'presNumber' | 'presYears' | 'presParty';
export type Topic = 'countries' | 'places' | 'capitals' | 'flags' | 'senate' | 'governors' | 'leaders' | 'currency' | 'cities' | 'sovereign' | 'sites' | 'peaks' | 'highest' | 'notes' | 'art' | 'shields' | 'presidents';

export const TOPIC_KINDS: Record<Topic, Kind[]> = {
  notes: ['note'],
  art: ['artPhoto', 'artMaker', 'artWhere', 'artStyle', 'bookLang', 'musicComposer', 'musicWork', 'musicPart', 'personFace', 'personScene', 'personBorn', 'personPlays', 'taxonId', 'dinoTime'],
  shields: ['roadShield'],
  presidents: ['presFace', 'presName', 'presNumber', 'presYears', 'presParty'],
  countries: ['locate', 'identify'],
  places: ['locate', 'identify'],
  capitals: ['capital', 'capitalReverse', 'capitalLocate'],
  flags: ['flag', 'flagReverse'],
  senate: ['senator', 'senatorFace', 'senatorLocate'],
  governors: ['senator', 'senatorFace', 'senatorLocate'],
  leaders: ['senator', 'senatorFace', 'senatorLocate'],
  currency: ['currency', 'currencyReverse'],
  cities: ['largestCity', 'largestCityReverse'],
  sovereign: ['belongsTo'],
  sites: ['sitePhoto', 'siteLocate', 'siteCountry'],
  peaks: ['siteLocate', 'siteCountry'],
  highest: ['highest', 'highestReverse'],
};

/** Cards answered by tapping the map (can be flipped like flashcards, or skipped, in settings). */
export const TAP_KINDS: Kind[] = ['locate', 'capitalLocate', 'senatorLocate', 'siteLocate'];

export const KIND_LABEL: Record<Kind, string> = {
  note: 'Card', artPhoto: 'Picture → name', artMaker: 'Who made it?', artWhere: 'Where is it?', artStyle: 'Which style?', bookLang: 'Which language?', musicComposer: 'Who composed it?', musicWork: 'Which piece?', musicPart: 'Which movement?', personFace: 'Who is this?', personScene: 'Which scene?', personBorn: 'Born where?', personPlays: 'Which instrument?', taxonId: 'Which animal?', dinoTime: 'When did it live?', roadShield: 'Name the shield', presFace: 'Who is this?', presName: 'Number → president', presNumber: 'Which number?', presYears: 'When?', presParty: 'Which party?',
  locate: 'Find it on the map', identify: 'Name it', capital: 'Name the capital',
  capitalReverse: 'Capital → name', capitalLocate: 'Capital → map', flag: 'Name the flag', flagReverse: 'Picture the flag',
  senator: 'Name the person', senatorFace: 'Who is this?', senatorLocate: 'Person → map',
  currency: 'Name the currency', currencyReverse: 'Currency → country', largestCity: 'Largest city', largestCityReverse: 'City → country', belongsTo: 'Part of which country?', sitePhoto: 'Photo → name', siteLocate: 'Find it on the map', siteCountry: 'Which country?', highest: 'Highest point', highestReverse: 'Peak → country',
};

/** Fingerprint of the facts a card depends on: if Wikidata changes it, the card is re-queued. */
export function fingerprint(kind: Kind, c: Place) {
  if (kind === 'note') return c.card?.fp ?? c.name;
  if (kind.startsWith('capital')) return `${c.name}|${c.capitalAnswer}`;
  if (kind.startsWith('flag')) return `${c.name}|${c.flag}`;
  if (kind.startsWith('senator')) return `${c.name}|${c.rank ?? c.office}`; // a new person in the seat re-queues it (not a party label)
  if (kind.startsWith('currency')) return `${c.name}|${c.currency?.map(x => x.name).join('/')}`;
  if (kind.startsWith('largestCity')) return `${c.name}|${c.largestCity?.name}`;
  if (kind.startsWith('highest')) return `${c.name}|${c.highest?.name}`;
  if (kind === 'artMaker') return `${c.name}|${makerOf(c)}`;
  if (kind.startsWith('pres')) return `${c.name}|${c.terms?.map(t => `${t.n}:${t.from}-${t.to}`).join(',')}`;
  if (kind === 'artWhere') return `${c.name}|${c.museum}|${c.countryName}`;
  if (kind === 'artStyle') return `${c.name}|${c.style}`;
  if (kind === 'bookLang') return `${c.name}|${c.language}`;
  if (kind.startsWith('person')) return `${c.name}|${kind === 'personScene' ? c.person?.scene : kind === 'personBorn' ? bornIn(c) : kind === 'personPlays' ? c.person?.instruments.join(',') : c.image}`;
  if (kind === 'taxonId') return `${c.name}|${c.image}`;
  if (kind === 'dinoTime') return `${c.name}|${c.taxon?.time?.epochs.join('-')}|${c.taxon?.time?.ages.join('-')}`; // a redating re-queues the card
  if (kind.startsWith('music')) return `${c.music?.file}|${c.music?.composer.name}|${c.music?.label}`;
  return c.name;
}

/** Fingerprints written by older versions that still count as unchanged. */
export function legacyFingerprints(kind: Kind, c: Place): string[] {
  return kind.startsWith('senator') ? [`${c.name}|${c.party}|${c.rank ?? c.office}`] : [];
}

// ---- Skill tree -----------------------------------------------------------------

export interface TopicSlot { id: Topic; name: string; icon: IconName; requires?: Topic }
export interface Group {
  id: string; section: string; name: string; layer: Place['layer'];
  subregions?: string[]; topics: TopicSlot[]; note?: string;
  requires?: string;   // a node from another group that must be half-known first (e.g. great rivers → more rivers)
  alsoInSections?: string[];
  nouns?: string;      // what its places are called ("districts", "prefectures"), for regions inside a country // also listed in these sections (Rivers of the United States shows under Rivers too)
}

const COUNTRY_TOPICS: TopicSlot[] = [
  { id: 'countries', name: 'Countries', icon: 'globe' },
  { id: 'capitals', name: 'Capitals', icon: 'landmark', requires: 'countries' },
  { id: 'flags', name: 'Flags', icon: 'flag', requires: 'countries' },
  { id: 'leaders', name: 'Leaders', icon: 'person', requires: 'countries' },
  { id: 'currency', name: 'Currencies', icon: 'coin', requires: 'countries' },
  { id: 'cities', name: 'Largest cities', icon: 'city', requires: 'countries' },
  { id: 'highest', name: 'Highest points', icon: 'mountain', requires: 'countries' },
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
    // Each continent is its own section under Rivers, so countries can nest inside (Rivers of the Americas › Rivers of the United States).
    .map(([id, name]): Group => ({ id, section: name, name: id === 'r-am' ? 'Major rivers of the Americas' : name, layer: 'river', requires: 'r-great/places', topics: [{ id: 'places', name: 'Rivers', icon: 'river' }] })),
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
  { id: 'r-us', section: 'Rivers of the United States', alsoInSections: ['United States'], name: 'Rivers of the United States', layer: 'river', topics: [{ id: 'places', name: 'Rivers', icon: 'river' }],
    note: 'The great US rivers plus the next tier down (the Hudson, Delaware, Susquehanna, Potomac…). Rivers shared with the world decks keep one set of progress.' },
  ...([['t-car', 'Caribbean territories'], ['t-pac', 'Pacific territories'], ['t-atl', 'Atlantic & European territories'], ['t-ind', 'Indian Ocean territories']] as const).map(([id, name]): Group => ({
    id, section: 'Territories', name, layer: 'terr',
    topics: [
      { id: 'places', name: 'Territories', icon: 'pin' },
      { id: 'sovereign', name: 'Belongs to', icon: 'flag', requires: 'places' },
      { id: 'capitals', name: 'Capitals', icon: 'landmark', requires: 'places' },
    ],
    note: id === 't-car' ? 'Places that aren’t independent countries — overseas regions, dependencies and autonomous territories — and the country each belongs to.' : undefined,
  })),
  ...([['u-icons', 'World Heritage icons'], ['u-eu', 'Europe'], ['u-as', 'Asia & Middle East'], ['u-af', 'Africa'], ['u-am', 'The Americas'], ['u-oc', 'Oceania']] as const).map(([id, name]): Group => ({
    id, section: 'World Heritage', name, layer: 'site', requires: id === 'u-icons' ? undefined : 'u-icons/sites',
    topics: [{ id: 'sites', name: id === 'u-icons' ? 'Icons' : 'Sites', icon: 'temple' }],
    note: id === 'u-icons' ? 'UNESCO World Heritage Sites. The 50 most famous (by how many Wikipedia languages cover them) come first; know half of them to unlock each continent’s best-known 40.' : undefined,
  })),
  { id: 'm-icons', section: 'Mountains', name: 'Famous peaks', layer: 'peak', topics: [{ id: 'peaks', name: 'Famous peaks', icon: 'mountain' }],
    note: 'The 40 best-known mountains (by how many Wikipedia languages cover them) come first; know half of them to unlock each continent’s peaks. Ranges are learned separately.' },
  ...([['m-eu', 'Peaks of Europe'], ['m-as', 'Peaks of Asia'], ['m-af', 'Peaks of Africa'], ['m-am', 'Peaks of the Americas'], ['m-oc', 'Peaks of Oceania']] as const)
    .map(([id, name]): Group => ({ id, section: 'Mountains', name, layer: 'peak', requires: 'm-icons/peaks', topics: [{ id: 'peaks', name: 'Peaks', icon: 'mountain' }] })),
  { id: 'm-ranges', section: 'Mountains', name: 'Great mountain ranges', layer: 'range', topics: [{ id: 'places', name: 'Ranges', icon: 'layers' }] },
  { id: 'm-ranges2', section: 'Mountains', name: 'More mountain ranges', layer: 'range', requires: 'm-ranges/places', topics: [{ id: 'places', name: 'Ranges', icon: 'layers' }] },
  // Interstate Highways: the main corridors (numbers ending in 0 or 5) first, then the rest.
  { id: 'hw-main', section: 'Interstate Highways', name: 'Main corridors', layer: 'road', nouns: 'Interstates',
    topics: [{ id: 'places', name: 'On the map', icon: 'road' }, { id: 'shields', name: 'Shields', icon: 'road', requires: 'places' }],
    note: 'The Interstates whose numbers end in 0 or 5: the long ones that cross the country. Odd numbers run north–south (I-5 in the west, I-95 in the east); even numbers run east–west (I-10 in the south, I-90 in the north).' },
  { id: 'hw-more', section: 'Interstate Highways', name: 'More Interstates', layer: 'road', nouns: 'Interstates', requires: 'hw-main/places',
    topics: [{ id: 'places', name: 'On the map', icon: 'road' }, { id: 'shields', name: 'Shields', icon: 'road', requires: 'places' }] },
  // US presidents, by era (History › History of the United States › Presidents).
  ...([['pr-1', 'Washington to Buchanan (1789–1861)'], ['pr-2', 'Lincoln to McKinley (1861–1901)'], ['pr-3', 'Theodore Roosevelt to FDR (1901–1945)'], ['pr-4', 'Truman to today (1945–)']] as const)
    .map(([id, name], i): Group => ({ id, section: 'Presidents', name, layer: 'person', nouns: 'presidents', requires: i ? 'pr-1/presidents' : undefined,
      topics: [{ id: 'presidents', name: 'Presidents', icon: 'person' }],
      note: i ? undefined : 'Every president from George Washington on: their portrait, their number, their years, their party, and their vice presidents. Grover Cleveland (22nd and 24th) and Donald Trump (45th and 47th) each served twice.' })),
  { id: 'd-great', section: 'Deserts', name: 'Great deserts', layer: 'desert', nouns: 'deserts', topics: [{ id: 'places', name: 'Great deserts', icon: 'sun' }],
    note: 'The best-known deserts of every continent first (the Sahara, Gobi, Atacama, Kalahari…); know half of them to unlock the rest. Shapes from Natural Earth, facts from Wikidata.' },
  { id: 'd-more', section: 'Deserts', name: 'More deserts', layer: 'desert', nouns: 'deserts', requires: 'd-great/places', topics: [{ id: 'places', name: 'Deserts', icon: 'sun' }] },
  { id: 'cn', section: 'China', name: 'Provinces & regions', layer: 'cn',
    note: 'Provinces, autonomous regions, municipalities and the two special administrative regions. The PRC also claims Taiwan as a province; Taiwan is covered under countries.',
    topics: [{ id: 'places', name: 'Provinces', icon: 'map' }, { id: 'capitals', name: 'Capitals', icon: 'landmark', requires: 'places' }] },
];

export const SECTIONS = ['Europe', 'Americas', 'Asia', 'Africa', 'Oceania', 'United States', 'Territories', 'World Heritage', 'Mountains', 'Oceans & Seas', 'Rivers', 'Rivers of Europe', 'Rivers of Asia & Oceania', 'Rivers of Africa', 'Rivers of the Americas', 'Rivers of the United States', 'Lakes', 'China', 'Interstate Highways', 'Deserts', 'Physical geography', 'History', 'History of the United States', 'Presidents'];
export const CONTINENTS = SECTIONS.slice(0, 5);

// ---- Sections form a tree -------------------------------------------------------------
// A country (or state) studied in depth sits inside its parent: Americas › United States › New Jersey.
// The skill tree, quiz and atlas all drill down through this, so new regions never pile up at the bottom.
/** The groups listed in a section: its own, plus any filed elsewhere that also belong here. */
export const groupsShownIn = (sec: string) => GROUPS.filter(g => g.section === sec || g.alsoInSections?.includes(sec));
export const SECTION_PARENT: Record<string, string> = { 'United States': 'Americas', China: 'Asia', 'Interstate Highways': 'United States', Presidents: 'History of the United States', 'History of the United States': 'History',
  // Physical geography: the land and water themselves, apart from countries and their regions.
  Mountains: 'Physical geography', Rivers: 'Physical geography', Lakes: 'Physical geography', 'Oceans & Seas': 'Physical geography', Deserts: 'Physical geography',
  'Rivers of Europe': 'Rivers', 'Rivers of Asia & Oceania': 'Rivers', 'Rivers of Africa': 'Rivers', 'Rivers of the Americas': 'Rivers', 'Rivers of the United States': 'Rivers of the Americas' };
/**
 * A section for a deck or collection folder. Section names are global, so a folder can't take over one that already
 * belongs elsewhere (an art folder called "Americas" once pulled Geography's Americas under Art): it gets its own name.
 */
export function claimSection(name: string, parent: string | null): string {
  if (SECTIONS.includes(name) && (SECTION_PARENT[name] ?? null) !== parent) {
    const own = `${name} (${parent})`;
    if (!SECTIONS.includes(own)) { SECTIONS.push(own); if (parent) SECTION_PARENT[own] = parent; }
    return own;
  }
  if (!SECTIONS.includes(name)) SECTIONS.push(name);
  if (parent) SECTION_PARENT[name] = parent;
  return name;
}
export const childSections = (sec: string | null) => SECTIONS.filter(s => (SECTION_PARENT[s] ?? null) === sec);
/** The section and its ancestors, outermost first: ['Americas', 'United States', 'New Jersey']. */
export function sectionChain(sec: string): string[] { const out = [sec]; while (SECTION_PARENT[out[0]]) out.unshift(SECTION_PARENT[out[0]]); return out; }
/** A section and everything nested inside it. */
export const sectionAndDescendants = (sec: string): string[] => [sec, ...childSections(sec).flatMap(sectionAndDescendants)];

/** Regions inside a country (public/data/subdivisions.json): each entry becomes a section, groups and two skills. */
export interface SubSection { id: string; section: string; parent: string; noun: string; nouns: string; capital: string; groups: { id: string; name: string }[] }
export function registerSubdivisions(sections: SubSection[]) {
  for (const s of sections) {
    if (!SECTIONS.includes(s.section)) SECTIONS.push(s.section);
    SECTION_PARENT[s.section] = s.parent;
    const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
    for (const g of s.groups) if (!GROUPS.some(x => x.id === g.id)) GROUPS.push({
      id: g.id, section: s.section, name: g.name, layer: 'sub',
      nouns: s.nouns, topics: [{ id: 'places', name: cap(s.nouns), icon: 'map' }, { id: 'capitals', name: cap(s.capital) + (/s$/.test(s.capital) ? '' : 's'), icon: 'landmark', requires: 'places' }],
      note: g.id === s.groups[0].id ? `The ${s.nouns} of ${s.section} and their ${s.capital}s. Borders come from ${s.id === 'nj' ? 'the US Census' : 'Natural Earth'}; facts from Wikidata.` : undefined,
    });
  }
}

export function groupOf(c: Place): Group {
  if (c.layer === 'country') return GROUPS.find(g => g.subregions?.includes(c.subregion!))!;
  return GROUPS.find(g => g.id === c.group)!;
}
export function placesIn(ds: Dataset, groupId: string) {
  const g = GROUPS.find(x => x.id === groupId)!;
  return g.layer === 'country' ? ds.countries.filter(c => g.subregions!.includes(c.subregion!)) : ds.places.filter(p => (p.group === g.id || p.alsoIn?.includes(g.id)) && p.layer === g.layer);
}
export const countriesIn = placesIn;

export const nodeId = (groupId: string, topic: Topic) => `${groupId}/${topic}`;
export const parseNode = (id: string) => { const [g, t] = id.split('/'); return { groupId: g, topic: t as Topic }; };
export const groupById = (id: string) => GROUPS.find(g => g.id === id)!;
export const slotOf = (node: string) => { const { groupId, topic } = parseNode(node); return groupById(groupId).topics.find(t => t.id === topic)!; };

export interface CardRef { id: string; kind: Kind; country: Place }
export const cardId = (placeId: string, kind: Kind) => `${placeId}:${kind}`;

/** How many countries a site or peak is listed in. */
const countryCount = (c: Place) => (c.countryName ? c.countryName.split(/, | and /).length : 0);
/** Some card types only make sense for some places. */
export function kindApplies(k: Kind, c: Place) {
  if (k === 'senatorFace') return !c.noFace && !!(c.photo || c.wiki);
  if (k === 'sitePhoto') return c.layer === 'site' && !!c.image; // a mountain from a photo alone is too hard to be fair
  if (k === 'senatorLocate' && c.manyPlaces) return false;
  // "The capital of Hiroshima Prefecture is Hiroshima" gives itself away: skip those for regions inside a country.
  if (k.startsWith('capital') && c.layer === 'sub' && c.capitals[0] && c.name.startsWith(c.capitals[0].name)) return false;
  if (k === 'siteCountry' && countryCount(c) > 3) return false; // "in Moldova, Ukraine, Latvia… and Norway" isn't a fair question
  if (k === 'highestReverse') return !!c.highest && !c.highestShared;
  if (k === 'presFace') return !!c.photo;
  if (k === 'presParty') return !!c.terms?.some(t => t.party !== 'Unaffiliated');
  if (k === 'artPhoto') return !c.person && !c.taxon && !!c.image; // a free picture on Commons (a modern painting under copyright has none to show as the question)
  if (k === 'artMaker') return !!makerOf(c);
  if (k === 'artWhere') return !c.book && !c.music && !c.person && !!(c.museum || c.countryName);
  if (k === 'musicComposer' || k === 'musicWork') return !!c.music;
  if (k === 'personFace') return !!c.person && !!c.image;
  // Animals are named from a photo; dinosaurs, told apart by their bones, are asked when they lived instead.
  if (k === 'taxonId') return !!c.taxon && !c.taxon.when && !!c.image;
  if (k === 'dinoTime') return !!c.taxon?.time;
  if (k === 'personScene') return !!c.person?.scene;
  if (k === 'personBorn') return !!c.person && !!bornIn(c);
  if (k === 'personPlays') return !!c.person?.instruments.length;
  if (k === 'musicPart') return !!c.music?.label && c.music.siblings.length > 1; // which movement, only when there's a choice
  if (k === 'bookLang') return !!c.book && !!c.language && c.language !== 'English'; // English would be a give-away for most
  if (k === 'artStyle') return !!c.building && !!c.style;
  if (k === 'currencyReverse') return !!c.currency?.some(x => x.shared === 1); // "the euro is the currency of…" has 20 answers
  return true;
}
const cur1 = (c: Place) => c.currency?.find(x => x.shared === 1) ?? c.currency?.[0];
const curText = (x: NonNullable<Place['currency']>[number]) => `${x.name}${x.code ? ` (${[x.code, x.symbol].filter(Boolean).join(' ')})` : ''}`;
const fmtPop = (n: number) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)} billion` : n >= 1e6 ? `${(n / 1e6).toFixed(1)} million` : n >= 1e4 ? `${Math.round(n / 1000).toLocaleString('en-US')},000` : n.toLocaleString('en-US'));
/** "the Netherlands", "the United States" — country names that take "the" mid-sentence. */
export const theName = (c: Place) => (/^(Netherlands|United States|United Kingdom|United Arab Emirates|Philippines|Bahamas|Gambia|Maldives|Comoros|Marshall Islands|Solomon Islands|Central African Republic|Dominican Republic|Czech Republic|Seychelles|DR Congo|Republic of the Congo|Sahrawi)/.test(c.name) ? `the ${c.name}` : c.name);

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
    if (topic === 'highest' && !c.highest) continue;
    for (const k of TOPIC_KINDS[topic]) if (kindApplies(k, c)) out.push({ id: cardId(c.id, k), kind: k, country: c });
  }
  return out;
}

/** All kinds a place can be asked about (for its mastery colour). */
export function kindsFor(p: Place): Kind[] {
  if (p.layer === 'note') return ['note'];
  if (p.layer === 'senate') return TOPIC_KINDS.senate.filter(k => kindApplies(k, p));
  if (p.layer === 'site' || p.layer === 'peak') return TOPIC_KINDS.sites.filter(k => kindApplies(k, p));
  if (p.layer === 'art') return TOPIC_KINDS.art.filter(k => kindApplies(k, p));
  if (p.layer === 'person') return TOPIC_KINDS.presidents.filter(k => kindApplies(k, p));
  const ks: Kind[] = ['locate', 'identify'];
  if (p.layer === 'road') ks.push('roadShield');
  if (p.capitalAnswer) ks.push(...TOPIC_KINDS.capitals.filter(k => kindApplies(k, p)));
  if (p.layer === 'terr') ks.push('belongsTo');
  if (p.flag && p.layer !== 'terr') ks.push(...TOPIC_KINDS.flags);
  if (p.currency?.length) ks.push(...TOPIC_KINDS.currency.filter(k => kindApplies(k, p)));
  if (p.largestCity) ks.push(...TOPIC_KINDS.cities);
  if (p.highest) ks.push(...TOPIC_KINDS.highest.filter(k => kindApplies(k, p)));
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
  map: 'none' | 'highlight' | 'tap' | 'reveal'; // reveal: map shows the wider area, then zooms to the answer when flipped
  picture?: { file?: string | null; wiki?: string | null; url?: string | null; caption: string; single?: boolean };
  frontBack?: boolean;            // a note card's front :: back: the answer appears below the question
  promptPicture?: boolean; // show the picture as the question (World Heritage photo cards)
  parts?: (string | { answer: string; hint?: string })[]; // a sentence with several blanks hidden together
  code?: { lang: string; text: string }; // a note card's code: shown with the question (a \u0000 in it is the blank)
  source?: string;                         // the app file that code is quoted from (a link on GitHub)
  picture2?: { file: string; caption: string; prompt: boolean }; // a second picture: with the question (a fossil), or after it (a range map)
  lineage?: { steps: Step[]; label: string }; // shown with the answer: the animal's place in the tree, or the dinosaur's in time
  strata?: string;         // a geologic time card: the unit's place in the time scale and its (blank) parts
  note?: string | null;
  audio?: { file: string; start: number }; // a recording is the question (music)
  origin?: Origin | null;         // the answer is a person: where they're from (flag of the time), shown with the answer
  say?: (NativeName & { asWritten?: boolean }) | null; // the answer (the green text) in its own language: a speaker beside it
  person?: { photo: string; when: 'before' | 'after' }; // a portrait: shown as the question, or revealed with the answer
  hidePostUntilReveal?: boolean;                          // e.g. "…, the senior senator from New York." only after reveal
}

/** Who made an artwork: its artist(s), else the culture ("the Olmec"). */
export const makerOf = (c: Place) => (c.artists?.length ? c.artists.reduce((acc, x, i, a) => (!i ? x : acc + (i === a.length - 1 ? ' and ' : ', ') + x), '') : c.culture ? `the ${c.culture}` : null);
// Only the work's own picture. With none (a portrait still under copyright), no picture at all: the Wikipedia article's
// other images are *other* works (the Michelle Obama portrait's article shows a Klimt), never to be passed off as this one.
const artPic = (c: Place) => (c.image ? { file: c.image, wiki: c.wiki, caption: c.name, single: true } : undefined);
const artNote = (c: Place, withMaker: boolean) => [withMaker && makerOf(c) ? `By ${makerOf(c)}` : null, c.facts].filter(Boolean).join(' · ') || null;
const fmtYear = (y: number | null | undefined) => (y == null ? null : y <= 0 ? `c. ${Math.abs(y) || 1} BC` : y < 1000 ? `c. AD ${y}` : `c. ${y}`); // as in collections.ts (which imports this file)
/** A person's name: when it's written in our alphabet the voice reads the name as the card shows it (Wikidata's own-language
 *  name can be the full birth name: "Johann Chrysostomus Wolfgang Gottlieb Mozart"); other scripts are shown and read. */
const asName = (n?: NativeName) => (n ? { ...n, asWritten: true } : null);
/** "New Orleans, Louisiana"; "Washington, D.C."; abroad, "Lisbon, Portugal". */
const bornIn = (c: Place) => { const p = c.person; if (!p?.birthplace) return null; const where = p.state ?? (p.countryName !== 'United States' ? p.countryName : null); return where && p.birthplace !== where && !p.birthplace.endsWith(`, ${where}`) && p.birthplace !== 'New York City' ? `${p.birthplace}, ${where}` : p.birthplace; }; // Kansas City, Kansas ≠ Kansas City, Missouri
const plays = (xs: string[]) => (xs.length === 1 ? (/^(vocals|drums|keyboards)$/.test(xs[0]) ? xs[0] : `the ${xs[0]}`) : xs.map(x => (/^(vocals|drums|keyboards)$/.test(x) ? x : `the ${x}`)).join(' and '));
/** Scenes named by a place read as "the New Orleans scene"; styles as they are ("bebop"). */
const sceneName = (s: string) => (/^(New Orleans|Chicago|Harlem|Kansas City|Swing-era New York)$/.test(s) ? `the ${s} scene` : s.charAt(0).toLowerCase() + s.slice(1));
const personNote = (c: Place) => { const p = c.person!; return [p.born ? `${p.born}–${p.died ?? ''}` : null, bornIn(c) && !p.origin ? `born in ${bornIn(c)}` : null, p.instruments.join(', ') || null, p.scene].filter(Boolean).join(' · '); };
/** "the humpback whale" (a species), "Tyrannosaurus" (a genus, as dinosaurs are named). */
const theOf = (c: Place) => (c.taxon?.genusOnly ? c.name : (c.nameThe ?? c.name).replace(/^an? /, 'the '));
const composerPic = (m: NonNullable<Place['music']>) => (m.composer.image ? { file: m.composer.image, caption: m.composer.name, single: true } : undefined);
const life = (m: NonNullable<Place['music']>) => (m.composer.born ? `${m.composer.born}–${m.composer.died ?? ''}` : null);
const musicNote = (c: Place) => { const m = c.music!; return [`${m.composer.name}${life(m) ? ` (${life(m)})` : ''}`, m.composer.countryName, m.era, fmtYear(c.year)].filter(Boolean).join(' · '); };
/** "16th", "22nd and 24th" */
const ordinal = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
const presNumbers = (c: Place) => (c.terms ?? []).map(t => ordinal(t.n)).join(' and ');
const presNote = (c: Place) => (c.terms ?? []).map(t => [`${ordinal(t.n)} president, ${t.to === null ? `${t.from}–` : t.from === t.to ? t.from : `${t.from}–${t.to}`}`, t.party,
  t.vp.length ? `Vice president: ${t.vp.join(', then ')}` : 'No vice president'].join(' · ')).join(' | ');
const cap1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const noun = (p: Place) => ({ country: 'country', water: 'body of water', river: 'river', lake: 'lake', cn: p.type ?? 'region', us: 'state', senate: 'senator', terr: 'territory', site: 'site', peak: 'mountain', range: 'mountain range', sub: p.noun ?? 'region', note: 'card', art: 'work', road: 'Interstate', desert: 'desert', person: 'president' })[p.layer];

function rawFace(ref: CardRef): CardFace {
  const c = ref.country;
  if (ref.kind === 'note' && c.card) {
    // Note decks: a cloze ("Equal parts {{gin}}, Campari…") or a front :: back card.
    const n = c.card;
    if (n.strata) return { mode: 'reveal', pre: n.pre, blank: '', post: '', answer: n.answer, map: 'none', note: n.note, frontBack: true, strata: n.strata };
    const code = { code: n.code, source: n.source };
    return n.front
      ? { ...code, mode: 'reveal', pre: n.pre, blank: '', post: '', answer: n.answer, map: 'none', note: n.note, picture: n.picture ? { file: n.picture.file, url: n.picture.url, caption: n.picture.caption, single: n.pictureFirst } : undefined, frontBack: true, promptPicture: !!(n.pictureFirst && n.picture) }
      : { ...code, mode: 'reveal', pre: n.pre, blank: n.hint ?? 'what?', post: n.post, answer: n.answer, map: 'none', note: n.note, parts: n.parts,
          picture: n.picture ? { file: n.picture.file, url: n.picture.url, caption: n.picture.caption, single: n.pictureFirst } : undefined, promptPicture: !!(n.pictureFirst && n.picture) };
  }
  const cap = c.capitals[0];
  const capPic = cap ? { file: cap.image, wiki: cap.wiki, caption: cap.name } : undefined;
  const ownPic = c.image || (c.layer !== 'country' && c.wiki) ? { file: c.image, wiki: c.wiki, caption: c.name } : undefined;
  const note = c.layer === 'country' ? (c.status !== 'un' ? c.statusNote : null) : c.layer === 'cn' ? cap1(c.type ?? '') : c.facts ?? null; // territories: "Overseas region · Part of France", shown once the card is flipped
  // Countries, states and provinces: their population, shown once the card is flipped.
  const popNote = c.population && ['country', 'us', 'cn', 'sub', 'terr'].includes(c.layer) ? `Population about ${fmtPop(c.population)}${c.populationYear ? ` (${c.populationYear})` : ''}` : null;
  const placeNote = [note, popNote].filter(Boolean).join(' · ') || null;
  const title = c.nameThe ? cap1(c.nameThe) : c.name;
  const capNoun = c.capWord ?? 'capital'; // "county seat" for counties
  const capWord = c.capitals.length > 1 ? `a ${capNoun}` : `the ${capNoun}`;
  const placeNoun = c.layer === 'cn' ? 'province' : c.layer === 'us' ? 'state' : c.layer === 'terr' ? 'territory' : c.layer === 'sub' ? noun(c) : 'country';
  const whichNoun = `which ${placeNoun}?`;
  switch (ref.kind) {
    case 'locate':
      return { mode: 'tap', pre: `${title} ${c.layer === 'range' && /s$/.test(c.name) ? 'are' : 'is'} `, blank: 'where? tap the map', post: '.', answer: 'right here', map: 'tap', note: placeNote, picture: c.layer !== 'country' ? ownPic ?? capPic : undefined };
    case 'identify':
      return { mode: 'reveal', pre: `The highlighted ${c.layer === 'cn' ? 'part of China' : noun(c)} ${c.layer === 'range' ? 'is' : 'is'} `, blank: 'what?', post: '.', answer: c.nameThe ?? c.name, map: 'highlight', note: placeNote, picture: c.layer !== 'country' ? ownPic ?? capPic : undefined };
    case 'capital':
      return { mode: 'reveal', pre: `The ${capNoun} of ${c.name} is `, blank: 'what?', post: '.', answer: c.capitalAnswer!, map: 'reveal', picture: capPic, note: c.capitalNote ?? note };
    case 'capitalReverse':
      return { mode: 'reveal', pre: `${cap?.name} is ${capWord} of `, blank: whichNoun, post: '.', answer: c.name, map: 'reveal', picture: capPic, note: c.capitalNote ?? note };
    case 'capitalLocate':
      return { mode: 'tap', pre: `${cap?.name} is ${capWord} of `, blank: `tap the ${placeNoun}`, post: '.', answer: c.name, map: 'tap', picture: capPic, note: c.capitalNote ?? note };
    case 'flag':
      return { mode: 'reveal', pre: 'This is the flag of ', blank: whichNoun, post: '.', answer: c.name, promptFlag: true, map: 'none', note };
    // People in office (senators, governors, world leaders): the card follows the office, not the person.
    case 'senator':
      return { mode: 'reveal', pre: `The ${c.office} is `, blank: 'who?', post: '.', answer: c.name, map: 'highlight', note: c.facts, person: { photo: c.photo ?? '', when: 'after' } };
    case 'senatorFace':
      return { mode: 'reveal', pre: 'This is ', blank: 'who?', post: `, the ${c.office}.`, answer: c.name, map: 'none', note: c.facts, person: { photo: c.photo ?? '', when: 'before' }, hidePostUntilReveal: true };
    case 'senatorLocate': {
      const isState = c.topic !== 'leaders';
      return { mode: 'tap', pre: `${c.name} is the ${c.rolePrefix} `, blank: isState ? 'tap the state' : 'tap the country', post: '.', answer: c.placeName!, map: 'tap', note: c.facts, person: { photo: c.photo ?? '', when: 'after' } };
    }
    case 'currency': {
      const list = c.currency ?? [];
      const shared = list.find(x => x.shared > 1);
      return { mode: 'reveal', pre: `The currency of ${theName(c)} is `, blank: 'what?', post: '.', answer: list.map(x => 'the ' + curText(x)).join(' and '), map: 'none',
        picture: list[0]?.image ? { file: list[0].image, caption: list[0].name } : list[0]?.wiki ? { wiki: list[0].wiki, caption: list[0].name } : undefined,
        note: shared ? `The ${shared.name} is used by ${shared.shared} countries in this app.` : null };
    }
    case 'currencyReverse': {
      const x = cur1(c)!;
      return { mode: 'reveal', pre: `The ${x.name}${x.code ? ` (${x.code})` : ''} is the currency of `, blank: 'which country?', post: '.', answer: c.name, map: 'none',
        picture: x.image ? { file: x.image, caption: x.name } : x.wiki ? { wiki: x.wiki, caption: x.name } : undefined, note: null };
    }
    case 'largestCity': {
      const L = c.largestCity!;
      return { mode: 'reveal', pre: `The largest city in ${theName(c)} is `, blank: 'what?', post: '.', answer: L.name, map: 'reveal',
        picture: { file: L.image, wiki: L.wiki, caption: L.name },
        note: `${L.isCapital ? 'Also the capital' : `Not the capital — that's ${c.capitalAnswer}`} · about ${fmtPop(L.population)} people (city proper)` };
    }
    case 'largestCityReverse': {
      const L = c.largestCity!;
      return { mode: 'reveal', pre: `${L.name} is the largest city in `, blank: 'which country?', post: '.', answer: c.name, map: 'reveal',
        picture: { file: L.image, wiki: L.wiki, caption: L.name }, note: L.isCapital ? 'It is also the capital.' : `The capital is ${c.capitalAnswer}.` };
    }
    case 'belongsTo':
      return { mode: 'reveal', pre: `${c.nameThe ?? c.name} is part of `, blank: 'which country?', post: '.', answer: c.sovereignName!, map: 'highlight', note: c.facts,
        picture: c.wiki ? { file: c.image, wiki: c.wiki, caption: c.name } : undefined };
    case 'sitePhoto':
      return { mode: 'reveal', pre: c.layer === 'peak' ? 'This mountain is ' : 'This World Heritage Site is ', blank: 'what?', post: '.', answer: c.name, map: 'reveal', note: c.facts,
        picture: { file: c.image, wiki: c.wiki, caption: c.name }, promptPicture: true };
    case 'siteLocate':
      return { mode: 'tap', pre: `${c.name} is `, blank: 'where? tap the map', post: '.', answer: !c.countryName ? 'right here' : countryCount(c) > 3 ? `in ${countryCount(c)} countries` : c.admin1 && countryCount(c) === 1 ? `in ${c.admin1}, ${c.countryName}` : `in ${c.countryName}`, map: 'tap', note: c.facts,
        picture: { file: c.image, wiki: c.wiki, caption: c.name } };
    case 'siteCountry':
      return { mode: 'reveal', pre: `${c.name} is in `, blank: 'which country?', post: '.', answer: c.countryName!, map: 'reveal', note: c.facts,
        picture: { file: c.image, wiki: c.wiki, caption: c.name } };
    case 'highest': {
      const h = c.highest!;
      return { mode: 'reveal', pre: `The highest point of ${theName(c)} is `, blank: 'what?', post: '.', answer: `${h.name}${h.elevation ? ` (${h.elevation.toLocaleString('en-US')} m)` : ''}`,
        map: 'reveal', note: h.note, picture: { file: h.image, wiki: h.wiki, caption: h.name } };
    }
    case 'highestReverse': {
      const h = c.highest!;
      return { mode: 'reveal', pre: `${h.name}${h.elevation ? ` (${h.elevation.toLocaleString('en-US')} m)` : ''} is the highest point of `, blank: 'which country?', post: '.', answer: c.name,
        map: 'reveal', note: h.note, picture: { file: h.image, wiki: h.wiki, caption: h.name } };
    }
    case 'flagReverse':
      return { mode: 'reveal', pre: `The flag of ${c.name} looks like `, blank: 'what?', post: '', answer: '', answerFlag: true, map: 'none', note };
    // Artworks: the picture, who made it, where it is now.
    case 'artPhoto':
      return { mode: 'reveal', pre: c.plural ? 'These are ' : 'This is ', blank: 'what?', post: '.', answer: c.nameThe ?? c.name, map: 'none', note: artNote(c, true), picture: artPic(c), promptPicture: true, say: c.native?.[0] };
    case 'artMaker': {
      const v = c.book ? 'written' : c.building ? 'designed' : /paint|fresco|print|drawing|mural/i.test(c.facts ?? '') ? 'painted' : /statue|sculpt|bust|bronze|cast/i.test(c.facts ?? '') ? 'sculpted' : 'made';
      return { mode: 'reveal', pre: `${c.nameThe ?? c.name} ${c.plural ? 'were' : 'was'} ${v} by `, blank: c.artists?.length ? 'whom?' : 'which people?', post: '.', answer: makerOf(c)!, map: 'none', note: artNote(c, false), picture: artPic(c), say: c.artists?.length === 1 ? asName(c.makerNative?.[0]) : null, origin: c.makerOrigin };
    }
    case 'artWhere':
      if (c.building) return { mode: 'reveal', pre: `${cap1(c.nameThe ?? c.name)} ${c.plural ? 'stand' : 'stands'} `, blank: 'in which city?', post: '.', answer: `in ${c.city ?? c.countryName}${c.city && c.countryName && c.city !== c.countryName ? ` (${c.countryName})` : ''}`, map: c.country ? 'reveal' : 'none', note: artNote(c, true), picture: artPic(c) };
      return { mode: 'reveal', pre: `You can see ${c.nameThe ?? c.name} `, blank: 'where?', post: '.', answer: c.museum ? `${/^Corcovado/.test(c.museum) ? 'on' : /^the |museum|gallery|institute|belvedere|rijksmuseum|mauritshuis/i.test(c.museum) ? 'at' : 'in'} ${c.museum}${c.countryName && !c.museum.includes(c.countryName) ? ` (${c.countryName})` : ''}` : `in ${c.countryName}`, map: c.country ? 'reveal' : 'none', note: artNote(c, true), picture: artPic(c) };
    // Music: the clip plays; name the composer, the piece, or (in a work of several movements) which one.
    case 'musicComposer': {
      const m = c.music!;
      return { mode: 'reveal', pre: 'This music was composed by ', blank: 'whom?', post: '.', answer: m.composer.name, map: 'none', audio: { file: m.file, start: m.start }, note: musicNote(c), picture: composerPic(m), say: asName(m.composer.native?.[0]) };
    }
    case 'musicWork': {
      const m = c.music!;
      return { mode: 'reveal', pre: 'This is ', blank: 'which piece?', post: m.label ? ` (${m.label}).` : '.', answer: m.work, map: 'none', audio: { file: m.file, start: m.start }, note: musicNote(c), picture: composerPic(m), hidePostUntilReveal: true, say: c.native?.[0] };
    }
    case 'musicPart': {
      const m = c.music!;
      return { mode: 'reveal', pre: `From ${m.work}, by ${m.composer.name}: this is `, blank: 'which part?', post: '.', answer: m.label!, map: 'none', audio: { file: m.file, start: m.start }, note: musicNote(c), picture: composerPic(m) };
    }
    // People: the face, the scene they're known for, where they were born (to the state), what they played.
    case 'personFace':
      return { mode: 'reveal', pre: 'This is ', blank: 'who?', post: '.', answer: c.name, map: 'none', note: personNote(c), person: { photo: c.image!, when: 'before' }, say: asName(c.person?.native?.[0]), origin: c.person?.origin ? { ...c.person.origin, place: bornIn(c) ?? c.person.origin.place } : null }; // US birthplaces keep their state
    case 'personScene':
      return { mode: 'reveal', pre: `${c.name} is known for `, blank: 'which scene?', post: '.', answer: sceneName(c.person!.scene!), map: 'none', note: personNote(c), person: { photo: c.image ?? '', when: 'after' } };
    case 'personBorn':
      return { mode: 'reveal', pre: `${c.name} was born in `, blank: 'which city and state?', post: '.', answer: bornIn(c)!, map: c.country ? 'reveal' : 'none', note: personNote(c), person: { photo: c.image ?? '', when: 'after' } };
    case 'personPlays':
      return { mode: 'reveal', pre: `${c.name} ${c.person!.died ? 'was' : 'is'} known for `, blank: 'which instrument?', post: '.', answer: plays(c.person!.instruments), map: 'none', note: personNote(c), person: { photo: c.image ?? '', when: 'after' } };
    // Animals and plants: a photo to name, its place in the tree on the back. Dinosaurs: when they lived.
    case 'taxonId': { // the photo → the animal; the back: its Latin name (read aloud), its place in the tree, where it lives
      const t = c.taxon!;
      return { mode: 'reveal', pre: 'This is ', blank: 'which animal?', post: '.', answer: c.nameThe ?? c.name, map: 'none', picture: artPic(c), promptPicture: true,
        note: [t.note ? cap1(t.note) : null, t.status && t.status !== 'least concern' ? `Status: ${t.status}` : null].filter(Boolean).join(' · ') || null,
        say: c.species ? { name: c.species, lang: 'Latin', code: 'la' } : null,
        lineage: { steps: taxonSteps(t.branch, c.species, c.name.toLowerCase()), label: `Where ${theOf(c)} sits in the tree of life` },
        picture2: t.rangeMap ? { file: t.rangeMap, caption: `Where ${theOf(c)} lives`, prompt: false } : undefined };
    }
    case 'dinoTime': { // the dinosaur (life-like, and its fossil) → when it lived: the epoch and age, drawn as time-scale blocks
      const t = c.taxon!, { epochs, ages } = t.time!;
      const when = epochs.length > 1 ? `the ${epochs[0].split(' ')[0]} to ${epochs[1]}` : `the ${epochs[0]}`;
      const age = ages.length > 1 ? `, from the ${ages[0]} to the ${ages[1]} age` : ages.length ? `, in the ${ages[0]} age` : '';
      return { mode: 'reveal', pre: `${c.name}${c.species ? ` (${c.species})` : ''} lived in `, blank: ages.length ? 'which period, epoch and age?' : 'which period and epoch?', post: '.',
        answer: when + age, map: 'none', picture: artPic(c), promptPicture: true,
        note: [t.note ? `Fossils found ${t.note.split(';')[0]}` : null, t.note?.split('; ')[1] ?? null, t.time!.from ? `as ${t.time!.from} has it` : null].filter(Boolean).join(' · ') || null,
        lineage: { steps: timeSteps(t.time!), label: `When ${c.name} lived, in the geologic time scale` },
        picture2: t.fossil ? { file: t.fossil, caption: `A fossil of ${c.name}`, prompt: true } : undefined };
    }
    case 'bookLang': // books: "Don Quixote was first written in Spanish."
      return { mode: 'reveal', pre: `${cap1(c.nameThe ?? c.name)} ${c.plural ? 'were' : 'was'} first written in `, blank: 'which language?', post: '.', answer: c.language!, map: 'none', note: artNote(c, true), picture: artPic(c) };
    case 'artStyle': // buildings: "Notre-Dame de Paris was built in the Gothic style."
      return { mode: 'reveal', pre: `${cap1(c.nameThe ?? c.name)} ${c.plural ? 'were' : 'was'} built in the `, blank: 'which style?', post: ' style.', answer: c.style!.replace(/ architecture$/i, ''), map: 'none', note: artNote(c, true), picture: artPic(c) };
    // US presidents: the portrait, the number, the years, the party; the vice president(s) shown once flipped.
    case 'presFace':
      return { mode: 'reveal', pre: 'This is ', blank: 'who?', post: `, the ${presNumbers(c)} president.`, answer: c.name, map: 'none', note: presNote(c), person: { photo: c.photo ?? '', when: 'before' }, hidePostUntilReveal: true };
    case 'presName':
      return { mode: 'reveal', pre: `The ${presNumbers(c)} president of the United States was `, blank: 'who?', post: '.', answer: c.name, map: 'none', note: presNote(c), person: { photo: c.photo ?? '', when: 'after' } };
    case 'presNumber':
      return { mode: 'reveal', pre: `${c.name} was the `, blank: 'which number?', post: ' president of the United States.', answer: presNumbers(c), map: 'none', note: presNote(c), person: { photo: c.photo ?? '', when: 'after' } };
    case 'presYears':
      return { mode: 'reveal', pre: `${c.name} was president `, blank: 'when?', post: '.', answer: c.terms!.map(t => (!t.to ? `since ${t.from}` : t.from === t.to ? `in ${t.from}` : `from ${t.from} to ${t.to}`)).join(', and '), map: 'none', note: presNote(c), person: { photo: c.photo ?? '', when: 'after' } };
    case 'presParty':
      return { mode: 'reveal', pre: `${c.name} belonged to the `, blank: 'which party?', post: '.', answer: [...new Set(c.terms!.map(t => t.party))].map(p => `${p} Party`).join(', then the '), map: 'none', note: presNote(c), person: { photo: c.photo ?? '', when: 'after' } };
    // Interstates: the blue-and-red shield alone → its number.
    case 'roadShield':
      return { mode: 'reveal', pre: 'This shield marks ', blank: 'which Interstate?', post: '.', answer: c.name, map: 'none', note: c.facts ?? null,
        picture: { file: c.image, caption: c.short ?? c.name, single: true }, promptPicture: true };
    case 'note': // a note card whose deck text is missing
      return { mode: 'reveal', pre: c.name, blank: '', post: '', answer: '', map: 'none', note: null };
  }
}

// Names that take "the" mid-sentence ("the capital of the Netherlands", "Yellowstone is in the United States").
const THE_NAMES = /\b(United States Virgin Islands|United States|United Kingdom|United Arab Emirates|Netherlands|Philippines|Bahamas|Gambia|Maldives|Comoros|Marshall Islands|Solomon Islands|Central African Republic|Dominican Republic|Czech Republic|Seychelles|Democratic Republic of the Congo|Republic of the Congo|Falkland Islands|Faroe Islands|Cayman Islands|British Virgin Islands|Cook Islands|Northern Mariana Islands|Turks and Caicos Islands|Canary Islands|Azores|Balearic Islands|Pitcairn Islands|Cocos \(Keeling\) Islands|British Indian Ocean Territory|Sahrawi Arab Democratic Republic|Caribbean Netherlands)\b/g;
export function withThe(text: string) {
  return text.replace(THE_NAMES, (m, _g, offset: number) => {
    const prev = /(\S+)\s+$/.exec(text.slice(0, offset))?.[1];
    // Skip if "the" is already there, or the name is part of a longer one ("Caribbean Netherlands").
    if (prev && (/^the$/i.test(prev) || /^[A-Z]/.test(prev))) return m;
    return 'the ' + m;
  });
}
/** What a card shows, with "the" added where English wants it. */
export function face(ref: CardRef): CardFace {
  const f = rawFace(ref);
  if (ref.kind === 'note') return f; // your own words, untouched
  // Island groups are plural: "The Faroe Islands are part of Denmark".
  const pre = cap1(withThe(f.pre)).replace(/^((?:The )?(?:(?:[A-Z][\w'-]*|and)\s)*(?:Islands|Isles|Azores)) is /, '$1 are ');
  return { ...f, pre, answer: withThe(f.answer), post: withThe(f.post), note: f.note ? withThe(f.note) : f.note };
}

/** Which extra map layer a card needs. */
export const layerFor = (p: Place) => (p.layer === 'country' || p.layer === 'note' || p.layer === 'art' ? null : p.layer === 'site' ? 'site' : p.layer === 'peak' ? 'peak' : p.layer === 'senate' ? (p.topic === 'leaders' ? null : 'us') : p.layer);

export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

/** Plural noun and icon for a layer, for headings and lists. */
export const LAYER_NOUN: Record<Place['layer'], string> = { note: 'cards', art: 'works', road: 'Interstates', desert: 'deserts', person: 'presidents', sub: 'regions', country: 'countries', water: 'waters', river: 'rivers', lake: 'lakes', cn: 'divisions', us: 'states', senate: 'senators', terr: 'territories', site: 'sites', peak: 'peaks', range: 'ranges' };
export const LAYER_ICON: Record<Place['layer'], IconName> = { note: 'book', art: 'image', road: 'road', desert: 'sun', person: 'person', sub: 'map', country: 'globe', water: 'wave', river: 'river', lake: 'drop', cn: 'map', us: 'map', senate: 'person', terr: 'pin', site: 'temple', peak: 'mountain', range: 'layers' };

// ---- question directions ------------------------------------------------------------
/** "What is this?" — you're shown the place/flag/capital and name it.
 *  "Where / what is it?" — you're given the name and find it, or name its capital/flag. */
export const DIRECTIONS: { id: 'recognise' | 'recall'; name: string; hint: string; kinds: Kind[] }[] = [
  { id: 'recognise', name: 'What is this?', hint: 'shown it → name it', kinds: ['identify', 'flag', 'capitalReverse', 'senatorFace', 'currencyReverse', 'largestCityReverse', 'sitePhoto', 'highestReverse', 'artPhoto', 'taxonId', 'roadShield', 'presFace', 'presName', 'musicComposer', 'musicWork', 'musicPart', 'personFace'] },
  { id: 'recall', name: 'Where / what is it?', hint: 'given the name → find or answer it', kinds: ['locate', 'capitalLocate', 'capital', 'flagReverse', 'senator', 'senatorLocate', 'currency', 'largestCity', 'belongsTo', 'siteLocate', 'siteCountry', 'highest', 'artMaker', 'artWhere', 'artStyle', 'bookLang', 'personScene', 'personBorn', 'personPlays', 'dinoTime', 'presNumber', 'presYears', 'presParty'] },
];
export const KIND_SHORT: Record<Kind, string> = {
  note: 'Note card', artPhoto: 'Picture → name', artMaker: 'Work → artist', artWhere: 'Work → where it is', artStyle: 'Building → style', bookLang: 'Book → language', musicComposer: 'Music → composer', musicWork: 'Music → piece', musicPart: 'Music → movement', personFace: 'Face → person', personScene: 'Person → scene', personBorn: 'Person → birthplace', personPlays: 'Person → instrument', taxonId: 'Photo → animal', dinoTime: 'Dinosaur → when it lived', roadShield: 'Shield → Interstate', presFace: 'Portrait → president', presName: 'Number → president', presNumber: 'President → number', presYears: 'President → years', presParty: 'President → party',
  identify: 'Map → name', flag: 'Flag → country', capitalReverse: 'Capital → country',
  locate: 'Name → map', capitalLocate: 'Capital → map', capital: 'Country → capital', flagReverse: 'Country → flag',
  senatorFace: 'Photo → person', senator: 'Office → person', senatorLocate: 'Person → map',
  currency: 'Country → currency', currencyReverse: 'Currency → country', largestCity: 'Country → largest city', largestCityReverse: 'City → country', belongsTo: 'Territory → country', sitePhoto: 'Photo → name', siteLocate: 'Name → map', siteCountry: 'Place → country', highest: 'Country → highest point', highestReverse: 'Highest point → country',
};

/** The skill-tree node a card belongs to. */
export function nodeOfCard(ref: CardRef): string {
  const g = groupOf(ref.country);
  const topic: Topic = ref.kind === 'note' ? 'notes' : ref.kind.startsWith('art') ? 'art' : ref.kind === 'roadShield' ? 'shields' : ref.kind.startsWith('pres') ? 'presidents' : ref.kind.startsWith('highest') ? 'highest' : ref.kind.startsWith('site') ? (ref.country.layer === 'peak' ? 'peaks' : 'sites') : ref.kind === 'belongsTo' ? 'sovereign' : ref.kind.startsWith('senator') ? (ref.country.topic ?? 'senate') : ref.kind.startsWith('currency') ? 'currency' : ref.kind.startsWith('largestCity') ? 'cities' : ref.kind.startsWith('capital') ? 'capitals' : ref.kind.startsWith('flag') ? 'flags' : g.layer === 'country' ? 'countries' : 'places';
  return nodeId(g.id, topic);
}
