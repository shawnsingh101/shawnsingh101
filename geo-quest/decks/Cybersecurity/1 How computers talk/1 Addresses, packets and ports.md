---
title: Addresses, packets and ports
chapter: 12
objectives: 4.5
---
How data finds its way across a network: packets, IP addresses, port numbers, and the two ways of sending, TCP and UDP. The ground floor everything in security stands on.

:::lesson
## Packets and routers
Every message sent over a network, an email, a web page, a video call, is cut into small pieces called **packets**. Each packet carries the address it came from and the address it's going to. **Routers** pass packets from network to network, hop by hop, until they arrive, where they're put back together.

## IP addresses
An **IP address** (Internet Protocol address) identifies a device on a network. The common kind, IPv4, is four numbers from 0 to 255: `192.168.1.20`. There are only about 4.3 billion of them, so the newer **IPv6** uses much longer addresses, like `2001:db8::1`.

![An IPv4 address: four numbers, each stored as 8 bits](commons:Ipv4 address.svg)

Addresses that begin `10.`, `172.16.` to `172.31.`, or `192.168.` are **private**: used inside homes and offices, never on the open internet. Your router swaps them for its single public address on the way out, which is called **NAT** (network address translation).

![NAT: devices with private addresses share the router's one public address](commons:NAT Concept-en.svg)

## The right program
An IP address gets a packet to the right computer; a **port number** gets it to the right program on that computer. A web server listens on port 443, a mail server on 25. The ones worth knowing by heart:
- **22** SSH (Secure Shell), remote command line
- **25** SMTP (Simple Mail Transfer Protocol), sending email
- **53** DNS (Domain Name System), looking up names
- **80** HTTP, the web without encryption
- **443** HTTPS, the web with encryption
- **3389** RDP (Remote Desktop Protocol), remote desktop on Windows

> Why security cares: every open port is a door into a system. Closing the ports you don't need, and firewalls that allow only the right ones, shrink what an attacker can reach: the **attack surface**.

## TCP and UDP
There are two ways to send packets. **TCP** (Transmission Control Protocol) sets up a connection first and makes sure every packet arrives, in order, resending any that get lost: web pages, email, file transfers. **UDP** (User Datagram Protocol) just sends, with no setup and no guarantee. It's faster, so it's used where speed beats perfection: DNS lookups, video calls, games.

TCP's setup is the **three-way handshake**. Step through it:

```flow
# The TCP three-way handshake
Client | Server
Client -> Server: SYN: "I'd like to talk" (synchronize)
Server -> Client: SYN-ACK: "OK, go ahead" (synchronize-acknowledge)
Client -> Server: ACK: "Here we go" (acknowledge)
Client -> Server: The data itself, now that the connection is open
```

![The same handshake as network engineers usually draw it](commons:TCP Three-Way Handshake.svg)

> Often confused: a port isn't a physical socket on the computer, just a number in each packet's header. And "TCP/IP" isn't one protocol: it's the name for the whole family the internet runs on.

## Where it fits
Attackers start by **port scanning**: knocking on every port of a system to see which services answer, then attacking those. A **SYN flood** starts thousands of handshakes and never finishes them, tying up a server until it can't answer real users: a denial of service.
:::

## Finding the way
- Data crossing a network travels in small pieces called {{packets|what?}}, each labeled with where it's from and where it's going.
- A device on a network is identified by its {{IP address|what?}}.
![An IPv4 address: four numbers, each stored as 8 bits](commons:Ipv4 address.svg)
- Addresses that begin 192.168. or 10. are {{private|what kind of?}}: used inside a home or office, never on the open internet.
- {{NAT (network address translation)|what?}} lets a whole private network share one public IP address.
![NAT: private addresses sharing one public address](commons:NAT Concept-en.svg)

## The right program
- An IP address finds the computer; a {{port|what?}} number finds the program on it.
- HTTPS uses port {{443|which port?}}.
- HTTP, the web without encryption, uses port {{80|which port?}}.
- SSH (Secure Shell) uses port {{22|which port?}}.
- DNS (Domain Name System) uses port {{53|which port?}}.
- RDP (Remote Desktop Protocol) uses port {{3389|which port?}}.
- Every open port adds to a system's {{attack surface|what?}}.

## Two ways to send
- {{TCP (Transmission Control Protocol)|which protocol?}} makes sure every packet arrives, in order.
- {{UDP (User Datagram Protocol)|which protocol?}} just sends: faster, but with no guarantee.
- Fill in TCP's three-way handshake:
```flow
Client | Server
Client -> Server: SYN
Server -> Client: {{SYN-ACK|what does the server answer?}}
Client -> Server: ACK
```
- Starting thousands of TCP handshakes and never finishing them, to tie up a server, is a {{SYN flood|which attack?}}.
