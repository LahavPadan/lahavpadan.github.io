Some waves propagate at every frequency. Sound in air, light in vacuum, ripples on a string — every frequency we send in comes out the other end. Other systems refuse to transmit anything below some threshold frequency $$\omega_c$$: drive a metallic pipe below its threshold and no signal comes through; shine a low-frequency wave at a metal and it bounces off; a field whose particle content carries rest mass admits no propagating wave below a threshold set by that rest mass.

The mechanisms behind these thresholds look completely different — walls that confine a wave, electrons that respond collectively to it, a floor set by rest energy. Yet all three produce dispersion relations of exactly the same algebraic shape,

$$
k^2 = \frac{\omega^2 - \omega_c^2}{v^2},
\tag{1}\label{eq:cutoff-dispersion}
$$

with $$\omega_c$$ and $$v$$ set by the mechanism. Above $$\omega_c$$ the wavenumber $$k$$ is real and the wave propagates; below $$\omega_c$$ it is imaginary and the wave decays exponentially. What follows derives that shape from scratch in each of the three settings, then reads off — from equation \eqref{eq:cutoff-dispersion} alone — everything a cutoff-carrying medium does near and below its threshold.

## # 1. What "dispersion relation" and "propagation" mean {#sec-1}

Before comparing cutoffs we need the language. A **plane wave**

$$\psi(z,t) = A\, e^{i(kz - \omega t)}$$

is a solution of a linear wave equation for a particular pair $$(k, \omega)$$. Which pairs are allowed is decided by substituting the ansatz into the wave equation and reading off the resulting algebraic relation $$\omega(k)$$ or $$k(\omega)$$. That relation is the medium's **dispersion relation**.

The reason $$k$$ or $$\omega$$ can turn complex is that we have not yet said which of the two is given from outside. Two natural setups:

- **Fixed frequency** (a driven problem): a source outside the medium oscillates at a real $$\omega$$. The medium then has to find some $$k$$ consistent with equation \eqref{eq:cutoff-dispersion}. If it produces a real $$k$$, the wave propagates; if the algebra forces $$k$$ imaginary, the wave becomes $$e^{-\lvert k\rvert z}$$ and decays with depth.
- **Fixed wavenumber** (an initial-value problem): the field starts at $$t=0$$ with a spatial profile $$e^{ikz}$$ and one asks how it evolves. Here $$k$$ is real by assumption and $$\omega$$ can turn complex, giving a temporally decaying oscillation.

The three settings covered below are all driven problems, so it is $$k$$ that goes imaginary when the medium refuses the wave. What differs from one setting to the next is only the mechanism that sets $$\omega_c$$, and what the field is actually doing on either side of that threshold.

## # 2. A wave squeezed between walls {#sec-2}

The simplest cutoff mechanism is geometric: a wave forced into a pipe whose cross-section is comparable to its wavelength. Take a long metallic tube of rectangular cross section — width $$a$$ along $$x$$, height $$b$$ along $$y$$, extending along $$z$$ — and try to send an electromagnetic wave down the axis.

In vacuum the field satisfies the Helmholtz equation

$$\left(\nabla^2 + \frac{\omega^2}{c^2}\right)\vec E = 0,$$

with $$c$$ the speed of light. At every metallic wall the tangential component of $$\vec E$$ has to vanish: a perfect conductor cannot sustain a tangential field along its surface without drawing an infinite current in response. That is what picks out the transverse structure of the wave.

Trying a solution that separates as a transverse function times an axial plane wave,

$$\vec E(x,y,z) = \vec E_\perp(x,y)\, e^{i k_z z},$$

the wave equation splits into a transverse eigenvalue problem for $$\vec E_\perp$$ plus a relation between the transverse eigenvalue and $$k_z$$. The transverse problem picks out a discrete set of allowed shapes — the **modes** — because arbitrary transverse dependence cannot satisfy the wall conditions. The lowest one has one half-wavelength across $$a$$ and no variation across $$b$$ (higher modes with more transverse variation require higher frequencies); its transverse profile is $$\sin(\pi x/a)$$, so its transverse wavenumber is $$k_\perp = \pi/a$$. Substituting back into the wave equation and solving for the axial part,

$$k_z^2 = \frac{\omega^2}{c^2} - \left(\frac{\pi}{a}\right)^2,$$

which is equation \eqref{eq:cutoff-dispersion} with $$v = c$$ and cutoff frequency $$\omega_c = \pi c/a$$. Below $$\omega_c$$ the axial wavenumber is imaginary and the wave decays along the pipe rather than propagating; above it, $$k_z < \omega/c$$ always, so the wave advances along the pipe more slowly than the same wave would in open vacuum.

{% include visualization.html src="waveguide-modes-and-cutoff.html" title="Transverse waveguide modes, dispersion, and cutoff" %}

<div class="guided-fold-start" id="fold-bouncing-plane-waves" data-label="Bouncing plane waves make the dispersion a Pythagorean identity" data-tone="derivation"></div>

Inside the pipe, a mode can be decomposed as a superposition of two free-space plane waves, each carrying total wavenumber $$\omega/c$$, bouncing between the walls at some angle $$\theta$$ from the axis. The two components superpose to

> a standing wave transversely and a traveling wave axially.

Projecting the total wavenumber onto the two directions gives

$$k_z = \frac{\omega}{c}\cos\theta, \qquad k_\perp = \frac{\omega}{c}\sin\theta,$$

and squaring and adding recovers $$\omega^2/c^2 = k_z^2 + k_\perp^2$$: the dispersion relation is nothing but the Pythagorean identity for this decomposition. The cutoff frequency is the frequency at which $$\theta = \pi/2$$, so the bouncing plane waves travel purely transversely and make no forward progress along the axis. Below cutoff the geometry would demand $$\sin\theta > 1$$, which no real angle can supply, so something must go imaginary — and the something is $$k_z$$.

{% include visualization.html src="waveguide-axial-component.html" title="The axial wavenumber becomes imaginary below cutoff" %}

<div class="guided-fold-end"></div>

The mechanism is entirely geometric — but other settings produce the same equation with no walls at all. Where does the transverse constraint come from in those?

## # 3. When the medium itself supplies the restoring force {#sec-3}

The next setting has no walls. It is a **plasma**: a region of space containing free electrons against an immobile positive-ion background of equal charge density. Send in an electromagnetic wave; ask when it propagates.

The electrons respond individually to the wave's electric field. For a harmonic drive $$\vec E = \vec E_0 e^{-i\omega t}$$, an electron of mass $$m_e$$ and charge $$-e$$ obeys

$$m_e \ddot{\vec x} = -e\vec E,$$

and, using $$\ddot{\vec x} = -\omega^2 \vec x$$ for harmonic motion, has solution

$$\vec x = \frac{e}{m_e \omega^2}\vec E.$$

If there are $$n_e$$ such electrons per unit volume, the polarization density they produce is

$$\vec P = -n_e e \vec x = -\frac{n_e e^2}{m_e \omega^2}\vec E.$$

Feeding this into the definition of the electric displacement, $$\vec D = \varepsilon_0 \vec E + \vec P \equiv \varepsilon_0 \varepsilon(\omega)\vec E$$ (with $$\vec D$$ the displacement field), identifies the plasma's frequency-dependent permittivity as

$$\varepsilon(\omega) = 1 - \frac{\omega_p^2}{\omega^2}, \qquad \omega_p^2 \equiv \frac{n_e e^2}{m_e \varepsilon_0}.$$

Whether a plane wave $$\vec E \propto e^{i(kz-\omega t)}$$ propagates is decided by substituting into the wave equation in a linear medium, $$\nabla^2 \vec E = (\varepsilon/c^2)\partial_t^2 \vec E$$, which gives

$$k^2 = \frac{\omega^2 \varepsilon(\omega)}{c^2} = \frac{\omega^2 - \omega_p^2}{c^2}.$$

**Equation \eqref{eq:cutoff-dispersion} once more**, with $$v = c$$ and $$\omega_c = \omega_p$$. Below $$\omega_p$$ the wave is evanescent.

But something has been left unexplained. The quantity $$\omega_p$$ appeared as an algebraic combination in the permittivity and was given the name "plasma frequency" without any oscillation having yet been identified. It is a real oscillation frequency, and identifying it as such is what makes the analogy with the waveguide picture more than formal.

<div class="guided-fold-start" data-label="What the plasma frequency physically is, and the skin depth it produces" data-tone="derivation"></div>

Imagine the whole electron cloud rigidly displaced by a small distance $$x$$ relative to the ion background, with no external field applied. In the bulk of the cloud, nothing has changed: an electron that moved has been replaced by its neighbor's electron, and the local charge density stays zero. But at one edge of the cloud a layer of positive ions has been left uncovered, and at the opposite edge a layer of electrons has piled up beyond the ion background. The system now looks like a parallel-plate capacitor with surface charge density $$\pm n_e e x$$, and it produces a uniform electric field inside itself of magnitude

$$E = \frac{n_e e x}{\varepsilon_0}.$$

That field pulls the electron cloud back toward equilibrium. The equation of motion of the collective displacement is

$$m_e \ddot x = -eE = -\frac{n_e e^2}{\varepsilon_0}\, x,$$

which is a harmonic oscillator with natural frequency $$\omega_p = \sqrt{n_e e^2 / (m_e \varepsilon_0)}$$ — the same combination that showed up in the permittivity. So $$\omega_p$$ is the rate at which the entire electron sea sloshes against the ion background when displaced from equilibrium. The restoring force is not a chemical bond; it is purely electrostatic, produced by the small charge imbalance any rigid displacement of the cloud creates at its edges.

{% include visualization.html src="plasma-frequency.html" title="Plasma frequency as collective electron motion and electromagnetic cutoff" %}

This is worth stating as a general pattern. In every setting covered here, the cutoff frequency coincides with the natural frequency of some oscillation the medium performs on its own. In the pipe it was the transverse standing-wave mode with wavenumber $$k_\perp$$; in the plasma it is the collective sloshing at $$\omega_p$$; in the next section it will be the intrinsic oscillation of a massive quantum field at $$mc^2/\hbar$$. A driving wave below that intrinsic frequency cannot force the medium to keep up with it, and no propagating solution exists.

The evanescent decay below $$\omega_p$$ has a name of its own. For $$\omega \ll \omega_p$$ the decay length is

$$\delta = \frac{c}{\sqrt{\omega_p^2 - \omega^2}} \approx \frac{c}{\omega_p},$$

which is the **skin depth**: the distance the field penetrates before being screened out by the electron response. This is why metals reflect visible light — the plasma frequency of typical metals lies in the ultraviolet, so all visible frequencies are safely below cutoff and are reflected with only a nanometer-scale skin. It is also why the ionosphere reflects shortwave radio: the ionospheric plasma frequency is a few megahertz, so any radio wave below that frequency bounces off it and can be sent over the horizon.

<div class="guided-fold-end"></div>

The waveguide and plasma cutoffs both live inside classical electromagnetism — one geometric, one dynamical. The same algebraic shape occurs in an even more elementary setting, in which the threshold is set by nothing more than the rest mass of the particle whose wave we are describing.

## # 4. Mass as a cutoff {#sec-4}

A relativistic particle of mass $$m$$ satisfies the energy-momentum relation

$$
E^2 = (pc)^2 + (mc^2)^2.
\tag{2}\label{eq:energy-momentum}
$$

Under the identifications $$E = \hbar\omega$$ and $$p = \hbar k$$ — [derived separately in a companion piece on the wave description of matter](/posts/justification-of-the-de-broglie-relation/#why-the-wave-packet-velocity-leads-to-p--hbar-k) — this becomes

$$\omega^2 = c^2 k^2 + \left(\frac{mc^2}{\hbar}\right)^2,$$

or equivalently

$$k^2 = \frac{\omega^2}{c^2} - \left(\frac{mc^2}{\hbar}\right)^2.$$

Equation \eqref{eq:cutoff-dispersion} again, with $$v = c$$ and

$$\omega_c = \frac{mc^2}{\hbar}.$$

Above $$\omega_c$$ the field propagates; below it, the field is evanescent.

The evanescent tail below cutoff has a concrete realization: it is the field surrounding a **stationary source** of the field — a charge held fixed in place sourcing a Coulomb-like field, or, in the case that motivated the massive Klein–Gordon equation historically, a nucleon at rest sourcing the nuclear pion field. "Stationary" here is a statement about the source in time: it does not switch on or off and does not oscillate, so it excites only the $$\omega = 0$$ component of the field. Setting $$\omega = 0$$ in equation \eqref{eq:cutoff-dispersion} gives $$k^2 = -k_c^2$$, so $$k$$ is purely imaginary. Writing $$k = i k_c$$ with

$$k_c \equiv \frac{\omega_c}{c} = \frac{mc}{\hbar},$$

the spatial equation for the field away from the source becomes $$(-\nabla^2 + k_c^2)\phi = 0$$, whose spherically-symmetric solution that decays at infinity is

$$\phi(r) \propto \frac{e^{-k_c r}}{r}.$$

The Coulomb-like $$1/r$$ fall-off has picked up an exponential envelope, and $$1/k_c$$ — the **Compton wavelength** of the massive quantum — sets the range beyond which the field is negligible. The massless Coulomb law is the $$m \to 0$$ limit: the cutoff sits at $$\omega = 0$$, $$k_c \to 0$$, and the exponential factor becomes $$1$$. Any finite mass raises the cutoff above zero, and the field around a stationary source gets an exponential envelope with range $$1/k_c$$.

This is the deepest sense in which a mass is a cutoff. The rest energy $$mc^2$$ is the minimum energy a quantum of the field can carry; any interaction that would require exchanging a lower-energy quantum is forbidden, and the field adjusts around a source with an evanescent tail whose decay length is the reciprocal cutoff wavenumber. Massless mediators — photons, gravitons — produce forces of unbounded range because their cutoff sits at zero.

Three settings, three completely different mechanisms, one algebraic shape. What is common?

## # 5. Why the same hyperbola {#sec-5}

Rewrite equation \eqref{eq:cutoff-dispersion} in the suggestive form

$$
\left(\frac{\omega}{v}\right)^2 = k^2 + k_c^2,
\qquad
k_c \equiv \frac{\omega_c}{v}.
\tag{3}\label{eq:quadratic-budget}
$$

The left-hand side is fixed by the driving frequency and the medium's characteristic speed. The right-hand side is a sum of two squared wavenumbers. The equation says the medium's response allocates the total wavenumber $$\omega/v$$ between $$k$$ — the direction we care about, in which the wave will propagate — and $$k_c$$, a fixed mechanism-dependent contribution that the wave cannot avoid.

That is the unification. In [# 2](#sec-2) the wall condition fixed $$k_\perp = \pi/a$$, and equation \eqref{eq:quadratic-budget} was $$\lvert \vec k\rvert^2 = k_z^2 + k_\perp^2$$ read for a plane wave whose transverse wavenumber is set by the boundary — the total budget $$\omega/c$$ splits between the direction we drive along and the direction the walls have already claimed. In [# 3](#sec-3) the plasma had no walls, but the same split appeared with $$k_c = \omega_p/c$$: the wavenumber of the collective sloshing the electron sea performs at its own natural frequency $$\omega_p$$, which a driving wave has to include before whatever is left can propagate. In [# 4](#sec-4) the "wall" was even less material: $$k_c = mc/\hbar$$ came from the rest energy $$mc^2$$, an oscillation the massive field performs internally at $$mc^2/\hbar$$ that any state of motion has to include on top of the propagating piece.

The common structure is a quadratic budget with one term already committed. Whatever is left over goes into $$k$$, and if the budget runs out — if $$\omega/v < k_c$$ — then $$k$$ has to turn imaginary to balance the accounts. Equation \eqref{eq:quadratic-budget} is a Pythagorean identity being read backwards: given the hypotenuse and one leg, solve for the other.

Solving for $$\omega$$ gives the dispersion curve in its most compact form,

$$\omega(k) = v\sqrt{k^2 + k_c^2},$$

which is a hyperbola with asymptote $$\omega = v\lvert k\rvert$$ at large $$\lvert k\rvert$$ and floor $$\omega = \omega_c$$ at $$k = 0$$. The next two sections work out what the curve says above and below $$\omega_c$$ in turn.

## # 6. Above cutoff: phase, group, and their product {#sec-6}

For a plane-wave carrier $$e^{i(kz - \omega t)}$$, the **phase velocity**

$$v_p = \frac{\omega}{k}$$

is the speed at which a point of constant phase — a specific crest — slides along the propagation axis. It is not the speed of anything with a beginning or end. An infinite sinusoid has no beginning or end, and one cannot use it to send a signal. Signaling requires modulating the amplitude — turning the wave on at some time, or spatially localizing it into a packet — and the modulation propagates at the **group velocity**

$$v_g = \frac{d\omega}{dk},$$

obtained by differentiating the dispersion relation.

For the dispersion in equation \eqref{eq:quadratic-budget}, differentiating $$\omega^2 = v^2(k^2 + k_c^2)$$ implicitly gives $$2\omega\, d\omega = 2 v^2 k\, dk$$, so

$$v_g = \frac{v^2 k}{\omega}.$$

Multiplying phase and group velocities,

$$
v_p v_g = \frac{\omega}{k}\cdot\frac{v^2 k}{\omega} = v^2.
\tag{4}\label{eq:phase-group-product}
$$

This identity is specific to the cutoff dispersion, not a general fact about waves. It comes from equation \eqref{eq:quadratic-budget} being quadratic in both $$\omega$$ and $$k$$: $$v_p = \omega/k$$ and $$v_g = v^2 k/\omega$$ are then reciprocal partners, and multiplying them cancels the $$\omega/k$$ dependence, leaving $$v^2$$ no matter where on the curve we sit. Break the "quadratic in both" structure and the identity goes with it — surface gravity waves, waves on a stiff string, or a Klein–Gordon equation with an added anharmonic term all give phase and group velocities whose product depends on $$k$$.

The inequalities that accompany the product come from the same equation read geometrically. Rewriting equation \eqref{eq:cutoff-dispersion} as $$k^2 = (\omega/v)^2 - k_c^2$$ shows that $$k < \omega/v$$ above cutoff, with equality only in the $$k \to \infty$$ limit where the cutoff contribution becomes negligible. So $$v_p = \omega/k > v$$, and by the fixed product $$v_g = v^2/v_p < v$$: the phase velocity always exceeds the medium's characteristic speed and the group velocity always falls short of it. The two velocities squeeze in from opposite sides of $$v$$ and their geometric mean is exactly $$v$$.

The [bouncing-plane-waves picture](#fold-bouncing-plane-waves) from # 2 makes this concrete geometrically. If the mode in the pipe is a plane wave making angle $$\theta$$ with the axis, then

$$v_g = c\cos\theta$$

is the component of the light-speed motion projected onto the axis, and

$$v_p = \frac{c}{\cos\theta}$$

is the rate at which the intersection of a transverse phase front with the axis sweeps forward. The intersection point can outrun the wave itself along the axis because the wave is not moving along the axis — it is moving at angle $$\theta$$ from it, and the intersection is a purely kinematic construction. The product is $$c^2$$ by trigonometry. The same decomposition operates less visibly in the plasma and massive-particle cases.

<div class="guided-fold-start" data-label="Why a phase velocity above the medium speed carries no signal" data-tone="derivation"></div>

That $$v_p > v$$ can be alarming in the relativistic case, because $$v$$ there is $$c$$ and it can look as if a signal is outrunning light. It is not. The phase velocity is a bookkeeping property of an infinite carrier, not a channel for information; information is in the envelope, and the envelope moves at $$v_g \le c$$. The check is the **Poynting vector** — the local energy flux $$\vec S = \vec E \times \vec H$$ — whose time-average, for a modulated wave, points along the axis with magnitude equal to the local energy density times $$v_g$$. Where the energy is, and how fast it moves, are questions answered by $$v_g$$; $$v_p$$ answers nothing physical about localized wave content.

<div class="guided-fold-end"></div>

There is one more piece of information encoded in the shape near cutoff. Just above $$\omega_c$$, the hyperbola looks like a parabola. To see this, factor $$\omega_c = v k_c$$ out of equation \eqref{eq:quadratic-budget},

$$\omega(k) = v\sqrt{k^2 + k_c^2} = \omega_c\sqrt{1 + \left(\frac{k}{k_c}\right)^2},$$

and Taylor-expand the square root for $$k \ll k_c$$ using $$\sqrt{1+\epsilon} \approx 1 + \tfrac{1}{2}\epsilon$$,

$$\omega(k) \approx \omega_c + \frac{v^2 k^2}{2\omega_c}.$$

The shape is "constant plus quadratic in $$k$$" — exactly the shape of a low-momentum expansion of equation \eqref{eq:energy-momentum}. Setting $$E = \hbar\omega$$ and $$p = \hbar k$$ and expanding equation \eqref{eq:energy-momentum} for $$p \ll mc$$ gives $$E(p) \approx mc^2 + p^2/(2m)$$: rest energy plus non-relativistic kinetic energy. There is no contradiction between "relativistic" and "non-relativistic" here — the second is the small-momentum limit of the first, and it is precisely near cutoff (where $$k$$ is small compared to $$k_c$$) that the two expressions coincide. Matching the coefficients of the quadratic terms identifies an **effective mass**

$$
m_\text{eff} = \frac{\hbar\omega_c}{v^2}.
\tag{5}\label{eq:effective-mass}
$$

In the mass-cutoff setting of [# 4](#sec-4) this is not an analogy: $$m_\text{eff}$$ coincides with the particle's rest mass $$m$$, and a wave packet near cutoff simply *is* that particle in its non-relativistic limit. In the waveguide and plasma settings the medium admits no rest-mass particle, but a wave packet whose central wavenumber sits just above the cutoff obeys the same free-particle Schrödinger equation as a non-relativistic quantum particle would: the same spreading rate, the same momentum-space uncertainty, the same evolution. Here $$m_\text{eff}$$ is an emergent mass — not the mass of anything real, but the mass a fictitious quantum particle would need to have for its wave function to obey the same equation the medium's field does near cutoff.

This has practical consequences worth separating:

- **Right at cutoff**, the group velocity is zero but the effective mass is finite. The medium is maximally dispersive: neighboring frequency components travel at wildly different speeds, so any packet spreads uncontrollably. Waveguides are always operated with a comfortable margin above cutoff for this reason.
- **In periodic media**, the same construction is exploited deliberately. A wave near the edge of a photonic band can be tuned to behave like a slow massive particle — the setting of [a companion piece on coupled modes and band structure](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/).
- **More generally**, the effective mass in equation \eqref{eq:effective-mass} reads off directly from the hyperbola $$\omega^2 = v^2(k^2 + k_c^2)$$, so it appears in every setting the hyperbola does.

## # 7. Below cutoff: what the evanescent field is actually doing {#sec-7}

Below cutoff, equation \eqref{eq:cutoff-dispersion} gives $$k^2 < 0$$, and we write $$k = i\alpha$$ with

$$\alpha = \frac{\sqrt{\omega_c^2 - \omega^2}}{v}.$$

The wave becomes $$e^{-\alpha z}$$, decaying into the medium with characteristic length $$1/\alpha$$. This is common to all three settings. What differs is what the medium is doing that produces the decay.

- In the **waveguide**, the wave cannot arrange a forward-moving axial component, so it sets up a transverse standing wave near the input face and no energy flows down the pipe. A source driving the pipe below cutoff sees a purely reactive load: fields are present, storing electric and magnetic energy in the near region, but no net power crosses any transverse plane past the input in steady state. All the power the source pushes in during a build-up returns to it as the reactive field settles.
- In the **plasma**, the wave penetrates a skin depth before being canceled by the electron polarization response. The electrons rearrange themselves to produce a field exactly opposite to the incoming one, and the total field inside the medium falls exponentially. Because the model has no dissipation — the electrons carry inertia but no friction — none of the incoming power is absorbed, and all of it is reflected. That is why a good metal below its plasma frequency is nearly a perfect mirror.
- In the **relativistic** case, the evanescent solution is the field surrounding a stationary source of the field — a charge held fixed, or a nucleon sourcing the pion field. Nothing is bouncing off anything: the source is not sending a wave into the medium, it is simply present, and the field around it settles into the Yukawa-like envelope of [# 4](#sec-4), with range $$1/k_c = \hbar/mc$$.

The common feature is that below cutoff the medium does not admit any mode that carries energy forward at the specified frequency. What differs is what the energy does instead: it either returns to the driving source (reflection, when the field is driven from outside) or organizes itself around a stationary embedded source into the Yukawa-like envelope $$e^{-k_c r}/r$$ derived in [# 4](#sec-4). In neither case is any energy lost; no traveling-wave solution exists at that frequency, and the field takes the only shape it can — an exponentially decaying envelope whose decay length is fixed by how far below cutoff we are.

## # 8. The full picture {#sec-8}

The hyperbola $$\omega^2 = v^2(k^2 + k_c^2)$$ organizes a large class of otherwise-disparate phenomena. Once its shape is recognized, everything else reads off the same figure: propagation above cutoff, an exponentially decaying tail below it, a group velocity that vanishes at the edge, a phase velocity that exceeds $$v$$ throughout, a product $$v_p v_g = v^2$$, and — the piece that is easiest to overlook — an effective mass just above cutoff that turns any near-threshold wave into a slow massive particle for as long as it stays near the edge. Whether the mechanism is geometric confinement, collective electronic response, or a genuine relativistic rest mass, the same reading applies to all three, and the physical differences show up only in what specifically the medium is doing during the evanescent phase below cutoff.

Two directions of continuation are worth flagging. One is the case in which a gap opens both above and below a reference frequency rather than only on one side — the setting of periodic media, in which the same hyperbola describes each of the two band edges — worked out in [a companion piece on coupled modes and band structure](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/), where the effective mass of equation \eqref{eq:effective-mass} reappears as the mass of slow light near a photonic band edge. The other is the derivation of the identifications $$E = \hbar\omega$$ and $$p = \hbar k$$ used in [# 4](#sec-4), developed separately in [a piece on the wave description of matter](/posts/justification-of-the-de-broglie-relation/#why-the-wave-packet-velocity-leads-to-p--hbar-k). Both are reached from what has been derived here, and both extend it — to periodic structure on one hand, and to the general question of when a wave admits a particle interpretation on the other.
