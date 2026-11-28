# Intelligence Quest: guidelines

The rules every change follows. This page holds the rules that apply everywhere; rules for one subject live in
`guides/<subject>.md` (books, life, programming, live-topics, cybersecurity, economics, government, music,
food-and-drink, home-systems). Read this page plus the guide for the subject you're touching, nothing more. A new rule goes in the narrowest place it fits.

## 0. Working efficiently (for Claude)

- **Read only what the task needs.** This page, one guide, `decks/README.md` when writing decks, and the files you
  change. Grep before opening a big file; read source and uploads in ranges. Never read `archive/`, `shots/`,
  `public/data/`, `package-lock.json` or generated files unless the task is about them.
- **One topic per session.** Before ending, update the topic's entry in ROADMAP.md *In progress* (what's done, what's
  next, any decision made) so the next session starts from there instead of re-exploring.
- **Ask instead of hunting.** If a web page, a file or a quick answer from the owner would save a long search, ask.
- **Tests match the change** (see §9): content-only changes run the audit only; the browser sweep and screenshots are
  for code changes.

## 1. What every card should do

1. **Names in their own language.** Anything with a name shows it in its own language and script too, after the
   answer, with a speaker button (a native recording from Wikidata when there is one, else the device voice).
   - Collections get it from Wikidata (people: P1559). Decks: a `native:` line right after the card; with two blanks,
     `native: Milan = Milano (Italian); Italy = Italia (Italian)`.
   - The language of where the thing *comes from*, not where it is now (the Mona Lisa is *La Gioconda*).
   - The speaker sits by the text it says: beside the answer when spelled the same (Leonardo da Vinci, said in
     Italian), else beside the own-language name under it. For people, titles, cities, terms; not for concepts,
     dates or English names. A person's name is read as the card shows it.
2. **Chinese gets characters and Hanyu Pinyin with tone marks** (`scripts/lib/chinese.mjs`), written apart and
   capitalised as on maps (*Kūnlún Shānmài*). **Japanese gets Hepburn romaji with macrons** (`scripts/lib/japanese.mjs`;
   Wikidata P2125 first). In a deck: `native: 夏朝 Xià Cháo (Chinese)`; any non-Latin script can carry a
   transliteration the same way.
3. **Plants and animals get their scientific name** in italics: `species: Juniperus communis` (collections: P225).
4. **A blank says what kind of answer it wants** when "what?" could mislead: `{{Milan|what city?}}`.
5. **A heading never gives the answer away.** Cards that ask *for* a name sit under neutral headings ("Which spirit?",
   "Name it from the picture"); only cards that start *from* the name sit under it.
6. **Every card links to what it's connected to** (`related:`): place, person, region. The reverse shows on the place
   ("Also in your decks"). A place the app teaches opens its sheet; anything else opens Wikipedia.
7. **Facts come with a little context** after the answer: dates, size, who made it, which division it's in.
8. **Ask both ways when both are fair** (capital ↔ country). Skip a direction that gives itself away or has many answers.
9. **Cloze first.** A sentence with a blank; front :: back only when a sentence would be forced; never a paragraph back.
10. **One fact per card.** A list is a **grouped cloze** (about three blanks per card, the rest as clues:
    `{{c1::order}}, {{c1::sensitivity}}, {{c2::adaptation}}`), a **structure card** when the shape is the fact
    (`[strata: Mesozoic]`), or a **parts card** (§4i).
11. **The local-language name goes with the card whose answer is that name.** If none exists, add one under a neutral
    heading.
12. **People get their face and their own name**: portrait from their Wikipedia article; a name from another language
    in its script with romanization and speaker (Confucius → 孔子 *Kǒngzǐ*).
    **And where they're really from, with the flag of the time** ("Born in Salzburg, Holy Roman Empire · today
    Austria"); today's country always named; before national flags, today's flag. From Wikidata; fixes in
    `data/collection-fixes.json` `_origins`. **Americans** get today's US flag whatever the year; a member of a Native
    American nation gets that nation's flag.
13. **Dates are rarely the answer.** Keep the date in the sentence and blank the event, person or place, unless the
    date itself is the landmark (July 4, 1776).
14. **Cards teach facts, not analogies.** An analogy is a picture to look at, not something to memorize.
15. **The question never contains its answer.** An acronym's expansion goes *in the answer*
    (`{{DNS (Domain Name System)|which system?}}`); the answer may not appear elsewhere on the card; a card asking only
    for a mnemonic's letters tests nothing. `npm run audit` checks this.

## 2. Pictures

- **The thing itself is shown whole, never cropped** (artworks on a dark "gallery wall", banknotes, plants, cocktails,
  signs). A place's gallery keeps the wide strip.
- **A picture is always of the card's own subject**: its free picture on Commons first (via Wikidata P18); when Commons
  can't have one (in-copyright building or painting, book cover), the English Wikipedia article's **lead image**,
  hot-linked, never copied into the repo. Never borrow from an article's gallery. Science uses a source figure only
  when its license permits this use, with attribution; otherwise use a suitably licensed Commons image or no picture.
- **Every card gets its own picture of its own subject**: a picture line right after a card is that card's own; one
  under a heading is the topic default, only for a topic whose every card is about that one thing (a cocktail, a plant).
- Give a card a picture when it shows what the card is about; skip it for dates, definitions and abstract ideas.
- A picture can be the question (`- What is made from this? [picture] :: gin`); its caption stays hidden until flipped.
- Tap to see full screen. No scrolling to see a card: on a laptop the picture sits beside the card (up to ~400 px), on a
  phone above it (at most a third of the screen). Never enlarge past its own pixels.

## 3. Maps

- **One level of regions at a time**, with a bold outline of the country or state they belong to.
- Re-center on the place when it's far from the middle (past ~70°).
- Country and state names as a toggle only on cards where they can't give the answer away.
- **Peek** opens a full map of every answer in the section; the session pauses while it's open.
- Map names sit inside their own place and name only what the deck is about. "Reveal" cards start wider than the
  answer, then fly to it. Line features get a wide invisible tap target.

## 4. Where things go (the hierarchy)

- **Drill down, don't pile up.** A subject has sections; sections nest (Food & drink › Cocktails › Ingredients). Set
  the parent with `SECTION_PARENT`, a deck's `path:`, or a collection's folder. **Section names and ids are unique.**
- **Lenses, not copies.** A thing is filed once, in its natural place, and tagged with facets (`era:`, theme, region,
  genre); the app builds cross-cutting views from the tags. Something that belongs in two places is *also shown*
  in the other (`also in:`, `alsoInSections`, `alsoIn`) with one set of progress. Shelves come from `src/tags.ts`.
- **Depth**: `depth: deep` decks unlock once half of the core beside them is known. Start every topic with its core;
  big sets start with the essentials.
- **Sources set the outline**: history follows the "History of …" article's chapters; textbooks follow the book
  (subject › unit › chapter, source credited); courses follow the syllabus.
- **Architecture** holds buildings (tours: one deck per building, written as a walk); **Art** holds what's inside.
  **Geography** is split into countries/regions vs **Physical geography**.
- Every section can be studied whole; search is a view, not a deck (make cards findable with real and native names).
- **Me** measures every subject the same two ways (covered, memory), so a new subject shows up by itself.

## 4i. Parts cards

- For a short list or process: 2 to 5 parts. A longer process is split into stages (the audit refuses more than 5).
- Each part gets a cue that prompts it without giving it away; `# any order` for a set, none for a sequence.

## 5. Content files

| What | Where |
| --- | --- |
| Note decks | `decks/<Subject>/…/<Deck>.md`, syntax in `decks/README.md` (number prefixes set the order) |
| Collections (Wikipedia things) | `collections/<Subject>/…/<List>.md`, see `collections/README.md` |
| Equation definitions | `equations/<Subject>.md` |
| US presidents | `data/presidents.json` → `scripts/sync-presidents.mjs` |
| Regions inside a country | `data/subdivisions.json` |
| Hand fixes | `data/overrides.json`, `data/collection-fixes.json`, `data/interstates.json` (each has a `_readme`) |
| Built-in data with its own view | `src/*.ts` (e.g. `src/geotime.ts`) |

Never commit copyrighted sources or the owner's notes (the repo is public); write in our own words.

## 6. Data

- **Everything is keyed by its Wikidata id**, so names can change without losing progress.
- A card's fingerprint is the facts it depends on; when they change, the card comes back with a note. A fact that
  changed in the data starts the card over; a hand-written card that was fixed keeps its progress and comes back once.
  A note card's id ignores its answers, so fixing an answer keeps progress; rewording the question makes a new card.
- A failing source never wipes data: every sync keeps the last good copy.
- Hand fixes are explicit and explained, and ignored if Wikidata changes the fact they were written for.
- Where the truth is complicated, say so in a note. Prefer official sources (ICS, Census, UNESCO).

## 7. Sound

- Only free sounds (CC0), credited in `public/sfx/LICENSE.txt` and Settings. Separate switches for effects and music
  (music off by default). Soft UI clicks. Alternatives in `public/sfx/lab/` (Settings → Sound lab).

## 8. Look, feel and speed

- **Phone first**; nothing scrolls sideways. Light and dark themes; reduced motion respected.
- Pop-ups stay on screen (no transform on a parent of a fixed element).
- **Lean**: map layers load when needed, shapes cached, coordinates rounded, large extras on demand.
- **Keep it small.** Two verbs: **Study** and **Quiz**. Five tabs (Today, Library, Quiz, Map, Me); new screens go inside
  one. The top bar holds only Settings. One row per deck; a folder with one or two small decks (under 30
  cards) is listed in its parent. A subject's top level is all folds or all rows. Ask "what can this replace?" first.
- **Diagram look** (stacks, flows, org charts, lineage, time scale): soft pastel fills, no heavy outlines, thin arrows, small labels.
- Plain English, short, **American spelling**. Code comments explain the *why* where it isn't obvious.

## 9. How changes are made

New topics start as a proposal (ROADMAP.md).

1. Work on the development branch; never push to `main`.
2. Bump the version in `package.json` and add a line at the top of `src/changelog.ts` (what the person will notice).
   That line is the release record; README.md gets no per-version section.
3. **Check by kind of change:**
   - **Content only** (decks, collections, equations, guides): `npm run audit`. No build, sweep or screenshots.
   - **Code** (`src/`, `scripts/`, styles): type-check and build, `npm run audit`, `npm run sweep` (with
     `npx vite preview` running), and look at only the screens touched, at phone and laptop sizes. Screenshots go in
     the scratchpad, not the repo.
4. Commit, push, open a pull request with a clear description; the owner merges. Every pull request touching the app
   runs `npm run audit` (`.github/workflows/geo-quest-audit.yml`), including the owner's own edits sent from the app
   (branches `edit/…`, titled "Edit card: …").
5. After a big batch, a review pass for mistakes and loose ends.
