// The Library: top-level subjects. Geography is built in; every other subject comes from note decks (decks/<Subject>/…).
import { CONTINENTS, childSections, sectionChain } from './cards';
import { EQUATIONS, HAS_EQUATIONS, HAS_LIVE, LIVE, NOTE_SUBJECTS } from './notes';
import { COLLECTION_SUBJECTS } from './collections';
import type { IconName } from './components/Icons';

export interface Subject { id: string; name: string; icon: IconName; blurb: string; sections: () => string[] }

const BLURB: Record<string, string> = { Government: 'How governments are built and run, starting with the United States: the Constitution in foreign affairs and the State Department, from its org chart to embassies, the Foreign Service and today\'s priorities', Cybersecurity: 'IT security from the ground up: a short lesson before each deck, diagrams of who sends what to whom, mapped to Security+', Life: 'Laid out by the tree of life: bacteria, archaea, and animals from whales to dinosaurs, each with its lineage', Music: 'Classical music by ear: hear a recording, name the composer, the piece and the movement', Books: 'Essential books and deep cuts, shelved by literature and by topic', Architecture: 'Famous buildings, styles and architects, and tours of the White House, the Capitol and the Met', 'Earth history': 'The geologic time scale as layers of rock: eons, eras, periods, epochs', History: 'China by dynasty; the United States by period, by place, and its presidents', Science: 'Biology from the OpenStax textbook, chapter by chapter', 'Computer science': 'Python from the OpenStax textbook, how this app is built, and information systems' };
const ICON: Record<string, IconName> = { Government: 'capitol', Cybersecurity: 'lock', Life: 'tree', Art: 'image', Music: 'music', Books: 'book', Architecture: 'landmark', 'Earth history': 'mountain', Science: 'layers', 'Computer science': 'sliders', Economics: 'coin', 'Food & drink': 'drop', History: 'book', Languages: 'sound', Religion: 'temple', Politics: 'capitol', STEM: 'layers' };

export const SUBJECTS: Subject[] = [
  { id: 'geography', name: 'Geography', icon: 'globe', blurb: 'Countries, capitals, flags, leaders, regions, rivers, mountains, World Heritage',
    sections: () => childSections(null).filter(s => !NOTE_SUBJECTS.includes(s) && !COLLECTION_SUBJECTS.includes(s) && s !== LIVE && s !== EQUATIONS) },
  ...[...new Set([...COLLECTION_SUBJECTS, ...NOTE_SUBJECTS])].map((s): Subject => ({ id: s, name: s, icon: ICON[s] ?? 'book', blurb: BLURB[s] ?? (COLLECTION_SUBJECTS.includes(s) ? 'Famous works, with facts and pictures from Wikidata' : 'Your note decks'), sections: () => [s] })),
  // A lens, not a home: ongoing stories from every subject (the war in Ukraine from History, the AI race from AI).
  // A lens too: every equation from every course, each with its ladder of cards (derivation, formula, inputs, graph).
  ...(HAS_EQUATIONS ? [{ id: EQUATIONS, name: EQUATIONS, icon: 'chart' as IconName, blurb: 'Every equation from every course in one place: how it is derived, the formula, what moves it, and its graph', sections: () => [EQUATIONS] }] : []),
  ...(HAS_LIVE ? [{ id: LIVE, name: LIVE, icon: 'flame' as IconName, blurb: 'Ongoing stories, checked against Wikipedia every Wednesday: new cards suggested, outdated ones updated', sections: () => [LIVE] }] : []),
];
export const subjectOfSection = (sec: string) => { const top = sectionChain(sec)[0]; return SUBJECTS.find(s => s.sections().includes(top)) ?? SUBJECTS[0]; };
export const isGeography = (sec: string) => subjectOfSection(sec).id === 'geography';
export { CONTINENTS };
