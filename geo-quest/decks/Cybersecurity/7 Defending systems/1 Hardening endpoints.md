---
title: Hardening endpoints
chapter: 11
objectives: 2.5, 4.1
---
Making computers and phones harder to attack: shrinking what's exposed, patching, the software that guards them, and controlling what may run.

:::lesson
## Hardening
**Hardening** shrinks the **attack surface**, everything an attacker could reach:
- Remove software and close ports and services nobody uses.
- Change **default passwords** (a router's "admin/admin" is the first thing tried).
- Apply a **secure baseline**: a written standard configuration, checked against benchmarks like the **CIS Benchmarks**.
- **Patch**: install vendors' fixes promptly, test first where a bad patch could break things.

## Guarding the endpoint
- **Antivirus / antimalware** matches known malware.
- **EDR** (endpoint detection and response) records what happens on each machine and spots suspicious *behavior*, then can isolate the machine. **XDR** extends this across email, network and cloud.
- **Host-based firewalls** and **host-based IPS** protect each machine on its own.
- **Full-disk encryption** protects a lost laptop; the key is often kept in the **TPM** (trusted platform module), a chip on the motherboard.

## Controlling what runs
An **allow list** (application allow listing) lets only approved programs run: strong, but work to maintain. A **block list** stops known-bad ones: easy, but misses anything new.

## Phones and fleets
**Mobile device management (MDM)** lets a company set rules on phones: a passcode, encryption, remote wipe. **BYOD** (bring your own device) splits the phone into work and personal parts (**containerization**). **Jailbreaking** or **rooting** a phone removes its built-in protections; **sideloading** installs apps from outside the official store.

## Secure boot
**Secure boot** checks that each piece of start-up software is signed before running it, so a rootkit can't load first. **Measured boot** records each step in the TPM for later checking.

> Often confused: antivirus looks for known files; EDR watches what programs do, so it can catch new and fileless attacks.
:::

## Less to attack
- Everything an attacker could reach on a system is its attack {{surface|what?}}.
- Shrinking a system's attack surface is {{hardening|what?}}.
- Before a new router goes live, change its {{default password|what?}}.
- A written standard configuration that systems are checked against is a secure {{baseline|what?}}.

## Guarding
- Endpoint software that watches behavior and can isolate a machine is {{EDR (endpoint detection and response)|what?}}.
- The chip on the motherboard that stores encryption keys is the {{TPM (trusted platform module)|what?}}.
- Encrypting a whole laptop drive protects data if the laptop is {{lost or stolen|what happens?}}.

## What runs
- Letting only approved programs run is an {{allow list|what?}}.
- Checking that start-up software is signed before it runs is secure {{boot|what?}}.

## Phones
- Software that lets a company enforce passcodes and wipe lost phones is {{MDM (mobile device management)|what?}}.
- Splitting a personal phone into separate work and personal areas is {{containerization|what?}}.
- Installing an app from outside the official app store is {{sideloading|what?}}.
- Removing an iPhone's built-in restrictions is {{jailbreaking|what?}}.
