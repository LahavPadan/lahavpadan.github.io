# A Justification of the Relation $p = \hbar k$

The Fourier uncertainty inequality $\Delta x \cdot \Delta k \geq \frac{1}{2}$ is a mathematical statement. To use it in physics, we first need to understand what physical quantity should correspond to $k$. For a matter wave, this leads to the relation proposed by **Louis de Broglie**:

$$
\boxed{p = \hbar k}
$$

Once this relation is established, it can be used to connect Fourier uncertainty with Heisenberg's uncertainty principle, to recover the free-particle Schrödinger equation, and to understand phenomena such as zero-point energy and tunneling. The same relation also remains consistent with relativistic energy and leads to the Klein–Gordon equation.

---

## § 1. What Fourier analysis gives us—and what it does not

For every function $f(x) \in L^2(\mathbb{R})$—that is, every square-integrable function—its Fourier transform is defined by

$$
F(k) = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^{\infty} f(x)e^{-ikx}\,dx.
$$

If we define the normalized density

$$
\rho(x) = \frac{\lvert f(x)\rvert^2}{\lVert f\rVert^2}
$$

and its counterpart in the dual space,

$$
\widetilde{\rho}(k) = \frac{\lvert F(k)\rvert^2}{\lVert F\rVert^2},
$$

then their standard deviations, denoted by $\Delta x$ and $\Delta k$, satisfy

$$
\Delta x \cdot \Delta k \geq \frac{1}{2}.
$$

At this stage, the statement concerns only a function and its Fourier transform. The constant $\hbar$ and the physical interpretation of momentum have not yet entered. Equality is attained only by a Gaussian function, which is therefore called a *minimum-uncertainty function*.

The proof itself relies on the identity

$$
\int \lvert f'(x)\rvert^2\,dx
=
\int k^2\lvert F(k)\rvert^2\,dk,
$$

which is a form of Parseval's identity, together with the Cauchy–Schwarz inequality. We will not prove it here; we will only use it as a mathematical fact.

### Where the physics enters

A real wave—light, a water wave, or a wave on a string—is a superposition of components with different values of $k$, each of which propagates differently. To turn the mathematical inequality into a physical principle, we must identify $k$ with a measurable quantity.

When the wave represents a particle, the relevant quantity is momentum. The relation between momentum and wave number is known as the **de Broglie relation**. Our aim will be to see why this relation gives the required agreement between the motion of a wave packet and the motion of the particle it represents.

---

## § 2. Before a packet can move: the relation between $\omega$ and $k$

A single plane wave of the form

$$
e^{i(kx-\omega t)}
$$

is a solution of the wave equation appropriate to the system being described. Substituting the plane wave into that equation produces a relation between $\omega$ and $k$. This relation,

$$
\omega = \omega(k),
$$

is called the **dispersion relation**.

A few classical examples make its origin clear.

### Light in vacuum

Maxwell's equations give

$$
\partial_t^2 E = c^2\partial_x^2 E.
$$

Substituting $E = E_0e^{i(kx-\omega t)}$ gives $-\omega^2=-c^2k^2$, and therefore

$$
\omega(k) = c\lvert k\rvert.
$$

The relation is linear and therefore **nondispersive**. All frequencies propagate at the same speed $c$, so a packet preserves its shape indefinitely.

### A wave on a stretched string

The equation of motion for a transverse displacement $y(x,t)$ is

$$
\mu\partial_t^2y = T\partial_x^2y,
$$

where $T$ is the tension and $\mu$ is the linear mass density. Substitution gives

$$
\omega(k)=c_s\lvert k\rvert,
\qquad
c_s=\sqrt{\frac{T}{\mu}}.
$$

Again the relation is linear, and again the wave is nondispersive.

### Deep-water waves

Solving the fluid equations with the free-surface boundary condition under gravity $g$ gives

$$
\omega(k)=\sqrt{g\lvert k\rvert}.
$$

This dispersion relation is **nonlinear**, and therefore genuinely dispersive. Different frequency components travel at different speeds. A wave packet on the ocean surface consequently does not preserve its shape: it spreads.

### Electromagnetic waves in a material

The effect of the material's polarization on the total field introduces a frequency-dependent refractive index $n(\omega)$, so that

$$
\omega = \frac{ck}{n(\omega)}.
$$

This is the setting from which the word *dispersion* takes its name: a prism separates white light into colors because $n$ depends on $\omega$.

{% include visualization.html src="dispersion-relations.html" title="Dispersion relations and the phase- and group-velocity slopes" %}

### For a matter wave, the order of the problem is reversed

**In every classical example, the dispersion relation is determined by a wave equation that is already known.** For a matter wave, the situation is reversed: we do not yet know which wave equation governs it.

The purpose of the development below is to determine $\omega(k)$ for a free particle and then, from that relation, derive the wave equation itself—the Schrödinger equation.

---

## § 3. A crest and a packet need not move together

For a single plane wave $e^{i(kx-\omega t)}$, the **phase velocity** is defined as

$$
v_p=\frac{\omega}{k}.
$$

This is the speed at which a point of constant phase—for example, a crest of a cosine wave—moves. For an infinite plane wave, this is the only defined velocity, and it can be observed directly by following the crests.

A single plane wave contains no localized object. To describe something localized, we superpose waves over a range of $k$ values around some central value $k_0$, producing a **wave packet**.

A packet has a second velocity in addition to the phase velocities of its components: the velocity of its **envelope**, meaning the localized overall shape of the packet. This is the **group velocity**:

$$
v_g=\frac{d\omega}{dk}\bigg\rvert_{k_0}.
$$

The next section will show why this derivative gives the envelope velocity. For now, consider two physical distinctions.

### When every component travels together

When $\omega=ck$ is a straight line,

$$
v_p=v_g=c.
$$

The phase and the packet move together.

### When different components travel differently

For deep-water waves, $\omega=\sqrt{gk}$, and therefore

$$
v_p=\sqrt{\frac{g}{k}},
\qquad
v_g=\frac{1}{2}\sqrt{\frac{g}{k}}=\frac{v_p}{2}.
$$

**The packet lags behind the phase.** This is directly visible at sea: crests appear at the back of a wave group, move forward through it, and disappear at its front, while the envelope itself advances more slowly.

The carrier oscillation inside the pulse moves at the phase velocity $v_p$. The peaks of the carrier slide forward at $v_p$.

The envelope of the pulse—the outline, the shape, the location of “where the pulse is”—moves at the group velocity $v_g$.

If the medium is non-dispersive, so that all frequencies have the same phase velocity, then $v_p$ and $v_g$ are equal, and the pulse moves rigidly: the envelope and carrier travel together. In a dispersive medium, however, $v_p \neq v_g$. The envelope then moves at one speed while the carrier oscillations inside it move at another. Crests appear at the back of the envelope, slide through it at the relative speed $v_p-v_g$, and disappear at the front—or the other way around, depending on the sign of the dispersion.

---

## § 4. Building a localized wave from plane waves

Consider a superposition of plane waves with weights $A(k)$:

$$
\psi(x,t)=\int_{-\infty}^{\infty}A(k)e^{i(kx-\omega(k)t)}\,dk.
$$

The function $A(k)$ is the packet's **spectrum**. In quantum mechanics, as we will see later, $A(k)$ is identified with the momentum-space wavefunction—$\widetilde{\psi}(p)$ up to the factor $\hbar$—and it is determined from the initial condition $\psi(x,0)$ by a Fourier transform.

Assume that $A(k)$ is concentrated around $k_0$, with width $\Delta k\ll k_0$. Only values of $k$ close to $k_0$ then contribute significantly to the integral. Write

$$
\kappa\equiv k-k_0
$$

and expand $\omega(k)$ in a Taylor series:

$$
\omega(k)
\approx
\omega_0+v_g\kappa+\frac{1}{2}\beta\kappa^2+\cdots,
$$

where

$$
\omega_0=\omega(k_0),
\qquad
v_g=\omega'(k_0),
\qquad
\beta=\omega''(k_0).
$$

The coefficient $\beta$ is called **group-velocity dispersion** (GVD). For now, we stop at first order and return to $\beta$ later, in the section on wave-packet spreading.

Substituting the linear expansion into the integral and taking the terms independent of $\kappa$ outside gives

$$
\psi(x,t)
\approx
\underbrace{e^{i(k_0x-\omega_0t)}}_{\text{carrier}}
\cdot
\underbrace{\int A(k_0+\kappa)e^{i\kappa(x-v_gt)}\,d\kappa}_{\text{envelope}}.
$$

This separates the packet into two parts with different roles.

### The rapidly oscillating carrier

The factor

$$
e^{i(k_0x-\omega_0t)}
$$

is a pure plane wave. It moves at the phase velocity

$$
v_p=\frac{\omega_0}{k_0}.
$$

It is the rapidly oscillating component inside the packet.

### The localized envelope

The integral depends only on the combination

$$
x-v_gt.
$$

It therefore does not depend on position and time separately: to first order, it travels to the right at velocity $v_g$ without changing shape. It is precisely the Fourier transform of the shifted spectrum $A(k_0+\kappa)$.

**This explains why $v_g=d\omega/dk$ is the velocity of the particle represented by the packet:** it is the velocity of the envelope maximum, and therefore of the center of the probability distribution.

---

## § 5. The same structure with only two waves

As an elementary special case, take $A(k)$ to consist of two Dirac delta functions:

$$
A(k)=\delta(k-k_1)+\delta(k-k_2).
$$

By the sampling property of the delta function, the integral selects only those two values:

$$
\psi(x,t)
=
e^{i(k_1x-\omega_1t)}+e^{i(k_2x-\omega_2t)}.
$$

Define

$$
k_0=\frac{k_1+k_2}{2},
\qquad
\Delta k=\frac{k_1-k_2}{2},
$$

and similarly define $\omega_0$ and $\Delta\omega$. Then

$$
\begin{aligned}
\psi(x,t)
&=
e^{i(k_0x-\omega_0t)}
\left[
 e^{i(\Delta k\,x-\Delta\omega\,t)}
 +
 e^{-i(\Delta k\,x-\Delta\omega\,t)}
\right]\\
&=
2\cos(\Delta k\,x-\Delta\omega\,t)
e^{i(k_0x-\omega_0t)}.
\end{aligned}
$$

The same carrier–envelope separation appears here, but the envelope is an infinite periodic cosine rather than a localized function: the familiar **beat pattern**.

The reason is that this spectrum contains only two sharp components, so it is not rich enough to create destructive interference everywhere outside one localized region. Only when the spectrum is continuous and fills a range do the waves interfere destructively almost everywhere except in a narrow region where they remain in phase. That narrow region is a genuine wave packet.

The envelope velocity here is

$$
\frac{\Delta\omega}{\Delta k},
$$

which is the slope of the secant line between the points $(k_1,\omega_1)$ and $(k_2,\omega_2)$. As the two points approach one another, the secant slope becomes the derivative

$$
\frac{d\omega}{dk},
$$

which is the group velocity obtained above.

{% include visualization.html src="phase-and-group-velocity.html" title="Phase velocity, group velocity, and the two-wave beat envelope" %}

---

## § 6. Why the wave-packet velocity leads to $p = \hbar k$

We now have three facts.

### The temporal frequency is tied to energy

$$
E=\hbar\omega.
$$

Historically, this relation comes from light: black-body radiation and the photoelectric effect show that light of angular frequency $\omega$ is emitted and absorbed in amounts of energy $\hbar\omega$.

Extending this relation to matter particles is a working assumption. It does not follow from classical mechanics, and there is no way to derive it from classical mechanics alone. We will treat it as a postulate identifying the temporal frequency of the wavefunction with energy.

### Classical mechanics ties energy to velocity

For a free particle with momentum $p$,

$$
E(p)=\frac{p^2}{2m},
$$

and its velocity is

$$
v=\frac{dE}{dp}=\frac{p}{m}.
$$

The identity $dE/dp=v$ remains valid in the relativistic case, to which we will return at the end.

### Matching the packet velocity to the particle velocity

To represent the motion of a particle, the center of the wave packet should move with the particle's velocity. We therefore require

$$
v_g=v.
$$

Let the relation between momentum and wave number be an unknown function $p=p(k)$, and require the two velocities to agree.

Using the group velocity and the chain rule,

$$
\begin{aligned}
v_g
&=\frac{d\omega}{dk}\\
&=\frac{1}{\hbar}\frac{dE}{dk}\\
&=\frac{1}{\hbar}\frac{dE}{dp}\frac{dp}{dk}\\
&=\frac{v}{\hbar}\frac{dp}{dk}.
\end{aligned}
$$

The second line follows from $E=\hbar\omega$; the third is the chain rule, because $E$ depends on $p$ and $p$ depends on $k$; and the fourth uses $dE/dp=v$.

Now impose the requirement $v_g=v$:

$$
v=\frac{v}{\hbar}\frac{dp}{dk}.
$$

For nonzero $v$, this gives

$$
\frac{dp}{dk}=\hbar.
$$

Integrating,

$$
p(k)=\hbar k+C.
$$

The constant $C$ is fixed by requiring that a particle at rest satisfy

$$
k=0 \quad\Longleftrightarrow\quad p=0.
$$

Therefore $C=0$, and

$$
\boxed{p=\hbar k}.
$$

This is the de Broglie relation. Within the assumptions used here, any other dependence $p=f(k)$ would make the packet velocity differ from $dE/dp$, the velocity assigned to the particle by mechanics.

### What this fixes for a free particle

We can now write the dispersion relation of a free particle:

$$
\omega(k)
=\frac{E}{\hbar}
=\frac{p^2}{2m\hbar}
=\frac{\hbar k^2}{2m}.
$$

The phase and group velocities are then

$$
v_p
=\frac{\omega}{k}
=\frac{\hbar k}{2m}
=\frac{p}{2m}
=\frac{v}{2},
$$

and

$$
v_g
=\frac{d\omega}{dk}
=\frac{\hbar k}{m}
=\frac{p}{m}
=v.
$$

For a nonrelativistic free particle, the carrier phase moves at $v/2$, while the envelope moves at $v$.

The phase of the wavefunction does not represent the position of the particle. Its velocity therefore need not equal the particle velocity. In the relativistic case, the phase velocity can exceed the speed of light; the group velocity, which describes the motion of the packet, does not.

---

## § 7. From the dispersion relation to the Schrödinger equation

The dispersion relation

$$
\omega(k)=\frac{\hbar k^2}{2m}
$$

can be translated into a differential equation by examining how derivatives act on each plane-wave component $e^{i(kx-\omega t)}$.

Differentiating a plane wave gives

$$
\partial_t e^{i(kx-\omega t)}
=-i\omega e^{i(kx-\omega t)}
\quad\Longrightarrow\quad
\omega\leftrightarrow i\partial_t,
$$

$$
\partial_x e^{i(kx-\omega t)}
=ik e^{i(kx-\omega t)}
\quad\Longrightarrow\quad
k\leftrightarrow -i\partial_x,
$$

and

$$
\partial_x^2e^{i(kx-\omega t)}
=-k^2e^{i(kx-\omega t)}
\quad\Longrightarrow\quad
k^2\leftrightarrow-\partial_x^2.
$$

For a plane wave, differentiation therefore reproduces the same wave multiplied by $-i\omega$, $ik$, or $-k^2$. We can use this to replace the factors in the dispersion relation by derivatives acting on $\psi$.

Replacing $\omega$ and $k^2$ in

$$
\omega=\frac{\hbar k^2}{2m}
$$

by the corresponding differential operators gives

$$
i\partial_t\psi
=
\frac{\hbar}{2m}\left(-\partial_x^2\psi\right)
=
-\frac{\hbar}{2m}\partial_x^2\psi.
$$

Multiplying by $\hbar$ gives

$$
\boxed{
i\hbar\,\partial_t\psi
=
-\frac{\hbar^2}{2m}\partial_x^2\psi
}.
$$

This is the Schrödinger equation for a free particle.

### Adding a potential

If

$$
E=\frac{p^2}{2m}+V(x),
$$

then the same correspondences,

$$
E\leftrightarrow i\hbar\partial_t,
\qquad
p^2\leftrightarrow-\hbar^2\partial_x^2,
$$

give

$$
i\hbar\,\partial_t\psi
=
\left[
-\frac{\hbar^2}{2m}\partial_x^2+V(x)
\right]\psi.
$$

### What entered the derivation

The Schrödinger equation was **not derived from more fundamental first principles**. It follows from combining:

1. the wave description of matter;
2. the extension of $E=\hbar\omega$ to matter;
3. the relation $p=\hbar k$ obtained above;
4. the classical energy $E=p^2/(2m)+V$.

Each item is an assumption about how the physical description is to be built. With these ingredients, substituting the classical energy expression gives the equation above.

The correspondences

$$
\omega\leftrightarrow i\partial_t,
\qquad
k\leftrightarrow-i\partial_x
$$

also generate the familiar quantum operators

$$
\widehat{p}=-i\hbar\partial_x,
\qquad
\widehat{H}=i\hbar\partial_t.
$$

These are the momentum and energy operators used in the operator formulation of quantum mechanics.

---

## § 8. What Fourier analysis becomes after $p = \hbar k$

Now that the relation $p=\hbar k$ has been established, we can return to the Fourier inequality

$$
\Delta x\cdot\Delta k\geq\frac{1}{2}
$$

and translate it into physics.

### § 8.1. The Heisenberg uncertainty relation

Multiplying by $\hbar$ gives immediately

$$
\boxed{
\Delta x\cdot\Delta p\geq\frac{\hbar}{2}
}.
$$

This is Heisenberg's uncertainty principle. Here it follows directly from the Fourier inequality after using $k=p/\hbar$.

### § 8.2. Why confinement leaves no zero-energy state

An infinite potential well is the model

$$
V(x)=0
$$

inside the interval $[0,L]$, and $V(x)=\infty$ outside it. Solving the time-independent Schrödinger equation inside the interval gives

$$
\psi_n(x)=\sqrt{\frac{2}{L}}\sin\left(\frac{n\pi x}{L}\right),
$$

with energies

$$
E_n=\frac{n^2\pi^2\hbar^2}{2mL^2}.
$$

In particular, the ground-state energy is

$$
E_1=\frac{\pi^2\hbar^2}{2mL^2}\neq0.
$$

A confined particle cannot be at rest: it has **zero-point energy**.

The uncertainty relation explains why the lowest energy cannot vanish. The particle is confined to a finite interval, so

$$
\Delta x\lesssim L.
$$

If the particle were at rest, momentum would have the definite value $p=0$, so $\Delta p=0$. The uncertainty relation would then require $\Delta x\geq\infty$, which contradicts confinement.

Therefore

$$
\Delta p\gtrsim\frac{\hbar}{L}.
$$

For a symmetric ground state, $\langle p\rangle=0$, so

$$
\langle p^2\rangle
\geq
(\Delta p)^2
\gtrsim
\frac{\hbar^2}{L^2}.
$$

The corresponding energy estimate is

$$
\langle E\rangle
=
\frac{\langle p^2\rangle}{2m}
\gtrsim
\frac{\hbar^2}{2mL^2}.
$$

This gives the correct scale. The exact Schrödinger solution contains the additional factor $\pi^2$, but the dependence on $L$ and on the mass is the same.

**Confining a particle to a finite region therefore implies a positive ground-state energy**, because the Fourier transform of a function with finite support cannot be a delta function at $k=0$.

### § 8.3. Tunneling without the “borrowed energy” story

For a rectangular potential barrier of height $V>E$, the time-independent Schrödinger equation inside the barrier is

$$
-\frac{\hbar^2}{2m}\psi''+V\psi=E\psi.
$$

Rearranging,

$$
\psi''
=
\frac{2m(V-E)}{\hbar^2}\psi
=
\kappa^2\psi,
$$

where

$$
\kappa=\sqrt{\frac{2m(V-E)}{\hbar^2}}.
$$

The solution is not oscillatory. It is exponential:

$$
\psi(x)=Ae^{-\kappa x}+Be^{+\kappa x}.
$$

Inside the barrier, the effective wave number is imaginary, because $k^2<0$. There is therefore no propagating wave; the amplitude decays or grows exponentially. This is an **evanescent wave**, a term also used in optics when light undergoes total internal reflection and leaves an exponentially decaying tail beyond the reflecting boundary.

Why is there a finite probability of finding the particle on the other side?

The answer is **not** that uncertainty allows the particle to “borrow” energy for a short time. That picture sounds appealing, but it is not physically accurate: no borrowing process occurs, and there is no interval $\Delta t$ after which the particle must “return” the energy.

The explanation comes from solving the equation with the boundary conditions at the two edges of the barrier. Solving the Schrödinger equation while requiring continuity of $\psi$ and $\psi'$ at the two edges of the barrier connects three pieces:

- an incoming and reflected wave on the left, where $x<0$;
- an exponentially varying solution inside the barrier, where $0\leq x\leq L$;
- an outgoing wave on the right, where $x>L$.

The amplitude at the far edge of the barrier, $x=L$, is smaller than the amplitude at the near edge by a factor of approximately

$$
e^{-\kappa L}.
$$

The transmission probability is determined by the squared amplitudes, so approximately

$$
T\approx e^{-2\kappa L}.
$$

No energy is borrowed. The wavefunction is continuous across the interfaces and remains nonzero through a finite barrier, although it is exponentially suppressed.

The physical name for this phenomenon is **tunneling**. Its most basic example is nuclear $\alpha$ decay: an $\alpha$ particle—two protons and two neutrons—is trapped in a nuclear potential well, while a Coulomb barrier separates it from the exterior. Its emission is a tunneling process, and the isotope lifetime is controlled by the factor $e^{-2\kappa L}$, with $\kappa$ determined by the energy difference $V-E$.

---

## § 9. What the next Taylor term does to the packet

Return to the second-order term in the Taylor expansion of $\omega(k)$:

$$
\omega(k)
\approx
\omega_0+v_g\kappa+\frac{1}{2}\beta\kappa^2.
$$

For a free particle,

$$
\omega(k)=\frac{\hbar k^2}{2m},
$$

so

$$
\beta=\omega''(k_0)=\frac{\hbar}{m}.
$$

For a free particle, this expansion is **exact**, because $\omega(k)$ itself is a second-degree polynomial in $k$.

The quadratic term contributes an additional phase

$$
e^{-i\beta\kappa^2t/2}
$$

inside the envelope integral. The envelope is therefore no longer a function only of $x-v_gt$: its shape changes with time.

### A Gaussian initial packet

To see the result in closed form, consider the initial Gaussian packet

$$
\psi(x,0)
=
\frac{1}{(2\pi\sigma_0^2)^{1/4}}
 e^{ik_0x}
 e^{-x^2/(4\sigma_0^2)}.
$$

It has

$$
\langle x\rangle=0,
\qquad
\Delta x=\sigma_0,
$$

and mean momentum $\hbar k_0$.

Solving the free Schrödinger equation—or, equivalently, evaluating the wave-packet integral using $\omega(k)=\hbar k^2/(2m)$—gives

$$
\lvert\psi(x,t)\rvert^2
=
\frac{1}{\sqrt{2\pi\sigma^2(t)}}
\exp\left[
-\frac{(x-v_gt)^2}{2\sigma^2(t)}
\right],
$$

where

$$
\sigma^2(t)
=
\sigma_0^2
+
\left(
\frac{\hbar t}{2m\sigma_0}
\right)^2.
$$

### Reading the result

#### The width grows with time

Its width increases with time. Within the free equation, that increase is not reversed by any restoring force. The factor

$$
\frac{\hbar}{m},
$$

which is exactly $\beta$, sets the physical spreading rate.

Because $\omega(k)$ is quadratic in $k$, different $k$ components travel with different velocities. The destructive interference that creates a narrow envelope at $t=0$ is gradually lost, so the packet broadens.

#### Why the effect disappears macroscopically

The characteristic time is

$$
\tau\sim\frac{m\sigma_0^2}{\hbar}.
$$

For a proton with an initial uncertainty of $1$ nanometer,

$$
\tau
\sim
\frac{10^{-27}\cdot10^{-18}}{10^{-34}}
\sim
10^{-11}\ \text{seconds}.
$$

For a billiard ball with an initial uncertainty of $1$ micrometer,

$$
\tau\sim10^{27}\ \text{seconds},
$$

roughly a billion times the age of the universe. Wave packets of macroscopic objects therefore do not spread by a detectable amount, and classical behavior dominates.

### Why the equation resembles diffusion

The free Schrödinger equation

$$
i\hbar\partial_t\psi
=
-\frac{\hbar^2}{2m}\partial_x^2\psi
$$

resembles the heat equation

$$
\partial_tu=D\partial_x^2u
$$

with an imaginary diffusion coefficient

$$
D=\frac{i\hbar}{2m}.
$$

After the Wick rotation

$$
t\to-i\tau,
$$

the Schrödinger equation becomes exactly a heat equation with

$$
D=\frac{\hbar}{2m}.
$$

The spreading of the packet corresponds to the spreading of heat. One can sometimes obtain the packet's evolution from the classical diffusion equation and then analytically continue the result. The same continuation appears in the path-integral formulation of quantum mechanics.

---

## § 10. The same argument with relativistic energy

So far, we used the classical nonrelativistic energy

$$
E=\frac{p^2}{2m}.
$$

For a relativistic particle,

$$
E^2=(pc)^2+(mc^2)^2.
$$

Using

$$
E=\hbar\omega,
\qquad
p=\hbar k,
$$

whose validity does not depend on the nonrelativistic case, gives the dispersion relation

$$
\omega^2(k)
=
c^2k^2
+
\left(\frac{mc^2}{\hbar}\right)^2.
$$

This relation has a **frequency gap**:

$$
\omega\geq\frac{mc^2}{\hbar}
$$

for every $k$, including $k=0$. There is a minimum frequency set by the rest mass. Like the deep-water dispersion relation, it is nonlinear and therefore dispersive.

### The packet still moves with the particle

Differentiate $\omega(k)$:

$$
v_g
=
\frac{d\omega}{dk}
=
\frac{c^2k}{\omega}
=
\frac{c^2p}{E}.
$$

This agrees with the relativistic particle velocity, because the identity

$$
v=\frac{dE}{dp}
$$

remains valid for

$$
E=\sqrt{p^2c^2+m^2c^4}.
$$

The same argument for $p=\hbar k$ therefore applies in the relativistic case. The requirement $v_g=v$ again gives

$$
\frac{dp}{dk}=\hbar.
$$

### The phase may move faster than light

The phase velocity is

$$
v_p
=
\frac{\omega}{k}
=
\frac{E}{p}.
$$

For a particle with nonzero rest mass, $E>pc$, so

$$
v_p>c.
$$

For a massive particle, the phase velocity is therefore greater than $c$. This does not violate relativity. The phase itself carries no information: it is the phase of an infinite plane wave with no beginning or end. Information lies in changes of phase or amplitude, which propagate with the group velocity, and that velocity remains below $c$.

### The corresponding relativistic wave equation

The dispersion relation

$$
\omega^2
=
c^2k^2
+
\left(\frac{mc^2}{\hbar}\right)^2
$$

can be translated using the same correspondences

$$
\omega\leftrightarrow i\partial_t,
\qquad
k\leftrightarrow-i\partial_x.
$$

This gives

$$
-\partial_t^2\psi
=
-c^2\partial_x^2\psi
+
\left(\frac{mc^2}{\hbar}\right)^2\psi.
$$

Equivalently,

$$
\boxed{
\left(
\partial_t^2
-c^2\partial_x^2
+\frac{m^2c^4}{\hbar^2}
\right)\psi=0
}.
$$

This is the **Klein–Gordon equation**. It is second order in time, unlike the Schrödinger equation, which is first order in time.

That difference is the source of interpretation problems: the probability density suggested by the equation can become negative. These problems eventually led quantum theory to the field-theoretic description, in which $\psi$ is interpreted not as the wavefunction of a single particle, but as an operator-valued field that describes the creation and annihilation of particles.

---

## § 11. The chain of ideas

The conceptual path is now complete.

The Fourier uncertainty inequality is mathematics. To turn it into physics, we need an identification between $k$ and $p$. The relation

$$
p=\hbar k
$$

is not introduced in isolation: it is the relation that makes the group velocity of the wave packet agree with the classical velocity of the particle.

The resulting dispersion relation,

$$
\omega(k)=\frac{\hbar k^2}{2m},
$$

determines the Schrödinger equation through the algebraic action of derivatives on plane waves. Heisenberg's uncertainty principle then becomes the Fourier uncertainty inequality written in physical variables. Zero-point energy follows from confinement in space, and tunneling follows from the nonoscillatory solution of the Schrödinger equation together with continuous boundary conditions. The second-order curvature of $\omega(k)$ explains the spreading of a wave packet, and the same reasoning with relativistic energy leads to the Klein–Gordon equation.

The main conceptual point is:

> The main point is that the connection between wave number and momentum is not left unexplained. The relation $p=\hbar k$ is the one that makes the motion of the wave packet agree with the classical motion of the particle. From there, the Fourier description connects naturally to the Schrödinger equation, uncertainty, wave-packet spreading, and the relativistic extension.
