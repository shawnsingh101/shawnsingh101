// The Library: top-level subjects. Geography is built in; every other subject comes from note decks (decks/<Subject>/…).
import { CONTINENTS, childSections, sectionChain } from './cards';
import { NOTE_SUBJECTS } from './notes';
import { COLLECTION_SUBJECTS } from './collections';
import type { IconName } from './components/Icons';

export interface Subject { id: string; name: string; icon: IconName; blurb: string; sections: () => string[] }

const BLURB: Record<string, string> = { 'Earth history': 'The geologic time scale as layers of rock: eons, eras, periods, epochs', History: 'China by dynasty; the United States by period, by place, and its presidents', Science: 'Biology from the OpenStax textbook, chapter by chapter', 'Computer science': 'Information systems from the OpenStax textbook, chapter by chapter' };
const ICON: Record<string, IconName> = { Art: 'image', 'Earth history': 'mountain', Science: 'layers', 'Computer science': 'sliders', Economics: 'coin', 'Food & drink': 'drop', History: 'book', Languages: 'sound', Religion: 'temple', Politics: 'capitol', STEM: 'layers' };

export const SUBJECTS: Subject[] = [
  { id: 'geography', name: 'Geography', icon: 'globe', blurb: 'Countries, capitals, flags, leaders, regions, rivers, mountains, World Heritage',
    sections: () => childSections(null).filter(s => !NOTE_SUBJECTS.includes(s) && !COLLECTION_SUBJECTS.includes(s)) },
  ...[...new Set([...COLLECTION_SUBJECTS, ...NOTE_SUBJECTS])].map((s): Subject => ({ id: s, name: s, icon: ICON[s] ?? 'book', blurb: COLLECTION_SUBJECTS.includes(s) ? 'Famous works, with facts and pictures from Wikidata' : BLURB[s] ?? 'Your note decks', sections: () => [s] })),
];
export const subjectOfSection = (sec: string) => { const top = sectionChain(sec)[0]; return SUBJECTS.find(s => s.sections().includes(top)) ?? SUBJECTS[0]; };
export const isGeography = (sec: string) => subjectOfSection(sec).id === 'geography';
export { CONTINENTS };
