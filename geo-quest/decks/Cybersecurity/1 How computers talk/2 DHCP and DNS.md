---
title: DHCP and DNS
chapter: 12
objectives: 2.4
---
The two services every device uses before it can do anything else: DHCP gives it an address, DNS turns names into addresses. Both are favorite targets.

:::lesson
## DHCP: getting an address
A laptop joining a network has no IP address yet. **DHCP** (Dynamic Host Configuration Protocol) hands one out, along with the router to send traffic through (the **default gateway**) and the DNS server to use. The address is only lent, for a set time: a **lease**.

It takes four messages, remembered as **DORA**. The first is a **broadcast**, sent to every device on the network, because the laptop doesn't know where the DHCP server is yet:

```flow
# Getting an address: DHCP
New laptop | DHCP server
New laptop -> DHCP server: Discover: "Is there a DHCP server here?" (to everyone)
DHCP server -> New laptop: Offer: "You can have 192.168.1.20"
New laptop -> DHCP server: Request: "I'll take 192.168.1.20"
DHCP server -> New laptop: Acknowledge: "It's yours for 24 hours. Your gateway and DNS server are 192.168.1.1"
```

![The DHCP exchange as it's usually drawn: Discover, Offer, Request, Acknowledge](commons:DHCP session en.svg)

> Why security cares: any device can answer a Discover. A **rogue DHCP server** that answers first can name itself as the gateway or DNS server and sit in the middle of everyone's traffic. Network switches defend with **DHCP snooping**: only answers from trusted ports get through.

## DNS: names into addresses
People use names; networks use numbers. **DNS** (Domain Name System) turns a name like `www.example.com` into an IP address, by asking a chain of servers. Your computer asks a **resolver** (run by your internet provider, your company, or a public service), which works down the tree of names:

```flow
# Looking up a name: DNS
Your computer | Resolver | Root and .com servers | example.com's server
Your computer -> Resolver: Where is www.example.com?
Resolver -> Root and .com servers: Where is www.example.com?
Root and .com servers -> Resolver: Ask example.com's own server
Resolver -> example.com's server: Where is www.example.com?
example.com's server -> Resolver: 203.0.113.10
Resolver -> Your computer: 203.0.113.10 (and remembers it for a while)
```

![A resolver asking one server after another, from the root down to the domain's own](commons:Example of an iterative DNS resolver.svg)

The resolver keeps answers in its **cache** for a set time (the TTL, time to live), so the next lookup is instant. DNS stores different kinds of **records**:
- **A**: a name's IPv4 address. **AAAA**: its IPv6 address.
- **MX** (mail exchanger): the server that receives a domain's email.
- **CNAME** (canonical name): an alias, one name pointing to another.
- **TXT**: free text, used for email security records that prove who may send mail for a domain.

> Why security cares: DNS answers were never designed to be checked. An attacker who slips a false answer into a resolver's cache, **DNS cache poisoning**, sends everyone who asks to their own server. **DNSSEC** (DNS Security Extensions) fixes this by digitally signing answers. And ordinary DNS isn't encrypted: anyone along the path sees which sites you look up, unless it's sent over HTTPS or TLS.

## Where it fits
Nearly every attack on a network touches these two: a rogue DHCP server or a poisoned DNS answer puts the attacker in the middle; malware often uses DNS to reach its controllers, which is why companies log and filter DNS lookups.
:::

## Getting an address
- {{DHCP (Dynamic Host Configuration Protocol)|which protocol?}} gives a device joining a network its IP address.
![The DHCP exchange: Discover, Offer, Request, Acknowledge](commons:DHCP session en.svg)
- Fill in the DHCP exchange:
```flow
New laptop | DHCP server
New laptop -> DHCP server: Discover
DHCP server -> New laptop: {{Offer|what comes next?}}
New laptop -> DHCP server: Request
DHCP server -> New laptop: Acknowledge
```
- An address from DHCP is lent for a set time: a {{lease|what?}}.
- The router a device sends its traffic through is its default {{gateway|what?}}.
- A {{rogue DHCP server|what?}} hands out its own address as the gateway, putting itself in the middle of the network's traffic.
- Switches block rogue DHCP servers with DHCP {{snooping|what?}}.

## Names into addresses
- {{DNS (Domain Name System)|which system?}} turns names like www.example.com into IP addresses.
![A resolver works down from the root servers to the domain's own server](commons:Example of an iterative DNS resolver.svg)
- A DNS {{A|which record?}} record gives a name's IPv4 address.
- A DNS {{MX|which record?}} record names the server that receives a domain's email.
- A DNS {{CNAME|which record?}} record makes one name an alias of another.
- Slipping a false answer into a DNS resolver's cache is DNS {{cache poisoning|which attack?}}.
- {{DNSSEC (DNS Security Extensions)|what?}} digitally signs DNS answers so they can't be faked.
