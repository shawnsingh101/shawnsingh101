---
title: TLS
chapter: 7
objectives: 1.4, 3.3
---
Putting it all together: how TLS uses certificates, key agreement, symmetric encryption and hashing to make HTTPS, and what the padlock does and doesn't promise.

:::lesson
## What it is
**TLS** (Transport Layer Security) encrypts the connection between two programs: most often your browser and a website. **HTTPS** is simply HTTP inside a TLS connection, on port 443. TLS also protects email between servers, app traffic, and much more.

TLS replaced **SSL** (Secure Sockets Layer). Every version of SSL, and TLS 1.0 and 1.1, are now deprecated; use TLS **1.2** or **1.3** (published in 2018). People still say "SSL certificate" out of habit.

## What it gives you
- **Confidentiality**: the data is encrypted, so the café Wi-Fi and everyone else along the path see only gibberish.
- **Integrity**: any tampering on the way is detected.
- **Authentication**: the server's certificate proves you're talking to the real site, not an impostor in the middle.

## The handshake (TLS 1.3, simplified)
Every earlier lesson appears in it. Step through:

```flow
# The TLS 1.3 handshake
Browser | Server
Browser -> Server: ClientHello: the TLS versions and ciphers I support, and my key share
Server -> Browser: ServerHello: the cipher we'll use, and its own key share
Server -> Browser: its certificate, and a signature made with its private key
Browser: checks the certificate chain up to a trusted root CA, and the signature
Browser: computes the session key from the two key shares (Diffie–Hellman); the server does the same
Browser -> Server: Finished. From here on, everything is encrypted with the shared session key
```

![The full TLS 1.3 handshake, as engineers draw it](commons:Full TLS 1.3 Handshake.svg)

- The **certificate** (lesson 4) proves the server's identity.
- **Diffie–Hellman** (lesson 2) agrees on a fresh session key that never crosses the network: forward secrecy.
- **Symmetric encryption** (lesson 1), usually AES, encrypts the data itself, because it's fast.
- **Hashing** (lesson 3) protects the integrity of every message.

Asymmetric cryptography is used only in the handshake; the data is all symmetric. That's hybrid encryption in action.

## Where it fits
TLS protects data **in transit**, between two programs. Once the data reaches the server it's data at rest, and needs other protection. Its relatives: a **VPN** (virtual private network) encrypts all traffic between a device and a network; **SSH** protects remote command-line logins.

> The padlock means the connection is encrypted to the site named in the address bar. It doesn't mean the site is honest: phishing sites get certificates too, for free, in minutes.

> Often confused: in a **downgrade attack**, someone in the middle tricks both sides into using an old, weak version or cipher. TLS 1.3 removed the weak options and protects the handshake against this.
:::

## The protocol
- TLS stands for {{Transport Layer Security|what?}}.
- HTTPS is HTTP inside a {{TLS|which protocol?}} connection.
![The TLS 1.3 handshake](commons:Full TLS 1.3 Handshake.svg)
- TLS replaced {{SSL (Secure Sockets Layer)|which protocol?}}, now deprecated.
- The newest version of TLS is {{1.3|which version?}}, published in 2018.

## The handshake
- Fill in what the server sends to prove who it is:
```flow
Browser | Server
Browser -> Server: ClientHello, with its key share
Server -> Browser: ServerHello, with its key share
Server -> Browser: its {{certificate|what?}}, and a signature made with its private key
Browser: checks it up to a trusted root CA
```
- In TLS 1.3 both sides compute the session key with {{Diffie–Hellman|which method?}}, so the key never crosses the network.
- TLS encrypts the data itself with {{symmetric|which kind of?}} encryption, because it's fast.

## What it does and doesn't do
- TLS protects data {{in transit|in which state?}}, not data stored on the server.
- The padlock means the connection is encrypted, not that the site is {{honest|what?}}: phishing sites use TLS too.
- Tricking both sides into an old, weak version of a protocol is a {{downgrade|what kind of?}} attack.
