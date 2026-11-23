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
- **`also in: Philadelphia, New Jersey`** (right after a card): the card also shows in the decks with those titles (one
  set of progress). Used for History by place.
- A number in front of a folder or file name (`2 Ancient China/`, `3 Zhou dynasty.md`) sets the order and is hidden.
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
