# Prompt for the next session: How Your House Works, part 2 (and part 3)

Paste everything below the line into a fresh Claude Code session on the `shawnsingh101/shawnsingh101` repository and
attach the next PDF part. For part 3, change "part 2" to "part 3" and use the part 3 list at the end.

---

Read `geo-quest/CLAUDE.md`, `GUIDELINES.md`, `ROADMAP.md` (the **Home systems** entry under *In progress*),
`guides/home-systems.md` (especially "Following the book") and `decks/README.md`.

Work on the branch `claude/eloquent-maxwell-3lvcm5`: fetch it and continue on it, don't start from `main`. Parts 1, 2
and 3 of this book go out as **one pull request at the end**, so don't open a pull request until part 3 is done unless I
ask. Commit and push when you finish.

I'm attaching **part 2** of *How Your House Works* (Charlie Wing, 4th edition) as a PDF. Part 1 (chapter 1 Plumbing,
and chapter 2 Wiring up to motion-activated switches) is already built: look at `decks/Home systems/3 Plumbing/` and
`decks/Home systems/4 Electrical/` to match the style. Start where part 1 stopped and go as far as this PDF goes.

How to build it, the same way as part 1:
- Pull the PDF's text with `pdftotext` (the PDF in its own folder in the scratchpad), and look at a few pages as images
  in small batches to see what the figures cover. Use the book only for **coverage, order and explanations**: write
  every card and lesson in our own words, check facts against Wikipedia or the codes, never copy its text or figures,
  and never commit the PDF.
- Each book chapter becomes the deep dive for its system: `depth: deep` decks named "<core deck> - going further" in
  that system's folder, each with a `:::lesson` that explains how things work, and the book's "Before calling for
  help" tips as cards. Add a new core deck only for something an educated homeowner should know that no core deck has.
- Pictures: a Commons photo of the part where a good one exists (look at it before using it). Where Commons has no
  clear diagram, **draw our own SVG figure** in `public/figures/home/` in the same style as the eight already there,
  render it with Playwright, look at it, fix overlapping labels, then use it in the lesson and on cards.
- Where things go: the rest of Wiring (light fixtures, lamps, fluorescent and LED, CO and smoke detectors, the smart
  home) is Electrical deep dive part 4; Heating, Cooling and Air quality go in `5 HVAC` beside Heating, Cooling and Air
  distribution and ventilation; Appliances goes beside `7 Safety and interior/3 Appliances`. Link related cards with
  `also in:` (smoke and CO alarms also in Life safety).
- Release steps: bump the minor version, add a changelog line, `npm run audit`; if you change code, also build, run
  `npm run sweep` with `npx vite preview` running, and look at the touched screens on phone and laptop.
- Before you finish, update the Home systems entry in ROADMAP.md *In progress* and this prompt file's part 3 list if
  anything moved, then give me the prompt for part 3.

Part 3 (for the next prompt): chapter 7 Windows and doors (double-hung and low-E windows, window insulation, locks, the
garage door opener) beside `2 Envelope/3 Windows and doors`; chapter 8 Foundation and frame (footings and soils,
drainage, radon, slab, crawl space, grade beam, full and pier foundations, forces on the frame, beams, framing types)
beside `1 Structure`; chapter 9 The solar home (passive solar, solar pool and water heaters, photovoltaics) and
chapter 10 Outdoor equipment (2- and 4-cycle engines, chain saw, mower, trimmer, blower, cordless tools, portable
backup power, lawn sprinklers, pool pump) as new folders after `8 Tools` if they don't fit an existing one; the
appendices (batteries, fasteners, adhesives, a home tool bag) added to `8 Tools`, without repeating tools already
there. When part 3 is done, open the one pull request for all three parts.
