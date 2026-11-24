---
title: Statements
---
Chapter 1 of OpenStax's Introduction to Python Programming: printing and reading input, variables, strings and numbers, error messages and comments. Easy cards first; the harder ones unlock once you know half of these.

## Output and input
- This prints {{`Hello world`|what does it print?}}.
```python
print("Hello", "world")
```
> print() puts a space between the values it's given.
- This prints {{`555-0123`|what does it print?}}.
```python
print("555", "0123", sep="-")
```
> sep= changes what goes between the values.
- The {{`input()`|which function?}} function shows a prompt and waits for the user to type a line.

## Variables
- This prints {{7}}.
```python
x = 5
x = x + 2
print(x)
```
> `=` means "store": work out the right side, then put the result in the name on the left.
- In Python a variable begins to exist the first time it is {{assigned|what happens to it?}} a value.
- A variable name can't start with a {{digit|what?}}: `101class` is not allowed.
- `total` and `Total` are {{two different variables|same or different?}}: letter case matters.
- Python's style guide writes names in {{snake case|what style?}}: lowercase words joined by underscores, like `range_map`.
- Words like `if`, `for` and `True` are {{keywords|what are they called?}}: reserved by Python, so they can't be variable names.

## Strings and numbers
- `len("whale")` is {{5}}: the number of characters.
- `"bow" + "head"` is {{`"bowhead"`}}.
- Joining strings with `+` is called {{concatenation|what's it called?}}.
- `type(3)` is `int`; `type(3.0)` is {{`float`|what type?}}.
- `3 ** 2` is {{9}}: `**` raises a number to a power.

## When it goes wrong
- A Python error message gives the type of error and the {{line number|where?}}.
- `print "Hello!"` (no parentheses) is a {{SyntaxError|which error?}}.
- Using a variable that was never assigned is a {{NameError|which error?}}.
- A line indented when it shouldn't be is an {{IndentationError|which error?}}.

## Notes in the code
- Python ignores everything from a {{`#`|what symbol?}} to the end of the line: a comment.
- A triple-quoted string at the top of a program that says what it does is a {{docstring|what's it called?}}.
