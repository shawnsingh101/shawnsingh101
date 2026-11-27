---
title: Passwords and MFA
chapter: 8
objectives: 4.6
---
How people prove who they are: the factors, what makes a password strong, multifactor authentication, and the newer passwordless way.

:::lesson
## The factors
Every way of proving who you are falls into a **factor**:
- **Something you know**: a password, a PIN, the answer to a question.
- **Something you have**: a phone, a hardware key, a smart card.
- **Something you are**: a fingerprint, a face, an iris (**biometrics**).

Some systems also weigh **somewhere you are** (location) and **something you do** (how you type), but these support a login rather than prove it.

**Multifactor authentication (MFA)** uses two or more *different* factors. A password plus a code from your phone is MFA; a password plus a security question is not, since both are things you know.

## Passwords
Length beats cleverness: a long passphrase is harder to guess than a short string of symbols. Current guidance (NIST, the US standards agency) is to require length, check new passwords against lists of known breached ones, and *not* force regular changes, which only push people toward predictable patterns. A **password manager** lets everyone use a different long password everywhere.

## One-time codes
- **TOTP** (time-based one-time password): an authenticator app shows a 6-digit code that changes every 30 seconds.
- **HOTP** (HMAC-based one-time password): a new code each time a button is pressed.
- **SMS codes** are the weakest second factor: an attacker can take over your phone number by talking the carrier into moving it (**SIM swapping**).

## Biometrics
A biometric system can fail two ways. It can reject the right person (**false rejection rate, FRR**) or accept the wrong one (**false acceptance rate, FAR**). Tighten it and FAR falls but FRR rises. Where the two meet is the **crossover error rate (CER)**: the lower, the more accurate the system.

## Passwordless
**Passkeys** (the FIDO2 standard) replace the password with a key pair: the private key stays on your device, unlocked by your face or fingerprint, and the site holds only the public key. There's nothing to phish and nothing useful to steal from the site.

> Often confused: two passwords are still one factor. MFA needs different *kinds* of proof.
:::

## Factors
- A password or PIN is something you {{know|what kind of factor?}}.
- A phone or a hardware key is something you {{have|what kind of factor?}}.
- A fingerprint or a face is something you {{are|what kind of factor?}}.
- Using two or more different kinds of factor is {{MFA (multifactor authentication)|what?}}.
- A password plus a security question is not MFA, because both are {{something you know|what kind of factor?}}.

## Passwords
- For a password, {{length|what matters most?}} beats complexity.
- NIST's current advice is not to force regular password {{changes|what?}}.
- A tool that keeps a different long password for every site is a password {{manager|what?}}.

## One-time codes
- An authenticator app's 6-digit code that changes every 30 seconds is a {{TOTP (time-based one-time password)|what?}}.
- Text-message codes are weak because an attacker can steal your number by {{SIM swapping|which attack?}}.

## Biometrics
- A fingerprint reader letting in the wrong person is a false {{acceptance|what kind of error?}}.
- A fingerprint reader refusing the right person is a false {{rejection|what kind of error?}}.
- Where the false acceptance and false rejection rates meet is the {{crossover error rate (CER)|what?}}: lower is better.

## Passwordless
- A key pair on your device that replaces the password, unlocked by your face or fingerprint, is a {{passkey|what?}}.
- Passkeys are built on the {{FIDO2|which standard?}} standard.
