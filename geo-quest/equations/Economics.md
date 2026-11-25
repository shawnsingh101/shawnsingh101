# Equations: Economics

Every equation a card is tagged with (`eq: Real wage | …`), defined once: its formula, what each symbol means, and a
worked example with real numbers. Shown on the back of every card about that equation, and on its page under Equations.

Format: `## Name` (exactly as in the cards' `eq:` lines), the formula in TeX on the next line, then `- symbol | meaning`
lines (the symbol in TeX), then `example:` (text, with $…$ math; write prices as "30 dollars", never with a dollar sign).
Every example's arithmetic is checked by computing it before it's written here.

## Net domestic product
NDP = GDP - \text{depreciation}
- NDP | net domestic product: output after replacing the capital that wore out
- GDP | gross domestic product
- \text{depreciation} | the part of the capital stock that wore out during the period
example: GDP is 20 trillion dollars and 3.2 trillion of capital wore out: $NDP = 20 - 3.2 = 16.8$ trillion.

## Gross national product
GNP = GDP + NFP
- GNP | gross national product (or GNI): what a country's residents earn, wherever they produce it
- GDP | gross domestic product: what's produced inside the country
- NFP | net factor payments from abroad: wages, profits and interest earned abroad minus those paid to foreigners
example: GDP is 500 billion, but foreign owners of local firms take home 20 billion more than residents earn abroad, so $NFP = -20$ and $GNP = 500 - 20 = 480$ billion.

## GDP by expenditure
Y = C + I + G + NX
- Y | GDP: output, equal to total spending on it
- C | consumption by households
- I | investment: new capital goods, homes and the change in inventories
- G | government purchases of goods and services (not transfers like pensions)
- NX | net exports: exports minus imports
example: $C = 14$, $I = 4$, $G = 3.5$ and $NX = -0.8$ (trillions): $Y = 14 + 4 + 3.5 - 0.8 = 20.7$ trillion.

## Growth rate
g = \frac{GDP_1 - GDP_0}{GDP_0}
- g | the growth rate between the two years
- GDP_1 | GDP in the later year
- GDP_0 | GDP in the earlier year
example: GDP goes from 200 to 240: $g = \frac{240 - 200}{200} = 0.2$, growth of 20%.

## Average annual growth
\left(\frac{GDP_n}{GDP_0}\right)^{1/n} - 1
- GDP_n | GDP at the end
- GDP_0 | GDP at the start
- n | the number of years between them
example: UK real GDP rose from 1.244 to 1.866 trillion pounds over 20 years: $\left(\frac{1.866}{1.244}\right)^{1/20} - 1 \approx 0.0205$, about 2% a year.

## GDP deflator
GDP^R = \frac{GDP^N}{P/100}
- GDP^R | real GDP: at base-year prices
- GDP^N | nominal GDP: at this year's prices
- P | the GDP deflator, a price index equal to 100 in the base year
example: Nominal GDP is 240 and the deflator is 106.7 (prices 6.7% above the base year): $GDP^R = \frac{240}{1.067} \approx 225$.

## Nominal growth = real growth + inflation
g_N \approx g_R + \pi
- g_N | growth of nominal GDP
- g_R | growth of real GDP
- \pi | inflation: growth of the price level
example: Real GDP grows 2% and prices 3%: nominal GDP grows about $2 + 3 = 5\%$ (exactly $1.02 \times 1.03 - 1 = 5.06\%$).

## Cobb-Douglas production function
Y = A\,K^{\alpha}N^{1-\alpha}
- Y | output: real GDP
- A | total factor productivity: everything besides capital and labor
- K | the capital stock
- N | labor: workers or hours
- \alpha | capital's share of income (about 1/3); $1-\alpha$ is labor's
example: $A = 2$, $K = 1000$, $N = 125$, $\alpha = 1/3$: $K^{1/3} = 10$ and $N^{2/3} = 25$, so $Y = 2 \times 10 \times 25 = 500$.

## Growth accounting
g_Y \approx g_A + \alpha\, g_K + (1-\alpha)\, g_N
- g_Y | growth of output
- g_A | growth of total factor productivity (found as the residual)
- g_K | growth of the capital stock
- g_N | growth of labor
- \alpha | capital's share of income
example: TFP grows 1%, capital 3%, labor 1.5%, $\alpha = 1/3$: $g_Y \approx 1 + \tfrac{1}{3}(3) + \tfrac{2}{3}(1.5) = 3\%$.

## Marginal product of labor
MPN = (1-\alpha)\,A\,K^{\alpha}N^{-\alpha}
- MPN | the extra output from one more unit of labor
- A | total factor productivity
- K | the capital stock
- N | labor
- \alpha | capital's share of income
example: With $A = 2$, $K = 1000$, $N = 125$, $\alpha = 1/3$ (so $Y = 500$): $MPN = \tfrac{2}{3} \times 2 \times 10 \times \tfrac{1}{5} \approx 2.67$, the same as $(1-\alpha)\,Y/N = \tfrac{2}{3} \times 500/125$.

## Real wage
w = \frac{W}{P}
- w | the real wage: what an hour of work buys, in goods
- W | the nominal wage, in currency per hour
- P | the price level
example: Pay is 30 dollars an hour and the price level is $P = 1.2$ (prices 20% above the base year): $w = 30 / 1.2 = 25$ units of goods per hour.

## Labor demand condition
MPN = w
- MPN | the marginal product of labor: what one more hour of work produces
- w | the real wage: what one more hour of work costs, in goods
example: If the last hour hired produces 2.67 units and costs only 2, hiring more pays; firms keep hiring until diminishing returns bring the $MPN$ down to 2.

## Labor demand
N^D = \left(\frac{(1-\alpha)A}{w}\right)^{1/\alpha} K
- N^D | the labor firms want to hire
- w | the real wage
- A | total factor productivity
- K | the capital stock
- \alpha | capital's share of income
example: With $\alpha = 1/2$, $A = 1$, $K = 1$ and $w = 0.25$: $N^D = \left(\frac{0.5}{0.25}\right)^{2} = 4$, the same as $\frac{1}{4w^2} = \frac{1}{4 \times 0.0625}$.
