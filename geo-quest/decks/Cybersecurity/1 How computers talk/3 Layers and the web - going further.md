---
title: Layers and the web: going further
depth: deep
chapter: 12
objectives: 2.4, 3.2
---
Putting the layers to work: where a device or an attack sits in the OSI model, local-network attacks, and what web server logs reveal.

## Where things sit
- A firewall that looks only at addresses and ports works at layers 3 and 4; one that understands web requests works at layer {{7|which layer?}}.
- A cut network cable is a layer {{1|which layer?}} problem.
- Switches forward frames by MAC address, so they work at layer {{2|which layer?}}.

## Local-network attacks
- Overwhelming a switch with fake MAC addresses until it sends traffic out of every port is MAC {{flooding|which attack?}}.
- Making a device use another device's MAC address, to get past a filter, is MAC {{spoofing|what?}}.
- On public Wi-Fi, an attacker using ARP poisoning can read anything that isn't {{encrypted|what?}}.

## What the web server sees
- HTTP status {{403|which code?}} means the server understood the request but refuses it.
- A web server's log fills with 404s for paths like /admin and /wp-login.php: someone is {{scanning|doing what?}} the site for weak spots.
