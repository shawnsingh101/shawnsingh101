---
title: Expressions: harder
depth: deep
---
Harder cards on chapter 2: division and conversion where the obvious answer is wrong.

## Dividing
- 125 minutes in hours and minutes:
```python
minutes = 125
hours = minutes {{//|which operator?}} 60
left = minutes {{%|which operator?}} 60
```
- `-7 // 2` is {{-4}}: floor division always rounds down, toward the more negative number.
- `n % 2 == 0` is True exactly when n is {{even|what kind of number?}}.

## Converting and rounding
- `int("3.5")` stops with a {{ValueError|which error?}}: int() can't read a decimal point in text.
- `round(2.5)` is {{2}}: Python rounds an exact half to the nearest even number.
- This prints {{False}}.
```python
print(0.1 + 0.2 == 0.3)
```
> Compare floats after rounding them, never exactly.
- `2 ** 3 ** 2` is {{512}}: `**` works from right to left, so it's 2 to the 9th.
