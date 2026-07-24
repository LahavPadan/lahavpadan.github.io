# Bragg Mirrors, Laser Cavities, and Engineered Gratings

The previous post, [Coupled Modes, Bragg Structures, and Photonic Bandgaps](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/), takes a general $2 \times 2$ eigenvalue problem and lands it on a periodic dielectric: an *index modulation* along one direction. The physical realization of such a modulation — a slab of dielectric whose refractive index alternates with position — is called a **grating**. We will use "index modulation" and "grating" interchangeably from here on; the first names the physics, the second names the object.

Two devices sit at the center of what follows:

- The **distributed Bragg reflector** (DBR) is a grating used as a wavelength-selective mirror: it reflects strongly in a narrow band and transmits outside it.
- The **distributed-feedback laser** (DFB) puts the same grating *inside* a gain medium and uses Bragg reflection in place of end mirrors, so the wavelength of the laser is set by the grating rather than by the gain's emission peak.

Everything else developed here — apodization, chirp, long-period coupling, quasi-phase matching — is a variation on the same physics with the grating shaped or repurposed.

The results we use from the previous post, all justified in its § 4 subsection [What § 0 already told us](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#what--0-already-told-us):

- A grating with period $\Lambda$ singles out the **Bragg wavenumber** $k_B = \pi/\Lambda$. This is the wavenumber whose round trip through one period picks up a phase of $2\pi$, so that a forward wave near $k_B$ can be scattered by the grating into a backward wave near $-k_B$. The vacuum wavelength that satisfies this first-order condition is $\lambda_B = 2 n_\text{avg}\, \Lambda$, where $n_\text{avg}$ is the spatial average of the refractive index.

- Near this reference wavenumber, only two Fourier components of the field carry appreciable amplitude — the forward wave at $k \approx k_B$ and the Bragg-backscattered wave at $k - 2k_B \approx -k_B$. All other Fourier components are suppressed by $\Delta n / n_\text{avg}$, where $\Delta n$ is the amplitude of the refractive-index modulation (if $n(z) = n_\text{avg} + \Delta n \cos(2 k_B z)$, then $\Delta n$ is the maximum deviation from the average). Throughout, we write the field as

  $$E(z) = A(z)\, e^{i k_B z} + B(z)\, e^{-i k_B z},$$

  with slowly-varying envelopes $A$ (forward) and $B$ (backward).

- The two envelopes are governed by a **detuning** $\delta$ and a **coupling** $\kappa$,

  $$\delta = k - k_B, \qquad \kappa = \frac{\pi\, \Delta n}{\lambda_B}.$$

  Detuning measures how far the driving wavenumber sits from $k_B$; coupling measures how strongly the grating mixes the forward and backward waves.

- The two envelopes obey the dispersion relation

  $$q^2 = \delta^2 - \kappa^2, \tag{\star}\label{eq:hyperbola}$$

  where $q$ is the deviation of the Bloch wavenumber from $k_B$. Outside $\vert\delta\vert > \kappa$, $q$ is real and the field propagates. Inside $\vert\delta\vert < \kappa$, $q = i\alpha$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$, and the field decays exponentially. The range $\vert\delta\vert < \kappa$ is the **stopband**.

- The two edges of the stopband sit at $\delta = \pm\kappa$. At each edge $q = 0$: the forward and backward waves combine into a standing wave, and the group velocity $v_g = d\omega/dq$ vanishes. Both edges are physically accessible in the Bragg problem — a feature that separates it from the one-sided cutoffs (waveguide, plasma, relativistic massive field) treated in the [cutoff phenomena post](/posts/cutoff-phenomena/).

We read \eqref{eq:hyperbola} at a sequence of operating points. § 1 sits at the edges $\delta = \pm\kappa$ and describes the standing waves. § 2 leaves the edge, moves into the stopband, and asks how much of an incident wave a finite grating actually reflects. § 3 builds the DBR as a fabricated multilayer stack. § 4 places the grating against a gain medium — the DFB laser (grating inside the gain) and the DBR laser (grating in a separate section). § 5 lets the grating vary along its length.

---

## § 1. The two edges of the Bragg stopband {#sec-1}

At the Bragg wavenumber ($\delta = 0$), \eqref{eq:hyperbola} gives $q^2 = -\kappa^2$: no propagating solution. What lives at the two edges of the stopband, at $\delta = \pm\kappa$ where $q = 0$, is the subject of this section.

### § 1.1. The equal-mixture standing waves at $\delta = 0$ {#sec-1-1}

At $\delta = 0$ the two-mode coupling matrix has zero diagonal and only the off-diagonal $\pm\kappa$ left. Its eigenvalues are $\pm\kappa$ — the two edge frequencies, above and below the reference — and its eigenvectors are the equal mixtures

$$(A, B) = \frac{1}{\sqrt 2}(1, 1) \quad\text{and}\quad (A, B) = \frac{1}{\sqrt 2}(1, -1).$$

Substituting into $E(z) = A\, e^{i k_B z} + B\, e^{-i k_B z}$:

- $(1, 1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} + e^{-i k_B z} = 2 \cos(k_B z)$ — a **cosine standing wave**.
- $(1, -1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} - e^{-i k_B z} = 2i \sin(k_B z)$ — a **sine standing wave**.

Both have wavelength $2\pi/k_B = 2\Lambda$: exactly one full oscillation per two Bragg periods, or equivalently one intensity maximum per Bragg period, so their intensities are periodic with the modulation.

Where the intensities sit relative to the modulation is what will matter for § 1.2. The cosine standing wave peaks where $\cos(2 k_B z)$ peaks, which is where $\varepsilon(z) = n_\text{avg}^2 + \Delta\varepsilon \cos(2 k_B z)$ is largest — that is, in the high-index parts of the modulation. The sine standing wave peaks in the low-index parts.

### § 1.2. Which edge sits at the lower frequency {#sec-1-2}

The real-space shapes alone do not say which of the two standing waves has the lower frequency. To settle that, we compute $\omega^2$ directly from the wave equation, without solving it — treating it as a functional of the field.

The scalar Helmholtz equation for a periodic dielectric, derived as [the scalar-wave-equation refresher in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#picture-3-scalar-wave-equation), is

$$\frac{d^2 E}{dz^2} + \frac{\omega^2}{c^2}\, \varepsilon(z)\, E(z) = 0.$$

The equation is linear in $\omega^2$, so if we can pull the $\omega^2$ out onto one side by an algebraic operation, the resulting expression will give the frequency as a function of the field. Multiply through by the complex conjugate $E^*(z)$ and integrate over one Bragg period. Periodic boundary conditions make the boundary terms vanish, and

$$\int E^*\, \frac{d^2 E}{dz^2}\, dz + \frac{\omega^2}{c^2} \int \varepsilon(z)\, \vert E \vert^2\, dz = 0.$$

Solving for $\omega^2$,

$$\omega^2 = c^2\, \frac{-\int E^*\, (d^2 E / dz^2)\, dz}{\int \varepsilon(z)\, \vert E \vert^2\, dz}.$$

Integrating the numerator by parts once (boundary terms again vanish by periodicity) turns $E^*\, d^2 E/dz^2$ into $-\vert dE/dz \vert^2$, giving

$$\omega^2 = c^2\, \frac{\int \vert dE/dz \vert^2\, dz}{\int \varepsilon(z)\, \vert E \vert^2\, dz}. \tag{1}\label{eq:rayleigh}$$

For a genuine eigenmode of the wave equation, the right-hand side of \eqref{eq:rayleigh} is the actual $\omega^2$ of that mode. For any other trial field, it gives a variational estimate.

We now apply \eqref{eq:rayleigh} to the two edge modes. Both are pure sinusoids at the same wavenumber $k_B$, so their derivatives $dE/dz$ have the same shape and the numerators integrate to the same value. The only thing that separates them is the denominator, which depends on how the intensity $\vert E \vert^2$ overlaps the modulation $\varepsilon(z)$:

- The **cosine mode** has its intensity in the high-index parts of the modulation, so $\int \varepsilon \vert E \vert^2\, dz$ is large. Larger denominator, smaller $\omega^2$.
- The **sine mode** has its intensity in the low-index parts, so $\int \varepsilon \vert E \vert^2\, dz$ is small. Smaller denominator, larger $\omega^2$.

So the lower edge $\omega_-$ is the cosine mode with its intensity in the high-index material, and the upper edge $\omega_+$ is the sine mode with its intensity in the low-index material. In the language often used for the two, the lower edge is called the **dielectric-band edge**, the upper edge the **air-band edge**, referring to which material the standing-wave intensity occupies. Shifting the origin of coordinates by half a Bragg period swaps cosine and sine (and swaps the labels), but the rule — intensity in the high-index material puts the mode at the lower frequency — holds regardless of that convention.

### § 1.3. The same edges from an interface-by-interface count {#sec-1-3}

A second way of arriving at the same stopband uses individual reflections at dielectric interfaces instead of the smooth cosine modulation. It is exact for a step-index profile — the multilayer stack we will build as a DBR in § 3 — and it gives a clean physical picture of what $\delta = 0$ means when the grating is layered rather than sinusoidal.

At normal incidence, an interface from refractive index $n_1$ into refractive index $n_2$ has amplitude reflection coefficient

$$r_{12} = \frac{n_1 - n_2}{n_1 + n_2}. \tag{2}\label{eq:fresnel}$$

Two properties of $r_{12}$ matter for what follows:

- **Sign.** Going from low to high index gives $r_{12} < 0$: the reflected amplitude is phase-shifted by $\pi$ relative to the incident amplitude. Going from high to low gives $r_{12} > 0$: no phase shift.
- **Magnitude.** For typical dielectric index differences (a few percent up to about 50%), $\vert r_{12} \vert$ is small, so each interface reflects only a fraction of the incident amplitude.

Consider now a stack of alternating high-index and low-index layers, each with an **optical thickness** of a quarter wavelength: the physical layer thickness $d_i$ is chosen so that $n_i d_i = \lambda_0 / 4$ for some target vacuum wavelength $\lambda_0$. ("Optical thickness" is the physical thickness times the refractive index, which is what determines the one-way phase a wave picks up going through the layer.) With this choice, one-way propagation through such a layer contributes a phase of $(2\pi n_i / \lambda_0)(\lambda_0 / 4 n_i) = \pi/2$, and a round trip contributes $\pi$.

Compare two reflected amplitudes arriving back at the input plane just outside the stack:

- Reflection off the first air–high interface: phase $\pi$ from the reflection itself, no propagation.
- Reflection off the next interface (high to low): a round trip through the high layer contributes $\pi$, and the high-to-low reflection contributes no additional phase.

Both arrive at the input plane with total phase $\pi$. They combine constructively. The next pair of interfaces adds two more contributions with the same total phase, and so on down the stack.

{% include visualization.html src="fresnel-quarter-wave-phase.html" title="Reflection phase and quarter-wave propagation phase compared at one return plane" %}

Off the design wavelength $\lambda_0$, the round-trip phase per layer is no longer exactly $\pi$, and reflections from deeper and shallower layers begin to disagree in phase. The rate at which the disagreement accumulates is what sets the stopband edges — made quantitative in § 2.3.

*The two standing waves and the interface-counting picture both describe an infinite medium. In a real device the grating has a finite length, and the wave reflects off two boundaries rather than propagating forever. What sets how much of the incident amplitude actually comes back?*

---

## § 2. Finite gratings: how deep, how strong {#sec-2}

### § 2.1. Semi-infinite grating: the Bragg length {#sec-2-1}

At $\delta = 0$ the dispersion \eqref{eq:hyperbola} gives $q^2 = -\kappa^2$, so $q = \pm i\kappa$ and the two spatial factors are $e^{+\kappa z}$ and $e^{-\kappa z}$. In a semi-infinite grating occupying $z > 0$ the growing solution is unbounded and is excluded, so the field decays as $e^{-\kappa z}$.

The length over which the field decays by a factor of $e$ is

$$L_B \equiv \frac{1}{\kappa}, \tag{3}\label{eq:bragg-length}$$

called the **Bragg length**. It is the intrinsic depth scale of an evanescent Bragg wave.

The Bragg length is a property of the *medium*, not of any particular device. In a real device the grating is finite, and its far boundary changes what the wave does.

### § 2.2. Finite grating: the reflectivity {#sec-2-2}

At $\delta = 0$ the coupled equations for the forward and backward envelopes are

$$\frac{d}{dz} \begin{pmatrix} A \\ B \end{pmatrix} = \begin{pmatrix} 0 & i\kappa \\ -i\kappa & 0 \end{pmatrix} \begin{pmatrix} A \\ B \end{pmatrix}. \tag{4}\label{eq:cme}$$

The off-diagonal has the same $\kappa$ as before; the factor $i$ is a phase convention, and will affect only the phase (not the power) of the reflected wave.

Differentiating either component of \eqref{eq:cme} and substituting the other back in decouples the pair,

$$\frac{d^2 A}{dz^2} = \kappa^2\, A, \qquad \frac{d^2 B}{dz^2} = \kappa^2\, B.$$

Both envelopes satisfy the same scalar equation; both are combinations of $\cosh(\kappa z)$ and $\sinh(\kappa z)$. Fixing the two integration constants gives the propagation matrix for a grating of length $L$,

$$\begin{pmatrix} A(L) \\ B(L) \end{pmatrix} = \begin{pmatrix} \cosh(\kappa L) & i\, \sinh(\kappa L) \\ -i\, \sinh(\kappa L) & \cosh(\kappa L) \end{pmatrix} \begin{pmatrix} A(0) \\ B(0) \end{pmatrix}.$$

For a wave incident from the left with no wave coming in from the right, $A(0) = A_\text{in}$ is given and $B(L) = 0$ (no back-illumination). Reading the second row for $B(L) = 0$ and solving for $B(0)/A(0)$,

$$\frac{B(0)}{A(0)} = i \tanh(\kappa L),$$

and the power reflectivity is

$$\boxed{\, R = \tanh^2(\kappa L). \,} \tag{5}\label{eq:tanh-refl}$$

The transmitted amplitude comes from the first row: $A(L)/A(0) = \operatorname{sech}(\kappa L)$, so $T = \operatorname{sech}^2(\kappa L)$.

Since $\tanh^2 + \operatorname{sech}^2 = 1$, we have $R + T = 1$: energy is conserved, as it must be in a lossless grating.

The envelopes that satisfy both boundary conditions are

$$A(z) = \frac{\cosh[\kappa (L - z)]}{\cosh(\kappa L)}, \qquad B(z) = i\, \frac{\sinh[\kappa (L - z)]}{\cosh(\kappa L)}. \tag{6}\label{eq:envelopes}$$

They are worth comparing side by side with the semi-infinite decay of § 2.1:

- **Semi-infinite grating.** The field decays purely as $e^{-\kappa z}$: one exponential mode, forced by boundedness at $z = \infty$.
- **Finite grating.** The field is a specific mixture of $\cosh$ and $\sinh$, whose relative weights are set by the far boundary $B(L) = 0$. As $\kappa L$ grows the far boundary retreats, and near the entrance the finite envelope looks more and more like the semi-infinite decay.

{% include visualization.html src="bragg-mirror-penetration.html" title="Infinite-medium decay, finite-boundary envelopes, and Bragg-mirror reflectivity" %}

The dimensionless product $\kappa L = L / L_B$ is the physical length of the grating, measured in Bragg lengths. It controls everything: reflectivity, transmission, and the shape of the internal envelope.

Setting a target reflectivity of $R > 0.99$ and solving \eqref{eq:tanh-refl},

$$\kappa L > \operatorname{arctanh}(\sqrt{0.99}) \approx 2.99.$$

So a grating tuned to $\delta = 0$ needs about three Bragg lengths of physical extent to exceed 99% power reflectivity.

### § 2.3. The stopband width, from phase-error accumulation {#sec-2-3}

Combining the edges $\delta = \pm\kappa$ of \eqref{eq:hyperbola} with the definition of $\kappa$ gives the stopband width in wavenumber, $\Delta k = 2\kappa$, and in frequency, $\Delta\omega = 2\kappa v_g$. The interface-counting picture of § 1.3 recovers the same number, and lets us see the same $\kappa$ in a different form.

Take a stack tuned exactly to $\lambda_0$: each layer contributes a round-trip phase of exactly $\pi$, and all reflections combine constructively.

<div class="guided-fold-start" data-label="Follow the phase error through a concrete 1% detuning" data-tone="derivation"></div>

Illuminate the same stack with a wavelength $\lambda = 0.99\, \lambda_0$ — off by 1%. The round-trip phase per layer is

$$\phi_\text{RT} = 2 k d = 2 \left(\frac{2\pi n}{\lambda}\right) \left(\frac{\lambda_0}{4 n}\right) = \pi\, \frac{\lambda_0}{\lambda} \approx 1.01\, \pi.$$

Each layer contributes a phase *error* of $0.01\, \pi \approx 2°$ relative to the design condition. Small at one layer — the interface reflects nearly as well as it would at the design wavelength — but the error accumulates as the wave works deeper:

- After 10 layers: accumulated error $\approx 18°$. Deep and shallow reflections still add roughly in phase.
- After 50 layers: accumulated error $\approx 90°$. Deep-layer reflections are orthogonal in phase to shallow ones — neither reinforcing nor cancelling.
- After 100 layers: accumulated error $\approx 180°$. Deep-layer reflections are opposed to shallow ones, and further layers subtract from the total instead of adding to it.

For this 1% detuning, the useful reflecting depth is $\sim 100$ layers, about $30\,\mu\text{m}$ in a typical stack.

<div class="guided-fold-end"></div>

The **stopband edge** is the detuning at which the phase error over a *single* Bragg period is already $\pi$. Beyond that detuning, destructive interference within one Bragg period overwhelms the constructive contribution, and the mirror stops reflecting coherently even at zero depth.

That condition ties $\kappa$ and $L_B$ together. At the stopband edge, phase error accumulates at a rate of $\pi$ per Bragg length. That rate has units of inverse length, and is exactly $\kappa$. So $\kappa$ is the largest phase-error-accumulation rate for which coherent reflection still survives, and the Bragg length $L_B = 1/\kappa$ is the corresponding length scale over which that maximum rate integrates to a full $\pi$.

Two quantities, one condition:

- The **stopband width** $2\kappa$ is the range of detunings for which the phase error stays below $\pi$ per Bragg period.
- The **penetration depth** $1/\kappa$ is the length over which, at the largest surviving detuning, that phase error accumulates to $\pi$.

They are reciprocals of each other because both come from the same $\pi$ threshold.

*The reflectivity formula $R = \tanh^2(\kappa L)$ tells us $\kappa$ and $L$ jointly control the mirror. What sets $\kappa$ in a stack we actually build, and how many layers of what index difference do we need?*

---

## § 3. The DBR: a Bragg grating in fabricated hardware {#sec-3}

We now build the DBR as a physical multilayer, and translate the coupled-mode formulas of § 2 into the parameters an engineer picks: layer indices, layer thickness, and number of periods.

### § 3.1. The quarter-wave stack: reflectivity of an $N$-period mirror {#sec-3-1}

A standard DBR alternates layers of high index $n_H$ and low index $n_L$, each of optical thickness $\lambda_0 / 4$. From § 1.3, this is the geometry in which all reflections add coherently at $\lambda_0$.

For a stack of $N$ high-low pairs plus a final high layer, sandwiched between a substrate of index $n_s$ and an incident medium of index $n_0$, the reflectivity at the design wavelength has a closed form,

$$R = \left( \frac{n_0\, n_L^{2N} - n_s\, n_H^{2N}}{n_0\, n_L^{2N} + n_s\, n_H^{2N}} \right)^2. \tag{7}\label{eq:dbr-refl}$$

The formula falls out of the transfer-matrix product for the stack at quarter-wave thickness — the [transfer-matrix formalism from the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-5) gives it directly. We take \eqref{eq:dbr-refl} here as the closed-form output.

How quickly $R$ approaches 1 as we add periods depends on the ratio $n_H / n_L$:

- **Large ratio** — $n_H / n_L$ well above 1. The factor $(n_H / n_L)^{2N}$ dominates the denominator quickly, and $R$ saturates near unity for $N \sim 10$. Dielectric stacks with Ta$_2$O$_5$ over SiO$_2$ have $n_H / n_L \approx 1.5$, and 10–15 periods reach $R > 99\%$.
- **Small ratio** — $n_H / n_L$ close to 1. Saturation is slower. Semiconductor DBRs based on GaAs/AlAs have $n_H / n_L \approx 1.15$ and need 25–30 periods.

For a large enough $N$, \eqref{eq:dbr-refl} agrees with the coupled-mode formula $R = \tanh^2(\kappa L)$ derived in § 2.2. The two apply in complementary limits — \eqref{eq:dbr-refl} is exact for a few strong interfaces, and $\tanh^2(\kappa L)$ is the smooth-envelope approximation for many weak interfaces — and they overlap in the range where both are accurate.

### § 3.2. Bandwidth from the index difference {#sec-3-2}

The formula $\kappa = \pi\, \Delta n / \lambda_B$, derived at [§ 2 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-2), is for a sinusoidal index modulation. A DBR is instead *piecewise-constant* — the refractive index takes only two values, $n_H$ and $n_L$. Its Fourier expansion has a fundamental cosine coefficient of $4/\pi$ times the peak-to-average amplitude of the square wave, so the coupling seen at the fundamental Bragg wavelength is

$$\kappa_\text{DBR} = \frac{2\, \Delta n}{\lambda_0}, \qquad \Delta n \equiv n_H - n_L.$$

The stopband width in frequency, $\Delta\omega = 2 \kappa v_g$, then translates into a ratio between the stopband width and the center frequency:

$$\frac{\Delta \omega}{\omega_0} = \frac{4}{\pi}\, \frac{\Delta n}{n_\text{avg}}. \tag{8}\label{eq:dbr-bw}$$

This ratio — the stopband width divided by its center frequency — is what optical engineers call the **fractional bandwidth** of the mirror. Two working numbers:

- **High-index difference dielectric stack** — $\Delta n / n_\text{avg} \approx 0.5$. Fractional bandwidth $\approx 60\%$: broadband, covers most of the visible or a wide near-infrared window.
- **Semiconductor DBR** — $\Delta n / n_\text{avg} \sim 0.05$. Fractional bandwidth $\approx 6\%$: narrow enough for single-mode laser use (§ 4), too narrow for broadband applications.

The same $\kappa$ appears in the Bragg length $L_B = 1/\kappa$ and, via \eqref{eq:tanh-refl}, in the reflectivity $R = \tanh^2(\kappa L)$ of a physical grating.

That ties the two design axes together. For a fixed index difference $\Delta n$, a shorter mirror (smaller $L$) needs a larger $\kappa$ to hit the same reflectivity — but a larger $\kappa$ also widens the stopband. Bandwidth and physical length trade off through the shared $\kappa$, and the DBR designer picks the balance for the application.

### § 3.3. Higher-order stopbands and the structure factor {#sec-3-3}

A square-wave DBR has stopbands not just at $\lambda_0$, but also at odd sub-multiples $\lambda_0 / 3, \lambda_0 / 5, \ldots$ At those shorter wavelengths, the same quarter-wave layer is also a $3\lambda/4, 5\lambda/4, \ldots$ layer, satisfying the Bragg condition at higher order.

The strength of the $m$-th stopband is set by the corresponding Fourier coefficient $\varepsilon_m$ of the modulation profile — the modulation's **structure factor**. The [Bragg-condition background in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-1) develops this for a general periodic $\varepsilon(z)$. The rule: a purely sinusoidal modulation has only the fundamental $\varepsilon_{\pm 1}$ nonzero and produces only the first-order stopband, while a square-wave modulation has $\varepsilon_m \propto 1/m$ for odd $m$ (and zero for even $m$), producing weaker higher-order stopbands at each odd $m$.

Two engineering consequences:

- To *suppress* the higher-order stopbands, shape the modulation to look more sinusoidal — only $\varepsilon_{\pm 1}$ nonzero. In fiber Bragg gratings, a smooth amplitude envelope (apodization, § 5.1) does this approximately.
- To *engineer* multiple simultaneous stopbands at prescribed wavelengths, choose a modulation whose Fourier spectrum has content at the desired periods. § 5 develops this for sampled gratings, which support multi-wavelength lasing.

### § 3.4. Off-normal incidence and Brewster's angle {#sec-3-4}

Every calculation so far has assumed the wave hits the stack perpendicular to the layers. In many devices the wave arrives at an angle instead — inside a semiconductor waveguide, for instance, the in-plane mode strikes the DBR at whatever internal angle the waveguide geometry sets. At off-normal incidence, three things change at once:

- **Optical path length through each layer.** With the wave at angle $\theta_i$ inside a layer (set by Snell's law), the path length through a layer of physical thickness $d_i$ becomes $d_i / \cos\theta_i$. This shifts the Bragg condition to a shorter wavelength for the same physical layer.
- **Polarization sensitivity of the reflection coefficient.** The two polarizations — TE (electric field in the plane of the layers) and TM (electric field with a component along the layer normal) — see different interface reflectivities.
- **Polarization sensitivity of $\kappa$.** Since $\kappa$ is built from the interface reflections, it inherits their polarization dependence, and TE and TM acquire distinct stopbands.

{% include visualization.html src="oblique-bragg-phase.html" title="Why off-normal incidence shifts the Bragg wavelength through the normal wavevector component" %}

The reflection coefficients at an interface from $n_1$ into $n_2$ at angles $\theta_1$ and $\theta_2$ are

$$r_\text{TE} = \frac{n_1 \cos\theta_1 - n_2 \cos\theta_2}{n_1 \cos\theta_1 + n_2 \cos\theta_2}, \qquad r_\text{TM} = \frac{n_2 \cos\theta_1 - n_1 \cos\theta_2}{n_2 \cos\theta_1 + n_1 \cos\theta_2}. \tag{9}\label{eq:fresnel-full}$$

At $\theta_1 = 0$ both reduce to \eqref{eq:fresnel}: normal incidence gives the same reflectivity for both polarizations. Away from zero, the two split — and TM does something dramatic:

$$r_\text{TM} = 0 \quad\text{when}\quad \tan\theta_1 = \frac{n_2}{n_1}. \tag{10}\label{eq:brewster}$$

The angle $\theta_1$ satisfying this is called **Brewster's angle**. At it, TM light passes through the interface with zero reflected amplitude.

The mechanism deserves a moment. An incident electric field drives the electrons in the second medium into oscillation along the direction of the transmitted field. Those oscillating charges are electric dipoles, and it is *their* re-radiation that produces the reflected wave. An oscillating electric dipole, however, cannot radiate along its own axis of oscillation — the radiation pattern has a node in that direction. For TM polarization at Brewster's angle, Snell's law places the reflected ray precisely along the direction in which the induced dipoles point — the very direction they cannot radiate into. There is no reflected wave. TE polarization has no analogous angle because its induced dipoles point perpendicular to the plane of incidence, and the reflected ray always sits inside that plane, never along the dipole axis.

{% include visualization.html src="te-tm-boundary-admittance.html" title="How off-normal incidence distinguishes TE and TM boundary admittances" %}

The consequence for a DBR: as the in-medium angle approaches Brewster's angle, the TM reflection coefficient shrinks toward zero, the TM coupling $\kappa_\text{TM}$ shrinks with it, and the TM stopband narrows and eventually closes. The TE stopband stays open, so at that angle the DBR reflects TE and transmits TM at the same wavelength — a polarization-selective mirror.

{% include visualization.html src="brewster-stopband-closure.html" title="Why TE reflections accumulate while the TM stopband closes at Brewster incidence" %}

Whether any of this matters depends on the internal mode angle of the device. In a vertical-cavity surface-emitting laser (§ 4), the mode is very close to normal incidence and polarization effects are negligible: normal-incidence design suffices. In edge-emitting waveguide lasers where the internal angle is far from zero, TE and TM may need separate DBR designs.

*A DBR is a passive wavelength-selective mirror. When we place the grating against a gain medium — inside it, outside it, or spread across multiple sections — the reflection turns into feedback, and what we get is a laser whose wavelength is set by the grating. Which mode wins, and how do we get a single one?*

---

## § 4. Bragg feedback in lasers: DFB and DBR {#sec-4}

A laser combines a **gain medium**, which amplifies the field, with a **cavity**, which feeds the field back on itself so that gain accumulates coherently over many round trips. In a conventional edge-emitting semiconductor laser, the cavity is defined by two flat cleaved end facets. Replacing one or both of those facets — or the entire cavity — with a Bragg grating gives *wavelength-selective* feedback, and forces the laser to operate inside the grating's stopband. Two architectures capture the two main design choices:

- The **DFB laser** puts the grating inside the same waveguide as the gain — gain and feedback are co-located, distributed continuously along the same length.
- The **DBR laser** puts the grating in a separate passive section outside the gain — gain and feedback are in physically distinct sections, controlled by different electrical contacts.

The rest of this section develops both, plus a tunable extension of the DBR laser that uses two combs of reflection peaks to reach across the whole telecom band.

### § 4.1. The flat-mirror reference {#sec-4-1}

A conventional edge-emitting semiconductor laser has a rectangular waveguide of length $L$ and effective index $n_\text{eff}$, with flat cleaved facets serving as mirrors. The reflectivity of a facet at normal incidence, from \eqref{eq:fresnel} with $n_1 = n_\text{eff} \approx 3.5$ and $n_2 = 1$, is $R \approx 0.3$ — the same at every wavelength.

Wavelength-independent mirrors have a specific consequence: the cavity supports a comb of resonant modes at frequencies $\nu_n = n \cdot c / (2 n_\text{eff} L)$, with mode spacing (the **free spectral range**) $\Delta\nu_\text{FSR} = c / (2 n_\text{eff} L)$. Each mode is a standing wave fitting an integer number of half-wavelengths between the facets. The gain medium has an emission bandwidth of many THz — thousands of times the FSR — so the comb contains many thousands of modes, and every mode has essentially the same mirror loss because the flat mirror does not discriminate by wavelength. Which mode actually lases is set by small differences in gain across the emission spectrum, and since gain depends on drive current and temperature, the winning mode drifts and hops as those conditions change.

That behavior — many densely-spaced modes, weakly discriminated, prone to hopping — is unacceptable for coherent optical communications, precision spectroscopy, and interferometric sensing. The fix is a wavelength-selective mirror, and where the grating sits relative to the gain determines what device we get.

### § 4.2. DFB: the grating co-located with the gain {#sec-4-2}

The DFB architecture writes a Bragg grating directly into the active waveguide. There are no flat end mirrors; feedback is distributed continuously along the grating. Two properties of the resulting device drive its design.

**A distributed grating is itself a cavity.** In a flat-mirror laser the round trip is well-defined — the field bounces between two identifiable planes and lases when round-trip gain exceeds round-trip loss. In a grating, the "round trip" is smeared over many Bragg lengths, but the physics is the same: near a stopband edge, the group velocity is small (§ 1) and the field accumulates round-trip-equivalent phase inside a Bragg length or two. Specific frequencies inside the stopband — the ones for which the grating's boundary conditions allow a coherent resonance — behave like the standing modes of a real cavity, with the grating acting as both mirrors and cavity at once.

**A stopband is a wavelength-selective filter.** Only frequencies inside the stopband see high reflectivity; frequencies outside see essentially none. The lasing mode is forced into the stopband, so it is confined to a bandwidth of $2\kappa v_g$ (§ 3), containing a small handful of modes rather than the thousands of the flat-mirror comb.

Which of those handful wins, and can we guarantee that only one does? Two mechanisms decide.

#### Which mode wins: density of states and field–gain overlap {#sec-4-2-1}

The band-edge modes have $q = 0$: standing waves at either edge of the stopband. Two independent physical enhancements push spontaneous and stimulated emission preferentially into these edge modes.

**Density of states.** The number of allowed field modes per unit frequency in a 1D dispersion $\omega(q)$ is

$$\rho(\omega) = \frac{1}{\pi\, v_g}$$

per unit length. This comes from a change of variables: allowed $q$ values in a box of length $L$ are equally spaced with density $L / (2\pi)$ per unit $q$; converting to frequency via $\rho(\omega)\, d\omega = \rho(q)\, dq$ and counting both branches of the dispersion (positive and negative $q$) gives $\rho(\omega) = 1 / (\pi v_g)$. Near a band edge, $v_g \to 0$, and $\rho(\omega)$ diverges as an inverse square root: $\rho(\omega) \propto 1 / \sqrt{\omega - \omega_\text{edge}}$.

The rate at which the gain medium's excited atoms deposit energy into any particular mode is proportional to the density of states at that mode's frequency. Band-edge modes are therefore populated much faster than modes deeper inside the stopband — the emitters preferentially "aim" at the edges.

**Field–gain spatial overlap.** The two band-edge modes concentrate their intensity at complementary positions in one Bragg period (§ 1.1) — one in the high-index material, the other in the low-index material. If the gain material sits at the intensity maxima of one of them, the effective gain per unit length seen by that mode is

$$\gamma_\text{eff} = \gamma_0\, \frac{\int_\text{gain region} \vert E(z) \vert^2\, dz}{\int \vert E(z) \vert^2\, dz},$$

where $\gamma_0$ is the intrinsic gain coefficient of the active material. The ratio can be substantially above unity when the mode's intensity coincides with the gain region. Semiconductor DFBs place their quantum wells in the high-index material of the grating; that puts the gain where the cosine standing wave — the lower band-edge mode of § 1.2 — has its peaks. The lower band-edge mode therefore sees enhanced $\gamma_\text{eff}$, while the upper band-edge mode sits in the low-index region and sees the base $\gamma_0$.

Both mechanisms push the laser toward the lower band-edge mode. That is not, however, enough on its own to guarantee that only one mode lases.

#### The two-band-edge problem and the quarter-wave defect {#sec-4-2-2}

A pure index-modulated DFB has two band-edge modes with nearly the same net gain — the density-of-states enhancement is identical at the two edges (both have $v_g \to 0$), and only the overlap enhancement of § 4.2.1 discriminates. Small fabrication perturbations can swing the balance, and the laser hops unpredictably between the two edges as it operates.

Two remedies:

- **Insert a $\lambda/4$ phase shift at the grating center.** A physical spacer of quarter-wave optical thickness, placed halfway along the grating, changes the boundary condition felt by the field. In an unshifted grating the two edge modes are related by translating along the grating by half a Bragg period; the $\lambda/4$ shift breaks that translation symmetry and creates a *single* defect mode localized around the shift point, at the exact center of the stopband. The mode is spatially symmetric under reflection about the shift point and has no equal-frequency partner. It is a localized state inside the photonic bandgap, decaying exponentially into the surrounding grating with the center-gap decay length $L_B = 1/\kappa$ from \eqref{eq:bragg-length}. This defect mode is the analog of an impurity state in an electronic semiconductor bandgap. The $\lambda/4$-shifted DFB is the industry-standard single-mode telecom laser.

- **Gain-coupled modulation.** If the modulation is not purely in the refractive index but also in the gain — the modulation has both real and imaginary parts — the two band-edge modes overlap the modulation differently. One overlaps the gain maxima and sees higher net gain; the other overlaps the loss maxima and sees lower net gain. The tie between them is broken without any structural phase shift, and single-mode operation is intrinsic. § 4.3 develops this.

### § 4.3. Index-coupled versus gain-coupled DFB {#sec-4-3}

The modulation $\varepsilon(z) = \bar\varepsilon + \Delta\varepsilon(z)$ can carry both a real and an imaginary part,

$$\Delta\varepsilon(z) = \Delta\varepsilon'(z) + i\, \Delta\varepsilon''(z).$$

The real part $\Delta\varepsilon'$ modulates the refractive index — everything above has used this alone. The imaginary part $\Delta\varepsilon''$ modulates gain or loss; see [the complex-response section of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-8) for the sign convention. Real semiconductor DFBs have both, and the two limits behave qualitatively differently:

- **Pure index coupling** ($\Delta\varepsilon'' = 0$). Two nearly-symmetric band edges with equal loss. Mode selection is fragile; single-mode operation needs a $\lambda/4$ shift.
- **Pure gain coupling** ($\Delta\varepsilon' = 0$). The two band-edge modes split in net gain by their overlap with the gain modulation. Single-mode operation is intrinsic. The fabrication cost is that gain coupling requires physically corrugating the active layer or using a periodic quantum-well structure — much harder than the smooth index grating of an index-coupled DFB.

#### Why the two components cannot be chosen independently {#sec-4-3-1}

The real and imaginary parts of a material's response are not independent choices. Any physical material that responds linearly to a driving field must do so *causally*: the response at time $t$ can depend only on the field's values at earlier times. That constraint has an algebraic consequence — the real and imaginary parts of the response as functions of frequency are locked together.

<div class="guided-fold-start" data-label="Derive the causal response relations from analyticity" data-tone="derivation"></div>

Write the electric susceptibility as

$$\chi(\omega) = \chi'(\omega) + i\, \chi''(\omega), \qquad \varepsilon(\omega) = 1 + \chi(\omega).$$

Causality — no polarization response before the driving field — means the inverse Fourier transform of $\chi$ vanishes for $t < 0$. That in turn makes $\chi(\omega)$ analytic in the upper half of the complex $\omega$-plane.

For a function analytic in the upper half-plane that vanishes fast enough at infinity, the Cauchy integral around a contour closed in the upper half-plane relates the function's boundary values on the real axis to itself. Applying this with a contour that indents around the point $\omega' = \omega$ on the real axis, and taking the principal value in the limit that the indentation shrinks to zero, gives

$$\chi'(\omega) = \frac{2}{\pi}\, \mathcal{P} \int_0^\infty \frac{\omega'\, \chi''(\omega')}{\omega'^2 - \omega^2}\, d\omega',$$

$$\chi''(\omega) = -\frac{2\omega}{\pi}\, \mathcal{P} \int_0^\infty \frac{\chi'(\omega')}{\omega'^2 - \omega^2}\, d\omega'.$$

The symbol $\mathcal{P}$ denotes a Cauchy principal value: a symmetric interval around the pole is omitted and shrunk to zero, so that the singular contributions from the two sides cancel. The integrals run from $0$ to $\infty$ rather than $-\infty$ to $\infty$ because $\chi(-\omega) = \chi^*(\omega)$ for a real response, which folds the negative-frequency contribution onto the positive one.

{% include visualization.html src="kramers-kronig.html" title="Causality, the contour argument, and the causal response relations" %}

<div class="guided-fold-end"></div>

The result is a pair of integral transforms relating $\chi'$ and $\chi''$: specify one at every frequency and the other is determined. (These are commonly called the Kramers–Kronig relations.) In a semiconductor DFB the immediate consequence is that changing the carrier density to modulate the gain necessarily also modulates the refractive index, and vice versa. An exactly pure index grating and an exactly pure gain grating are idealizations, and a fabricated device generally contains some of both. Design lets us pick the operating point and the grating phase to weight one component over the other, but it does not eliminate the companion response.

### § 4.4. DFB linewidth {#sec-4-4}

The linewidth of a laser — the frequency-domain width of its emission peak — is set by a competition between coherent gain and incoherent noise. Three factors dominate for a DFB:

- **Cavity Q.** How many times the field bounces coherently before losing itself to residual loss. Narrow linewidth needs high Q, which needs long gratings and high $\kappa$ (so reflectivity approaches unity at both effective mirrors).
- **Spontaneous emission** into the lasing mode. Even in an active cavity, some fraction of the atomic transitions emit at random times with random phase, adding a phase-noise floor to the coherent field. The rate at which these random kicks accumulate sets a fundamental linewidth limit.
- **Amplitude–phase coupling** through the carrier-density-dependent index. In a semiconductor, changing the number of carriers changes both the gain (real part of the response) and the refractive index (imaginary part), through the causal link of § 4.3.1. Every amplitude fluctuation therefore drags a phase fluctuation along with it, amplifying the impact of amplitude noise on the linewidth. This coupling is captured by a dimensionless factor $\alpha_H$ — typically 2 to 5 in InGaAsP semiconductor lasers — that multiplies the noise contribution by $(1 + \alpha_H^2)$.

Putting the three together, the fundamental linewidth is

$$\Delta\nu = \frac{\pi\, h\nu\, (\Delta\nu_c)^2\, n_{sp}}{P_\text{out}}\, (1 + \alpha_H^2), \tag{11}\label{eq:linewidth}$$

with $\Delta\nu_c$ the cold-cavity linewidth, $n_{sp}$ the spontaneous-emission factor, and $P_\text{out}$ the output power. High-power high-Q DFBs achieve 100 kHz to 1 MHz — hundreds of times narrower than a flat-mirror multi-mode laser, but still limited by the $(1 + \alpha_H^2)$ amplification.

External-cavity DFB extensions (adding a long external grating or an extended feedback path) push the cold-cavity linewidth down, and can reach below 1 kHz for coherent optical communication.

### § 4.5. Tuning a DFB {#sec-4-5}

Tuning a DFB requires shifting its Bragg wavelength $\lambda_B = 2 n_\text{avg}\, \Lambda$. The physical period $\Lambda$ is fixed by lithography, so tuning must change $n_\text{avg}$. Two mechanisms are practical:

- **Temperature.** The thermo-optic effect and thermal expansion give a modest temperature dependence to the effective index — in InGaAsP, about $0.1$ nm of wavelength shift per K. Total tuning range around 5 nm; response time in milliseconds (set by thermal diffusion in the chip).
- **Current injection.** Injected carriers change the refractive index directly (free-carrier plasma effect and band-filling). Fast — nanoseconds — but only about $0.01$ nm per mA, and with unwanted coupling to output power (more current means more gain).

Both mechanisms tune the *entire* laser (grating and gain together), and both are limited to a few nm. For wider tuning, the grating and gain have to be electrically separated so their indices can move independently — the DBR laser architecture.

### § 4.6. DBR laser: grating outside the gain {#sec-4-6}

A **DBR laser** places the Bragg grating in a *separate* section of the waveguide from the gain. The gain sits in a central active section, and one or both ends of the waveguide are terminated by a passive Bragg grating that acts as a wavelength-selective mirror. The grating and the gain are electrically isolated — separate contacts, separate current-injection paths — so their refractive indices can be tuned independently.

Three tuning strategies follow from that independence:

- **Grating-only tune.** Change the index of the DBR section while leaving the gain section fixed. This shifts the Bragg wavelength but leaves the total cavity length (and the mode spacing) essentially unchanged. As $\lambda_B$ moves, it crosses successive cavity modes, and the laser hops from one to the next.
- **Cavity-only tune.** Insert a passive phase-shift section between the grating and the gain, and change its index. This shifts the cavity modes without moving the Bragg wavelength. Continuous tuning over one free spectral range is possible without a mode hop.
- **Combined.** Tune both the grating and the phase section together, keeping a specific mode centered in the stopband as the stopband moves. This is the widest continuous-tuning strategy with a single grating.

The DBR laser has more sections to control than a DFB — typically three or four, each with its own contact — but it can tune further, without mode hops, using the combined strategy.

### § 4.7. Vernier tuning with sampled gratings {#sec-4-7}

Single-grating architectures tune over at most about 10 nm continuously. Extending this to the full telecom C-band — 40 nm or more — requires two gratings playing against each other, exploiting the same principle mechanical Vernier calipers use.

The setup uses two DBRs bracketing a gain section, but each DBR reflects a **comb** of narrow peaks rather than a single wide peak, and the two combs have slightly different tooth spacings. The cavity has low loss only at wavelengths where a front-mirror peak coincides with a rear-mirror peak; nowhere else does the round-trip reflectivity build up enough for lasing. Shifting one comb slightly by changing the temperature or index of one DBR slides its peaks across the other's, and the coincidence jumps to a different pair of teeth — a new lasing wavelength, far removed from the previous one.

How to make a DBR reflect as a comb: apply a slow envelope on top of the Bragg modulation. If the grating consists of short bursts of Bragg modulation separated by longer unmodulated segments — a **sampled grating** — its effective coupling profile is the Bragg fundamental times the sampling window. Fourier-transforming that product turns a single peak at $\pm 2 k_B$ into a series of prominent peaks spaced by the reciprocal of the sampling period. Each peak opens its own narrow stopband, and the DBR reflects at all of them at once.

Choosing different sampling periods for the two mirrors produces combs with different tooth spacings, and the Vernier tuning range grows as the two sampling periods approach each other. In practice, sampled-grating DBR lasers cover the whole C-band from a single device, and are the standard tunable transmitter for wavelength-division-multiplexed telecom links.

*All of the above use gratings with uniform amplitude and uniform period. What can we do by shaping the grating — varying its amplitude or its period along the length?*

---

## § 5. Engineered gratings {#sec-5}

Sections 1–4 treated the grating as uniform: constant coupling $\kappa$ and constant period $\Lambda$. Real gratings can vary either along their length, and the two knobs — spatial variation of amplitude, spatial variation of period — open up a family of engineered devices. We cover apodization, chirp, co-propagating coupling, and the extension of the Bragg momentum-conservation argument to nonlinear frequency conversion.

### § 5.1. Apodization: shaping the amplitude {#sec-5-1}

A uniform grating of length $L$ has a rectangular spatial window: full modulation over $[0, L]$, zero outside. Its reflectivity spectrum is (in the small-coupling limit) the Fourier transform of that rectangular envelope, so it has sinc-like sidelobes on either side of the main stopband. The stopband itself is a strong-reflection band; the sidelobes are weaker reflections at unwanted wavelengths. For a channel filter — dropping one wavelength from a stream of many — the sidelobes cause cross-talk between neighboring channels.

**Apodization** replaces the rectangular window with a smoother one:

$$\kappa(z) = \kappa_0\, w(z),$$

with $w(z)$ a window function that rises smoothly from zero at the ends of the grating to unity in the middle. Common choices — Gaussian, raised-cosine, Kaiser — are the same window shapes used in digital filter design. Apodization is that signal-processing operation applied to the grating's spectral response.

The trade-off is the standard windowing one: a smoother window suppresses sidelobes but broadens the main lobe. A Gaussian-apodized grating has essentially no sidelobes but a wider stopband than the same-length rectangular grating. Fiber Bragg gratings used as wavelength-division-multiplexing filters are almost always apodized to keep adjacent channels isolated, with the wider stopband accepted as the cost.

### § 5.2. Chirp: shaping the period {#sec-5-2}

**Chirp** varies the local period $\Lambda(z)$ along the grating. Via $\lambda_B = 2 n_\text{avg}\, \Lambda$, the local Bragg wavelength is a function of position. For a linear chirp,

$$\Lambda(z) = \Lambda_0 (1 + \alpha z), \qquad \lambda_B(z) = \lambda_{B, 0}(1 + \alpha z),$$

different parts of the grating reflect different wavelengths.

An incident wave at wavelength $\lambda$ propagates into the grating from the left, at first outside every local stopband, until it reaches the depth $z^*$ at which $\lambda_B(z^*) = \lambda$ — its "own" Bragg point. There it reflects. Shorter wavelengths turn around near the entrance; longer wavelengths propagate deeper before turning around. Different wavelengths therefore acquire different round-trip *times*, and the grating acts as a **dispersive reflector**: group delay as a function of wavelength has a controlled slope, engineered by the chirp profile.

The primary application is dispersion compensation in fiber-optic links. Standard telecom fiber has group-velocity dispersion of about $17\,\text{ps}/(\text{nm} \cdot \text{km})$: a pulse with 10 nm of spectral bandwidth broadens by 170 ps of temporal width after 1 km of propagation. A chirped fiber Bragg grating with the *opposite* sign of dispersion, of matched magnitude, undoes the broadening: the received pulse is recompressed to its original width. Real designs must match not just first-order dispersion but the slope (second-order dispersion) and polarization behavior across the spectrum; those refinements need the full transfer-matrix treatment of [§ 5 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-5).

A related use is intracavity dispersion compensation in femtosecond lasers, where the round-trip group-velocity dispersion from prisms, air, and the gain medium has to be cancelled to sustain pulses of picosecond duration or shorter. Chirped mirrors are the standard element for delivering a prescribed group-delay profile.

The mechanism is a direct reading of \eqref{eq:hyperbola}'s edge behavior: group velocity vanishes at the band edge, and its slope diverges. Chirping the grating slides that vanishing point in $z$, so different wavelengths hit their edge at different depths, integrate different accumulated phases, and emerge with the designed group delay.

### § 5.3. Co-propagating coupling and long-period gratings {#sec-5-3}

The coupled-mode analysis of [§ 2 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-2) handled a *counter*-propagating pair: forward and backward waves along the same waveguide, coupled by a grating with $G_1 = 2 k_B$ that supplies the round-trip momentum kick. The same formalism applies to a *co*-propagating pair: two guided modes of a waveguide, both moving in the same direction with wavenumbers $k_1 > k_2$, coupled by a grating with $G = k_1 - k_2$.

The coupled-mode equations for the two co-propagating amplitudes are

$$\frac{d A_1}{d z} = i\delta\, A_1 + i\kappa\, A_2, \qquad \frac{d A_2}{d z} = -i\delta\, A_2 + i\kappa\, A_1. \tag{12}\label{eq:copropag}$$

These look almost like the counter-propagating equations \eqref{eq:cme}, but with a critical sign difference: both terms on the right-hand side have coefficients of the same sign, not opposite signs. That single sign change flips the conservation law of the system.

Computing $d(\vert A_1 \vert^2 + \vert A_2 \vert^2) / dz$ from \eqref{eq:copropag} (differentiate each modulus squared, use the equations to eliminate $d A_i / dz$),

$$\frac{d}{dz}\left(\vert A_1 \vert^2 + \vert A_2 \vert^2\right) = 0.$$

The *sum* of the two mode powers is conserved: total power is conserved between the two co-propagating modes because both are forward-going and neither leaves the waveguide. Energy sloshes back and forth periodically between $A_1$ and $A_2$ along the grating, with a period set by $\kappa$.

Contrast with the counter-propagating case, where the conserved quantity is $\vert A \vert^2 - \vert B \vert^2$ — the *net* Poynting flux through any cross-section — and where inside the stopband the individual mode powers grow exponentially as a standing wave builds up between the two effective mirrors.

The two coupling situations are therefore physically distinct: counter-propagating coupling produces a stopband and Bragg reflection; co-propagating coupling produces periodic energy transfer between two guided modes.

**Long-period fiber gratings** exploit the co-propagating case. A grating with period much longer than the Bragg period — typically 100–500 $\mu\text{m}$ versus $\sim 0.5\,\mu\text{m}$ for a fiber Bragg mirror — couples the fundamental core-guided mode of a fiber to a co-propagating cladding mode. The cladding mode leaks out through the fiber jacket, so from the input's viewpoint the long-period grating acts as a wavelength-dependent loss: at wavelengths satisfying the phase-matching condition $\Lambda = \lambda_0 / (n_\text{core} - n_\text{cladding})$, power leaves the core and is lost. These devices are used as gain-flattening filters in erbium-doped fiber amplifiers, and as temperature and strain sensors where the loss-dip wavelength moves with the fiber's environment.

### § 5.4. Quasi-phase matching in nonlinear optics {#sec-5-4}

The last application takes the Bragg momentum-conservation argument outside linear wave propagation. Consider second-harmonic generation: an input wave at frequency $\omega$ drives, through the material's second-order nonlinear susceptibility $\chi^{(2)}$, an induced polarization at $2\omega$, and that polarization radiates a wave at $2\omega$.

For the induced polarization at $2\omega$ to drive a *growing* free wave at $2\omega$, its spatial phase — which travels with the input wave, so has wavenumber $2\, k(\omega)$ — must equal the free-space wavenumber at the harmonic, $k(2\omega) = 2\omega\, n(2\omega) / c$. Equating the two requires $n(\omega) = n(2\omega)$: the refractive index at the fundamental has to equal the refractive index at the harmonic. But any medium with normal dispersion has $n(\omega) < n(2\omega)$, so there is a phase mismatch

$$\Delta k = k(2\omega) - 2\, k(\omega) \neq 0.$$

The consequence is that the polarization and the free harmonic wave drift out of phase as they propagate, and after a **coherence length** $\pi / \Delta k$ they are $\pi$ out of phase and the polarization drives the wave *down* instead of up. The second-harmonic amplitude oscillates rather than growing, and the total conversion efficiency stays low.

The Bragg-inspired fix — **quasi-phase matching** (QPM) — is to periodically invert the sign of $\chi^{(2)}(z)$ along the propagation direction. Every half period of length $\pi / \Delta k$, the sign of the induced polarization flips, resynchronizing it with the free harmonic wave that has drifted $\pi$ ahead.

The Fourier picture makes this quantitative. Expand the modulated nonlinear susceptibility as

$$\chi^{(2)}(z) = \sum_m \chi_m^{(2)}\, e^{i m G z}, \qquad G = 2\pi / \Lambda,$$

where $\Lambda$ is the spatial period of the sign inversions. Each Fourier component $m$ makes a spatial-frequency contribution $mG$ available to the phase-matching equation — a "grating momentum" that can compensate a specific phase mismatch. Choosing $\Lambda$ so that $G = \Delta k$ compensates the fundamental mismatch: the polarization now drives a wave whose effective wavenumber is $2\, k(\omega) + G = k(2\omega)$, and the phase mismatch is closed by momentum supplied by the grating.

This is the same momentum-balance condition that produced Bragg reflection in [Picture 2 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#picture-2-elastic-scattering-with-reciprocal-lattice-momentum). What differs is the physical object being coupled: there, the momentum kick made forward and backward waves at the same frequency resonantly exchange amplitude; here, it keeps the induced polarization and the free harmonic wave in phase over long propagation distances. Two situations, one algebra.

Periodically poled lithium niobate (PPLN) and periodically poled KTP are the standard QPM materials, used across telecom wavelength conversion, entangled-photon-pair generation, and frequency-referencing devices. The design principle is the Bragg condition wearing a different physical hat: a momentum kick from a periodic modulation, tuned to close a mismatch the underlying medium alone cannot close.

---

## Closing

Every section reads \eqref{eq:hyperbola} — the Bragg dispersion $q^2 = \delta^2 - \kappa^2$ — at a specific operating point.

At $\delta = \pm\kappa$: the two edge standing waves and which of them sits at the lower frequency (§ 1). At $\delta = 0$ inside an infinite medium: the Bragg length $L_B = 1/\kappa$ (§ 2.1). Inside the stopband with two boundaries: the finite-mirror reflectivity $\tanh^2(\kappa L)$ (§ 2.2). Piecewise-constant modulation as fabricated hardware: the DBR (§ 3). Modulation in the presence of gain: the DFB laser and its DBR-laser and Vernier-tunable cousins (§ 4). Modulation shaped along its length: apodization, chirp, co-propagating coupling, and quasi-phase matching (§ 5).

The two ingredients that make all of it work were the two-wave truncation of the previous post's § 2 and the accessibility of both stopband edges from § 4. Every device-specific formula in this post follows from those two facts, taken through one universal hyperbola.
