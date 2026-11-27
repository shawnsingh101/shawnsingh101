---
title: Monitoring and logs
chapter: 14
objectives: 4.4, 4.9
---
Seeing what's happening: the logs that record it, the tools that gather and sift them, and how alerts are tuned.

:::lesson
## Where the evidence lives
Every system keeps **logs**: operating systems (Windows Event Log, Linux syslog), firewalls, applications, authentication servers. **NetFlow** records who talked to whom and how much, without the contents; a **packet capture** records the contents too. **Metadata** (an email's headers, a file's author and dates) tells its own story.

## Gathering them: SIEM
A **SIEM** (security information and event management) collects logs from everywhere into one place, lines them up by time, and **correlates** them: a failed login on the VPN, then a success, then a large download at 3 am, are three ordinary events that together look like an attack. It raises **alerts** and draws dashboards.

For the time order to work, every system needs the same clock: **NTP** (network time protocol) keeps them in sync.

**SOAR** (security orchestration, automation and response) acts on alerts with **playbooks**: when this alert fires, block that address, disable that account, open a ticket.

## Tuning
An alert can be a **true positive** (a real attack, flagged), a **false positive** (harmless, flagged), or worse, a **false negative** (a real attack, missed). Too many false positives cause **alert fatigue**, and real attacks get ignored. Tuning the rules trades one against the other.

## Other eyes
- **Data loss prevention (DLP)** watches for sensitive data (card numbers, health records) leaving the organization.
- **File integrity monitoring (FIM)** alerts when important system files change.
- **SNMP** reports the health of network devices; a **trap** is a device's unprompted alert.

> Often confused: a SIEM finds and shows; SOAR acts. Many products now do both.
:::

## Logs
- The record of which computers talked, when and how much, without the contents, is {{NetFlow|what?}}.
- Recording the full contents of network traffic is a packet {{capture|what?}}.
- Linux and network devices send their logs using {{syslog|which standard?}}.

## SIEM
- A system that gathers logs from everywhere and correlates them is a {{SIEM (security information and event management)|what?}}.
- Linking separate events into one picture of an attack is {{correlation|what?}}.
- So events from different systems line up in time, every clock is synced with {{NTP (network time protocol)|what?}}.
- Tools that respond to alerts automatically, using playbooks, are {{SOAR (security orchestration, automation and response)|what?}}.

## Tuning
- A harmless event flagged as an attack is a false {{positive|what?}}.
- Analysts ignoring alerts because there are too many is alert {{fatigue|what?}}.

## Other eyes
- Watching for sensitive data leaving the organization is {{DLP (data loss prevention)|what?}}.
- Alerting when important system files change is file {{integrity|what?}} monitoring.
