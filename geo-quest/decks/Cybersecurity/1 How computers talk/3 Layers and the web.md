---
title: Layers and the web
chapter: 12
objectives: 2.4
---
Why people say "layer 2" and "layer 7": the OSI model, MAC addresses and ARP on the local network, and HTTP, the language of the web, which anyone along the way can read.

:::lesson
## Protocols in layers
A **protocol** is an agreed set of rules for a conversation. Networking stacks them in layers: each layer does one job and relies on the one beneath it. The **OSI model** (Open Systems Interconnection) names seven, from the cable at the bottom to the program at the top:

```stack
# The OSI model
7 | Application | what programs say: HTTP, DNS, SMTP
6 | Presentation | a shared format for the data
5 | Session | keeping a conversation going
4 | Transport | the right program, reliably or fast: TCP, UDP, ports
3 | Network | across networks: IP addresses, routers
2 | Data link | to the next device: MAC addresses, switches, Wi-Fi
1 | Physical | the signal on copper, fiber or radio
```

The internet really runs on a simpler four-layer model (TCP/IP), but security people talk in OSI numbers: a "layer 7 firewall" understands web traffic; a "layer 2 attack" happens on the local network.

> To remember them from 1 to 7: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way.

## MAC addresses and ARP
On a local network, devices find each other by **MAC address** (Media Access Control): a 48-bit number set in each network card at the factory, written like `00:1A:2B:3C:4D:5E`. When a computer knows an IP address but needs the MAC address to deliver to, it asks with **ARP** (Address Resolution Protocol): "Who has 192.168.1.1?", and the owner answers.

![ARP poisoning: the attacker claims the router's address, and traffic flows through them](commons:ARP Spoofing.svg)

> Why security cares: ARP believes any answer. In **ARP poisoning**, an attacker answers "I'm 192.168.1.1, the router", so the victims send their traffic to the attacker, who reads it and passes it on. That's an **on-path attack** (once called man-in-the-middle): someone secretly sitting between two parties.

## The web: HTTP
**HTTP** (Hypertext Transfer Protocol) is how browsers and web servers talk. The browser asks; the server answers with a status code and the content:

```flow
# Loading a web page over HTTP
Browser | Web server
Browser -> Web server: GET /index.html: "please send me this page"
Web server -> Browser: 200 OK, and the page
Browser -> Web server: GET /logo.png: one request for every image, script and style sheet
Web server -> Browser: 200 OK, and the image
```

Common status codes: **200** OK, **301** moved permanently, **403** forbidden, **404** not found, **500** the server failed.

> The problem: plain HTTP is **plain text**. Everyone along the path, the café's Wi-Fi, your internet provider, any router in between, can read it, passwords and all, and even change it. That's the problem cryptography solves. **HTTPS** is HTTP inside an encrypted TLS connection; the Cryptography lessons build up to it.
:::

## The OSI model
- The OSI model divides networking into {{seven|how many?}} layers.
![The OSI model's seven layers](commons:OSI Model v1.svg)
- IP addresses and routers work at OSI layer {{3|which layer?}}, Network.
- TCP, UDP and ports work at OSI layer {{4|which layer?}}, Transport.
- MAC addresses and switches work at OSI layer {{2|which layer?}}, Data link.
- HTTP, DNS and SMTP work at OSI layer {{7|which layer?}}, Application.
- Fill in the missing layer:
```stack
# The OSI model
7 | Application | HTTP, DNS, SMTP
6 | Presentation | a shared format
5 | Session | keeping a conversation going
4 | {{Transport|which layer?}} | TCP, UDP, ports
3 | Network | IP addresses, routers
2 | Data link | MAC addresses, switches
1 | Physical | the signal itself
```

## The local network
- A {{MAC|what kind of?}} address identifies a network card on the local network.
- {{ARP (Address Resolution Protocol)|which protocol?}} finds the MAC address that goes with an IP address.
- Answering ARP requests falsely, to pose as the router, is ARP {{poisoning|which attack?}}.
![ARP poisoning: the attacker poses as the router](commons:ARP Spoofing.svg)
- An attacker secretly sitting between two parties, reading and changing their traffic, is making an {{on-path|what kind of?}} attack.

## The web
- In HTTP, the browser asks for a page with a {{GET|which request?}} request.
- HTTP status {{404|which code?}} means the page wasn't found.
- Plain HTTP is sent as {{plain text|how?}}: anyone along the path can read it.
