---
title: Hashing: going further
depth: deep
chapter: 7
objectives: 1.4, 2.4
---
Hashes on the job: checking downloads, how stolen password hashes get cracked, and the attacks that hashing and salting defend against.

## Reading the evidence
- A download's SHA-256 hash doesn't match the one published: the file was {{changed or corrupted|what happened?}}, so don't run it.
- Two users with the same password have different stored hashes: the site {{salts|does what to?}} its password hashes.
- A matching hash proves a file is unchanged, not who made it: for that you need a {{digital signature|what?}}.

## Password attacks
- Websites should hash passwords rather than encrypt them, because encrypted passwords can be {{decrypted|done what to?}} by anyone who gets the key.
- Stolen hashes are guessed offline at billions per second, unless the site used a deliberately slow hash such as {{bcrypt|which?}}.
- Trying a few common passwords against many accounts, to avoid lockouts, is password {{spraying|which attack?}}.
- Collisions turn up far sooner than you'd expect, because of a probability puzzle called the {{birthday|which?}} paradox.
