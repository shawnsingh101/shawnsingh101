---
title: Public and private keys: going further
depth: deep
chapter: 7
objectives: 1.4
---
Key pairs on the job: what to do when a private key leaks, why forward secrecy matters, key escrow, safe key sizes, and the quantum question.

## When keys go wrong
- A web server's private key is stolen: its certificate must be {{revoked|what?}}, and a new key pair made.
- Without forward secrecy, an attacker who recorded encrypted traffic and later steals the server's private key can {{decrypt it|do what?}}.
- A trusted third party holding copies of keys, so encrypted data can be recovered, is key {{escrow|what?}}.

## Strength
- RSA keys shorter than {{2,048|how many?}} bits are no longer considered safe.
- Large {{quantum|what kind of?}} computers could one day break RSA and elliptic curves, which is why new algorithms built to resist them are being adopted.
- Diffie–Hellman on elliptic curves, with fresh keys for every session, is written {{ECDHE (elliptic-curve Diffie–Hellman ephemeral)|what?}}.
