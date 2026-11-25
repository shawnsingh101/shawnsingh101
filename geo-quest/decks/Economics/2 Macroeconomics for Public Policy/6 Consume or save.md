---
title: Consume or save
---
The two-period model of consumption: interest rates real and nominal, the intertemporal budget constraint, patience and indifference curves, and the best plan, solved for log utility, with and without initial wealth. Lecture 6 of Macroeconomics for Public Policy.

:::lesson
## Interest rates
The **nominal interest rate** is the return on an asset in currency. If an asset is worth $V_1$ today and $V_2$ next period:

$$i = \frac{V_2 - V_1}{V_1} \quad\Longleftrightarrow\quad V_2 = (1+i)V_1 \quad\Longleftrightarrow\quad V_1 = \frac{V_2}{1+i}$$

Real assets differ in risk, liquidity, maturity and taxes, but their returns tend to move together, so the model uses one rate. When $i$ rises, either the future value rises (a bank deposit pays more) or the present value falls (a bond with a fixed payout is worth less today).

The **real interest rate** $r$ is the return measured in goods. Divide each value by its price level:

```derive
# The real interest rate
1+r = \frac{V_2/P_2}{V_1/P_1} :: The real value next period over the real value today.
1+r = \frac{V_2}{V_1}\cdot\frac{P_1}{P_2} :: Split the fractions.
1+r = \frac{1+i}{1+\pi} :: The first ratio is one plus the nominal rate; the second is one over one plus inflation.
r \approx i - \pi :: Take logs; for small rates ln(1+x) is close to x.
```

## Saving and the budget across time
Saving is income minus current spending, and holding income fixed, every extra unit consumed is one less saved. So the saving decision is a decision about consumption over a lifetime. The model keeps it to two periods: the present (1) and the future (2), with income $Y_1$ and $Y_2$ and no initial wealth.

```derive
# The intertemporal budget constraint
C_1 = Y_1 - S_1 :: Today, whatever isn't saved is consumed.
C_2 = Y_2 + (1+r)\,S_1 :: Tomorrow, income plus savings with real interest (a negative S is a debt repaid with interest).
C_2 = Y_2 + (1+r)(Y_1 - C_1) :: Replace saving with what the first line says it is.
C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r} :: Divide by 1+r and collect: saving drops out.
```

The present value of lifetime consumption equals the present value of lifetime resources. Saving is only a tool for moving consumption through time.

Drawn with $C_1$ across and $C_2$ up, the budget line:
- passes through the **endowment point** $(Y_1, Y_2)$, since doing nothing (no borrowing, no lending) is always possible;
- has slope $-(1+r)$: one more unit today costs $1+r$ units tomorrow;
- reaches $Y_2 + (1+r)Y_1$ on the $C_2$ axis (save everything) and $Y_1 + \frac{Y_2}{1+r}$ on the $C_1$ axis (borrow against all future income).

Points left of the endowment mean **lending** ($C_1 < Y_1$, $C_2 > Y_2$); points right of it mean **borrowing**. A **borrowing constraint** cuts off the part to the right. A borrowing rate above the lending rate puts a kink at the endowment point.

## Patience
Preferences are a utility function over the two periods, usually

$$U = u(C_1) + \beta\,u(C_2), \qquad 0 < \beta < 1$$

where $\beta$ is the **subjective discount factor**: patience. The higher $\beta$, the more weight on the future. A common choice is $U = \ln C_1 + \beta\ln C_2$. Bundles with equal utility form an **indifference curve**; farther out is better. Its slope is the **marginal rate of substitution**, how many units of $C_2$ someone would give up for one more unit of $C_1$:

$$MRS_{C_1,C_2} = \frac{u'(C_1)}{\beta\,u'(C_2)}$$

An impatient person (low $\beta$) has steep indifference curves: they'd give up a lot of the future for a little more now.

## The best plan
The best bundle meets two conditions:
- **Feasibility**: it's on the budget line. Anything beyond it is unaffordable; anything inside wastes resources.
- **Tangency**: the indifference curve touches the budget line, $MRS = 1+r$. If it crossed, a better bundle would be affordable.

The tangency condition is the **Euler equation**. With log utility, $u'(C) = 1/C$, so it becomes $C_2 = \beta(1+r)C_1$. Plugging that into the budget constraint:

```derive
# Optimal consumption with log utility
\frac{C_2}{\beta C_1} = 1+r :: Tangency: the MRS equals the slope of the budget line.
C_2 = \beta(1+r)\,C_1 :: The Euler equation.
C_1 + \frac{\beta(1+r)C_1}{1+r} = Y_1 + \frac{Y_2}{1+r} :: Feasibility: put the Euler equation into the budget constraint.
C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right) :: The 1+r cancels; divide by 1+β.
```

Optimal saving is what's left: $S_1^* = Y_1 - C_1^* = \frac{\beta}{1+\beta}Y_1 - \frac{1}{1+\beta}\frac{Y_2}{1+r}$. Here $C_1^*$ rises with $Y_1$ and $Y_2$, falls with $r$ (through the present value of $Y_2$) and falls with patience $\beta$; saving does the opposite on $Y_2$, $r$ and $\beta$, and rises with $Y_1$.

## With initial wealth
Starting with wealth $Wealth_1$, current income is $Y_1 + r\,Wealth_1$, and the budget gains the wealth with its interest:

$$C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r} + (1+r)\,Wealth_1$$

The endowment point moves right by $(1+r)Wealth_1$. That allows something new: someone can **dissave** ($S_1 < 0$, consuming more than current income) and still be a **net lender**, living partly off their wealth while some of it stays invested. With log utility, $C_1^*$ is simply $\frac{1}{1+\beta}$ times the larger total, so more wealth means more consumption now and less saving.
:::

## Interest rates
- $i = \dfrac{ {{V_2}} - V_1}{V_1}$
eq: Nominal interest rate | i = \frac{V_2 - V_1}{V_1}
- When the interest rate rises, a bond with a fixed future payout is worth {{less|more or less?}} today.
- $1 + r = \dfrac{1+i}{ {{1+\pi}} }$
eq: Real interest rate | 1 + r = \frac{1+i}{1+\pi} \quad\Rightarrow\quad r \approx i - \pi
- A 5% nominal rate with 3% inflation gives a real rate of about {{2%|how much?}}.
eq: Real interest rate | 1 + r = \frac{1+i}{1+\pi} \quad\Rightarrow\quad r \approx i - \pi

## The budget across time
- $C_1 + \dfrac{C_2}{1+r} = Y_1 + \dfrac{ {{Y_2}} }{1+r}$
eq: Intertemporal budget constraint | C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}
- Fill in the missing step:
```derive
# The intertemporal budget constraint
C_1 = Y_1 - S_1 :: Today, whatever isn't saved is consumed.
C_2 = Y_2 + {{(1+r)}}\,S_1 :: Tomorrow, income plus savings with interest.
C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r} :: Substitute for saving, divide by 1+r and collect.
```
eq: Intertemporal budget constraint | C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}
- The budget line always passes through the {{endowment point|which point?}}.
- The budget line's slope, in absolute value, is {{1+r|what?}}.
- Choosing $C_1 < Y_1$ means the consumer is a {{lender|borrower or lender?}}.
- A consumer who can't borrow loses the part of the budget line to the {{right|which side?}} of the endowment point.
- In the budget constraint, saving {{drops out|what happens to it?}}: it's only a tool for moving consumption through time.

## Preferences
- In $U = u(C_1) + \beta u(C_2)$, $\beta$ measures {{patience|what?}}.
- A more impatient consumer has {{steeper|steeper or flatter?}} indifference curves.
- The slope of an indifference curve is the marginal rate of {{substitution|what?}}.

## The best plan
- At the best bundle, the indifference curve is {{tangent|what?}} to the budget line.
- With log utility the Euler equation is $C_2 = {{\beta}}(1+r)\,C_1$.
eq: Euler equation | C_2 = \beta\,(1+r)\,C_1
- $C_1^* = \dfrac{1}{ {{1+\beta}} }\left(Y_1 + \dfrac{Y_2}{1+r}\right)$
eq: Optimal consumption | C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)
- Fill in the missing step:
```derive
# Optimal consumption with log utility
C_2 = \beta(1+r)\,C_1 :: The Euler equation.
C_1 + \frac{ {{\beta(1+r)C_1}} }{1+r} = Y_1 + \frac{Y_2}{1+r} :: Put it into the budget constraint.
C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right) :: Cancel 1+r and divide by 1+β.
```
eq: Optimal consumption | C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)
- $S_1^* = \dfrac{\beta}{1+\beta}\,Y_1 - \dfrac{1}{1+\beta}\,\dfrac{ {{Y_2}} }{1+r}$
eq: Optimal saving | S_1^* = \frac{\beta}{1+\beta}\,Y_1 - \frac{1}{1+\beta}\,\frac{Y_2}{1+r}
- With log utility, a higher $\beta$ makes saving {{rise|rise or fall?}}.

## Wealth
- $C_1 + \dfrac{C_2}{1+r} = Y_1 + \dfrac{Y_2}{1+r} + {{(1+r)}}\,Wealth_1$
eq: Intertemporal budget constraint with wealth | C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r} + (1+r)\,Wealth_1
- With initial wealth, current income is $Y_1$ plus {{$r\,Wealth_1$|what?}}.
- With positive wealth, someone can have negative saving and still be a net {{lender|borrower or lender?}}.
