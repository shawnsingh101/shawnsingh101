// The tree of life, as far as is worth knowing by heart: the backbone the Life subject hangs on, like src/geotime.ts for
// Earth history. One source for the tree cards (a group's place and its branches, blank until flipped) and the
// "which group?" cards. Not every branch: the ones a curious adult meets (vertebrate classes, mammal and bird orders,
// whale families, the dinosaurs). Groups of species (collections/Life/…) say where they sit by naming a node here.
export type TreeRank = 'kingdom' | 'phylum' | 'class' | 'clade' | 'order' | 'suborder' | 'family';
export interface Node {
  name: string;        // the scientific name (Cetacea)
  common: string;      // what people call it ("whales and dolphins")
  rank: TreeRank;
  parent?: string;
  known: string;       // how to recognize it, in a few words (used as a card)
  color: string;       // its block color on the tree cards
}

const C = { animal: '#8E7DBE', chordate: '#6C8EBF', mammal: '#D9822B', bird: '#4E9F6F', reptile: '#7A9A3A', fish: '#3E8FB0', amphibian: '#5DA399', invert: '#B07AA1', whale: '#2F6E9E', dino: '#9C6B30' };

export const TREE: Node[] = [
  { name: 'Animalia', common: 'animals', rank: 'kingdom', known: 'many-celled life that eats other life and moves', color: C.animal },
  // Phyla
  { name: 'Chordata', common: 'chordates', rank: 'phylum', parent: 'Animalia', known: 'a nerve cord along the back; nearly all have a backbone', color: C.chordate },
  { name: 'Arthropoda', common: 'arthropods', rank: 'phylum', parent: 'Animalia', known: 'jointed legs and an outer skeleton: insects, spiders, crabs', color: C.invert },
  { name: 'Mollusca', common: 'mollusks', rank: 'phylum', parent: 'Animalia', known: 'soft bodies, often a shell: snails, clams, octopuses', color: C.invert },
  { name: 'Cnidaria', common: 'cnidarians', rank: 'phylum', parent: 'Animalia', known: 'stinging cells: jellyfish, corals, sea anemones', color: C.invert },
  { name: 'Echinodermata', common: 'echinoderms', rank: 'phylum', parent: 'Animalia', known: 'five-part bodies and tube feet: starfish, sea urchins', color: C.invert },
  // Classes of vertebrates
  { name: 'Mammalia', common: 'mammals', rank: 'class', parent: 'Chordata', known: 'hair, and milk for their young', color: C.mammal },
  { name: 'Aves', common: 'birds', rank: 'class', parent: 'Chordata', known: 'feathers, beaks and hard-shelled eggs; living dinosaurs', color: C.bird },
  { name: 'Reptilia', common: 'reptiles', rank: 'class', parent: 'Chordata', known: 'scales and eggs laid on land; cold-blooded', color: C.reptile },
  { name: 'Amphibia', common: 'amphibians', rank: 'class', parent: 'Chordata', known: 'born in water, often live on land; moist skin', color: C.amphibian },
  { name: 'Actinopterygii', common: 'ray-finned fish', rank: 'class', parent: 'Chordata', known: 'fins held up by thin bony rays; most fish', color: C.fish },
  { name: 'Chondrichthyes', common: 'sharks and rays', rank: 'class', parent: 'Chordata', known: 'skeletons of cartilage, not bone', color: C.fish },
  // Orders of mammals
  { name: 'Monotremata', common: 'monotremes', rank: 'order', parent: 'Mammalia', known: 'mammals that lay eggs: the platypus and echidnas', color: C.mammal },
  { name: 'Diprotodontia', common: 'kangaroos, koalas and wombats', rank: 'order', parent: 'Mammalia', known: 'Australian marsupials with two big front teeth', color: C.mammal },
  { name: 'Primates', common: 'primates', rank: 'order', parent: 'Mammalia', known: 'grasping hands, forward-facing eyes, big brains', color: C.mammal },
  { name: 'Rodentia', common: 'rodents', rank: 'order', parent: 'Mammalia', known: 'front teeth that never stop growing; four in ten mammal species', color: C.mammal },
  { name: 'Lagomorpha', common: 'rabbits and hares', rank: 'order', parent: 'Mammalia', known: 'a second, small pair of upper front teeth behind the first', color: C.mammal },
  { name: 'Chiroptera', common: 'bats', rank: 'order', parent: 'Mammalia', known: 'the only mammals that truly fly', color: C.mammal },
  { name: 'Eulipotyphla', common: 'hedgehogs, shrews and moles', rank: 'order', parent: 'Mammalia', known: 'small insect-eaters with long snouts', color: C.mammal },
  { name: 'Carnivora', common: 'carnivorans', rank: 'order', parent: 'Mammalia', known: 'shearing cheek teeth: cats, dogs, bears, seals', color: C.mammal },
  { name: 'Perissodactyla', common: 'odd-toed hoofed mammals', rank: 'order', parent: 'Mammalia', known: 'weight on the middle toe: horses, rhinos, tapirs', color: C.mammal },
  { name: 'Artiodactyla', common: 'even-toed hoofed mammals', rank: 'order', parent: 'Mammalia', known: 'weight on two toes: deer, cattle, pigs, hippos, and (by descent) whales', color: C.mammal },
  { name: 'Proboscidea', common: 'elephants', rank: 'order', parent: 'Mammalia', known: 'a trunk and tusks', color: C.mammal },
  { name: 'Sirenia', common: 'manatees and dugongs', rank: 'order', parent: 'Mammalia', known: 'slow plant-eaters of warm shallow seas', color: C.mammal },
  { name: 'Pilosa', common: 'sloths and anteaters', rank: 'order', parent: 'Mammalia', known: 'long claws; few or no teeth', color: C.mammal },
  // Whales and dolphins: inside the even-toed hoofed mammals (their closest living relatives are hippos)
  { name: 'Cetacea', common: 'whales and dolphins', rank: 'clade', parent: 'Artiodactyla', known: 'mammals fully at home in water; nostrils became a blowhole', color: C.whale },
  { name: 'Mysticeti', common: 'baleen whales', rank: 'suborder', parent: 'Cetacea', known: 'no teeth: plates of baleen sieve food from water; two blowholes', color: C.whale },
  { name: 'Odontoceti', common: 'toothed whales', rank: 'suborder', parent: 'Cetacea', known: 'teeth, one blowhole, and echolocation', color: C.whale },
  { name: 'Balaenidae', common: 'right whales and the bowhead', rank: 'family', parent: 'Mysticeti', known: 'arched jaws, very long baleen, no throat grooves or back fin', color: C.whale },
  { name: 'Balaenopteridae', common: 'rorquals', rank: 'family', parent: 'Mysticeti', known: 'pleated throats that balloon to gulp water: blue, fin and humpback whales', color: C.whale },
  { name: 'Eschrichtiidae', common: 'the gray whale', rank: 'family', parent: 'Mysticeti', known: 'a bottom-feeder that sifts mud; a few short throat grooves', color: C.whale },
  { name: 'Physeteridae', common: 'the sperm whale', rank: 'family', parent: 'Odontoceti', known: 'the biggest toothed whale, with a huge square head', color: C.whale },
  { name: 'Delphinidae', common: 'oceanic dolphins', rank: 'family', parent: 'Odontoceti', known: 'beaks and curved back fins; includes the orca', color: C.whale },
  { name: 'Phocoenidae', common: 'porpoises', rank: 'family', parent: 'Odontoceti', known: 'small, no beak, spade-shaped teeth, triangular back fin', color: C.whale },
  { name: 'Monodontidae', common: 'the narwhal and beluga', rank: 'family', parent: 'Odontoceti', known: 'Arctic whales with no back fin', color: C.whale },
  { name: 'Ziphiidae', common: 'beaked whales', rank: 'family', parent: 'Odontoceti', known: 'deep divers with long beaks, rarely seen', color: C.whale },
  // Orders of birds (the most met)
  { name: 'Passeriformes', common: 'perching birds', rank: 'order', parent: 'Aves', known: 'songbirds; feet made to grip a perch; over half of all birds', color: C.bird },
  { name: 'Accipitriformes', common: 'hawks, eagles and vultures', rank: 'order', parent: 'Aves', known: 'hooked beaks and strong talons; hunt by day', color: C.bird },
  { name: 'Falconiformes', common: 'falcons', rank: 'order', parent: 'Aves', known: 'pointed wings and a notched beak; the fastest dives', color: C.bird },
  { name: 'Strigiformes', common: 'owls', rank: 'order', parent: 'Aves', known: 'forward-facing eyes and silent flight; hunt by night', color: C.bird },
  { name: 'Anseriformes', common: 'ducks, geese and swans', rank: 'order', parent: 'Aves', known: 'webbed feet and flat bills', color: C.bird },
  { name: 'Galliformes', common: 'gamebirds', rank: 'order', parent: 'Aves', known: 'chicken-like ground birds: turkeys, pheasants, quail', color: C.bird },
  { name: 'Psittaciformes', common: 'parrots', rank: 'order', parent: 'Aves', known: 'curved beaks, two toes forward and two back', color: C.bird },
  { name: 'Sphenisciformes', common: 'penguins', rank: 'order', parent: 'Aves', known: 'flightless; wings became flippers', color: C.bird },
  { name: 'Charadriiformes', common: 'shorebirds, gulls and auks', rank: 'order', parent: 'Aves', known: 'birds of beaches and coasts', color: C.bird },
  { name: 'Piciformes', common: 'woodpeckers and toucans', rank: 'order', parent: 'Aves', known: 'two toes forward and two back; strong beaks', color: C.bird },
  // Reptiles, and the dinosaurs (birds are the dinosaurs that survived)
  { name: 'Squamata', common: 'lizards and snakes', rank: 'order', parent: 'Reptilia', known: 'scaly skin they shed', color: C.reptile },
  { name: 'Testudines', common: 'turtles and tortoises', rank: 'order', parent: 'Reptilia', known: 'a shell grown from the ribs and backbone', color: C.reptile },
  { name: 'Crocodilia', common: 'crocodiles and alligators', rank: 'order', parent: 'Reptilia', known: 'armored ambush hunters; the closest living relatives of birds', color: C.reptile },
  { name: 'Dinosauria', common: 'dinosaurs', rank: 'clade', parent: 'Reptilia', known: 'legs held straight under the body; ruled from the Triassic to the Cretaceous', color: C.dino },
  { name: 'Saurischia', common: '“lizard-hipped” dinosaurs', rank: 'order', parent: 'Dinosauria', known: 'theropods and the long-necked sauropods', color: C.dino },
  { name: 'Ornithischia', common: '“bird-hipped” dinosaurs', rank: 'order', parent: 'Dinosauria', known: 'plant-eaters: armored, horned, duck-billed', color: C.dino },
  { name: 'Theropoda', common: 'theropods', rank: 'suborder', parent: 'Saurischia', known: 'two-legged, mostly meat-eaters: T. rex, raptors, and birds', color: C.dino },
  { name: 'Sauropodomorpha', common: 'sauropods and their kin', rank: 'suborder', parent: 'Saurischia', known: 'long necks and tails, the largest land animals ever', color: C.dino },
  { name: 'Thyreophora', common: 'armored dinosaurs', rank: 'suborder', parent: 'Ornithischia', known: 'plates and spikes: Stegosaurus, Ankylosaurus', color: C.dino },
  { name: 'Ornithopoda', common: 'ornithopods', rank: 'suborder', parent: 'Ornithischia', known: 'beaked plant-eaters, many duck-billed: Iguanodon, Edmontosaurus', color: C.dino },
  { name: 'Marginocephalia', common: 'horned and dome-headed dinosaurs', rank: 'suborder', parent: 'Ornithischia', known: 'frills, horns or thick skull domes: Triceratops, Pachycephalosaurus', color: C.dino },
];

export const node = (name: string) => TREE.find(n => n.name === name);
export const branchesOf = (name: string) => TREE.filter(n => n.parent === name);
export function lineage(name: string): Node[] { const out: Node[] = []; for (let n = node(name); n; n = n.parent ? node(n.parent) : undefined) out.unshift(n); return out; }
const plural = (r: TreeRank) => (r === 'class' ? 'classes' : r === 'family' ? 'families' : `${r}s`);
const rankWord = (n: Node) => (n.rank === 'clade' ? 'group' : n.rank);

/** The tree deck, built from the data like the time-scale deck: where each group sits, and its branches. */
export function treeDeck(): string {
  const L: string[] = ['---', 'title: The tree of life', 'path: Tree of life', '---',
    'The branches of the tree of life worth knowing by heart: the vertebrate classes, the orders of mammals and birds, the families of whales and the dinosaurs. Each card shows a group\'s place in the tree; its branches fill in when you flip it.'];
  L.push('## How the tree fits together');
  for (const n of TREE) if (branchesOf(n.name).length >= 2) L.push(`- [tree: ${n.name}] The ${plural(branchesOf(n.name)[0].rank)} of the ${n.common}`);
  L.push('## Which group?');
  for (const n of TREE.filter(x => x.parent)) L.push(`- The {{${n.common}|which ${rankWord(n)}?}} (${n.name}): ${n.known}.`);
  L.push('## Scientific names');
  for (const n of TREE.filter(x => x.parent && x.rank !== 'family')) L.push(`- The scientific name of the ${n.common} is {{${n.name}|what?}}.`, `native: ${n.name} (Latin)`);
  return L.join('\n');
}
