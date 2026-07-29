## Polarization

An electromagnetic wave has an electric field, and that field has a direction. The direction can be constant, rotating, or something in between. The three cases go by the names **linear**, **circular**, and **elliptical** polarization. Which one occurs affects how power couples from the wave into a receiver, whether the wave carries angular momentum in addition to linear momentum, and how the instantaneous energy flux behaves within a single wave cycle. All three cases, and everything that distinguishes them, follow from one algebraic fact about the way the electric field is allowed to fluctuate in a plane wave. What follows sets up that fact from scratch, reads the three cases off it, and works out their consequences.

## § 1. Why the E-field lives in a plane {#sec-1}

Take a plane wave propagating along $\hat z$ in vacuum, so all fields depend on $z$ and $t$ only through the plane-wave factor $e^{i(kz-\omega t)}$. Two of the source-free Maxwell equations are

$$\nabla \cdot \vec E = 0, \label{eq:1-1}\tag{1.1}$$

$$\nabla \times \vec E = -\partial_t \vec B. \label{eq:1-2}\tag{1.2}$$

For $\vec E = \vec E_0\, e^{i(kz - \omega t)}$, $\eqref{eq:1-1}$ reads $ik(\hat z \cdot \vec E_0) = 0$, which forces $\hat z \cdot \vec E_0 = 0$.

The electric field has no component along the direction of propagation; it lives entirely in the plane the wave traverses, spanned by $\hat x$ and $\hat y$.

The same argument applied on $\nabla \cdot \vec B = 0$ gives $\hat z \cdot \vec B_0 = 0$, and $\eqref{eq:1-2}$ then fixes $\vec B_0$ perpendicular to $\vec E_0$ within that plane.

And so, we can focus on analyzing $\vec E$, and $\vec B$ will follow.

Because the plane the wave traverses is two-dimensional, the most general electric field for a monochromatic plane wave is

$$\vec E(z, t) = \left( E_x\, \hat x + E_y\, \hat y \right) e^{i(kz - \omega t)}, \label{eq:1-3}\tag{1.3}$$

parameterized by two amplitudes $E_x$ and $E_y$, each carrying its own magnitude and phase. Two features of $(E_x, E_y)$ are pure choices, in the sense that changing them leaves the shape traced by the tip of $\vec E$ unchanged:

- **Overall scale.** Multiplying both $E_x$ and $E_y$ by a common real factor $\alpha$ scales the whole field by $\alpha$: the intensity $|\vec E|^2$ scales by $\alpha^2$, but the tip traces a curve of the same shape, just $\alpha$ times bigger.
- **Overall phase.** Multiplying both by a common phase factor $e^{i\theta_0}$ replaces $(kz - \omega t)$ with $(kz - \omega t + \theta_0)$, which is a shift in the origin of time by $\theta_0/\omega$: the same curve, traced from a different starting point at $t = 0$.

What survives both is the ratio $E_y/E_x$. *Polarization* is the shape of the curve traced by the tip of $\vec E$ in the plane the wave traverses, and this ratio captures it completely.

Split the ratio into its magnitude and phase: an amplitude ratio $|E_y|/|E_x|$ and a relative phase $\varphi = \arg(E_y) - \arg(E_x)$. These are the two knobs, and different combinations of them produce the three cases.

## § 2. Reading the three cases from the parameterization {#sec-2}

Take $E_x, E_y \ge 0$ real and $\varphi$ the relative phase between them, and take the physical field to be the real part of $\eqref{eq:1-3}$. At fixed $z$ (say $z = 0$),

$$\vec E(t) = E_x \cos(\omega t)\, \hat x + E_y \cos(\omega t - \varphi)\, \hat y. \label{eq:2-1}\tag{2.1}$$

The tip of $\vec E(t)$ traces some curve in the $xy$-plane as $t$ varies. What curve?

- **Linear ($\varphi = 0$ or $\pi$).** Both components are proportional to $\cos(\omega t)$, up to a possible sign (for $\varphi = \pi$). The tip moves along a fixed line through the origin — the line making angle $\arctan(E_y/E_x)$ with the $x$-axis. The electric field oscillates back and forth along a single direction.

- **Circular ($\varphi = \pm\pi/2$ and $E_x = E_y$).** Taking $\varphi = \pi/2$ and $E_x = E_y = E$, the $x$-component is $E\cos(\omega t)$ and the $y$-component is $E\cos(\omega t - \pi/2) = E\sin(\omega t)$. The tip sits at $(E\cos\omega t, E\sin\omega t)$: a circle of radius $E$ traced at angular rate $\omega$, in the sense fixed by the sign of $\varphi$. The electric field rotates.

- **Elliptical (everything else).** For arbitrary $E_x, E_y, \varphi$, the tip traces an ellipse in the $xy$-plane, with the linear and circular cases as limits. The ellipse's axes are in general not aligned with $\hat x$ and $\hat y$; the tilt angle $\theta_e$ from $\hat x$ to the major axis is a joint function of both parameters, specifically
    $$\tan(2\theta_e) = \frac{2 E_x E_y \cos\varphi}{E_x^2 - E_y^2}. \label{eq:2-2}\tag{2.2}$$
    The ratio of the semi-major to semi-minor axis is called the **axial ratio**.

## § 3. What a linear receiver measures {#sec-3}

A linear antenna or polarizer aligned with unit vector $\hat a$ in the plane the wave traverses responds *as* the projection $\hat a \cdot \vec E(t)$; its output signal is proportional to that projection and the delivered power to its square, averaged over one wave cycle.

- **Linear polarization.** For $\vec E(t) = A\cos(\omega t)\, \hat p$ (with $\hat p$ the polarization direction and $A$ the amplitude), the projection is
    $$\hat a \cdot \vec E(t) = A(\hat a \cdot \hat p)\cos(\omega t) = A\cos\theta\cos(\omega t), \label{eq:3-1}\tag{3.1}$$
    where $\theta$ is the angle between the receiver and the polarization. Time-averaging $\cos^2(\omega t)$ to $\tfrac{1}{2}$ gives
    $$P_\text{received} \propto A^2 \cos^2\theta. \label{eq:3-2}\tag{3.2}$$
    Misalign by 90° and nothing is picked up. The receiver reads only the component of $\vec E$ along its own orientation, and the received power depends quadratically on that alignment.

- **Circular polarization.** For $\vec E(t) = A[\cos(\omega t)\, \hat x + \sin(\omega t)\, \hat y]$, projecting onto $\hat a = \cos\alpha\, \hat x + \sin\alpha\, \hat y$ gives
    $$\hat a \cdot \vec E(t) = A[\cos\alpha\cos(\omega t) + \sin\alpha\sin(\omega t)] = A\cos(\omega t - \alpha). \label{eq:3-3}\tag{3.3}$$
    The projection is a sinusoid of amplitude $A$ regardless of the receiver's orientation $\alpha$; only the phase depends on $\alpha$. The time-averaged received power is $A^2/2$, independent of $\alpha$: any linear receiver at any orientation in the plane the wave traverses picks up the same average power.

This is the **rotational immunity** of circular polarization, and it has a clean physical reading. The wave's E-vector spends equal time pointing in every direction in the plane the wave traverses; a receiver that projects onto any fixed direction gets, on average, the same fraction of the intensity regardless of which direction it points at.

The elliptical case gives partial rotational immunity. Aligning with the ellipse's major axis picks up more power than aligning with the minor axis; the ratio between the two is set by the axial ratio.

> Linear is maximally rotation-sensitive, circular is fully isotropic, elliptical interpolates.

This is why polarization-agnostic radio links — satellite-to-ground communication, for example — use circular polarization: rotation of the receiver antenna leaves the coupling unchanged.

## § 4. What the wave is doing to its energy flux {#sec-4}

The instantaneous energy flux of an electromagnetic wave is the Poynting vector

$$\vec S = \vec E \times \vec H, \label{eq:4-1}\tag{4.1}$$

with $\vec H = \vec B/\mu_0$ in vacuum. Its magnitude reads $|\vec E|^2$ up to constants, since a plane wave in vacuum has $|\vec B| = |\vec E|/c$; specifically, $|\vec S| = \varepsilon_0 c\, |\vec E(t)|^2$.

- **Linear polarization.** $|\vec E(t)|^2 = A^2 \cos^2(\omega t) = \tfrac{1}{2}A^2[1 + \cos(2\omega t)]$. The instantaneous flux oscillates at twice the wave frequency, between $\varepsilon_0 c A^2$ and zero. Only the time-average of the flux is constant.

- **Circular polarization.** $|\vec E(t)|^2 = A^2\cos^2(\omega t) + A^2\sin^2(\omega t) = A^2$, a constant. The instantaneous energy flux does not oscillate at all: at every moment the wave delivers the same amount of energy per unit area per unit time.

The reason $|\vec E(t)|^2$ is constant for circular polarization is that the two orthogonal linear components carry the wave's energy in quadrature — when one is at its maximum the other is at zero, and vice versa. The Pythagorean identity $\cos^2 + \sin^2 = 1$ is the algebraic form of that statement.

The elliptical case sits between these two: $|\vec E(t)|^2 = E_x^2\cos^2(\omega t) + E_y^2\cos^2(\omega t - \varphi)$, which oscillates at $2\omega$ with a smaller amplitude than the linear case would give for the same average intensity; the depth of that $2\omega$ oscillation shrinks toward zero as the polarization approaches circular. The axial ratio controls the depth of the $2\omega$ modulation just as it controls the rotation-sensitivity of [§ 3](#sec-3).

Constant energy flux is one physical marker of circular polarization; the other, and the sharper one, is that the wave carries angular momentum. That is what the rotating E-vector really means, quantitatively.

## § 5. Angular momentum {#sec-5}

[§ 4](#sec-4) traced the energy the wave carries. It also carries linear momentum, and — for circular polarization — angular momentum: the electric field drives the charges in any absorber the wave hits. Linearly polarized light shakes them back and forth (pure translation, transferring linear momentum only); circularly polarized light drags them around a circle (real rotation, transferring both linear and angular momentum). What matters physically is the *rate* of transfer.

{% include visualization.html src="polarization-energy-momentum-transfer.html" title="From polarized-field energy to force and torque on an absorber" %}

Getting from either momentum content — linear or angular — to a mechanical effect on an absorber follows three steps that apply identically to both:

- **Density.** The wave carries the quantity at some density per unit volume.
- **Rate.** Because the wave moves along $\hat z$ at speed $c$, in time $\Delta t$ everything in a volume $A\,c\,\Delta t$ crosses a fixed surface of area $A$ set perpendicular to $\hat z$. So the rate at which the quantity crosses that surface is density $\times c \times A$.
- **Newton.** That rate is what an absorber picks up per unit time, and by Newton's second law it is the force ($\vec F = d\vec p/dt$) on the absorber for linear momentum, or the torque ($\vec\tau = d\vec L/dt$) for angular momentum.

### Linear momentum

Take a length of the beam of cross-sectional area $A$. In time $\Delta t$, the energy that crosses a fixed cross-section is

$$U = P\,\Delta t. \label{eq:5-1}\tag{5.1}$$

- This energy travels at speed $c$, so at any instant it occupies a volume $A c \Delta t$.
- $P = |\vec S|\,A$, since $|\vec S|$ is the energy flux (power per unit area, by the definition $\eqref{eq:4-1}$ of $\vec S$) and $A$ the beam's cross-section.

The energy per unit volume is

$$\frac{U}{A c \Delta t} = \frac{|\vec S|}{c}. \label{eq:5-2}\tag{5.2}$$

*Why should the momentum per unit volume be $1/c$ times this?*

- Consider a charge $q$ in an absorber illuminated by the wave.
- The driven charge's velocity tracks the E-field: $\vec v \propto \vec E$.
- The B-field then exerts a Lorentz force $q\vec v \times \vec B$. Since $\vec E$ and $\vec B$ are perpendicular within the plane the wave traverses, $\vec v \times \vec B$ points along $\hat z$ — along the wave's motion.
- Rate of work done on the charge (energy delivered per unit time): $q\vec E \cdot \vec v$.
- Rate of longitudinal momentum delivered: $|q\vec v \times \vec B| = q|\vec v|\,|\vec B|$.

Their ratio,

$$\frac{q|\vec v|\,|\vec B|}{q\vec E \cdot \vec v} = \frac{|\vec B|}{|\vec E|} = \frac{1}{c},$$

uses $|\vec B| = |\vec E|/c$ for a plane wave.

So the absorber picks up longitudinal momentum at $1/c$ times the rate it picks up energy.

By conservation, the wave itself must carry the two in the same ratio.

Momentum per unit volume is energy per unit volume divided by $c$:

$$\frac{|\vec S|}{c^2}, \label{eq:5-3}\tag{5.3}$$

directed along the wave's motion (from [§ 1](#sec-1), both $\vec E$ and $\vec B$ lie in the plane the wave traverses, so $\vec S \propto \vec E \times \vec B$ is perpendicular to both — along $\hat z$).

Feeding this density into the density-rate-Newton chain:

$$\frac{|\vec S|}{c^2} \cdot c \cdot A \;=\; \frac{|\vec S|\, A}{c} \;=\; \frac{P}{c}, \label{eq:5-4}\tag{5.4}$$

so the force on the absorber is

$$\vec F = \frac{P}{c}\,\hat z. \label{eq:5-5}\tag{5.5}$$

Force per unit incident power is $1/c$, independent of polarization.

### Angular momentum

For angular momentum about the propagation axis, take $\vec r$ to be the position vector from that axis to a field point, so $\vec r$ lies in the plane the wave traverses. Write the momentum density as the vector $\vec g$. Its component of angular momentum density along $\hat z$ is

$$\hat z \cdot (\vec r \times \vec g) = \hat z \cdot (\vec r \times \vec g_\perp),$$

where $\vec g_\perp$ is the part of $\vec g$ lying in the plane the wave traverses. The longitudinal part $g_z\hat z$ gives $\vec r \times g_z\hat z$, which is itself transverse, and therefore contributes nothing along $\hat z$. Only transverse momentum density can carry angular momentum about the propagation axis.

For a linearly polarized wave, the momentum density is entirely longitudinal, so $\vec g_\perp=0$ and no angular momentum about $\hat z$ is available to transfer. For a circularly polarized wave the E-vector does rotate, and the wave does carry angular momentum about $\hat z$. Getting it directly from the classical field is fiddly: the transverse part of $\vec g$ responsible for the effect vanishes for an ideal infinite plane wave, where the fields are uniform across the plane the wave traverses, and only appears once a beam of finite lateral extent is set up, produced by the spatial gradient of the field profile across the beam's cross-section.

{% include visualization.html src="polarization-angular-momentum-density.html" title="Transverse momentum and angular momentum density in a finite beam" %}

The photon description of the wave gives the angular momentum density directly:

- A monochromatic wave of frequency $\omega$ consists of quanta (photons), each with energy $\hbar\omega$, where $\hbar$ is Planck's reduced constant.
- A circularly polarized photon carries angular momentum $\pm\hbar$ along its direction of motion, with the sign fixed by the sense of rotation. Write $\sigma = \pm 1$ for that sign — the **helicity**.

That a photon has this per-quantum angular momentum is an input from quantum mechanics.

Photon number per unit volume is (energy density)/$(\hbar\omega) = |\vec S|/(\hbar\omega c)$. Multiply by the per-photon $\sigma\hbar$ to get the angular momentum density about $\hat z$:

$$\frac{|\vec S|}{\hbar\omega c} \cdot \sigma\hbar \;=\; \sigma\,\frac{|\vec S|}{\omega c}. \label{eq:5-6}\tag{5.6}$$

Notice that $\hbar$ cancels: the result depends on the helicity and the wave's frequency but not on Planck's constant. A purely classical calculation reproduces $\eqref{eq:5-6}$, and it has to — a classical result cannot depend on $\hbar$.

For a linearly polarized wave, the two helicities are populated equally: their contributions to $\eqref{eq:5-6}$ cancel, the angular momentum density is zero, and no angular momentum about $\hat z$ is available to transfer. The E-vector oscillates on one line and never rotates.

For a circularly polarized wave, one helicity fills the whole population and $\eqref{eq:5-6}$ gives the full angular momentum density. Feeding it into the density-rate-Newton chain:

$$\sigma\,\frac{|\vec S|}{\omega c} \cdot c \cdot A \;=\; \sigma\,\frac{P}{\omega},$$

so the torque on the absorber is

$$\vec\tau = \sigma\,\frac{P}{\omega}\,\hat z, \label{eq:5-7}\tag{5.7}$$

whose sign flips with the sense of rotation. For the same $P$ the force $\eqref{eq:5-5}$ is unchanged; the torque is present only in the circular case, and points along or against $\hat z$ according to the helicity.

Elliptical polarization mixes the two helicities unequally; its angular momentum density interpolates smoothly between zero (linear, equal populations that cancel) and the circular value $\eqref{eq:5-6}$ (one helicity only), tracking the axial ratio.

## § 6. Envelopes and structured media {#sec-6}

The polarization picture built in §§ [1](#sec-1)–[5](#sec-5) applies to monochromatic plane waves in free space. Two extensions of that setting matter.

**Envelope.** Polarization is independent of the wave's envelope. A pulsed wave still has a polarization state; the envelope modulates the amplitude on a slow time scale, and the polarization operates on the carrier on a fast one. What the envelope is and what the polarization is are fixed by independent physics — the envelope by gain and loss dynamics, the polarization by whichever linear component has the lower round-trip loss in the resonator.

**Structured environments.** Once the wave enters a structure — a waveguide, a periodic dielectric, a plane interface — the two linear polarizations decouple from each other but couple to propagation:

- Hollow waveguides split their modes into two polarization classes with different dispersion relations, even in a symmetric guide. See [coupled modes and Bragg structures](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps).
- Periodic dielectric structures have polarization-dependent bandgaps: light of one polarization can be reflected where light of the other is transmitted. See [Bragg mirrors and lasers](/posts/bragg-mirrors-and-lasers).
- Dielectric interfaces reflect the two linear polarizations differently; one of them vanishes entirely at the Brewster angle.

## § 7. Producing and manipulating polarization {#sec-7}

Two basic operations act on the pair $(E_x, E_y)$ from [§ 1](#sec-1):

- **Polarizer.** Turns unpolarized or arbitrary light into a specific linear polarization.
- **Wave plate.** Rearranges the relative phase and amplitude between the two linear components.

A polarizer selects one linear component and absorbs or deflects the other. The simplest version is a wire grid: a fine grating of parallel conducting wires transmits fields perpendicular to the wires (which cannot drive currents along them) and blocks fields parallel to the wires (which do). A polarizer aligned with $\hat x$ takes any input state $(E_x, E_y)$ to $(E_x, 0)$: the $\hat y$-component is gone. The transmitted intensity is the input's $|E_x|^2$, which for a linearly polarized input at angle $\theta$ to the polarizer is $|E_0|^2 \cos^2\theta$ — the same $\cos^2\theta$ that appeared in $\eqref{eq:3-2}$, for the same reason.

A wave plate does not select components; it delays one relative to the other. The material used is one whose refractive index depends on the direction of the E-polarization within it — a property called **birefringence**. If the two orthogonal directions in the material have indices $n_1 < n_2$, then a wave propagating through thickness $d$ picks up phase $n_1 \omega d/c$ in one component and $n_2 \omega d/c$ in the other, so the relative phase between them shifts by

$$\Delta\varphi = \frac{\omega d}{c}(n_2 - n_1). \label{eq:7-1}\tag{7.1}$$

Choosing $d$ so that $\Delta\varphi = \pi/2$ produces a **quarter-wave plate**. Its effect depends on how the input is oriented relative to the two material directions:

- **Input at 45° to the two directions.** Equal amplitudes go into the two components; the plate shifts them 90° out of phase; the output has equal amplitudes in two perpendicular directions with a 90° phase difference — the recipe for circular polarization from [§ 2](#sec-2).
- **Input at any other angle.** The amplitude split between the two directions is unequal, so the output is elliptical, with axial ratio set by the input angle.

Where the two refractive indices come from — some materials' electronic response is not isotropic — is worked out in the companion piece on dielectric response. Here it suffices that they exist.

Lasers tend to be linearly polarized for a related reason. If any element inside the resonator has slightly different loss for the two linear polarizations, the favored one builds up over many round trips and the disfavored one decays; the steady-state output is linearly polarized along the low-loss direction. Circular output is almost always produced externally with a quarter-wave plate.

Together, the polarizer and wave plate generate every polarization transformation available on a monochromatic wave.
