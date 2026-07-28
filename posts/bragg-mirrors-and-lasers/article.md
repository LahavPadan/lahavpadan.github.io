# Bragg Mirrors, Laser Cavities, and Engineered Gratings

The previous post, [Coupled Modes, Bragg Structures, and Photonic Bandgaps](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/), takes a general $2 \times 2$ eigenvalue problem and lands it on a periodic index modulation — a **grating**{:#defn-grating}.

Two devices sit at the center of what follows:

- A **distributed Bragg reflector**{:#defn-dbr} (DBR) is a grating used as a wavelength-selective element. It reflects strongly in a narrow band around its design wavelength and transmits outside it. The same object also serves as one of the two mirrors of the laser [cavity](#defn-cavity) built in [§ 4](#sec-4).
- A **distributed-feedback laser**{:#defn-dfb} (DFB) puts the same grating *inside* a [gain](#defn-gain) medium and uses Bragg reflection in place of end mirrors, so the wavelength of the laser is set by the grating rather than by the gain's emission peak.

Everything else developed here — apodization ([§ 5.1](#sec-5-1)), chirp ([§ 5.2](#sec-5-2)), long-period [coupling](#defn-coupling) ([§ 5.3](#sec-5-3)), and quasi-phase matching ([§ 5.4](#sec-5-4)) — is a variation on the same physics with the grating shaped or repurposed.

The results we use from the previous post, all justified in [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4):

- A grating with **Bragg period**{:#defn-bragg-period} $\Lambda$ singles out the **Bragg wavenumber**{:#defn-bragg-wavenumber} $k_B = \pi/\Lambda$. Its defining property: a round trip through one period at $k_B$ accumulates $2\pi$, or equivalently, the grating's fundamental spatial harmonic $2 k_B$ is exactly the momentum kick that takes a forward wave at $+k_B$ into a backward wave at $-k_B$. The **Bragg wavelength**{:#defn-bragg-wavelength} — the vacuum wavelength that satisfies this first-order condition — is $\lambda_B = 2 n_\text{avg}\, \Lambda$, and the corresponding **Bragg frequency**{:#defn-bragg-frequency} is $\omega_B = 2\pi c/\lambda_B$, where $n_\text{avg}$ is the spatial average of the refractive index.

- Near this reference wavenumber, two Fourier components of the field dominate — the forward wave at $k \approx k_B$ and the wave it Bragg-backscatters into at $k - 2k_B \approx -k_B$. All others are suppressed by $\Delta n / n_\text{avg}$, where $\Delta n$ is the amplitude of the refractive-index modulation (if $n(z) = n_\text{avg} + \Delta n \cos(2 k_B z)$, then $\Delta n$ is the maximum deviation from the average). The field decomposes as

  $$E(z) = A(z)\, e^{i k_B z} + B(z)\, e^{-i k_B z},$$

  with slowly-varying envelopes $A$ (forward) and $B$ (backward).

- The two envelopes are governed by a **detuning**{:#defn-detuning} $\delta$ and a **coupling**{:#defn-coupling} $\kappa$,

  $$\delta = k - k_B, \qquad \kappa = \frac{\Delta n}{2\, n_\text{avg}}\, k_B.$$

  Both are wavenumbers, comparable to $k_B$ directly. $\delta$ is how far the driving wavenumber sits from $k_B$; $\kappa$ is set by the fractional index contrast $\Delta n / n_\text{avg}$ — a fixed fraction of $k_B$ that measures how strongly the grating mixes the forward and backward waves.

- The two envelopes obey the dispersion relation

  $$q^2 = \delta^2 - \kappa^2, \tag{$\star$}\label{eq:hyperbola}$$

  where $q$ is how far the mode's actual wavenumber inside the grating sits from $k_B$. Outside $\vert\delta\vert > \kappa$, $q$ is real and the field propagates. Inside $\vert\delta\vert < \kappa$, $q = i\alpha$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$, and the field decays exponentially. The range $\vert\delta\vert < \kappa$ is the **stopband**{:#defn-stopband}.

- The [stopband](#defn-stopband) is bounded on both sides at $\delta = \pm\kappa$, where $q = 0$: the forward and backward waves combine into a standing wave and the group velocity $v_g = d\omega/dq$ vanishes. Write $\omega_-$ and $\omega_+$ for the two boundary frequencies. Both are physically accessible in the Bragg problem, unlike the one-sided cutoffs (waveguide, plasma, relativistic massive field) of the [cutoff phenomena post](/posts/cutoff-phenomena/).

[§ 1](#sec-1) and [§ 2](#sec-2) apply \eqref{eq:hyperbola} at four values of $(\delta, q)$:

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

Inside the stopband ($|\delta| < \kappa$) \eqref{eq:hyperbola} gives $q^2 < 0$: the field decays exponentially and no wave propagates. The stopband is bounded above and below in $\omega$ by $\omega_-$ (lower) and $\omega_+$ (upper). We find these two frequencies twice, from complementary starting points: the coupled-mode framework ([§ 1.1](#sec-1-1), [§ 1.2](#sec-1-2)) and the multilayer stack ([§ 1.3](#sec-1-3)).

### § 1.1. Equal-mixture standing waves {#sec-1-1}

Set the driving spatial wavenumber to the Bragg value $k = k_B$, i.e. $\delta = 0$ — the case of **exact Bragg tuning**{:#defn-bragg-tuning}. The two-mode [coupling](#defn-coupling) matrix has zero diagonal and only the off-diagonal $\pm\kappa$ left. Its eigenvalues are $\pm\kappa$ — the two boundary frequencies $\omega_\pm = \omega_B \pm \kappa$ of the stopband, above and below the reference — and its eigenvectors are the equal mixtures

$$(A, B) = \frac{1}{\sqrt 2}(1, 1) \quad\text{and}\quad (A, B) = \frac{1}{\sqrt 2}(1, -1).$$

Substituting into $E(z) = A\, e^{i k_B z} + B\, e^{-i k_B z}$:

- $(1, 1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} + e^{-i k_B z} = 2 \cos(k_B z)$ — a **cosine standing wave**.
- $(1, -1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} - e^{-i k_B z} = 2i \sin(k_B z)$ — a **sine standing wave**.

Both have wavelength $2\pi/k_B = 2\Lambda$: exactly one full oscillation per two Bragg periods, or equivalently one intensity maximum per [Bragg period](#defn-bragg-period), so their intensities are periodic with the modulation.

Where the intensities sit relative to the modulation is what will matter for [§ 1.2](#sec-1-2). The cosine standing wave peaks where $\cos(2 k_B z)$ peaks, which is where $\varepsilon(z) = n_\text{avg}^2 + \Delta\varepsilon \cos(2 k_B z)$ is largest — that is, in the high-index parts of the modulation. The sine standing wave peaks in the low-index parts.

### § 1.2. Which of $\omega_-$, $\omega_+$ lies lower {#sec-1-2}

Both standing waves live at the same wavenumber $k_B$; dispersion sends that single wavenumber to two frequencies, one at each [stopband](#defn-stopband) edge. The real-space shapes alone do not say which shape goes with which frequency — the map from shape to $\omega$ is what the wave equation supplies. Extract $\omega^2$ from it directly.

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

So $\omega_-$ is the cosine standing wave, concentrated in the high-index material, and $\omega_+$ is the sine standing wave, concentrated in the low-index material — the mode concentrated in the high-index material lies at the lower frequency.

### § 1.3. Constructive interface reflection at the Bragg wavelength {#sec-1-3}

The same $\omega_\pm$ come out of a different picture. Instead of the two-Fourier-component truncation of [§ 1.1](#sec-1-1), take the grating as a stack of layers of piecewise-constant index — the multilayer we will build as a [DBR](#defn-dbr) in [§ 3](#sec-3) — and follow the phase of the individual interface reflections. [§ 1.4](#sec-1-4) then repeats the same phase argument at $\delta \neq 0$ to get the stopband width.

At normal incidence, an interface from refractive index $n_1$ into refractive index $n_2$ has amplitude reflection coefficient

$$r_{12} = \frac{n_1 - n_2}{n_1 + n_2}. \tag{2}\label{eq:fresnel}$$

Two properties of $r_{12}$ matter for what follows:

- **Sign.** Going from low to high index gives $r_{12} < 0$: the reflected amplitude is phase-shifted by $\pi$ relative to the incident amplitude. Going from high to low gives $r_{12} > 0$: no phase shift.
- **Magnitude.** For dielectric index differences from a few percent up to about 50%, $\vert r_{12} \vert$ is small — at most $\sim 0.2$.

Take the grating as a stack of alternating high-index and low-index layers. In each layer, the field's in-medium wavenumber at frequency $\omega$ is $k_i = n_i\, \omega/c$, and the one-way phase picked up crossing a layer of thickness $d_i$ is $k_i d_i$. At fabrication, the layer thicknesses are chosen so that

$$k_{i,B}\, d_i = \pi/2 \quad\Longleftrightarrow\quad n_i d_i = \lambda_B/4,$$

for both layer types (where $k_{i,B} = n_i\, \omega_B/c$ is the in-medium wavenumber at the Bragg frequency, and $\lambda_B$ is the vacuum Bragg wavelength). The product $n_i d_i$ is the **optical thickness**{:#defn-optical-thickness} of the layer, and each layer is *quarter-wave* by construction: at $\omega = \omega_B$, the one-way phase is $\pi/2$ and the round trip is $\pi$.

Compare two reflected amplitudes arriving back at the input plane:

- Reflection off the first air–high interface: $\pi$ from the reflection itself.
- Reflection off the next interface (high–low): $\pi$ from the round trip through the high layer, plus $0$ from the reflection.

Both arrive at the input plane with total phase $\pi$. They combine constructively. The next pair of interfaces adds two more contributions with the same total phase, and so on down the stack.

{% include visualization.html src="fresnel-quarter-wave-phase.html" title="Reflection phase and quarter-wave propagation phase compared at one return plane" %}

Off Bragg ($\delta \neq 0$), the round-trip phase per layer is no longer exactly $\pi$, and deeper and shallower reflections start to disagree in phase. The rate at which they lose coherence is what sets the stopband width. [§ 1.4](#sec-1-4) works it out.

### § 1.4. The stopband width, from phase-error accumulation {#sec-1-4}

At $\omega = \omega_B$ (i.e. $\delta = 0$), each layer's round-trip phase is exactly $\pi$ and reflections from all interfaces combine constructively.

Off Bragg the round-trip phase drifts away from $\pi$ per layer; the accumulated drift across the stack sets the stopband width.

<div class="guided-fold-start" data-label="Follow the phase error through a concrete 1% detuning" data-tone="derivation"></div>

Illuminate the same stack at frequency $\omega = 1.01\, \omega_B$ — off by 1%. The round-trip phase per layer is

$$\phi_\text{RT} = 2 k_i d_i = 2\, (n_i\, \omega / c)\, d_i = \pi\, (\omega/\omega_B) \approx 1.01\, \pi,$$

using $n_i d_i = \lambda_B/4 = \pi c/(2\omega_B)$ from § 1.3. Each layer contributes a phase *error* of $0.01\,\pi \approx 2°$. Small at one layer, but the errors accumulate as the wave works deeper:

- After 10 layers: accumulated error $\approx 18°$. Deep and shallow reflections still add roughly in phase.
- After 50 layers: accumulated error $\approx 90°$. Deep-layer reflections are orthogonal in phase to shallow ones — neither reinforcing nor cancelling.
- After 100 layers: accumulated error $\approx 180°$. Deep-layer reflections are opposed to shallow ones, and further layers subtract from the total instead of adding to it.

For this 1% [detuning](#defn-detuning), the useful reflecting depth is $\sim 100$ layers, about $30\,\mu\text{m}$ of physical depth.

<div class="guided-fold-end"></div>

\eqref{eq:hyperbola} gives the same picture from the algebra:

- The two boundaries $\delta = \pm\kappa$ are where $q^2 = 0$.
- The stopband is the interval $|\delta| < \kappa$ — a wavenumber range of width $\Delta k = 2\kappa$, symmetric about $k_B$.

Two roles of the same $\kappa$ come out of the coupled-mode dispersion:

- $\kappa$ as the *boundary* of $\delta$. The stopband width in wavenumber is $\Delta k = 2\kappa$; converting via $v_g$, the stopband width in frequency is $\Delta \omega = 2 \kappa v_g$.
- $\kappa$ as $|q|$ *at* $\delta = 0$. At [exact Bragg tuning](#defn-bragg-tuning) $q = i\kappa$, and the field decays as $e^{-\kappa z}$ over a length $1/\kappa$.

Both are set by the same fraction of $k_B$: from the coupling definition, $\kappa/k_B = \Delta n / (2 n_\text{avg})$. Half the fractional index contrast $\Delta n / n_\text{avg}$ sets the fractional stopband width $2\kappa/k_B$ and the reciprocal of the decay length in units of $1/k_B$.

*§ 1's derivations both describe an infinite grating. A real grating has finite length, so whatever enters at $z = 0$ has to eventually exit at $z = L$ or come back out. What sets how much of the incident amplitude actually comes back?*

---

## § 2. Finite gratings: decay length and reflectivity {#sec-2}

### § 2.1. Semi-infinite grating: the decay length $1/\kappa$ {#sec-2-1}

At $\delta = 0$ the dispersion \eqref{eq:hyperbola} gives $q^2 = -\kappa^2$, so $q = \pm i\kappa$ and the two spatial factors are $e^{+\kappa z}$ and $e^{-\kappa z}$. Extend the grating to fill the half-space $z > 0$; the $e^{+\kappa z}$ branch blows up at infinity and is dropped. The field decays as $e^{-\kappa z}$: amplitude falls by $e$ over $1/\kappa$. This decay length is a property of the *medium*. Cut the grating off at $z = L$ instead, and both branches must be kept — the second boundary is what selects the specific combination.

### § 2.2. Finite grating: the reflectivity {#sec-2-2}

Solve the two-boundary problem at $\delta = 0$ first — the [Bragg wavelength](#defn-bragg-wavelength) is where the reflection is strongest and where both envelopes evolve with the same single rate $\kappa$. Nonzero $\delta$ (still inside the stopband) replaces $\kappa$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$ throughout, but does not change the structure of the answer.

Before any calculation, two properties are guaranteed:

- **Energy conservation.** The coupled-mode matrix at $\delta = 0$ (below) is Hermitian, so $|A|^2 - |B|^2$ stays constant along $z$. Combined with the boundary conditions, that will force $R + T = 1$ once we solve the two-boundary problem.
- **A single dimensionless knob.** The coupled-mode equations at $\delta = 0$ carry only one parameter, $\kappa$; the grating carries one length, $L$. The only scale-free combination is $\kappa L$, which will control everything.

<div class="guided-fold-start" data-label="Reduce the coupled-mode equations to a two-boundary transfer matrix" data-tone="derivation"></div>

The coupled-mode equations for the envelopes $A(z)$ (forward, right-going) and $B(z)$ (backward, left-going), derived at [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4), are $dA/dz = i\delta A + i\kappa B$ and $dB/dz = -i\delta B - i\kappa A$. At $\delta = 0$ the diagonal terms drop and only the off-diagonal coupling remains,

$$\frac{d}{dz} \begin{pmatrix} A \\ B \end{pmatrix} = \begin{pmatrix} 0 & i\kappa \\ -i\kappa & 0 \end{pmatrix} \begin{pmatrix} A \\ B \end{pmatrix}. \tag{3}\label{eq:cme}$$

The matrix is Hermitian: $|A|^2 - |B|^2$ stays constant along $z$ (differentiate; the cross terms cancel).

Differentiate either component of \eqref{eq:cme} and substitute the other:

$$\frac{d^2 A}{dz^2} = \kappa^2\, A, \qquad \frac{d^2 B}{dz^2} = \kappa^2\, B.$$

Both envelopes satisfy the same second-order equation $X'' = \kappa^2 X$, so both are combinations of $\cosh(\kappa z)$ and $\sinh(\kappa z)$. Applying the coupled equations to fix the coefficients relates $(A, B)$ at any two points by a transfer matrix:

<div class="guided-fold-end"></div>

$$\begin{pmatrix} A(L) \\ B(L) \end{pmatrix} = \begin{pmatrix} \cosh(\kappa L) & i\, \sinh(\kappa L) \\ -i\, \sinh(\kappa L) & \cosh(\kappa L) \end{pmatrix} \begin{pmatrix} A(0) \\ B(0) \end{pmatrix}. \tag{4}\label{eq:propag}$$

*This is a two-boundary problem.* A wave incident from the left with nothing entering from the right fixes two of the four amplitudes: $A(0)$ is the input (rescale to $1$) and $B(L) = 0$ (nothing propagating leftward at $z = L$). The remaining two, $B(0)$ (reflected) and $A(L)$ (transmitted), fall out row by row:

| Row of \eqref{eq:propag} | Condition | Solve for | Modulus² |
|:---|:---|:---|:---|
| 2, with $B(L) = 0$ | $0 = -i\sinh(\kappa L) + \cosh(\kappa L)\, B(0)$ | $B(0) = i\tanh(\kappa L)$ | $R = \tanh^2(\kappa L)$ |
| 1, with $B(0) = i\tanh(\kappa L)$ | $A(L) = \cosh(\kappa L) + i\sinh(\kappa L) \cdot i\tanh(\kappa L)$ | $A(L) = \operatorname{sech}(\kappa L)$ | $T = \operatorname{sech}^2(\kappa L)$ |

The identity $\tanh^2 + \operatorname{sech}^2 = 1$ then gives

$$\boxed{\ R = \tanh^2(\kappa L), \qquad T = \operatorname{sech}^2(\kappa L), \qquad R + T = 1.\ } \tag{5}\label{eq:tanh-refl}$$

The envelopes throughout the grating, expressed as functions of $z$ rather than just their end values, are

$$A(z) = A(0)\, \frac{\cosh[\kappa (L - z)]}{\cosh(\kappa L)}, \qquad B(z) = i\, A(0)\, \frac{\sinh[\kappa (L - z)]}{\cosh(\kappa L)}. \tag{6}\label{eq:envelopes}$$

Compare with the semi-infinite case of [§ 2.1](#sec-2-1):

- **Semi-infinite.** Field decays purely as $e^{-\kappa z}$: one exponential mode, forced by boundedness at $z = \infty$.
- **Finite.** Both $\cosh$ and $\sinh$ branches are allowed; the far-end condition $B(L) = 0$ picks the specific combination \eqref{eq:envelopes}. As $\kappa L \to \infty$, the far end retreats to infinity and \eqref{eq:envelopes} reduces to $A(z) \to A(0)\, e^{-\kappa z}$ near the entrance — the semi-infinite decay recovers as a limit.

{% include visualization.html src="bragg-mirror-penetration.html" title="Infinite-medium decay, finite-boundary envelopes, and Bragg-mirror reflectivity" %}

$\kappa L$ is the only knob. Reading it dimensionally: $\kappa$ is an inverse length (the field's own decay length, from § 1.4), $L$ is a length, so $\kappa L$ measures the grating's physical length in units of $1/\kappa$. Setting $R > 0.99$,

$$\kappa L > \operatorname{arctanh}(\sqrt{0.99}) \approx 2.99,$$

so a grating at [exact Bragg tuning](#defn-bragg-tuning) needs about $3/\kappa$ of physical length to exceed 99% power reflectivity.

*$R = \tanh^2(\kappa L)$ says $\kappa$ and $L$ jointly set the mirror. What sets $\kappa$ in a stack we actually build?*

---

## § 3. The DBR: a Bragg grating in fabricated hardware {#sec-3}

We take the sinusoidal grating of § 1–§ 2 and replace it with what a real deposition tool produces: a stack of alternating high-index and low-index layers, $N$ pairs total — an *$N$-period stack*. The physics is the same, but three questions need concrete answers when the modulation is a square wave rather than a cosine:

- **How much reflection does an $N$-period stack deliver?** [§ 3.1](#sec-3-1) computes it exactly from the layer wave equation and reads off how quickly $R$ saturates with $N$.
- **What is $\kappa$ for a square-wave grating?** [§ 3.2](#sec-3-2) Fourier-expands the square wave; the lowest cosine harmonic — the one at wavenumber $2 k_B$ — is what drives the Bragg reflection, and it sets $\kappa$ as a fraction of $k_B$ through the index contrast $\Delta n = n_H - n_L$.
- **What do the higher Fourier components do?** [§ 3.3](#sec-3-3) shows they open additional stopbands at every odd multiple $m k_B$, each with a coupling $\kappa/m$ and correspondingly narrower, and lays out how to suppress or engineer them.

The last subsection [§ 3.4](#sec-3-4) adds one more variable — angle of incidence — and shows how off-normal illumination reshapes the geometry and splits the polarizations.

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

The same $|\text{tr}(T_L T_H)|$ gives the field's decay rate inside the stack, this time expressed as a rate per period $\alpha$: solving $\cosh(\alpha\Lambda) = |\text{tr}(T_L T_H)|/2$. For $n_H/n_L = 1.15$ (GaAs/AlAs, for instance), $|\text{tr}|/2 \approx 1.083$, giving $\alpha\Lambda \approx 0.408$; twenty periods deliver $\alpha N \Lambda \approx 8.2$, so $R = \tanh^2(8.2) \approx 1 - 10^{-7}$: essentially perfect. Real DBRs use 20–40 periods for this reason.

For large enough $N$, \eqref{eq:dbr-refl} agrees with the coupled-mode formula $R = \tanh^2(\kappa L)$ of [§ 2.2](#sec-2-2). They apply in complementary limits: \eqref{eq:dbr-refl} holds for the piecewise-constant profile at any $n_H/n_L$, while $\tanh^2(\kappa L)$ assumes $\vert r_{12} \vert \ll 1$ so the two envelopes vary slowly across a single layer. Both formulas agree in the overlap regime — long stacks with modest index contrast.

*So $\kappa$ and $L$ can be traded. But $\kappa$ itself came from the sinusoidal coupled-mode formula. What does it look like when the modulation is a piecewise-constant DBR?*

### § 3.2. The coupling of a piecewise-constant stack {#sec-3-2}

The formula $\kappa = (\Delta n / 2 n_\text{avg})\, k_B$, [equation (9) of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#eq:kappa-bragg), was for a sinusoidal index modulation. A DBR is instead *piecewise-constant* — the refractive index takes only two values, $n_H$ and $n_L$. Expand this square-wave modulation as a Fourier series; only the fundamental cosine drives the first Bragg reflection, and its coefficient is $(4/\pi)$ times the peak-to-average amplitude of the square wave. The effective sinusoidal amplitude is therefore $(2/\pi)\Delta n$, and

$$\kappa_\text{DBR} = \frac{1}{\pi}\, \frac{\Delta n}{n_\text{avg}}\, k_B, \qquad \Delta n \equiv n_H - n_L. \tag{8}\label{eq:dbr-kappa}$$

Reading the units: $\kappa_\text{DBR}/k_B = (1/\pi)(\Delta n/n_\text{avg})$ — a dimensionless number set purely by the fractional index contrast. Both design axes are downstream of this ratio: the stopband width $\Delta k = 2\kappa$ and the reflectivity $R = \tanh^2(\kappa L)$ share the same $\kappa$, so for a fixed $\Delta n$ a shorter mirror (smaller $L$) needs a wider stopband to keep the same reflectivity. Bandwidth and physical length trade off through $\kappa$; the [DBR](#defn-dbr) designer picks the balance.

*The DBR sits at the fundamental Bragg wavelength. Does the same square-wave stack reflect at any other wavelengths?*

### § 3.3. Higher-order stopbands and the structure factor {#sec-3-3}

The Fourier series of the square-wave modulation only used its fundamental component. But a square wave contains more than that: expanding $n(z) - n_\text{avg}$ as

$$n(z) - n_\text{avg} = \frac{\Delta n}{2}\, \text{sgn}[\cos(2 k_B z)] = \frac{2\Delta n}{\pi}\sum_{m=1,3,5,\ldots} \frac{(-1)^{(m-1)/2}}{m}\, \cos(2 m k_B z),$$

we see cosine harmonics at wavenumber $2 m k_B$ for every odd $m$, with amplitude $\propto 1/m$. Each of these harmonics is itself a periodic index modulation, so each drives its own Bragg reflection: the $m$-th harmonic scatters a wave at wavenumber $m k_B$ into the wave at $m k_B - 2m k_B = -m k_B$, satisfying the Bragg condition at *its* own resonance $k = m k_B$. In vacuum wavelength, that's $\lambda_B / m$.

The coupling for the $m$-th stopband is $\kappa_m = \kappa_\text{DBR}/m$, and the stopband width scales the same way — the third-order stopband is $1/3$ as wide as the first, the fifth $1/5$, and so on. Even orders are absent because the square wave has no even Fourier components.

Two engineering consequences:

- To *suppress* the higher-order stopbands (spurious reflections at shorter wavelengths), reshape the modulation profile so its Fourier expansion is closer to a pure fundamental — a graded or smoothed profile within a period. Fiber Bragg gratings, written by two-beam interference, are naturally sinusoidal and have very weak higher-order structure.
- To *engineer* stopbands at prescribed wavelengths, choose a modulation whose Fourier spectrum has content at the desired periods. Sampled gratings ([§ 5](#sec-5)) put multiple stopbands in prescribed places, supporting multi-wavelength lasing.

*The stopband positions and widths so far are set by normal-incidence Bragg. Off-normal, the geometry changes both. What is left of the stopband when the wave hits the stack at an angle?*

### § 3.4. Off-normal incidence and Brewster's angle {#sec-3-4}

Every calculation so far has assumed the wave hits the stack perpendicular to the layers. In many devices the wave arrives at an angle instead — the in-plane mode of a planar waveguide, for instance, strikes an integrated [DBR](#defn-dbr) at whatever internal angle the waveguide geometry sets. At off-normal incidence, three things change at once:

- **The one-way phase per layer picks up a $\cos\theta_i$.** With the wave at angle $\theta_i$ inside a layer of physical thickness $d_i$ (set by Snell's law), only the wavevector component perpendicular to the layers advances the stack coordinate: $k_{\perp,i} = k_i \cos\theta_i$, so the one-way phase is $k_{\perp,i}\, d_i = k_i d_i\, \cos\theta_i$ instead of $k_i d_i$. To restore the Bragg round-trip-of-$\pi$ per period at off-normal incidence, the operating frequency must move *up*:

  $$\omega_B(\theta_0)\, \big[n_H d_H \cos\theta_H + n_L d_L \cos\theta_L\big] = \pi c,$$

  larger than the normal-incidence value $\omega_B(0)\, (n_H d_H + n_L d_L) = \pi c$. Equivalently the in-medium Bragg wavenumber $k_B(\theta_0) = n_\text{avg}\, \omega_B(\theta_0)/c$ grows as the incidence angle grows.
- **The two polarizations acquire different interface reflectivities.** TE ($E$ perpendicular to the plane of incidence) and TM ($E$ in the plane of incidence, with a component along the layer normal) see the boundary-condition matching differently.
- **Polarization sensitivity of $\kappa$.** Since $\kappa$ is built from the interface reflections, it inherits their polarization dependence, and TE and TM acquire distinct stopbands.

{% include visualization.html src="oblique-bragg-phase.html" title="Why off-normal incidence shifts the Bragg wavelength through the normal wavevector component" %}

Matching tangential $E$ and tangential $H$ across the interface gives, for the two polarizations,

$$r_\text{TE} = \frac{n_1 \cos\theta_1 - n_2 \cos\theta_2}{n_1 \cos\theta_1 + n_2 \cos\theta_2}, \qquad r_\text{TM} = \frac{n_2 \cos\theta_1 - n_1 \cos\theta_2}{n_2 \cos\theta_1 + n_1 \cos\theta_2}. \tag{9}\label{eq:fresnel-full}$$

At $\theta_1 = 0$ both reduce to \eqref{eq:fresnel}. Off-normal, they split. Combining $r_\text{TM} = 0$ with Snell's law gives **Brewster's angle**{:#defn-brewster}, at which the TM reflection vanishes:

$$\tan\theta_1 = \frac{n_2}{n_1}. \tag{10}\label{eq:brewster}$$

The mechanism has a clean physical picture. The transmitted electric field polarizes the electrons of medium 2 into oscillating dipoles along its own direction, and the reflected wave is their re-radiation. A dipole cannot radiate along its own axis of oscillation — the null of its $\sin\theta$ pattern. At Brewster's angle Snell's law makes the reflected direction (in medium 1) coincide with the dipole axis (which points along the transmitted $E$ in medium 2), so the reflection has to vanish. TE has no analogue: its dipoles point out of the plane of incidence, and every in-plane direction — including every possible reflected direction — is broadside to them.

{% include visualization.html src="te-tm-boundary-admittance.html" title="How TE and TM see different reflectivities off-normal: the dipole-radiation mechanism at Brewster's angle" %}

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

First, though: what does a flat-mirror [cavity](#defn-cavity) do, and why does it fail to pick a wavelength?

### § 4.1. Why flat mirrors do not pick a wavelength {#sec-4-1}

Take the simplest cavity: a gain-carrying dielectric of length $L$ and effective index $n_\text{eff}$, bounded by two flat interfaces at which the index steps back to air. Two features of this setup decide what the laser does.

**A comb of resonant modes.** A round trip picks up phase $2 k L = 2\, n_\text{eff}\, \omega L/c$; the round-trip-of-$2\pi$ condition selects a discrete comb of frequencies

$$\nu_n = n \cdot \frac{c}{2 n_\text{eff} L}, \qquad \Delta\nu_\text{FSR} = \frac{c}{2 n_\text{eff} L},$$

where $\Delta\nu_\text{FSR}$ is the **free spectral range**. Each $\nu_n$ is a standing wave fitting an integer number of half-wavelengths between the mirrors.

**A mirror with no wavelength selectivity.** Each end is a single dielectric interface, so its reflection is the Fresnel formula \eqref{eq:fresnel} — a function only of the two refractive indices at the boundary. Refractive indices vary slowly with frequency (dispersion is a small effect over a laser's gain bandwidth), so $R$ is nearly constant across the entire comb. A single interface has no periodicity for the wavelength to match against.

Put together, the flat-mirror cavity supplies many modes and offers no way to prefer one over another *at the mirror level*. The only remaining source of frequency selectivity is the gain profile $\gamma(\nu)$. But $\gamma$ is broad — of order THz, so thousands of $\Delta\nu_\text{FSR}$ sit inside it — and its peak is not fixed: the drive current and the chip temperature move it during operation, and neither can be held steady enough to pin the winning mode. Whichever mode sits at the peak of $\gamma$ wins in that instant; when $\gamma$ shifts, the winning mode hops.

The target is one mode at a temperature-stable frequency, so the mirror itself has to become wavelength-selective — the lock needs to be built into the reflector, not left to the gain profile. A periodic structure does exactly this: interference across periods reinforces the wavelength that hits the Bragg condition and cancels its neighbors. Where that periodic structure sits relative to the [gain](#defn-gain) — interleaved with it, or in a separate stretch of waveguide — then decides which device we get.

### § 4.2. DFB: the grating co-located with the gain {#sec-4-2}

In a [DFB](#defn-dfb), the grating is interleaved with the [gain](#defn-gain) along the same stretch of waveguide: [coupling](#defn-coupling) $\kappa$ and [gain](#defn-gain) $\gamma$ act at every $z$. There are no separate end mirrors — the mirror is spread over the whole length. Two consequences of that colocation set the [DFB](#defn-dfb)'s selectivity.

**The grating is itself a [cavity](#defn-cavity).** In a flat-mirror laser the round trip is between two planes at fixed $z$: a wave leaves one, reflects at the other, and returns, and the lasing condition is that the round-trip field come back to itself in amplitude and phase — $R_1 R_2\, e^{2\gamma L}\, e^{i 2 k L} = 1$ at the mode frequency. In a grating there is no localized planar reflector, but the same accounting still runs. A wave at frequency close to a [stopband](#defn-stopband) boundary $\omega_\pm$ propagates with group velocity $v_g = q/\delta \to 0$ ([§ 0.7](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-7) of the previous post) — the slope $d\omega/dq$ of the dispersion curve goes to zero at the stopband boundary. Effectively slow light accumulates the same round-trip phase over one or two of its decay lengths $1/\kappa$ that a fast wave would need the full flat-mirror $2L$ for. The modes are the specific $\omega$ inside the [stopband](#defn-stopband) whose accumulated forward-plus-backward-envelope phase across the grating returns to itself: a discrete comb of standing solutions of the coupled envelope equations, with the grating simultaneously providing both mirrors and filling.

**The [stopband](#defn-stopband) is a wavelength-selective filter.** Modes at frequencies $|\delta| < \kappa$ have $q^2 < 0$ by \eqref{eq:hyperbola}, so their envelope decays as $e^{-\alpha z}$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$ ([previous post § 0.6](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-6)). Over a grating of length $L$ with $\kappa L \gtrsim 2$, the envelope has decayed to a small fraction of its input at the far end, and by the flux conservation $\vert A \vert^2 - \vert B \vert^2 = T$ of [§ 2.2](#sec-2-2), $R \to 1$. Modes at $\vert\delta\vert > \kappa$ propagate through the grating with real $q$ and are reflected only by the impedance mismatch at the two grating ends — the same $R \approx 0.3$ Fresnel factor as the flat-mirror case, no better. The [gain](#defn-gain) profile $\gamma(\nu)$ therefore sees strongly asymmetric round-trip loss: mirror-like inside the stopband, transmission-like outside. The lasing modes are confined to a bandwidth $2\kappa v_g$ around $\lambda_B$ ([§ 1.4](#sec-1-4)) — a small handful, not the thousands of the flat-mirror comb.

*Confining the lasing modes to a handful is a partial fix. Which of the handful wins, and can we guarantee that only one does?*

#### Which mode wins: density of states and field–gain overlap {#sec-4-2-1}

Two effects push the emitters toward the two $\omega_\pm$ standing modes of [§ 1](#sec-1) — both at $q = 0$, the two stopband edges. Together they decide which of the discrete lasing candidates gets to lase.

**More available modes per frequency at $\omega_\pm$.** By Fermi's golden rule, the rate at which an excited carrier in the [gain](#defn-gain) medium deposits energy into modes at frequency $\omega$ scales with the **density of states**{:#defn-dos} $\rho(\omega)$ — the count of modes per unit frequency per unit length. That density diverges at the two stopband boundaries, and we work out why below.

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

The DFB's lasing candidates are the discrete cavity modes sitting inside the [stopband](#defn-stopband) ([§ 4.2](#sec-4-2)). Among them, the two closest to $\omega_\pm$ inherit the divergent $\rho$; the ones farther in see a finite (much smaller) $\rho$. So by Fermi's golden rule the emission rate is largest for the two edge modes — the first of two effects favouring them.

**Field–gain spatial overlap.** The $\omega_-$ and $\omega_+$ standing waves peak in complementary halves of one [Bragg period](#defn-bragg-period) ([§ 1.1](#sec-1-1)) — $\omega_-$ (the cosine mode) in the high-index material, $\omega_+$ (the sine mode) in the low-index material. The effective per-unit-length gain a given mode sees is its intensity-weighted average of $\gamma(z)$,

$$\gamma_\text{eff} = \frac{\int \gamma(z)\, \vert E(z) \vert^2\, dz}{\int \vert E(z) \vert^2\, dz}.$$

If $\gamma(z)$ is concentrated in one half of the period, one mode overlaps the peaks and picks up a $\gamma_\text{eff}$ close to peak $\gamma$; the mode peaked in the complementary half sees the troughs. Standard [DFB](#defn-dfb) fabrication places the [gain](#defn-gain) region in the high-index material, so $\omega_-$ (peaked there) sees the larger $\gamma_\text{eff}$.

Both effects favour $\omega_-$ over $\omega_+$. Neither, on its own, is enough to force single-mode operation.

#### The two-mode problem and the quarter-wave defect {#sec-4-2-2}

In a grating with purely real (index-only) modulation, $\omega_-$ and $\omega_+$ end up with almost the same round-trip gain. Both edges have $v_g \to 0$ by the same amount, so the density-of-states boost of [§ 4.2.1](#sec-4-2-1) helps both equally; the field–gain overlap is the only discriminator left. That overlap is thin — thin enough to lose to fabrication noise: a few-nanometer layer-thickness error, an index inhomogeneity, or an asymmetry between the two grating ends can flip which mode wins on a given device, and the laser can hop between $\omega_-$ and $\omega_+$ during operation.

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

  where $N$ is carrier density; measured values run 2 to 5. Because both the "direct" spontaneous-emission phase kick and the amplitude-mediated phase kick add coherently in the linewidth, the noise contribution is multiplied by $(1 + \alpha_H^2)$.

Combining these gives

$$\Delta\nu = \frac{h\nu\, n_{sp}}{4\pi\, \tau_p^2\, P_\text{out}}\, (1 + \alpha_H^2), \tag{11}\label{eq:linewidth}$$

with $P_\text{out}$ the output power and $n_{sp} \geq 1$ counting spontaneous emissions per stimulated emission event. Two shapes of dependence to read off: $\Delta\nu \propto 1/P_\text{out}$ (higher output power narrows the line, because more coherent photons dilute each spontaneous kick) and $\Delta\nu \propto 1/\tau_p^2$ (longer photon lifetime narrows the line quadratically).

That leaves one operational question about the [DFB](#defn-dfb): the lithography step fixes $\Lambda$ (and with it $k_B = \pi/\Lambda$) at fabrication. Can the emission frequency $\omega_B = \pi c/(n_\text{avg}\, \Lambda)$ be moved after the fact, and by how much?

### § 4.5. Tuning a DFB {#sec-4-5}

Tuning a [DFB](#defn-dfb) requires shifting its emission frequency $\omega_B = \pi c/(n_\text{avg}\, \Lambda)$. The physical period $\Lambda$ is fixed by lithography, so tuning must change $n_\text{avg}$. Two mechanisms are practical:

- **Temperature.** The thermo-optic effect and thermal expansion give a temperature dependence to the effective index — of order $0.1$ nm of wavelength shift per K in semiconductor gain media. Total tuning range around 5 nm; response time in milliseconds (set by thermal diffusion in the chip).
- **Current injection.** Injected carriers change the refractive index directly (free-carrier plasma effect and band-filling). Fast — nanoseconds — but only about $0.01$ nm per mA, and with unwanted [coupling](#defn-coupling) to output power (more current means more [gain](#defn-gain)).

Both act on the whole device at once: because the grating and the [gain](#defn-gain) share the same $n_\text{avg}$, moving one drags the other. The tuning range is capped at a few nm. Wider tuning requires making $\kappa$ and $\gamma$ act in physically distinct stretches of waveguide, so their indices can move independently.

### § 4.6. DBR laser: grating outside the gain {#sec-4-6}

A **DBR laser** places the [coupling](#defn-coupling) and the [gain](#defn-gain) in physically distinct stretches of the same waveguide. Reading along the propagation axis: a central active stretch carries $\gamma$; one or both ends of the waveguide continue into a passive stretch carrying $\kappa$ instead. Each stretch has its own electrical contact, so the current injected into the [gain](#defn-gain) region and the current injected into the [DBR](#defn-dbr) region — the latter used to shift $n$ through the free-carrier effect of [§ 4.5](#sec-4-5) — are set independently.

Three tuning strategies follow from that independence:

- **Grating-only tune.** Change the index of the [DBR](#defn-dbr) stretch while leaving the [gain](#defn-gain) stretch fixed. $\omega_B$ moves, but the total round-trip length and the mode spacing are essentially unchanged. As $\omega_B$ moves across successive [cavity](#defn-cavity) modes, the laser hops from one to the next.

- **Cavity-only tune.** Insert a passive phase-shift stretch between the grating and the [gain](#defn-gain), and change its index. This shifts the [cavity](#defn-cavity) mode frequencies without moving $\omega_B$. Continuous tuning over one free spectral range is possible without a mode hop.

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