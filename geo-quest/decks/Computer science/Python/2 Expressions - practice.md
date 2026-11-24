---
title: Expressions: practice
---
Write it yourself: programs using chapter 2 (converting input to numbers, arithmetic, //, %, round, math).

## Numbers from input
- [practice] Read two whole numbers, one per line, and print their sum: `2` and `3` → `5`.
```python
a = int(input())
```
```input
2
3
```
```output
5
```
```input
10
-4
```
```output
6
```
```solution
a = int(input())
b = int(input())
print(a + b)
```
> Without int(), "2" + "3" would join the text and print 23.

## Hours and minutes
- [practice] Read a number of minutes and print it as hours and minutes: `125` → `2 h 5 min`.
```python
minutes = int(input())
```
```input
125
```
```output
2 h 5 min
```
```input
59
```
```output
0 h 59 min
```
```solution
minutes = int(input())
print(minutes // 60, "h", minutes % 60, "min")
```

## Money
- [practice] Read a price and print it with 8% sales tax added, rounded to cents: `19.99` → `21.59`.
```python
price = float(input())
```
```input
19.99
```
```output
21.59
```
```input
10
```
```output
10.8
```
```solution
price = float(input())
print(round(price * 1.08, 2))
```

## Temperature
- [practice] Read a temperature in Fahrenheit and print it in Celsius, rounded to one decimal: `212` → `100.0`. (Celsius = (F − 32) × 5 / 9)
```python
f = float(input())
```
```input
212
```
```output
100.0
```
```input
98.6
```
```output
37.0
```
```solution
f = float(input())
print(round((f - 32) * 5 / 9, 1))
```

## The math module
- [practice] Read a circle's radius and print its area, rounded to two decimals, using `math.pi`: `1` → `3.14`.
```python
import math
```
```input
1
```
```output
3.14
```
```input
2.5
```
```output
19.63
```
```solution
import math
r = float(input())
print(round(math.pi * r ** 2, 2))
```
