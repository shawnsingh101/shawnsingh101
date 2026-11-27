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

**Physics and Calculus** (new): the Physics path uses Shawn's 17-chapter mechanics outline, with chapters 1–2 started
from independently sourced material. Math › Calculus begins alongside it, so calculus concepts can be learned before
they are needed in mechanics. Cards use KaTeX, equation definitions, and Commons images when useful; content sources
and licenses are tracked per deck. Done: Units and Measurement, Vectors, and an initial Limits, Derivatives, and
Integrals deck (v1.40). Next: review the pilot after study, then add Chapter 3 Motion Along a Straight Line with
position, velocity, and acceleration linked to calculus; continue through the supplied chapter outline. No OpenStax
chapter text, figures, or assessments are used.

**Life** (started): the tree of life as the outline (Bacteria · Archaea · Eukaryotes › …), groups of species filed on it,
book decks feeding its branches. Cards: photo → name with the lineage, Latin name, range map and habitat on the back;
dinosaurs asked when they lived (period, epoch, age) with time-scale blocks; deep cuts from books. Done: whales and
dolphins, dinosaurs (v1.30, reworked v1.31). Next: the book decks (Spying on Whales, The Rise and Fall of
the Dinosaurs: send the PDFs), birds with calls, trees and plants, any animal a book is about.

**Economics** (started): rebuilt course by course from the owner's class notes (guides/economics.md), with KaTeX math,
derivations, graphs and an Equations section. Done: Macroeconomics lectures 1–9 from the notes (v1.36–1.37), and 10–17
(v1.39: taxes and government purchases, fiscal sustainability, money and inflation, IS-LM-FE, AD-AS, the Phillips
curve, exchange rates, the open economy). **10–17 were written from the roadmap's topic list and standard
intermediate macro, not the notes**: when the owner shares the notes for those lectures, check order, notation and
emphasis against them. Next: International Trade, International Finance and Monetary Theory, Micro, Capital Markets,
IPE, Econometrics. Later: typed math answers checked by Python.

**Cybersecurity** (outline complete, v1.39): all nine parts have lessons, cards and "going further" decks; parts 1 and
3 have three to five decks each, parts 2 and 4–9 two each. Next: deepen parts 2 and 4–9 toward the same size (e.g.
cloud and virtualization, application security, physical security and resilience, digital forensics in more depth),
add Commons diagrams where clean ones exist, and later a network-map card (tap where the firewall goes).

**Programming** (started): two linked decks in Computer science. *Python* follows the OpenStax textbook chapter by
chapter (done: 1–3; next: Decisions, Loops, Functions…). *Under the hood* teaches this app from its own files (done:
The repo, Git and GitHub; next: Data and the sync, the basics in real code with Python beside it, Structures, the app,
algorithms, testing). Practice decks beside each Python chapter: write the program, the app runs it in real Python and
checks it (v1.32).

**Cocktails** (v1.39): rebuilt from the owner's bartending study guide with recipe cards (guides/food-and-drink.md).
Next: wine (red, white, fortified, service) from the same guide's wine section, and spirits brands if wanted.

**Books**: The Changing World Order (Ray Dalio) added in v1.39. Not yet in *My reading* (needs its Wikidata id).

**Classical music, Anki-guided** (Classical Music Themes, Parts I–II: 972 pieces). Essential (~170 themes): 39 works,
63 clips so far; next: free recordings for the rest (Hallelujah Chorus, Bach's cello prelude, Swan Lake, the Nutcracker
…), from Musopen and Commons only. Then More (~340) and Deep cuts (~540). About a dozen pieces are still under
copyright (Copland, Prokofiev, Barber, Orff, Khachaturian, Shostakovich) and can't be included.

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
