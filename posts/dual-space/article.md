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

**1. $f^*$ is always convex.** $f^*(y)$ is a sup, over $x$, of functions $y \mapsto \langle y, x \rangle - f(x)$ that are affine in $y$; a sup of affine functions is convex. Note that convexity of $f$ is not needed — the argument works for any $f$ whatsoever.

**2. $f^*$ is always lower semi-continuous.** *Lower semi-continuous (lsc)* means: for any sequence $y_n \to y$,
$$
f^*(y) \leq \liminf_{n \to \infty} f^*(y_n).
$$
Values can drop at limits but not jump up. The argument parallels (1) with a different closure property: each function $y \mapsto \langle y, x \rangle - f(x)$ is continuous in $y$, and a pointwise sup of continuous (in fact, of merely lsc) functions is always lsc. So convexity of $f^*$ comes from sup-preserves-convexity, and lower semi-continuity of $f^*$ from sup-preserves-lsc — same recipe, different closure property.

**3. The biconjugate satisfies $f^{**} \leq f$.** From Fenchel–Young,
$$
f(x) \geq \langle y, x \rangle - f^*(y) \quad \text{for all } y \implies f(x) \geq \sup_y \bigl( \langle y, x \rangle - f^*(y) \bigr) = f^{**}(x).
$$

**4. When is $f^{**} = f$?** By (1) and (2), $f^{**}$ is always convex and lsc, so we cannot hope for $f^{**} = f$ unless $f$ is convex and lsc. We also need $f$ to be **proper**, meaning: $f$ is not identically $+\infty$ (it takes at least one finite value) and $f > -\infty$ everywhere (it never plunges to $-\infty$). The name rules out the two degenerate ways an extended-real-valued function can fail to carry useful information.

Under those three conditions, the biconjugate does recover $f$. Here is a sketch in three steps.

*Step 1 — unfold the biconjugate.* From the definitions,
$$
f^{**}(x) = \sup_y \bigl( \langle y, x \rangle - f^*(y) \bigr).
$$
For each $y$, $f^*(y)$ is the smallest constant $c$ (allowing $c = -\infty$) for which the affine function $x' \mapsto \langle y, x' \rangle - c$ sits below $f$ everywhere ([Section 1.1](#sec-1-1)). So $\langle y, x \rangle - f^*(y)$ is the value at $x$ of the *highest* affine function of slope $y$ that stays under $f$, and $f^{**}(x)$ is the sup, over all slopes $y$, of these values. In short: **$f^{**}(x)$ is the pointwise supremum, evaluated at $x$, of every affine minorant of $f$**.

*Step 2 — the easy inequality.* Every affine minorant $\ell$ satisfies $\ell(x) \leq f(x)$ by definition, so taking the sup preserves the inequality: $f^{**}(x) \leq f(x)$. This much holds with no assumptions on $f$ — it is property 3 in geometric dress.

*Step 3 — where the three assumptions enter.* The reverse inequality $f^{**}(x) \geq f(x)$ needs, at each $x$, an affine minorant of $f$ whose value at $x$ approaches $f(x)$. The Hahn–Banach separation theorem, applied to the epigraph $\{(x', t) : t \geq f(x')\}$, produces one — provided the epigraph is nonempty (this is *proper*), is closed (this is *lsc*), and is convex (this is *convex*). All three assumptions get consumed at this step.

Under (convex, lsc, proper), $f^{**} = f$. This equality is the **Fenchel–Moreau theorem**, and it is what makes convex conjugation invertible on the class of well-behaved convex functions.

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

The passage set $\to$ indicator $\to$ conjugate $\to$ support function is the mechanism that translates between two representations of the same object: $\delta_C$ **stores** the set (yes/no membership), $\sigma_C$ **measures** it (how far it extends in each direction), and conjugation crosses between them. Any theorem about closed convex sets we might hope for (bipolar theorem, closed convex hulls) comes out of Fenchel–Moreau on the function side, applied to $\delta_C$.

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

A constrained optimisation problem can be recast as an inf-of-a-sup, and swapping the two produces a companion problem — the **dual** — that is often more tractable than the original. Along the way: the indicator/support pairing from [Section 1.6](#sec-1-6) encodes the constraint set, the convex conjugate gives the dual objective in closed form when constraints are linear, and the matrix transpose (dual of a linear map — see the [Section 1.6 collapsible](#sec-1-6)) shows up in the Lagrangian.

### 2.1 Weak duality via the min–max inequality {#sec-2-1}

The starting point is an elementary observation about functions of two variables:
$$
\inf_x \sup_y F(x, y) \geq \sup_y \inf_x F(x, y),
$$
true for *any* $F$. To see it: fix any $y_0$; then $\sup_y F(x, y) \geq F(x, y_0)$, so $\inf_x \sup_y F(x, y) \geq \inf_x F(x, y_0)$; taking a sup over $y_0$ on the right gives the claim.

This one-line inequality is the source of every weak-duality statement below. The reverse inequality $\inf \sup \leq \sup \inf$ is *not* automatic: it requires structure (a saddle point, or convexity plus a constraint qualification). When it holds, we say **strong duality** holds.

{% include visualization.html src="minimax-weak-duality.html" title="Weak duality, the two optimisation orders, and the conditions that close the gap" %}

To use this, we need to cast a constrained problem as $\inf_x \sup_y F$ for a suitably chosen $F$.

### 2.2 The Lagrangian construction {#sec-2-2}

Consider the primal
$$
\min_{x \in \mathcal{D}} f_0(x) \quad \text{s.t.} \quad f_i(x) \leq 0 \; (i = 1, \ldots, m), \; h_j(x) = 0 \; (j = 1, \ldots, p),
$$
with $f_0, f_i, h_j: \mathcal{D} \to \mathbb{R}$. Define the **Lagrangian**
$$
L(x, \lambda, \nu) = f_0(x) + \sum_i \lambda_i f_i(x) + \sum_j \nu_j h_j(x), \qquad \lambda \in \mathbb{R}^m_+, \; \nu \in \mathbb{R}^p.
$$
The multipliers $\lambda \in \mathbb{R}^m_+$ and $\nu \in \mathbb{R}^p$ collect one component per constraint. The sums are pairings $\langle \lambda, f(x) \rangle$ and $\langle \nu, h(x) \rangle$, where $f(x) = (f_1(x), \ldots, f_m(x)) \in \mathbb{R}^m$ collects the inequality-constraint values into a vector and $h(x)$ does the same for the equalities. Each multiplier component pairs with the corresponding constraint value and adds a scalar penalty to $f_0(x)$.

The sign restriction $\lambda \geq 0$ (but no restriction on $\nu$) is not decorative. It is what makes the observation below work: the sup over $\lambda \geq 0$ diverges to $+\infty$ exactly when an *inequality* $f_i(x) \leq 0$ is violated — a positive $\lambda_i$ against a positive $f_i(x)$ can be blown up. Equalities need multipliers of either sign because $h_j(x) \neq 0$ can be violated in either direction.

**Key observation.** For fixed $x$,
$$
\sup_{\lambda \geq 0, \, \nu} L(x, \lambda, \nu) = \begin{cases} f_0(x) & x \text{ feasible}, \\ +\infty & x \text{ infeasible.} \end{cases}
$$

*Why.* If $f_i(x) > 0$ for some $i$, take $\lambda_i \to +\infty$: the sup is $+\infty$. If $h_j(x) \neq 0$, take $\nu_j \to \pm\infty$: the sup is $+\infty$. If $x$ is feasible, then $\lambda_i f_i(x) \leq 0$ (each term non-positive since $\lambda_i \geq 0$ and $f_i(x) \leq 0$), so $\sup_{\lambda \geq 0} \sum_i \lambda_i f_i(x) = 0$, attained at $\lambda = 0$; and $\nu_j h_j(x) = 0$ regardless of $\nu_j$. The sup is $f_0(x)$.

The inner sup has done exactly what the indicator function of [Section 1.6](#sec-1-6) would have done: it absorbed the constraints into a $+\infty$-outside penalty. Therefore
$$
\text{Primal value} = \inf_x \sup_{\lambda \geq 0, \nu} L(x, \lambda, \nu).
$$
Swap the two operators to define the **dual function** and **dual problem**:
$$
g(\lambda, \nu) = \inf_x L(x, \lambda, \nu), \qquad \text{Dual value} = \sup_{\lambda \geq 0, \nu} g(\lambda, \nu).
$$
By the min–max inequality of [Section 2.1](#sec-2-1), dual $\leq$ primal — **weak duality**, unconditionally.

### 2.3 The dual is always a concave maximisation {#sec-2-3}

Two structural facts fall out of the construction.

**The dual is always a maximisation.** Compare the two forms side by side:
$$
\text{primal:}\quad \inf_x \, \bigl[ \sup_{\lambda \geq 0, \nu} L(x, \lambda, \nu) \bigr], \qquad \text{dual:}\quad \sup_{\lambda \geq 0, \nu} \, \bigl[ \inf_x L(x, \lambda, \nu) \bigr].
$$
The $\sup_{\lambda \geq 0, \nu}$ is *the same operator* in both — it does not flip. What changed is only its *position*: in the primal it sits inside the outer $\inf_x$ and collapses to $f_0(x)$ at feasible $x$; in the dual it sits outside and is what we maximise over. The common phrasing "the dual turns a min into a max" is a summary but misleading in the mechanism: it is not that the operator flips, but that a supremum previously buried under an infimum is now the top-level operation.

**$g$ is concave in $(\lambda, \nu)$ regardless of anything else.** In two steps:

1. For each fixed $x$, the coefficients $f_i(x)$ and $h_j(x)$ are constants (they depend only on $x$, not on the multipliers), and $f_0(x)$ is a constant offset. So $L(x, \lambda, \nu) = f_0(x) + \sum_i \lambda_i f_i(x) + \sum_j \nu_j h_j(x)$ is *affine* in $(\lambda, \nu)$ — no matter how ill-behaved $f_0, f_i, h_j$ are as functions of $x$.
2. $g(\lambda, \nu) = \inf_x L(x, \lambda, \nu)$ is a pointwise infimum, over $x$, of these affine-in-$(\lambda,\nu)$ functions. An infimum of affine functions is always concave — the mirror image of the "sup of affine is convex" that gave us convexity of $f^*$ in [Section 1.5](#sec-1-5).

Two takeaways. First, the concavity of $g$ holds *even if the primal is nonconvex*: the primal's nonconvexity lives in how the $f_i, h_j$ depend on $x$, and step 2 sweeps that dependence away by taking the inf. Second, this is often *the point* of dualising: a nonconvex primal is generically intractable, but its dual is always a concave maximisation over a convex set — a problem a standard convex solver can attack, and one that gives a rigorous lower bound on the primal optimum.

Whether the dual bound is *tight* or leaves a gap depends on the structure of the primal; that is the strong-duality question. Before addressing it, we look at when the dual can be written in closed form.

### 2.4 Linear constraints give closed-form duals {#sec-2-4}

For primals with linear constraints, the dual function can be written down directly as a convex conjugate. Take
$$
\min_x f(x) \quad \text{s.t.} \quad Ax \leq b.
$$
Lagrangian, with $\lambda \geq 0$:
$$
L(x, \lambda) = f(x) + \lambda^\top(Ax - b) = f(x) + \langle A^\top \lambda,\, x \rangle - \langle \lambda, b \rangle.
$$
The dual function:
$$
g(\lambda) = \inf_x L(x, \lambda) = -\sup_x \bigl( \langle -A^\top \lambda, x \rangle - f(x) \bigr) - \langle \lambda, b \rangle = -f^*(-A^\top \lambda) - \langle \lambda, b \rangle.
$$

So the dual is
$$
\max_{\lambda \geq 0} \bigl( -f^*(-A^\top \lambda) - \langle \lambda, b \rangle \bigr).
$$
The convex conjugate is the engine that produces the closed-form dual, and the transpose $A^\top$ is exactly what should appear: $A$ sends the primal variable $x$ forward to the constraint-value vector $Ax \in \mathbb{R}^m$, the multiplier $\lambda$ lives in that space (identified with its own dual via the standard pairing), and $A^\top$ transports $\lambda$ backward so it can be paired with $x$ inside $f^*$. The transpose is doing exactly the job set out for it in the [Section 1.6 collapsible](#sec-1-6).

For nonlinear constraints the closed-form compaction breaks — the constraint terms do not line up as $x$-times-something — and one keeps the general Lagrangian expression.

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

**Strong duality** (Fenchel–Rockafellar theorem, statement only): if $f, g$ are proper convex lsc and there exists $x \in \mathrm{relint}(\mathrm{dom}\, f)$ with $Ax \in \mathrm{relint}(\mathrm{dom}\, g)$, then equality holds and the dual sup is attained. Here $\mathrm{relint}(S)$ is the **relative interior** of $S$: the interior taken inside the affine hull of $S$ rather than the ambient space. The distinction matters whenever $\mathrm{dom}\, f$ is a lower-dimensional slice — a line segment inside $\mathbb{R}^2$, or an equality-constrained affine subspace — because its ordinary interior is empty while its relative interior is not. The existence of such an $x$ is the *constraint qualification*.

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
