# Prompt for the next session: Home systems and Tools

Paste everything below the line into a fresh chat. Attach any home-inspection guide or PDF you have with figures
(see the last paragraph).

---

Read `geo-quest/CLAUDE.md`, `GUIDELINES.md`, `ROADMAP.md` (Home systems is next in the queue) and `decks/README.md`.
Then build a new **Home systems** subject (decks under `decks/Home systems/`, one folder per system, numbered in this
order), plus a cross-cutting **Tools** deck. The goal is for me to learn how a house and its systems work, from the
foundation up to expert level. Start with a few **foundation cards for every topic below** so the whole house is covered;
later sessions will deepen each one, starting with Electrical.

1. **Structural system (the skeleton)**: supports the house's weight and resists wind, soil pressure and gravity.
   Foundation (footings, slab, crawlspace walls, basement walls carrying loads to the ground); framing (sill plates,
   floor joists, subflooring, wall studs, headers, ceiling joists, roof rafters or trusses).
2. **Building envelope (the skin)**: separates the indoors from weather and moisture. Roofing (shingles, metal, tile,
   underlayment, flashing, fascia, soffits, vents); exterior cladding (vinyl, wood, fiber-cement siding, brick, stucco,
   stone); openings (windows, exterior doors, skylights, weatherstripping); insulation and air barriers (house wrap,
   batt, blown-in and spray-foam insulation, vapor retarders).
3. **Plumbing**: water supply (main shutoff, meter or well pump and pressure tank, copper/PEX/CPVC pipe, fixture shutoffs);
   water heating (tank or tankless heater, expansion tank, T&P relief valve); drain-waste-vent (fixture drains, P-traps,
   drain lines, main stack, roof vents, sewer connection or septic tank and leach field).
4. **Electrical**: service entrance (overhead drop or underground lateral, meter, grounding electrode system);
   distribution (main panel, subpanels, breakers or fuses); branch circuits and devices (Romex and conduit, standard /
   GFCI / AFCI outlets, switches, hardwired fixtures, low-voltage wiring for doorbells and data).
5. **HVAC**: heating (gas, oil or electric furnace, boiler with radiators or hydronic heat, heat pump); cooling (central
   air with condenser and evaporator coil, heat pump, mini-splits); distribution and ventilation (ductwork, supply
   registers, return grilles, thermostat, bath and kitchen exhaust fans, ERV/HRV).
6. **Drainage and site grading**: roof drainage (gutters, downspouts, extensions); ground drainage (yard grading, French
   drains, window-well drains, interior perimeter drain tile with a sump pump).
7. **Safety, fire and interior**: life safety (smoke and CO alarms, extinguishers, egress windows); interior finishes
   (drywall, plaster, trim, cabinets, countertops, flooring); appliances (range/oven, refrigerator, dishwasher, disposal,
   washer, dryer and its exhaust duct).

How to build it:
- Propose first in the ROADMAP shape (home, tags, card types, outline with three sample cards per system), then build.
- **Pictures are the point**: a Commons photo of the part itself on most cards (picture → name, and name → what it does),
  checked to exist before committing. Use Wikipedia for content and images; write cards in our own words.
- Use **org charts** (```` ```org ````) or **stacks** where a system is a hierarchy or a path (water from the main to
  the faucet; power from the utility to the outlet), and **parts cards** for short lists.
- The **Tools** deck: picture → tool name, and what it's for; each tool card `also in:` the system decks where it's used
  (a non-contact voltage tester in Electrical, a pipe wrench in Plumbing).
- Then start the **Electrical deep dive** with https://www.esfi.org/understanding-your-home-electrical-system/ and
  related ESFI pages (ask me if a site blocks you).
- Note the queue's **labelled diagrams** idea (tap the part on a house cutaway) as the next card type for this subject.
- Finish with the release steps (version, changelog, audit, build, sweep for code changes), update ROADMAP *In
  progress*, commit and push.

I'm attaching a home guide PDF with figures for guidance: read it in page ranges, use it for coverage and order, and
don't copy its text or figures into the repo.
