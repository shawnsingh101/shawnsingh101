# Collections

A collection is a list of things that already have a page on Wikipedia (artworks first; buildings, books or
people later). You only write the list; `npm run sync:collections` looks each entry up on Wikidata and fills in
the facts and the picture, and the app turns them into cards.

```
collections/
  Art/                                    → Library › Art
    Famous works around the world.md      → one deck
    Painting/                             → Library › Art › Painting (add when you want to go deeper)
      Impressionism.md
```

## A list file

```markdown
---
title: Famous works around the world
kind: artwork
---
A line before the first heading describes the deck.

## Europe
- Q12418 Mona Lisa
- The Kiss (Klimt)
```

- One work per line. Write its **English Wikipedia title** (what comes after `/wiki/` in the address, with spaces).
  The sync finds its Wikidata id and writes it in front, so the line becomes `- Q698487 The Kiss (Klimt)`. From
  then on the id is what counts; the words after it are just for you.
- `## Headings` are where the work comes from (Europe, East Asia…). They're shown on the card and keep the list tidy.
- A line starting with `#` inside the list, or any line that isn't a `- ` bullet, is ignored.
- The same work can sit in two lists (the Mona Lisa in "Famous works" and in "Renaissance"): progress is shared.
- If the sync can't find a title it says so and leaves the line alone. Fix the title and run it again.

## Cards for each artwork

| Card | Example |
| --- | --- |
| Picture → name | (the painting) → *Mona Lisa* |
| Who made it? | *Mona Lisa* was painted by → *Leonardo da Vinci* |
| Where is it? | *Mona Lisa* is in → *the Louvre, Paris* (on the map) |

A card is skipped when Wikidata doesn't know the answer (no artist for the Terracotta Army).

## Growing it

Start broad, then split: when a heading gets long, move it to its own file in a sub-folder
(`Art/Painting/Impressionism.md`). Every file is its own deck with its own progress, and quizzes on "Art" cover
everything inside it.
