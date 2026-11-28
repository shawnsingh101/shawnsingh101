---
title: Heating - going further
depth: deep
---
The Heating deep dive, part 1: what happens, step by step, when a gas furnace or boiler fires; how an oil burner works and the oil filter that stops it; heat pumps that draw heat from the air or the ground; how hot water and warm air are carried to the rooms; and thermostats. Order follows chapter 3 of *How Your House Works* (Charlie Wing); the cards and drawings are our own.

:::lesson
## A gas furnace, step by step
```flow
Thermostat | Furnace | Rooms
Thermostat -> Furnace: calls for heat
Furnace: the inducer fan starts and clears the flue
Furnace: the igniter glows (or the pilot is proven) and the gas valve opens
Furnace: the burners fire into the heat exchanger
Furnace: when the exchanger is warm, the fan-and-limit switch starts the blower
Furnace -> Rooms: warm air through the supply ducts
Rooms -> Furnace: cool air back through the filter and return ducts
Thermostat -> Furnace: satisfied: the gas shuts off
Furnace: the blower runs on until the exchanger cools
```
A **high-limit** switch shuts the gas off if the furnace gets too hot, as it will when a clogged filter starves it of air.

## A hot-water boiler
A boiler heats water to about 180°F and a **circulator** pump pushes it around a loop of radiators or baseboard. Water expands as it heats, so an **expansion tank** with an air cushion takes up the extra, and a **pressure relief valve** opens if the pressure ever passes about 30 psi. An automatic **fill valve** keeps the cold system at about 12 psi, enough to push water to the top floor. An **aquastat** (a water thermostat) keeps the boiler between its limits. Air that collects in the high points blocks the flow; let it out at each radiator's **bleed valve** with a radiator key.

## The oil burner
![How an oil burner fires (drawn for this app)](figures/home/oil-burner.svg)
One motor turns both a **fuel pump** and a **fan**. The pump draws oil from the tank through a **filter** and forces it at about 100 psi through a **nozzle**, which sprays it as a fine mist. A **transformer** makes a high-voltage spark across two **electrodes** at the nozzle, and the mist bursts into flame in the stream of air from the fan. A **cad cell**, a light sensor, watches for the flame; if it sees none within a few seconds, the **primary control** shuts the burner down and it stays off until someone presses the red **reset** button. Press it once, never over and over: each try sprays oil into the firebox, and a pool of it can light with a dangerous puff.

Fuel oil collects water from condensation in the tank, which rusts the tank and grows sludge. The filter catches it, so it's changed at every yearly service; after a change, or after running out of oil, the air in the line has to be **bled** out at the pump before the burner will run.

## Heat pumps
![A heat pump in heating mode (drawn for this app)](figures/home/heat-pump.svg)
A liquid's boiling point rises with pressure. A heat pump's refrigerant boils at well below zero at low pressure, so even cold outdoor air is warm enough to boil it in the **outdoor coil**, and as it boils it soaks up heat. The **compressor** squeezes the gas, which makes it hot, and in the **indoor coil** it gives that heat to the house air and condenses back to liquid. The **expansion valve** drops the pressure again and the loop repeats. A **reversing valve** runs it backward in summer, which makes it an air conditioner.

Because it moves heat instead of making it, a heat pump delivers two to four units of heat for each unit of electricity: its **coefficient of performance** (COP) is 2 to 4, against exactly 1 for electric resistance heat. Its output falls as the outdoor air gets colder, so in cold weather it is backed up by electric **strip heat** (often shown as "aux" or "emergency heat") or a furnace. It also runs a **defrost** cycle now and then to melt frost off the outdoor coil.

A **ground-source** (geothermal) heat pump trades heat with the ground through buried loops of pipe. A few feet down, the ground stays near the year's average air temperature, which is far warmer than winter air and cooler than summer air, so it works more efficiently, but the loops cost a lot to install: **horizontal** loops in long trenches where there's land, **vertical** loops in deep wells where there isn't, and coiled **slinky** loops to fit more pipe into shorter trenches.

A **mini-split** heat pump has no ducts: refrigerant lines run from the outdoor unit to a head on the wall of each room.

## Getting the heat around
- **Hydronic**: in a **series loop**, the water flows through each baseboard in turn, so the last room gets the coolest water; a **one-pipe** system with special diverter tees lets each radiator take a share; a **two-pipe** system feeds each radiator from a supply main and returns it on a separate pipe. Each **zone** has its own thermostat and its own pump or zone valve.
- **Warm air**: supply ducts to registers, usually on outside walls under windows; return grilles bring air back.
- **Radiant floor**: warm water in plastic tubing in or under the floor. A thick concrete slab stores a great deal of heat, so it's steady but slow to respond; tubing in a thin floor responds faster.

## Thermostats
An old round thermostat uses a **bimetal coil**, two metals bonded together that expand by different amounts, so the coil winds and unwinds with temperature and tips a small glass bulb of **mercury** that makes or breaks the circuit. Those mercury bulbs must go to a hazardous-waste collection, never the trash. A **programmable** (clock) thermostat lowers the heat while you sleep or are out: the Department of Energy says turning it back 7 to 10°F for 8 hours a day saves up to about 10% a year on heating and cooling.

## Before calling the serviceman
- **Dead, no sound**: check the breaker and the furnace's own service switch (often a light switch on or near it, sometimes with a red cover plate).
- **Sounds but won't fire (oil)**: check the oil gauge (below ⅛ may really be empty); press the reset button once.
- **Fires, then shuts down (oil)**: often a clogged oil filter or air in the line.
- **Heat pump won't run**: check its breaker. **Runs but heats poorly**: clean the filter and both coils, and clear leaves, snow and shrubs from the outdoor unit.
- **And**: have the furnace or boiler serviced at the start of every heating season.
:::

## A gas furnace, step by step
- When the thermostat calls for heat, the first thing a modern gas furnace starts is its {{inducer|which fan?}} (draft) fan, which clears the flue.
- Many modern furnaces light the gas with a {{hot-surface igniter|what?}}, a small element that glows red-hot.
- A furnace's blower doesn't start until the heat exchanger is warm; that's the job of the {{fan-and-limit|which?}} switch.
- If a furnace overheats, as when a dirty filter starves it of air, its {{high-limit|which?}} switch shuts off the gas.
- After the thermostat is satisfied, a furnace's blower keeps running for a while to {{cool|what?}} the heat exchanger and use up its heat.
- Fill in how a gas furnace starts:
```flow
Thermostat | Furnace | Rooms
Thermostat -> Furnace: calls for heat
Furnace: {{the inducer fan starts and clears the flue|what first?}}
Furnace: the igniter glows and the gas valve opens
Furnace: the burners fire into the heat exchanger
Furnace: {{the blower starts|what then?}}
Furnace -> Rooms: warm air through the supply ducts
```

## A hot-water boiler
- A boiler's {{circulator|what?}} is the pump that pushes hot water around the loop.
- Because water expands as it heats, a hot-water system needs an {{expansion tank|what?}} with a cushion of air.
![An expansion tank](commons:Expansion tank.jpg)
- A boiler's pressure relief valve opens at about {{30 psi|what pressure?}}.
- A boiler's fill valve keeps the cold system at about {{12 psi|what pressure?}}, enough to lift water to the top floor.
- A water thermostat that keeps a boiler between its high and low limits is an {{aquastat|what?}}.
- Air trapped in a radiator keeps it cold at the top; let it out at the {{bleed valve|what?}} with a radiator key.

## The oil burner
- In an oil burner, one motor turns both the {{fuel pump|what?}} and the fan.
- An oil burner's {{nozzle|which part?}} sprays the oil as a fine mist so it burns cleanly.
- The spark that lights an oil burner comes from a {{transformer|what?}} and jumps between two electrodes.
- The light sensor that tells an oil burner's control whether there's a flame is the {{cad cell|what?}}.
![How an oil burner fires (drawn for this app)](figures/home/oil-burner.svg)
- If no flame is seen within a few seconds, the oil burner's {{primary control|what?}} shuts it down until it's reset.
![An oil burner on a home furnace](commons:Home oil furnace.jpg)
- Press an oil burner's reset button only {{once|how many times?}}: each try sprays more oil into the firebox, which can light with a dangerous puff.
- Fuel oil picks up {{water|what?}} from condensation in the tank, which rusts the tank and grows sludge.
- After changing an oil filter or running out of oil, the air in the line must be {{bled|what?}} out at the pump before the burner will run.

## Heat pumps
- A heat pump works because a liquid's {{boiling point|what?}} rises when its pressure rises.
- In winter, the refrigerant boils in a heat pump's {{outdoor|which?}} coil, soaking up heat even from cold air.
![A heat pump in heating mode (drawn for this app)](figures/home/heat-pump.svg)
also in: Cooling
- The {{reversing valve|which part?}} sends a heat pump's refrigerant the other way to cool in summer.
also in: Cooling
- Heat delivered divided by electricity used is a heat pump's {{coefficient of performance|what?}} (COP), usually 2 to 4.
- Electric resistance heat has a coefficient of performance of exactly {{1|what number?}}: one unit of heat per unit of electricity.
- A heat pump's seasonal heating efficiency is rated by its {{HSPF (heating seasonal performance factor)|which rating?}}.
- Electric heat that backs up a heat pump in very cold weather is {{strip heat|what?}}, often labeled "aux" or "emergency heat".
- Now and then a heat pump runs briefly in cooling mode to melt frost off the outdoor coil: its {{defrost|what?}} cycle.
- Air conditioners and heat pumps are sized in {{tons|what unit?}}: one is 12,000 Btu an hour, the heat it takes to melt a ton of ice in a day.
also in: Cooling
- Several feet down, the ground stays near the year's {{average|what?}} air temperature, which is why ground-source heat pumps are so efficient.
- Ground-source loops laid in long trenches are {{horizontal|which kind?}} loops; where land is short, they go in deep wells as vertical loops.
- Ground-source pipe laid in overlapping coils to fit more into a shorter trench is a {{slinky|what kind?}} loop.
- A ductless heat pump with a separate head on the wall of each room is a {{mini-split|what?}}.
![A mini-split's outdoor unit](commons:Heat pump on balcony.jpg)
also in: Cooling

## Getting the heat around
- In a {{series loop|what kind?}} of hydronic baseboard, water flows through each baseboard in turn, so the last room gets the coolest water.
- A {{one-pipe|what kind?}} hydronic system uses special diverter tees so each radiator draws a share of water from a single main.
- A part of the house with its own thermostat and its own pump or valve is a {{zone|what?}}.
- Warm-air supply registers usually sit on {{outside|which?}} walls, under windows, to warm the coldest surfaces.
- In radiant floor heating, warm water runs through flexible plastic {{PEX|what kind?}} tubing.
![Radiant floor tubing before it is covered](commons:Underfloor heating pipes.jpg)
- A radiant floor in a thick concrete slab is steady but {{slow|fast or slow?}} to respond, because the slab stores so much heat.

## Thermostats
- An old round thermostat senses temperature with a {{bimetal|what?}} coil that winds and unwinds as it warms and cools.
![A round thermostat](commons:Honeywell round thermostat.jpg)
- In an old thermostat, a small glass bulb of {{mercury|what?}} tips to make or break the circuit.
![A mercury switch](commons:Mercury Switch without housing.jpg)
- An old mercury thermostat must go to a {{hazardous waste|what kind of?}} collection, never the trash.
- A {{programmable|what kind?}} thermostat turns the heat down by itself at night and while you're out.
![A programmable thermostat](commons:Lux Products TX9600TS Thermostat.jpg)
- Turning the heat back 7 to 10°F for 8 hours a day saves up to about {{10%|how much?}} a year, by the Department of Energy's estimate.

## Before calling the serviceman
- If a furnace is completely silent, check its breaker and the {{service switch|what?}} on or near it, which looks like a light switch.
- Before pressing an oil burner's reset, check the {{oil gauge|what?}}: a tank reading below ⅛ may really be empty.
- An oil burner that fires and then shuts down often has a clogged {{filter|what?}} or air in the line.
- A heat pump that runs but heats poorly needs its filter and both {{coils|what?}} cleaned, and leaves and shrubs cleared from the outdoor unit.
- Have a furnace or boiler {{serviced|what?}} at the start of every heating season.
