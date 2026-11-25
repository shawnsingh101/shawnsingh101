---
title: Digital signatures and certificates
chapter: 7
objectives: 1.4
---
How a signature proves who wrote something and that it's unchanged, and how certificates, certificate authorities and the chain of trust tell you whose public key you're holding.

:::lesson
## Signing
A **digital signature** combines the last two lessons. To sign, you hash the message and encrypt the hash with your **private key**. Anyone can check it with your **public key**:

```flow
# Signing and checking a signature
Alice | Bob
Alice: hashes the contract, then encrypts the hash with her private key: that's the signature
Alice -> Bob: the contract, plus the signature
Bob: decrypts the signature with Alice's public key: out comes the hash Alice made
Bob: hashes the contract himself and compares: a match means it's unchanged, and from Alice
```

![Signing (top) and verifying (bottom) a digital signature](commons:Digital Signature diagram.svg)

A valid signature proves three things: the message wasn't changed (**integrity**), it came from the private key's owner (**authenticity**), and that owner can't later deny signing it (**non-repudiation**).

## But whose public key is it?
Everything rests on Bob having Alice's real public key. An attacker could hand him their own key with Alice's name on it. The answer is a **digital certificate**: a file that binds a public key to an identity, vouched for by a **certificate authority** (CA) that signs it. Certificates use a standard format, **X.509**, and hold:
- the **subject**: who it belongs to, such as `www.example.com`;
- the subject's **public key**;
- the **issuer**: the CA that signed it;
- the dates it's **valid** from and to, and a serial number;
- the CA's **signature** over all of it.

## The chain of trust
Your computer and browser come with a short list of **root CAs** they trust: the **trust store**. Root CAs keep their keys offline and rarely use them; they sign **intermediate** CAs, which sign everyday certificates:

```stack
# The chain of trust
root | Root CA | in your browser's trust store; its key kept offline
signs | Intermediate CA | signs certificates day to day
signs | www.example.com | the site's own certificate
```

Checking a site means following the chain up to a trusted root:

```flow
# Checking a certificate chain
Browser | Website | Intermediate CA | Root CA
Website -> Browser: its certificate, and the intermediate CA's certificate
Browser: checks the website's certificate with the intermediate CA's public key
Browser: checks the intermediate's certificate with the root CA's public key
Browser: the root is in its trust store, so the whole chain is trusted
Browser: checks the name matches the site and the dates are current
```

## Getting and losing a certificate
To get one, you create a key pair and send the CA a **CSR** (certificate signing request): your public key and details, signed with your private key. Variations: a **wildcard** certificate, `*.example.com`, covers every subdomain one level down; **SANs** (subject alternative names) list several names in one certificate; a **self-signed** certificate has no CA vouching for it, fine for testing, rejected by browsers.

If a private key is stolen, its certificate is **revoked** before it expires. Browsers can check a **CRL** (certificate revocation list) published by the CA, or ask in real time with **OCSP** (Online Certificate Status Protocol). With **OCSP stapling**, the server attaches a recent, CA-signed "still valid" answer itself, saving the browser the trip.

> The whole system, CAs, certificates, revocation and the rules around them, is called **PKI**: public key infrastructure.
:::

## Signatures
- A digital signature is made with the signer's {{private key|which key?}}.
- Anyone can check a signature with the signer's {{public key|which key?}}.
- To sign, you encrypt a {{hash|what?}} of the message, not the whole message.
![Signing and verifying a digital signature](commons:Digital Signature diagram.svg)
- Fill in how Bob checks Alice's signature:
```flow
Alice | Bob
Alice -> Bob: the contract, plus her signature
Bob: decrypts the signature with {{Alice's public key|whose key, which one?}}
Bob: hashes the contract himself and compares the two
```
- A valid signature means the signer can't later deny signing: {{non-repudiation|what?}}.

## Certificates
- A digital certificate binds a {{public key|what?}} to an identity.
- Certificates are signed by a {{certificate authority|who?}} (CA).
- The standard format for certificates is {{X.509|which standard?}}.
- Browsers trust a certificate that chains up to a {{root|which kind of?}} CA in their trust store.
![A chain of trust: each certificate is signed by the one above, up to the root](commons:Chain of trust.svg)
- Fill in the chain of trust:
```stack
# The chain of trust
root | Root CA | in the browser's trust store
signs | {{Intermediate CA|what's in between?}} | signs certificates day to day
signs | www.example.com | the site's certificate
```
- To get a certificate, you send a CA a {{CSR (certificate signing request)|what?}}.
- A {{wildcard|which kind of?}} certificate, like *.example.com, covers every subdomain one level down.

## Revocation
- A {{CRL (certificate revocation list)|what?}} lists certificates revoked before they expired.
- {{OCSP (Online Certificate Status Protocol)|which protocol?}} checks a certificate's status in real time.
- PKI stands for public key {{infrastructure|what?}}.
