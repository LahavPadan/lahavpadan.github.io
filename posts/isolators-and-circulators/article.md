# Optical Isolators and Y-Junction Circulators

Two problems in optics call for a component that lets a wave through in one direction and blocks it in the other.

The first is protecting a semiconductor laser from feedback. A high-power laser reflecting off a fiber facet, a coupling lens, or a downstream workpiece sends unwanted light back into its gain region and destabilizes the mode structure it was engineered to produce. The [distributed-feedback laser from the previous post](/posts/bragg-mirrors-and-lasers/#sec-4-2) is especially sensitive: its single-mode operation relies on a balance between two closely spaced band-edge modes that a milliwatt of back-reflection can upset.

The second is running two-way traffic on a single fiber. Long-haul telecom links save fiber count by sending outgoing and incoming signals through the same strand of glass; separating the two at each end without a bulky beam splitter needs a three-port device that routes port 1 → port 2 and port 3 → port 1 with no crosstalk.

Both problems dissolve into a single physical requirement: a device whose input–output relation depends on the direction the wave is going. The physics that makes this possible was worked out in [§ 3 of the coupled-modes post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3). We lift its main results here:

- Under a static magnetic bias $\vec B_0$ along $\hat z$, a magnetic or magneto-optic medium acquires an antisymmetric imaginary off-diagonal component in its response to the transverse field:

  $$\hat\mu_r = \begin{pmatrix} \mu & -i\kappa_P \\ i\kappa_P & \mu \end{pmatrix}.$$

  (At microwave frequencies this is a ferrite's permeability; at optical frequencies, the analogous permittivity from the [Zeeman-shifted bound-electron response](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3-7) has the same shape. The device physics is identical.)

- The tensor is diagonal in a basis of circular polarizations. The two circular components see refractive indices $n_\pm = \sqrt{\varepsilon(\mu \pm \kappa_P)}$ and travel at different phase velocities.

- A linearly polarized wave, decomposed as a sum of the two circular components, has its polarization direction rotated by

  $$\theta_F(z) = \frac{\omega}{2c}\, (n_+ - n_-)\, z$$

  after propagating a distance $z$. This is **Faraday rotation**.

- The direction the polarization rotates in is set by the *bias* direction in the lab frame, not by the wave's propagation direction. A wave making a round trip picks up the same rotation on the way back that it did on the way out — the two rotations **add** rather than cancelling.

That last property is what breaks reciprocity, and it is what the rest of the post uses.

§ 1 uses the round-trip addition in a straight-through geometry with two polarizers to build the two-port **optical isolator**. § 2 uses the same physics in a resonant cavity to build the three-port **Y-junction circulator**. § 3 covers the materials — ferrites at microwave frequencies, magneto-optic garnets at optical frequencies — that actually implement the tensor above.

---

## § 1. The optical isolator {#sec-1}

The isolator has three components strung along the beam:

1. A **linear polarizer** at angle $0°$ (the input polarizer), transmitting horizontal polarization and rejecting the vertical component.
2. A **Faraday rotator** — a chip of magnetically biased material, with thickness $L$ and bias $\vec B_0$ chosen so that a wave crossing it in either direction picks up $\theta_F = +45°$ of polarization rotation.
3. A second linear polarizer, the output polarizer, at angle $+45°$.

The angles are set by the transmission law for a polarizer: a polarizer with axis at $\theta$ transmits light polarized along $\theta'$ with intensity $\cos^2(\theta - \theta')$. Each polarizer has to be aligned with whatever polarization the light will have when it arrives.

**Forward pass.** Light enters horizontally polarized (transmitted by the input polarizer). The rotator turns the polarization by $+45°$. The output polarizer, at $+45°$, is aligned with the arriving polarization: the light passes through, and the isolator's forward transmission is essentially 100% (up to residual absorption in the rotator itself).

**Reverse pass.** Any downstream reflection re-enters the isolator through the output polarizer, so its polarization is fixed at $+45°$ on entry. It re-traverses the rotator, which rotates it by another $+45°$ *in the same lab-frame direction* — because the rotation is tied to $\vec B_0$, not to which way the wave is going. The polarization arriving at the input polarizer is now at $+90°$, orthogonal to the input polarizer's transmission axis, and the input polarizer absorbs it.

{% include visualization.html src="faraday-isolator.html" title="Forward transmission and backward isolation in a Faraday isolator" %}

The $+45°$ choice is not arbitrary. Two-pass extinction requires the doubly-rotated polarization to be exactly perpendicular to the input axis, so $2\theta_F = 90°$, giving $\theta_F = 45°$. Any other rotator length produces either partial forward transmission (if the output polarizer is misaligned with the singly-rotated light) or partial backward leakage (if the doubly-rotated light is not fully perpendicular to the input polarizer). The condition $\theta_F = (\omega/2c)(n_+ - n_-) L = 45°$ ties the material's index difference, the bias field, and the rotator's physical length together.

The device dumps rejected light into the input polarizer as heat. A three-port extension replaces the absorbing polarizers with polarizing beam splitters, so the rejected light is *routed* to a third port rather than lost. That extension is the **optical circulator**, and it is the standard element that lets long-haul telecom links carry outgoing and incoming signals on the same fiber.

*The isolator uses Faraday rotation in a straight-through geometry. What does the same non-reciprocal rotation do when the Faraday medium sits inside a resonator?*

---

## § 2. The Y-junction circulator {#sec-2}

The Y-junction circulator routes signals cyclically: an input at port 1 emerges at port 2, an input at port 2 emerges at port 3, an input at port 3 emerges at port 1. Reversing the bias reverses the cycle. It is the standard non-reciprocal component at microwave frequencies, where it separates outgoing and incoming signals in radar transmitters, protects amplifiers from reflected pulses, and terminates the unused arm of a duplexer.

{% include visualization.html src="y-junction-circulator-routing.html" title="Routing through a biased Y-junction ferrite disk" %}

The device is a thin disk of magnetically biased ferrite, lying in the $xy$-plane, with three microwave ports feeding the rim at $\phi = 0°, 120°, 240°$. The bias points along $\hat z$, perpendicular to the disk.

### § 2.1. Unbiased: three-way splitting {#sec-2-1}

With the bias off, the disk is a passive circular resonator. Its electromagnetic modes are Bessel-function standing waves labeled by an azimuthal quantum number $m$: the field's dependence on the polar angle goes as $e^{i m \phi}$. The pair we care about are the **dipole modes** $m = \pm 1$: each has one antinodal diameter through the center of the disk and one nodal diameter perpendicular to it. By the disk's rotational symmetry, $m = +1$ and $m = -1$ have exactly the same frequency, so any linear combination of the two is also an eigenmode at that frequency.

Feed the disk from port 1. The excitation is symmetric about the diameter through port 1, which selects an equal superposition of $m = +1$ and $m = -1$ — a standing wave with its antinodal diameter aligned with port 1 (at $\phi = 0°$) and its nodal diameter perpendicular to it (at $\phi = 90°, 270°$). Ports 2 and 3, at $\phi = 120°$ and $\phi = 240°$, are equidistant from the nodal diameter and each pick up the same fraction of the field.

{% include visualization.html src="circulator-cavity-modes.html" title="The unbiased dipole modes and their responses at the three ports" %}

Symmetric splitting. Not a circulator.

### § 2.2. Biased: the two dipole modes split in frequency {#sec-2-2}

Turn on $\vec B_0 \parallel \hat z$. The two dipole modes, viewed as counter-rotating circular polarizations of the transverse field about the bias axis, are exactly the two circular components that diagonalize the gyromagnetic tensor. They see the two effective permeabilities $\mu_\pm = \mu \pm \kappa_P$, and their resonance frequencies (which go as $1/\sqrt{\mu}$) split apart from the shared unbiased value $\omega_0$:

$$\omega_\pm \approx \omega_0 \left(1 \mp \frac{\kappa_P}{2\mu}\right).$$

The formerly-degenerate pair splits by $\Delta\omega \sim (\kappa_P/\mu)\, \omega_0$.

### § 2.3. Operating between the two: pattern rotation {#sec-2-3}

Drive the disk at the frequency halfway between the two split resonances, $\omega_{\text{op}} = (\omega_+ + \omega_-)/2$. Both dipole modes are close to on-resonance and both are excited — but each is off-resonance by $\pm \Delta\omega/2$, and near a resonance an off-resonance mode picks up a phase shift whose sign is set by which side of resonance it sits on. The two modes therefore pick up phase shifts of opposite sign.

Because $m = +1$ has its field rotating one way in the transverse plane and $m = -1$ rotates the other, giving them opposite phase shifts is exactly the same as rotating one of them relative to the other. Their superposition — the standing wave — rotates as a rigid pattern, carrying its antinodal and nodal diameters along with it. Choose the disk diameter and bias so that the rotation is $30°$.

### § 2.4. Placing the null on a port {#sec-2-4}

The $30°$ rotation moves the nodal diameter from $90°/270°$ to $120°/300°$. Port 2, at $\phi = 120°$, now sits exactly on the null and receives no signal. Port 3, at $\phi = 240°$, sits well away from the null and picks up the transmitted energy. The routing is port 1 → port 3, with port 2 isolated.

{% include visualization.html src="y-junction-null-placement.html" title="How a 30° pattern rotation places the field null on the isolated port" %}

The $30°$ figure follows from the port geometry: with ports at $0°, 120°, 240°$ and the unbiased nodal diameter at $90°/270°$, a $30°$ pattern rotation is the smallest one that puts a nodal end exactly on a port. Fitting that rotation to the mode splitting sets the design condition on disk diameter and bias.

By the $120°$ rotational symmetry of the device, the same argument applies to inputs at port 2 (giving $2 \to 1$) and at port 3 (giving $3 \to 2$), completing the cycle. Reversing $\vec B_0$ swaps $\mu_+$ and $\mu_-$, flips the sign of the pattern rotation, moves the null onto port 3 instead of port 2, and gives the cycle in the other direction: $1 \to 2 \to 3 \to 1$.

*Both devices need a real material that presents the off-diagonal tensor to the wave. What can we actually build them out of?*

---

## § 3. Materials {#sec-3}

The material has to be magnetic — so that a bias can put it into gyrotropy — and it has to be transparent to the wave. Those two requirements separate the practical materials into two families, split by frequency.

### § 3.1. Why not metals: the skin depth {#sec-3-1}

A microwave magnetic field entering a good conductor drives circulating induced currents at the surface. Those currents produce a field that opposes the applied one, and the applied field cancels inside a thin surface layer. The characteristic depth is

$$\delta_{\text{skin}} = \sqrt{2/(\mu\sigma\omega)},$$

which for iron at $10$ GHz is about $1\,\mu\text{m}$. Anything deeper than that skin is invisible to the field.

So the naturally-magnetic metals — iron, cobalt, nickel — are useless for the body of a microwave circulator or isolator. Most of the material sits below the skin, its spin precession never sees the wave, and its Polder tensor never gets to act. The magnetic material has to be an **insulator**, so no eddy currents form and the field penetrates the bulk.

### § 3.2. Ferrites at microwave frequencies {#sec-3-2}

**Ferrites** are magnetic oxides that are chemically insulating. Their DC conductivity is essentially zero (the electrons responsible for magnetism are localized on atomic sites, not itinerant as in a metal), no eddy currents form, and a microwave field enters the bulk unimpeded. Inside, the spin precession at the Larmor frequency $\omega_L = \gamma B_0$ produces the gyromagnetic tensor of the imports.

The microwave workhorse is yttrium iron garnet Y$_3$Fe$_5$O$_{12}$, a synthetic garnet whose distinguishing feature is an unusually narrow ferromagnetic resonance. The resonance width is set by damping — real spins precessing under a bias slowly leak energy to the lattice and align with the bias, and this broadens the resonance from a delta function into a peak of width proportional to the damping rate. Narrow line means high Q means clean device response, and yttrium iron garnet has among the lowest damping rates of any known magnetic material. It is what almost every microwave circulator is made of.

### § 3.3. Magneto-optic garnets at optical frequencies {#sec-3-3}

At optical frequencies the microwave mechanism does not work: a magnetic moment in a solid can precess at $\sim 30$ GHz, not at the $200$ THz of a telecom photon, and the spins cannot follow the field. Optical Faraday rotation instead comes from the [Zeeman shift of bound-electron oscillator frequencies](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3-7) under the bias, which produces a permittivity tensor with the same $(\mu, -i\kappa_P; i\kappa_P, \mu)$ shape as the microwave case. The device physics of §§ 1–2 carries over unchanged.

Two optical materials dominate:

- **Terbium gallium garnet**, Tb$_3$Ga$_5$O$_{12}$, a paramagnetic garnet with a large Faraday coefficient in the visible and near-infrared. Standard for high-power laser isolators — for instance, protecting a kilowatt-class 1064 nm laser from workpiece reflections. It needs an external permanent magnet of about $1$ T to reach the $45°$ design point.
- **Bismuth-substituted yttrium iron garnet**, in which some yttrium ions are replaced by bismuth. The substitution largely opens up YIG's optical opacity at the 1550 nm telecom window while preserving YIG's self-magnetization, so that a millimeter-thick chip is a complete, self-biased optical isolator. This is the standard element between every DFB laser and every long-haul optical fiber in the telecom network.

Non-reciprocity is a scarce physical resource. The [reciprocity argument in § 3.6 of the coupled-modes post](/posts/coupled-modes-bragg-structures-and-photonic-bandgaps/#sec-3-6) shows that no passive, dielectric, non-magnetic medium can provide it: every device that does produce it — every isolator, every circulator, every Faraday rotator — starts from a magnetic bias, and the entire ecosystem of optical isolators and circulators rests on the handful of insulating magnetic materials in this section.

---

## Closing

Faraday rotation is a scalar consequence of the antisymmetric off-diagonal tensor that a magnetic bias imposes on a permeability or permittivity. Its distinguishing feature — the rotation direction is set by the lab-frame bias, not by the wave direction — makes it survive a round trip instead of cancelling.

Two devices exploit that survival:

- The **optical isolator** sets the round-trip rotation to $90°$ by using a $45°$ Faraday rotator between two polarizers offset by $45°$, and blocks any wave returning through the second polarizer.
- The **Y-junction circulator** places the Faraday medium inside a resonant disk with three ports, splits the two dipole cavity modes by biasing, drives at the midpoint frequency, and reads out the resulting $30°$ pattern rotation as cyclic port-to-port routing.

Both need a magnetic material transparent to the wave: at microwave frequencies, an insulating ferrite (yttrium iron garnet); at optical frequencies, a garnet whose optical transitions can support Faraday rotation without absorbing the wave (terbium gallium garnet, bismuth-substituted YIG). Change the material family, keep the device physics.
