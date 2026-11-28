---
title: Service entrance - going further
depth: deep
---
The Electrical deep dive, part 1: how a circuit works (volts, amps, ohms and watts), measuring them with a multimeter, where 120 and 240 volts come from, what the meter counts, grounding and bonding, and what to check before calling about an outage. The order follows the wiring chapter of Charlie Wing's *How Your House Works*; the cards are written in our own words from Wikipedia and standard references.

:::lesson
## A circuit
Electricity flows only around a **closed loop**: out from the source on one wire, through the **load** (a bulb, a motor), and back on another. A **switch** opens the loop to stop the flow. Three quantities describe it:

| Quantity | Unit | Like water in a pipe |
|---|---|---|
| Voltage (V) | volt | the pressure pushing it |
| Current (I) | ampere (amp) | how much flows per second |
| Resistance (R) | ohm (Ω) | how narrow the pipe is |

**Ohm's law** ties them together: $V = I \times R$. **Power**, the rate of using energy, is $P = V \times I$, in watts. The utility bills for **energy**: power times time, in kilowatt-hours (kWh). A 100-watt bulb left on for 10 hours uses 1 kWh.

## Where 120 and 240 come from
The transformer on the pole has a center-tapped winding. Its two ends become the house's two **hot** legs, and its center becomes the **neutral**, bonded to the earth. Each hot swings 120 volts above and below the neutral, but in opposite directions at every instant, so between the two hots there are **240 volts**. A dryer or range uses all three: 240 V for the heating element, 120 V for the timer, light and motor.

## Grounding and bonding
**Grounding** connects the system to the earth (ground rods, the water pipe), which steadies its voltage and carries off lightning and utility surges. **Bonding** connects every metal part that could become energized (boxes, pipes, appliance frames) back to the panel's neutral bar, so a fault draws a big current and trips the breaker at once instead of leaving the metal live. The neutral and the ground meet only once, in the main panel.
:::

## A circuit
- Electricity flows only when there is a complete loop from the source and back: a {{closed circuit|what?}}.
- The thing in a circuit that uses the power, like a bulb or motor, is the {{load|what?}}.
- Electrical pressure is measured in {{volts|what unit?}}.
- The rate at which charge flows is the current, measured in {{amperes|what unit?}} (amps).
- How strongly something opposes the flow of current is its resistance, measured in {{ohms|what unit?}}.
- Ohm's law: voltage equals current times {{resistance|what?}}: $V = I \times R$.
- A 120-volt circuit feeding a 12-ohm heater carries {{10 amps|how much current?}}.
> $I = V / R = 120 / 12 = 10$ A.
- Electrical power, in watts, is voltage times {{current|what?}}: $P = V \times I$.
- A 1,500-watt space heater on a 120-volt circuit draws {{12.5 amps|how much current?}}.
> $I = P / V = 1500 / 120 = 12.5$ A: most of a 15-amp circuit, which is why heaters trip breakers.

## Energy and the bill
- The utility bills for energy used, in {{kilowatt-hours|what unit?}}.
- A 100-watt bulb left on for 10 hours uses {{1 kilowatt-hour|how much energy?}}.
- An old electromechanical meter is a small motor: its spinning {{disk|which part?}} turns faster the more power the house uses.
![An electromechanical meter with its disk](commons:Yipwm 1b (7691592010).jpg)
- The dials on an old meter are read left to right, taking the {{lower|higher or lower?}} number when a pointer sits between two.
- A smart meter's readings also let the utility see {{outages|what?}} at once and charge different rates by time of day.

## Measuring
- To measure voltage, a multimeter's probes go {{across|across or in line?}} the two points, with the circuit on.
![A multimeter](commons:Multimeter-4254e.jpg)
- To measure current, a basic multimeter must be connected {{in series|how?}}, so the current flows through the meter.
- Resistance and continuity are measured only with the power {{off|on or off?}}.
- A {{clamp meter|which tool?}} measures the current in a wire by closing its jaws around it, without breaking the circuit.
- Batteries make {{direct current|which kind?}} (DC), which flows one way; house wiring carries alternating current (AC).
- North American house current alternates {{60|how many?}} times a second (60 hertz).

## 120 and 240
- The two hot wires of a house service are each 120 volts from the neutral, but {{opposite|same or opposite?}} in sign at every instant, so between them there are 240 volts.
- The house's 120 and 240 volts come from a {{center-tapped|what kind?}} winding in the utility's transformer, whose middle becomes the neutral.
- An electric range or dryer uses {{both|120, 240 or both?}}: 240 volts for the heating element and 120 for the timer, light and motor.

## Earth and metal
- Connecting the electrical system to the earth, with ground rods and the water pipe, is {{grounding|what?}}.
- Connecting all the metal that could become live (boxes, pipes, appliance frames) back to the panel, so a fault trips the breaker at once, is {{bonding|what?}}.
- The neutral and ground wires are joined in only one place: the {{main panel|where?}}.
- A two-slot outlet with no ground hole is on an {{ungrounded|what kind?}} circuit, common in houses wired before the 1960s.
> A GFCI can be installed there instead and labeled "No equipment ground": it protects people even without a ground wire.

## When the power goes out
- When the power goes out, before calling the utility, check these, in order:
```parts
next door :: do the neighbors have power?
the panel :: has a breaker tripped? reset it
the rest of the house :: do other circuits work? then the problem is inside
the top of the panel :: reset the main breaker
```
- A breaker that trips again as soon as it is reset means an {{overload or short circuit|what?}} on that circuit.
