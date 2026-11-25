---
title: Public and private keys
chapter: 7
objectives: 1.4
---
Asymmetric cryptography: a key pair, one half public and one private. Which key to use when, RSA and elliptic curves, and how two strangers agree on a secret over an open network.

:::lesson
## Two keys that work as a pair
In **asymmetric** (public-key) cryptography, everyone has a **key pair**: a **public key** they hand out to anyone, and a **private key** they never share. The two are mathematically linked: what one key locks, only the other can unlock. Think of the public key as an open padlock you give away by the hundred: anyone can snap it shut on a box, but only you have the key that opens it.

## Keeping a secret: use their public key
![Public-key encryption: anyone can encrypt with Bob's public key; only Bob's private key decrypts](commons:Public key encryption.svg)
```flow
# Sending a secret with public keys
Alice | Bob
Bob -> Alice: Here's my public key (anyone may have it)
Alice: encrypts her message with Bob's public key
Alice -> Bob: the ciphertext
Bob: decrypts with his private key, which no one else has
```

## Proving it's you: use your own private key
Turn it around: anything you lock with your *private* key can be unlocked by anyone with your public key, which proves it came from you. That's the basis of **digital signatures** (lesson 4). The rule to remember:
- To send someone a **secret**: encrypt with **their public key**.
- To **sign**, proving it's from you: use **your private key**.

## The algorithms
- **RSA** (Rivest–Shamir–Adleman, 1977) rests on how hard it is to factor a huge number back into the two primes multiplied to make it. Keys are 2,048 bits or more.
- **ECC** (elliptic-curve cryptography) uses different math to give the same strength with much smaller keys: a 256-bit ECC key is about as strong as a 3,072-bit RSA key. Smaller keys mean less computing, so ECC is the default on phones and in modern web connections.

Asymmetric encryption is hundreds to thousands of times slower than symmetric. So real systems use it only to share or agree on a symmetric key, which then encrypts the data: **hybrid** encryption. TLS works exactly this way.

## Agreeing on a secret in public: Diffie–Hellman
In 1976 Whitfield Diffie and Martin Hellman showed that two parties can each mix a private value with public ones, exchange the results in the open, and both end up with the same secret, which never crossed the network. An eavesdropper who saw everything still can't compute it.

![Diffie–Hellman as mixing paint: each side keeps a secret color, swaps the mixtures, and ends with the same final color](commons:Diffie-Hellman Key Exchange.svg)

Done with fresh values for every connection (**ephemeral** Diffie–Hellman, ECDHE in its elliptic-curve form), it gives **perfect forward secrecy**: even if a server's private key is stolen years later, past conversations stay locked.

> Often confused: the public key isn't the weak half; it's meant to be public. The private key is the one that must never leak. If it does, the key pair is ruined and has to be revoked and replaced.
:::

## The key pair
- In asymmetric encryption, everyone has a public key and a {{private|what kind of?}} key.
- Fill in which key Alice uses to send Bob a secret:
```flow
Alice | Bob
Bob -> Alice: Here's my public key
Alice: encrypts the message with {{Bob's public key|whose key, which one?}}
Alice -> Bob: the ciphertext
Bob: decrypts it with his private key
```
- When Alice encrypts a message with Bob's public key, only {{Bob's private key|which key?}} can decrypt it.
![Encrypt with the recipient's public key; only their private key decrypts](commons:Public key encryption.svg)
- To prove a message comes from her, Alice signs it with {{her own private key|whose key?}}.

## The algorithms
- {{RSA|which algorithm?}}'s security rests on how hard it is to factor very large numbers.
- {{ECC (elliptic-curve cryptography)|which?}} matches RSA's strength with much smaller keys.
- A 256-bit ECC key is about as strong as a {{3,072|how many bits?}}-bit RSA key.
- Using asymmetric cryptography to share a key, then symmetric encryption for the data, is {{hybrid|what kind of?}} encryption.

## Agreeing on a secret
- {{Diffie–Hellman|which method?}} lets two parties agree on a shared secret over an open network without ever sending it.
![Diffie–Hellman, drawn as mixing paint](commons:Diffie-Hellman Key Exchange.svg)
- With perfect forward {{secrecy|what?}}, a stolen private key can't unlock past sessions, because each one used fresh keys.
