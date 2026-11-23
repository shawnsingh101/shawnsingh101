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

## v1.15: History, Science, deserts, romaji

- **Romaji for Japanese** (`scripts/lib/japanese.mjs`, kuroshiro, Hepburn with macrons; Wikidata P2125 first), shown
  under the kanji like pinyin: 東京 *Tōkyō*, 神奈川沖浪裏 *Kanagawa Oki Nami Ura*, 富士山 *Fujisan*. Decks write
  `native: 夏朝 Xià Cháo (Chinese)` (script, then romanization).
- **Physical geography**: Mountains, Rivers, Lakes, Oceans & Seas and the new **Deserts** sit together, apart from
  countries and their regions. Deserts (`scripts/build-deserts.mjs`): 44 from Natural Earth with Wikidata facts (area,
  countries, local names); the 18 best known unlock the rest; a Map-view toggle too.
- **History** (a new subject):
  - *Presidents* (History of the United States › Presidents): all 45 people / 47 presidencies, from
    `data/presidents.json` (hand-checked parties and vice presidents) + portraits (`scripts/sync-presidents.mjs`).
    Cards: portrait → name, number → name, name → number, years, party; vice presidents on the back. Four eras.
  - *History of China*, following Wikipedia's chapters: Prehistory, Ancient China, Imperial China (Early, Six Dynasties,
    Mid, Late), Modern period; one deck per dynasty or period (dates, founder, capital, what it's known for, 汉字 +
    pinyin, what came before).
  - *History of the United States*: one deck per Wikipedia chapter, plus **By place** (New York › New York City,
    Pennsylvania › Philadelphia, New Jersey). `also in: Philadelphia` after a card puts it in that deck too.
- **Science**: Biology from OpenStax Biology 2e (CC BY 4.0), unit by unit, chapter by chapter; chapter 1 started;
  the full outline in `decks/Science/README.md`.
- Decks: a number in front of a folder or file name sets the order and is hidden ("2 Ancient China").

## v1.14.2: a classier picture size

- On a laptop the picture beside a card is framed at a modest size (up to 400 px wide, ~440 px tall), with the picture
  and the card centred together, and it's never stretched past its own pixels.
- Full screen shows the whole picture on screen at once (no scrolling, the page behind stays still), up to its own size.

## v1.14.1: pictures beside the card

- Laptop, cards without a map: the picture fills the left half (where the map goes on map cards), the card sits on the
  right, so nothing needs scrolling; before you flip, a placeholder holds the space. Phones keep the picture above the
  text, at most a third of the screen tall (tap it for full screen).
- A card taller than the screen scrolls from its top instead of being cut off (flex centring no longer hides it).
- The settings panel scrolls inside itself when it's taller than the screen.

## v1.14: answer map, map names, guidelines

- **GUIDELINES.md**: the rules the app is built by (local names, pinyin, scientific names, answer hints, no spoilers in
  headings, Related links, pictures, maps, hierarchy, data, sound, speed, release steps), with `CLAUDE.md` pointing to it.
- **Peek**: a button on map questions opens the answer map: every place, road or river in the section named on the map
  (capitals pinned on capital cards). The session pauses until you go back.
- **Country & state names toggle** (tag button by the zoom buttons) on river, lake, Interstate, range, peak, World
  Heritage and sea cards: names for bearings, biggest first, without overlaps. Never offered where a name is the answer.
- **Interstate sign on the card** (once flipped when the number is the answer).
- **Scientific names** (`species:` in decks, P225 in collections) in italics after the answer; the ingredient decks
  have them for every plant.
- **Answer hints**: `{{Milan|what city?}}` says what kind of answer a blank wants; added across the example decks.
- **Photos shown whole** when they're one picture of the thing (cocktails, plants, banknotes); place galleries keep the
  wide strip. Tap for full screen.
- **Sound lab** (Settings): 56 CC0 alternatives (Kenney) to audition and pick for each kind of sound
  (`public/sfx/lab/`, loaded only when played). Clicks are now softer and lower; the old back sound is gone.
- **Library** in the top bar always opens the Library's front page.
- Fix: pop-ups (skill sheets) opened at the top of the page instead of on screen after the start animation.
- Fix: `related:`/`native:`/`species:` lines no longer leak between two headings with the same name.

## v1.13: sound, Interstates, Earth history

- **Sound effects** from Kenney's free (CC0) *Interface Sounds* and *Casino Audio* packs (`public/sfx/`, 68 KB, credits
  in `public/sfx/LICENSE.txt`): a shuffle when a session starts, a card slide on flip, a card landing for the next one,
  soft clicks on buttons and tabs, chimes for right / wrong / medals. Played through Web Audio (low latency, works with
  the iPhone silent switch handling already in place).
- **Start-up chime** (a deep swell opening into a bright chord and a run of bells) and **background music** (slow,
  quiet generative chords with the odd bell; never the same twice), both synthesized in the browser: no files. Two
  toggles in the ribbon: *Sound effects* and *Music* (off by default).
- **Smoother start**: the globe swells and fades as the title lifts away, then the app rises into place.
- **Interstate Highways** (Americas › United States › Interstate Highways): the 58 primary Interstates in Natural Earth's
  roads (`scripts/build-interstates.mjs` → `shapes-road.json`, `roads.json`), facts from Wikidata, states worked out from
  the map (hand fixes in `data/interstates.json`). *Main corridors* (numbers ending in 0 or 5) unlock *More
  Interstates*. Cards: find it on the map, name the highlighted one, and name the shield. A Map-view toggle too.
- **Earth history**: the geologic time scale (ICS 2023 dates and official colours, `src/geotime.ts`) as layers of rock
  you can tap, *readable* or *true to scale*, with a 24-hour "Earth's day" clock and the period mnemonic. Two decks
  (122 cards) are built from the same data: when each began, what it's known for, which era, what comes next.
- **Cocktail ingredients** (Food & drink › Cocktails › Ingredients): *Spirits: from plant to glass* (gin ← juniper,
  tequila ← agave, rum ← sugarcane, bourbon ← corn, Scotch ← barley, baijiu ← sorghum…) and *Liqueurs & bitters*
  (Campari, amaretto ← apricot kernels, maraschino ← Marasca cherries, Angostura ← gentian…), with photos of the plants
  and links to where each comes from. New deck syntax: `- What is made from this? [picture] :: gin` shows the heading's
  picture as the question.
- Note decks take a `native:` line (`native: الكعبة (Arabic)`): the religion and philosophy examples now show
  Arabic, Gurmukhi, Hebrew, Italian, Hindi and Greek with the speaker button.
- Maps re-centre on anything more than ~70° from the middle (Japan was drawn tilted at the edge on World Heritage cards).

## v1.12: names in their own language, pinyin everywhere

The rule: anything you learn shows its name in its own language too (with the speaker button: a recording where Wikidata
has one, else the device voice), and anything Chinese shows characters with Hanyu Pinyin.
- **Artworks**: the name in the language of where the work comes from (country of origin, else the artist's country,
  else where it stands; never the museum's): *La Gioconda*, *De Nachtwacht*, *Der Kuss*, *神奈川沖浪裏*, *清明上河圖
  Qīngmíng Shànghé Tú*. Set by hand with `native` in `data/collection-fixes.json` (`[]` for none).
- **Mountain ranges** (the languages of the countries they cross: Alpi, Alpes…; 天山山脉 Tiānshān Shānmài) and
  **territories** (their own official languages: Kalaallit Nunaat, Føroyar, Kòrsou, Guåhan): `scripts/lib/local-names.mjs`,
  run by the nightly sync (or on its own to patch the data files).
- **Pinyin for every Chinese name**, not just China's provinces: China, Taiwan, Singapore and their capitals, World
  Heritage Sites, peaks, rivers, lakes, ranges, artworks. `scripts/lib/chinese.mjs` writes words apart and capitalised like
  map names (*Zhōnghuá Rénmín Gònghéguó*, *Kūnlún Shānmài*, *Zhūmùlǎngmǎ Fēng*), keeps sound-spelled foreign names whole
  (*Bùlāmǎpǔtèlā Hé*), and reads tones from the whole name. `node scripts/lib/chinese.mjs --refresh public/data/*.json`
  re-spells existing data after a rule change.
- A place with a Chinese name *and* others (a river through China and Laos) now shows both.

## v1.11.1: whole pictures, full screen, museum links

- Artwork pictures are shown whole (`object-fit: contain` on a dark backdrop), never cropped to a strip.
- Tap any picture (artworks, places, cocktails…) to open it full screen; tap or Esc to close. The copy already on screen
  shows at once, and a sharper 1600 px copy replaces it when it has loaded.
- Related on art cards: the museum (its Wikipedia article, `museumWiki` from the sync), the city, the country, the artist.

## v1.11: Art, photos on note cards, faster maps

- **Collections** (`collections/`, see its README): lists of Wikipedia things that become cards. The folder is the
  subject (`Art/` → Library › Art), sub-folders are sections, each file is a deck, `## headings` say where a work comes
  from. Write a work's English Wikipedia title; `npm run sync:collections` (`scripts/sync-collections.mjs`, also nightly)
  writes its Wikidata id into the line and pulls the name, picture, artist or culture, date, museum, city, country and
  position into `public/data/collections.json`. Hand fixes live in `data/collection-fixes.json`.
- **Art › Famous works around the world**: 43 works from Europe, the Middle East, Africa, South & East Asia, the Americas
  and Oceania. Cards: picture → name (only when Commons has a free image), who made it, where to see it (country on the
  map, pin on the museum). A work in two lists keeps one set of progress.
- Wikipedia photos on the example decks (cocktails, sacred places, Greek thinkers).
- **Faster maps**: projected shapes are cached by map centre, the map starts centred on the first question (no draw-twice),
  and world state borders are drawn just after the map appears. Opening a New Jersey quiz now does about half the drawing work (≈0.5 s of busy time instead of ≈1 s on a laptop).

## v1.10: Punjab's districts, local scripts for regions

- **Punjab (India) › 23 districts in 5 divisions** (Jalandhar, Patiala, Firozpur, Faridkot, Rupnagar), nested under
  India. Borders from **OpenStreetMap** (new `osm` source in `data/subdivisions.json`: Overpass, by bounding box and
  admin level; `groups[].ids` assigns districts to divisions; `OSM_FILE` reuses a saved response). Ways are stitched
  into rings and rounded to ~500 m. A merged `<parent>-outline` shape gives a bold outline that matches the districts.
  Headquarters cards appear where the town's name differs from the district's (Mohali, Nawanshahr, Tarn Taran Sahib).
- A quiz draws one level of regions at a time (Punjab's districts *or* India's states), so they never cover each other.
- **Local names for regions and their capitals** in each country's script (`nativeLangs`): Gurmukhi for Punjab, kanji for
  Japan, Uzbek, Hindi for India's states; recordings where Wikidata has them, else the device voice.
- `capitalKeep` override (Karnataka → Bengaluru, Maharashtra → Mumbai) with notes; notes for real two-capital states.
- Empty skills / question types are hidden (Punjab divisions whose headquarters all share the district's name).

## v1.9: river drill-down, states and sources

- **Rivers form a tree** like places: Rivers › Rivers of Europe / Asia & Oceania / Africa / the Americas, and
  Rivers of the Americas › Rivers of the United States (also listed under United States via `alsoInSections`).
  A level's "All" quiz includes the decks nested inside it that teach the same kind of thing (rivers within rivers),
  so "Rivers of the Americas" covers the US rivers, while "Americas" (countries) doesn't pull in US states.
- **US rivers list their states** in order along the river, worked out from the map (river line × state outlines,
  checking a little to each side so border rivers count for both banks); other countries reached are added after.
  States are Related chips. A river's `bbox` in `data/rivers.json` now trims its line, dropping stray same-named segments.
- **Every river shows where it starts** (Wikidata P885): "from Lake Itasca to the Gulf of Mexico".

## v1.8: more regions & rivers, population, local names, more dashboard

- **India** (36 states & union territories in 6 regional groups) and **Uzbekistan** (14 regions) in `data/subdivisions.json`.
  Overrides fill missing capitals (New Delhi for Delhi).
- **Rivers of the United States** (`r-us`, inside United States): 35 more rivers from Natural Earth 1:10m, listed in
  `data/rivers.json` with `"deck": "r-us"` and a bounding box so same-named rivers elsewhere aren't picked up. Big
  rivers that touch the US (Mississippi, Columbia, Hudson…) also appear there (`alsoIn`), sharing one set of progress.
  (Texas's Trinity and Virginia's James aren't in Natural Earth, so they're left out.)
- **Population** (Wikidata P1082, latest) on country, state, province, region and territory cards and sheets.
- **Local names** (and pronunciation: Wikidata recordings, else the device voice) for largest cities, peaks and World
  Heritage Sites: labels in the country's own languages.
- **Dashboard**: total debt by sector (government / households / companies, BIS total credit) as stacked bars next to
  external debt; population (world + 10 most populous, with growth); inflation (BIS) and unemployment (OECD via FRED,
  ILO annual where no monthly series) for the 10 largest economies; most valuable listed companies (Wikipedia's
  quarterly list, global or US-only, with quarter-on-quarter change).
- Robustness: election results, company list and trade figures fall back to last night's when a source is rate-limited.

## v1.7: charts, more data, connections

- **Dashboard charts** (`src/components/Charts.tsx`, plain SVG): line charts with series chips and 1M/3M/1Y/5Y ranges
  (markets indexed to the start of the range, so the S&P 500 and the Dow share one axis), step charts for policy rates,
  bar charts with a metric toggle for the 10 largest economies, trade and petroleum partners. Hover/touch for values;
  colours from a palette checked for colour-blind separation in light and dark mode; the tables stay under each chart.
- **More sources** in `scripts/sync-dashboard.mjs`: BIS central bank policy rates (10 central banks), EIA weekly US
  petroleum imports/exports/net imports and monthly top-5 partners (`EIA_KEY` secret), World Bank Quarterly External
  Debt Statistics (gross external debt and % of GDP), UN Comtrade public preview (each economy's top 5 exports & imports
  by HS chapter and top petroleum partners; last night's figures are kept when the preview rate-limits). `FRED_KEY` is
  used when present, otherwise FRED's public CSV.
- **Related links** (`src/related.ts`): after a card is flipped, chips link it to other things you're learning — a site
  to its state and country, a peak to its range, a leader to their country, a note card to its `related:` names and any
  country it mentions. Places open in the sheet (with a back step); others open Wikipedia. A place's sheet lists the
  note cards that point at it ("Also in your decks").
- **World Heritage Sites and peaks know their state / province** (Wikidata P131 → first-level division): "Ajanta Caves
  is in Maharashtra, India".
- Example decks: Religion › Sacred places, Philosophy › Ancient Greek thinkers.

## v1.6: Library, note decks, Dashboard

- **Library** (the old Skills tab): one card per subject. Geography is built in; every other subject comes from
  **note decks**: Markdown files in [`decks/`](decks/README.md) (folder = subject, sub-folders = sections, file = deck).
  Cards are cloze (`{{answer}}`) or `front :: back` (`:::` both ways), with optional pictures and notes. They schedule,
  quiz and review exactly like geography cards, and Today mixes everything. Cards from the same topic are spread out.
- **Dashboard** (view only): `scripts/sync-dashboard.mjs` writes `public/data/dashboard.json` nightly. Markets (S&P 500,
  Dow, Nasdaq, VIX), WTI/Brent, Treasury yields 1M–30Y, fed funds, SOFR, ECB rates, mortgages (1D/1M/3M/YTD/1Y/5Y
  changes), CPI/PCE headline & core y/y, unemployment and hourly earnings from FRED's public CSV (no key); the 10 largest
  economies' GDP, GDP per person, population and unemployment from the World Bank. Petroleum trade waits for an
  `EIA_API_KEY` repository secret.

## v1.5: drill-down and regions inside countries

- **Sections form a tree** (`SECTION_PARENT` in `src/cards.ts`): United States sits inside Americas, China and Japan
  inside Asia, New Jersey inside United States. The skill tree, quiz (Area step) and atlas all drill down through it.
- **Regions inside a country** are one generic layer (`sub`), configured in `data/subdivisions.json`:
  - `ne-admin1`: any country's states/provinces from Natural Earth 1:10m (Japan's 47 prefectures, grouped by region);
  - `us-counties`: US Census counties via us-atlas, matched to Wikidata by FIPS code (New Jersey's 21 counties).
  To add one (Ukraine's oblasts, Russia's regions, another state's counties), add an entry, run
  `NE_DIR=… US_ATLAS=… node scripts/build-shapes.mjs` and `npm run sync`. Cards: find it / name it and
  capitals ("county seat" for counties); capital cards that give themselves away (Hiroshima → Hiroshima) are skipped.
  Overrides can fill a missing capital (`"capital": {…}`) or add a `capitalNote`.
- **Quiz by country**: World Heritage, mountains, rivers and lakes can be narrowed to one country (e.g. Asia → China).
- Territory cards show "Part of France" (and the territory's status) once flipped.
- Plan for subjects beyond geography: [`docs/SUBJECTS-PLAN.md`](docs/SUBJECTS-PLAN.md).

## v1.4.2: review sweep

- Currency pictures can be files kept on English Wikipedia itself (most banknotes are copyrighted, so they aren't on
  Commons). These are stored as `en:<file>`; every candidate is checked to exist, banknotes first, and a failed lookup
  keeps the last good picture.
- Cards add "the" where English needs it (the Netherlands, the United States) and "are" for island groups.
- World leaders: titles no longer read "President of the Czechia"; rows naming a ruling body ("People's Party") ask for
  the country's leader; Charles III and other multi-realm monarchs have no "tap the country" card.
- Sites in more than three countries skip "which country?"; the same site under two Wikidata items is listed once.
- Senator portraits that don't exist yet are skipped (the Wikipedia photo is used); party changes no longer reset cards.
- Multi-capital lists have a fixed order (no false "world changed" notes); the nightly job now saves the pronunciation
  cache; PNG home-screen icons for iPhone.

## v1.4: highest points, borders, money

- **Highest point of each country** (Wikidata P610, best-ranked elevation in metres): "The highest point of Nepal is…" and
  back again (only when that peak belongs to one country). `highestNote` overrides explain odd cases (Australia → Heard Island).
- **State / province borders** appear as thin dashed lines once you zoom in (Natural Earth admin-1, only the lines inside
  a country; `shapes-admin1.json`, ~190 KB, fetched on first zoom). Country borders are drawn a little heavier.
- **Currency pictures** are the money itself: the currency article's infobox image, banknotes before coins.
- Mountain cards: no more photo → name (too hard); "Kanchenjunga is in Nepal" instead of "here".
- People photos fall back to the Wikipedia article's lead image if the official portrait is missing.
- Map labels nudge apart when they would overlap (Massachusetts / Boston); the Great Lakes are drawn over US states.
- Data fixes: "A, B and C" capital lists; a place appears in one layer only (Vatican City is a country, not also a site);
  duplicate range names get their country ("Sierra Nevada (Spain)"); stray far-off countries dropped from ranges.

## v1.3: mountains

- **Peaks** (165): Natural Earth's notable peaks plus a short list of famous extras (`data/peaks-extra.json`, by Wikipedia
  article), ranked by Wikipedia coverage: 40 famous peaks, then 25 per continent. Height, range and countries from Wikidata.
  Triangle markers; find it, which country.
- **Ranges** (70): Natural Earth range outlines with Wikidata ids — 24 great ranges, then more. Shaded areas; find it / name it.

## v1.2: World Heritage, territories, insets, look-alikes

- **UNESCO World Heritage Sites** (241): from Wikidata (designation + UNESCO id). Ranked by how many Wikipedia
  language editions cover them: 50 icons first, then the best-known 40 per continent. Gold diamond markers on the map;
  photo → name, find it, site → country.

- **Territories** (60): overseas regions, dependencies and autonomous territories — Martinique, Puerto Rico,
  Greenland, New Caledonia… — with "part of which country?" cards. Shapes: Natural Earth map units; facts: Wikidata.
- **Close-up insets** for small places: the 1:10m island outlines (`shapes-small.json`), a dashed hull showing how far
  an island group spreads, and a scale bar. (The hull is the spread of the islands, not the legal maritime zone.)
- **Maps on capital & city cards**: start wide (all states / the continent), zoom and lock on when flipped.
- **Flag look-alikes** (`public/data/flag-lookalikes.json`, hand-curated): shown after a flag card with a tip.
- **Again / Hard / Good / Easy** everywhere (1–4, space = Good); quiz answers on cards you're learning count as reviews.
- **More real pronunciations**: the sync searches Wikimedia Commons for Lingua Libre / Wiktionary recordings of each
  local name (cached in `data/audio-cache.json`); the device voice now prefers the best installed voice.
- Fix: a polygon wound inside-out (Maryland) covered the map; the app now flips such shapes back.

## v1.1: leaders, currencies, largest cities

- **Governors** (all 50) and **heads of state / government** (349 offices in 200 countries) from Wikipedia's closely
  watched lists ("List of current United States governors", "List of current heads of state and government");
  photos & parties via Wikidata. Cards follow the office ("The President of France is…"). Countries run by a
  council (Switzerland, Bosnia and Herzegovina, San Marino) have no single leader card.
- **Incoming officeholders**: the 2026 Senate and governor race-summary tables on Wikipedia are read nightly; seats
  changing hands show an "Incoming · January 2027" strip. It disappears once the winner is the current holder.
- **Currencies** (Wikidata P38, preferring the country's own, non-discontinued currency) and **largest cities**
  (GeoNames candidates, confirmed with Wikidata's latest population). `largestCity` / `currencyCodes` overrides in
  `data/overrides.json` handle the odd case, and warn if they stop matching.
- Party colour key on people cards: blue Democrat, red Republican, purple independent.

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
