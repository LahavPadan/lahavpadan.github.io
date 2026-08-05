## Polarization

**An electromagnetic wave has an electric field, and that field has a direction.**

The direction can be **constant**, **rotating**, or **something in between**.

The three cases go by the names **linear**, **circular**, and **elliptical** polarization. Which one occurs affects **how power couples from the wave into a receiver**, **how the instantaneous energy flux behaves within a single wave cycle**, and **whether the wave carries angular momentum in addition to linear momentum**.

> **All three cases, and everything that distinguishes them, follow from one algebraic fact about the way the electric field is allowed to fluctuate in a plane wave.**

## § 1. Why the E-field lives in a plane {#sec-1}

Take a plane wave propagating along $\hat z$ in vacuum, so all fields depend on $z$ and $t$ only through the plane-wave factor $e^{i(kz-\omega t)}$.

Two of the source-free Maxwell equations are

$$\nabla \cdot \vec E = 0, \label{eq:1-1}\tag{1.1}$$

$$\nabla \times \vec E = -\partial_t \vec B. \label{eq:1-2}\tag{1.2}$$

For $\vec E = \vec E_0\, e^{i(kz - \omega t)}$, $\eqref{eq:1-1}$ reads $ik(\hat z \cdot \vec E_0) = 0$, which forces $\hat z \cdot \vec E_0 = 0$.

**The electric field has no component along the direction of propagation; it lives entirely in the plane the wave traverses, spanned by $\hat x$ and $\hat y$.**

The same argument applied on $\nabla \cdot \vec B = 0$ gives $\hat z \cdot \vec B_0 = 0$, and $\eqref{eq:1-2}$ then fixes $\vec B_0$ perpendicular to $\vec E_0$ within that plane.

**And so, we can focus on analyzing $\vec E$, and $\vec B$ will follow.**

Because the plane the wave traverses is two-dimensional, the most general electric field for a wave of one frequency is

$$\vec E(z, t) = \left( E_x\, \hat x + E_y\, \hat y \right) e^{i(kz - \omega t)}, \label{eq:1-3}\tag{1.3}$$

parameterized by two amplitudes $E_x$ and $E_y$, each carrying its own magnitude and phase.

Two features of $(E_x, E_y)$ are pure choices, in the sense that changing them leaves the shape traced by the tip of $\vec E$ unchanged:

- **Overall scale.** Multiplying both $E_x$ and $E_y$ by a common real factor $\alpha$ scales the whole field by $\alpha$: the intensity $|\vec E|^2$ scales by $\alpha^2$, but the tip traces a curve of the same shape, just $\alpha$ times bigger.

- **Overall phase.** Multiplying both by a common phase factor $e^{i\theta_0}$ replaces $(kz - \omega t)$ with $(kz - \omega t + \theta_0) = kz - \omega\!\left(t - \theta_0/\omega\right)$:

    the original expression with the time coordinate relabelled $t \to t - \theta_0/\omega$.

    **The same curve, traced from a different starting point at $t = 0$.**

> **What survives both is the ratio $E_y/E_x$.** *Polarization* is the shape of the curve traced by the tip of $\vec E$ in the plane the wave traverses, and this ratio captures it completely.

Split the ratio into its magnitude and phase: an amplitude ratio $|E_y|/|E_x|$ and a relative phase $\varphi = \arg(E_y) - \arg(E_x)$.

**These are the two knobs**, and different combinations of them produce the three cases.

## § 2. Reading the three cases from the parameterization {#sec-2}

Take $E_x, E_y \ge 0$ real and $\varphi$ the relative phase between them, and take the physical field to be the real part of $\eqref{eq:1-3}$.

At fixed $z$ (say $z = 0$),

$$\vec E(t) = E_x \cos(\omega t)\, \hat x + E_y \cos(\omega t - \varphi)\, \hat y. \label{eq:2-1}\tag{2.1}$$

The tip of $\vec E(t)$ traces some curve in the $xy$-plane as $t$ varies. **What curve?**

- **Linear ($\varphi = 0$ or $\pi$).** Both components are proportional to $\cos(\omega t)$, up to a possible sign (for $\varphi = \pi$).

    The tip moves along a fixed line through the origin — the line making angle $\arctan(E_y/E_x)$ with the $x$-axis.

    **The electric field oscillates back and forth along a single direction.**

- **Circular ($\varphi = \pm\pi/2$ and $E_x = E_y$).** Taking $\varphi = \pi/2$ and $E_x = E_y = E$, the $x$-component is $E\cos(\omega t)$ and the $y$-component is $E\cos(\omega t - \pi/2) = E\sin(\omega t)$.

    The tip sits at $(E\cos\omega t, E\sin\omega t)$: a circle of radius $E$ traced at angular rate $\omega$, in the direction fixed by the sign of $\varphi$.

    **The electric field rotates.**

- **Elliptical (everything else).** For arbitrary $E_x, E_y, \varphi$, the tip traces an ellipse in the $xy$-plane, with the linear and circular cases as limits.

    The ellipse's axes are in general not aligned with $\hat x$ and $\hat y$; the tilt angle $\theta_e$ from $\hat x$ to the major axis is a joint function of both parameters, specifically

    $$\tan(2\theta_e) = \frac{2 E_x E_y \cos\varphi}{E_x^2 - E_y^2}. \label{eq:2-2}\tag{2.2}$$

    The ratio of the semi-major to semi-minor axis is called the **axial ratio**.

## § 3. What a linear receiver measures {#sec-3}

A linear antenna or polarizer aligned with unit vector $\hat a$ in the plane the wave traverses responds *as* the projection $\hat a \cdot \vec E(t)$; its output signal is proportional to that projection and the delivered power to its square, averaged over one wave cycle.

- **Linear polarization.** For $\vec E(t) = A\cos(\omega t)\, \hat p$ (with $\hat p$ the polarization direction and $A$ the amplitude), the projection is

    $$\hat a \cdot \vec E(t) = A(\hat a \cdot \hat p)\cos(\omega t) = A\cos\theta\cos(\omega t), \label{eq:3-1}\tag{3.1}$$

    where $\theta$ is the angle between the receiver and the polarization. Time-averaging $\cos^2(\omega t)$ to $\tfrac{1}{2}$ gives

    $$P_\text{received} \propto A^2 \cos^2\theta. \label{eq:3-2}\tag{3.2}$$

    **Misalign by 90° and nothing is picked up.**

    The receiver reads only the component of $\vec E$ along its own orientation, and the received power depends quadratically on that alignment.

- **Circular polarization.** For $\vec E(t) = A[\cos(\omega t)\, \hat x + \sin(\omega t)\, \hat y]$, projecting onto $\hat a = \cos\alpha\, \hat x + \sin\alpha\, \hat y$ gives

    $$\hat a \cdot \vec E(t) = A[\cos\alpha\cos(\omega t) + \sin\alpha\sin(\omega t)] = A\cos(\omega t - \alpha). \label{eq:3-3}\tag{3.3}$$

    **The projection is a sinusoid of amplitude $A$ regardless of the receiver's orientation $\alpha$; only the phase depends on $\alpha$.**

    **The time-averaged received power is $A^2/2$, independent of $\alpha$: any linear receiver at any orientation in the plane the wave traverses picks up the same average power.**

> This is the **rotational immunity** of circular polarization, and it has a clean physical reading.
>
> The wave's E-vector spends equal time pointing in every direction in the plane the wave traverses; a receiver that projects onto any fixed direction gets, on average, the same fraction of the intensity regardless of which direction it points at.

- **The elliptical case gives partial rotational immunity.** Aligning with the ellipse's major axis picks up more power than aligning with the minor axis; the ratio between the two is set by the axial ratio.

> Linear is maximally rotation-sensitive, circular is fully isotropic, elliptical interpolates.

**This is why polarization-agnostic radio links — satellite-to-ground communication, for example — use circular polarization:** rotation of the receiver antenna leaves the coupling unchanged.

## § 4. What the wave is doing to its energy flux {#sec-4}

The instantaneous energy flux of an electromagnetic wave is the Poynting vector

$$\vec S = \vec E \times \vec H, \label{eq:4-1}\tag{4.1}$$

with $\vec H = \vec B/\mu_0$ in vacuum.

Its magnitude reads $|\vec E|^2$ up to constants, since a plane wave in vacuum has $|\vec B| = |\vec E|/c$; specifically, $|\vec S| = \varepsilon_0 c\, |\vec E(t)|^2$.

- **Linear polarization.** $|\vec E(t)|^2 = A^2 \cos^2(\omega t) = \tfrac{1}{2}A^2[1 + \cos(2\omega t)]$.

    The instantaneous flux oscillates at twice the wave frequency, between $\varepsilon_0 c A^2$ and zero.

    **Only the time-average of the flux is constant.**

- **Circular polarization.** $|\vec E(t)|^2 = A^2\cos^2(\omega t) + A^2\sin^2(\omega t) = A^2$, a constant.

    **The instantaneous energy flux does not oscillate at all: at every moment the wave delivers the same amount of energy per unit area per unit time.**

The reason $|\vec E(t)|^2$ is constant for circular polarization is that the two orthogonal linear components carry the wave's energy in **quadrature** — when one is at its maximum the other is at zero, and vice versa.

The Pythagorean identity $\cos^2 + \sin^2 = 1$ is the algebraic form of that statement.

The elliptical case sits between these two: $|\vec E(t)|^2 = E_x^2\cos^2(\omega t) + E_y^2\cos^2(\omega t - \varphi)$, which oscillates at $2\omega$ with a smaller amplitude than the linear case would give for the same average intensity.

That $2\omega$ amplitude shrinks toward zero as the polarization approaches circular.

**The axial ratio controls it just as it controls the rotation-sensitivity of [§ 3](#sec-3).**

> **Constant energy flux is one physical marker of circular polarization; the other, and the sharper one, is that the wave carries angular momentum. That is what the rotating E-vector really means.**

## § 5. Linear and angular momentum {#sec-5}

Every wave carries energy and linear momentum; a circularly polarized wave carries angular momentum on top of that.

What each does to a target reflects this: linearly polarized light shakes the target's charges back and forth along one direction, transferring linear momentum only; circularly polarized light drags them around a circle, transferring both linear and angular momentum.

**What matters physically is the *rate* at which each is delivered.**

Write linear momentum as $\vec p$ and angular momentum as $\vec L$.

**Their transfer rates are the force and the torque:**

$$\vec F = \frac{d\vec p}{dt}, \qquad \vec\tau = \frac{d\vec L}{dt}. \label{eq:5-1}\tag{5.1}$$

For both linear and angular momentum, the same three-step chain relates what the wave carries to what a receiver picks up:

- **Density.** The wave carries the momentum (linear or angular) at some density per unit volume.

- **Rate.** Because the wave moves along $\hat z$ at speed $c$, in time $\Delta t$ everything in a volume $A\,c\,\Delta t$ crosses a fixed cross-section of area $A$ perpendicular to $\hat z$. So the momentum rate crossing that cross-section is (momentum density) $\times c \times A$.

- **Newton.** If the target absorbs the wave completely, momentum conservation forces everything crossing the cross-section into the target: the momentum rate crossing equals the rate at which the target gains momentum. By $\eqref{eq:5-1}$, that is the force (for $\vec p$) or the torque (for $\vec L$) on the target.

> **The density is the only piece that differs between linear and angular momentum. In both cases it follows from the wave's energy density.**

### Energy per unit volume

{% include visualization.html src="polarization-energy-momentum-transfer.html" title="From polarized-field energy to force and torque on a target" %}

Take a length of the beam of cross-sectional area $A$. In time $\Delta t$, the energy that crosses a fixed cross-section is

$$U = P\,\Delta t, \label{eq:5-2}\tag{5.2}$$

where $P = |\vec S|\,A$; since $|\vec S|$ is the energy flux (power per unit area, by the definition $\eqref{eq:4-1}$ of $\vec S$).

This energy travels at speed $c$, so at any instant it occupies a volume $A\,c\,\Delta t$.

Therefore, the energy per unit volume is:

$$\frac{U}{A c \Delta t} = \frac{|\vec S|}{c}. \label{eq:5-3}\tag{5.3}$$

**Both densities in the chain above will follow from $\eqref{eq:5-3}$.**

### Linear momentum

**Why should the momentum per unit volume be $1/c$ times the energy density?**

Take a charge $q$ in the target the wave hits. The Lorentz force on it is $q(\vec E + \vec v \times \vec B)$, so both fields drive it in principle.

Using $|\vec B| = |\vec E|/c$ for a plane wave, the magnetic contribution is smaller than the electric one by a factor of order

$$\frac{|\vec v \times \vec B|}{|\vec E|} \sim \frac{v\,|\vec B|}{|\vec E|} = \frac{v}{c}. $$

For non-relativistic motion this is small.

To leading order the electric part alone sets the charge's motion, and its velocity $\vec v$ tracks $\vec E$:

$$\vec v \parallel \vec E.$$

But $\vec E$ lies in the plane the wave traverses (from [§ 1](#sec-1)), so $q\vec E$ points transversely and contributes zero momentum along $\hat z$.

All of the forward momentum comes from the small magnetic term $q\vec v \times \vec B$.

Since $\vec E$ and $\vec B$ are perpendicular within the plane the wave traverses and $\vec v \parallel \vec E$, the cross product $\vec v \times \vec B$ points along $\hat z$ — along the wave's motion.

So the charge picks up momentum along $\hat z$.

Comparing the rate at which it picks up momentum to the rate at which it picks up energy fixes the density ratio:

- **Rate of energy delivery:** $q\,\vec v \cdot \vec E$.

- **Rate of momentum delivery along $\hat z$:** $|q\vec v \times \vec B| = q\,|\vec v|\,|\vec B|$, using $\vec v \perp \vec B$ (which follows from $\vec v \parallel \vec E$ and $\vec E \perp \vec B$).

Their ratio,

$$\frac{q\,|\vec v|\,|\vec B|}{q\,\vec v \cdot \vec E} = \frac{|\vec B|}{|\vec E|} = \frac{1}{c}, \label{eq:5-4}\tag{5.4}$$

uses $|\vec B| = |\vec E|/c$ for a plane wave.

So the charge picks up momentum along $\hat z$ at $1/c$ times the rate it picks up energy.

Whatever ratio is delivered has to be the ratio the wave was carrying — otherwise energy would keep accumulating without momentum, or the reverse.

**Hence**

$$\text{linear momentum per unit volume} = \frac{|\vec S|}{c^2}, \label{eq:5-5}\tag{5.5}$$

directed along $\hat z$ (from [§ 1](#sec-1), $\vec S = \vec E \times \vec H$ lies along $\hat z$).

Feeding $\eqref{eq:5-5}$ into the density-rate-Newton chain — multiply the momentum density by $c \cdot A$ to get the momentum rate through a cross-section, and identify that rate with $\vec F$ via $\eqref{eq:5-1}$ — gives

$$\vec F = \frac{|\vec S|}{c^2}\cdot c \cdot A\,\hat z = \frac{|\vec S|\,A}{c}\,\hat z = \frac{P}{c}\,\hat z. \label{eq:5-6}\tag{5.6}$$

> **The force scales as $P/c$, independent of polarization.**

### Angular momentum

**Where can angular momentum come from?**

Think of the wave as a stream of **quanta (photons)**, each with energy $\hbar\omega$, where $\hbar = h/(2\pi)$ is Planck's reduced constant (and $h$ is Planck's constant).

A circularly polarized photon carries angular momentum $\pm\hbar$ along its direction of motion, with the sign fixed by the direction of rotation.

Write $\sigma = \pm 1$ for that sign — the **helicity**.

This is a result from quantum mechanics.

Divide the energy density $\eqref{eq:5-3}$ by the per-photon energy $\hbar\omega$ to get the number of photons per unit volume:

$$n = \frac{1}{\hbar\omega}\cdot \frac{|\vec S|}{c} = \frac{|\vec S|}{\hbar\omega\,c}. \label{eq:5-7}\tag{5.7}$$

Each of those $n$ photons contributes $\sigma\hbar$ along $\hat z$ to the angular momentum, so the angular momentum per unit volume is the sum

$$n \cdot \sigma\hbar = \sigma\, \frac{|\vec S|}{\omega\,c}. \label{eq:5-8}\tag{5.8}$$

Note that $\hbar$ cancels: the ratio of angular momentum to energy per photon is $\hbar/(\hbar\omega) = 1/\omega$, already $\hbar$-free.

Multiplying by the classical energy density $\eqref{eq:5-3}$ contributes no further $\hbar$.

The photon picture served only as bookkeeping for how the wave's energy density partitions into angular momentum density.

**What happens for a linearly polarized wave?**

A linear polarization is an equal superposition of the two circular polarizations.

Take a wave polarized along $\hat x$ with amplitude $E$:

$$\vec E_{\rm lin}(t) = E \cos(\omega t)\, \hat x.$$

Write the two circular waves — one with each helicity — with equal amplitudes and add them:

$$\vec E_+(t) = \frac{E}{\sqrt 2}\big[\cos(\omega t)\, \hat x + \sin(\omega t)\, \hat y\big], \qquad \vec E_-(t) = \frac{E}{\sqrt 2}\big[\cos(\omega t)\, \hat x - \sin(\omega t)\, \hat y\big].$$

The $\hat y$ components cancel; the $\hat x$ components add:

$$\vec E_+(t) + \vec E_-(t) = \sqrt 2\, E \cos(\omega t)\, \hat x = \sqrt 2\, \vec E_{\rm lin}(t),$$

so

$$\vec E_{\rm lin} = \frac{1}{\sqrt 2}\big(\vec E_+ + \vec E_-\big). \label{eq:5-9}\tag{5.9}$$

The two circular components have equal amplitude, so the two helicities are populated equally.

Their contributions to $\eqref{eq:5-8}$ have opposite sign and cancel to zero.

**No angular momentum is available to transfer; the E-vector oscillates on one line and never rotates.**

**What about circular polarization?**

One helicity fills the whole population, and $\eqref{eq:5-8}$ gives the full angular momentum density.

Feeding it into the density-rate-Newton chain — multiply by $c \cdot A$ to get the angular momentum rate through a cross-section, and identify with $\vec\tau$ via $\eqref{eq:5-1}$ — gives

$$\vec\tau = \sigma\, \frac{|\vec S|}{\omega c}\cdot c \cdot A\,\hat z = \sigma\, \frac{|\vec S|\,A}{\omega}\,\hat z = \sigma\, \frac{P}{\omega}\,\hat z. \label{eq:5-10}\tag{5.10}$$

The sign flips with the direction of rotation.

For a given $P$, the force $\eqref{eq:5-6}$ is unchanged; **the torque appears only in the circular case, and points along or against $\hat z$ according to the helicity.**

Elliptical polarization mixes the two helicities unequally, with the split set by the axial ratio.

Its angular momentum density interpolates smoothly between zero — the linear case, the two helicities cancelling by $\eqref{eq:5-9}$ — and the full circular value $\eqref{eq:5-8}$.

> **That is the picture for a pure sinusoidal wave in empty space. What changes for pulsed waves, or once the wave enters a material?**

## § 6. Beyond a pure sinusoidal wave in vacuum {#sec-6}

The picture built in §§ [1](#sec-1)–[5](#sec-5) assumes a pure sinusoidal wave in vacuum.

**Two departures from that setting matter for what follows.**

- **A pulsed wave.** A femtosecond laser pulse turns on for a few cycles and then off; a radar pulse turns on for microseconds. In both, the field is

    $$\vec E(t) = A(t)\cos(\omega t)\,\hat p,$$

    a fast **carrier** at $\omega$ multiplied by a slowly varying **envelope** $A(t)$. The polarization direction $\hat p$ lives on the carrier; the envelope shapes the amplitude.

    The two are independent and can be reshaped separately without touching each other. The carrier-envelope separation is developed in [A crest and a packet need not move together](/posts/justification-of-the-de-broglie-relation/#a-crest-and-a-packet-need-not-move-together).

- **A structured medium.** Once the wave leaves vacuum, the two linear polarizations — until now interchangeable — start to see the material differently. Three cases matter later:

    - **A plane dielectric interface.** When a wave hits an interface between two transparent media — such as air and glass — the fraction of the incident amplitude that reflects depends on which linear polarization the wave carries. At one special angle of incidence — the **Brewster angle** — one polarization reflects nothing at all and passes through entirely.

    - **A hollow waveguide.** Inside a hollow metal pipe, the E-field's components parallel to the conducting walls must vanish at those walls. This condition treats the two linear polarizations asymmetrically: one satisfies it trivially, the other reshapes to comply. Each polarization ends up with its own set of allowed transverse patterns — each such pattern is called a **mode** — conventionally labeled **TE** (transverse electric) and **TM** (transverse magnetic), and the two families propagate with different dispersion relations even in a perfectly symmetric guide. See [coupled modes and Bragg structures](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps).

    - **A periodic dielectric stack.** Alternating high- and low-index layers with period comparable to the wavelength open a **photonic bandgap**: a range of wavelengths over which the stack is highly reflective. The width and center of the gap differ for the two polarizations, so at wavelengths inside one gap and outside the other, the stack reflects one polarization and transmits the other. See [Bragg mirrors and lasers](/posts/bragg-mirrors-and-lasers).

> **That the two linear polarizations behave differently in a material is exactly what makes it possible to produce a polarization from unpolarized light, and to transform one polarization into another — the subject of the last two sections.**

## § 7. Producing polarization {#sec-7}

Ordinary light — sunlight, an incandescent bulb — is **unpolarized**: it is emitted by an enormous number of independent atoms, each producing a short burst with its own randomly oriented polarization.

Any detector integrates over vastly many such bursts, and the tallied polarization directions are uniformly spread over the plane the wave traverses. **No fixed polarization survives.**

> Producing a definite polarization means either **filtering** the unpolarized input to keep one direction, or generating a wave that is already polarized to begin with.

### Polarizers: filtering unpolarized light

A **polarizer** transmits one linear polarization and blocks the perpendicular one.

The simplest realization is a **wire grid**: a fine grating of parallel conducting wires.

The spacing between wires is much smaller than the wavelength; otherwise the wave resolves the individual wires and diffracts into higher orders rather than transmitting or reflecting cleanly.

When the spacing is unresolved, the grid acts as one effective medium whose response depends only on the wire orientation.

- **Fields parallel to the wires** accelerate the free electrons along the length of each wire.

    The accelerating electrons re-radiate: backward, this radiation is the reflected wave; forward, it interferes destructively with the incident wave and cancels it.

    **The parallel component does not propagate through — its energy leaves either as the reflected wave or as ohmic heat in the wires.**

- **Fields perpendicular to the wires** cannot drive currents: the wires are thin and there is no closed conducting path across the gaps for electrons to move sideways.

    **No re-radiation, no interference; the perpendicular component passes through unattenuated.**

A polarizer aligned with $\hat x$ (wires along $\hat y$) takes any input $(E_x, E_y)$ to $(E_x, 0)$: the $\hat y$-component is gone.

For a linearly polarized input at angle $\theta$ to the polarizer, the transmitted amplitude is $|E_0|\cos\theta$, so the transmitted intensity is $|E_0|^2 \cos^2\theta$ — the same $\cos^2\theta$ that appeared in $\eqref{eq:3-2}$, and for the same reason: **only the projection on the transmission axis survives.**

> **For an unpolarized input, averaging $\cos^2\theta$ over all input angles gives $\tfrac12$: half the intensity survives, the other half is dissipated.**

### Laser cavities: selection by mode competition

A laser cavity produces a wave that is already polarized on its way out — without discarding half the input.

The reason is not a filter placed in the cavity; it is the geometry of how the wave lives inside the cavity in the first place.

In a laser, the wave bounces between two mirrors many thousands of times before it escapes as the output beam.

Every element inside the cavity — the gain medium, mirror coatings, tilted windows, imperfect surfaces — has slightly different loss for the two linear polarizations.

Call the round-trip amplitude survival $\rho_1$ for one polarization and $\rho_2 < \rho_1$ for the other.

Over $N$ round trips, the amplitudes evolve as

$$A_1(N) = A_1(0)\, \rho_1^N, \qquad A_2(N) = A_2(0)\, \rho_2^N. \label{eq:7-1}\tag{7.1}$$

The ratio between them grows exponentially:

$$\frac{A_1(N)}{A_2(N)} = \frac{A_1(0)}{A_2(0)}\, \left(\frac{\rho_1}{\rho_2}\right)^N. \label{eq:7-2}\tag{7.2}$$

Even a tiny asymmetry compounds.

For $\rho_1/\rho_2 = 1.001$, after $10^3$ round trips the ratio has grown by $e^{10^3 \ln 1.001} \approx e \approx 2.7$; after $10^4$, by about $2 \times 10^4$; after $10^5$, by more than $10^{43}$.

Meanwhile the gain medium replenishes the loss each round trip.

In steady state the gain matches the loss of the favored polarization exactly; the disfavored polarization sees insufficient gain to sustain itself and its amplitude decays to zero.

**The laser oscillates on a single polarization — the one along the low-loss direction.**

The same exponential-selection argument applies to every mode the cavity supports — every distinct oscillation pattern its geometry allows, whether the modes differ by polarization, by frequency, or by transverse spatial shape.

Each has its own round-trip amplitude survival $\rho$, and whichever mode has the largest $\rho$ compounds fastest, extracts all the available gain from the medium, and starves the others out.

The name for this is **mode competition**: the same argument singles out one polarization, one frequency, and one transverse mode.

> Circular output is almost never produced this way; the natural output of a laser cavity is linearly polarized along a fixed axis.

To get circular polarization, the linearly polarized output is fed through a **quarter-wave plate** — the subject of the next section.

## § 8. Manipulating polarization: wave plates {#sec-8}

A wave plate does not filter light; **it slows one linear component relative to the other.** The material used is one whose refractive index depends on the direction of the E-polarization within it — a property called **birefringence**.

<div class="guided-fold-start" data-label="Where birefringence comes from" data-tone="derivation"></div>

For any crystal, the refractive index depends on the direction of the electric field.

The dielectric tensor $\epsilon_{ij}$ is a symmetric $3 \times 3$ matrix with three principal values $\epsilon_x, \epsilon_y, \epsilon_z$ in its eigenbasis.

The corresponding refractive indices are $n_x = \sqrt{\epsilon_x}$, and similarly for $n_y$ and $n_z$.

Geometrically, this defines an ellipsoid called the **indicatrix**: an ellipsoid in 3D with three principal axes of lengths $n_x, n_y, n_z$.

Light polarized along any direction sees an index equal to the radial distance of the ellipsoid in that direction.

**Crystal symmetry classifies the possibilities.**

- **Isotropic** ($n_x = n_y = n_z$). The indicatrix is a sphere. Glass, and cubic crystals such as diamond and sodium chloride. Light propagates the same way regardless of direction or polarization; nothing special can be built with such a material.

- **Uniaxial** ($n_x = n_y \neq n_z$). Two of the principal indices are equal.

    The indicatrix is an ellipsoid of revolution — a rugby ball — with rotational symmetry about the unique axis (here the $z$-axis, called the **optic axis**). Sapphire, calcite, quartz, and lithium niobate are examples.

    There is one preferred direction: the optic axis.

    Light propagating along it sees no birefringence — any polarization sees the same index $n_x = n_y$. Light propagating perpendicular to it sees maximum birefringence — one polarization sees $n_x$, the other sees $n_z$.

    **"Uni-axial" names the one axis of special behavior, along which the birefringence vanishes.**

- **Biaxial** ($n_x \neq n_y \neq n_z$). All three principal indices differ.

    The indicatrix is a fully general ellipsoid. Examples include KTP, BBO, and mica.

    Two directions (not in general perpendicular to each other) exist along which light of any polarization propagates with the same phase velocity. These are the two **optic axes** — hence **"bi-axial".**

<div class="guided-fold-end"></div>

If the two orthogonal directions in the material — call them the fast and slow axes — have indices $n_1 < n_2$, then a wave propagating through thickness $d$ picks up phase $n_1 \omega d/c$ in one component and $n_2 \omega d/c$ in the other.

**The relative phase between them shifts by**

$$\Delta\varphi = \frac{\omega d}{c}(n_2 - n_1). \label{eq:8-1}\tag{8.1}$$

**Two choices of $d$ recover the transformations of [§ 2](#sec-2).**

- **Quarter-wave plate** ($\Delta\varphi = \pi/2$). What it does to the input depends on the orientation of the input polarization relative to the plate's axes:

    - **Input at 45° to the two axes.** Equal amplitudes go into the two components; the plate shifts them $\pi/2$ out of phase; the output has equal amplitudes in two perpendicular directions with a $\pi/2$ phase difference — the recipe for circular polarization from [§ 2](#sec-2).

    - **Input at any other angle.** The amplitude split is unequal, so the output is elliptical, with axial ratio set by the input angle.

- **Half-wave plate** ($\Delta\varphi = \pi$). It flips the sign of one component and leaves the other alone — a mirror-reflection of the polarization about the fast axis.

    **Rotating a half-wave plate by $\theta$ rotates the transmitted linear polarization by $2\theta$.**

> **Together, a polarizer and a small collection of wave plates generate every polarization transformation available on a wave of one frequency.**