---
title: Measuring GDP
---
How economic activity is measured: the three approaches, what GDP does and doesn't count, growth rates, nominal and real GDP, the GDP deflator and inflation. Lecture 1 of Macroeconomics for Public Policy.

:::lesson
## One activity, three ways to count it
The national accounts (NIPA in the US, the UN's System of National Accounts everywhere else) measure an economy's activity three ways, and by construction all three give the same answer:
- **Product approach**: the market value of everything newly produced, minus the intermediate goods used up making it. What's left is the value each stage of production added, so it's also called the **value-added** approach.
- **Expenditure approach**: the market value of all final goods and services purchased.
- **Income approach**: everything paid out to the factors of production: wages, profits, taxes.

Production and sales don't always match in a year, so the accounts pretend unsold output was "bought" by its producers: a **change in inventories** (negative in a year when firms sell more than they make). The income approach matches because the value of what's produced is exactly what's paid out to the people and capital that produced it: revenue minus intermediate goods equals profits plus wages plus taxes.

## What GDP counts
**GDP** (gross domestic product) is the market value of newly produced final goods and services in a country over a period of time. Each part of that definition does work:
- **Market value**: it needs a price. Cooking at home isn't counted. Free government services (schools, defense) are counted at their cost of production. Free online services are a growing blind spot.
- **Newly produced**: a 30-year-old house sold today adds nothing to this year's GDP, but the broker's fee does: it's a new service.
- **Final**: intermediate goods (cotton turned into fabric) aren't counted twice. **Capital goods** (equipment, factories, software) are final goods even though they're used in production, because they don't vanish when used. The part of the capital stock that wears out each year is **depreciation**, and $NDP = GDP - \text{depreciation}$.
- **In a country**: by geography. Counting what a country's *citizens* produce, wherever they are, gives **GNP** (gross national product, or GNI): $GNP = GDP + NFP$, where NFP is net factor payments from abroad (wages, profits and interest flowing in, minus those flowing out).
- **Over a period**: GDP is a **flow**, measured per year or quarter. The stock of capital, or any asset, is a **stock**, measured at a moment.

The spending side of GDP is the most used equation in macroeconomics:

$$Y = C + I + G + NX$$

consumption, investment, government purchases and net exports (exports minus imports).

## Growth rates
GDP's change is reported as a growth rate:

$$g = \frac{GDP_1 - GDP_0}{GDP_0} \quad\Longleftrightarrow\quad GDP_1 = GDP_0\,(1+g)$$

A percentage is comparable across decades and countries; a change in dollars or lira isn't.

## Nominal and real
Adding apples and oranges takes prices, but prices change: if prices double and nothing else does, GDP at current prices doubles too. That's **nominal GDP**. **Real GDP** values each year's quantities at the prices of a fixed **base year**, so it moves only when quantities do. In the base year, nominal and real GDP are equal.

The catch: real growth depends on the base year. Real growth is a weighted average of each good's growth, weighted by its share of value at base-year prices. In the course's example, food grows 5% and software 20%: with 2012 prices they weigh half each and real growth is 12.5%; with 2019 prices (software got cheaper) software weighs less and growth is 11.6%. Since the 1990s, **chain-weighted** real GDP solves this by always using the previous year as the base, so history isn't rewritten each time the base year changes.

## Prices and inflation
A price index $P$ measures the average price level relative to a base year (where it equals 100). The **GDP deflator** turns nominal into real:

$$GDP^R = \frac{GDP^N}{P/100}$$

**Inflation** $\pi$ is the growth rate of a price index. The three growth rates fit together:

```derive
# Nominal growth = real growth + inflation
GDP^N = GDP^R \cdot \frac{P}{100} :: Nominal GDP is real GDP valued at the price level.
1+g_N = \frac{GDP^N_1}{GDP^N_0} = \frac{GDP^R_1}{GDP^R_0}\cdot\frac{P_1}{P_0} :: Divide this year by last year.
1+g_N = (1+g_R)(1+\pi) :: Each ratio is one plus a growth rate.
g_N = g_R + \pi + g_R\,\pi :: Multiply out.
g_N \approx g_R + \pi :: When both are small, their product is negligible.
```
:::

## Three ways to count
- The product approach counts the {{value added|what?}} at each stage of production.
- The approach that counts the market value of all final goods and services purchased is the {{expenditure|which approach?}} approach.
- The approach that counts what is paid to the factors of production is the {{income|which approach?}} approach.
- Output that's made but not sold this year is counted as a change in {{inventories|what?}}.

## What counts
- Cooking at home isn't in GDP because it has no {{market value|what does it lack?}}.
- Free government services, like public schools, are counted at their {{cost of production|how?}}.
- Selling a 30-year-old house adds nothing to this year's GDP, but the broker's {{fee|what does?}} does.
- Equipment, factories and software count as {{final|which kind of?}} goods.
- $NDP = GDP - {{\text{depreciation}}}$
eq: Net domestic product | NDP = GDP - \text{depreciation}
- $GNP = GDP + {{NFP}}$, adding net factor payments from abroad.
eq: Gross national product | GNP = GDP + NFP
- GDP is a {{flow|stock or flow?}} variable; the capital stock is a stock.
- $Y = C + I + G + {{NX}}$
eq: GDP by expenditure | Y = C + I + G + NX

## Growth, real and nominal
- $g = \dfrac{ {{GDP_1 - GDP_0}} }{GDP_0}$
eq: Growth rate | g = \frac{GDP_1 - GDP_0}{GDP_0}
- Real GDP values each year's quantities at the prices of a {{base year|which year's prices?}}.
- In the base year, nominal GDP equals {{real GDP|what?}}.
- Real growth changes with the choice of base year; {{chain-weighted|what kind of?}} real GDP fixes that.
- $GDP^R = \dfrac{GDP^N}{ {{P/100}} }$
eq: GDP deflator | GDP^R = \frac{GDP^N}{P/100}
- Inflation is the {{growth rate|what?}} of a price index.
- Fill in the missing step:
```derive
# Nominal growth = real growth + inflation
1+g_N = \frac{GDP^N_1}{GDP^N_0} = \frac{GDP^R_1}{GDP^R_0}\cdot\frac{P_1}{P_0} :: Divide this year's nominal GDP by last year's, then write each as real GDP times the price level.
1+g_N = (1+g_R)({{1+\pi}}) :: Each ratio is one plus a growth rate.
g_N \approx g_R + \pi :: Multiply out; the tiny product of two small rates drops.
```
eq: Nominal growth = real growth + inflation | g_N \approx g_R + \pi
- $g_N \approx g_R + {{\pi}}$
eq: Nominal growth = real growth + inflation | g_N \approx g_R + \pi
