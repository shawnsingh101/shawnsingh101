---
title: Encryption and shared keys
chapter: 7
objectives: 1.4, 3.3
---
What encryption is, how one shared secret key protects data, why AES is everywhere, and the problem that shared keys can't solve on their own.

:::lesson
## What encryption is
**Encryption** scrambles readable **plaintext** into unreadable **ciphertext**; **decryption** turns it back. It takes two things: an algorithm (the **cipher**), which is public, and a **key**, which is secret. Good cryptography assumes the attacker knows exactly how the cipher works: everything rests on the key.

## Symmetric encryption: one shared key
In **symmetric** encryption the same key locks and unlocks. It's fast, so it does nearly all the real work: encrypting disks, files, and the data in every secure web connection.

```flow
# Symmetric encryption
Alice | Eve (listening) | Bob
Alice: encrypts "Meet at noon" with the key she shares with Bob → x7#qP9…
Alice -> Bob: x7#qP9…
Eve (listening): sees x7#qP9… on the way, but without the key it's gibberish
Bob: decrypts with the same shared key → "Meet at noon"
```

The standard today is **AES** (Advanced Encryption Standard), chosen by the US government in 2001 and used worldwide. It's a **block cipher**: it encrypts data in 128-bit blocks, with keys of 128, 192 or 256 bits. Its predecessor, **DES** (Data Encryption Standard), had a 56-bit key, short enough to be cracked by brute force in the late 1990s; its stopgap, 3DES, has been retired too.

Key length matters because an attacker without the key can only try every key. Each extra bit **doubles** the number of keys to try: a 128-bit key has 2¹²⁸ possibilities, more than any computer could try in the age of the universe.

## The catch: sharing the key
Both sides need the same key, and it has to reach them secretly: sent across the network, it could be intercepted. And every pair of people needs its own key: 100 people need 4,950 of them. This is the **key distribution problem**, and public-key cryptography, the next lesson, was invented to solve it.

## Where it fits: the three states of data
Security people talk about protecting data in three states:
- **At rest**: stored, on a disk or in a database. Protected by full-disk encryption (BitLocker on Windows, FileVault on Mac) or by encrypting files and databases.
- **In transit**: moving across a network. Protected by TLS, VPNs and SSH.
- **In use**: in memory, being worked on. The hardest to protect; it takes special hardware such as secure enclaves.

> Often confused: **encoding** isn't encryption. Base64, for example, just rewrites data in another form; there's no key, and anyone can reverse it. And **hashing**, two lessons on, isn't encryption either: it can't be reversed at all.
:::

## The idea
- Encryption turns readable {{plaintext|what?}} into unreadable ciphertext.
- Readable plaintext becomes unreadable {{ciphertext|what?}}.
- In strong cryptography the cipher is public; only the {{key|what?}} must stay secret.

## One key
- In {{symmetric|what kind of?}} encryption, the same key encrypts and decrypts.
- Fill in what Bob uses:
```flow
Alice | Bob
Alice: encrypts with the key she shares with Bob
Alice -> Bob: the ciphertext
Bob: decrypts with {{the same shared key|which key?}}
```
- {{AES|which cipher?}} (Advanced Encryption Standard) is today's standard symmetric cipher.
- AES keys are 128, 192 or {{256|how many?}} bits long.
- {{DES|which cipher?}} (Data Encryption Standard), with its 56-bit key, was cracked by brute force in the late 1990s.
- Each extra bit of key length {{doubles|does what to?}} the number of keys an attacker must try.
- Getting a shared key to both sides secretly is the key {{distribution|what?}} problem.

## States of data
- Data stored on a disk is data {{at rest|in which state?}}.
- Data crossing a network is data {{in transit|in which state?}}.
- Data in memory, being processed, is data {{in use|in which state?}}.
- {{Base64|which?}} is encoding, not encryption: there's no key, and anyone can reverse it.
