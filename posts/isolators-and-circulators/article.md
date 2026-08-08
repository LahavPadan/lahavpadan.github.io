# Optical Isolators and Y-Junction Circulators

Two problems in optics call for a component that lets a wave through in one direction and blocks it in the other.

The first is protecting a laser from feedback. A laser sends most of its light forward, but downstream surfaces reflect some of it back — and reflected light re-entering the gain region is amplified along with the wave the laser is trying to build up. The returning wave's phase relative to the internal field depends on the distance to the reflecting surface, which drifts with temperature and mechanical vibration, so the feedback contribution is a moving perturbation of the laser's amplitude and frequency. The [distributed-feedback laser from the previous post](/posts/bragg-mirrors-and-lasers/#sec-4-2) is especially sensitive: the mechanism that keeps it locked to a single wavelength depends on a fine balance between two modes with almost the same net gain, and a milliwatt of reflected light is enough to tip it.

The second is running two-way traffic on a single fiber. Long-haul telecom links save cost by carrying outgoing and incoming signals down the same strand of glass. At each end of the link, the two signals have to be separated onto different fibers: a three-port device where the transmitter feeds port 1, the fiber connects to port 2, and the receiver reads port 3, with signals routed 1 → 2 (transmit into fiber) and 2 → 3 (fiber into receiver) but never 1 → 3 or 2 → 1.

Both need the same thing: a component that behaves differently depending on the direction the wave is traveling. That behavior — **non-reciprocity** — does not come for free. Any passive dielectric material without a magnetic response is automatically reciprocal, and every non-reciprocal device that exists is built out of the one mechanism that breaks that constraint: a static magnetic field applied to a magnetic material. The physics was worked out in [# 3 of the coupled-modes post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3). We lift its main results here:

- Under a static magnetic field $\vec B_0$ along $\hat z$ applied to a magnetic material, the material's response to a transverse field takes the form of a $2 \times 2$ tensor with equal diagonal entries and equal-magnitude, opposite-sign, imaginary off-diagonal entries:

  $$\hat\mu_r = \begin{pmatrix} \mu & -i\kappa_P \\ i\kappa_P & \mu \end{pmatrix}.$$

  The diagonal $\mu$ is the ordinary permeability the material would have without the bias. The off-diagonal entries $\pm i\kappa_P$ are what the bias adds; $\kappa_P$ scales with the strength of $\vec B_0$ and with a material-dependent susceptibility. (At microwave frequencies this tensor is a permeability, and $\kappa_P$ comes from the precession of localized magnetic moments under the bias. At optical frequencies, an analogous tensor appears as a permittivity, and $\kappa_P$ comes from the effect of the bias on the frequencies of bound-electron oscillations; see [# 3.7 of the previous post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3-7). The device physics only uses the tensor's shape, and takes the same form in both cases.)

- The tensor is diagonal in the basis of circular polarizations. Its two eigenvectors, corresponding to left- and right-handed circular polarizations of the transverse field, see different effective permeabilities $\mu \pm \kappa_P$ — and therefore different refractive indices $n_\pm = \sqrt{\varepsilon(\mu \pm \kappa_P)}$. The two circular polarizations propagate at different phase velocities through the biased material.

- A linear polarization is an equal superposition of a left-handed and a right-handed circular polarization, and the two carry the wave's polarization axis between them. If they travel at different phase velocities, after a distance $z$ they have accumulated different phases; recombining them gives back a linear polarization, but *rotated* relative to the input by

  $$\theta_F(z) = \frac{\omega}{2c}\, (n_+ - n_-)\, z.$$

  This is **Faraday rotation**.

- The direction the polarization rotates in is set by the direction of $\vec B_0$ in the lab frame, not by which way the wave is traveling. A wave that traverses the medium, reflects off a mirror, and comes back sees the same lab-frame bias on both legs and picks up rotation in the same lab-frame direction on both. The two rotations **add** rather than cancelling.

That last property is what breaks reciprocity, and it is what the rest of this post uses.

- [# 1](#sec-1) puts a Faraday medium between two polarizers, exploits the round-trip addition, and builds a two-port **optical isolator**.
- [# 2](#sec-2) puts the Faraday medium inside a disk with three ports and standing-wave modes, and builds a three-port **Y-junction circulator**.
- [# 3](#sec-3) covers the materials — ferrites at microwave frequencies, transparent garnets at optical frequencies — that actually present the tensor above to the wave.

---

## # 1. The optical isolator {#sec-1}

The isolator is three components arranged one after the other along the beam:

1. A **linear polarizer** at angle $0°$ (the input polarizer), transmitting horizontal polarization and rejecting the vertical component.
2. A **Faraday rotator** — a chip of magnetically biased material, with thickness $L$ and bias field chosen so that a wave crossing it in either direction has its polarization rotated by exactly $\theta_F = +45°$.
3. A second linear polarizer, the output polarizer, at angle $+45°$.

The angles are set by the transmission law for a polarizer: a polarizer with its transmission axis at angle $\theta$ transmits light polarized along $\theta'$ with intensity $\cos^2(\theta - \theta')$. Each polarizer has to be aligned with whatever polarization the light will have when it arrives, or it rejects part of the light.

**Forward pass** — light enters from the left through the input polarizer:

- Light enters horizontally polarized; the input polarizer transmits it.
- The rotator turns the polarization by $+45°$.
- The output polarizer, at $+45°$, is aligned with the arriving polarization: the light passes through, and forward transmission is essentially 100% (up to residual absorption in the rotator).

**Reverse pass** — a downstream reflection returns through the output polarizer:

- The reflected light re-enters through the output polarizer, so its polarization is fixed at $+45°$ on entry.
- It re-traverses the rotator, which rotates it by another $+45°$ *in the same lab-frame direction* — because the rotation is tied to $\vec B_0$, not to which way the wave is traveling.
- The polarization arriving at the input polarizer is at $+90°$, orthogonal to the input polarizer's transmission axis, and the input polarizer absorbs it.

{% include visualization.html src="faraday-isolator.html" title="Forward transmission and backward isolation in a Faraday isolator" %}

### # 1.1. Why $+45°$? {#sec-1-1}

We can write down two design conditions and see what rotation angle satisfies both at once. Let the input polarizer sit at $0°$, the rotator rotate by some angle $\theta_F$, and the output polarizer sit at some angle $\alpha$. Two conditions:

- **Forward transmission is 100%** when the output polarizer is aligned with the singly-rotated light: $\alpha = \theta_F$. Using the polarizer transmission law, the transmitted intensity is $\cos^2(\alpha - \theta_F) = 1$ at $\alpha = \theta_F$.
- **Backward extinction is 100%** when the doubly-rotated light arrives at the input polarizer orthogonal to its transmission axis: the light re-entering through the output polarizer sits at angle $\alpha$; after another $\theta_F$ of rotation it arrives at the input polarizer at angle $\alpha + \theta_F$, and the input polarizer transmits $\cos^2(0 - (\alpha + \theta_F))$. For this to be $0$, we need $\alpha + \theta_F = 90°$.

Both conditions hold at the same time only when $\alpha = \theta_F$ *and* $2 \theta_F = 90°$. That fixes $\theta_F = \alpha = 45°$.

Any other rotation angle forces a compromise. If we insist on 100% forward transmission (setting $\alpha = \theta_F$), backward extinction becomes $\cos^2(2\theta_F)$, which is not zero unless $\theta_F = 45°$. If we instead insist on 100% backward extinction (setting $\alpha + \theta_F = 90°$), forward transmission becomes $\cos^2(90° - 2\theta_F)$, which is not one unless $\theta_F = 45°$. Only at $\theta_F = 45°$ do the two design points coincide.

The design condition $\theta_F = (\omega/2c)(n_+ - n_-)\, L = 45°$ then ties the material's index difference $n_+ - n_-$, the bias field (which sets $n_+ - n_-$ through $\kappa_P$), and the physical thickness $L$ of the rotator together.

The isolator dumps the rejected reverse light into the input polarizer as heat. A three-port extension replaces each absorbing polarizer with a polarization-splitting element that routes horizontal and vertical polarizations to two different physical output ports. The reverse light, arriving at the input side at $90°$ (vertical), gets routed to a third port rather than absorbed. That extension is the **optical circulator**, and it is the standard element that lets long-haul telecom links carry outgoing and incoming signals on the same fiber.

*The isolator uses Faraday rotation on a straight path with two polarizers. What does the same non-reciprocal rotation do when the Faraday medium is placed inside a disk with three ports and standing-wave modes?*

---

## # 2. The Y-junction circulator {#sec-2}

The Y-junction circulator routes signals cyclically: an input at port 1 emerges at port 2, an input at port 2 emerges at port 3, an input at port 3 emerges at port 1. Reversing the bias reverses the cycle. It is the standard non-reciprocal component at microwave frequencies, where it separates outgoing and incoming signals in radar transmitters, protects amplifiers from reflected pulses, and terminates the unused arm of a duplexer.

{% include visualization.html src="y-junction-circulator-routing.html" title="Routing through a biased Y-junction ferrite disk" %}

The device is a thin disk of magnetically biased ferrite, lying in the $xy$-plane, with three microwave ports feeding the rim at $\phi = 0°, 120°, 240°$. The bias points along $\hat z$, perpendicular to the disk.

### # 2.1. Unbiased: three-way splitting {#sec-2-1}

With the bias off, the disk is a passive circular disk of dielectric. Its electromagnetic modes are standing waves whose angular dependence goes as $e^{i m \phi}$, labeled by an azimuthal integer $m$. The pair we care about are the two modes with $m = \pm 1$: each has one antinodal diameter through the center of the disk and one nodal diameter perpendicular to it. By the disk's rotational symmetry, the $m = +1$ and $m = -1$ modes have the same frequency, so any linear combination of them is also an eigenmode at that frequency.

Feed the disk from port 1. The excitation is symmetric about the diameter through port 1, which selects an equal superposition of $m = +1$ and $m = -1$ — a standing wave with its antinodal diameter aligned with port 1 (at $\phi = 0°$) and its nodal diameter perpendicular to it (at $\phi = 90°, 270°$). Ports 2 and 3, at $\phi = 120°$ and $\phi = 240°$, are equidistant from the nodal diameter and each pick up the same fraction of the field.

{% include visualization.html src="circulator-cavity-modes.html" title="The unbiased dipole modes and their responses at the three ports" %}

Symmetric splitting. Not a circulator.

### # 2.2. Biased: the two modes split in frequency {#sec-2-2}

Turn on $\vec B_0 \parallel \hat z$. The two modes $m = +1$ and $m = -1$, viewed as counter-rotating circular polarizations of the transverse field about the bias axis, are exactly the two circular components that diagonalize the tensor of the imports. They see the two effective permeabilities $\mu_\pm = \mu \pm \kappa_P$, and their resonance frequencies (which go as $1/\sqrt{\mu}$) split apart from the shared unbiased value $\omega_0$:

$$\omega_\pm \approx \omega_0 \left(1 \mp \frac{\kappa_P}{2\mu}\right).$$

The formerly-degenerate pair splits by $\Delta\omega \sim (\kappa_P/\mu)\, \omega_0$.

### # 2.3. Operating between the two: pattern rotation {#sec-2-3}

Drive the disk at the frequency halfway between the two split resonances, $\omega_\text{op} = (\omega_+ + \omega_-)/2$. Both modes are close to on-resonance and both are excited — but each is off-resonance by $\pm \Delta\omega/2$, and near a resonance an off-resonance mode picks up a phase shift whose sign is set by which side of resonance it sits on. The two modes therefore pick up phase shifts of opposite sign.

Because $m = +1$ has its field rotating one way in the transverse plane and $m = -1$ rotates the other, giving them opposite phase shifts is exactly the same as rotating one of them relative to the other. Their superposition — the standing wave — rotates as a rigid pattern, carrying its antinodal and nodal diameters along with it. Choose the disk diameter and bias so that the rotation is $30°$.

### # 2.4. Placing the null on a port {#sec-2-4}

The $30°$ rotation moves the nodal diameter from $90°/270°$ to $120°/300°$. Port 2, at $\phi = 120°$, now sits exactly on the null and receives no signal. Port 3, at $\phi = 240°$, sits well away from the null and picks up the transmitted energy. The routing is port 1 → port 3, with port 2 isolated.

{% include visualization.html src="y-junction-null-placement.html" title="How a 30° pattern rotation places the field null on the isolated port" %}

The $30°$ figure follows from the port geometry: with ports at $0°, 120°, 240°$ and the unbiased nodal diameter at $90°/270°$, a $30°$ pattern rotation is the smallest one that puts a nodal end exactly on a port. Fitting that rotation to the mode splitting sets the design condition on disk diameter and bias.

By the $120°$ rotational symmetry of the device, the same argument applies to inputs at port 2 (giving $2 \to 1$) and at port 3 (giving $3 \to 2$), completing the cycle. Reversing $\vec B_0$ swaps $\mu_+$ and $\mu_-$, flips the sign of the pattern rotation, moves the null onto port 3 instead of port 2, and gives the cycle in the other direction: $1 \to 2 \to 3 \to 1$.

*Both devices need a real material that presents the off-diagonal tensor to the wave. What can we actually build them out of?*

---

## # 3. Materials {#sec-3}

The material has to be magnetic — so that a static bias can produce the off-diagonal tensor — and transparent to the wave. Those two requirements separate the practical materials into two families, split by frequency.

### # 3.1. Why not metals: the skin depth {#sec-3-1}

A microwave field entering a good conductor drives circulating induced currents at the surface. Those currents produce a field that opposes the applied one, and the applied field cancels inside a thin surface layer. The characteristic depth is

$$\delta_\text{skin} = \sqrt{2/(\mu\sigma\omega)},$$

which for iron at $10$ GHz is about $1\,\mu\text{m}$. Anything deeper than that skin is invisible to the field.

So the naturally-magnetic metals — iron, cobalt, nickel — are useless for the body of a microwave circulator or isolator. Most of the material sits below the skin, its precession never sees the wave, and its off-diagonal tensor never gets to act. The magnetic material has to be an **insulator**, so no induced currents can form and the field penetrates the bulk.

### # 3.2. Ferrites at microwave frequencies {#sec-3-2}

**Ferrites** are magnetic oxides that are chemically insulating. Their DC conductivity is essentially zero (the electrons responsible for magnetism are localized on atomic sites, not itinerant as in a metal), no induced currents form, and a microwave field enters the bulk unimpeded. Inside, the precession of the localized magnetic moments at the frequency $\omega_L = \gamma B_0$ produces the tensor of the imports.

The microwave workhorse is yttrium iron garnet Y$_3$Fe$_5$O$_{12}$, a synthetic garnet whose distinguishing feature is an unusually narrow resonance. The resonance width is set by damping — real magnetic moments precessing under a bias slowly leak energy to the lattice and align with the bias, and this broadens the resonance from a delta function into a peak of width proportional to the damping rate. Narrow line means high Q means clean device response, and yttrium iron garnet has among the lowest damping rates of any known magnetic material. It is what almost every microwave circulator is made of.

### # 3.3. Garnets at optical frequencies {#sec-3-3}

At optical frequencies the microwave mechanism does not work: magnetic moments in a solid can precess at $\sim 30$ GHz, not at the $200$ THz of a telecom photon, and they cannot follow the field. Optical Faraday rotation instead comes from the [shift of bound-electron oscillation frequencies under the bias](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3-7), which produces a tensor with the same $(\mu, -i\kappa_P;\; i\kappa_P, \mu)$ shape as the microwave case, appearing as a permittivity rather than a permeability. The device physics of # 1–2 carries over unchanged.

Two optical materials dominate:

- **Terbium gallium garnet**, Tb$_3$Ga$_5$O$_{12}$, a paramagnetic garnet with a large Faraday coefficient in the visible and near-infrared. Standard for high-power laser isolators — for instance, protecting a kilowatt-class 1064 nm laser from downstream reflections. It needs an external permanent magnet of about $1$ T to reach the $45°$ design point.
- **Bismuth-substituted yttrium iron garnet**, in which some yttrium ions are replaced by bismuth. The substitution largely opens up YIG's optical opacity at the 1550 nm telecom window while preserving YIG's self-magnetization, so that a millimeter-thick chip is a complete, self-biased optical isolator. This is the standard element between every DFB laser and every long-haul optical fiber in the telecom network.

Non-reciprocity is a scarce physical resource. The [reciprocity argument in # 3.6 of the coupled-modes post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3-6) shows that no passive, non-magnetic, dielectric medium can provide it: every device that does produce it — every isolator, every circulator, every Faraday rotator — starts from a magnetic bias, and the entire ecosystem of optical isolators and circulators rests on the handful of magnetic materials in this section.

---

## Closing

Faraday rotation is a scalar consequence of the antisymmetric off-diagonal tensor that a magnetic bias imposes on a permeability or permittivity. Its distinguishing feature — the rotation direction is set by the lab-frame bias, not by the wave direction — makes it survive a round trip instead of cancelling.

Two devices exploit that survival:

- The **optical isolator** sets the round-trip rotation to $90°$ by using a $45°$ Faraday rotator between two polarizers offset by $45°$, and blocks any wave returning through the second polarizer.
- The **Y-junction circulator** places the Faraday medium inside a disk with three ports, splits the two standing-wave modes by biasing, drives at the midpoint frequency, and reads out the resulting $30°$ pattern rotation as cyclic port-to-port routing.

Both need a magnetic material transparent to the wave: at microwave frequencies, an insulating ferrite (yttrium iron garnet); at optical frequencies, a garnet whose optical transitions leave the wave largely undisturbed (terbium gallium garnet, bismuth-substituted YIG). Change the material family, keep the device physics.
