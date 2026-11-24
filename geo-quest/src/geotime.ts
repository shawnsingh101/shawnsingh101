// The geologic time scale: one source for the Earth history chart and its cards.
// Dates (millions of years ago) and colours from the International Chronostratigraphic Chart (ICS, v2023/09);
// the colours are the official ones geologists use on every map and chart.
import type { Step } from './tree';

export type Rank = 'eon' | 'era' | 'period' | 'epoch' | 'age';
export interface Unit {
  name: string; rank: Rank; start: number; end: number; color: string;
  parent?: string;          // the eon an era sits in, the era a period sits in…
  known: string;            // what it's known for, in a few words (used as a card)
  meaning?: string;         // what the name means
  pics?: [string, string][]; // pictures (Commons file, caption): life of the time for its 'known for' card, then its 'began' card
}

export const AGE_OF_EARTH = 4567;

export const UNITS: Unit[] = [
  // Eons
  { name: 'Hadean', rank: 'eon', start: 4567, end: 4031, color: '#AE027E', known: 'Earth forms, a Mars-sized body hits it and makes the Moon; no rocks survive', meaning: 'from Hades: a hellish, molten world', pics: [['Hadean.png', 'An artist’s view of the Hadean Earth: molten, bombarded by asteroids']] },
  { name: 'Archean', rank: 'eon', start: 4031, end: 2500, color: '#F0047F', known: 'the first life: single cells and stromatolite mats', meaning: '“beginning”', pics: [['Stromatolites in Sharkbay.jpg', 'Stromatolites in Shark Bay, Australia: microbe mats like Earth’s first life']] },
  { name: 'Proterozoic', rank: 'eon', start: 2500, end: 538.8, color: '#F73563', known: 'oxygen fills the air (the Great Oxidation Event) and the first complex cells appear', meaning: '“earlier life”', pics: [['Banded iron formation Dales Gorge.jpg', 'Banded iron, Western Australia: rust layers left as oxygen filled the seas']] },
  { name: 'Phanerozoic', rank: 'eon', start: 538.8, end: 0, color: '#9AD9DD', known: 'animals, plants and everything with a skeleton or shell', meaning: '“visible life”', pics: [['CambrianExplosion fauna illustration.jpg', 'The Cambrian explosion: the first animals with shells and skeletons']] },
  // Eras of the Phanerozoic
  { name: 'Paleozoic', rank: 'era', parent: 'Phanerozoic', start: 538.8, end: 251.902, color: '#99C08D', known: 'life moves from the sea onto land; ends with the Great Dying', meaning: '“ancient life”', pics: [['Koneprusia brutoni.jpg', 'A trilobite, the signature animal of the Paleozoic seas']] },
  { name: 'Mesozoic', rank: 'era', parent: 'Phanerozoic', start: 251.902, end: 66, color: '#67C5CA', known: 'the Age of Reptiles: dinosaurs rule', meaning: '“middle life”', pics: [['Europasaurus holgeri Scene cropped.jpg', 'Long-necked dinosaurs (Europasaurus), Late Jurassic']] },
  { name: 'Cenozoic', rank: 'era', parent: 'Phanerozoic', start: 66, end: 0, color: '#F2F91D', known: 'the Age of Mammals, after the dinosaurs die out', meaning: '“new life”', pics: [['Smilodon and Homotherium.jpg', 'Saber-toothed cats (Smilodon and Homotherium): the Age of Mammals']] },
  // Periods
  { name: 'Ediacaran', rank: 'period', parent: 'Proterozoic', start: 635, end: 538.8, color: '#FED96A', known: 'the first large animals: soft, quilted creatures with no shells', pics: [['Dickinsonia species.png', 'Dickinsonia: soft, quilted Ediacaran animals']] },
  { name: 'Cambrian', rank: 'period', parent: 'Paleozoic', start: 538.8, end: 485.4, color: '#7FA056', known: 'the Cambrian explosion: most animal groups appear, trilobites everywhere', meaning: 'from Cambria, the Latin name for Wales', pics: [['20191203 Anomalocaris canadensis.png', 'Anomalocaris, the giant predator of the Cambrian seas']] },
  { name: 'Ordovician', rank: 'period', parent: 'Paleozoic', start: 485.4, end: 443.8, color: '#009270', known: 'the first land plants; sea life booms, then an ice age causes a mass extinction', meaning: 'from the Ordovices, a tribe in Wales', pics: [['Montreal sea floor diorama, about 500 million years ago - Redpath Museum - McGill University - Montreal, Canada - DSC07754.jpg', 'An early Paleozoic sea floor: nautiloids, trilobites, corals (Redpath Museum)']] },
  { name: 'Silurian', rank: 'period', parent: 'Paleozoic', start: 443.8, end: 419.2, color: '#B3E1B6', known: 'the first fish with jaws; plants spread across the land', meaning: 'from the Silures, a tribe in Wales', pics: [['Diorama of a Silurian seafloor - cephalopod eating a eurypterid (sea scorpion) (44804382835).jpg', 'A Silurian sea floor: a nautiloid catches a sea scorpion']] },
  { name: 'Devonian', rank: 'period', parent: 'Paleozoic', start: 419.2, end: 358.9, color: '#CB8C37', known: 'the Age of Fishes; the first forests and the first four-legged animals', meaning: 'from Devon, England', pics: [['Dunkleosteus terrelli (2024).png', 'Dunkleosteus, an armored fish up to 13 feet (4 m) long']] },
  { name: 'Carboniferous', rank: 'period', parent: 'Paleozoic', start: 358.9, end: 298.9, color: '#67A599', known: 'coal swamps, giant insects and the first reptiles', meaning: '“coal-bearing”', pics: [['Meganeura monyi, reconstitution.jpg', 'Meganeura, a dragonfly-like insect with a 28-inch (70 cm) wingspan']] },
  { name: 'Permian', rank: 'period', parent: 'Paleozoic', start: 298.9, end: 251.902, color: '#F04028', known: 'the supercontinent Pangaea; ends with the Great Dying, the worst mass extinction', meaning: 'from Perm, Russia', pics: [['Dimetrodon TD.png', 'Dimetrodon: sail-backed, and closer to mammals than to dinosaurs']] },
  { name: 'Triassic', rank: 'period', parent: 'Mesozoic', start: 251.902, end: 201.4, color: '#812B92', known: 'the first dinosaurs and the first mammals', meaning: '“threefold”: three rock layers in Germany', pics: [['Coelophysis TD.png', 'Coelophysis, one of the first dinosaurs'], ['Herrerasaurus ischigualastensis Illustration.jpg', 'Herrerasaurus, an early dinosaur from Argentina']] },
  { name: 'Jurassic', rank: 'period', parent: 'Mesozoic', start: 201.4, end: 145, color: '#34B2C9', known: 'giant long-necked dinosaurs and the first birds', meaning: 'from the Jura Mountains', pics: [['Brachiosaurus TD.png', 'Brachiosaurus, a giant long-necked dinosaur'], ['Stegosaurus TD.png', 'Stegosaurus, Late Jurassic']] },
  { name: 'Cretaceous', rank: 'period', parent: 'Mesozoic', start: 145, end: 66, color: '#7FC64E', known: 'the first flowering plants and T. rex; ends when an asteroid strikes', meaning: 'from creta, Latin for chalk', pics: [['Tyrannosaurus TD.png', 'Tyrannosaurus rex, Late Cretaceous'], ['Triceratops TD.png', 'Triceratops, Late Cretaceous']] },
  { name: 'Paleogene', rank: 'period', parent: 'Cenozoic', start: 66, end: 23.03, color: '#FD9A52', known: 'mammals fill the world the dinosaurs left; the first primates and whales', meaning: '“ancient born”', pics: [['Basilosaurus cetoides recon.png', 'Basilosaurus, an early whale, still with tiny hind legs']] },
  { name: 'Neogene', rank: 'period', parent: 'Cenozoic', start: 23.03, end: 2.58, color: '#FFE619', known: 'grasslands spread; the first hominins walk upright', meaning: '“new born”', pics: [['Lucy blackbg.jpg', '“Lucy”, Australopithecus afarensis, about 3.2 million years old']] },
  { name: 'Quaternary', rank: 'period', parent: 'Cenozoic', start: 2.58, end: 0, color: '#F9F97F', known: 'the ice ages, and our own species', meaning: '“fourth”', pics: [['202003 Woolly mammoth.png', 'The woolly mammoth of the ice ages']] },
  // Epochs and ages (stages) of the Mesozoic, all of them, so any range a dinosaur's Wikipedia article gives can be drawn. Not on the chart or the time-scale cards, which
  // stop at the Cenozoic epochs; here so a dinosaur can say exactly when it lived (Late Cretaceous › Maastrichtian).
  { name: 'Early Triassic', rank: 'epoch', parent: 'Triassic', start: 251.902, end: 247.2, color: '#983999', known: 'life recovers from the Great Dying' },
  { name: 'Middle Triassic', rank: 'epoch', parent: 'Triassic', start: 247.2, end: 237, color: '#B168B1', known: 'the first dinosaur relatives' },
  { name: 'Late Triassic', rank: 'epoch', parent: 'Triassic', start: 237, end: 201.4, color: '#BD8CC3', known: 'the first dinosaurs and mammals' },
  { name: 'Early Jurassic', rank: 'epoch', parent: 'Jurassic', start: 201.4, end: 174.7, color: '#00B4EB', known: 'dinosaurs take over after the end-Triassic extinction' },
  { name: 'Middle Jurassic', rank: 'epoch', parent: 'Jurassic', start: 174.7, end: 161.5, color: '#80CFD8', known: 'Pangaea splits apart' },
  { name: 'Late Jurassic', rank: 'epoch', parent: 'Jurassic', start: 161.5, end: 145, color: '#B3E3EE', known: 'giant sauropods, Stegosaurus and the first birds' },
  { name: 'Early Cretaceous', rank: 'epoch', parent: 'Cretaceous', start: 145, end: 100.5, color: '#8CCD57', known: 'the first flowering plants' },
  { name: 'Late Cretaceous', rank: 'epoch', parent: 'Cretaceous', start: 100.5, end: 66, color: '#A6D84A', known: 'T. rex and Triceratops; ends with the asteroid' },
  { name: 'Induan', rank: 'age', parent: 'Early Triassic', start: 251.902, end: 251.2, color: '#A4469F', known: '' },
  { name: 'Olenekian', rank: 'age', parent: 'Early Triassic', start: 251.2, end: 247.2, color: '#B051A5', known: '' },
  { name: 'Anisian', rank: 'age', parent: 'Middle Triassic', start: 247.2, end: 242, color: '#BC75B7', known: '' },
  { name: 'Ladinian', rank: 'age', parent: 'Middle Triassic', start: 242, end: 237, color: '#C983BF', known: '' },
  { name: 'Carnian', rank: 'age', parent: 'Late Triassic', start: 237, end: 227, color: '#C99BCB', known: '' },
  { name: 'Norian', rank: 'age', parent: 'Late Triassic', start: 227, end: 208.5, color: '#D6AAD3', known: '' },
  { name: 'Rhaetian', rank: 'age', parent: 'Late Triassic', start: 208.5, end: 201.4, color: '#E3B9DB', known: '' },
  { name: 'Hettangian', rank: 'age', parent: 'Early Jurassic', start: 201.4, end: 199.5, color: '#4EB3D3', known: '' },
  { name: 'Sinemurian', rank: 'age', parent: 'Early Jurassic', start: 199.5, end: 192.9, color: '#67BCD8', known: '' },
  { name: 'Pliensbachian', rank: 'age', parent: 'Early Jurassic', start: 192.9, end: 184.2, color: '#80C5DD', known: '' },
  { name: 'Toarcian', rank: 'age', parent: 'Early Jurassic', start: 184.2, end: 174.7, color: '#99CEE3', known: '' },
  { name: 'Aalenian', rank: 'age', parent: 'Middle Jurassic', start: 174.7, end: 170.9, color: '#9AD9DD', known: '' },
  { name: 'Bajocian', rank: 'age', parent: 'Middle Jurassic', start: 170.9, end: 168.2, color: '#A6DDE0', known: '' },
  { name: 'Bathonian', rank: 'age', parent: 'Middle Jurassic', start: 168.2, end: 165.3, color: '#B3E2E3', known: '' },
  { name: 'Callovian', rank: 'age', parent: 'Middle Jurassic', start: 165.3, end: 161.5, color: '#BFE7E5', known: '' },
  { name: 'Oxfordian', rank: 'age', parent: 'Late Jurassic', start: 161.5, end: 154.8, color: '#BFE7F1', known: '' },
  { name: 'Kimmeridgian', rank: 'age', parent: 'Late Jurassic', start: 154.8, end: 149.2, color: '#CCECF4', known: '' },
  { name: 'Tithonian', rank: 'age', parent: 'Late Jurassic', start: 149.2, end: 145, color: '#D9F1F7', known: '' },
  { name: 'Berriasian', rank: 'age', parent: 'Early Cretaceous', start: 145, end: 139.8, color: '#8CCD60', known: '' },
  { name: 'Valanginian', rank: 'age', parent: 'Early Cretaceous', start: 139.8, end: 132.6, color: '#99D36A', known: '' },
  { name: 'Hauterivian', rank: 'age', parent: 'Early Cretaceous', start: 132.6, end: 125.77, color: '#A6D975', known: '' },
  { name: 'Barremian', rank: 'age', parent: 'Early Cretaceous', start: 125.77, end: 121.4, color: '#B3DF7F', known: '' },
  { name: 'Aptian', rank: 'age', parent: 'Early Cretaceous', start: 121.4, end: 113, color: '#BFE48A', known: '' },
  { name: 'Albian', rank: 'age', parent: 'Early Cretaceous', start: 113, end: 100.5, color: '#CCEA97', known: '' },
  { name: 'Cenomanian', rank: 'age', parent: 'Late Cretaceous', start: 100.5, end: 93.9, color: '#B3DE53', known: '' },
  { name: 'Turonian', rank: 'age', parent: 'Late Cretaceous', start: 93.9, end: 89.8, color: '#BFE35D', known: '' },
  { name: 'Coniacian', rank: 'age', parent: 'Late Cretaceous', start: 89.8, end: 86.3, color: '#CCE868', known: '' },
  { name: 'Santonian', rank: 'age', parent: 'Late Cretaceous', start: 86.3, end: 83.6, color: '#D9EF74', known: '' },
  { name: 'Campanian', rank: 'age', parent: 'Late Cretaceous', start: 83.6, end: 72.1, color: '#E6F47F', known: '' },
  { name: 'Maastrichtian', rank: 'age', parent: 'Late Cretaceous', start: 72.1, end: 66, color: '#F2FA8C', known: '' },
  // Epochs of the Cenozoic
  { name: 'Paleocene', rank: 'epoch', parent: 'Paleogene', start: 66, end: 56, color: '#FDA75F', known: 'the world recovers from the asteroid; mammals stay small', pics: [['Gastornis skeleton.jpg', 'Gastornis, a giant flightless bird of the early Age of Mammals']] },
  { name: 'Eocene', rank: 'epoch', parent: 'Paleogene', start: 56, end: 33.9, color: '#FDB46C', known: 'a hot world; the first horses, whales and primates spread', pics: [['Eohippus.jpg', 'Eohippus, an early horse the size of a fox']] },
  { name: 'Oligocene', rank: 'epoch', parent: 'Paleogene', start: 33.9, end: 23.03, color: '#FEC07A', known: 'Antarctica freezes over; the world cools', pics: [['Indricotherium11.jpg', 'Paraceratherium, the largest land mammal ever']] },
  { name: 'Miocene', rank: 'epoch', parent: 'Neogene', start: 23.03, end: 5.333, color: '#FFFF00', known: 'apes spread and grasslands grow', pics: [['Megalodon shark jaws museum of natural history 068.jpg', 'The jaws of megalodon, the giant shark of the Miocene seas']] },
  { name: 'Pliocene', rank: 'epoch', parent: 'Neogene', start: 5.333, end: 2.58, color: '#FFFF99', known: 'the first hominins like Lucy walk upright', pics: [['Lucy - Australopithecus afarensis - forensic facial approximation.jpg', 'Lucy (Australopithecus afarensis), as she may have looked']] },
  { name: 'Pleistocene', rank: 'epoch', parent: 'Quaternary', start: 2.58, end: 0.0117, color: '#FFF2AE', known: 'ice ages, mammoths, and Homo sapiens', pics: [['Smilodon fatalis life-restoration \'08.jpg', 'Smilodon, the saber-toothed cat of the Pleistocene']] },
  { name: 'Holocene', rank: 'epoch', parent: 'Quaternary', start: 0.0117, end: 0, color: '#FEF2E0', known: 'the warm time since the last ice age: farming, cities, history', pics: [['Göbekli Tepe, Urfa.jpg', 'Göbekli Tepe, Turkey: stone temples from the dawn of farming']] },
];

/** The units a chart or time-scale card shows: the Mesozoic epochs and the ages are only for the dinosaur cards. */
export const CHARTED = UNITS.filter(u => u.rank !== 'age' && !(u.rank === 'epoch' && ['Triassic', 'Jurassic', 'Cretaceous'].includes(u.parent!)));
export const unit = (name: string) => UNITS.find(u => u.name === name);

const span = (a: number, b: number) => (b ? `${+a.toFixed(1)}–${+b.toFixed(1)} million years ago` : `${+a.toFixed(1)} million years ago to now`);
/** When a dinosaur lived, read from text like Wikipedia's "Late Jurassic (Oxfordian–Tithonian)": the epochs and the oldest
 *  and youngest ages named. With no age named, the ages its dates in millions of years (`ma`, oldest first) overlap. */
export interface TimeRange { epochs: string[]; ages: string[] }
export function rangeFrom(text: string, ma?: number[] | null): TimeRange | null {
  const named = (rank: Rank) => UNITS.filter(u => u.rank === rank && new RegExp(`\\b${u.name}\\b`).test(text)).sort((a, b) => b.start - a.start);
  let ages = named('age');
  if (!ages.length && ma?.length === 2) ages = UNITS.filter(u => u.rank === 'age' && Math.min(u.start, ma[0]) - Math.max(u.end, ma[1]) > 0.3).sort((a, b) => b.start - a.start);
  const ends = <T,>(xs: T[]) => (xs.length > 1 ? [xs[0], xs[xs.length - 1]] : xs);
  ages = ends(ages);
  // "Early-Late Cretaceous" names both ends; otherwise the epochs come from the ages, or are named outright.
  const pair = /\b(Early|Middle|Late)\s*[-–]\s*(Early|Middle|Late) (Triassic|Jurassic|Cretaceous)\b/.exec(text);
  let epochs = ages.length ? [...new Set(ages.map(a => a.parent!))].map(n => unit(n)!) : pair ? [unit(`${pair[1]} ${pair[3]}`)!, unit(`${pair[2]} ${pair[3]}`)!].filter(Boolean) : named('epoch').filter(e => ['Triassic', 'Jurassic', 'Cretaceous'].includes(e.parent!));
  epochs = ends(epochs);
  return epochs.length ? { epochs: epochs.map(e => e.name), ages: ages.map(a => a.name) } : null;
}

/** A dinosaur's time, top to bottom: Phanerozoic › Mesozoic › Cretaceous › Late Cretaceous › Maastrichtian. A range shares
 *  a block between its two ends: Early–Late Cretaceous, Oxfordian–Tithonian. */
export function timeSteps({ epochs, ages }: TimeRange): Step[] {
  const chain: Unit[] = [];
  for (let u = unit(unit(epochs[0])!.parent!); u; u = u.parent ? unit(u.parent) : undefined) chain.unshift(u);
  const steps: Step[] = chain.map(u => ({ rank: u.rank, name: u.name, sub: span(u.start, u.end), color: u.color }));
  const both = (rank: string, us: Unit[], name: string): Step => ({ rank: us.length > 1 ? rank + 's' : rank, name, sub: span(us[0].start, us[us.length - 1].end), color: us[0].color, color2: us[1]?.color });
  const es = epochs.map(n => unit(n)!);
  steps.push(both('epoch', es, es.length > 1 ? `${es[0].name.split(' ')[0]}–${es[1].name}` : es[0].name));
  const as = ages.map(n => unit(n)!).filter(Boolean);
  if (as.length) steps.push(both('age', as, as.map(u => u.name).join('–')));
  return steps;
}

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
// Cloze cards, one fact each. Cards that ask for a name sit under neutral headings ("Which period?"), so the heading
// never gives it away. How the units fit together is asked with time-scale cards ([strata: …]): the unit's blocks with
// its parts blank, filled in on flip.
/** A picture line for the card above it: the life of the time, shown with the answer. */
const pic = ([file, caption]: [string, string]) => `![${caption}](commons:${file})`;
export function geotimeDeck(): string {
  const of = (r: Rank) => UNITS.filter(u => u.rank === r);
  const big = [...of('eon'), ...of('era')];
  const periods = of('period').filter(p => p.parent !== 'Proterozoic');
  const L: string[] = ['---', 'title: Geologic time scale', 'path: Geologic time', '---',
    'Eons, eras and periods of Earth’s 4.6-billion-year history: when each began, what it’s known for, and how they fit together. The chart above shows them as layers of rock.'];
  L.push('## How the time scale fits together');
  L.push('- [strata: Earth] The four eons of Earth’s history');
  L.push('- [strata: Phanerozoic] The three eras of the Phanerozoic eon');
  for (const e of of('era')) L.push(`- [strata: ${e.name}] The periods of the ${e.name} era`);
  for (const u of [...big, ...periods]) {
    L.push(`## The ${u.name} ${u.rank}`);
    L.push(`- The ${u.name} ${u.rank} began about {{${fmtMa(u.start)} years ago|when?}}.`);
    if (u.pics?.[1]) L.push(pic(u.pics[1]));
    if (u.rank === 'period' && u.parent) L.push(`- The ${u.name} period is part of the {{${u.parent}|which era?}} era.`);
    if (u.meaning) L.push(`> ${u.name}: ${u.meaning}.`);
  }
  L.push('## Which eon or era?');
  for (const u of big) L.push(`- The {{${u.name}|which ${u.rank}?}} ${u.rank}: ${u.known}.`, ...(u.pics ? [pic(u.pics[0])] : []));
  L.push('## Which period?');
  for (const u of periods) L.push(`- The {{${u.name}|which period?}} period: ${u.known}.`, ...(u.pics ? [pic(u.pics[0])] : []));
  // (No "Earth's history as one day" cards: an analogy teaches nothing about the world. The clock stays on the chart.)
  return L.join('\n');
}
export function epochDeck(): string {
  const eps = UNITS.filter(u => u.rank === 'epoch' && ['Paleogene', 'Neogene', 'Quaternary'].includes(u.parent!));
  return ['---', 'title: Epochs of the Cenozoic', 'path: Geologic time', '---',
    'The seven epochs since the dinosaurs died out, which split the Age of Mammals into chapters.',
    '## How the epochs fit together',
    ...['Paleogene', 'Neogene', 'Quaternary'].map(p => `- [strata: ${p}] The epochs of the ${p} period`),
    ...eps.flatMap(u => [`## The ${u.name} epoch`, `- The ${u.name} epoch began about {{${fmtMa(u.start)} years ago|when?}}.`, `- The ${u.name} epoch is part of the {{${u.parent}|which period?}} period.`]),
    '## Which epoch?', ...eps.flatMap(u => [`- The {{${u.name}|which epoch?}} epoch: ${u.known}.`, ...(u.pics ? [pic(u.pics[0])] : [])]),
  ].join('\n');
}
