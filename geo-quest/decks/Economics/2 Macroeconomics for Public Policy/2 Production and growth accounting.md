---
title: Production and growth accounting
---
The first model: the Cobb-Douglas production function, what total factor productivity means, how GDP growth splits into its sources, and the properties that drive everything after. Lecture 2 of Macroeconomics for Public Policy.

:::lesson
## Models, endogenous and exogenous
A **model** is a simplified picture of reality, built on assumptions written as equations. The variables it solves for are **endogenous**; the ones it takes as given are **exogenous**. In a supply-and-demand model, price and quantity are endogenous; income, weather and tastes are exogenous: they matter, but the model doesn't explain them. A **shock** is a change in an exogenous variable, and the point of a model is to see how the endogenous variables respond.

## The Cobb-Douglas production function
The economy's output (real GDP, $Y$) comes from its inputs:

$$Y = A\,K^{\alpha}N^{1-\alpha}, \qquad 0<\alpha<1,\; A>0$$

- $K$ is the stock of physical capital at the start of the period.
- $N$ is labor: workers, or hours worked.
- $A$ is **total factor productivity** (TFP): everything else that affects output with $K$ and $N$ held fixed. Technology, institutions, the rule of law, energy, distortions. Because it's measured as whatever is left over, it's been called "the measure of our ignorance".
- $\alpha$ is capital's share of income, and $1-\alpha$ labor's. In the US $\alpha$ was long taken to be about **1/3**: capital owners earned a third of GDP, workers two thirds, though labor's share has fallen in recent years.

The exponents are also **elasticities**: a 1% rise in $N$ raises $Y$ by $(1-\alpha)$%, a 1% rise in $K$ by $\alpha$%. Taking logs shows it at once:

$$\ln Y = \ln A + \alpha\ln K + (1-\alpha)\ln N$$

## Growth accounting
Where does GDP growth come from? Step through:

```derive
# Growth accounting
Y = A\,K^{\alpha}N^{1-\alpha} :: Start from the production function, in two years.
1+g_Y = (1+g_A)(1+g_K)^{\alpha}(1+g_N)^{1-\alpha} :: Divide this year's output by last year's: each input's growth enters raised to its exponent.
\ln(1+g_Y) = \ln(1+g_A) + \alpha\ln(1+g_K) + (1-\alpha)\ln(1+g_N) :: Take logs: products become sums, exponents become multipliers.
g_Y \approx g_A + \alpha\, g_K + (1-\alpha)\, g_N :: For small growth rates, ln(1+x) is very close to x.
```

Every term but $g_A$ can be measured, so TFP growth is found as the **residual**: $g_A = g_Y - \alpha g_K - (1-\alpha) g_N$. If GDP grows faster than the weighted growth of capital and labor, TFP grew; if slower, TFP fell.

Per person, the same steps give the four sources of growth in GDP per capita:

$$g_y = \underbrace{g_A}_{\text{TFP}} + \underbrace{\alpha\, g_k}_{\text{capital deepening}} + \underbrace{(1-\alpha)(g_E + g_{N_2})}_{\text{labor utilization}} + \underbrace{(1-\alpha)\,g_H}_{\text{human capital}}$$

where $E$ is employment over population, $N_2$ average hours, and $H$ human capital (years of schooling). **Structural policies** aim at one of these: education and labor participation; investment, infrastructure and finance (capital deepening); and for TFP, technology transfer, the business environment, institutions, the rule of law, trade and moving workers to more productive sectors.

## The properties that matter
The **marginal product of labor** is the extra output from one more unit of labor:

$$MPN = \frac{\partial Y}{\partial N} = (1-\alpha)\,A\,K^{\alpha}N^{-\alpha} \qquad MPK = \alpha\,A\,K^{\alpha-1}N^{1-\alpha}$$

- **Positive**: more of any input means more output.
- **Diminishing returns**: holding everything else fixed, each extra worker adds less than the one before (and each extra machine less than the last).
- **Complements**: more capital makes labor more productive, and more labor makes capital more productive.
- **TFP raises both** marginal products.
- **Constant returns to scale**: double both $K$ and $N$ and $Y$ doubles, because $\alpha + (1-\alpha) = 1$. Replicate an economy and you get twice the output.
:::

## Models
- Variables a model solves for are {{endogenous|what kind of?}}.
- Variables a model takes as given are {{exogenous|what kind of?}}.
- A shock is a change in an {{exogenous|which kind of?}} variable.

## The production function
- $Y = A\,K^{\alpha}N^{ {{1-\alpha}} }$
eq: Cobb-Douglas production function | Y = A\,K^{\alpha}N^{1-\alpha}
- In the Cobb-Douglas function, $A$ is {{total factor productivity|what?}}: everything besides capital and labor that affects output.
- In the US, capital's share of income $\alpha$ was long taken to be about {{1/3|what fraction?}}.
- A 1% rise in labor raises output by {{$1-\alpha$|how many percent?}} percent.
eq: Cobb-Douglas production function | Y = A\,K^{\alpha}N^{1-\alpha}

## Growth accounting
- $g_Y \approx g_A + \alpha\, g_K + {{(1-\alpha)}}\, g_N$
eq: Growth accounting | g_Y \approx g_A + \alpha\, g_K + (1-\alpha)\, g_N
- Fill in the missing step:
```derive
# Growth accounting
1+g_Y = (1+g_A)(1+g_K)^{\alpha}(1+g_N)^{1-\alpha} :: Divide this year's output by last year's.
\ln(1+g_Y) = \ln(1+g_A) + {{\alpha}}\ln(1+g_K) + (1-\alpha)\ln(1+g_N) :: Take logs: exponents become multipliers.
g_Y \approx g_A + \alpha\, g_K + (1-\alpha)\, g_N :: For small rates, ln(1+x) is about x.
```
eq: Growth accounting | g_Y \approx g_A + \alpha\, g_K + (1-\alpha)\, g_N
- TFP can't be observed, so its growth is what's left after the others: a {{residual|what?}}.
- Growth in capital per person is called capital {{deepening|what?}}.
- More years of schooling raise GDP per person through {{human capital|which term?}}.

## Marginal products
- $MPN = {{(1-\alpha)}}\,A\,K^{\alpha}N^{-\alpha}$
eq: Marginal product of labor | MPN = (1-\alpha)\,A\,K^{\alpha}N^{-\alpha}
- With capital fixed, each extra worker adds {{less|more or less?}} output than the one before: diminishing returns.
- Adding capital makes each worker {{more|more or less?}} productive.
- Doubling both capital and labor {{doubles|does what to?}} output: constant returns to scale.
