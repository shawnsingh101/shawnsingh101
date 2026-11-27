# Intelligence Quest

*(formerly GeoQuest; the code lives in `geo-quest/` and saved progress keeps its old storage key.)*

A spaced-repetition learning app with a map: geography, history, science, books, music, economics, cybersecurity,
government and more, as note decks and Wikidata-backed collections. What shipped in each version is in
`src/changelog.ts` (shown in the app); the old per-version write-ups are in `archive/README_ARCHIVE.md`.

## Running it

```bash
cd geo-quest
npm install
npm run dev        # http://localhost:5173
npm run audit      # check every deck (rules in GUIDELINES.md)
npm run sweep      # browser sweep; needs `npx vite preview` running
npm run build      # type-check + static site in dist/
npm run sync       # refresh data from Wikidata
```

Publishing: `.github/workflows/geo-quest-pages.yml` deploys to GitHub Pages on every push to `main`.
Progress is stored in the browser; ⚙ → *Download backup* / *Restore* moves it between devices.
The home screen shows `v<version> · build <commit> · <date>`, so you can tell when an update is live.

## Staying up to date

- Facts come from **Wikidata** (CC0). A nightly GitHub Action (`.github/workflows/geo-quest-sync.yml`) reruns the
  syncs and commits changes; changed facts are logged to `public/data/changes.json`.
- Every card stores a fingerprint of the facts it was learned from; when one changes, the card comes back for review
  with *"The world changed: …"*.
- Hand fixes (`data/overrides.json`, `data/collection-fixes.json`) apply only while Wikidata still says what they
  were written for, so they can't silently go stale.
- Live topics follow Wikipedia articles; a weekly briefing (`scripts/briefing.mjs`) proposes new cards as a pull request.

## Architecture

| Piece | Where |
|---|---|
| Note decks (cards written from sources) | `decks/<Subject>/…/<Deck>.md`, parsed by `src/notes.ts`; syntax in `decks/README.md` |
| Collections (Wikipedia things, filled by a sync) | `collections/…`, `scripts/sync-collections.mjs`, `src/collections.ts`; see `collections/README.md` |
| Equation definitions | `equations/<Subject>.md`, `src/equations.ts` |
| Data snapshot + change log | `public/data/*.json` (from `scripts/sync-*.mjs`) |
| Hand fixes, extra places | `data/*.json` (each has a `_readme`) |
| Subjects, sections, tags and lenses | `src/subjects.ts`, `src/tags.ts`, `src/tree.ts` |
| Card kinds, cloze wording | `src/cards.ts`, `src/components/QuestionTypes.tsx` |
| Scheduling (FSRS), progress, unlocks | `src/srs.ts` |
| Map (D3 + Natural Earth, Equal Earth projection) | `src/components/WorldMap.tsx`, shapes from `scripts/build-shapes.mjs` |
| Diagrams: flows, stacks, lineage, time scale | `src/components/Flow.tsx`, `Stack.tsx`, `Lineage.tsx`, `src/geotime.ts` |
| Screens | `src/views/*.tsx` (Today, Library, Quiz, Map, Me) |
| Checks | `tests/audit-decks.ts` (content), `tests/ui-sweep.cjs` (browser) |

Everything is keyed by Wikidata id (`Q183` = Germany), so names can change without losing progress.

## Docs

- `GUIDELINES.md`: the rules every change follows (read first). Subject rules: `guides/<subject>.md`.
- `ROADMAP.md`: what's in progress and what's next.
- `archive/`: history (old README, done list, the original subjects plan). Not needed to build anything.
