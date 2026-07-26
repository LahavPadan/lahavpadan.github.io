# Bragg Mirrors, Laser Cavities, and Engineered Gratings

The previous post, [Coupled Modes, Bragg Structures, and Photonic Bandgaps](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/), takes a general $2 \times 2$ eigenvalue problem and lands it on a periodic index modulation — a **grating**{:#defn-grating}.

Two devices sit at the center of what follows:

- A **distributed Bragg reflector**{:#defn-dbr} (DBR) is a grating used as a wavelength-selective element. Most commonly it is a mirror that reflects strongly in a narrow band and transmits outside it, but the same object also serves as the reflecting boundary of a photonic-bandgap waveguide, as a wavelength-drop filter in a wavelength-multiplexed link, and as the resonator against which a [gain](#defn-gain) medium is placed to make a laser.
- A **distributed-feedback laser**{:#defn-dfb} (DFB) puts the same grating *inside* a [gain](#defn-gain) medium and uses Bragg reflection in place of end mirrors, so the wavelength of the laser is set by the grating rather than by the gain's emission peak.

Everything else developed here — apodization, chirp, long-period [coupling](#defn-coupling), quasi-phase matching — is a variation on the same physics with the grating shaped or repurposed.

The results we use from the previous post, all justified in [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4):

- A grating with **Bragg period**{:#defn-bragg-period} $\Lambda$ singles out the **Bragg wavenumber**{:#defn-bragg-wavenumber} $k_B = \pi/\Lambda$. Its defining property: a round trip through one period at $k_B$ accumulates $2\pi$, or equivalently, the grating's fundamental spatial harmonic $2 k_B$ is exactly the momentum kick that takes a forward wave at $+k_B$ into a backward wave at $-k_B$. The **Bragg wavelength**{:#defn-bragg-wavelength} — the vacuum wavelength that satisfies this first-order condition — is $\lambda_B = 2 n_\text{avg}\, \Lambda$, and the corresponding **Bragg frequency**{:#defn-bragg-frequency} is $\omega_B = 2\pi c/\lambda_B$, where $n_\text{avg}$ is the spatial average of the refractive index.

- Near this reference wavenumber, two Fourier components of the field dominate — the forward wave at $k \approx k_B$ and the wave it Bragg-backscatters into at $k - 2k_B \approx -k_B$. All others are suppressed by $\Delta n / n_\text{avg}$, where $\Delta n$ is the amplitude of the refractive-index modulation (if $n(z) = n_\text{avg} + \Delta n \cos(2 k_B z)$, then $\Delta n$ is the maximum deviation from the average). Throughout, we write the field as

  $$E(z) = A(z)\, e^{i k_B z} + B(z)\, e^{-i k_B z},$$

  with slowly-varying envelopes $A$ (forward) and $B$ (backward).

- The two envelopes are governed by a **detuning**{:#defn-detuning} $\delta$ and a **coupling**{:#defn-coupling} $\kappa$,

  $$\delta = k - k_B, \qquad \kappa = \frac{\pi\, \Delta n}{\lambda_B}.$$

  [Detuning](#defn-detuning) measures how far the driving wavenumber sits from $k_B$; [coupling](#defn-coupling) measures how strongly the grating mixes the forward and backward waves.

- The two envelopes obey the dispersion relation

  $$q^2 = \delta^2 - \kappa^2, \tag{$\star$}\label{eq:hyperbola}$$

  where $q$ is how far the mode's actual wavenumber inside the grating sits from $k_B$. Outside $\vert\delta\vert > \kappa$, $q$ is real and the field propagates. Inside $\vert\delta\vert < \kappa$, $q = i\alpha$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$, and the field decays exponentially. The range $\vert\delta\vert < \kappa$ is the **stopband**{:#defn-stopband}.

- The [stopband](#defn-stopband) is bounded on both sides at $\delta = \pm\kappa$, where $q = 0$: the forward and backward waves combine into a standing wave and the group velocity $v_g = d\omega/dq$ vanishes. Write $\omega_-$ and $\omega_+$ for the two boundary frequencies. Both are physically accessible in the Bragg problem — a feature that separates it from the one-sided cutoffs (waveguide, plasma, relativistic massive field) treated in the [cutoff phenomena post](/posts/cutoff-phenomena/).

[§ 1](#sec-1) and [§ 2](#sec-2) read \eqref{eq:hyperbola} at four distinct $(\delta, q)$ operating points:

- $\delta = \pm\kappa$ (both stopband edges, $q = 0$): the two standing waves at $\omega_\pm$ — [§ 1](#sec-1).
- $\delta = 0$ in a semi-infinite grating: exact-Bragg decay at rate $\kappa$ — [§ 2.1](#sec-2-1).
- $\delta = 0$ with a second boundary at $z = L$: finite-mirror reflectivity $\tanh^2(\kappa L)$ — [§ 2.2](#sec-2-2).
- $|\delta| > \kappa$: propagation resumes.

The remaining sections build on that base:

- [§ 3](#sec-3) turns the sinusoidal grating into a fabricated piecewise-constant stack — the [DBR](#defn-dbr).
- [§ 4](#sec-4) places the grating against a [gain](#defn-gain) medium: the [DFB](#defn-dfb) laser (grating inside the gain) and the DBR laser (grating in a separate section).
- [§ 5](#sec-5) lets the grating vary along its length.

---

## § 1. The two ends of the stopband, $\omega_-$ and $\omega_+$ {#sec-1}

Inside the stopband ($|\delta| < \kappa$) \eqref{eq:hyperbola} gives $q^2 < 0$: the field decays exponentially and no wave propagates. The stopband is bounded above and below in $\omega$ by $\omega_-$ (lower) and $\omega_+$ (upper). Two independent derivations pin these down; the phase geometry of the interfaces then gives the [stopband](#defn-stopband) width.

### § 1.1. Equal-mixture standing waves {#sec-1-1}

Set the driving spatial wavenumber to the Bragg value $k = k_B$, i.e. $\delta = 0$. The two-mode [coupling](#defn-coupling) matrix has zero diagonal and only the off-diagonal $\pm\kappa$ left. Its eigenvalues are $\pm\kappa$ — the two boundary frequencies $\omega_\pm = \omega_B \pm \kappa$ of the stopband, above and below the reference — and its eigenvectors are the equal mixtures

$$(A, B) = \frac{1}{\sqrt 2}(1, 1) \quad\text{and}\quad (A, B) = \frac{1}{\sqrt 2}(1, -1).$$

Substituting into $E(z) = A\, e^{i k_B z} + B\, e^{-i k_B z}$:

- $(1, 1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} + e^{-i k_B z} = 2 \cos(k_B z)$ — a **cosine standing wave**.
- $(1, -1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} - e^{-i k_B z} = 2i \sin(k_B z)$ — a **sine standing wave**.

Both have wavelength $2\pi/k_B = 2\Lambda$: exactly one full oscillation per two Bragg periods, or equivalently one intensity maximum per [Bragg period](#defn-bragg-period), so their intensities are periodic with the modulation.

Where the intensities sit relative to the modulation is what will matter for [§ 1.2](#sec-1-2). The cosine standing wave peaks where $\cos(2 k_B z)$ peaks, which is where $\varepsilon(z) = n_\text{avg}^2 + \Delta\varepsilon \cos(2 k_B z)$ is largest — that is, in the high-index parts of the modulation. The sine standing wave peaks in the low-index parts.

### § 1.2. Which of $\omega_-$, $\omega_+$ lies lower {#sec-1-2}

The real-space shapes alone do not say which of the two standing waves has the lower frequency. To settle that, we extract $\omega^2$ directly from the wave equation.

<div class="guided-fold-start" data-label="Extract ω² from the wave equation" data-tone="derivation"></div>

The scalar Helmholtz equation for a periodic dielectric, derived as [the scalar-wave-equation refresher in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#picture-3-scalar-wave-equation), is

$$\frac{d^2 E}{dz^2} + \frac{\omega^2}{c^2}\, \varepsilon(z)\, E(z) = 0.$$

Multiply through by $E^*(z)$ and integrate over one [Bragg period](#defn-bragg-period), from $z = 0$ to $z = \Lambda$:

$$\int_0^\Lambda E^*\, \frac{d^2 E}{dz^2}\, dz + \frac{\omega^2}{c^2} \int_0^\Lambda \varepsilon(z)\, \vert E \vert^2\, dz = 0.$$

Solving for $\omega^2$,

$$\omega^2 = c^2\, \frac{-\int_0^\Lambda E^*\, (d^2 E / dz^2)\, dz}{\int_0^\Lambda \varepsilon(z)\, \vert E \vert^2\, dz}.$$

Integrate the numerator by parts once:

$$-\int_0^\Lambda E^*\, \frac{d^2 E}{dz^2}\, dz = -\left[E^*\, \frac{dE}{dz}\right]_0^\Lambda + \int_0^\Lambda \left|\frac{dE}{dz}\right|^2 dz.$$

The boundary term evaluates $E^*\, dE/dz$ at $z = \Lambda$ minus its value at $z = 0$. Both edge modes have $q = 0$, so their field is strictly $\Lambda$-periodic: $E(\Lambda) = E(0)$ and $dE/dz$ likewise. The two evaluations agree and cancel, and we are left with

$$\omega^2 = c^2\, \frac{\int_0^\Lambda \vert dE/dz \vert^2\, dz}{\int_0^\Lambda \varepsilon(z)\, \vert E \vert^2\, dz}. \tag{1}\label{eq:rayleigh}$$

<div class="guided-fold-end"></div>

Apply \eqref{eq:rayleigh} to the two edge modes. Both are pure sinusoids at the same wavenumber $k_B$, so their derivatives $dE/dz$ have the same shape and the numerators integrate to the same value. The only thing that separates them is the denominator, which depends on how the intensity $\vert E \vert^2$ overlaps the modulation $\varepsilon(z)$:

- The **cosine mode** concentrates its intensity in the high-index parts of the modulation, so $\int \varepsilon \vert E \vert^2\, dz$ is large. Larger denominator, smaller $\omega^2$.
- The **sine mode** concentrates its intensity in the low-index parts, so $\int \varepsilon \vert E \vert^2\, dz$ is small. Smaller denominator, larger $\omega^2$.

So $\omega_-$ is the cosine standing wave, concentrated in the high-index material, and $\omega_+$ is the sine standing wave, concentrated in the low-index material. Shifting the origin of coordinates by half a [Bragg period](#defn-bragg-period) swaps cosine and sine, but the rule — the mode concentrated in the high-index material lies at the lower frequency — holds regardless.

### § 1.3. Constructive interface reflection at the Bragg wavelength {#sec-1-3}

The same $\omega_\pm$ come out of a different picture. Instead of the two-Fourier-component truncation of [§ 1.1](#sec-1-1), take the grating as a stack of layers of piecewise-constant index — the multilayer we will build as a [DBR](#defn-dbr) in [§ 3](#sec-3) — and follow the phase of the individual interface reflections. [§ 1.4](#sec-1-4) will use the same per-layer phase to derive the [stopband](#defn-stopband) width.

At normal incidence, an interface from refractive index $n_1$ into refractive index $n_2$ has amplitude reflection coefficient

$$r_{12} = \frac{n_1 - n_2}{n_1 + n_2}. \tag{2}\label{eq:fresnel}$$

Two properties of $r_{12}$ matter for what follows:

- **Sign.** Going from low to high index gives $r_{12} < 0$: the reflected amplitude is phase-shifted by $\pi$ relative to the incident amplitude. Going from high to low gives $r_{12} > 0$: no phase shift.
- **Magnitude.** For typical dielectric index differences (a few percent up to about 50%), $\vert r_{12} \vert$ is small — at most $\sim 0.2$.

Consider now a stack of alternating high-index and low-index layers. The one-way phase a wave picks up crossing layer $i$ at wavelength $\lambda$ is $(2\pi n_i / \lambda)\, d_i$: it depends on the product $n_i d_i$, which we call the **optical thickness**{:#defn-optical-thickness} of the layer. Pick

$$n_i d_i = \frac{\lambda_B}{4}$$

for both layer types. At $\lambda = \lambda_B$, the one-way phase is then $\pi/2$ and the round trip is $\pi$.

Compare two reflected amplitudes arriving back at the input plane just outside the stack:

- Reflection off the first air–high interface: phase $\pi$ from the reflection itself, no propagation.
- Reflection off the next interface (high to low): a round trip through the high layer contributes $\pi$, and the high-to-low reflection contributes no additional phase.

Both arrive at the input plane with total phase $\pi$. They combine constructively. The next pair of interfaces adds two more contributions with the same total phase, and so on down the stack.

{% include visualization.html src="fresnel-quarter-wave-phase.html" title="Reflection phase and quarter-wave propagation phase compared at one return plane" %}

Off the [Bragg wavelength](#defn-bragg-wavelength) $\lambda_B$, the round-trip phase per layer is no longer exactly $\pi$, and reflections from deeper and shallower layers begin to disagree in phase. The rate at which the disagreement accumulates is what sets the [stopband](#defn-stopband) width — made quantitative in [§ 1.4](#sec-1-4).

### § 1.4. The stopband width, from phase-error accumulation {#sec-1-4}

Combining the two boundaries $\delta = \pm\kappa$ of \eqref{eq:hyperbola} with the definition of $\kappa$ gives the stopband width in wavenumber, $\Delta k = 2\kappa$, and in frequency, $\Delta\omega = 2\kappa v_g$. [§ 1.3](#sec-1-3)'s stack-of-interfaces gives the same $\Delta k$ from a completely different starting point — the phase mismatch that accumulates as $\lambda$ moves off $\lambda_B$.

At $\lambda = \lambda_B$, each layer's round-trip phase is exactly $\pi$ and reflections from all interfaces combine constructively.

<div class="guided-fold-start" data-label="Follow the phase error through a concrete 1% detuning" data-tone="derivation"></div>

Illuminate the same stack with a wavelength $\lambda = 0.99\, \lambda_B$ — off by 1%. The round-trip phase per layer is

$$\phi_\text{RT} = 2 k d = 2 \left(\frac{2\pi n}{\lambda}\right) \left(\frac{\lambda_B}{4 n}\right) = \pi\, \frac{\lambda_B}{\lambda} \approx 1.01\, \pi.$$

Each layer contributes a phase *error* of $0.01\, \pi \approx 2°$ relative to the design condition. Small at one layer — the interface reflects nearly as well as it would at $\lambda_B$ — but the error accumulates as the wave works deeper:

- After 10 layers: accumulated error $\approx 18°$. Deep and shallow reflections still add roughly in phase.
- After 50 layers: accumulated error $\approx 90°$. Deep-layer reflections are orthogonal in phase to shallow ones — neither reinforcing nor cancelling.
- After 100 layers: accumulated error $\approx 180°$. Deep-layer reflections are opposed to shallow ones, and further layers subtract from the total instead of adding to it.

For this 1% [detuning](#defn-detuning), the useful reflecting depth is $\sim 100$ layers, about $30\,\mu\text{m}$ in a typical stack.

<div class="guided-fold-end"></div>

The two [stopband](#defn-stopband) boundaries $\delta = \pm\kappa$ are where \eqref{eq:hyperbola} gives $q^2 = 0$: for $|\delta| > \kappa$ the wave propagates, for $|\delta| < \kappa$ it decays. The same $\kappa$ measures the largest per-layer phase error the grating can still turn into net constructive reflection.

Two quantities, one condition:

- The **stopband width** $\Delta k = 2\kappa$ is the range of detunings $\delta$ for which $q^2 < 0$ in \eqref{eq:hyperbola}.
- The **penetration depth** $1/\kappa$ is the length over which $e^{-\kappa z}$ falls by $e$: the field at $\delta = 0$ decays over $1/\kappa$, since $q^2 = -\kappa^2$ there.

They are reciprocals because $\kappa$ appears in \eqref{eq:hyperbola} in two distinct roles: as the boundary of the [detuning](#defn-detuning) $\delta$ (a wavenumber that sets the stopband width) and as $|q|$ at $\delta = 0$ (an inverse length that sets the decay scale).

*§ 1's derivations both describe an infinite grating. A real grating has finite length, so whatever enters at $z = 0$ has to eventually exit at $z = L$ or come back out. What sets how much of the incident amplitude actually comes back?*

---

## § 2. Finite gratings: decay scale and reflectivity {#sec-2}

### § 2.1. Semi-infinite grating: the decay scale $1/\kappa$ {#sec-2-1}

At $\delta = 0$ the dispersion \eqref{eq:hyperbola} gives $q^2 = -\kappa^2$, so $q = \pm i\kappa$ and the two spatial factors are $e^{+\kappa z}$ and $e^{-\kappa z}$. Take the grating to fill the half-space $z > 0$; the $e^{+\kappa z}$ branch blows up at infinity and is dropped. The field decays as $e^{-\kappa z}$: amplitude falls by $e$ over $1/\kappa$. This decay scale is a property of the *medium*, not of any particular device. Cut the grating off at $z = L$ instead, and both branches must be kept — the second boundary is what selects the specific combination.

### § 2.2. Finite grating: the reflectivity {#sec-2-2}

The coupled-mode equations for the envelopes $A(z)$ (forward wave, right-going) and $B(z)$ (backward wave, left-going), derived at [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) from the two-Fourier-component truncation, read $dA/dz = i\delta A + i\kappa B$ and $dB/dz = -i\delta B - i\kappa A$. At $\delta = 0$ the diagonal terms vanish and only the off-diagonal [coupling](#defn-coupling) remains:

$$\frac{d}{dz} \begin{pmatrix} A \\ B \end{pmatrix} = \begin{pmatrix} 0 & i\kappa \\ -i\kappa & 0 \end{pmatrix} \begin{pmatrix} A \\ B \end{pmatrix}. \tag{3}\label{eq:cme}$$

The off-diagonal has the same $\kappa$ as before; the factor $i$ is a phase convention, and will affect only the phase (not the power) of the reflected wave.

Differentiating either component of \eqref{eq:cme} and substituting the other back in decouples the pair,

$$\frac{d^2 A}{dz^2} = \kappa^2\, A, \qquad \frac{d^2 B}{dz^2} = \kappa^2\, B.$$

Both envelopes satisfy the same scalar equation; both are combinations of $\cosh(\kappa z)$ and $\sinh(\kappa z)$. Integrating out the two constants for each envelope, the pair $(A, B)$ at a general $z$ is a linear combination of its values at $z = 0$:

$$\begin{pmatrix} A(L) \\ B(L) \end{pmatrix} = \begin{pmatrix} \cosh(\kappa L) & i\, \sinh(\kappa L) \\ -i\, \sinh(\kappa L) & \cosh(\kappa L) \end{pmatrix} \begin{pmatrix} A(0) \\ B(0) \end{pmatrix}. \tag{4}\label{eq:propag}$$

*This is a two-boundary problem.* The physical scenario is: a wave comes in from the left, some fraction reflects, and the remainder transmits out the far end. In envelope variables:

- **Entrance** ($z = 0$): $A(0) = A_\text{in}$ is the given input amplitude, and $B(0) = A_\text{ref}$ is the *unknown* reflected amplitude we want to find.
- **Far end** ($z = L$): $A(L) = A_\text{tra}$ is the *unknown* transmitted amplitude, and $B(L) = 0$ because nothing is illuminating the grating from behind.

The two unknowns $A_\text{ref}$ and $A_\text{tra}$ are fixed by the two rows of \eqref{eq:propag}. From the second row with $B(L) = 0$:

$$0 = -i\sinh(\kappa L)\, A_\text{in} + \cosh(\kappa L)\, A_\text{ref} \quad\Longrightarrow\quad \frac{A_\text{ref}}{A_\text{in}} = i \tanh(\kappa L).$$

The power reflection coefficient — the fraction of incident power reflected — is the modulus squared of the amplitude ratio:

$$\boxed{\, R = \left|\frac{A_\text{ref}}{A_\text{in}}\right|^2 = \tanh^2(\kappa L). \,} \tag{5}\label{eq:tanh-refl}$$

The transmitted amplitude comes from the first row of \eqref{eq:propag}, now with $B(L) = 0$ already fixed and $B(0) = A_\text{ref}$ known:

$$A_\text{tra} = \cosh(\kappa L)\, A_\text{in} + i\sinh(\kappa L)\, A_\text{ref}.$$

Substituting $A_\text{ref}/A_\text{in} = i \tanh(\kappa L)$ collapses this to $A_\text{tra}/A_\text{in} = \operatorname{sech}(\kappa L)$, so the power transmission is

$$T = \left|\frac{A_\text{tra}}{A_\text{in}}\right|^2 = \operatorname{sech}^2(\kappa L).$$

Since $\tanh^2 + \operatorname{sech}^2 = 1$, we have $R + T = 1$: energy is conserved, as it must be in a lossless grating.

The envelopes that satisfy both boundary conditions — solved as functions of $z$ throughout the grating rather than just at its ends — are

$$A(z) = A_\text{in}\, \frac{\cosh[\kappa (L - z)]}{\cosh(\kappa L)}, \qquad B(z) = i\, A_\text{in}\, \frac{\sinh[\kappa (L - z)]}{\cosh(\kappa L)}. \tag{6}\label{eq:envelopes}$$

This solution matches the boundary values at both ends: at the entrance, $A(0) = A_\text{in}$ and $B(0) = i A_\text{in} \tanh(\kappa L) = A_\text{ref}$; at the far end, $A(L) = A_\text{in} \operatorname{sech}(\kappa L) = A_\text{tra}$ and $B(L) = 0$.

They are worth comparing side by side with the semi-infinite decay of [§ 2.1](#sec-2-1):

- **Semi-infinite grating.** The field decays purely as $e^{-\kappa z}$: one exponential mode, forced by boundedness at $z = \infty$.
- **Finite grating.** Both branches $\cosh$ and $\sinh$ are allowed; the far-end condition $B(L) = 0$ picks the specific combination in \eqref{eq:envelopes}. As $\kappa L$ grows, the far end retreats and the envelope near the entrance approaches the semi-infinite decay.

{% include visualization.html src="bragg-mirror-penetration.html" title="Infinite-medium decay, finite-boundary envelopes, and Bragg-mirror reflectivity" %}

The dimensionless product $\kappa L$ compares the grating's physical length to $1/\kappa$. It controls everything: reflectivity, transmission, and the shape of the internal envelope.

Setting a target reflectivity of $R > 0.99$ and solving \eqref{eq:tanh-refl},

$$\kappa L > \operatorname{arctanh}(\sqrt{0.99}) \approx 2.99.$$

So a grating tuned to $\delta = 0$ needs a physical length of about $3/\kappa$ to exceed 99% power reflectivity.

*The reflectivity formula $R = \tanh^2(\kappa L)$ tells us $\kappa$ and $L$ jointly control the mirror. What sets $\kappa$ in a stack we actually build, and how many layers of what index difference do we need?*

---

## § 3. The DBR: a Bragg grating in fabricated hardware {#sec-3}

We now build the [DBR](#defn-dbr) as a physical multilayer in terms of the parameters an engineer picks: layer indices, layer thicknesses, and number of periods.

- Both quantities [§ 2](#sec-2) asked for — $\kappa$ and the number of layers — come out set by one number, the **index contrast** $\Delta n = n_H - n_L$.
- [§ 3.1](#sec-3-1) derives the exact one-period transfer matrix from the layer wave equation, and reads off how quickly reflectivity saturates with the number of periods $N$.
- [§ 3.2](#sec-3-2) shows the same $\Delta n$ fixes $\kappa = 2\Delta n / \lambda_B$, and with it the [stopband](#defn-stopband) width.

### § 3.1. The quarter-wave stack: reflectivity of an $N$-period mirror {#sec-3-1}

Take a stack of $N$ high-low pairs plus a final high layer — every layer at the [§ 1.3](#sec-1-3) quarter-wave optical thickness $\lambda_B/4$ — sandwiched between a substrate of index $n_s$ and an incident medium of index $n_0$. Its reflectivity at $\lambda_B$ has a closed form:

$$R = \left( \frac{n_0\, n_L^{2N} - n_s\, n_H^{2N}}{n_0\, n_L^{2N} + n_s\, n_H^{2N}} \right)^2. \tag{7}\label{eq:dbr-refl}$$

<div class="guided-fold-start" data-label="Derive R from the transfer matrix of one period" data-tone="derivation"></div>

Take the exact route through the [transfer-matrix formalism of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-8). Inside a single layer of index $n_i$ and thickness $d_i$, the scalar wave equation is $E'' + k_i^2 E = 0$ with $k_i = \omega n_i / c$, and the matrix relating $(E, E')$ at the two faces is

$$T_i = \begin{pmatrix} \cos(k_i d_i) & (1/k_i)\sin(k_i d_i) \\ -k_i \sin(k_i d_i) & \cos(k_i d_i) \end{pmatrix}, \qquad \det T_i = 1.$$

One high-low pair — one repeating unit of the grating — has transfer matrix $T_L T_H$. At $\omega = 2\pi c/\lambda_B$, $k_i d_i = \pi/2$, each $T_i$ simplifies to $\begin{pmatrix} 0 & 1/k_i \\ -k_i & 0 \end{pmatrix}$, and

$$T_L T_H = \begin{pmatrix} -n_H/n_L & 0 \\ 0 & -n_L/n_H \end{pmatrix}.$$

The trace is $-(n_H/n_L + n_L/n_H)$; for any $n_H \neq n_L$ it is more negative than $-2$, so $|\text{tr}| > 2$ and the mode is evanescent — a direct check that the mirror sits inside its [stopband](#defn-stopband) at $\lambda_B$. Cascading $(T_L T_H)^N$ across $N$ periods, adding the extra high layer, and imposing the outgoing-only condition at the far end gives \eqref{eq:dbr-refl}.

<div class="guided-fold-end"></div>

How quickly $R$ approaches 1 as we add periods depends on the ratio $n_H / n_L$:

- **Large ratio** — $n_H / n_L$ well above 1. The factor $(n_H / n_L)^{2N}$ dominates the denominator quickly, and $R$ saturates near unity for $N \sim 10$. Dielectric stacks with Ta$_2$O$_5$ over SiO$_2$ have $n_H / n_L \approx 1.5$, and 10–15 periods reach $R > 99\%$.
- **Small ratio** — $n_H / n_L$ close to 1. Saturation is slower. Semiconductor DBRs based on GaAs/AlAs have $n_H / n_L \approx 1.15$ and need 25–30 periods.

The same $|\text{tr}(T_L T_H)|$ gives the field's decay rate inside the stack, this time expressed as a rate per period $\alpha$: solving $\cosh(\alpha\Lambda) = |\text{tr}(T_L T_H)|/2$. For $n_H/n_L = 1.15$ (typical semiconductor), $|\text{tr}|/2 \approx 1.083$, giving $\alpha\Lambda \approx 0.408$; twenty periods deliver $\alpha N \Lambda \approx 8.2$, so $R = \tanh^2(8.2) \approx 1 - 10^{-7}$: essentially perfect. Real DBRs use 20–40 periods for this reason.

For large enough $N$, \eqref{eq:dbr-refl} agrees with the coupled-mode formula $R = \tanh^2(\kappa L)$ of [§ 2.2](#sec-2-2). They apply in complementary limits: \eqref{eq:dbr-refl} holds for the piecewise-constant profile at any $n_H/n_L$, while $\tanh^2(\kappa L)$ assumes $\vert r_{12} \vert \ll 1$ so the two envelopes vary slowly across a single layer. Both formulas agree in the overlap regime — long stacks with modest index contrast.

### § 3.2. Bandwidth from the index difference {#sec-3-2}

The formula $\kappa = \pi\, \Delta n / \lambda_B$, [equation (9) of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#eq:kappa-bragg), is for a sinusoidal index modulation. A DBR is instead *piecewise-constant* — the refractive index takes only two values, $n_H$ and $n_L$. Its Fourier expansion has a fundamental cosine coefficient of $4/\pi$ times the peak-to-average amplitude of the square wave, so the [coupling](#defn-coupling) seen at the fundamental [Bragg wavelength](#defn-bragg-wavelength) is

$$\kappa_\text{DBR} = \frac{2\, \Delta n}{\lambda_B}, \qquad \Delta n \equiv n_H - n_L.$$

The [stopband](#defn-stopband) width in frequency, $\Delta\omega = 2 \kappa v_g$, then translates into a ratio between the stopband width and the [Bragg frequency](#defn-bragg-frequency) $\omega_B = 2\pi c/\lambda_B$:

$$\frac{\Delta \omega}{\omega_B} = \frac{4}{\pi}\, \frac{\Delta n}{n_\text{avg}}. \tag{8}\label{eq:dbr-bw}$$

The left-hand side — the stopband width $\Delta\omega$ divided by $\omega_B$ — is what specifies the **fractional bandwidth** of the mirror. Two working numbers:

- **High-index difference dielectric stack** — $\Delta n / n_\text{avg} \approx 0.5$. Fractional bandwidth $\approx 60\%$: broadband, covers most of the visible or a wide near-infrared window.
- **Semiconductor DBR** — $\Delta n / n_\text{avg} \sim 0.05$. Fractional bandwidth $\approx 6\%$: narrow enough for single-mode laser use ([§ 4](#sec-4)), too narrow for broadband applications.

The same $\kappa$ appears in the decay scale $1/\kappa$ and, via \eqref{eq:tanh-refl}, in the reflectivity $R = \tanh^2(\kappa L)$ of a physical grating.

That ties the two design axes together. For a fixed index difference $\Delta n$, a shorter mirror (smaller $L$) needs a larger $\kappa$ to hit the same reflectivity — but a larger $\kappa$ also widens the [stopband](#defn-stopband). Bandwidth and physical length trade off through the shared $\kappa$, and the [DBR](#defn-dbr) designer picks the balance for the application.

### § 3.3. Higher-order stopbands and the structure factor {#sec-3-3}

A square-wave DBR has stopbands not just at $\lambda_B$, but also at odd sub-multiples $\lambda_B / 3, \lambda_B / 5, \ldots$ At those shorter wavelengths, the same quarter-wave layer is also a $3\lambda/4, 5\lambda/4, \ldots$ layer, satisfying the Bragg condition at higher order.

The strength of the $m$-th stopband is set by the corresponding Fourier coefficient $\varepsilon_m$ of the modulation profile — the modulation's **structure factor**. The [Bragg-condition background in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3) develops this for a general periodic $\varepsilon(z)$. The rule: a purely sinusoidal modulation has only the fundamental $\varepsilon_{\pm 1}$ nonzero and produces only the first-order [stopband](#defn-stopband), while a square-wave modulation has $\varepsilon_m \propto 1/m$ for odd $m$ (and zero for even $m$), producing weaker higher-order stopbands at each odd $m$.

Two engineering consequences:

- To *suppress* the higher-order stopbands, shape the modulation to look more sinusoidal — only $\varepsilon_{\pm 1}$ nonzero. In fiber Bragg gratings, a smooth amplitude envelope (apodization, [§ 5.1](#sec-5-1)) does this approximately.
- To *engineer* multiple simultaneous stopbands at prescribed wavelengths, choose a modulation whose Fourier spectrum has content at the desired periods. [§ 5](#sec-5) develops this for sampled gratings, which support multi-wavelength lasing.

### § 3.4. Off-normal incidence and Brewster's angle {#sec-3-4}

Every calculation so far has assumed the wave hits the stack perpendicular to the layers. In many devices the wave arrives at an angle instead — the in-plane mode of a planar waveguide, for instance, strikes an integrated [DBR](#defn-dbr) at whatever internal angle the waveguide geometry sets. At off-normal incidence, three things change at once:

- **The one-way phase per layer picks up a $\cos\theta_i$.** With the wave at angle $\theta_i$ inside a layer of physical thickness $d_i$ (set by Snell's law), the phase accumulated in one traversal is $(2\pi n_i / \lambda_B)\, d_i\, \cos\theta_i$ instead of $(2\pi n_i / \lambda_B)\, d_i$: the wavevector component perpendicular to the layers, $k_{\perp,i} = k_i \cos\theta_i$, is what advances the stack coordinate. This is the same physics as the [Bragg condition of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3), $m\lambda_B = 2 n_\text{avg} \Lambda \sin\theta$: at off-normal incidence, the round-trip phase per period equals $\pi$ at a shorter vacuum wavelength

  $$\lambda_B(\theta_0) = 2\left[n_H d_H \cos\theta_H + n_L d_L \cos\theta_L\right],$$

  smaller than the normal-incidence value $\lambda_B(0) = 2(n_H d_H + n_L d_L)$.
- **The two polarizations acquire different interface reflectivities.** TE (electric field perpendicular to the plane of incidence) and TM (electric field in the plane of incidence, with a component along the layer normal) see the boundary conditions differently.
- **Polarization sensitivity of $\kappa$.** Since $\kappa$ is built from the interface reflections, it inherits their polarization dependence, and TE and TM acquire distinct stopbands.

{% include visualization.html src="oblique-bragg-phase.html" title="Why off-normal incidence shifts the Bragg wavelength through the normal wavevector component" %}

The polarization split has a concrete origin. The reflection coefficient at an interface is set by matching the *tangential* components of $E$ and $H$ across the boundary. For TE, the electric field lies entirely in the plane of the interface, so the matching involves the full $E$ and the tangential component of $H$, which picks up a $\cos\theta$. For TM, the electric field has a component along the interface normal, so the matching involves the tangential component of $E$ (which itself picks up a $\cos\theta$) and the full $H$. The two conditions therefore trade which side of the interface carries the cosine, giving

$$r_\text{TE} = \frac{n_1 \cos\theta_1 - n_2 \cos\theta_2}{n_1 \cos\theta_1 + n_2 \cos\theta_2}, \qquad r_\text{TM} = \frac{n_2 \cos\theta_1 - n_1 \cos\theta_2}{n_2 \cos\theta_1 + n_1 \cos\theta_2}. \tag{9}\label{eq:fresnel-full}$$

In TE the cosines multiply the $n$ on the same side of the interface; in TM they multiply the $n$ on the *opposite* side. That switch is what lets the TM numerator vanish at a non-normal angle, while the TE numerator never does. At $\theta_1 = 0$ both reduce to \eqref{eq:fresnel}. Away from zero, the two split — and TM does something dramatic:

$$r_\text{TM} = 0 \quad\text{when}\quad \tan\theta_1 = \frac{n_2}{n_1}. \tag{10}\label{eq:brewster}$$

The angle $\theta_1$ satisfying this is called **Brewster's angle**. At it, TM light passes through the interface with zero reflected amplitude.

The mechanism deserves a moment. An incident electric field drives the electrons in the second medium into oscillation along the direction of the transmitted field. Those oscillating charges are electric dipoles, and it is *their* re-radiation that produces the reflected wave. An oscillating dipole radiates *transverse* electromagnetic waves — the radiated $E$-field is the component of the charge's acceleration perpendicular to the line of sight from the charge to the observer. Charges oscillate along the dipole axis, so along the axis the acceleration has no perpendicular component and the radiated field is zero; broadside to the axis, the entire acceleration is perpendicular to the line of sight and the radiation is maximum. This gives the familiar $\sin\theta$ radiation pattern, with a node exactly along the axis.

For TM polarization at Brewster's angle, Snell's law places the reflected ray precisely along the direction in which the induced dipoles point — the very direction they cannot radiate into. There is no reflected wave. TE polarization has no analogous angle: its $E$-field is perpendicular to the plane of incidence by construction, so its induced dipoles point perpendicular to that plane too, while the reflected ray always sits *inside* the plane of incidence — the dipole axis and the reflected direction are perpendicular to each other at every angle, never coincident.

{% include visualization.html src="te-tm-boundary-admittance.html" title="How off-normal incidence distinguishes TE and TM boundary admittances" %}

The consequence for a [DBR](#defn-dbr): as the in-medium angle approaches Brewster's angle,

- the TM interface reflection coefficient $r_\text{TM}$ shrinks toward zero (\eqref{eq:brewster}),
- the TM [coupling](#defn-coupling) $\kappa_\text{TM}$, built from these per-interface reflections in [§ 1.3](#sec-1-3), shrinks with it,
- and the TM [stopband](#defn-stopband) width $\Delta\omega_\text{TM} = 2\kappa_\text{TM} v_g$ narrows and eventually closes.

The TE stopband is unaffected — TE has no Brewster angle — so at Brewster incidence the DBR reflects TE and transmits TM at the same wavelength.

{% include visualization.html src="brewster-stopband-closure.html" title="Why TE reflections accumulate while the TM stopband closes at Brewster incidence" %}

Whether the split matters is set by the angle at which the field crosses the layer stack. Two limits bracket it: at near-normal incidence, TE and TM coincide and a single DBR design works for both; at large in-medium angles, the two polarizations see quantitatively different stopbands and the design has to fix which polarization is being reflected.

*A [DBR](#defn-dbr) is a passive wavelength-selective mirror. Combined with a [gain](#defn-gain) medium — either interleaved with it along the same length, or separated in space from it — its reflection becomes feedback, and the laser's wavelength is set by the grating. Which mode wins, and how do we get a single one?*

---

## § 4. Bragg feedback in lasers: DFB and DBR {#sec-4}

A laser combines a **gain medium**{:#defn-gain}, which amplifies the field, with a **cavity**{:#defn-cavity}, which feeds the field back on itself so that [gain](#defn-gain) accumulates coherently over many round trips. If the [cavity](#defn-cavity)'s two end mirrors are flat, their reflectivity is the same at every wavelength, and the laser has no built-in preference for any one frequency. Replacing one or both mirrors — or the entire [cavity](#defn-cavity) — with a Bragg grating gives *wavelength-selective* feedback: the laser is forced into the grating's [stopband](#defn-stopband). Two placements decide the device.

- The [DFB](#defn-dfb) laser writes the grating into the same stretch of waveguide that carries the [gain](#defn-gain) — [coupling](#defn-coupling) $\kappa$ and [gain](#defn-gain) $\gamma$ act at every $z$.
- The DBR laser puts the grating in a separate stretch of waveguide from the [gain](#defn-gain) — $\gamma$ acts only where the [gain](#defn-gain) sits, $\kappa$ only where the grating sits, and the two stretches can be tuned independently.

Before either can be understood as a fix, though: what exactly does a flat-mirror [cavity](#defn-cavity) do, and why does it fail to pick a wavelength?

### § 4.1. Why flat mirrors do not pick a wavelength {#sec-4-1}

The problem the [DBR](#defn-dbr) and [DFB](#defn-dfb) solve is easiest to see against the reference case: a gain-carrying dielectric of length $L$ and effective index $n_\text{eff}$, bounded by two flat interfaces at which the index steps back to air. For a representative $n_\text{eff} \approx 3.5$ (a common value in semiconductor gain media), \eqref{eq:fresnel} with $n_1 = n_\text{eff}$, $n_2 = 1$ gives

$$R = \left(\frac{n_\text{eff} - 1}{n_\text{eff} + 1}\right)^2 \approx 0.3,$$

and — crucially — this expression carries no dependence on $\omega$.

That single property is what makes the flat-mirror laser a poor wavelength-selective element. The [cavity](#defn-cavity) supports a comb of resonant modes at frequencies

$$\nu_n = n \cdot \frac{c}{2 n_\text{eff} L}, \qquad \Delta\nu_\text{FSR} = \frac{c}{2 n_\text{eff} L}$$

(each is a standing wave fitting an integer number of half-wavelengths between the mirrors; $\Delta\nu_\text{FSR}$ is the **free spectral range**). The [gain](#defn-gain) profile $\gamma(\nu)$ is nonzero across a range typically many THz wide — thousands of $\Delta\nu_\text{FSR}$ fit inside — so many thousands of modes sit in the amplifying window. Because $R$ carries no $\omega$-dependence, the mirror loss $-\ln R^2 / (2L)$ is the same constant for every mode in the comb; the only quantity that discriminates between them is $\gamma(\nu_n)$ itself. Whichever mode has the highest $\gamma$ at the moment wins, and since $\gamma$ shifts with drive current and temperature, the winning mode drifts and hops as those conditions change.

The physical target is one mode with a narrow, temperature-stable frequency. The fix is to make $R$ depend on $\omega$ — a wavelength-selective mirror. Where the grating sits relative to the [gain](#defn-gain) then decides what device we get.

### § 4.2. DFB: the grating co-located with the gain {#sec-4-2}

In a [DFB](#defn-dfb), the grating is interleaved with the [gain](#defn-gain) along the same stretch of waveguide: [coupling](#defn-coupling) $\kappa$ and [gain](#defn-gain) $\gamma$ act at every $z$. There are no separate end mirrors — the mirror is spread over the whole length. Two facts follow from that, and together they set the [DFB](#defn-dfb)'s selectivity.

**The grating is itself a [cavity](#defn-cavity).** In a flat-mirror laser the round trip is between two planes at fixed $z$: a wave leaves one, reflects at the other, and returns, and the lasing condition is that the round-trip field come back to itself in amplitude and phase — $R_1 R_2\, e^{2\gamma L}\, e^{i 2 k L} = 1$ at the mode frequency. In a grating there is no localized planar reflector, but the same accounting still runs. A wave at frequency close to a [stopband](#defn-stopband) boundary $\omega_\pm$ propagates with group velocity $v_g = q/\delta \to 0$ ([§ 0.7](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-7) of the previous post) — the slope $d\omega/dq$ of the dispersion curve goes to zero at the stopband boundary. Effectively slow light accumulates the same round-trip phase over one or two of its decay lengths $1/\kappa$ that a fast wave would need the full flat-mirror $2L$ for. The modes are the specific $\omega$ inside the [stopband](#defn-stopband) whose accumulated forward-plus-backward-envelope phase across the grating returns to itself: a discrete comb of standing solutions of the coupled envelope equations, with the grating simultaneously providing both mirrors and filling.

**The [stopband](#defn-stopband) is a wavelength-selective filter.** Modes at frequencies $|\delta| < \kappa$ have $q^2 < 0$ by \eqref{eq:hyperbola}, so their envelope decays as $e^{-\alpha z}$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$ ([previous post § 0.6](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-6)). Over a grating of length $L$ with $\kappa L \gtrsim 2$, the envelope has decayed to a small fraction of its input at the far end, and by the flux conservation $\vert A \vert^2 - \vert B \vert^2 = T$ of [§ 2.2](#sec-2-2), $R \to 1$. Modes at $\vert\delta\vert > \kappa$ propagate through the grating with real $q$ and are reflected only by the impedance mismatch at the two grating ends — the same $R \approx 0.3$ Fresnel factor as the flat-mirror case, no better. The [gain](#defn-gain) profile $\gamma(\nu)$ therefore sees strongly asymmetric round-trip loss: mirror-like inside the stopband, transmission-like outside. The lasing modes are confined to a bandwidth $2\kappa v_g$ around $\lambda_B$ ([§ 1.4](#sec-1-4)) — a small handful, not the thousands of the flat-mirror comb.

*Confining the lasing modes to a handful is a partial fix. Which of the handful wins, and can we guarantee that only one does?*

#### Which mode wins: density of states and field–gain overlap {#sec-4-2-1}

Two physical enhancements push the emitters toward the two $\omega_\pm$ standing modes of [§ 1](#sec-1) — both at $q = 0$, the two stopband edges. Together they decide which of the discrete lasing candidates gets to lase.

**Density of states enhancement at $\omega_\pm$.**

<div class="guided-fold-start" data-label="Derive the 1D density of states and its edge divergence" data-tone="derivation"></div>

For a 1D dispersion $\omega(q)$, define $\rho(\omega)$ operationally: put the field in a box of length $L$ with periodic boundary conditions, then

$$\rho(\omega)\, d\omega \equiv \frac{1}{L}\, \bigl(\text{number of allowed } q\text{ values with frequency in } [\omega, \omega + d\omega]\bigr).$$

The units are (frequency)$^{-1}$ (length)$^{-1}$: modes per unit frequency per unit length.

- **Allowed $q$-values.** Periodic boundary conditions on a length-$L$ box quantize $q$ to $q_n = 2\pi n / L$, giving one allowed value per interval $\Delta q = 2\pi / L$. So the number of allowed $q$-values in a small $q$-window of width $dq$ is $dq / (2\pi/L) = L\, dq / (2\pi)$, or a density $L / (2\pi)$ per unit $q$.

- **Convert $q$ to $\omega$.** For each branch of the dispersion, $\rho(\omega)\, d\omega = \frac{1}{L}\, \frac{L}{2\pi}\, dq = \frac{1}{2\pi} \left\vert\frac{dq}{d\omega}\right\vert d\omega = \frac{1}{2\pi\, v_g}\, d\omega$, since $v_g = d\omega/dq$.

- **Count both branches.** For each $\omega$ at which $q(\omega)$ is real, two values of $q$ solve $\omega(q) = \omega$ — one on the $+q$ branch, one on the $-q$ branch — each contributing $1/(2\pi v_g)$. Adding:

$$\rho(\omega) = \frac{1}{\pi\, v_g}.$$

- **Why $\rho \to \infty$ as $\omega \to \omega_\pm$.** At the stopband edge $q = 0$, $v_g = 0$; the two branches meet with vertical tangent. Expand $\omega(q)$ around $q = 0$: $\omega(q) \approx \omega_\pm + \tfrac{1}{2}\, \omega''(0)\, q^2$, so $q(\omega) \approx \sqrt{2(\omega - \omega_\pm)/\omega''(0)}$ and $dq/d\omega \propto 1/\sqrt{\omega - \omega_\pm}$. That is where the divergence comes from — a stationary point of $\omega(q)$, and nothing more mysterious.

<div class="guided-fold-end"></div>

The rate at which the [gain](#defn-gain) medium's excited carriers deposit energy into a given mode is proportional to $\rho$ at that mode's frequency. Modes at $\omega_\pm$ are therefore populated faster than modes deeper inside the [stopband](#defn-stopband), where $\rho$ is finite.

**Field–gain spatial overlap.** The $\omega_-$ and $\omega_+$ standing waves peak in complementary halves of one [Bragg period](#defn-bragg-period) ([§ 1.1](#sec-1-1)) — $\omega_-$ (the cosine mode) in the high-index material, $\omega_+$ (the sine mode) in the low-index material. If the [gain](#defn-gain) $\gamma(z)$ is concentrated where one standing wave's intensity peaks, the effective per-unit-length gain that mode sees is

$$\gamma_\text{eff} = \frac{\int \gamma(z)\, \vert E(z) \vert^2\, dz}{\int \vert E(z) \vert^2\, dz},$$

which is a larger fraction of the peak $\gamma$ for the mode whose intensity overlaps the [gain](#defn-gain) region than for the mode whose intensity sits in the other half of the period. The standard [DFB](#defn-dfb) fabrication places the [gain](#defn-gain) region in the high-index material of the grating; that overlaps the $\omega_-$ mode's intensity peaks, and $\omega_-$ sees the larger $\gamma_\text{eff}$.

Both enhancements favour $\omega_-$ over $\omega_+$. Neither, on its own, is enough to force single-mode operation.

#### The two-mode problem and the quarter-wave defect {#sec-4-2-2}

A grating with purely real (index) modulation has $\omega_-$ and $\omega_+$ with almost the same net gain: both edges have $v_g \to 0$ symmetrically, so the density-of-states enhancement is the same at both, and only the field–gain overlap of [§ 4.2.1](#sec-4-2-1) separates them. That separation is small enough that any bias in the fabrication — layer thicknesses off by a few nm, index inhomogeneity, one grating end slightly stronger than the other — can flip which mode wins on a given device, and the laser will hop between $\omega_-$ and $\omega_+$ as it operates.

Two ways to break the tie by construction:

- **Insert a $\lambda/4$ phase shift at the grating center.** A physical spacer of quarter-wave optical thickness ($n\, d = \lambda_B/4$), placed halfway along the grating, changes the boundary condition felt by the field. In an unshifted grating $\omega_-$ and $\omega_+$ are related by a translation of half a [Bragg period](#defn-bragg-period); the $\lambda/4$ shift breaks that translation symmetry and creates a *single* defect mode localized around the shift, at the exact center of the [stopband](#defn-stopband). The mode is spatially symmetric under reflection about the shift point and has no equal-frequency partner — it is a localized state inside the photonic bandgap, decaying exponentially into the surrounding grating with the center-gap decay length $1/\kappa$. This defect mode is the analog of an impurity state in an electronic semiconductor bandgap.

- **Give the modulation a gain (imaginary) component.** So far the modulation has been purely in the real part of $\varepsilon(z)$. If the modulation carries an imaginary part too — periodic variation in [gain](#defn-gain) or loss — the two $\omega_\pm$ modes see qualitatively different net gains: their standing-wave intensities overlap the gain modulation differently. The tie is broken without a structural phase shift. This is the topic of [§ 4.3](#sec-4-3).

### § 4.3. Adding a gain component to the modulation {#sec-4-3}

Split $\Delta\varepsilon(z)$ into real and imaginary parts:

$$\Delta\varepsilon(z) = \Delta\varepsilon'(z) + i\, \Delta\varepsilon''(z).$$

The real part $\Delta\varepsilon'$ modulates the refractive index; the imaginary part $\Delta\varepsilon''$ modulates [gain](#defn-gain) or loss (see [the complex-response section of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-8) for the sign convention). The two limits behave differently:

- **$\Delta\varepsilon'' = 0$ (pure index modulation).** $\omega_-$ and $\omega_+$ sit at the two [stopband](#defn-stopband) edges with nearly the same $\gamma_\text{eff}$. Mode selection is fragile; the $\lambda/4$ shift of [§ 4.2.2](#sec-4-2-2) is what forces a single mode.

- **$\Delta\varepsilon' = 0$ (pure gain modulation).** The two standing waves $\omega_-$ and $\omega_+$ still peak in complementary halves of one [Bragg period](#defn-bragg-period), but now the modulation itself is the [gain](#defn-gain) profile. The overlap integral $\int \gamma(z)\, \vert E(z) \vert^2\, dz$ picks up opposite signs for the two: one mode overlaps the gain peaks, the other overlaps the gain troughs (which act as loss). The two $\gamma_\text{eff}$ therefore differ by a finite amount set by the modulation depth — no $\lambda/4$ shift needed. The cost is fabrication: modulating $\gamma$ across $z$ requires physically corrugating the [gain](#defn-gain) region, which is much harder than the smooth index grating of the pure-index case.

Real gratings carry both. That raises a natural question: since we chose $\Delta\varepsilon'$ and $\Delta\varepsilon''$ separately in each of the two limits above, can we independently pick their values in the same device? The answer is no, and the reason is a general property of causal linear response.

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

For a single-mode laser, the linewidth $\Delta\nu$ is the frequency-domain width of the emission peak — equivalently, the reciprocal of the timescale $\tau_\text{coh}$ over which the emitted phase stays predictable ($\Delta\nu \sim 1/(2\pi \tau_\text{coh})$). A narrow line means a long-lived phase. Three effects add to set that timescale:

- **Photon lifetime $\tau_p$.** Even the passive [cavity](#defn-cavity) — no [gain](#defn-gain), no noise — has a finite response time set by how many round trips the field survives before residual loss dominates. This alone gives a passive linewidth $\Delta\nu_p \sim 1/(2\pi \tau_p)$; longer gratings and larger $\kappa$ (so $R \to 1$ at both effective mirrors) make $\tau_p$ larger and $\Delta\nu_p$ smaller.

- **Spontaneous emission phase noise.** Even inside an actively lasing mode, some of the transitions in the [gain](#defn-gain) medium happen at random times with random phase, injecting incoherent field into the coherent mode. Each event kicks the mode's phase by an amount that scales as one over the square root of the intra-cavity photon number. These random kicks accumulate as a random walk of the phase — a Lorentzian line whose width is inversely proportional to output power.

- **Amplitude–phase [coupling](#defn-coupling) through the carrier density.** By the causal response of [§ 4.3.1](#sec-4-3-1), changing the number of free carriers changes $\Delta\varepsilon''$ (the [gain](#defn-gain)) *and* $\Delta\varepsilon'$ (the refractive index) at the same time. So every amplitude fluctuation — including the spontaneous-emission kicks above — carries a phase fluctuation with it. The strength of the drag is captured by a dimensionless ratio

  $$\alpha_H = -\frac{d \Delta\varepsilon' / dN}{d \Delta\varepsilon'' / dN},$$

  where $N$ is carrier density; typical values are 2 to 5. Because both the "direct" spontaneous-emission phase kick and the amplitude-mediated phase kick add coherently in the linewidth, the noise contribution is multiplied by $(1 + \alpha_H^2)$.

Combining these gives

$$\Delta\nu = \frac{h\nu\, n_{sp}}{4\pi\, \tau_p^2\, P_\text{out}}\, (1 + \alpha_H^2), \tag{11}\label{eq:linewidth}$$

with $P_\text{out}$ the output power and $n_{sp} \geq 1$ counting spontaneous emissions per stimulated emission event. Two shapes of dependence to read off: $\Delta\nu \propto 1/P_\text{out}$ (higher output power narrows the line, because more coherent photons dilute each spontaneous kick) and $\Delta\nu \propto 1/\tau_p^2$ (longer photon lifetime narrows the line quadratically).

That leaves one operational question about the [DFB](#defn-dfb): $\lambda_B = 2 n_\text{avg}\, \Lambda$ is fixed at fabrication. Can it be moved after the fact, and by how much?

### § 4.5. Tuning a DFB {#sec-4-5}

Tuning a [DFB](#defn-dfb) requires shifting its [Bragg wavelength](#defn-bragg-wavelength) $\lambda_B = 2 n_\text{avg}\, \Lambda$. The physical period $\Lambda$ is fixed by lithography, so tuning must change $n_\text{avg}$. Two mechanisms are practical:

- **Temperature.** The thermo-optic effect and thermal expansion give a temperature dependence to the effective index — of order $0.1$ nm of wavelength shift per K in typical semiconductor gain media. Total tuning range around 5 nm; response time in milliseconds (set by thermal diffusion in the chip).
- **Current injection.** Injected carriers change the refractive index directly (free-carrier plasma effect and band-filling). Fast — nanoseconds — but only about $0.01$ nm per mA, and with unwanted [coupling](#defn-coupling) to output power (more current means more [gain](#defn-gain)).

Both act on the whole device at once: because the grating and the [gain](#defn-gain) share the same $n_\text{avg}$, moving one drags the other. The tuning range is capped at a few nm. Wider tuning requires making $\kappa$ and $\gamma$ act in physically distinct stretches of waveguide, so their indices can move independently.

### § 4.6. DBR laser: grating outside the gain {#sec-4-6}

A **DBR laser** places the [coupling](#defn-coupling) and the [gain](#defn-gain) in physically distinct stretches of the same waveguide. Reading along the propagation axis: a central active stretch carries $\gamma$; one or both ends of the waveguide continue into a passive stretch carrying $\kappa$ instead. Each stretch has its own electrical contact, so the current injected into the [gain](#defn-gain) region and the current injected into the [DBR](#defn-dbr) region — the latter used to shift $n$ through the free-carrier effect of [§ 4.5](#sec-4-5) — are set independently.

Three tuning strategies follow from that independence:

- **Grating-only tune.** Change the index of the [DBR](#defn-dbr) stretch while leaving the [gain](#defn-gain) stretch fixed. $\lambda_B$ moves, but the total round-trip length and the mode spacing are essentially unchanged. As $\lambda_B$ moves across successive [cavity](#defn-cavity) modes, the laser hops from one to the next.

- **Cavity-only tune.** Insert a passive phase-shift stretch between the grating and the [gain](#defn-gain), and change its index. This shifts the [cavity](#defn-cavity) mode frequencies without moving $\lambda_B$. Continuous tuning over one free spectral range is possible without a mode hop.

- **Combined.** Tune both stretches together, keeping the selected [cavity](#defn-cavity) mode centered inside the [stopband](#defn-stopband) as the stopband slides. This is the widest continuous-tuning strategy with a single grating.

The [DBR](#defn-dbr) laser has more stretches to control than a [DFB](#defn-dfb) — typically three or four, each with its own contact — but the combined strategy reaches further, without mode hops.

That "further" is still bounded, though. A single grating tunes over 10 nm continuously at most before the [gain](#defn-gain) profile itself limits the reach. Reaching 40 nm or more from a single device needs a different trick.

### § 4.7. Vernier tuning with sampled gratings {#sec-4-7}

The trick is to replace each single-peak reflector with a **comb** of many narrow peaks, and make the two combs of the two mirrors have slightly different tooth spacings. Then the [cavity](#defn-cavity) has low round-trip loss only where a front-mirror tooth aligns with a rear-mirror tooth, and only one such alignment falls inside the [gain](#defn-gain) window at a time. Shifting one comb by a small amount slides its teeth across the other's, and the coincidence jumps by a large amount — the tuning multiplication of a mechanical Vernier caliper, applied to reflection peaks instead of length graduations.

How to make a [DBR](#defn-dbr) reflect as a comb: apply a slow envelope on top of the Bragg modulation. If the grating consists of short bursts of Bragg modulation separated by longer unmodulated stretches — a **sampled grating** — its effective [coupling](#defn-coupling) profile is the Bragg fundamental times the sampling window. Fourier-transforming that product turns the single peak at $\pm 2 k_B$ into a series of prominent peaks spaced by the reciprocal of the sampling period. Each peak opens its own narrow [stopband](#defn-stopband), and the [DBR](#defn-dbr) reflects at all of them at once.

Choosing different sampling periods for the two mirrors produces combs with different tooth spacings; the Vernier reach grows as the two sampling periods approach each other. A pair of sampled-grating [DBRs](#defn-dbr) bracketing a [gain](#defn-gain) stretch therefore covers tens of nm from a single device — an order of magnitude beyond the continuous limit of [§ 4.6](#sec-4-6).

*All of the above use gratings with uniform amplitude and uniform period. What can we do by shaping the grating — varying its amplitude or its period along the length?*

---

## § 5. Engineered gratings {#sec-5}

Sections 1–4 treated the grating as uniform: constant [coupling](#defn-coupling) $\kappa$ and constant period $\Lambda$. Real gratings can vary either along their length, and the two knobs — spatial variation of amplitude, spatial variation of period — open up a family of engineered devices. We cover apodization, chirp, co-propagating coupling, and the extension of the Bragg momentum-conservation argument to nonlinear frequency conversion.

### § 5.1. Apodization: shaping the amplitude {#sec-5-1}

A uniform grating of length $L$ has a rectangular spatial window: full modulation over $[0, L]$, zero outside. Its reflectivity spectrum is (in the small-coupling limit) the Fourier transform of that rectangular envelope, so it has sinc-like sidelobes on either side of the main [stopband](#defn-stopband). The stopband itself is a strong-reflection band; the sidelobes are weaker reflections at unwanted wavelengths. For a channel filter — dropping one wavelength from a stream of many — the sidelobes cause cross-talk between neighboring channels.

**Apodization** replaces the rectangular window with a smoother one:

$$\kappa(z) = \kappa_0\, w(z),$$

with $w(z)$ a window function that rises smoothly from zero at the ends of the grating to unity in the middle. Common choices — Gaussian, raised-cosine, Kaiser — are the same window shapes used in digital filter design. Apodization is that signal-processing operation applied to the grating's spectral response.

The trade-off is the standard windowing one: a smoother window suppresses sidelobes but broadens the main lobe. A Gaussian-apodized grating has essentially no sidelobes but a wider [stopband](#defn-stopband) than the same-length rectangular grating. Fiber Bragg gratings used as wavelength-division-multiplexing filters are almost always apodized to keep adjacent channels isolated, with the wider stopband accepted as the cost.

### § 5.2. Chirp: shaping the period {#sec-5-2}

**Chirp** varies the local period $\Lambda(z)$ along the grating. Via $\lambda_B = 2 n_\text{avg}\, \Lambda$, the local [Bragg wavelength](#defn-bragg-wavelength) is a function of position. For a linear chirp,

$$\Lambda(z) = \Lambda_0 (1 + \alpha z), \qquad \lambda_B(z) = \lambda_{B, 0}(1 + \alpha z),$$

different parts of the grating reflect different wavelengths.

An incident wave at wavelength $\lambda$ propagates into the grating from the left, at first outside every local stopband, until it reaches the depth $z^*$ at which $\lambda_B(z^*) = \lambda$ — its "own" Bragg point. There it reflects. Shorter wavelengths turn around near the entrance; longer wavelengths propagate deeper before turning around. Different wavelengths therefore acquire different round-trip *times*, and the grating acts as a **dispersive reflector**: group delay as a function of wavelength has a controlled slope, engineered by the chirp profile.

The primary application is dispersion compensation in fiber-optic links. Standard telecom fiber has group-velocity dispersion of about $17\,\text{ps}/(\text{nm} \cdot \text{km})$: a pulse with 10 nm of spectral bandwidth broadens by 170 ps of temporal width after 1 km of propagation. A chirped fiber Bragg grating with the *opposite* sign of dispersion, of matched magnitude, undoes the broadening: the received pulse is recompressed to its original width. Real designs must match not just first-order dispersion but the slope (second-order dispersion) and polarization behavior across the spectrum; those refinements need the full transfer-matrix treatment of [§ 8 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-8).

A related use is intracavity dispersion compensation in femtosecond lasers, where the round-trip group-velocity dispersion from prisms, air, and the gain medium has to be cancelled to sustain pulses of picosecond duration or shorter. Chirped mirrors are the standard element for delivering a prescribed group-delay profile.

The mechanism is a direct reading of \eqref{eq:hyperbola} at $\delta = \pm\kappa$: group velocity vanishes at the two [stopband](#defn-stopband) boundary frequencies $\omega_\pm$ of [§ 1](#sec-1), and its slope diverges there. Chirping the grating slides that vanishing point in $z$, so different wavelengths hit the boundary at different depths, integrate different accumulated phases, and emerge with the designed group delay.

### § 5.3. Co-propagating coupling and long-period gratings {#sec-5-3}

The coupled-mode analysis of [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) handled a *counter*-propagating pair: forward and backward waves along the same waveguide, coupled by a grating with $G_1 = 2 k_B$ that supplies the round-trip momentum kick. The same formalism applies to a *co*-propagating pair: two guided modes of a waveguide, both moving in the same direction with wavenumbers $k_1 > k_2$, coupled by a grating with $G = k_1 - k_2$.

The coupled-mode equations for the two co-propagating amplitudes are

$$\frac{d A_1}{d z} = i\delta\, A_1 + i\kappa\, A_2, \qquad \frac{d A_2}{d z} = -i\delta\, A_2 + i\kappa\, A_1. \tag{12}\label{eq:copropag}$$

These look almost like the counter-propagating equations \eqref{eq:cme}, but with a critical sign difference: both terms on the right-hand side have coefficients of the same sign, not opposite signs. That single sign change flips the conservation law of the system.

Computing $d(\vert A_1 \vert^2 + \vert A_2 \vert^2) / dz$ from \eqref{eq:copropag} (differentiate each modulus squared, use the equations to eliminate $d A_i / dz$),

$$\frac{d}{dz}\left(\vert A_1 \vert^2 + \vert A_2 \vert^2\right) = 0.$$

The *sum* of the two mode powers is conserved: total power is conserved between the two co-propagating modes because both are forward-going and neither leaves the waveguide. Energy sloshes back and forth periodically between $A_1$ and $A_2$ along the grating, with a period set by $\kappa$.

Contrast with the counter-propagating case, where the conserved quantity is $\vert A \vert^2 - \vert B \vert^2$ — the *net* Poynting flux through any cross-section — and where inside the [stopband](#defn-stopband) the individual mode powers grow exponentially as a standing wave builds up between the two effective mirrors.

The two [coupling](#defn-coupling) situations are therefore physically distinct: counter-propagating coupling produces a stopband and Bragg reflection; co-propagating coupling produces periodic energy transfer between two guided modes.

**Long-period fiber gratings** exploit the co-propagating case. A grating with period much longer than the [Bragg period](#defn-bragg-period) — typically 100–500 $\mu\text{m}$ versus $\sim 0.5\,\mu\text{m}$ for a fiber Bragg mirror — couples the fundamental core-guided mode of a fiber to a co-propagating cladding mode. The cladding mode leaks out through the fiber jacket, so from the input's viewpoint the long-period grating acts as a wavelength-dependent loss: at wavelengths satisfying the phase-matching condition $\Lambda = \lambda_0 / (n_\text{core} - n_\text{cladding})$, power leaves the core and is lost. These devices are used as gain-flattening filters in erbium-doped fiber amplifiers, and as temperature and strain sensors where the loss-dip wavelength moves with the fiber's environment.

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

[§ 1](#sec-1) and [§ 2](#sec-2) read \eqref{eq:hyperbola} — the Bragg dispersion $q^2 = \delta^2 - \kappa^2$ — at four operating points:

- $\delta = \pm\kappa$: the two standing waves $\omega_\pm$ and which sits at the lower frequency ([§ 1](#sec-1)).
- $\delta = 0$ inside an infinite medium: the decay scale $1/\kappa$ ([§ 2.1](#sec-2-1)).
- $\delta = 0$ inside the [stopband](#defn-stopband) with two boundaries: the finite-mirror reflectivity $\tanh^2(\kappa L)$ ([§ 2.2](#sec-2-2)).

[§ 3](#sec-3)–[§ 5](#sec-5) build on that base:

- Piecewise-constant modulation as fabricated hardware: the [DBR](#defn-dbr) ([§ 3](#sec-3)).
- Modulation in the presence of [gain](#defn-gain): the [DFB](#defn-dfb) laser and its DBR-laser and Vernier-tunable cousins ([§ 4](#sec-4)).
- Modulation shaped along its length: apodization, chirp, co-propagating [coupling](#defn-coupling), and quasi-phase matching ([§ 5](#sec-5)).

The two ingredients that make all of it work were the two-wave truncation of the previous post's [§ 4](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) and the accessibility of both stopband boundary frequencies $\omega_\pm$. Every device-specific formula in this post follows from those two facts, taken through one universal hyperbola.
