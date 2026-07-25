# How Your Laptop Knows the Lid Is Closed

A laptop turns its screen off when you close the lid, so something has to tell it that the lid is shut. An accelerometer sounds like the obvious choice: closing a lid is motion, and accelerometers measure motion.

The system, however, does not need to know merely that the lid *moved*. It needs a stable answer after the motion has ended. That distinction leads to the mechanism used in practice: a passive permanent magnet in the lid and a powered Hall-effect sensor in the base.

---

## § 1. Why not an accelerometer? {#sec-1}

“Lid closed” is a **state**, not a motion. Once the lid stops, an accelerometer measures gravity. That reveals the orientation of the sensor relative to the Earth, but not whether the hinge is at $5°$, $30°$, or fully closed.

One could integrate the acceleration signal to estimate position, but integrating noisy measurements accumulates drift. The beginning of a motion that stops at $60°$ can also look like the beginning of a motion that continues until the lid is shut; the final state is known only after the motion is complete.

Two accelerometers could determine the hinge angle directly:

- one in the lid;
- one in the base.

Subtracting their gravity vectors would reveal the relative orientation of the two halves without integration. But the lid sensor would need power and a signal connection, so conductors would have to cross the hinge and flex every time the laptop is opened or closed.

> The useful constraint is therefore simple: whatever sits in the lid should be passive—no power and no signal wire. A permanent magnet satisfies that constraint.

---

## § 2. The physical arrangement {#sec-2}

A small permanent magnet is embedded in the display assembly. A Hall-effect sensor IC is soldered to a circuit board in the laptop base, at the point that approaches the magnet when the lid closes.

The magnet does not need an electrical connection. Its static magnetic field passes through the ordinary nonmagnetic materials surrounding the placement. Conductive casing materials can oppose *changing* fields through eddy currents, while ferromagnetic materials can redirect a field, but an ordinary laptop enclosure is not a static magnetic shield. The important design variables are therefore the magnet–sensor distance and their alignment near the closed position.

When the field at the sensor crosses its detection threshold, the sensor changes its digital output. The embedded controller reads that line as the lid state.

{% include visualization.html src="laptop-lid-magnet-sensor-placement.html" title="How the lid magnet approaches the Hall sensor in the laptop base" %}

The lid side of the mechanism is now clear. The remaining question is how the sensor converts a nearby magnetic field into a clean digital bit.

---

## § 3. The Hall effect {#sec-3}

A magnetic field exerts a force on a moving charge. A charge $q$ with velocity $\mathbf{v}$ in a magnetic field $\mathbf{B}$ experiences the Lorentz force

$$
\mathbf{F} = q\,\mathbf{v} \times \mathbf{B}.
$$

The force is perpendicular to both $\mathbf{v}$ and $\mathbf{B}$. Its magnitude is $qvB$ when the velocity and field are perpendicular, and it vanishes when they are parallel.

Inside a conductor or semiconductor, carriers have random thermal motion as well as a small average **drift velocity** $v_d$ set by the applied current. The random motion averages out. The drift gives the magnetic field a preferred direction to deflect.

Consider a thin semiconductor plate:

1. Drive a current $I$ lengthwise through the plate.
2. Apply a magnetic field $B$ perpendicular to its flat face.
3. The moving carriers are deflected sideways and begin accumulating along one edge.

The accumulated charge creates a transverse electric field $E$. Charge continues to build up until the electric force balances the magnetic force:

$$
qE = qv_dB
\qquad\Longrightarrow\qquad
E = v_dB.
$$

Across a plate of width $w$, this field produces the **Hall voltage**

$$
V_H = Ew = v_dBw.
$$

The current through a plate of thickness $t$ is

$$
I = nqv_d(wt),
$$

where $n$ is the carrier density. Eliminating $v_d$ gives

$$
V_H = \frac{IB}{nqt}.
$$

Two consequences matter for a lid sensor:

- **The response is linear.** The Hall voltage follows the magnetic field, including its sign. Doubling $B$ doubles $V_H$.
- **Semiconductors make the signal usable.** Because $V_H$ is inversely proportional to the carrier density $n$, a semiconductor can produce a much larger Hall voltage than a metal carrying the same current in the same geometry.

{% include visualization.html src="hall-effect-sensor-signal-chain.html" title="From magnetic deflection in a Hall plate to a thresholded digital output" %}

---

## § 4. From millivolts to a bit {#sec-4}

The raw Hall voltage is small, so the sensor IC amplifies it and compares it with an internal threshold. Two practical problems must be handled before that comparison can serve as a reliable lid switch.

### § 4.1. Cancelling plate offset {#sec-4-1}

A real Hall plate is not perfectly symmetric. Small differences in its shape, contacts, or doping can produce a nonzero output even when $B=0$, as though a constant false field were present.

The sensor compensates by rapidly rotating which contact pair drives the current and which pair measures the transverse voltage. The genuine Hall contribution remains tied to the external magnetic field, while geometric offsets change under the contact rotation and can be averaged away. This high-speed swapping is commonly described as **chopping**.

### § 4.2. Preventing chatter {#sec-4-2}

A single threshold would be unstable near the switching distance. A small vibration could move the field repeatedly above and below the threshold, causing the output to flicker.

The solution is **hysteresis**: the sensor uses two different thresholds.

- The output changes to the detected state only after the field crosses the stronger threshold.
- It returns to the undetected state only after the field falls below a weaker threshold.

Once the lid has triggered the sensor, small variations around the first threshold cannot immediately reverse the output. The resulting HIGH or LOW signal is sent on one digital line to the **embedded controller (EC)**, the always-on controller that handles lid events and power management.

---

## § 5. Why the magnet polarity need not matter {#sec-5}

The sign of $V_H$ follows the sign of $B$, so reversing which magnet pole faces the sensor reverses the Hall voltage.

A laptop does not need to distinguish north from south; it needs only to know whether the magnet is close enough. An **omnipolar** Hall switch therefore compares the amplified signal with thresholds of both signs and triggers when the field magnitude is large enough:

$$
\lvert B\rvert_{\text{sensor}} > B_{\text{threshold}}
\qquad\Longleftrightarrow\qquad
\text{lid closed}.
$$

This makes the switch insensitive to which pole of the magnet faces the sensor.

---

## § 6. Why the sensor barely uses power {#sec-6}

The lid sensor must remain available while the laptop sleeps. Continuously driving the Hall plate would consume roughly a milliampere—small during normal operation, but unnecessarily large for an always-on sleep-state circuit.

Instead, the sensor is duty-cycled:

1. Turn on the Hall-plate current for a few tens of microseconds.
2. Measure the field and latch the output state.
3. Return most of the circuit to sleep for roughly $10$–$100\,\mathrm{ms}$.
4. Repeat.

A lid closes on a human time scale, so sampling even around $20\,\mathrm{Hz}$ detects the event without a noticeable delay. The average current can then fall into the low-microampere range at $1.8$–$3.3\,\mathrm{V}$, corresponding to only a few microwatts.

The complete mechanism therefore divides the job cleanly: the lid carries a passive magnet, the base contains all powered electronics, and the Hall sensor turns proximity into a stable, low-power digital state without placing a wire through the hinge.
