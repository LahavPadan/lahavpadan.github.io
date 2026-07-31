# Gradient descent and Newton–Raphson from the ground up

Article contents

1. [Why iterate at all?](#sec-0)
2. [Deriving gradient descent from the linear approximation](#sec-1)
   1. [The direction that decreases $f$ the fastest](#the-direction-that-decreases-f-the-fastest)
   2. [The step size and the update rule](#the-step-size-and-the-update-rule)
   3. [What "converged" means: the fixed-point interpretation](#the-fixed-point-interpretation)
3. [Successive steps and exact line search](#sec-2)
   1. [The condition that pins down $\alpha_k$](#the-condition-that-pins-down-alpha)
   2. [The zig-zag trajectory: orthogonality of consecutive directions](#the-zig-zag-trajectory)
   3. [Dynamics in principal axes](#dynamics-in-principal-axes)
   4. [Whitening and the connection to Newton's method](#whitening)
4. [Newton–Raphson: the second-order picture](#sec-3)
   1. [Route 1 — minimise a local quadratic](#route-1-local-quadratic)
   2. [Route 2 — apply root-finding to $\nabla f = 0$](#route-2-root-finding)
   3. [Why the two routes give the same step](#why-the-two-routes-agree)
5. [Why the Hessian must be positive-definite](#sec-4)
   1. [Reason 1 — a local quadratic only has a minimum when its curvature is positive](#reason-1)
   2. [Reason 2 — the Newton step must actually go downhill](#reason-2)
   3. [What people do when the Hessian isn't positive-definite](#modified-newton)
6. [Quadratic convergence, from scratch](#sec-5)
   1. [Linear versus quadratic rate](#linear-versus-quadratic-rate)
   2. [Proof for the root-finding form](#proof-for-the-root-finding-form)
   3. [Specialising to the optimisation form](#specialising-to-the-optimisation-form)
   4. [What "close enough" actually requires](#what-close-enough-means)
7. [What Newton buys and what it costs](#sec-6)

---

## § 0 Why iterate at all? {#sec-0}

We want a point $\mathbf{x}^\star$ where a smooth function $f : \mathbb{R}^n \to \mathbb{R}$ attains a local minimum. From calculus, any interior local minimum satisfies

$$\nabla f(\mathbf{x}^\star) = \mathbf{0}. \tag{0.1}\label{eq:0-1}$$

In principle we could differentiate $f$ symbolically, set the gradient to zero, and solve. In practice, "solve" is where the plan breaks. Take

$$f(x) = e^{x^2} + x.$$

Differentiating is easy: $f'(x) = 2x e^{x^2} + 1$. Setting it to zero gives $2x e^{x^2} = -1$, a transcendental equation with no elementary closed-form solution. The problem is not that we cannot compute $f'$; it is that the resulting equation has no algebraic answer we can write down.

Iterative methods sidestep this. Instead of solving $\nabla f = \mathbf{0}$ in one shot, they produce a sequence $\mathbf{x}_0, \mathbf{x}_1, \mathbf{x}_2, \ldots$ built from *local* information about $f$ at the current point, arranged so the sequence approaches $\mathbf{x}^\star$. Two questions organise the rest: *what local information*, and *how do we use it to pick the next point*.

Using only $\nabla f$ at the current point gives gradient descent. Using $\nabla f$ together with the Hessian $H$ gives Newton–Raphson. The rest of the article works out both.

---

## § 1 Deriving gradient descent from the linear approximation {#sec-1}

Near a point $\mathbf{x}_k$, the first-order Taylor expansion is

$$f(\mathbf{x}_k + \Delta \mathbf{x}) \approx f(\mathbf{x}_k) + \nabla f(\mathbf{x}_k)^\top \Delta \mathbf{x}. \tag{1.1}\label{eq:1-1}$$

The right-hand side is a linear function of the displacement $\Delta \mathbf{x}$.

### The direction that decreases $f$ the fastest {#the-direction-that-decreases-f-the-fastest}

The change in $f$ predicted by \eqref{eq:1-1} is $\nabla f(\mathbf{x}_k)^\top \Delta \mathbf{x}$. We want this as negative as possible. Restricting to unit-length displacements, the Cauchy–Schwarz inequality bounds the inner product:

$$-\|\nabla f(\mathbf{x}_k)\| \; \leq \; \nabla f(\mathbf{x}_k)^\top \Delta \mathbf{x} \; \leq \; \|\nabla f(\mathbf{x}_k)\| \qquad \text{whenever } \|\Delta \mathbf{x}\| = 1,$$

with the lower bound attained exactly when

$$\Delta \mathbf{x} = -\frac{\nabla f(\mathbf{x}_k)}{\|\nabla f(\mathbf{x}_k)\|}.$$

The direction that makes the linear approximation decrease the fastest is opposite to the gradient — Cauchy–Schwarz is applied to the first-order Taylor expansion, nothing more.

### The step size and the update rule {#the-step-size-and-the-update-rule}

The linear approximation \eqref{eq:1-1} is only accurate near $\mathbf{x}_k$. Step too far and higher-order terms make the true $f$ rise where the linear model said it would fall. Taking the steepest-descent direction and scaling by a positive step size $\eta$ (the **learning rate**{:#defn-learning-rate}) gives

$$\mathbf{x}_{k+1} = \mathbf{x}_k - \eta \, \nabla f(\mathbf{x}_k). \tag{1.2}\label{eq:1-2}$$

The update \eqref{eq:1-2} uses the raw gradient $\nabla f(\mathbf{x}_k)$, not the unit vector $\nabla f(\mathbf{x}_k) / \|\nabla f(\mathbf{x}_k)\|$: the magnitude $\|\nabla f(\mathbf{x}_k)\|$ has been absorbed into $\eta$ instead of divided out, so $\eta$ is not a literal step *length*. The consequence is that the actual step size is $\eta \|\nabla f(\mathbf{x}_k)\|$, and as $\mathbf{x}_k$ approaches a critical point $\|\nabla f\| \to 0$; the step shrinks with it, without our having to schedule the decrease by hand.

### What "converged" means: the fixed-point interpretation {#the-fixed-point-interpretation}

Suppose $\{\mathbf{x}_k\}$ reaches a point $\mathbf{x}^\star$ that \eqref{eq:1-2} leaves invariant: $\mathbf{x}_{k+1} = \mathbf{x}_k = \mathbf{x}^\star$. Plugging into \eqref{eq:1-2},

$$\mathbf{x}^\star = \mathbf{x}^\star - \eta \, \nabla f(\mathbf{x}^\star) \;\; \Longrightarrow \;\; \nabla f(\mathbf{x}^\star) = \mathbf{0}. \tag{1.3}\label{eq:1-3}$$

A fixed point of the gradient-descent update is exactly a critical point of $f$: the algorithm searches for a point where its own update rule is inert.

Two things about \eqref{eq:1-3} matter for what comes next.

- $\nabla f(\mathbf{x}^\star) = \mathbf{0}$ is necessary for a minimum but not sufficient: saddle points and local maxima satisfy it too, and telling them apart needs the second derivative.
- Whether the iterates actually reach $\mathbf{x}^\star$, and how quickly, depends on $\eta$ and on the local curvature of $f$.

---

## § 2 Successive steps and exact line search {#sec-2}

One choice for the step size at iteration $k$ is the value that makes $f$ as small as possible along the current descent ray. Writing the step size at iteration $k$ as $\alpha_k$, **exact line search**{:#defn-exact-line-search} chooses $\alpha_k$ to minimise the one-dimensional function

$$\varphi(\alpha) = f\bigl(\mathbf{x}_k - \alpha \, \nabla f(\mathbf{x}_k)\bigr) \tag{2.1}\label{eq:2-1}$$

over $\alpha \geq 0$.

### The condition that pins down $\alpha_k$ {#the-condition-that-pins-down-alpha}

At the optimal $\alpha_k$, the derivative of $\varphi$ vanishes:

$$\left. \frac{d\varphi}{d\alpha} \right|_{\alpha = \alpha_k} = 0. \tag{2.2}\label{eq:2-2}$$

By the chain rule,

$$\frac{d\varphi}{d\alpha} = -\nabla f\bigl(\mathbf{x}_k - \alpha \, \nabla f(\mathbf{x}_k)\bigr)^\top \, \nabla f(\mathbf{x}_k).$$

Evaluating at $\alpha = \alpha_k$ and writing $\mathbf{x}_{k+1} = \mathbf{x}_k - \alpha_k \nabla f(\mathbf{x}_k)$,

$$\nabla f(\mathbf{x}_{k+1})^\top \, \nabla f(\mathbf{x}_k) = 0. \tag{2.3}\label{eq:2-3}$$

A closed-form expression for $\alpha_k$ follows from combining \eqref{eq:2-3} with the first-order Taylor expansion of $\nabla f$ around $\mathbf{x}_k$:

$$\nabla f(\mathbf{x}_{k+1}) \approx \nabla f(\mathbf{x}_k) + H(\mathbf{x}_k) (\mathbf{x}_{k+1} - \mathbf{x}_k) = \nabla f(\mathbf{x}_k) - \alpha_k H(\mathbf{x}_k) \, \nabla f(\mathbf{x}_k),$$

where $H = \nabla^2 f$ is the **Hessian**{:#defn-hessian} — the matrix of second partial derivatives. Taking the inner product of both sides with $\nabla f(\mathbf{x}_k)$ and applying \eqref{eq:2-3} to the left-hand side,

$$0 = \|\nabla f(\mathbf{x}_k)\|^2 - \alpha_k \, \nabla f(\mathbf{x}_k)^\top H(\mathbf{x}_k) \, \nabla f(\mathbf{x}_k),$$

which solves to

$$\alpha_k = \frac{\|\nabla f(\mathbf{x}_k)\|^2}{\nabla f(\mathbf{x}_k)^\top H(\mathbf{x}_k) \, \nabla f(\mathbf{x}_k)}. \tag{2.4}\label{eq:2-4}$$

For a quadratic $f$ this is exact; for a general smooth $f$, it is a one-step approximation whose accuracy improves as $\mathbf{x}_k$ approaches the minimum.

### The zig-zag trajectory: orthogonality of consecutive directions {#the-zig-zag-trajectory}

Equation \eqref{eq:2-3} is itself an orthogonality statement — consecutive gradients are perpendicular,

$$\nabla f(\mathbf{x}_{k+1}) \perp \nabla f(\mathbf{x}_k), \tag{2.5}\label{eq:2-5}$$

so under exact line search successive descent directions turn ninety degrees to the previous one. Geometrically the trajectory zig-zags: each step goes as far as it can along the current gradient, and the moment further motion in that direction would raise $f$, the next direction pivots away. That geometric picture is a symptom of something quantitative about the update, developed next.

### Dynamics in principal axes {#dynamics-in-principal-axes}

Near a local minimum $\mathbf{x}^\star$, the second-order Taylor expansion of $f$ gives

$$f(\mathbf{x}) \approx f(\mathbf{x}^\star) + \nabla f(\mathbf{x}^\star)^\top (\mathbf{x} - \mathbf{x}^\star) + \tfrac{1}{2} (\mathbf{x} - \mathbf{x}^\star)^\top H(\mathbf{x}^\star) (\mathbf{x} - \mathbf{x}^\star).$$

The first-order term vanishes by \eqref{eq:1-3}, and the remainder is $O(\|\mathbf{x} - \mathbf{x}^\star\|^3)$ for smooth $f$. So near the minimum,

$$f(\mathbf{x}) \approx f(\mathbf{x}^\star) + \tfrac{1}{2} (\mathbf{x} - \mathbf{x}^\star)^\top H \, (\mathbf{x} - \mathbf{x}^\star), \tag{2.6}\label{eq:2-6}$$

with $H = H(\mathbf{x}^\star)$ constant. The gradient of this quadratic model is

$$\nabla f(\mathbf{x}) \approx H \, (\mathbf{x} - \mathbf{x}^\star). \tag{2.7}\label{eq:2-7}$$

Substituting \eqref{eq:2-7} into the gradient-descent update \eqref{eq:1-2} and subtracting $\mathbf{x}^\star$ from both sides,

$$\mathbf{x}_{k+1} - \mathbf{x}^\star = (I - \eta H)(\mathbf{x}_k - \mathbf{x}^\star). \tag{2.8}\label{eq:2-8}$$

The error $\mathbf{e}_k = \mathbf{x}_k - \mathbf{x}^\star$ propagates by a single linear map $I - \eta H$, and the iteration decouples in the eigenbasis of $H$.

Diagonalise $H = Q \Lambda Q^\top$ with eigenvalues $\lambda_1, \ldots, \lambda_n$ along the diagonal of $\Lambda$. Assume they are all positive — the standard condition for $\mathbf{x}^\star$ to be a strict local minimum, and the condition Newton's iteration itself will require ([§ 4](#sec-4)). In the rotated coordinates $\tilde{\mathbf{e}}_k = Q^\top \mathbf{e}_k$ — the *principal axes* of the Hessian — the update \eqref{eq:2-8} becomes $n$ independent scalar recurrences

$$\tilde{e}_{k+1, \, i} = (1 - \eta \lambda_i) \, \tilde{e}_{k, \, i}, \qquad i = 1, \ldots, n. \tag{2.9}\label{eq:2-9}$$

The factor $1 - \eta \lambda_i$ controls axis $i$ completely, and three regimes fall out:

- **Monotone decrease** when $0 < \eta \lambda_i < 1$, i.e. $\eta < 1/\lambda_i$. The factor lies in $(0, 1)$ and the error along axis $i$ shrinks by the same positive fraction every step.
- **Oscillatory decrease — the zig-zag** when $1 < \eta \lambda_i < 2$, i.e. $1/\lambda_i < \eta < 2/\lambda_i$. The factor lies in $(-1, 0)$; the error along axis $i$ flips sign at every iteration while its magnitude continues to shrink. This is the geometric zig-zag from above, made quantitative.
- **Divergence** when $\eta \lambda_i > 2$. The factor has magnitude greater than $1$, so the error along axis $i$ alternates sign *and* grows without bound.

Convergence along every axis requires $\eta \lambda_i < 2$ for every $i$. To see what the $\lambda_i$ mean geometrically, parameterise the displacement along the $i$-th principal axis as $\mathbf{x} - \mathbf{x}^\star = t \, \mathbf{q}_i$, where $\mathbf{q}_i$ is the corresponding unit eigenvector and $t$ is the signed distance. Substituting into \eqref{eq:2-6} and using $H \mathbf{q}_i = \lambda_i \mathbf{q}_i$,

$$f(\mathbf{x}) - f(\mathbf{x}^\star) \approx \tfrac{1}{2} \, t^2 \, \mathbf{q}_i^\top H \mathbf{q}_i = \tfrac{1}{2} \lambda_i t^2,$$

so the second derivative in $t$ is exactly $\lambda_i$: the eigenvalue is the curvature along that axis, and $\lambda_{\max}$ is the steepest of them. That axis is the first to trigger divergence as $\eta$ grows, so a single $\eta$ that keeps every axis stable must satisfy

$$\eta < \frac{2}{\lambda_{\max}}. \tag{2.10}\label{eq:2-10}$$

Any $\eta$ satisfying \eqref{eq:2-10} is stable. The axis that converges *slowest* is the one with the smallest eigenvalue $\lambda_{\min}$: its contraction factor from \eqref{eq:2-9} is $|1 - \eta \lambda_{\min}|$, which we would like to push as small as possible. But $\eta$ is capped by \eqref{eq:2-10} at $2/\lambda_{\max}$. Substituting that ceiling into the slow-axis factor,

$$|1 - \eta \lambda_{\min}| \Big|_{\eta = 2/\lambda_{\max}} = \left| 1 - \frac{2 \lambda_{\min}}{\lambda_{\max}} \right| = 1 - \frac{2}{\kappa}, \qquad \kappa = \frac{\lambda_{\max}}{\lambda_{\min}}. \tag{2.11}\label{eq:2-11}$$

The ratio $\kappa$ is the **condition number**{:#defn-condition-number} of $H$. When $\kappa$ is large (the loss surface is elongated — the "long narrow valley" of every intuitive picture), $1 - 2/\kappa$ is close to $1$: \eqref{eq:2-11} says the contraction factor along the $\lambda_{\min}$ axis stays close to $1$ regardless of the $\eta$ we choose, and convergence in that direction is slow. Gradient descent's asymptotic rate is set by the ratio of the extreme curvatures, not by their individual values.

### Whitening and the connection to Newton's method {#whitening}

What hurts in \eqref{eq:2-11} is the *spread* between $\lambda_{\max}$ and $\lambda_{\min}$: if every $\lambda_i$ were equal, $\kappa$ would be $1$ and any $\eta < 2/\lambda$ would give the same contraction on every axis.

A change of coordinates can force this. Let

$$\mathbf{z} = H^{1/2} (\mathbf{x} - \mathbf{x}^\star),$$

where $H^{1/2}$ is the positive-definite square root of $H$ (well-defined since $H$'s eigenvalues are positive). In $\mathbf{z}$-coordinates the quadratic model \eqref{eq:2-6} becomes

$$f - f(\mathbf{x}^\star) \approx \tfrac{1}{2} \mathbf{z}^\top \mathbf{z} = \tfrac{1}{2} \|\mathbf{z}\|^2,$$

a spherical bowl. Its Hessian is $I$, whose eigenvalues are all $1$, so $\lambda_{\max} = \lambda_{\min} = 1$ and $\kappa = 1$; one step of gradient descent in $\mathbf{z}$-coordinates with $\eta = 1$ takes any $\mathbf{z}_k$ to zero. This coordinate change is called **whitening**{:#defn-whitening}: the axes of the quadratic bowl are rescaled until each has curvature $1$.

{% include visualization.html src="hessian-eigenbasis-gradient-descent.html" title="Gradient descent in the Hessian eigenbasis" %}

Whitening is not an algorithm we can run directly: computing $H^{1/2}$ requires $H$. But it tells us the shape of an update rule that beats the condition-number problem. Gradient descent multiplies $\nabla f$ by a single scalar $\eta$, treating every axis alike. To take gradient descent's one-step trip in whitened coordinates, the update in the original coordinates has to divide each axis's component of $\nabla f$ by that axis's own curvature $\lambda_i$: it has to multiply $\nabla f$ by $H^{-1}$, whose eigenvalues on the principal axes are exactly $1/\lambda_i$. [§ 3](#sec-3) derives that update from scratch.

---

## § 3 Newton–Raphson: the second-order picture {#sec-3}

[§ 2](#sec-2) argued from the condition-number bottleneck that the update we want should multiply $\nabla f$ by $H^{-1}$ rather than by a scalar. Two derivations produce that update from starting points that need no change of coordinates.

### Route 1 — minimise a local quadratic {#route-1-local-quadratic}

Extend the Taylor expansion of $f$ around $\mathbf{x}_k$ one more term:

$$f(\mathbf{x}_k + \Delta \mathbf{x}) \approx f(\mathbf{x}_k) + \nabla f(\mathbf{x}_k)^\top \Delta \mathbf{x} + \tfrac{1}{2} \Delta \mathbf{x}^\top H(\mathbf{x}_k) \Delta \mathbf{x}. \tag{3.1}\label{eq:3-1}$$

The right-hand side is a quadratic function of $\Delta \mathbf{x}$. Gradient descent used only the *linear* part of the same expansion and took a small step in the descent direction it prescribed; here we instead pick the $\Delta \mathbf{x}$ that minimises the whole quadratic model in one shot.

Set the gradient of \eqref{eq:3-1} with respect to $\Delta \mathbf{x}$ to zero:

$$\nabla f(\mathbf{x}_k) + H(\mathbf{x}_k) \, \Delta \mathbf{x} = \mathbf{0} \;\; \Longrightarrow \;\; \Delta \mathbf{x} = -H(\mathbf{x}_k)^{-1} \nabla f(\mathbf{x}_k). \tag{3.2}\label{eq:3-2}$$

Adding this $\Delta \mathbf{x}$ to $\mathbf{x}_k$,

$$\mathbf{x}_{k+1} = \mathbf{x}_k - H(\mathbf{x}_k)^{-1} \, \nabla f(\mathbf{x}_k). \tag{3.3}\label{eq:3-3}$$

Compared with the gradient-descent update \eqref{eq:1-2}: gradient descent multiplied $\nabla f$ by the scalar $\eta$; Newton multiplies it by the matrix $H^{-1}$. In the eigenbasis of $H$, $H^{-1}$ acts by $1/\lambda_i$ on the $i$-th axis: the component of the update along that axis gets divided by $\lambda_i$, the curvature there ([§ 2](#sec-2)).

{% include visualization.html src="newton-curvature-correction.html" title="Newton rescales the gradient by curvature" %}

That is exactly the rescaling whitening carried out in [§ 2](#sec-2), now folded into the step itself.

Whether the critical point of the quadratic model is actually a minimum depends on $H$, and that is [§ 4](#sec-4).

### Route 2 — apply root-finding to $\nabla f = 0$ {#route-2-root-finding}

For a scalar function $g$, a root is a point where $g(x) = 0$. Given a current guess $x_k$, the tangent line to $g$ at $x_k$ is $y = g(x_k) + g'(x_k)(x - x_k)$; setting $y = 0$ and solving for $x$ gives the tangent's crossing with the horizontal axis, and taking that as $x_{k+1}$,

$$x_{k+1} = x_k - \frac{g(x_k)}{g'(x_k)}. \tag{3.4}\label{eq:3-4}$$

{% include visualization.html src="newton-tangent-step.html" title="One Newton step as a tangent-root construction" %}

This is the Newton–Raphson iteration for **root finding**{:#defn-root-finding}: it solves $g = 0$, not "minimise $g$".

Minimising $f$ means finding a point where $\nabla f = \mathbf{0}$: a root-finding problem, with $\nabla f$ playing the role of $g$.

Applying \eqref{eq:3-4} with $g \mapsto \nabla f$ and $g' \mapsto \nabla(\nabla f) = H$, and generalising scalar division to matrix inversion,

$$\mathbf{x}_{k+1} = \mathbf{x}_k - H(\mathbf{x}_k)^{-1} \, \nabla f(\mathbf{x}_k). \tag{3.5}\label{eq:3-5}$$

### Why the two routes give the same step {#why-the-two-routes-agree}

\eqref{eq:3-3} and \eqref{eq:3-5} are the same iteration. Both routes end up solving the linear system $H \Delta \mathbf{x} = -\nabla f$: [Route 1](#route-1-local-quadratic) gets there by setting the gradient of the quadratic model to zero, [Route 2](#route-2-root-finding) by applying the tangent-line construction of \eqref{eq:3-4} to $\nabla f$ (with derivative $H$). Same linear system either way.

The name "Newton–Raphson" covers both root-finding and optimisation; the optimisation form is the root-finding form applied to $\nabla f$.

---

## § 4 Why the Hessian must be positive-definite {#sec-4}

[Route 1](#route-1-local-quadratic) called $\Delta \mathbf{x} = -H^{-1} \nabla f$ the minimiser of the quadratic model \eqref{eq:3-1} without checking whether the stationary point of that model is a minimum at all. Whether it is turns entirely on $H$.

A symmetric matrix $M$ is **positive-definite**{:#defn-positive-definite} when $\mathbf{v}^\top M \mathbf{v} > 0$ for every non-zero vector $\mathbf{v}$. Equivalently, every eigenvalue of $M$ is strictly positive.

The Newton step \eqref{eq:3-3} needs $H(\mathbf{x}_k)$ to be positive-definite for two independent reasons, both of which have to hold.

### Reason 1 — a local quadratic only has a minimum when its curvature is positive {#reason-1}

[Route 1](#route-1-local-quadratic) set the gradient of the quadratic model \eqref{eq:3-1} to zero and called the result the minimiser. A stationary point of a quadratic is a minimum only if the quadratic is bowl-shaped, though — and the shape is determined entirely by the eigenvalues of $H(\mathbf{x}_k)$:

- All eigenvalues positive ($H$ positive-definite): the quadratic is a bowl, its stationary point is the global minimum, and the Newton step \eqref{eq:3-3} points toward it.
- Mixed signs ($H$ indefinite): the stationary point is a *saddle*. Solving \eqref{eq:3-2} still gives a well-defined direction, but what \eqref{eq:3-3} jumps to is a saddle of the model, not a minimum.
- All eigenvalues negative ($H$ negative-definite): the quadratic is an upside-down bowl, its stationary point is the model's *maximum*, and the Newton step walks uphill on the model.

Only the first case is what [Route 1](#route-1-local-quadratic) was implicitly assuming. In the other two, the derivation is correct as *algebra* but wrong as *optimisation*: solving $H \Delta \mathbf{x} = -\nabla f$ does not do anything useful when the object $H$ describes has no minimum to begin with.

### Reason 2 — the Newton step must actually go downhill {#reason-2}

Even if we trust the model, we should check that the direction it produces makes $f$ (the real function, not the model) decrease. A direction $\mathbf{d}$ is a **descent direction**{:#defn-descent-direction} at $\mathbf{x}_k$ when the directional derivative of $f$ along it is negative:

$$\nabla f(\mathbf{x}_k)^\top \, \mathbf{d} < 0. \tag{4.1}\label{eq:4-1}$$

Substituting the Newton direction $\mathbf{d} = -H(\mathbf{x}_k)^{-1} \nabla f(\mathbf{x}_k)$ into \eqref{eq:4-1},

$$-\nabla f(\mathbf{x}_k)^\top \, H(\mathbf{x}_k)^{-1} \, \nabla f(\mathbf{x}_k) < 0,$$

which is equivalent to $\nabla f(\mathbf{x}_k)^\top \, H(\mathbf{x}_k)^{-1} \, \nabla f(\mathbf{x}_k) > 0$. That is exactly the statement that $H(\mathbf{x}_k)^{-1}$ is positive-definite.

For symmetric $H$ that is invertible, "$H^{-1}$ is positive-definite" and "$H$ is positive-definite" are the same statement — the eigenvalues of $H^{-1}$ are the reciprocals of those of $H$, and reciprocation preserves sign. Reason 2 returns the same condition as Reason 1 from a different starting point.

### What people do when the Hessian isn't positive-definite {#modified-newton}

Both reasons above are conditions on the *actual* Hessian at $\mathbf{x}_k$, not on some idealised version of it. Far from the minimum, real Hessians of real problems are often not positive-definite. Two families of fixes address this.

The first replaces $H(\mathbf{x}_k)$ with the nearest positive-definite matrix in some sense — for example, adding a multiple of the identity, $H + \lambda I$ with $\lambda$ large enough to shift the eigenvalues into positive territory. When $\lambda \to \infty$ the step reduces to a small gradient-descent step; when $\lambda \to 0$ it is the pure Newton step. This is the idea behind Levenberg–Marquardt-type methods.

The second family restricts the *length* of the Newton step: define a trust region around $\mathbf{x}_k$ inside which the quadratic model is trusted, and minimise the model within that region rather than globally. When the model is well-behaved, the step is the Newton step; when it isn't, the constraint kicks in and produces something safer.

Both families exist because pure Newton, as written in \eqref{eq:3-3}, is a tool for a specific regime — the one we describe precisely next.

---

## § 5 Quadratic convergence, from scratch {#sec-5}

The reason to pay the cost of the Hessian is that Newton converges *fast* once it is near the answer.

### Linear versus quadratic rate {#linear-versus-quadratic-rate}

Let $e_k = |x_k - x^\star|$ denote the error at step $k$ (scalar case first; the vector case works the same way with norms).

The iteration converges **linearly**{:#defn-linear-rate} if there is a constant $c \in (0, 1)$ with

$$e_{k+1} \leq c \, e_k. \tag{5.1}\label{eq:5-1}$$

The error shrinks by a fixed fraction per step. The number of correct digits grows by a constant per iteration.

It converges **quadratically**{:#defn-quadratic-rate} if there is a constant $C > 0$ with

$$e_{k+1} \leq C \, e_k^2. \tag{5.2}\label{eq:5-2}$$

Once $e_k$ is small (say $C \, e_k \leq \tfrac{1}{2}$), each iteration roughly doubles the number of correct digits. From four correct digits to eight, from eight to sixteen, and so on. This is why Newton is worth its cost when it works (the doubling follows from \eqref{eq:5-6}, the concrete form of \eqref{eq:5-2} derived below).

Gradient descent on a strongly convex function with a well-chosen step size achieves \eqref{eq:5-1}. Newton, near a well-behaved minimum, achieves \eqref{eq:5-2}.

### Proof for the root-finding form {#proof-for-the-root-finding-form}

<div class="guided-fold-start" data-label="Full derivation" data-tone="derivation"></div>

Let $g$ be twice continuously differentiable and let $x^\star$ be a root of $g$ with $g'(x^\star) \neq 0$. We show that Newton's iteration \eqref{eq:3-4} applied to $g$ converges quadratically once $x_k$ is near $x^\star$. [§ 3, Route 2](#route-2-root-finding) showed that Newton for optimisation is the same iteration \eqref{eq:3-4} applied to $g = \nabla f$, so this scalar root-finding case is what has to be proved.

Taylor expand $g$ around $x^\star$ to second order, with the second-order remainder evaluated at some point $\xi_k$ between $x_k$ and $x^\star$:

$$g(x_k) = g(x^\star) + g'(x^\star)(x_k - x^\star) + \tfrac{1}{2} g''(\xi_k) (x_k - x^\star)^2.$$

Since $g(x^\star) = 0$,

$$g(x_k) = g'(x^\star)(x_k - x^\star) + \tfrac{1}{2} g''(\xi_k) (x_k - x^\star)^2. \tag{5.3}\label{eq:5-3}$$

Subtract $x^\star$ from both sides of $x_{k+1} = x_k - g(x_k)/g'(x_k)$ (the Newton iteration \eqref{eq:3-4}) and rearrange:

$$x_{k+1} - x^\star = (x_k - x^\star) - \frac{g(x_k)}{g'(x_k)} = \frac{g'(x_k)(x_k - x^\star) - g(x_k)}{g'(x_k)}. \tag{5.4}\label{eq:5-4}$$

Substitute \eqref{eq:5-3} into the numerator:

$$g'(x_k)(x_k - x^\star) - g(x_k) = \bigl[ g'(x_k) - g'(x^\star) \bigr] (x_k - x^\star) - \tfrac{1}{2} g''(\xi_k) (x_k - x^\star)^2.$$

Expand $g'(x_k)$ around $x^\star$ to first order: $g'(x_k) = g'(x^\star) + g''(\eta_k)(x_k - x^\star)$ for some $\eta_k$ between $x_k$ and $x^\star$. Substituting into the first bracket gives $[g'(x_k) - g'(x^\star)](x_k - x^\star) = g''(\eta_k)(x_k - x^\star)^2$, and combining with the second-order remainder from \eqref{eq:5-3}, the numerator becomes

$$\bigl[ g''(\eta_k) - \tfrac{1}{2} g''(\xi_k) \bigr] (x_k - x^\star)^2.$$

Both terms are of order $(x_k - x^\star)^2$, and the combined coefficient is bounded by the largest value $|g''|$ takes near $x^\star$.

Dividing \eqref{eq:5-4} by $g'(x_k)$ and taking absolute values,

$$|x_{k+1} - x^\star| \leq \frac{M}{|g'(x_k)|} \, |x_k - x^\star|^2, \tag{5.5}\label{eq:5-5}$$

where $M$ is a bound on $|g''|$ near $x^\star$. Once $x_k$ is close enough that $g'(x_k)$ is bounded away from zero (which holds by continuity, since $g'(x^\star) \neq 0$), the coefficient $M / |g'(x_k)|$ is bounded above by some constant $C$, and

$$|x_{k+1} - x^\star| \leq C \, |x_k - x^\star|^2. \tag{5.6}\label{eq:5-6}$$

This is \eqref{eq:5-2}. Quadratic convergence.

<div class="guided-fold-end"></div>

### Specialising to the optimisation form {#specialising-to-the-optimisation-form}

Taking $g = f'$ substitutes $|f''(x^\star)|$ for $|g'(x^\star)|$ (the Hessian at the minimum, positive-definite by [§ 4](#sec-4)) and $|f'''(\xi_k)|$ for $|g''(\xi_k)|$ in \eqref{eq:5-6}:

$$|x_{k+1} - x^\star| \leq \frac{|f'''(\xi_k)|}{2 \, |f''(x^\star)|} \, |x_k - x^\star|^2. \tag{5.7}\label{eq:5-7}$$

The multivariate version puts a bound on the third-derivative tensor in the numerator and the smallest eigenvalue of $H(\mathbf{x}^\star)$ in the denominator; the shape is unchanged.

### What "close enough" actually requires {#what-close-enough-means}

Bound \eqref{eq:5-6} is conditional: it holds once $x_k$ is inside a neighbourhood of $x^\star$ on which

1. $g'$ stays away from zero (so we can invert it), and
2. $|g''|$ is bounded (so the constant $M$ makes sense).

The largest such neighbourhood is the **basin of attraction** of $x^\star$: iterates that start inside it converge quadratically to $x^\star$, and iterates that start outside can end up at a different root or off to infinity, since the tangent line at $x_k$ knows nothing about which root we want.

The modifications in [§ 4](#sec-4) exist partly to force iterates into the basin before switching to pure Newton.

---

## § 6 What Newton buys and what it costs {#sec-6}

Gradient descent uses only $\nabla f$, so each step costs the price of one gradient evaluation — for a problem with $n$ variables, that is $O(n)$ storage and, for typical objectives, $O(n)$ work per component. Its convergence is linear when it converges, meaning the number of iterations to reach accuracy $\varepsilon$ scales like $\log(1/\varepsilon)$ multiplied by a constant that depends on the condition number $\kappa$ of $H$ at the minimum ([§ 2](#sec-2)). On badly-conditioned problems that constant is enormous, and the zig-zag pattern from [§ 2](#sec-2) is what causes it.

Newton uses $\nabla f$ *and* $H$. Storing $H$ costs $O(n^2)$; solving the linear system $H \mathbf{d} = -\nabla f$ at each step costs $O(n^3)$ by direct methods. In return, the number of iterations near the minimum is not $\log(1/\varepsilon)$ but $\log\log(1/\varepsilon)$, a much smaller number in practice, because each iteration approximately doubles the number of correct digits.

The break-even question is whether the smaller iteration count pays for the higher per-iteration cost. For small $n$, or for problems where $H$ has exploitable structure (sparse, block-diagonal, low-rank), Newton wins. For very large $n$ with no structure, the $O(n^2)$ storage alone is prohibitive, and the Newton step's inner linear solve is where the running time goes.

That gap is where two families of intermediate methods live. *Quasi-Newton* methods maintain a running approximation to $H^{-1}$ that is updated cheaply from successive gradients; the best-known members are BFGS (Broyden–Fletcher–Goldfarb–Shanno) and its limited-memory variant L-BFGS, which stores only the last few gradient differences instead of the full inverse Hessian. *Conjugate gradient* methods pick descent directions that account for previous ones, so the zig-zag from [§ 2](#sec-2) does not happen, without ever forming $H$ explicitly.

Both families sit between the two endpoints derived here — using more information than gradient descent but less than full Newton — and both are worth their own treatment.
