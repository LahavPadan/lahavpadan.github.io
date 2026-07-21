# Dual Space

Duality, in the settings gathered here, is the construction of a **partner object** for a given one: a new object built by asking a natural question of the original and collecting all valid answers. For a vector space, the question is "which scalar-valued linear measurements can we make on it?" and the partner is the *dual space*. For a cone, "which directions pair nonnegatively with everything in it?" gives the *dual cone*. For a convex function, "how far can an affine function of a given slope sit below it?" gives the *convex conjugate*. In each case, applying the construction twice recovers the original — provided the original had the right regularity. We start with the plain linear case, then let more structure appear as we go — inner products, cones, convex sets, convex functions — and watch what "the dual" specialises to at each step. In Section 5 all of this reassembles into the primal–dual structure of constrained optimisation.

## 1. The dual space

For a vector space $V$ over a field $\mathbb{F}$ (in every example below, $\mathbb{R}$ or $\mathbb{C}$):

- A **linear functional** on $V$ is a linear map $\varphi: V \to \mathbb{F}$.
- The **dual space** $V^*$ is the set of all linear functionals on $V$, made into a vector space by pointwise addition and scaling:
$$
(\varphi + \psi)(v) = \varphi(v) + \psi(v), \qquad (c\varphi)(v) = c \cdot \varphi(v).
$$

Picking out *linear* scalar-valued maps is not an arbitrary restriction: coordinates, evaluation at a point, integrals, gradients — almost every scalar-valued measurement we make on a vector space is linear.

### 1.1 The dual basis

Fix a basis $\{e_1, \ldots, e_n\}$ of a finite-dimensional $V$. Define $e^1, \ldots, e^n \in V^*$ by
$$
e^i(e_j) = \delta^i_j = \begin{cases} 1 & i = j, \\ 0 & i \neq j, \end{cases}
$$
extended by linearity.

*Read this off: $e^i$ is the functional that returns $1$ on the basis vector $e_i$ and $0$ on all the others. By linearity, $e^i$ picks off the $i$-th coordinate of any $v = \sum_j v^j e_j$.*

**Claim.** $\{e^1, \ldots, e^n\}$ is a basis of $V^*$, the **dual basis** to $\{e_i\}$.

Every $\varphi \in V^*$ is determined by its values on the basis, and one computes directly that $\varphi = \sum_i \varphi(e_i)\, e^i$: the two sides agree on each $e_j$ and both are linear.

Two consequences:

- $\dim V^* = \dim V$, so $V \cong V^*$ whenever $V$ is finite-dimensional.
- The mapping $e_i \mapsto e^i$ **depends on the basis**. Change the basis, change the mapping. Nothing in $V$ or $V^*$ alone picks one such mapping over the others.

The non-uniqueness is a real distinction, not a technicality. When physicists write vectors with upper indices ($v^i$) and functionals with lower indices ($\varphi_i$), they are tracking this fact. Under a change of basis, the components $v^i$ change one way and the components $\varphi_i$ change the *opposite* way — arranged so that the pairing $\varphi_i v^i$ (a single scalar) stays the same. Vectors and functionals really are different objects; the two index positions are the way we keep that straight.

With a basis-dependent mapping in hand, what if we dualise again — does the same non-uniqueness reappear, or does something change?

### 1.2 The double dual

Define $V^{**} = (V^*)^*$ — the space of linear functionals on $V^*$. Every $v \in V$ produces such a functional by *evaluation at $v$*:
$$
\hat v : V^* \to \mathbb{F}, \qquad \hat v(\varphi) = \varphi(v).
$$
Read this carefully: $\hat v$ is not another copy of $v$, but a *new object one level up*. Where $v$ eats nothing and just sits in $V$, $\hat v$ eats a functional $\varphi \in V^*$ and returns the scalar $\varphi(v)$. The rule is "given a functional, evaluate it at the fixed vector $v$." Linearity of $\hat v$ in its argument $\varphi$ follows from the pointwise definition of addition and scaling on $V^*$, so $\hat v$ is indeed an element of $V^{**}$.

The assignment $v \mapsto \hat v$ from $V$ to $V^{**}$ is itself linear in $v$ (a direct check), and — unlike the mapping $e_i \mapsto e^i$ of the previous section — requires no basis: the recipe "evaluate at $v$" uses only $v$ and the linear structure of $V^*$, no further choices.

- **Finite dimensions.** The map is a bijection, so $V \cong V^{**}$ without any choice being made.
- **Infinite dimensions.** With mild extra care (restrict $V^*$ to *continuous* linear functionals when $V$ is normed), the map is still injective but need not be onto. Spaces where it *is* onto are called **reflexive**. Hilbert spaces are reflexive; $L^p$ for $1 < p < \infty$ is reflexive; $L^1$ and $L^\infty$ are not (Section 2.3).

The pattern "an object equals its bidual under the right regularity conditions" will repeat, in a form suited to each setting, for cones (Section 3.2) and for convex functions (Section 4.5).

### 1.3 The transpose of a linear map

Sections 1.1 and 1.2 dualised a single space. The natural next question is: what does duality do to a linear map $T: V \to W$ between two spaces?

Take any $\psi \in W^*$ — a scalar-valued linear measurement on $W$. Composing with $T$ gives $\psi \circ T$, which sends $v \in V$ to $\psi(Tv) \in \mathbb{F}$; being a composition of linear maps, it is itself linear in $v$ and therefore an element of $V^*$. So the assignment $\psi \mapsto \psi \circ T$ takes functionals on $W$ to functionals on $V$ — the arrow goes *backward* because composition chains right-to-left: to build a linear functional on $V$ from one on $W$, we have to first push a $v$ over to $W$ (using $T$) and only then apply the functional. Naming this construction,
$$
T^\vee : W^* \to V^*, \qquad (T^\vee \psi)(v) = \psi(Tv).
$$
$T^\vee$ is the **transpose** or **dual map** of $T$. (The notation $T^\vee$ is not universal; $T^*$ is common but will collide with the Hilbert-space adjoint below, so we keep them apart.)

**In coordinates.** Pick a basis $\{e_j\}$ of $V$ and $\{w_i\}$ of $W$, and let $A$ be the matrix of $T$: $T e_j = A^i_j w_i$. Take the corresponding dual bases $\{e^j\}$ of $V^*$ and $\{w^i\}$ of $W^*$. The $j$-th coordinate of $T^\vee\psi$ in $\{e^j\}$ is just $(T^\vee\psi)(e_j)$, and directly from the definition,
$$
(T^\vee\psi)(e_j) = \psi(Te_j) = A^i_j\, \psi(w_i) = A^i_j\, \psi_i.
$$
Read the sum $\sum_i A^i_j \psi_i$ as an entry of a matrix–vector product. In ordinary notation, the $j$-th entry of $M\psi$ is $\sum_i M_{ji} \psi_i$ — the entries of *row $j$ of $M$*, dotted with $\psi$. Our sum has $A^i_j$ instead, which is *column $j$* of $A$ (row varying, column fixed at $j$). Column $j$ of $A$ is exactly row $j$ of $A^\top$, so
$$
\sum_i A^i_j\, \psi_i = \sum_i (A^\top)_{ji}\, \psi_i = (A^\top \psi)_j.
$$
So the matrix of $T^\vee$ in dual bases is $A^\top$. **Matrix transpose is what the abstract dual construction looks like in coordinates** — the name is exactly right.

## 2. Inner products, Riesz representation, and adjoints

So far the only structure in play has been the vector space itself. Adding an inner product does not by itself change $V$ or $V^*$ — the linear functionals on $V$ are still exactly what they were — but it does supply, for each vector $u \in V$, a **specific** linear functional built out of $u$: the map $v \mapsto \langle u, v \rangle$. Collecting these as $u$ varies gives a mapping $V \to V^*$ that uses no basis, only the inner product. In finite dimensions this mapping is an isomorphism, and the Section 1.1 statement "$\dim V = \dim V^*$" gets upgraded to "$V \cong V^*$ *canonically once an inner product is fixed*" — same dimension, plus a chosen bijection between the two spaces that no basis has to broker.

### 2.1 The Riesz map

An **inner product** on $V$ is a map $\langle \cdot, \cdot \rangle: V \times V \to \mathbb{F}$ that is

- linear in one slot (we take the second),
- conjugate-symmetric: $\langle u, v \rangle = \overline{\langle v, u \rangle}$ (in the real case, symmetric),
- positive: $\langle v, v \rangle \geq 0$, with equality iff $v = 0$.

Fix $u \in V$. The map $v \mapsto \langle u, v \rangle$ is linear in $v$, hence an element of $V^*$; call it $\Phi_u$. The mapping $u \mapsto \Phi_u$ is the **Riesz map** $\Phi: V \to V^*$. It is a *function* from vectors to functionals — not itself a pairing, but built from the pairing $\langle \cdot, \cdot \rangle$ by freezing the first slot and letting the second vary.

- In the **real** case, $\Phi$ is linear: $\Phi_{u_1 + u_2} = \Phi_{u_1} + \Phi_{u_2}$, $\Phi_{cu} = c \Phi_u$.
- In the **complex** case, $\Phi$ is *conjugate-linear* (antilinear): $\Phi_{cu} = \bar c \Phi_u$, since $\langle cu, v \rangle = \bar c \langle u, v \rangle$ by conjugate symmetry.

In finite dimensions $\Phi$ is a bijection. *Injectivity:* if $\Phi_u \equiv 0$ then in particular $\Phi_u(u) = \langle u, u \rangle = 0$, and positivity forces $u = 0$. *Surjectivity:* $\dim V = \dim V^*$, so an injective linear (or conjugate-linear) map between them is onto by a dimension count. The **Riesz representation theorem** extends the bijection to arbitrary Hilbert spaces (complete inner-product spaces): every continuous linear functional on a Hilbert space $H$ has the form $\varphi(v) = \langle u, v \rangle$ for a unique $u \in H$. So $H^* \cong H$ — linearly in the real case, conjugate-linearly in the complex case. Hilbert spaces are **self-dual**: every continuous functional is "inner product with a fixed vector".

Once we can identify $V$ with $V^*$, what does the dual map $T^\vee$ from Section 1.3 look like when transported back to a map inside the original spaces?

### 2.2 The adjoint operator

The transpose $T^\vee: W^* \to V^*$ from Section 1.3 exists for any linear map. If both $V$ and $W$ are Hilbert, the Riesz maps $\Phi_V: V \to V^*$ and $\Phi_W: W \to W^*$ let us pull $T^\vee$ back to a map between the original spaces:
$$
T^\dagger = \Phi_V^{-1} \circ T^\vee \circ \Phi_W : W \to V.
$$
The composition unfolds cleanly. For $w \in W$, set $\psi = \Phi_W(w) \in W^*$, so $\psi(\cdot) = \langle w, \cdot \rangle_W$. Then $T^\vee \psi = \psi \circ T$, i.e., $(T^\vee \psi)(v) = \langle w, Tv \rangle_W$. Applying $\Phi_V^{-1}$ hunts for the unique vector $T^\dagger w \in V$ whose inner product with any $v$ gives that same scalar. Written out:
$$
\langle Tv, w \rangle_W = \langle v, T^\dagger w \rangle_V \quad \text{for all } v \in V, w \in W. \qquad \text{(moving-the-star identity)}
$$
This identity is not an extra assumption — it is the composite $T^\dagger = \Phi_V^{-1} \circ T^\vee \circ \Phi_W$ read one line at a time. $T^\dagger$ is the **adjoint** of $T$ (denoted $T^*$ in most of the literature; we use $\dagger$ here to keep it distinct from the dual map $T^\vee$).

**Real matrix case.** With standard inner products $\langle x, y \rangle = x^\top y$, chase the moving-the-star identity in coordinates:
$$
\langle Ax, y \rangle = (Ax)^\top y = x^\top A^\top y = \langle x, A^\top y \rangle.
$$
The right-hand side is $\langle x, A^\top y \rangle$, so by the uniqueness in the moving-the-star identity, $A^\dagger = A^\top$. Adjoint and matrix transpose coincide, and the distinction between $T^\vee$ and $T^\dagger$ collapses.

**Complex matrix case.** With $\langle x, y \rangle = x^* y$ (bar-transpose times $y$), the same chase gives
$$
\langle Ax, y \rangle = (Ax)^* y = x^* A^* y = \langle x, A^* y \rangle,
$$
so $A^\dagger = A^*$, the **conjugate transpose**. The conjugation is not an extra convention; it comes from the conjugate-linearity of the Riesz map, which itself comes from insisting that $\langle v, v \rangle$ be a nonnegative real number. If we had defined a linear-in-both-slots pairing over $\mathbb{C}$, we would lose positivity. The name "conjugate transpose" is the coordinate trace of that choice.

### 2.3 Examples of dual spaces

A remark before the examples. Up to Section 1 we worked with the **algebraic dual**: *all* linear functionals on $V$, with no continuity requirement — the natural setting when $V$ has no topology, only algebra. Once $V$ carries a norm, the useful notion narrows to the **continuous dual**: the linear functionals $\varphi$ for which
$$
\|\varphi\|_* = \sup_{v \neq 0}\, \frac{|\varphi(v)|}{\|v\|}
$$
is finite (equivalently, $\varphi$ is continuous). In finite dimensions the two coincide — every linear functional is automatically continuous — so nothing was lost in Section 1. In infinite dimensions the algebraic dual is much larger than the continuous dual, and it is the *continuous* dual that supports the theorems: Riesz representation, reflexivity, the $L^p$–$L^q$ duality below, and the bipolar/Fenchel–Moreau results of later sections all use "continuous dual" throughout. From here on, "$V^*$" means the continuous dual when $V$ is normed.

- **$L^p$ spaces.** For $1 \leq p < \infty$, the dual of $L^p([a,b])$ is $L^q([a,b])$ with $\tfrac 1 p + \tfrac 1 q = 1$; the pairing is $\langle g, f \rangle = \int_a^b f g \, dx$. The case $p = q = 2$ is a special case of Riesz representation ($L^2$ is Hilbert); general $p$ needs more work. Taking $p = 1$: $(L^1)^* = L^\infty$, but $(L^\infty)^*$ contains functionals that are not represented by $L^1$ functions, so $L^1$ is not reflexive.
- **$C([a,b])$.** The dual of $C([a,b])$ (continuous functions on $[a,b]$) is a space of measures: every continuous linear functional has the form $f \mapsto \int_a^b f \, d\mu$ for some signed measure $\mu$ on $[a,b]$. Point evaluations $f \mapsto f(x_0)$ correspond to Dirac measures $\delta_{x_0}$.
- **Sequence spaces.** $(\ell^p)^* = \ell^q$ for conjugate exponents, $1 \leq p < \infty$. Once again the endpoint fails: $\ell^1$ is not reflexive.

## 3. Dual cones, polar sets, and support functions

The dual of a vector space is a vector space; the dual of an operator is an operator. What is the dual of a *set*? Different structures on the set — cone, general set, convex set — give three names for what turns out to be one underlying construction, and everything here will re-appear in Section 4 as a special case of a function-level operation.

Throughout this section, take $V$ to be a real inner-product space.

### 3.1 Cones and dual cones

A **cone** $K \subseteq V$ is a set closed under nonnegative scaling:
$$
x \in K,\; \alpha \geq 0 \implies \alpha x \in K.
$$
A **convex cone** is additionally closed under addition:
$$
x, y \in K \implies x + y \in K.
$$
Combining the two: a convex cone is a set closed under all nonnegative linear combinations, $\alpha x + \beta y \in K$ whenever $x, y \in K$ and $\alpha, \beta \geq 0$.

For $K \subseteq V$, the **dual cone** collects the vectors $y$ whose pairing with every $x \in K$ is nonnegative:
$$
K^* = \{ y \in V : \langle y, x \rangle \geq 0 \text{ for all } x \in K \}.
$$
A comment on where $K^*$ actually lives. Without the inner product, the natural home of the dual cone is $V^*$: its elements are functionals, $\{\varphi \in V^* : \varphi(x) \geq 0 \text{ for all } x \in K\}$. The inner product supplies the Riesz map $\Phi: V \to V^*$ from Section 2.1, which lets us re-express each such functional $\varphi$ as $\varphi = \langle y, \cdot \rangle$ for a unique $y \in V$, and it is the collection of these $y$'s that we call $K^*$. So the dual cone is *properly* a subset of $V^*$, and we are viewing it inside $V$ only because a choice of inner product identifies the two.

Two properties come for free:

- $K^*$ is itself a convex cone: sums and nonnegative scalings of $y$'s preserve the "$\geq 0$" inequality.
- $K^*$ is closed: it's an intersection of closed halfspaces $\{y : \langle y, x \rangle \geq 0\}$, one per $x \in K$.

Even if $K$ itself is a bizarre non-closed non-convex mess, its dual is a closed convex cone.

**Examples.** With the standard inner product on $\mathbb{R}^n$:

- The nonnegative orthant $\mathbb{R}^n_+$ is **self-dual**: $y \cdot x \geq 0$ for all $x \geq 0$ iff $y \geq 0$.
- A single ray $K = \{\alpha v : \alpha \geq 0\}$ has dual $K^* = \{y : \langle y, v \rangle \geq 0\}$, a closed halfspace through the origin with inward normal $v$. Duality trades a "thin" cone for a "fat" one.
- The **positive semidefinite cone** $\mathrm{PSD}_n$ (symmetric $n \times n$ matrices $M \succeq 0$) is self-dual with respect to the trace inner product $\langle M, N \rangle = \mathrm{tr}(MN)$.

{% include visualization.html src="dual-cones.html" title="Dual cones: the universal inequality test, examples, and the bidual" %}

### 3.2 The bipolar theorem for cones

Take the dual twice — what comes back? Set $K^{**} = (K^*)^*$. The answer,
$$
K^{**} = \overline{\mathrm{cone}}(K),
$$
is the smallest closed convex cone containing $K$. In particular, $K^{**} = K$ **iff $K$ is already a closed convex cone**.

This is the second appearance of the Section 1.2 pattern: an object equals its bidual under the right regularity conditions. For cones, the right conditions are *closed and convex*.

### 3.3 Polar sets and support functions

The dual-cone construction leaned on the specific inequality "$\geq 0$", which fits cones because scaling $x$ by any nonnegative $\alpha$ keeps $x$ in $K$. For a general set $C$ (not stable under scaling), this inequality doesn't fit. If we want something dual to $C$, we need to bound the pairing not by $0$ but by some finite constant — with $1$ as a convenient normalisation:
$$
C^\circ = \{ y \in V : \langle y, x \rangle \leq 1 \text{ for all } x \in C \}.
$$
This is the **polar set** of $C$. The choice "$1$" is a normalisation; any positive constant produces the same construction up to scaling. The reason for bounding at *some* positive constant, rather than zero, is that we want the construction to be non-trivial when $0 \in C$ but $C$ is not a cone: a pure "$\leq 0$" bound would collapse to $\{0\}$ in that case.

- **Bipolar theorem.** $C^{\circ\circ}$ is the closed convex hull of $C \cup \{0\}$. So $C^{\circ\circ} = C$ **iff $C$ is closed, convex, and contains $0$**.

When $C$ is a cone, the polar reduces to the dual cone up to sign. To see this: if $C$ is a cone, then $x \in C$ implies $\alpha x \in C$ for all $\alpha \geq 0$. The condition "$\langle y, x \rangle \leq 1$ for every $x \in C$" then also demands "$\langle y, \alpha x \rangle \leq 1$ for every $\alpha \geq 0$", which — taking $\alpha \to +\infty$ — can only hold if $\langle y, x \rangle \leq 0$. So on cones, $C^\circ = \{y : \langle y, x \rangle \leq 0 \; \forall x \in C\} = -C^*$. Polar and dual cone are the same construction, differing only in the sign of the inequality.

Now the third face of the same coin. For any set $C \subseteq V$, the **support function** is
$$
\sigma_C(y) = \sup_{x \in C} \langle y, x \rangle.
$$
The Greek letter $\sigma$ stands for "support": geometrically, $\sigma_C(y)$ measures how far $C$ extends in the direction $y$. Two equivalent readings:

- $\sigma_C(y)$ is the maximum, over $x \in C$, of the projection of $x$ onto the direction $y$.
- $\sigma_C(y)$ is the smallest constant $c$ for which $C \subseteq \{ x : \langle y, x \rangle \leq c\}$: the tightest halfspace with normal $y$ that still contains $C$ has offset $c = \sigma_C(y)$.

{% include visualization.html src="support-function-set.html" title="The support function as the outermost level line in a fixed direction" %}

Properties, straight from the definition as a sup of linear functions:

- $\sigma_C$ is convex in $y$ (a sup of linear functions of $y$).
- $\sigma_C$ scales cleanly under nonnegative scalings of $y$: $\sigma_C(\alpha y) = \alpha\, \sigma_C(y)$ for $\alpha \geq 0$.
- For closed convex $C$, the support function determines $C$:
$$
C = \{ x : \langle y, x \rangle \leq \sigma_C(y) \; \forall y \}.
$$

So closed convex sets and their support functions are in one-to-one correspondence. The three constructions here — dual cone, polar set, support function — will unify in Section 4.6 as instances of the function-level operation we introduce next.

## 4. The convex conjugate

Everything above dualised a *space* or a *set*. What about a *function*? A function $f: V \to \mathbb{R}$ carries more information than a set — one value per point — so its dual has to carry more information back. The natural place for that dual to live is on $V^*$: for each linear functional $y \in V^*$, we ask how $f$ compares to the linear function $\langle y, \cdot \rangle$, and produce a scalar summarising the interaction. The output is itself a function, now on $V^*$.

The construction, called the **convex conjugate**, is
$$
f^*(y) = \sup_{x \in V} \bigl( \langle y, x \rangle - f(x) \bigr) \quad \text{for } y \in V^*,
$$
defined for extended-real-valued $f: V \to \mathbb{R} \cup \{+\infty\}$.

Restricted-domain functions fit into the same framework by extending them via $+\infty$ outside the domain: if the intended domain of $f$ is a subset $\mathcal{D} \subseteq V$, we set $f(x) = +\infty$ for $x \notin \mathcal{D}$. Points outside $\mathcal{D}$ then contribute $-\infty$ to the argument of the sup and are automatically excluded, so "$\sup$ over $x \in V$" equals "$\sup$ over $x \in \mathcal{D}$" with no additional bookkeeping.

### 4.1 The geometric picture

For a fixed $y$ and varying $x$, the quantity $\langle y, x \rangle - f(x)$ is the vertical gap between the linear function $x \mapsto \langle y, x \rangle$ (a hyperplane through the origin with slope $y$) and the graph of $f$. Taking the sup over $x$ finds the point where this gap is largest — where the linear function most exceeds $f$.

Working with $-f^*$ often makes the geometry cleaner. Because $\inf_x g(x) = -\sup_x(-g(x))$,
$$
-f^*(y) = \inf_x \bigl( f(x) - \langle y, x \rangle \bigr).
$$
This is the largest constant $c$ such that
$$
f(x) - \langle y, x \rangle \geq c \iff \langle y, x \rangle + c \leq f(x) \quad \text{for all } x.
$$
So $-f^*(y)$ is the intercept of the highest linear-plus-constant function with slope $y$ that fits under $f$. If no such linear-plus-constant function exists (because $\langle y, x \rangle$ eventually overtakes $f$ in some direction), $-f^*(y) = -\infty$, i.e., $f^*(y) = +\infty$.

{% include visualization.html src="maximum-gap.html" title="The convex conjugate as the maximum vertical gap and the required supporting-line shift" %}

### 4.2 Warm-up examples

**Purely linear.** $f(x) = 2x + 1$ on $\mathbb{R}$. When can $yx + c \leq 2x + 1$ hold for all $x$?

- If $y \neq 2$: the difference $(2 - y)x + 1 - c$ goes to $-\infty$ in one direction, so the inequality fails. Hence $f^*(y) = +\infty$.
- If $y = 2$: the inequality becomes $c \leq 1$. The largest feasible $c$ is $1$, giving $-f^*(2) = 1$, so $f^*(2) = -1$.

The conjugate of a linear function is $+\infty$ everywhere except at its slope, where it records (minus) the intercept.

**Piecewise linear.** Let $f(x) = \max(x, 2x)$, so $f(x) = x$ for $x \leq 0$ and $f(x) = 2x$ for $x \geq 0$. This is continuous and convex (a max of two linear functions). When does $yx + c \leq f(x)$ hold for all $x$?

- On $x \geq 0$: $yx + c \leq 2x$ requires $c \leq (2 - y)x$ for all $x \geq 0$. As $x \to +\infty$ this forces $y \leq 2$; setting $x = 0$ then forces $c \leq 0$.
- On $x \leq 0$: $yx + c \leq x$ requires $c \leq (1 - y)x$ for all $x \leq 0$. As $x \to -\infty$ this forces $y \geq 1$; setting $x = 0$ then forces $c \leq 0$.

So a linear-plus-constant function fits under $f$ iff $y \in [1, 2]$, and the tightest such function has $c = 0$ (touching $f$ at $x = 0$). Hence
$$
f^*(y) = \begin{cases} 0 & 1 \leq y \leq 2, \\ +\infty & \text{otherwise.} \end{cases}
$$
The conjugate is $0$ on the interval of slopes $f$ realises and $+\infty$ elsewhere — the first hint that sets (the interval $[1,2]$ here) and functions live in the same duality picture. We make this precise in Section 4.6.


**Quadratic.** $f(x) = \tfrac 1 2 x^2$ on $\mathbb{R}$. Then $f^*(y) = \sup_x (yx - \tfrac 1 2 x^2)$. Set the derivative in $x$ to zero: $y - x = 0$, so $x = y$, and $f^*(y) = y \cdot y - \tfrac 1 2 y^2 = \tfrac 1 2 y^2$. The quadratic is **self-conjugate** — the function-level analog of $L^2$ being self-dual.

More generally, $f(x) = \tfrac 1 2 \langle Ax, x \rangle$ with $A$ symmetric positive definite has $f^*(y) = \tfrac 1 2 \langle A^{-1} y, y \rangle$. The $A \to A^{-1}$ move mirrors the transpose from Section 1.3, but at a higher level: dual maps sent $A \to A^\top$ (level of linear operators), and conjugation of a quadratic sends $A \to A^{-1}$ (level of quadratic forms). Different objects, same rearrangement: read the pairing "from the other side".

### 4.3 The Fenchel–Young inequality

By definition of $f^*$ as a supremum,
$$
f^*(y) \geq \langle y, x \rangle - f(x) \quad \text{for all } x, y.
$$
Rearranging:
$$
f(x) + f^*(y) \geq \langle y, x \rangle. \qquad \text{(Fenchel–Young)}
$$
Equality is attained precisely at the $x$ where the sup in the definition of $f^*(y)$ is achieved. For differentiable convex $f$, differentiating $\langle y, x \rangle - f(x)$ in $x$ gives the condition $y = \nabla f(x)$. So:
$$
f(x) + f^*(y) = \langle y, x \rangle \iff y = \nabla f(x)
$$
when $f$ is differentiable. For general convex $f$, the condition becomes $y \in \partial f(x)$, where the **subdifferential** $\partial f(x)$ is the set of $y \in V^*$ such that
$$
f(x') \geq f(x) + \langle y, x' - x \rangle \quad \text{for all } x' \in V.
$$
$\partial f(x)$ is the set of slopes of linear-plus-constant functions that touch $f$ at $x$ from below. For smooth $f$ it collapses to $\{\nabla f(x)\}$; for a piecewise-linear $f$ at a corner it is an interval of slopes; for a smooth $f$ at a strict minimum it contains $0$.

{% include visualization.html src="fenchel-young-equality.html" title="Fenchel–Young equality as contact with the supporting line" %}

### 4.4 The Legendre transform

When $f$ is smooth and strictly convex, the definition of $f^*$ simplifies. The sup over $x$ in $\sup_x (\langle y, x \rangle - f(x))$ is attained where the derivative in $x$ vanishes: $\nabla f(x) = y$. Strict convexity means this equation has a unique solution — call it $x^\star_y$, the maximiser of $\langle y, \cdot \rangle - f$ — and $\nabla f$ is invertible on its range, giving
$$
x^\star_y = (\nabla f)^{-1}(y).
$$
Substituting back,
$$
f^*(y) = \langle y, x^\star_y \rangle - f(x^\star_y).
$$
This closed-form version is the classical **Legendre transform**. Whenever $f$ is smooth and strictly convex, the Legendre transform and the convex conjugate agree.

{% include visualization.html src="smooth-strictly-convex.html" title="The Legendre transform: select the unique maximizing input, locate it through the derivative, and record the conjugate value" %}

The general convex conjugate extends the Legendre transform beyond the smooth strictly convex case: replace "solve $\nabla f(x) = y$" with "take a supremum", and the operation stays well-defined for a much larger class of functions — including non-smooth, non-strictly-convex, and even non-convex $f$.

### 4.5 Properties, biconjugate, Fenchel–Moreau

**1. $f^*$ is always convex.** $f^*(y)$ is a sup, over $x$, of functions $y \mapsto \langle y, x \rangle - f(x)$ that are linear-plus-constant in $y$; a sup of convex functions is convex. Note this holds *for any* $f$ — convexity of $f$ is not needed for $f^*$ to be convex.

**2. $f^*$ is always lower semi-continuous (lsc).** "Lsc" means: for any sequence $y_n \to y$,
$$
f^*(y) \leq \liminf_{n \to \infty} f^*(y_n).
$$
Values can drop at limits but not jump up. The reason is structurally parallel to (1) but uses a different closure property of pointwise suprema: each function $y \mapsto \langle y, x \rangle - f(x)$ is not just convex, it is continuous in $y$; and a pointwise sup of continuous (in fact, of merely lsc) functions is always lsc. So convexity of $f^*$ comes from sup-preserves-convexity, and lower semi-continuity of $f^*$ comes from sup-preserves-lsc — same recipe, different closure property.

**3. The biconjugate satisfies $f^{**} \leq f$.** From Fenchel–Young,
$$
f(x) \geq \langle y, x \rangle - f^*(y) \quad \text{for all } y \implies f(x) \geq \sup_y \bigl( \langle y, x \rangle - f^*(y) \bigr) = f^{**}(x).
$$

**4. Fenchel–Moreau theorem.** $f^{**} = f$ under three conditions on $f$:

- $f$ is convex,
- $f$ is lsc,
- $f$ is **proper**. This means $f$ is not identically $+\infty$ (it takes at least one finite value) and $f > -\infty$ everywhere (it never plunges to $-\infty$). The name comes from ruling out the two degenerate ways a function to $\mathbb{R} \cup \{\pm\infty\}$ can fail to carry useful information: being infinite everywhere it's defined, or diverging downward.

The forward direction is immediate: $f^{**}$ is convex and lsc by (1) and (2), so if $f = f^{**}$ then $f$ is convex and lsc. The reverse is the content of the theorem; here is a sketch in three steps.

*Step 1 — unfold the biconjugate as a sup of affine minorants.* From the definitions,
$$
f^{**}(x) = \sup_y \bigl( \langle y, x \rangle - f^*(y) \bigr).
$$
For each $y$, $f^*(y)$ is the smallest constant $c$ (allowing $c = -\infty$) for which the affine function $x' \mapsto \langle y, x' \rangle - c$ sits below $f$ everywhere (Section 4.1). So $\langle y, x \rangle - f^*(y)$ is the value at $x$ of the *highest* affine function of slope $y$ that stays under $f$, and $f^{**}(x)$ is the sup, over all slopes $y$, of these values. In short: **$f^{**}(x)$ is the pointwise supremum, evaluated at $x$, of every affine minorant of $f$**.

*Step 2 — the easy inequality.* Every such affine minorant $\ell$ satisfies $\ell(x) \leq f(x)$ by definition, so taking the sup preserves the inequality: $f^{**}(x) \leq f(x)$. This much holds with no assumptions on $f$ — it is property 3 above, in geometric dress.

*Step 3 — where the three assumptions enter.* The reverse inequality $f^{**}(x) \geq f(x)$ needs, at each $x$, an affine minorant of $f$ whose value at $x$ approaches $f(x)$. The Hahn–Banach separation theorem, applied to the epigraph $\{(x', t) : t \geq f(x')\}$, produces such a minorant — provided the epigraph is nonempty (this is *proper*), is closed (this is *lsc*), and is convex (this is *convex*). All three assumptions are consumed at this single step.

**Interpretation.** Fenchel–Moreau is the fourth appearance of the same pattern — an object equals its bidual under the right regularity conditions. Collecting the four cases:

- **Vector spaces** (Section 1.2). *Condition:* $V$ is reflexive.
- **Cones** (Section 3.2). *Condition:* $K$ is closed and convex.
- **Sets containing $0$** (Section 3.3). *Condition:* $C$ is closed and convex.
- **Functions** (here). *Condition:* $f$ is convex, lsc, and proper.

The bidual construction always erases everything except what can be recovered by testing against the dual objects; the "regularity conditions" are exactly the ones needed to make sure nothing important is erased.

### 4.6 The bridge to convex sets: indicator and support functions

The **indicator function** in convex analysis (distinct from the $0/1$ indicator of probability theory) of a set $C \subseteq V$ is
$$
\delta_C(x) = \begin{cases} 0 & x \in C, \\ +\infty & x \notin C. \end{cases}
$$
The convention "$+\infty$ outside $C$" turns a set into a function: adding $\delta_C$ to any objective forces the argument to lie in $C$, since any $x \notin C$ gives infinite objective.

Its conjugate:
$$
\delta_C^*(y) = \sup_x \bigl( \langle y, x \rangle - \delta_C(x) \bigr) = \sup_{x \in C} \langle y, x \rangle = \sigma_C(y).
$$

**The convex conjugate of an indicator function is the support function.** So Section 3's "duality of sets" was never a separate story — it is what Section 4's "duality of functions" reduces to when the function is the indicator of a set. All the mechanism is inherited; only the input has less structure.

Reading the correspondence:

- The indicator $\delta_C$ **stores** the set $C$: takes value $0$ inside, $+\infty$ outside, and encodes nothing beyond membership.
- The support function $\sigma_C$ **measures** the set $C$: in each direction $y$, records how far $C$ extends.
- Convex conjugation is the mechanism that **crosses between the two representations**, turning "which points are in $C$?" into "how far in each direction?" and back.

Now the bipolar theorem falls out of Fenchel–Moreau by tracking a round trip. Start with a closed convex set $C$ containing $0$. Its indicator $\delta_C$ is proper (finite at $0$), convex, and lsc — all three hypotheses of Fenchel–Moreau. So $(\delta_C)^{**} = \delta_C$. Unfold the composition: the first conjugation gives $(\delta_C)^{*} = \sigma_C$, the second gives $(\sigma_C)^{*} = \delta_{C^{\circ\circ}}$ — which by Fenchel–Moreau equals $\delta_C$. Reading off the sets whose indicators these are: $C^{\circ\circ} = C$. The bipolar theorem is Fenchel–Moreau in disguise, and every "regularity" condition in Section 3 (closed, convex, contains $0$) is exactly what makes $\delta_C$ meet the three Fenchel–Moreau hypotheses.

## 5. Duality in optimisation

All the machinery of the last four sections comes together in constrained optimisation. A constrained problem can be cast as an inf-of-a-sup, and swapping the two produces a dual problem — often with more usable structure than the primal. Along the way: the dual map from Section 1.3 appears as a transpose in the Lagrangian; the convex conjugate from Section 4 gives closed-form dual functions; the indicator/support pairing from Section 4.6 encodes the constraint set.

### 5.1 Weak duality via the min–max inequality

The starting point is the elementary
$$
\inf_x \sup_y F(x, y) \geq \sup_y \inf_x F(x, y),
$$
true for *any* function $F$ of two variables. (Fix any $y_0$: $\sup_y F(x, y) \geq F(x, y_0)$; take inf over $x$: $\inf_x \sup_y F(x, y) \geq \inf_x F(x, y_0)$; sup over $y_0$ on the right.)

This one-line inequality is the source of *all* weak duality statements. The reverse inequality — $\inf \sup \leq \sup \inf$ — is *not* automatic; it requires structure (a saddle point, or convexity + a constraint qualification). When it holds, we have **strong duality**.

{% include visualization.html src="minimax-weak-duality.html" title="Weak duality, the two optimisation orders, and the conditions that close the gap" %}

The plan: cast a constrained optimisation problem as $\inf_x \sup_y F$ for a well-chosen $F$, and read off the dual as $\sup_y \inf_x F$.

### 5.2 The Lagrangian construction

Consider the primal
$$
\min_{x \in \mathcal{D}} f_0(x) \quad \text{s.t.} \quad f_i(x) \leq 0 \; (i = 1, \ldots, m), \; h_j(x) = 0 \; (j = 1, \ldots, p),
$$
with $f_0, f_i, h_j: \mathcal{D} \to \mathbb{R}$. Define the **Lagrangian**
$$
L(x, \lambda, \nu) = f_0(x) + \sum_i \lambda_i f_i(x) + \sum_j \nu_j h_j(x), \qquad \lambda \in \mathbb{R}^m_+, \; \nu \in \mathbb{R}^p.
$$
Package the multipliers into vectors $\lambda \in \mathbb{R}^m_+$ and $\nu \in \mathbb{R}^p$ — one component per constraint. Read the sums $\sum_i \lambda_i f_i(x)$ and $\sum_j \nu_j h_j(x)$ as the pairings $\langle \lambda, f(x) \rangle$ and $\langle \nu, h(x) \rangle$, where $f(x) = (f_1(x), \ldots, f_m(x)) \in \mathbb{R}^m$ collects the inequality-constraint values into a vector and $h(x)$ does the same for equalities. So each multiplier component pairs with the corresponding constraint value, and the pairing is a scalar penalty added to $f_0(x)$. The sign restriction $\lambda \geq 0$ (but no restriction on $\nu$) is not decorative: it is what makes the "Key observation" below work — the sup over $\lambda \geq 0$ diverges to $+\infty$ exactly when an *inequality* $f_i(x) \leq 0$ is violated (positive $\lambda_i$ against positive $f_i(x)$ can be blown up), while equalities need multipliers of either sign because $h_j(x) \neq 0$ can be violated in either direction.

**Key observation.** For fixed $x$,
$$
\sup_{\lambda \geq 0, \, \nu} L(x, \lambda, \nu) = \begin{cases} f_0(x) & x \text{ feasible}, \\ +\infty & x \text{ infeasible.} \end{cases}
$$

*Why.* If $f_i(x) > 0$ for some $i$, take $\lambda_i \to +\infty$: the sup is $+\infty$. If $h_j(x) \neq 0$, take $\nu_j \to \pm \infty$: the sup is $+\infty$. If $x$ is feasible, then $\lambda_i f_i(x) \leq 0$ (each term is non-positive since $\lambda_i \geq 0$ and $f_i(x) \leq 0$), so $\sup_{\lambda \geq 0} \sum_i \lambda_i f_i(x) = 0$, attained at $\lambda = 0$; and $\nu_j h_j(x) = 0$ regardless of $\nu_j$. The sup is $f_0(x)$.

Therefore
$$
\text{Primal value} = \inf_x \sup_{\lambda \geq 0, \nu} L(x, \lambda, \nu).
$$

Exchange the order of $\inf$ and $\sup$ to define the **dual function** and **dual problem**:
$$
g(\lambda, \nu) = \inf_x L(x, \lambda, \nu), \qquad \text{Dual value} = \sup_{\lambda \geq 0, \nu} g(\lambda, \nu).
$$
By the min–max inequality of Section 5.1, dual $\leq$ primal — **weak duality**, unconditionally.

### 5.3 Why the dual is always concave, and what "min becomes max" really means

Two structural facts fall out of the construction.

**The dual is always a maximisation.** Compare the two forms side by side:
$$
\text{primal:}\quad \inf_x \, \bigl[ \sup_{\lambda \geq 0, \nu} L(x, \lambda, \nu) \bigr], \qquad \text{dual:}\quad \sup_{\lambda \geq 0, \nu} \, \bigl[ \inf_x L(x, \lambda, \nu) \bigr].
$$
The $\sup_{\lambda \geq 0, \nu}$ is *the same operator* in both — it never turned into a min. What changed is only its *position*: in the primal it sits inside the outer $\inf_x$ and collapses to $f_0(x)$ at feasible $x$; in the dual it sits outside and is what we are maximising over. The common phrasing "the dual turns a min into a max" is a helpful summary but misleading in the mechanism: it is not that the operator flips, but that a supremum which was buried under an infimum is now the top-level operation.

**$g$ is concave in $(\lambda, \nu)$ regardless of anything else.** In two steps:

1. For each fixed $x$, the coefficients $f_i(x)$ and $h_j(x)$ are constants (they depend only on $x$, not on the multipliers), and $f_0(x)$ is a constant offset. So $L(x, \lambda, \nu) = f_0(x) + \sum_i \lambda_i f_i(x) + \sum_j \nu_j h_j(x)$ is *affine* in $(\lambda, \nu)$ — no matter how horrible $f_0, f_i, h_j$ are as functions of $x$.
2. $g(\lambda, \nu) = \inf_x L(x, \lambda, \nu)$ is a pointwise infimum, over $x$, of these affine-in-$(\lambda,\nu)$ functions. An infimum of affine functions is always concave (it is the mirror image of the "sup of affine is convex" that gave us convexity of $f^*$ in Section 4.5).

Two takeaways from this. First, the concavity of $g$ holds even if the primal is nonconvex — the primal's nonconvexity lives in *how the $f_i, h_j$ depend on $x$*, and step 2 sweeps that dependence away by taking the inf. Second, this is often *the point* of dualising: a nonconvex primal is generically intractable, but its dual is always a concave maximisation over a convex set — a problem a standard convex solver can attack, and one that gives a rigorous lower bound on the primal optimum.

### 5.4 Connecting to the convex conjugate

For primals whose constraint structure is linear, the dual function can be written down in closed form as a convex conjugate. Take the case
$$
\min_x f(x) \quad \text{s.t.} \quad Ax \leq b.
$$
Lagrangian: with $\lambda \geq 0$,
$$
L(x, \lambda) = f(x) + \lambda^\top(Ax - b) = f(x) + \langle A^\top \lambda,\, x \rangle - \langle \lambda, b \rangle.
$$
Compute the dual function:
$$
g(\lambda) = \inf_x L(x, \lambda) = -\sup_x \bigl( \langle -A^\top \lambda, x \rangle - f(x) \bigr) - \langle \lambda, b \rangle = -f^*(-A^\top \lambda) - \langle \lambda, b \rangle.
$$

The dual is
$$
\max_{\lambda \geq 0} \bigl( -f^*(-A^\top \lambda) - \langle \lambda, b \rangle \bigr).
$$

The convex conjugate is the "engine" that produces the closed-form dual, and the dual map $A^\top$ (Section 1.3) is exactly what should appear: $A$ sends the primal variable $x \in V$ forward to the constraint-value vector $Ax \in \mathbb{R}^m$, the multiplier $\lambda$ lives in the (self-)dual $\mathbb{R}^m$ of that constraint-value space, and $A^\top$ transports $\lambda$ backward to $V^*$ — where it can be paired with $x$ inside $f^*$. The transpose is doing exactly the job Section 1.3 introduced it to do.

For nonlinear constraint functions this closed-form compaction breaks — the terms don't line up as $x$-times-something — and one keeps the general Lagrangian expression.

### 5.5 Fenchel–Rockafellar duality

The cleanest general instance is the Fenchel–Rockafellar duality theorem. Consider
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

Add and cancel the $\langle y, Ax \rangle$ terms:
$$
f(x) + g(Ax) + f^*(-A^\top y) + g^*(y) \geq 0,
$$
i.e., $f(x) + g(Ax) \geq -f^*(-A^\top y) - g^*(y)$. Take $\inf$ over $x$ on the left, $\sup$ over $y$ on the right:
$$
\inf_x \bigl( f(x) + g(Ax) \bigr) \geq \sup_y \bigl( -f^*(-A^\top y) - g^*(y) \bigr).
$$

**Strong duality** (Fenchel–Rockafellar theorem, statement only): if $f, g$ are proper convex lsc and there exists $x \in \mathrm{relint}(\mathrm{dom}\, f)$ with $Ax \in \mathrm{relint}(\mathrm{dom}\, g)$, then equality holds and the dual sup is attained. Here $\mathrm{relint}(S)$ is the **relative interior** of $S$: the interior taken inside the affine hull of $S$ rather than the ambient space. The distinction matters whenever $\mathrm{dom}\, f$ is a lower-dimensional slice — a line segment inside $\mathbb{R}^2$, or an equality-constrained affine subspace — because its ordinary interior is empty while its relative interior is not. The existence of such an $x$ is the *constraint qualification*.

The linear-constraint case of Section 5.4 is Fenchel–Rockafellar with $g = \delta_{\{y \leq b\}}$, the indicator of a halfspace, whose conjugate is a support function.

### 5.6 Linear programming as a special case

The primal LP
$$
\min c^\top x \quad \text{s.t.} \quad Ax \geq b, \; x \geq 0
$$
has objective $f_0(x) = c^\top x$ and constraints $b - Ax \leq 0$ (an inequality) plus $x \geq 0$ (a domain restriction on $\mathcal{D} = \mathbb{R}^n_+$).

Lagrangian:
$$
L(x, y) = c^\top x + y^\top (b - Ax) = y^\top b + (c - A^\top y)^\top x,
$$
with $y \geq 0$ and $x \geq 0$ (from the domain).

Dual function:
$$
g(y) = \inf_{x \geq 0} L(x, y) = y^\top b + \inf_{x \geq 0} (c - A^\top y)^\top x.
$$
The inf of a linear function over $\mathbb{R}^n_+$ is $0$ if the coefficient vector has all components $\geq 0$ (attained at $x = 0$), and $-\infty$ otherwise (take one component to $+\infty$ along a coordinate where the coefficient is negative). So
$$
g(y) = \begin{cases} y^\top b & c - A^\top y \geq 0, \\ -\infty & \text{otherwise.} \end{cases}
$$
The dual problem is
$$
\max \; y^\top b \quad \text{s.t.} \quad A^\top y \leq c, \; y \geq 0.
$$
That is the standard-form LP dual — obtained mechanically from the Lagrangian construction.

Note the symmetry: primal minimises with "$\geq$" inequality constraints and "$\geq 0$" variables; dual maximises with "$\leq$" inequality constraints and "$\geq 0$" variables. The transpose $A^\top$ appears — no accident, since it *is* the dual map from Section 1.3.

### 5.7 KKT conditions and complementary slackness

At a primal optimum $x^*$ with dual optimum $(\lambda^*, \nu^*)$ and strong duality holding, we can extract necessary conditions — the **Karush–Kuhn–Tucker (KKT)** conditions:

1. **Stationarity.** $\nabla_x L(x^*, \lambda^*, \nu^*) = 0$: at $x^*$, the objective's gradient is balanced by weighted constraint gradients.
2. **Primal feasibility.** $f_i(x^*) \leq 0$, $h_j(x^*) = 0$.
3. **Dual feasibility.** $\lambda^*_i \geq 0$.
4. **Complementary slackness.** $\lambda^*_i f_i(x^*) = 0$ for all $i$.

The last condition is the Fenchel–Young equality in disguise. At a saddle point of $L$, the sup in $\sup_{\lambda \geq 0} \sum_i \lambda_i f_i(x^*)$ is attained; that sup equals $0$ (since $x^*$ is feasible), and each term $\lambda^*_i f_i(x^*)$ must be $0$: either $\lambda^*_i = 0$ (constraint inactive, dual is "slack") or $f_i(x^*) = 0$ (constraint active, primal is "slack"). Never both nonzero at the same $i$ — hence "complementary".

For convex problems with a suitable constraint qualification, the KKT conditions are also **sufficient** for optimality.

## 6. The cotangent space

One more setting where "dual space" appears naturally: on smooth manifolds, the tangent space at a point has a dual — the *cotangent space* — and one has to be careful about what "gradient" means in the absence of an inner product.

### 6.1 Tangent vectors

For a smooth manifold $M$ and a point $p \in M$, the **tangent space** $T_p M$ is the vector space of tangent vectors at $p$. A tangent vector at $p$ can be built in three equivalent ways:

- as an equivalence class of smooth curves $\gamma: (-\epsilon, \epsilon) \to M$ with $\gamma(0) = p$, two curves being equivalent when they have the same first-order behaviour in any chart;
- as a **derivation**: a linear map $D: C^\infty(M) \to \mathbb{R}$ satisfying the Leibniz rule $D(fg) = D(f)\, g(p) + f(p)\, D(g)$;
- in a chart with coordinates $x^1, \ldots, x^n$ around $p$, as an element of $\mathbb{R}^n$ (a tuple of coordinates in that chart), with basis vectors written $\partial_{x^i}|_p$.

The chart presentation identifies $T_p M$ with $\mathbb{R}^n$, but only after picking a chart — chart-dependent in the same way $V \cong V^*$ was basis-dependent in Section 1.

### 6.2 The differential of a function

For a smooth $f: M \to \mathbb{R}$, the **differential** $df|_p$ is a linear functional on $T_p M$:
$$
df|_p(v) = D_v f = \frac{d}{dt} f(\gamma(t)) \bigg|_{t=0}
$$
for any curve $\gamma$ with $\gamma(0) = p, \gamma'(0) = v$. In a chart with coordinates $x^1, \ldots, x^n$ around $p$ and $v = v^i \partial_{x^i}|_p$,
$$
df|_p(v) = \frac{\partial f}{\partial x^i}(p) \, v^i.
$$
So $df|_p$ is a linear functional on the tangent space — an element of the **cotangent space**
$$
T_p^* M = (T_p M)^*.
$$

The differential $df|_p$ needs only the smooth structure of $M$ and the function $f$. No inner product, no metric.

### 6.3 The gradient needs a metric

The **gradient** $\nabla f$ needs more. In $\mathbb{R}^n$ with the standard inner product, we *define* $\nabla f$ by
$$
\langle \nabla f, v \rangle = df(v) \quad \text{for all } v.
$$
So the gradient is $\Phi^{-1}(df)$, where $\Phi$ is the Riesz map of Section 2.1. The gradient is the differential *transported back to $T_p M$ via the Riesz map for a chosen inner product*.

Change the inner product, and the gradient changes — even though $df$ stays fixed. On a manifold without a Riemannian metric, "gradient" isn't defined, but "differential" is. On a Riemannian manifold with metric $g$, the gradient is $g^{-1}$ applied to $df$; in coordinates, $(\nabla f)^i = g^{ij}\, \partial_j f$.

### 6.4 Physical picture: momentum lives in the cotangent bundle

In classical mechanics on a configuration space $M$:

- Position $q \in M$.
- Velocity $\dot q \in T_q M$.
- Momentum $p \in T_q^* M$ — *not* in the tangent space.

Given a Lagrangian $L(q, \dot q)$, the **conjugate momentum** is
$$
p_i = \frac{\partial L}{\partial \dot q^i} \in T_q^* M.
$$
Momentum is a linear functional on velocities. The Hamiltonian formulation lives on the **cotangent bundle** $T^* M = \bigsqcup_q T_q^* M$; the Lagrangian formulation on the tangent bundle $TM$. The map $(q, \dot q) \mapsto (q, p)$ that connects the two is the Legendre transform of $L$ in its second argument — Section 4.4 lifted onto a manifold.

The dependence of momentum on the mass tensor (a Riemannian metric on configuration space, in the mechanical setting) plays the role of the Riesz map, converting between tangent and cotangent directions.

## 7. The recurring pattern

At each level, "the dual" was a **partner object** built from the original by asking a natural question of it and collecting the valid answers — evaluation, testing, minoration — with the pair carrying more information than either alone:

- Vector space $V$ → dual space $V^*$ (linear functionals).
- Vector space with inner product → $V^* \cong V$ (Riesz), giving adjoints.
- Cone $K$ → dual cone $K^*$ (functionals nonnegative on $K$).
- Convex set $C$ → polar $C^\circ$ and support function $\sigma_C$.
- Function $f$ → convex conjugate $f^*$.
- Tangent space $T_p M$ → cotangent space $T_p^* M$.

Each construction is idempotent-after-two-applications on the appropriate "good" class:

- $V \cong V^{**}$ for reflexive $V$.
- $K^{**} = K$ for closed convex cones $K$.
- $C^{\circ\circ} = C$ for closed convex $C$ containing $0$.
- $f^{**} = f$ for convex, lsc, proper $f$.

And the constructions inter-translate: indicator functions of sets have support functions as their conjugates; polar sets and dual cones differ only in the sign of the inequality; adjoint operators are transposes of matrices under the standard inner product. Once one operation is understood, the others are its projections onto different structural settings.
