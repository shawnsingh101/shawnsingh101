---
title: CIA, AAA and non-repudiation
chapter: 1
objectives: 1.2
---
The goals every security control serves: confidentiality, integrity and availability; how systems decide who you are and what you may do; and proof that can't be denied.

:::lesson
## The three goals
Security has three goals, the **CIA triad**:
- **Confidentiality**: only the right people can read it. Threat: disclosure. Tools: encryption, access control.
- **Integrity**: it hasn't been changed without permission. Threat: alteration. Tools: hashing, signatures.
- **Availability**: it's there when needed. Threat: destruction or denial of service. Tools: backups, redundancy.

The opposite of each, **DAD** (disclosure, alteration, denial), is how attackers win. Every control in this course protects at least one corner of the triangle.

```stack
# The CIA triad
C | Confidentiality | only the right people can read it
I | Integrity | unchanged without permission
A | Availability | there when it's needed
```

## AAA: who are you, and what may you do?
Before a system lets anyone in, it works through **AAA**:
1. **Authentication**: prove who you are (a password, a code, a fingerprint). Claiming a name is **identification**; proving it is authentication.
2. **Authorization**: decide what you may do once in (read this folder, not that one).
3. **Accounting**: record what you did (logs), so it can be reviewed later.

Devices are authenticated too: a laptop joining a company network can present a **certificate**, so the network knows the machine as well as the person.

## Proof that sticks
**Non-repudiation** means someone can't credibly deny an action. A **digital signature** gives it: only the holder of the private key could have made it. A shared password doesn't, since anyone who knew it could have acted.

> Often confused: authentication proves *who you are*; authorization decides *what you may do*. A hotel key card is checked at the front desk (authentication), then opens only your room (authorization).
:::

## The three goals
- The three goals of security, confidentiality, integrity and availability, are the {{CIA triad|what?}}.
- Keeping data readable only by the right people is {{confidentiality|which goal?}}.
- Making sure data hasn't been changed without permission is {{integrity|which goal?}}.
- Keeping systems and data there when they're needed is {{availability|which goal?}}.
- The attacker's opposite of CIA: disclosure, alteration and denial, or {{DAD|what?}}.

## Three steps in
- The three steps a system takes, authentication, authorization and accounting, are called {{AAA|what?}}.
- Proving you are who you claim to be is {{authentication|which step?}}.
- Deciding what you may do once you're in is {{authorization|which step?}}.
- Recording what each user did, in logs, is {{accounting|which step?}}.
- Claiming an identity, by typing a username, is {{identification|what?}}: proving it comes next.
- A laptop can prove it's a company machine by presenting a {{certificate|what?}}.

## Proof that sticks
- Being unable to credibly deny an action you took is {{non-repudiation|what?}}.
- {{Digital signatures|what?}} give non-repudiation, because only the private key's holder could have made one.
