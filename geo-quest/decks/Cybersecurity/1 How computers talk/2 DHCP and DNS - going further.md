---
title: DHCP and DNS: going further
depth: deep
chapter: 12
objectives: 2.4, 4.5
---
What goes wrong with DHCP and DNS, how attackers use them, and the clues they leave.

## When DHCP fails or lies
- A Windows laptop shows an address beginning 169.254.: it found no DHCP server and gave itself an {{APIPA (Automatic Private IP Addressing)|what kind of?}} address.
- Many devices suddenly get a gateway address nobody recognizes: suspect a {{rogue DHCP server|what?}}.
- Requesting every address a DHCP server has, so real devices get none, is DHCP {{starvation|which attack?}}.

## When DNS lies
- A user types the right address but lands on a fake bank site, while everyone else is fine: check that computer's {{hosts file|which file?}}, which overrides DNS.
- Redirecting users to a fake site by tampering with name lookups is called {{pharming|what?}}.
- Malware that sneaks data out hidden inside DNS lookups is using DNS {{tunneling|what?}}.
- Blocking known malicious domains at the company's DNS resolver is DNS {{filtering|what?}}.
- The SPF line listing which servers may send a domain's email is published in a DNS {{TXT|which record?}} record.
