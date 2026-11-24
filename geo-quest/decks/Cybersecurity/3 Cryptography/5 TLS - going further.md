---
title: TLS: going further
depth: deep
chapter: 7
objectives: 1.4, 4.5
---
TLS on the job: what it hides and what it doesn't, inspecting it at work, stripping attacks, and the settings that keep it strong.

## What it hides
- TLS hides what you send, but the server's name and IP address are usually still {{visible|what?}} to the network.
- A company proxy that decrypts and re-encrypts HTTPS, using a certificate its own CA installed on staff devices, is doing TLS {{inspection|what?}}.

## Attacks and defenses
- An attacker who quietly turns a victim's HTTPS links into plain HTTP is doing SSL {{stripping|what?}}.
- {{HSTS (HTTP Strict Transport Security)|what?}} tells browsers to use only HTTPS for a site, defeating stripping.
- Servers should disable every TLS version older than {{1.2|which version?}}.
- In mutual TLS, the {{client|who?}} presents a certificate too, so both sides are authenticated.
- Email servers switch an ordinary connection over to TLS with the {{STARTTLS|which command?}} command.
