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

## Wage skill premium
\frac{W_S}{W_L} = \frac{w_S}{w_L}
- W_S | the nominal wage of skilled workers
- W_L | the nominal wage of low-skilled workers
- w_S, w_L | the same wages in real terms (each divided by the price level $P$)
example: Skilled workers earn 60 dollars an hour and low-skilled 25: the premium is $60/25 = 2.4$. With $P = 1.2$ the real wages are 50 and about 20.83, and $50/20.83 = 2.4$ again: the price level cancels.

## Relative demand for skill
\frac{S}{L} = \frac{\alpha}{1-\alpha}\,\frac{w_L}{w_S}
- S | skilled work units
- L | low-skilled work units
- \alpha | the exponent on skilled work in $Y = AS^{\alpha}L^{1-\alpha}$
- w_S/w_L | the wage skill premium
example: With $\alpha = 0.4$ and a premium of 2, firms want $\frac{S}{L} = \frac{0.4}{0.6} \times \frac{1}{2} \approx 0.33$: one skilled unit for every three low-skilled.

## Monopsony markdown
\frac{MPN}{w} = 1 + \frac{1}{\varepsilon}
- MPN | the marginal product of labor: what the last worker produces
- w | the real wage the monopsonist pays
- \varepsilon | the elasticity of labor supply the firm faces (infinite in perfect competition, where the ratio is 1)
example: With $\varepsilon = 4$, $\frac{MPN}{w} = 1.25$: a worker who produces 25 units an hour is paid $25 / 1.25 = 20$.

## Wealth
Wealth = Assets - Liabilities
- Wealth | net worth, a stock measured at a moment
- Assets | what is owned: real assets (homes, land, capital) and financial assets (claims on others)
- Liabilities | what is owed to others
example: A house worth 300,000 dollars and savings of 50,000, with a 200,000 mortgage: $Wealth = 350{,}000 - 200{,}000 = 150{,}000$.

## Change in wealth
\Delta Wealth = Saving + \Delta\text{price of existing assets and liabilities}
- \Delta Wealth | the change in net worth over the period
- Saving | income minus current spending
- \Delta\text{price…} | gains or losses on what was already owned or owed
example: Someone saves 20,000 dollars, but their house falls 50,000 in value: $\Delta Wealth = 20{,}000 - 50{,}000 = -30{,}000$.

## Gross national disposable income
GNDI = Y + NI + NUT
- GNDI | what a country's residents have to spend or save
- Y | GDP
- NI | net primary income from abroad: wages, interest and profits in, minus those out
- NUT | net unilateral transfers (secondary income): remittances and aid in, minus out
example: $Y = 1000$, $NI = -30$ and $NUT = 10$: $GNDI = 1000 - 30 + 10 = 980$.

## National saving
S = I + NX + NI + NUT
- S | national saving: national income minus consumption and government purchases
- I | investment
- NX | net exports
- NI | net primary income from abroad
- NUT | net unilateral transfers
example: $I = 200$, $NX = -40$, $NI = -30$, $NUT = 10$: $S = 200 - 40 - 30 + 10 = 140$. Saving covers only 140 of the 200 invested; the other 60 comes from abroad.

## Balance of payments
CA + KA = \Delta FA - \Delta FL
- CA | the current account balance
- KA | the capital account: non-produced assets (land, rights) and capital transfers like debt forgiveness
- \Delta FA | residents' net purchases of foreign financial assets
- \Delta FL | foreigners' net purchases of domestic financial assets (new foreign liabilities)
example: China sells 10 to the US and buys 1: $CA = +9$, and China ends up holding 9 more in US assets: $\Delta FA = +9$. For the US, $CA = -9$ and $\Delta FL = +9$.

## Current account
\Delta NFA = CA = NX + NI + NUT = S - I = GNDI - ABS
- NFA | net foreign assets: foreign assets minus foreign liabilities
- CA | the current account balance
- NX, NI, NUT | net exports, net primary income, net unilateral transfers
- S, I | national saving and investment
- GNDI, ABS | national income and absorption ($C + I + G$)
example: $NX = -40$, $NI = -30$, $NUT = 10$: $CA = -60$. The same number three ways: $S - I = 140 - 200$, and $GNDI - ABS = 980 - 1040$. Net foreign assets fall by 60.

## Nominal interest rate
i = \frac{V_2 - V_1}{V_1}
- i | the nominal interest rate
- V_1 | the asset's value today
- V_2 | its value next period
example: Pay 100 dollars for a bond that pays back 105: $i = \frac{105 - 100}{100} = 5\%$.

## Real interest rate
1 + r = \frac{1+i}{1+\pi} \quad\Rightarrow\quad r \approx i - \pi
- r | the real interest rate: the return in goods
- i | the nominal interest rate
- \pi | inflation
example: $i = 5\%$ and $\pi = 3\%$: $1 + r = 1.05/1.03 \approx 1.0194$, so $r \approx 1.94\%$, close to the shortcut $5 - 3 = 2\%$.

## Intertemporal budget constraint
C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}
- C_1, C_2 | consumption now and in the future
- Y_1, Y_2 | income now and in the future
- r | the real interest rate
example: $Y_1 = 100$, $Y_2 = 110$, $r = 10\%$: lifetime resources are worth $100 + 110/1.1 = 200$ today. Consume 90 now, save 10, and the future allows $C_2 = 110 + 1.1 \times 10 = 121$; check: $90 + 121/1.1 = 200$.

## Intertemporal budget constraint with wealth
C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r} + (1+r)\,Wealth_1
- C_1, C_2 | consumption now and in the future
- Y_1, Y_2 | labor income now and in the future
- Wealth_1 | wealth at the start of period 1; with its interest it is worth $(1+r)Wealth_1$ in period 1
- r | the real interest rate
example: $Y_1 = 100$, $Y_2 = 110$, $r = 10\%$ and $Wealth_1 = 50$: resources are $100 + 100 + 55 = 255$.

## Euler equation
C_2 = \beta\,(1+r)\,C_1
- C_1, C_2 | consumption now and in the future
- \beta | the discount factor, between 0 and 1: patience
- r | the real interest rate
example: With $\beta = 0.9$, $r = 10\%$ and $C_1 = 100$: $C_2 = 0.9 \times 1.1 \times 100 = 99$. Patience and interest nearly cancel, so consumption is almost flat.

## Optimal consumption
C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)
- C_1^* | the best consumption now, with $\ln C_1 + \beta\ln C_2$ preferences
- \beta | the discount factor (patience)
- Y_1, Y_2 | income now and in the future
- r | the real interest rate
example: $Y_1 = 150$, $Y_2 = 55$, $r = 10\%$, $\beta = 0.6$: resources are $150 + 55/1.1 = 200$, so $C_1^* = 200/1.6 = 125$. Saving is 25, and $C_2 = 0.6 \times 1.1 \times 125 = 82.5 = 55 + 1.1 \times 25$.

## Optimal saving
S_1^* = \frac{\beta}{1+\beta}\,Y_1 - \frac{1}{1+\beta}\,\frac{Y_2}{1+r}
- S_1^* | the best saving now: $Y_1 - C_1^*$
- \beta | the discount factor (patience)
- Y_1, Y_2 | income now and in the future
- r | the real interest rate
example: $Y_1 = 150$, $Y_2 = 55$, $r = 10\%$, $\beta = 0.6$: $S_1^* = \tfrac{0.6}{1.6}(150) - \tfrac{1}{1.6}(50) = 56.25 - 31.25 = 25$.

## Marginal propensity to consume
MPC = \frac{\Delta C}{\Delta Y}, \qquad MPS = 1 - MPC
- MPC | the share of an extra unit of current income that is consumed
- MPS | the share that is saved
- \Delta C, \Delta Y | the change in consumption and in current income
example: A one-time bonus of 100 dollars raises spending by 60: $MPC = 0.6$ and $MPS = 0.4$.

## Capital accumulation
K_2 = (1-d)\,K_1 + I_1
- K_1, K_2 | the capital stock now and next period
- d | the depreciation rate: the share of capital that wears out
- I_1 | gross investment this period
example: $K_1 = 1000$, $d = 5\%$, $I_1 = 80$: $K_2 = 950 + 80 = 1030$.

## Optimal investment
I_1 = K_2^* - (1-d)\,K_1
- I_1 | investment this period
- K_2^* | the capital stock firms want next period
- K_1 | capital today
- d | the depreciation rate
example: Firms want $K_2^* = 1100$; with $K_1 = 1000$ and $d = 5\%$, 950 survives, so they invest $1100 - 950 = 150$.

## User cost of capital
uc = p_K\,(r + \delta)
- uc | what one more unit of capital really costs for a period, in goods
- p_K | the real price of a unit of capital
- r | the real interest rate: the return given up on the money
- \delta | the depreciation rate on the new capital
example: A machine costs 10,000, $r = 3\%$, $\delta = 10\%$: $uc = 10{,}000 \times 0.13 = 1300$ a year.

## Optimal capital
MPK_2 = p_K\,(r + \delta)
- MPK_2 | the future marginal product of capital
- p_K\,(r+\delta) | the user cost of capital
example: With a user cost of 1300, firms add machines while the next one would produce more than 1300 a year, and stop when diminishing returns bring $MPK_2$ down to 1300.

## Net foreign assets over time
NFA_2 = (1+r)\,NFA_1 + NX_1 + NUT_1
- NFA_1, NFA_2 | net foreign assets at the start of periods 1 and 2
- r | the interest rate earned or paid on them
- NX_1 | net exports in period 1
- NUT_1 | net unilateral transfers in period 1
example: A country owes 100 ($NFA_1 = -100$) at $r = 5\%$ and runs $NX = 20$, $NUT = 5$: $NFA_2 = -105 + 25 = -80$.

## A country's intertemporal budget constraint
NX_1 + \frac{NX_2}{1+r} + NUT_1 + \frac{NUT_2}{1+r} + (1+r)\,NFA_1 = 0
- NX_1, NX_2 | net exports now and later
- NUT_1, NUT_2 | net unilateral transfers now and later
- NFA_1 | net foreign assets at the start
- r | the interest rate
example: $NFA_1 = -100$, $r = 10\%$, no transfers, $NX_1 = -10$: the future must bring $NX_2 = 132$, since $-10 + 132/1.1 - 110 = -10 + 120 - 110 = 0$.

## Country risk premium
1 + r_H = \frac{1+r}{1 - p\,(1-x)}
- r_H | the interest rate the risky country must pay
- r | the risk-free world rate
- p | the probability of default
- x | the recovery rate: the share repaid in a default
example: $r = 4\%$, $p = 10\%$, $x = 0.5$: $1 + r_H = 1.04/0.95 \approx 1.0947$, so $r_H \approx 9.5\%$, a spread of about 5.5 points.

## Net financial inflows
\text{Net inflows} = \Delta RES + ABS - GNDI
- \text{Net inflows} | non-official $\Delta FL - \Delta FA$: foreign money coming in, net
- \Delta RES | the change in the central bank's foreign reserves
- ABS | absorption: $C + I + G$
- GNDI | national disposable income
example: $ABS = 1040$, $GNDI = 980$ and the central bank adds 10 to reserves: net inflows must be $10 + 1040 - 980 = 70$.

## Government's intertemporal budget constraint
G_1 + \frac{G_2}{1+r} = T_1 + \frac{T_2}{1+r}
- G_1, G_2 | government purchases now and in the future
- T_1, T_2 | taxes now and in the future
- r | the real interest rate
example: $G_1 = 100$, $G_2 = 110$, $r = 10\%$: spending is worth $100 + 110/1.1 = 200$ today. If $T_1 = 90$, then $T_2/1.1 = 110$, so $T_2 = 121$.

## After-tax real wage
w\,(1 - t)
- w | the real wage
- t | the tax rate on labor income
example: $w = 30$ an hour and $t = 25\%$: the worker keeps $30 \times 0.75 = 22.5$ an hour. The gap of 7.5 is the tax wedge.

## Debt dynamics
b_{t+1} = \frac{1+r}{1+g}\,b_t - pb_{t+1}
- b_t | public debt as a share of GDP
- r | the real interest rate on the debt
- g | real GDP growth
- pb | the primary balance (taxes minus non-interest spending) as a share of GDP
example: $b_t = 60\%$, $r = 4\%$, $g = 2\%$, $pb = 1\%$: $b_{t+1} = \tfrac{1.04}{1.02}(0.60) - 0.01 \approx 0.612 - 0.010 = 0.602$, so debt edges up to about $60.2\%$ of GDP.

## Debt-stabilizing primary balance
pb^* = \frac{r - g}{1+g}\,b
- pb^* | the primary balance that keeps the debt ratio constant
- r, g | the real interest rate and real growth
- b | the debt ratio
example: $b = 60\%$, $r = 4\%$, $g = 2\%$: $pb^* = \tfrac{0.02}{1.02}(0.60) \approx 1.2\%$ of GDP. With $r < g$ the answer is negative: a small primary deficit still keeps the ratio steady.

## Quantity equation
M\,V = P\,Y
- M | the money supply
- V | velocity: how many times a year each unit of money is spent
- P | the price level
- Y | real output
example: $M = 2{,}000$, $V = 5$, $Y = 8{,}000$: $P = \tfrac{2{,}000 \times 5}{8{,}000} = 1.25$.

## Quantity theory in growth rates
\pi = g_M + g_V - g_Y
- \pi | inflation
- g_M, g_V, g_Y | growth of money, velocity and real output
example: money grows $7\%$, velocity is steady, output grows $3\%$: $\pi = 7 + 0 - 3 = 4\%$.

## Seigniorage
\text{Seigniorage} = \frac{\Delta M}{P}
- \Delta M | new money created in a year
- P | the price level
example: the central bank creates $\Delta M = 50$ and $P = 1.25$: the government gains $50/1.25 = 40$ in real goods.

## LM curve
\frac{M}{P} = L(Y,\; r + \pi^e)
- M/P | the real money supply
- L | real money demand: rises with income, falls with the nominal interest rate
- Y | real output
- r + \pi^e | the nominal interest rate: the real rate plus expected inflation
example: $M = 1{,}000$, $P = 2$, so real money is 500. With $L = 0.5Y - 1{,}000(r + \pi^e)$, $Y = 1{,}100$, $r = 2\%$, $\pi^e = 3\%$: demand is $550 - 50 = 500$. The money market clears.

## Expectations-augmented Phillips curve
\pi = \pi^e - h\,(u - \bar{u})
- \pi, \pi^e | inflation and expected inflation
- u | the unemployment rate
- \bar{u} | the natural rate of unemployment
- h | how strongly inflation responds to the unemployment gap
example: $\pi^e = 3\%$, $h = 0.5$, $u = 7\%$, $\bar{u} = 5\%$: $\pi = 3 - 0.5 \times 2 = 2\%$.

## Okun's law
\frac{\bar{Y} - Y}{\bar{Y}} = 2\,(u - \bar{u})
- \bar{Y} | full-employment output
- Y | actual output
- u, \bar{u} | actual and natural unemployment
example: $u = 7\%$, $\bar{u} = 5\%$: output is $2 \times 2 = 4\%$ below full employment. If $\bar{Y} = 20{,}000$, then $Y = 19{,}200$.

## Real exchange rate
e = \frac{e_{nom}\,P}{P_{For}}
- e | the real exchange rate: foreign goods per home good
- e_{nom} | the nominal exchange rate: foreign currency per unit of home currency
- P, P_{For} | home and foreign price levels
example: 100 yen per dollar, a burger costs 2 dollars in the US and 250 yen in Japan: $e = \tfrac{100 \times 2}{250} = 0.8$ Japanese burgers per US burger.

## Uncovered interest parity
i = i_{For} - \frac{\Delta e_{nom}^{e}}{e_{nom}}
- i, i_{For} | home and foreign nominal interest rates
- \Delta e_{nom}^{e} / e_{nom} | the expected appreciation of the home currency
example: $i_{For} = 2\%$ and the home currency is expected to lose $3\%$ (an expected appreciation of $-3\%$): $i = 2 - (-3) = 5\%$. Investors need the extra 3 points to hold it.
