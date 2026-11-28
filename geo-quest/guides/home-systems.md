# Home systems: subject guide

How a house works, system by system (`decks/Home systems/`). Read with GUIDELINES.md and `decks/README.md`.

## Layout
- One numbered folder per system, in the owner's order: 1 Structure, 2 Envelope, 3 Plumbing, 4 Electrical, 5 HVAC,
  6 Drainage and grading, 7 Safety and interior, 8 Tools. One deck per topic of the owner's outline inside each.
- Deep dives are `depth: deep` decks named "<core deck title> - going further" in the same folder, so each unlocks
  beside its own core deck (`src/notes.ts` matches the title prefix).
- Deck titles may not contain commas: `also in:` splits on them ("Drains and vents", not "Drain, waste and vent").

## Cards
- **Pictures are the point.** Most cards carry a Commons photo of the part itself, placed right after the card. A
  photo → name card gets its own `## Name it from the picture` heading with the photo as the heading's picture, and a
  question that says roughly where to look ("Which part of the floor framing is this, …?"). Each question is worded
  differently: a card's id is its heading plus question, so two identical questions under the same heading would
  collide. The photo's caption names the part; it stays hidden until the card is flipped.
- Check that every picture is a Commons file and shows the part (look at it, don't trust the file name).
- Paths and hierarchies are stacks (load path, water and power from the street, the refrigerant loop); short lists
  are parts cards.
- **Tools** (`8 Tools/Tools.md`): per tool, a `## Name the tool` heading with its photo (caption = tool name), a
  picture card whose question says what the tool does, and a "what it's for" cloze. Both carry `also in:` the
  system decks where the tool is used.

## Following the book
- The owner is working through *How Your House Works* (Charlie Wing, 4th ed., Wiley 2025), uploaded as PDFs in three parts
  (part 1: chapter 1 Plumbing and chapter 2 Wiring to motion sensors; part 2: the rest of Wiring and chapters 3–6, Heating,
  Cooling, Air quality and Appliances; part 3: chapters 7–10 and the appendices). Each chapter becomes the deep dive for its system:
  topic order from the book, a `:::lesson` per deck that explains how things work, and the book's "Before calling a
  plumber" tips as cards (the repairs an owner can do). Core decks get only what an educated homeowner should know.
- The PDF's text extracts well with `pdftotext` (most "How it works" content is in the figures: look at a few pages
  as images, in small batches). Never copy its text or figures; check numbers against Wikipedia or the codes
  (it says a pressure tank should be pre-charged to 20 psi with a 20–40 switch; common practice is 2 psi below
  the turn-on pressure, usually 40/60).
- **Drawn figures**: where Commons has no clear diagram, draw our own SVG in `public/figures/home/<name>.svg` and use
  it as `![caption (drawn for this app)](figures/home/<name>.svg)` in lessons or after cards (the audit checks the file
  exists). Style: 14 px labels, pastel fills, thin grey leader lines, blue cold, red hot, green drains, grey vents, a
  light paper background (they show on light and dark themes alike). Keep labels away from pipes; render with
  Playwright and look before committing. These are ready to become tap-the-part cards (queue #1).

## Sources
- Wikipedia for facts and pictures, written in our own words. Code numbers (frost depth, egress size, GFCI
  locations) are the US International Residential Code and National Electrical Code; say "usually" where local codes
  differ.
- The owner's PDF of *How Your House Works* (Charlie Wing) sets the coverage and order of the deep dives only:
  never copy its text or figures, and never commit the PDF (the repo is public). Check its facts against Wikipedia (it dates AFCIs to 1992; the NEC first
  required them in the 1999 code).
- Part 2's corrections, for reference: a ton of cooling is 12,000 Btu/h, the heat that melts a ton of ice in a *day*
  (the book says an hour); ASHRAE 62.2 now asks 3 cfm per 100 sq ft plus 7.5 per person (the book has the old 1 cfm);
  NFPA says test smoke alarms monthly (the book says weekly); setback savings use the DOE figure (up to 10% a year for
  7–10°F over 8 hours a day).
- Deep decks whose title doesn't start with a core deck's title (Lights and alarms) unlock beside the folder's first
  core deck; a title like "Heating rooms - going further" starts with "Heating", so it unlocks beside Heating.
- esfi.org blocks automated reading (Cloudflare); ask the owner to save pages as PDF if they're wanted.
