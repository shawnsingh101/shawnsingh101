---
title: The labor market
---
How the real wage and employment are set: labor demand from profit-maximizing firms, labor supply from households trading leisure for income, equilibrium, and what a productivity shock does. Lecture 3 of Macroeconomics for Public Policy.

:::lesson
## The real wage
The **nominal wage** $W$ is pay in currency per unit of work. What matters for decisions is what it buys: the **real wage**

$$w = \frac{W}{P}$$

in goods per unit of work. Likewise the real rental cost of capital, $r$, is what one unit of capital earns in goods. In this model $A$, $K$, $\alpha$, preferences and $P$ are exogenous; employment $N$, output $Y$, $w$ and $r$ are endogenous.

## Labor demand
A competitive firm hires until one more worker adds exactly what she costs:

$$MPN = w$$

If the marginal product is above the wage, hiring one more raises profit; below it, letting one go does. This is the familiar "price equals marginal cost" in disguise. So the **labor demand curve is the MPN curve**: downward sloping, because of diminishing returns. Solving $(1-\alpha)AK^{\alpha}N^{-\alpha} = w$ for $N$:

$$N^D = \left(\frac{(1-\alpha)A}{w}\right)^{1/\alpha} K$$

A change in the real wage is a **movement along** labor demand; a change in $A$ or $K$ **shifts** it. How strongly firms respond to the wage is the wage elasticity of demand: for Cobb-Douglas it's $-1/\alpha$.

## Labor supply
Households choose between leisure and the consumption that work pays for. A higher real wage has two effects on people already working (the **intensive margin**):
- **Substitution effect**: leisure now costs more goods per hour, so work **more**.
- **Income effect**: they're richer at any hours, and leisure is a normal good, so work **less**.

The two pull opposite ways, so an individual's supply can rise, fall or stay flat with the wage. For people deciding whether to work at all (the **extensive margin**), there's no income effect: a higher wage can only draw them in, once it passes their **reservation wage**. Adding everyone up, aggregate labor supply is taken to slope **upward**; the flatter it is, the more elastic.

## Equilibrium
Where labor demand meets supply, the model is solved: $w^*$ and $N^*$, then $Y^* = AK^{\alpha}(N^*)^{1-\alpha}$, and the rental rate of capital $r^* = MPK$. The labor graph also shows who gets what: the area under labor demand up to $N^*$ is **GDP** (the sum of every worker's marginal product), the rectangle $w^* N^*$ is **workers' income**, and the area between them is **capital owners' income**. What's produced equals what's paid out.

## A productivity shock
TFP rises. Each worker produces more, so the MPN curve, labor demand, shifts right:

```graph
# A beneficial productivity shock
axes: N | w
ND: down
NS: up
shift ND: right
```

The real wage, employment, output and the return to capital all rise; everyone gains. The more elastic labor supply is, the more employment rises and the less the wage does.
:::

## The real wage
- $w = \dfrac{ {{W}} }{P}$
eq: Real wage | w = \frac{W}{P}
- The real wage is measured in {{goods|what units?}} per unit of work.

## Labor demand
- Firms hire until $MPN = {{w}}$.
eq: Labor demand condition | MPN = w
- The labor demand curve is the {{MPN|which curve?}} curve.
- Labor demand slopes down because of {{diminishing returns|what?}} to labor.
- A change in the real wage is a {{movement along|shift or movement?}} the labor demand curve.

## Labor supply
- A higher wage makes leisure cost more, so the {{substitution|which effect?}} effect says work more.
- A higher wage makes people richer at any hours, so the {{income|which effect?}} effect says work less.
- People already working are on the {{intensive|which margin?}} margin.
- The lowest wage at which someone would take a job is their {{reservation wage|what?}}.

## Equilibrium and shocks
- On the labor market graph, the area under labor demand up to equilibrium employment is {{GDP|what?}}.
- The equilibrium real rental cost of capital equals the {{MPK|what?}}.
- Total factor productivity rises: labor demand shifts {{right|which way?}}, raising the real wage and employment.
```graph
axes: N | w
ND: down
NS: up
shift ND: right
```
- Workers leave the country: labor supply shifts {{left|which way?}}, so the real wage rises and employment falls.
```graph
axes: N | w
ND: down
NS: up
shift NS: left
```
