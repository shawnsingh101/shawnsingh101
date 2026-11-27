---
title: People and web attacks
chapter: 4
objectives: 2.2, 2.3
---
Tricking people (social engineering), and tricking websites (injection, scripting, forgery), plus attacks on passwords.

:::lesson
## Social engineering
Attackers often find people easier than machines. They lean on **authority** (I'm from IT), **urgency** (your account closes today), **scarcity**, **trust** and **intimidation**.
- **Phishing**: fake emails. **Spear phishing** targets one person; **whaling**, an executive.
- **Vishing**: by phone (voice). **Smishing**: by text (SMS).
- **Pretexting**: a made-up story to get information.
- **Business email compromise (BEC)**: a real or faked executive account asks finance to wire money.
- **Watering hole**: infecting a website the targets are known to visit.
- **Typosquatting**: registering a misspelled domain (gooogle.com).
- In person: **tailgating** (following someone through a door), **shoulder surfing**, **dumpster diving**.

## Web attacks
Websites take text from users; trouble starts when that text is treated as code.
- **SQL injection**: typing database commands into a form. `' OR 1=1 --` can make a login check always true. Defense: **parameterized queries** and input validation.
- **Cross-site scripting (XSS)**: getting a site to show other users a script the attacker wrote, which runs in their browsers. Defense: encode output.
- **Cross-site request forgery (CSRF)**: tricking a logged-in user's browser into sending a request they didn't mean ("transfer $1,000"). Defense: anti-CSRF tokens.
- **Directory traversal**: `../../` in a file path to reach files outside the website's folder.
- **Buffer overflow**: sending more data than a program set aside room for, overwriting memory, sometimes to run code.

## Password attacks
- **Brute force**: every combination. **Dictionary**: likely words.
- **Password spraying**: a few common passwords against many accounts, to avoid lockouts.
- **Credential stuffing**: logins leaked from one site tried on others, since people reuse passwords.

> Often confused: XSS attacks a site's *users* through the site; CSRF abuses a user's *logged-in session* to act on the site.
:::

## People
- Fake emails sent to trick people into clicking or giving up passwords are {{phishing|what?}}.
- Fake emails aimed at one chosen executive are {{whaling|what?}}.
- Tricking someone by phone call is {{vishing|what?}}; by text message, smishing.
- Making up a story to get information is {{pretexting|what?}}.
- An executive's email account used to ask finance to wire money is {{business email compromise (BEC)|what?}}.
- Infecting a website the targets are known to visit is a {{watering hole|what kind of?}} attack.
- Registering a misspelled domain to catch typos is {{typosquatting|what?}}.
- Following someone through a secure door is {{tailgating|what?}}.

## Websites
- Typing database commands into a web form is {{SQL injection|which attack?}}.
- The defense that keeps user input from being run as a database command is {{parameterized queries|what?}}.
- Getting a site to show other users a script that runs in their browsers is {{cross-site scripting (XSS)|which attack?}}.
- Tricking a logged-in browser into sending a request its user didn't mean is {{cross-site request forgery (CSRF)|which attack?}}.
- Using `../` in a file path to reach files outside the site's folder is directory {{traversal|what?}}.
- Sending more data than a program has room for, overwriting memory, is a {{buffer overflow|what?}}.

## Passwords
- Trying a few common passwords against many accounts is password {{spraying|what?}}.
- Trying logins leaked from one site on other sites is credential {{stuffing|what?}}.
