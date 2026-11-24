---
title: Objects: practice
---
Write it yourself: programs using chapter 3 (indexes, f-strings, lists and tuples).

## f-strings
- [practice] Read an animal and its length in meters, then print one sentence: `orca` and `8` → `The orca is 8 m long`.
```python
animal = input()
```
```input
orca
8
```
```output
The orca is 8 m long
```
```input
blue whale
30
```
```output
The blue whale is 30 m long
```
```solution
animal = input()
length = input()
print(f"The {animal} is {length} m long")
```

## Indexes
- [practice] Read a word and print its first and last letters, with a space between: `whale` → `w e`.
```python
word = input()
```
```input
whale
```
```output
w e
```
```input
narwhal
```
```output
n l
```
```solution
word = input()
print(word[0], word[-1])
```

## Lists
- [practice] Using the list below, print the middle whale on one line and how many whales there are on the next.
```python
whales = ["blue", "fin", "minke"]
```
```output
fin
3
```
```solution
whales = ["blue", "fin", "minke"]
print(whales[1])
print(len(whales))
```

## Formatting numbers
- [practice] Read a number and print it with exactly two decimals: `3.14159` → `3.14`, `2` → `2.00`.
```python
x = float(input())
```
```input
3.14159
```
```output
3.14
```
```input
2
```
```output
2.00
```
```solution
x = float(input())
print(f"{x:.2f}")
```

## Tuples
- [practice] A point is stored as a tuple. Print how far it is from (0, 0): for `(3, 4)` that's `5.0`. Hint: the distance is the square root of x² + y².
```python
import math
point = (3, 4)
```
```output
5.0
```
```solution
import math
point = (3, 4)
print(math.sqrt(point[0] ** 2 + point[1] ** 2))
```
