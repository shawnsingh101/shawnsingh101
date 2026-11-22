// The Library: top-level subjects. Geography is built in; every other subject comes from note decks (decks/<Subject>/…).
import { CONTINENTS, childSections, sectionChain } from './cards';
import { NOTE_SUBJECTS } from './notes';
import type { IconName } from './components/Icons';

export interface Subject { id: string; name: string; icon: IconName; blurb: string; sections: () => string[] }

const ICON: Record<string, IconName> = { Economics: 'coin', 'Food & drink': 'drop', History: 'book', Languages: 'sound', Religion: 'temple', Politics: 'capitol', STEM: 'layers' };

export const SUBJECTS: Subject[] = [
  { id: 'geography', name: 'Geography', icon: 'globe', blurb: 'Countries, capitals, flags, leaders, regions, rivers, mountains, World Heritage',
    sections: () => childSections(null).filter(s => !NOTE_SUBJECTS.includes(s)) },
  ...NOTE_SUBJECTS.map((s): Subject => ({ id: s, name: s, icon: ICON[s] ?? 'book', blurb: 'Your note decks', sections: () => [s] })),
];
export const subjectOfSection = (sec: string) => { const top = sectionChain(sec)[0]; return SUBJECTS.find(s => s.sections().includes(top)) ?? SUBJECTS[0]; };
export const isGeography = (sec: string) => subjectOfSection(sec).id === 'geography';
export { CONTINENTS };
