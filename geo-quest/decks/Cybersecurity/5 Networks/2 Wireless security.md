---
title: Wireless security
chapter: 13
objectives: 4.1
---
Securing Wi-Fi: the generations of protection, personal and enterprise logins, and the attacks unique to radio.

:::lesson
## The generations
Wi-Fi travels through the air, so anyone nearby can capture it; encryption is everything.
- **WEP**: the first, badly broken, cracked in minutes. Never use.
- **WPA**: a stopgap, also broken.
- **WPA2**: AES encryption (CCMP); solid for years, though its password mode can be guessed offline.
- **WPA3**: today's standard. Its password mode uses **SAE** (simultaneous authentication of equals), which stops offline guessing.

## Personal vs enterprise
- **Personal** (PSK, pre-shared key): everyone types the same password. Fine at home.
- **Enterprise**: each person logs in with their own account, checked by a **RADIUS** server using **802.1X** and **EAP**. When someone leaves, only their account is turned off; nobody has to change the Wi-Fi password.

## Radio attacks
- **Evil twin**: a fake access point with the same name as the real one, to catch people's traffic.
- **Rogue access point**: an unauthorized one plugged into the network, often by an employee.
- **Jamming**: drowning the channel in noise, a denial of service.
- **Deauthentication**: forged messages that knock devices off, so they reconnect (maybe to an evil twin).
- **Bluejacking** sends unwanted messages over Bluetooth; **bluesnarfing** steals data.

## Placement
A **site survey** maps signal strength (a **heat map**) so access points cover the building without spilling far outside.

> Often confused: an evil twin pretends to be your network; a rogue access point is a real, unauthorized one on it.
:::

## Generations
- The first Wi-Fi security, broken and never to be used, was {{WEP|which?}}.
- Today's Wi-Fi security standard is {{WPA3|which?}}.
- WPA3's password mode, which stops offline guessing, is {{SAE (simultaneous authentication of equals)|what?}}.

## Logins
- Wi-Fi where everyone shares one password is the {{personal|which mode?}} mode (pre-shared key).
- Enterprise Wi-Fi checks each person's own login against a {{RADIUS|what kind of?}} server.
- The standard for network login at the port or access point is {{802.1X|which standard?}}.

## Radio attacks
- A fake access point with the same name as the real one is an {{evil twin|what?}}.
- An unauthorized access point plugged into the company network is a {{rogue|what kind of?}} access point.
- Forged messages that knock devices off Wi-Fi are a {{deauthentication|what kind of?}} attack.
- Stealing data from a phone over Bluetooth is {{bluesnarfing|what?}}.

## Placement
- A map of Wi-Fi signal strength across a building is a {{heat map|what?}}, made in a site survey.
