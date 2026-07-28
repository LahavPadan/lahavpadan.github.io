# Polarization

An electromagnetic wave has an electric field, and that field has a direction. The direction can be constant, rotating, or something in between. The three cases go by the names **linear**, **circular**, and **elliptical** polarization. Which one occurs affects how power couples from the wave into a receiver, whether the wave carries angular momentum in addition to linear momentum, and how the instantaneous energy flux behaves within a single wave cycle. All three cases, and everything that distinguishes them, follow from one algebraic fact about the way the electric field is allowed to fluctuate in a plane wave. What follows sets up that fact from scratch, reads the three cases off it, works out their consequences, and ends with the geometrical picture that puts every possible polarization state onto a single sphere.

## § 1. Why the E-field lives in a plane

Take a plane wave propagating along $\hat z$ in vacuum, so all fields depend on $z$ and $t$ only through the plane-wave factor $e^{i(kz-\omega t)}$. Two of the source-free Maxwell equations are

$$\nabla \cdot \vec E = 0, \tag{1.1}$$

$$\nabla \times \vec E = -\partial_t \vec B. \tag{1.2}$$

For $\vec E = \vec E_0\, e^{i(kz - \omega t)}$, (1.1) reads $ik(\hat z \cdot \vec E_0) = 0$, which forces $\hat z \cdot \vec E_0 = 0$.

The electric field has no component along the direction of propagation; it lives entirely in the plane the wave traverses, spanned by $\hat x$ and $\hat y$.

The same argument applied on $\nabla \cdot \vec B = 0$ gives $\hat z \cdot \vec B_0 = 0$, and (1.2) then fixes $\vec B_0$ perpendicular to $\vec E_0$ within that plane.

And so, we can focus on analyzing $\vec E$, and $\vec B$ will follow.

Because the plane the wave traverses is two-dimensional, the most general electric field for a monochromatic plane wave is

$$\vec E(z, t) = \left( E_x\, \hat x + E_y\, \hat y \right) e^{i(kz - \omega t)}, \tag{1.3}$$

parameterized by two amplitudes $E_x$ and $E_y$, each carrying its own magnitude and phase. Two features of $(E_x, E_y)$ are pure choices, in the sense that changing them leaves the shape traced by the tip of $\vec E$ unchanged:

- **Overall scale.** Multiplying both $E_x$ and $E_y$ by a common real factor $\alpha$ scales the whole field by $\alpha$: the intensity $|\vec E|^2$ scales by $\alpha^2$, but the tip traces a curve of the same shape, just $\alpha$ times bigger.
- **Overall phase.** Multiplying both by a common phase factor $e^{i\theta_0}$ replaces $(kz - \omega t)$ with $(kz - \omega t + \theta_0)$, which is a shift in the origin of time by $\theta_0/\omega$: the same curve, traced from a different starting point at $t = 0$.

What survives both is the ratio $E_y/E_x$. *Polarization* is the shape of the curve traced by the tip of $\vec E$ in the plane the wave traverses, and this ratio captures it completely.

Split the ratio into its magnitude and phase: an amplitude ratio $|E_y|/|E_x|$ and a relative phase $\varphi = \arg(E_y) - \arg(E_x)$. These are the two knobs, and different combinations of them produce the three cases.

## § 2. Reading the three cases from the parameterization

Take $E_x, E_y \ge 0$ real and $\varphi$ the relative phase between them, and take the physical field to be the real part of (1.3). At fixed $z$ (say $z = 0$),

$$\vec E(t) = E_x \cos(\omega t)\, \hat x + E_y \cos(\omega t - \varphi)\, \hat y. \tag{2.1}$$

The tip of $\vec E(t)$ traces some curve in the $xy$-plane as $t$ varies. What curve?

- **Linear ($\varphi = 0$ or $\pi$).** Both components are proportional to $\cos(\omega t)$, up to a possible sign (for $\varphi = \pi$). The tip moves along a fixed line through the origin — the line making angle $\arctan(E_y/E_x)$ with the $x$-axis. The electric field oscillates back and forth along a single direction.

- **Circular ($\varphi = \pm\pi/2$ and $E_x = E_y$).** Taking $\varphi = \pi/2$ and $E_x = E_y = E$, the $x$-component is $E\cos(\omega t)$ and the $y$-component is $E\cos(\omega t - \pi/2) = E\sin(\omega t)$. The tip sits at $(E\cos\omega t, E\sin\omega t)$: a circle of radius $E$ traced at angular rate $\omega$, in the sense fixed by the sign of $\varphi$. The electric field rotates.

- **Elliptical (everything else).** For arbitrary $E_x, E_y, \varphi$, the tip traces an ellipse in the $xy$-plane, with the linear and circular cases as limits. The ellipse's axes are in general not aligned with $\hat x$ and $\hat y$; the rotation angle $\psi$ from $\hat x$ to the ellipse's major axis is a joint function of both parameters, specifically
    $$\tan(2\psi) = \frac{2 E_x E_y \cos\varphi}{E_x^2 - E_y^2}. \tag{2.2}$$
    The ratio of the semi-major to semi-minor axis is called the **axial ratio**, and its dependence on $E_x, E_y, \varphi$ becomes geometrically transparent when the same states are re-parameterized on the Poincaré sphere in § 7.

## § 3. What a linear receiver measures

A linear antenna or polarizer aligned with unit vector $\hat a$ in the plane the wave traverses responds *as* the projection $\hat a \cdot \vec E(t)$; its output signal is proportional to that projection and the delivered power to its square, averaged over one wave cycle.

- **Linear polarization.** For $\vec E(t) = A\cos(\omega t)\, \hat p$ (with $\hat p$ the polarization direction and $A$ the amplitude), the projection is
    $$\hat a \cdot \vec E(t) = A(\hat a \cdot \hat p)\cos(\omega t) = A\cos\theta\cos(\omega t), \tag{3.1}$$
    where $\theta$ is the angle between the receiver and the polarization. Time-averaging $\cos^2(\omega t)$ to $\tfrac{1}{2}$ gives
    $$P_\text{received} \propto A^2 \cos^2\theta. \tag{3.2}$$
    Misalign by 90° and nothing is picked up. The receiver reads only the component of $\vec E$ along its own orientation, and the received power depends quadratically on that alignment.

- **Circular polarization.** For $\vec E(t) = A[\cos(\omega t)\, \hat x + \sin(\omega t)\, \hat y]$, projecting onto $\hat a = \cos\alpha\, \hat x + \sin\alpha\, \hat y$ gives
    $$\hat a \cdot \vec E(t) = A[\cos\alpha\cos(\omega t) + \sin\alpha\sin(\omega t)] = A\cos(\omega t - \alpha). \tag{3.3}$$
    The projection is a sinusoid of amplitude $A$ regardless of the receiver's orientation $\alpha$; only the phase depends on $\alpha$. The time-averaged received power is $A^2/2$, independent of $\alpha$: any linear receiver at any orientation in the plane the wave traverses picks up the same average power.

This is the **rotational immunity** of circular polarization, and it has a clean physical reading. The wave's E-vector spends equal time pointing in every direction in the plane the wave traverses; a receiver that projects onto any fixed direction gets, on average, the same fraction of the intensity regardless of which direction it points at.

The elliptical case gives partial rotational immunity. Aligning with the ellipse's major axis picks up more power than aligning with the minor axis; the ratio between the two is set by the axial ratio.

> Linear is maximally rotation-sensitive, circular is fully isotropic, elliptical interpolates.

This is why polarization-agnostic radio links — satellite-to-ground communication, for example — use circular polarization: rotation of the receiver antenna leaves the coupling unchanged.

## § 4. What the wave is doing to its energy flux

The instantaneous energy flux of an electromagnetic wave is the Poynting vector

$$\vec S = \vec E \times \vec H, \tag{4.1}$$

with $\vec H = \vec B/\mu_0$ in vacuum. Its magnitude reads $|\vec E|^2$ up to constants, since a plane wave in vacuum has $|\vec B| = |\vec E|/c$; specifically, $|\vec S| = \varepsilon_0 c\, |\vec E(t)|^2$.

- **Linear polarization.** $|\vec E(t)|^2 = A^2 \cos^2(\omega t) = \tfrac{1}{2}A^2[1 + \cos(2\omega t)]$. The instantaneous flux oscillates at twice the wave frequency, between $\varepsilon_0 c A^2$ and zero. Only the time-average of the flux is constant.

- **Circular polarization.** $|\vec E(t)|^2 = A^2\cos^2(\omega t) + A^2\sin^2(\omega t) = A^2$, a constant. The instantaneous energy flux does not oscillate at all: at every moment the wave delivers the same amount of energy per unit area per unit time.

The reason $|\vec E(t)|^2$ is constant for circular polarization is that the two orthogonal linear components carry the wave's energy in quadrature — when one is at its maximum the other is at zero, and vice versa. The Pythagorean identity $\cos^2 + \sin^2 = 1$ is the algebraic form of that statement.

The elliptical case sits between these two: $|\vec E(t)|^2 = E_x^2\cos^2(\omega t) + E_y^2\cos^2(\omega t - \varphi)$, which oscillates at $2\omega$ with a smaller amplitude than the linear case would give for the same average intensity; the depth of that $2\omega$ oscillation shrinks toward zero as the polarization approaches circular. The axial ratio controls the depth of the $2\omega$ modulation just as it controls the rotation-sensitivity of § 3.

Constant energy flux is one physical marker of circular polarization; the other, and the sharper one, is that the wave carries angular momentum. That is what the rotating E-vector really means, quantitatively.

## § 5. Angular momentum

§ 4 traced the energy the wave carries. It also carries linear momentum, and — for circular polarization — angular momentum, because the electric field drives the charges in any absorber it hits: linearly polarized light shakes them back and forth (pure translation, transferring linear momentum only), while circularly polarized light drags them around a circle (real rotation, transferring both linear and angular momentum). What matters physically is the *rate* of transfer, since by Newton's second law that rate is the force (linear) or torque (angular) on the absorber.

{% include visualization.html src="polarization-energy-momentum-transfer.html" title="From polarized-field energy to force and torque on an absorber" %}

The rate at which any quantity crosses a fixed surface follows a three-step construction:

- The wave carries the quantity at some **density** — energy, momentum, or angular momentum, per unit volume.
- Because the wave moves along $\hat z$ at speed $c$, in time $\Delta t$ everything in a **volume** $A\,c\,\Delta t$ crosses a fixed surface of area $A$ set perpendicular to $\hat z$.
- The **rate** at which the quantity crosses that surface — density $\times c \times A$ — is what an absorber picks up per unit time.

Apply this first to linear momentum, then to angular momentum.

### Linear momentum

Take a length of the beam of cross-sectional area $A$. In time $\Delta t$, the energy that crosses a fixed cross-section is

$$U = P\,\Delta t, \tag{5.1}$$

where $P = |\vec S|\,A$, since $|\vec S|$ is the energy flux (power per unit area, by the definition (4.1) of $\vec S$) and $A$ the beam's cross-section. This energy travels at speed $c$, so at any instant it occupies a volume $A c \Delta t$, and the energy per unit volume is

$$\frac{U}{A c \Delta t} = \frac{|\vec S|}{c}. \tag{5.2}$$

Why should the momentum per unit volume be $1/c$ times this? Consider a charge $q$ in an absorber illuminated by the wave. Inside an absorber the driven charge's velocity tracks the E-field ($\vec v \propto \vec E$), and the B-field then exerts a Lorentz force $q\vec v \times \vec B$. Because $\vec E$ and $\vec B$ are perpendicular within the plane the wave traverses, $\vec v \times \vec B$ points along $\hat z$ — along the wave's motion. The rate at which the wave does work on the charge is $q\vec E \cdot \vec v$; the rate of longitudinal momentum delivered is $|q\vec v \times \vec B| = q|\vec v|\,|\vec B|$. Their ratio,

$$\frac{q|\vec v|\,|\vec B|}{q\vec E \cdot \vec v} = \frac{|\vec B|}{|\vec E|} = \frac{1}{c},$$

uses $|\vec B| = |\vec E|/c$ for a plane wave. So the absorber picks up longitudinal momentum at $1/c$ times the rate it picks up energy, and by conservation the wave itself must carry the two in the same ratio. Momentum per unit volume is energy per unit volume divided by $c$:

$$\frac{|\vec S|}{c^2}, \tag{5.3}$$

directed along the wave's motion (from § 1, both $\vec E$ and $\vec B$ lie in the plane the wave traverses, so $\vec S \propto \vec E \times \vec B$ is perpendicular to both — along $\hat z$).

Applying the three-step construction from the section opening with this density, the rate at which momentum crosses a fixed cross-section of area $A$ is

$$\frac{|\vec S|}{c^2} \cdot c \cdot A \;=\; \frac{|\vec S|\, A}{c} \;=\; \frac{P}{c}. \tag{5.4}$$

That rate is what an absorbing target picks up per unit time. By Newton's second law ($\vec F = d\vec p/dt$), it *is* the force on the target:

$$\vec F = \frac{P}{c}\,\hat z. \tag{5.5}$$

Force per unit incident power is $1/c$, independent of polarization; the corresponding pressure on an absorber of cross-section $A$ is $F/A = |\vec S|/c$.

### Angular momentum

For angular momentum about the propagation axis, take $\vec r$ to be the position vector from that axis to a field point (so $\vec r$ lies in the plane the wave traverses). The angular momentum density is $\vec r \times \vec g$, where $\vec g$ denotes the momentum density (5.3) taken as a vector. Its component along $\hat z$ is

$$\hat z \cdot (\vec r \times \vec g) = \hat z \cdot (\vec r \times \vec g_\perp),$$

where $\vec g_\perp$ is the part of $\vec g$ lying in the plane the wave traverses: the longitudinal part $g_z \hat z$ gives $\vec r \times g_z \hat z$, which is itself transverse (since $\vec r$ is transverse) and so contributes nothing along $\hat z$. Only the transverse part of the momentum density carries angular momentum about $\hat z$.

For a linearly polarized wave, (5.3) puts the momentum density entirely along $\hat z$; the transverse part is zero, and no angular momentum about $\hat z$ is available to transfer — as expected, since the E-vector oscillates back and forth on one line and never rotates.

For a circularly polarized wave the E-vector does rotate, and the wave does carry angular momentum about $\hat z$. Getting it from the classical field is fiddly: the transverse part of $\vec g$ responsible for the effect vanishes for an ideal infinite plane wave (where $\vec E$ and $\vec B$ are uniform across the plane the wave traverses) and only appears once a beam of finite lateral extent is set up, produced by the spatial gradient of the field profile across the beam's cross-section. Direct summation of those contributions works but is tedious; the photon description gives the same answer in one line, so take that route.

A monochromatic wave of frequency $\omega$ consists of quanta (photons), each carrying energy $\hbar\omega$, with $\hbar$ Planck's reduced constant. A circularly polarized photon additionally carries angular momentum $\pm\hbar$ along its direction of motion, with the sign fixed by the sense of rotation. Write $\sigma = \pm 1$ for that sign — the **helicity**. That a photon has this per-quantum angular momentum is an input from quantum mechanics.

The beam's total energy $U$ corresponds to $U/(\hbar\omega)$ photons, so the total angular momentum about $\hat z$ carried by a length of beam holding energy $U$ is

$$L_z = \frac{U}{\hbar\omega} \cdot \sigma\hbar = \sigma\,\frac{U}{\omega}. \tag{5.6}$$

Notice that $\hbar$ cancels from the ratio: $L_z/U = \sigma/\omega$ depends on the helicity and the wave's frequency but not on Planck's constant. A purely classical calculation reproduces (5.6), and it has to — a classical result cannot depend on $\hbar$. The photon route just makes the origin transparent.

(5.6) is a total content — angular momentum stored in a length of beam holding energy $U$. To connect it to what an absorber experiences, convert content to rate. That length of beam passes a fixed cross-section in time $\Delta t = U/P$ (energy $U$ crosses at rate $P$), so the rate at which angular momentum crosses the surface is

$$\dot L_z = \frac{L_z}{\Delta t} = \sigma\,\frac{P}{\omega},$$

the direct parallel of (5.4). By Newton's second law for angular momentum ($\vec\tau = d\vec L/dt$), an absorber that stops the beam picks up angular momentum at this rate, so it experiences a torque

$$\vec\tau = \sigma\,\frac{P}{\omega}\,\hat z, \tag{5.7}$$

whose sign flips with the sense of rotation. For the same $P$ the force (5.5) is unchanged; the torque is present only in the circular case, and points along or against $\hat z$ according to the helicity.

Elliptical polarization decomposes into unequal amounts of the two helicities; its angular momentum interpolates smoothly between zero (linear, equal counter-rotating components that cancel) and $\pm U/\omega$ (circular, one helicity only), tracking the axial ratio.

Given how much the polarization state matters, how are these states produced and manipulated? Two elements suffice, both built from simple materials.

## § 6. Producing and manipulating polarization

Two basic operations act on the pair $(E_x, E_y)$ from § 1:

- **Polarizer.** Turns unpolarized or arbitrary light into a specific linear polarization.
- **Wave plate.** Rearranges the relative phase and amplitude between the two linear components.

A polarizer selects one linear component and absorbs or deflects the other. The simplest version is a wire grid: a fine grating of parallel conducting wires transmits fields perpendicular to the wires (which cannot drive currents along them) and blocks fields parallel to the wires (which do). A polarizer aligned with $\hat x$ takes any input state $(E_x, E_y)$ to $(E_x, 0)$: the $\hat y$-component is gone. The transmitted intensity is the input's $|E_x|^2$, which for a linearly polarized input at angle $\theta$ to the polarizer is $|E_0|^2 \cos^2\theta$ — the same $\cos^2\theta$ that appeared in (3.2), for the same reason.

A wave plate does not select components; it delays one relative to the other. The material used is one whose refractive index depends on the direction of the E-polarization within it — a property called **birefringence**. If the two orthogonal directions in the material have indices $n_1 < n_2$, then a wave propagating through thickness $d$ picks up phase $n_1 \omega d/c$ in one component and $n_2 \omega d/c$ in the other, so the relative phase between them shifts by

$$\Delta\varphi = \frac{\omega d}{c}(n_2 - n_1). \tag{6.1}$$

Choosing $d$ so that $\Delta\varphi = \pi/2$ produces a **quarter-wave plate**. Its effect depends on how the input is oriented relative to the two material directions:

- **Input at 45° to the two directions.** Equal amplitudes go into the two components; the plate shifts them 90° out of phase; the output has equal amplitudes in two perpendicular directions with a 90° phase difference — the recipe for circular polarization from § 2.
- **Input at any other angle.** The amplitude split between the two directions is unequal, so the output is elliptical, with axial ratio set by the input angle.

Where the two refractive indices come from — some materials' electronic response is not isotropic — is worked out in the companion piece on dielectric response. Here it suffices that they exist.

Lasers tend to be linearly polarized for a related reason. If any element inside the resonator has slightly different loss for the two linear polarizations, the favored one builds up over many round trips and the disfavored one decays; the steady-state output is linearly polarized along the low-loss direction. Circular output is almost always produced externally with a quarter-wave plate.

Together, the polarizer and wave plate generate every polarization transformation available on a monochromatic wave. Seeing why requires a geometrical picture of the state space.

## § 7. The Poincaré sphere

The polarization state has 4 real parameters — the two complex amplitudes $E_x, E_y$ — minus 1 for the overall intensity and minus 1 for the unphysical global phase (both taken out at the end of § 1), leaving 2 real parameters. To coordinatize this 2-dimensional space, use quantities that a physical measurement can directly extract. Three natural ones are:

- **$s_1$** — the imbalance between $\hat x$ and $\hat y$ linear polarizations. Measured by comparing the intensity transmitted through a polarizer aligned with $\hat x$ vs one aligned with $\hat y$:
    $$s_1 = \frac{I_x - I_y}{I_x + I_y} = \frac{|E_x|^2 - |E_y|^2}{|E_x|^2 + |E_y|^2}. \tag{7.1}$$
- **$s_2$** — the same measurement rotated 45°. A polarizer aligned at $+45°$ transmits intensity $|E_x + E_y|^2/2$; one at $-45°$ transmits $|E_x - E_y|^2/2$. Taking the imbalance,
    $$s_2 = \frac{2\,\mathrm{Re}(E_x^* E_y)}{|E_x|^2 + |E_y|^2}. \tag{7.2}$$
- **$s_3$** — the imbalance between right- and left-circular components. Extracted by inserting a quarter-wave plate before a linear polarizer:
    $$s_3 = \frac{2\,\mathrm{Im}(E_x^* E_y)}{|E_x|^2 + |E_y|^2}. \tag{7.3}$$

An algebraic check (using $|E_x^* E_y|^2 = |E_x|^2 |E_y|^2$) gives

$$s_1^2 + s_2^2 + s_3^2 = 1 \tag{7.4}$$

for any $(E_x, E_y)$. The polarization state is therefore a point on the unit sphere. That sphere is the **Poincaré sphere**, and every possible polarization state of a monochromatic plane wave is exactly one point on it.

Reading the three coordinates physically:

- $s_1 = +1$ is $\hat x$-polarized (all power in $E_x$); $s_1 = -1$ is $\hat y$-polarized. The equator plane $s_3 = 0$ consists of all linear polarizations, with the angle around the equator setting the polarization direction.
- $s_3 = +1$ is one sense of circular polarization; $s_3 = -1$ is the other. The two poles of the sphere are the two circular polarizations.
- All other points are elliptical polarizations, with the ellipse's orientation encoded in the longitude and the axial ratio encoded in the latitude. Points closer to the equator are nearly linear (long thin ellipses); points closer to the poles are nearly circular (nearly round ellipses).

Rotating a linear polarization in real space by an angle $\theta$ moves its point around the sphere's equator by $2\theta$ — the factor of two arising because a physical rotation by $\pi$ takes any linear polarization to itself, so the sphere must double-cover the group of physical rotations. A quarter-wave plate rotates the sphere by 90° about an axis lying in the equatorial plane, the axis being determined by the orientation of the plate. Under this rotation, points on the equator aligned with the plate's axes go to the poles (circular polarizations), and equatorial points at 45° to the plate's axes stay on the equator but rotate to the perpendicular linear direction.

Every optical element that manipulates polarization corresponds to a specific operation on the sphere:

> A polarizer acts as a projection onto a diameter.

> A wave plate acts as a rotation about an axis, and composing multiple wave plates composes the rotations.

The triple $(s_1, s_2, s_3)$ is the polarization content of the wave. Together with the total intensity, these four real numbers fully specify the state — the **Stokes parameters** — and every polarization measurement ultimately reports some combination of them.

One extension is worth stating. A source that is not monochromatic, or whose polarization fluctuates fast compared to a measurement's time window — sunlight, a thermal filament, a fluorescent tube — is not described by any single point on the sphere. It is described by an average over many polarization states, and the resulting time-averaged Stokes parameters no longer sit on the sphere's surface but at some interior point, with $s_1^2 + s_2^2 + s_3^2 < 1$. The center of the sphere is completely unpolarized light: an equal average over every state, with no preferred direction, sense of rotation, or axial ratio. The distance from the center to the surface, $\sqrt{s_1^2 + s_2^2 + s_3^2}$, is the **degree of polarization**, and it distinguishes fully polarized (surface), partially polarized (interior), and unpolarized (center) light along one continuous scale.

## § 8. Loose ends

Two aspects of the picture just built are worth calling out before closing.

The first is that polarization is independent of the wave's temporal envelope. A pulsed wave still has a polarization state; the electric field inside each cycle of the carrier still lives in the plane the wave traverses and still rotates or oscillates according to the same rules. The envelope modulates the amplitude on a slow time scale; the polarization operates on the carrier on a fast one. Whether a beam is continuous or pulsed and what its polarization is are fixed by independent physics — the envelope by gain dynamics and loss modulation, the polarization by the resonator's polarization-selective elements. A circularly polarized pulse has zero energy flux between pulses and constant flux within each pulse, and neither statement contradicts the other; they describe behavior on different time scales.

The second is that polarization behaves differently in bounded and periodic systems than in free space, and this connects the plane-wave picture developed here to structured environments where polarization is entangled with propagation. A hollow waveguide's transverse modes split into two classes according to which field component is purely transverse, and the two classes have different dispersion relations even when the guide is entirely symmetric; the split is a polarization split, and the two classes propagate independently. A periodic dielectric structure — the setting of Bragg reflectors and photonic crystals — has bandgaps whose edges depend on polarization, so light of one polarization can be reflected where light of the other is transmitted. A dielectric interface has different reflection coefficients for the two linear polarizations, and the angle at which one of them vanishes entirely is the Brewster angle. Each of these effects belongs to the analysis of a specific structure, and the details are worked out in companion pieces on waveguide modes and on coupled-mode theory in periodic media. The point here is only that once a wave is put into any structured environment, its polarization state and its propagation dynamics no longer decouple, and every aspect of the free-space classification developed here becomes a starting point for a more entangled analysis.

What has been derived is the polarization content of a free monochromatic plane wave: a two-parameter family of states organized as the surface of the Poincaré sphere, with linear and circular polarizations sitting at its equator and poles, with a definite angular momentum content associated with the circular states, and with a specific projection law describing how any linear receiver reads any state. Every polarization technology — polarizing filters, wave plates, polarization-maintaining fibers, polarimetric imaging, and polarization-multiplexed communication — is built out of operations on this sphere.
