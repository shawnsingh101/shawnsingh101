# Intelligence Quest: roadmap

What's next and how a new idea gets in. *How* things are built is in [GUIDELINES.md](GUIDELINES.md). What shipped is
in `src/changelog.ts`; finished plans and their build notes are in `archive/ROADMAP_DONE.md` (read only if needed).

## How a new topic gets in

1. **Proposal**, short: **home** (one subject/section), **tags and lenses** (where else it shows, never copied), **items**
   (Wikidata *collection*, written *deck*, or built data), **card types** (and anything new they need), **sources and
   pictures**, **size** (a core starter set; deep decks later), **outline** with section sizes and three sample cards,
   **links**.
2. **Decision**: build now, or queue it.
3. **Build** per GUIDELINES.md and the subject guide, with the release steps.
4. **Done**: update its *In progress* entry; a rule learned goes into the guide.

## In progress

**Government** (v1.38, v1.45). Done: United States › Foundations (Declaration, Constitution, Bill of Rights, amendments
11–27, the three branches as org charts, who runs foreign policy), Department of State (11 decks, incl. the June 2026 org
chart), Department of Defense (what it is, organization and combatant commands, who leads it now: live). International
organizations and treaties (how treaties work, membership map, UN family, landmark treaties, the US and the world now:
live). New card types: ```` ```org ```` org charts, `[members:]`/`[whose:]` maps (`src/memberships.ts`). Next: Congress
in depth (how a bill becomes law, committees, leadership), the presidency (EOP, NSC org chart, executive orders), the
courts (landmark cases), other departments as org charts (Treasury, Justice, Homeland Security); more treaty maps
(ICC, NPT parties, Commonwealth); then **Law** as its own subject. Unverified as of Nov 2026: the Army Chief of Staff and
Chief of Space Operations (left out), the UN Secretary-General race (being decided).

**Astronomy** (new, v1.45): Science › Astronomy follows the owner's 30-chapter outline (`decks/Science/README.md`).
Done: chapter 4 sections 5–7 (Moon phases, tides, eclipses). Next: 4.1–4.4 (sky coordinates, seasons, time, calendar),
then chapters 1–3; later the star chart on the map engine (queue #5). Cards are original (NASA, NOAA, Wikipedia,
Commons pictures); the OpenStax PDF only sets coverage and order.

**Life** (started): the tree of life files the sections. Done: whales and dolphins, dinosaurs, the **blue whale** deep
dive (v1.45, Wikipedia + Spying on Whales cards shown in it). Next: more species deep dives, birds with calls, trees and
plants, The Rise and Fall of the Dinosaurs (send the PDF).

**Home systems** (new, v1.46): `decks/Home systems/`, one folder per system in the owner's order (outline and start
prompt: `archive/HANDOFF_HOME_SYSTEMS.md`). Done: foundation decks for all seven systems (structure 2, envelope 4,
plumbing 3, electrical 3, HVAC 3, drainage 1, safety and interior 3), each card in our own words from Wikipedia with a
Commons photo of the part (picture → name under "Name it from the picture", name → what it does); stacks for the load
path, water and power paths and the refrigerant loop; parts cards for short lists. **Tools** (`8 Tools/Tools.md`): 34
tools, picture → name and name → what for, each `also in:` the system decks that use it. **Electrical deep dive**
started as `depth: deep` "… - going further" decks beside each electrical deck: circuits and Ohm's law, 120/240,
meters, grounding vs bonding, outage checklist; breakers (thermal/magnetic), fuses, panel layout, 80% rule, cable
labels; plug shapes, how GFCI/AFCI trip and when the code required them, three- and four-way switches, dimmers,
motion sensors. Order follows the owner's PDF (Charlie Wing, *How Your House Works*, ch. 2 Wiring: coverage and order
only, nothing copied). esfi.org is behind Cloudflare and refuses automated reads (added to the environment's allowed
hosts, still blocked): the owner said to use the PDF instead. Next: deep dive part 4, lights (fixtures, lamps,
incandescent vs fluorescent vs LED, lumens and efficacy) and alarms (CO and smoke detector types, hard-wired
interconnection, required locations), then the smart home; then deep dives for plumbing and HVAC. Later: labelled
diagrams (queue #2): tap the part on a house cutaway.

**Physics and Calculus**: Done: Units and Measurement, Vectors, Limits/Derivatives/Integrals (v1.40). Next: Chapter 3
Motion Along a Straight Line with calculus beside it. No OpenStax text, figures or assessments.

**Economics**: Macro lectures 1–17 done (10–17 from the topic list, not the notes: check against the notes when shared).
Next: International Trade, International Finance, Micro, Capital Markets, IPE, Econometrics.

**Cybersecurity**: all nine parts built (v1.39). Next: deepen parts 2 and 4–9, Commons diagrams, a network-map card.

**Programming**: Python chapters 1–3 and Under the hood (repo, Git). Next: Decisions, Loops, Functions; Data and the sync.

**Cocktails** (v1.39). Next: wine from the same study guide. **Books**: The Changing World Order needs its Wikidata id.

**Classical music**: Essential themes, 63 clips so far; next free recordings from Musopen and Commons only.

**Owner controls** (v1.41–v1.44) are done. Ideas left: lessons and deck intros from the app, Wikidata collections from
the app, reorder or delete cards.

## Queue

| # | What | Notes |
| --- | --- | --- |
| 1 | **Labelled diagrams**: house systems, car, bike | New card type: tap the part on a diagram (Home systems first) |
| 2 | **Practice mode, part 2**: math and statistics | Numbers that change each time, worked steps |
| 3 | **Quotes** | Fill in the key words; quote ↔ who said it |
| 4 | **Astronomy star chart** | Constellations on the map engine |
| 5 | **Periodic table** | An interactive chart like the time scale |
| 6 | **Finance** | Linked to coursework and the Dashboard |

Ideas for later: movies, political science, international relations, AI, languages, jazz recordings (1926 recordings
are free from 1 January 2027), holidays (Thanksgiving first), put-in-order cards, wine regions and grapes.
