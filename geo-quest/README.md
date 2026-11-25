# Intelligence Quest

*(formerly GeoQuest; the code still lives in `geo-quest/` and saved progress keeps its old storage key.)*

A spaced-repetition geography trainer with a map: part game, mostly a learning tool.
Learn countries, capitals and flags region by region, in both directions, and watch the
world map fill in as you master it.

## What's in v0.2

- **Oceans & seas**: the 5 oceans plus 73 seas, gulfs, bays and straits in 5 regional groups (find it / name it).
- **China's provinces**: 31 provinces, autonomous regions and municipalities plus Hong Kong and Macau, with province capitals.
- **Quiz mode**: any scope (region, continent, whole world, oceans, China) × any mix of topics, 10/25/50/all cards. Scored, doesn't touch your schedule, 90%+ earns a medal.
- **Keep going**: "Learn 10 more" after a session, and per-skill Practice / Learn more in the skill tree.
- **Map labels**: hover (or tap on a phone) for names and capitals; layer toggles for oceans and China's provinces.
- Line icons instead of emoji; sound now works on phones (audio is unlocked on first tap; plays even with the silent switch on while Sound is enabled).

## Local names (v0.3)

- China's provinces and their capitals show **Chinese characters + Hanyu Pinyin** (山西 Shānxī · 太原 Tàiyuán).
  Characters come from Wikidata; pinyin with tone marks is generated from them at sync time (`pinyin-pro`).
- Countries and capitals show their name in the local language and script after each answer
  (Deutschland, 日本 · 東京, Ελλάδα · Αθήνα, ישראל). Toggle in Settings. Native country names come from the
  `world-countries` dataset; capitals' native names from Wikidata. `nativeLangs` in `data/overrides.json`
  sets which language comes first where it matters (e.g. Hebrew before Arabic for Israel).

## v1.0: Intelligence Quest — United States

- **50 US states** by Census region (Northeast, Midwest, South, West): find it / name it, capitals both ways, state flags.
  Shapes from Natural Earth, facts from Wikidata.
- **US Senate**: a fourth branch per region. Cards are tied to the *seat* (e.g. `S-NY-senior`), so when a seat changes
  hands the card is re-queued with a note. Data from [@unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators)
  (senior/junior rank, party & caucus, terms, leadership roles) and its public-domain official portraits.
  - State → senator (map locks on the state, silhouette until reveal) · photo → senator · senator → tap the state.

## v1.35: Cybersecurity, sharper

- **No give-aways** (GUIDELINES rule 15): an acronym's spelled-out name goes in the answer, seen on the flip
  (`{{DNS (Domain Name System)|which system?}}`). The audit fails a card whose question holds its answer: an acronym
  spelled out right after the blank, or the answer's words elsewhere on the card. That caught 15 Cybersecurity cards
  and 7 elsewhere (Beaux-Arts, rye whiskey, the Cambrian, Under the hood), all reworded. The DORA card is gone.
- **"Going further" decks**: one per lesson (`depth: deep`), 60 applied cards: reading a port scan, secure ports, APIPA,
  rogue DHCP and starvation, pharming and DNS tunneling, MAC flooding, the TPM and HSM, key escrow, password spraying,
  the birthday paradox, pinning, code signing, S/MIME, TLS inspection, SSL stripping and HSTS, mutual TLS.
- **Pictures**: lessons show `![caption](commons:File.svg)` lines (`.lesson-picture`); 15 Commons diagrams in lessons
  and on the matching cards (shown on the flip), and a stack for the three states of data.
- Decks sort without their `.md`, so a basic deck comes before its "going further" or "harder" deck.

## v1.34: Cybersecurity, with lessons and flow diagrams

- **Lessons**: a deck's `:::lesson … :::` block is a short textbook-style read (`components/Lesson.tsx`: headings,
  paragraphs, lists, callouts, bold, code and flows). It opens from **Read the lesson** on the deck (the primary button
  until you start its cards) and from any of its cards' answers, and ends with **Study these cards** and a pointer back
  to the Security+ Study Lab.
- **Flow diagrams** (`components/Flow.tsx`, parsed by `src/flow.ts`): actors as columns with lifelines, each step an
  arrow or a note. In lessons you step through them (Next, Back); as cards, one step is blank. The audit checks every
  step names an actor.
- **Stacks** (`components/Stack.tsx`): layered blocks in the style of the time-scale and lineage cards, for the OSI
  model and the chain of trust; a lesson illustration or, with a blank, a card. Flows and stacks share the clean look:
  pastel fills, thin arrows, a title line (`# The TLS 1.3 handshake`).
- **Security+ lenses** (`src/secplus.ts`): `objectives:` and `chapter:` front matter put a deck under Cybersecurity ›
  By exam objective (SY0-701) and By book chapter (Chapple and Seidl, 9th ed.), both closed by default.
- **Cybersecurity**, layered (GUIDELINES 4f). Part 1, *How computers talk*: Addresses, packets and ports; DHCP and DNS;
  Layers and the web. Part 3, *Cryptography*: Encryption and shared keys; Public and private keys; Hashing; Digital
  signatures and certificates; TLS. 8 lessons, 102 cards, 15 flows (6 of them cards) and 4 stacks (2 of them cards).
- A section's description now shows only when it holds a single deck (a folder no longer borrows its first deck's).

## v1.33: Live topics

- **Live topics** (ongoing stories), a lens subject listing every deck that follows Wikipedia articles (`follows:` and
  `checked:` in the front matter; `LIVE` and `HAS_LIVE` in `src/notes.ts`, the subject in `src/subjects.ts`).
- **"As of" cards**: `as of: November 2026` after a card shows that date on it (`.as-of`), and changing it re-queues the card.
- Two decks, written from the Wikipedia articles as they stood on 24 November 2026:
  - *History › History of Ukraine › Russo-Ukrainian war* (24 cards), following the war and the peace-negotiations articles;
  - *Artificial intelligence › The AI race* (16 cards), following *AI boom* and *Artificial intelligence arms race*.
- **The weekly briefing**: `scripts/briefing.mjs` prints, for each live deck, what changed in its articles between a week
  before the last check and a week ago (text that has stood for a week), and its "as of" cards. A scheduled Claude
  session runs it every Wednesday, writes at most two new cards a week across all live topics plus any "as of" updates,
  sets `checked:`, runs the audit, and opens a pull request. Merging it is the approval. Rules: GUIDELINES.md, 4e.

## v1.32: Programming with practice mode, dinosaurs from Wikipedia, and more pictures

- **Code cards.** A fenced block (```` ```python ````) after a card shows with the question in a dark code panel with
  simple coloring (`components/Code.tsx`); a block with `{{blanks}}` is its own fill-in-the-code card, asked by the bullet
  above it; `` `inline code` `` works anywhere, even around a blank. `source: src/srs.ts` links the card to that file
  on GitHub, and `npm run audit` fails if the file no longer contains the quoted code.
- **Computer science › Python**: OpenStax *Introduction to Python Programming*, chapters 1–3 (Statements, Expressions,
  Objects), each with a harder `depth: deep` deck. Every output was checked by running it.
- **Computer science › Under the hood**: how this app works, from its real files: *The repo* (folders, generated vs.
  hand-written files, JSON, package.json, .gitignore, saved progress) and *Git and GitHub* (commits, branches, pull
  requests, the two Actions and their triggers).
- **Dinosaurs follow Wikipedia.** The collections sync reads each dinosaur's fossil range from its article's infobox
  (refs and "possible" records dropped; dates in millions of years kept), and `rangeFrom()` in `src/geotime.ts` turns it
  into epochs and ages, falling back on the dates when no age is named. All 30 Mesozoic ages are in the time scale now. A
  range can span epochs (Deinonychus: Early–Late Cretaceous, Aptian–Cenomanian); the card says "as Wikipedia has it".
  The list line keeps a fallback range; `fossilRange` in `collection-fixes.json` overrides both.
- **Practice mode**: `[practice]` cards (one practice deck beside each Python chapter, 15 problems). An editor (Tab
  indents, Enter keeps the indentation, Ctrl+Enter checks), **Run** and **Check** against the card's tests, friendly
  errors ("NameError on line 2: …"), "should print / but printed", and **Show a solution**. Passing flips the card, then
  you grade it. Real Python 3.14 via Pyodide 314.0.7 (an exact devDependency), copied into the site's `pyodide/` folder
  at build time by a small Vite plugin and run in a module worker (`public/py-worker.js`, `src/python.ts`); a run is
  stopped after 5 s. `public/practice-runner.py` runs a case for both the app and the audit, which checks every
  solution passes and every starting code doesn't. Practice cards stay out of timed quizzes.
- **Pictures**: where Commons has no free picture (Villa Savoye, Dalí, Kahlo, Pollock, the Obama portraits, book
  covers), the sync takes the English Wikipedia article's lead image (`pilicense=any`), hot-linked, never copied: 19 of
  the 20 that had none.
- Fixed: a stray brace in the stylesheet (from v1.31) that hid every style after it.

## v1.31: Life, reorganized by the tree

- The tree of life is now the **outline of Life**, not a deck to memorize: *Bacteria · Archaea · Eukaryotes*, then
  *Animals › Mammals / Reptiles*. Lists live where they sit (`collections/Life/3 Eukaryotes/Animals/1 Mammals/Whales
  and dolphins.md`). Two small starter decks, *What bacteria are* and *What archaea are*, open the first two domains.
  `src/tree.ts` gains the three domains; `treeDeck()`, `TreeCard`, `[tree: …]` and the look-alikes deck are gone.
- **Whales and dolphins**: one card each, photo → name (`taxonId`). The back: the Latin name with a speaker, the
  lineage as indented blocks from Eukaryotes down to genus and species (`components/Lineage.tsx`, `taxonSteps()`), the
  habitat and status, and the range map (beside the photo on a laptop).
- **Dinosaurs**: no "which dinosaur?" cards. One card each (`dinoTime`): the life restoration and a fossil, the name and
  species → *the Late Cretaceous, in its Maastrichtian age*; the back draws Phanerozoic › Mesozoic › Cretaceous › Late
  Cretaceous › Maastrichtian with their dates (`timeSteps()`). `src/geotime.ts` adds the Mesozoic epochs and 13 ages
  (ICS dates and colors), kept off the chart. Ages are hand-curated in the list (Wikidata has them for only four).
  Also in **Earth history › Dinosaurs through time**.
- A subject's top level is all folds or all rows (so Books › Reading notes is now a fold too).

## v1.30: Life (the tree of life)

- New subject **Life**. Its backbone is `src/tree.ts`: 57 groups worth knowing (the main animal phyla, vertebrate
  classes, 13 mammal orders, 10 bird orders, whale suborders and families, the dinosaur groups), each with its common
  name, what it's known for and a block color. `treeDeck()` builds *Life › Tree of life › The tree of life* from it,
  like the time-scale deck: `[tree: Mammalia]` cards (`TreeCard`: the group's ancestors as blocks, its branches blank
  until flipped; two columns when there are many, a row of ancestors on phones), "which group?" and scientific names
  (with a Latin speaker).
- `kind: taxon` collections: `collections/Life/1 Whales and dolphins.md` (22) and `2 Dinosaurs.md` (23). A heading names
  the branch (`## Rorquals | Balaenopteridae`); a line can carry a note after ` | ` (where it lives; for dinosaurs, when
  and where). The sync takes the scientific name, range map (P181) and conservation status (P141). Cards: photo → name;
  scientific name (dinosaurs, named by genus, ask the species: *Tyrannosaurus* ___ → *rex*); which branch of the tree;
  where it lives (range map on the answer). Dinosaurs use the full-color restorations where we have them, and also show
  in **Earth history › Dinosaurs by period**.
- `decks/Life/How to tell them apart.md`: 21 cards on look-alikes, each answered by what a photo shows (baleen or teeth,
  dolphin or porpoise, seal or sea lion, alligator or crocodile, African or Asian elephant, cheetah/leopard/jaguar,
  raven or crow, hare or rabbit).

## v1.29: where people are really from

- The sync now works out each person's origin (`originOf` in `scripts/sync-collections.mjs`): the birthplace; the state
  it belonged to in the birth year, from Wikidata's dated country statements for the place (citizenship only as a
  fallback, since Chopin later became French); that state's flag as it was then; and the country today. States of the
  Holy Roman Empire (or German, Austrian and Czech lands before 1806) show the empire's banner with the state named
  (Mozart: Prince-Archbishopric of Salzburg; Bach: Duchy of Saxe-Eisenach; Beethoven: Electorate of Cologne). Before
  1200, no flag of the time. Fixes by person in `_origins` (Brahms: Free City of Hamburg; Dostoevsky: Moscow), and
  formal country names made plain (`_origins._today`: Third Hellenic Republic → Greece). Americans always get today's US
  flag (by preference: no colonial or 19th-century US flags); a Native American nation, its own flag, set by hand.
- Shown under the answer (`OriginLine`, `src/components/Origin.tsx`) on every card whose answer is a person: composers
  (in the music reveal), artists, architects and authors, jazz musicians (with their US state). 187 people; 22 have no
  flag of the time and show today's.

## v1.28: classical clean-up, the right picture or none

- **Pictures**: a work, book or person with no free picture of its own now shows none. Before, the card fell back to
  the Wikipedia article's gallery, which shows *other* works (the Michelle Obama portrait's article has a Klimt). Same on
  the place sheet. New rule in GUIDELINES.md. The Pensive Bodhisattva gets its photo (National Treasure No. 83) and its
  Korean name, 금동미륵보살반가사유상.
- **Speaker placement**: beside the green answer when the name is written the same in its own language (Leonardo da
  Vinci), else beside the own-language name under it (*La Gioconda*, Достоевский).
- **Classical, first pass of the Anki-guided rebuild** (Classical Music Themes, Parts I–II, used as the list of pieces and
  themes; their audio isn't used). Removed 12 clips that sounded bad: old 78 rpm transfers (Hallelujah Chorus, Water
  Music, Swan Lake ×2, Nutcracker ×2, Liebestraum) and stock-music arrangements on other instruments (the cello
  prelude, Habanera, three Gymnopédies). Added studio recordings from **Musopen** (public domain) via the Internet
  Archive: Chopin's Funeral March, Heroic and Military Polonaises, Revolutionary and Tristesse Études, and new
  recordings of the Nocturne Op. 9 No. 2, Minute Waltz and Raindrop Prelude; all four Peer Gynt pieces; the Moldau, the
  Hebrides, the Pathétique, the Marriage of Figaro overture. Clips can now be a full address (`♪ label | https://…`).
- `scripts/find-recordings.py` (Commons) and `scripts/find-recordings-ia.py` (Internet Archive) find candidates; only
  Musopen and Commons are trusted (archive.org licence labels are set by uploaders and often wrong).

## v1.27: Earth history pictures

- Every eon, era, period and epoch has a picture of the life of its time (`pics` in `src/geotime.ts`, Commons; life
  restorations where there's a good one, else fossils and museum dioramas): on the card about what it's known for, and
  for the three dinosaur periods a second dinosaur on the card about when it began. Triassic: Coelophysis,
  Herrerasaurus; Jurassic: Brachiosaurus, Stegosaurus; Cretaceous: Tyrannosaurus, Triceratops; also stromatolites,
  banded iron, Dickinsonia, Anomalocaris, a Silurian sea floor, Dunkleosteus, Meganeura, Dimetrodon, Basilosaurus, Lucy,
  the woolly mammoth, Eohippus, Paraceratherium, megalodon's jaws, Smilodon, Göbekli Tepe. All 28 checked to load.

## v1.26: pronunciation of the answer, Empire of AI, Artificial intelligence

- **A speaker beside the green answer**, saying that answer in its own language (`say` on a card face; `Say` in
  `Study.tsx`). The sync now fetches people's own-language names (Wikidata P1559) for every artist, architect, author,
  composer and person in a list (92 so far): the speaker says Brunelleschi in Italian, Фёдор Достоевский, 葛飾北斎
  (with romaji). A person's name written our way is read as the card shows it (not "Johann Chrysostomus Wolfgang
  Gottlieb Mozart"); a title is said, and shown, in its own form (*La Gioconda*). Before, the line under a "who made
  it?" card showed the *work's* local name; now each card shows only its answer's. Voices for languages devices
  lack borrow the nearest (Ancient Greek → Greek, Latin → Italian, Sanskrit → Hindi).
- Decks: `native: Milan = Milano (Italian); Italy = Italia (Italian)` gives each blank of a two-blank line its own name.
  Added to Architecture (Brunelleschi, Palladio, Mies, Le Corbusier, Beaux-Arts, Art nouveau, Modernisme, Bauhaus),
  Food & drink (Campari, Negroni, Milano, Torino, Bourgogne, México…), Philosophy (Αθήνα, Πλάτων) and Religion (مكة,
  ירושלים, ਅੰਮ੍ਰਿਤਸਰ, ਸਿੱਖੀ, गंगा).
- **Books you've read**: *Books › My reading* (the book itself, by Wikidata) and *Books › Reading notes › Empire of AI*
  (19 cards, its intro a summary page shown on the deck's sheet) and *Empire of AI: deep cuts* (`depth: deep`, now for
  note decks too). The rules are in GUIDELINES.md (about 20 cards, no repeats across books).
- **Artificial intelligence**, a subject of lenses: *History of AI*, *How AI works*, *The AI industry*, *AI debates*,
  filled by `also in:` from every book's notes; plus *Artificial intelligence: reading list* (the Books shelf, renamed
  from Technology & AI to match).
- **American spelling** everywhere; respelled cards keep their progress (the card id reads "flavor" as "flavour").
- A deck's sheet lists each heading once.
- Earth history: the three "if Earth's history were one day, what time…?" cards are gone (an analogy, not a fact about
  the world; new rule 14). The clock stays on the time-scale chart.

## v1.25: Jazz, and better classical clips

- **Jazz** (`collections/Music/2 Jazz.md`, the first `kind: person` list): 43 musicians under the scene they're known for
  (New Orleans, Chicago, Harlem, Kansas City, Swing-era New York, Bebop, Cool jazz and the West Coast, Hard bop and
  modal jazz, Free jazz and fusion). The sync takes their portrait, life, birthplace with its US state (P19 → P131* a
  US state) and instruments (P1303); main instruments set by hand. Cards: face → who, which scene, born where (city and
  state, on the map; Kansas City, Kansas is not Kansas City, Missouri), which instrument. Music › By scene. No audio yet:
  jazz recordings are mostly still in copyright (free in the US only once 100 years old: before 1926 now).
- **Classical clips start at the moment that matters**: an analysis of each recording (`scripts/find-clip-moments.py`, ffmpeg +
  numpy) found the loudest 30 s (the 1812's cannons, the climax of the Mountain King and of Boléro, the William
  Tell gallop, the choir in Beethoven's 9th) or the most high-soprano energy (the Queen of the Night's staccato, 0:38),
  written as `@seconds` in the list. Boléro has two clips (opening and climax) from one recording.
- **More pieces** (63 clips, 37 works): all four movements of Beethoven's 9th, Winter from the Four Seasons, Swan Lake,
  the Nutcracker, the Hallelujah Chorus, Water Music, Mozart's 40th, Schubert's Ave Maria, Liebestraum No. 3, Bach's
  first cello suite.
- **While a clip plays**: its time, −10 s / +15 s, and **Start here** (keeps your start for that clip, saved with your
  progress, `clipStarts`; Reset goes back). Every reveal names the piece and part.
- Search finds a clip by its part and composer ("Hölle Rache").

## v1.24: Music

- New subject **Music** (`collections/Music/1 Essential classical.md`, `kind: music`): 28 works, 47 clips, in four eras
  (Baroque, Classical, Romantic, Modern). A work is a Wikidata id; under it, one line per recording:
  `♪ II. Adagio | File name on Commons.ogg` (add `@45` to start 45 seconds in). Each clip is its own card subject.
- Cards: the clip plays (30 seconds, by itself, tap to replay or stop) → **who composed it**, **which piece**, and, for
  works with several recorded parts, **which part** (`musicComposer`, `musicWork`, `musicPart`). The answer shows the
  composer's portrait, flag (the country of their birthplace today), life and era, and **every part of the work** with
  play buttons, the current one marked (`src/components/Music.tsx`).
- Recordings: free ones on Wikimedia Commons only (Musopen, the US Marine Band, and others). Played from Wikimedia's MP3
  copy first, since most originals are Ogg and iPhones can't play Ogg, then the original; a recording that won't load
  says so. Addresses come from the MD5 of the file name (`src/md5.ts`). Background music pauses while a clip plays.
- The sync takes the composer (P86) and their portrait, dates and birthplace's country; fixes for arrangers and
  completers listed as composers (Air on the G String is Bach's, the Requiem Mozart's), Liszt as Hungarian, common titles.
- Music › By composer: one deck per composer (made from the facts).
- Not yet: more of Beethoven's 9th and the other three Seasons (no free recordings linked on Wikidata; to add from
  Commons when it can be searched); a check that every file loads (Wikimedia was rate-limiting this session: 9 of 11
  clips tried played, the rest were refused by the rate limit, not missing).

## v1.23: Books

- New subject **Books** (`collections/Books/`, `kind: book`): *Essential books* (52) and *More books* (38, `depth: deep`:
  unlocks once half of the essentials are known; the first use of core/deep). Each list has `## Fiction` and
  `## Nonfiction`. The sync takes the author (P50), the first publication date (P577), the original language (P407, and
  the title in it: *Divina Commedia*, *Война и мир*, 道德经 *Dàodéjīng*), and the main subjects (P921) and genres (P136).
- Cards: picture → title (title pages and manuscripts; modern covers aren't free, so many books have none), **who wrote
  it**, **which language** it was first written in (new kind `bookLang`; not asked for English).
- **Shelves made from tags** (`src/tags.ts`, the shared vocabulary): fiction by literature (Books › Fiction by language ›
  Italian literature…; language variants merged, so Homeric and Koine Greek are Ancient Greek), nonfiction by topic
  (Books › Nonfiction by topic › Philosophy, Politics, Economics, Science, Psychology, History, Technology & AI; a book
  sits on every shelf its subjects match). A topic that is also a subject shows there too: Philosophy › *Philosophy:
  reading list*. One book, one set of progress, on every shelf.
- Fixes: wrong languages (War and Peace isn't French), dates, missing authors, Goethe's *Faust* (the list had the legend).
  The sync now writes Wikipedia links the way Wikidata stores them (parentheses and commas unencoded), so titles like
  *Ulysses (novel)* resolve without the Wikipedia API. Books never get a "Where to see it" place.
- Locked decks show a lock in the Library.

## v1.22: Architecture

- New subject **Architecture**:
  - `collections/Architecture/Famous buildings.md` (`kind: building`): 35 landmarks from the Great Pyramid to the Burj
    Khalifa. Cards: picture → name, **who designed it** (architect, Wikidata P84), **where it stands** (its own town,
    not a museum), **which style** (P149; new card kind `artStyle`). Hand fixes in `data/collection-fixes.json`
    (Angkor Wat was placed in Vietnam, Villa Savoye in New York; William Thornton for the Capitol; plain styles and types).
  - `decks/Architecture/1 Styles and architects.md`: 23 styles, each with a picture of a building in it, and 7 architects
    with portraits (and 貝聿銘 Bèi Yùmíng, زها حديد).
  - `decks/Architecture/2 Tours/`: **The White House**, **The United States Capitol**, **The Metropolitan Museum of
    Art**, written as a walk (the building's story, then room by room). The Met tour points on to its works in Art.
- Fix: a collection entry with the same Wikidata id as a World Heritage site, peak, range or territory (Ajanta Caves, in
  Art and World Heritage) replaced it in the app's lookup, so one of the two showed the wrong cards. The collection's
  entry now gets its own id (`Q184427-art`). Progress on the Ajanta *art* cards starts over; the site's is kept.
- Not verified this time (Wikimedia was rate-limiting): the one hand-typed picture, *Washington Crossing the Delaware*;
  every other picture comes from Wikidata's own P18.

## v1.21: search

- A search box at the top of the Library (`src/search.ts`, `src/components/Search.tsx`) finds cards in every subject by
  what they say: names (also in their own language and pinyin without tones: `xian` finds 西安 Xī'ān), answers, artists,
  museums, deck and section names. Words match from their start; all must match. Filters: `era:prehistory`,
  `subject:art`, `in:"History of China"`. A deck's own name brings in the whole deck only when none of its cards match by
  themselves, so *Washington* finds George Washington, not every president in *Washington to Buchanan*.
- **Study** these cards: what's due, then up to 20 new ones (chosen on purpose, so not held to the daily budget), dealt
  so one place's cards don't come in a row (`queueForCards` in `src/srs.ts`). **Quiz**: 25 of them as practice.
- **Pin** a search: only the words are saved (`pins` in your progress, so backups carry them), so cards added later
  join it. Not a deck: no copies, one set of progress per card.
- The settings icon is a cog (the old one looked like the sun on Today).

## v1.20: streamlined

- **Two verbs.** A deck's sheet has **Study** (adds the deck and starts; if nothing is waiting it brings in 10 new cards) and
  **Quiz**, plus Stop learning. A section has **Study** (everything in it and below; in Geography by the quiz's rule, so a
  continent means its countries), **Quiz** and **Stop**. Gone: Start learning, Study now, Learn 10 more now, Learn all,
  Practice quiz.
- **Five tabs**: Today, Library, Quiz, Map, Me. Atlas is the **List** view inside Map (a Map | List switch); the
  Dashboard is reached from its card in the Library.
- **Top bar**: sound and Settings only. Music, XP & streaks, pictures, skill locks and the theme moved into Settings.
- **Library**: a deck with one skill (every note deck and collection) is a single row; a folder with one or two small
  decks (under 30 cards together) and nothing inside is listed in its parent, labelled with its name, and gets its own
  fold back by itself once it grows (a third deck, 30 cards, or a sub-folder); notes subjects open their first level only (the
  By era lens starts closed). Remembered open/closed state moved to a new key, so everyone starts from the new defaults.
- **Today** is about today (due, new, done, one button); XP moved to Me. **Map** layer switches fold behind a *Layers*
  button on phones.
- Tests: the sweep visits the five tabs, the List view and the Dashboard card, counts deck rows, and can log its steps
  (`SWEEP_LOG=file`).

## v1.19: Study all, History by era

- **Study all** on every section of the Library: activates every deck in the section *and the sections inside it*
  and starts one session with them (all of History of China; all of Physical geography). Before, you could only start
  the decks sitting directly in one section.
- **Lenses: History › By era.** A deck says which world era it belongs to in its front matter (`era: Prehistory`, or two:
  `era: Early modern, Modern`), from a fixed list in `src/notes.ts` (`ERAS`: prehistory, ancient, medieval, early modern,
  modern, contemporary). The app then *also* lists it under History › By era › All prehistory, next to every other deck
  of that era from any country, so "study all prehistory" is one tap. Nothing is copied: one deck, one set of progress,
  shown in two places (`alsoInSections`), with where it's filed shown under its name. All 32 China and US history
  decks are tagged; By place decks are not.

## v1.18: Me (your progress)

- New **Me** tab (`src/views/Me.tsx`): totals (cards known, started, memory, streak, cards in 30 days); a radar chart of
  every subject; per subject two bars: **covered** (cards you know, of all there are) and **memory** (FSRS
  retrievability of the cards you've started, i.e. the chance you'd recall them today); tap a subject for its parts
  (Geography's continents and themes, a notes subject's sections); the **weakest decks** with a one-tap review; and a
  26-week calendar of study days. Coverage on the chart uses a square-root scale so early progress shows.

## v1.17.1: Washington, D.C. museums

- New list `collections/Art/More famous works.md` (works added a museum at a time): 6 from the **National Gallery of
  Art** (Ginevra de' Benci, Woman Holding a Balance, the Alba Madonna, Woman with a Parasol, Watson and the Shark, The
  White Girl) and 4 from the **National Portrait Gallery** (the Lansdowne and Athenaeum portraits of Washington, the
  Obama portraits). They show under Where to see it › Art in the Americas › Art in the United States, and in their
  period lists (new: Late 18th century, Contemporary art). Fixes: the National Gallery's place (Wikidata gives it no
  position), the 1778 original of Watson and the Shark, Whistler's date.

## v1.17: labels, Art organized, Information Systems, bug sweep

- **Map names in the right place.** A label is placed at the place's real middle, projected (not the middle of the
  drawn shape, which split at the map's edge put Russia over Alaska and Bangladesh in the Gulf of Mexico); when that
  point falls outside the place (Vietnam, Israel), at the point deepest inside it (pole of inaccessibility, bounded so
  it never slows the map). Labels are centred on their point; places cut by the map's edge aren't labelled.
- **Names for the deck at hand.** The names button labels US states on US decks (US rivers, Interstates; state lines
  drawn), countries everywhere else, never both.
- **Art, organized**: *By period* following Wikipedia's History of art (Antiquity › Egypt, Asian › Japanese, European ›
  Renaissance, Western art after 1770 › Early 20th century…; works can be in several lists) and *Where to see it*,
  built from the facts: continent › country › museum. New works file themselves under their museum.
- **Computer science › Information systems**: OpenStax *Foundations of Information Systems*, a deck per chapter (12),
  one card each, with the book's figures.
- **Sections can't collide**: a deck or collection folder whose name already belongs elsewhere gets its own name
  (an art folder "Americas" had pulled Geography's Americas under Art).
- **Bug sweep**, now part of the project: `npm run audit` (every deck: empty answers, leftover markup, front/back
  cards, headings that give the answer away, missing "also in" decks, unknown languages) and `npm run sweep` (browser:
  every tab and subject, 60+ quizzes on laptop and phone, ~5,000 checks that each map label sits inside its own
  shape, Peek, Map). Also checked: all 2,233 Commons pictures and 19 OpenStax figures exist.
- "1 work", "1 card" (not "1 works").

## v1.16.1: a picture per card, people's names, fewer date answers

- China history decks rebuilt card by card: each card has its own picture of its own subject (65 in all: Liu Bang,
  Confucius, Sun Tzu, Qin Shi Huang, Cai Lun, Kublai Khan, Zheng He, the Great Wall, Hangzhou, Song paper money…), and
  names in the answer (people, places, things) carry their Chinese name with pinyin: 刘邦 *Liú Bāng*, 长安 *Cháng'ān*.
  A dynasty's span is one card (start and end together); its map sits on the "which dynasty?" card.
- History cards ask for the event, person or place, with the year as context ("In 1917 the United States entered
  {{World War I}}"); landmark dates stay (July 4, 1776; 1787; the Civil War's span; the PRC in 1949).
- Guidelines: people get their portrait and their own name; every card its own picture; dates are rarely the answer.

## v1.16: one fact per card, pictures, time-scale cards

- **Time-scale cards** (`[strata: Mesozoic]`): the eon and era as coloured blocks, the periods as blank blocks
  (youngest on top), filled in with names, colours and dates on flip. They replace the "what comes after" cards: the
  eons of Earth, the eras of the Phanerozoic, the periods of each era, the epochs of each Cenozoic period.
- **Pictures on history cards** from Wikimedia Commons (maps of the dynasties, the oracle bone, the Terracotta Army,
  the Declaration, Gettysburg…), and on **biology cards the OpenStax textbook's own figures** (levels of organization,
  the three domains, inductive vs deductive reasoning, the properties of life), credited in the caption.
- **Cloze everywhere**: front/back cards rewritten as sentences with a blank (cocktails, ingredients, religion,
  philosophy, economics, history, biology, the time scale).
- **One fact per card**: a long list becomes a grouped cloze (`{{c1::…}}`) that hides about three items at a time with
  the rest as clues (the nine properties of life → 3 cards; the 12 levels of organization → 3 cards).
- **Local names go with the card whose answer they name** (the "which dynasty?" card, not the oracle-bone card); decks
  gained "which…?" cards where needed (sacred places, Greek thinkers, baijiu, soju, vodka).
- Deck syntax: a picture, `native:`, `species:`, `also in:` or `>` right after a card belongs to that card (all the
  cards made from that line); `[picture]` works in cloze lines; picture file names may contain brackets (the Golden
  Temple photo had been silently skipped).

## v1.15: History, Science, deserts, romaji

- **Romaji for Japanese** (`scripts/lib/japanese.mjs`, kuroshiro, Hepburn with macrons; Wikidata P2125 first), shown
  under the kanji like pinyin: 東京 *Tōkyō*, 神奈川沖浪裏 *Kanagawa Oki Nami Ura*, 富士山 *Fujisan*. Decks write
  `native: 夏朝 Xià Cháo (Chinese)` (script, then romanization).
- **Physical geography**: Mountains, Rivers, Lakes, Oceans & Seas and the new **Deserts** sit together, apart from
  countries and their regions. Deserts (`scripts/build-deserts.mjs`): 44 from Natural Earth with Wikidata facts (area,
  countries, local names); the 18 best known unlock the rest; a Map-view toggle too.
- **History** (a new subject):
  - *Presidents* (History of the United States › Presidents): all 45 people / 47 presidencies, from
    `data/presidents.json` (hand-checked parties and vice presidents) + portraits (`scripts/sync-presidents.mjs`).
    Cards: portrait → name, number → name, name → number, years, party; vice presidents on the back. Four eras.
  - *History of China*, following Wikipedia's chapters: Prehistory, Ancient China, Imperial China (Early, Six Dynasties,
    Mid, Late), Modern period; one deck per dynasty or period (dates, founder, capital, what it's known for, 汉字 +
    pinyin, what came before).
  - *History of the United States*: one deck per Wikipedia chapter, plus **By place** (New York › New York City,
    Pennsylvania › Philadelphia, New Jersey). `also in: Philadelphia` after a card puts it in that deck too.
- **Science**: Biology from OpenStax Biology 2e (CC BY 4.0), unit by unit, chapter by chapter; chapter 1 started;
  the full outline in `decks/Science/README.md`.
- Decks: a number in front of a folder or file name sets the order and is hidden ("2 Ancient China").

## v1.14.2: a classier picture size

- On a laptop the picture beside a card is framed at a modest size (up to 400 px wide, ~440 px tall), with the picture
  and the card centred together, and it's never stretched past its own pixels.
- Full screen shows the whole picture on screen at once (no scrolling, the page behind stays still), up to its own size.

## v1.14.1: pictures beside the card

- Laptop, cards without a map: the picture fills the left half (where the map goes on map cards), the card sits on the
  right, so nothing needs scrolling; before you flip, a placeholder holds the space. Phones keep the picture above the
  text, at most a third of the screen tall (tap it for full screen).
- A card taller than the screen scrolls from its top instead of being cut off (flex centring no longer hides it).
- The settings panel scrolls inside itself when it's taller than the screen.

## v1.14: answer map, map names, guidelines

- **GUIDELINES.md**: the rules the app is built by (local names, pinyin, scientific names, answer hints, no spoilers in
  headings, Related links, pictures, maps, hierarchy, data, sound, speed, release steps), with `CLAUDE.md` pointing to it.
- **Peek**: a button on map questions opens the answer map: every place, road or river in the section named on the map
  (capitals pinned on capital cards). The session pauses until you go back.
- **Country & state names toggle** (tag button by the zoom buttons) on river, lake, Interstate, range, peak, World
  Heritage and sea cards: names for bearings, biggest first, without overlaps. Never offered where a name is the answer.
- **Interstate sign on the card** (once flipped when the number is the answer).
- **Scientific names** (`species:` in decks, P225 in collections) in italics after the answer; the ingredient decks
  have them for every plant.
- **Answer hints**: `{{Milan|what city?}}` says what kind of answer a blank wants; added across the example decks.
- **Photos shown whole** when they're one picture of the thing (cocktails, plants, banknotes); place galleries keep the
  wide strip. Tap for full screen.
- **Sound lab** (Settings): 56 CC0 alternatives (Kenney) to audition and pick for each kind of sound
  (`public/sfx/lab/`, loaded only when played). Clicks are now softer and lower; the old back sound is gone.
- **Library** in the top bar always opens the Library's front page.
- Fix: pop-ups (skill sheets) opened at the top of the page instead of on screen after the start animation.
- Fix: `related:`/`native:`/`species:` lines no longer leak between two headings with the same name.

## v1.13: sound, Interstates, Earth history

- **Sound effects** from Kenney's free (CC0) *Interface Sounds* and *Casino Audio* packs (`public/sfx/`, 68 KB, credits
  in `public/sfx/LICENSE.txt`): a shuffle when a session starts, a card slide on flip, a card landing for the next one,
  soft clicks on buttons and tabs, chimes for right / wrong / medals. Played through Web Audio (low latency, works with
  the iPhone silent switch handling already in place).
- **Start-up chime** (a deep swell opening into a bright chord and a run of bells) and **background music** (slow,
  quiet generative chords with the odd bell; never the same twice), both synthesized in the browser: no files. Two
  toggles in the ribbon: *Sound effects* and *Music* (off by default).
- **Smoother start**: the globe swells and fades as the title lifts away, then the app rises into place.
- **Interstate Highways** (Americas › United States › Interstate Highways): the 58 primary Interstates in Natural Earth's
  roads (`scripts/build-interstates.mjs` → `shapes-road.json`, `roads.json`), facts from Wikidata, states worked out from
  the map (hand fixes in `data/interstates.json`). *Main corridors* (numbers ending in 0 or 5) unlock *More
  Interstates*. Cards: find it on the map, name the highlighted one, and name the shield. A Map-view toggle too.
- **Earth history**: the geologic time scale (ICS 2023 dates and official colours, `src/geotime.ts`) as layers of rock
  you can tap, *readable* or *true to scale*, with a 24-hour "Earth's day" clock and the period mnemonic. Two decks
  (122 cards) are built from the same data: when each began, what it's known for, which era, what comes next.
- **Cocktail ingredients** (Food & drink › Cocktails › Ingredients): *Spirits: from plant to glass* (gin ← juniper,
  tequila ← agave, rum ← sugarcane, bourbon ← corn, Scotch ← barley, baijiu ← sorghum…) and *Liqueurs & bitters*
  (Campari, amaretto ← apricot kernels, maraschino ← Marasca cherries, Angostura ← gentian…), with photos of the plants
  and links to where each comes from. New deck syntax: `- What is made from this? [picture] :: gin` shows the heading's
  picture as the question.
- Note decks take a `native:` line (`native: الكعبة (Arabic)`): the religion and philosophy examples now show
  Arabic, Gurmukhi, Hebrew, Italian, Hindi and Greek with the speaker button.
- Maps re-centre on anything more than ~70° from the middle (Japan was drawn tilted at the edge on World Heritage cards).

## v1.12: names in their own language, pinyin everywhere

The rule: anything you learn shows its name in its own language too (with the speaker button: a recording where Wikidata
has one, else the device voice), and anything Chinese shows characters with Hanyu Pinyin.
- **Artworks**: the name in the language of where the work comes from (country of origin, else the artist's country,
  else where it stands; never the museum's): *La Gioconda*, *De Nachtwacht*, *Der Kuss*, *神奈川沖浪裏*, *清明上河圖
  Qīngmíng Shànghé Tú*. Set by hand with `native` in `data/collection-fixes.json` (`[]` for none).
- **Mountain ranges** (the languages of the countries they cross: Alpi, Alpes…; 天山山脉 Tiānshān Shānmài) and
  **territories** (their own official languages: Kalaallit Nunaat, Føroyar, Kòrsou, Guåhan): `scripts/lib/local-names.mjs`,
  run by the nightly sync (or on its own to patch the data files).
- **Pinyin for every Chinese name**, not just China's provinces: China, Taiwan, Singapore and their capitals, World
  Heritage Sites, peaks, rivers, lakes, ranges, artworks. `scripts/lib/chinese.mjs` writes words apart and capitalised like
  map names (*Zhōnghuá Rénmín Gònghéguó*, *Kūnlún Shānmài*, *Zhūmùlǎngmǎ Fēng*), keeps sound-spelled foreign names whole
  (*Bùlāmǎpǔtèlā Hé*), and reads tones from the whole name. `node scripts/lib/chinese.mjs --refresh public/data/*.json`
  re-spells existing data after a rule change.
- A place with a Chinese name *and* others (a river through China and Laos) now shows both.

## v1.11.1: whole pictures, full screen, museum links

- Artwork pictures are shown whole (`object-fit: contain` on a dark backdrop), never cropped to a strip.
- Tap any picture (artworks, places, cocktails…) to open it full screen; tap or Esc to close. The copy already on screen
  shows at once, and a sharper 1600 px copy replaces it when it has loaded.
- Related on art cards: the museum (its Wikipedia article, `museumWiki` from the sync), the city, the country, the artist.

## v1.11: Art, photos on note cards, faster maps

- **Collections** (`collections/`, see its README): lists of Wikipedia things that become cards. The folder is the
  subject (`Art/` → Library › Art), sub-folders are sections, each file is a deck, `## headings` say where a work comes
  from. Write a work's English Wikipedia title; `npm run sync:collections` (`scripts/sync-collections.mjs`, also nightly)
  writes its Wikidata id into the line and pulls the name, picture, artist or culture, date, museum, city, country and
  position into `public/data/collections.json`. Hand fixes live in `data/collection-fixes.json`.
- **Art › Famous works around the world**: 43 works from Europe, the Middle East, Africa, South & East Asia, the Americas
  and Oceania. Cards: picture → name (only when Commons has a free image), who made it, where to see it (country on the
  map, pin on the museum). A work in two lists keeps one set of progress.
- Wikipedia photos on the example decks (cocktails, sacred places, Greek thinkers).
- **Faster maps**: projected shapes are cached by map centre, the map starts centred on the first question (no draw-twice),
  and world state borders are drawn just after the map appears. Opening a New Jersey quiz now does about half the drawing work (≈0.5 s of busy time instead of ≈1 s on a laptop).

## v1.10: Punjab's districts, local scripts for regions

- **Punjab (India) › 23 districts in 5 divisions** (Jalandhar, Patiala, Firozpur, Faridkot, Rupnagar), nested under
  India. Borders from **OpenStreetMap** (new `osm` source in `data/subdivisions.json`: Overpass, by bounding box and
  admin level; `groups[].ids` assigns districts to divisions; `OSM_FILE` reuses a saved response). Ways are stitched
  into rings and rounded to ~500 m. A merged `<parent>-outline` shape gives a bold outline that matches the districts.
  Headquarters cards appear where the town's name differs from the district's (Mohali, Nawanshahr, Tarn Taran Sahib).
- A quiz draws one level of regions at a time (Punjab's districts *or* India's states), so they never cover each other.
- **Local names for regions and their capitals** in each country's script (`nativeLangs`): Gurmukhi for Punjab, kanji for
  Japan, Uzbek, Hindi for India's states; recordings where Wikidata has them, else the device voice.
- `capitalKeep` override (Karnataka → Bengaluru, Maharashtra → Mumbai) with notes; notes for real two-capital states.
- Empty skills / question types are hidden (Punjab divisions whose headquarters all share the district's name).

## v1.9: river drill-down, states and sources

- **Rivers form a tree** like places: Rivers › Rivers of Europe / Asia & Oceania / Africa / the Americas, and
  Rivers of the Americas › Rivers of the United States (also listed under United States via `alsoInSections`).
  A level's "All" quiz includes the decks nested inside it that teach the same kind of thing (rivers within rivers),
  so "Rivers of the Americas" covers the US rivers, while "Americas" (countries) doesn't pull in US states.
- **US rivers list their states** in order along the river, worked out from the map (river line × state outlines,
  checking a little to each side so border rivers count for both banks); other countries reached are added after.
  States are Related chips. A river's `bbox` in `data/rivers.json` now trims its line, dropping stray same-named segments.
- **Every river shows where it starts** (Wikidata P885): "from Lake Itasca to the Gulf of Mexico".

## v1.8: more regions & rivers, population, local names, more dashboard

- **India** (36 states & union territories in 6 regional groups) and **Uzbekistan** (14 regions) in `data/subdivisions.json`.
  Overrides fill missing capitals (New Delhi for Delhi).
- **Rivers of the United States** (`r-us`, inside United States): 35 more rivers from Natural Earth 1:10m, listed in
  `data/rivers.json` with `"deck": "r-us"` and a bounding box so same-named rivers elsewhere aren't picked up. Big
  rivers that touch the US (Mississippi, Columbia, Hudson…) also appear there (`alsoIn`), sharing one set of progress.
  (Texas's Trinity and Virginia's James aren't in Natural Earth, so they're left out.)
- **Population** (Wikidata P1082, latest) on country, state, province, region and territory cards and sheets.
- **Local names** (and pronunciation: Wikidata recordings, else the device voice) for largest cities, peaks and World
  Heritage Sites: labels in the country's own languages.
- **Dashboard**: total debt by sector (government / households / companies, BIS total credit) as stacked bars next to
  external debt; population (world + 10 most populous, with growth); inflation (BIS) and unemployment (OECD via FRED,
  ILO annual where no monthly series) for the 10 largest economies; most valuable listed companies (Wikipedia's
  quarterly list, global or US-only, with quarter-on-quarter change).
- Robustness: election results, company list and trade figures fall back to last night's when a source is rate-limited.

## v1.7: charts, more data, connections

- **Dashboard charts** (`src/components/Charts.tsx`, plain SVG): line charts with series chips and 1M/3M/1Y/5Y ranges
  (markets indexed to the start of the range, so the S&P 500 and the Dow share one axis), step charts for policy rates,
  bar charts with a metric toggle for the 10 largest economies, trade and petroleum partners. Hover/touch for values;
  colours from a palette checked for colour-blind separation in light and dark mode; the tables stay under each chart.
- **More sources** in `scripts/sync-dashboard.mjs`: BIS central bank policy rates (10 central banks), EIA weekly US
  petroleum imports/exports/net imports and monthly top-5 partners (`EIA_KEY` secret), World Bank Quarterly External
  Debt Statistics (gross external debt and % of GDP), UN Comtrade public preview (each economy's top 5 exports & imports
  by HS chapter and top petroleum partners; last night's figures are kept when the preview rate-limits). `FRED_KEY` is
  used when present, otherwise FRED's public CSV.
- **Related links** (`src/related.ts`): after a card is flipped, chips link it to other things you're learning — a site
  to its state and country, a peak to its range, a leader to their country, a note card to its `related:` names and any
  country it mentions. Places open in the sheet (with a back step); others open Wikipedia. A place's sheet lists the
  note cards that point at it ("Also in your decks").
- **World Heritage Sites and peaks know their state / province** (Wikidata P131 → first-level division): "Ajanta Caves
  is in Maharashtra, India".
- Example decks: Religion › Sacred places, Philosophy › Ancient Greek thinkers.

## v1.6: Library, note decks, Dashboard

- **Library** (the old Skills tab): one card per subject. Geography is built in; every other subject comes from
  **note decks**: Markdown files in [`decks/`](decks/README.md) (folder = subject, sub-folders = sections, file = deck).
  Cards are cloze (`{{answer}}`) or `front :: back` (`:::` both ways), with optional pictures and notes. They schedule,
  quiz and review exactly like geography cards, and Today mixes everything. Cards from the same topic are spread out.
- **Dashboard** (view only): `scripts/sync-dashboard.mjs` writes `public/data/dashboard.json` nightly. Markets (S&P 500,
  Dow, Nasdaq, VIX), WTI/Brent, Treasury yields 1M–30Y, fed funds, SOFR, ECB rates, mortgages (1D/1M/3M/YTD/1Y/5Y
  changes), CPI/PCE headline & core y/y, unemployment and hourly earnings from FRED's public CSV (no key); the 10 largest
  economies' GDP, GDP per person, population and unemployment from the World Bank. Petroleum trade waits for an
  `EIA_API_KEY` repository secret.

## v1.5: drill-down and regions inside countries

- **Sections form a tree** (`SECTION_PARENT` in `src/cards.ts`): United States sits inside Americas, China and Japan
  inside Asia, New Jersey inside United States. The skill tree, quiz (Area step) and atlas all drill down through it.
- **Regions inside a country** are one generic layer (`sub`), configured in `data/subdivisions.json`:
  - `ne-admin1`: any country's states/provinces from Natural Earth 1:10m (Japan's 47 prefectures, grouped by region);
  - `us-counties`: US Census counties via us-atlas, matched to Wikidata by FIPS code (New Jersey's 21 counties).
  To add one (Ukraine's oblasts, Russia's regions, another state's counties), add an entry, run
  `NE_DIR=… US_ATLAS=… node scripts/build-shapes.mjs` and `npm run sync`. Cards: find it / name it and
  capitals ("county seat" for counties); capital cards that give themselves away (Hiroshima → Hiroshima) are skipped.
  Overrides can fill a missing capital (`"capital": {…}`) or add a `capitalNote`.
- **Quiz by country**: World Heritage, mountains, rivers and lakes can be narrowed to one country (e.g. Asia → China).
- Territory cards show "Part of France" (and the territory's status) once flipped.
- Plan for subjects beyond geography: [`docs/SUBJECTS-PLAN.md`](docs/SUBJECTS-PLAN.md).

## v1.4.2: review sweep

- Currency pictures can be files kept on English Wikipedia itself (most banknotes are copyrighted, so they aren't on
  Commons). These are stored as `en:<file>`; every candidate is checked to exist, banknotes first, and a failed lookup
  keeps the last good picture.
- Cards add "the" where English needs it (the Netherlands, the United States) and "are" for island groups.
- World leaders: titles no longer read "President of the Czechia"; rows naming a ruling body ("People's Party") ask for
  the country's leader; Charles III and other multi-realm monarchs have no "tap the country" card.
- Sites in more than three countries skip "which country?"; the same site under two Wikidata items is listed once.
- Senator portraits that don't exist yet are skipped (the Wikipedia photo is used); party changes no longer reset cards.
- Multi-capital lists have a fixed order (no false "world changed" notes); the nightly job now saves the pronunciation
  cache; PNG home-screen icons for iPhone.

## v1.4: highest points, borders, money

- **Highest point of each country** (Wikidata P610, best-ranked elevation in metres): "The highest point of Nepal is…" and
  back again (only when that peak belongs to one country). `highestNote` overrides explain odd cases (Australia → Heard Island).
- **State / province borders** appear as thin dashed lines once you zoom in (Natural Earth admin-1, only the lines inside
  a country; `shapes-admin1.json`, ~190 KB, fetched on first zoom). Country borders are drawn a little heavier.
- **Currency pictures** are the money itself: the currency article's infobox image, banknotes before coins.
- Mountain cards: no more photo → name (too hard); "Kanchenjunga is in Nepal" instead of "here".
- People photos fall back to the Wikipedia article's lead image if the official portrait is missing.
- Map labels nudge apart when they would overlap (Massachusetts / Boston); the Great Lakes are drawn over US states.
- Data fixes: "A, B and C" capital lists; a place appears in one layer only (Vatican City is a country, not also a site);
  duplicate range names get their country ("Sierra Nevada (Spain)"); stray far-off countries dropped from ranges.

## v1.3: mountains

- **Peaks** (165): Natural Earth's notable peaks plus a short list of famous extras (`data/peaks-extra.json`, by Wikipedia
  article), ranked by Wikipedia coverage: 40 famous peaks, then 25 per continent. Height, range and countries from Wikidata.
  Triangle markers; find it, which country.
- **Ranges** (70): Natural Earth range outlines with Wikidata ids — 24 great ranges, then more. Shaded areas; find it / name it.

## v1.2: World Heritage, territories, insets, look-alikes

- **UNESCO World Heritage Sites** (241): from Wikidata (designation + UNESCO id). Ranked by how many Wikipedia
  language editions cover them: 50 icons first, then the best-known 40 per continent. Gold diamond markers on the map;
  photo → name, find it, site → country.

- **Territories** (60): overseas regions, dependencies and autonomous territories — Martinique, Puerto Rico,
  Greenland, New Caledonia… — with "part of which country?" cards. Shapes: Natural Earth map units; facts: Wikidata.
- **Close-up insets** for small places: the 1:10m island outlines (`shapes-small.json`), a dashed hull showing how far
  an island group spreads, and a scale bar. (The hull is the spread of the islands, not the legal maritime zone.)
- **Maps on capital & city cards**: start wide (all states / the continent), zoom and lock on when flipped.
- **Flag look-alikes** (`public/data/flag-lookalikes.json`, hand-curated): shown after a flag card with a tip.
- **Again / Hard / Good / Easy** everywhere (1–4, space = Good); quiz answers on cards you're learning count as reviews.
- **More real pronunciations**: the sync searches Wikimedia Commons for Lingua Libre / Wiktionary recordings of each
  local name (cached in `data/audio-cache.json`); the device voice now prefers the best installed voice.
- Fix: a polygon wound inside-out (Maryland) covered the map; the app now flips such shapes back.

## v1.1: leaders, currencies, largest cities

- **Governors** (all 50) and **heads of state / government** (349 offices in 200 countries) from Wikipedia's closely
  watched lists ("List of current United States governors", "List of current heads of state and government");
  photos & parties via Wikidata. Cards follow the office ("The President of France is…"). Countries run by a
  council (Switzerland, Bosnia and Herzegovina, San Marino) have no single leader card.
- **Incoming officeholders**: the 2026 Senate and governor race-summary tables on Wikipedia are read nightly; seats
  changing hands show an "Incoming · January 2027" strip. It disappears once the winner is the current holder.
- **Currencies** (Wikidata P38, preferring the country's own, non-discontinued currency) and **largest cities**
  (GeoNames candidates, confirmed with Wikidata's latest population). `largestCity` / `currencyCodes` overrides in
  `data/overrides.json` handle the odd case, and warn if they stop matching.
- Party colour key on people cards: blue Democrat, red Republican, purple independent.

## Versions

The home screen shows `v<version> · build <commit> · <date>`, so you can tell when an update is live.
With each update: bump `version` in `package.json` and add a line to `src/changelog.ts`.

## v0.8

- Home screen: a slowly turning globe (countries you've mastered are coloured in), Start and Settings, version line.
- Lock-on target brackets around the place in question, with coordinates and a ✓ / ✗ badge after map answers (toggle in Settings).

## v0.5: rivers & lakes

- **96 rivers** and **91 lakes**, each with find-it / name-it cards, length or area, where it flows, and its countries.
- **Tiers keep it manageable**: the 20 longest rivers / 20 largest lakes (ranked live from Wikidata) come first;
  each continent's rivers and lakes unlock once you know half of that tier. A few small-but-famous lakes
  (Dead Sea, Lake Geneva…) are always included (`_lakesAlways` in `data/overrides.json`).
- **On the map**: rivers are thin lines with a wide invisible tap area; the great rivers always show, smaller ones
  appear as you zoom in. During a question only that group's rivers are drawn.
- Rivers come from Natural Earth 1:10m, mapped to Wikidata via `data/rivers.json` (Natural Earth river segments
  have local names and no ids); lakes are matched by Wikidata id automatically.

## v0.4

- **Map re-centres on what you're studying** (e.g. ~105°E for China), so regions far from Europe sit upright
  instead of slanting at the edge of the world; the Pacific is no longer split. Big shapes (Arctic, Southern Ocean) frame whole.
- **Photo galleries**: the photos at the top of each Wikipedia article (the infobox collage), read live from
  Wikipedia's media list, swipeable. Falls back to the Wikidata image.
- **Pronunciation**: a speaker button on each local-language name. Plays a native-speaker recording from
  Wikidata (P443, mostly Lingua Libre) when there is one, otherwise the device's text-to-speech voice.
- Keyboard hints on the answer buttons (1–4; in quizzes 1 = missed, 2/space = knew it).

## What was in v0.1

- **203 countries**: all 193 UN members, the 2 UN observer states (Vatican City, Palestine),
  and Taiwan, Kosovo, the Sahrawi Republic, Northern Cyprus, Somaliland, Abkhazia,
  South Ossetia and Transnistria. Disputed and observer states carry a short note.
- **7 cards per country.** Each fact is asked both ways.
  - *Countries*: find it on the map (tap) · name the highlighted country
  - *Capitals*: "The capital of Germany is ___" · "Berlin is the capital of ___" · tap the country whose capital is Berlin
  - *Flags*: name the flag · picture the flag
- **Cloze cards, Anki-style.** The blank shows a hint ("what?", "which country?") and fills in
  when revealed. Capital cards show a photo of the city from Wikimedia Commons.
- **FSRS scheduling**, the same algorithm modern Anki uses (`ts-fsrs`), with Again/Hard/Good/Easy
  and interval previews. Map-tap cards grade themselves.
- **Skill tree.** 20 regions × 3 branches. Capitals and Flags for a region unlock when you know
  half its countries.
- **Mastery map.** Countries colour in from *learning* → *known* → *mastered* (next review ≥ 3 weeks out).
- **Atlas.** iPod-style drill-down: World → Continent → Region → Country.
- **Ribbon toggles** for sound, XP & streaks, pictures, skill locks, theme, plus ⚙ for
  new-cards-per-day and backup/restore.
- Works on phone and laptop. You can add it to your phone's home screen like an app.

## Staying up to date

Facts come from **Wikidata** (the structured database behind Wikipedia; CC0).
`scripts/sync-wikidata.mjs` queries it and writes `public/data/countries.json`.

- A nightly GitHub Action (`.github/workflows/geo-quest-sync.yml`) reruns the sync and commits
  any changes. Changed facts are logged to `public/data/changes.json`.
- Every card stores a fingerprint of the facts it was learned from. If a capital or name
  changes, the app re-queues just those cards and shows *"The world changed: …"* on the Today screen.
- `data/overrides.json` holds hand-written wording, e.g. Bolivia's *"both La Paz (seat of
  government) and Sucre (constitutional capital)"*. An override is only used while Wikidata still
  lists exactly the capitals it was written for. If Wikidata changes, the override is
  ignored and the sync prints a warning, so it can't silently go stale.

## Running it

```bash
cd geo-quest
npm install
npm run dev        # http://localhost:5173
npm run sync       # refresh data from Wikidata
npm run build      # static site in dist/
```

Publishing: `.github/workflows/geo-quest-pages.yml` deploys to GitHub Pages on every push to
`main` (one-time setup: Settings → Pages → Source: GitHub Actions).

Progress is stored in your browser. Use ⚙ → *Download backup* / *Restore* to move it between
devices (automatic sync is on the roadmap).

## Architecture

| Piece | Where |
|---|---|
| Data snapshot + change log | `public/data/*.json` (from `scripts/sync-wikidata.mjs`) |
| Hand-written wording, extra states | `data/overrides.json` |
| Card kinds, cloze wording, skill tree | `src/cards.ts` |
| Scheduling, progress, unlocks | `src/srs.ts` |
| Map (D3 + Natural Earth 1:50m, Equal Earth projection) | `src/components/WorldMap.tsx` |
| Ocean & province shapes (run by hand; shapes rarely change) | `scripts/build-shapes.mjs` → `public/data/shapes-*.json` |
| Which seas belong to which group | `data/places.json` |
| Quizzes | `src/quiz.ts`, `src/views/Quiz.tsx` |

Everything is keyed by Wikidata ID (`Q183` = Germany), which leaves room for provinces, cities,
rivers or anything else Wikidata knows about.

## Roadmap ideas

- Heads of state / government (Wikidata P35/P6, which change often, so the change log matters)
- More provinces/states (India, US …), rivers, mountains — each becomes a map layer + label toggle
- **Anki bridge**: import an `.apkg` or read via AnkiConnect, attach cards to places with a tag
  like `geo::CN`, and show them on that country's page and in mixed sessions
- Automatic progress sync between devices (e.g. a private GitHub Gist)
- Offline mode (service worker)
