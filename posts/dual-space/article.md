# Dual Space

Given a function $f: \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$, we build a companion function $f^*$ that records, for each linear direction, the largest gap between $f$ and an affine function of that slope. [Section 1](#sec-1) constructs $f^*$ and works out its properties. [Section 2](#sec-2) uses it to turn a constrained optimisation problem into an unconstrained one, with the constraints themselves as the free variables.

## 1. The convex conjugate {#sec-1}

For a function $f: \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$, fix a direction $y \in \mathbb{R}^n$. Any affine function of slope $y$ has the form $x \mapsto \langle y, x \rangle + c$, where $\langle y, x \rangle = y^\top x$ is the dot product. For small enough $c$ this affine function sits under $f$; for large enough $c$ it eventually pokes above. The threshold value of $c$ is what we record.

Formally, the **convex conjugate** of $f$ is
$$
f^*(y) = \sup_{x \in \mathbb{R}^n} \bigl( \langle y, x \rangle - f(x) \bigr),
$$
where $y$ ranges over the same $\mathbb{R}^n$. Two words on the setup:

- The role of $y$ is to specify a linear function of $x$, not to name a point in the domain. That role — "a linear scalar-valued measurement on $\mathbb{R}^n$" — is where the word "dual" comes from. The [collapsible in Section 1.6](#sec-1-6) tells that fuller story.
- Restricted-domain functions fit in by extending via $+\infty$ outside the domain: if the intended domain of $f$ is a subset $\mathcal{D} \subseteq \mathbb{R}^n$, we set $f(x) = +\infty$ for $x \notin \mathcal{D}$. Points outside $\mathcal{D}$ then contribute $-\infty$ to the argument of the sup and are automatically excluded, so "$\sup$ over $x \in \mathbb{R}^n$" equals "$\sup$ over $x \in \mathcal{D}$" with no bookkeeping.

### 1.1 The geometric picture {#sec-1-1}

For fixed $y$ and varying $x$, the quantity $\langle y, x \rangle - f(x)$ is the vertical gap between the linear function $x \mapsto \langle y, x \rangle$ (a hyperplane through the origin with slope $y$) and the graph of $f$. Taking the sup over $x$ finds where this gap is largest.

Working with $-f^*$ makes the picture cleaner. Because $\inf_x g(x) = -\sup_x(-g(x))$,
$$
-f^*(y) = \inf_x \bigl( f(x) - \langle y, x \rangle \bigr).
$$
This is the largest constant $c$ such that
$$
f(x) - \langle y, x \rangle \geq c \iff \langle y, x \rangle + c \leq f(x) \quad \text{for all } x.
$$
So $-f^*(y)$ is the intercept of the highest affine function with slope $y$ that fits under $f$. If no such affine function exists — because $\langle y, x \rangle$ eventually overtakes $f$ in some direction — then $-f^*(y) = -\infty$, i.e., $f^*(y) = +\infty$.

{% include visualization.html src="maximum-gap.html" title="The convex conjugate as the maximum vertical gap and the required supporting-line shift" %}

Concrete examples make the definition tangible before we press on it further.

### 1.2 Warm-up examples {#sec-1-2}

**Purely linear.** $f(x) = 2x + 1$ on $\mathbb{R}$. When can $yx + c \leq 2x + 1$ hold for all $x$?

- If $y \neq 2$: the difference $(2 - y)x + 1 - c$ goes to $-\infty$ in one direction, so the inequality fails. Hence $f^*(y) = +\infty$.
- If $y = 2$: the inequality becomes $c \leq 1$. The largest feasible $c$ is $1$, giving $-f^*(2) = 1$, so $f^*(2) = -1$.

The conjugate of a linear function is $+\infty$ everywhere except at its slope, where it records (minus) the intercept.

**Piecewise linear.** Let $f(x) = \max(x, 2x)$, so $f(x) = x$ for $x \leq 0$ and $f(x) = 2x$ for $x \geq 0$. This is continuous and convex (a max of two linear functions). When does $yx + c \leq f(x)$ hold for all $x$?

- On $x \geq 0$: $yx + c \leq 2x$ requires $c \leq (2 - y)x$ for all $x \geq 0$. As $x \to +\infty$ this forces $y \leq 2$; setting $x = 0$ then forces $c \leq 0$.
- On $x \leq 0$: $yx + c \leq x$ requires $c \leq (1 - y)x$ for all $x \leq 0$. As $x \to -\infty$ this forces $y \geq 1$; setting $x = 0$ then forces $c \leq 0$.

So an affine function fits under $f$ iff $y \in [1, 2]$, and the tightest one has $c = 0$ (touching $f$ at $x = 0$). Hence
$$
f^*(y) = \begin{cases} 0 & 1 \leq y \leq 2, \\ +\infty & \text{otherwise.} \end{cases}
$$
The conjugate is $0$ on the interval of slopes $f$ realises and $+\infty$ elsewhere — a first hint that sets (the interval $[1,2]$ here) and functions live in one duality picture. We make this precise in [Section 1.6](#sec-1-6).

**Quadratic.** $f(x) = \tfrac 1 2 x^2$ on $\mathbb{R}$. Then $f^*(y) = \sup_x (yx - \tfrac 1 2 x^2)$. Setting the derivative in $x$ to zero: $y - x = 0$, so $x = y$, and $f^*(y) = y \cdot y - \tfrac 1 2 y^2 = \tfrac 1 2 y^2$. The quadratic is **self-conjugate**.

More generally, $f(x) = \tfrac 1 2 \langle Ax, x \rangle$ with $A$ symmetric positive definite has $f^*(y) = \tfrac 1 2 \langle A^{-1} y, y \rangle$: read the quadratic form from the other side, and $A$ is replaced by $A^{-1}$.

The last example was easy because the sup was attained where the derivative vanished. That optimality condition deserves a closer look.

### 1.3 The Fenchel–Young inequality {#sec-1-3}

By definition of $f^*$ as a supremum,
$$
f^*(y) \geq \langle y, x \rangle - f(x) \quad \text{for all } x, y.
$$
Rearranging:
$$
f(x) + f^*(y) \geq \langle y, x \rangle. \qquad \text{(Fenchel–Young inequality)}
$$
Equality is attained precisely at the $x$ where the sup in the definition of $f^*(y)$ is achieved. For differentiable convex $f$, differentiating $\langle y, x \rangle - f(x)$ in $x$ gives the condition $y = \nabla f(x)$. So:
$$
f(x) + f^*(y) = \langle y, x \rangle \iff y = \nabla f(x)
$$
when $f$ is differentiable. For general convex $f$, the condition becomes $y \in \partial f(x)$, where the **subdifferential** $\partial f(x)$ is the set of $y$ such that
$$
f(x') \geq f(x) + \langle y, x' - x \rangle \quad \text{for all } x' \in \mathbb{R}^n.
$$
$\partial f(x)$ is the set of slopes of affine functions that touch $f$ at $x$ from below. For smooth $f$ it collapses to $\{\nabla f(x)\}$; for a piecewise-linear $f$ at a corner it is an interval of slopes; at a strict minimum of a smooth $f$ it contains $0$.

{% include visualization.html src="fenchel-young-equality.html" title="Fenchel–Young equality as contact with the supporting line" %}

If we already know the sup is attained where $y = \nabla f(x)$, can we solve for $x$ and get $f^*(y)$ in closed form?

### 1.4 The smooth strictly convex case {#sec-1-4}

When $f$ is smooth and strictly convex, the sup in $\sup_x (\langle y, x \rangle - f(x))$ is attained at the unique $x$ solving $\nabla f(x) = y$. Strict convexity makes $\nabla f$ invertible on its range, so the maximiser is
$$
x^\star_y = (\nabla f)^{-1}(y),
$$
and substituting back,
$$
f^*(y) = \langle y, x^\star_y \rangle - f(x^\star_y).
$$
This closed-form version is what was historically called the **Legendre transform**. Whenever $f$ is smooth and strictly convex, Legendre transform and convex conjugate agree.

{% include visualization.html src="smooth-strictly-convex.html" title="The Legendre transform: select the unique maximising input, locate it through the derivative, and record the conjugate value" %}

The general conjugate extends the Legendre transform beyond the smooth strictly convex case: replacing "solve $\nabla f(x) = y$" with "take a sup" keeps the operation well-defined on non-smooth, non-strictly-convex, and even non-convex $f$.

Which raises the question: what regularity does $f^*$ automatically inherit, even when $f$ is misbehaved?

### 1.5 Properties and the biconjugate {#sec-1-5}

**1. $f^*$ is always convex.** Fix any $x$ and treat it as a parameter. The map $y \mapsto \langle y, x \rangle - f(x)$ is *affine in $y$*: the first term is linear in $y$, and the second, $f(x)$, is a fixed number as far as $y$ is concerned. So $f^*$ is a pointwise sup, indexed by $x$, of affine functions of $y$, and a pointwise sup of affine functions is always convex.

The move that matters is treating $f(x)$ as a constant offset — legitimate because $x$ is the *index* of the sup, not a variable in the function of $y$ we are examining. Convexity of $f$ never enters, and the shape of $f$ in $x$ is irrelevant: $f$ could be discontinuous, non-convex, or wild, and each affine-in-$y$ slice would still be affine-in-$y$. The property is purely about the operator "sup of affine".

**2. $f^*$ is always lower semi-continuous.** A function $g$ is **lower semi-continuous (lsc)** at a point $y$ if, whenever $y_n \to y$, the limit of $g(y_n)$ cannot come out strictly below $g(y)$: formally,
$$
g(y) \leq \liminf_{n \to \infty} g(y_n).
$$
Continuity would require equality; lsc allows a strict inequality in exactly one direction — the limit of nearby values may sit strictly *above* the value at $y$, but not strictly below. Concretely, take $g$ that equals $0$ for $y' < 0$ and equals $-1$ for $y' \geq 0$ (a step down at the origin). Approaching $y = 0$ from the left gives $\lim g(y_n) = 0$ while $g(0) = -1$; the lsc condition asks $g(0) \leq \liminf$, and $-1 \leq 0$ is fine. So the step-down function *is* lsc at the jump. Now flip it: $g$ equals $0$ for $y' < 0$ and equals $1$ for $y' \geq 0$ (a step *up*). Approaching from the left gives $\liminf = 0$, but $g(0) = 1 \not\leq 0$. So the step-up function *fails* lsc at the jump. In summary: dropping the value at the boundary is allowed; jumping upward past what the nearby values were is not.

The same "sup of a family" argument as in (1) delivers lower semi-continuity here. Fix any $x$; the map $y \mapsto \langle y, x \rangle - f(x)$ is *continuous* in $y$ (it is affine in $y$, and affine maps are continuous). Now use the following closure property of sup: if each function in a family is continuous, then their pointwise sup is lsc. To see it, fix $y_n \to y$ and any $x$; continuity of the affine slice gives $\langle y_n, x \rangle - f(x) \to \langle y, x \rangle - f(x)$, so
$$
\liminf_n f^*(y_n) \geq \liminf_n \bigl( \langle y_n, x \rangle - f(x) \bigr) = \langle y, x \rangle - f(x);
$$
taking a sup over $x$ on the right gives $\liminf_n f^*(y_n) \geq f^*(y)$, which is the lsc condition. (The pointwise sup of continuous functions need not itself be continuous — the sup can jump *up* between points, and lsc is the exact regularity that survives.)

**3. The biconjugate satisfies $f^{**} \leq f$.** From Fenchel–Young,
$$
f(x) \geq \langle y, x \rangle - f^*(y) \quad \text{for all } y \implies f(x) \geq \sup_y \bigl( \langle y, x \rangle - f^*(y) \bigr) = f^{**}(x).
$$

**4. When is $f^{**} = f$?** By (1) and (2), $f^{**}$ is always convex and lsc, so we cannot hope for $f^{**} = f$ unless $f$ is convex and lsc. We also need $f$ to be **proper**, meaning: $f$ is not identically $+\infty$ (it takes at least one finite value) and $f > -\infty$ everywhere (it never plunges to $-\infty$). The name rules out the two degenerate ways an extended-real-valued function can fail to carry useful information.

Under those three conditions, the biconjugate does recover $f$. To see what $f^{**}$ is actually computing, unfold the definition:
$$
f^{**}(x) = \sup_y \bigl( \langle y, x \rangle - f^*(y) \bigr).
$$
For each slope $y$, recall from [Section 1.1](#sec-1-1) that $-f^*(y)$ is the highest intercept $c$ for which the affine function $x' \mapsto \langle y, x' \rangle + c$ stays below $f$ over the whole domain. So $\langle y, x \rangle - f^*(y)$ is the *value at the specific point $x$* of that best-possible affine function of slope $y$ — the one hugging $f$ as tightly as slope $y$ allows. Now $f^{**}(x)$ scans over every possible slope $y$ and picks whichever slope's best-affine-function is highest at $x$. So $f^{**}(x)$ answers: *among all the affine functions that stay below $f$ everywhere, what is the largest value any of them achieves at this particular point $x$?*

Geometrically, $f^{**}$ is $f$ traced from below by its family of supporting lines. Each such supporting line contributes one number at each $x$; the sup collects the highest of these contributions. If at some point $x$ a supporting line actually reaches $f(x)$, then $f^{**}(x) = f(x)$; if the family of supporting lines can only get close but never touch, we still have $f^{**}(x) \leq f(x)$.

The inequality $f^{**} \leq f$ is immediate: every affine function that stays under $f$ satisfies $\ell(x) \leq f(x)$ by definition, and the sup preserves the inequality. No assumptions on $f$ are needed for this direction — it is property 3 restated geometrically.

The reverse direction, $f^{**}(x) \geq f(x)$, is what needs the three assumptions. We need to guarantee that, at every $x$, there exists an affine function sitting below $f$ globally whose value at that particular $x$ can be pushed arbitrarily close to $f(x)$. The construction produces such an affine function by finding a hyperplane in $\mathbb{R}^n \times \mathbb{R}$ that separates the point $(x, f(x) - \varepsilon)$ (just below the graph) from the set
$$
\mathrm{epi}(f) = \{(x', t) : t \geq f(x')\}
$$
of points on or above the graph — a set called the **epigraph** of $f$. Separation of a point from a set by a hyperplane requires exactly three properties of the set: it must be *nonempty* (otherwise there is nothing to separate from), *closed* (so that the point strictly below is genuinely outside the closure and separation is possible), and *convex* (so that a linear separator exists — a non-convex set can wrap around a point and admit no separating hyperplane). These three set-level properties of $\mathrm{epi}(f)$ correspond exactly to the three function-level assumptions: $f$ *proper* makes the epigraph nonempty, $f$ *lsc* makes the epigraph closed, and $f$ *convex* makes the epigraph convex. Each assumption pulls its weight at exactly this step, and none is redundant.

Under (convex, lsc, proper), the separating hyperplane exists at every $x$, hands us an affine function that stays below $f$ and whose value at $x$ approaches $f(x)$, and forces $f^{**} = f$. This equality is the **Fenchel–Moreau theorem**, and it is what makes convex conjugation invertible on the class of well-behaved convex functions.

The construction so far accepts any $f: \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}$. Nothing stops us from feeding it a function that only encodes membership in a set — and this special case turns out to be the bridge between duality of functions and duality of sets.

### 1.6 Sets, indicators, and support functions {#sec-1-6}

The **indicator function** in convex analysis (distinct from the $0/1$ indicator of probability) of a set $C \subseteq \mathbb{R}^n$ is
$$
\delta_C(x) = \begin{cases} 0 & x \in C, \\ +\infty & x \notin C. \end{cases}
$$
The convention "$+\infty$ outside $C$" turns a set into a function: adding $\delta_C$ to any objective forces the argument to lie in $C$, since any $x \notin C$ gives infinite objective. We use this exact trick to absorb constraints in [Section 2](#sec-2).

Its conjugate is
$$
\delta_C^*(y) = \sup_x \bigl( \langle y, x \rangle - \delta_C(x) \bigr) = \sup_{x \in C} \langle y, x \rangle =: \sigma_C(y).
$$
The right side has its own name: the **support function** of $C$. Two readings of it, both from the definition:

- $\sigma_C(y)$ is the maximum, over $x \in C$, of the projection of $x$ onto the direction $y$ — how far $C$ extends in that direction.
- $\sigma_C(y)$ is the smallest constant $c$ for which $C \subseteq \{x : \langle y, x \rangle \leq c\}$: the tightest halfspace with normal $y$ that still contains $C$ has offset $c = \sigma_C(y)$.

{% include visualization.html src="support-function-set.html" title="The support function as the outermost level line in a fixed direction" %}

Two consequences of $\sigma_C = \delta_C^*$:

- $\sigma_C$ inherits the properties of a convex conjugate from [Section 1.5](#sec-1-5): convex and lsc in $y$, whatever $C$ is.
- For closed convex $C$ containing $0$, $\delta_C$ is proper, convex, and lsc. Fenchel–Moreau gives $\delta_C^{**} = \delta_C$; unwinding, $(\sigma_C)^* = \delta_C$. So $\sigma_C$ *determines* $C$: closed convex sets and their support functions are in one-to-one correspondence.

The chain of transformations set $\to$ indicator $\to$ conjugate $\to$ support function translates between two representations of the same object: $\delta_C$ **stores** the set (yes/no membership), $\sigma_C$ **measures** it (how far it extends in each direction), and conjugation carries information across the pair. Any theorem about closed convex sets we might hope for (bipolar theorem, closed convex hulls) comes out of Fenchel–Moreau on the function side, applied to $\delta_C$.

There is a broader picture behind all of this — the sense in which "conjugate" is one instance of a *duality* construction that applies to spaces, operators, and sets in their own right. The next collapsible walks through the pattern; it also introduces the matrix transpose as the dual of a linear map, which we will need in [Section 2](#sec-2).

<div class="guided-fold-start" data-label="Where the name 'dual' comes from — spaces, operators, cones, sets" data-tone="derivation"></div>

Given a mathematical object, we can build a **partner object** for it by asking one specific question — always of the form "which linear-flavoured things test against the original in this specific way?" — and collecting the valid answers. Different starting objects give different named "duals":

- a vector space → its dual space $V^*$,
- a linear map → its transpose,
- a cone → its dual cone,
- a set → its polar set (or, equivalently, its support function),
- a function → its convex conjugate.

Each construction is idempotent-after-two-applications on the appropriate "good" class: applying it twice recovers the original whenever the original had enough regularity to begin with. The regularity conditions are exactly the ones that guarantee nothing important gets erased on the round trip. We walk through the cases and connect each one back to the function-level story of the main text.

**Dualising a vector space.**

For a vector space $V$ over a field $\mathbb{F}$ (in every example, $\mathbb{R}$ or $\mathbb{C}$):

- A **linear functional** on $V$ is a linear map $\varphi: V \to \mathbb{F}$.
- The **dual space** $V^*$ is the set of all linear functionals on $V$, made into a vector space by pointwise addition and scaling: $(\varphi + \psi)(v) = \varphi(v) + \psi(v)$, $(c\varphi)(v) = c \cdot \varphi(v)$.

Concretely, on $V = \mathbb{R}^n$ a linear functional is the dot product with a fixed row vector: given $\varphi$, the numbers $a_i := \varphi(e_i)$ pin it down and linearity forces
$$\varphi(v) = a_1 v^1 + \cdots + a_n v^n = a \cdot v,$$
so the dual space of $\mathbb{R}^n$ is the space of row vectors. The abstract definition strips the coordinates from this picture; it adds nothing else. Picking out *linear* scalar-valued maps is not an arbitrary restriction: coordinates, evaluation at a point, integrals, gradients — almost every scalar measurement made on a vector space is linear.

**The dual basis.** Fix a basis $\{e_1, \ldots, e_n\}$ of $V$. The linear map $e^i: V \to \mathbb{F}$ that reads off the $i$-th coordinate is an element of $V^*$, and the $n$ coordinate-readouts $\{e^1, \ldots, e^n\}$ form a basis of $V^*$, called the **dual basis** to $\{e_i\}$. Two consequences:

- $\dim V^* = \dim V$, so $V \cong V^*$ whenever $V$ is finite-dimensional.
- The mapping $e_i \mapsto e^i$ **depends on the basis**: change $\{e_i\}$ and the pairing changes with it. Nothing intrinsic to $V$ or $V^*$ picks one such mapping over the others.

**The double dual.** $V^{**}$ is the space of linear maps $V^* \to \mathbb{F}$. Each $v \in V$ provides one — the operation "evaluate at $v$", sending a functional $\varphi \in V^*$ to $\varphi(v)$. Two linearity checks make this land where we want. First, evaluate-at-$v$ is itself a linear map $V^* \to \mathbb{F}$, because $V^*$'s addition and scaling were defined pointwise. Second, the assignment $v \mapsto (\text{evaluate at } v)$ from $V$ to $V^{**}$ is itself linear — because each $\varphi$ is required to be a linear map $V \to \mathbb{F}$.

The construction uses only $v$ — no basis. In finite dimensions the resulting map $V \to V^{**}$ is a bijection, so $V \cong V^{**}$ **canonically — with no choice made**. In infinite dimensions, with mild care (restricting $V^*$ to *continuous* linear functionals when $V$ is normed), the map is still injective but need not be onto; spaces where it is are called **reflexive**. Hilbert spaces are reflexive; $L^p$ for $1 < p < \infty$ is reflexive; $L^1$ and $L^\infty$ are not.

Once $V$ has an inner product, the identification $V \cong V^*$ upgrades from basis-dependent to canonical (with the inner product fixed). Fix $u \in V$. The map $v \mapsto \langle u, v \rangle$ is linear in $v$, hence an element of $V^*$; the assignment $u \mapsto \langle u, \cdot \rangle$ is called the **Riesz map** and, in finite dimensions, is a bijection. Its extension to Hilbert spaces is the **Riesz representation theorem**: every continuous linear functional on a Hilbert space $H$ has the form $\varphi(v) = \langle u, v \rangle$ for a unique $u \in H$. So Hilbert spaces are **self-dual** — every continuous functional is "inner product with a fixed vector".

**Dualising a linear map.**

For a linear map $T: V \to W$, its **dual** — also called its **transpose** — is the map $T^\vee: W^* \to V^*$ that pre-composes with $T$:
$$
(T^\vee \psi)(v) := \psi(Tv).
$$
The arrow reverses because turning a linear map $W \to \mathbb{F}$ into a linear map $V \to \mathbb{F}$ requires first pushing $v \in V$ over to $W$ using $T$, and only then applying $\psi$.

**In coordinates.** Let $A$ be the matrix of $T$ in bases $\{e_j\}$ of $V$ and $\{w_i\}$ of $W$, so $Te_j = \sum_i A^i_j w_i$, and write $\psi_i := \psi(w_i)$. Evaluating $T^\vee \psi$ on the basis,
$$
(T^\vee \psi)(e_j) = \psi(Te_j) = \sum_i A^i_j\, \psi_i,
$$
which runs down column $j$ of $A$ and dots it with $\psi$ — the $j$-th entry of $A^\top \psi$. So the matrix of $T^\vee$ in dual bases is $A^\top$: **matrix transpose is the coordinate face of the abstract dual construction**, and the name is exactly right.

If $V$ and $W$ are both Hilbert, we can pull $T^\vee$ back into a map between the original spaces using the Riesz maps of each. The result — denoted $T^\dagger$ here, to keep it distinct from the conjugation superscript $*$ — satisfies the "moving-the-star identity"
$$
\langle Tv, w \rangle_W = \langle v, T^\dagger w \rangle_V \quad \text{for all } v \in V, w \in W,
$$
and is called the **adjoint** of $T$. Over $\mathbb{R}$ with standard inner products, $A^\dagger = A^\top$; over $\mathbb{C}$ with $\langle x, y \rangle = \overline{x}^\top y$, $A^\dagger = \overline{A}^\top$, the **conjugate transpose**. The conjugation comes from the Riesz map being conjugate-linear over $\mathbb{C}$, which in turn comes from insisting $\langle v, v \rangle$ be a nonnegative real number. The name "conjugate transpose" is the coordinate trace of that choice.

**Dualising a cone.**

A **cone** $K \subseteq V$ is closed under nonnegative scaling: $x \in K,\, \alpha \geq 0 \implies \alpha x \in K$. A **convex cone** is additionally closed under addition. In an inner-product space, the natural question to ask of $K$ is: which directions pair nonnegatively with everything in $K$? The **dual cone** collects them:
$$
K^* = \{ y \in V : \langle y, x \rangle \geq 0 \text{ for all } x \in K \}.
$$
Without the inner product, $K^*$ would live in $V^*$ as the functionals nonnegative on $K$; the Riesz map lets us view it inside $V$ instead. Two properties are automatic: $K^*$ is a convex cone (sums and nonnegative scalings preserve "$\geq 0$"), and $K^*$ is closed (as an intersection of closed halfspaces $\{y : \langle y, x \rangle \geq 0\}$, one per $x \in K$). Even if $K$ is a bizarre non-closed non-convex mess, its dual is a closed convex cone.

Examples on $\mathbb{R}^n$ with the standard inner product:

- The nonnegative orthant $\mathbb{R}^n_+$ is **self-dual**: $y \cdot x \geq 0$ for all $x \geq 0$ iff $y \geq 0$.
- A single ray $K = \{\alpha v : \alpha \geq 0\}$ has dual $K^* = \{y : \langle y, v \rangle \geq 0\}$, a closed halfspace through the origin with inward normal $v$. Duality trades a "thin" cone for a "fat" one.
- The **positive semidefinite cone** $\mathrm{PSD}_n$ is self-dual with respect to the trace inner product $\langle M, N \rangle = \mathrm{tr}(MN)$.

{% include visualization.html src="dual-cones.html" title="Dual cones: the universal inequality test, examples, and the bidual" %}

Taking the dual twice: $K^{**} = \overline{\mathrm{cone}}(K)$, the smallest closed convex cone containing $K$. So $K^{**} = K$ **iff $K$ is closed and convex**. The bidual-equals-original pattern reappears, with the regularity condition specialised to what "the round trip through $K^*$" can and cannot recover.

**Dualising a general set.**

The dual-cone construction depended on the specific bound "$\geq 0$", which was calibrated to $K$'s closure under nonnegative scaling. For a general set $C$ (not stable under scaling), the natural bound is not zero but *some* finite constant — take $1$ as a convenient normalisation:
$$
C^\circ = \{ y \in V : \langle y, x \rangle \leq 1 \text{ for all } x \in C \}.
$$
This is the **polar set** of $C$. The choice of $1$ is normalisation only; any positive constant gives the same construction up to scaling. We use a positive constant rather than $0$ because a "$\leq 0$" bound would collapse to $\{0\}$ whenever $0 \in C$ but $C$ is not a cone.

When $C$ is a cone, the polar reduces to the negative of the dual cone: "$\langle y, x \rangle \leq 1$ for all $x \in C$" and "$C$ closed under nonnegative scaling" together demand "$\langle y, \alpha x \rangle \leq 1$ for all $\alpha \geq 0$"; letting $\alpha \to +\infty$ forces $\langle y, x \rangle \leq 0$. So on cones, $C^\circ = -C^*$: polar and dual cone are the same construction, differing only in the sign of the inequality.

The bipolar theorem: $C^{\circ\circ}$ is the closed convex hull of $C \cup \{0\}$. So $C^{\circ\circ} = C$ iff $C$ is closed, convex, and contains $0$. Again the bidual pattern, with regularity now including "contains $0$".

**How the support function fits in.**

The support function $\sigma_C(y) = \sup_{x \in C} \langle y, x \rangle$ from [Section 1.6](#sec-1-6) is the third face of the same coin — the one that lives naturally as a function on directions rather than as a subset of $V$. The pairings

- polar set $C^\circ$ $\longleftrightarrow$ the sublevel set $\{y : \sigma_C(y) \leq 1\}$,
- support function $\sigma_C$ $\longleftrightarrow$ the convex conjugate of the indicator, $\sigma_C = \delta_C^*$,

show that all the set-level duality of this collapsible is *what the function-level duality of the main text reduces to* when the function happens to be an indicator. Every regularity condition for sets (closed, convex, contains $0$) is exactly what makes $\delta_C$ satisfy the Fenchel–Moreau hypotheses (proper, convex, lsc). The set constructions do not add anything the conjugate does not already do; they are its restrictions to less informative inputs.

**The unified picture.**

Collecting the levels visited:

- Vector space $V$ → dual space $V^*$. Regularity for $V \cong V^{**}$: reflexive.
- Vector space with inner product → $V \cong V^*$ via Riesz, giving adjoints.
- Cone $K$ → dual cone $K^*$. Regularity for $K^{**} = K$: closed convex.
- Set $C$ → polar $C^\circ$, support function $\sigma_C$. Regularity for $C^{\circ\circ} = C$: closed convex, $0 \in C$.
- Function $f$ → convex conjugate $f^*$. Regularity for $f^{**} = f$: convex, lsc, proper (this is Fenchel–Moreau).

The constructions inter-translate: polar and dual cone differ only in the sign of the inequality; adjoint operators are transposes of matrices under the standard inner product; indicator functions of sets have support functions as their conjugates. The convex conjugate is the most flexible of the constructions, because functions carry the most information — and once one operation is understood, the others are its projections onto different structural settings. The matrix transpose we will meet in [Section 2](#sec-2) is the linear-map instance of the same idea, and its appearance in the Lagrangian is not a coincidence.

<div class="guided-fold-end"></div>

With $f^*$, the Fenchel–Young inequality, and the indicator-to-support-function bridge in hand, we can turn to a family of problems where these constructions are exactly what the setting asks for.

## 2. Duality in optimisation {#sec-2}

A constrained optimisation problem can be recast as an inf-of-a-sup, and swapping the two produces a companion problem — the **dual** — that is often more tractable than the original. This is where the machinery of [Section 1](#sec-1) starts paying off. The move set $\to$ indicator (from [Section 1.6](#sec-1-6)) lets us fold constraints into the objective; the convex conjugate $f^*$ (from [Section 1.1](#sec-1-1)) lets us evaluate the inner problem in one shot when the constraint structure is linear, giving a dual objective written entirely in terms of $f^*$; the biconjugate identity $f^{**} = f$ (from [Section 1.5](#sec-1-5), for convex lsc proper $f$) is the reason strong duality holds in this same setting. So the reader has not been reading Section 1 out of ceremony: every concept there is a specific tool used here, and this section will point to each one at the moment it enters.

### 2.1 Weak duality via the min–max inequality {#sec-2-1}

The starting point is an elementary observation about functions of two variables:
$$
\inf_x \sup_y F(x, y) \geq \sup_y \inf_x F(x, y),
$$
true for *any* $F$. To see it, pick *any* value $y_0$ and hold it fixed for the moment. Since the sup over all $y$ is at least the value at that particular $y_0$, we have
$$
\sup_y F(x, y) \geq F(x, y_0) \qquad \text{for every } x,
$$
and taking $\inf_x$ on both sides preserves the inequality:
$$
\inf_x \sup_y F(x, y) \geq \inf_x F(x, y_0).
$$
The left-hand side no longer depends on $y_0$, so this inequality holds *for every* $y_0$ — which lets us take a sup over $y_0$ on the right without touching the left:
$$
\inf_x \sup_y F(x, y) \geq \sup_{y_0} \inf_x F(x, y_0),
$$
and the right side is the claimed $\sup_y \inf_x F(x, y)$ under the dummy renaming $y_0 \to y$.

This one-line inequality is the source of every weak-duality statement below. The reverse inequality $\inf \sup \leq \sup \inf$ is *not* automatic: it requires additional structure — either a *saddle point* (a single point that is a minimum along its $x$-slice and a maximum along its $y$-slice, so both orders are pinned to its value), or convexity together with an interior-point condition that we introduce concretely in [Section 2.5](#sec-2-5). When the reverse inequality holds, we say **strong duality** holds.

{% include visualization.html src="minimax-weak-duality.html" title="Weak duality, the two optimisation orders, and the conditions that close the gap" %}

To use this, we need to cast a constrained problem as $\inf_x \sup_y F$ for a suitably chosen $F$.

### 2.2 The Lagrangian construction {#sec-2-2}

Consider the primal
$$
\min_{x \in \mathcal{D}} f_0(x) \quad \text{s.t.} \quad f_i(x) \leq 0 \; (i = 1, \ldots, m), \; h_j(x) = 0 \; (j = 1, \ldots, p),
$$
with $\mathcal{D} \subseteq \mathbb{R}^n$ the domain and $f_0, f_i, h_j: \mathcal{D} \to \mathbb{R}$ all real-valued functions on it. Concretely:

- $f_0$ is the **objective** we want to minimise.
- Each $f_i$ is an **inequality constraint**: the condition $f_i(x) \leq 0$ says $x$ is on the acceptable side of the $i$-th constraint. Positive $f_i(x)$ means violation, and by how much.
- Each $h_j$ is an **equality constraint**: the condition $h_j(x) = 0$ says $x$ hits the $j$-th target exactly. Nonzero $h_j(x)$ means violation, and $h_j(x)$ can be positive or negative depending on which side.

A point $x$ is called **feasible** if it satisfies every constraint, and the primal problem asks for the minimum of $f_0$ over feasible $x$.

Define the **Lagrangian**
$$
L(x, \lambda, \nu) = f_0(x) + \sum_i \lambda_i f_i(x) + \sum_j \nu_j h_j(x), \qquad \lambda \geq 0, \; \nu \in \mathbb{R}^p.
$$
Each $\lambda_i \geq 0$ is a **penalty weight** attached to the $i$-th inequality: multiplying $\lambda_i$ against $f_i(x)$ and adding to $f_0(x)$ turns a violation into an added cost. Each $\nu_j$ is a penalty weight for the $j$-th equality; the reason it has no sign restriction is that violations of $h_j(x) = 0$ can go either way (positive or negative), and to penalise a positive violation we need $\nu_j > 0$ while penalising a negative violation needs $\nu_j < 0$. Inequality violations only go one way (positive $f_i(x)$), so $\lambda \geq 0$ is enough.

Why build $L$? Because taking the sup of $L$ over the multipliers gives an unconstrained rewriting of the constrained primal:
$$
\sup_{\lambda \geq 0, \, \nu} L(x, \lambda, \nu) = \begin{cases} f_0(x) & x \text{ feasible}, \\ +\infty & x \text{ infeasible.} \end{cases}
$$
Once this identity holds, minimising over all $x \in \mathcal{D}$ automatically avoids infeasible $x$ (they have infinite value) and reduces to minimising $f_0(x)$ over feasible $x$ — the original primal, with no constraint bookkeeping:
$$
\min_{x \text{ feasible}} f_0(x) = \inf_{x \in \mathcal{D}} \sup_{\lambda \geq 0, \nu} L(x, \lambda, \nu).
$$
This is the same absorption trick as [Section 1.6](#sec-1-6): the constraint set is being encoded as a $+\infty$-outside penalty, but this time built from adjustable multipliers rather than a fixed indicator.

*Why the sup identity holds.* Two cases:

- **$x$ infeasible.** Then either $f_i(x) > 0$ for some $i$, in which case sending $\lambda_i \to +\infty$ drives $\lambda_i f_i(x) \to +\infty$; or $h_j(x) \neq 0$ for some $j$, in which case sending $\nu_j \to +\infty$ if $h_j(x) > 0$ or $\nu_j \to -\infty$ if $h_j(x) < 0$ drives $\nu_j h_j(x) \to +\infty$. Either way the sup is $+\infty$.
- **$x$ feasible.** Then every $f_i(x) \leq 0$, so every product $\lambda_i f_i(x)$ is non-positive (positive weight times non-positive constraint value), and every $h_j(x) = 0$, so every product $\nu_j h_j(x)$ is zero. The sup over $\lambda \geq 0, \nu$ of a sum of terms each $\leq 0$ (with equality attainable at $\lambda = 0$) is $0$. Adding back the $f_0(x)$ offset gives sup $= f_0(x)$.

The underlying idea — you are letting an adversary pick the penalty weights, and their best strategy is exactly "punish violations infinitely, ignore feasible points" — has a longer explanation worth unpacking once.

<div class="guided-fold-start" data-label="Where the Lagrangian actually comes from, and why the sup identity is honest" data-tone="derivation"></div>

The construction can feel like a magic trick — a random-looking $L$ is written down, then a sup over its multipliers turns out to be the exact indicator of feasibility. It is not magic; it is the mechanical consequence of choosing $L$ so that, term by term, each constraint's violation is *rewardable* by the corresponding multiplier.

Take one inequality constraint $f_i(x) \leq 0$ in isolation and ask: how do I write a function of $(x, \lambda_i)$ whose sup over $\lambda_i \geq 0$ is $0$ when the constraint is satisfied and $+\infty$ when it is violated? The candidate is $\lambda_i \cdot f_i(x)$, and the sign restriction $\lambda_i \geq 0$ is doing the actual work here:

- If $f_i(x) \leq 0$: for any $\lambda_i \geq 0$, the product $\lambda_i f_i(x) \leq 0$. The sup is achieved at $\lambda_i = 0$, giving value $0$.
- If $f_i(x) > 0$: pick $\lambda_i$ arbitrarily large. The product $\lambda_i f_i(x)$ grows without bound. The sup is $+\infty$.

So the single term $\sup_{\lambda_i \geq 0} \lambda_i f_i(x)$ is *by construction* the indicator function
$$
\delta_{\{f_i \leq 0\}}(x) = \begin{cases} 0 & f_i(x) \leq 0, \\ +\infty & f_i(x) > 0 \end{cases}
$$
of the $i$-th constraint's feasible set, written via the [Section 1.6](#sec-1-6) notation. That is the honest statement: the Lagrangian is not a mystical dual object, it is *the indicator function of the feasible set, unpacked one constraint at a time*, with the sup over multipliers doing the encoding.

Equality constraints work the same way, with one twist. The pair $\sup_{\nu_j} \nu_j h_j(x)$ (no sign restriction) is $0$ when $h_j(x) = 0$ (any $\nu_j$ gives zero) and $+\infty$ when $h_j(x) \neq 0$ (pick $\nu_j$ with matching sign, send to $+\infty$). So the sup encodes the indicator of the $j$-th equality set. The sign restriction on $\lambda_i$ but not $\nu_j$ is not a convention — it is the exact ingredient that makes each sup collapse to the right indicator.

Putting it all together: since the constraint terms are independent given $x$, the sup over $(\lambda, \nu)$ splits into a sum of individual sups. Each individual sup is an indicator. Their sum is the indicator of the *joint* feasible set. So
$$
\sup_{\lambda \geq 0, \nu} \sum_i \lambda_i f_i(x) + \sum_j \nu_j h_j(x) = \delta_{\{\text{all constraints hold}\}}(x),
$$
and adding the $f_0(x)$ that sits outside the multiplier terms gives the full identity of the main text. The Lagrangian is the indicator of feasibility written in a form where the "yes/no" flag has been replaced by a max over penalty weights — precisely because a max over $\lambda_i \geq 0$ against a linear expression $\lambda_i f_i(x)$ is either $0$ or $+\infty$ depending on the sign of $f_i(x)$.

The "geometric" tangent-to-boundary talk you might have seen elsewhere is a downstream consequence — at an optimum, the objective's descent direction and the active constraints' outward normals balance because $\nabla_x L = 0$ — but that story starts later, at KKT ([Section 2.7](#sec-2-7)). The identity itself is just the max-of-affine-in-multiplier calculation above, done term by term.

<div class="guided-fold-end"></div>

Once the identity above is in hand,
$$
\text{primal value} = \inf_{x \in \mathcal{D}} \sup_{\lambda \geq 0, \nu} L(x, \lambda, \nu).
$$
Swap the two operators to define the **dual function** and **dual problem**:
$$
g(\lambda, \nu) = \inf_{x \in \mathcal{D}} L(x, \lambda, \nu), \qquad \text{dual value} = \sup_{\lambda \geq 0, \nu} g(\lambda, \nu).
$$
By the min–max inequality of [Section 2.1](#sec-2-1), dual value $\leq$ primal value — **weak duality**, unconditionally.

### 2.3 The dual is a maximisation of a concave function {#sec-2-3}

Two structural facts about the dual problem $\sup_{\lambda \geq 0, \nu} g(\lambda, \nu)$ hold no matter what the primal looks like.

**The dual is a maximisation.** In the primal-value form $\inf_x \sup_{\lambda \geq 0, \nu} L$, the inner operation is a sup and the outer is an inf. Swapping their order sends the sup to the outside, so the dual problem asks for a *maximum* of $g(\lambda, \nu)$ over $\lambda \geq 0, \nu$. Weak duality says every value of $g$ is $\leq$ the primal value, so pushing $g$ up is pushing the lower bound on the primal as tight as possible — hence the maximisation.

**$g$ is concave in $(\lambda, \nu)$ no matter what $f_0, f_i, h_j$ look like.** The cleanest way to see this is to check that $-g$ is convex, since a function is concave iff its negation is convex, and we already have a convexity criterion from [Section 1.5](#sec-1-5).

Freeze any $x \in \mathcal{D}$. Then $f_0(x), f_1(x), \ldots, f_m(x), h_1(x), \ldots, h_p(x)$ are all just fixed real numbers — the dependence on $x$ has been resolved. Read the Lagrangian
$$
L(x, \lambda, \nu) = f_0(x) + \sum_i \lambda_i f_i(x) + \sum_j \nu_j h_j(x)
$$
as a function of $(\lambda, \nu)$ alone, with $x$ frozen: it is $f_0(x)$ (a constant) plus a linear combination of $\lambda_i$'s and $\nu_j$'s whose coefficients are $f_i(x), h_j(x)$. That is an *affine function* of $(\lambda, \nu)$ — the graph is a hyperplane over the $(\lambda, \nu)$-space. Negate it: $-L(x, \lambda, \nu)$ is also affine in $(\lambda, \nu)$, with coefficients $-f_i(x), -h_j(x)$ and offset $-f_0(x)$.

Now let $x$ range over $\mathcal{D}$. Each choice of $x$ gives one such affine function of $(\lambda, \nu)$. Taking the sup of these affine functions over $x$ is exactly the operation of [Section 1.5](#sec-1-5) that produced the convexity of $f^*$: a sup, indexed by $x$, of affine functions of $(\lambda, \nu)$ is a convex function of $(\lambda, \nu)$. So
$$
-g(\lambda, \nu) = -\inf_{x \in \mathcal{D}} L(x, \lambda, \nu) = \sup_{x \in \mathcal{D}} \bigl( -L(x, \lambda, \nu) \bigr)
$$
is convex in $(\lambda, \nu)$, and $g$ itself is therefore concave. Crucially, at no point in the argument did we assume anything about how $f_0, f_i, h_j$ depend on $x$ — they are absorbed as coefficients of the affine slices before the sup runs.

Two takeaways.

The first is that the concavity of $g$ survives even when the primal is nonconvex. Whatever wildness lives in $f_0, f_i, h_j$ as functions of $x$ — discontinuities, non-convexity, oscillation — is baked into the affine coefficients $f_i(x), h_j(x)$ at each frozen $x$. Sup over $x$ picks the top of the resulting affine family, which is convex in $(\lambda, \nu)$ regardless of the details of the family.

The second is that this is often *why* one dualises in the first place. Suppose the primal is a nonconvex problem — the objective or the constraint functions have local minima, plateaus, or worse. Directly optimising it is hard. The dual, by contrast, always maximises a concave function over the region $\lambda \geq 0$; local maxima of a concave function on a convex region are global, and standard convex optimisation methods find them. And by weak duality, whatever the dual attains is a rigorous lower bound on the primal optimum. So even when strong duality does not hold, the dual gives you a certified lower bound at the cost of solving a tractable problem instead of an intractable one.

Whether the dual bound is *tight* or leaves a gap depends on the structure of the primal; that is the strong-duality question. Before addressing it, we look at when the dual can be written entirely in terms of the convex conjugate $f_0^*$ from [Section 1](#sec-1).

### 2.4 When constraints are linear, the dual is $f^*$ evaluated at a specific point {#sec-2-4}

When the primal's constraints are linear, the whole inner minimisation $\inf_x L(x, \lambda)$ that defines the dual function collapses to a single evaluation of the convex conjugate $f^*$ from [Section 1.1](#sec-1-1). This is where the conjugate machinery finally does concrete work. Take
$$
\min_x f(x) \quad \text{s.t.} \quad Ax \leq b,
$$
where $A$ is an $m \times n$ matrix and $b \in \mathbb{R}^m$. The Lagrangian, with $\lambda \geq 0$:
$$
L(x, \lambda) = f(x) + \lambda^\top(Ax - b) = f(x) + \langle A^\top \lambda,\, x \rangle - \langle \lambda, b \rangle.
$$
The dual function is $g(\lambda) = \inf_x L(x, \lambda)$. Look at what has to be minimised in $x$: only the first two terms, $f(x) + \langle A^\top \lambda,\, x \rangle$, depend on $x$; the third, $\langle \lambda, b \rangle$, is a constant with respect to $x$ and comes out of the inf. Using $\inf_x u(x) = -\sup_x(-u(x))$,
$$
g(\lambda) = -\sup_x \bigl( -f(x) - \langle A^\top \lambda,\, x \rangle \bigr) - \langle \lambda, b \rangle = -\sup_x \bigl( \langle -A^\top \lambda,\, x \rangle - f(x) \bigr) - \langle \lambda, b \rangle.
$$
The sup on the right is exactly the definition of the convex conjugate $f^*$ at the point $-A^\top \lambda$. So
$$
g(\lambda) = -f^*(-A^\top \lambda) - \langle \lambda, b \rangle,
$$
and the dual problem is
$$
\max_{\lambda \geq 0} \Bigl( -f^*(-A^\top \lambda) - \langle \lambda, b \rangle \Bigr).
$$
No more inner minimisation to solve — a single conjugate evaluation gives $g(\lambda)$ directly. That is what "the conjugate is the engine" means, concretely.

The transpose $A^\top$ is doing exactly the job set out for it in the [Section 1.6 collapsible](#sec-1-6). $A$ sends the primal variable $x \in \mathbb{R}^n$ forward to the constraint-value vector $Ax \in \mathbb{R}^m$; the multiplier $\lambda \in \mathbb{R}^m$ lives in the same space as $Ax$; and $A^\top$ transports $\lambda$ back to $\mathbb{R}^n$ so it can appear as a slope for $f^*$, which lives on $\mathbb{R}^n$. The transpose is not a computational trick; it is the dual of the linear map $A$ appearing at the moment it is needed.

For nonlinear constraints the reduction breaks — the term $\langle A^\top \lambda, x \rangle$ can no longer be extracted from $\lambda^\top(Ax - b)$ because the constraint is not linear in $x$ — and one keeps the general Lagrangian expression.

### 2.5 Fenchel–Rockafellar duality {#sec-2-5}

The cleanest general instance of the "primal + linear map → dual via two conjugates" pattern is the Fenchel–Rockafellar duality theorem. Consider
$$
\min_x \bigl( f(x) + g(Ax) \bigr)
$$
for proper convex $f: V \to \mathbb{R} \cup \{+\infty\}$, $g: W \to \mathbb{R} \cup \{+\infty\}$, and linear $A: V \to W$. The dual is
$$
\max_y \bigl( -f^*(-A^\top y) - g^*(y) \bigr).
$$

**Weak duality.** Fix any $x$ and $y$.

- Fenchel–Young for $f$ at $(x, -A^\top y)$: $f(x) + f^*(-A^\top y) \geq \langle -A^\top y, x \rangle = -\langle y, Ax \rangle$.
- Fenchel–Young for $g$ at $(Ax, y)$: $g(Ax) + g^*(y) \geq \langle y, Ax \rangle$.

Adding and cancelling the $\langle y, Ax \rangle$ terms:
$$
f(x) + g(Ax) + f^*(-A^\top y) + g^*(y) \geq 0,
$$
i.e., $f(x) + g(Ax) \geq -f^*(-A^\top y) - g^*(y)$. Taking $\inf$ over $x$ on the left and $\sup$ over $y$ on the right:
$$
\inf_x \bigl( f(x) + g(Ax) \bigr) \geq \sup_y \bigl( -f^*(-A^\top y) - g^*(y) \bigr).
$$

**Strong duality** (Fenchel–Rockafellar theorem, statement only): if $f, g$ are proper convex lsc and there exists $x \in \mathrm{relint}(\mathrm{dom}\, f)$ with $Ax \in \mathrm{relint}(\mathrm{dom}\, g)$, then equality holds and the dual sup is attained. Here $\mathrm{relint}(S)$ is the **relative interior** of $S$: the interior taken inside the affine hull of $S$ rather than the ambient space. The distinction matters whenever $\mathrm{dom}\, f$ is a lower-dimensional slice — a line segment inside $\mathbb{R}^2$, or an equality-constrained affine subspace — because its ordinary interior is empty while its relative interior is not. The interior-point condition on $x$ is doing the same job here as in the visualization for Section 2.1: it guarantees that the value function for the perturbed problem is finite in an open neighbourhood of the actual constraint, which is exactly what lets the separating-hyperplane argument produce an affine function reaching $p(0)$ from below. Without it, the value function can drop off at the boundary and the affine support cannot touch. This interior-point condition is often called a *constraint qualification* — a name that emphasises its role in qualifying constraints as "regular enough" for the duality machinery to close.

The linear-constraint case of [Section 2.4](#sec-2-4) is Fenchel–Rockafellar with $g = \delta_{\{y \leq b\}}$, the indicator of a halfspace, whose conjugate is a support function.

### 2.6 Linear programming as a special case {#sec-2-6}

A **linear program (LP)** is an optimisation problem with a linear objective and linear constraints. Take the standard-form primal
$$
\min c^\top x \quad \text{s.t.} \quad Ax \geq b, \; x \geq 0,
$$
which has objective $f_0(x) = c^\top x$, inequality $b - Ax \leq 0$, and domain restriction $\mathcal{D} = \mathbb{R}^n_+$.

Lagrangian:
$$
L(x, y) = c^\top x + y^\top (b - Ax) = y^\top b + (c - A^\top y)^\top x,
$$
with $y \geq 0$ (multiplier for the inequality) and $x \geq 0$ (from the domain).

Dual function:
$$
g(y) = \inf_{x \geq 0} L(x, y) = y^\top b + \inf_{x \geq 0} (c - A^\top y)^\top x.
$$
The inf of a linear function over $\mathbb{R}^n_+$ is $0$ if the coefficient vector has all components $\geq 0$ (attained at $x = 0$), and $-\infty$ otherwise (send one coordinate to $+\infty$ along a component where the coefficient is negative). So
$$
g(y) = \begin{cases} y^\top b & c - A^\top y \geq 0, \\ -\infty & \text{otherwise.} \end{cases}
$$
The dual problem is
$$
\max \; y^\top b \quad \text{s.t.} \quad A^\top y \leq c, \; y \geq 0.
$$
That is the standard-form LP dual — obtained mechanically from the Lagrangian construction.

The symmetry is clean: the primal minimises with "$\geq$" inequality constraints and "$\geq 0$" variables; the dual maximises with "$\leq$" inequality constraints and "$\geq 0$" variables. The transpose $A^\top$ appears — no accident, since it is the dual-map construction from the [Section 1.6 collapsible](#sec-1-6).

### 2.7 KKT conditions and complementary slackness {#sec-2-7}

At a primal optimum $x^*$ with dual optimum $(\lambda^*, \nu^*)$ and strong duality holding, we can extract necessary conditions — the **Karush–Kuhn–Tucker (KKT)** conditions:

1. **Stationarity.** $\nabla_x L(x^*, \lambda^*, \nu^*) = 0$: at $x^*$, the objective's gradient is balanced by weighted constraint gradients.
2. **Primal feasibility.** $f_i(x^*) \leq 0$, $h_j(x^*) = 0$.
3. **Dual feasibility.** $\lambda^*_i \geq 0$.
4. **Complementary slackness.** $\lambda^*_i f_i(x^*) = 0$ for all $i$.

The last condition is the Fenchel–Young equality of [Section 1.3](#sec-1-3) in disguise. At a saddle point of $L$, the sup in $\sup_{\lambda \geq 0} \sum_i \lambda_i f_i(x^*)$ is attained; that sup equals $0$ (since $x^*$ is feasible), and each term $\lambda^*_i f_i(x^*)$ must be $0$: either $\lambda^*_i = 0$ (constraint inactive, dual is "slack") or $f_i(x^*) = 0$ (constraint active, primal is "slack"). Never both nonzero at the same $i$ — hence "complementary".

For convex problems with a suitable constraint qualification, the KKT conditions are also **sufficient** for optimality.
