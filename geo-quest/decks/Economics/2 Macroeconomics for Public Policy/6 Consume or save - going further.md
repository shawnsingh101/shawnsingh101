---
title: Consume or save: going further
depth: deep
---
Exam-style practice on Lecture 6: the budget line's intercepts, the exact and approximate real rate, and solving the log-utility consumer with numbers.

## Real rates
- With $i = 5\%$ and $\pi = 3\%$, the exact real rate is about {{1.94%|how much?}}.
eq: Real interest rate | 1 + r = \frac{1+i}{1+\pi} \quad\Rightarrow\quad r \approx i - \pi
- The shortcut $r \approx i - \pi$ works well when inflation is {{small|what?}}.
- Fill in the missing step:
```derive
# The real interest rate
1+r = \frac{V_2/P_2}{V_1/P_1} :: Real value next period over real value today.
1+r = \frac{V_2}{V_1}\cdot\frac{ {{P_1}} }{P_2} :: Split the fractions.
1+r = \frac{1+i}{1+\pi} :: Each ratio is a growth factor.
```
eq: Real interest rate | 1 + r = \frac{1+i}{1+\pi} \quad\Rightarrow\quad r \approx i - \pi

## The budget line in numbers
- $Y_1 = 100$, $Y_2 = 110$, $r = 10\%$: the most the consumer can spend today is {{200|how much?}}.
eq: Intertemporal budget constraint | C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}
- Same numbers: the most they can spend tomorrow is {{220|how much?}}.
eq: Intertemporal budget constraint | C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}
- Same numbers: consuming 90 today leaves {{121|how much?}} for tomorrow.
eq: Intertemporal budget constraint | C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r}
- If the borrowing rate is above the lending rate, the budget line has a {{kink|what?}} at the endowment point.

## Solving the consumer
- $Y_1 = 150$, $Y_2 = 55$, $r = 10\%$, $\beta = 0.6$: optimal $C_1^*$ is {{125|how much?}}.
eq: Optimal consumption | C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)
- Same consumer: optimal saving is {{25|how much?}}.
eq: Optimal saving | S_1^* = \frac{\beta}{1+\beta}\,Y_1 - \frac{1}{1+\beta}\,\frac{Y_2}{1+r}
- Same consumer: $C_2 = \beta(1+r)C_1^* = $ {{82.5|how much?}}.
eq: Euler equation | C_2 = \beta\,(1+r)\,C_1
- With $\beta(1+r) = 1$, the Euler equation says consumption is {{the same in both periods|what?}}.
eq: Euler equation | C_2 = \beta\,(1+r)\,C_1
- With log utility, $C_1^*$ is a fixed share of lifetime resources: {{$\frac{1}{1+\beta}$|what share?}}.
eq: Optimal consumption | C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)

## Wealth in the budget
- $Y_1 = 100$, $Y_2 = 110$, $r = 10\%$, $Wealth_1 = 50$: lifetime resources in today's terms are {{255|how much?}}.
eq: Intertemporal budget constraint with wealth | C_1 + \frac{C_2}{1+r} = Y_1 + \frac{Y_2}{1+r} + (1+r)\,Wealth_1
- Same numbers with log utility and $\beta = 0.9$: $C_1^*$ is about {{134.2|how much?}}.
eq: Optimal consumption | C_1^* = \frac{1}{1+\beta}\left(Y_1 + \frac{Y_2}{1+r}\right)
- Same consumer: current income is $100 + 0.1 \times 50 = 105$, so saving is about {{-29.2|how much?}}.
- Same consumer: $C_1^* \approx 134.2$ is below $Y_1 + 1.1 \times 50 = 155$, so despite negative saving they are a net {{lender|borrower or lender?}}.
