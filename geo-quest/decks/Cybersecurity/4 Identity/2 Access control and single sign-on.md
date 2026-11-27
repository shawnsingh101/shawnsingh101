---
title: Access control and single sign-on
chapter: 8
objectives: 4.6
---
Once you're in, who decides what you can touch: the access-control models, least privilege, and logging in once for many systems (Kerberos, SAML, OAuth).

:::lesson
## Access-control models
- **Discretionary (DAC)**: the owner of a file decides who may use it (sharing a document).
- **Mandatory (MAC)**: the system decides, by labels (Secret, Top Secret) and clearances. Users can't change it. Used by the military.
- **Role-based (RBAC)**: permissions go to roles (Nurse, Accountant), and people get roles. The usual choice in companies.
- **Rule-based**: rules apply to everyone (no logins after 8 pm).
- **Attribute-based (ABAC)**: decisions weigh many attributes: who, which device, where, when, what. The most flexible; zero trust relies on it.

## Only what you need
Give each person and program only the access its job needs, no more: **least privilege**. Pair it with **separation of duties** (no one person can both create and approve a payment) and regular **access reviews**, since people collect permissions as they change jobs (**privilege creep**).

Powerful accounts need **privileged access management (PAM)**: admin rights handed out **just in time**, for a task, and taken back after.

## Logging in once
**Single sign-on (SSO)** means logging in once to reach many systems. Inside a Windows network that's **Kerberos**:

```flow
# Kerberos: logging in once
User | KDC | File server
User -> KDC: logs in; proves who they are
KDC -> User: a ticket-granting ticket (TGT), good for hours
User -> KDC: shows the TGT and asks for the file server
KDC -> User: a service ticket for the file server
User -> File server: presents the service ticket, no password needed
```

The **key distribution center (KDC)** is the trusted middleman; tickets expire, so a stolen one is only good for a while.

## Across organizations: federation
**Federation** lets one organization vouch for its people at another. **SAML** passes signed statements (assertions) about a user from the **identity provider** (where you log in) to the **service provider** (the app). **OAuth** is for *authorization*: it lets one app act for you at another ("let this app see my calendar") without your password. **OpenID Connect** adds login on top of OAuth: "Sign in with Google".

> Often confused: OAuth grants an app access to your stuff; it doesn't, by itself, say who you are. That's OpenID Connect's job.
:::

## Models
- Access set by the owner of each file is {{discretionary|which model?}} access control (DAC).
- Access set by labels and clearances that users can't change is {{mandatory|which model?}} access control (MAC).
- Permissions given to job roles rather than people is {{role-based|which model?}} access control (RBAC).
- Decisions that weigh who, which device, where and when are {{attribute-based|which model?}} access control (ABAC).

## Only what you need
- Giving each account only the access its job needs is least {{privilege|what?}}.
- Making sure no one person can both create and approve a payment is separation of {{duties|what?}}.
- Permissions piling up as someone moves between jobs is privilege {{creep|what?}}.
- Admin rights granted only for a task, then taken back, are just-in-{{time|what?}} access.

## Logging in once
- Logging in once to reach many systems is {{SSO (single sign-on)|what?}}.
- Windows networks log you in once with {{Kerberos|which protocol?}}.
- In Kerberos, the trusted server that hands out tickets is the {{KDC (key distribution center)|what?}}.
- In Kerberos, steps in order:
```flow
User | KDC | File server
User -> KDC: logs in; proves who they are
KDC -> User: a {{ticket-granting ticket (TGT)|what?}}
User -> KDC: shows it and asks for the file server
KDC -> User: a service ticket
User -> File server: presents the service ticket
```

## Federation
- In SAML, the organization where you log in is the {{identity provider|what?}}; the app is the service provider.
- {{OAuth|which standard?}} lets one app act for you at another without your password.
- "Sign in with Google" uses {{OpenID Connect|which standard?}}, built on OAuth.
