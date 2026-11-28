# Roadmap: done (archived)

The Done list as it stood at v1.38. From now on, what shipped is recorded in `src/changelog.ts` only.


| Version | What |
| --- | --- |
| 1.30 | Life: the tree of life, whales and dolphins, dinosaurs, how to tell them apart |
| 1.31 | Life reorganized by the tree: domains as sections, photo → name with lineage blocks, dinosaurs by time |
| 1.32 | Programming: Python chapters 1–3 and Under the hood (the repo, Git and GitHub); code cards; practice mode (write Python, run and checked); dinosaur times from Wikipedia; Wikipedia lead images where Commons has none |
| 1.33 | Live topics: the Russo-Ukrainian war and the AI race, "as of" cards, a weekly briefing (Wednesdays) that suggests up to two cards a week as a pull request |
| 1.34 | Cybersecurity: lessons before cards, flow diagrams, Security+ lenses; How computers talk and Cryptography |
| 1.35 | Cybersecurity: no give-away cards (checked app-wide), "going further" decks, Wikipedia diagrams |
| 1.36 | Economics by course (Macro lectures 1–3), KaTeX math, derivations, graphs, Equations section |
| 1.38 | Government: the State Department (10 decks), parts cards with partial credit, bureau map cards |
| 1.37 | Macro lectures 4–9; equation cards explain every symbol with a worked example; tables in lessons |
| 1.29 | Where people are really from, with the flag of their time |
| 1.28 | Classical clean-up (Musopen recordings, bad clips removed); no borrowed pictures |
| 1.27 | Earth history: a picture of the life of each time |
| 1.26 | The answer's pronunciation everywhere; Empire of AI and the Artificial intelligence subject |
| 1.25 | Jazz musicians by scene (no audio yet); classical clips at the famous moment, more pieces, Start here |
| 1.24 | Music: classical by ear, with the composer and the whole work on the reveal |
| 1.23 | Books: essentials and deep cuts, shelved by literature and topic from shared tags |
| 1.22 | Architecture: famous buildings, styles and architects, tours of the White House, the Capitol and the Met |
| 1.21 | Search every card; study, quiz or pin a search |
| 1.20 | Streamlined app: Study and Quiz, five tabs, one row per deck |
| 1.19 | Study a whole section; History by era (the first tag lens) |
| 1.18 | Me: progress across every subject |


## Owner controls (v1.41–v1.44): build notes

Moved from ROADMAP.md when all four steps were done.

**Owner controls: edit and build inside the app** (done v1.41–v1.44; agreed with the owner, one session per step, in order). **Step 1 done
(v1.41):** Settings is a list (`src/components/Settings.tsx`: switches, popups via `Popup`, a Backup dropdown); the top
bar holds only Settings. Levels in `src/levels.ts` (gem tiers; level 1 costs 10,000 XP, each next ×1.2 rounded to 500;
weekly target = average of the last four full weeks since the first study day, rounded to 500, 5,000 in a first week),
drawn by `LevelProgress` (`src/components/Level.tsx`) at the end of sessions and quizzes and on Me. Days now record
`xp`; older days get their share of the XP total by `dailyXp()`. The answer log is `Progress.log`
(`[unixSeconds, cardId, grade 1–4, xp, 1 if quiz]`), saved under its own localStorage key `geoquest:log` and included in
backups; quiz answers on unlearned cards are logged with 0 XP (the score bonus is a day total, not a log entry).
Watch: about 3 MB a year at the owner's pace; if storage fills, move the log to IndexedDB. **Step 2 done (v1.42):**
Me has Overview | Reports (`src/views/Report.tsx`). Periods: past 24 hours (by hour, from the log), week, month, 3
months (by day), year to date, 1 year (by week), custom dates. Tiles (XP, answers, % right, new cards, days, time
studying = gaps between logged answers capped at 2 min) compare with the period before; answers, XP and days come from
`p.days` (all history), subjects, time and most-missed from the log (a note says when the log started). Save as PDF is
`window.print()` with print CSS that shows only the report on white. **Step 3 done (v1.43):** after a hand-written card
is flipped, Edit (top bar of the study screen) opens `EditCard` (`src/components/EditCard.tsx`): the card's lines from
its deck file (`cardSource` / `cardBlock` in `src/notes.ts`; every card records its bullet's `line`, checked by the
audit), a live note on whether the edit keeps progress (re-parses the deck and looks for the card's id), and Send for
review. `src/github.ts` reads the file fresh from `main`, replaces the old lines (refuses if they changed), commits to a
new `edit/<deck>-<time>` branch and opens a pull request, all from the browser with the owner's fine-grained token
(this repo only; Contents + Pull requests read/write), kept in localStorage `geoquest:github`, never in progress or
backups. Set up in the editor or Settings › Editing on GitHub (step-by-step, token checked before saving; lists edits
sent). `.github/workflows/geo-quest-audit.yml` runs the audit on every PR touching `geo-quest/`. A note card whose
fingerprint changed now keeps its FSRS state and is due at once (data facts still reset). Not yet: editing
collection cards (they come from Wikidata: fixes go in `data/collection-fixes.json`) and the lesson text. **Step 4 done (v1.44)**, so all four
steps are built: the Builder (`src/components/Builder.tsx`, pure helpers in `src/builder.ts`) opens from Library ›
New cards or deck and a deck's sheet (Add cards). Card types: cloze (words to hide + hint, or typed `{{…}}`),
question & answer (both ways), parts (2–5, cues, any order), recipe, picture; extras: picture, note, `native:`,
`source: https://…` (new: `NoteCard.link`, shown on the back). Several cards per save. Add from Wikipedia: search API,
then the page summary and Wikidata (P18 picture, P1705/P1559 native name, P225). New decks: subject (or new), section,
name, `icon:` front matter (new), first heading; files keep existing numbered folders (`newDeckFile`). Saved with
`proposeChange` (`github.ts`; creates files without `sha`, reads fresh from main, inserts at the end of the heading's
part) or as a **device deck**: `Progress.myDecks` (`{file, text}`), parsed at start-up in `notes.ts` like any deck
(the app restarts itself after saving: `reloadApp`), editable with Edit (saved locally), **Publish to GitHub** (a new
file PR; once merged the repo copy has the same id and the device copy is dropped by `PUBLISHED_DEVICE`) or Delete.
Ideas left: lessons and deck intros from the app, Wikidata collections from the app, reorder or delete cards.
1. ~~**Settings and rewards.**~~ Settings becomes a clean list: buttons that open their own popup (Theme, New cards,
   Backup, …) and sliding switches for on/off ones (sound effects, music, XP & Streaks); sound moves inside Settings.
   Backup is a dropdown: *Download backup* / *Restore from a file*. The session-complete screen gets a sleeker XP line
   with a flat gem icon. **Levels, not leagues** (owner's choice): named gem tiers (quartz, amethyst, sapphire,
   emerald, ruby, diamond…), each needing a bit more XP than the last (the owner earned ~27,000 XP in two weeks: a new
   level every week or two at first), a weekly target set from the owner's own recent weeks, and a progress bar to
   the next level at the end of study sessions and quizzes and on Me. **Also start an answer log** (every answer with
   its time, kept in progress and in backups) so step 2 has history.
2. ~~**Reports**~~ under Me: past 24 hours, week, month, 3 months, year to date, 1 year or a custom range; a dashboard of
   progress from the answer log (and daily XP totals before it); save as PDF with the browser's print-to-PDF.
3. ~~**Edit a card.**~~ An Edit button on hand-written cards opens the card's source line; saving sends it to GitHub as a
   **pull request** (owner's choice), where a GitHub Action runs `npm run audit`; the owner merges. The owner pastes a
   fine-grained GitHub token (this repo only: contents and pull requests), stored only on the device; walk them
   through creating it. Fixing an answer keeps progress; rewording the question makes a new card (say so in the editor).
4. ~~**Builder.**~~ New cards by type (cloze, front/back, parts, recipe, picture) and new decks (subject, section, name,
   icon), saved the same way. **Add from Wikipedia**: search a name, pull title, picture, description and native name
   (Wikipedia/Wikidata allow browser requests), fill the card for the owner to adjust. A `source:` link per card,
   shown on the back. **Device-only decks** (kept in progress and backups, private) for studying without Claude,
   publishable later. Remind the owner the repo is public.
