---
title: Hashing
chapter: 7
objectives: 1.4, 2.4
---
A fingerprint for data: what a hash function is, why it can't be reversed, how passwords are stored with salt, which hashes are broken, and HMAC.

:::lesson
## A fingerprint for data
A **hash function** turns any input, a word or a whole movie, into a short value of fixed length, called a **hash** or **digest**. SHA-256 always gives 256 bits, written as 64 hexadecimal characters:

```text
SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
SHA-256("Hello") = 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
```

![A hash function: inputs of any length become fixed-length digests, and a small change makes a completely different one](commons:Cryptographic Hash Function.svg)

One capital letter changed every character. A good hash function is:
- **One-way**: you can't work back from the hash to the input.
- **Deterministic**: the same input always gives the same hash.
- **Avalanche**: a tiny change to the input changes the hash completely.
- **Collision-resistant**: it's infeasible to find two different inputs with the same hash.

## What it's for
- **Integrity**: a download page lists the file's hash; hash what you downloaded and compare. If they match, not a single bit changed.
- **Passwords**: a site stores the hash of your password, never the password. When you log in, it hashes what you typed and compares.
- **Digital signatures** sign a message's hash rather than the whole message (next lesson).

## Storing passwords: salt and stretching
The same password always gives the same hash, so attackers precompute hashes of millions of likely passwords, **rainbow tables**, and look stolen hashes up. A **salt** defeats them: a random value added to each password before hashing, and stored beside the hash. Two people with the same password now get different hashes, and precomputed tables are useless.

**Key stretching** slows guessing further by hashing thousands of times over: bcrypt, PBKDF2 and Argon2 are made for this. A login that takes a tenth of a second is nothing to a user, and crippling to someone trying billions of guesses.

## Broken hashes
**MD5** (128-bit) and **SHA-1** (160-bit) are broken: researchers can create collisions, two different files with the same hash, and the first practical SHA-1 collision was shown in 2017. Neither should be used for security today. Use the **SHA-2** family (SHA-256, SHA-512) or **SHA-3**.

## HMAC: a hash with a key
A plain hash proves a file is unchanged, but anyone can compute a hash. An **HMAC** (hash-based message authentication code) mixes a secret key into the hash, so it also proves the sender had the key: integrity and authenticity together.

> Often confused: hashing isn't encryption. Encryption has a key and can be reversed; hashing has no key and no way back.
:::

## What a hash is
- A hash function turns any input into a short fixed-length value called a {{digest|what?}}.
![A hash function: any input in, a fixed-length digest out](commons:Cryptographic Hash Function.svg)
- Hashing is {{one-way|which way?}}: you can't get the input back from the hash.
- {{SHA-256|which hash function?}} always produces a 256-bit hash.
- Changing one character of the input changes the whole hash: the {{avalanche|what?}} effect.
- Two different inputs with the same hash is a {{collision|what?}}.

## Uses
- Comparing a downloaded file's hash with the published one proves its {{integrity|what?}}.
- Websites should store a {{hash|what?}} of your password, never the password itself.
- An {{HMAC (hash-based message authentication code)|what?}} mixes a secret key into a hash, proving who sent it as well as that it's unchanged.

## Storing passwords
- A random value added to each password before hashing is a {{salt|what?}}.
- Salting defeats {{rainbow tables|what?}}: precomputed lists of password hashes.
- bcrypt, PBKDF2 and Argon2 slow password guessing by hashing many times over: key {{stretching|what?}}.

## Broken hashes
- {{MD5|which hash function?}} and SHA-1 are broken: collisions can be created, so they're no longer used for security.
