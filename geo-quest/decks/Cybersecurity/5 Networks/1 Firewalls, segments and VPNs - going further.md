---
title: Firewalls, segments and VPNs: going further
depth: deep
chapter: 12
objectives: 3.2
---
Place the device and read the rule.

## Scenarios
- The company website must be reachable from the internet but not give a way into the staff network: put it in the {{screened subnet|which zone?}}.
- A firewall rule list allows ports 80 and 443 and nothing else is listed; a request on port 22 is {{blocked|what happens?}} by implicit deny.
- An IPS blocks a payroll upload it mistook for an attack: a {{false positive|what kind of error?}}.
- An attack hidden in a search box's text gets past the network firewall: a {{WAF (web application firewall)|what?}} would inspect it.
- After malware hit one office PC, it couldn't reach the servers, thanks to {{segmentation|what?}}.
