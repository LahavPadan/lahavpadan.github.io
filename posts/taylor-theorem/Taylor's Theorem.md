## Derviation of Taylor from Rolle's theorem

**Higher-order Rolle's theorem** (iterative application of rolle's theorem)
Let $f$ be a continuous function on the interval $[x_0, x_0+h]$ and $n$-times differentiable on an open interval containing $[x_0, x_0+h]$. Let $p$ be the unique polynomial of degree $n$ such that:

- $p^{(k)}(x_0) = f^{(k)}(x_0)$ for $k = 0, 1, \dots, n-1$ (i.e., $p$ and $f$ match up to the $(n-1)$th derivative at $x$),
- $p(x_0 + h) = f(x_0 + h)$ (i.e., $p$ and $f$ match at the point $x_0 + h$).
Then, there exists some $\theta \in (0, 1)$ such that $f^{(n)}(x + \theta h) = p^{(n)}(x + \theta h)$.

#### Proving Mean-Value-Theorem (for high-orders) 
**By Using Rolle's Theorem (for high-orders)**

We need to construct $p$ to follow Rolle's Theorem assumptions.

We could define $q(x) = \sum_{k=0}^{n-1} f^{(k)}(x_0) \frac{x^k}{k!}$ and then $q^{(k)}(x_0) = f^{(k)}(x_0)$ for $0 \leq k \leq n-1$.
However, $q(x)$ will be a polynomial of degree $n-1$, and hence $f^{(n)}(x + \theta h) \neq q^{(n)}(x + \theta h)$. Furthermore, $q(x+h) \neq f(x+h)$.

Hence, we define $p(x)$ to be $q(x)$, **plus a correction factor**: 
- of degree $n$
- that guarantees $p(x_0 + h) = f(x_0 + h)$.

The simplest such correction factor is $\lambda (x - x_0)^n$.

##### Finding $\lambda$ for the correction factor$$p(x + h) = q(x + h) + \lambda (x + h - x)^n$$Since $(x + h - x) = h$, this simplifies to: $$p(x + h) = q(x + h) + \lambda h^n$$
- **Set $p(x_0 + h) = f(x_0 + h)$**, substituting the expression for $p(x_0 + h)$, we get:$$q(x_0 + h) + \lambda h^n = f(x_0 + h)$$
- **Solve for $\lambda$:** Rearranging the equation to solve for $\lambda$, we find:$$\lambda h^n = f(x_0 + h) - q(x_0 + h)$$$$\lambda = \frac{f(x_0 + h) - q(x_0 + h)}{h^n}$$
**Substitute $\lambda$ into $p(x)$:** Substitute the expression for $\lambda$ back into the equation for $p(x)$:
$$p(x) = q(x) + \frac{f(x_0 + h) - q(x_0 + h)}{h^n} \cdot (x - x_0)^n$$
#### Using the result of Rolle's Theorem, 
there exists some $\theta \in (0, 1)$ such that $f^{(n)}(x_0 + \theta h) = p^{(n)}(x_0 + \theta h)$.
$$p^{(n)}(x_0 + \theta h) = \left(\frac{f(x_0 + h) - q(x_0 + h)}{h^n}\right) \cdot n!$$
 (since $q(x)$ is a polynomial of degree $n-1$).
 
 
#### Using this to derive Taylor's Theorem:
The result of Rolle's Theorem gave us $f^{(n)}(x_0 + \theta h) = p^{(n)}(x_0 + \theta h)$, 
- plugging-in the expression of $q(x)$ (for $q(x_0 + h)$): 
$$f^{(n)}(x_0 + \theta h) = \left(\frac{f(x_0 + h) - \sum_{k=0}^{n-1} f^{(k)}(x_0) \frac{(x_0+h)^k}{k!} }{h^n}\right) \cdot n!$$
$$\frac{h^n}{n!}f^{(n)}(x_0 + \theta h) = \left(f(x_0 + h) - \sum_{k=0}^{n-1} f^{(k)}(x_0) \frac{(x_0+h)^k}{k!}\right)$$
$$f(x_0 + h) =  \left(\sum_{k=0}^{n-1} f^{(k)}(x_0) \frac{(x_0+h)^k}{k!}\right) + \frac{h^n}{n!}f^{(n)}(x_0 + \theta h)$$
$R_n​(x) = \frac{h^n}{n!}f^{(n)}(x_0 + \theta h)$ is an _error term_, which is referred to as a **remainder term**. 
The error is due to expanding $f(x)$ for finite $n$, rather than for
$n \to \infty$.


#### Radius of Convergence
_**NOTE:**_ "radius" fore-hints which shape the convergence region will take. 

**Definition -** **Analytic Function:** if $f(x)$ equals it taylor expansion at $x_0$ it is said to be analytic at $x=x_0$.
Given a function $f(x)$ that is analytic at a point $x_0$, its Taylor series expansion around $x_0$ is:
$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(x_0)}{n!} (x - x_0)^n
$$

The **radius of convergence** $R$ of this series is the distance from $x_0$ within which the series converges to the function $f(x)$. It is given by:
$$\frac{1}{R} = \limsup_{n \to \infty} \sqrt[n]{|a_n|}$$
- where $a_n = \frac{f^{(n)}(x_0)}{n!}$

**Proof:**
Consider the series:
$$\sum_{n=0}^{\infty} a_n (x - x_0)^n$$
The series converges if and only if the absolute value of the general term $a_n (x - x_0)^n$ tends to zero as $n$ increases. 
Meaning, the series converges for values of $x$ such that:
$$\limsup_{n \to \infty} \sqrt[n]{|a_n (x - x_0)^n|} < 1$$
This can be rewritten as:
$$\limsup_{n \to \infty} \sqrt[n]{|a_n|} \cdot |x - x_0| < 1$$
Therefore, the radius of convergence $R$ is given by:
$$\frac{1}{R} = \limsup_{n \to \infty} \sqrt[n]{|a_n|}$$
