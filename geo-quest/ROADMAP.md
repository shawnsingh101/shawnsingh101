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
3. **Build** following GUIDELINES.md, including its release steps (version, changelog, README, tests, pull request).
4. **Done**: it moves to the Done list with its version. A rule learned while building it goes into GUIDELINES.md.

## Queue

| # | What | Kind of work | Notes |
| --- | --- | --- | --- |
| 1 | **Labelled diagrams**: house systems, car, bike | new card type | Tap the part on a diagram, like tapping a country on the map |
| 2 | **Practice mode**: math, statistics, Python | new mode | Numbers change each time, worked steps, Python that runs and is checked; scheduled by skill |
| 3 | **Quotes** | deck + card types | Fill in the key words; quote ↔ who said it |
| 4 | **Astronomy**: night sky, constellations, and more | built data + map engine | A star chart using the map engine |
| 5 | **Periodic table** | built data + chart | An interactive chart like the geologic time scale |
| 6 | **Birds and trees** | collection | Photo, sound, scientific name |
| 7 | **US government**: Constitution, amendments, Supreme Court | decks + collection | Built to take other countries later; the White House and Capitol tours also show here |
| 8 | **International organizations and treaties** | collection + map layers | Tap every member on the map (NATO, EU, BRICS…) |
| 9 | **Finance** | decks | Linked to coursework and the Dashboard's live numbers |

Ideas for later, not yet in the queue: movies, political science, international relations, current events as
"briefing" decks (facts with an as-of date that come back for a re-check), AI, languages (listening, typed answers),
jazz recordings (as they become free: 1926 recordings on 1 January 2027), more music beyond classical and jazz, holidays & traditions (Thanksgiving first), put-in-order cards, wine regions and grapes.

## Done

| Version | What |
| --- | --- |
| 1.25 | Jazz musicians by scene (no audio yet); classical clips at the famous moment, more pieces, Start here |
| 1.24 | Music: classical by ear, with the composer and the whole work on the reveal |
| 1.23 | Books: essentials and deep cuts, shelved by literature and topic from shared tags |
| 1.22 | Architecture: famous buildings, styles and architects, tours of the White House, the Capitol and the Met |
| 1.21 | Search every card; study, quiz or pin a search |
| 1.20 | Streamlined app: Study and Quiz, five tabs, one row per deck |
| 1.19 | Study a whole section; History by era (the first tag lens) |
| 1.18 | Me: progress across every subject |
