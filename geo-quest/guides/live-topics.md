# Live topics (ongoing stories)

- **A live topic is a deck that follows Wikipedia articles** (`follows: Title; Title` and `checked: YYYY-MM-DD` in its
  front matter). It lives with its subject and is also listed under **Live topics**. Followed now: the
  Russo-Ukrainian war and the AI race.
- **Two kinds of card.** Settled facts, and **"as of" cards** (`as of: November 2026` after the card), shown with their
  date. When one stops being true, rewrite it (the new state, or the old one as history: "In 2025, …"); never delete a
  card someone has learned.
- **The weekly briefing, every Wednesday**, is a scheduled Claude session running `node scripts/briefing.mjs`, which
  shows what changed in the followed articles, counting only text that has stood for a week.
  - **At most two new cards a week across all live topics**, most significant first, nothing on a quiet week. Updates
    to "as of" cards don't count.
  - It sets `checked:`, runs the audit, and opens a **pull request**; merging it is the owner's approval.
- **Wikipedia is the source of truth**, in its words: attribute disputed claims ("Ukraine says…"); casualty figures as
  ranges with whose estimate they are; no opinions of our own.
