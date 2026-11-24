---
title: Objects
---
Chapter 3: strings as sequences of characters, f-strings, how variables refer to objects, and the first collections: lists and tuples.

## Strings, one character at a time
- In `"whale"`, `w` is at index {{0}}: counting starts at zero.
- `"whale"[-1]` is {{`"e"`}}: negative indexes count back from the end.
- `"\n"` is the escape sequence for a {{newline|which character?}}.
- `ord("A")` is {{65}}: the character's Unicode number.

## Formatted strings
- This prints {{`The orca is 8 m long`|what does it print?}}.
```python
animal = "orca"
length = 8
print(f"The {animal} is {length} m long")
```
> In an f-string, anything in curly braces is worked out and put into the text.
- `f"{3.14159:.2f}"` is {{`"3.14"`}}: `.2f` means a float with two decimals.

## What a variable points to
- In Python every variable refers to an {{object|what?}}: a value stored in memory.
- `type(x)` tells you an object's type; `id(x)` tells you its {{identity|what?}}, where it lives in memory.

## Lists
- A list is written in {{square brackets|what?}}, items separated by commas.
- `["blue", "fin", "minke"][1]` is {{`"fin"`}}.
- `len(["blue", "fin", "minke"])` is {{3}}.

## Tuples
- A tuple is like a list, but written in {{parentheses|what?}}.
- A tuple can't be changed once created: it's {{immutable|what's the word?}}.
- `point[0] = 5`, when `point` is a tuple, stops with a {{TypeError|which error?}}.
