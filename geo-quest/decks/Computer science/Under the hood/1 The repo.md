---
title: The repo
---
How Intelligence Quest is laid out: the folders, which files are written by hand and which are built by scripts, and JSON, the format the app's data is kept in. Every example is a real file; "See it in the code" opens it on GitHub.

## The top level
- The `README.md` at the very top of the repository is your {{GitHub profile|what does it show?}} page, not the app's.
- The whole app lives in the {{`geo-quest`|which folder?}} folder.
- The instructions GitHub's own robots follow are in the {{`.github`|which folder?}} folder.
- `CLAUDE.md` is a note read at the start of every {{Claude Code session|read by whom?}}: "read the guidelines first".

## Inside geo-quest
- The app's source code is in the {{`src`|which folder?}} folder: screens in `src/views`, reusable pieces in `src/components`.
- Note decks, like this one, are Markdown files in the {{`decks`|which folder?}} folder; each sub-folder becomes a section.
- Lists of things whose facts come from Wikidata (paintings, whales, books) are in the {{`collections`|which folder?}} folder.
- The helper programs that fetch facts from Wikidata are in the {{`scripts`|which folder?}} folder.

## Who writes which file
- `public/data/collections.json` is built by a script, never edited by hand: a {{generated|what kind of?}} file.
- Corrections to what Wikidata says, like a better photo, go in {{`data/collection-fixes.json`|which file?}}.
- Fill in the key that says which photo the bowhead whale card shows:
```json
"Q174652": {
  "{{image|which key?}}": "Bowhead Whale NOAA.jpg"
}
```
source: data/collection-fixes.json
- `Q174652` is the bowhead whale's {{Wikidata|whose?}} ID.

## The data format
- `collection-fixes.json` is written in {{JSON|which format?}}: names and values in curly braces.
- In JSON, items are separated by {{commas|what?}}, and one missing or extra one breaks the whole file.
- JSON strings must use {{double quotes|which kind of quotes?}}.
- The same data as a Python dictionary. This prints {{`Bowhead Whale NOAA.jpg`|what does it print?}}.
```python
fixes = {"Q174652": {"image": "Bowhead Whale NOAA.jpg"}}
print(fixes["Q174652"]["image"])
```
> JSON and Python dictionaries look almost the same: keys and values in curly braces. Chapter 10 of the Python book covers dictionaries.

## Building and running
- `package.json` holds the app's name, its {{version|what number?}}, the outside libraries it uses, and short names for commands.
- `npm run sync:collections` is a short name for this command. Fill in the script it runs:
```json
"sync:collections": "node scripts/{{sync-collections.mjs|which file?}}",
```
source: package.json
- The tool that bundles `src` into a finished website is {{Vite|which tool?}}.
- `node_modules` and `dist` are listed here, so Git never saves them: this file is {{`.gitignore`|which file?}}.
```text
node_modules
dist
```
source: .gitignore
- Your progress is saved in each browser's own storage under this {{key|what's it called?}}, not on GitHub:
```ts
const KEY = 'geoquest:v1';
```
source: src/srs.ts
also in: Statements
