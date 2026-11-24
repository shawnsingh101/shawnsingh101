---
title: Statements: harder
depth: deep
---
Harder cards on chapter 1: reading programs line by line, the way Python runs them.

## Output
- This prints {{`Bowhead whale`, on one line|what does it print?}}.
```python
print("Bowhead", end=" ")
print("whale")
```
> end= replaces the newline print() normally adds at the end.
- This prints {{`5 + 5 = 10`|what does it print?}}.
```python
print("5 + 5 =", 5 + 5)
```
> Text in quotes is printed as it is; the expression outside the quotes is worked out first.
- This prints {{`55`|what does it print?}}.
```python
print("5" + "5")
```
> In quotes, 5 is text: + joins the two strings.

## Variables
- This prints {{3}}.
```python
a = 3
b = a
a = 10
print(b)
```
> b = a stores a's value at that moment; changing a later doesn't change b.
- Swap two variables in one line:
```python
x = 1
y = 2
x, y = {{y, x|what goes here?}}
```
- The user types Ada. Fill in the blank so the program prints `Hi, Ada`:
```python
name = input("Your name? ")
print("Hi,", {{name|what goes here?}})
```
- `len("")` is {{0}}: the empty string has no characters.

## Errors
- This program stops with a {{NameError|which error?}}.
```python
print(total)
total = 10
```
> Python runs from the top: on line 1, total doesn't exist yet.
