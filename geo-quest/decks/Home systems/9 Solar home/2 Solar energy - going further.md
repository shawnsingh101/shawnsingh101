---
title: Solar energy - going further
depth: deep
---
The solar home in depth: how passive solar design captures and stores heat, how solar pool and water heaters work, what goes on inside a solar cell, how to aim panels and judge shade, and how grid-tied and off-grid systems are put together and sized. Order follows chapter 9 of *How Your House Works* (Charlie Wing); facts are checked against Wikipedia, the US Department of Energy and NREL, and the cards and drawings are our own.

:::lesson
## Passive solar heating
![Sun through a south window, winter and summer (drawn for this app)](figures/home/passive-solar.svg)
A passive solar house is mostly an ordinary house with its glass in the right place. Most windows face **south** (within about 30° of it), and few face north, east or west. The noon sun is low in winter and high in summer, so a correctly sized **overhang** over the south windows lets winter sun deep into the rooms and shades the glass in summer.

Sun through glass heats a room quickly, so the house also needs **thermal mass**: concrete, brick, tile or stone (or water) that soaks up the heat by day and gives it back at night. Without enough of it the house overheats, windows get opened, and the heat is wasted. Mass works best in the sun's direct path, and thin mass spread over a large area works better than thick mass in a small one; a rough rule is several square feet of 4-inch masonry floor in the sun for each square foot of south glass. A **Trombe wall** is a dark masonry wall right behind south glass that stores the heat and releases it into the room hours later. The whole house must be well insulated and tight, or the sun's gain just leaks away. In sunny climates passive design can supply a large share of the heat; in cloudy ones, less.

## Solar pool and water heaters
A **solar pool heater** is the simplest solar collector there is: panels of black plastic tubes, unglazed, on a roof near the pool. The pool pump already moves the water; a valve sends it up through the panels when they are warmer than the pool. Because a pool only needs to be warmed a few degrees, these pay back faster than any other solar system.

![A solar water heater (closed loop) (drawn for this app)](figures/home/solar-water-heater.svg)
A **solar water heater** for the house needs hotter water, so its collectors are **glazed**: a dark absorber plate with tubes, under glass, in an insulated box (or rows of **evacuated tubes**, which lose even less heat). In freezing climates the collector loop carries **propylene glycol** antifreeze, and a **heat exchanger** coil in the tank passes its heat to the water; a **controller** runs the pump only when the collector is warmer than the tank. A **drainback** system instead lets the water drain out of the collectors whenever the pump stops. In warm climates simpler systems work: water heated directly in the collectors, or a **thermosiphon** system with the tank above the collector, where the warm water rises on its own. A backup element or burner covers cloudy days; a good system supplies roughly half to three-quarters of a household's hot water.

## Inside a solar cell
A silicon cell is two thin layers. The top is **n-type**, made with a trace of phosphorus so it has spare electrons; the bottom is **p-type**, made with boron so it is short of them. Where they meet, the **p–n junction**, an electric field builds up. When a **photon** of sunlight is absorbed, it knocks an electron loose, and the field pushes it toward the top. Thin metal fingers on the front and a metal sheet on the back collect the electrons; connect them through a load and a current flows. Each cell gives about half a volt, so panels string dozens of cells in series.

Cells are made three ways: **monocrystalline** wafers sliced from a single grown crystal (the most efficient, dark and evenly colored, with clipped corners), **polycrystalline** square wafers cut from a cast block (bluish and flaky looking, slightly less efficient), and **thin film**, a layer deposited on glass or a flexible sheet (cheaper, less efficient).

## Aiming and shading
The sun's place in the sky is given by its **altitude** (degrees above the horizon) and its **azimuth** (compass direction). A panel makes the most power when the sun strikes it square on. A tracker that follows the sun rarely pays at home, so fixed panels are aimed for the best year: **true south** (azimuth 180°) and a **tilt about equal to the latitude**. Being off is not costly: at 30° N, a flat roof still gets about 90% of the best output and a panel facing east or west at a low tilt about 85 to 90%. A vertical wall does much worse.

**Shade** is the real enemy. The cells in a panel are wired in series, so one shaded cell throttles the whole string, a little like a kink in a hose; **bypass diodes**, **microinverters** (one per panel) and **power optimizers** limit the damage. About 90% of the useful sun arrives between 9 a.m. and 3 p.m., so that part of the southern sky should be clear all year; installers plot trees and buildings on a **sun-path chart** and are wary of sites more than about 15% shaded.

## Grid-tied systems
Most home systems are **grid-tied**. The panels feed an **inverter** that turns their DC into AC matched to the utility's, and the house uses solar power first. Surplus flows out through the meter to the grid, and when the sun is down the grid supplies the house. Under **net metering** the exported power is credited against what's bought (rules vary by state and utility). A plain grid-tied inverter must shut down when the grid fails (**anti-islanding**), so line workers fixing it aren't shocked by power flowing back; to keep the lights on in an outage, a system adds **batteries** and a transfer switch that runs an **essential-loads panel** on its own.

## Off-grid systems
A cabin, boat or RV beyond the power lines needs everything itself: panels, a **charge controller** that keeps the batteries from overcharging, a **battery bank** (deep-cycle lead-acid or, now often, lithium iron phosphate) big enough for several cloudy days, and an **inverter/charger** that makes AC for the house and recharges the batteries from a generator or shore power when one is plugged in. Off-grid living starts with using less: LED lights, efficient appliances, and gas for heat, hot water and cooking.

## Sizing a system
1. Add up the house's use in **kilowatt-hours a year** (the electric bills show it).
2. Find what each **watt** of panels makes in a year where you live: about 1.1 kWh in cloudy Seattle to 1.7 in Phoenix (NREL's free **PVWatts** calculator gives it for any address).
3. Divide: 6,000 kWh a year at 1.4 kWh per watt needs about 4,300 watts of panels.
:::

## Passive solar heating
- A passive solar house puts most of its windows on the {{south|which?}} side.
![Sun through a south window, winter and summer (drawn for this app)](figures/home/passive-solar.svg)
- A correctly sized {{overhang|what?}} over south windows lets in the low winter sun and shades out the high summer sun.
- Concrete, brick, stone or water that soaks up the sun's heat by day and gives it back at night is called {{thermal mass|what?}}.
- Without enough thermal mass, a sunny passive solar house {{overheats|what happens?}} by day.
- A {{Trombe wall|what?}} is a dark masonry wall right behind south glass that releases the sun's heat into the room hours later.
![A Trombe wall, cut through](commons:MIT 4.401 Introduction to Building Technology, Spring 2006 - A Trombe Wall - 3041280332.jpg)

## Solar pool heaters
- A solar pool heater's collectors are black plastic tubes with no {{glass|what?}} cover: the pool only needs warming a few degrees.
- A solar pool heater needs no pump of its own: the pool's {{filter pump|what?}} moves the water through the panels.

## Solar water heaters
- A glazed solar collector is a dark {{absorber|what?}} plate with tubes, under glass in an insulated box.
![A solar water heater with its tank above the collectors](commons:Solar panels, Santorini2.jpg)
- In freezing climates, a solar water heater's collector loop carries {{propylene glycol|what antifreeze?}}.
![A solar water heater (closed loop) (drawn for this app)](figures/home/solar-water-heater.svg)
- In a closed-loop solar water heater, a {{heat exchanger|what?}} coil in the tank passes the collector's heat to the water.
- A solar water heater's controller runs the pump only when the {{collector|what?}} is warmer than the tank.
- In a {{drainback|what kind of?}} solar water heater, the water drains out of the collectors whenever the pump stops, so they can't freeze.
- In a {{thermosiphon|what kind of?}} solar water heater, the tank sits above the collector and warm water rises into it by itself.
- Rows of glass {{evacuated tubes|what?}} lose less heat than a flat collector, since a vacuum surrounds each absorber.

## Inside a solar cell
- The top layer of a silicon solar cell is made with a trace of {{phosphorus|which element?}}, giving it spare electrons.
![A monocrystalline solar cell](commons:Solar cell.png)
- The bottom layer of a silicon solar cell is made with a trace of {{boron|which element?}}, leaving it short of electrons.
- Where a solar cell's two layers meet, the {{p–n junction|what?}}, an electric field pushes loosened electrons one way.
- A solar cell's electrons are knocked loose by {{photons|what?}} of sunlight.
- A single silicon solar cell gives about {{half a volt|how much?}}, so a panel strings dozens in series.
- {{Monocrystalline|which kind?}} solar cells are sliced from a single grown crystal: the most efficient, dark and evenly colored.
- {{Polycrystalline|which kind?}} solar cells are cut from a cast block and look bluish and flaky.
![Polycrystalline cells and silicon](commons:Polysilicon compilation.jpg)
- {{Thin-film|which kind?}} solar cells are a layer deposited on glass or a flexible sheet: cheaper and less efficient.
![A flexible solar sheet being laid](commons:Thin Film Flexible Solar PV Installation 2.JPG)

## Aiming and shading
- The sun's height above the horizon, in degrees, is its {{altitude|what?}}; its compass direction is its azimuth.
- At 30° north, a {{flat|what kind of?}} roof panel still makes about 90% of the best possible output.
- In a string of panels wired in series, one {{shaded|what?}} cell can throttle the whole string.
- {{Microinverters|what?}}, one per panel, keep a shaded panel from dragging down the rest.
![A microinverter](commons:Enphase M190.jpg)
- About 90% of a panel's useful sun arrives between 9 a.m. and {{3 p.m.|when?}}.
- Installers plot trees and buildings on a {{sun-path chart|what?}} to estimate a site's shading.

## Grid-tied systems
- A grid-tied inverter must shut down when the grid fails, called {{anti-islanding|what?}}, so line workers aren't shocked.
also in: Distribution
- To run during an outage, a grid-tied system needs {{batteries|what?}} and a switch that runs an essential-loads panel on its own.
also in: Distribution

## Off-grid systems
- An off-grid system's {{charge controller|what?}} keeps the panels from overcharging the batteries.
- An off-grid battery bank should be big enough for several {{cloudy|what kind of?}} days.
- An off-grid {{inverter/charger|what?}} makes AC for the house and recharges the batteries from a generator.

## Sizing a system
- To size a solar array, start with the house's use in {{kilowatt-hours|what unit?}} a year, from the electric bills.
- NREL's free {{PVWatts|what tool?}} calculator tells how much a watt of panels makes in a year at any address.
- In the US, each watt of panels makes about 1.1 kWh a year in cloudy Seattle and about {{1.7|how many?}} in Phoenix.
