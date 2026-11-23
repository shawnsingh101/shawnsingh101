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
- **`- front :: back`**: a question-and-answer card. **`:::`** makes cards in both directions.
- **`> text`**: a note shown after the answer of the card above it.
- **`related: A, B, C`** (anywhere under a heading): links shown on those cards after you flip them. A name the app
  teaches (a country, state, prefecture, World Heritage Site, river…) opens its sheet; anything else opens Wikipedia.
  That place's sheet then lists the card under "Also in your decks". Countries named in a card are linked automatically.
- **`native: الكعبة (Arabic)`** (under a heading): the name in its own language, shown after the answer with a speaker
  button (the device voice reads it). Several with `;`: `native: 孔子 (Chinese); Kǒngzǐ (Pinyin)`.
- **`![caption](commons:File name.jpg)`**: a picture from Wikimedia Commons for the cards under that heading
  (or a full `https://…` image address).
- A bullet with no `{{…}}` and no `::` is just a note to yourself and makes no card.

A card's identity is its question (heading + text with the answers taken out). Fixing an answer keeps your
progress and brings the card back for review; rewriting the question makes it a new card.
