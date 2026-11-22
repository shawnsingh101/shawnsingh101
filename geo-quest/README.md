# Intelligence Quest

*(formerly GeoQuest; the code still lives in `geo-quest/` and saved progress keeps its old storage key.)*

A spaced-repetition geography trainer with a map: part game, mostly a learning tool.
Learn countries, capitals and flags region by region, in both directions, and watch the
world map fill in as you master it.

## What's in v0.2

- **Oceans & seas**: the 5 oceans plus 73 seas, gulfs, bays and straits in 5 regional groups (find it / name it).
- **China's provinces**: 31 provinces, autonomous regions and municipalities plus Hong Kong and Macau, with province capitals.
- **Quiz mode**: any scope (region, continent, whole world, oceans, China) × any mix of topics, 10/25/50/all cards. Scored, doesn't touch your schedule, 90%+ earns a medal.
- **Keep going**: "Learn 10 more" after a session, and per-skill Practice / Learn more in the skill tree.
- **Map labels**: hover (or tap on a phone) for names and capitals; layer toggles for oceans and China's provinces.
- Line icons instead of emoji; sound now works on phones (audio is unlocked on first tap; plays even with the silent switch on while Sound is enabled).

## Local names (v0.3)

- China's provinces and their capitals show **Chinese characters + Hanyu Pinyin** (山西 Shānxī · 太原 Tàiyuán).
  Characters come from Wikidata; pinyin with tone marks is generated from them at sync time (`pinyin-pro`).
- Countries and capitals show their name in the local language and script after each answer
  (Deutschland, 日本 · 東京, Ελλάδα · Αθήνα, ישראל). Toggle in Settings. Native country names come from the
  `world-countries` dataset; capitals' native names from Wikidata. `nativeLangs` in `data/overrides.json`
  sets which language comes first where it matters (e.g. Hebrew before Arabic for Israel).

## v1.0: Intelligence Quest — United States

- **50 US states** by Census region (Northeast, Midwest, South, West): find it / name it, capitals both ways, state flags.
  Shapes from Natural Earth, facts from Wikidata.
- **US Senate**: a fourth branch per region. Cards are tied to the *seat* (e.g. `S-NY-senior`), so when a seat changes
  hands the card is re-queued with a note. Data from [@unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators)
  (senior/junior rank, party & caucus, terms, leadership roles) and its public-domain official portraits.
  - State → senator (map locks on the state, silhouette until reveal) · photo → senator · senator → tap the state.

## Versions

The home screen shows `v<version> · build <commit> · <date>`, so you can tell when an update is live.
With each update: bump `version` in `package.json` and add a line to `src/changelog.ts`.

## v0.8

- Home screen: a slowly turning globe (countries you've mastered are coloured in), Start and Settings, version line.
- Lock-on target brackets around the place in question, with coordinates and a ✓ / ✗ badge after map answers (toggle in Settings).

## v0.5: rivers & lakes

- **96 rivers** and **91 lakes**, each with find-it / name-it cards, length or area, where it flows, and its countries.
- **Tiers keep it manageable**: the 20 longest rivers / 20 largest lakes (ranked live from Wikidata) come first;
  each continent's rivers and lakes unlock once you know half of that tier. A few small-but-famous lakes
  (Dead Sea, Lake Geneva…) are always included (`_lakesAlways` in `data/overrides.json`).
- **On the map**: rivers are thin lines with a wide invisible tap area; the great rivers always show, smaller ones
  appear as you zoom in. During a question only that group's rivers are drawn.
- Rivers come from Natural Earth 1:10m, mapped to Wikidata via `data/rivers.json` (Natural Earth river segments
  have local names and no ids); lakes are matched by Wikidata id automatically.

## v0.4

- **Map re-centres on what you're studying** (e.g. ~105°E for China), so regions far from Europe sit upright
  instead of slanting at the edge of the world; the Pacific is no longer split. Big shapes (Arctic, Southern Ocean) frame whole.
- **Photo galleries**: the photos at the top of each Wikipedia article (the infobox collage), read live from
  Wikipedia's media list, swipeable. Falls back to the Wikidata image.
- **Pronunciation**: a speaker button on each local-language name. Plays a native-speaker recording from
  Wikidata (P443, mostly Lingua Libre) when there is one, otherwise the device's text-to-speech voice.
- Keyboard hints on the answer buttons (1–4; in quizzes 1 = missed, 2/space = knew it).

## What was in v0.1

- **203 countries**: all 193 UN members, the 2 UN observer states (Vatican City, Palestine),
  and Taiwan, Kosovo, the Sahrawi Republic, Northern Cyprus, Somaliland, Abkhazia,
  South Ossetia and Transnistria. Disputed and observer states carry a short note.
- **7 cards per country.** Each fact is asked both ways.
  - *Countries*: find it on the map (tap) · name the highlighted country
  - *Capitals*: "The capital of Germany is ___" · "Berlin is the capital of ___" · tap the country whose capital is Berlin
  - *Flags*: name the flag · picture the flag
- **Cloze cards, Anki-style.** The blank shows a hint ("what?", "which country?") and fills in
  when revealed. Capital cards show a photo of the city from Wikimedia Commons.
- **FSRS scheduling**, the same algorithm modern Anki uses (`ts-fsrs`), with Again/Hard/Good/Easy
  and interval previews. Map-tap cards grade themselves.
- **Skill tree.** 20 regions × 3 branches. Capitals and Flags for a region unlock when you know
  half its countries.
- **Mastery map.** Countries colour in from *learning* → *known* → *mastered* (next review ≥ 3 weeks out).
- **Atlas.** iPod-style drill-down: World → Continent → Region → Country.
- **Ribbon toggles** for sound, XP & streaks, pictures, skill locks, theme, plus ⚙ for
  new-cards-per-day and backup/restore.
- Works on phone and laptop. You can add it to your phone's home screen like an app.

## Staying up to date

Facts come from **Wikidata** (the structured database behind Wikipedia; CC0).
`scripts/sync-wikidata.mjs` queries it and writes `public/data/countries.json`.

- A nightly GitHub Action (`.github/workflows/geo-quest-sync.yml`) reruns the sync and commits
  any changes. Changed facts are logged to `public/data/changes.json`.
- Every card stores a fingerprint of the facts it was learned from. If a capital or name
  changes, the app re-queues just those cards and shows *"The world changed: …"* on the Today screen.
- `data/overrides.json` holds hand-written wording, e.g. Bolivia's *"both La Paz (seat of
  government) and Sucre (constitutional capital)"*. An override is only used while Wikidata still
  lists exactly the capitals it was written for. If Wikidata changes, the override is
  ignored and the sync prints a warning, so it can't silently go stale.

## Running it

```bash
cd geo-quest
npm install
npm run dev        # http://localhost:5173
npm run sync       # refresh data from Wikidata
npm run build      # static site in dist/
```

Publishing: `.github/workflows/geo-quest-pages.yml` deploys to GitHub Pages on every push to
`main` (one-time setup: Settings → Pages → Source: GitHub Actions).

Progress is stored in your browser. Use ⚙ → *Download backup* / *Restore* to move it between
devices (automatic sync is on the roadmap).

## Architecture

| Piece | Where |
|---|---|
| Data snapshot + change log | `public/data/*.json` (from `scripts/sync-wikidata.mjs`) |
| Hand-written wording, extra states | `data/overrides.json` |
| Card kinds, cloze wording, skill tree | `src/cards.ts` |
| Scheduling, progress, unlocks | `src/srs.ts` |
| Map (D3 + Natural Earth 1:50m, Equal Earth projection) | `src/components/WorldMap.tsx` |
| Ocean & province shapes (run by hand; shapes rarely change) | `scripts/build-shapes.mjs` → `public/data/shapes-*.json` |
| Which seas belong to which group | `data/places.json` |
| Quizzes | `src/quiz.ts`, `src/views/Quiz.tsx` |

Everything is keyed by Wikidata ID (`Q183` = Germany), which leaves room for provinces, cities,
rivers or anything else Wikidata knows about.

## Roadmap ideas

- Heads of state / government (Wikidata P35/P6, which change often, so the change log matters)
- More provinces/states (India, US …), rivers, mountains — each becomes a map layer + label toggle
- **Anki bridge**: import an `.apkg` or read via AnkiConnect, attach cards to places with a tag
  like `geo::CN`, and show them on that country's page and in mixed sessions
- Automatic progress sync between devices (e.g. a private GitHub Gist)
- Offline mode (service worker)
