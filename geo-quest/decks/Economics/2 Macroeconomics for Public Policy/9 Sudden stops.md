---
title: Sudden stops
---
What current account deficits commit a country to, why developing countries borrow, country risk, and what happens when foreign money suddenly leaves: reserves, vulnerabilities and policy. Lecture 9 of Macroeconomics for Public Policy.

:::lesson
## Deficits now, surpluses later
The current account is the change in net foreign assets. If the only primary income is interest on what's already owned or owed, then each period:

$$NFA_2 = (1+r)\,NFA_1 + NX_1 + NUT_1$$

Chain two periods together and require that nothing is left over at the end (all debt repaid, all assets used up):

```derive
# A country's intertemporal budget constraint
NFA_2 = (1+r)NFA_1 + NX_1 + NUT_1 :: The first period.
NFA_3 = (1+r)NFA_2 + NX_2 + NUT_2 :: The second period, the same way.
NFA_3 = (1+r)^2 NFA_1 + (1+r)(NX_1 + NUT_1) + NX_2 + NUT_2 :: Substitute the first line into the second.
NX_1 + \frac{NX_2}{1+r} + NUT_1 + \frac{NUT_2}{1+r} + (1+r)NFA_1 = 0 :: Set NFA_3 to zero and divide by 1+r.
```

Countries, like people, face an intertemporal budget constraint:
- With no transfers and no initial wealth, the present value of net exports must be **zero**: deficits now mean surpluses later.
- A country can sustain trade deficits in present value only with positive transfers (remittances, aid) or positive initial wealth.
- A country that starts in debt must run trade surpluses in present value.

Since $NX = Y - ABS$, the same constraint says the present value of absorption can't exceed the present value of output plus transfers plus initial net foreign assets. There's **no stigma** in borrowing or lending: it lets a country smooth absorption, just as it lets a family smooth consumption.

## Should poor countries borrow?
A typical developing country has little capital today and expects much more income later. Low current income keeps saving low; higher expected income lowers it further. Investment, with so little capital, is high. So it should run a **current account deficit** early on, then switch to surpluses as capital builds up and income grows, repaying the debt.

But that only works if the borrowing builds productive capacity. Lenders want to know: is the money financing **investment**, or consumption and wasteful public spending? If the latter, the country may be unable to repay, and may have to default or restructure.

## Country risk
Lenders who doubt repayment charge more. The gap between the rate a country pays, $r_H$, and the world rate is its **spread**, from **country risk**. A risk-neutral lender wants the same expected return as from a safe asset. If default happens with probability $p$, and then only a share $x$ (the **recovery rate**) is repaid:

$$1 + r_H = \frac{1+r}{1 - p\,(1-x)}$$

The spread grows with the probability of default and with how much is lost in one. A higher $r_H$ makes the country save more (consuming less, a movement along the saving curve) and invest less, shrinking its deficit.

## Sudden stops
Shocks can also start on the financial side. When foreign assets in a country become more attractive, money flows in, its interest rate falls, consumption and investment rise, and the current account deficit widens. That's fine while it lasts. But flows into developing countries often reverse abruptly: a **sudden stop**. The rate jumps, absorption collapses, and the current account swings toward surplus.

The Baltic states and Central Europe were hit in early 2009 after the global financial crisis. Latvia's current account went from a deficit of about 21% of GDP in 2007 to a surplus of about 8% in 2009. In the summer of 2013, the "fragile five" (Turkey, Brazil, India, Indonesia and South Africa) faced a reversal when the US Federal Reserve signaled it would slow its bond purchases.

## Reserves as a shock absorber
Split the financial account into the central bank's reserves and everything else. Since $CA = GNDI - ABS$:

$$\text{Net financial inflows} = \Delta RES + ABS - GNDI$$

Output is set by the supply side, so when private inflows fall and reserves don't move, **absorption** must fall. A central bank that sells foreign reserves can take the hit instead, keeping absorption and the interest rate steady. In good times it can buy reserves as inflows surge. A country without enough reserves faces a **balance of payments crisis**, which can turn into a debt, banking or currency crisis.

## Vulnerabilities and policy
A country is more exposed to sudden stops when its foreign liabilities are mostly **portfolio** investment rather than foreign direct investment (which rarely flees), when its **reserves** are thin, and when its debt has **short maturities**.

When inflows surge:
- steer them toward investment, which raises future output, rather than consumption;
- build up reserves;
- lengthen the maturity of foreign debt;
- consider **capital controls** on inflows, such as a tax on foreign purchases of local assets.

When outflows hit:
- push through structural reforms that raise output (hard to do under pressure);
- temporary emigration raises remittances and national income;
- controls on outflows;
- emergency loans from international lenders, such as the IMF.

The policies that work best are the ones put in place **before** the reversal.
:::

## The country's budget constraint
- $NFA_2 = (1+r)\,NFA_1 + NX_1 + {{NUT_1}}$
eq: Net foreign assets over time | NFA_2 = (1+r)\,NFA_1 + NX_1 + NUT_1
- With no transfers and no initial wealth, the present value of a country's net exports must equal {{zero|what?}}.
eq: A country's intertemporal budget constraint | NX_1 + \frac{NX_2}{1+r} + NUT_1 + \frac{NUT_2}{1+r} + (1+r)\,NFA_1 = 0
- A country with foreign debt must eventually run trade {{surpluses|surpluses or deficits?}}.
- Fill in the missing step:
```derive
# A country's intertemporal budget constraint
NFA_3 = (1+r)NFA_2 + NX_2 + NUT_2 :: The second period.
NFA_3 = {{(1+r)^2}} NFA_1 + (1+r)(NX_1 + NUT_1) + NX_2 + NUT_2 :: Substitute the first period into the second.
NX_1 + \frac{NX_2}{1+r} + NUT_1 + \frac{NUT_2}{1+r} + (1+r)NFA_1 = 0 :: Set NFA_3 to zero and divide by 1+r.
```
eq: A country's intertemporal budget constraint | NX_1 + \frac{NX_2}{1+r} + NUT_1 + \frac{NUT_2}{1+r} + (1+r)\,NFA_1 = 0

## Developing countries
- A country with little capital and fast expected growth should run a current account {{deficit|surplus or deficit?}} early on.
- Borrowing can be repaid only if it finances {{investment|what?}} that raises future output.
- Lenders charge a riskier country more; the gap over the world rate is its {{spread|what?}}.
- $1 + r_H = \dfrac{1+r}{1 - p\,({{1-x}})}$
eq: Country risk premium | 1 + r_H = \frac{1+r}{1 - p\,(1-x)}
- The share of a debt repaid in a default is the {{recovery|what?}} rate.

## When the money leaves
- An abrupt reversal of foreign money flowing into a country is called a {{sudden stop|what?}}.
- When inflows reverse, the domestic interest rate {{rises|rises or falls?}}.
- When inflows reverse, the current account moves toward {{surplus|surplus or deficit?}}.
- $\text{Net inflows} = {{\Delta RES}} + ABS - GNDI$
eq: Net financial inflows | \text{Net inflows} = \Delta RES + ABS - GNDI
- A central bank can cushion a sudden stop by selling foreign {{reserves|what?}}.
- Running out of reserves in a reversal is a balance of {{payments|what?}} crisis.

## Vulnerabilities and policy
- Foreign {{direct|which kind of?}} investment is the least likely to flee in a crisis.
- Debt with short {{maturities|what?}} makes a country more vulnerable.
- A tax on foreign purchases of local assets is a capital {{control|what?}}.
- In a surge of inflows, it's better to steer them into {{investment|consumption or investment?}}.
