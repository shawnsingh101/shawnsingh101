---
title: Income inequality
---
Why wage gaps have widened inside most countries: the wage skill premium as a market for skill, and what migration, trade, offshoring, skill-biased technology and monopsony do to it. Lecture 4 of Macroeconomics for Public Policy.

:::lesson
## Between countries and within them
Over the last forty years, the income gap **between** countries has narrowed somewhat, while inequality **within** most countries has grown a lot. That makes GDP per person a weaker guide to how a typical citizen is doing. The production model from Lectures 2 and 3 can explain much of the change.

## The wage skill premium
The headline measure is the **wage skill premium**: the wage of skilled workers relative to the low-skilled, $W_S / W_L$. Dividing both wages by the same price level changes nothing, so the nominal and real premiums are equal:

$$\frac{W_S}{W_L} = \frac{w_S}{w_L}$$

Split labor into skilled units $S$ and low-skilled units $L$:

$$Y = A\,S^{\alpha}L^{1-\alpha}$$

Firms pay each kind of work its marginal product, so the premium equals the ratio of marginal products. Solving for $S/L$ gives the **relative demand for skill**:

```derive
# Relative demand for skill
\frac{w_S}{w_L} = \frac{MP_S}{MP_L} :: Each kind of work is paid its marginal product.
\frac{w_S}{w_L} = \frac{\alpha A S^{\alpha-1}L^{1-\alpha}}{(1-\alpha)A S^{\alpha}L^{-\alpha}} :: Differentiate the production function by S and by L.
\frac{w_S}{w_L} = \frac{\alpha}{1-\alpha}\,\frac{L}{S} :: A cancels; collect the powers of S and L.
\frac{S}{L} = \frac{\alpha}{1-\alpha}\,\frac{w_L}{w_S} :: Solve for the skill ratio firms want.
```

It slopes down: the higher the premium, the fewer skilled workers per low-skilled one firms hire. TFP cancels out, because it raises both marginal products in the same proportion. Its responsiveness is the **elasticity of substitution**, the percent change in $S/L$ for a 1% change in the premium; for Cobb-Douglas it is exactly 1.

The **relative supply of skill** is taken to be vertical: training takes years, so in the short run the mix of skills barely responds to pay. Over longer periods it becomes more elastic.

```graph
# The market for skill
axes: S/L | wS/wL
RD: down
RS: vertical 0.5
```

So the premium rises when relative **demand** for skill shifts right, or relative **supply** shifts left.

## Globalization: migration
Wages are higher in advanced countries, so workers of both kinds gain by moving there, and the low-skilled gain the most, since they're scarcer in the destination. Many skilled migrants also end up in low-skilled jobs. In the advanced country, low-skilled work grows faster than skilled: relative supply of skill shifts **left**, and the premium rises. In the country of origin the opposite happens. So migration fits rising inequality in rich countries but not in poor ones, unless migration is costly enough that mainly the skilled leave.

## Globalization: trade and offshoring
Trade liberalization works the same way: advanced countries specialize in skill-intensive goods (relative demand for skill rises, premium up), poorer countries in low-skill-intensive goods (premium down). Again it fits only the rich side.

**Offshoring** is different. Cheaper transport and lower trade costs let firms split the value chain across countries. Advanced countries send their least skill-intensive stages abroad and keep R&D and marketing, so their demand for skill rises. But a stage that's low-skilled by rich-country standards is skill-intensive by poor-country standards, so demand for skill rises **there too**. Offshoring can widen the premium in both.

## Skill-biased technical change
If technology raises the productivity of skilled work more than low-skilled (computers that complement analysts and replace routine jobs), relative demand for skill shifts right **everywhere**:

```graph
# Skill-biased technical change
axes: S/L | wS/wL
RD: down
RS: vertical 0.5
shift RD: right
```

That fits the evidence in both rich and poor countries. Jan Tinbergen, the first winner of the economics Nobel, put it as a **race between technology and education**: technology pushes demand for skill right, and education pushes the supply right to keep the premium in check.

## Monopsony
A **monopsony** is a single large buyer of labor, such as the one big employer in a town. Because it faces an upward-sloping labor supply, hiring one more worker means raising pay for everyone, so the marginal cost of labor is above the wage. It hires where $MPN$ equals that marginal cost, so it employs fewer workers and pays them less than their marginal product. The gap is the **markdown**:

$$\frac{MPN}{w} = 1 + \frac{1}{\varepsilon}$$

where $\varepsilon$ is the elasticity of labor supply. The less elastic supply is, the bigger the markdown; in perfect competition the ratio is 1.

## Other forces
- **Superstar effect**: technology lets the most talented reach far more customers, so pay at the very top pulls away.
- **Assortative mating**: people increasingly marry partners with similar education, and both work, which multiplies income gaps between households and the home environments their children grow up in.

## Efficiency and redistribution
An allocation is **efficient** when no one can be made better off without hurting someone else. In this model, that means making the pie, GDP, as big as it can be, whoever gets the slices. Efficiency is silent on how the pie is shared. Choosing among efficient allocations takes a criterion of social justice, whether egalitarian or one that rewards effort.
:::

## The wage skill premium
- Over the last forty years, inequality between countries has narrowed while inequality {{within|between or within?}} most countries has grown.
- The wage skill premium is the wage of skilled workers divided by the wage of the {{low-skilled|whose?}}.
- The ratio of real wages, $w_S/w_L$, equals the ratio of {{nominal|which?}} wages.
eq: Wage skill premium | \frac{W_S}{W_L} = \frac{w_S}{w_L}
- The nominal and real premiums are equal because the {{price level|what cancels?}} divides both wages.

## Relative demand and supply of skill
- $\dfrac{S}{L} = \dfrac{\alpha}{1-\alpha}\,\dfrac{ {{w_L}} }{w_S}$
eq: Relative demand for skill | \frac{S}{L} = \frac{\alpha}{1-\alpha}\,\frac{w_L}{w_S}
- With Cobb-Douglas, TFP doesn't change relative demand for skill, because it raises both marginal products in the same {{proportion|what?}}.
- For Cobb-Douglas, the elasticity of substitution between skilled and low-skilled work is {{1|what number?}}.
- In the short run the relative supply of skill is drawn {{vertical|what shape?}}, because training takes time.
- Fill in the missing step:
```derive
# Relative demand for skill
\frac{w_S}{w_L} = \frac{MP_S}{MP_L} :: Each kind of work is paid its marginal product.
\frac{w_S}{w_L} = \frac{\alpha}{1-\alpha}\,\frac{ {{L}} }{S} :: Differentiate, cancel A and collect powers.
\frac{S}{L} = \frac{\alpha}{1-\alpha}\,\frac{w_L}{w_S} :: Solve for the skill ratio.
```
eq: Relative demand for skill | \frac{S}{L} = \frac{\alpha}{1-\alpha}\,\frac{w_L}{w_S}

## Globalization and technology
- Low-skilled immigration into a rich country shifts its relative supply of skill {{left|which way?}}, raising the premium there.
```graph
axes: S/L | wS/wL
RD: down
RS: vertical 0.5
shift RS: left
```
- Migration and trade explain rising inequality in rich countries but not in {{poor|which?}} ones.
- Firms splitting the value chain across countries is called {{offshoring|what?}}.
- Technology that raises the productivity of skilled work more than low-skilled is {{skill-biased|what kind of?}} technical change.
- Skill-biased technical change shifts relative demand for skill {{right|which way?}} in rich and poor countries alike.
```graph
axes: S/L | wS/wL
RD: down
RS: vertical 0.5
shift RD: right
```
- Tinbergen described inequality as a race between technology and {{education|what?}}.

## Market power and other forces
- A single dominant employer of labor is a {{monopsony|what?}}.
- A monopsonist pays workers {{less|more or less?}} than their marginal product.
- $\dfrac{MPN}{w} = 1 + \dfrac{1}{ {{\varepsilon}} }$
eq: Monopsony markdown | \frac{MPN}{w} = 1 + \frac{1}{\varepsilon}
- The most talented reaching far more customers through technology is the {{superstar|what?}} effect.
- Marrying someone with similar education is called {{assortative|what kind of?}} mating.
- An allocation where no one can gain without someone losing is {{efficient|what?}}.
