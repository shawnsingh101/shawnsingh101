# Note decks

Every `.md` file in this folder (except this README) is a deck. The folder it sits in is the **subject**
(a card in the Library); sub-folders become sections inside it. Add, edit or delete files on GitHub; the next
deploy picks them up. Progress is kept per card, so editing one card doesn't touch the others.

```
decks/
  Economics/
    Macroeconomics basics.md      → Library › Economics › "Macroeconomics basics"
    Trade/
      Tariffs.md                  → Library › Economics › Trade › "Tariffs"
```

## Writing cards

```markdown
---
title: Classic cocktails          (optional: defaults to the file name)
subject: Food & drink             (optional: defaults to the folder)
path: Cocktails / Stirred         (optional: sections inside the subject)
---
A line before the first heading is the deck's description.

## Negroni
related: Italy, Florence
![A Negroni](commons:Negroni served in Vintage Cocktail Glass.jpg)
- Equal parts {{gin}}, {{Campari}} and {{sweet vermouth}}.
- Garnish :: an orange peel
> Stirred over ice, served on the rocks.
- Negroni ::: gin, Campari, sweet vermouth
```

- **`## Heading`**: the topic. It is shown on each card under it.
- **`- … {{answer}} …`**: a fill-in-the-blank card. Several `{{…}}` in one line make one card per blank.
- **`{{Milan|what city?}}`**: a hint for the blank, shown instead of "what?" until you flip. Use one whenever the
  answer could be read more than one way ("a liqueur from ___" could be a place or an ingredient).
- **`{{c1::order}}, {{c1::sensitivity}} … {{c2::adaptation}}`**: blanks with the same number are hidden together on one
  card, the others shown as clues. Use it for a list (about three items per card).
- **Cloze is the default.** Front :: back is for the rare card a sentence can't carry.
- **After a card**, a picture line, `native:`, `species:`, `also in:` or `> note` belong to that card only (all the cards
  made from that line). Under a heading, before any card, a picture / `native:` / `species:` apply to the whole topic.
- **`- [strata: Mesozoic] The periods of the Mesozoic era`**: a geologic time card (the era's place, its periods blank).
- **`- front :: back`**: a question-and-answer card. **`:::`** makes cards in both directions.
- **`> text`**: a note shown after the answer of the card above it.
- **`related: A, B, C`** (anywhere under a heading): links shown on those cards after you flip them. A name the app
  teaches (a country, state, prefecture, World Heritage Site, river…) opens its sheet; anything else opens Wikipedia.
  That place's sheet then lists the card under "Also in your decks". Countries named in a card are linked automatically.
- **`era: Prehistory`** (front matter, History decks): the world era (Prehistory, Ancient, Medieval, Early modern, Modern,
  Contemporary; two allowed). The deck also shows under History › By era, beside the same era from every country.
- **`native: Milan = Milano (Italian); Italy = Italia (Italian)`** (after a card with two blanks): each name goes to its own
  card. A name spelled as in English still gets its line (`native: Filippo Brunelleschi (Italian)`): the speaker says it.
- **`shelves: Music, Philosophy`** (front matter): the deck is also listed in those subjects, under "Music: people" (one set of
  progress). Used by People, where each life is filed once but belongs to several subjects.
- **`depth: deep`** (front matter): a deck of deep cuts; it unlocks once half of the deck beside it is known.
- **Lines before the first heading** are the deck's intro; several lines make a summary page (books you've read).
- **`also in: Philadelphia, New Jersey`** (right after a card): the card also shows in the decks with those titles (one
  set of progress). Used for History by place.
- A number in front of a folder or file name (`2 Ancient China/`, `3 Zhou dynasty.md`) sets the order and is hidden.
- **Code**: a fenced block right after a card is shown with it (a program, then "This prints {{7}}."). A block with
  `{{blanks}}` in it is a card of its own, asked by the plain bullet just above it:
  ````markdown
  - Fill in the loop:
  ```python
  for i in {{range(3)|what goes here?}}:
      print(i)
  ```
  ````
  `` `inline code` `` works in any card, even around a blank: `` `print({{name}})` ``.
- **`- [practice] Read two numbers and print their sum`**: a practice card. You write the program; the app runs it in
  real Python and checks it. Then, in any order, fenced blocks: ```` ```python ```` the starting code, ```` ```input ````
  and ```` ```output ```` one test case (repeat for more), ```` ```check ```` asserts run after the program, and
  ```` ```solution ```` a model answer (the audit makes sure it passes).
- **A lesson**: everything between a `:::lesson` line and a `:::` line is a short read shown before the deck's cards
  (Read the lesson). Markdown: `##` and `###` headings, paragraphs, `-` lists, `>` callouts, `**bold**`, `` `code` ``,
  code blocks, flows, derivations, graphs, and tables (`| a | b |` rows, the first one the header).
- **A flow diagram**: a ```` ```flow ```` block. The first line names the actors (`Browser | Server`); then one step per line,
  `Browser -> Server: what it sends` or `Browser: what it does`. In a lesson you step through it; after a card it's shown
  with the card; with `{{blanks}}` in it, it's a card of its own, asked by the plain bullet above it.
- **Math**: `$…$` inline and `$$…$$` on its own line, in KaTeX (TeX). A blank can sit inside a formula:
  `$Y = A K^{\alpha} N^{ {{1-\alpha}} }$` (keep a space between TeX's own braces and the blank's). An answer may hold one level of
  braces, `{{\frac{1}{2}}}`. A dollar sign followed by a digit and preceded by a space is a price, not math.
- **A derivation**: a ```` ```derive ```` block, one step per line, `formula :: why` (the formula in TeX, no dollar signs),
  optionally titled `# …`. Stepped through in lessons; with a blank, a card.
- **A graph**: a ```` ```graph ```` block: `axes: N | w`, then curves (`ND: down`, `NS: up`, `FE: vertical 0.6`,
  `LRAS: vertical`, `SRAS: horizontal 0.4`, optionally `steep`, `flat` or `at 0.4 0.6`), then the shock's
  `shift ND: right` lines. After a card it's the question, and flipping animates the shift and marks the new equilibrium;
  in a lesson, "Show the shift" does it. `equilibrium: IS, LM` picks the two curves that set it (default: the first two).
- **`eq: IS curve | Y = C + I + G`** (after a card): the card is about that equation. Every such card from every course
  is gathered under Equations, one group per equation, in deck order: derivation, formula, inputs, graph. Every name
  needs a definition in `equations/<Subject>.md`: `## Name`, the TeX formula on the next line, `- symbol | meaning`
  lines, then `example:` with real numbers. Flipping the card shows the symbols and the example.
- **A parts card**: a plain bullet (the question), then a ```` ```parts ```` block, one `cue :: answer` per line (or
  just the answer), 2 to 5 lines; `# any order` as the first line for a set. Recalled one part at a time, graded by
  how many you had.
- **A recipe card**: a plain bullet naming the drink (`- A Negroni`), then a ```` ```recipe ```` block, one
  `role: amount ingredient` per line. Roles for what goes in: `spirit`, `liqueur`, `vermouth`, `wine`, `sour`, `sweet`,
  `bitters`, `juice`, `top`, `cream`, `other`; for how it's served: `method`, `glass`, `garnish`, `rim`. It makes two
  parts cards: *what goes in?*, drawn as a glass filling with one colored block per ingredient (sized by the amount),
  and *how is it served?*. Up to 5 lines each; an ingredient named in the drink's name is left out (the audit checks).
- **A bureau map card**: `- [bureau: EGY] Which regional bureau covers Egypt?` (the country's ISO 3166 alpha-3 code;
  the answer comes from `src/bureaus.ts`).
- **A stack**: a ```` ```stack ```` block draws layered blocks, like the time-scale cards: one row per line,
  `label | name | detail` (`4 | Transport | TCP, UDP, ports`). For layers (the OSI model) and chains (root CA ›
  intermediate › site). Like a flow, it can carry `{{blanks}}` and be a card. Flows and stacks can start with a
  `# Title` line.
- **`objectives: 1.4, 3.3`** and **`chapter: 7`** (front matter): Security+ exam objectives and study-guide chapter
  (`src/secplus.ts`), for the By exam objective and By book chapter lenses.
- **`follows: Russo-Ukrainian war (2022–present); …`** and **`checked: 2026-11-24`** (front matter): a live topic. The
  weekly briefing reads those Wikipedia articles and suggests cards; the deck is also listed under Live topics.
- **`as of: November 2026`** (after a card): true for now, not for good. Shown on the card; the weekly briefing
  suggests an update when it changes.
- **`source: https://…`** (after a card): where the fact comes from; shown as a link on the back. Cards made in the app's
  Builder from Wikipedia get one.
- **`icon: star`** (front matter): the deck's icon in the Library (a name from `src/components/Icons.tsx`); a new
  subject takes the icon of its first deck that has one.
- **Made in the app**: the Library's *New cards or deck* (the Builder) writes these same lines and sends them as a pull
  request, or keeps a deck on one device (`Progress.myDecks`) until it's published.
- **`source: src/srs.ts`** (after a code card): the file the code is quoted from. The card links to it on GitHub, and
  `npm run audit` fails if the file no longer contains that code.
- **`species: Juniperus communis`** (under a heading): the scientific name of a plant or animal, shown in italics after the
  answer.
- **`native: الكعبة (Arabic)`** (under a heading): the name in its own language, shown after the answer with a speaker
  button (the device voice reads it). Several with `;`: `native: 孔子 (Chinese); Kǒngzǐ (Pinyin)`.
- **`![caption](commons:File name.jpg)`**: a picture from Wikimedia Commons for the cards under that heading
  (or a full `https://…` image address).
- **`- What is made from this? [picture] :: gin`**: the heading's picture *is* the question (its caption stays hidden until
  you flip the card).
- A bullet with no `{{…}}` and no `::` is just a note to yourself and makes no card.

A card's identity is its question (heading + text with the answers taken out). Fixing an answer keeps your
progress and brings the card back for review; rewriting the question makes it a new card.
