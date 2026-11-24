---
title: Objects: harder
depth: deep
---
Harder cards on chapter 3: what happens when two names share one object.

## Lists
- This prints {{`['blue', 'fin', 'humpback']`|what does it print?}}.
```python
whales = ["blue", "fin", "minke"]
whales[2] = "humpback"
print(whales)
```
> Lists can be changed in place. Python prints strings in a list with single quotes.
- This prints {{`[99, 2]`|what does it print?}}.
```python
a = [1, 2]
b = a
b[0] = 99
print(a)
```
> b = a doesn't copy the list: both names now refer to the same list object.
- `["blue", "fin"][2]` stops with an {{IndexError|which error?}}: there's no third item.

## Strings and tuples
- `f"{7:03d}"` is {{`"007"`}}: at least three digits, padded with zeros.
- `chr(66)` is {{`"B"`}}: the opposite of ord().
- `(1)` is just the number 1; {{`(1,)`|what makes a tuple of one?}} is a tuple: the comma makes the tuple, not the parentheses.
