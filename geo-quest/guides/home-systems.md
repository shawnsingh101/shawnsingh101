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

## Sources
- Wikipedia for facts and pictures, written in our own words. Code numbers (frost depth, egress size, GFCI
  locations) are the US International Residential Code and National Electrical Code; say "usually" where local codes
  differ.
- The owner's PDF of *How Your House Works* (Charlie Wing) sets the coverage and order of the electrical deep dive
  only: never copy its text or figures. Check its facts against Wikipedia (it dates AFCIs to 1992; the NEC first
  required them in the 1999 code).
- esfi.org blocks automated reading (Cloudflare); ask the owner to save pages as PDF if they're wanted.
