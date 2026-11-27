# Programming

- **Two decks, linked.** *Python* follows OpenStax *Introduction to Python Programming* chapter by chapter. *Under the
  hood* teaches how this app works, from its real files. A card in one can be `also in:` the other.
- **Code on cards** goes in a fenced block (dark panel in every theme). Kinds: what does this print, fill in the blank
  in the code, which error, plain concept cards. Easy first; harder ones in a `depth: deep` deck beside each chapter.
- **Every "prints" answer is run in Python before it ships.** Never write an output from memory.
- **Quoted code must be real.** An Under the hood card names its file (`source: src/srs.ts`); the audit fails when the
  code no longer matches. Don't quote lines that change every release (the version number).
- **Practice cards** teach writing code: `[practice]` with starting code, test cases (input lines → expected output),
  optional asserts and a model solution. Python runs in the browser (Pyodide from the app's own `pyodide/` folder, never
  a CDN) in a worker, stopped after 5 seconds. The audit runs every solution with `public/practice-runner.py` and fails
  if it doesn't pass, or if the starting code already does.
- Practice problems use only what the chapter (and earlier ones) taught, with two or more test cases where input is
  read. They're worked in Study and kept out of timed quizzes.
