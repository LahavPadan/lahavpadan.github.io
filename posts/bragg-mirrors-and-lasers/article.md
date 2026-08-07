# Bragg Mirrors, Laser Cavities, and Engineered Gratings

The previous post, [Coupled Modes, Bragg Structures, and Photonic Bandgaps](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/), takes a general $2 \times 2$ eigenvalue problem and lands it on a periodic index modulation — a **grating**{:#defn-grating}.

Two devices sit at the center of what follows:

- A **distributed Bragg reflector**{:#defn-dbr} (DBR) is a grating used as a wavelength-selective element. It reflects strongly in a narrow band around its design wavelength and transmits outside it. The same object also serves as one of the two mirrors of the laser [cavity](#defn-cavity) built in [§ 4](#sec-4).

- A **distributed-feedback laser**{:#defn-dfb} (DFB) puts the same grating *inside* a [gain](#defn-gain) medium and uses Bragg reflection in place of end mirrors, so the wavelength of the laser is set by the grating rather than by the gain's emission peak.

Everything else developed here — [apodization](#sec-5-1), [chirp](#sec-5-2), [long-period coupling](#sec-5-3), and [quasi-phase matching](#sec-5-4) — is a variation on the same physics with the grating shaped or repurposed.

The results we use from the previous post, all justified in [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4):

- The grating sits in a medium whose refractive index varies periodically along $z$: $n(z) = n_\text{avg} + \Delta n \cos(2 k_B z)$.

  The **average index**{:#defn-navg} $n_\text{avg}$ is the value the field would see if the modulation were smoothed away — the "background" index against which the modulation rides. Two things depend on it:

  - **Wavenumber ↔ vacuum wavelength.**

    A wave at vacuum wavelength $\lambda$ propagates in this medium with in-medium wavenumber $k = 2\pi n_\text{avg}/\lambda$, so a geometric condition on $k$ becomes a condition on $\lambda$ through $n_\text{avg}$.

  - **The small parameter of the problem.**

    The **fractional index contrast** — the ratio $\Delta n / n_\text{avg}$ of modulation amplitude to background index — is dimensionless and, for optical materials, small.

    Every coupling scale we compute is proportional to it (with a modulation-shape-dependent prefactor: $1/2$ for the sinusoidal case here, $1/\pi$ for the [square-wave stack](#sec-3-1)).

- A grating with **Bragg period**{:#defn-bragg-period} $\Lambda$ singles out the **Bragg wavenumber**{:#defn-bragg-wavenumber} $k_B = \pi/\Lambda$.

  Its defining property: a round trip through one period at $k_B$ accumulates $2\pi$, or equivalently, the grating's fundamental spatial harmonic $2 k_B$ is exactly the momentum kick that takes a forward wave at $+k_B$ into a backward wave at $-k_B$.

  Expressing this **Bragg condition**{:#defn-bragg-condition} in the vacuum wavelength — $k = k_B$ becomes $2\pi n_\text{avg}/\lambda = \pi/\Lambda$ — gives the **Bragg wavelength**{:#defn-bragg-wavelength}

  $$\lambda_B = 2\, n_\text{avg}\, \Lambda. \tag{1}\label{eq:bragg}$$

  The corresponding **Bragg frequency**{:#defn-bragg-frequency} is $\omega_B = 2\pi c/\lambda_B$.

- Near this reference wavenumber, the field decomposes into forward and backward envelopes at $\pm k_B$,

  $$E(z) = A(z)\, e^{i k_B z} + B(z)\, e^{-i k_B z},$$

  where $A$ (forward) and $B$ (backward) are slowly-varying on the wavelength scale.

  The two components at $\pm k_B$ are the ones the fundamental grating harmonic $2 k_B$ couples to each other; this two-mode reduction is justified for the sinusoidal modulation in [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4).

  Non-sinusoidal modulations carry additional Fourier harmonics of $n(z)$, each of which drives its own pair at [higher-order Bragg resonances](#sec-3-2) $k = m k_B$.

- The two envelopes are governed by a **detuning**{:#defn-detuning} $\delta$ and a **coupling**{:#defn-coupling} $\kappa$,

  $$\delta = k - k_B, \qquad \kappa = \frac{\Delta n}{2\, n_\text{avg}}\, k_B.$$

  Both are wavenumbers, depending on $k_B$ directly:

  - $\delta$ is how far the driving wavenumber sits from $k_B$.

  - $\kappa$ is a fixed fraction of $k_B$ set by the fractional index contrast $\Delta n / n_\text{avg}$, measuring how strongly the grating mixes the forward and backward waves.

- The two envelopes obey the dispersion relation

  $$q^2 = \delta^2 - \kappa^2, \tag{$\star$}\label{eq:hyperbola}$$

  where $q$ is how far the mode's actual wavenumber inside the grating sits from $k_B$. Outside $\vert\delta\vert > \kappa$, $q$ is real and the field propagates.

  Inside $\vert\delta\vert < \kappa$, $q = i\alpha$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$, and the field decays exponentially. The range $\vert\delta\vert < \kappa$ is the **stopband**{:#defn-stopband}.

- The [stopband](#defn-stopband) is bounded on both sides at $\delta = \pm\kappa$, where $q = 0$: the forward and backward waves combine into a standing wave and the group velocity $v_g = d\omega/dq$ vanishes.

  Write $\omega_-$ and $\omega_+$ for the two boundary frequencies.

  Both are physically accessible in the Bragg problem, unlike the one-sided cutoffs (waveguide, plasma, relativistic massive field) of the [cutoff phenomena post](/posts/cutoff-phenomena/).

Set the driving spatial wavenumber to the Bragg value, $k = k_B$ — the case of **exact Bragg tuning**{:#defn-bragg-tuning} ($\delta = 0$).

[§ 1](#sec-1) and [§ 2](#sec-2) apply \eqref{eq:hyperbola} at four values of $(\delta, q)$:

- $\delta = \pm\kappa$ (both stopband edges, $q = 0$): the [two standing waves at $\omega_\pm$](#sec-1-1).

- $\delta = 0$ in a semi-infinite grating: [exact-Bragg decay at rate $\kappa$](#sec-2-1).

- $\delta = 0$ with a second boundary at $z = L$: the [finite-mirror reflectivity $\tanh^2(\kappa L)$](#sec-2-2).

- $|\delta| > \kappa$: propagation resumes.

The remaining sections build on that base:

- [§ 3](#sec-3) turns the sinusoidal grating into a fabricated piecewise-constant stack — the [DBR](#defn-dbr).

- [§ 4](#sec-4) places the grating against a [gain](#defn-gain) medium: the [DFB](#defn-dfb) laser (grating inside the gain) and the DBR laser (grating in a separate section).

- [§ 5](#sec-5) lets the grating vary along its length.

---

## § 1. The two ends of the stopband, $\omega_-$ and $\omega_+$ {#sec-1}

Inside the stopband ($|\delta| < \kappa$) \eqref{eq:hyperbola} gives $q^2 < 0$: the field decays exponentially and no wave propagates.

The stopband is bounded above and below in $\omega$ by $\omega_-$ (lower) and $\omega_+$ (upper).

We find these two frequencies twice, from complementary starting points: the [coupled-mode framework](#sec-1-1) and the [multilayer stack](#sec-1-3).

### § 1.1. Equal-mixture standing waves {#sec-1-1}

At [exact Bragg tuning](#defn-bragg-tuning) the two-mode [coupling](#defn-coupling) matrix has zero diagonal and only the off-diagonal $\pm\kappa$ left.

Its eigenvalues are $\pm\kappa$ — the two boundary frequencies $\omega_\pm = \omega_B \pm \kappa$ of the stopband, above and below the reference — and its eigenvectors are the equal mixtures

$$(A, B) = \frac{1}{\sqrt 2}(1, 1) \quad\text{and}\quad (A, B) = \frac{1}{\sqrt 2}(1, -1).$$

Substituting into $E(z) = A\, e^{i k_B z} + B\, e^{-i k_B z}$:

- $(1, 1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} + e^{-i k_B z} = 2 \cos(k_B z)$ — a **cosine standing wave**.

- $(1, -1)/\sqrt 2$ gives $E(z) \propto e^{i k_B z} - e^{-i k_B z} = 2i \sin(k_B z)$ — a **sine standing wave**.

Both have wavelength $2\pi/k_B = 2\Lambda$: exactly one full oscillation per two Bragg periods, or equivalently one intensity maximum per [Bragg period](#defn-bragg-period), so their intensities are periodic with the modulation.

The cosine standing wave peaks where $\cos(2 k_B z)$ peaks, which is where $\varepsilon(z) = n_\text{avg}^2 + \Delta\varepsilon \cos(2 k_B z)$ is largest — that is, in the high-index parts of the modulation. The sine standing wave peaks in the low-index parts.

### § 1.2. Which of $\omega_-$, $\omega_+$ lies lower {#sec-1-2}

Both standing waves live at the same wavenumber $k_B$; dispersion sends that single wavenumber to two frequencies, one at each [stopband](#defn-stopband) edge.

The real-space shapes alone do not say which shape goes with which frequency — the map from shape to $\omega$ is what the wave equation supplies. Extract $\omega^2$ from it directly.

<div class="guided-fold-start" data-label="Extract ω² from the wave equation" data-tone="derivation"></div>

The scalar Helmholtz equation for a periodic dielectric, derived as [the scalar-wave-equation refresher in the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#picture-3-scalar-wave-equation), is

$$\frac{d^2 E}{dz^2} + \frac{\omega^2}{c^2}\, \varepsilon(z)\, E(z) = 0.$$

Multiply through by $E^*(z)$ and integrate over one [Bragg period](#defn-bragg-period), from $z = 0$ to $z = \Lambda$:

$$\int_0^\Lambda E^*\, \frac{d^2 E}{dz^2}\, dz + \frac{\omega^2}{c^2} \int_0^\Lambda \varepsilon(z)\, \vert E \vert^2\, dz = 0.$$

Solving for $\omega^2$,

$$\omega^2 = c^2\, \frac{-\int_0^\Lambda E^*\, (d^2 E / dz^2)\, dz}{\int_0^\Lambda \varepsilon(z)\, \vert E \vert^2\, dz}.$$

Integrate the numerator by parts once:

$$-\int_0^\Lambda E^*\, \frac{d^2 E}{dz^2}\, dz = -\left[E^*\, \frac{dE}{dz}\right]_0^\Lambda + \int_0^\Lambda \left|\frac{dE}{dz}\right|^2 dz.$$

The boundary term evaluates $E^*\, dE/dz$ at $z = \Lambda$ minus its value at $z = 0$. Both edge modes have $q = 0$, so their field is strictly $\Lambda$-periodic: $E(\Lambda) = E(0)$ and $dE/dz$ likewise.

The two evaluations agree and cancel, leaving the Rayleigh quotient below.

<div class="guided-fold-end"></div>

$$\omega^2 = c^2\, \frac{\int_0^\Lambda \vert dE/dz \vert^2\, dz}{\int_0^\Lambda \varepsilon(z)\, \vert E \vert^2\, dz}. \tag{2}\label{eq:rayleigh}$$

Apply \eqref{eq:rayleigh} to the two edge modes. Both are pure sinusoids at the same wavenumber $k_B$, so their derivatives $dE/dz$ have the same shape and the numerators integrate to the same value.

The only thing that separates them is the denominator, which depends on how the intensity $\vert E \vert^2$ overlaps the modulation $\varepsilon(z)$:

- The **cosine mode** concentrates its intensity in the high-index parts of the modulation, so $\int \varepsilon \vert E \vert^2\, dz$ is large. Larger denominator, smaller $\omega^2$.

- The **sine mode** concentrates its intensity in the low-index parts, so $\int \varepsilon \vert E \vert^2\, dz$ is small. Smaller denominator, larger $\omega^2$.

So $\omega_-$ is the cosine standing wave, concentrated in the high-index material, and $\omega_+$ is the sine standing wave, concentrated in the low-index material — the mode concentrated in the high-index material lies at the lower frequency.

### § 1.3. Constructive interface reflection at the Bragg wavelength {#sec-1-3}

The same $\omega_\pm$ come out of a different picture.

Instead of the [two-Fourier-component truncation](#sec-1-1), take the grating as a stack of layers of piecewise-constant index — the multilayer we will build as a [DBR](#defn-dbr) in [§ 3](#sec-3) — and follow the phase of the individual interface reflections.

At normal incidence, an interface from refractive index $n_1$ into refractive index $n_2$ has amplitude reflection coefficient

$$r_{12} = \frac{n_1 - n_2}{n_1 + n_2}. \tag{3}\label{eq:fresnel}$$

Two properties of $r_{12}$ matter for what follows:

- **Sign.**

  Going from low to high index gives $r_{12} < 0$: the reflected amplitude is phase-shifted by $\pi$ relative to the incident amplitude. Going from high to low gives $r_{12} > 0$: no phase shift.

- **Magnitude.**

  $\vert r_{12} \vert$ is small. Substituting $n_2 / n_1 = 1.5$ (glass to air) into \eqref{eq:fresnel} gives $\vert r_{12} \vert = 0.2$; internal dielectric interfaces have less.

Take the grating as a stack of alternating high-index and low-index layers.

In each layer, the field's in-medium wavenumber at frequency $\omega$ is $k_i = n_i\, \omega/c$, and the one-way phase picked up crossing a layer of thickness $d_i$ is $k_i d_i$.

At fabrication, the layer thicknesses are chosen so that

$$k_{i,B}\, d_i = \pi/2 \quad\Longleftrightarrow\quad n_i d_i = \lambda_B/4,$$

for both layer types (where $k_{i,B} = n_i\, \omega_B/c$ is the in-medium wavenumber at the Bragg frequency, and $\lambda_B$ is the vacuum Bragg wavelength).

The product $n_i d_i$ is the **optical thickness**{:#defn-optical-thickness} of the layer, and each layer is *quarter-wave* by construction: at $\omega = \omega_B$, the one-way phase is $\pi/2$ and the round trip is $\pi$.

Compare two reflected amplitudes arriving back at the input plane:

- Reflection off the first air–high interface: $\pi$ from the reflection itself.

- Reflection off the next interface (high–low): $\pi$ from the round trip through the high layer, plus $0$ from the reflection.

Both arrive at the input plane with total phase $\pi$. They combine constructively. The next pair of interfaces adds two more contributions with the same total phase, and so on down the stack.

{% include visualization.html src="frensel.html" title="Fresnel reflection and quarter-wave propagation phase at one return plane" %}

Away from [exact Bragg tuning](#defn-bragg-tuning) ($\delta \neq 0$), the round-trip phase per layer is no longer exactly $\pi$, and deeper and shallower reflections start to disagree in phase.

The rate at which they lose coherence is what sets the stopband width.

### § 1.4. The stopband width, from phase-error accumulation {#sec-1-4}

At $\omega = \omega_B$ (i.e. $\delta = 0$), each layer's round-trip phase is exactly $\pi$ and reflections from all interfaces combine constructively.

Away from exact Bragg tuning ($\delta \neq 0$) the round-trip phase drifts away from $\pi$ per layer; the accumulated drift across the stack sets the stopband width.

<div class="guided-fold-start" data-label="Follow the phase error through a concrete 1% detuning" data-tone="derivation"></div>

Illuminate the same stack at frequency $\omega = 1.01\, \omega_B$ — off by 1%. The round-trip phase per layer is

$$\phi_\text{RT} = 2 k_i d_i = 2\, (n_i\, \omega / c)\, d_i = \pi\, (\omega/\omega_B) \approx 1.01\, \pi,$$

using $n_i d_i = \lambda_B/4 = \pi c/(2\omega_B)$ from § 1.3. Each layer contributes a phase *error* of $0.01\,\pi \approx 2°$. Small at one layer, but the errors accumulate as the wave works deeper:

- After 10 layers: accumulated error $\approx 18°$. Deep and shallow reflections still add roughly in phase.

- After 50 layers: accumulated error $\approx 90°$. Deep-layer reflections are orthogonal in phase to shallow ones — neither reinforcing nor cancelling.

- After 100 layers: accumulated error $\approx 180°$. Deep-layer reflections are opposed to shallow ones, and further layers subtract from the total instead of adding to it.

For this 1% [detuning](#defn-detuning), the useful reflecting depth is $\sim 100$ layers, about $30\,\mu\text{m}$ of physical depth.

<div class="guided-fold-end"></div>

The phase argument says: away from $\delta = 0$, deep and shallow reflections drift out of phase and eventually cancel each other. \eqref{eq:hyperbola} makes this precise.

At $\delta = \pm\kappa$, $q^2 = 0$ — the boundary where the field just barely stops decaying.

Inside $\vert\delta\vert < \kappa$, $q^2 < 0$ and the envelope decays with rate $\alpha = \sqrt{\kappa^2 - \delta^2}$: reflections build up over a finite depth before the phase drift catches up.

Outside $\vert\delta\vert > \kappa$, $q^2 > 0$ becomes real and the field propagates through the grating with no net reflection.

The stopband is therefore the wavenumber range $\vert\delta\vert < \kappa$ — a width $\Delta k = 2\kappa$ centered on $k_B$. Converting via the group velocity, the width in frequency is $\Delta\omega = 2\kappa v_g$.

Since $\kappa/k_B = \Delta n / (2 n_\text{avg})$ from the coupling definition, half the fractional index contrast fixes the fractional stopband width.

*The [two stopband edges $\omega_\pm$](#sec-1-1) and [their separation $\Delta k = 2\kappa$](#sec-1-4) are both properties of an infinite grating.*

*A real grating has finite length, so whatever enters at $z = 0$ has to eventually exit at $z = L$ or come back out. What sets how much of the incident amplitude actually comes back?*

---

## § 2. Finite gratings: decay length and reflectivity {#sec-2}

### § 2.1. Semi-infinite grating: the decay length $1/\kappa$ {#sec-2-1}

At $\delta = 0$, \eqref{eq:hyperbola} gives $q^2 = -\kappa^2$ — the deepest negative value it attains inside the stopband:

- The decay length is $1/\kappa$, the shortest one the grating produces — the intrinsic length scale set by the modulation itself.

- Elsewhere inside the stopband $q^2 = -\alpha^2$ with $\alpha = \sqrt{\kappa^2 - \delta^2} < \kappa$, and the decay slows to $1/\alpha$: every decay length inside the stopband rescales from $1/\kappa$.

At $\delta = 0$ then, $q = \pm i\kappa$ and the two spatial factors are $e^{+\kappa z}$ and $e^{-\kappa z}$. Extend the grating to fill the half-space $z > 0$; the $e^{+\kappa z}$ branch blows up at infinity and is dropped.

The field decays as $e^{-\kappa z}$: amplitude falls by $e$ over $1/\kappa$. This decay length is a property of the *medium*.

Cut the grating off at $z = L$ instead, and both branches must be kept — the second boundary is what selects the specific combination.

### § 2.2. Finite grating: the reflectivity {#sec-2-2}

Work at $\delta = 0$, as in the [semi-infinite decay analysis](#sec-2-1): the algebra collapses to a single rate $\kappa$, and everywhere else inside the stopband follows by replacing $\kappa$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$ throughout.

<div class="guided-fold-start" data-label="Reduce the coupled-mode equations to a two-boundary transfer matrix" data-tone="derivation"></div>

The coupled-mode equations for the envelopes $A(z)$ (forward, right-going) and $B(z)$ (backward, left-going), derived at [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4), are $dA/dz = i\delta A + i\kappa B$ and $dB/dz = -i\delta B - i\kappa A$.

At $\delta = 0$ the diagonal terms drop and only the off-diagonal coupling remains,

$$\frac{d}{dz} \begin{pmatrix} A \\ B \end{pmatrix} = \begin{pmatrix} 0 & i\kappa \\ -i\kappa & 0 \end{pmatrix} \begin{pmatrix} A \\ B \end{pmatrix}. \tag{4}\label{eq:cme}$$

Differentiate either component of \eqref{eq:cme} and substitute the other:

$$\frac{d^2 A}{dz^2} = \kappa^2\, A, \qquad \frac{d^2 B}{dz^2} = \kappa^2\, B.$$

Both envelopes satisfy the same second-order equation $X'' = \kappa^2 X$, so both are combinations of $\cosh(\kappa z)$ and $\sinh(\kappa z)$. Applying the coupled equations to fix the coefficients relates $(A, B)$ at any two points by a transfer matrix:

<div class="guided-fold-end"></div>

$$\begin{pmatrix} A(L) \\ B(L) \end{pmatrix} = \begin{pmatrix} \cosh(\kappa L) & i\, \sinh(\kappa L) \\ -i\, \sinh(\kappa L) & \cosh(\kappa L) \end{pmatrix} \begin{pmatrix} A(0) \\ B(0) \end{pmatrix}. \tag{5}\label{eq:propag}$$

The reflected amplitude $B(0)$ and transmitted amplitude $A(L)$ fall out of \eqref{eq:propag} by applying the incident-wave boundary conditions: $A(0) = 1$ (input rescaled to unit amplitude) and $B(L) = 0$ (nothing propagating leftward from beyond $z = L$).

<div class="guided-fold-start" data-label="Solve the two-boundary problem for R and T" data-tone="derivation"></div>

- **Row 2 at the far end.**

  $0 = -i\sinh(\kappa L)\cdot 1 + \cosh(\kappa L)\, B(0)$, so $B(0) = i\tanh(\kappa L)$ and $R = \vert B(0) \vert^2 = \tanh^2(\kappa L)$.

- **Row 1 at the far end.**

  $A(L) = \cosh(\kappa L) + i\sinh(\kappa L)\cdot i\tanh(\kappa L) = \operatorname{sech}(\kappa L)$, so $T = \vert A(L) \vert^2 = \operatorname{sech}^2(\kappa L)$.

- **Energy conservation.**

  $R + T = 1$ follows from the identity $\tanh^2 + \operatorname{sech}^2 = 1$.

  It could have been anticipated: \eqref{eq:cme}'s matrix is Hermitian, so $\vert A \vert^2 - \vert B \vert^2$ is constant along $z$ (differentiate; the cross terms cancel), and the boundary conditions turn that into $\vert A(L) \vert^2 = 1 - \vert B(0) \vert^2$.

<div class="guided-fold-end"></div>

$$\boxed{\ R = \tanh^2(\kappa L), \qquad T = \operatorname{sech}^2(\kappa L), \qquad R + T = 1.\ } \tag{6}\label{eq:tanh-refl}$$

The envelopes throughout the grating, expressed as functions of $z$ rather than just their end values, are

$$A(z) = A(0)\, \frac{\cosh[\kappa (L - z)]}{\cosh(\kappa L)}, \qquad B(z) = i\, A(0)\, \frac{\sinh[\kappa (L - z)]}{\cosh(\kappa L)}. \tag{7}\label{eq:envelopes}$$

Compare with the [semi-infinite case](#sec-2-1):

- **Semi-infinite.**

  Field decays purely as $e^{-\kappa z}$: one exponential mode, forced by boundedness at $z = \infty$.

- **Finite.**

  Both $\cosh$ and $\sinh$ branches are allowed; the far-end condition $B(L) = 0$ picks the specific combination \eqref{eq:envelopes}.

  As $\kappa L \to \infty$, the far end retreats to infinity and \eqref{eq:envelopes} reduces to $A(z) \to A(0)\, e^{-\kappa z}$ near the entrance — the semi-infinite decay recovers as a limit.

{% include visualization.html src="bragg-mirror-penetration.html" title="Infinite-medium decay, finite-boundary envelopes, and Bragg-mirror reflectivity" %}

$\kappa L$ is the only knob. Reading it dimensionally: $\kappa$ is an inverse length (the [field's own decay length](#sec-2-1)), $L$ is a length, so $\kappa L$ measures the grating's physical length in units of $1/\kappa$. Setting $R > 0.99$,

$$\kappa L > \operatorname{arctanh}(\sqrt{0.99}) \approx 2.99,$$

so a grating at [exact Bragg tuning](#defn-bragg-tuning) needs about $3/\kappa$ of physical length to exceed 99% power reflectivity.

*$R = \tanh^2(\kappa L)$ says $\kappa$ and $L$ jointly set the mirror. What sets $\kappa$ in a stack we actually build?*

---

## § 3. The DBR: a Bragg grating in fabricated hardware {#sec-3}

We take the [sinusoidal grating of the infinite-medium analysis](#sec-1) and replace it with what a real deposition tool produces: a stack of $N$ alternating high-index and low-index layers, each pair a **period**, with the high-index layer of thickness $d_H$ and refractive index $n_H$ and the low-index layer of thickness $d_L$ and refractive index $n_L$.

The Bragg period is $\Lambda = d_H + d_L$, and the total grating length is $L = N\Lambda$. The physics is the same.

What changes is that the modulation is now a square wave rather than a cosine, and three concrete questions follow:

- **What is $\kappa$ for a square-wave grating?**

  A [Fourier expansion of the square wave](#sec-3-1) shows that the fundamental cosine harmonic — at wavenumber $2 k_B$ — drives the Bragg reflection, and it sets $\kappa$ as a fraction of $k_B$ through the index contrast $\Delta n = n_H - n_L$.

  Combined with the [finite-mirror reflectivity $R = \tanh^2(\kappa L)$](#sec-2-2), this fixes how many periods a mirror needs.

- **What do the higher Fourier components do?**

  They open [higher-order stopbands](#sec-3-2) at every odd multiple $m k_B$, each with a coupling $\kappa/m$ and correspondingly narrower.

- **What happens off-normal?**

  [Adding the angle of incidence](#sec-3-3) reshapes the geometry and splits the polarizations.

### § 3.1. Coupling and reflection for a square-wave stack {#sec-3-1}

The formula $\kappa = (\Delta n / 2 n_\text{avg})\, k_B$, [equation (9) of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#eq:kappa-bragg), was for a *sinusoidal* index modulation.

A DBR is instead *piecewise-constant* — the refractive index takes only two values, $n_H$ and $n_L$.

#### Fourier expansion and coupling coefficient

Expanding the square-wave modulation as a Fourier series:

- Only the **fundamental cosine** drives the first Bragg reflection.
- Its coefficient is $(4/\pi)$ times the peak-to-average amplitude of the square wave.
- The **effective sinusoidal amplitude** is therefore $(2/\pi)\Delta n$.

Substituting into the sinusoidal $\kappa$ formula:

$$\kappa_\text{DBR} = \frac{1}{\pi}\, \frac{\Delta n}{n_\text{avg}}\, k_B, \qquad \Delta n \equiv n_H - n_L. \tag{8}\label{eq:dbr-kappa}$$

#### Reflectivity and layer count

Combining with the [finite-grating reflectivity](#sec-2-2) $R = \tanh^2(\kappa L)$. The total grating length is $L = N\Lambda$, and $k_B \Lambda = \pi$ from $k_B = \pi/\Lambda$, so

$$\kappa_\text{DBR}\, L = N\, \frac{\Delta n}{n_\text{avg}}.$$

> **Key result:** Both $k_B$ and $\Lambda$ cancel — the reflectivity depends *only* on the layer count and the fractional index contrast.

Reaching $R > 0.99$ needs $\kappa L > \operatorname{arctanh}(\sqrt{0.99}) \approx 3$, so the minimum layer count is:

$$N \gtrsim 3\, \frac{n_\text{avg}}{\Delta n}.$$

#### Two material systems

- **Dielectric stack** (Ta$_2$O$_5$ over SiO$_2$):
  - $n_H/n_L \approx 1.5$, so $\Delta n / n_\text{avg} \approx 0.4$
  - Requirement: $N \gtrsim 8$; real designs use **10–15 periods**.

- **Semiconductor stack** (GaAs/AlAs):
  - $n_H/n_L \approx 1.15$, so $\Delta n / n_\text{avg} \approx 0.14$
  - Requirement: $N \gtrsim 22$; real designs use **25–30 periods**.

#### Stopband width

The stopband width falls out of the same $\kappa$:

$$\Delta k = 2\kappa_\text{DBR}, \qquad \frac{\Delta k}{k_B} = \frac{2}{\pi}\, \frac{\Delta n}{n_\text{avg}}.$$

> **Key Takeaway:** The fractional index contrast sets **both design axes** — reflectivity (via the layer count) and stopband width (via $\Delta k / k_B$) — at once.

*The Fourier expansion picked out only the fundamental. What about the higher harmonics?*

### § 3.2. Higher-order stopbands and the structure factor {#sec-3-2}

The Fourier series of the square-wave modulation only used its fundamental component. But a square wave contains more than that. Fourier-expanding the piecewise-constant modulation gives cosine harmonics at every odd multiple of the fundamental:

$$n(z) - n_\text{avg} = \frac{2\Delta n}{\pi}\sum_{m=1,3,5,\ldots} \frac{(-1)^{(m-1)/2}}{m}\, \cos(2 m k_B z).$$

Each cosine harmonic is itself a periodic modulation, so each drives its own Bragg reflection: the $m$-th harmonic scatters a wave at wavenumber $m k_B$ into the wave at $-m k_B$, satisfying the [Bragg condition](#defn-bragg-condition) $\lambda = 2\, n_\text{avg}\, \Lambda/m$ at *its* own resonance $k = m k_B$ — vacuum wavelength $\lambda_B / m$.

The coupling for the $m$-th stopband is $\kappa_m = \kappa_\text{DBR}/m$ (the $1/m$ Fourier coefficient), and the stopband width scales the same way — the third-order stopband is $1/3$ as wide as the first, the fifth $1/5$, and so on.

Even orders are absent because the square wave has no even Fourier components.

Two engineering consequences:

- To *suppress* the higher-order stopbands (spurious reflections at shorter wavelengths), reshape the modulation profile so its Fourier expansion is closer to a pure fundamental — a graded or smoothed profile within a period.

  Fiber Bragg gratings, written by two-beam interference, are naturally sinusoidal and have very weak higher-order structure.

- To *engineer* stopbands at prescribed wavelengths, choose a modulation whose Fourier spectrum has content at the desired periods.

*The stopband positions and widths so far are set by normal-incidence Bragg. Off-normal, the geometry changes both. What is left of the stopband when the wave hits the stack at an angle?*

### § 3.3. Off-normal incidence and Brewster's angle {#sec-3-3}

Every calculation so far has assumed the wave hits the stack perpendicular to the layers. In many arrangements the wave arrives at an angle instead: a beam entering the stack at some tilt, or a guided mode inside a slab whose $\vec{k}$ points off the stack normal.

At off-normal incidence, three things change:

- **The one-way phase per layer picks up a factor $\cos\theta_i$.**

  A plane wave inside layer $i$ travels at internal angle $\theta_i$ to the layer normal, with wavevector $\vec{k}_i$ of magnitude $k_i = n_i \omega / c$ pointing along its direction of travel.

  Write $\hat{n}_\perp$ for the unit vector along the layer normal.

  The phase difference between the top face and the bottom face of the layer, at a fixed transverse position, is $(\vec{k}_i \cdot \hat{n}_\perp)\, d_i = k_i d_i \cos\theta_i$ — the projection of $\vec{k}_i$ on the layer normal, times the layer thickness.

  At normal incidence ($\theta_i = 0$) this reduces to $k_i d_i$; off-normal it is smaller.

  From the [Bragg condition](#sec-1-3), the sum of one-way phases across one H+L period must equal $\pi$:

  $$k_H(\theta_H)\, d_H\, \cos\theta_H + k_L(\theta_L)\, d_L\, \cos\theta_L = \pi.$$

  The layer thicknesses $d_H, d_L$ were fixed at fabrication, and each $\cos\theta_i < 1$ shrinks the corresponding term.

  To hold the sum at $\pi$, the wavenumbers $k_H, k_L$ must grow — and since $k_i = n_i \omega/c$ with $n_i$ fixed, the operating frequency $\omega$ grows with them.

  Writing the operating in-medium Bragg wavenumber as $k_B(\theta_0) = n_\text{avg}\, \omega/c$, this reads $k_B(\theta_0) > k_B(0)$: the Bragg wavenumber shifts *up* with incidence angle, and the vacuum wavelength shifts *down*.

- **TE and TM see different boundary conditions at each interface, giving different Fresnel formulas.**

  TE has $\vec{E}$ perpendicular to the plane of incidence, entirely tangent to every layer face — the two matching conditions (tangential $E$ and tangential $H$ continuous) both act on components already parallel to the interface.

  TM has $\vec{E}$ in the plane of incidence, with a *normal* component; that normal component is discontinuous across the interface because it is $D_\perp = \varepsilon\, E_\perp$ (not $E_\perp$) that must be continuous.

  TE and TM therefore solve different linear systems at each interface, and \eqref{eq:fresnel-full} below gives their reflection coefficients.

- **The two stopbands split.**

  Since $\kappa$ is built from the [per-interface reflections](#sec-1-3), $\kappa_\text{TE} \neq \kappa_\text{TM}$ off-normal — TE and TM acquire distinct stopband widths $2\kappa_\text{TE} v_g$ and $2\kappa_\text{TM} v_g$ at the same Bragg wavelength.

  In the extreme case, $r_\text{TM} \to 0$ at Brewster's angle (derived below) and the TM stopband closes entirely while the TE stopband remains open.

{% include visualization.html src="bragg-phase.html" title="How off-normal incidence changes the Bragg phase through the normal wavevector component" %}

Matching tangential $E$ and tangential $H$ across the interface gives, for the two polarizations,

$$r_\text{TE} = \frac{n_1 \cos\theta_1 - n_2 \cos\theta_2}{n_1 \cos\theta_1 + n_2 \cos\theta_2}, \qquad r_\text{TM} = \frac{n_2 \cos\theta_1 - n_1 \cos\theta_2}{n_2 \cos\theta_1 + n_1 \cos\theta_2}. \tag{9}\label{eq:fresnel-full}$$

At $\theta_1 = 0$ both reduce to $r_{12} = (n_1 - n_2)/(n_1 + n_2)$ — \eqref{eq:fresnel}. Off-normal, they split. Setting $r_\text{TM} = 0$ requires the numerator of \eqref{eq:fresnel-full} to vanish,

$$n_2 \cos\theta_1 = n_1 \cos\theta_2,$$

and multiplying this by Snell's law $n_1 \sin\theta_1 = n_2 \sin\theta_2$ eliminates the index ratio:

$$\sin\theta_1 \cos\theta_1 = \sin\theta_2 \cos\theta_2 \quad\Longleftrightarrow\quad \sin(2\theta_1) = \sin(2\theta_2).$$

Two solutions:

- **Trivial branch: $\theta_1 = \theta_2$.**

  Only possible when $n_1 = n_2$ — no interface.

- **Non-trivial branch: $2\theta_1 = \pi - 2\theta_2$**, i.e. $\theta_1 + \theta_2 = \pi/2$. Under it, $\cos\theta_2 = \sin\theta_1$; substituting back into $n_2 \cos\theta_1 = n_1 \cos\theta_2$ gives **Brewster's angle**{:#defn-brewster}, at which the TM reflection vanishes:

$$\tan\theta_1 = \frac{n_2}{n_1}. \tag{10}\label{eq:brewster}$$

The geometric reading: $r_\text{TM} = 0$ exactly when the reflected and transmitted rays are perpendicular ($\theta_1 + \theta_2 = \pi/2$); \eqref{eq:brewster} is that perpendicularity re-expressed through Snell's law.

{% include visualization.html src="brewster.html" title="How the TE and TM Fresnel responses separate at Brewster incidence" %}

**The mechanism has a clean physical picture.**

The transmitted electric field polarizes the electrons of medium 2 into oscillating dipoles along its own direction, and the reflected wave is their re-radiation.

A dipole cannot radiate along its own axis of oscillation — the null of its $\sin\theta$ pattern.

At Brewster's angle Snell's law makes the reflected direction (in medium 1) coincide with the dipole axis (which points along the transmitted $E$ in medium 2), so the reflection has to vanish.

TE has no analogue: its dipoles point out of the plane of incidence, and every in-plane direction — including every possible reflected direction — is broadside to them.

{% include visualization.html src="dipole.html" title="Why Brewster reflection vanishes as a dipole-radiation null for TM polarization" %}

The consequence for a [DBR](#defn-dbr): as the in-medium angle approaches Brewster's angle,

- the TM interface reflection coefficient $r_\text{TM}$ shrinks toward zero (\eqref{eq:brewster}),

- the TM [coupling](#defn-coupling) $\kappa_\text{TM}$ is proportional to $r_\text{TM}$ (from the [sum-of-per-interface-reflections argument](#sec-1-3)), so $\kappa_\text{TM} \to 0$ with $r_\text{TM}$,

- and the TM [stopband](#defn-stopband) width $\Delta\omega_\text{TM} = 2\kappa_\text{TM} v_g$ narrows and eventually closes.

The TE stopband is unaffected — TE has no Brewster angle — so at Brewster incidence the DBR reflects TE and transmits TM at the same wavelength.

{% include visualization.html src="brewster-stopband-closure.html" title="Why TE reflections accumulate while the TM stopband closes at Brewster incidence" %}

Whether the split matters is set by the angle at which the field crosses the layer stack. Two limits bracket it:

- At **near-normal incidence**, TE and TM coincide and a single [DBR](#defn-dbr) design works for both.

- At **large in-medium angles**, the two polarizations see quantitatively different stopbands and the design has to fix which polarization is being reflected.

*A [DBR](#defn-dbr) is a passive wavelength-selective mirror: wavelengths inside its stopband come back, others pass through.

Place it at either end of a [gain](#defn-gain) medium — or interleave it with the [gain](#defn-gain) along its length — and the reflected wavelengths are amplified on their return; the others leak away.

What kind of laser does that arrangement produce?*

---

## § 4. Bragg feedback in lasers: DFB and DBR {#sec-4}

A laser combines a **gain medium**{:#defn-gain}, which amplifies the field, with a **cavity**{:#defn-cavity}, which feeds the field back on itself so that [gain](#defn-gain) accumulates coherently over many round trips.

If the [cavity](#defn-cavity)'s two end mirrors are flat, their reflectivity is the same at every wavelength, and the laser has no built-in preference for any one frequency.

Replacing one or both mirrors — or the entire [cavity](#defn-cavity) — with a Bragg grating gives *wavelength-selective* feedback: the laser is forced into the grating's [stopband](#defn-stopband).

Two placements decide the device.

- The [DFB](#defn-dfb) laser writes the grating into the same section as the [gain](#defn-gain) — [coupling](#defn-coupling) $\kappa$ and [gain](#defn-gain) $\gamma$ act at every $z$.

- The DBR laser puts the grating in a separate section from the [gain](#defn-gain) — $\gamma$ acts only where the [gain](#defn-gain) sits, $\kappa$ only where the grating sits, and the two sections can be tuned independently.

First, though: what does a flat-mirror [cavity](#defn-cavity) do, and why does it fail to pick a wavelength?

### § 4.1. Why flat mirrors do not pick a wavelength {#sec-4-1}

Take the simplest cavity: a gain-carrying dielectric of length $L$ and refractive index $n_\text{avg}$ (same symbol as the rest of the post — the [periodic index modulation](#sec-1) simply hasn't been switched on yet), bounded by two flat interfaces at which the index steps back to air.

Two features of this setup decide what the laser does.

**A comb of resonant modes.**

A round trip picks up phase $2 k L = 2\, n_\text{avg}\, \omega L/c$.

For a mode to reproduce itself after every round trip, this phase must be an integer multiple of $2\pi$, selecting a discrete comb of frequencies

$$\nu_n = n \cdot \frac{c}{2 n_\text{avg} L}, \qquad \Delta\nu_\text{FSR} = \frac{c}{2 n_\text{avg} L},$$

where $\Delta\nu_\text{FSR}$ is the **free spectral range**. Each $\nu_n$ is a standing wave fitting an integer number of half-wavelengths between the mirrors.

**A mirror with no wavelength selectivity.**

Each end is a single dielectric interface, so $R = \vert r_{12} \vert^2$, where $r_{12} = (n_1 - n_2)/(n_1 + n_2)$ is the [Fresnel amplitude reflection coefficient](#sec-1-3) at normal incidence.

The refractive indices $n_1, n_2$ vary slowly with frequency (dispersion is small over a laser's gain bandwidth), so $R$ is nearly constant across the entire comb — the mirror does not prefer one $\nu_n$ over another.

The flat-mirror cavity therefore offers no mirror-level frequency selection. The only remaining selector is the gain profile $\gamma(\nu)$. Two things about $\gamma(\nu)$ make it a poor discriminator:

- Its bandwidth is of order THz — thousands of $\Delta\nu_\text{FSR}$ fit inside it, so many modes see comparable gain at any instant.

- Its peak position is not fixed: drive current and chip temperature both shift the peak during operation, and as the peak moves the winning mode hops with it.

### § 4.2. DFB: the grating co-located with the gain {#sec-4-2}

In a [DFB](#defn-dfb), the grating is interleaved with the [gain](#defn-gain) along the whole device: [coupling](#defn-coupling) $\kappa$ and [gain](#defn-gain) $\gamma$ act at every $z$.

There are no separate end mirrors — the mirror is spread over the whole length. Two consequences of that colocation set the [DFB](#defn-dfb)'s selectivity.

**The grating is itself a [cavity](#defn-cavity).**

In a flat-mirror laser, the round trip is between two planes at fixed $z$: a wave leaves one, reflects at the other, and returns. The lasing condition is that the round-trip field come back to itself in amplitude and phase,

$$R_1 R_2\, e^{2\gamma L}\, e^{i 2 k L} = 1,$$

at the mode frequency.

In a grating there is no localized planar reflector, but the same round-trip accounting still applies.

A wave at frequency close to a stopband boundary $\omega_\pm$ propagates with group velocity $v_g = d\omega/dq \to 0$ ([§ 0.7 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-7)) — the slope of the dispersion curve vanishes at the stopband boundary.

Slow light accumulates the same round-trip phase over one or two decay lengths $1/\kappa$ that a fast wave would need the full flat-mirror $2L$ for. Two twists follow from this:

- **The grating simultaneously provides both mirrors and filling.**

  There is no separate "cavity" carrying "gain": the same length reflects and amplifies.

- **The modes are a discrete comb of standing solutions.**

  They are the specific $\omega$ inside the [stopband](#defn-stopband) whose accumulated forward-plus-backward-envelope phase across the grating returns to itself — solutions of the coupled envelope equations satisfying self-consistent boundary conditions.

  Unlike the flat-mirror comb, which is evenly spaced at $\Delta\nu_\text{FSR}$, the DFB comb tightens near $\omega_\pm$ as $v_g \to 0$.

**The [stopband](#defn-stopband) is a wavelength-selective filter.**

Whether a mode sits inside or outside the stopband decides how much of it survives one round trip:

- **Inside the stopband ($|\delta| < \kappa$).**

  By \eqref{eq:hyperbola}, $q^2 < 0$; the envelope decays as $e^{-\alpha z}$ with $\alpha = \sqrt{\kappa^2 - \delta^2}$ ([previous post § 0.6](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-6)).

  Over a grating of length $L$ with $\kappa L \gtrsim 2$, the envelope has decayed to a small fraction of its input at the far end. The [flux-conservation identity](#sec-2-2) $\vert A \vert^2 - \vert B \vert^2 = T$ then gives $R \to 1$.

- **Outside the stopband ($|\delta| > \kappa$).**

  Now $q^2 > 0$: $q$ is real, and the envelope $A(z)$ does not decay. A forward wave entering at $z = 0$ propagates all the way through to $z = L$, backscattering only into the tiny sinusoidal $B(z)$ that oscillates without net growth.

  Nothing accumulates. The only reflection the grating returns is the Fresnel bounce at each of its two ends where $n_\text{avg}$ steps back to the surrounding index — of order $R \approx 0.3$ per end, the same as a flat mirror.

The [gain](#defn-gain) profile $\gamma(\nu)$ therefore sees strongly asymmetric round-trip loss along the frequency axis:

- **inside the stopband**, $R \approx 1$ and lasing threshold is easy to reach;

- **outside**, $R \approx 0.3$ and the mode leaks too fast to accumulate the coherent build-up laser action requires.

Modes outside the stopband are killed; modes inside can lase.

The lasing candidates are reduced from the thousands of the [flat-mirror comb](#sec-4-1) to the modes fitting inside the [stopband width $2\kappa v_g$](#sec-1-4) — a comb of about $4\kappa L/\pi$ modes, so of order 10 for a typical $\kappa L \approx 3$ device.

*Confining the lasing candidates to about 10 is a partial fix. Which of the 10 wins, and can we guarantee that only one does?*

---

#### Which mode wins: density of states and field–gain overlap {#sec-4-2-1}

Two effects push the emitters toward the [two $\omega_\pm$ standing modes](#sec-1-1) — both at $\delta = \pm\kappa$, the two stopband edges. Together they decide which of the discrete lasing candidates gets to lase.

**More available modes per frequency at $\omega_\pm$.**

The [gain](#defn-gain) medium contains excited carriers — electrons sitting at higher-energy states than they would in equilibrium, pumped up there by the drive current.

Each carrier eventually drops back down and, in doing so, emits one photon of energy equal to the drop. The photon has to go into some mode of the electromagnetic field.

Two mechanisms decide which:

- **Spontaneous emission.**

  The carrier drops on its own, at a rate that depends on how many modes are available at the drop's frequency. The photon's phase, direction, and specific mode are drawn at random from those available.

- **Stimulated emission.**

  A photon already in some mode triggers the drop, and the emitted photon is a copy of the trigger — same mode, same frequency, same phase. This is the mechanism that amplifies a lasing mode: once seeded, it keeps growing.

For lasing to build up in a specific mode, that mode has to be seeded by spontaneous emission first.

The rate at which spontaneous emission populates a mode at frequency $\omega$ scales with the **density of states**{:#defn-dos} $\rho(\omega)$: the count of available modes per unit frequency per unit length.

The rule that spontaneous emission rate is proportional to $\rho(\omega)$ is a general property of transitions coupled to a continuum of field modes — Fermi's golden rule.

In a 1D DFB, $\rho(\omega)$ diverges at the two stopband edges $\omega_\pm$. The derivation is short:

<div class="guided-fold-start" data-label="Derive the 1D density of states and its edge divergence" data-tone="derivation"></div>

For a 1D dispersion $\omega(q)$, the density of states counts the field modes available at a given frequency. To count them, we need the mode set to be discrete: put the field in a box of length $L$ with periodic boundary conditions $E(z + L) = E(z)$. Then define

$$\rho(\omega)\, d\omega \equiv \frac{1}{L}\, \bigl(\text{number of allowed } q\text{-values with frequency in } [\omega, \omega + d\omega]\bigr).$$

The units are (frequency)$^{-1}$ (length)$^{-1}$: modes per unit frequency per unit length. The 1/$L$ makes $\rho$ intensive: it does not depend on the arbitrary box size $L$ we introduced to make the counting well-defined.

- **Allowed $q$-values.**

  A mode $e^{i q z}$ satisfies $E(z+L) = E(z)$ when $e^{i q L} = 1$, i.e. $q L = 2\pi n$ for integer $n$. So the allowed values are $q_n = 2\pi n / L$, spaced by $\Delta q = 2\pi/L$.

  The number of allowed $q$-values in a small window $dq$ is $L\, dq/(2\pi)$ — a $q$-density of $L/(2\pi)$.

- **Convert $q$ to $\omega$.**

  For each branch of the dispersion, a small $dq$ maps to $d\omega = v_g\, dq$ where $v_g = d\omega/dq$ is the group velocity. So

  $$\rho(\omega)\, d\omega = \frac{1}{L}\, \frac{L}{2\pi}\, dq = \frac{1}{2\pi\, v_g}\, d\omega.$$

- **Count both branches.**

  At each $\omega$ where $q(\omega)$ is real, the dispersion has two solutions — one on the $+q$ branch, one on the $-q$ branch — each contributing $1/(2\pi v_g)$. Adding:

  $$\rho(\omega) = \frac{1}{\pi\, v_g}.$$

- **Why $\rho \to \infty$ as $\omega \to \omega_\pm$.**

  At the [stopband edge](#sec-1-1) $q = 0$, and the group velocity $v_g$ vanishes: the two branches of the dispersion meet with a horizontal tangent, $d\omega/dq = 0$. Expand $\omega(q)$ around $q = 0$:

  $$\omega(q) \approx \omega_\pm + \tfrac{1}{2}\, \omega''(0)\, q^2.$$

  Solving for $q(\omega)$:

  $$q(\omega) \approx \sqrt{\frac{2(\omega - \omega_\pm)}{\omega''(0)}},$$

  and

  $$\frac{dq}{d\omega} \propto \frac{1}{\sqrt{\omega - \omega_\pm}}.$$

  So $v_g \to 0$ and $\rho \propto 1/\sqrt{\omega - \omega_\pm}$ diverges as $\omega \to \omega_\pm$ from inside the propagating band.

<div class="guided-fold-end"></div>

**Consequences for the DFB.**

There are of order 10 [lasing candidates fitting inside the stopband](#sec-4-2).

The density of states across those candidates is:

- **Interior of the stopband**:

  $\rho(\omega)$ is finite (the discrete comb of modes has some regular spacing that gives a finite mode count per unit frequency).

- **Approaching the two edges $\omega_\pm$**:

  $\rho(\omega)$ grows as $1/\sqrt{\omega - \omega_\pm}$, diverging at the edges.

The two lasing candidates sitting closest to $\omega_\pm$ therefore see $\rho$ order-of-magnitude larger than the interior candidates.

By Fermi's golden rule, their spontaneous-emission seeding rate is correspondingly larger, and the mode that reaches lasing threshold first is the one whose seed has been amplified longest.

The two edge modes are picked out — the first of two effects favouring them.

**Field–gain spatial overlap.**

The $\omega_-$ and $\omega_+$ standing waves peak in complementary halves of one [Bragg period](#defn-bragg-period) — $\omega_-$ (the [cosine mode](#sec-1-1)) in the high-index material, $\omega_+$ (the sine mode) in the low-index material.

The effective per-unit-length gain a given mode sees is its intensity-weighted average of $\gamma(z)$,

$$\gamma_\text{eff} = \frac{\int \gamma(z)\, \vert E(z) \vert^2\, dz}{\int \vert E(z) \vert^2\, dz}. \tag{$\star\star$}\label{eq:gamma-eff}$$

If $\gamma(z)$ is concentrated in one half of the period, one mode overlaps the peaks and picks up a $\gamma_\text{eff}$ close to peak $\gamma$; the mode peaked in the complementary half sees the troughs.

Standard [DFB](#defn-dfb) fabrication places the [gain](#defn-gain) region in the high-index material, so $\omega_-$ (peaked there) sees the larger $\gamma_\text{eff}$.

---

#### The two-mode problem and the quarter-wave defect {#sec-4-2-2}

The [two mode-selection effects](#sec-4-2-1) — the density-of-states boost at $\omega_\pm$ and the field–gain overlap asymmetry — push in the same direction, both favouring $\omega_-$ over $\omega_+$, but only by a small margin.

Both stopband edges are equally sharp, so the [DOS boost](#sec-4-2-1) alone does not distinguish between them: the same $\rho \to \infty$ at both.

The field–gain overlap $\gamma_\text{eff} = \int \gamma(z)|E(z)|^2\, dz \big/ \int |E(z)|^2\, dz$ from [\eqref{eq:gamma-eff}](#eq:gamma-eff) is the only asymmetry left between the two candidates.

That asymmetry sets $\gamma_\text{eff}(\omega_-) > \gamma_\text{eff}(\omega_+)$, but by a small enough amount that fabrication imperfections can flip it:

- **Layer thickness errors.**

  If either $d_H$ or $d_L$ is off by a few nm relative to the design, the local Bragg wavelength shifts, and the intensity peak of each standing mode shifts along $z$ against the gain profile.

  The overlap integral in [\eqref{eq:gamma-eff}](#eq:gamma-eff) then favours a different mode than the design intended.

- **A slow drift of $n_\text{avg}$ across the grating length.**

  If deposition non-uniformity leaves the near end with a slightly different $n_\text{avg}$ than the far end, the two grating halves see slightly different Bragg conditions, and the standing modes are no longer perfectly symmetric — one end contributes more overlap than the other, and the imbalance can put $\omega_+$ ahead of $\omega_-$.

- **Different reflectivities at the two grating ends.**

  After growth, the wafer is cleaved into individual laser chips. If one end cleaves cleaner than the other, the two grating ends have unequal Fresnel reflections, and the standing waves shift toward the higher-reflection end.

  The overlap integral again re-orders which mode wins.

Any of these can flip which of $\omega_\pm$ lases in a given device, and the laser can hop between them during operation.

Two ways to break the $\omega_-/\omega_+$ symmetry *by construction* — i.e. so that a single mode is unambiguously selected, robust against these perturbations:

- **Insert a $\lambda/4$ optical gap at the grating center.**

  - **What to build.** Cut the grating in half at $z = L/2$ and insert a short unmodulated section of optical length $\lambda_B/4$ (physical length $\lambda_B / (4 n_\text{avg})$, equal to $\Lambda/2$). Two halves of Bragg grating on either side of an empty gap in the middle.

  - **Why it works — Fabry–Perot cavity.** The unmodulated gap is a small optical cavity; the two half-gratings are its mirrors. Both mirrors reflect only inside the [stopband](#defn-stopband), so the cavity's resonances are constrained to $|\delta| < \kappa$.

  - **Which frequency the cavity selects.** Inside that range, the resonance condition — round-trip phase equal to $2\pi n$ — picks out a specific frequency. For a gap of optical length $\lambda_B/4$ (round-trip optical length $\lambda_B/2$, i.e. round-trip propagation phase $\pi$), combining the propagation phase with the reflection phases of the two Bragg-mirror halves selects $\delta = 0$ — the exact center of the stopband. A single mode.

  - **Spatial structure of the mode.** The mode is localized around the gap. Inside each half-grating, the field decays as $e^{-\kappa|z - L/2|}$ (from the [dispersion relation](#eq:hyperbola) at $\delta = 0$), so the mode's extent is of order $\Lambda/2$ (the gap) plus $1/\kappa$ (the two exponential tails) — much shorter than $L$ itself.

  - **Why it stays single-mode.** The mode's frequency is $\omega_B$ (the exact center between $\omega_-$ and $\omega_+$), not either of the edges, so it has no partner at the same frequency to compete with.

  - **Why it is robust.** The gap is a physical structure written at fabrication, and the mode frequency $\omega_B$ is set by the gap geometry rather than by which half-grating happens to have slightly higher $\gamma_\text{eff}$. Layer-thickness errors and $n_\text{avg}$ drifts of the kind listed above do not flip which mode wins.

- **Give the modulation a gain (imaginary) component.**

  - **The change.** So far the modulation has been purely in the real part of $\varepsilon(z)$. Extend it: let $\varepsilon(z)$ carry a gain modulation too, so that the [gain](#defn-gain) rate $\gamma(z)$ is itself a periodic function of $z$ with the same period as the index grating.

  - **Why it splits $\omega_-$ and $\omega_+$.** Recall from the [complementary-halves argument](#sec-4-2-1) that $\omega_-$ peaks in the high-index material and $\omega_+$ in the low-index material — the two standing waves have their intensity concentrated in *complementary* halves of one Bragg period. When $\gamma(z)$ alternates between high-gain and low-gain (or gain and loss) halves synchronised with the index modulation, the [\eqref{eq:gamma-eff}](#eq:gamma-eff) overlap integral picks up opposite values for the two:

    $$\gamma_\text{eff}(\omega_-) \neq \gamma_\text{eff}(\omega_+).$$

    One mode overlaps the gain peaks and gets a large positive $\gamma_\text{eff}$; the other overlaps the gain troughs and gets a small (or negative — net loss) $\gamma_\text{eff}$.

  - **How robust the selection is.** The mode with the larger effective gain wins by a margin set by the gain modulation depth, not by the small overlap asymmetry that the pure-index case relied on. No structural shift needed.

  - **The cost.** Modulating $\gamma(z)$ across $z$ requires physically corrugating the [gain](#defn-gain) region — patterning the current injection or the well structure period-by-period — which is much harder than the smooth index grating of the pure-index case.

*The two constructions above treated $\Delta\varepsilon'$ and $\Delta\varepsilon''$ as independent knobs — one turned all the way off in each case. In a fabricated device, both are turned on simultaneously and cannot be set independently: causality forces a link between them. How tight is the link?*

### § 4.3. Adding a gain component to the modulation {#sec-4-3}

Split $\Delta\varepsilon(z)$ into real and imaginary parts:

$$\Delta\varepsilon(z) = \Delta\varepsilon'(z) + i\, \Delta\varepsilon''(z).$$

The real part $\Delta\varepsilon'$ modulates the refractive index; the imaginary part $\Delta\varepsilon''$ modulates [gain](#defn-gain) or loss (see [the complex-response section of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-0-8) for the sign convention).

The two limits behave differently:

- **$\Delta\varepsilon'' = 0$ (pure index modulation).**

  $\omega_-$ and $\omega_+$ sit at the two [stopband](#defn-stopband) edges with nearly the same $\gamma_\text{eff}$. Mode selection is fragile; the [$\lambda/4$ optical gap](#sec-4-2-2) is what forces a single mode.

- **$\Delta\varepsilon' = 0$ (pure gain modulation).**

  The two standing waves $\omega_-$ and $\omega_+$ still peak in complementary halves of one [Bragg period](#defn-bragg-period).

  Now let the modulation be pure gain: $\gamma(z)$ oscillates periodically along $z$ with the same period as the (would-be) index grating, going high in the half where $\omega_-$ peaks and low (or negative) in the half where $\omega_+$ peaks.

  Evaluating [\eqref{eq:gamma-eff}](#eq:gamma-eff) for each:

  $$\gamma_\text{eff}(\omega_-) = \int \gamma(z)\, \vert E_-(z) \vert^2\, dz \; / \; \int \vert E_-(z) \vert^2\, dz,$$

  and similarly with $E_+$ in place of $E_-$.

  The $\omega_-$ intensity is centered on the gain peaks, so the numerator is large and positive; the $\omega_+$ intensity is centered on the gain troughs, so its numerator is small or negative.

  The two $\gamma_\text{eff}$ therefore differ by a finite amount whose size is set by how deeply the gain is modulated between the peaks and troughs (the range $\gamma_\text{max} - \gamma_\text{min}$ of $\gamma(z)$).

  No $\lambda/4$ shift needed. The cost is fabrication: modulating $\gamma$ across $z$ requires physically corrugating the [gain](#defn-gain) region, which is much harder than the smooth index grating of the pure-index case.

Real gratings carry both. That raises a natural question: since we chose $\Delta\varepsilon'$ and $\Delta\varepsilon''$ separately in each of the two limits above, can we independently pick their values in the same device?

The answer is no, and the reason is a general property of causal linear response.

---

#### Why the two components cannot be chosen independently {#sec-4-3-1}

The real and imaginary parts of a material's response are not independent choices.

Any physical material that responds linearly to a driving field must do so *causally*: the response at time $t$ can depend only on the field's values at earlier times.

That constraint has an algebraic consequence — the real and imaginary parts of the response as functions of frequency are locked together.

<div class="guided-fold-start" data-label="Derive the causal response relations from analyticity" data-tone="derivation"></div>

Write the electric susceptibility as

$$\chi(\omega) = \chi'(\omega) + i\, \chi''(\omega), \qquad \varepsilon(\omega) = 1 + \chi(\omega).$$

Causality — no polarization response before the driving field — means the inverse Fourier transform of $\chi$ vanishes for $t < 0$. That in turn makes $\chi(\omega)$ analytic in the upper half of the complex $\omega$-plane.

For a function analytic in the upper half-plane that vanishes fast enough at infinity, the Cauchy integral around a contour closed in the upper half-plane relates the function's boundary values on the real axis to itself.

Applying this with a contour that indents around the point $\omega' = \omega$ on the real axis, and taking the principal value in the limit that the indentation shrinks to zero, gives

$$\chi'(\omega) = \frac{2}{\pi}\, \mathcal{P} \int_0^\infty \frac{\omega'\, \chi''(\omega')}{\omega'^2 - \omega^2}\, d\omega',$$

$$\chi''(\omega) = -\frac{2\omega}{\pi}\, \mathcal{P} \int_0^\infty \frac{\chi'(\omega')}{\omega'^2 - \omega^2}\, d\omega'.$$

The symbol $\mathcal{P}$ denotes a Cauchy principal value: a symmetric interval around the pole is omitted and shrunk to zero, so that the singular contributions from the two sides cancel.

The integrals run from $0$ to $\infty$ rather than $-\infty$ to $\infty$ because $\chi(-\omega) = \chi^*(\omega)$ for a real response, which folds the negative-frequency contribution onto the positive one.

{% include visualization.html src="kramers-kronig.html" title="Causality, the contour argument, and the causal response relations" %}

<div class="guided-fold-end"></div>

The result is a pair of integral transforms relating $\chi'$ and $\chi''$: specify one at every frequency and the other is determined. (These are commonly called the Kramers–Kronig relations.)

In a semiconductor [DFB](#defn-dfb) the immediate consequence is that changing the carrier density to modulate the [gain](#defn-gain) necessarily also modulates the refractive index, and vice versa.

An exactly pure index grating and an exactly pure gain grating are idealizations, and a fabricated device generally contains some of both.

Design lets us pick the operating point and the grating phase to weight one component over the other, but it does not eliminate the companion response.

### § 4.4. DFB linewidth {#sec-4-4}

Everything so far treats the DFB as emitting at a single frequency $\omega_B$ (or, before we forced single-mode operation, at $\omega_-$ or $\omega_+$).

In reality the emission spectrum is not a delta function: it has a finite full width at half maximum $\Delta\nu$, and the physics that sets that width is quite different from what fixes the center frequency.

This section works out what determines $\Delta\nu$ and why the DFB does well on it.

---

#### § 4.4.1. Linewidth as phase stability {#sec-4-4-1}

The emitted electric field is a complex quantity oscillating at frequency $\omega_B$. Its complex amplitude can be written as

$$E(t) = A(t)\, e^{i \omega_B t + i \phi(t)},$$

where $A(t)$ is a slowly-varying amplitude and $\phi(t)$ is a slowly-varying phase. If $\phi(t)$ were exactly constant, the Fourier spectrum of $E(t)$ would be a delta function at $\omega_B$: an infinitely narrow line.

Real $\phi(t)$ is not constant — it drifts, and that drift broadens the spectrum.

<div class="guided-fold-start" data-label="From phase drift to Lorentzian linewidth" data-tone="derivation"></div>

Model $\phi(t)$ as a diffusive random walk: over a time interval $\tau$, the accumulated phase excursion has variance

$$\left\langle (\phi(t + \tau) - \phi(t))^2 \right\rangle = \frac{|\tau|}{\tau_\text{coh}}.$$

The timescale $\tau_\text{coh}$ over which the phase variance reaches $1\ \text{rad}^2$ is the **coherence time**{:#defn-coherence-time} — the time over which the phase remains predictable.

The measured emission spectrum is the Fourier transform of the field's autocorrelation:

$$S(\omega) = \int_{-\infty}^{\infty} \left\langle E^*(t)\, E(t + \tau) \right\rangle e^{-i \omega \tau}\, d\tau.$$

For $A$ constant, and $\phi(t + \tau) - \phi(t)$ a Gaussian random variable of variance $|\tau|/\tau_\text{coh}$, the autocorrelation is

$$\left\langle E^*(t)\, E(t + \tau) \right\rangle = |A|^2\, e^{i \omega_B \tau} \left\langle e^{i (\phi(t + \tau) - \phi(t))} \right\rangle = |A|^2\, e^{i \omega_B \tau} e^{-|\tau|/(2 \tau_\text{coh})},$$

using $\langle e^{i x} \rangle = e^{-\sigma_x^2/2}$ for a zero-mean Gaussian $x$ of variance $\sigma_x^2$.

Fourier-transforming the exponential decay gives a Lorentzian centered at $\omega_B$,

$$S(\omega) \propto \frac{1}{(\omega - \omega_B)^2 + (1/(2 \tau_\text{coh}))^2},$$

with full width at half maximum $\Delta\omega = 1/\tau_\text{coh}$, or in linear frequency

$$\Delta\nu = \frac{1}{2\pi\, \tau_\text{coh}}.$$

<div class="guided-fold-end"></div>

So the question "what is $\Delta\nu$?" is the question "how fast does the phase $\phi(t)$ drift?" The rest of § 4.4 traces where the drift comes from and how big it is.

---

#### § 4.4.2. Photon lifetime {#sec-4-4-2}

Before phase noise, consider the passive cavity — no [gain](#defn-gain), no noise sources — and ask how long a photon injected into the lasing mode survives before it leaves.

That timescale, the **photon lifetime**{:#defn-photon-lifetime} $\tau_p$, is set by two loss channels.

- **Leakage through the two grating ends.**

  At each end, the fraction of the intracavity power that transmits out per pass follows from the [finite-mirror reflectivity](#sec-2-2) $R = \tanh^2(\kappa L)$: $T = 1 - R = \text{sech}^2(\kappa L)$.

  A photon making one round trip inside the DFB has two chances to leak (one at each end), so the round-trip loss fraction from leakage is $\approx 2\, \text{sech}^2(\kappa L)$.

  Over the round-trip time $\tau_\text{rt} = 2 L / v_g$, the corresponding leakage rate is

  $$\frac{1}{\tau_\text{leak}} = \frac{2\, \text{sech}^2(\kappa L)}{\tau_\text{rt}}.$$

  For a DFB with $\kappa L \geq 3$, $\text{sech}^2(\kappa L) < 0.01$: leakage is exponentially small in $\kappa L$.

- **Absorption in the material.**

  Not every photon that stays in the [cavity](#defn-cavity) survives: some are removed by material processes that convert the photon energy into something other than the coherent laser mode — free-carrier absorption at wavelengths off the gain transition, scattering off imperfections in the crystal, and similar.

  Lump these into a single absorption rate $1/\tau_\text{abs}$ characteristic of the material and the fabrication quality.

Adding the two loss rates:

$$\frac{1}{\tau_p} = \frac{1}{\tau_\text{leak}} + \frac{1}{\tau_\text{abs}}.$$

In a DFB, $1/\tau_\text{leak}$ is exponentially suppressed with $\kappa L$, so once $\kappa L$ is a few, $\tau_p$ becomes limited by absorption.

Pushing $\kappa L$ up further is what buys long $\tau_p$: each unit of $\kappa L$ suppresses leakage by another factor of $e^{-2}$, until leakage is negligible next to absorption and $\tau_p \to \tau_\text{abs}$.

---

#### § 4.4.3. Where phase drift comes from: spontaneous vs stimulated emission {#sec-4-4-3}

The laser is not passive — the [gain](#defn-gain) medium continuously supplies new photons to the mode, replacing the ones that leak or get absorbed. Those new photons are the ones that add phase noise, so how they are supplied matters.

The gain medium is a population of excited electronic states (carriers pumped up by the drive current). Each excited carrier eventually drops back down and emits one photon of energy equal to the drop. It does so in one of two ways:

- **Stimulated emission.**

  A photon already in a specific mode induces the excited carrier to drop, and the emitted photon is a copy of the trigger — same mode, same frequency, same phase, adding coherently to the field already there.

  Given $N_\text{ph}$ photons already in the mode, the stimulated-emission rate into that mode is proportional to $N_\text{ph}$: the more photons already there, the more triggers available.

- **Spontaneous emission.**

  The carrier drops without any triggering photon. The emitted photon goes into some mode chosen at random from those coupled to the transition, and its phase is uncorrelated with anything in the mode already.

  The rate is set by the atomic transition itself and by the [density of available modes](#sec-4-2-1), not by how many photons are currently there.

Above lasing threshold, most of the light in the lasing mode comes from stimulated emission — the coherent amplification mechanism that makes the laser a laser.

But a small residual rate of spontaneous emission still populates the mode, and *this* is the noise source that broadens the line.

Denote the rate at which spontaneous emission adds photons to the lasing mode by $R_\text{sp}$.

Above threshold, stimulated emission balances loss ($R_\text{stim} = N_\text{ph}/\tau_p$), and detailed balance between the spontaneous and stimulated processes (both driven by the same excited-carrier population, differing only in whether a stimulating photon was present) gives

$$R_\text{sp} = \frac{n_\text{sp}}{\tau_p},$$

with $n_\text{sp} \geq 1$ the **inversion factor**{:#defn-inversion-factor}: $n_\text{sp} = 1$ for a fully inverted gain medium (every carrier in the upper state), larger for partially inverted media where thermal excitations at the lower level compete with the emission.

---

#### § 4.4.4. One spontaneous event, one phase kick {#sec-4-4-4}

What does a single spontaneous emission event do to the mode's phase?

Represent the intracavity field of the lasing mode as a complex phasor.

If $N_\text{ph}$ is the number of photons currently in the mode, the phasor has magnitude $\sqrt{N_\text{ph}}$ and some phase $\phi$; call it $\sqrt{N_\text{ph}}\, e^{i\phi}$.

A spontaneous emission event adds one photon of random phase $\theta$ — a unit-magnitude phasor $e^{i\theta}$. The new field is

$$\sqrt{N_\text{ph}}\, e^{i\phi} + e^{i\theta}.$$

Rotate the coordinate system so that the pre-event field lies along the real axis:

$$\sqrt{N_\text{ph}} + e^{i(\theta - \phi)} = \sqrt{N_\text{ph}} + \cos(\theta - \phi) + i \sin(\theta - \phi).$$

The new phase relative to the pre-event phase is

$$\delta\phi = \arctan\!\left(\frac{\sin(\theta - \phi)}{\sqrt{N_\text{ph}} + \cos(\theta - \phi)}\right) \approx \frac{\sin(\theta - \phi)}{\sqrt{N_\text{ph}}},$$

using $\sqrt{N_\text{ph}} \gg 1$ to drop the $\cos$ term in the denominator. The kick is small because the added unit vector is small compared to the pre-event $\sqrt{N_\text{ph}}$ vector.

Averaging over the uniformly-distributed random angle $\theta - \phi$ gives $\langle \sin^2 \rangle = 1/2$, so the variance of the phase kick from one event is

$$\left\langle (\delta\phi)^2 \right\rangle = \frac{1}{2\, N_\text{ph}}.$$

Larger $N_\text{ph}$ means each unit-magnitude kick perturbs the phase less — the same amount of noise per event, but a larger coherent field to swamp it.

---

#### § 4.4.5. Accumulated phase drift and the linewidth formula {#sec-4-4-5}

Independent kicks arrive at rate $R_\text{sp} = n_\text{sp}/\tau_p$. Each contributes $1/(2 N_\text{ph})$ to the phase variance. Over time $\tau$, the accumulated variance is

$$\left\langle (\phi(t + \tau) - \phi(t))^2 \right\rangle = R_\text{sp} \cdot \tau \cdot \frac{1}{2\, N_\text{ph}} = \frac{n_\text{sp}\, \tau}{2\, \tau_p\, N_\text{ph}}.$$

Comparing with the diffusion relation $\langle (\phi(t+\tau) - \phi(t))^2 \rangle = \tau / \tau_\text{coh}$:

$$\frac{1}{\tau_\text{coh}} = \frac{n_\text{sp}}{2\, \tau_p\, N_\text{ph}}.$$

The intracavity photon number is related to the output power. Photons leak out at rate $1/\tau_\text{leak}$ (from § 4.4.2, ignoring absorption for the output-power accounting), each carrying energy $h\nu$, so

$$P_\text{out} = \frac{N_\text{ph}\, h\nu}{\tau_\text{leak}}.$$

In the regime $\tau_p \approx \tau_\text{leak}$ (the leakage-dominated regime, in which the Schawlow–Townes formula is usually quoted, and up to a modest correction otherwise), $N_\text{ph} = P_\text{out}\, \tau_p / (h\nu)$.

Substituting into $\Delta\nu = 1/(2\pi \tau_\text{coh})$:

$$\Delta\nu = \frac{n_\text{sp}\, h\nu}{4\pi\, \tau_p^2\, P_\text{out}}.$$

This is the **Schawlow–Townes linewidth**{:#defn-schawlow-townes}: the fundamental phase-noise-limited linewidth of a laser above threshold.

Three dependences to notice:

- $\Delta\nu \propto 1/P_\text{out}$: more output power means a larger $N_\text{ph}$ swamping each unit-magnitude kick. Explicit in the phase-kick geometry of § 4.4.4.

- $\Delta\nu \propto 1/\tau_p^2$: one factor of $\tau_p$ comes from the rate of spontaneous events ($R_\text{sp} \propto 1/\tau_p$), and the second from the intracavity photon number at fixed output power ($N_\text{ph} \propto \tau_p$).

  A DFB with high $\kappa L$ pushes $\tau_p$ up exponentially in $\kappa L$, and the linewidth down quadratically on top of that — the payoff of the DFB geometry.

- $\Delta\nu \propto n_\text{sp}$: partial inversion adds proportionally more spontaneous noise per stimulated event.

---

#### § 4.4.6. The linewidth enhancement factor $\alpha_H$ {#sec-4-4-6}

The Schawlow–Townes formula counts only the *direct* phase kick of § 4.4.4 — the geometric perturbation of the phasor by an added photon.

In a semiconductor gain medium, there is a second kick that runs through the carrier density and is invisible in a two-level atomic picture.

The result is an enhancement factor $(1 + \alpha_H^2)$ on the linewidth, where $\alpha_H$ has typical values 2 to 5.

The mechanism has three steps that we already know individually:

1. A spontaneous emission event removes one excited carrier from the population, decreasing the carrier density $N$ by a tiny amount $\delta N$.

2. By the [causal-response relations](#sec-4-3-1), $\varepsilon'(z)$ (the refractive index) and $\varepsilon''(z)$ (the gain) *cannot vary independently* — a carrier-density change that shifts one shifts the other.

   Concretely, in the semiconductor: increasing $N$ raises $\gamma$ (more excited carriers to emit) and simultaneously lowers $n_\text{avg}$ — the Kramers–Kronig companion of the [bandfilling and free-carrier polarizability](#sec-4-5) that will drive the DFB's current tuning below.

   So $\delta N$ produces both $\delta\gamma$ and $\delta n_\text{avg}$.

3. $\delta n_\text{avg}$ shifts the round-trip phase of the lasing mode by an amount proportional to it — an additional phase kick, on top of the direct one.

The size of the additional kick relative to the direct one is the **linewidth enhancement factor**{:#defn-alpha-h}

$$\alpha_H = -\frac{d\varepsilon'/dN}{d\varepsilon''/dN},$$

the ratio at which carrier-density changes convert into index changes versus gain changes.

Both kicks come from the *same* spontaneous event, so they are perfectly correlated. Adding two correlated random variables of variances $\sigma^2$ and $\alpha_H^2 \sigma^2$: the sum has variance $(1 + \alpha_H^2) \sigma^2$.

So the phase-variance-per-event is enhanced by $(1 + \alpha_H^2)$, and the final linewidth is

$$\Delta\nu = \frac{n_\text{sp}\, h\nu}{4\pi\, \tau_p^2\, P_\text{out}}\, (1 + \alpha_H^2). \tag{11}\label{eq:linewidth}$$

For a typical semiconductor DFB: $\kappa L \approx 3$, $\tau_p \sim 10$–$100$ ps, $P_\text{out} \sim 10$ mW, $n_\text{sp} \sim 2$, $\alpha_H \sim 3$.

Plugging in gives $\Delta\nu$ of order 1 MHz — orders of magnitude below the free spectral range of a flat-mirror cavity of comparable length.

*The remaining operational question about the [DFB](#defn-dfb): $\Lambda$ (and with it $k_B = \pi/\Lambda$) is set once at fabrication. Can the emission frequency $\omega_B = \pi c/(n_\text{avg}\, \Lambda)$ be moved after the fact, and by how much?*

### § 4.5. Tuning a DFB {#sec-4-5}

Tuning a [DFB](#defn-dfb) requires shifting its emission frequency $\omega_B = \pi c/(n_\text{avg}\, \Lambda)$.

The period $\Lambda$ is set once by the geometric pattern written into the chip at fabrication, so tuning after the fact must act on $n_\text{avg}$ or on $\Lambda$ indirectly (through overall dimensional change of the substrate). Two mechanisms are practical.

#### Mechanism 1: Temperature

Heating the chip shifts both factors:

- **Index shift.** $n_\text{avg}$ rises slightly with temperature — an empirical coefficient of the material, $dn/dT$ of order $10^{-4}$/K in a semiconductor.
- **Thermal expansion.** The substrate expands, stretching $\Lambda$.

Both terms push $\lambda_B$ in the *same* direction, giving of order $0.1$ nm of Bragg-wavelength shift per K.

- **Range:** around 5 nm.
- **Response time:** limited by how long the heat takes to spread through the chip volume from its point of application to the DFB region — a heat-diffusion time of order milliseconds for a chip a few hundred µm thick.

#### Mechanism 2: Current injection

Passing extra current through the [DFB](#defn-dfb) injects extra free carriers into the [gain](#defn-gain) medium. Two microscopic effects then shift $n_\text{avg}$:

- **Free-carrier polarizability.**

  The injected carriers behave as a plasma of free charges superimposed on the bound-electron response of the crystal.

  Their contribution to the dielectric function is negative at optical frequencies (below their plasma frequency — the Drude form) and adds to the bound response, lowering the real part of $\varepsilon$ and therefore lowering $n_\text{avg}$.

  This is the same mechanism that gives metals their negative-$\varepsilon$ optical response.

- **Bandfilling.**

  In a semiconductor gain medium, injected electrons occupy states near the bottom of the conduction band.

  A photon whose energy is a bit above the band gap normally excites an electron from the top of the valence band into an empty conduction-band state; when those low-lying conduction-band states are already occupied, the transition is Pauli-blocked and the material's absorption near the band edge drops.

  That absorption drop — a change in $\varepsilon''$ over a range of frequencies — is coupled by the [Kramers–Kronig relations](#sec-4-3-1) to a change in $\varepsilon'$ across the *same* range, lowering $n_\text{avg}$ at the laser's operating frequency.

Both microscopic effects push $n_\text{avg}$ down and are fast:

- **Response time:** the injected carriers reach a new steady state on the carrier lifetime, of order nanoseconds.
- **Tuning coefficient:** small — about $0.01$ nm/mA.
- **Coupling to drive point:** the same current that shifts $n_\text{avg}$ also sets the laser's output power (more current → more carriers → more stimulated emission), so retuning changes the emitted power as a side effect.

#### Combined reach

Temperature and current injection each act on the *whole device*: because the grating and the [gain](#defn-gain) share the same $n_\text{avg}$, moving one drags the other.

> **Key Takeaway:** The Bragg-wavelength tuning range of a DFB is capped at a few nm — that is the operational reach a DFB gives us on its emission frequency. Wider tuning requires making $\kappa$ and $\gamma$ act in physically distinct sections of the device, so their indices can move independently.

### § 4.6. DBR laser: grating outside the gain {#sec-4-6}

A **DBR laser** places the [coupling](#defn-coupling) $\kappa$ and the [gain](#defn-gain) $\gamma$ in physically distinct sections along the propagation axis.

#### Device layout

Reading along the propagation axis:

- A central **gain section** carries $\gamma$ (a semiconductor gain medium, same as the DFB's) but no grating.
- One or both ends of the device continue into a passive **DBR section** carrying $\kappa$ (the Bragg grating) but no gain.

The gain section and each DBR section have separate metal contacts on top, so the current injected into the gain section (setting $\gamma$, and with it the output power) and the current injected into the DBR section (used to shift the DBR-section $n_\text{avg}$ through the [carrier-injection mechanism](#sec-4-5), and with it $\omega_B$) are controlled by two independent power supplies.

#### Three tuning strategies

That independence gives three strategies:

- **Grating-only tune.**

  Change the index of the [DBR](#defn-dbr) section while leaving the [gain](#defn-gain) section fixed. $\omega_B$ moves, but the total round-trip length and the mode spacing are essentially unchanged.

  As $\omega_B$ moves across successive [cavity](#defn-cavity) modes, the laser hops from one to the next.

- **Cavity-only tune.**

  Insert a passive phase-shift section between the grating and the [gain](#defn-gain), and change its index. This shifts the [cavity](#defn-cavity) mode frequencies without moving $\omega_B$.

  Continuous tuning over one free spectral range is possible without a mode hop.

- **Combined.**

  Tune both sections together, keeping the selected [cavity](#defn-cavity) mode centered inside the [stopband](#defn-stopband) as the stopband slides. This is the widest continuous-tuning strategy with a single grating.

> **Key Takeaway:** The [DBR](#defn-dbr) laser has more sections to control than a [DFB](#defn-dfb) — typically three or four, each with its own contact — but the combined strategy reaches further, without mode hops.

*A single grating still limits how much of the [gain](#defn-gain) bandwidth the tuning can reach — around 10 nm at most before the [gain](#defn-gain) profile itself falls off.*

*So far we have treated the grating as uniform: constant [coupling](#defn-coupling) $\kappa$ and constant period $\Lambda$. What can we do by shaping the grating — varying its amplitude or period along the length?*

---

## § 5. Engineered gratings {#sec-5}

Sections 1–4 treated the grating as uniform: constant [coupling](#defn-coupling) $\kappa$ and constant period $\Lambda$.

Real gratings can vary either along their length, and the two knobs — spatial variation of amplitude, spatial variation of period — open up a family of engineered devices.

We cover apodization, chirp, co-propagating coupling, and the extension of the Bragg momentum-conservation argument to nonlinear frequency conversion.

### § 5.1. Apodization: shaping the amplitude {#sec-5-1}

A uniform grating turns on at $z = 0$ and off at $z = L$: $\kappa$ jumps from zero to $\kappa_0$ at the entrance and back to zero at the exit.

Inside the [stopband](#defn-stopband) the reflection saturates near unity as $\kappa_0 L$ grows large, by the [tanh² law](#sec-2-2); outside the [stopband](#defn-stopband) reflection is weak but not zero — the spectrum carries a train of secondary maxima on both sides of $\lambda_B$.

Those two abrupt on/off transitions are what puts them there. We first compute the reflection spectrum for the uniform grating in the weak-coupling limit, then remove the secondary maxima by softening the two ends of $\kappa(z)$.

**The reflection outside the stopband: a coherent sum over depths.**

Work in the weak-coupling limit $\kappa_0 L \ll 1$, where the forward-wave amplitude barely changes crossing the grating and each thin slab $dz$ can be treated in isolation.

A wave at [detuning](#defn-detuning) $\delta$ enters at $z = 0$, propagates freely to depth $z$ with in-medium wavenumber $k_B + \delta$, meets the local modulation $\kappa(z)$ there, and a small piece of the wave — with amplitude $\kappa(z)\, dz$ — is scattered back.

That piece propagates back to $z = 0$, again with wavenumber $k_B + \delta$.

The full round trip from $z = 0$ to $z$ and back accumulates a total phase $2(k_B + \delta) z$; the reference we compare against is the field at $z = 0$ oscillating at the Bragg reference, whose phase for the same round trip would be $2 k_B z$.

So each slab's return arrives back at the entrance with a phase $2\delta z$ against reference. Summing coherently across all depths,

$$r(\delta) \approx i \int_0^L \kappa(z)\, e^{2i\delta z}\, dz. \tag{12}\label{eq:r-of-delta}$$

The factor $i$ carries the [$\pi/2$ phase kick that a low-to-high interface imprints at Bragg](#sec-1-3); it is common to all depths and does not affect the spectrum's shape.

At $\delta = 0$ every depth contributes in phase, and the amplitudes add to $i\kappa_0 L$. Away from $\delta = 0$, deeper contributions rotate faster than shallower ones, and the sum shrinks.

For $\kappa(z) = \kappa_0$ on $[0, L]$ and zero outside, the integral is elementary:

$$r(\delta) \approx i\, \kappa_0 \int_0^L e^{2i\delta z}\, dz = i\, \kappa_0\, L\, e^{i \delta L}\, \frac{\sin(\delta L)}{\delta L},$$

and the power reflectivity is

$$\vert r(\delta) \vert^2 = (\kappa_0 L)^2\, \left[\frac{\sin(\delta L)}{\delta L}\right]^2.$$

Two features shape this spectrum.

- **A main lobe of width $\delta L \sim \pi$ around $\delta = 0$.**

  All depths add in phase at $\delta = 0$; the width of the main lobe is the range of $\delta$ over which they remain within $\sim \pi/2$ of each other across the length of the grating, i.e. $\delta L \sim 1$.

- **A train of secondary maxima at $\delta L \approx (n + 1/2)\pi$ for $n \geq 1$, decaying only as $1/(\delta L)^2$.**

  These are the signature of the abrupt on/off at $z = 0$ and $z = L$.

  At large $\delta$, the interior contributions of the integral cancel among themselves (deep-slab returns interleave in phase with shallow-slab returns), and what survives is dominated by the two endpoint discontinuities.

  The first secondary maximum reaches about $4.7\%$ of the peak — small, but not negligible.

**Why abrupt cutoffs produce slowly-decaying secondary maxima.**

Integrate \eqref{eq:r-of-delta} by parts:

$$r(\delta) \approx i \int_0^L \kappa(z)\, e^{2i\delta z}\, dz = \left[\frac{\kappa(z)\, e^{2i\delta z}}{2\delta}\right]_0^L - \frac{1}{2\delta} \int_0^L \kappa'(z)\, e^{2i\delta z}\, dz.$$

The boundary term evaluates to $\bigl(\kappa(L) - \kappa(0)\bigr)/(2\delta)$ up to a phase — a fixed number of order $\kappa_0/(2\delta)$, contributing $\sim (\kappa_0 / 2\delta)^2$ to the power.

That is the $1/\delta^2$ envelope the sidelobes ride on.

If $\kappa$ instead vanishes at both endpoints, the boundary term drops out, and the remaining integral admits another integration by parts — the result now decays as $1/\delta^2$ in amplitude, $1/\delta^4$ in power.

Iterating: each additional derivative of $\kappa$ that vanishes at the two ends earns another factor of $1/\delta$ in amplitude at large $\delta$.

**Apodization** puts this to work: multiply $\kappa$ by a smooth taper $w(z)$ that rises from zero at $z = 0$ to about unity across the middle of the grating and back to zero at $z = L$,

$$\kappa(z) = \kappa_0\, w(z).$$

A common choice is Gaussian, $w(z) \propto \exp\bigl[-(z - L/2)^2 / (2\sigma^2)\bigr]$ with $\sigma$ a fraction of $L$: all derivatives of $\kappa$ vanish at the two ends, and by the integration-by-parts iteration above the reflection spectrum outside the [stopband](#defn-stopband) decays faster than any polynomial in $\delta$.

The secondary maxima are effectively erased. Raised-cosine and Kaiser tapers work the same way, differing only in how quickly they roll off.

The cost is the width of the main lobe.

Tapering concentrates most of the reflection into the central portion of the grating where $w(z) \approx 1$; the effective length participating in the coherent sum is shorter than $L$, and by the $\delta L \sim 1$ estimate the main lobe correspondingly widens.

Sidelobe suppression and main-lobe width trade against each other, roughly linearly: a factor-of-ten suppression comes with a comparable widening.

**Where this matters concretely.**

Fiber-optic links carry several wavelength channels through the same fiber at spacings of $100\,\text{GHz}$ (about $0.8\,\text{nm}$ at $\lambda = 1550\,\text{nm}$), or increasingly $50\,\text{GHz}$ and $25\,\text{GHz}$.

A grating used to add or drop one channel must reflect its target channel almost fully while leaving its immediate neighbors untouched.

A uniform grating whose reflectivity peaks on the target channel would still return the $4.7\%$ first secondary maximum on the neighbor channel one slot over — every downstream receiver would receive a $-13\,\text{dB}$ shadow of the wrong channel.

Apodized fiber Bragg gratings — the smoothing implemented during the two-beam interference exposure that writes the index modulation — routinely push this floor to $-40\,\text{dB}$ or lower, at the price of a main lobe wider than the same-length uniform grating's.

### § 5.2. Chirp: shaping the period {#sec-5-2}

Every derivation before this subsection assumed a single [Bragg wavenumber](#defn-bragg-wavenumber) $k_B = \pi/\Lambda$ set by a single period $\Lambda$. **Chirp** breaks that: the period varies slowly along the grating,

$$\Lambda(z) = \Lambda_0\, (1 + \alpha z),$$

with $\alpha$ small enough that $\Lambda$ changes by a small fraction over one Bragg period. The grating stays locally sinusoidal, so at every depth a local [Bragg wavelength](#defn-bragg-wavelength) is well-defined,

$$\lambda_B(z) = 2\, n_\text{avg}\, \Lambda(z) = \lambda_{B, 0}\, (1 + \alpha z).$$

What follows reads more naturally in $\lambda$ than in $k_B$: chirp assigns a different reflecting wavelength to each depth, and "which wavelength turns around where" is the phrasing that makes the physics visible.

**Depth-selective reflection.**

Send a wave at wavelength $\lambda$ into the grating from $z = 0$.

At each depth the grating tries to couple the forward and backward waves, but that coupling is resonant: it only survives the coherent sum over the many periods that make up any small region of grating if the wave's wavelength matches the local $\lambda_B(z)$.

At depths where $\lambda \neq \lambda_B(z)$, the phase mismatch $2\delta = 2(k - k_B(z))$ is nonzero, and successive periods contribute to the reflection with rotating phases that cancel to leading order — the same [phase-error accumulation](#sec-1-4), local to that depth.

The wave crosses those depths essentially untouched. It reaches the specific depth $z^*$ at which the local Bragg matches:

$$\lambda_B(z^*) = \lambda.$$

There the phase mismatch is zero, successive periods add coherently, and the local grating acts as a Bragg mirror at that depth — the wave reflects and decays into the deeper grating over the characteristic decay length $1/\kappa$ of [§ 2.1](#sec-2-1).

Deeper layers, where the local $\lambda_B$ has drifted past $\lambda$, again do nothing. From outside, the wave has turned around at $z^*$ — a wavelength-dependent penetration depth.

Read as a function of $\lambda$: the wave selects the depth where the grating's local Bragg matches it. Invert $\lambda_B(z^*) = \lambda$ using the linear chirp $\lambda_B(z) = \lambda_{B, 0}(1 + \alpha z)$:

$$z^*(\lambda) = \frac{\lambda - \lambda_{B, 0}}{\alpha\, \lambda_{B, 0}}.$$

Shorter wavelengths turn around near the entrance; longer wavelengths propagate deeper before turning around (for $\alpha > 0$; flip signs for $\alpha < 0$).

**Wavelength-dependent group delay.**

Compare the arrival time of two wavelengths on their way back out.

Each wave propagates from $z = 0$ down to its own $z^*(\lambda)$ and back, and only that middle portion of the round trip depends on $\lambda$ — the entrance and exit are at fixed $z = 0$.

Approximating the propagation between $z = 0$ and $z^*$ as free (the wave sees successive off-resonant depths, negligibly disturbed), the round-trip time is $2\, n_\text{avg}\, z^*(\lambda) / c$. Substituting $z^*(\lambda)$,

$$\tau(\lambda) = \frac{2\, n_\text{avg}\, z^*(\lambda)}{c} = \frac{2\, n_\text{avg}}{c\, \alpha\, \lambda_{B, 0}}\, (\lambda - \lambda_{B, 0}). \tag{13}\label{eq:chirp-delay}$$

The reflected pulse's spectral components emerge with a delay that is *linear* in $\lambda$. The slope

$$\frac{d\tau}{d\lambda} = \frac{2\, n_\text{avg}}{c\, \alpha\, \lambda_{B, 0}}$$

is the design output: given a target $d\tau/d\lambda$, the chirp $\alpha$ is set by inverting. Its sign is picked by the sign of $\alpha$: $\alpha > 0$ delays longer wavelengths more, $\alpha < 0$ delays shorter wavelengths more.

The chirped grating is a **dispersive reflector** — a reflector whose reflection embeds a designer-chosen wavelength-dependent delay.

**Dispersion compensation in fiber.**

The main use is undoing chromatic dispersion in fiber-optic links.

Standard single-mode telecom fiber at $1550\,\text{nm}$ has group-velocity dispersion of about $D_\text{fiber} \approx 17\,\text{ps}/(\text{nm} \cdot \text{km})$:

a wavelength $\lambda$ acquires a group delay $D_\text{fiber} \cdot (\lambda - \lambda_0) \cdot z_\text{fiber}$ after propagating $z_\text{fiber}$ of fiber,

so a pulse whose spectrum spans $\Delta\lambda = 10\,\text{nm}$ has its red and blue edges arrive $170\,\text{ps}$ apart after $1\,\text{km}$ — a temporal broadening that limits how tightly bits can be packed on the link.

A **chirped fiber Bragg grating** (CFBG) engineered with the opposite sign of $d\tau/d\lambda$ in \eqref{eq:chirp-delay} — choose $\alpha$ so that $d\tau/d\lambda = -D_\text{fiber} \cdot z_\text{fiber}$ — applies the reverse delay in reflection, and the emerging pulse is recompressed to its original width.

A related use is intracavity dispersion compensation in femtosecond lasers, where the round-trip dispersion from prisms, air, and the gain medium must be cancelled to sustain sub-picosecond pulses; chirped mirrors are the standard element.

**Two refinements a real design has to make.**

The "free propagation" approximation used to derive \eqref{eq:chirp-delay} ignores the last piece of the round trip: as the wave enters the local stopband near $z^*$ and turns around inside it, it slows down and picks up an extra contribution to $\tau(\lambda)$ from that region.

And $D_\text{fiber}$ itself varies with $\lambda$ across the pulse spectrum (second-order dispersion), so matching the CFBG's response over the full bandwidth requires the full transfer-matrix treatment of [§ 8 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-8), with $\alpha$ itself allowed to vary with $z$.

**Underlying picture.**

The mechanism is a direct reading of \eqref{eq:hyperbola} at $\delta = \pm\kappa$: the group velocity $d\omega/dq$ vanishes at the two [stopband](#defn-stopband) boundaries $\omega_\pm$ of [§ 1](#sec-1).

Chirping the grating slides that vanishing point in $z$, so different wavelengths reach the boundary at different depths, integrate different accumulated phases along the way, and emerge with the designed group delay.

### § 5.3. Co-propagating coupling and long-period gratings {#sec-5-3}

The coupled-mode analysis of [§ 4 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) handled a *counter*-propagating pair: forward and backward waves along the same waveguide, coupled by a grating with $G_1 = 2 k_B$ that supplies the round-trip momentum kick.

The same formalism applies to a *co*-propagating pair: two guided modes of a waveguide, both moving in the same direction with wavenumbers $k_1 > k_2$, coupled by a grating with $G = k_1 - k_2$.

The coupled-mode equations for the two co-propagating amplitudes are

$$\frac{d A_1}{d z} = i\delta\, A_1 + i\kappa\, A_2, \qquad \frac{d A_2}{d z} = -i\delta\, A_2 + i\kappa\, A_1. \tag{14}\label{eq:copropag}$$

These look almost like the [counter-propagating equations](#sec-2-2), $dA/dz = i\delta A + i\kappa B$ and $dB/dz = -i\delta B - i\kappa A$, but with a critical sign difference: both terms on the right-hand side of \eqref{eq:copropag} have coefficients of the same sign, not opposite signs. That single sign change flips the conservation law of the system.

Computing $d(\vert A_1 \vert^2 + \vert A_2 \vert^2) / dz$ from \eqref{eq:copropag} (differentiate each modulus squared, use the equations to eliminate $d A_i / dz$),

$$\frac{d}{dz}\left(\vert A_1 \vert^2 + \vert A_2 \vert^2\right) = 0.$$

The *sum* of the two mode powers is conserved: total power is conserved between the two co-propagating modes because both are forward-going and neither leaves the waveguide.

Energy sloshes back and forth periodically between $A_1$ and $A_2$ along the grating, with a period set by $\kappa$.

Contrast with the counter-propagating case, where the conserved quantity is $\vert A \vert^2 - \vert B \vert^2$ — the *net* Poynting flux through any cross-section — and where inside the [stopband](#defn-stopband) the individual mode powers grow exponentially as a standing wave builds up between the two effective mirrors.

The two [coupling](#defn-coupling) situations are therefore physically distinct: counter-propagating coupling produces a stopband and Bragg reflection; co-propagating coupling produces periodic energy transfer between two guided modes.

**Long-period fiber gratings** exploit the co-propagating case.

A grating with period much longer than the [Bragg period](#defn-bragg-period) — typically 100–500 $\mu\text{m}$ versus $\sim 0.5\,\mu\text{m}$ for a fiber Bragg mirror — couples the fundamental core-guided mode of a fiber to a co-propagating cladding mode.

The cladding mode leaks out through the fiber jacket, so from the input's viewpoint the long-period grating acts as a wavelength-dependent loss: at wavelengths satisfying the phase-matching condition $\Lambda = \lambda_0 / (n_\text{core} - n_\text{cladding})$, power leaves the core and is lost.

These devices are used as gain-flattening filters in erbium-doped fiber amplifiers, and as temperature and strain sensors where the loss-dip wavelength moves with the fiber's environment.

### § 5.4. Quasi-phase matching in nonlinear optics {#sec-5-4}

The last application takes the Bragg momentum-conservation argument outside linear wave propagation.

Consider second-harmonic generation: an input wave at frequency $\omega$ drives, through the material's second-order nonlinear susceptibility $\chi^{(2)}$, an induced polarization at $2\omega$, and that polarization radiates a wave at $2\omega$.

For the induced polarization at $2\omega$ to drive a *growing* free wave at $2\omega$, its spatial phase — which travels with the input wave, so has wavenumber $2\, k(\omega)$ — must equal the free-space wavenumber at the harmonic, $k(2\omega) = 2\omega\, n(2\omega) / c$.

Equating the two requires $n(\omega) = n(2\omega)$: the refractive index at the fundamental has to equal the refractive index at the harmonic.

But any medium with normal dispersion has $n(\omega) < n(2\omega)$, so there is a phase mismatch

$$\Delta k = k(2\omega) - 2\, k(\omega) \neq 0.$$

The consequence is that the polarization and the free harmonic wave drift out of phase as they propagate, and after a **coherence length** $\pi / \Delta k$ they are $\pi$ out of phase and the polarization drives the wave *down* instead of up.

The second-harmonic amplitude oscillates rather than growing, and the total conversion efficiency stays low.

The Bragg-inspired fix — **quasi-phase matching** (QPM) — is to periodically invert the sign of $\chi^{(2)}(z)$ along the propagation direction.

Every half period of length $\pi / \Delta k$, the sign of the induced polarization flips, resynchronizing it with the free harmonic wave that has drifted $\pi$ ahead.

The Fourier picture makes this quantitative. Expand the modulated nonlinear susceptibility as

$$\chi^{(2)}(z) = \sum_m \chi_m^{(2)}\, e^{i m G z}, \qquad G = 2\pi / \Lambda,$$

where $\Lambda$ is the spatial period of the sign inversions.

Each Fourier component $m$ makes a spatial-frequency contribution $mG$ available to the phase-matching equation — a "grating momentum" that can compensate a specific phase mismatch.

Choosing $\Lambda$ so that $G = \Delta k$ compensates the fundamental mismatch: the polarization now drives a wave whose effective wavenumber is $2\, k(\omega) + G = k(2\omega)$, and the phase mismatch is closed by momentum supplied by the grating.

This is the same momentum-balance condition that produced Bragg reflection in [Picture 2 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#picture-2-elastic-scattering-with-reciprocal-lattice-momentum).

What differs is the physical object being coupled: there, the momentum kick made forward and backward waves at the same frequency resonantly exchange amplitude; here, it keeps the induced polarization and the free harmonic wave in phase over long propagation distances.

Two situations, one algebra.

Periodically poled lithium niobate (PPLN) and periodically poled KTP are the standard QPM materials, used across telecom wavelength conversion, entangled-photon-pair generation, and frequency-referencing devices.

The design principle is the [Bragg condition](#defn-bragg-condition) $\lambda_B = 2\, n_\text{avg}\, \Lambda$ wearing a different physical hat: a momentum kick from a periodic modulation, tuned to close a mismatch the underlying medium alone cannot close.

---

## Closing

[§ 1](#sec-1) and [§ 2](#sec-2) read \eqref{eq:hyperbola} — the Bragg dispersion $q^2 = \delta^2 - \kappa^2$ — at four operating points:

- $\delta = \pm\kappa$: the two standing waves $\omega_\pm$ and which sits at the lower frequency ([§ 1](#sec-1)).

- $\delta = 0$ inside an infinite medium: the decay scale $1/\kappa$ ([§ 2.1](#sec-2-1)).

- $\delta = 0$ inside the [stopband](#defn-stopband) with two boundaries: the [finite-mirror reflectivity $\tanh^2(\kappa L)$](#sec-2-2).

[§ 3](#sec-3)–[§ 5](#sec-5) build on that base:

- Piecewise-constant modulation as fabricated hardware: the [DBR](#defn-dbr) ([§ 3](#sec-3)).

- Modulation in the presence of [gain](#defn-gain): the [DFB](#defn-dfb) laser and its DBR-laser cousin ([§ 4](#sec-4)).

- Modulation shaped along its length: apodization, chirp, co-propagating [coupling](#defn-coupling), and quasi-phase matching ([§ 5](#sec-5)).

The two ingredients that make all of it work were the two-wave truncation of the previous post's [§ 4](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-4) and the accessibility of both stopband boundary frequencies $\omega_\pm$.

Every device-specific formula in this post follows from those two facts, taken through one universal hyperbola.
