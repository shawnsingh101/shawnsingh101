// The geologic time scale: one source for the Earth history chart and its cards.
// Dates (millions of years ago) and colours from the International Chronostratigraphic Chart (ICS, v2023/09);
// the colours are the official ones geologists use on every map and chart.
export type Rank = 'eon' | 'era' | 'period' | 'epoch';
export interface Unit {
  name: string; rank: Rank; start: number; end: number; color: string;
  parent?: string;          // the eon an era sits in, the era a period sits in…
  known: string;            // what it's known for, in a few words (used as a card)
  meaning?: string;         // what the name means
}

export const AGE_OF_EARTH = 4567;

export const UNITS: Unit[] = [
  // Eons
  { name: 'Hadean', rank: 'eon', start: 4567, end: 4031, color: '#AE027E', known: 'Earth forms, a Mars-sized body hits it and makes the Moon; no rocks survive', meaning: 'from Hades: a hellish, molten world' },
  { name: 'Archean', rank: 'eon', start: 4031, end: 2500, color: '#F0047F', known: 'the first life: single cells and stromatolite mats', meaning: '“beginning”' },
  { name: 'Proterozoic', rank: 'eon', start: 2500, end: 538.8, color: '#F73563', known: 'oxygen fills the air (the Great Oxidation Event) and the first complex cells appear', meaning: '“earlier life”' },
  { name: 'Phanerozoic', rank: 'eon', start: 538.8, end: 0, color: '#9AD9DD', known: 'animals, plants and everything with a skeleton or shell', meaning: '“visible life”' },
  // Eras of the Phanerozoic
  { name: 'Paleozoic', rank: 'era', parent: 'Phanerozoic', start: 538.8, end: 251.902, color: '#99C08D', known: 'life moves from the sea onto land; ends with the Great Dying', meaning: '“ancient life”' },
  { name: 'Mesozoic', rank: 'era', parent: 'Phanerozoic', start: 251.902, end: 66, color: '#67C5CA', known: 'the Age of Reptiles: dinosaurs rule', meaning: '“middle life”' },
  { name: 'Cenozoic', rank: 'era', parent: 'Phanerozoic', start: 66, end: 0, color: '#F2F91D', known: 'the Age of Mammals, after the dinosaurs die out', meaning: '“new life”' },
  // Periods
  { name: 'Ediacaran', rank: 'period', parent: 'Proterozoic', start: 635, end: 538.8, color: '#FED96A', known: 'the first large animals: soft, quilted creatures with no shells' },
  { name: 'Cambrian', rank: 'period', parent: 'Paleozoic', start: 538.8, end: 485.4, color: '#7FA056', known: 'the Cambrian explosion: most animal groups appear, trilobites everywhere', meaning: 'from Cambria, the Latin name for Wales' },
  { name: 'Ordovician', rank: 'period', parent: 'Paleozoic', start: 485.4, end: 443.8, color: '#009270', known: 'the first land plants; sea life booms, then an ice age causes a mass extinction', meaning: 'from the Ordovices, a tribe in Wales' },
  { name: 'Silurian', rank: 'period', parent: 'Paleozoic', start: 443.8, end: 419.2, color: '#B3E1B6', known: 'the first fish with jaws; plants spread across the land', meaning: 'from the Silures, a tribe in Wales' },
  { name: 'Devonian', rank: 'period', parent: 'Paleozoic', start: 419.2, end: 358.9, color: '#CB8C37', known: 'the Age of Fishes; the first forests and the first four-legged animals', meaning: 'from Devon, England' },
  { name: 'Carboniferous', rank: 'period', parent: 'Paleozoic', start: 358.9, end: 298.9, color: '#67A599', known: 'coal swamps, giant insects and the first reptiles', meaning: '“coal-bearing”' },
  { name: 'Permian', rank: 'period', parent: 'Paleozoic', start: 298.9, end: 251.902, color: '#F04028', known: 'the supercontinent Pangaea; ends with the Great Dying, the worst mass extinction', meaning: 'from Perm, Russia' },
  { name: 'Triassic', rank: 'period', parent: 'Mesozoic', start: 251.902, end: 201.4, color: '#812B92', known: 'the first dinosaurs and the first mammals', meaning: '“threefold”: three rock layers in Germany' },
  { name: 'Jurassic', rank: 'period', parent: 'Mesozoic', start: 201.4, end: 145, color: '#34B2C9', known: 'giant long-necked dinosaurs and the first birds', meaning: 'from the Jura Mountains' },
  { name: 'Cretaceous', rank: 'period', parent: 'Mesozoic', start: 145, end: 66, color: '#7FC64E', known: 'the first flowering plants and T. rex; ends when an asteroid strikes', meaning: 'from creta, Latin for chalk' },
  { name: 'Paleogene', rank: 'period', parent: 'Cenozoic', start: 66, end: 23.03, color: '#FD9A52', known: 'mammals fill the world the dinosaurs left; the first primates and whales', meaning: '“ancient born”' },
  { name: 'Neogene', rank: 'period', parent: 'Cenozoic', start: 23.03, end: 2.58, color: '#FFE619', known: 'grasslands spread; the first hominins walk upright', meaning: '“new born”' },
  { name: 'Quaternary', rank: 'period', parent: 'Cenozoic', start: 2.58, end: 0, color: '#F9F97F', known: 'the ice ages, and our own species', meaning: '“fourth”' },
  // Epochs of the Cenozoic
  { name: 'Paleocene', rank: 'epoch', parent: 'Paleogene', start: 66, end: 56, color: '#FDA75F', known: 'the world recovers from the asteroid; mammals stay small' },
  { name: 'Eocene', rank: 'epoch', parent: 'Paleogene', start: 56, end: 33.9, color: '#FDB46C', known: 'a hot world; the first horses, whales and primates spread' },
  { name: 'Oligocene', rank: 'epoch', parent: 'Paleogene', start: 33.9, end: 23.03, color: '#FEC07A', known: 'Antarctica freezes over; the world cools' },
  { name: 'Miocene', rank: 'epoch', parent: 'Neogene', start: 23.03, end: 5.333, color: '#FFFF00', known: 'apes spread and grasslands grow' },
  { name: 'Pliocene', rank: 'epoch', parent: 'Neogene', start: 5.333, end: 2.58, color: '#FFFF99', known: 'the first hominins like Lucy walk upright' },
  { name: 'Pleistocene', rank: 'epoch', parent: 'Quaternary', start: 2.58, end: 0.0117, color: '#FFF2AE', known: 'ice ages, mammoths, and Homo sapiens' },
  { name: 'Holocene', rank: 'epoch', parent: 'Quaternary', start: 0.0117, end: 0, color: '#FEF2E0', known: 'the warm time since the last ice age: farming, cities, history' },
];

/** Where a date falls if all of Earth's history were one day: "21:10". */
export function onTheClock(ma: number) {
  const secs = Math.round((1 - ma / AGE_OF_EARTH) * 86400);
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return h >= 23 && m >= 59 ? `23:59:${String(s).padStart(2, '0')}` : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
export const fmtMa = (ma: number) => (ma >= 1000 ? `${(ma / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 })} billion` : ma >= 1 ? `${Math.round(ma).toLocaleString('en-US')} million` : `${Math.round(ma * 1000).toLocaleString('en-US')} thousand`);

/** The classic mnemonic for the periods (and the Cenozoic's old divisions), one word per name. */
export const MNEMONIC = 'Camels Often Sit Down Carefully; Perhaps Their Joints Creak, Probably Not Quietly.';

// ---- cards: written as a note deck, so they schedule and quiz like any other deck ----------------------
// A card's heading is shown with it, so cards that ask for a name sit under neutral headings ("Which period?"),
// and only cards that start from the name sit under it.
export function geotimeDeck(): string {
  const of = (r: Rank) => UNITS.filter(u => u.rank === r);
  const big = [...of('eon'), ...of('era')];
  const periods = of('period').filter(p => p.parent !== 'Proterozoic');
  const L: string[] = ['---', 'title: Geologic time scale', 'path: Geologic time', '---',
    'Eons, eras and periods of Earth’s 4.6-billion-year history, in order, with when they began and what they’re known for. The chart above shows them as layers of rock.'];
  for (const u of [...big, ...periods]) {
    L.push(`## The ${u.name} ${u.rank}`);
    L.push(`- The ${u.name} ${u.rank} began about {{${fmtMa(u.start)}}} years ago.`);
    if (u.parent && u.rank === 'period') L.push(`- The ${u.name} period is in the {{${u.parent}}} era.`);
    L.push(`- The ${u.name} ${u.rank} is known for :: ${u.known}`);
    if (u.meaning) L.push(`> ${u.name}: ${u.meaning}.`);
  }
  L.push('## Which eon or era?');
  for (const u of big) L.push(`- The ${u.rank} known for ${u.known} :: the ${u.name}`);
  L.push('## Which period?');
  for (const u of periods) L.push(`- The period known for ${u.known} :: the ${u.name}`);
  L.push('## In order');
  periods.forEach((u, i) => { if (i) L.push(`- The period after the ${periods[i - 1].name} :: the ${u.name}`); });
  big.forEach((u, i) => { if (i && big[i - 1].rank === u.rank) L.push(`- The ${u.rank} after the ${big[i - 1].name} :: the ${u.name}`); });
  L.push('## Earth’s history as one day');
  L.push(`- If Earth’s 4.6 billion years were one day, the first animals with shells (Cambrian) appear at about {{${onTheClock(538.8)}}}.`);
  L.push(`- …the dinosaurs die out at about {{${onTheClock(66)}}}.`);
  L.push(`- …our species appears at about {{${onTheClock(0.3)}}}, a few seconds before midnight.`);
  return L.join('\n');
}
export function epochDeck(): string {
  const eps = UNITS.filter(u => u.rank === 'epoch');
  return ['---', 'title: Epochs of the Cenozoic', 'path: Geologic time', '---',
    'The seven epochs since the dinosaurs died out, which split the Age of Mammals into chapters.',
    ...eps.flatMap(u => [`## The ${u.name} epoch`, `- The ${u.name} epoch began about {{${fmtMa(u.start)}}} years ago, in the {{${u.parent}}} period.`, `- The ${u.name} epoch is known for :: ${u.known}`]),
    '## Which epoch?', ...eps.map(u => `- The epoch known for ${u.known} :: the ${u.name}`),
    '## In order', ...eps.slice(1).map((u, i) => `- The epoch after the ${eps[i].name} :: the ${u.name}`),
  ].join('\n');
}
