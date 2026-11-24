# Intelligence Quest: guidelines

The rules this app is built by. They grew out of building it; writing them down keeps every new deck, map layer and
feature consistent. When adding anything, check it against this page. When a new rule comes up, add it here.

## 1. What every card should do

1. **Names in their own language.** Anything with a name shows it in its own language and script as well, after the
   answer, with a speaker button (a native recording from Wikidata when there is one, else the device voice).
   - Countries, capitals, cities, regions, rivers, lakes, ranges, territories, sites, peaks, artworks: from Wikidata.
   - Note decks: a `native: الكعبة (Arabic)` line under the heading.
   - Use the language of where the thing *comes from*, not where it is now (the Mona Lisa is *La Gioconda*, not French).
   - **The speaker says the answer in its own language and sits by the text it says**: beside the green answer when
     the name is written the same way (Leonardo da Vinci, said in Italian), else beside the own-language name shown
     under it (*La Gioconda*). It covers the person a card asks
     for (Brunelleschi in Italian, 葛飾北斎, Фёдор Достоевский), the title (*La Gioconda*), the city (*Milano*), the term
     (*Bauhaus*). Spelled the same as in English: no extra text, just the speaker. A person's name written our way is
     read as the card shows it (not their full birth name). Not for concepts, dates or English names.
   - People's own-language names come from Wikidata (P1559) for collections; in decks, a `native:` line right after the
     card. A line with two blanks names its answer: `native: Milan = Milano (Italian); Italy = Italia (Italian)`.
2. **Chinese gets characters and Hanyu Pinyin with tone marks**, everywhere (`scripts/lib/chinese.mjs`): words written
   apart and capitalised as on maps (*Kūnlún Shānmài*), sound-spelled foreign names kept whole.
   **Japanese gets romaji (Hepburn, with macrons)** the same way (`scripts/lib/japanese.mjs`): Wikidata's own
   romanization (P2125) where it has one, else read from the kanji: 東京 *Tōkyō*, 神奈川沖浪裏 *Kanagawa Oki Nami Ura*.
   In a deck, write the script then its romanization: `native: 夏朝 Xià Cháo (Chinese)`, `native: 富士山 Fujisan (Japanese)`;
   any other non-Latin script can carry a transliteration the same way.
3. **Plants and animals get their scientific name**, in italics after the answer: `species: Juniperus communis` in a
   deck; Wikidata's taxon name (P225) in collections.
4. **A blank says what kind of answer it wants** when "what?" could mislead: `{{Milan|what city?}}`,
   `{{Italy|which country?}}`, `{{juniper berries|which berries?}}`. Built-in cards already say "which country?",
   "which state?", "whom?".
5. **A heading never gives the answer away.** The heading is shown with every card under it, so cards that ask *for* a
   name sit under neutral headings ("Which period?", "Which spirit?", "Name it from the picture"); only cards that start
   *from* the name sit under it.
6. **Every card links to what it's connected to** (Related): the place on the map (country, state, city, museum), the
   person, the region. The reverse shows on the place: "Also in your decks". A place the app teaches opens its sheet;
   anything else opens Wikipedia.
7. **Facts come with a little context** after the answer: dates, size, population, who made it, which division it's in.
8. **Every fact can be asked both ways** when both ways are fair (capital ↔ country, plant ↔ spirit). Skip a direction
   that gives itself away (Hiroshima Prefecture → Hiroshima) or has many answers (the euro → 20 countries).

9. **Cloze first.** Write cards as a sentence with a blank (`The Shang ruled from {{c. 1600 BC|when?}}…`). Use
   front :: back only when a sentence would be forced; never write a card whose back is a paragraph.
10. **One fact per card.** A list is split: either a **grouped cloze** that hides about three items at a time and shows
    the rest as clues (`{{c1::order}}, {{c1::sensitivity}}, {{c1::reproduction}}, {{c2::adaptation}}…`: one card per
    group), or a **structure card** when the shape *is* the fact (time scale: `[strata: Mesozoic]` shows the era with
    its three periods blank).
11. **The local-language name goes with the card whose answer is that name** (the "which dynasty?" card, not the card
    about oracle bones). Put `native:` right after that card. If a topic has no card whose answer is its name, add one
    (under a neutral heading) rather than spreading the name over cards about other things.

12. **People get their face and their own name.** A card whose answer is a person shows their portrait (from their
    Wikipedia article), and when their name comes from another language, that name in its script with romanization and
    the speaker button: Liu Bang → 刘邦 *Liú Bāng*, Confucius → 孔子 *Kǒngzǐ*. Places and things named in the answer get
    the same (长安 *Cháng'ān*, 甲骨文 *jiǎgǔwén*).
12b. **People get where they're really from, with the flag of the time.** "Born in Salzburg, Holy Roman Empire
    (Prince-Archbishopric of Salzburg) · today Austria" under the imperial banner; Vivaldi under the Republic of Venice;
    the flag in use in the birth year (the Russian Empire's changed in 1858). Today's country is always named too. Before
    national flags (ancient figures), or with no flag known, today's flag. From Wikidata (the birthplace's country in
    the birth year); hand fixes in `data/collection-fixes.json` `_origins`.
    **Except Americans**: anyone born in what's now the United States gets today's US flag, whatever the year
    (George Washington, Louis Armstrong): no colonial or early US flags. A member of a Native American nation gets that
    nation's flag (set in `_origins`).
13. **Dates are rarely the answer.** Keep the date in the sentence and blank the event, person or place: "In 1917 the
    United States entered {{World War I}}", not "…entered World War I in {{1917}}". A date is the answer only when the
    date itself is the landmark (July 4, 1776; the Constitution in 1787; the span of a dynasty or a war as one card;
    a president's years when that's the question asked).
14. **Cards teach facts about the world, not analogies.** "If Earth's history were one day, the dinosaurs die at 11:40 pm"
    is a picture to look at (the chart's clock), not something to memorize.

## 2. Pictures

- **The thing itself is shown whole, never cropped**: artworks (on a dark "gallery wall"), banknotes, plants, cocktails,
  road signs, any single photo. A place's gallery of photos keeps the wide strip, which suits landscapes.
- **A picture is always of the card's own subject.** Its free picture on Commons first. When Commons can't have one (a
  building or painting still under copyright, a book cover), the English Wikipedia article's **lead image**, which
  Wikipedia shows under fair use: hot-linked from Wikipedia, never copied into the repo (owner's decision, v1.32). Never
  borrow from the article's gallery for a single thing: those are other works.
- **Tap any picture to see it full screen.**
- **No scrolling to see a card.** On a laptop a card without a map shows its picture framed beside it (up to ~400 px
  wide), the two centered together; on a phone the picture stays above the text, at most a third of the screen tall.
- **Never enlarge a picture past its own pixels** (no blur), on the card or full screen. Full screen fits the whole
  picture on screen; nothing scrolls.
- A picture can be the question (`- What is made from this? [picture] :: gin`); its caption stays hidden until the card
  is flipped. A fair-use lead image may be the question too (owner's decision, v1.32).
- **Give a card a picture when the picture shows what the card is about**: a person, a place, an object, an organism, a
  structure, a map of an empire, a diagram of a process. Skip it for bare dates, definitions and abstract ideas.
- **The picture belongs to the card, not just the topic**: a picture line right after a card is that card's own (the
  **Every card gets its own picture of its own subject**: no topic picture repeated across all its cards (the oracle
  bone belongs on the writing card, Liu Bang's portrait on the founder card, a map of the empire on the "which dynasty?"
  card). A heading picture is only for a topic whose every card is about that one thing (a cocktail, a plant).
  oracle bone on the card about Shang writing); a picture under the heading is the topic's default.
- **Where pictures come from**: places, people, history and art from Wikimedia Commons (via Wikidata P18); **science
  from the textbook's own figures** (OpenStax, CC BY 4.0, credited in the caption), which explain better than photos;
  Interstate shields from P14 or `I-N.svg`.
- **Recordings**: only free ones from Wikimedia Commons (the music is old, but each recording has its own rights). Play
  the MP3 copy first (iPhones can't play Ogg). A clip is 30 seconds and starts at the moment people know (`@seconds`), not at the first bar; the reveal names the
  piece and part and shows the whole work. Anyone can move a clip's start while it plays (Start here).

## 3. Maps

- **One level of regions at a time** (Punjab's districts *or* India's states, never both on top of each other), with a
  bold outline of the country or state they belong to.
- **Re-center on the place** when it's far from the middle of the map (past ~70°), so nothing is drawn tilted at the edge.
- **Country and state names as a toggle** (the tag button by the zoom buttons) on cards where they can't give the
  answer away: rivers, lakes, Interstates, ranges, peaks, World Heritage, seas. Never on cards that ask for a country or
  state.
- **Peek (the answer map)**: any map card can open a full map of every answer in its section (names, capitals pinned,
  roads and rivers labelled). The session pauses while it's open: no answering until you go back.
- **Map names sit inside their own place** and name only what the deck is about: US states on a US deck, countries
  otherwise, never both.
- "Reveal" cards start wider than the answer so the map doesn't give it away, then fly to it when flipped.
- Line features (rivers, Interstates) are easy to tap: a wide invisible line under the visible one.

## 4. Where things go (the hierarchy)

- **Drill down, don't pile up.** A subject has sections; a section can hold sections: Americas › United States ›
  New Jersey; Rivers › Rivers of the Americas › Rivers of the United States; Food & drink › Cocktails › Ingredients.
  Set the parent (`SECTION_PARENT`, a deck's `path:`, a collection's folder).
- **Section names are unique.** A folder named like an existing section ("Americas") gets its own name; prefer a clear
  one ("Art of the Americas").
- **Art**: the starter list, *By period* (Wikipedia's History of art chapters), *Where to see it* (made from the facts).
- **Architecture** holds buildings themselves (a museum's building and history too); **Art** holds what's inside.
  A *tour* (`decks/Architecture/2 Tours/`) is one deck per building, written as a walk: its story, then room by room,
  pointing on to its works in Art. Government buildings' tours will also show under US government.
- **Ids are unique across the app.** A collection entry that is already something else (a World Heritage site) gets
  its own id automatically; never give two places the same id.
- **Depth**: a list or deck with `depth: deep` holds the deep cuts; it unlocks once half of the core one beside it is
  known. Start every topic with its core.
- **Shelves come from tags** (`src/tags.ts`): a new label is added there once, not per item.
- Something that belongs in two places is filed once and *also shown* in the other (`alsoInSections`, `alsoIn`), with one
  set of progress.
- **Lenses, not copies.** A thing is filed once, in its natural place (History of China › Prehistory), and tagged with
  facets (`era: Prehistory`); the app builds the cross-cutting views from the tags (History › By era › All prehistory).
  Tag every history deck with its world era. New facets (theme, region, Books' genre) work the same way.
- **Every section can be studied whole** (Study), including everything nested in it.
- **Search is a view, not a deck.** Anything can be found and studied from the Library search; pinned searches save
  only the words. Make cards findable: put the real names (and native names) in the card or its facts.
- **History can be studied by time or by place**: decks follow the period chapters of the source (Wikipedia's "History of
  …" article), and a card tagged `also in: Philadelphia` also shows in the place's deck (History › … › By place).
- **Textbooks follow the book**: subject › unit › chapter, the deck named after the chapter, with the source credited.
- **Geography is split**: countries and their regions (continents, territories, World Heritage) vs **Physical
  geography** (mountains, rivers, lakes, oceans & seas, deserts).
- Big sets start with the essentials and unlock the rest (the 20 longest rivers, then each continent's; the main
  Interstate corridors, then the others).
- The **Library** tab always opens on the subject cards.
- **Me** measures every subject the same two ways (covered, memory), so a new subject shows up there by itself.

## 4b. Books you've read

- **About 20 cards a book**: the author (from the *My reading* list), the big idea (2–3), and the facts that outlast the
  book (10–15). Deep cuts only when asked, in a `depth: deep` deck beside it.
- **No repeats across books**: search first; a fact another book already taught gets `also in:` the new book's lens,
  not a second card.
- **The summary page** is the deck's intro (thesis, structure, key terms, key people): read any time, never reviewed.
- **Cards feed the subject's lenses** (`also in: History of AI`, `How AI works`, `The AI industry`, `AI debates`), so
  every book on a topic builds one history, one picture of the technology, the industry and the debates.
- The owner has read many AI books: later AI books should lean past the basics.
- Read the PDF as text (`pdftotext`), never commit the book; cards are in our own words with very short quotes.

## 4c. Life (animals and plants)

- **The tree of life organizes; it isn't memorized** (`src/tree.ts`). The real tree has far more branches than a card can
  hold, so there are no "name the branches" cards. It files Life's sections (Bacteria · Archaea · Eukaryotes › Animals ›
  Mammals…), every group of species names its branch, and book decks about an animal feed it too.
- **One question, a rich answer.** An animal's card is its photo → its name. The back shows the scientific name (Latin
  speaker), its lineage as blocks from the domain down to genus and species (`Lineage`), where it lives with a range map.
  Never ask what needs bones or teeth to see; look-alike tips belong on the answer ("not to be confused with…"), not in
  a deck of their own.
- **Dinosaurs are asked when, not which.** They're told apart by bones, so no photo → name cards (book decks can ask
  more). Their card shows the life restoration and a fossil, gives the name and species, and asks the period, epoch and
  age; the back draws the time-scale blocks (eon › era › period › epoch › age). **When it lived follows its Wikipedia
  article** (the infobox's fossil range, read by the nightly sync), so a redating reaches the cards; the list line's range
  (`| Late Cretaceous (Maastrichtian)`) is only the fallback, and `fossilRange` in `collection-fixes.json` overrides both.
  They also show in Earth history (one deck, so its name never gives the period away).
- Not a children's set: no cow-dog-tiger basics.

## 4d. Programming

- **Two decks, linked.** *Python* follows OpenStax *Introduction to Python Programming* chapter by chapter: universal
  ideas, taught in Python. *Under the hood* teaches how this app works, from its real files. A card in one can be
  `also in:` the matching deck of the other (one card, two places).
- **Code on cards** goes in a fenced block, shown in a dark panel in every theme. Kinds of card: what does this print,
  fill in the blank in the code, which error, and plain concept cards. Easy first; harder ones in a `depth: deep` deck
  beside each chapter.
- **Every "prints" answer is run in Python before it ships.** Never write an output from memory.
- **Quoted code must be real.** An Under the hood card quoting the app names its file (`source: src/srs.ts`); the audit
  fails when that code no longer matches, so the card is fixed when the code changes. Don't quote lines that change
  every release (the version number).
- Flashcards teach reading code; **practice cards** teach writing it: `[practice]` with starting code, test cases
  (input lines → expected output), optional asserts and a model solution. Python runs in the browser (Pyodide, served
  from the app's own `pyodide/` folder, never a CDN) in a worker, stopped after 5 seconds. The audit runs every solution
  with the same runner (`public/practice-runner.py`) and fails if it doesn't pass, or if the starting code already does.
- Practice problems use only what the chapter (and the ones before it) taught, two or more test cases where input is
  read, so hard-coding an answer can't pass. They're worked in Study and kept out of timed quizzes.

## 5. Content files (how to add things)

| What | Where | Format |
| --- | --- | --- |
| Note decks (your own cards) | `decks/<Subject>/…/<Deck>.md` | see `decks/README.md` |
| History, science, textbooks | `decks/History/…`, `decks/Science/<Subject>/<Unit>/<Chapter>.md` | number prefixes set the order; follow the source's own chapters (Wikipedia article, textbook) |
| US presidents | `data/presidents.json` → `scripts/sync-presidents.mjs` | one line per presidency |
| Collections (Wikipedia things: art…) | `collections/<Subject>/…/<List>.md` | see `collections/README.md` |
| Regions inside a country | `data/subdivisions.json` | sources: Natural Earth, US Census, OpenStreetMap |
| Hand fixes | `data/overrides.json`, `data/collection-fixes.json`, `data/interstates.json` | each has a `_readme` |
| Built-in data with its own view | `src/*.ts` (e.g. `src/geotime.ts`) | the view and the cards read the same data |

Deck syntax, quickly: `## Heading` · `- cloze with {{answer|hint}}` · `- front :: back` (`:::` both ways) ·
`> note after the answer` · `related: A, B` · `native: name romanization (Language)` · `species: Genus species` · `also in: Deck title` ·
`![caption](commons:File.jpg)` · `- question [picture] :: answer`.

## 6. Data

- **Everything is keyed by its Wikidata id** (Q183 = Germany), so names can change without losing progress.
- **A card's fingerprint** is the facts it depends on: when Wikidata changes them, the card comes back for review with a note.
- **A failing source never wipes data**: every sync keeps the last good copy (election results, companies, trade,
  pictures, museum articles).
- **Hand fixes are explicit and explained**, never silent: an override says why, and is ignored if Wikidata changes
  the fact it was written for.
- Where the truth is complicated, say so in a note (two capitals; a print with many copies has no single museum).
- Prefer official sources: ICS for geologic time, the Census for US borders, UNESCO for World Heritage.

## 7. Sound

- Only free-to-use sounds (CC0, e.g. Kenney), credited in `public/sfx/LICENSE.txt` and Settings.
- **Separate switches** for sound effects and music; music is off until you turn it on.
- UI clicks are soft and low (a gentle filter); card sounds feel like real cards.
- Alternatives live in `public/sfx/lab/`, chosen in Settings → Sound lab, so the person using the app picks by ear.
- The start-up chime and the music are synthesized in the browser (no files).

## 8. Look, feel and speed

- **Phone first**: every screen is checked at phone and laptop sizes; nothing scrolls sideways.
- Light and dark themes; respects reduced motion.
- Pop-ups and sheets stay on screen (don't leave a transform on a parent of a fixed element).
- **Lean**: map layers load only when needed; projected shapes are cached; coordinates rounded (~500 m for regions);
  large extras (state borders, sound lab files) load on demand.
- **Keep it small.** Two verbs for learning: **Study** and **Quiz**. Five tabs (Today, Library, Quiz, Map, Me); a new
  screen goes inside one of them, not beside them. The top bar holds only what's toggled often (sound) and Settings;
  set-once switches live in Settings. One row per deck; a folder with one or two small decks (under 30 cards) is listed in its parent and gets its own fold
  back by itself as it grows. A subject's top level is its outline: all folds or all rows, never a mix. Ask "what can this replace?"
  before adding a button.
- Writing: plain English, short, no jargon in the app. **American spelling** (color, center, labor, flavor, modeled). Explain the *why* in code comments where it isn't obvious.

## 9. How changes are made

New topics start as a proposal and a place in the queue: see [ROADMAP.md](ROADMAP.md).

1. Work on the development branch; never push to `main` directly.
2. Bump the version in `package.json` and add a line at the top of `src/changelog.ts` (what the person will notice).
3. Add a section to `README.md` for the version.
4. Type-check and build; run `npm run audit` (decks) and `npm run sweep` (browser, with `npx vite preview` running);
   test the screens touched at phone and laptop sizes.
5. Commit, push, open a pull request with a clear description; the owner merges.
6. After a big batch, do a review pass for mistakes and loose ends before calling it done.
