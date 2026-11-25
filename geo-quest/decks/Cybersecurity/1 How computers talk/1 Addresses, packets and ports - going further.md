---
title: Addresses, packets and ports: going further
depth: deep
chapter: 12
objectives: 4.5
---
Ports and protocols as they come up on the job: what an open port tells you, which ports carry secure versions of old protocols, and the tools that find them.

## Reading a port scan
- A scan finds port 23 open on a router: that's Telnet, which sends logins as {{plain text|how?}}. Replace it with SSH on port 22.
- Port 3389 open to the whole internet invites password attacks on {{RDP (Remote Desktop Protocol)|which service?}}.
- {{Nmap|which tool?}} is the classic free tool for scanning a network for open ports.
- Ports 0 to 1023 are the {{well-known|what kind of?}} ports, reserved for standard services.
- A port that sends no answer at all to a scan is usually being dropped by a {{firewall|what?}}.

## Secure versions of old protocols
- {{SFTP (SSH File Transfer Protocol)|which protocol?}} moves files over SSH on port 22, replacing plain FTP on ports 20 and 21.
- Reading email over an encrypted connection: IMAP over TLS uses port {{993|which port?}}.
- POP3 over TLS uses port {{995|which port?}}.
- Video calls and online games use {{UDP|which protocol?}}: a late packet is useless anyway, so resending it would only add delay.
