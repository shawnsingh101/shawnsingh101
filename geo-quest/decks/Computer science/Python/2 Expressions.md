---
title: Expressions
---
Chapter 2: trying code in the shell, converting between types, mixing types, why floats are slightly off, whole-number division, the math module, and writing code clearly.

## Trying code
- Typing Python one line at a time at the `>>>` prompt, seeing each result at once, is using the Python {{shell|what?}}.

## Converting types
- `input()` always gives back a {{string|what type?}}, even when the user types a number.
- `int("42")` is {{42}}: text turned into a whole number.
- Turn what the user types into a whole number:
```python
age = {{int|which function?}}(input("Age? "))
```
- `int(3.9)` is {{3}}: converting to int cuts off the decimals, it doesn't round.

## Mixing types
- `"$" + 5` stops with a {{TypeError|which error?}}: a string and a number can't be added.
- `"$" + str(5)` is {{`"$5"`}}.
- `"Ha" * 3` is {{`"HaHaHa"`}}.
- `1 + 2.0` is {{3.0}}: mixing an int with a float gives a float.

## Floats
- This prints {{`0.30000000000000004`|what does it print?}}.
```python
print(0.1 + 0.2)
```
> Floats are stored in binary, which can't hold 0.1 exactly: a round-off error.
- `round(3.14159, 2)` is {{3.14}}.

## Dividing
- `7 / 4` is {{1.75}}: `/` always gives a float.
- `7 // 4` is {{1}}: floor division keeps only the whole part.
- `7 % 4` is {{3}}: modulo gives the remainder.

## The math module
- Before calling `math.sqrt()`, a program must say {{`import math`|what line?}}.
- `math.sqrt(25)` is {{5.0}}.
- print(), input() and abs() need no import: they're {{built-in|what kind?}} functions.

## Writing it clearly
- Python's official style guide is called {{PEP 8|what's it called?}}.
- A long statement can run onto the next line while it's inside {{parentheses|what?}}: implicit line joining.
