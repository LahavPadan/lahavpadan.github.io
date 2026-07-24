# Bragg Mirrors, Laser Cavities, and Engineered Gratings

The previous post, [Coupled Modes, Bragg Structures, and Photonic Bandgaps](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/), takes a general $2 \times 2$ eigenvalue problem and lands it on a periodic index modulation — a **grating**{:#defn-grating}.

Two devices sit at the center of what follows:

- A **distributed Bragg reflector**{:#defn-dbr} (DBR) is a grating used as a wavelength-selective element. Most commonly it is a mirror that reflects strongly in a narrow band and transmits outside it, but the same object also serves as the reflecting boundary of a photonic-bandgap waveguide, as a wavelength-drop filter in a wavelength-multiplexed link, and as the resonator against which a [gain](#defn-gain) medium is placed to make a laser.
- A **distributed-feedback laser**{:#defn-dfb} (DFB) puts the same grating *inside* a [gain](#defn-gain) medium and uses Bragg reflection in place of end mirrors, so the wavelength of the laser is set by the grating rather than by the gain's emission peak.

Everything else developed here — apodization, chirp, long-period coupling, quasi-phase matching — is a variation on the same physics with the grating shaped or repurposed.

The results we use from the previous post, all justified in [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4):

- A grating with period $\Lambda$ singles out the **Bragg wavenumber** $k_B = \pi/\Lambda$. This is the wavenumber whose round trip through one period picks up a phase of $2\pi$, so that a forward wave near $k_B$ can be scattered by the grating into a backward wave near $-k_B$. The vacuum wavelength that satisfies this first-order condition is $\lambda_B = 2 n_\text{avg}\, \Lambda$, where $n_\text{avg}$ is the spatial average of the refractive index.

- Near this reference wavenumber, only two Fourier components of the field carry appreciable amplitude — the forward wave at $k \approx k_B$ and the Bragg-backscattered wave at $k - 2k_B \approx -k_B$. All other Fourier components are suppressed by $\Delta n / n_\text{avg}$, where $\Delta n$ is the amplitude of the refractive-index modulation (if $n(z) = n_\text{avg} + \Delta n \cos(2 k_B z)$, then $\Delta n$ is the maximum deviation from the average). Throughout, we write the field as

  $$E(z) = A(z)\, e^{i k_B z} + B(z)\, e^{-i k_B z},$$

  with slowly-varying envelopes $A$ (forward) and $B$ (backward).

- The two envelopes are governed by a **detuning** $\delta$ and a **coupling** $\kappa$,

  $$\delta = k - k_B, \qquad \kappa = \frac{\pi\, \Delta n}{\lambda_B}.$$

  Detuning measures how far the driving wavenumber sits from $k_B$; coupling measures how strongly the grating mixes the forward and backward waves.

- The two envelopes obey the dispersion relation

  $$q^2 = \delta^2 - \kappa^2, \tag{$\star$}\label{eq:hyperbola}$$

  where $q$ is the deviation of the Bloch wavenumber from $k_B$. Outside $\vert\delta\vert > \kappa$, $q$ is real and the field propagates. Inside $\vert\delta\vert < \kappa$, $q = i\alpha$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$, and the field decays exponentially. The range $\vert\delta\vert < \kappa$ is the **stopband**.

- The stopband is bounded on both sides at $\delta = \pm\kappa$, where $q = 0$: the forward and backward waves combine into a standing wave and the group velocity $v_g = d\omega/dq$ vanishes. Call the two frequencies at those boundaries $\omega_-$ and $\omega_+$. Both are physically accessible in the Bragg problem — a feature that separates it from the one-sided cutoffs (waveguide, plasma, relativistic massive field) treated in the [cutoff phenomena post](/posts/cutoff-phenomena/).

We read \eqref{eq:hyperbola} at a sequence of operating points, starting with $\omega_-$ and $\omega_+$: they are the natural first quantities to pin down because their difference *is* the stopband width, their standing-wave patterns show what a real wave looks like when it just fits inside the medium, and once we have both, the interior of the stopband is fixed by \eqref{eq:hyperbola}. [§ 1](#sec-1) finds them and derives the width. [§ 2](#sec-2) then moves into the stopband and asks how much of an incident wave a finite grating actually reflects. [§ 3](#sec-3) builds the [DBR](#defn-dbr) as a fabricated multilayer stack. [§ 4](#sec-4) places the grating against a [gain](#defn-gain) medium — the [DFB](#defn-dfb) laser (grating inside the gain) and the DBR laser (grating in a separate section). [§ 5](#sec-5) lets the grating vary along its length.

---

## § 1. The two ends of the stopband, $\omega_-$ and $\omega_+$ {#sec-1}

Inside the stopband ($|\delta| < \kappa$) \eqref{eq:hyperbola} gives $q^2 < 0$: the field decays exponentially and no wave propagates. The stopband is bounded above and below in $\omega$; call the two boundary frequencies $\omega_-$ (lower) and $\omega_+$ (upper). This section derives them two ways and reads off the stopband width from the phase geometry of the interfaces.

### § 1.1. Equal-mixture standing waves {#sec-1-1}

Set the driving spatial wavenumber to the Bragg value $k = k_B$, i.e. $\delta = 0$. The two-mode coupling matrix has zero diagonal and only the off-diagonal $\pm\kappa$ left. Its eigenvalues are $\pm\kappa$ — the two boundary frequencies $\omega_\pm = \omega_B \pm \kappa$ of the stopband, above and below the reference — and its eigenvectors are the equal mixtures

$$(A, B) = \frac{1}{\sqrt 2}(1, 1) \quad\text{and}\quad (A, B) = \frac{1}{\sqrt 2}(1, -1).$$

Substituting into $E(z) = A\, e^{i k_B z} + B\, e^{-i k_B z}$:

- $(1, 1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} + e^{-i k_B z} = 2 \cos(k_B z)$ — a **cosine standing wave**.
- $(1, -1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} - e^{-i k_B z} = 2i \sin(k_B z)$ — a **sine standing wave**.

Both have wavelength $2\pi/k_B = 2\Lambda$: exactly one full oscillation per two Bragg periods, or equivalently one intensity maximum per Bragg period, so their intensities are periodic with the modulation.

Where the intensities sit relative to the modulation is what will matter for [§ 1.2](#sec-1-2). The cosine standing wave peaks where $\cos(2 k_B z)$ peaks, which is where $\varepsilon(z) = n_\text{avg}^2 + \Delta\varepsilon \cos(2 k_B z)$ is largest — that is, in the high-index parts of the modulation. The sine standing wave peaks in the low-index parts.

### § 1.2. Which of $\omega_-$, $\omega_+$ lies lower {#sec-1-2}

The real-space shapes alone do not say which of the two standing waves has the lower frequency. To settle that, we extract $\omega^2$ directly from the wave equation.

The scalar Helmholtz equation for a periodic dielectric, derived as [the scalar-wave-equation refresher in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#picture-3-scalar-wave-equation), is

$$\frac{d^2 E}{dz^2} + \frac{\omega^2}{c^2}\, \varepsilon(z)\, E(z) = 0.$$

Multiply through by $E^*(z)$ and integrate over one Bragg period. Periodic boundary conditions make the boundary terms vanish, and

$$\int E^*\, \frac{d^2 E}{dz^2}\, dz + \frac{\omega^2}{c^2} \int \varepsilon(z)\, \vert E \vert^2\, dz = 0.$$

Solving for $\omega^2$,

$$\omega^2 = c^2\, \frac{-\int E^*\, (d^2 E / dz^2)\, dz}{\int \varepsilon(z)\, \vert E \vert^2\, dz}.$$

Integrating the numerator by parts once (boundary terms again vanish by periodicity) turns $E^*\, d^2 E/dz^2$ into $-\vert dE/dz \vert^2$, giving

$$\omega^2 = c^2\, \frac{\int \vert dE/dz \vert^2\, dz}{\int \varepsilon(z)\, \vert E \vert^2\, dz}. \tag{1}\label{eq:rayleigh}$$

For a genuine eigenmode of the wave equation, the right-hand side of \eqref{eq:rayleigh} is the actual $\omega^2$ of that mode. For any other trial field, it gives a variational estimate.

We now apply \eqref{eq:rayleigh} to the two edge modes. Both are pure sinusoids at the same wavenumber $k_B$, so their derivatives $dE/dz$ have the same shape and the numerators integrate to the same value. The only thing that separates them is the denominator, which depends on how the intensity $\vert E \vert^2$ overlaps the modulation $\varepsilon(z)$:

- The **cosine mode** concentrates its intensity in the high-index parts of the modulation, so $\int \varepsilon \vert E \vert^2\, dz$ is large. Larger denominator, smaller $\omega^2$.
- The **sine mode** concentrates its intensity in the low-index parts, so $\int \varepsilon \vert E \vert^2\, dz$ is small. Smaller denominator, larger $\omega^2$.

So $\omega_-$ is the cosine standing wave, concentrated in the high-index material, and $\omega_+$ is the sine standing wave, concentrated in the low-index material. Shifting the origin of coordinates by half a Bragg period swaps cosine and sine, but the rule — the mode concentrated in the high-index material lies at the lower frequency — holds regardless.

### § 1.3. Constructive interface reflection at the Bragg wavelength {#sec-1-3}

A second derivation replaces the smooth cosine modulation of § 1.1–§ 1.2 with a stack of layers of piecewise-constant index, and reads the constructive-reflection condition off the individual interface reflections. It is exact for a step-index profile — the multilayer stack we will build as a [DBR](#defn-dbr) in [§ 3](#sec-3) — and makes explicit the phase geometry of the individual layers, which we will also need in [§ 1.4](#sec-1-4) to derive the stopband width.

At normal incidence, an interface from refractive index $n_1$ into refractive index $n_2$ has amplitude reflection coefficient

$$r_{12} = \frac{n_1 - n_2}{n_1 + n_2}. \tag{2}\label{eq:fresnel}$$

Two properties of $r_{12}$ matter for what follows:

- **Sign.** Going from low to high index gives $r_{12} < 0$: the reflected amplitude is phase-shifted by $\pi$ relative to the incident amplitude. Going from high to low gives $r_{12} > 0$: no phase shift.
- **Magnitude.** For typical dielectric index differences (a few percent up to about 50%), $\vert r_{12} \vert$ is small, so each interface reflects only a fraction of the incident amplitude.

Consider now a stack of alternating high-index and low-index layers, each with a physical thickness $d_i$ chosen so that the product $n_i d_i$ — the **optical thickness**{:#defn-optical-thickness} of the layer, i.e. the physical thickness weighted by the refractive index — equals a quarter wavelength of some target vacuum wavelength $\lambda_0$:

$$n_i d_i = \frac{\lambda_0}{4}.$$

Optical thickness is what determines the one-way phase a wave picks up going through the layer: $(2\pi n_i / \lambda_0) d_i$. With the quarter-wave choice, one-way propagation contributes a phase of $(2\pi n_i / \lambda_0)(\lambda_0 / 4 n_i) = \pi/2$, and a round trip contributes $\pi$.

Compare two reflected amplitudes arriving back at the input plane just outside the stack:

- Reflection off the first air–high interface: phase $\pi$ from the reflection itself, no propagation.
- Reflection off the next interface (high to low): a round trip through the high layer contributes $\pi$, and the high-to-low reflection contributes no additional phase.

Both arrive at the input plane with total phase $\pi$. They combine constructively. The next pair of interfaces adds two more contributions with the same total phase, and so on down the stack.

{% include visualization.html src="fresnel-quarter-wave-phase.html" title="Reflection phase and quarter-wave propagation phase compared at one return plane" %}

Off the design wavelength $\lambda_0$, the round-trip phase per layer is no longer exactly $\pi$, and reflections from deeper and shallower layers begin to disagree in phase. The rate at which the disagreement accumulates is what sets the stopband width — made quantitative in [§ 1.4](#sec-1-4).

### § 1.4. The stopband width, from phase-error accumulation {#sec-1-4}

Combining the two boundaries $\delta = \pm\kappa$ of \eqref{eq:hyperbola} with the definition of $\kappa$ gives the stopband width in wavenumber, $\Delta k = 2\kappa$, and in frequency, $\Delta\omega = 2\kappa v_g$. The interface-counting picture of § 1.3 recovers the same number, and lets us see the same $\kappa$ in a different form.

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

The **stopband boundary** is the detuning at which the phase error over a *single* Bragg period is already $\pi$. Beyond that detuning, destructive interference within one Bragg period overwhelms the constructive contribution, and the mirror stops reflecting coherently even at zero depth.

That condition ties $\kappa$ to a physical length scale. At the stopband boundary, phase error accumulates at a rate of $\pi$ per length $1/\kappa$; that rate has units of inverse length, and is exactly $\kappa$. So $\kappa$ is the largest phase-error-accumulation rate for which coherent reflection still survives, and $1/\kappa$ is the length over which that maximum rate integrates to a full $\pi$.

Two quantities, one condition:

- The **stopband width** $2\kappa$ is the range of detunings for which the phase error stays below $\pi$ per Bragg period.
- The **penetration depth** $1/\kappa$ is the length over which, at the largest surviving detuning, that phase error accumulates to $\pi$.

They are reciprocals of each other because both come from the same $\pi$ threshold.

*The two standing waves and the interface-counting picture both describe an infinite medium. In a real device the grating has a finite length, and the wave reflects off two boundaries rather than propagating forever. What sets how much of the incident amplitude actually comes back?*

---

## § 2. Finite gratings: how deep, how strong {#sec-2}

### § 2.1. Semi-infinite grating: the decay scale $1/\kappa$ {#sec-2-1}

At $\delta = 0$ the dispersion \eqref{eq:hyperbola} gives $q^2 = -\kappa^2$, so $q = \pm i\kappa$ and the two spatial factors are $e^{+\kappa z}$ and $e^{-\kappa z}$. In a semi-infinite grating occupying $z > 0$ the growing solution is unbounded and is excluded, so the field decays as $e^{-\kappa z}$: the amplitude falls by a factor of $e$ over the length $1/\kappa$. This decay scale is a property of the *medium*, not of any particular device. In a real device the grating is finite, and its far boundary changes what the wave does.

### § 2.2. Finite grating: the reflectivity {#sec-2-2}

The coupled-mode equations for the envelopes $A(z)$ and $B(z)$, derived at [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) from the two-Fourier-component truncation, read $dA/dz = i\delta A + i\kappa B$ and $dB/dz = -i\delta B - i\kappa A$. At $\delta = 0$ the diagonal terms vanish and only the off-diagonal coupling remains:

$$\frac{d}{dz} \begin{pmatrix} A \\ B \end{pmatrix} = \begin{pmatrix} 0 & i\kappa \\ -i\kappa & 0 \end{pmatrix} \begin{pmatrix} A \\ B \end{pmatrix}. \tag{3}\label{eq:cme}$$

The off-diagonal has the same $\kappa$ as before; the factor $i$ is a phase convention, and will affect only the phase (not the power) of the reflected wave.

Differentiating either component of \eqref{eq:cme} and substituting the other back in decouples the pair,

$$\frac{d^2 A}{dz^2} = \kappa^2\, A, \qquad \frac{d^2 B}{dz^2} = \kappa^2\, B.$$

Both envelopes satisfy the same scalar equation; both are combinations of $\cosh(\kappa z)$ and $\sinh(\kappa z)$. The two integration constants for $A(z)$ are $A(0)$ and $A'(0) = i\kappa B(0)$ (read off \eqref{eq:cme}); the same procedure applied to $B(z)$ uses $B(0)$ and $B'(0) = -i\kappa A(0)$. Solving gives the propagation matrix for a grating of length $L$,

$$\begin{pmatrix} A(L) \\ B(L) \end{pmatrix} = \begin{pmatrix} \cosh(\kappa L) & i\, \sinh(\kappa L) \\ -i\, \sinh(\kappa L) & \cosh(\kappa L) \end{pmatrix} \begin{pmatrix} A(0) \\ B(0) \end{pmatrix}.$$

For a wave incident from the left with no wave coming in from the right, $A(0) = A_\text{in}$ is given and $B(L) = 0$ (no back-illumination). Reading the second row for $B(L) = 0$ and solving for $B(0)/A(0)$,

$$\frac{B(0)}{A(0)} = i \tanh(\kappa L),$$

and the power reflectivity is

$$\boxed{\, R = \tanh^2(\kappa L). \,} \tag{4}\label{eq:tanh-refl}$$

The transmitted amplitude comes from the first row: $A(L)/A(0) = \operatorname{sech}(\kappa L)$, so $T = \operatorname{sech}^2(\kappa L)$.

Since $\tanh^2 + \operatorname{sech}^2 = 1$, we have $R + T = 1$: energy is conserved, as it must be in a lossless grating.

The envelopes that satisfy both boundary conditions are

$$A(z) = \frac{\cosh[\kappa (L - z)]}{\cosh(\kappa L)}, \qquad B(z) = i\, \frac{\sinh[\kappa (L - z)]}{\cosh(\kappa L)}. \tag{5}\label{eq:envelopes}$$

They are worth comparing side by side with the semi-infinite decay of § 2.1:

- **Semi-infinite grating.** The field decays purely as $e^{-\kappa z}$: one exponential mode, forced by boundedness at $z = \infty$.
- **Finite grating.** The field is a specific mixture of $\cosh$ and $\sinh$, whose relative weights are set by the far boundary $B(L) = 0$. As $\kappa L$ grows the far boundary retreats, and near the entrance the finite envelope looks more and more like the semi-infinite decay.

{% include visualization.html src="bragg-mirror-penetration.html" title="Infinite-medium decay, finite-boundary envelopes, and Bragg-mirror reflectivity" %}

The dimensionless product $\kappa L$ is the physical length of the grating in units of the decay length $1/\kappa$. It controls everything: reflectivity, transmission, and the shape of the internal envelope.

Setting a target reflectivity of $R > 0.99$ and solving \eqref{eq:tanh-refl},

$$\kappa L > \operatorname{arctanh}(\sqrt{0.99}) \approx 2.99.$$

So a grating tuned to $\delta = 0$ needs a physical length of about $3/\kappa$ to exceed 99% power reflectivity.

*The reflectivity formula $R = \tanh^2(\kappa L)$ tells us $\kappa$ and $L$ jointly control the mirror. What sets $\kappa$ in a stack we actually build, and how many layers of what index difference do we need?*

---

## § 3. The DBR: a Bragg grating in fabricated hardware {#sec-3}

We now build the [DBR](#defn-dbr) as a physical multilayer, and translate the coupled-mode formulas of § 2 into the parameters an engineer picks: layer indices, layer thickness, and number of periods. Both quantities the § 2 result asked for — $\kappa$ and the number of layers — turn out to be set by one number, the **index contrast** $\Delta n = n_H - n_L$. § 3.1 derives the exact per-cell transfer matrix and reads off how quickly reflectivity saturates in $N$; § 3.2 shows the same $\Delta n$ fixes $\kappa = 2\Delta n / \lambda_0$ and thus the stopband width.

### § 3.1. The quarter-wave stack: reflectivity of an $N$-period mirror {#sec-3-1}

A standard [DBR](#defn-dbr) alternates layers of high index $n_H$ and low index $n_L$, each of optical thickness $\lambda_0 / 4$. From § 1.3, this is the geometry in which all interface reflections add coherently at $\lambda_0$.

Take the exact route through the [transfer-matrix formalism of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-8). In each homogeneous layer, the scalar wave equation is $E'' + k_i^2 E = 0$ with $k_i = \omega n_i / c$, and the layer transfer matrix that relates $(E, E')$ at the two faces is

$$T_i = \begin{pmatrix} \cos(k_i d_i) & (1/k_i)\sin(k_i d_i) \\ -k_i \sin(k_i d_i) & \cos(k_i d_i) \end{pmatrix}, \qquad \det T_i = 1.$$

The unit cell is one high layer followed by one low layer, so $T_\text{cell} = T_L T_H$. At the design wavelength, $k_i d_i = \pi/2$, each $T_i$ simplifies to $\begin{pmatrix} 0 & 1/k_i \\ -k_i & 0 \end{pmatrix}$, and

$$T_\text{cell} = \begin{pmatrix} -n_H/n_L & 0 \\ 0 & -n_L/n_H \end{pmatrix}.$$

The trace is $-(n_H/n_L + n_L/n_H)$; for any $n_H \neq n_L$ it is more negative than $-2$, so $|\text{tr}(T_\text{cell})| > 2$ and the wave is evanescent — a direct check that the mirror is inside a stopband at its design wavelength.

For a stack of $N$ high–low pairs plus a final high layer, sandwiched between a substrate of index $n_s$ and an incident medium of index $n_0$, cascading $T_\text{cell}^N$ and imposing the outgoing-only condition at the far side gives a closed form for the reflectivity at the design wavelength,

$$R = \left( \frac{n_0\, n_L^{2N} - n_s\, n_H^{2N}}{n_0\, n_L^{2N} + n_s\, n_H^{2N}} \right)^2. \tag{6}\label{eq:dbr-refl}$$

How quickly $R$ approaches 1 as we add periods depends on the ratio $n_H / n_L$:

- **Large ratio** — $n_H / n_L$ well above 1. The factor $(n_H / n_L)^{2N}$ dominates the denominator quickly, and $R$ saturates near unity for $N \sim 10$. Dielectric stacks with Ta$_2$O$_5$ over SiO$_2$ have $n_H / n_L \approx 1.5$, and 10–15 periods reach $R > 99\%$.
- **Small ratio** — $n_H / n_L$ close to 1. Saturation is slower. Semiconductor DBRs based on GaAs/AlAs have $n_H / n_L \approx 1.15$ and need 25–30 periods.

The exact per-cell evanescent rate falls out of the same trace: solving $\cosh(\alpha\Lambda) = |\text{tr}(T_\text{cell})|/2$ gives the per-period decay $\alpha$. For $n_H/n_L = 1.15$ (typical semiconductor), $|\text{tr}|/2 \approx 1.083$, giving $\alpha\Lambda \approx 0.408$; twenty periods deliver $\alpha N \Lambda \approx 8.2$, so $R = \tanh^2(8.2) \approx 1 - 10^{-7}$: essentially perfect. Real DBRs use 20–40 periods for this reason.

For a large enough $N$, \eqref{eq:dbr-refl} agrees with the coupled-mode formula $R = \tanh^2(\kappa L)$ derived in § 2.2. The two apply in complementary limits — \eqref{eq:dbr-refl} is exact for a few strong interfaces, and $\tanh^2(\kappa L)$ is the smooth-envelope approximation for many weak interfaces — and they overlap in the range where both are accurate.

### § 3.2. Bandwidth from the index difference {#sec-3-2}

The formula $\kappa = \pi\, \Delta n / \lambda_B$, derived at [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4), is for a sinusoidal index modulation. A DBR is instead *piecewise-constant* — the refractive index takes only two values, $n_H$ and $n_L$. Its Fourier expansion has a fundamental cosine coefficient of $4/\pi$ times the peak-to-average amplitude of the square wave, so the coupling seen at the fundamental Bragg wavelength is

$$\kappa_\text{DBR} = \frac{2\, \Delta n}{\lambda_0}, \qquad \Delta n \equiv n_H - n_L.$$

The stopband width in frequency, $\Delta\omega = 2 \kappa v_g$, then translates into a ratio between the stopband width and the center frequency:

$$\frac{\Delta \omega}{\omega_0} = \frac{4}{\pi}\, \frac{\Delta n}{n_\text{avg}}. \tag{7}\label{eq:dbr-bw}$$

The left-hand side — the stopband width $\Delta\omega$ divided by the center frequency $\omega_0$ — is the **fractional bandwidth** of the mirror: what fraction of its center frequency the mirror covers in a single stopband. Two working numbers:

- **High-index difference dielectric stack** — $\Delta n / n_\text{avg} \approx 0.5$. Fractional bandwidth $\approx 60\%$: broadband, covers most of the visible or a wide near-infrared window.
- **Semiconductor DBR** — $\Delta n / n_\text{avg} \sim 0.05$. Fractional bandwidth $\approx 6\%$: narrow enough for single-mode laser use ([§ 4](#sec-4)), too narrow for broadband applications.

The same $\kappa$ appears in the decay scale $1/\kappa$ and, via \eqref{eq:tanh-refl}, in the reflectivity $R = \tanh^2(\kappa L)$ of a physical grating.

That ties the two design axes together. For a fixed index difference $\Delta n$, a shorter mirror (smaller $L$) needs a larger $\kappa$ to hit the same reflectivity — but a larger $\kappa$ also widens the stopband. Bandwidth and physical length trade off through the shared $\kappa$, and the [DBR](#defn-dbr) designer picks the balance for the application.

### § 3.3. Higher-order stopbands and the structure factor {#sec-3-3}

A square-wave DBR has stopbands not just at $\lambda_0$, but also at odd sub-multiples $\lambda_0 / 3, \lambda_0 / 5, \ldots$ At those shorter wavelengths, the same quarter-wave layer is also a $3\lambda/4, 5\lambda/4, \ldots$ layer, satisfying the Bragg condition at higher order.

The strength of the $m$-th stopband is set by the corresponding Fourier coefficient $\varepsilon_m$ of the modulation profile — the modulation's **structure factor**. The [Bragg-condition background in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3) develops this for a general periodic $\varepsilon(z)$. The rule: a purely sinusoidal modulation has only the fundamental $\varepsilon_{\pm 1}$ nonzero and produces only the first-order stopband, while a square-wave modulation has $\varepsilon_m \propto 1/m$ for odd $m$ (and zero for even $m$), producing weaker higher-order stopbands at each odd $m$.

Two engineering consequences:

- To *suppress* the higher-order stopbands, shape the modulation to look more sinusoidal — only $\varepsilon_{\pm 1}$ nonzero. In fiber Bragg gratings, a smooth amplitude envelope (apodization, [§ 5.1](#sec-5-1)) does this approximately.
- To *engineer* multiple simultaneous stopbands at prescribed wavelengths, choose a modulation whose Fourier spectrum has content at the desired periods. [§ 5](#sec-5) develops this for sampled gratings, which support multi-wavelength lasing.

### § 3.4. Off-normal incidence and Brewster's angle {#sec-3-4}

Every calculation so far has assumed the wave hits the stack perpendicular to the layers. In many devices the wave arrives at an angle instead — inside a semiconductor waveguide, for instance, the in-plane mode strikes the [DBR](#defn-dbr) at whatever internal angle the waveguide geometry sets. At off-normal incidence, three things change at once:

- **The one-way phase per layer picks up a $\cos\theta_i$.** With the wave at angle $\theta_i$ inside a layer of physical thickness $d_i$ (set by Snell's law), the phase accumulated in one traversal is $(2\pi n_i / \lambda_0)\, d_i\, \cos\theta_i$ instead of $(2\pi n_i / \lambda_0)\, d_i$: the wavevector's normal component $k_i \cos\theta_i$ is what advances the stack coordinate. This is the same physics as the [Bragg condition of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3), $m\lambda_0 = 2 n_\text{avg} \Lambda \sin\theta$: at off-normal incidence, the round-trip phase per period equals $\pi$ at a shorter vacuum wavelength

  $$\lambda_B(\theta_0) = 2\left[n_H d_H \cos\theta_H + n_L d_L \cos\theta_L\right],$$

  smaller than the normal-incidence value $\lambda_B(0) = 2(n_H d_H + n_L d_L)$.
- **The two polarizations acquire different interface reflectivities.** TE (electric field perpendicular to the plane of incidence) and TM (electric field in the plane of incidence, with a component along the layer normal) see the boundary conditions differently.
- **Polarization sensitivity of $\kappa$.** Since $\kappa$ is built from the interface reflections, it inherits their polarization dependence, and TE and TM acquire distinct stopbands.

{% include visualization.html src="oblique-bragg-phase.html" title="Why off-normal incidence shifts the Bragg wavelength through the normal wavevector component" %}

The polarization split has a concrete origin. The reflection coefficient at an interface is set by matching the *tangential* components of $E$ and $H$ across the boundary. For TE, the electric field lies entirely in the plane of the interface, so the matching involves the full $E$ and the tangential component of $H$, which picks up a $\cos\theta$. For TM, the electric field has a component along the interface normal, so the matching involves the tangential component of $E$ (which itself picks up a $\cos\theta$) and the full $H$. The two conditions therefore trade which side of the interface carries the cosine, giving

$$r_\text{TE} = \frac{n_1 \cos\theta_1 - n_2 \cos\theta_2}{n_1 \cos\theta_1 + n_2 \cos\theta_2}, \qquad r_\text{TM} = \frac{n_2 \cos\theta_1 - n_1 \cos\theta_2}{n_2 \cos\theta_1 + n_1 \cos\theta_2}. \tag{8}\label{eq:fresnel-full}$$

In TE the cosines multiply the $n$ on the same side of the interface; in TM they multiply the $n$ on the *opposite* side. That switch is what lets the TM numerator vanish at a non-normal angle, while the TE numerator never does. At $\theta_1 = 0$ both reduce to \eqref{eq:fresnel}. Away from zero, the two split — and TM does something dramatic:

$$r_\text{TM} = 0 \quad\text{when}\quad \tan\theta_1 = \frac{n_2}{n_1}. \tag{9}\label{eq:brewster}$$

The angle $\theta_1$ satisfying this is called **Brewster's angle**. At it, TM light passes through the interface with zero reflected amplitude.

The mechanism deserves a moment. An incident electric field drives the electrons in the second medium into oscillation along the direction of the transmitted field. Those oscillating charges are electric dipoles, and it is *their* re-radiation that produces the reflected wave. An oscillating electric dipole, however, cannot radiate along its own axis of oscillation — the radiation pattern has a node in that direction. For TM polarization at Brewster's angle, Snell's law places the reflected ray precisely along the direction in which the induced dipoles point — the very direction they cannot radiate into. There is no reflected wave. TE polarization has no analogous angle: its $E$-field is perpendicular to the plane of incidence by construction, so its induced dipoles point perpendicular to that plane too, while the reflected ray always sits *inside* the plane of incidence — the dipole axis and the reflected direction are perpendicular to each other at every angle, never coincident.

{% include visualization.html src="te-tm-boundary-admittance.html" title="How off-normal incidence distinguishes TE and TM boundary admittances" %}

The consequence for a [DBR](#defn-dbr): as the in-medium angle approaches Brewster's angle, the TM reflection coefficient shrinks toward zero, the TM coupling $\kappa_\text{TM}$ shrinks with it, and the TM stopband narrows and eventually closes. The TE stopband stays open, so at that angle the DBR reflects TE and transmits TM at the same wavelength — a polarization-selective mirror.

{% include visualization.html src="brewster-stopband-closure.html" title="Why TE reflections accumulate while the TM stopband closes at Brewster incidence" %}

Whether any of this matters depends on the internal mode angle of the device. In a vertical-cavity surface-emitting laser ([§ 4](#sec-4)), the mode is very close to normal incidence and polarization effects are negligible: normal-incidence design suffices. In edge-emitting waveguide lasers where the internal angle is far from zero, TE and TM may need separate [DBR](#defn-dbr) designs.

*A [DBR](#defn-dbr) is a passive wavelength-selective mirror. When we place the grating against a [gain](#defn-gain) medium — inside it, outside it, or spread across multiple sections — the reflection turns into feedback, and what we get is a laser whose wavelength is set by the grating. Which mode wins, and how do we get a single one?*

---

## § 4. Bragg feedback in lasers: DFB and DBR {#sec-4}

A laser combines a **gain medium**{:#defn-gain}, which amplifies the field, with a **cavity**{:#defn-cavity}, which feeds the field back on itself so that [gain](#defn-gain) accumulates coherently over many round trips. If the cavity has flat end mirrors, its reflectivity is the same at every wavelength and the laser has no built-in preference for one frequency over another. Replacing one or both of those mirrors — or the entire cavity — with a Bragg grating gives *wavelength-selective* feedback, and forces the laser to operate inside the grating's stopband. Two architectures capture the two main design choices:

- The [DFB](#defn-dfb) laser puts the [DBR](#defn-dbr) grating inside the same waveguide as the [gain](#defn-gain) — gain and feedback are co-located, distributed continuously along the same length.
- The DBR laser puts the [DBR](#defn-dbr) grating in a separate passive section outside the [gain](#defn-gain) — gain and feedback are in physically distinct sections, controlled by different electrical contacts.

The rest of this section develops both, plus a tunable extension of the DBR laser that uses two combs of reflection peaks to reach across the whole telecom band.

### § 4.1. Why flat mirrors do not pick a wavelength {#sec-4-1}

The problem the [DBR](#defn-dbr) and [DFB](#defn-dfb) solve is easiest to see against the reference case: a semiconductor waveguide of length $L$ and effective index $n_\text{eff}$, terminated by flat end mirrors — the two end faces of the crystal. Their reflectivity, from \eqref{eq:fresnel} with $n_1 = n_\text{eff} \approx 3.5$ inside and $n_2 = 1$ outside, is $R \approx 0.3$, and — crucially — it is the same at every wavelength.

That single property is what makes the flat-mirror laser a poor wavelength-selective element. The [cavity](#defn-cavity) supports a comb of resonant modes at frequencies $\nu_n = n \cdot c / (2 n_\text{eff} L)$, with mode spacing (the **free spectral range**) $\Delta\nu_\text{FSR} = c / (2 n_\text{eff} L)$. Each mode is a standing wave fitting an integer number of half-wavelengths between the mirrors. The [gain](#defn-gain) medium has an emission bandwidth of many THz — thousands of times the FSR — so the comb contains many thousands of modes, and every mode has essentially the same mirror loss because a flat mirror does not discriminate by wavelength. Which mode actually lases is set by small differences in gain across the emission spectrum, and since gain depends on drive current and temperature, the winning mode drifts and hops as those conditions change.

That behaviour — many densely-spaced modes, weakly discriminated, prone to hopping — is unacceptable for coherent optical communications, precision spectroscopy, and interferometric sensing. The fix is a wavelength-selective mirror, and where the grating sits relative to the [gain](#defn-gain) determines what device we get.

### § 4.2. DFB: the grating co-located with the gain {#sec-4-2}

The [DFB](#defn-dfb) architecture writes a Bragg grating directly into the active waveguide. There are no flat end mirrors; feedback is distributed continuously along the grating. Two properties of the resulting device drive its design.

**A distributed grating is itself a cavity.** In a flat-mirror laser the round trip is well-defined — the field bounces between two identifiable planes and lases when round-trip [gain](#defn-gain) exceeds round-trip loss. In a grating, the "round trip" is smeared over many decay lengths $1/\kappa$, but the physics is the same: at a frequency close to one of the two stopband boundary frequencies $\omega_\pm$ of [§ 1](#sec-1), the group velocity $v_g = d\omega/dq$ is small (the $\omega(k)$ dispersion is flat at each boundary since $q = 0$ there), and the field accumulates round-trip-equivalent phase inside a length or two of $1/\kappa$. Specific frequencies inside the stopband — the ones for which the grating's boundary conditions allow a coherent resonance — behave like the standing modes of a real [cavity](#defn-cavity), with the grating acting as both mirrors and cavity at once.

**A stopband is a wavelength-selective filter.** Frequencies inside the stopband cannot propagate at all: from \eqref{eq:hyperbola}, $|\delta| < \kappa$ gives $q^2 < 0$, so the mode decays exponentially rather than travelling — [as derived in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-6). An incident wave at those frequencies is therefore turned back almost entirely, while frequencies outside the stopband propagate through and are reflected only by the weak boundary contributions. The lasing mode is forced into the reflecting window, so it is confined to a bandwidth of $2\kappa v_g$ ([§ 1.4](#sec-1-4)), containing a small handful of modes rather than the thousands of the flat-mirror comb.

Which of those handful wins, and can we guarantee that only one does? Two mechanisms decide.

#### Which mode wins: density of states and field–gain overlap {#sec-4-2-1}

The two standing-wave modes $\omega_-$ and $\omega_+$ of § 1 both have $q = 0$. Two independent physical enhancements push spontaneous and stimulated emission preferentially into them.

**Density of states.** The number of allowed field modes per unit frequency in a 1D dispersion $\omega(q)$ is

$$\rho(\omega) = \frac{1}{\pi\, v_g}$$

per unit length. This comes from a change of variables: allowed $q$ values in a box of length $L$ are equally spaced with density $L / (2\pi)$ per unit $q$; converting to frequency via $\rho(\omega)\, d\omega = \rho(q)\, dq$ and counting both branches of the dispersion (positive and negative $q$) gives $\rho(\omega) = 1 / (\pi v_g)$. Near $\omega_\pm$, $v_g \to 0$, and $\rho(\omega)$ diverges as an inverse square root: $\rho(\omega) \propto 1 / \sqrt{\omega - \omega_\pm}$.

The rate at which the [gain](#defn-gain) medium's excited atoms deposit energy into any particular mode is proportional to the density of states at that mode's frequency. The $\omega_\pm$ modes are therefore populated much faster than modes deeper inside the stopband — the emitters preferentially "aim" at $\omega_\pm$.

**Field–gain spatial overlap.** The two $\omega_\pm$ modes concentrate their intensity at complementary positions in one Bragg period ([§ 1.1](#sec-1-1)) — one in the high-index material, the other in the low-index material. If the [gain](#defn-gain) material sits at the intensity maxima of one of them, the effective gain per unit length seen by that mode is

$$\gamma_\text{eff} = \gamma_0\, \frac{\int_\text{gain region} \vert E(z) \vert^2\, dz}{\int \vert E(z) \vert^2\, dz},$$

where $\gamma_0$ is the intrinsic gain coefficient of the active material. The ratio can be substantially above unity when the mode's intensity coincides with the gain region. Semiconductor [DFBs](#defn-dfb) place their quantum wells in the high-index material of the grating; that puts the gain where the cosine standing wave — the $\omega_-$ mode of § 1.2 — has its peaks. The $\omega_-$ mode therefore sees enhanced $\gamma_\text{eff}$, while $\omega_+$ sits in the low-index region and sees the base $\gamma_0$.

Both mechanisms push the laser toward the lower-frequency mode $\omega_-$. That is not, however, enough on its own to guarantee that only one mode lases.

#### The two-mode problem and the quarter-wave defect {#sec-4-2-2}

A pure index-modulated [DFB](#defn-dfb) has $\omega_-$ and $\omega_+$ with nearly the same net gain — the density-of-states enhancement is identical at both (both have $v_g \to 0$), and only the overlap enhancement of § 4.2.1 discriminates. Small fabrication perturbations can swing the balance, and the laser hops unpredictably between the two as it operates.

Two remedies:

- **Insert a $\lambda/4$ phase shift at the grating center.** A physical spacer of quarter-wave optical thickness, placed halfway along the grating, changes the boundary condition felt by the field. In an unshifted grating $\omega_-$ and $\omega_+$ are related by translating along the grating by half a Bragg period; the $\lambda/4$ shift breaks that translation symmetry and creates a *single* defect mode localized around the shift point, at the exact center of the stopband. The mode is spatially symmetric under reflection about the shift point and has no equal-frequency partner. It is a localized state inside the photonic bandgap, decaying exponentially into the surrounding grating with the center-gap decay length $1/\kappa$. This defect mode is the analog of an impurity state in an electronic semiconductor bandgap. The $\lambda/4$-shifted [DFB](#defn-dfb) is the industry-standard single-mode telecom laser.

- **Gain-coupled modulation.** If the modulation is not purely in the refractive index but also in the [gain](#defn-gain) — the modulation has both real and imaginary parts — the two $\omega_\pm$ modes overlap the modulation differently. One overlaps the gain maxima and sees higher net gain; the other overlaps the loss maxima and sees lower net gain. The tie between them is broken without any structural phase shift, and single-mode operation is intrinsic. § 4.3 develops this.

### § 4.3. Index-coupled versus gain-coupled DFB {#sec-4-3}

The modulation $\varepsilon(z) = \bar\varepsilon + \Delta\varepsilon(z)$ can carry both a real and an imaginary part,

$$\Delta\varepsilon(z) = \Delta\varepsilon'(z) + i\, \Delta\varepsilon''(z).$$

The real part $\Delta\varepsilon'$ modulates the refractive index — everything above has used this alone. The imaginary part $\Delta\varepsilon''$ modulates [gain](#defn-gain) or loss; see [the complex-response section of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-8) for the sign convention. Real semiconductor [DFBs](#defn-dfb) have both, and the two limits behave qualitatively differently:

- **Pure index coupling** ($\Delta\varepsilon'' = 0$). $\omega_-$ and $\omega_+$ sit nearly symmetrically with equal loss. Mode selection is fragile; single-mode operation needs a $\lambda/4$ shift.
- **Pure gain coupling** ($\Delta\varepsilon' = 0$). The two $\omega_\pm$ modes split in net [gain](#defn-gain) by their overlap with the gain modulation. Single-mode operation is intrinsic. The fabrication cost is that gain coupling requires physically corrugating the active layer or using a periodic quantum-well structure — much harder than the smooth index grating of an index-coupled DFB.

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

The result is a pair of integral transforms relating $\chi'$ and $\chi''$: specify one at every frequency and the other is determined. (These are commonly called the Kramers–Kronig relations.) In a semiconductor [DFB](#defn-dfb) the immediate consequence is that changing the carrier density to modulate the [gain](#defn-gain) necessarily also modulates the refractive index, and vice versa. An exactly pure index grating and an exactly pure gain grating are idealizations, and a fabricated device generally contains some of both. Design lets us pick the operating point and the grating phase to weight one component over the other, but it does not eliminate the companion response.

### § 4.4. DFB linewidth {#sec-4-4}

The linewidth of a laser — the frequency-domain width of its emission peak — is set by a competition between coherent [gain](#defn-gain) and incoherent noise. Three factors dominate for a [DFB](#defn-dfb):

- **Cavity Q.** How many times the field bounces coherently before losing itself to residual loss. Narrow linewidth needs high Q, which needs long gratings and high $\kappa$ (so reflectivity approaches unity at both effective mirrors).
- **Spontaneous emission** into the lasing mode. Even in an active [cavity](#defn-cavity), some fraction of the atomic transitions emit at random times with random phase, adding a phase-noise floor to the coherent field. The rate at which these random kicks accumulate sets a fundamental linewidth limit.
- **Amplitude–phase coupling** through the carrier-density-dependent index. In a semiconductor, changing the number of carriers changes both the [gain](#defn-gain) (real part of the response) and the refractive index (imaginary part), through the causal link of § 4.3.1. Every amplitude fluctuation therefore drags a phase fluctuation along with it, amplifying the impact of amplitude noise on the linewidth. This coupling is captured by a dimensionless factor $\alpha_H$ — typically 2 to 5 in InGaAsP semiconductor lasers — that multiplies the noise contribution by $(1 + \alpha_H^2)$.

Putting the three together, the fundamental linewidth is

$$\Delta\nu = \frac{\pi\, h\nu\, (\Delta\nu_c)^2\, n_{sp}}{P_\text{out}}\, (1 + \alpha_H^2), \tag{10}\label{eq:linewidth}$$

with $\Delta\nu_c$ the cold-cavity linewidth, $n_{sp}$ the spontaneous-emission factor, and $P_\text{out}$ the output power. High-power high-Q [DFBs](#defn-dfb) achieve 100 kHz to 1 MHz — hundreds of times narrower than a flat-mirror multi-mode laser, but still limited by the $(1 + \alpha_H^2)$ amplification.

External-cavity DFB extensions (adding a long external grating or an extended feedback path) push the cold-cavity linewidth down, and can reach below 1 kHz for coherent optical communication.

### § 4.5. Tuning a DFB {#sec-4-5}

Tuning a [DFB](#defn-dfb) requires shifting its Bragg wavelength $\lambda_B = 2 n_\text{avg}\, \Lambda$. The physical period $\Lambda$ is fixed by lithography, so tuning must change $n_\text{avg}$. Two mechanisms are practical:

- **Temperature.** The thermo-optic effect and thermal expansion give a modest temperature dependence to the effective index — in InGaAsP, about $0.1$ nm of wavelength shift per K. Total tuning range around 5 nm; response time in milliseconds (set by thermal diffusion in the chip).
- **Current injection.** Injected carriers change the refractive index directly (free-carrier plasma effect and band-filling). Fast — nanoseconds — but only about $0.01$ nm per mA, and with unwanted coupling to output power (more current means more [gain](#defn-gain)).

Both mechanisms tune the *entire* laser (grating and gain together), and both are limited to a few nm. For wider tuning, the grating and gain have to be electrically separated so their indices can move independently — the DBR laser architecture.

### § 4.6. DBR laser: grating outside the gain {#sec-4-6}

A **DBR laser** places the Bragg grating in a *separate* section of the waveguide from the [gain](#defn-gain). The gain sits in a central active section, and one or both ends of the waveguide are terminated by a passive [DBR](#defn-dbr) grating that acts as a wavelength-selective mirror. The grating and the gain are electrically isolated — separate contacts, separate current-injection paths — so their refractive indices can be tuned independently.

Three tuning strategies follow from that independence:

- **Grating-only tune.** Change the index of the DBR section while leaving the [gain](#defn-gain) section fixed. This shifts the Bragg wavelength but leaves the total [cavity](#defn-cavity) length (and the mode spacing) essentially unchanged. As $\lambda_B$ moves, it crosses successive cavity modes, and the laser hops from one to the next.
- **Cavity-only tune.** Insert a passive phase-shift section between the grating and the gain, and change its index. This shifts the cavity modes without moving the Bragg wavelength. Continuous tuning over one free spectral range is possible without a mode hop.
- **Combined.** Tune both the grating and the phase section together, keeping a specific mode centered in the stopband as the stopband moves. This is the widest continuous-tuning strategy with a single grating.

The DBR laser has more sections to control than a [DFB](#defn-dfb) — typically three or four, each with its own contact — but it can tune further, without mode hops, using the combined strategy.

### § 4.7. Vernier tuning with sampled gratings {#sec-4-7}

Single-grating architectures tune over at most about 10 nm continuously. Extending this to the full telecom C-band — 40 nm or more — requires two gratings playing against each other, exploiting the same principle mechanical Vernier calipers use.

The setup uses two [DBRs](#defn-dbr) bracketing a [gain](#defn-gain) section, but each DBR reflects a **comb** of narrow peaks rather than a single wide peak, and the two combs have slightly different tooth spacings. The [cavity](#defn-cavity) has low loss only at wavelengths where a front-mirror peak coincides with a rear-mirror peak; nowhere else does the round-trip reflectivity build up enough for lasing. Shifting one comb slightly by changing the temperature or index of one DBR slides its peaks across the other's, and the coincidence jumps to a different pair of teeth — a new lasing wavelength, far removed from the previous one.

How to make a [DBR](#defn-dbr) reflect as a comb: apply a slow envelope on top of the Bragg modulation. If the grating consists of short bursts of Bragg modulation separated by longer unmodulated segments — a **sampled grating** — its effective coupling profile is the Bragg fundamental times the sampling window. Fourier-transforming that product turns a single peak at $\pm 2 k_B$ into a series of prominent peaks spaced by the reciprocal of the sampling period. Each peak opens its own narrow stopband, and the DBR reflects at all of them at once.

Choosing different sampling periods for the two mirrors produces combs with different tooth spacings, and the Vernier tuning range grows as the two sampling periods approach each other. In practice, sampled-grating [DBR](#defn-dbr) lasers cover the whole C-band from a single device, and are the standard tunable transmitter for wavelength-division-multiplexed telecom links.

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

The primary application is dispersion compensation in fiber-optic links. Standard telecom fiber has group-velocity dispersion of about $17\,\text{ps}/(\text{nm} \cdot \text{km})$: a pulse with 10 nm of spectral bandwidth broadens by 170 ps of temporal width after 1 km of propagation. A chirped fiber Bragg grating with the *opposite* sign of dispersion, of matched magnitude, undoes the broadening: the received pulse is recompressed to its original width. Real designs must match not just first-order dispersion but the slope (second-order dispersion) and polarization behavior across the spectrum; those refinements need the full transfer-matrix treatment of [§ 8 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-8).

A related use is intracavity dispersion compensation in femtosecond lasers, where the round-trip group-velocity dispersion from prisms, air, and the gain medium has to be cancelled to sustain pulses of picosecond duration or shorter. Chirped mirrors are the standard element for delivering a prescribed group-delay profile.

The mechanism is a direct reading of \eqref{eq:hyperbola} at $\delta = \pm\kappa$: group velocity vanishes at the two stopband boundary frequencies $\omega_\pm$ of § 1, and its slope diverges there. Chirping the grating slides that vanishing point in $z$, so different wavelengths hit the boundary at different depths, integrate different accumulated phases, and emerge with the designed group delay.

### § 5.3. Co-propagating coupling and long-period gratings {#sec-5-3}

The coupled-mode analysis of [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) handled a *counter*-propagating pair: forward and backward waves along the same waveguide, coupled by a grating with $G_1 = 2 k_B$ that supplies the round-trip momentum kick. The same formalism applies to a *co*-propagating pair: two guided modes of a waveguide, both moving in the same direction with wavenumbers $k_1 > k_2$, coupled by a grating with $G = k_1 - k_2$.

The coupled-mode equations for the two co-propagating amplitudes are

$$\frac{d A_1}{d z} = i\delta\, A_1 + i\kappa\, A_2, \qquad \frac{d A_2}{d z} = -i\delta\, A_2 + i\kappa\, A_1. \tag{11}\label{eq:copropag}$$

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

At $\delta = \pm\kappa$: the two standing waves $\omega_\pm$ and which sits at the lower frequency ([§ 1](#sec-1)). At $\delta = 0$ inside an infinite medium: the decay scale $1/\kappa$ ([§ 2.1](#sec-2-1)). Inside the stopband with two boundaries: the finite-mirror reflectivity $\tanh^2(\kappa L)$ ([§ 2.2](#sec-2-2)). Piecewise-constant modulation as fabricated hardware: the [DBR](#defn-dbr) ([§ 3](#sec-3)). Modulation in the presence of [gain](#defn-gain): the [DFB](#defn-dfb) laser and its DBR-laser and Vernier-tunable cousins ([§ 4](#sec-4)). Modulation shaped along its length: apodization, chirp, co-propagating coupling, and quasi-phase matching ([§ 5](#sec-5)).

The two ingredients that make all of it work were the two-wave truncation of the previous post's [§ 4](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) and the accessibility of both stopband boundary frequencies $\omega_\pm$. Every device-specific formula in this post follows from those two facts, taken through one universal hyperbola.