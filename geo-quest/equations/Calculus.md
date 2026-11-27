# Equations: Calculus

Original equation definitions and examples for the Calculus deck; licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
to match those cards. Source attribution is listed in the deck introduction.

## Derivative from the limit definition
f'(x) = \lim_{h\to0}\frac{f(x+h)-f(x)}{h}
- f | function of x
- h | change in the input
- f'(x) | instantaneous rate of change at x
example: For $f(x)=x^2$, $f'(x)=\lim_{h\to0}\frac{(x+h)^2-x^2}{h}=\lim_{h\to0}(2x+h)=2x$.

## Power rule
\frac{d}{dx}x^n = nx^{n-1}
- x | independent variable
- n | constant exponent
example: $\frac{d}{dx}x^5=5x^4$.

## Chain rule
\frac{d}{dx}f(g(x)) = f'(g(x))g'(x)
- f | outer function
- g | inner function of x
- f'(g(x)) | derivative of the outer function, evaluated at the inner function
- g'(x) | derivative of the inner function
example: For $y=(3x+1)^4$, $dy/dx=4(3x+1)^3(3)=12(3x+1)^3$.

## Power rule for integration
\int x^n\,dx = \frac{x^{n+1}}{n+1}+C,\qquad n\ne-1
- x | integration variable
- n | constant exponent other than -1
- C | arbitrary constant of integration
example: $\int x^3\,dx=x^4/4+C$.

## Definite integral from an antiderivative
\int_a^b f(x)\,dx = F(b)-F(a),\qquad F'(x)=f(x)
- f | integrand
- F | any antiderivative of f
- a,b | lower and upper bounds
example: $\int_0^2 3x^2\,dx=[x^3]_0^2=8$.

## Fundamental theorem of calculus
\frac{d}{dx}\int_a^x f(t)\,dt = f(x)
- f | continuous integrand
- a | fixed lower bound
- x | variable upper bound and differentiation variable
- t | dummy integration variable
example: If $G(x)=\int_1^x (t^2+1)\,dt$, then $G'(x)=x^2+1$.

## Displacement from velocity
\Delta x = \int_a^b v(t)\,dt = x(b)-x(a)
- v(t) | velocity as a function of time
- a,b | initial and final times
- x(a),x(b) | initial and final positions
- \Delta x | signed displacement
example: At constant $v=3\ \mathrm{m/s}$ for 4 s, $\Delta x=\int_0^4 3\,dt=12\ \mathrm{m}$.
