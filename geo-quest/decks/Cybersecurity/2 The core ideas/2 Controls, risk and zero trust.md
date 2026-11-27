---
title: Controls, risk and zero trust
chapter: 1
objectives: 1.1, 1.2
---
The kinds of control, how they're layered, the language of risk, and why modern networks trust nothing by default.

:::lesson
## Kinds of control
A **security control** is anything that reduces risk. Controls are sorted two ways.

By **category** (who or what carries them out):

| Category | What it is | Example |
| --- | --- | --- |
| Technical | done by technology | a firewall, encryption |
| Managerial | policies and plans | a risk assessment, a security policy |
| Operational | done by people | guards, training, log reviews |
| Physical | in the real world | locks, fences, cameras |

By **type** (what they do): **preventive** (stop it: a lock), **deterrent** (discourage it: a warning sign), **detective** (notice it: an alarm, a log), **corrective** (fix it after: restoring a backup), **compensating** (a substitute when the normal control isn't possible), and **directive** (tell people what to do: a policy).

## Defense in depth
No control is perfect, so they're layered: **defense in depth**. If the firewall misses an attack, the endpoint software may catch it; if not, the logs may. An attacker has to beat every layer.

## The words of risk
- A **vulnerability** is a weakness (unpatched software).
- A **threat** is something that could exploit it (a criminal group, a flood).
- **Risk** is how likely it is to happen and how bad it would be: likelihood × impact.
- An **exploit** is the actual method of using a vulnerability.

## Trusting nothing
Old networks trusted anything inside the walls. **Zero trust** assumes the attacker may already be inside: **never trust, always verify**. Every request is checked, every time, against who is asking, from what device, for what. A **policy engine** decides; a **policy enforcement point** sits in front of the resource and carries the decision out.

> Often confused: a threat is *who or what* might attack; a vulnerability is *the weakness* they'd use. No vulnerability, no risk, however many threats.
:::

## Kinds of control
- A firewall is a {{technical|which category?}} control.
- A security policy or a risk assessment is a {{managerial|which category?}} control.
- Security guards and awareness training are {{operational|which category?}} controls.
- A fence or a door lock is a {{physical|which category?}} control.
- A control that stops an attack before it happens is {{preventive|which type?}}.
- A control that notices an attack, like an alarm or a log, is {{detective|which type?}}.
- Restoring from backup after an attack is a {{corrective|which type?}} control.
- A warning sign that discourages an intruder is a {{deterrent|which type?}} control.
- A substitute put in place when the usual control isn't possible is a {{compensating|which type?}} control.

## Layers
- Layering controls so an attacker has to beat several is defense in {{depth|what?}}.
```stack
# Defense in depth
5 | Data | encryption, backups
4 | Application | secure code, input checks
3 | Endpoint | antimalware, patching
2 | Network | firewalls, segmentation
1 | Perimeter and physical | locks, guards, gateways
```

## Risk
- A weakness that could be exploited is a {{vulnerability|what?}}.
- Something that could exploit a weakness, like a criminal group or a flood, is a {{threat|what?}}.
- Risk is likelihood times {{impact|what?}}.

## Trusting nothing
- The model that trusts nothing inside or outside the network by default is {{zero trust|what?}}.
- Zero trust's motto: never trust, always {{verify|what?}}.
- In zero trust, the gatekeeper in front of a resource that carries out the access decision is the policy {{enforcement point|what?}}.
