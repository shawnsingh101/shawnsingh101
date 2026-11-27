# Cybersecurity

- **Understanding first, exam practice second.** The owner practices Security+ (SY0-701) questions in a separate Study
  Lab. Each deck opens with a **lesson** (what it is, why it exists, how it works, where it fits, what it's confused
  with), then cards on just that lesson. Acronyms spelled out on first use in every lesson and on every card.
- **Three steps up in every part**: the lesson; its cards; then a **"going further"** deck (`depth: deep`) of applied,
  scenario-style cards (what a scan, log or symptom means, which tool or setting, what an attack looks like). Later
  parts are harder in themselves, since they build on everything before.
- **Pictures**: a Commons diagram in the lesson and on the matching card wherever a clean one exists (checked to exist
  before use); otherwise draw one of our own (a stack or a flow).
- **Layered order, not the exam's**: 1 How computers talk, 2 The core ideas, 3 Cryptography, 4 Identity, 5 Networks,
  6 Attacks, 7 Defending systems, 8 Operations, 9 Governance. Each part uses only what came before.
- **Tagged to the exam and the book**: `objectives:` (e.g. `1.4, 3.3`) and `chapter:` (Chapple and Seidl, 9th ed.) in
  front matter, giving By exam objective and By book chapter lenses, and a pointer back to the Study Lab at the end of
  each lesson. Titles live in `src/secplus.ts`.
- **Flow diagrams** (```` ```flow ````) for anything that passes between systems (keys, certificates, tickets,
  handshakes): stepped through in lessons, blanked as cards; every step names an actor (audited). Layers and chains
  (OSI, chain of trust) are **stacks** (```` ```stack ````). Look: soft pastel fills, no heavy outlines, thin arrows,
  small labels, a short title.
- Our own words from the official objectives and standard references; the study guide is never copied or committed.
  An analogy may help a lesson, but is never a card's answer.
