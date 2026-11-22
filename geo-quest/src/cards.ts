import type { Country, Dataset } from './types';

// ---- Card kinds ---------------------------------------------------------------
// Every fact is asked in both directions, and every card has a stable id
// `${wikidataId}:${kind}` so progress survives renames and data refreshes.

export type Kind = 'locate' | 'identify' | 'capital' | 'capitalReverse' | 'capitalLocate' | 'flag' | 'flagReverse';
export type Topic = 'countries' | 'capitals' | 'flags';

export const TOPICS: { id: Topic; name: string; icon: string; kinds: Kind[]; requires?: Topic }[] = [
  { id: 'countries', name: 'Countries', icon: '🗺️', kinds: ['locate', 'identify'] },
  { id: 'capitals', name: 'Capitals', icon: '🏛️', kinds: ['capital', 'capitalReverse', 'capitalLocate'], requires: 'countries' },
  { id: 'flags', name: 'Flags', icon: '🚩', kinds: ['flag', 'flagReverse'], requires: 'countries' },
];

export const KIND_LABEL: Record<Kind, string> = {
  locate: 'Find it on the map', identify: 'Name the country', capital: 'Name the capital',
  capitalReverse: 'Capital → country', capitalLocate: 'Capital → map', flag: 'Name the flag', flagReverse: 'Picture the flag',
};

/** Fingerprint of the facts a card depends on: if Wikidata changes it, the card is re-queued. */
export function fingerprint(kind: Kind, c: Country) {
  if (kind.startsWith('capital')) return `${c.name}|${c.capitalAnswer}`;
  if (kind.startsWith('flag')) return `${c.name}|${c.flag}`;
  return c.name;
}

// ---- Skill tree -----------------------------------------------------------------

export interface Group { id: string; continent: string; name: string; subregions: string[] }

export const GROUPS: Group[] = [
  { id: 'eu-w', continent: 'Europe', name: 'Western Europe', subregions: ['Western Europe'] },
  { id: 'eu-n', continent: 'Europe', name: 'Northern Europe', subregions: ['Northern Europe'] },
  { id: 'eu-c', continent: 'Europe', name: 'Central Europe', subregions: ['Central Europe'] },
  { id: 'eu-s', continent: 'Europe', name: 'Southern Europe', subregions: ['Southern Europe'] },
  { id: 'eu-se', continent: 'Europe', name: 'Balkans', subregions: ['Southeast Europe'] },
  { id: 'eu-e', continent: 'Europe', name: 'Eastern Europe', subregions: ['Eastern Europe'] },
  { id: 'am-n', continent: 'Americas', name: 'North & Central America', subregions: ['North America', 'Central America'] },
  { id: 'am-c', continent: 'Americas', name: 'Caribbean', subregions: ['Caribbean'] },
  { id: 'am-s', continent: 'Americas', name: 'South America', subregions: ['South America'] },
  { id: 'as-w', continent: 'Asia', name: 'Middle East', subregions: ['Western Asia'] },
  { id: 'as-c', continent: 'Asia', name: 'Central Asia', subregions: ['Central Asia'] },
  { id: 'as-s', continent: 'Asia', name: 'South Asia', subregions: ['Southern Asia'] },
  { id: 'as-e', continent: 'Asia', name: 'East Asia', subregions: ['Eastern Asia'] },
  { id: 'as-se', continent: 'Asia', name: 'Southeast Asia', subregions: ['South-Eastern Asia'] },
  { id: 'af-n', continent: 'Africa', name: 'North Africa', subregions: ['Northern Africa'] },
  { id: 'af-w', continent: 'Africa', name: 'West Africa', subregions: ['Western Africa'] },
  { id: 'af-m', continent: 'Africa', name: 'Central Africa', subregions: ['Middle Africa'] },
  { id: 'af-e', continent: 'Africa', name: 'East Africa', subregions: ['Eastern Africa'] },
  { id: 'af-s', continent: 'Africa', name: 'Southern Africa', subregions: ['Southern Africa'] },
  { id: 'oc', continent: 'Oceania', name: 'Oceania', subregions: ['Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia'] },
];

export const CONTINENTS = ['Europe', 'Americas', 'Asia', 'Africa', 'Oceania'];

export function groupOf(c: Country): Group {
  return GROUPS.find(g => g.subregions.includes(c.subregion))!;
}
export function countriesIn(ds: Dataset, groupId: string) {
  const g = GROUPS.find(x => x.id === groupId)!;
  return ds.countries.filter(c => g.subregions.includes(c.subregion));
}

export const nodeId = (groupId: string, topic: Topic) => `${groupId}/${topic}`;
export const parseNode = (id: string) => { const [g, t] = id.split('/'); return { groupId: g, topic: t as Topic }; };

export interface CardRef { id: string; kind: Kind; country: Country }
export const cardId = (countryId: string, kind: Kind) => `${countryId}:${kind}`;

export function cardsForNode(ds: Dataset, node: string): CardRef[] {
  const { groupId, topic } = parseNode(node);
  const kinds = TOPICS.find(t => t.id === topic)!.kinds;
  const out: CardRef[] = [];
  for (const c of countriesIn(ds, groupId)) {
    if (topic === 'flags' && !c.flag) continue;
    for (const k of kinds) out.push({ id: cardId(c.id, k), kind: k, country: c });
  }
  return out;
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
}

const capitalWord = (c: Country) => (c.capitals.length > 1 ? 'a capital' : 'the capital');

export function face(ref: CardRef): CardFace {
  const c = ref.country;
  const cap = c.capitals[0];
  const capPic = cap ? { file: cap.image, wiki: cap.wiki, caption: cap.name } : undefined;
  const note = c.status !== 'un' ? c.statusNote : null;
  switch (ref.kind) {
    case 'locate':
      return { mode: 'tap', pre: `${c.name} is `, blank: 'where? tap the map', post: '.', answer: 'right here', map: 'tap', note };
    case 'identify':
      return { mode: 'reveal', pre: 'The highlighted country is ', blank: 'what?', post: '.', answer: c.name, map: 'highlight', note };
    case 'capital':
      return { mode: 'reveal', pre: `The capital of ${c.name} is `, blank: 'what?', post: '.', answer: c.capitalAnswer!, map: 'none', picture: capPic, note: c.capitalNote ?? note };
    case 'capitalReverse':
      return { mode: 'reveal', pre: `${cap?.name} is ${capitalWord(c)} of `, blank: 'which country?', post: '.', answer: c.name, map: 'none', picture: capPic, note: c.capitalNote ?? note };
    case 'capitalLocate':
      return { mode: 'tap', pre: `${cap?.name} is ${capitalWord(c)} of `, blank: 'tap the country', post: '.', answer: c.name, map: 'tap', picture: capPic, note: c.capitalNote ?? note };
    case 'flag':
      return { mode: 'reveal', pre: 'This is the flag of ', blank: 'which country?', post: '.', answer: c.name, promptFlag: true, map: 'none', note };
    case 'flagReverse':
      return { mode: 'reveal', pre: `The flag of ${c.name} looks like `, blank: 'what?', post: '', answer: '', answerFlag: true, map: 'none', note };
  }
}
