---
title: Digital signatures and certificates: going further
depth: deep
chapter: 7
objectives: 1.4
---
Certificates on the job: warnings and what they mean, private CAs, pinning, code signing, and signed email.

## Warnings and trust
- A certificate issued for www.example.com, presented by a different site, causes a name {{mismatch|what kind of?}} warning.
- If a root CA's private key were stolen, an attacker could issue a trusted certificate for {{any website|what?}}.
- A company's internal sites can use certificates from its own private {{CA (certificate authority)|what?}}, trusted only on company devices.
- An app that accepts only one specific certificate or key for its own server uses certificate {{pinning|what?}}.

## Other uses
- Software signed with a {{code-signing|what kind of?}} certificate proves who published it and that it hasn't been changed.
- Signing and encrypting email with certificates uses {{S/MIME (Secure/Multipurpose Internet Mail Extensions)|which standard?}}.
- Checking revocation with OCSP tells the CA which sites you visit; with OCSP {{stapling|what?}}, the server fetches that answer itself.
