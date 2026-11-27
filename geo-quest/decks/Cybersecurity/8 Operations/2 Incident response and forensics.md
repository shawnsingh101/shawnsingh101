---
title: Incident response and forensics
chapter: 14
objectives: 4.8
---
When an attack happens: the steps of a response, handling evidence so it holds up, and planning to keep the business running.

:::lesson
## The response
Most organizations follow the NIST lifecycle, in order:

```flow
# Incident response
Team | Systems
Team: preparation: plans, tools, training, before anything happens
Team -> Systems: detection: an alert or report is confirmed as an incident
Team: analysis: what happened, how far it spread
Team -> Systems: containment: isolate affected machines so it stops spreading
Team -> Systems: eradication: remove the malware and close the way in
Team -> Systems: recovery: restore from clean backups, watch closely
Team: lessons learned: what to change next time
```

Contain *before* eradicating: pulling malware off one machine while it's spreading to ten is wasted effort.

**Tabletop exercises** walk the team through a scenario on paper; **simulations** play it out. **Threat hunting** looks for attackers who haven't set off any alarm.

## Evidence
Collect the most fleeting evidence first, the **order of volatility**: CPU registers and cache, then memory (RAM), then disk, then logs kept elsewhere, then backups. Pull the plug first and the RAM, with its running malware, is gone.

Make a **forensic image** (a bit-for-bit copy) and work only on the copy; a **hash** of the original proves the copy is exact. Record every hand the evidence passes through, the **chain of custody**, or it may not hold up in court. A **legal hold** stops anyone deleting data that a lawsuit may need.

## Keeping the business running
- **RTO** (recovery time objective): how long a system can be down.
- **RPO** (recovery point objective): how much data, in time, you can afford to lose; it sets how often you back up.
- **Hot site**: a ready-to-run copy, live in minutes. **Warm site**: equipment ready, data must be loaded. **Cold site**: just space and power.

> Often confused: RTO is about time *down*; RPO is about data *lost*.
:::

## The steps
- The first phase of incident response, before anything happens, is {{preparation|what?}}.
- Isolating infected machines so the attack stops spreading is {{containment|which phase?}}.
- Removing the malware and closing the way in is {{eradication|which phase?}}.
- Restoring systems from clean backups is {{recovery|which phase?}}.
- The last phase, deciding what to change next time, is lessons {{learned|what?}}.
- Talking a team through an incident scenario around a table is a {{tabletop|what kind of?}} exercise.
- Searching for attackers who haven't triggered any alert is threat {{hunting|what?}}.

## Evidence
- Collecting the most fleeting evidence first follows the order of {{volatility|what?}}.
- Between the hard drive and the running memory, collect {{the memory (RAM)|which first?}} first.
- The record of everyone who handled a piece of evidence is the {{chain of custody|what?}}.
- A {{hash|what?}} of the original drive proves a forensic copy is exact.
- An order to preserve data a lawsuit may need is a legal {{hold|what?}}.

## Continuity
- How long a system may be down is its {{RTO (recovery time objective)|what?}}.
- How much data, measured in time, can be lost is the {{RPO (recovery point objective)|what?}}.
- A backup site ready to run within minutes is a {{hot|which kind?}} site; a cold site is just space and power.
