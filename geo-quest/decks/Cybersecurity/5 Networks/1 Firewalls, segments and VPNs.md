---
title: Firewalls, segments and VPNs
chapter: 12
objectives: 3.2
---
Guarding a network: firewalls and what they look at, dividing a network into zones, catching intruders, and safe connections from outside.

:::lesson
## Firewalls
A **firewall** sits between networks and allows or blocks traffic by rules, read top to bottom, ending with **implicit deny**: anything not allowed is blocked.
- A **packet filter** looks at each packet's addresses and ports alone.
- A **stateful** firewall remembers connections, so a reply to a request you made is let back in automatically.
- A **next-generation firewall (NGFW)** also understands applications (it can tell Facebook from Zoom on the same port) and can inspect content.
- A **web application firewall (WAF)** guards a website, blocking attacks hidden in web requests, like SQL injection.

## Zones and segments
Don't put everything on one flat network. **Segmentation** splits it into zones, so a break-in in one doesn't reach the rest:
- The **screened subnet** (once called the **DMZ**) holds public-facing servers, like the website, between the internet and the inside network.
- **VLANs** (virtual LANs) divide one physical network into separate logical ones.
- An **air gap** is the extreme: no network connection at all.
- A **jump server** is the one hardened machine admins pass through to manage a sensitive zone.

```stack
# Zones, from outside in
3 | Internal network | staff, databases
2 | Screened subnet | web and mail servers
1 | Internet | untrusted
```

## Spotting intruders
An **intrusion detection system (IDS)** watches traffic and *alerts*. An **intrusion prevention system (IPS)** sits in the path and *blocks*. Both match **signatures** (known attack patterns) or flag **anomalies** (behavior unlike normal).

## From outside: VPNs
A **virtual private network (VPN)** builds an encrypted tunnel across the internet. **Site-to-site** VPNs join offices; **remote-access** VPNs connect a traveling laptop. Most use **IPsec** or **TLS**. A **full tunnel** sends all your traffic through the office; a **split tunnel** only the traffic for office systems.

> Often confused: an IDS only raises the alarm; an IPS can stop the traffic, so a false alarm from an IPS blocks real users.
:::

## Firewalls
- A firewall's last rule, blocking anything not explicitly allowed, is implicit {{deny|what?}}.
- A firewall that remembers connections and lets replies back in is {{stateful|what kind?}}.
- A firewall that recognizes applications, not just ports, is a {{next-generation firewall (NGFW)|what kind?}}.
- A firewall built to block attacks inside web requests is a {{WAF (web application firewall)|what?}}.

## Zones
- Dividing a network into zones so a break-in can't spread is {{segmentation|what?}}.
- The zone between the internet and the inside network, for public-facing servers, is the {{screened subnet|what?}} (once the DMZ).
- One physical network split into separate logical networks uses {{VLANs (virtual LANs)|what?}}.
- A system with no network connection at all is {{air-gapped|what?}}.
- The single hardened machine admins pass through to reach a sensitive zone is a {{jump server|what?}}.

## Intruders
- A system that watches traffic and raises alerts is an {{IDS (intrusion detection system)|what?}}.
- A system in the traffic's path that blocks attacks is an {{IPS (intrusion prevention system)|what?}}.
- Detection that matches known attack patterns is {{signature|what kind?}}-based.

## Tunnels
- An encrypted tunnel across the internet is a {{VPN (virtual private network)|what?}}.
- A VPN that sends only office-bound traffic through the tunnel is a {{split|what kind of?}} tunnel.
