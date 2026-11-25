---
title: Investment and the saving-investment balance
---
How firms choose investment (the user cost of capital), and the full model: labor market, saving and investment, closed and open, hit by temporary and permanent productivity shocks. Lecture 8 of Macroeconomics for Public Policy.

:::lesson
## From capital to investment
Capital wears out and is replaced:

$$K_2 = (1-d)\,K_1 + I_1$$

So investment is a two-step choice: decide how much capital you want next period, $K_2^*$, then invest whatever it takes to get there from what survives:

$$I_1 = K_2^* - (1-d)\,K_1$$

## How much capital
Investment is like planting a tree: the cost comes now, the fruit later. Buying one more machine at real price $p_K$ yields, next period, its marginal product $MPK_2$ plus whatever is left of the machine, $p_K(1-\delta)$ (assuming machine prices rise with inflation). Compare cost and benefit at the same date:

```derive
# The user cost of capital
p_K(1+r) \;\text{vs.}\; MPK_2 + p_K(1-\delta) :: Cost (with the interest given up) against benefit, both valued next period.
p_K(1+r) - p_K(1-\delta) \;\text{vs.}\; MPK_2 :: Subtract the machine's leftover value from both sides.
p_K(r+\delta) \;\text{vs.}\; MPK_2 :: Simplify: the cost of using capital for a period.
MPK_2 = p_K(r+\delta) :: Add capital until the benefit falls to the cost.
```

$p_K(r+\delta)$ is the **user cost of capital**: the interest forgone plus the wear. Because of diminishing returns, $MPK_2$ falls as capital grows, so firms add capital until it equals the user cost, exactly as they hire labor until $MPN = w$.

So investment:
- **falls** with the real interest rate $r$, the price of capital $p_K$ and the depreciation rate $\delta$ of new capital (each raises the user cost);
- **rises** with expected future productivity, which raises $MPK_2$. Stock prices are a good proxy: a rising market value says investors expect higher profits;
- **falls** with today's capital stock $K_1$ (less is needed to reach the target), and **rises** with the depreciation of existing capital $d$ (a disaster destroying capital means more to replace).

Drawn against $r$, investment slopes **down**; a change in $r$ moves along it, anything else shifts it.

## The whole model
Output is set by the supply side: the labor market fixes $N^*$, and the production function gives $Y^*$. Then spending must match it, $Y = C + I + G + NX$, which is the same as the market for loanable funds clearing: saving supplies funds, investment demands them.
- **Closed economy**: $S = I$. The real interest rate adjusts to make it so.
- **Small open economy**: $r$ is the world rate, $r_W$, set abroad. Saving and investment can differ, and the gap is the current account: $S - I = CA$.
- **Large open economy**: its saving and investment move the world rate.

```graph
# A small open economy below its closed-economy rate
axes: S, I | r
S: up
I: down
rW: horizontal 0.32
```

If the world rate is below the rate that would clear the market at home, investment exceeds saving at $r_W$: the country runs a current account deficit, financed by a financial inflow from abroad.

## A temporary productivity shock
Good weather raises TFP this year only ($A_1$ up, $A_2$ unchanged). Labor demand shifts right, so employment and output rise. The gain is temporary, so households consume part and **save the rest**: saving shifts right. Expected future productivity hasn't changed, so investment doesn't shift.

```graph
# A temporary productivity shock, closed economy
axes: S, I | r
S: up
I: down
shift S: right
```

- **Closed**: the real rate falls until investment absorbs the extra saving. $C$ and $I$ both rise.
- **Small open**: the rate stays at $r_W$, investment is unchanged, and the extra saving goes abroad. Net exports and the **current account rise**.

## A permanent productivity shock
Better institutions raise TFP now and later ($A_1$ and $A_2$ up). Labor demand rises, but workers also feel permanently richer and supply a bit less; employment is assumed to rise, though by less than after a temporary shock. Future capital will be more productive, so **investment shifts right**. Income is up for good, so consumption rises about as much as income and saving doesn't shift.

```graph
# A permanent productivity shock, closed economy
axes: S, I | r
S: up
I: down
shift I: right
```

- **Closed**: the real rate rises; saving rises along the curve and investment rises by less than the shift.
- **Small open**: the rate stays put, absorption rises more than output, so net exports and the **current account fall**: the country borrows from abroad.

## The lesson
Countries, like people, smooth absorption. A **temporary** windfall is partly saved, so the current account rises. A **permanent** improvement raises living standards for good, and the country borrows to bring some of that future forward, so the current account falls.
:::

## Investment
- $K_2 = {{(1-d)}}\,K_1 + I_1$
eq: Capital accumulation | K_2 = (1-d)\,K_1 + I_1
- $I_1 = {{K_2^*}} - (1-d)\,K_1$
eq: Optimal investment | I_1 = K_2^* - (1-d)\,K_1
- $p_K(r + \delta)$ is called the {{user cost|what?}} of capital.
eq: User cost of capital | uc = p_K\,(r + \delta)
- Firms add capital until $MPK_2 = p_K\,({{r + \delta}})$
eq: Optimal capital | MPK_2 = p_K\,(r + \delta)
- Fill in the missing step:
```derive
# The user cost of capital
p_K(1+r) \;\text{vs.}\; MPK_2 + p_K(1-\delta) :: Cost against benefit, both valued next period.
{{p_K(r+\delta)}} \;\text{vs.}\; MPK_2 :: Subtract the leftover value of the machine from both sides.
MPK_2 = p_K(r+\delta) :: Add capital until the benefit falls to the cost.
```
eq: Optimal capital | MPK_2 = p_K\,(r + \delta)
- A higher real interest rate makes investment {{fall|rise or fall?}}.
- Expected future productivity rising makes investment {{rise|rise or fall?}}.
- A good market proxy for the expected future productivity of capital is the {{stock market|what?}} value of firms.
- An earthquake destroys part of the capital stock: investment {{rises|rises or falls?}}, even with the target unchanged.

## The whole model
- In a closed economy, the real interest rate adjusts until saving equals {{investment|what?}}.
- In a small open economy, the real interest rate is set by {{world|which?}} capital markets.
- In an open economy, saving minus investment equals the {{current account|what?}}.
- At a world rate below the closed-economy rate, a small open economy runs a current account {{deficit|surplus or deficit?}}.
```graph
axes: S, I | r
S: up
I: down
rW: horizontal 0.32
```

## Productivity shocks
- A temporary productivity shock shifts the {{saving|which?}} curve right.
```graph
axes: S, I | r
S: up
I: down
shift S: right
```
- After a temporary productivity shock in a closed economy, the real interest rate {{falls|rises or falls?}}.
- After a temporary productivity shock in a small open economy, the current account {{rises|rises or falls?}}.
- A permanent productivity shock shifts the {{investment|which?}} curve right.
```graph
axes: S, I | r
S: up
I: down
shift I: right
```
- After a permanent productivity shock in a closed economy, the real interest rate {{rises|rises or falls?}}.
- After a permanent productivity shock in a small open economy, the current account {{falls|rises or falls?}}.
- Countries, like people, want to smooth {{absorption|what?}} over time.
