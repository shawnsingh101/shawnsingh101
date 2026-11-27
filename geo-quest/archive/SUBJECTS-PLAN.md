# Beyond geography: a plan for many subjects

A proposal for growing Intelligence Quest from a geography trainer into the place for everything currently
in Anki (STEM, languages, religion, history, politics, museums, cocktails, Python, SIPA notes…) plus a
"things to know on the spot" dashboard. Nothing here is built yet; it is meant to agree on the shape first.

## 1. What exists today, generalised

Everything is already built on four ideas that don't depend on geography:

| Idea | Today | In general |
|---|---|---|
| **Item** | a place (Wikidata id, name, facts, picture) | any thing worth knowing: a person, a cocktail, a chemical, a word, a bike part |
| **Card** | `${item}:${kind}`, e.g. `Q142:capital` | the same: an item + a way of asking about it |
| **Skill** (deck) | a group × topic, e.g. *Western Europe → Capitals* | a set of items × a set of card kinds |
| **Section tree** | Americas › United States › New Jersey | any outline: STEM › Chemistry › Organic › Functional groups |

Scheduling (FSRS), progress, fingerprints ("this fact changed, re-learn it"), quizzes, the skill tree and
the drill-down are all generic already. The geography-specific parts are the map and a handful of card
kinds that need a map.

## 2. Recommended shape

### Library → Subject → Section tree → Skills

- **Start** opens a **Library**: big cards for each subject (Geography, STEM, Languages, Religion, History,
  Politics & government, Economics, Arts & museums, Food & drink, Hobbies, Grad school, Trivia…), each with
  due counts, like the continents today.
- Inside a subject, the **same skill tree** you have now, nested as deep as needed
  (History › Europe › France › French Revolution).
- **Today** stays global: one queue across all subjects, with the existing "pick decks" filter. That is what
  makes it better than Anki's separate decks.
- **Cross-links instead of duplication**: an item can appear in several trees. Sikhism's Golden Temple is in
  Religion and on the map in Geography; a US president is in History and Politics; a Met painting can show
  where it was made. Items are stored once, and trees point at them.

### Three kinds of content, one engine

1. **Live data** (like geography today): facts pulled from an open source on a schedule, so they stay
   current. Good for: US presidents, constitution articles, Supreme Court justices, elements of the periodic
   table, plants & trees, museum collections (The Met and the Smithsonian publish open-access APIs), highway
   signs (Wikimedia Commons), languages (Wiktionary audio).
2. **Your own notes**: cards you write, in plain files kept in the repo (one Markdown/YAML file per deck,
   cloze sentences like `The {{c1::mitochondrion}} makes ATP`). Good for SIPA notes, books, calculus,
   philosophy, bartending, coffee, Python.
3. **Imported from Anki**: read an exported `.apkg` once (or keep reading via AnkiConnect) so existing
   decks and their review history come across instead of starting over.

Card kinds become pluggable: *cloze*, *front/back*, *picture → name*, *audio → word* (languages), *map tap*
(geography), *order these* (timelines, presidents), *type the answer* (vocab, Python).

### The dashboard is its own tab, with optional cards

The "know it on the spot" list (GDP top 10, Treasury yields, S&P / Dow / Nasdaq / VIX changes, WTI, CPI and
PCE, policy rates, mortgage rates, unemployment, petroleum trade…) is mostly **numbers that change**, so it
belongs on a **Dashboard** page refreshed by the nightly job from free official sources:

| Data | Source (free) |
|---|---|
| Treasury yields, fed funds, SOFR, CPI/PCE, mortgage rates, earnings, unemployment | FRED (St. Louis Fed) API, needs a free key |
| GDP, GDP per capita, population, external debt | World Bank and IMF APIs |
| ECB and other policy rates | ECB Data Portal, BIS |
| Oil prices, US petroleum imports/exports by country | EIA API, needs a free key |
| Top imports/exports by country | UN Comtrade (limited free tier) |
| S&P 500, Dow, Nasdaq, VIX | FRED carries daily closes for most of them |

Then, where it helps, the dashboard **generates flashcards with tolerance**: "10-year Treasury yield? → about
4.3% (as of last night)", graded as right if you're within a band. The card's fingerprint updates as the
number moves, so it comes back when the world changes, the same mechanism as capitals today.

## 3. Build order (suggested)

1. **Library + subject tree** with Geography moved inside it (no change to how geography works).
2. **Notes decks from files**: the cloze / front-back format and one or two real decks (e.g. US presidents,
   cocktails) to prove it.
3. **Anki import** of your existing collection, mapped onto the subject tree.
4. **Dashboard** tab, starting with FRED + World Bank (yields, rates, inflation, GDP, population).
5. Live-data decks one at a time (periodic table, US presidents & constitution, plants, museums,
   languages with audio).

Each step is usable on its own.

## 4. Decisions for you

- **Anki**: replace it (import everything and study here), or keep Anki for some decks and only bring
  some over?
- **Where your own notes live**: plain files in this repo (versioned, editable on GitHub, private if the repo
  is private), or an in-app editor that saves to the backup / a private Gist?
- **Dashboard cards**: dashboard only, or also quiz yourself on the numbers?
- **API keys**: FRED and EIA need free keys (stored as GitHub secrets for the nightly job; never in the app).
- **Privacy**: SIPA notes and personal decks probably shouldn't be on a public site. That points to a
  private repo with a free host that supports private repos, or keeping personal decks out of the published
  build.
