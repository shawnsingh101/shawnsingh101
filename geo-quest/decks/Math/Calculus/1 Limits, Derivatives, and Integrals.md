An original, calculus-based foundation to study alongside Physics. Card wording and worked examples are new; concepts are organized from the linked Wikipedia articles. Changes: calculus ideas are reorganized into retrieval prompts and connected to mechanics. This deck's text is licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Attribution: [Calculus](https://en.wikipedia.org/wiki/Calculus), [Limit of a function](https://en.wikipedia.org/wiki/Limit_of_a_function), [Derivative](https://en.wikipedia.org/wiki/Derivative), [Integral](https://en.wikipedia.org/wiki/Integral), [Fundamental theorem of calculus](https://en.wikipedia.org/wiki/Fundamental_theorem_of_calculus), and [Chain rule](https://en.wikipedia.org/wiki/Chain_rule).

Further reading: [Calculus](https://en.wikipedia.org/wiki/Calculus), [Limit of a function](https://en.wikipedia.org/wiki/Limit_of_a_function), [Derivative](https://en.wikipedia.org/wiki/Derivative), [Integral](https://en.wikipedia.org/wiki/Integral), [Fundamental theorem of calculus](https://en.wikipedia.org/wiki/Fundamental_theorem_of_calculus), [Chain rule](https://en.wikipedia.org/wiki/Chain_rule).

## Limits
related: Limit of a function, continuity
- A limit describes the value a function approaches as its input approaches a specified {{point|what is approached?}}.
- A function can have a limit at a point even when its value at that point is {{undefined|what may be true of the function itself?}}.
- For $f(x)=x^2$, $\lim_{x\to3}f(x)={{9}}$.
- Continuity at $x=a$ requires that $f(a)$ exists, $\lim_{x\to a}f(x)$ exists, and the two values are {{equal|what relation must hold?}}.
- The derivative uses a limit to turn average change over a finite interval into {{instantaneous change|what does the limit describe?}}.

## Rates of change
related: Derivative, differential calculus, instantaneous velocity
- The derivative of $f$ at $x$ is the limit of the difference quotient as the interval {{approaches zero|what happens to the interval?}}.
- $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$ defines the {{derivative|what quantity?}}.
eq: Derivative from the limit definition
- Geometrically, $f'(a)$ is the slope of the {{tangent line|which line?}} to the graph at $x=a$.
- If $s(t)$ is position, then $\frac{ds}{dt}$ is {{velocity|what rate?}}.
- If $v(t)$ is velocity, then $\frac{dv}{dt}$ is {{acceleration|what rate?}}.
- The power rule gives $\frac{d}{dx}x^n={{n x^{n-1}}}$.
eq: Power rule
- The derivative of a constant is {{zero|what value?}}.
- The derivative of a sum is the {{sum of the derivatives|what operation distributes?}}.
- The chain rule differentiates a composition by multiplying the outer derivative by the {{inner derivative|what factor?}}.
eq: Chain rule
- For $y=(3x+1)^4$, $\frac{dy}{dx}={{12(3x+1)^3}}$.
- A derivative greater than zero over an interval means the function is increasing there; a derivative less than zero means it is {{decreasing|what behavior?}}.

## Integrals
related: Integral, Riemann integral, antiderivative
- An indefinite integral describes a family of {{antiderivatives|what functions?}} and includes an arbitrary constant.
- A definite integral accumulates signed contributions across an {{interval|what domain?}}.
- The Riemann-sum idea approximates an area or accumulation by adding many thin {{rectangles|what simple regions?}}.
- $\int_a^b f(x)\,dx$ is signed: portions where $f(x)<0$ contribute {{negative area|what sign?}}.
- The power rule for integration is $\int x^n\,dx={{\frac{x^{n+1}}{n+1}+C}}$ for $n\ne-1$.
eq: Power rule for integration
- If $F'(x)=f(x)$, then $\int_a^b f(x)\,dx={{F(b)-F(a)}}$.
eq: Definite integral from an antiderivative
- The Fundamental Theorem of Calculus connects differentiation and {{integration|which operation?}}.
eq: Fundamental theorem of calculus
- If $x(t)$ is position, displacement from $t=a$ to $t=b$ is $\int_a^b v(t)\,dt={{x(b)-x(a)}}$.
eq: Displacement from velocity
- Total distance is found by integrating speed $|v(t)|$; displacement instead integrates signed {{velocity|what quantity?}}.

