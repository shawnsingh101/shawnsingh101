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
   - **Size**: a starter set first, more to unlock later.
   - **Links**: Related places and people, and decks it should also appear in.
2. **Decision**: build it now, or put it in the queue below (at a position you choose).
3. **Build** following GUIDELINES.md, including its release steps (version, changelog, README, tests, pull request).
4. **Done**: it moves to the Done list with its version. A rule learned while building it goes into GUIDELINES.md.

## Queue

| # | What | Kind of work | Notes |
| --- | --- | --- | --- |
| 1 | **Books** | collection + shared tags | Fiction shelved by literature (Italian literature › Dante), nonfiction by topic (Philosophy, AI); one shared list of tag names that later subjects reuse |
| 2 | **Labelled diagrams**: house systems, car, bike | new card type | Tap the part on a diagram, like tapping a country on the map |
| 3 | **Practice mode**: math, statistics, Python | new mode | Numbers change each time, worked steps, Python that runs and is checked; scheduled by skill |
| 4 | **Quotes** | deck + card types | Fill in the key words; quote ↔ who said it |
| 5 | **Astronomy**: night sky, constellations, and more | built data + map engine | A star chart using the map engine |
| 6 | **Periodic table** | built data + chart | An interactive chart like the geologic time scale |
| 7 | **Birds and trees** | collection | Photo, sound, scientific name |
| 8 | **US government**: Constitution, amendments, Supreme Court | decks + collection | Built to take other countries later; the White House and Capitol tours also show here |
| 9 | **International organizations and treaties** | collection + map layers | Tap every member on the map (NATO, EU, BRICS…) |
| 10 | **Finance** | decks | Linked to coursework and the Dashboard's live numbers |

Ideas for later, not yet in the queue: movies, political science, international relations, current events as
"briefing" decks (facts with an as-of date that come back for a re-check), AI, languages (listening, typed answers),
music (hear it, name it), put-in-order cards, wine regions and grapes.

## Done

| Version | What |
| --- | --- |
| 1.22 | Architecture: famous buildings, styles and architects, tours of the White House, the Capitol and the Met |
| 1.21 | Search every card; study, quiz or pin a search |
| 1.20 | Streamlined app: Study and Quiz, five tabs, one row per deck |
| 1.19 | Study a whole section; History by era (the first tag lens) |
| 1.18 | Me: progress across every subject |
