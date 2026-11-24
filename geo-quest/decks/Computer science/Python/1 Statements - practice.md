---
title: Statements: practice
---
Write it yourself: small programs using chapter 1 (print, input, variables, strings). Type your code, press Run to try it, and Check to test it. Passing flips the card; stuck, "Show a solution".

## Printing
- [practice] Print the line `Hello, world!`
```python
# Write your code here
```
```output
Hello, world!
```
```solution
print("Hello, world!")
```

## Reading input
- [practice] Ask for a name, then greet it: when the user types `Ada`, print `Hello, Ada!`
```python
name = input("What's your name? ")
```
```input
Ada
```
```output
Hello, Ada!
```
```input
Grace
```
```output
Hello, Grace!
```
```solution
name = input("What's your name? ")
print("Hello, " + name + "!")
```
> input() gives back what was typed; + joins strings. print("Hello,", name + "!") works too.

## Fixing mistakes
- [practice] This program has a mistake. Fix it so it prints `Bowhead whale`.
```python
print("Bowhead whale"
```
```output
Bowhead whale
```
```solution
print("Bowhead whale")
```
> Press Run first and read the error: SyntaxError, and the line it's on.

## Strings
- [practice] Ask for a word, then print how many letters it has: `whale` → `5`.
```python
word = input()
```
```input
whale
```
```output
5
```
```input
narwhal
```
```output
7
```
```solution
word = input()
print(len(word))
```

## Variables
- [practice] A blue whale weighs about 150 tonnes and a humpback about 30. Store the humpback's weight in a variable called `humpback`, then print how many humpbacks weigh as much as one blue whale.
```python
blue = 150
```
```output
5.0
```
```check
assert humpback == 30, "store 30 in a variable called humpback"
```
```solution
blue = 150
humpback = 30
print(blue / humpback)
```
> / always gives a float, so the answer prints as 5.0.
