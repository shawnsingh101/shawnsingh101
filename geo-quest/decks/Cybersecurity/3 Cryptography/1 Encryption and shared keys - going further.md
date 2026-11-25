---
title: Encryption and shared keys: going further
depth: deep
chapter: 7
objectives: 1.4, 3.3
---
Symmetric encryption in practice: which state of data a tool protects, where keys live, and why key length and key count matter.

## Which state of data?
- Full-disk encryption on a stolen laptop protects data {{at rest|in which state?}}.
- Data in use is the hardest to protect: it has to be decrypted in {{memory|where?}} to be worked on.

## Keys in practice
- A chip on a laptop's motherboard that holds its disk-encryption keys is a {{TPM (Trusted Platform Module)|what?}}.
- A dedicated, tamper-resistant device that stores and uses an organization's keys without ever releasing them is an {{HSM (hardware security module)|what?}}.
- Ten people who each need a private symmetric key with every other person need {{45|how many?}} keys.
- Trying every possible key until one works is a {{brute-force|what kind of?}} attack.
- A 256-bit AES key is safe from brute force; a {{56-bit|how long?}} DES key is not.

## Kinds of cipher
- A block cipher encrypts fixed-size blocks; a {{stream|what kind of?}} cipher, like ChaCha20, encrypts data a byte at a time.
