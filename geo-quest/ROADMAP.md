# Intelligence Quest: roadmap

What's next, in order, and how a new idea becomes part of the app. The rules for *how* things are built are in
[GUIDELINES.md](GUIDELINES.md); this page is *what* and *when*.

## How a new topic gets in

Any idea ("I'd like to learn about Thanksgiving") goes through the same steps:

1. **Proposal.** A short plan covering:
   - **Home**: the one place it's filed (an existing subject and section, or a new one). Every thing has one home.
   - **Tags and lenses**: which tags it carries (era, place, topic, type…) and so which other views it also shows in
     (History › By era, a place's "Also in your decks", search). Shown in several places, never copied.
   - **What the items are**: things that have a Wikipedia page (filed by Wikidata id, facts filled in by a sync: a
     *collection*) or notes written from a source (a *deck*), or data with its own view (like the time scale).
   - **Card types**: which fit (fill in the blank, picture → name, tap on a map or diagram, put in order, practice
     problems, listening…), and anything new they'd need.
   - **Sources**: the Wikipedia article's chapters, a textbook, Wikidata; where the pictures come from.
   - **Size and depth**: a starter set first. Cards are **core** (what an educated person should know) or **deep**
     (deep cuts); deep decks unlock once half the core is known (or turn locks off to get everything now).
   - **Outline**: the sections, how many cards, and three sample cards, so the level and angle can be corrected
     before building. Not every card: those are cheap to fix after you've studied them.
   - **Links**: Related places and people, and decks it should also appear in.
2. **Decision**: build it now, or put it in the queue below (at a position you choose).
3. **Build** following GUIDELINES.md and the subject's guide, including the release steps.
4. **Done**: its *In progress* entry is updated (or removed) and the changelog says what shipped. A rule learned while
   building it goes into GUIDELINES.md or its subject guide.

## In progress

**Life** (started): the tree of life as the outline (Bacteria · Archaea · Eukaryotes › …), groups of species filed on it,
book decks feeding its branches. Cards: photo → name with the lineage, Latin name, range map and habitat on the back;
dinosaurs asked when they lived (period, epoch, age) with time-scale blocks; deep cuts from books. Done: whales and
dolphins, dinosaurs (v1.30, reworked v1.31). Next: the book decks (Spying on Whales, The Rise and Fall of
the Dinosaurs: send the PDFs), birds with calls, trees and plants, any animal a book is about.

**Economics** (started): rebuilt course by course from the owner's class notes (GUIDELINES 4g), with KaTeX math,
derivations, graphs and an Equations section. Done: Macroeconomics lectures 1–3 (v1.36), 4–9 (v1.37), with every
equation defined (symbols and a worked example). Next: the rest of Macro (taxes, government purchases, fiscal
sustainability, money, IS-LM-FE, the Phillips curve,
exchange rates, the open-economy IS-LM), then International Trade, International Finance and Monetary Theory, Micro,
Capital Markets, IPE, Econometrics. Later: typed math answers checked by Python.

**Cybersecurity** (started): IT security from the ground up, ahead of Security+ (SY0-701) practice in the owner's Study
Lab. Lessons before cards, then foundation cards, then a "going further" deck of applied cards; flow diagrams, stacks
and Wikipedia diagrams; tagged by exam objective and book chapter. Done (v1.34–1.35): 1 How computers talk,
3 Cryptography. Next: 2 The core ideas (CIA, AAA, controls, risk, zero trust), 4 Identity, 5 Networks, 6 Attacks,
7 Defending systems, 8 Operations, 9 Governance. Later: a network-map card (tap where the firewall goes).

**Programming** (started): two linked decks in Computer science. *Python* follows the OpenStax textbook chapter by
chapter (done: 1–3; next: Decisions, Loops, Functions…). *Under the hood* teaches this app from its own files (done:
The repo, Git and GitHub; next: Data and the sync, the basics in real code with Python beside it, Structures, the app,
algorithms, testing). Practice decks beside each Python chapter: write the program, the app runs it in real Python and
checks it (v1.32).

**Classical music, Anki-guided** (Classical Music Themes, Parts I–II: 972 pieces). Essential (~170 themes): 39 works,
63 clips so far; next: free recordings for the rest (Hallelujah Chorus, Bach's cello prelude, Swan Lake, the Nutcracker
…), from Musopen and Commons only. Then More (~340) and Deep cuts (~540). About a dozen pieces are still under
copyright (Copland, Prokofiev, Barber, Orff, Khachaturian, Shostakovich) and can't be included.

**Cocktails, revamped** (next): rebuild how a drink's ingredients are asked, from the owner's bartending study guide
(measurements included; the guide itself is never committed). Idea: a "build the drink" parts card drawn as colored
blocks (spirit, modifier, sweet, sour, garnish, glass, method), each block a measured ingredient to recall.

**Books: The Changing World Order (Ray Dalio)** (next): a book deck from the owner's notes, cross-cutting into
History, Economics and Government lenses (guides/books.md).

## Queue

| # | What | Kind of work | Notes |
| --- | --- | --- | --- |
| 1 | **Life**: the tree of life, animals and plants | built tree + collections + book decks | In progress (see above). Replaces "Birds and trees" |
| 2 | **Labelled diagrams**: house systems, car, bike | new card type | Tap the part on a diagram, like tapping a country on the map |
| 3 | **Practice mode, part 2**: math and statistics | builds on practice cards | Python practice is done (v1.32). Next: numbers that change each time, worked steps |
| 4 | **Quotes** | deck + card types | Fill in the key words; quote ↔ who said it |
| 5 | **Astronomy**: night sky, constellations, and more | built data + map engine | A star chart using the map engine |
| 6 | **Periodic table** | built data + chart | An interactive chart like the geologic time scale |
| 7 | **US government**, continued: the Constitution and amendments, Congress, the executive branch, the courts | decks + collection | Started in v1.38 with the State Department (see Done). Built to take other countries later; then **Law** as its own subject (sources of law, the US Code, civil and criminal, torts, major acts) |
| 8 | **International organizations and treaties** | collection + map layers | Tap every member on the map (NATO, EU, BRICS…) |
| 9 | **Finance** | decks | Linked to coursework and the Dashboard's live numbers |

Ideas for later, not yet in the queue: movies, political science, international relations, AI, languages (listening, typed answers),
jazz recordings (as they become free: 1926 recordings on 1 January 2027), more music beyond classical and jazz, holidays & traditions (Thanksgiving first), put-in-order cards, wine regions and grapes.

What shipped is recorded in `src/changelog.ts`; the old Done list is in `archive/ROADMAP_DONE.md`.
