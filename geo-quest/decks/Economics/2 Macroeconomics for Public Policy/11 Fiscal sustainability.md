---
title: Fiscal sustainability
---
When is public debt a problem? Debt as a share of GDP, the primary balance, the race between the interest rate and growth, and the warning signs of a debt crisis. Lecture 11 of Macroeconomics for Public Policy.

:::lesson
## The right yardstick
A debt of a trillion dollars means little by itself; what matters is the debt against the economy that has to carry it: the **debt-to-GDP ratio**, $b$. The **primary balance**, $pb$, is taxes minus spending *other than* interest: it shows whether the government's current policies pay their way.

## How the ratio moves
Each year the debt grows with interest, the economy grows, and the primary balance pays some down:

```derive
# Debt dynamics
B_{t+1} = (1+r)B_t - PB_{t+1} :: Debt grows with real interest and shrinks with a primary surplus (all in real terms).
\frac{B_{t+1}}{Y_{t+1}} = \frac{(1+r)B_t}{(1+g)Y_t} - \frac{PB_{t+1}}{Y_{t+1}} :: Divide by next year's output, using Y_{t+1} = (1+g)Y_t.
b_{t+1} = \frac{1+r}{1+g}\,b_t - pb_{t+1} :: Write ratios to GDP in lower case.
```

## r against g
- If $r > g$, interest outruns growth: the ratio climbs unless the government runs **primary surpluses**.
- If $r < g$, growth outruns interest: the ratio falls by itself, and even a small primary deficit can be sustained.

The primary balance that holds the ratio steady:

$$pb^* = \frac{r-g}{1+g}\,b$$

The higher the debt, the bigger the swing in $pb^*$ when $r$ or $g$ moves. That's why high debt is risky even when $r < g$ today: the gap can flip.

## When debt becomes a crisis
Lenders demand a higher rate when they doubt repayment. A higher rate raises $pb^*$, which may be politically impossible, which raises doubts further: a self-fulfilling spiral, as in Greece in 2010–12. Vulnerabilities: debt in **foreign currency** (it can't be inflated away), **short maturities** (it must be rolled over often), a weak banking system holding the debt, and a history of default.

The ways out are the four: **austerity** (primary surpluses), **growth**, **inflation** (which erodes debt in home currency) and **default or restructuring**. Japan's debt is above 200% of GDP but mostly held at home, in yen, at very low rates.
:::

## The yardstick
- Public debt is measured against the economy as the debt-to-{{GDP|what?}} ratio.
- Taxes minus spending other than interest is the {{primary balance|what?}}.

## How it moves
- $b_{t+1} = \dfrac{1+r}{ {{1+g}} }\,b_t - pb_{t+1}$
eq: Debt dynamics | b_{t+1} = \frac{1+r}{1+g}\,b_t - pb_{t+1}
- Fill in the missing step:
```derive
# Debt dynamics
B_{t+1} = (1+r)B_t - PB_{t+1} :: Debt grows with real interest and shrinks with a primary surplus.
\frac{B_{t+1}}{Y_{t+1}} = \frac{(1+r)B_t}{ {{(1+g)Y_t}} } - \frac{PB_{t+1}}{Y_{t+1}} :: Divide by next year's output.
b_{t+1} = \frac{1+r}{1+g}\,b_t - pb_{t+1} :: Write ratios to GDP in lower case.
```
eq: Debt dynamics | b_{t+1} = \frac{1+r}{1+g}\,b_t - pb_{t+1}

## r against g
- When the interest rate exceeds growth, holding the debt ratio steady needs primary {{surpluses|surpluses or deficits?}}.
- When growth exceeds the interest rate, the debt ratio {{falls|rises or falls?}} with a balanced primary budget.
- $pb^* = \dfrac{ {{r-g}} }{1+g}\,b$
eq: Debt-stabilizing primary balance | pb^* = \frac{r - g}{1+g}\,b

## Crises
- Debt owed in {{foreign currency|what kind?}} can't be inflated away.
- Debt with short maturities is risky because it must be {{rolled over|what?}} often.
- The four ways out of high debt: austerity, growth, inflation and {{default|what?}}.
