# How Your Laptop Knows the Lid Is Closed

When a laptop screen turns off as you close it, it needs to detect a simple physical state: is the lid open or shut?

While an accelerometer detects motion, knowing whether the lid remains closed requires a different approach. Laptops use a two-part mechanism: a passive permanent magnet in the lid and a Hall-effect sensor in the base.

## § 1. Why accelerometers aren't the ideal fit {#sec-1}

"Lid closed" is a static state, whereas an accelerometer measures motion or orientation relative to gravity. Once the lid stops moving, a single accelerometer can only tell how the laptop is oriented in space—not the angle between the lid and the base.

An accelerometer setup introduces a few key trade-offs:

*   **Integrating motion data:** Tracking lid movement over time to estimate its final position accumulates sensor drift, leading to inaccurate readings.
*   **Using dual accelerometers:** Placing one sensor in the lid and another in the base allows it to compare gravity vectors and calculate the exact angle between them. However, putting an active sensor in the lid requires routing power and data wires from the base up into the lid. Those wires bend every time the lid opens or closes, and eventually break.

> The constraint is: whatever sits in the lid should be passive—no power and no wiring. A permanent magnet satisfies that constraint.

## § 2. Hall-Effect Detection Mechanism {#sec-2}

A passive permanent magnet is embedded in the display assembly. A Hall-effect sensor integrated circuit (IC) sits on a circuit board in the base, positioned to align with the magnet when the lid closes.

Because the magnet is passive, it requires no power or electrical connection. Its static magnetic field penetrates nonmagnetic materials without interference. While aluminum and copper oppose dynamic fields through eddy currents, and ferromagnetic metals redirect magnetic lines, standard materials do not shield against static magnetic fields.

When the magnetic flux density at the sensor exceeds its operating threshold, the sensor toggles a digital signal line connected directly to the embedded controller (EC), updating the lid state bit.

{% include visualization.html src="laptop-lid-magnet-sensor-placement.html" title="How the lid magnet approaches the Hall sensor in the laptop base" %}

## § 3. The Hall effect {#sec-3}

A magnetic field exerts a force on a moving charge. A charge $q$ with velocity $\mathbf{v}$ in a magnetic field $\mathbf{B}$ experiences the Lorentz force

$$
\mathbf{F} = q\,\mathbf{v} \times \mathbf{B}.
$$

The force is perpendicular to both $\mathbf{v}$ and $\mathbf{B}$. Its magnitude is $qvB$ when the velocity and field are perpendicular, and it vanishes when they are parallel.

Inside a conductor or semiconductor, carriers move in two ways at once. A voltage across the material accelerates them, and collisions with the lattice keep resetting that acceleration, so on average each carrier moves along the applied field at a small steady velocity $v_d$. Superimposed on top of this is random scattering in every direction; averaged over many carriers it contributes nothing to the net motion, and only $v_d$ enters the Lorentz force.

The sensing element itself is a thin rectangular slab of semiconductor with four contacts—two on the short ends and two on the long sides. We refer to it as the **Hall plate**. The measurement uses it as follows:

1. Drive a current $I$ lengthwise through the plate between the two end contacts.
2. Apply a magnetic field $B$ perpendicular to its flat face.
3. The moving carriers are deflected sideways and begin accumulating along one of the long edges.

{% include visualization.html src="hall-effect-sensor-signal-chain.html" title="From magnetic deflection in a Hall plate to a thresholded digital output" %}

The accumulated charge on that edge, together with the opposite depletion on the other edge, sets up an electric field $E$ pointing across the plate from one long side to the other. A charge $q$ in this field feels an electric force $qE$, opposite in direction to the magnetic deflection. Charge continues to build up until the two forces balance:

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


## § 4. From millivolts to a bit {#sec-4}

The raw Hall voltage is small, so the sensor IC amplifies it and compares it with an internal threshold. Two practical problems must be handled before that comparison can serve as a reliable lid switch.

### § 4.1. Cancelling plate offset {#sec-4-1}

A real Hall plate is not perfectly symmetric. The four contacts are never placed at exactly matching positions, and the slab itself has small variations in thickness and internal uniformity. Any of these can produce a nonzero output even when $B=0$, as though a constant false field were present.

The sensor compensates by rapidly rotating which contact pair drives the current lengthwise and which pair measures the voltage across the plate. The genuine Hall contribution remains tied to the external magnetic field, while the false contribution from geometric asymmetry changes sign under the contact rotation and averages away. This high-speed swapping is commonly described as **chopping**.

### § 4.2. Preventing chatter {#sec-4-2}

A single threshold would misbehave when the field at the sensor sits right near that threshold value. A small vibration would then push the field repeatedly above and below it, causing the output to flicker.

The solution is **hysteresis**: the sensor uses two different thresholds.

- The output changes to the detected state only after the field crosses the stronger threshold.
- It returns to the undetected state only after the field falls below a weaker threshold.

Once the lid has triggered the sensor, small variations around the first threshold cannot immediately reverse the output. The resulting HIGH or LOW signal is sent on one digital line to the **embedded controller (EC)**, the always-on controller that handles lid events and power management.

## § 5. Why the magnet polarity need not matter {#sec-5}

The sign of $V_H$ follows the sign of $B$, so reversing which magnet pole faces the sensor reverses the Hall voltage.

A laptop does not need to distinguish north from south; it needs only to know whether the magnet is close enough. An **omnipolar** Hall switch therefore compares the amplified signal with thresholds of both signs and triggers when the field magnitude is large enough:

$$
\lvert B\rvert_{\text{sensor}} > B_{\text{threshold}}
\qquad\Longleftrightarrow\qquad
\text{lid closed}.
$$

This makes the switch insensitive to which pole of the magnet faces the sensor.

## § 6. Why the sensor barely uses power {#sec-6}

The lid sensor must remain available while the laptop sleeps. Holding a steady current through the Hall plate at all times would draw around a milliampere, and a circuit that runs even while the machine is off should draw far less than that.

Instead, the sensor is duty-cycled:

1. Turn on the current through the plate for a few tens of microseconds.
2. Measure the field and latch the output state.
3. Return most of the circuit to sleep for roughly $10$–$100\,\mathrm{ms}$.
4. Repeat.

A lid closes on a human time scale, so sampling even around $20\,\mathrm{Hz}$ detects the event without a noticeable delay. The average current can then fall into the low-microampere range at $1.8$–$3.3\,\mathrm{V}$, corresponding to only a few microwatts.

The complete mechanism therefore divides the job cleanly: the lid carries a passive magnet, the base contains all powered electronics, and the Hall sensor turns proximity into a stable, low-power digital state without any wire crossing between the two.