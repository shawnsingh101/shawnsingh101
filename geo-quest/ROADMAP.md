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

**Owner controls: edit and build inside the app** (agreed with the owner, one session per step, in order). **Step 1 done
(v1.41):** Settings is a list (`src/components/Settings.tsx`: switches, popups via `Popup`, a Backup dropdown); the top
bar holds only Settings. Levels in `src/levels.ts` (gem tiers; level 1 costs 10,000 XP, each next ×1.2 rounded to 500;
weekly target = average of the last four full weeks since the first study day, rounded to 500, 5,000 in a first week),
drawn by `LevelProgress` (`src/components/Level.tsx`) at the end of sessions and quizzes and on Me. Days now record
`xp`; older days get their share of the XP total by `dailyXp()`. The answer log is `Progress.log`
(`[unixSeconds, cardId, grade 1–4, xp, 1 if quiz]`), saved under its own localStorage key `geoquest:log` and included in
backups; quiz answers on unlearned cards are logged with 0 XP (the score bonus is a day total, not a log entry).
Watch: about 3 MB a year at the owner's pace; if storage fills, move the log to IndexedDB. **Step 2 done (v1.42):**
Me has Overview | Reports (`src/views/Report.tsx`). Periods: past 24 hours (by hour, from the log), week, month, 3
months (by day), year to date, 1 year (by week), custom dates. Tiles (XP, answers, % right, new cards, days, time
studying = gaps between logged answers capped at 2 min) compare with the period before; answers, XP and days come from
`p.days` (all history), subjects, time and most-missed from the log (a note says when the log started). Save as PDF is
`window.print()` with print CSS that shows only the report on white. **Step 3 done (v1.43):** after a hand-written card
is flipped, Edit (top bar of the study screen) opens `EditCard` (`src/components/EditCard.tsx`): the card's lines from
its deck file (`cardSource` / `cardBlock` in `src/notes.ts`; every card records its bullet's `line`, checked by the
audit), a live note on whether the edit keeps progress (re-parses the deck and looks for the card's id), and Send for
review. `src/github.ts` reads the file fresh from `main`, replaces the old lines (refuses if they changed), commits to a
new `edit/<deck>-<time>` branch and opens a pull request, all from the browser with the owner's fine-grained token
(this repo only; Contents + Pull requests read/write), kept in localStorage `geoquest:github`, never in progress or
backups. Set up in the editor or Settings › Editing on GitHub (step-by-step, token checked before saving; lists edits
sent). `.github/workflows/geo-quest-audit.yml` runs the audit on every PR touching `geo-quest/`. A note card whose
fingerprint changed now keeps its FSRS state and is due at once (data facts still reset). Not yet: editing
collection cards (they come from Wikidata: fixes go in `data/collection-fixes.json`) and the lesson text. **Next: step 4, Builder** (reuse `github.ts`
`proposeEdit` for new files: it will need a "create file" path without `sha`).
1. ~~**Settings and rewards.**~~ Settings becomes a clean list: buttons that open their own popup (Theme, New cards,
   Backup, …) and sliding switches for on/off ones (sound effects, music, XP & Streaks); sound moves inside Settings.
   Backup is a dropdown: *Download backup* / *Restore from a file*. The session-complete screen gets a sleeker XP line
   with a flat gem icon. **Levels, not leagues** (owner's choice): named gem tiers (quartz, amethyst, sapphire,
   emerald, ruby, diamond…), each needing a bit more XP than the last (the owner earned ~27,000 XP in two weeks: a new
   level every week or two at first), a weekly target set from the owner's own recent weeks, and a progress bar to
   the next level at the end of study sessions and quizzes and on Me. **Also start an answer log** (every answer with
   its time, kept in progress and in backups) so step 2 has history.
2. ~~**Reports**~~ under Me: past 24 hours, week, month, 3 months, year to date, 1 year or a custom range; a dashboard of
   progress from the answer log (and daily XP totals before it); save as PDF with the browser's print-to-PDF.
3. ~~**Edit a card.**~~ An Edit button on hand-written cards opens the card's source line; saving sends it to GitHub as a
   **pull request** (owner's choice), where a GitHub Action runs `npm run audit`; the owner merges. The owner pastes a
   fine-grained GitHub token (this repo only: contents and pull requests), stored only on the device; walk them
   through creating it. Fixing an answer keeps progress; rewording the question makes a new card (say so in the editor).
4. **Builder.** New cards by type (cloze, front/back, parts, recipe, picture) and new decks (subject, section, name,
   icon), saved the same way. **Add from Wikipedia**: search a name, pull title, picture, description and native name
   (Wikipedia/Wikidata allow browser requests), fill the card for the owner to adjust. A `source:` link per card,
   shown on the back. **Device-only decks** (kept in progress and backups, private) for studying without Claude,
   publishable later. Remind the owner the repo is public.

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
