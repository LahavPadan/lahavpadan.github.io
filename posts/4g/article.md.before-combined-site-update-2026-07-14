
---

Throughout, **UE** is the mobile ("user equipment," which includes phones, dongles, IoT devices), **eNodeB** is the tower (both the radio and the digital baseband processor sitting under it), and **MME/SGW/PGW/HSS** are the four principal nodes of the core; each will be introduced with what it does before it is named.

---

## § 1. The problem 4G was designed to solve

### 1.1. What broke in 3G

3G was a circuit-switched architecture stretched to carry packets. The radio layer was **code-division multiple access (CDMA)**: every user's bits are multiplied by a distinct pseudo-random spreading sequence, all users transmit on the same frequency simultaneously, and the receiver separates them by correlating against each expected sequence. This is elegant in a static point-to-point link but has three properties that made it fail once smartphones arrived:

1. **Users interfere with each other in soft proportion.** More active users means more background noise for every other user, because spreading codes are not exactly orthogonal in the presence of channel delays. Capacity scales gracefully but tops out well below the raw spectrum allows.

2. **Peak throughput is capped by the chip rate.** In UMTS the chip rate is 3.84 million chips per second, and any given user can only be assigned a fraction of that. Achieving 100 Mb/s to a single user would require restructuring the entire chip allocation for that one user, which the architecture cannot do dynamically.

3. **Control logic sits in a separate node.** The tower (a "NodeB") does little but modulate and demodulate; a **Radio Network Controller (RNC)** upstream does the scheduling, admission control, handover decisions. Every scheduling decision incurs a round trip to the RNC. This was fine for voice calls (which don't need per-millisecond decisions) but crippling for packet data (which does).

### 1.2. The two hard turns

The engineers who designed LTE around 2005–2008 made two decisive architectural changes:

**Turn 1 — Kill CDMA, adopt OFDM.** Instead of overlapping users in the code domain, put them in orthogonal frequency bins. This gives per-bin channel state, per-bin scheduling, and no user-vs-user interference *by construction*. § 3 explains why this specifically requires OFDM (and not just "any" multicarrier scheme).

**Turn 2 — Flatten the architecture.** Delete the RNC. Fuse its scheduler into the tower itself. The tower is now the "evolved NodeB" or **eNodeB**, and all real-time radio decisions happen there at the millisecond timescale. The core network no longer touches radio decisions; it handles identity, mobility across large geographies, IP address assignment, and policy.

Every specific choice in LTE — the 1 ms scheduling interval, the 15 kHz subcarrier spacing, the 12-subcarrier resource block, the blind-decoding search-space design — traces back to these two decisions plus one external anchor. § 4 shows the anchors.

### 1.3. The commercial name and what it does not mean

"4G LTE" as a marketing term compresses two orthogonal claims. **LTE** identifies the physical layer and protocol stack (3GPP Release 8 and later, packet-switched). **4G** is an ITU marketing category (originally IMT-Advanced, requiring peak rates the first LTE releases did not meet — the label was retroactively softened for compatibility). When a spec cites LTE it means the technical standard; when a phone says "4G" it means "connected to something that meets 3GPP LTE at any release."

---

## § 2. The flat architecture

### 2.1. The two subsystems

A cellular network has two things that must exist at completely different scales:

- **The radio access network (RAN)** must decide what to do every millisecond, for every phone within antenna range. Its knowledge is local — it does not need to know that this same subscriber's home records are in a data centre a thousand kilometres away.

- **The core network (EPC — Evolved Packet Core)** must track that the subscriber exists, is authorised, is not roaming beyond their plan, has a valid IP address, and can be reached when someone tries to call. Its knowledge is global — it does not need to know which specific tower the subscriber is talking to *right now*; it needs to know the tracking area (an aggregate of hundreds of towers) so it can page when needed.

This mismatch — fast-and-local vs slow-and-global — is the reason the two subsystems must be interfaced but must not be merged. Every LTE architectural decision falls out of respecting this split.

### 2.2. The RAN: the eNodeB alone

In 4G the RAN consists of **eNodeBs** and nothing else. Every eNodeB is autonomous. It contains:

- The radio front-end (antennas, power amplifiers, low-noise amplifiers).
- The baseband processor that does FFTs, decodes turbo codes, runs the HARQ state machine.
- The **MAC scheduler** — a decision engine that, every millisecond, decides which of its currently-attached UEs will transmit or receive on which resource blocks with which modulation.
- Enough logic to run its half of any handover to a neighbouring eNodeB (§ 21.3).

Neighbouring eNodeBs talk to each other directly, without the core, over an interface called **X2** (§ 21.6). This is how a handover between adjacent towers of the same operator completes in tens of milliseconds instead of hundreds.

### 2.3. The EPC: four principal nodes

The core is separated into distinct nodes because the *rate* at which each function operates is different:

| Node | Full name | Rate of operation | What it does |
|---|---|---|---|
| **MME** | Mobility Management Entity | Seconds | Signalling with the UE about identity, security, tracking-area updates. Chooses the SGW and PGW for a new session. Never touches user data packets. |
| **SGW** | Serving Gateway | Milliseconds (packet forwarding) | Forwards user IP packets between the eNodeB and the PGW. Acts as the anchor when handing over between eNodeBs (so the PGW does not see radio-level churn). |
| **PGW** | PDN Gateway | Milliseconds (packet forwarding) | Assigns the UE its public IP address, sits at the boundary to the outside world, enforces per-flow policy and billing. "PDN" is "Packet Data Network" — the outside, whether the internet, an IMS network, or a corporate VPN. |
| **HSS** | Home Subscriber Server | Hours to days (mostly reads) | The subscriber master database. Holds the permanent SIM identity, the shared secret key for authentication, the subscription profile (which services this subscriber is entitled to). |

The MME is what a **VLR** and **MSC** together were in the 2G/3G era, but IP-native. The HSS is what the **HLR** was, but speaks a modern authentication and authorisation protocol (**Diameter** — § 20.5) instead of the trust-everyone SS7 signalling system that 2G/3G used.

### 2.4. Control plane and user plane

Every packet in LTE belongs to one of two conceptual planes:

- **Control plane** carries *signalling*: "connect this UE," "authenticate this UE," "update this UE's tracking area," "hand this UE over to that neighbour." Kilobits per second per UE, but every message is small, discrete, and often reliability-critical.
- **User plane** carries *user IP packets*: web browsing, video, VoLTE audio. Gigabits per second in aggregate; reliability is handled by TCP or by the application; the network just forwards.

They are physically separated even between the same two nodes: the eNodeB has a control connection to the MME (**S1-MME**) and, in parallel, a user-plane connection to the SGW (**S1-U**). This is not for the volume difference alone; it is because their operational semantics are different. Signalling wants message-oriented, ordered, retransmit-if-lost delivery; user data wants "just forward" (see § 21.2 for why the transport protocols differ accordingly).

### 2.5. Access stratum and non-access stratum

Perpendicular to control-vs-user is a second split unique to cellular architectures: **AS** (Access Stratum) versus **NAS** (Non-Access Stratum). The distinction is *where the message is terminated*, not what it carries:

- **AS messages** are terminated at the eNodeB. The tower reads them, acts on them, does not forward them. These are radio-specific: "give me an uplink grant," "I am about to lose signal, prepare a handover," "increase your transmit power to me."
- **NAS messages** are terminated at the MME (control plane) or PGW (user plane). The eNodeB forwards them transparently — it holds encrypted NAS packets it cannot read. These are identity- and network-specific: "here is my identity, please authenticate me," "I need an IP address on the `internet` APN" (APN = Access Point Name, the identifier for one external IP network the operator connects to; see § 17.3 for how APNs anchor bearers).

The AS/NAS split has direct security consequences (§ 20): NAS traffic gets one layer of encryption keyed to a key the MME derives; AS traffic gets a *second* layer keyed to a key the MME hands down to the eNodeB. The two ciphers protect against different adversaries (radio-local vs backhaul).

---

## § 3. Why OFDM: multipath, coherence bandwidth, the CP diagonalization

Before naming the constants (that comes in § 4), we need to see *why* orthogonal frequency-division multiplexing is the specific waveform that solves the mobile-radio problem — and specifically why the receiver ends up being one complex multiplication per subcarrier.

### 3.1. The multipath problem

A signal emitted from a mobile phone reaches the tower along many paths: a direct line-of-sight, if it exists, plus reflections from buildings, ground, vehicles, and internal reflections in the phone's near-field environment. Each path has a different length, hence a different arrival time. If the transmitted signal is a stream of symbols with symbol period $T$, the received signal at time $t$ is a sum

$$r(t) = \sum_i \alpha_i \, s(t - \tau_i)$$

with $\alpha_i$ the complex gain of path $i$ and $\tau_i$ its delay. The largest $\tau_i - \tau_0$ is the **delay spread** $T_m$. In an urban environment with reflections off buildings a few hundred metres away, $T_m$ is on the order of $1$–$5\,\mu\text{s}$.

If the symbol period $T$ is comparable to $T_m$ or smaller, consecutive symbols overlap at the receiver — this is **intersymbol interference (ISI)**. The receiver cannot tell whether the signal near time $t$ is symbol number $k$ arriving via a long path or symbol number $k+1$ arriving via a short path.

### 3.2. Coherence bandwidth and its reciprocal relationship with delay spread

Take the Fourier transform of the multipath channel's impulse response $h(t) = \sum_i \alpha_i \delta(t - \tau_i)$:

$$H(f) = \sum_i \alpha_i \, e^{-j 2\pi f \tau_i}.$$

Two frequencies $f$ and $f + \Delta f$ have channel responses whose phase differs by $2\pi \Delta f \cdot \tau_i$ for each path. As long as $\Delta f \cdot T_m \ll 1$, the phase difference across paths is small and $H(f) \approx H(f + \Delta f)$: the channel is approximately flat over that frequency interval. Beyond that scale, distinct paths start interfering in opposite phase at $f + \Delta f$ compared to $f$, and the channel gain becomes uncorrelated. The scale at which this transition happens is the **coherence bandwidth**

$$B_c \approx \frac{1}{T_m}.$$

For a typical urban macrocell with $T_m \approx 5\,\mu\text{s}$, $B_c \approx 200\,\text{kHz}$.

### 3.3. Flat vs frequency-selective fading — the key design consequence

A radio channel is called **flat** over a band $B$ if $B \ll B_c$ and **frequency-selective** if $B$ is on the order of $B_c$ or larger. LTE's radio channel bandwidth is at most 20 MHz — a hundred times the coherence bandwidth. So the channel *is* frequency-selective. Different frequencies within a single 20 MHz LTE carrier have completely different gain and phase, and the receiver cannot equalise them with a single scalar.

The idea of OFDM is to slice the wide channel into many narrow subcarriers, each so narrow that within a single subcarrier the channel is flat. The receiver then equalises each subcarrier independently, with one complex scalar.

For this to be feasible, the subcarrier spacing $\Delta f$ must satisfy $\Delta f \ll B_c$. With $B_c \approx 200\,\text{kHz}$, a spacing of $\Delta f = 15\,\text{kHz}$ gives roughly $200/15 \approx 13$ subcarriers per coherence bandwidth, which is enough that each subcarrier sees an essentially flat channel. This is where the specific $15\,\text{kHz}$ comes from; § 4 shows the other constraints that pin the exact value.

### 3.4. The cyclic prefix as diagonalizer — the actual algebra

The naming "OFDM" says "orthogonal frequency-division multiplexing" — the subcarriers are orthogonal. But when you send them through a multipath channel with delay spread, orthogonality is destroyed unless you do something specific. That specific thing is the **cyclic prefix (CP)**.

The rest of this subsection derives, in one shot, why the CP is the exact structure that turns the receiver's job into "one complex division per subcarrier." The chain has three steps: (a) express the received samples as a matrix product; (b) observe that this matrix is not diagonalizable by the DFT; (c) show that the CP transforms it into a matrix that *is*.

#### (a) Received samples as a matrix product

Consider a block of $N$ samples $x[0], x[1], \ldots, x[N-1]$ that we intend to transmit as one OFDM symbol. In the frequency domain, these $N$ samples are the IFFT of $N$ complex-valued modulation symbols $X[0], \ldots, X[N-1]$ (one per subcarrier).

The multipath channel has impulse response $h[0], h[1], \ldots, h[L]$ — that is, at most $L$ samples of delay spread. The received samples are the linear convolution

$$y[n] = \sum_{k=0}^{L} h[k] \, x[n-k].$$

The trouble is what happens to the samples $x[n-k]$ when $n-k$ is negative: those samples belong to the *previous* OFDM block. The receiver has no clean way to remove that contamination from the beginning of $y$.

#### (b) The matrix is Toeplitz, hence not DFT-diagonalizable

Write the linear convolution as $\mathbf{y} = H_{\text{lin}} \mathbf{x} + \text{(ISI from previous block)}$. Assuming for a moment there is no previous block (or ignoring the contamination at the start), $H_{\text{lin}}$ for $N=6, L=2$ is

$$H_{\text{lin}} = \begin{pmatrix}
h_0 & 0   & 0   & 0   & 0   & 0 \\
h_1 & h_0 & 0   & 0   & 0   & 0 \\
h_2 & h_1 & h_0 & 0   & 0   & 0 \\
0   & h_2 & h_1 & h_0 & 0   & 0 \\
0   & 0   & h_2 & h_1 & h_0 & 0 \\
0   & 0   & 0   & h_2 & h_1 & h_0
\end{pmatrix}.$$

This is a lower-triangular **Toeplitz** matrix (each descending diagonal is constant, but the top-right corner is zero rather than wrapping around). Two properties of Toeplitz matrices matter here:

- Their eigenvectors are *not* the DFT basis. The DFT does not diagonalize $H_{\text{lin}}$.
- If we naively took $Y = F \mathbf{y}$, the result would not equal $\Lambda X$ for any diagonal $\Lambda$. There would be inter-carrier cross-terms.

So if we did nothing about the block-boundary problem, each subcarrier's decoded value would be a linear combination of *all* subcarriers' transmitted values — no per-subcarrier equalisation, and the whole reason for using OFDM would collapse.

#### (c) The cyclic prefix restores the wrap-around

**The trick.** Before transmitting, take the last $L_{\text{CP}}$ samples of the block and prepend them to the front. Transmit

$$\underbrace{x[N-L_{\text{CP}}], \ldots, x[N-1]}_{\text{CP: last } L_{\text{CP}} \text{ samples copied to front}}, \; x[0], x[1], \ldots, x[N-1].$$

At the receiver, discard the first $L_{\text{CP}}$ received samples (which are contaminated by the tail of the previous OFDM symbol). What remains, provided $L_{\text{CP}} \geq L$, is $N$ samples where each $y[n]$ depends on $x[n], x[n-1], \ldots, x[n-L]$, and the "negative index" samples $x[n-k]$ for $n < k$ are supplied by the copies at the front. Concretely, $x[-1]$ becomes $x[N-1]$, $x[-2]$ becomes $x[N-2]$, and so on — the block *wraps around*.

Writing the resulting matrix for the same $N=6, L=2$ case:

$$H_{\text{circ}} = \begin{pmatrix}
h_0 & 0   & 0   & 0   & \mathbf{h_2} & \mathbf{h_1} \\
h_1 & h_0 & 0   & 0   & 0   & \mathbf{h_2} \\
h_2 & h_1 & h_0 & 0   & 0   & 0 \\
0   & h_2 & h_1 & h_0 & 0   & 0 \\
0   & 0   & h_2 & h_1 & h_0 & 0 \\
0   & 0   & 0   & h_2 & h_1 & h_0
\end{pmatrix}.$$

The change is only in the upper-right corner (marked bold): instead of zeros, the coefficients $h_1, h_2$ that would have "fallen off the top" now wrap around to appear there. Every row is now a cyclic shift of the row above it — this is a **circulant** matrix.

#### The diagonalization

Circulant matrices have a remarkable property that Toeplitz matrices do not: they are diagonalized by the DFT. If $F$ is the unitary DFT matrix ($F_{km} = \frac{1}{\sqrt{N}} e^{-j 2\pi km/N}$), then any circulant matrix $H_{\text{circ}}$ satisfies

$$H_{\text{circ}} = F^H \Lambda F, \qquad \Lambda = \operatorname{diag}(H[0], H[1], \ldots, H[N-1])$$

where $H[k] = \sum_{n=0}^{L} h[n] e^{-j 2\pi kn/N}$ is the DFT of the channel impulse response — the channel's frequency response sampled at the subcarrier frequencies.

Take the DFT of the received block: $Y = F \mathbf{y} = F H_{\text{circ}} \mathbf{x} + F \mathbf{n} = \Lambda F \mathbf{x} + F \mathbf{n} = \Lambda X + N$. Because $\Lambda$ is diagonal, this reads componentwise as

$$Y[k] = H[k] \cdot X[k] + N[k], \qquad k = 0, 1, \ldots, N-1.$$

Each subcarrier is one independent scalar equation. The equaliser is one complex division, $\hat X[k] = Y[k] / H[k]$ — the **single-tap equaliser**.

*Where this affects LTE hardware.* The receiver's front-end is a single FFT block followed by $N$ parallel complex dividers; no equaliser tap chains, no matrix inversions per subframe. This is why a 2008 handset chipset could run a 2048-point FFT and a 1200-way divider at 15 kHz refresh, drawing tens of milliwatts, and still equalise a 20 MHz cellular channel.

### 3.5. What CP length is required

The CP works as long as $L_{\text{CP}} \geq L$, where $L$ is the delay spread in samples. In time units, the CP must exceed the delay spread:

$$T_{\text{CP}} \geq T_m.$$

For $T_m \approx 4.7\,\mu\text{s}$ (a working number for urban macrocells), LTE's standard "normal CP" of about $4.7\,\mu\text{s}$ is just barely sufficient. There is also an "extended CP" of about $16.7\,\mu\text{s}$ for deployments with very long delay spread (large rural cells, multi-hop reflections in mountainous terrain). The extended CP costs more overhead per symbol, so it is used only when needed.

### 3.6. Symbol duration is the reciprocal of subcarrier spacing

For any multicarrier scheme, if the subcarriers are spaced $\Delta f$ apart and are to remain orthogonal, the useful symbol duration must be

$$T_u = \frac{1}{\Delta f}.$$

This is fundamental Fourier: orthogonal sinusoids at $k \Delta f$ and $m \Delta f$ integrated over a window of length $T_u = 1/\Delta f$ produce $\delta_{km}$. Any shorter window and they overlap; any longer and you waste time.

For $\Delta f = 15\,\text{kHz}$, $T_u = 66.67\,\mu\text{s}$. Total OFDM symbol length including CP is $T_{\text{sym}} = T_u + T_{\text{CP}} \approx 71.4\,\mu\text{s}$ for normal CP.

### 3.7. The Doppler direction

The other constraint on $\Delta f$ comes from the *time* domain. A mobile UE at speed $v$ carrying a carrier at frequency $f_c$ produces a Doppler shift up to

$$f_d = \frac{v}{c} f_c.$$

At $f_c = 2\,\text{GHz}$ and $v = 350\,\text{km/h}$ (a high-speed train — LTE's design target for mobility), $f_d \approx 650\,\text{Hz}$. If the channel changes on this timescale, an OFDM symbol whose duration is comparable to $1/f_d$ will experience the channel changing *during* the symbol, breaking the assumption that the channel is constant over the FFT window. This introduces **inter-carrier interference (ICI)**: energy leaks from one subcarrier to its neighbours because the "constant $H[k]$" assumption fails.

Rule of thumb: for tolerable ICI, $\Delta f \geq 10 f_d$. At $650\,\text{Hz}$ this demands $\Delta f \geq 6.5\,\text{kHz}$.

So $\Delta f$ is sandwiched between two requirements:

- **From below** (delay spread / coherence bandwidth): $\Delta f \ll B_c$ so the channel is flat within a subcarrier — favours *smaller* $\Delta f$.
- **From above** (Doppler): $\Delta f \geq 10 f_d$ so the channel is static within a symbol — favours *larger* $\Delta f$.

$15\,\text{kHz}$ sits comfortably in the middle for the design targets of vehicular mobility on cellular bands below 3 GHz. (5G NR, which targets millimetre-wave bands where $f_c$ is 30$\times$ higher and thus $f_d$ is 30$\times$ higher, uses larger $\Delta f$ — 30, 60, 120 kHz. The design target moved and the constant moved with it.)

---

## § 4. Numerology: where every LTE constant comes from

### 4.1. External anchors — a warning about circular reasoning

The seductive but wrong way to justify LTE constants is by mutual consistency: "the TTI is 1 ms because HARQ needs 8 subframes," "there are 7 symbols per slot because that fits in 15 kHz numerology," "12 subcarriers per RB matches 180 kHz which matches coherence bandwidth" (where the 180 kHz was itself derived from $12 \times 15$). Every one of those chains loops on itself.

The valid justifications point *outside* LTE:

- **Silicon** — what the 2008 UE turbo decoder could do in a fixed time budget.
- **Inherited standards** — UMTS's 3.84 Mcps chip rate, which UMTS-to-LTE base stations had to preserve to reuse RF hardware.
- **Physical constants** — Doppler shifts at vehicular speeds, urban macrocell delay spreads, coherence bandwidth.
- **Divisibility structure** — the FFT sizes chosen must factor cleanly into the mixed-radix multiplications hardware wants.

Every constant below is anchored to one of these.

### 4.2. $\Delta f = 15\,\text{kHz}$

Anchors:

- Urban delay spread of $\sim 5\,\mu\text{s}$ gives coherence bandwidth $\sim 200\,\text{kHz}$; we want $\Delta f \ll 200\,\text{kHz}$ so subcarriers see flat channels ($\Delta f \leq 20$–$30\,\text{kHz}$).
- Vehicular Doppler at 2 GHz and 350 km/h gives $\sim 650\,\text{Hz}$; we want $\Delta f \geq 10 f_d \approx 6.5\,\text{kHz}$.
- **Inherited constant.** UMTS used a chip rate of 3.84 Mcps, driven by a 15.36 MHz baseband sample rate. To reuse UMTS RF hardware in early LTE base stations, LTE's sample rate had to be a rational multiple of 15.36 MHz. The choice $\Delta f = 15\,\text{kHz}$ makes $15 \times 1024 = 15{,}360\,\text{kHz}$, matching UMTS at the 10 MHz LTE bandwidth. Similarly $15 \times 2048 = 30{,}720\,\text{kHz}$ for 20 MHz LTE — the 30.72 MHz sample rate is exactly $8 \times$ the UMTS chip rate.

$15\,\text{kHz}$ is the value that sits in the middle of the physics window *and* makes the FFT sample rate a clean multiple of the inherited UMTS clock.

### 4.3. Symbol duration $T_u = 66.67\,\mu\text{s}$ and CP length

Forced by $\Delta f = 15\,\text{kHz}$ via $T_u = 1/\Delta f$. The CP length must exceed the delay spread; for normal CP, $T_{\text{CP}} \approx 4.7\,\mu\text{s}$ works for urban macrocells. Total OFDM symbol length: $71.4\,\mu\text{s}$.

### 4.4. 7 symbols per slot, 0.5 ms per slot

Given the OFDM symbol length of $71.4\,\mu\text{s}$, seven symbols occupy $500\,\mu\text{s}$ exactly. There is no separate anchor for "7"; it is the number of symbols that fits into a slot whose length is set by the next constraint.

The slot length itself is 0.5 ms because the subframe is 1 ms (§ 4.5) and dividing it into two gives HARQ some intra-subframe granularity in scheduling (particularly useful for control-region flexibility). Historical note: a "slot" was a first-class scheduling unit in UMTS at 0.667 ms; the LTE choice of 0.5 ms is a compromise that gives a rounder number while keeping the same order.

### 4.5. TTI = 1 ms — the silicon anchor

The **transmission time interval (TTI)** is the granularity at which the scheduler operates: every 1 ms it can hand out fresh resource allocations, and every 1 ms an ACK/NACK can propagate. This 1 ms is not chosen because it's a nice number — it is set by what the UE can actually do.

A UE receiving a downlink data block must, before it can acknowledge:

1. Accumulate the full received symbol block.
2. FFT and equalise it (per-subcarrier scalar equations, § 3).
3. Demap constellation points to soft bits (log-likelihood ratios).
4. Reverse rate matching, combine with soft buffer if this is a HARQ retransmission.
5. Run a turbo decoder for 8–10 iterations.
6. Check CRC.
7. Prepare and transmit ACK/NACK on the uplink control channel.

In 2008, when the LTE physical layer was frozen, the dominant cost was the turbo decoder. A block of up to $\sim 6000$ bits at 8 iterations, at the silicon clock rates of mobile chipsets at the time, was $\sim 2.5\,\text{ms}$. Total UE processing budget: $\sim 3\,\text{ms}$.

The HARQ round trip is UE reception + UE processing + UE ACK transmission + eNodeB processing + eNodeB retransmission = "receive + 3 ms + transmit + 3 ms + receive." Rounded to integer TTIs, the minimum round trip is $8 \times \text{TTI}$. For this to allow a working system (multiple parallel HARQ processes to keep the pipe full while waiting for ACKs), the number of HARQ processes is $\text{RTT}/\text{TTI} = 8$.

If TTI were 0.5 ms, the RTT would be 16 subframes, requiring 16 HARQ processes — doubling the soft-buffer SRAM at the UE, which 2008 chipsets could not afford. If TTI were 2 ms, the RTT would exceed 12 ms — too slow for VoLTE, whose codec generates a speech frame every 20 ms and cannot tolerate that much HARQ latency without stuttering.

$\text{TTI} = 1\,\text{ms}$ is the unique choice that fits the 2008 turbo decoder into an 8-process HARQ machine that also serves 20 ms voice codecs. HARQ RTT is a *consequence* of the TTI, not the reverse.

### 4.6. Radio frame = 10 ms, and the System Frame Number

The radio frame packs 10 subframes at 1 ms each. Every frame is numbered by a counter called the **System Frame Number (SFN)** — this is the cell's master clock, broadcast in the MIB (§ 9.1) so every UE reading MIB knows what frame number is currently being transmitted.

Every periodic event in LTE is scheduled by writing "this happens on frames where SFN mod $N$ equals $k$." Examples:

- Paging occasions for a specific UE (§ 15.3): SFN mod (DRX cycle in frames) equals a value derived from the UE's IMSI (International Mobile Subscriber Identity, the SIM-burned subscriber identifier; § 16.2).
- SIB1 transmission: SFN mod 8 equals 0 (SIB1 appears every 80 ms, i.e. every 8 frames).
- SIB2 transmission: SFN mod 16 equals a configured offset.
- MIB transmission: every frame, so SFN mod 1 equals 0 (i.e., always).

The SFN is a 10-bit counter, so it wraps every $2^{10} = 1024$ frames, i.e., every $10.24$ seconds. This wrap is unimportant for scheduling — the modular arithmetic against $N \leq 256$ is unaffected — but it does mean that any timing relationship spanning more than $10.24$ seconds must track the wrap separately.

**Why 10 bits and not 16 or 24?** Any longer counter forces more bits into the MIB (which sits on a tiny broadcast channel that must be decodable at very low SNR — § 9.1). 10 bits is enough to cover the longest DRX cycle (2.56 s, i.e. 256 frames) with room to spare, and no more.

*Historical note.* UMTS used the same idea under a different name: **SFN** in UMTS meant "System Frame Number" too, but ticked every 10 ms *frame* (of 15 slots of 2560 chips each), also with a 12-bit counter — a slightly longer wrap (40.96 s), because UMTS had no paging occasion tighter than 640 ms and could afford it. The concept carried forward to LTE with the bit width shrunk to fit the harsher MIB budget.

### 4.7. 12 subcarriers per resource block

A **resource block (RB)** is the smallest allocation unit the scheduler can hand out — one RB is $12$ consecutive subcarriers over one slot (7 OFDM symbols). At $\Delta f = 15\,\text{kHz}$ this is $180\,\text{kHz}$ in frequency and $0.5\,\text{ms}$ in time.

The number 12 comes from three constraints, all satisfied simultaneously:

1. **Coherence bandwidth.** An RB should be much narrower than $B_c \approx 200\,\text{kHz}$ so the channel is approximately flat across it (which lets the scheduler treat the whole RB as one channel-quality unit). 180 kHz sits just at this boundary — small enough that the CQI feedback for one RB reasonably represents its channel.

2. **Divisibility.** The 12 subcarriers must divide cleanly into the constellation designs used for MIMO and reference signals. 12 factors as $2^2 \cdot 3$, making it divisible by 2, 3, 4, and 6 — the pilot-spacing values the reference-signal design (§ 7) requires.

3. **Signalling overhead.** If RBs were much smaller, scheduling would carry a huge overhead of "which RBs to which UE" bookkeeping. If much larger, granularity would be lost. 12 subcarriers per RB times $\sim 6$ to $100$ RBs across the LTE bandwidth range gives a scheduler control message of manageable size.

### 4.8. Total bandwidths — 1.4, 3, 5, 10, 15, 20 MHz

LTE offers six carrier bandwidths, each specifying a number of usable RBs:

| Bandwidth | Usable RBs | Subcarriers used | Nominal FFT | Sample rate |
|---|---|---|---|---|
| 1.4 MHz | 6 | 72 + DC | 128 | 1.92 MHz |
| 3 MHz | 15 | 180 + DC | 256 | 3.84 MHz |
| 5 MHz | 25 | 300 + DC | 512 | 7.68 MHz |
| 10 MHz | 50 | 600 + DC | 1024 | 15.36 MHz |
| 15 MHz | 75 | 900 + DC | 1536 or 2048 (padded) | 23.04 or 30.72 MHz |
| 20 MHz | 100 | 1200 + DC | 2048 | 30.72 MHz |

Each sample rate is a rational multiple of the UMTS chip rate 3.84 Mcps. The FFT sizes are powers of 2 (so the FFT hardware is a plain radix-2 or radix-4 machine) except for 15 MHz, where the "natural" size $1536 = 512 \cdot 3$ requires a mixed-radix FFT with a factor of 3 — many chipsets instead reuse the 20 MHz 2048-point FFT and zero-pad the unused subcarriers.

Actual data is placed only on the inner subcarriers; the outer subcarriers are left empty as a **guard band** so the signal falls off cleanly before the next operator's frequency block begins. The centre subcarrier (DC) is unused because at RF it maps to the local-oscillator leakage of the receiver, which cannot be recovered.

### 4.9. The special first CP

At 20 MHz LTE with sample rate 30.72 MHz, one slot (0.5 ms) contains $15{,}360$ samples. Seven OFDM symbols at 2048 useful samples each account for $14{,}336$ samples, leaving $1024$ samples for the seven cyclic prefixes. But $1024/7$ is not an integer.

The solution: the *first* CP in each slot is $160$ samples ($5.2\,\mu\text{s}$); the remaining six are $144$ samples ($4.69\,\mu\text{s}$). Then $160 + 6 \cdot 144 = 1024$, exact.

This is a purely arithmetic constraint (samples must divide evenly). No physical significance to which CP is longest; the "first" was chosen so the first symbol of each slot gets slightly more delay-spread protection, which is convenient because slot boundaries are often where new user allocations begin.

---

## § 5. The resource grid: making abstraction levels explicit

This is where the LTE literature most often confuses. There are five nested time-frequency granularities, and it matters at every point *which* one you are talking about.

### 5.1. The hierarchy

From the smallest atom outward:

1. **Resource Element (RE)** = 1 subcarrier $\times$ 1 OFDM symbol. This is the atomic cell of the grid. Every bit that goes over the air is modulated onto some RE. Frequency $\Delta f = 15\,\text{kHz}$, time $\approx 71.4\,\mu\text{s}$.

2. **Resource Block (RB)** = 12 subcarriers $\times$ 7 OFDM symbols (one slot) = 84 REs. This is the smallest allocation unit the scheduler hands out. When a UE is granted "3 RBs," it gets $3 \times 84 = 252$ REs to modulate its data onto.

3. **Slot** = 7 OFDM symbols in time, spanning the entire frequency band. Half of a subframe.

4. **Subframe** = 2 slots = 14 OFDM symbols = 1 ms. This is the TTI: the scheduler's decision cycle.

5. **Radio frame** = 10 subframes = 10 ms. The SFN counts these.

### 5.2. When each level matters — the rules

- **The RE level matters when discussing reference signals, PSS/SSS placement, and detailed control-channel mapping.** Which specific REs carry the CRS pilots, where in the symbol the sync signals sit, how PDCCH is mapped into the control region — these questions are answered at RE granularity.

- **The RB level matters when discussing data-channel allocations, channel-quality reporting, and pretty much anything a UE sees in its scheduling grant.** A grant says "you have RBs 5, 6, 7 for downlink data" — the UE does not care which subcarriers within those RBs; the mapping is fixed by the standard.

- **The slot level matters mostly for physical-layer bookkeeping** (the special first CP, the two-slot subframe structure). Once you understand the subframe, the slot is rarely relevant to how information is scheduled.

- **The subframe level is where scheduling and HARQ live.** Every DCI addresses a subframe; every ACK/NACK is for a subframe.

- **The radio-frame level is where system information broadcasts and paging are scheduled.** MIB repeats every frame; SIBs at multi-frame periodicities; paging on specific frames selected by IMSI (see § 16.2 for what IMSI is).

### 5.3. What lives in the control region vs the data region

Within each subframe, the first 1, 2, or 3 OFDM symbols (at the beginning of the subframe, spanning *all* subcarriers in the bandwidth) form the **control region**. The remaining 11–13 symbols are the **data region**.

The control region carries:

- **PDCCH** — the scheduling announcements (§ 11).
- **PCFICH** — a 2-bit indicator saying how many symbols wide the control region is (this subframe).
- **PHICH** — HARQ ACK/NACKs for uplink transmissions.
- **CRS pilots** — always sprinkled across all symbols including the control region, so the receiver can equalise.

The data region carries:

- **PDSCH** — the actual user data payload, plus system information blocks broadcast to all UEs.
- **Reference signals continue** — CRS pilots keep appearing at their scheduled RE positions, so channel estimation for the data region is possible.

The width of the control region is dynamic. A cell serving one heavy-video user needs almost no control signalling and can set the control region to 1 symbol, leaving 13 symbols for data. A cell serving 100 VoLTE users has lots of small allocations to announce and may need all 3 symbols of control. The PCFICH broadcasts this width every subframe.

### 5.4. When subcarriers matter vs when RBs matter — an example

Suppose you are asked: "which subcarriers carry the PDCCH?"

This is an RE-level question. The answer requires knowing which REs in the control region are marked as PDCCH REs (as opposed to CRS REs or PCFICH REs), and the mapping is scattered across the whole bandwidth (§ 11.2 for why scattered).

Now suppose you are asked: "which resources are allocated to UE $X$'s downlink data?"

This is an RB-level question. The DCI answers it with a bitmap or a compact representation of RB indices. The subcarriers within those RBs are implicit — they are the 12 subcarriers of each RB, and their exact positions in the frequency spectrum are determined by the RB index and the LTE numerology, without further per-subcarrier information.

**Rule of thumb.** Physical-layer descriptions of who-transmits-what use REs. Scheduling descriptions of what a UE gets use RBs. Timing descriptions (when-does-what-happen) use subframes.

### 5.5. The full grid in one picture

The time and frequency axes together define the resource grid. Below is one **subframe** at RE granularity, drawn for one RB in an "ordinary" subframe (not subframe 0 or 5, which carry additional broadcast signals — treated separately below). Each column is one OFDM symbol (71.4 μs); each row is one of the 12 subcarriers of this RB (15 kHz spacing). Every cell is one **RE**.

```
Slot boundary is between symbol 6 and symbol 7 (each slot = 7 symbols = 0.5 ms).

               ┌── slot 0 (0.5 ms) ──────┐   ┌── slot 1 (0.5 ms) ──────┐
Symbol index:    0    1    2    3    4    5    6    7    8    9   10   11   12   13
                ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
subcarrier 11   │ R  │ .  │ .  │ .  │ .  │ .  │ .  │ R  │ .  │ .  │ .  │ .  │ .  │ .  │  CRS
subcarrier 10   │ P  │ P  │ P  │ .  │ R  │ .  │ .  │ D  │ D  │ D  │ D  │ R  │ D  │ D  │  CRS on 4,11
subcarrier  9   │ P  │ P  │ P  │ .  │ .  │ .  │ .  │ D  │ D  │ D  │ D  │ .  │ D  │ D  │
subcarrier  8   │ P  │ P  │ P  │ .  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │
subcarrier  7   │ P  │ P  │ P  │ .  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │
subcarrier  6   │ R  │ .  │ .  │ .  │ .  │ .  │ .  │ R  │ .  │ .  │ .  │ .  │ .  │ .  │  CRS
subcarrier  5   │ P  │ P  │ P  │ .  │ R  │ .  │ .  │ D  │ D  │ D  │ D  │ R  │ D  │ D  │  CRS
subcarrier  4   │ P  │ P  │ P  │ .  │ .  │ .  │ .  │ D  │ D  │ D  │ D  │ .  │ D  │ D  │
subcarrier  3   │ P  │ P  │ P  │ .  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │
subcarrier  2   │ P  │ P  │ P  │ .  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │ D  │
subcarrier  1   │ R  │ .  │ .  │ .  │ .  │ .  │ .  │ R  │ .  │ .  │ .  │ .  │ .  │ .  │  CRS
subcarrier  0   │ P  │ P  │ P  │ .  │ R  │ .  │ .  │ D  │ D  │ D  │ D  │ R  │ D  │ D  │  CRS
                └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
                └─ control region ──┘└──────────  PDSCH data region  ──────────────────┘
                    (3 symbols wide,
                     because CFI = 3)

Legend:  R = CRS pilot (Cell Reference Signal)
         P = PDCCH region cell (may be PDCCH, PCFICH, PHICH, or unused)
         D = PDSCH data cell
         . = not carrying anything for this RB in this subframe
```

**What CFI is.** **CFI (Control Format Indicator)** is a 2-bit value the eNodeB sends *at the beginning of every subframe* announcing how many OFDM symbols the control region occupies. CFI ∈ {1, 2, 3}. In this drawing CFI = 3, so symbols 0–2 are the control region and symbols 3–13 are the data region. When the cell is lightly loaded the eNodeB will pick CFI = 1 or 2; when many small allocations need announcing it picks CFI = 3. The CFI is itself carried on **PCFICH**, which sits in fixed known RE positions of symbol 0 (§ 11.2) so the UE can decode CFI before it knows anything else about the subframe.

**Reading the diagram against the abstraction hierarchy of § 5.1:**

- Each single cell in the grid = one **RE**. Every RE is one complex modulation symbol carried on one subcarrier during one OFDM-symbol interval.
- One block of $12 \times 7 = 84$ cells (all 12 subcarriers, first 7 columns) = one **RB** (slot 0's RB). Second block of $12 \times 7$ = second RB.
- Two RBs stacked in time = a full **subframe pair** for one RB position; called an **RB pair**. Scheduling grants normally address RB pairs rather than single RBs.
- All 14 columns = one **subframe** (1 ms, one TTI).

**Reading the diagram against the channels of § 5.3:**

- **PCFICH** — 16 REs spread across the whole bandwidth in symbol 0. It occupies specific RE positions in exactly four of the RBs of a subframe (not necessarily this one), so an arbitrary RB drawing may not show any PCFICH cell.
- **PDCCH** — the "P" cells in symbols 0–2. In the actual mapping, PDCCH REGs from one DCI are scattered across the whole bandwidth (§ 11.2); the "P" cells in this one RB may belong to many different DCIs targeting many different UEs.
- **CRS** — the "R" cells; four per RB per subframe, at symbols 0, 4, 7, 11. Their subcarrier positions shift by $\text{PCI} \bmod 6$ across cells (§ 7.1) so neighbouring cells don't pilot the same REs.
- **PDSCH** — the "D" cells; user data.

**Subframes 0 and 5 are different.** They additionally carry the synchronization signals. In FDD, in the middle 6 RBs (i.e., the 72 subcarriers centered on the DC carrier), symbols 5 and 6 of slot 0 (of subframe 0 or 5) carry SSS and PSS respectively — see the diagram below of that special RB:

```
     What the middle-6-RBs region looks like in subframe 0 (FDD):

     subcarrier 66 ─┐   the 72 subcarriers centered on DC
                    │   (the middle 6 RBs of the band)
     ...            │
                    ▼
     Symbol index:    0    1    2    3    4   [5]  [6]   7    8    9   10   11   12   13
                    ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
                    │ ..  ordinary PDCCH / CRS / PDSCH  │SSS │PSS │ ..  ordinary PDSCH ..│
                    └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘

Subframe 0 also carries PBCH in symbols 0-3 of slot 1 (symbols 7-10) of the middle 6 RBs.
Subframe 5 has PSS/SSS in the same places but no PBCH.
```

Outside the middle 6 RBs of subframes 0 and 5, no RB ever carries PSS/SSS or PBCH — the top-of-section diagram, drawn for one arbitrary RB in an ordinary subframe, correctly shows none.

The full 20 MHz downlink grid replicates the top-of-section pattern 100 times vertically (100 RBs = 1200 subcarriers), except that the middle 6 RBs of subframes 0 and 5 look like the special-case diagram. The horizontal structure — 14 symbols per subframe — is identical for every RB. Radio frame = 10 such subframes drawn end to end.

The full 20 MHz downlink subframe is $1200 \times 14 = 16{,}800$ REs, of which typically:

- **CRS**: $\sim 800$ REs (4 pilots × 100 RBs × 2 antenna-port patterns per RB).
- **Control** (PDCCH + PCFICH + PHICH) with CFI = 3: up to $\sim 3600$ REs.
- **PDSCH**: $\sim 12{,}400$ REs.
- **PSS/SSS/PBCH** in subframes 0 and 5: a few hundred more REs, but only in specific subframes.

This is the granularity at which physical-layer scheduling produces output every millisecond.

---

## § 6. Uplink asymmetry: SC-FDMA and the shape of PUCCH

Downlink and uplink in LTE use different waveforms. The reason is a hard physical constraint on the mobile.

### 6.1. The PAPR problem

An OFDM signal is a sum of many independent complex sinusoids on distinct subcarriers. By the central limit theorem, as the number of active subcarriers grows, the instantaneous complex amplitude of the time-domain waveform tends toward a complex Gaussian. In particular, the *peak* amplitude, relative to the average, is unbounded — the ratio of the peak to the mean power is the **Peak-to-Average Power Ratio (PAPR)**, and for OFDM with many active subcarriers it can exceed 10 dB.

A power amplifier (PA) is linear only up to some saturation point. If the PA has to handle a peak that is 10 dB above the mean, it must be backed off (operated at a level 10 dB below its saturation) to avoid clipping, which is grossly inefficient. In the base station this is tolerable — the PA runs off the mains-supplied AC power, and thermal management is not a problem. In the phone, running the PA at 10 dB backoff would drain the battery in minutes.

### 6.2. SC-FDMA as DFT-precoded OFDM

The solution is to pre-process the uplink signal so its time-domain envelope stays much flatter, while still using the same OFDM demodulation on the receive side. The specific pre-processing:

1. Take the $M$ modulation symbols the UE wants to send on the $M$ subcarriers it is allocated.
2. Compute an $M$-point DFT of them first — this concentrates them, in the frequency domain, into a shape resembling a *single* concentrated signal rather than $M$ independent ones.
3. Map the resulting $M$ complex values onto the $M$ subcarriers.
4. Compute the standard IFFT to produce the time-domain waveform.

This is **SC-FDMA (Single-Carrier Frequency-Division Multiple Access)**. Because of the DFT precoding, the resulting time-domain waveform looks more like a single-carrier signal than a superposition — its envelope is flatter, and the PAPR is 4–5 dB lower than plain OFDM. The receiver (which is the base station and has power to spare) does a standard OFDM FFT, then an inverse DFT to undo the precoding.

There is a cost: **the UE must be granted a contiguous block of subcarriers.** To see why, look at what the DFT precoding produces in the time domain.

Let $s_0, s_1, \ldots, s_{M-1}$ be the modulation symbols. The $M$-point DFT precodes them to $S_k = \sum_{n=0}^{M-1} s_n e^{-j 2\pi kn/M}$. These are placed on $M$ contiguous subcarriers, at frequencies $f_{k_0}, f_{k_0+1}, \ldots, f_{k_0+M-1}$ (a block of width $M \Delta f$ starting at subcarrier index $k_0$). The IFFT converts to time domain. Consider what happens for just one modulation symbol, say $s_0$: the DFT spreads it uniformly ($S_k = s_0$ for all $k$), and placing $s_0$ on $M$ contiguous subcarriers then IFFTing produces the **Dirichlet kernel** in time:

$$x_{s_0}(t) = s_0 \cdot e^{j 2\pi f_{k_0} t} \cdot \underbrace{\frac{\sin(\pi M \Delta f\, t)}{M \sin(\pi \Delta f\, t)}}_{D_M(t)} \cdot e^{j\pi(M-1)\Delta f\, t}.$$

The Dirichlet kernel $D_M(t)$ has magnitude 1 at $t = 0$ and $t = 1/\Delta f, 2/\Delta f, \ldots$ (the OFDM symbol sample points), and its envelope decays as $\sim 1/(M \sin(\pi \Delta f\, t))$ between them. Crucially, its envelope shape is roughly *smooth and narrow* — a single-pulse-like time-domain response, and this is what makes the total waveform's PAPR low. Different modulation symbols $s_n$ shift $D_M(t)$ to different sample positions along the OFDM symbol interval. The whole time-domain waveform is essentially a discrete sum of shifted Dirichlet pulses, which is *exactly what a pulse-shaped single-carrier signal looks like* — hence the name SC-FDMA.

Now change the subcarrier allocation from contiguous to interleaved (say, every other subcarrier is used). The mapping in the frequency domain now has zeros between every used subcarrier. The IFFT of that pattern is *no longer a single Dirichlet kernel* — it becomes a periodic superposition, producing large peaks where the periods align. The PAPR advantage disappears. This is why LTE uplink grants are always contiguous RBs (unlike downlink, which can be scattered).

### 6.3. Why PUCCH sits at the band edges

The uplink is divided into a large data region (PUSCH — physical uplink shared channel) and a small control region (PUCCH — physical uplink control channel) carrying HARQ ACKs, scheduling requests, and channel-state reports.

Because the UE's uplink must be contiguous (§ 6.2), and because the PUCCH sits at fixed known positions on every subframe, PUCCH must occupy a fixed frequency region that does not fragment the middle of the band. The choice: put PUCCH at the two edges, so the middle is a single contiguous region available for PUSCH grants.

Within a slot, PUCCH also hops between the two edges (top edge in slot 0, bottom edge in slot 1, or vice versa). This is **intra-subframe frequency hopping** — a diversity trick. If one edge of the band is in a fade for a given UE, the other edge is probably not, and the UE's ACK gets two independent tries at reception.

### 6.4. The one-carrier promise, kept loosely

SC-FDMA is often described as "single-carrier from the perspective of the transmitter." This is true in the loose sense that the envelope behaves single-carrier-like — but the receiver still uses the OFDM machinery. The elegance is that the base station's receiver design doesn't have to change; only the transmitter's mapping does. This lets the two directions share an FFT-based baseband while giving the UE its battery.

---

## § 7. Reference signals: what they sound, what they don't

Reference signals ("pilots") are known symbols the receiver uses to estimate the channel — the complex gain $H[k]$ for each subcarrier — so that the equaliser can invert it. Different reference signals exist for different scopes.

### 7.1. Cell-Specific Reference Signal (CRS) — always-on downlink pilots

The CRS is broadcast unconditionally by every eNodeB, in every subframe, across the entire cell bandwidth. Its role:

- **Downlink channel estimation** for every UE in the cell, whether that UE is actively receiving data or just listening for paging.
- **Cell-quality measurements** for cell reselection and handover decisions. RSRP (Reference Signal Received Power) and RSRQ (Reference Signal Received Quality) are measured on CRS. Every UE compares CRS from its serving cell and neighbouring cells to decide when to reselect (§ 21).
- **Control-channel demodulation.** By "demodulation" we mean the receiver's task of recovering the transmitted modulation symbols (the QAM constellation points) from the received samples. That task requires knowing the channel response $H[k]$ on every subcarrier where the target signal lives; the receiver estimates $H[k]$ from the pilots and then divides. PDCCH (which carries the DCIs, § 11) is demodulated using CRS — the eNodeB does not send a UE-specific pilot alongside PDCCH, so the UE relies on the CRS it has already been estimating for the whole cell.

**Cell vs eNodeB — a note before continuing.** Up to this point we have been using "cell" and "eNodeB" almost interchangeably. From now on the distinction matters: an **eNodeB** is one physical base-station device (one location on the ground, one backhaul link). A **cell** is the coverage footprint of *one sector's* antennas. A typical cell site has three antenna arrays each pointing outward at 120° from the tower, so one eNodeB serves three cells. Everything that is "cell-specific" (PCI, CRS pattern, sector broadcast) is separate per sector; everything that is "eNodeB-scoped" (the S1-MME association, the X2 links, the eNB ID within an ECGI — § 16.6) is shared across the three cells of one site. When a UE hands over between two sectors of the same eNodeB, only the radio side re-syncs; the S1 anchor does not move.

**PCI recap and forward pointer.** Every cell announces a **Physical Cell Identity (PCI)** — one of 504 integers, transmitted implicitly via the PSS/SSS pair (§ 8). The PCI is the identity used everywhere at the physical layer to distinguish signals from this cell from those of a neighbouring cell. We invoke it here (in the CRS mapping and the scrambling seeds) before deriving it in § 8; readers who want the derivation now can jump ahead.

**Where on the grid the CRS pilots sit.** For a single-antenna cell (single "antenna port," port 0), CRS pilots occupy exactly four OFDM symbols in every subframe: symbols 0, 4, 7, and 11. In each of those symbols, the pilots sit on every 6th subcarrier. The subcarrier positions are given by

$$k = 6m + (v_{\text{shift}} + k_{\text{stagger}}) \bmod 6, \qquad m = 0, 1, 2, \ldots$$

where the two additive offsets have specific roles:

- $v_{\text{shift}} = \text{PCI} \bmod 6$ is a **cell-dependent offset** that shifts the whole pilot pattern up or down by 0 to 5 subcarriers depending on which cell is transmitting. Purpose: neighbouring cells that happen to have PCIs differing modulo 6 place their pilots on completely different subcarriers, so a UE receiving overlapping signals from both cells does not see collided pilots. Network planners assign PCIs so that any two cells whose radio ranges overlap have different $v_{\text{shift}}$.

- $k_{\text{stagger}}$ is a **within-cell time-varying offset** that shifts the pattern by 3 subcarriers between symbol 0 and symbol 4 (and again between 7 and 11). Concretely, $k_{\text{stagger}} = 0$ in symbols 0 and 7; $k_{\text{stagger}} = 3$ in symbols 4 and 11. Purpose: the pilots in symbol 0 sample the channel at subcarriers $\{v_{\text{shift}}, v_{\text{shift}}+6, v_{\text{shift}}+12, \ldots\}$; the pilots in symbol 4 sample it at $\{v_{\text{shift}}+3, v_{\text{shift}}+9, \ldots\}$. Combining the two symbols, the receiver has channel samples at every 3rd subcarrier — twice the frequency resolution than either symbol alone would give. This makes the between-pilot interpolation much more accurate over frequency-selective channels.

**Timing of the pilots.** The choice of four symbols (0, 4, 7, 11) is set by the Doppler coherence time — the timescale over which the channel gain stays roughly the same (introduced in § 3.7 as the reciprocal of the maximum Doppler shift). At 350 km/h and 2 GHz carrier, coherence time is $\sim 0.5\,\text{ms}$; the channel changes significantly within one 1 ms subframe. Four pilot symbols distributed across the 14-symbol subframe give the receiver enough samples in the time direction to track a channel that changes across the subframe.

### 7.2. Demodulation Reference Signal (DMRS) — UE-specific pilots for the data

DMRS is a *per-user* pilot embedded inside a specific UE's data block. It exists in both directions:

- **DMRS in PDSCH (downlink data channel).** When PDSCH is precoded (§ MIMO), the channel the UE sees is not the "physical" channel measured by CRS — it's the *effective* channel including precoding weights. DMRS carries the precoded-channel estimate the UE needs for demodulating that specific transmission.

- **DMRS in PUSCH (uplink data channel).** The eNodeB does not know the uplink channel from CRS (there is no CRS on uplink). It needs a pilot inserted by the UE, on the exact subcarriers the UE is using, to estimate the channel and demodulate.

DMRS is only present in the REs of a specific PDSCH or PUSCH transmission — that is, on the subcarrier-symbol positions that carry the user data for one grant. If no PDSCH or PUSCH is scheduled on those REs in a given subframe, no DMRS appears either. Unlike CRS (which is broadcast unconditionally across the whole band in every subframe), DMRS is a per-grant, per-UE pilot that lives *inside* the data allocation and disappears with it.

### 7.3. Sounding Reference Signal (SRS) — uplink wideband probe

DMRS only tells the eNodeB about the channel on the subcarriers the UE was assigned. If the UE has been transmitting on RBs 10–15 and the scheduler wants to know whether RBs 50–70 have a better channel for that UE, DMRS is silent about that range.

**SRS solves this.** The UE transmits, in one OFDM symbol, a known Zadoff-Chu-based sequence spanning a large contiguous range of the uplink band — typically 40–100 RBs, i.e. hundreds of subcarriers wide. "Wideband" here means exactly this: the SRS covers a range far larger than any one PUSCH grant would use, so a single SRS transmission lets the eNodeB estimate $H[k]$ across the whole span in one shot. The eNodeB correlates the received signal against the expected sequence, gets a per-subcarrier channel estimate over the whole SRS band, and uses that to pick a good RB range for this UE's next grant.

**Why SRS transmissions from different UEs can collide.** The user-data channels PUSCH and PDSCH don't collide across UEs because the scheduler assigns *disjoint* RBs to each UE per subframe. But SRS is not a data grant — its purpose is to probe RBs the UE hasn't been assigned. If two UEs both need to probe the same wide range of the band on the same subframe, and both transmit the entire wide sequence, their signals overlap on the same REs and neither channel estimate is clean.

LTE handles this by orthogonalizing SRS transmissions in two dimensions:

- **Frequency multiplexing via combs.** Each SRS uses a **transmission comb** — the sequence occupies only every $K_{\text{TC}}$-th subcarrier of the wideband range. With $K_{\text{TC}} = 2$: comb-0 UEs occupy even-indexed subcarriers within the range, comb-1 UEs occupy odd-indexed. Because different subcarriers are orthogonal in OFDM, both combs coexist in the same OFDM symbol without interference. UE-to-comb assignment is a scheduler decision.

- **Cyclic-shift multiplexing.** Two UEs on the same comb can additionally be separated by giving them different cyclic shifts of the same base sequence (analogous to § 10.3 for PRACH). Up to 8 UEs can share one comb via cyclic shifts.

**Fixed time position.** SRS lives in the *last* OFDM symbol of a subframe (symbol 13). If a UE has been granted PUSCH in that same subframe, its PUSCH is "punctured" — the last symbol is not filled with data but with SRS, and the receiver simply skips that symbol when decoding PUSCH.

**When SRS actually happens.** A subframe is either an SRS subframe (its last symbol is available for SRS from any UE that has been configured to sound there) or it is not. The **cell-wide SRS subframe configuration** — the set of subframes designated as SRS subframes — is broadcast in **SIB2** (§ 9.3), advertised to every UE as a bitmap or periodicity index. "Aggregate" here means cell-wide: this configuration is the same for all UEs, so all UEs know which subframes might carry any SRS at all. On top of that, each UE has its own per-UE SRS configuration (set individually by RRC) telling it which of those cell-wide SRS subframes *this UE* should transmit its own SRS in, at what comb, at what cyclic shift, over what bandwidth range. Two-level design: the cell says "SRS may happen on these subframes"; RRC per-UE says "you sound on these ones."

**Bonus in TDD:** because the same frequency is used in both directions, the eNodeB can use the SRS-estimated uplink channel *as* the downlink channel — this is **channel reciprocity** and enables downlink beamforming (§ 26.1) based on uplink measurements alone. In FDD (different frequencies for up and down), reciprocity does not hold and downlink beamforming needs the UE to report the channel estimate via CQI (§ 7.4).

### 7.4. Channel Quality Indicator (CQI) — the UE's report card

The UE measures the downlink CRS, estimates its SINR (signal-to-interference-plus-noise ratio), and reports a 4-bit value 0–15 to the eNodeB. Value 15 means "channel is pristine, please use 256-QAM at high code rate." Value 1 means "channel is barely usable, please use QPSK with heavy redundancy."

CQI is one component of **CSI (Channel State Information)**. The other two are **PMI (Precoding Matrix Indicator)** — the UE's recommendation for which precoding weights to use in MIMO transmission (§ 26.1) — and **RI (Rank Indicator)** — how many independent MIMO streams the UE can decode. Together CQI + PMI + RI let the eNodeB pick modulation, precoding, and rank for the next downlink block to this UE.

CSI is reported periodically (via PUCCH) or aperiodically on demand (the eNodeB flips a "CSI Request" bit in an uplink grant, and the UE piggybacks a richer CSI report onto the granted PUSCH transmission).

---

## § 8. Synchronization: how a UE finds a cell and locks to it

A powered-on UE with no prior state must discover any cell within radio range, learn where the frame boundary is, learn which cell it is, and get enough parameters to start reading system information. Two special signals — the Primary Synchronization Signal (PSS) and the Secondary Synchronization Signal (SSS) — bootstrap this from nothing.

### 8.1. What PSS solves

The UE knows nothing about local timing when it powers on. It needs to lock onto a coarse timing anchor: "somewhere near here is a 5 ms boundary." PSS is a short (62-subcarrier + DC) waveform transmitted twice per radio frame (every 5 ms) at fixed known positions. The UE correlates the incoming signal against three possible PSS sequences and locates the correlation peak.

Three PSS sequences — call them PSS-0, PSS-1, PSS-2 — are used across the network, generated as length-63 Zadoff-Chu sequences with roots 25, 29, and 34 (§ 10.2 for what a Zadoff-Chu sequence is and its properties). Detecting which of the three a cell transmits identifies the cell's **sector index** within its site (recall from § 7.1 that one eNodeB usually hosts three cells, one per 120° sector):

$$N_{\text{ID}}^{(2)} \in \{0, 1, 2\}, \quad \text{by the lookup} \; 25 \to 0, \; 29 \to 1, \; 34 \to 2.$$

The three sectors of one eNodeB site are assigned $N_{\text{ID}}^{(2)} = 0, 1, 2$ respectively, so in the overlap region between two sectors of the same site (where the antenna beams cross), the two cells' PSS signals occupy different Zadoff-Chu roots and do not collide.

**Why these three specific roots and not, say, 25, 26, 27?** The choice exploits a Zadoff-Chu property: the complex conjugate of a ZC of length $N$ with root $u$ is the ZC with root $N - u$. For $N = 63$:

- $63 - 29 = 34$ — so PSS-1 and PSS-2 are complex conjugates of each other.
- $63 - 25 = 38$ — PSS-0's conjugate would be a root outside our set (38 is not used).

Consequence: the receiver's frequency-domain correlator computing a match against PSS-1 automatically produces (from the same operation, by taking the complex conjugate of the output) a match against PSS-2. Only two correlator passes cover all three sequences. The roots 25, 29, 34 are the specific triple that (a) forms a conjugate pair between two of them, (b) leaves the third (25) with sufficient mutual cross-correlation distance from both, and (c) gives all three flat spectra in the frequency domain — a ZC-derived property. The apparent gap of 4 between 25 and 29 has no special significance; it just happens to be where the specific conjugate-pair-plus-standalone constellation lands after 3GPP's optimisation.

After PSS detection, the UE knows:
- Rough 5 ms boundary location.
- Sector index $N_{\text{ID}}^{(2)} \in \{0, 1, 2\}$.

But it does not know: which 5 ms boundary (subframe 0 or subframe 5 of the radio frame), and which of the 168 possible cell-group identities. Those are what SSS solves.

### 8.2. What SSS solves

Right next to PSS in the subframe (immediately before it in FDD, three symbols earlier in TDD) sits SSS. Its two jobs:

- **Encode 168 cell group IDs** $N_{\text{ID}}^{(1)} \in \{0, \ldots, 167\}$.
- **Encode subframe parity** (this SSS is in subframe 0, or in subframe 5). Because PSS is identical in both subframes, SSS must break the 5 ms tie.

Total state space needed: $168 \times 2 = 336$.

### 8.3. Dimension splitting — why two length-31 sequences instead of one length-63

The SSS occupies 62 subcarriers. A natural first thought is: use one **m-sequence** of length 63.

**What an m-sequence is.** An m-sequence ("maximum-length sequence") is the output of a linear feedback shift register (LFSR) whose feedback polynomial is *primitive* over $\mathrm{GF}(2)$ and whose register width is $n$ bits. It has period $2^n - 1$ — the maximum possible period for an $n$-stage LFSR. For $n = 6$ we get period 63; for $n = 5$, period 31. Two properties matter for what follows:

- **Two-valued autocorrelation.** The circular autocorrelation of an m-sequence equals its length $L$ at zero lag and equals $-1$ (out of $L$) at *every* non-zero lag. This makes m-sequences ideal for detecting timing: correlating against a shifted copy gives a sharp $L$-versus-$(-1)$ ratio.
- **Cross-correlation is bounded but not tiny.** Two cyclic shifts of the *same* m-sequence are also m-sequences and have the same $-1$ cross-correlation with each other. Two m-sequences from *different* primitive polynomials, however, have a three-valued cross-correlation whose worst value can be $\sqrt{L}$ or larger.

Why m-sequences and not some other pseudo-random family? Two reasons:

- **Generation cost.** An LFSR is a handful of XOR gates and one register. This runs on power-limited receiver hardware (the UE has to correlate against every candidate SSS, potentially in every subframe during initial cell search). Cheaper sequences do not exist.
- **Autocorrelation property.** The two-valued autocorrelation gives the sharpest possible peaks for time-alignment. Random-looking sequences with poor autocorrelation (e.g., truly random binary sequences) would smear the correlation peak.

So one length-63 m-sequence with 63 possible cyclic shifts would give 63 possible codes. Not enough for the 336 SSS states we need, and there is no natural place to encode the subframe-parity bit inside a single m-sequence.

**The LTE design.** Use two shorter m-sequences of length 31, both generated from the same degree-5 primitive polynomial with different starting positions. Denote them $X$ (shift index $m_0$) and $Y$ (shift index $m_1$). Interleave them: $X$ on the even-indexed SSS subcarriers, $Y$ on the odd-indexed. The parameter space is $m_0, m_1 \in \{0, \ldots, 30\}$ — $31 \times 31 = 961$ possible pairs.

Not all 961 pairs are used. Requiring $m_0 < m_1$ reduces to $\binom{31}{2} = 465$; the standard selects a specific 168 of these based on their **mutual cross-correlation** — the criterion is that any two SSS sequences chosen from this set of 168 correlate against each other no more than a specified threshold (about $\sqrt{31} \approx 5.6$ out of 31), so that when a UE at a cell edge sees a mix of two cells' SSS, correlating against its serving cell's sequence still yields a clean peak.

**Encoding parity via order swap.** For subframe 0, sequence $X$ (with index $m_0$) is placed on even subcarriers and sequence $Y$ (with index $m_1$) on odd. For subframe 5, the order is swapped. Because $m_0 < m_1$ by construction, the receiver reads: "is the smaller index on the even subcarriers? If yes, subframe 0. If no, subframe 5." One integer comparison, no decryption.

This is a general LTE principle worth naming: **dimension splitting.** When one parameter needs to carry multiple pieces of information, decompose it into a product space where each factor carries one piece. The 504 total PCIs are

$$\text{PCI} = 3 \cdot N_{\text{ID}}^{(1)} + N_{\text{ID}}^{(2)},$$

with the factor of 3 coming from the sector index encoded by PSS and the 168 from the cell-group index encoded by SSS.

### 8.4. Where PSS and SSS sit in the grid — FDD vs TDD

In **FDD** (uplink and downlink on separate frequencies), PSS and SSS are placed adjacent to each other in the last two OFDM symbols of slot 0:

- Slot 0, symbol 5 → SSS.
- Slot 0, symbol 6 → PSS.

The two are neighbours because the UE uses PSS as a phase reference to demodulate SSS (SSS carries no pilots of its own; PSS's known structure is the improvised pilot).

In **TDD** (uplink and downlink on the same frequency, time-multiplexed), the placement is different:

- Slot 0, symbol 2 (in a special downlink pilot subframe) → PSS.
- Slot 1 (of the *previous* subframe), symbol 5 (three symbols earlier) → SSS.

The three-symbol gap gives the TDD receiver time to switch from receive to transmit, and vice versa.

### 8.5. Where PSS and SSS sit in frequency — the middle 6 RBs

Regardless of the total LTE bandwidth (1.4 to 20 MHz), PSS and SSS are always transmitted on the **middle 62 subcarriers** (6 RBs' worth) around the DC subcarrier. This means the UE does not need to know the bandwidth to find the sync signals — it can tune to the middle of the channel and always find them there. The bandwidth itself is learned later, from MIB (§ 9).

### 8.6. PCI and its use as a scrambling seed

The **Physical Cell ID (PCI)** derived from PSS and SSS is a 504-value integer that identifies the specific cell. Beyond identity, it is the seed for a **Gold sequence** used to scramble the PDSCH and other channels. Specifically, the initial state of the Gold-sequence generator is a function of PCI, subframe number, slot number, and the UE's C-RNTI.

**Why scramble at all?** If two neighbouring cells transmit unscrambled PDSCH on overlapping RBs, the transmissions superpose in the air, and a receiver at the cell edge sees an unresolvable mix. Scrambling the bits of each cell's transmission by a *cell-unique* pseudo-random sequence means the two overlapping transmissions look statistically independent to any receiver that only knows one of the two scrambling sequences. Descrambling with the correct sequence recovers own-cell data; the neighbouring cell's bits, when descrambled with the wrong sequence, look like noise — random $\pm 1$ that the FEC (turbo code) absorbs up to a threshold.

**Additive on bits, multiplicative on symbols.** The scrambling operation on bits is $\tilde{b}[n] = b[n] \oplus c[n]$ — a bitwise XOR. XOR is *addition in* $\mathrm{GF}(2)$, not multiplication, so it is properly called "additive scrambling" at the bit layer.

Once the scrambled bits are mapped to QPSK/QAM constellation symbols, XOR-ing the bit flips the corresponding symbol axis by $\pm 1$. Written in the complex-symbol domain, this becomes $\tilde{x}[k] = x[k] \cdot s[k]$ where $s[k] \in \{+1, -1\}$ (for QPSK; higher-order QAM has more sign bits). So scrambling is *multiplicative on the complex modulation symbols* even though it is additive on the underlying bits — the two views are consistent, and text that describes scrambling as "multiplying" is referring to the post-mapping symbol view. (Below in this document, when we describe scrambling in mixed terms, both views mean the same operation.)

**Why Gold sequences?** A Gold sequence is the XOR of two m-sequences generated by two different primitive polynomials of the same degree $n$. The construction gives $2^n + 1$ distinct Gold sequences of length $2^n - 1$ from one pair of polynomials. Two properties are what LTE needs:

- **Bounded cross-correlation.** Any two distinct Gold sequences of length $2^n - 1$ have a three-valued cross-correlation with worst value bounded by $\sqrt{2^{n+1}}$ (for $n$ odd) — much better than random binary sequences of the same length, and *guaranteed*, not average-case.
- **Family size.** For $n = 31$ (as LTE uses), the family is $2^{31} + 1 \approx 2 \times 10^9$ sequences. This is more than enough to give a distinct scrambling sequence to every (PCI, subframe, slot, C-RNTI) combination without repetition inside any realistic operating window.

An m-sequence alone (like SSS uses) has an autocorrelation-optimality guarantee but only $L$ distinct sequences per polynomial — nowhere near enough for scrambling. Gold sequences trade a little autocorrelation cleanliness for a much larger family with still-bounded cross-correlation, which is exactly what scrambling needs: many sequences, all mutually near-orthogonal.

Mathematically, if own-cell PDSCH transmits scrambled bits $b_1[n] \oplus c_1[n]$ and neighbouring cell transmits $b_2[n] \oplus c_2[n]$, and the receiver XORs its input by $c_1[n]$, it gets $b_1[n]$ plus $b_2[n] \oplus (c_1[n] \oplus c_2[n])$. Because $c_1 \oplus c_2$ is itself another Gold-like sequence with bounded correlation properties, $b_2 \oplus (c_1 \oplus c_2)$ decorrelates from any fixed structure and is well-modeled as independent noise for the receiver's turbo decoder.

The PCI-based seeding ensures neighbouring cells with different PCIs have decorrelated scrambling. This is the reason cell planning insists on giving neighbouring cells distinct PCIs.

---

## § 9. System information: MIB, SIB1, SIB2, and above

After sync, the UE knows PCI and the frame timing. It still does not know the bandwidth, the operator, the tracking area, or how to do random access. That information comes from **system information blocks (SIBs)**, broadcast on the shared data channel with special addressing.

### 9.1. MIB — the primer

The **Master Information Block (MIB)** carries the minimum needed to bootstrap SIB reception. It contains:

- **Downlink bandwidth** (1.4 to 20 MHz).
- **PHICH configuration** (which OFDM symbols carry HARQ feedback for uplink).
- **Upper 8 bits of the SFN.** The full SFN is 10 bits; MIB carries 8, and the remaining 2 are inferred from which 10 ms frame the MIB was decoded in (MIB repeats every 40 ms, so it appears in four consecutive frames, giving the remaining 2 bits).

MIB is 24 bits total. It is transmitted on the **PBCH (Physical Broadcast Channel)** on the 72 subcarriers centered around the DC subcarrier (the 36 subcarriers immediately above the carrier's centre plus the 36 immediately below — same span as PSS/SSS), in the first 4 OFDM symbols of subframe 0. It repeats every 40 ms. Each of the four repetitions uses a different **redundancy version (RV)** — that is, a different portion of the systematically-punctured turbo-coded output is transmitted. RV 0 through RV 3 are four different puncturing patterns of the same encoded bits; a UE that decodes only one RV gets one view of the codeword and may fail, whereas a UE that captures two or more RVs can soft-combine them (§ 13.4) and recover the message at much lower SNR. This is why MIB — the very first thing a UE decodes — remains readable at cell edges with poor signal.

### 9.2. SIB1 — the operator identity and SIB schedule

**SIB1** transmits every 80 ms and contains:

- **PLMN Identity list.** The Public Land Mobile Network ID identifies the operator: 3-digit **Mobile Country Code (MCC)** plus 2- or 3-digit **Mobile Network Code (MNC)**. Israel's MCC is 425; Pelephone is MNC 03. The list can include multiple PLMNs when the physical infrastructure is shared between operators.
- **Tracking Area Code (TAC)** — the geographic registration area. Section 21.6 explains how the UE's tracking area drives paging.
- **Cell barred?** Whether this cell is currently blocked for normal use (e.g., undergoing maintenance).
- **Frequency band indicator** — which 3GPP-defined band this cell operates in.
- **Scheduling of the other SIBs.** SIB1 tells the UE when SIB2, SIB3, etc., will be broadcast. Each SIB has its own periodicity (SIB2 typically every 160 ms, others less often).

The UE reads SIB1 first because it drives the decision of whether to try to attach to this cell at all. If the PLMN is not the UE's own (or an equivalent PLMN — § 25.4), and the UE is not roaming-permitted, the UE stops here without wasting battery on more SIBs.

### 9.3. SIB2 — how to actually use the cell

**SIB2** contains the parameters the UE needs to communicate with this cell:

- **Uplink frequency and bandwidth.** The absolute uplink carrier frequency (EARFCN — E-UTRA Absolute Radio Frequency Channel Number) and its bandwidth. For most FDD bands the uplink is a fixed offset from the downlink (e.g., 95 MHz below in band 3), but this SIB confirms it.
- **PRACH configuration** — which subframes carry random-access opportunities, which Zadoff-Chu root sequences, and which preamble format (§ 10).
- **PUCCH configuration** — where the uplink control channel sits at the band edges.
- **SRS configuration** — the cell-wide SRS subframe pattern (§ 7.3).
- **Power control parameters.**
- **Uplink cyclic shift and reference-signal group hopping** for DMRS and SRS.

Everything a UE needs to run its first uplink transmission (§ 10) comes from SIB2. This is why SIB1 must always point to SIB2, and SIB2 must be broadcast on a predictable schedule.

### 9.4. Higher SIBs — what each actually carries

Beyond SIB1 and SIB2, the standard defines a family of SIBs each answering one class of runtime question. Only the ones a UE actually needs in its current state are read; the others are ignored.

- **SIB3** — **cell-reselection parameters for the serving cell.** Thresholds telling an idle UE when to consider hopping to a neighbour: "if RSRP drops below $-115$ dBm, look at neighbours; if the best neighbour's RSRP exceeds serving by more than 3 dB for at least 1 second, reselect." Governs § 21.1 behaviour.
- **SIB4** — **neighbouring-cell list for intra-frequency reselection.** A list of PCIs on the same carrier frequency that the UE should measure against. Includes per-neighbour reselection biases (some neighbours preferred over others by policy). If SIB4 is absent, the UE assumes any measured neighbour on this frequency is a valid reselection candidate.
- **SIB5** — **neighbouring-cell list for inter-frequency reselection.** Same idea, but for cells on a different carrier frequency (which the UE cannot detect without an explicit measurement gap — § 21.5). Lists the alternate carrier frequencies and their PCIs so the UE knows where to look.
- **SIB6, SIB7, SIB8** — **reselection to UMTS (SIB6), GSM (SIB7), and CDMA2000 (SIB8)** respectively. Used when an operator's LTE coverage is incomplete and it wants idle UEs to fall back to a legacy generation cleanly. Each carries the target frequency, ARFCN, and cell-quality thresholds for that generation.
- **SIB9** — **HeNB (Home eNodeB) identity.** The name string of a femtocell (a small residential eNodeB), so the UE displays "MyISP-HomeCell" instead of "eNodeB 42".
- **SIB10, SIB11** — **ETWS notifications.** ETWS = Earthquake and Tsunami Warning System. SIB10 carries a short "primary" alert (magnitude, epicentre, warning level) so it can be broadcast fastest; SIB11 carries a longer "secondary" message (evacuation instructions, in multiple languages). Every UE reads these unconditionally when the ETWS flag in SIB1 is set.
- **SIB12** — **CMAS notifications.** CMAS = Commercial Mobile Alert System (US; equivalents exist worldwide). Amber Alerts, presidential alerts, imminent-threat notifications. Same unconditional-read behaviour as ETWS.
- **SIB13** — **MBMS control information.** MBMS (Multimedia Broadcast Multicast Service) is a mode where the eNodeB transmits the same content to many UEs at once (mobile TV, live sports). SIB13 tells UEs which subframes carry MBMS and how to receive it. Deployment is rare; most operators skipped MBMS in favour of unicast HTTP streaming.

Each SIB has its own transmission periodicity (SIB2 typically every 160 ms; SIB3–SIB5 every 320 ms or more; ETWS/CMAS immediately on trigger). Their exact scheduling is announced in SIB1.

A UE reads only the SIBs relevant to its state. An idle UE monitoring for handover reads SIB3–SIB5. A UE about to attach reads SIB1 and SIB2. Warning notifications (SIB10–SIB11, SIB12) are read immediately, unconditionally, when their bit flags in SIB1 are set — this is the mechanism for earthquake early warning and Amber Alerts on cellular.

### 9.5. Where SIBs live physically

MIB is on PBCH (its own dedicated channel structure).

**All other SIBs are on PDSCH** — the same shared downlink data channel that carries user data. They are transmitted as ordinary PDSCH transmissions, addressed by a well-known RNTI called **SI-RNTI** (System Information RNTI). Every UE knows the SI-RNTI value. A UE seeking system information runs the blind-decoding procedure (§ 12) over PDCCH candidates, attempting to CRC-match each candidate with SI-RNTI. Any match is a scheduling grant for a SIB; the UE then decodes the PDSCH RBs the grant points at, reading the SIB payload.

**Why are SIBs on PDSCH and not on their own dedicated broadcast channel like MIB?** MIB gets a dedicated channel (PBCH) because it must be readable *before the UE knows anything about the cell*, including its bandwidth or its scrambling seed. PBCH is designed to be robust at zero-knowledge conditions: fixed frequency (middle 72 subcarriers), fixed subframe (0), fixed length (24 bits), redundancy version accumulation over 40 ms. All that machinery costs precious spectrum in every subframe of every cell.

Once MIB is read, the UE knows the bandwidth and the PCI-derived scrambling. From that point on, adding *any* extra information can be done cheaply as a specially-addressed PDSCH transmission — no new physical channel needed. Reusing PDSCH lets the eNodeB dynamically decide how often to broadcast each SIB (some SIBs every 80 ms, some every second), how much bandwidth to give each transmission (adjust MCS based on cell radius), and skip infrequent SIBs entirely when unused. A dedicated broadcast channel per SIB would waste all that flexibility.

This is the first appearance of a general LTE pattern: **once the UE has enough context to decode PDSCH, everything that would otherwise be a broadcast channel becomes PDSCH addressed by a well-known RNTI.** The same idea shows up in paging (via P-RNTI, § 16.5) and RA responses (via RA-RNTI, § 10.5).

---

## § 10. Random access (PRACH): the timing bootstrap

The UE is now synchronised to the downlink and has read SIB1 and SIB2. To transmit anything on the uplink, it needs one more thing: a **timing advance (TA)** — an instruction telling it how much *earlier* than the arriving downlink boundary it should transmit, so that its uplink arrives at the eNodeB aligned with the network's clock.

Concretely: the UE sees the downlink frame boundary at some local time $t_0^{\text{UE}}$. Without TA, its natural instinct is to transmit its own uplink frame boundary at the same instant $t_0^{\text{UE}}$. But the downlink boundary arrived at the UE *after* propagating from the eNodeB, so $t_0^{\text{UE}}$ is already $\tau$ seconds later than the eNodeB's clock (where $\tau$ is the one-way propagation delay). If the UE transmits at $t_0^{\text{UE}}$, its uplink then propagates back another $\tau$ seconds and arrives at the eNodeB at time $t_0^{\text{eNB}} + 2\tau$ — off from the eNodeB's aligned uplink boundary by a full round-trip.

The eNodeB fixes this by commanding TA = $2\tau$: "transmit $2\tau$ seconds before the downlink boundary you see." Then the UE's uplink leaves at $t_0^{\text{UE}} - 2\tau$, propagates $\tau$, and arrives at $t_0^{\text{eNB}}$, aligned.

```
Time axis (eNodeB's clock)

   Downlink boundary sent at t₀^eNB
        │
        └──── propagation τ ────→
                                  │
                                  Downlink arrives at UE at t₀^UE = t₀^eNB + τ
                                  │
    Without TA:                   │
                                  UE transmits at t₀^UE
                                  ─── propagation τ ────→
                                                          │
                                                          Uplink arrives at t₀^eNB + 2τ  ← MISALIGNED

    With TA = 2τ:
                            UE transmits 2τ earlier, at t₀^UE − 2τ
                            ─── propagation τ ────→
                                                    │
                                                    Uplink arrives at t₀^eNB  ← ALIGNED
```

### 10.1. Why timing advance is a real problem

A UE at 30 km from the eNodeB has one-way propagation delay $30\,\text{km}/c = 100\,\mu\text{s}$. Without TA, its uplink arrives $200\,\mu\text{s}$ late — well outside the OFDM symbol window (recall $T_u = 66.67\,\mu\text{s}$), colliding with the neighbouring subframe.

The eNodeB needs the UE to transmit early enough that its uplink arrives on time. But the eNodeB does not know the UE's distance yet, and the UE does not know the timing advance yet. This is a bootstrap: the UE transmits *something* the eNodeB can measure, and from the arrival time the eNodeB computes and commands the TA.

That "something" is the **PRACH preamble**.

### 10.2. The Zadoff-Chu preamble and why it looks the way it does

The preamble must satisfy several unusual constraints:

- **The eNodeB does not know when it will arrive.** LTE cells can be up to about 100 km in radius (a limit imposed by the PRACH sequence duration itself, as we'll see below). At the largest cell size, a preamble transmitted from the cell edge without TA arrives up to $\sim 700\,\mu\text{s}$ later than the same preamble transmitted at the tower — one round-trip time at the maximum radius. The preamble must be detectable despite this unknown time shift.
- **The eNodeB does not know which of several possible preamble waveforms this UE chose.** There are 64 preambles per cell, and the UE picks one at random. The eNodeB must be able to distinguish which one.
- **Multiple UEs may transmit at the same PRACH opportunity.** If they pick different preambles, both should be detected.

The tool that solves all three: a **Zadoff-Chu (ZC)** sequence.

A ZC sequence of length $N_{\text{ZC}} = 839$ is defined by

$$s_r[n] = \exp\left(-j \pi r n(n+1)/N_{\text{ZC}}\right), \quad n = 0, 1, \ldots, N_{\text{ZC}}-1$$

where $r$ (the **root**) is coprime to $N_{\text{ZC}}$ (839 is prime, so any $r \in \{1, \ldots, 838\}$ works). Two properties matter:

**Property 1 — perfect autocorrelation.** Cyclic autocorrelation of a ZC sequence with itself is $N_{\text{ZC}}$ at zero lag and 0 at every other lag. This gives an infinitely sharp correlation peak — the eNodeB correlates the received signal with the expected ZC and gets a clean spike whose position tells it exactly when the preamble arrived.

**Property 2 — different roots are near-orthogonal.** Two ZC sequences with different roots $r_1, r_2$ have cross-correlation with magnitude $\sqrt{N_{\text{ZC}}}$ — small compared to the peak $N_{\text{ZC}}$. So multiple preamble roots can coexist and the eNodeB can distinguish them.

### 10.3. Cyclic shifts — extracting many preambles from one root

The 64 preambles per cell are not encoded as 64 different roots, for two related reasons:

- **Cost at the eNodeB.** Each distinct root requires a separate correlator running in parallel to detect its arrival. Sixty-four parallel correlators is expensive silicon.
- **Cross-correlation budget.** Although two ZC sequences with different roots have cross-correlation of magnitude only $\sqrt{N_{\text{ZC}}} \approx 29$ (compared to the peak of 839), that residual is not negligible at low SNR — two simultaneous UEs on different roots can produce spurious cross-correlation spikes that mimic false preambles.

Instead, most preambles are **cyclic shifts** of a small number of roots. A cyclic shift produces a sequence whose autocorrelation peak against the *original* ZC lands at position $N_{\text{CS}}$ instead of at zero — a controlled, predictable displacement.

So the eNodeB runs *one* correlator per root and interprets the output as a set of peaks along the delay axis. Multiple peaks at different displacements = multiple UEs sending different cyclic shifts of the same root, all in the same subframe.

**The identification rule.** A peak from one correlator, at some position $p$, has two candidate explanations:

- The UE sent the unshifted preamble (shift = 0), and its signal is delayed by $p$ samples due to propagation from a far-away cell edge.
- The UE sent a preamble with cyclic shift $p$, and its signal arrived with zero propagation delay.

The two are indistinguishable *unless* we bound the maximum possible propagation delay to something smaller than the cyclic-shift spacing. Formally: let $\tau_{\max}$ be the maximum possible round-trip delay in this cell (fixed by the cell radius). If the cyclic-shift spacing $N_{\text{CS}}$ is chosen so $N_{\text{CS}} > \tau_{\max}$ (plus a small guard for delay spread), then each cyclic-shift value $k \cdot N_{\text{CS}}$ owns a disjoint "window" of possible peak positions $[k \cdot N_{\text{CS}}, k \cdot N_{\text{CS}} + \tau_{\max}]$. A peak in window $k$'s range unambiguously came from cyclic shift $k$; the offset within the window gives the propagation delay (hence the TA the eNodeB will command).

**Preambles per root — why the count matters, and where it comes from.** Each cyclic-shift value occupies an $N_{\text{CS}}$-sample-wide window along the delay axis. With the sequence being $N_{\text{ZC}} = 839$ samples long total, the number of non-overlapping windows that fit is

$$\left\lfloor \frac{N_{\text{ZC}}}{N_{\text{CS}}} \right\rfloor = \left\lfloor \frac{839}{N_{\text{CS}}} \right\rfloor.$$

That is the number of distinct preambles the eNodeB can extract from a single root correlator. It matters because the cell has to configure enough roots for the 64 preambles it needs to publish: if $N_{\text{CS}}$ is small (small cell radius), one root gives 64 preambles and the cell uses just one root; if $N_{\text{CS}}$ is large (large cell), one root gives few preambles, and multiple roots must be listed in SIB2.

Cell radius drives $N_{\text{CS}}$:

| Cell type | Radius | Round-trip | $N_{\text{CS}}$ | Preambles/root | Roots needed for 64 |
|---|---|---|---|---|---|
| Urban microcell | 1 km | $\sim 7\,\mu\text{s}$ | 13 | 64 | 1 |
| Suburban | 5 km | $\sim 33\,\mu\text{s}$ | 34 | 24 | 3 |
| Rural macrocell | 20 km | $\sim 130\,\mu\text{s}$ | 119 | 7 | 10 |

The urban microcell can extract all 64 preambles from a single root sequence. The rural cell must broadcast a list of 10 root sequence indices in SIB2 so UEs have enough combinations to pick from. This trade — coverage vs preamble diversity — is why SIB2 has to configure it.

### 10.4. Why the PRACH waveform is different from ordinary uplink

Ordinary LTE uplink uses subcarrier spacing $\Delta f = 15\,\text{kHz}$, giving $T_u = 66.67\,\mu\text{s}$ per OFDM symbol. But PRACH does not have timing advance yet, so a preamble's arrival time can be off by up to the maximum round-trip. If the receiver's FFT window is $66.67\,\mu\text{s}$, a preamble arriving $100\,\mu\text{s}$ late falls almost entirely outside the window — the receiver would see essentially none of it.

PRACH's solution: use $\Delta f_{\text{PRACH}} = 1.25\,\text{kHz}$. The phrase "a factor of 12 smaller" is against ordinary uplink's 15 kHz: 15 / 1.25 = 12. Making subcarrier spacing 12× smaller makes the useful symbol duration 12× longer:

$$T_{\text{SEQ}} = \frac{1}{1.25\,\text{kHz}} = 800\,\mu\text{s},$$

which comfortably accommodates any propagation delay up to about $\pm 400\,\mu\text{s}$ around the symbol center — enough for the biggest cells LTE can serve. The eNodeB's PRACH FFT window is 800 μs wide; a preamble arriving anywhere in that window is fully captured.

The narrower spacing has an additional benefit: 839 tones at 1.25 kHz spacing span $839 \times 1.25\,\text{kHz} \approx 1.05\,\text{MHz}$, which fits inside the 6 RBs (1.08 MHz) that PRACH is allowed to occupy. So a 20 MHz cell reserves just 6 out of 100 RBs for PRACH — 6% of the bandwidth — and the same allocation works for all LTE bandwidths down to 1.4 MHz (where it is 100%, so PRACH consumes the entire cell during PRACH opportunities).

The PRACH cyclic prefix is also unusually long — several tens of microseconds — because it must cover the delay-spread on top of the unknown arrival time.

### 10.5. The four messages of contention-based random access

Terminology first: the **PRACH preamble** we discuss below is the ZC sequence transmitted on the PRACH physical resource; it is not the SSS m-sequence and not any Gold sequence — those live on entirely different channels. "Preamble" in the PRACH context always means one specific ZC-derived waveform out of the 64 allocated to this cell.

The full random-access procedure has four messages:

- **Msg1: Preamble.** UE transmits a chosen ZC preamble on PRACH. No user data, no identity — just a raw waveform. The eNodeB detects the peak position, computes the arrival delay, and knows *which* preamble was used but *not who* used it.

- **Msg2: Random Access Response (RAR).** The eNodeB transmits on PDSCH, addressed by **RA-RNTI (Random Access RNTI)**, an RNTI computed deterministically from the time and frequency slot of the PRACH opportunity:
  $$\text{RA-RNTI} = 1 + t_{\text{id}} + 10 \cdot f_{\text{id}}$$
  where $t_{\text{id}}$ is the subframe index within the frame and $f_{\text{id}}$ is the frequency resource index. Both the UE and the eNodeB compute this from the PRACH slot, so the UE knows what RNTI to look for. RAR contains:
  - **Timing advance command.** Now the UE knows how early to transmit.
  - **Uplink grant.** A small allocation of PUSCH resources for the UE to use in Msg3.
  - **Temporary C-RNTI (Cell RNTI).** A UE identifier that will become permanent (as the UE's ordinary C-RNTI in this cell) if this procedure succeeds.

- **Msg3: RRC Connection Request (or similar).** The UE uses the Msg2 grant to transmit an actual RRC message on PUSCH. This is the first message that includes the UE's identity — either an **S-TMSI** (SAE Temporary Mobile Subscriber Identity — the 40-bit lower portion of a GUTI carrying MME Code + M-TMSI, defined properly in § 16.3, that survives across attaches within one MME) if the UE has one from a previous session, or the IMSI (International Mobile Subscriber Identity, defined in § 16.2) for very-first-time access when no S-TMSI is available yet.

  **Why does contention happen at all?** The 64 PRACH preambles are a *shared resource within the cell*: any UE that decides to do random access picks one of the 64 uniformly at random with no coordination with any other UE. If two UEs happen to pick the same preamble in the same PRACH opportunity, both are undetectable to the eNodeB as separate transmissions — the two ZC waveforms superpose in the air, and the eNodeB sees one correlation peak. Both UEs then read the same Msg2 (Msg2 is addressed by RA-RNTI, which depends only on the PRACH slot, not on which preamble was picked). Both UEs then transmit Msg3 on the *same* PUSCH resource assigned by the shared Msg2. This collision on Msg3 is what "contention" refers to: it is the moment when two UEs' distinct identities have to be resolved into "one wins, others retry." The shared thing is not any secret or key — it is the finite, uncoordinated pool of 64 preamble waveforms.

- **Msg4: Contention Resolution.** The eNodeB echoes back the identity from one specific Msg3 it could decode (typically the strongest of the colliding transmissions on PUSCH). Every UE that transmitted a Msg3 reads Msg4; whichever UE's identity matches, that UE has won the contention. The others silently drop out and retry the whole procedure from Msg1 (usually with an exponential backoff so the same collision doesn't repeat).

### 10.6. Contention-based vs contention-free random access

The four-message procedure above is **contention-based**, used when the UE initiates access (booting up, waking from idle, needing to send data after a scheduling gap).

**Contention-free** random access is used when the network already has a relationship with the UE and needs the UE to re-align its timing — most commonly during a handover (§ 21.3). The target eNodeB, in the handover command sent over X2, reserves one specific PRACH preamble (one of the 64 ZC-derived waveforms) exclusively for this UE — that is, the target eNodeB commits that no other UE will be told to use that particular preamble during a short window. When the UE arrives on the new cell and transmits that unique preamble, no other UE would ever pick it, so there is no collision. Messages 3 and 4 are skipped; the procedure is preamble + RAR only, which cuts handover latency significantly.

---

## § 11. Downlink control-region physical layer

Section 13 will describe the *scheduling* — the eNodeB's per-subframe decisions about who transmits what, communicated to UEs via DCIs (Downlink Control Information messages) and answered via UCI (Uplink Control Information reports). This section describes only the *physical channels* that carry those messages on the downlink control region, and their atomic units. Readers who want to skip straight to how the scheduler operates can jump to § 13 and refer back here for specifics.

### 11.1. Three channels in the control region

The downlink control region (§ 5.3) hosts three channels:

- **PDCCH (Physical Downlink Control Channel)** — the DCI carrier. Every scheduling event (paging, SIB delivery, RA response, PDSCH grant, PUSCH grant) becomes a DCI on PDCCH. This is what § 13 talks about.

- **PCFICH (Physical Control Format Indicator Channel)** — a 2-bit indicator carrying **CFI ∈ {1, 2, 3}** that announces how many OFDM symbols wide the control region is *in this subframe*. It sits in fixed known positions in symbol 0 of every subframe, so the UE reads it first, before it can find PDCCH. The region size is dynamic (§ 5.5): light load allows CFI = 1; heavy load with many small allocations may need CFI = 3. Everything else in this section takes CFI as given.

- **PHICH (Physical HARQ Indicator Channel)** — a single ACK/NACK bit per uplink transmission. If the UE transmitted PUSCH in subframe $n$, PHICH for that transmission arrives in subframe $n+4$. This tight timing is what makes uplink HARQ **synchronous** (§ 13.4): no DCI is needed to point to the ACK — its position is fixed by the PUSCH's position. Multiple PHICH bits are code-division multiplexed onto a small number of REs.

### 11.2. REG and CCE — the atomic units, and why they are frequency-scattered

A naive PDCCH design would put each DCI in a contiguous chunk of REs. That fails against frequency-selective fading: one narrow fade wipes out the whole DCI. LTE scatters every DCI across the frequency axis so no single fade can destroy it.

**REG (Resource Element Group) = 4 REs.** These 4 REs are not adjacent; they are chosen from within one OFDM symbol of the control region at approximately regular subcarrier spacings (skipping CRS positions). Each REG carries 4 QPSK symbols = 8 bits (1 byte). QPSK specifically because the control channel must survive worse SNR than any PDSCH allocation — every UE including cell-edge ones must be able to demodulate it.

**CCE (Control Channel Element) = 9 REGs = 36 REs = 72 coded bits.** One DCI occupies some integer number of CCEs. Within a CCE the REGs are interleaved by a pseudo-random permutation seeded by PCI: REG 0 might land at the low end of the band, REG 1 at the high end, REG 2 in the middle. A frequency-selective fade over $\sim 200$ kHz wipes out at most 1 or 2 REGs of any CCE, leaving 7 or 8 REGs intact — the convolutional code protecting the DCI absorbs a few erasures.

### 11.3. Aggregation levels — trading coding rate for CCE count

A DCI can occupy $L \in \{1, 2, 4, 8\}$ consecutive CCEs. This $L$ is the **aggregation level.** The DCI payload does not grow with $L$; instead, more coded-bit space is used for the *same* DCI, so the coding rate

$$R = \frac{K}{72 L}$$

(where $K$ is the DCI's bit count) drops as $L$ rises. Lower coding rate means more redundancy, which means more robust decoding:

- **$L = 1$** (72 coded bits): high rate, low robustness. Used for UEs near the eNodeB.
- **$L = 8$** (576 coded bits): rate $\sim 1/8$ or less. Used for cell-edge UEs.

The scheduler picks $L$ per UE per subframe, based on the UE's reported CSI (§ 7.4) and the eNodeB's own knowledge of that UE's uplink signal quality. The UE does not know in advance which $L$ was chosen — one of the reasons blind decoding (§ 12) is necessary.

### 11.4. The RNTI-masked CRC — addressing without a "To:" field

A DCI has no explicit "recipient" field. The address is smuggled into the 16-bit CRC.

The eNodeB computes the DCI's CRC $c = \text{CRC}(d)$ where $d$ is the DCI payload. It XORs $c$ with the intended recipient's RNTI:

$$c_{\text{tx}} = c \oplus r_{\text{RNTI}}$$

and transmits $d \Vert c_{\text{tx}}$. A UE that expects RNTI $r_{\text{UE}}$ decodes the received bits, extracts $c_{\text{rx}}$, XORs with its expected RNTI, and checks whether the result equals $\text{CRC}(d)$. If yes, the DCI was for this UE; if no, either the DCI was for someone else (their RNTI is different) or decoding failed. Same test, two failure modes.

This saves 16 bits of address per DCI — a nontrivial gain when the control region is precious. The false-positive probability is $2^{-16} \approx 1.5 \times 10^{-5}$ per attempted decode, small enough that with hundreds of decodes per second the probability of ever accepting a wrong DCI is negligible.

---

## § 12. Blind decoding and search spaces

> **A note on where this fits.** The material in this section is a low-level implementation detail: it explains *how* the UE finds its DCI on PDCCH, given that the DCI carries no explicit recipient. Readers focused on the higher-level scheduling story (§ 13) or the protocol stack (§ 14 and up) may skip § 12 on a first pass and return only when they need to understand PDCCH's decoding-budget accounting or the false-alarm math behind it.

The UE does not know in advance where its DCI is, what aggregation level was used, or which DCI format it will be — but it must still decode it every subframe with a bounded number of attempts.

### 12.1. What the UE knows going in

The UE knows:
- Subframe boundary (from PSS/SSS lock).
- Control region size (from PCFICH — decoded first).
- The list of available CCEs (from the control region size and the CRS/PHICH placement rules).
- Its own C-RNTI, plus the well-known RNTIs it may need to check (SI-RNTI, P-RNTI, RA-RNTI while a random-access response is expected).
- Its configured transmission mode (which restricts the DCI formats it needs to consider).
- The deterministic candidate-position rules the standard specifies.

The UE does not know:
- Which CCE(s) contain its DCI *this* subframe.
- Which aggregation level $L$ was used.
- Which DCI format was chosen (the eNodeB might have used a compact format 1A for paging or a full format 1 for a scheduled data grant).

### 12.2. Search spaces bound the work

If the UE had to try every CCE at every aggregation level with every DCI format, it would perform hundreds or thousands of decodes per subframe — infeasible in a 1 ms budget. Instead, the standard defines a **search space** — a small set of allowed candidate CCE positions the UE must try.

Two search spaces exist:

- **Common Search Space (CSS)** — for messages that many UEs must find. RNTIs used here: SI-RNTI, P-RNTI, RA-RNTI, TPC-RNTI (group power control). Every UE in the cell computes the same 16-CCE-wide CSS at fixed positions $\{0, \ldots, 15\}$.
  - $L = 4$: 4 candidates $\{0,1,2,3\}, \{4,5,6,7\}, \{8,9,10,11\}, \{12,13,14,15\}$.
  - $L = 8$: 2 candidates $\{0,\ldots,7\}, \{8,\ldots,15\}$.
  - Total: 6 candidates. Only $L = 4$ and $L = 8$ because these messages must be decodable by weak UEs.

- **UE-Specific Search Space (USS)** — for ordinary scheduling addressed to a UE's C-RNTI. This must be different per UE, or every UE would compete for the same CCEs.
  - $L = 1$: 6 candidates.
  - $L = 2$: 6 candidates.
  - $L = 4$: 2 candidates.
  - $L = 8$: 2 candidates.
  - Total: 16 candidates.

Candidate counts drop at higher aggregation levels because an $L = 8$ candidate consumes 8 CCEs — a lot of the control region — so allowing many $L = 8$ candidates per UE would make scheduling impossible.

### 12.3. The candidate-position formula

For UE-specific search space, the starting CCE of candidate $m$ at aggregation level $L$ in subframe $k$ is

$$\text{CCE}(L, m, i) = L \cdot \left[ (Y_k + m) \bmod \left\lfloor \frac{N_{\text{CCE},k}}{L} \right\rfloor \right] + i, \quad i = 0, 1, \ldots, L-1$$

where $N_{\text{CCE},k}$ is the total number of CCEs in this subframe's control region, and $Y_k$ is a pseudo-random value that pins the candidate positions per UE per subframe:

$$Y_k = (A \cdot Y_{k-1}) \bmod D, \quad Y_{-1} = n_{\text{RNTI}}, \quad A = 39827, \quad D = 65537.$$

The recurrence is seeded with the UE's C-RNTI, so different UEs have decorrelated candidate sets. The purpose is not cryptographic — it is to *spread* different UEs' candidates across the control region so the scheduler has choices when trying to fit everyone's DCIs into non-overlapping CCEs.

Numerical example: suppose $N_{\text{CCE},k} = 80$ and $Y_k = 12847$.

At $L = 1$: $\lfloor 80/1 \rfloor = 80$, so $(12847 + m) \bmod 80 = 47, 48, 49, 50, 51, 52$ for $m = 0, \ldots, 5$. Six single-CCE candidates at positions $\{47\}, \{48\}, \{49\}, \{50\}, \{51\}, \{52\}$.

At $L = 2$: $\lfloor 80/2 \rfloor = 40$, so $(12847 + m) \bmod 40 = 7, 8, 9, 10, 11, 12$. Times 2 gives starting positions $14, 16, 18, 20, 22, 24$; candidates $\{14, 15\}, \{16, 17\}, \ldots$

At $L = 4$: two candidates. At $L = 8$: two candidates.

The eNodeB knows the UE's C-RNTI, so it computes the same candidate set and chooses one of those positions to place the DCI. Nothing needs to be signalled about which position was chosen; the CRC-with-RNTI check tells the UE.

### 12.4. Why UE-specific positions rotate every subframe

The eNodeB is the scheduler; it explicitly prevents two DCIs from occupying the same CCEs. So why bother with pseudo-random rotation of candidate positions?

The reason is scheduling flexibility, not collision avoidance. If every UE had one fixed set of allowed positions, the scheduler would face a rigid problem: "UE $A$ wants position 5, UE $B$ wants position 5, one of them cannot be scheduled this subframe." With rotating positions, UE $A$'s wanted positions this subframe differ from UE $B$'s, and the scheduler has more room to fit both. Over many subframes each UE's candidates cover a wide swath of the control region, giving the scheduler flexibility.

### 12.5. False-positive probability

A wrong candidate (say, one containing a DCI for another UE, or containing noise from PDSCH) fails the CRC check with probability $\sim 1 - 2^{-16}$. So the false-positive probability per attempted decode is $\sim 1.5 \times 10^{-5}$.

With $\sim 22$ candidates per subframe and about 2 DCI formats to try at each, the total is $\sim 44$ blind decodes per subframe. Expected false positive rate: $44 \times 2^{-16} \times 1000$ subframes/sec $\approx 0.67$ per second.

But this ideal-random-trials estimate is loose; several effects push the real rate much lower:
- Many DCI formats fail sanity checks (impossible RB allocations, invalid MCS values).
- Not every UE tries every candidate/format/RNTI every subframe (e.g., SI-RNTI only checked when SIB is scheduled; P-RNTI only at paging occasions).
- Practical receivers add implementation-level plausibility checks.

The takeaway: the $2^{-16}$ intuition explains why a wrong candidate almost always fails; the naive multiplication by candidate count is not a valid prediction of real false-DCI acceptance.

---

## § 13. The scheduling feedback loop: DCI, UCI, HARQ, and timing

Every millisecond, the eNodeB's MAC scheduler is asking: "which UEs will transmit or receive, on which RBs, with what modulation, and what has been acknowledged?" The answer is expressed through a tight feedback loop with two message families — DCI going down, UCI going up — synchronized by a small set of fixed timings. This section is one continuous argument: we start with what the scheduler needs to decide, then derive each piece of the feedback loop that lets it decide.

### 13.1. What the scheduler needs, and where it gets it

To hand out a downlink grant to a UE, the eNodeB needs to know:

- **Whether the UE has data to send / receive.** Downlink: the eNodeB knows what has arrived at its own S1-U ingress. Uplink: only the UE knows what its OS wants to send; the eNodeB has to be told.
- **The UE's radio conditions.** **MCS (Modulation and Coding Scheme)** — the choice of constellation size (QPSK, 16-QAM, 64-QAM, 256-QAM) and forward-error-correction code rate — is picked based on the UE's current SNR/SINR. Downlink: the UE measures CRS and reports a suggested MCS via CQI (§ 7.4). Uplink: the eNodeB measures the UE's SRS or DMRS directly.
- **Which HARQ processes are free.** A HARQ process cannot be reused until its previous transmission is acknowledged.

The scheduler is a black-box optimizer (proportional-fair, max-CQI, round-robin — vendor-specific), but the *inputs* it needs are what the standard fixes. Those inputs are the UCI reports. And once the scheduler makes a decision, the *output* is a DCI announcing it.

### 13.2. DCI formats — the downlink command menu

**DCI (Downlink Control Information)** is a compact scheduling command carried on PDCCH. Its bit layout is one of eleven "formats," each optimized for a specific scheduling situation:

| Format | Direction | What it announces | Rough size |
|---|---|---|---|
| **0** | UL grant | "Transmit PUSCH on RBs $\{a\}$ with MCS $m$, in subframe $n+4$" | 30–50 bits |
| **1A** | DL grant, compact | "Receive PDSCH on RBs $\{a\}$" (also used for paging, RAR, SIB) | 30–40 bits |
| **1** | DL grant, standard, no MIMO | Full non-MIMO downlink assignment | 40–50 bits |
| **1B/1C/1D** | Various DL variants | Compact for MU-MIMO, semi-persistent scheduling | Varies |
| **2 / 2A / 2B / 2C / 2D** | DL grant with MIMO | Same but with precoding info, 2–8 layers | 60–100 bits |
| **3 / 3A** | Group TPC | Bulk power-control commands to a group of UEs | Variable |
| **4** | UL grant with MIMO | Uplink with multiple layers | 40–60 bits |

Each format's exact bit width depends on the LTE bandwidth (larger bandwidth = more RBs = more bits to encode the allocation) and on the configured transmission mode. **All bit fields are packed with no wasted space**; the eNodeB knows the exact layout, and the UE reconstructs the fields by matching the format-size assumption when it blind-decodes (§ 12).

**Common fields inside a DCI** (varying by format):

- **Resource Block Assignment** (bits scale with bandwidth; e.g., ~13 bits for 20 MHz using compact resource allocation type 0 with bitmap-of-groups).
- **MCS Index** (5 bits, referencing a table of modulation and coding rate combinations).
- **HARQ Process Number** (3 bits, addressing one of 8 HARQ processes).
- **New Data Indicator** (1 bit; toggled to indicate this is a fresh transmission vs a retransmission).
- **Redundancy Version** (2 bits; which of 4 rate-matched versions is transmitted this time).
- **TPC** (2 bits, power-control command for PUCCH or PUSCH).
- **DAI** (Downlink Assignment Index, in TDD only — tracks HARQ ACKs to bundle).

### 13.3. UCI — the uplink report channel

**UCI (Uplink Control Information)** is what the UE reports to enable the scheduler's next decision. It rides either on PUCCH (when the UE has no PUSCH data anyway) or is **piggybacked onto PUSCH** (when the UE has data flowing; UCI bits are multiplexed with PUSCH before turbo coding, saving PUCCH capacity for other UEs).

UCI carries exactly three kinds of information:

- **HARQ ACK/NACK** — 1 bit per received downlink block. "I received your PDSCH at subframe $n$; the CRC checked (ACK) or did not (NACK)." Without this the eNodeB does not know whether to retransmit.

- **Scheduling Request (SR)** — 1 bit on configured occasions (typically every 5–20 ms per UE). "I have uplink data buffered; please grant me PUSCH." The SR is essentially "raise your hand." It carries no volume information; a follow-up **BSR** (§ 13.6) will.

- **CSI (Channel State Information) report** — 4 to 20 bits. **CQI** (4 bits: recommended MCS index), **PMI** (Precoding Matrix Indicator, if MIMO), **RI** (Rank Indicator, if MIMO). Periodic (every configured interval) or aperiodic (triggered by a bit in a DCI).

### 13.4. HARQ — DL asynchronous vs UL synchronous

**HARQ (Hybrid ARQ)** is the retransmission machinery. "Hybrid" because it combines forward error correction (turbo codes) with retransmission: the receiver keeps the corrupted first attempt in its "soft buffer" and combines it with the retransmitted version, so the combined LLRs may decode correctly even when neither individual copy would.

There are 8 parallel HARQ processes (§ 4.5 explained why 8). Each is an independent state machine tracking one in-flight block. Between them, they keep the pipeline full while any given block is being acknowledged.

**Downlink HARQ is asynchronous.** When the eNodeB retransmits a NACKed downlink block, it can do so in *any later subframe*. It is not tied to a fixed retransmission time. To tell the UE "this is a retransmission of process $P$," the eNodeB sends a fresh DCI whose HARQ Process Number field equals $P$ and whose New Data Indicator has not toggled since the previous transmission on that process. The scheduler has full flexibility.

**Uplink HARQ is synchronous.** If the UE transmitted PUSCH at subframe $n$ and received a NACK on PHICH at subframe $n+4$, it retransmits at subframe $n+8$ — always. The subframe alone signals which HARQ process is being retransmitted; no DCI is needed for the retransmission.

Why the asymmetry? The eNodeB wants scheduling flexibility for its own PDSCH (asynchronous). But uplink retransmissions need an ACK/NACK indication, and using a full DCI for each would consume PDCCH space that could otherwise go to fresh grants. The synchronous timing rule eliminates that cost: PHICH's 1 bit is much cheaper than a full DCI, and the fixed subframe removes any ambiguity about which HARQ process is being retransmitted.

### 13.5. The N+4 rule and how it cascades

The "$n+4$" gap between related events comes from the 3 ms UE processing budget (§ 4.5), rounded up to whole subframes:

- Subframe $n$: PDSCH is received.
- Subframes $n{+}1$ to $n{+}3$: UE processes (demap, turbo decode, CRC check).
- Subframe $n{+}4$: UE transmits ACK/NACK on PUCCH.

The same 4-subframe delay applies to every scheduler-UE round trip:

- **UL grant → PUSCH transmission**: DCI in subframe $n$ → UE transmits in $n{+}4$.
- **PUSCH → PHICH ACK/NACK**: UE transmits in $n$ → eNodeB acknowledges on PHICH in $n{+}4$.
- **PUSCH NACK → UL retransmission (synchronous)**: PUSCH in $n$, PHICH NACK in $n{+}4$, retransmission in $n{+}8$.

DL round trip: PDSCH in $n$ → ACK in $n{+}4$ → retransmission possible in $n{+}8$ = 8 subframes = 8 ms. This is the "8 HARQ processes" that keeps the pipeline full.

### 13.6. Complete transactions with retransmission

**Downlink transaction with one retransmission:**

- Subframe 100: eNodeB transmits DCI on PDCCH for UE with C-RNTI $R$; UE blind-decodes and finds it. Same subframe, PDSCH is transmitted on the RBs the DCI announced. UE demodulates but CRC fails.
- Subframe 104: UE transmits NACK on PUCCH.
- Subframe 108 (soonest possible): eNodeB sends a fresh DCI for the same C-RNTI, with the same HARQ process number, New Data Indicator unchanged (indicating retransmission), and a different Redundancy Version. The PDSCH in subframe 108 carries a rate-matched variant of the same information bits.
- UE soft-combines with the copy stored from subframe 100. Combined LLRs typically decode.
- Subframe 112: UE transmits ACK. HARQ process is released.

**Uplink transaction from cold to complete:**

- Subframe 100: UE has data queued in its OS. It has an SR opportunity configured for subframe 100. Transmits SR = 1 bit on PUCCH.
- Subframe ~105: eNodeB (having decoded the SR) sends a small UL grant on PDCCH (DCI format 0) to this UE.
- Subframe 109: UE transmits on PUSCH per the grant. Because it has not sent a BSR yet, the UE fills this first tiny grant with a BSR MAC control element saying "I have 450 KB of video and 20 KB of VoLTE queued."
- Subframe 113: eNodeB acknowledges on PHICH.
- Subframe ~113–115: eNodeB now knows the UE's buffer sizes; issues larger DCIs on subsequent subframes to schedule the queued data efficiently.
- The UE fills those larger grants with actual video and voice bytes, no further SR needed as long as the data keeps flowing.

The two-step *SR → tiny grant → BSR → real grant* is what the LTE uplink does to allocate fairly across UEs. Once a flow is active, the eNodeB proactively grants — the UE only re-does the SR path when there is a gap in scheduling long enough that all grants have been consumed and it has fresh data.

### 13.7. BSR — the volume report inside a MAC PDU

A **BSR (Buffer Status Report)** is a MAC control element specifying, per **Logical Channel Group** (LCG — a group of logical channels sharing a QoS bucket), how many bytes the UE has waiting to send:

```
BSR format (short BSR, 1 byte):
   ┌──────────┬────────────────────┐
   │ LCG ID   │ Buffer Size Index  │
   │  (2 bit) │      (6 bit)       │
   └──────────┴────────────────────┘

BSR format (long BSR, 3 bytes):
   ┌────────┬────────┬────────┬────────┐
   │ LCG 0  │ LCG 1  │ LCG 2  │ LCG 3  │  (6 bit each, buffer-size indices)
   └────────┴────────┴────────┴────────┘
```

The **Buffer Size Index** is a 6-bit look-up into a table of 64 quantized buffer-size ranges (from 0 bytes up to ~150 KB); the UE reports the smallest index whose range covers its actual buffer. This gives the scheduler a coarse but sufficient sense of how much to grant.

Four LCGs let the UE distinguish traffic classes: e.g., LCG 0 = signalling (SRB1/2), LCG 1 = VoLTE audio (DRB with QCI 1), LCG 2 = video streaming (DRB with QCI 6), LCG 3 = best-effort (DRB with QCI 9). The scheduler can then prioritize granting to LCGs whose QCIs warrant it.

**When the UE has no PUCCH resources at all** (because it has been idle too long and its PUCCH SR occasion has lapsed), it drops down to the most basic mechanism in LTE — random access via PRACH (§ 10) — just to bootstrap the ability to transmit any control message. This is why a UE returning from a long idle period sometimes takes a moment to send data: it is doing a full contention-based PRACH before it can send even the first BSR.

---

## § 14. The protocol stack: what each layer adds

Every packet in LTE, whether user data or signalling, traverses a stack of layers between the application and the antenna. The layers add different kinds of value; understanding what each adds is the map for reasoning about performance, security, and failure modes.

The stack, from top (application-facing) to bottom (radio-facing):

- **NAS** (control plane only)
- **RRC** (control plane only)
- **PDCP**
- **RLC**
- **MAC**
- **PHY**

Let us build it from the bottom up.

### 14.1. PHY — turning bits into radio

PHY is everything from § 3 to § 11. It takes a block of coded bits, modulates them onto the OFDM resource grid using the assigned RBs and MCS, applies HARQ retransmission if a NACK arrives, and hands the raw byte stream back up. From above, PHY looks like a channel that occasionally loses blocks and gets slower or faster depending on radio conditions.

### 14.2. MAC — multiplexing and HARQ management

**MAC (Medium Access Control)** sits between multiple logical data streams (bearers — § 17) and the single PHY layer. Its jobs:

- **Multiplexing.** Two logical channels of data flowing to the same UE (say, VoLTE audio and web browsing) share one PHY transmission. MAC packages the bytes from each into a MAC PDU that PHY encodes as one block.
- **HARQ.** MAC runs the state machine for HARQ retransmissions — one instance per HARQ process, with the soft buffer and the redundancy-version counter.
- **Scheduling requests and BSR.** MAC-level control PDUs (§ 13.7) tell the scheduler what to grant.
- **Random access.** The full PRACH state machine (§ 10) is MAC.

MAC is where LTE's "quality of service" first begins to matter: the scheduler picks which UE and which logical channel to serve within each grant, applying priorities.

### 14.3. RLC — segmentation and ARQ

**RLC (Radio Link Control)** is a per-bearer layer that handles the mismatch between IP packet sizes (often 1500 bytes, sometimes 9000) and radio grants (often much smaller):

- **Segmentation.** A large IP packet is broken into RLC segments, each fitting the current uplink grant. Each segment has a sequence number so the receiver can reassemble.
- **Reassembly.** The receiver waits for all segments of a packet and reconstructs.
- **ARQ.** Unlike HARQ (which is fast, at MAC/PHY, using soft-combining), RLC ARQ is slower and works at a higher level: the receiver notices a missing segment and requests explicit retransmission. This is the second line of defence — when HARQ has given up after its maximum number of retransmissions, RLC catches the loss.

RLC operates in three modes: **TM (Transparent Mode)** for signalling that doesn't need segmentation, **UM (Unacknowledged Mode)** for real-time traffic like VoLTE (no ARQ, since a late retransmit is worse than a loss), and **AM (Acknowledged Mode)** for reliable data like TCP/HTTP.

### 14.4. PDCP — ciphering, integrity, header compression

**PDCP (Packet Data Convergence Protocol)** is the top of the user-plane radio stack (below the IP layer) and simultaneously carries control-plane traffic (RRC and NAS). It does four things:

**(1) Ciphering.** Every user-plane packet is encrypted using $K_{\text{UPenc}}$; every control-plane packet using $K_{\text{RRCenc}}$ (§ 18). Ciphering algorithm is one of three (negotiated at NAS Security Mode Command):

- **EEA0** — null (no encryption; used only for emergency-only bearers or in test setups).
- **EEA1 (SNOW 3G)** — stream cipher inherited from 3G. Standard elsewhere; less common in modern deployments.
- **EEA2 (AES-128 in CTR mode)** — the current mainstream choice.
- **EEA3 (ZUC)** — a Chinese-designed stream cipher; used in some deployments in China.

The ciphering computes a keystream from `(key, COUNT, BEARER, DIRECTION, LENGTH)` and XORs it with the plaintext (§ 18.4 explained why COUNT, BEARER, and DIRECTION all appear in the input).

**(2) Integrity protection.** For control-plane packets, PDCP computes a 32-bit **MAC-I (Message Authentication Code for Integrity)** using an EIA-family algorithm keyed with $K_{\text{RRCint}}$ (or $K_{\text{NASint}}$ for NAS). The MAC-I is appended to the PDCP payload; the receiver recomputes it and drops the packet if the MAC-I does not match. This makes it cryptographically impossible for an attacker to forge or modify RRC or NAS messages.

Algorithm choices: EIA0 (null, emergency only), EIA1 (SNOW 3G MAC), EIA2 (AES-CMAC), EIA3 (ZUC MAC). Same lineage as the encryption algorithms.

User-plane packets are *not* integrity-protected in LTE (§ 18.7). 5G changed this — 5G's user-plane integrity is optional, but at least the mechanism exists to turn it on.

**(3) Robust Header Compression (RoHC).** VoLTE packets have an IP/UDP/RTP header stack that is 40 bytes (IPv4) or 60 bytes (IPv6) attached to every 20 ms of audio. AMR-WB compresses 20 ms of speech to 30–60 bytes, so half or more of every transmitted packet would be header overhead if sent naively. RoHC compresses these headers to 1–3 bytes.

RoHC operates by having compressor and decompressor keep a shared **context** — a running record of the header fields (source IP, destination IP, source port, destination port, RTP SSRC, plus predictable-progression fields like sequence number and timestamp). The compressor sends only the *differences* from the context.

RoHC has three operating modes, corresponding to increasingly aggressive compression:

- **IR (Initialization and Refresh).** Full 40- or 60-byte header, plus a small RoHC-specific type tag. Used at the start of a session, after any state loss, and periodically as a safety refresh.
- **FO (First Order).** Static fields (IP addresses, port numbers, SSRC) compressed away; sequence number and timestamp sent as deltas. Header shrinks to ~10 bytes.
- **SO (Second Order).** Sequence number and timestamp compressed to a few bits each (using their predictable increment pattern). Header shrinks to 1–3 bytes.

When the UE loses RoHC state (e.g., after a bad handover that decorrelated compressor and decompressor), it sends an internal NACK to the compressor; the compressor drops to IR for one packet to resync, then jumps back to SO. In steady state a VoLTE call spends 99% of its time in SO.

*Historical comparison.* RoHC was invented by IETF (RFC 3095) partly for 3G — 3G already carried VoIP-like traffic over PDCP and needed the same compression. LTE inherited RoHC unchanged. 2G's SMS-based voice architecture never needed it, because 2G voice was circuit-switched with fixed timeslots, not IP.

**(4) In-sequence delivery across handovers.** During a handover, PDCP maintains sequence numbering so the target eNodeB can pick up where the source left off without gaps or duplicates.

At handover the source eNodeB forwards its PDCP buffered packets to the target over X2, and the target continues numbering. The UE, on the target side, uses its PDCP receive window to reject duplicates and reorder any packets that arrived out of order (some might come via the source→target forwarding path while newer ones come directly from the target).

*Historical comparison.* UMTS's equivalent of PDCP was also called PDCP and served the same purpose (RoHC + ciphering); the LTE version added integrity for control plane and became the anchor for handover state. GSM had nothing analogous — control-plane security was in the GSM MAC layer, and there was no comparable "packet convergence" tier because there were no packets.

### 14.5. RRC — the radio-configuration protocol

**RRC (Radio Resource Control)** is the control-plane language between the UE and the eNodeB. It carries:

- Radio configuration ("use these transmission modes, this MCS reporting cycle, this measurement configuration").
- Bearer establishment ("set up DRB2 for the audio flow with QCI 1").
- Measurement reports ("I see cell $X$ at RSRP $-95$ dBm, cell $Y$ at $-100$").
- Handover commands ("hand yourself over to target eNodeB $Z$ using this preamble").
- Container for NAS messages ("here is a NAS message to forward to the MME").

RRC runs over PDCP over RLC over MAC over PHY. It is the topmost layer over the radio; anything above (NAS) is encapsulated within RRC for transport across the radio hop.

The two RRC states — **RRC_IDLE** and **RRC_CONNECTED** — are covered in § 15.

### 14.6. NAS — end-to-end control between UE and core

**NAS (Non-Access Stratum)** is the control-plane protocol between the UE and the MME, transparently transported by the eNodeB. It has two sub-protocols:

- **EMM (EPS Mobility Management)**: identity, authentication, tracking area updates, attach/detach. Handles the "who is this UE and where does it live" questions.
- **ESM (EPS Session Management)**: PDN connectivity, bearer setup, IP address assignment. Handles the "what data flows does this UE need" questions.

NAS is what the UE uses to say "I want to attach to the internet APN" or "I am moving into tracking area 42, please update my registration." Every such message is a NAS PDU, encrypted and integrity-protected at NAS layer (with a separate NAS security context, derived from $K_{\text{ASME}}$ — § 20).

### 14.7. The AS/NAS split, revisited by the stack

The AS/NAS distinction from § 2.5 now has a concrete layer meaning:

- **AS = RRC and below.** The eNodeB reads and acts on these. RRC configuration messages, measurement configurations, HARQ ACK/NACK, everything at PHY/MAC/RLC/PDCP/RRC.
- **NAS = EMM/ESM.** The eNodeB does not read or understand these. It receives them from the UE, forwards them to the MME on S1-MME; it receives them from the MME and delivers them to the UE on RRC. Encrypted end-to-end with keys the eNodeB does not possess.

This is a fundamental privacy and security guarantee: an attacker with control of the eNodeB (e.g., a compromised operator's cell tower) cannot read NAS messages.

---

## § 15. UE states: three parallel state machines

An LTE UE has *three* state machines running in parallel. They are not synonymous, they do not always change together, and confusion between them is the source of most misunderstandings about "idle" vs "connected."

### 15.1. The three states

- **EMM state** (at the MME): is the UE registered with the network, or not?
  - **EMM-DEREGISTERED** — the MME has no record of this UE.
  - **EMM-REGISTERED** — the MME has a GUTI for this UE, knows its tracking area, and can page it.

- **ECM state** (between UE and MME): is there an active signalling connection?
  - **ECM-IDLE** — no signalling connection. UE and MME both retain state (GUTI, keys, bearer records), but no packets flow. To reach the UE, the MME must page it.
  - **ECM-CONNECTED** — a signalling connection exists (S1-MME between eNodeB and MME, and RRC between UE and eNodeB). The UE can send and receive NAS messages immediately.

- **RRC state** (between UE and eNodeB): is there an active radio connection?
  - **RRC_IDLE** — no radio connection. The UE listens intermittently for paging (in a DRX cycle) and measures neighbouring cells for reselection.
  - **RRC_CONNECTED** — active radio connection. The UE has a C-RNTI, is being scheduled, can send and receive data.

### 15.2. The typical combined states

Not every combination is legal. In practice:

| EMM | ECM | RRC | Meaning |
|---|---|---|---|
| DEREGISTERED | IDLE | IDLE | Powered off, or before initial attach. |
| REGISTERED | IDLE | IDLE | Attached but idle — listening for paging. Longest-lived state during a normal day. |
| REGISTERED | CONNECTED | CONNECTED | Actively using data or on a call. |
| REGISTERED | CONNECTED | IDLE | Never — RRC_IDLE implies no signalling can flow, hence ECM must be IDLE too. |

The last row is impossible: without RRC, there is no way for NAS messages to reach the eNodeB and then the MME, so ECM must be IDLE. In short, ECM and RRC transition together on the UE side.

### 15.3. What idle actually is — and what triggers exit from it

RRC_IDLE (equivalently ECM_IDLE when EMM is REGISTERED) is the resting state. A phone at idle:

- Has a GUTI it received on the last attach or TAU.
- Knows its tracking area.
- Wakes up periodically (DRX cycle, 128 to 2560 ms) to read PDCCH addressed with P-RNTI, listening for paging.
- Measures serving-cell and neighbour-cell RSRP for cell reselection.
- Consumes minimal power (tens of mW), mostly the DRX wake-ups.

Exit from RRC_IDLE happens for two distinct reasons, and it matters which:

- **Mobile-Terminated (paging).** The network wants to reach the UE. The MME sends a Paging message to all eNodeBs in the UE's tracking area. Each eNodeB transmits a PDCCH addressed with P-RNTI, containing (in the corresponding PDSCH) a list of GUTIs being paged. A UE that sees its own GUTI initiates PRACH (§ 10) to establish an RRC connection so it can receive the incoming call/data.

- **Mobile-Originated (service request).** The UE has data to send (the OS wants to fetch an email, the user opens an app). It initiates PRACH directly, then sends a `NAS: Service Request` message on RRC. This does not require paging — the UE knows it has traffic and simply *wakes itself*.

The two exits differ in who initiates. From the RRC side both look similar (PRACH followed by RRC connection setup). From the UE side they are distinct scenarios that its OS distinguishes.

### 15.4. DRX in idle vs connected

**Idle-mode DRX** (Discontinuous Reception) is the cellular equivalent of "sleep with periodic alarm." The UE stays asleep for most of a configured cycle (128 to 2560 ms), waking briefly to decode PDCCH for P-RNTI paging. Battery cost is low.

**Connected-mode DRX** is for a UE that has an active RRC connection but is not currently receiving data every millisecond. For a VoLTE call, audio packets arrive every 20 ms — for the 18 ms in between, the UE can sleep. Connected DRX cycles are much shorter (typically 10–20 ms), and the UE stays in RRC_CONNECTED (its C-RNTI is still valid, no PRACH needed on wakeup) — but the radio hardware is off between wake-ups.

The two DRX modes solve related but distinct problems: idle-DRX saves battery over hours of a phone in a pocket; connected-DRX saves battery during an active but bursty session.

### 15.5. Tracking area updates

If a UE in RRC_IDLE moves out of the tracking area it registered with, it must inform the MME. The trigger: as the UE reselects cells, it reads each new cell's SIB1 and compares the broadcast TAC with the one in its stored Tracking Area Identity List. When it lands on a cell with a TAC not in the list, it initiates a **Tracking Area Update (TAU)** by exiting RRC_IDLE, doing PRACH, sending a `NAS: TAU Request`, and receiving an updated Tracking Area Identity List back.

The MME uses this to keep its "which tracking area is this UE in" record fresh — so when someone calls this UE, it can page the right tracking area.

**How the size of a tracking area actually tunes the TAU rate.** Let a tracking area consist of $N$ cells covering a total area $A$. A UE moving in a straight line at speed $v$ crosses the boundary of the tracking area once per traversal of a characteristic length $\ell \propto \sqrt{A}$. So the TAU rate per UE is roughly

$$R_{\text{TAU}} \sim \frac{v}{\sqrt{A}} \sim \frac{v}{\sqrt{N \cdot a_{\text{cell}}}}$$

(where $a_{\text{cell}}$ is the mean area per cell). Meanwhile, when someone calls the UE, the MME pages every cell in the tracking area, generating $N$ paging messages per incoming call. So:

- Small TA ($N = 10$ cells): frequent TAUs (say, one every 3 minutes for a highway driver), but each incoming call only pages 10 cells.
- Large TA ($N = 500$ cells): rare TAUs (one every 30 minutes for the same driver), but each incoming call pages 500 cells.

The operator picks $N$ to balance these two costs. A rural highway TA might have $N = 100$ (cars pass through quickly, but the network is idle so paging cost is low). An urban dense-network TA might have $N = 30$ (users move slowly on foot or transit, but incoming call rate per user is high so paging load matters). A stadium TA might be a single cell (100 000 mostly stationary users — TAUs are rare because nobody leaves, and paging one cell is cheap).

Operators can also apply a **Tracking Area List** to a UE, letting the MME assign the UE *multiple* TAIs simultaneously; the UE only TAUs when leaving *all* of them. This softens the boundary transitions — TAUs happen less often, at the cost of paging a slightly larger set of cells on incoming calls. Typical tracking area lists contain 4–8 TAIs for high-mobility UEs.

### 15.6. GUTI reallocation

Every time the UE performs an attach, TAU, or service request, the MME may issue a new GUTI. This is optional but common — it makes long-term tracking harder for adversaries who might correlate a GUTI over time.

---

## § 16. Identities: the naming layers

LTE has an unusually large collection of identifiers. The reason for the multiplication is not sloppiness — every identifier answers *one specific "who?" question at one specific layer* — but the reasons for the specific choices (size, scope, lifetime) are not always obvious. This section builds them up from what each layer's constraints are, then shows how they nest.

### 16.1. The three axes: scope, lifetime, secrecy

Every identifier in LTE can be located along three axes:

- **Scope.** Global? Operator-wide? Region-wide? Cell-wide? An identifier at global scope must be much longer (many bits) than one at cell scope. And global scope means the identifier can leak subscriber location if observed anywhere; cell scope means the leak is bounded.
- **Lifetime.** Permanent (burned into the SIM)? Session-lived (issued at attach, kept until detach)? Cell-lived (a fresh one at every handover)? Message-lived (used in one exchange then discarded)? Longer-lived identifiers are more useful for tracking.
- **Secrecy.** Must never appear in cleartext over the air (like the shared key $K$)? Kept off-air whenever possible (like IMSI)? Freely broadcast (like PCI)?

Every layer in LTE has an identifier at the right point on all three axes. That is what forces the multiplication.

### 16.2. IMSI — the permanent subscriber identity (network layer, global scope)

The **International Mobile Subscriber Identity (IMSI)** is a 15-digit decimal number burned onto the SIM at manufacture, uniquely identifying the subscriber worldwide. Format:

```
IMSI = │ MCC │ MNC │       MSIN       │
        3 dig  2 or 3   9 or 10 digits
              digits
```

- **MCC (Mobile Country Code)** — 3 digits, ITU-assigned. Israel = 425, US = 310–316, Germany = 262.
- **MNC (Mobile Network Code)** — 2 or 3 digits, assigned by each country's regulator. Combined with MCC, MCC+MNC = the **PLMN identity** (Public Land Mobile Network). Cellcom Israel = 42502, Pelephone = 42503.
- **MSIN (Mobile Subscriber Identification Number)** — the subscriber's serial within their operator. Not a phone number; the phone-number-to-IMSI mapping is a separate table.

The IMSI is used *inside* the network as the primary key into the HSS database. The HSS holds, for each IMSI, the subscriber's shared key $K$, subscription profile (which APNs allowed, which QCIs allowed, whether roaming is enabled), current MME registration, and the phone-number-to-IMSI mapping.

**Why keep IMSI off the air.** The IMSI is transmitted over the air *only when absolutely necessary*: the very first attach when the UE has no GUTI, or when the MME issues an `Identity Request` because it has lost state (rare, but happens on MME failover). Otherwise the UE uses a temporary identity (GUTI). This rule matters: a passive listener who captures a UE's IMSI can correlate its movement over months and across operators. § 25.4 covers the IMSI catcher weakness — the attack that exists because this rule cannot be perfectly enforced.

*Historical note.* The equivalent in GSM was the same 15-digit IMSI. The persistence of format across generations is deliberate — every SIM ever manufactured has an IMSI in this form, and interworking between generations relies on being able to look it up in the HSS/HLR.

### 16.3. GUTI — the temporary routable identity (network layer, MME-scoped)

After a successful attach, the MME issues a **Globally Unique Temporary Identity (GUTI)** to the UE. The UE uses this in all subsequent NAS messaging in place of the IMSI. Its structure is deliberately nested:

```
GUTI = │  MCC  │  MNC  │  MME Group ID  │  MME Code  │      M-TMSI     │
        3 dig    2/3 dig    16 bits         8 bits           32 bits
       └───── PLMN ID ────┘└──── MME identity within the PLMN ───┘└ within MME ┘
       └──────────────── GUMMEI ─────────────────────────┘└─── M-TMSI ────┘
```

Two sub-identities are worth naming separately:

- **GUMMEI (Globally Unique MME Identifier)** = PLMN + MME Group ID + MME Code. This uniquely identifies one MME instance worldwide. It is a routing prefix: an eNodeB receiving a NAS message tagged with a specific GUMMEI knows exactly which MME to send it to, over which S1-MME association.
- **M-TMSI (MME Temporary Mobile Subscriber Identity)** = 32 bits assigned by that MME, unique to that MME. This is the actual "which UE?" resolver within one MME.

**Why the nesting.** Consider a mid-sized city with three MMEs sharing the load (an "**MME pool**"). Each MME serves ~1/3 of the UEs. When a UE that was originally handled by MME-A moves to an eNodeB that has S1-MME associations with all three MMEs, the eNodeB needs to know: which MME should this UE's next NAS message go to? Without the GUMMEI in the GUTI, the eNodeB would have to guess or ask, adding a round trip. With the GUMMEI, the eNodeB extracts it from the GUTI and forwards to MME-A directly. This is what makes MME pooling operationally viable.

**Nesting invariant.** The M-TMSI is meaningful only when qualified by its GUMMEI: two different MMEs might have both assigned M-TMSI = 0x12345678 to different UEs. The GUMMEI qualifies the M-TMSI. Similarly, GUMMEI is meaningful only when qualified by PLMN. This is the LTE identity idiom: each field qualifies the ones nested inside it.

**Lifetime.** The GUTI is refreshed periodically — every attach, every TAU, sometimes mid-connection. Refreshing the GUTI limits how long any observed identity can be tracked. But it is not truly ephemeral either: it survives across cells (unlike C-RNTI, below), so within one attach period the same GUTI is used for many NAS messages.

*Historical note.* GSM had **TMSI** (32 bits, VLR-scoped) with the same purpose. UMTS added **P-TMSI** for the packet-switched domain (SGSN-scoped). LTE unified these into the M-TMSI, and made the scoping explicit by nesting GUMMEI around it. The same idea, cleaner encoding.

### 16.4. The network vs radio identifier split

Every identifier in LTE falls into one of two families, and the split matters:

| Family | Scope | Where used | Lifetime | Examples |
|---|---|---|---|---|
| **Network identifiers** | Global to operator-wide | NAS messages, core signalling, HSS lookups | Long (attach to detach, or permanent) | IMSI, GUTI, IMPI, IMPU |
| **Radio identifiers** | Cell-wide | RRC/PDCCH addressing | Short (per-cell; rekeyed on handover) | C-RNTI, RA-RNTI, P-RNTI, SI-RNTI |

The eNodeB is the *translator* between the two. On the radio side it addresses UEs by C-RNTI. On the S1-MME side it addresses UEs by an **eNB-UE-S1AP-ID / MME-UE-S1AP-ID** pair, and forwards NAS messages that carry a GUTI. It maintains an internal table: `(C-RNTI on cell X) ↔ (eNB-UE-S1AP-ID) ↔ (MME-UE-S1AP-ID) ↔ (GUTI as it happens to be inside the NAS payload)`. The MME sees only the network-layer identifiers; the physical layer sees only the radio identifiers.

**Why this split matters for you.** A radio-layer attacker (fake eNodeB, passive sniffer of PDCCH) can observe C-RNTIs and correlate a UE across seconds within one cell — but every handover reshuffles them. A network-layer attacker with access to the SGi or the operator's core sees GUTIs and IMSIs — much longer-lived, hence much stronger tracking. The two threat models are different, and LTE's identifier design distinguishes them.

### 16.5. Radio Network Temporary Identifiers (RNTIs)

RNTIs are 16-bit values used to address DCIs on PDCCH. They are *not* transmitted as a "To:" field — they are XOR'd into the DCI's CRC (§ 11.4). So a UE either sees a DCI addressed to it (CRC checks with its RNTI) or does not (CRC does not check). The 16-bit budget forces careful assignment.

| RNTI | Meaning | Value or range | Assigned by | When used |
|---|---|---|---|---|
| **C-RNTI** | Cell RNTI — the UE's ID within the current cell | 0x003D to 0xFFF3 | eNodeB, on RRC Connection Setup or handover | All UE-specific scheduling once the UE is in RRC_CONNECTED |
| **Temporary C-RNTI** | Provisional C-RNTI given in RA Response before contention is resolved | Same range | eNodeB, in Msg2 (RAR) | Used during Msg3 and until Msg4 confirms contention winner; then becomes C-RNTI |
| **RA-RNTI** | Random Access RNTI — deterministically derived from the PRACH slot | $1 + t_{\text{id}} + 10 f_{\text{id}}$ | Deterministic function of PRACH slot | Msg2 (RAR): every UE that transmitted preamble in that slot listens for this RNTI |
| **P-RNTI** | Paging RNTI | 0xFFFE (fixed, well-known) | Well-known constant | Every UE in RRC_IDLE monitors this during its paging occasion |
| **SI-RNTI** | System Information RNTI | 0xFFFF (fixed, well-known) | Well-known constant | Every UE looking for SIB scheduling monitors this |
| **TPC-RNTI** | Group Transmit Power Control RNTI | Configured by RRC | eNodeB, per-UE at RRC config time | DCI format 3/3A for shared power adjustments to a group of UEs |

**Why not use one RNTI for everything?** Because the address is XOR'd into the CRC, a UE cannot know whether an arbitrary DCI is "for me" until it tries decoding with a specific RNTI. If all messages used the same C-RNTI, a paging message would require every UE in the cell to blindly test every DCI on PDCCH, exploding the compute cost. Well-known RNTIs (P-RNTI, SI-RNTI) let every UE test *one* CRC-XOR at fixed positions to detect broadcast messages, without exploding their per-subframe decoding budget.

**Why 16 bits.** The RNTI namespace of $2^{16} = 65536$ is more than enough for one cell (which serves at most a few thousand active UEs simultaneously). Any larger would waste bits in the CRC XOR; any smaller would risk collisions. Choosing 16 also matches the CRC width used by the DCI, so the XOR is exact — no truncation or extension.

**Why C-RNTI changes at handover.** Different cells run their own RNTI allocation independently. If a UE kept its old C-RNTI when moving to a new cell, it could collide with a UE that was already using that RNTI in the target cell. Handover therefore assigns a fresh C-RNTI (as part of the Handover Command). Consequence: passive PDCCH sniffing gives you a UE identity that resets every handover, providing weak tracking across cells.

### 16.6. Cell and area identifiers

Now the identifiers describing the *network topology*, not the UEs:

- **PCI (Physical Cell ID)**: 504 values, broadcast implicitly via the PSS/SSS combination (§ 8.3). Its uses at the PHY layer:
  - Scrambling seed (so neighbouring cells produce different scrambling sequences and mutual interference decorrelates).
  - CRS pilot position (which subcarriers carry the reference signals — offset by PCI mod 6, § 7.1).
  - PRACH root sequence selection (offset by PCI).
  
  PCIs are reused geographically — the same PCI appears in many cells worldwide. **Cell planning** is the process of assigning PCIs to cells so that no two cells with the same PCI are within radio range of each other (a "PCI collision" would break scrambling decorrelation and CRS separation).

- **ECI (E-UTRAN Cell Identifier)**: 28-bit ID, unique within one operator. The upper 20 bits are the **eNB ID** (identifies which eNodeB) and the lower 8 bits are the **Cell ID within eNB** (identifies which of that eNodeB's cells — up to 256, though in practice 3 for a three-sector site). This nesting mirrors the physical reality: an eNodeB hosts multiple cells; each cell is a specific sector.

- **ECGI (E-UTRAN Cell Global Identifier)** = PLMN + ECI. Globally unique worldwide. Broadcast in SIB1. This is the "which cell exactly?" identifier used in S1-AP signalling and neighbour-cell reports.

- **TAC (Tracking Area Code)**: 16-bit ID identifying a **tracking area** (a group of cells that page together). Broadcast in SIB1.

- **TAI (Tracking Area Identity)** = PLMN + TAC. Globally unique tracking area.

**How ECGI, TAI, and PCI relate for one cell:**

```
              ┌─────────────── PLMN (MCC+MNC) ──────────────┐
              │                                              │
              │   ┌──────── TAI = PLMN + TAC ────────┐       │
              │   │                                   │       │
              │   │   ┌── ECGI = PLMN + eNB_ID + Cell_ID ──┐ │
              │   │   │                                     │ │
   PCI = 42   │   │   │  (this specific cell)               │ │
   (broadcast │   │   └─────────────────────────────────────┘ │
    on PSS/SSS)   │                                           │
              │   └───────────────────────────────────────────┘
              │                                                │
              └────────────────────────────────────────────────┘
```

PCI is what the UE reads from the air first (it doesn't yet know PLMN); ECGI/TAI come later from SIB1 (which needs PCI-derived pilots to demodulate). The physical layer uses PCI to distinguish cells from radio measurements; the network layer uses ECGI and TAI to identify cells in signalling messages.

### 16.7. Summary — which identifier answers which question

| Question | Identifier | Scope | Persistence |
|---|---|---|---|
| Who is this subscriber (as an HSS lookup)? | IMSI | Global permanent | Manufacturing |
| Where should this NAS message be delivered? | GUTI (→ GUMMEI → MME) | Regional | Per-attach |
| Who is this UE in this cell right now (for PDCCH)? | C-RNTI | Cell | Per-RRC-connection |
| Is this a paging or SIB broadcast? | P-RNTI / SI-RNTI | Well-known | Constant |
| Which specific cell is this? | ECGI | Global | Permanent (until decommissioned) |
| Which tracking area should page this UE? | TAI | Global | Permanent |
| Which cell (from radio measurements)? | PCI | Neighbourhood-unique | Assigned once per cell |
| Which SIP identity for VoLTE? | IMPI/IMPU | Global | Semi-permanent (§ 22) |

Reading from the top, each row moves the question one layer down and narrows the scope. The rule underneath the mess: **each layer wants an identifier of just the right size and just the right scope, and permanent identifiers are hidden as much as possible while temporary ones are used publicly.**

---

## § 17. Bearers, QCI, and internal QoS

### 17.1. What a bearer actually is — as a data structure

The word "bearer" abstracts something concrete. A bearer is a *distributed state record*, mirrored across five nodes — the UE, the eNodeB, the MME, the SGW, and the PGW — describing one logical pipe from the UE to the PGW. When a packet arrives at any of those nodes, that node's copy of the bearer record tells it what to do with the packet.

Here is what a bearer record contains at each node, using an "internet APN, QCI 9" default bearer as the running example.

**At the UE:**

| Field | Example value | Purpose |
|---|---|---|
| Bearer ID (EPS Bearer Identity, 4 bits) | 5 | Identifies this bearer to the MME |
| PDN Connection ID | 1 | Groups bearers sharing an IP address |
| UE IP address | 10.42.7.129 | Assigned by PGW at attach |
| QCI | 9 | Determines local scheduling behaviour |
| DRB configuration | DRB2 with PDCP config, RLC AM, LCID 5 | Radio-side handles below |
| APN | `internet` | For record-keeping |

**At the eNodeB:**

| Field | Example value | Purpose |
|---|---|---|
| C-RNTI ↔ Bearer ↔ DRB mapping | C-RNTI 0x1234, EPS Bearer 5, DRB2, LCID 5 | Connects the radio-side ID chain |
| S1-U TEID (uplink) | 0xA000_0042 | Where to send uplink packets → SGW |
| Local (eNodeB) TEID (downlink) | 0xB000_0001 | Which TEID incoming downlink packets have |
| QCI | 9 | Governs the MAC scheduler's priority |
| ARP | Priority 8, no preempt, vulnerable | § 17.4 |
| RLC / PDCP state | sequence numbers, ciphering keys | Runtime state |

**At the SGW (via S11 from MME):**

| Field | Example value | Purpose |
|---|---|---|
| S1-U TEID (downlink) | 0xB000_0001 | To route inbound (from PGW) packets down to eNodeB |
| eNodeB IP | 10.100.5.7 | Destination for downlink GTP-U packets |
| S5 TEID (uplink) | 0xC000_0099 | To route uplink packets to PGW |
| PGW IP | 10.100.99.1 | Destination for uplink GTP-U packets |
| QCI, ARP | 9, priority 8, non-preempt | Same QoS profile |

**At the MME:**

| Field | Example value | Purpose |
|---|---|---|
| IMSI | 425030200123456 | Who this bearer belongs to |
| PDN Connection state (per APN) | APN=internet, PGW IP, list of EPS Bearer IDs | Master tracker |
| Security context ($K_{\text{ASME}}$, NAS counters) | (128-bit key), UL=42, DL=17 | For NAS ciphering/integrity |
| SGW IP | 10.100.5.99 | For S11 tunnel setup |
| Subscription (from HSS) | Allowed APNs, allowed QCIs, roaming permitted flag | Policy check on future PDN connectivity requests |

**At the PGW:**

| Field | Example value | Purpose |
|---|---|---|
| UE IP address | 10.42.7.129 | Assigned by PGW; kept as long as PDN connection lives |
| SGi APN routing | Route to internet peering | Where packets go on the outside |
| S5 TEID (downlink) | 0xD000_0055 | For downlink packets from external → SGW |
| TFT (Traffic Flow Template) | (empty for default bearer) | Packet classifier — see § 17.2 |
| QCI, ARP | 9, priority 8 | For any QoS-enforcing hardware on the SGi path |
| Charging characteristics | Rating group 1, service ID 100 | For billing records |

**Where all this is written.** In the MME and HSS these are entries in a subscriber database — architecturally the same role that GSM's VLR/HLR filled, now IP-native and Diameter-fronted. In the SGW/PGW they are entries in a per-flow tunnel table maintained in fast memory (the PGW handles millions of active tunnels; the table is a hash-indexed structure keyed by TEID). In the eNodeB they live in the UE's context object, addressable by C-RNTI. In the UE they are OS-level radio-modem state, similar to how a laptop tracks IP routes and WiFi security associations.

The **bearer** is thus the union of these records — a five-node distributed structure. Any operation on "the bearer" (create, modify, delete) is a coordinated update of all five, propagated by GTP-C signalling on S11 (MME↔SGW) and S5 (SGW↔PGW), plus S1-AP on S1-MME (MME↔eNodeB), plus RRC (eNodeB↔UE).

### 17.2. Bearer vs DRB — the difference in one sentence

The **bearer** is the end-to-end concept from UE to PGW. The **DRB (Data Radio Bearer)** is one specific slice of it — the *radio-hop portion between the UE and the eNodeB*. Every bearer has exactly one DRB representing its radio segment. When we say "the UE has three bearers active," we mean it has three DRBs on the radio side, three S1-U tunnels on the eNodeB↔SGW side, three S5 tunnels on the SGW↔PGW side, and one IP address per PDN connection (which may hold multiple bearers).

There are also two other radio-bearer types worth naming for completeness:

- **SRB (Signalling Radio Bearer)** — the radio-hop segment for RRC and NAS control messages. Three exist: SRB0 (unencrypted, for the earliest RRC messages before security setup), SRB1 (RRC and piggybacked NAS after security), SRB2 (NAS-only after security). These are *not* extensions of any end-to-end bearer — they terminate at the eNodeB (SRB1, RRC part) or MME (SRB1 NAS pieces, SRB2 NAS).
- **DRB** — as above, for user-plane data.

The user-plane naming split (bearer end-to-end, DRB on radio) matches the LTE architectural principle of § 2.5: the radio hop is one segment; the core is another; each has its own state and can be operated independently.

### 17.3. Default vs dedicated bearer

A **default bearer** is created automatically at attach (or explicitly by later PDN Connectivity Requests). A UE gets one per PDN connection — that is, one per IP address. Every UE that attaches has at least one default bearer; a VoLTE-capable UE typically has two (one to `internet`, one to `ims`), each with its own IP address.

A **dedicated bearer** is a supplementary bearer on top of an existing PDN connection. It *shares the same IP address* as its default bearer but carries a specific traffic subset with a different QoS. The classifier that decides which packets go on the dedicated vs the default is the **Traffic Flow Template (TFT)** at the PGW (for downlink packets) and at the UE (for uplink packets).

**A TFT is a list of packet filters, each with a precedence number.** For the VoLTE audio dedicated bearer, a downlink TFT typically looks like:

```
Precedence 1:  IF (source_IP == 172.16.42.10 AND source_port == 20040
                  AND protocol == UDP)
               THEN route to dedicated bearer (EPS Bearer ID 7)
```

The source IP and port 20040 are the other endpoint's RTP stream. Any packet arriving at the PGW's SGi with these headers is placed onto the dedicated bearer's downlink S5 tunnel; every other packet on this UE's IP falls through to the default bearer. On uplink, the UE's IP stack does the same lookup: outgoing RTP packets (with matching source IP/port) go to the dedicated bearer's uplink DRB; everything else (SIP signalling, DNS, whatever else the UE runs on the IMS IP) goes to the default bearer's DRB.

**When is a dedicated bearer created?** When the network needs to enforce a QoS distinct from the default for a specific flow. The main triggers are:

- **VoLTE call setup** — PCRF instructs PGW to create a QCI 1 dedicated bearer for the RTP flow.
- **Video call setup** — QCI 2 for the video flow.
- **Enterprise voice / push-to-talk** — QCI 65 for the mission-critical flow.
- **Some gaming platforms** — sometimes a QCI 3 dedicated bearer for game traffic.

The default bearer is always alive (or the PDN connection is torn down). Dedicated bearers come and go with specific service sessions.

### 17.4. QCI and what "best effort" actually means

**QCI (QoS Class Identifier)** is a single integer that labels a standardized QoS profile. Standardized: 3GPP TS 23.203 fixes the meaning of each QCI, so QCI 1 means the same thing on every operator worldwide. This lets a roaming UE's VoLTE bearer be honoured in a visited network without re-negotiation.

| QCI | Type | Priority | Delay budget | Loss target | Typical use |
|---|---|---|---|---|---|
| 1 | GBR | 2 | 100 ms | $10^{-2}$ | Voice (VoLTE audio) |
| 2 | GBR | 4 | 150 ms | $10^{-3}$ | Video call |
| 3 | GBR | 3 | 50 ms | $10^{-3}$ | Real-time gaming |
| 4 | GBR | 5 | 300 ms | $10^{-6}$ | Non-conversational video (buffered streaming with GBR) |
| 5 | Non-GBR | 1 | 100 ms | $10^{-6}$ | IMS signalling |
| 6 | Non-GBR | 6 | 300 ms | $10^{-6}$ | Video streaming (buffered), TCP-friendly |
| 7 | Non-GBR | 7 | 100 ms | $10^{-3}$ | Voice, video, interactive gaming (no GBR) |
| 8 | Non-GBR | 8 | 300 ms | $10^{-6}$ | Premium browsing |
| 9 | Non-GBR | 9 | 300 ms | $10^{-6}$ | Default internet, "best effort" |
| 65 | GBR | 0.7 | 75 ms | $10^{-2}$ | Mission-critical push-to-talk |
| 69 | Non-GBR | 0.5 | 60 ms | $10^{-6}$ | Mission-critical signalling |
| 70 | Non-GBR | 5.5 | 200 ms | $10^{-6}$ | Mission-critical data |

**"Best effort" specifically means:**

- **Non-GBR** — no bit-rate guarantee. When the cell is congested, this bearer's throughput may fall to zero without violating any standardized SLA.
- **Low priority in the scheduler** (priority 9 is nearly the lowest defined). Whenever the eNodeB's MAC scheduler has both a QCI 9 packet and a QCI 5 packet ready to transmit, the QCI 5 packet goes first.
- **Loose delay budget (300 ms)** — packets can be queued for up to 300 ms without being considered late. TCP's own timers accommodate this comfortably.
- **Low loss target ($10^{-6}$)** — for what packets *do* get through, the physical layer's HARQ and RLC AM ensure very few are corrupted or dropped, even at low priority.

In practice, on an uncongested cell, QCI 9 gets excellent service (tens of Mbps, tens of milliseconds). On a congested cell, QCI 9 might get 100 kbps and 1 second while QCI 5 signalling and QCI 1 voice bearers continue to receive full quality. "Best effort" is the honest name: the network tries, but does not promise.

**"GBR" (Guaranteed Bit Rate)** is the opposite. A GBR bearer is admitted only if the eNodeB can guarantee at least the requested minimum rate (typically 12–24 kbps for AMR-WB voice). If admission fails, the bearer is rejected — no bearer creation is better than one that would starve the voice packets. During operation, a GBR bearer's traffic gets scheduling priority up to the guaranteed rate; above it, additional traffic on the same bearer is treated as best-effort.

### 17.5. ARP — the preemption sledgehammer

**ARP (Allocation and Retention Priority)** is a second dimension of prioritization, orthogonal to QCI. It has three components:

- **Priority Level** (1–15, lower is higher priority) — used only during admission control and preemption decisions, not during scheduling.
- **Preemption Capability** (yes/no) — is this bearer allowed to displace lower-priority bearers when the cell is full?
- **Preemption Vulnerability** (yes/no) — may this bearer be displaced by higher-priority bearers?

Under extreme cell load, the eNodeB drops existing bearers to make room for new higher-priority ones. Ordinary user bearers are vulnerable (they get preempted). Emergency bearers (QCI 65/69) are capable (they can kick others out) and non-vulnerable (they cannot be kicked out). This is how E911 works in a congested cell after an earthquake: a paying customer's regular VoLTE call may be dropped to make room for an incoming emergency call, and that eviction is deterministic policy rather than an accident.

### 17.6. The internet + IMS parallel bearer architecture

For a UE that supports VoLTE, the attach procedure ends with two default bearers already established:

1. **Default bearer to `internet` APN**: QCI 9, UE IP $A$ (a CGNAT'd private-range IP), PGW's route to public internet.
2. **Default bearer to `ims` APN**: QCI 5, UE IP $B$ (different from $A$), PGW's route to the IMS core (P-CSCF), private carrier VLAN, no internet access.

Both connections coexist without either being aware of the other. The UE's IMS/SIP stack binds to IP $B$ and talks to the P-CSCF; the OS's regular IP stack binds to IP $A$ and talks to the internet.

When a VoLTE call starts, the SIP negotiation over bearer 2 produces the RTP endpoints. The P-CSCF authorises this via the PCRF (§ 22.6), which commands the PGW to spawn a **dedicated bearer** with QCI 1 on top of the same IP $B$, filtered by TFT for the RTP-specific IP-port pairs. Voice packets from that dedicated bearer bypass any queueing that non-real-time IMS signalling might encounter.

---

## § 18. Security architecture: EPS-AKA and the key hierarchy

### 18.1. The bootstrap problem

Before anything is encrypted, the UE and network must authenticate each other and derive shared keys. This has to happen on the very first exchange, when there is no prior secret between the UE and the visited network — only between the UE (via SIM) and the home HSS.

The mechanism is **EPS-AKA (Authentication and Key Agreement)**, an inheritor of UMTS-AKA. It uses one root secret: the **long-term key $K$**, 128 bits, stored on the SIM at manufacture and in the home HSS. $K$ never leaves the SIM (it is used only inside the SIM's tamper-resistant cryptoprocessor) and never leaves the HSS. Every authentication is a challenge-response using derivatives of $K$.

### 18.2. The EPS-AKA exchange

1. UE sends `Attach Request` including its IMSI in cleartext (first time only).

2. MME asks the HSS: "give me an authentication vector for this IMSI." The HSS retrieves the corresponding $K$, generates a random challenge $\text{RAND}$, and computes:
   - $\text{XRES}$ (expected response) = $f_2(K, \text{RAND})$
   - $\text{AUTN}$ (authentication token) = SQN ⊕ AK || AMF || MAC-A, where $f_1$ computes a MAC over SQN, RAND, AMF using $K$; $f_5$ computes AK from $K$ and RAND; SQN is a sequence number preventing replay.
   - $K_{\text{ASME}}$ = derived from $K$ and RAND and the serving network's ID (so a $K_{\text{ASME}}$ used in one visited network cannot be replayed in another).
   
   The HSS returns to the MME: (RAND, AUTN, XRES, $K_{\text{ASME}}$).

3. MME forwards RAND and AUTN to the UE as an `Authentication Request` — over the air in cleartext (no encryption is possible yet).

4. UE hands RAND and AUTN to the SIM. The SIM verifies AUTN (using its own copy of $K$ and its own SQN counter) — this authenticates the network. The SIM computes $\text{RES}$ = $f_2(K, \text{RAND})$ and $K_{\text{ASME}}$. Returns them to the UE.

5. UE sends $\text{RES}$ back to the MME.

6. MME compares $\text{RES}$ to $\text{XRES}$. If equal, mutual authentication is complete.

Key security properties:

- **Mutual authentication.** The AUTN check on the UE side prevents an attacker with a rogue eNodeB from luring UEs into a fake network — the fake network cannot produce a valid AUTN without knowing $K$ or seeing a fresh one from the real HSS.
- **Replay resistance.** SQN increments on each authentication. If an attacker replays an old (RAND, AUTN) pair, the SIM sees SQN behind its current counter and rejects.
- **Home-secret confinement.** $K$ never crosses the network. Even a compromised MME cannot recover $K$; it only has $K_{\text{ASME}}$, which is scoped to that specific visited network.

### 18.3. The key derivation function

Before showing the tree, we need to know how each key is actually computed. LTE uses one KDF (Key Derivation Function) throughout, defined in TS 33.220 and reused with different inputs:

$$\text{KDF}(K, S) = \text{HMAC-SHA-256}(K, S)$$

where $K$ is the parent key (128 or 256 bits) and $S$ is a byte string encoding what kind of child key we are deriving. HMAC-SHA-256 produces 256 bits; when the derived key needs to be 128 bits (the length used by AES-128 ciphering) the low 128 bits of the HMAC output are truncated off.

The input string $S$ has a specific structure:

$$S = \text{FC} \; \| \; P_0 \; \| \; L_0 \; \| \; P_1 \; \| \; L_1 \; \| \; \ldots$$

where:

- **FC** is a 1-byte function code identifying which key is being derived (e.g., 0x11 for $K_{\text{eNB}}$, 0x15 for the algorithm-specific $K_{\text{RRCenc}}$, and so on).
- $P_i$ are input parameters (algorithm ID, uplink NAS COUNT, PLMN ID, physical cell ID, etc.).
- $L_i$ are 2-byte lengths of the corresponding $P_i$.

Two properties of this construction matter:

- **Uniqueness of derivation.** Different FCs produce cryptographically independent keys even from the same parent $K$. Compromising $K_{\text{RRCenc}}$ tells you nothing about $K_{\text{RRCint}}$ derived from the same $K_{\text{eNB}}$.
- **Binding to context.** Because parameters like the PLMN ID and physical cell ID are hashed in, a key derived in one visited network is unusable in another, and a key derived for one cell is unusable in another. This binding provides forward security across handovers.

### 18.4. The key derivation tree

Now the full hierarchy, with FC codes and input parameters spelled out:

```
                       K
             (128-bit, SIM and HSS only)
                       │
                       │ f₃, f₄:  IK, CK ← f(K, RAND)
                       │    (128 bits each — inherited from UMTS AKA)
                       ▼
                    CK ‖ IK   (256 bits total)
                       │
                       │ KDF: S = FC=0x10 ‖ SN‑id (PLMN) ‖ SQN⊕AK
                       ▼
                  K_ASME
              (256-bit; UE + MME)
                       │
              ┌────────┼──────────────────────┐
              │        │                       │
              │        │                       │
              ▼        ▼                       ▼
      KDF (FC=0x15,               KDF (FC=0x11,
     UL NAS COUNT, alg-ID)          UL NAS COUNT)
              │                          │
              ▼                          ▼
     K_NASenc, K_NASint            K_eNB   (256-bit)
     (128-bit each, UE ↔ MME)       (UE + MME + eNodeB)
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                          ▼               ▼               ▼
                    KDF (FC=0x15,   KDF (FC=0x15,   KDF (FC=0x15,
                    "RRC-enc"       "RRC-int"       "UP-enc"
                    alg-ID)          alg-ID)         alg-ID)
                          │               │               │
                          ▼               ▼               ▼
                    K_RRCenc        K_RRCint        K_UPenc
                    (128-bit)       (128-bit)       (128-bit)
                    UE ↔ eNodeB     UE ↔ eNodeB     UE ↔ eNodeB
```

Two things to note about the tree that matter operationally:

**1. Each level "consumes" a piece of context that the level above did not know.**

- $K$ → $K_{\text{ASME}}$ consumes the SN-id (Serving Network — the visited operator's PLMN ID). A $K_{\text{ASME}}$ derived for Cellcom cannot be used in Pelephone.
- $K_{\text{ASME}}$ → $K_{\text{NASenc}}$ consumes the algorithm ID (which NAS cipher was chosen). Rekeying the cipher forces a new $K_{\text{NASenc}}$ from the same $K_{\text{ASME}}$.
- $K_{\text{ASME}}$ → $K_{\text{eNB}}$ consumes the uplink NAS COUNT at the moment of handoff. Each fresh $K_{\text{eNB}}$ derivation uses a fresh COUNT, so successive $K_{\text{eNB}}$ values are unrelated.
- $K_{\text{eNB}}$ → $K_{\text{RRCenc}}$/$K_{\text{RRCint}}$/$K_{\text{UPenc}}$ consumes the algorithm ID for the AS cipher/integrity choice.

**2. Directionality is *not* in the key — it is in the packet counter.**

There is no "$K_{\text{RRCenc,uplink}}$" and "$K_{\text{RRCenc,downlink}}$." The same key is used both ways. What distinguishes them for ciphering is the **COUNT** — a 32-bit counter of PDCP PDUs, maintained separately for uplink and downlink. Every PDCP packet contains its COUNT in the header; the receiver uses (key, COUNT, direction bit) as inputs to the cipher.

Specifically, the ciphered payload of a PDCP packet is $\text{cipher}(K_{\text{UPenc}}, \text{COUNT}, \text{DIRECTION}, \text{BEARER}, \text{LENGTH}) \oplus \text{plaintext}$. The direction bit (0=uplink, 1=downlink) is one input to the block cipher; without it, an eavesdropper who observes both a uplink and downlink packet with the same COUNT could XOR the two ciphertexts and recover $P_{\text{UL}} \oplus P_{\text{DL}}$, which is a plaintext leak. Including direction ensures the keystream differs for the two directions.

The bearer ID is also mixed in for the same reason across bearers: two bearers using the same key but at the same COUNT would leak $P_A \oplus P_B$ otherwise.

### 18.5. Purpose of each key

| Key | Bits | Endpoints | Encrypts / protects | Direction handling |
|---|---|---|---|---|
| $K$ | 128 | SIM ↔ HSS | (used only to derive) | — |
| $K_{\text{ASME}}$ | 256 | UE ↔ MME (one per attach) | (used only to derive) | — |
| $K_{\text{NASenc}}$ | 128 | UE ↔ MME | NAS message ciphering (EMM, ESM) | UL/DL bit in cipher input |
| $K_{\text{NASint}}$ | 128 | UE ↔ MME | NAS message integrity (32-bit MAC-I appended) | UL/DL bit in MAC input |
| $K_{\text{eNB}}$ | 256 | UE ↔ eNodeB (one per RRC connection) | (used only to derive) | — |
| $K_{\text{RRCenc}}$ | 128 | UE ↔ eNodeB | RRC message ciphering (SRB1, SRB2 payloads) | UL/DL bit in cipher input |
| $K_{\text{RRCint}}$ | 128 | UE ↔ eNodeB | RRC message integrity | UL/DL bit in MAC input |
| $K_{\text{UPenc}}$ | 128 | UE ↔ eNodeB | User-plane data ciphering (DRB PDCP payloads) | UL/DL and per-bearer inputs |

Notice the split by termination endpoint:

- **NAS keys terminate at the MME.** The eNodeB never sees them and cannot read NAS.
- **AS keys terminate at the eNodeB.** The MME hands $K_{\text{eNB}}$ down to the eNodeB at Initial Context Setup; the eNodeB derives its three children internally.
- **The user-plane cipher key $K_{\text{UPenc}}$ terminates at the eNodeB** — not at the SGW or PGW. This means the eNodeB decrypts user-plane packets from the radio and re-encapsulates them in GTP-U (unencrypted) for the S1-U trip to the SGW. Anyone with backhaul access sees user-plane traffic in the clear unless the operator's backhaul is separately protected (typically by IPsec, but this is an operator's operational choice, not a 3GPP mandate).

**Consequence for compromise.** A compromise of the eNodeB reveals $K_{\text{eNB}}$ (and its three children) but not $K_{\text{ASME}}$. NAS traffic (including the fact of *any* NAS transaction, such as SMS-over-NAS content) remains protected. A compromise of the MME reveals $K_{\text{ASME}}$ and NAS keys for currently-attached UEs but not the SIM key $K$. Only a compromise of the HSS reveals $K$, which is why the HSS is the crown jewel of the operator's infrastructure.

### 18.6. Two security modes: NAS and AS

There are two independent security-setup handshakes after authentication:

**NAS Security Mode Command (MME ↔ UE).** The MME sends `NAS Security Mode Command` with the chosen algorithms (which cipher, which integrity algorithm). It is integrity-protected using $K_{\text{NASint}}$ but not encrypted (the UE has to read it in cleartext to know which algorithms). The UE verifies, then responds with `NAS Security Mode Complete` fully encrypted. From this moment onwards, all NAS packets are ciphered and integrity-protected.

**AS Security Mode Command (eNodeB ↔ UE).** The MME hands $K_{\text{eNB}}$ down to the eNodeB. The eNodeB derives $K_{\text{RRCint}}, K_{\text{RRCenc}}, K_{\text{UPenc}}$ and sends `RRC: SecurityModeCommand` to the UE — integrity-protected but not encrypted (same reasoning). The UE verifies, initializes its crypto, responds with `RRC: SecurityModeComplete` (integrity + encrypted). From this moment onwards:
- All RRC packets are ciphered and integrity-protected.
- All user-plane data is *ciphered* (not integrity-protected).

### 18.7. Why user-plane has ciphering but no integrity

The user-plane packets ride PDCP → RLC → MAC → PHY like everything else, but the PDCP layer applies only ciphering ($K_{\text{UPenc}}$), not the 32-bit MAC-I integrity check. This is a size trade-off:

- A VoLTE call generates a packet every 20 ms; a mobile browsing session generates hundreds per second. Adding 32 bits of MAC-I per packet is substantial overhead.
- User-plane packets already have upper-layer integrity: TCP has a checksum (weak), HTTPS/TLS has HMAC (strong), IPSec has HMAC.
- The threat model on the radio hop is passive eavesdropping (ciphering is enough) plus active injection. Active injection of a TCP/IP packet without integrity is possible but recognized by the upper-layer transport; the injected packet is dropped.

Control-plane (RRC + NAS) packets get integrity because there is no upper-layer defence: an injected `RRC: ConnectionReconfiguration` telling the UE to switch to a rogue frequency would take effect immediately. So the layer-3 integrity check is essential there.

### 18.8. Handover key management: forward and backward security

At handover, the eNodeB security context must transition. The MME calculates fresh $K_{\text{eNB}}$ derived from a Next Hop chaining counter, so the target eNodeB gets a key different from what the source had. If the source eNodeB is compromised, the target's key is not derivable from what the source had — **forward security**. Conversely, when a UE arrives at a new cell, its old cell no longer has the current key — **backward security**.

---

## § 19. The initial attach procedure

The initial attach is where all the pieces so far come together. It is not one exchange but a sequence of nested procedures, each of which we have already described in isolation. Here it is end-to-end.

### 19.1. The seven parties

- **UE** — the phone.
- **eNodeB** — the tower the UE just synchronised to.
- **MME** — the mobility manager the UE will register with.
- **HSS** — the home database with the authentication vectors.
- **SGW** — the serving gateway that will forward user-plane packets.
- **PGW** — the packet gateway anchoring the UE's IP address.
- **PCRF** — the policy engine that will authorize the UE's QoS.

### 19.2. The message flow

```
UE                eNodeB              MME              HSS         SGW/PGW       PCRF
 |                    |                 |               |             |            |
 | Msg1 (PRACH)       |                 |               |             |            |
 |------------------->|                 |               |             |            |
 |                    |                 |               |             |            |
 | Msg2 (RAR)         |                 |               |             |            |
 |<-------------------|                 |               |             |            |
 |                    |                 |               |             |            |
 | Msg3 (RRC Conn Req + NAS Attach Req + PDN Conn Req)  |             |            |
 |------------------->|                 |               |             |            |
 |                    |                 |               |             |            |
 | Msg4 (RRC Conn Setup)                |               |             |            |
 |<-------------------|                 |               |             |            |
 |                    |                 |               |             |            |
 | RRC Conn Setup Complete (carries NAS Attach Req + PDN Conn Req)     |            |
 |------------------->|                 |               |             |            |
 |                    | S1-AP Initial UE Message (NAS Attach Req + PDN Conn Req)   |
 |                    |---------------->|               |             |            |
 |                    |                 |               |             |            |
 |                    |                 | S6a AIR (auth info request) |            |
 |                    |                 |-------------->|             |            |
 |                    |                 | S6a AIA (RAND, AUTN, XRES, K_ASME)       |
 |                    |                 |<--------------|             |            |
 |                    |                 |               |             |            |
 | NAS Authentication Request (RAND, AUTN)              |             |            |
 |<------------------------------------------|          |             |            |
 | NAS Authentication Response (RES)                    |             |            |
 |------------------------------------------>|          |             |            |
 |                    |                 |               |             |            |
 | NAS Security Mode Command                            |             |            |
 |<------------------------------------------|          |             |            |
 | NAS Security Mode Complete                           |             |            |
 |------------------------------------------>|          |             |            |
 |                    |                 |               |             |            |
 |                    |                 | S6a ULR (update location)   |            |
 |                    |                 |-------------->|             |            |
 |                    |                 | S6a ULA (subscription data)              |
 |                    |                 |<--------------|             |            |
 |                    |                 |               |             |            |
 |                    |                 | GTP-C Create Session Req (S11 → S5)     |
 |                    |                 |---------------------------->|            |
 |                    |                 |               |             |            |
 |                    |                 |               |             | Gx CCR-I   |
 |                    |                 |               |             |----------->|
 |                    |                 |               |             | Gx CCA-I   |
 |                    |                 |               |             |<-----------|
 |                    |                 |               |             |            |
 |                    |                 | GTP-C Create Session Resp (IP address, QoS, TEIDs)
 |                    |                 |<----------------------------|            |
 |                    |                 |               |             |            |
 |                    | S1-AP Initial Context Setup Req |             |            |
 |                    |    (K_eNB + NAS Attach Accept + default bearer info)       |
 |                    |<----------------|               |             |            |
 |                    |                 |               |             |            |
 | AS Security Mode Command                             |             |            |
 |<-------------------|                 |               |             |            |
 | AS Security Mode Complete                            |             |            |
 |------------------->|                 |               |             |            |
 |                    |                 |               |             |            |
 | RRC Conn Reconfiguration (DRB setup + NAS Attach Accept)            |            |
 |<-------------------|                 |               |             |            |
 | RRC Conn Reconfiguration Complete                    |             |            |
 |------------------->|                 |               |             |            |
 |                    | S1-AP Init Context Setup Resp   |             |            |
 |                    |---------------->|               |             |            |
 |                    |                 |               |             |            |
 | NAS Attach Complete                                  |             |            |
 |------------------------------------------>|          |             |            |
 |                    |                 |               |             |            |
 |                    |                 | GTP-C Modify Bearer Req (uplink TEID)    |
 |                    |                 |---------------------------->|            |
 |                    |                 | GTP-C Modify Bearer Resp                 |
 |                    |                 |<----------------------------|            |
 |                    |                 |               |             |            |
 |=== DEFAULT BEARER ACTIVE — USER DATA CAN NOW FLOW ================================|
 v                    v                 v               v             v            v
```

### 19.3. The piggybacked PDN Connectivity Request

Notice that the very first NAS message the UE sends — `Attach Request` — contains an inner `PDN Connectivity Request` inside it. This is not two separate exchanges; the UE saves radio signalling by combining the two.

The reason: the UE will always need at least one PDN connection (an IP address) to be useful; there is no point attaching without one. Merging the two requests saves a round trip. The MME unpacks the `Attach Request` (which handles authentication and mobility), then finds the `PDN Connectivity Request` inside and initiates the bearer setup toward the SGW/PGW.

The Attach can specify an APN (e.g., "internet" or "ims") or leave it blank; if blank, the HSS's default APN in the subscription profile is used.

### 19.4. Where the security handshake sits

Between messages 5 (S1-AP Initial UE Message forwarded to MME) and 17 (Initial Context Setup) the flow spends its majority on security:

- Fetching authentication vectors from HSS.
- Running EPS-AKA challenge-response.
- Setting up NAS security context (ciphering + integrity).
- Sending $K_{\text{eNB}}$ down to the eNodeB.
- Setting up AS security context (ciphering + integrity for RRC, ciphering for UP).

Nothing on the user plane can happen until all this completes.

### 19.5. What state the UE is in at each point

- Before Msg1: EMM-DEREGISTERED, ECM-IDLE, RRC_IDLE.
- After Msg4: EMM-DEREGISTERED (no attach yet acknowledged), ECM-CONNECTED (S1-MME connection now exists), RRC_CONNECTED.
- After Attach Complete (final NAS): EMM-REGISTERED, ECM-CONNECTED, RRC_CONNECTED.
- If no user data flows for a while, the eNodeB and MME release the connection: EMM-REGISTERED (retained), ECM-IDLE, RRC_IDLE.

The default bearer *record* survives the drop to idle — the PGW keeps the IP address reserved and the GTP tunnel state cached. When the UE next wakes and does Service Request, the eNodeB restores the S1-U tunnel and the UE has service immediately.

### 19.6. Attaching to IMS after the first bearer

After the initial attach establishes the internet default bearer (typically QCI 9), the phone's VoLTE client wakes up and realizes it needs a separate connection to the IMS core. Because the UE is already in ECM-CONNECTED, this is a standalone `PDN Connectivity Request` (not piggybacked on Attach). The request explicitly specifies APN = "ims" and QCI 5. The MME processes it, the PGW sets up the bearer, and the UE ends up with a second default bearer to the IMS core, on a *second* IP address, ready for SIP registration (§ 23).

---

## § 20. The core network interfaces

This is the topology of the EPC core, with each interface's protocol and purpose spelled out. The reason for the mesh is that each pair of nodes has different rate and semantic requirements.

### 20.1. The full picture

```
   ┌──────┐  S1-MME (SCTP + S1AP)     ┌──────┐   S11 (UDP + GTP-C)   ┌─────┐
   │ eNB  │─────────────────────────>│ MME  │─────────────────────>│ SGW │
   └──┬───┘                           └───┬──┘                       └──┬──┘
      │                                   │ S6a (SCTP + Diameter)       │
      │                                   ▼                             │
      │ S1-U                            ┌──────┐                        │ S5/S8
      │ (UDP + GTP-U)                   │ HSS  │                        │ (UDP + GTP-U/GTP-C)
      │                                 └──────┘                        ▼
      │                                                              ┌─────┐  SGi
      └───────────────── (GTP-U tunnels) ─────────────────────────>│ PGW │───────> Internet or IMS
                                                                     └──┬──┘
                                                                        │ Gx (SCTP + Diameter)
                                                                        ▼
                                                                     ┌──────┐  Rx (SCTP + Diameter)
                                                                     │ PCRF │<────── (P-CSCF in IMS)
                                                                     └──────┘

   X2 (SCTP + X2AP): eNB <── direct ──> eNB, for fast handovers
```

### 20.2. S1: the eNodeB-to-core split

Between the eNodeB and the core there are two logically separate connections: **S1-MME** for control, **S1-U** for user data.

**S1-MME (control plane).** eNodeB to MME. Transport: **SCTP (Stream Control Transmission Protocol)** — like TCP, but message-oriented (not byte-stream) and with multiple parallel streams inside one connection. On top of SCTP: **S1AP (S1 Application Protocol)** — the application-level messages like "Setup UE Context," "Handover Request," "Path Switch Request." SCTP was chosen over TCP because signalling has natural message boundaries (one event = one message), and SCTP's multi-stream design avoids head-of-line blocking (a lost signalling message on stream A doesn't block stream B).

**S1-U (user plane).** eNodeB to SGW. Transport: UDP/IP. Application: **GTP-U (GPRS Tunneling Protocol, User Plane).** Every user IP packet in each direction is encapsulated in a GTP-U packet: the eNodeB reads its private IP address on the outside, the GTP-U TEID identifies which UE and which bearer the packet belongs to, and the inner IP packet is the UE's actual data. Why UDP not TCP? Reliability is handled end-to-end (TCP or application); an extra layer of TCP would double the retransmission machinery and add head-of-line blocking to unrelated flows sharing the tunnel. (The specific phrase for this pathology is **TCP Meltdown**: putting TCP inside TCP causes each layer to retransmit on overlapping timers, degrading throughput badly under mild loss.)

### 20.3. S11: MME to SGW

**S11** carries GTP-C between MME and SGW. Despite the "GTP" name, S11 messages are not tunnels — they are signalling: "Create Session Request" (build a new bearer for this UE), "Modify Bearer Request" (redirect this bearer to a new eNodeB during handover), "Delete Session Request" (tear down when the UE detaches).

### 20.4. S5 and S8: SGW to PGW

**S5** and **S8** carry both GTP-C (control) and GTP-U (user data) between SGW and PGW. The two names distinguish administrative context:

- **S5**: SGW and PGW in the same operator. Domestic (non-roaming) traffic. Internal fiber, low latency, single security domain.
- **S8**: SGW and PGW in different operators. Roaming with home-routed traffic (§ 25). Crosses the GRX/IPX (a B2B network for carriers), possibly intercontinental. Different security and billing arrangements.

The protocol on both is identical. The name distinguishes the operational context.

### 20.5. S6a: MME to HSS

**S6a** carries **Diameter** messages between MME and HSS. Typical:

- **Authentication-Information-Request (AIR)**: MME asks HSS for authentication vectors.
- **Update-Location-Request (ULR)**: MME tells HSS "UE $X$ is now attached to me; give me the subscription profile."
- **Insert-Subscriber-Data**: HSS proactively pushes subscription changes to the MME.
- **Purge-UE**: MME tells HSS "this UE has been idle for a while; you can stop tracking it here."

Diameter was chosen over SS7's MAP (which older networks used) because Diameter has strong authentication of message origin, IP-native transport, and better scalability. SS7 famously has no message-origin authentication, which is exploited routinely (§ 25.5).

### 20.6. SGi: PGW to external networks

**SGi** is the boundary where the cellular network ends and the outside begins. On the outside are:

- **Internet APN** → BGP peer to the global internet backbone.
- **IMS APN** → private VLAN to the P-CSCF (§ 23).
- **Enterprise APNs** → IPsec tunnels to customer VPN gateways.

A single PGW can have multiple SGi attachments. The APN in the UE's PDN Connectivity Request selects which one — the PGW consults an internal routing table: "if the packet came from APN $X$, route it out SGi-$X$."

### 20.7. X2: eNodeB to eNodeB

**X2** is a direct inter-eNodeB interface for coordination that would be too slow if it went through the MME. Two main uses:

- **Handover.** The source eNodeB negotiates the handover with the target directly over X2 (§ 21.3). Latency: tens of milliseconds. If X2 doesn't exist between two specific eNodeBs (rare, but possible in mixed-vendor deployments), the handover falls back through the MME on S1, which is slower but always available.

- **ICIC / eICIC (Inter-Cell Interference Coordination).** Neighbouring eNodeBs share information about which RBs they are heavily using, so each can schedule its cell-edge users on RBs the neighbours are underusing. This soft coordination improves cell-edge throughput.

X2 uses SCTP + X2AP, similar to S1-MME but between two peer eNodeBs.

### 20.8. GTP: the tunneling substrate

GTP has been present since 2.5G GPRS (hence the name — GPRS Tunneling Protocol) and persisted through 3G, 4G, and even into 5G's user plane. Two variants matter in LTE:

- **GTP-U** encapsulates user data. Every packet has a GTP-U header with a **TEID (Tunnel Endpoint Identifier)** — a 32-bit ID that tells the receiver "this packet belongs to this specific bearer of this specific UE." The GTP-U tunnel is unidirectional: uplink TEIDs at the SGW/PGW and downlink TEIDs at the eNodeB/SGW are separate.

- **GTP-C** is control-plane signalling for tunnel management: create, modify, delete.

The reason for a tunneling protocol rather than raw IP routing: as the UE moves between eNodeBs, its IP address must stay constant so upper-layer connections (TCP sessions, active app connections) survive. The only way this works is if the UE's IP is anchored *at the PGW*, and the packets are tunneled from the PGW down to whichever eNodeB currently serves the UE. Mobility is handled by rewriting tunnel endpoints, not by rewriting IP addresses.

---

## § 21. Mobility

The distinctive challenge of a cellular network is that the UE moves. At vehicular speeds, moving from one cell's coverage to another's happens every few tens of seconds. If every such transition required detaching and reattaching, no active session (call, video stream, TCP connection) would survive.

Mobility management has different mechanisms depending on the UE's state and how far it needs to move.

### 21.1. Cell reselection (RRC_IDLE mode)

An idle UE constantly measures the serving cell's RSRP and the RSRP of neighbouring cells it can detect. When another cell becomes better by some margin (parameters in SIB3–SIB5), the UE "reselects" — it starts monitoring that cell for paging instead of the previous one.

Cell reselection is lightweight: no message to the network, no authentication, no tunnel changes. The UE just switches which cell's CRS/PDCCH it monitors. The MME and PGW know nothing. If the new cell is in the same tracking area (same TAC), no update is needed. If in a different TAC, the UE triggers a TAU (§ 15.5).

### 21.2. Measurement events (A1–A6)

In RRC_CONNECTED, measurements are more precise and event-triggered. The RRC configuration tells the UE what to measure and when to report. Events include:

- **A1**: serving cell above a threshold. Used to stop measuring neighbours when serving is strong.
- **A2**: serving cell below a threshold. Used to start measuring neighbours.
- **A3**: a neighbour is better than serving by an offset (typical for X2 handovers). Report if a neighbour is $X$ dB stronger for $Y$ ms.
- **A4**: a neighbour above a threshold, regardless of serving.
- **A5**: serving below one threshold AND neighbour above another threshold.
- **A6**: for carrier aggregation, secondary-cell measurements.

The eNodeB tells the UE which events to report and with what parameters. The UE responds with `Measurement Report` messages as events trigger.

### 21.3. X2 handover — the fast path

When an A3 event fires and the target eNodeB is reachable via X2:

1. **Source eNodeB decides** to hand over. Based on the Measurement Report, it selects the target cell.

2. **Handover Request** (source → target, over X2). Includes the UE's context: security keys ($K_{\text{eNB}}$ derivation info for forward security), bearer configurations (which DRBs exist and their QoS), PDCP state.

3. **Target eNodeB admission control.** Checks if it has capacity. Pre-allocates radio resources: RBs, a fresh C-RNTI, and a **dedicated PRACH preamble** for contention-free access (§ 10.6).

4. **Handover Command** (target → source → UE, over X2 then over the air). The RRC message that tells the UE: "hand yourself over to target cell PCI $X$, use this frequency, use this preamble, use this new C-RNTI."

5. **The UE cuts and pastes.** It stops listening to source, retunes to target frequency, transmits the reserved preamble on target's PRACH, receives an RAR that just contains a Timing Advance (no contention, no scheduling — the target already reserved everything), and sends `RRC Reconfiguration Complete` to signal it's on the new cell.

6. **PDCP state transfer.** Meanwhile the source has been forwarding buffered packets to the target over X2. PDCP sequence numbers are preserved, so the UE receives them at the target with no gap and no duplicate.

7. **Path Switch Request** (target eNodeB → MME → SGW, over S1). Tells the SGW to redirect the S1-U downlink tunnel to the target eNodeB. Until this completes, downlink packets keep going to the source eNodeB and are forwarded to the target over X2 (this is why X2 forwarding is essential — otherwise packets in flight would be lost).

8. **UE Context Release** (target → source). Source releases the UE's resources.

X2 handover takes a few tens of milliseconds. Call drop is imperceptible.

### 21.4. S1 handover — the fallback path

If X2 doesn't exist between the two eNodeBs (rare but happens between different vendors' equipment, or across MME boundaries), the handover falls back through the MME. The source eNodeB sends `Handover Required` to the MME; the MME forwards to the target eNodeB; the security context is passed through the MME rather than eNodeB-to-eNodeB. S1 handover is slower (100+ ms) but robust.

### 21.5. Measurement gaps

To measure a neighbour on a different frequency, the UE's radio must retune. But a single-radio UE cannot listen on two frequencies simultaneously.

For **same-frequency neighbours**, no gap is needed — the UE's receiver is already tuned there, and it can extract the neighbour's CRS from the received signal alongside the serving cell's CRS.

For **different-frequency neighbours** (inter-frequency LTE, or Inter-RAT to 3G/5G), the UE needs a **measurement gap**: a scheduled window (typically 6 ms every 40 or 80 ms) during which the serving eNodeB promises to transmit nothing to this UE, and the UE is forbidden from transmitting. The UE retunes its receiver to the neighbour, captures the neighbour's PSS/SSS/CRS, measures RSRP, and retunes back before the gap ends.

Measurement gaps cost throughput — during the 6 ms of gap, no data flows for that UE — so the network only configures them when inter-frequency measurements are needed.

### 21.6. Tracking area updates

Covered in § 15.5. TAU is the mobility mechanism for idle mode: the MME learns which tracking area to page when someone tries to reach the UE.

---

## § 22. VoLTE and IMS

### 22.1. Why IMS exists

LTE is packet-switched by design; the EPC has no notion of a "voice call." Yet operators must still deliver voice — for regulatory reasons (emergency calls) and because customers still expect a dial pad. The problem is not "carrying audio bytes" — that is trivial — but replicating the *service architecture* of a phone call: number-based addressing (call this ten-digit number), lawful intercept, billing per minute or per bundle, interconnect with other operators including PSTN.

**IMS (IP Multimedia Subsystem)** is the answer: a separate application-layer network that runs on top of the EPC's packet transport, uses SIP (Session Initiation Protocol) for call signalling, and hooks into the PSTN for interconnect. IMS was originally designed for 3G (where it saw limited deployment); in LTE it became mandatory because there is no other voice option.

### 22.2. Identities in IMS: IMPI, IMPU, and why more than one

IMS has its own identity layer, separate from IMSI/GUTI, because IMS was originally designed to be transport-agnostic (it also runs over WiFi, over 3G, over fixed broadband) and cannot depend on the SIM-issued IMSI. Two identifier types matter:

- **IMPI (IP Multimedia Private Identity)** — one per subscription, in the form of a Network Access Identifier: `username@operator.com`. Used only for authentication with the S-CSCF (§ 22.3). Never appears in call setup messages — it is the equivalent of a username in an ISP authentication.

- **IMPU (IP Multimedia Public Identity)** — the address others use to reach this subscriber. A SIP URI: `sip:+972501234567@ims.mnc003.mcc425.3gppnetwork.org` for a phone-number address, or `sip:alice@example.com` for a name-based address.

**Why a subscriber can have multiple IMPUs.** IMS separates *who the subscriber is* (IMPI, the credential) from *how they can be reached* (IMPU, the address). One person's phone service might legitimately be reachable at:

- Their **mobile number** (`sip:+972501234567@...`) — the phone-call address.
- A **short work extension** (`sip:1234@example-corp.com`) — an alias configured for enterprise routing.
- A **name-based SIP URI** (`sip:alice.smith@example.com`) — the "call by name" address.
- A **shared line** (`sip:frontdesk@example.com`) — one IMPU shared across multiple IMPIs, so any of several people can answer.

All of these map (in the HSS) to the same one IMPI, hence the same authentication credentials. Why care? Because it means routing decisions (which subscriber to page, which S-CSCF handles a call) key off the IMPU that appears in the SIP `To:` header, but authentication keys off the IMPI. The two lookups can be independent, giving the operator a lot of routing flexibility (aliases, hunt groups, virtual numbers) without duplicating credentials.

**Bootstrap of the IMPI from the SIM.** At first IMS registration, the UE has no explicitly-configured IMPI. It derives one from its IMSI by a standardized formula:

$$\text{IMPI} = \text{IMSI@ims.mnc}\langle\text{MNC}\rangle\text{.mcc}\langle\text{MCC}\rangle\text{.3gppnetwork.org}.$$

For IMSI 425032001234567 (Pelephone), the derived IMPI is `[email protected]`. The operator's HSS is provisioned to recognize this IMPI as the same subscriber whose IMSI it already knows, so the IMS authentication (which is a variant of the same EPS-AKA — § 18.2 — using the SIM key $K$) succeeds without extra manual setup.

Once the UE registers, the HSS reveals to the S-CSCF the full list of IMPUs associated with this IMPI. Future incoming calls to any of those IMPUs are routed to this UE.

### 22.3. The three CSCFs — what each is *for*

The CSCF (**Call Session Control Function**) is IMS's SIP proxy family. There are three, and each solves a distinct problem:

- **P-CSCF (Proxy-CSCF)** — the fixed first-hop SIP proxy the UE talks to. Lives in the *visited* network (in the roaming case) or the home network (otherwise). Its address is discovered at attach (delivered in the PDN Connectivity Accept for the `ims` APN, either as a P-CSCF IP or via DHCP). All SIP messages the UE emits go here first; all SIP messages destined for the UE are delivered from here. The P-CSCF's specific jobs:
  - **Traffic anchoring** — it's the fixed entry/exit point for the UE, so the network knows where to send messages.
  - **PCRF triggering** — when a session is established, the P-CSCF talks to the PCRF over the Rx interface (§ 22.6) to spawn the appropriate dedicated bearer.
  - **Lawful intercept in the visited network** — the visited operator can eavesdrop on SIP traffic here without needing home-network cooperation.
  - **Header hardening** — strips P-Access-Network-Info headers before forwarding, so the home operator does not learn which specific cell the UE is on (unless a roaming agreement permits sharing).

- **I-CSCF (Interrogating-CSCF)** — the *home network's entry point* from the outside. When a message arrives at the operator addressed to `sip:user@homeoperator.com`, it goes to the I-CSCF. The I-CSCF's *sole job* is to look up (via the Cx interface, Diameter) which S-CSCF is currently handling this subscriber, and forward the message there. It does not maintain per-session state. It is essentially a stateless DNS-like router for the home operator's IMS core, providing a stable public-facing address behind which the S-CSCF cluster can scale and change.

- **S-CSCF (Serving-CSCF)** — the *home node* handling the subscriber's session state. Every incoming or outgoing SIP transaction for the subscriber goes through their assigned S-CSCF. It holds:
  - **Registration state** — is the subscriber online? Where is their P-CSCF?
  - **Session state** — active calls, active sessions.
  - **iFC (initial Filter Criteria)** — see below.
  - **Lawful-intercept hooks** for the home operator.

**iFC — the "filter criteria" you asked about.** An **initial Filter Criterion** is a condition-plus-action rule in the subscriber's HSS profile that tells the S-CSCF: "if you see a SIP message matching this pattern for this subscriber, route it through *this Application Server* before continuing." Application Servers are the boxes that implement value-added services: voicemail, conference bridges, call-forwarding, telepresence, spam-call filtering.

An example iFC might read: "for any INVITE arriving for this subscriber where the SIP `From:` header matches a blocked-numbers list, route the INVITE to the spam-filter Application Server; for any INVITE not answered within 30 seconds, route to the voicemail Application Server."

The S-CSCF evaluates iFCs at the start of every session and re-evaluates on defined trigger conditions. The chain of iFC-selected Application Servers is what customizes the raw SIP session into whatever "phone service" the subscriber has purchased.

**The full CSCF-chain routing.** For a call from Alice (home operator A) to Bob (home operator B):

```
Alice's UE
    ↓ (SIP INVITE)
Alice's P-CSCF (in Alice's visited network — could be operator A or C)
    ↓
Alice's S-CSCF (home = operator A)
    ↓  (S-CSCF looks up Bob's domain; it's operator B)
Border-crossing (IPX / DNS ENUM lookup)
    ↓
Bob's I-CSCF (in operator B — public entry point)
    ↓ (I-CSCF asks Bob's HSS: which S-CSCF handles Bob? Answer: S-CSCF-42)
Bob's S-CSCF (operator B)
    ↓  (S-CSCF applies Bob's iFCs — maybe adds a call-recording AS)
Bob's P-CSCF (visited network for Bob)
    ↓
Bob's UE
```

Every reply (100 Trying, 180 Ringing, 200 OK, ACK) reverses the chain. The CSCFs on each side are stateful — they remember the session and route replies without re-lookup.

### 22.4. SIP: methods and what they do

**SIP (Session Initiation Protocol)** is a text-based, HTTP-like protocol. Messages have request lines, headers, and bodies. The methods relevant to VoLTE:

- **`REGISTER`** — "I am online at IP $X$, port $Y$; here is my authentication response." Sent by the UE to its P-CSCF at IMS attach time and periodically to refresh (typically every 30 minutes). The response includes the list of IMPUs the subscriber is authorised to use.

- **`INVITE`** — "I want to start a session with the recipient." Contains an SDP body describing the media the caller can offer. This is the *only* method that initiates a new session; every VoLTE call begins with an INVITE.

- **`ACK`** — "I received your final response to my INVITE; the session is now confirmed." Ends the INVITE transaction; without ACK, the callee assumes the connection failed and tears down.

- **`BYE`** — "I am hanging up." Ends an established session. The other side responds with 200 OK, and both tear down media.

- **`CANCEL`** — "Cancel the INVITE I sent — I don't want to establish this session after all." Only meaningful before the 200 OK arrives. (After 200 OK, use BYE.)

- **`UPDATE`** — "I want to modify the session parameters mid-call" (change codec, add video, put on hold).

- **`PRACK` (Provisional Response ACKnowledgement)** — see below.

- **`SUBSCRIBE` / `NOTIFY`** — "Tell me when event $E$ happens" / "here's the notification." Used for presence (online status), message-waiting indicators (voicemail alert), and dialog-state notifications.

- **`MESSAGE`** — carries an SMS payload for SMS-over-IMS.

- **`INFO`** — carries mid-call information (DTMF digits, call-transfer signalling).

**Responses** are three-digit codes with a category by hundreds:

| Range | Meaning | Examples |
|---|---|---|
| 1xx | Provisional (informational) | 100 Trying, 180 Ringing, 183 Session Progress |
| 2xx | Success | 200 OK |
| 3xx | Redirection | 302 Moved Temporarily |
| 4xx | Client error | 401 Unauthorized, 404 Not Found, 486 Busy Here |
| 5xx | Server error | 500 Internal Error, 503 Service Unavailable |
| 6xx | Global failure | 603 Decline |

**Why PRACK exists.** Standard SIP treats provisional responses (1xx) as "for your information only, don't ACK them" — the SIP FSM only acknowledges the final response. But in IMS this is a problem: a 183 Session Progress carries the callee's SDP answer, and losing it would break the media negotiation. VoLTE therefore mandates **PRACK** (RFC 3262): the caller acknowledges every reliable 1xx with a PRACK message, which itself gets a 200 OK. This gives 183 Session Progress and 180 Ringing the same delivery guarantee as 200 OK.

In practice, a VoLTE call setup has three round-trip acknowledgements:

- INVITE → 183 Session Progress → PRACK → 200 OK (for PRACK)
- ... UPDATE → 200 OK (for UPDATE)
- ... 180 Ringing → PRACK → 200 OK (for PRACK)
- Callee answers → 200 OK (for INVITE) → ACK

This is why VoLTE call setup takes a couple of hundred milliseconds — many small round trips, all in signalling.

### 22.5. SDP, RTP, RTCP

- **SDP (Session Description Protocol)** is a text format embedded inside SIP bodies. It describes: what media types (audio/video), what codecs (AMR, AMR-WB, EVS, H.264), what RTP endpoint (IP + port), and what supplementary attributes (packet time, DTMF handling). Two UEs exchange SDPs in the offer/answer model: caller's INVITE contains the SDP offer, callee's 183 Session Progress or 200 OK contains the SDP answer, and the intersection of what both list becomes the agreed session.

- **RTP (Real-time Transport Protocol)** carries the actual audio bytes. Runs over UDP (not TCP — retransmitting late voice is worse than a small dropout). Every packet has:
  - **Sequence number** (16 bits) — for the receiver to detect losses and reorder.
  - **Timestamp** (32 bits) — the sample time of the first byte, used to schedule playback and reconstruct pacing across a jittery network.
  - **SSRC** (32 bits) — synchronization source, identifies which stream this packet belongs to when multiple streams share an endpoint.
  - **Payload** — a coded audio frame (typically 20 ms of speech, 30–60 bytes after AMR-WB coding).

- **RTCP (RTP Control Protocol)** rides alongside on the same UDP port pair + 1. Sent every few seconds; carries statistics (packets lost, jitter, round-trip delay estimates). The receiver uses RTCP to signal quality back to the sender, which may adapt (e.g., switch to a lower-bitrate codec if the connection is bad). Not essential for the audio to work; used for adaptive rate control and monitoring.

For a two-way call, the audio path is bidirectional RTP streams between the two UEs, routed through the operators' media planes (which might do transcoding if codecs differ). The signalling path is bidirectional SIP through the CSCF chains.

### 22.6. PCRF and the policy interface

The **PCRF (Policy and Charging Rules Function)** is a decision engine that says which flows get which QoS, charged how, subject to what limits. It talks to two sides:

- **Rx interface** to the P-CSCF: "user is starting a VoLTE call; the RTP endpoints are IP $X$ port $Y$ ↔ IP $X'$ port $Y'$; codec is AMR-WB."
- **Gx interface** to the PGW: "for the flow filtered by (IP $X$ port $Y$ ↔ IP $X'$ port $Y'$), create a dedicated bearer with QCI 1 (voice), GBR set to codec bit rate."

So when a VoLTE call starts, the sequence is:

1. UE sends `INVITE` via P-CSCF → S-CSCF → other party.
2. Other party sends `200 OK` back with its SDP.
3. P-CSCF sees the completed SDP, learns the RTP endpoints, and sends `Rx: AAR` (AA-Request) to the PCRF.
4. PCRF authorises the QoS and sends `Gx: RAR` (Re-Auth-Request) to the PGW.
5. PGW creates the dedicated bearer with QCI 1, sends `Create Bearer Request` to the SGW, then to the MME, then to the eNodeB, then over RRC to the UE.
6. Bearer is set up. UE starts sending RTP on that bearer.

All this happens in under 200 ms, giving the caller the impression that the call "just connected." Without PCRF, there would be no mechanism to convert a SIP negotiation into an EPC bearer with the right QoS — the two universes (IMS above, EPC below) would not communicate.

### 22.7. The complete VoLTE call setup

Assume both UEs are already registered to IMS (their IMS default bearers are up, and they have SIP REGISTER state at their respective S-CSCFs).

```
Caller UE                                                      Callee UE
    |                                                              |
    | INVITE (SIP + SDP offer)                                     |
    |------> P-CSCF ---> S-CSCF ---> I-CSCF ---> S-CSCF ---> P-CSCF ---> |
    |                                                              |
    |                                       100 Trying (per hop)   |
    |                                                              |
    |                                              183 Session Progress |
    |                                             (SDP answer, ringing)  |
    |<--- P-CSCF <--- S-CSCF <--- I-CSCF <--- S-CSCF <--- P-CSCF <----|
    |                                                              |
    |  PRACK (provisional ACK, mandatory in IMS)                   |
    |------>------->------->------->------->------->------->------->|
    |                                                              |
    | Rx: AAR (P-CSCF -> PCRF: request QoS for these flows)        |
    | Gx: RAR (PCRF -> PGW: create dedicated bearer)               |
    | (bearer setup follows, both sides in parallel)               |
    |                                                              |
    |                             UPDATE / 200 OK for UPDATE       |
    |                                                              |
    | 180 Ringing                                                  |
    |<--- ... <--- (audio path is now open; ringback tone flows)   |
    |                                                              |
    |                                          200 OK (call accepted) |
    |<--- ... <---                                                 |
    |                                                              |
    | ACK                                                          |
    |------>------->------->------->                               |
    |                                                              |
    | *** RTP audio flows in both directions over QCI 1 bearer *** |
    |                                                              |
    |                                        BYE (either side hangs up) |
    |                                                              |
    | 200 OK                                                       |
    |                                                              |
    | Gx: RAR (PCRF: release the dedicated bearer)                 |
    | Bearer torn down                                             |
    v                                                              v
```

### 22.8. Codec negotiation

The SDP offer/answer includes a list of codecs each side supports, in preference order:

- **AMR-NB (Adaptive Multi-Rate Narrowband)**: 4.75–12.2 kbps, 8 kHz sampling. The 2G/3G codec.
- **AMR-WB (Wideband)**: 6.6–23.85 kbps, 16 kHz sampling. Gives "HD Voice" quality.
- **EVS (Enhanced Voice Services)**: 5.9–128 kbps, up to 48 kHz sampling. The 4G/5G codec, backwards compatible with AMR-WB.

Both sides list what they support; the intersection determines the codec. If one side is on 4G with AMR-WB and the other on 2G with only AMR-NB, a **media gateway** (part of the operator's IMS infrastructure) transcodes between the two.

The chosen codec's bit rate determines the GBR value the PGW enforces on the dedicated bearer. For AMR-WB at 12.65 kbps, the GBR is set to ~14 kbps (accounting for RTP overhead).

### 22.9. Emergency calls: a special mode

An emergency call (911, 112) bypasses most of the ordinary path:

- **Attach not required.** A UE with a locked SIM or no SIM at all can still make an emergency call. The attach procedure has a special "emergency attach" mode that skips the HSS authentication step (the network trusts the emergency indication and allocates an emergency-only bearer).
- **Emergency APN.** A dedicated APN (typically `sos` or `ims.emergency.<operator>`) is used, with QCI 69 (integrity-protected, low-latency, no billing).
- **Emergency IMS.** A special E-CSCF (Emergency-CSCF) handles the SIP INVITE, routing it based on the UE's location to the nearest Public Safety Answering Point (PSAP).
- **Preemption.** As covered in § 17.4, emergency bearers can preempt others in a congested cell.

The UE dials 911 from anywhere in the world and it works because the emergency service list is loaded into the UE's OS from the region's regulatory table, and the IMS emergency routing takes it from there — the network cannot refuse an emergency call.

---

## § 23. Service flows put together

Having built all the pieces, we can now trace the actual services a phone provides.

### 23.1. Web browsing

The user opens a browser and requests a URL.

1. **Wakeup.** Phone is in RRC_IDLE. OS realises it has traffic. UE initiates PRACH (§ 10), sends `NAS: Service Request`, transitions to RRC_CONNECTED.
2. **DNS.** UE resolves the hostname via DNS. The DNS servers were configured on the UE at attach time (in the `Attach Accept` NAS message, alongside the IP address).
3. **TCP.** UE opens a TCP connection to the resolved IP. Packet flow: UE → eNodeB (radio, encrypted with $K_{\text{UPenc}}$) → SGW (GTP-U over S1-U) → PGW (GTP-U over S5) → SGi → BGP-routed internet backbone → destination server.
4. **HTTPS.** TCP carries TLS carries HTTP. The PGW applies CGNAT: the UE's private cellular IP is rewritten to a public IP shared with thousands of other UEs.
5. **Return traffic.** The web server responds. Packets flow back the same path in reverse.
6. **Idle drop.** After a configured inactivity timer (typically 10 seconds), the eNodeB releases the RRC connection. The UE returns to RRC_IDLE. The default bearer at the PGW persists; the IP address is retained.

Neither the eNodeB (which can only see PDCP-ciphered packets) nor the operator's core (which sees the packets but they are wrapped in HTTPS) can read the content. What operators *do* see: SNI (from TLS ClientHello), destination IP addresses, and traffic volumes. This is enough for coarse traffic-shaping and DPI-based classification.

### 23.2. SMS: legacy on everything

Text messages persist through every network generation because the encoding is trivial and the regulatory expectation is universal. In LTE there are three ways to carry SMS, corresponding to the three ways an operator might have deployed:

- **SMS over IMS.** The SMS is a SIP MESSAGE method with the payload in the body. Carried on the IMS default bearer. Requires IMS deployment. Most modern operators use this.

- **SMS over NAS (SMS over SGs).** The SMS payload rides in a NAS message. The MME sees the NAS message, recognises it as SMS, and forwards it to a legacy MSC/VLR that handles SMS in the 2G/3G way (routing via SS7 to the SMSC — Short Message Service Center — and the recipient's home MSC). This is called "CS-Fallback SMS" or "SMS over SGs." Common in early LTE deployments before IMS was universally available.

- **SMS over 2G/3G (CS-Fallback).** For voice calls in the pre-VoLTE era, the UE would drop from LTE to 3G to complete a "circuit-switched" call. SMS-CSFB uses the same mechanism.

The SMSC (a store-and-forward server) is always in the loop. When you send an SMS, it goes to *your* home SMSC, which then delivers to the recipient's home SMSC (via SS7's MAP protocol, or via IMS-to-IMS peering), which delivers to the recipient. This is why SMS delivery is not instant and why messages sit in a queue if the recipient is offline — the SMSC holds them.

### 23.3. Voicemail: 1985 architecture in 2025

Voicemail is a pre-recorded-message service, and the architecture has not fundamentally changed since it was invented for early cellular:

- **Voicemail box.** A server at the operator holds one storage bucket per subscriber, with recorded voice messages as WAV or AMR files.
- **Deposit path.** When a call fails to be answered (no answer, busy, or handset off), the network forwards the call to the subscriber's voicemail box via a conditional call-forwarding rule set at the S-CSCF (or in 2G/3G, at the MSC). The caller records a message.
- **Retrieval path.** The subscriber dials a special short code (e.g., 101, 121, *86). This is a call to the voicemail service. The service authenticates the caller by their calling number, then plays the messages.
- **MWI (Message Waiting Indicator).** When a new message arrives, the voicemail server sends a SIP NOTIFY (or SS7 message) to the S-CSCF, which pushes it to the UE. The UE displays a "new voicemail" icon.

This works but is antiquated. Modern operators offer "Visual Voicemail" — an app that fetches voicemail as audio files over the internet (via the internet APN, not the voice APN), letting the user see a list and pick which to play. The backend voicemail infrastructure is the same; only the retrieval UI changed.

### 23.4. Emergency calls, complete flow

The user dials 911.

1. **UE detects the emergency number.** The OS has a list (per-region, loaded at boot) of emergency dial codes.
2. **Attach if needed.** If the UE is deregistered (no SIM, roaming without registration, etc.), it initiates an emergency-only attach. The MME allows attach with a stripped-down authentication, bypassing normal HSS lookup.
3. **Dedicated emergency PDN connection.** The UE requests a PDN connection to the emergency APN (`sos` or similar). The PGW allocates a bearer with QCI 69 for signalling and (once the call is set up) QCI 65 or 1 for the audio.
4. **SIP INVITE to E-CSCF.** The UE sends `INVITE sip:911@sos.<operator>.com`. The E-CSCF recognises this as emergency, uses the UE's location (from cell-tower measurements and, if available, GPS) to identify the correct PSAP.
5. **PSAP routing.** The E-CSCF connects to the PSAP's answering system. In the US, this is either a legacy PSTN gateway (analog-to-digital conversion) or a modern IP-based NGCS (Next-Gen Core Services) using SIP over IPsec.
6. **Location provisioning.** In parallel, the network sends the UE's location to the PSAP via a special "location provisioning" mechanism. Cell-tower coordinates are always sent; GPS is added when available (E911 Phase 2 requires horizontal accuracy within 50 m for 67% of calls).

The whole flow bypasses ordinary authentication, ordinary billing, and ordinary QoS. Emergency is a first-class special case, hardcoded into every level of the stack.

---

## § 24. Roaming and home routing

### 24.1. VPLMN and HPLMN

Two concepts that must be kept separate:

- **HPLMN (Home Public Land Mobile Network)** — the operator whose SIM the subscriber has. Never changes for that SIM.
- **VPLMN (Visited PLMN)** — the network the subscriber is currently attached to. Changes as the subscriber moves.

If HPLMN = VPLMN, the subscriber is on their home network (not roaming). If HPLMN ≠ VPLMN, the subscriber is roaming.

### 24.2. How the visited network learns to serve you

The scenario: a subscriber from HPLMN "Home Co" arrives in a country where the visited network is "Visited Co." The subscriber's UE reads Visited Co's SIB1 and sees PLMN = Visited Co. This does not match Home Co, so the UE cannot use it directly. But roaming agreements exist: Home Co has told Visited Co "these are our subscribers, we'll pay for their usage."

The mechanism:

1. UE attempts attach to Visited Co's eNodeB. The `Attach Request` includes the UE's IMSI, whose MCC+MNC prefix identifies HPLMN.
2. Visited Co's MME (which cannot verify the IMSI itself — it doesn't have the shared secret $K$) contacts *Home Co's* HSS via a Diameter Edge Agent (DEA) using the S6a interface, or, more properly, the Sh interface with roaming semantics. The routing is done using the IMSI's HPLMN identifier.
3. Home Co's HSS returns an authentication vector — with a *specific* $K_{\text{ASME}}$ derived using Visited Co's PLMN ID (so this key can only be used in this visited network).
4. Visited Co's MME runs EPS-AKA with the UE using this vector. Authentication succeeds.
5. Home Co's HSS also returns the subscription profile: which APNs the subscriber may use, which QCIs are allowed, billing indicators.

Now Visited Co's MME can serve the UE. All authentication traffic between Visited Co and Home Co runs over the **IPX (IP Exchange)** — a private B2B network for operators, with mutual authentication and traffic accounting.

### 24.3. Home routing vs local breakout

The next question: when the roaming UE opens a TCP connection to a website, does the traffic go through Home Co's PGW, or Visited Co's PGW?

Two answers:

- **Home routing (S8 interface).** SGW is in Visited Co (where the UE physically is), but PGW is in Home Co (far away). All user-plane traffic goes: UE → Visited Co eNodeB → Visited Co SGW → GTP-U over S8 to Home Co PGW → SGi → internet. The subscriber's IP address is from Home Co's pool, so everything about the subscriber's session appears (to the outside world) to originate in Home Co.

- **Local breakout (LBO).** SGW and PGW both in Visited Co. UE gets a Visited-Co-assigned IP. Traffic goes: UE → Visited Co eNodeB → Visited Co SGW → Visited Co PGW → internet. The subscriber's session appears to originate in Visited Co.

Home routing is the default because it centralises billing (Home Co sees all the traffic and charges accordingly), enforces the home operator's content policies, and lets services that whitelist "home operator IPs" continue to work (banking apps, some streaming services). The cost is latency — the UE's traffic crosses continents to reach the PGW before hitting the destination.

Local breakout is used selectively for latency-sensitive services (some IMS deployments have LBO for the P-CSCF path).

### 24.4. Equivalent PLMN

Sometimes a subscriber's own operator "owns" multiple PLMN IDs — different network codes for different services or historical reasons. The HSS can list these as **Equivalent PLMNs**, and the UE treats them as if they were its home network. No roaming penalty applies.

### 24.5. The "data roaming" switch

The setting on every phone's Settings menu that toggles cellular data while roaming. What it actually does:

- **When enabled**: the UE requests a PDN connection to the internet APN as normal; the visited network serves it.
- **When disabled**: the UE does not request the internet PDN connection while attached to a VPLMN. Voice (IMS default bearer) may still work if the UE also has the ims APN configured for VPLMN.

The switch is entirely on the UE side. The visited network cannot enforce it — if the UE requests data, the network serves it. Turning off "data roaming" is thus a *user policy* to avoid bill shock; it does not represent any network-level block.

---

## § 25. Location, tracking, and privacy

### 25.1. Cell-tower trilateration

A UE's coarse location can be estimated from which cell it is attached to (each cell covers roughly a 1–10 km radius). Better estimates use multiple simultaneous measurements:

- **Cell of origin.** The eNodeB knows where its cells are. If the UE is in cell X, the UE is within X's coverage area.
- **Signal strength.** RSRP inversely correlates with distance (very roughly, given fading). A UE seeing cell X at $-100$ dBm is farther from X than a UE seeing X at $-80$ dBm.
- **Timing advance.** The eNodeB knows the TA it has commanded (§ 10.1). One TA unit is $\sim 0.52\,\mu\text{s}$, corresponding to $\sim 78$ metres of round-trip distance ($\sim 39$ m one-way). So TA gives a coarse distance estimate to $\sim 40$ m.
- **Angle of arrival.** If the eNodeB has multiple antennas per sector, it can measure the direction the UE's uplink is coming from, giving an angle to complement the distance.

With three or more cells' measurements (which requires the UE to be within radio range of three), trilateration gives a horizontal fix to $\sim 100$ m in urban environments, worse in rural.

### 25.2. Timing advance as a distance signal

The TA value is transmitted every time the eNodeB updates it (typically once per 500 ms during an active connection). The MME can log TA over time and reconstruct a coarse trajectory. Operators use this for network optimization; law enforcement can request it via subpoena.

### 25.3. E911 mandates

In the US, the FCC's E911 rules require operators to provide the following to PSAPs on emergency calls:

- **Phase 1**: caller's phone number and cell tower ID. Basic location = tower coordinates.
- **Phase 2**: caller's horizontal location within 50 m for 67% of calls, 150 m for 90% of calls. Requires either handset-based (GPS) or network-based (trilateration) location.

Most modern phones send GPS location automatically when placing 911 calls — a feature called **AML (Advanced Mobile Location)**. The phone briefly enables GPS, gets a fix, and sends it over an SMS or HTTPS post to a specific emergency service endpoint.

### 25.4. IMSI catchers

An **IMSI catcher** (also called a "Stingray") is a rogue eNodeB set up to lure UEs into revealing their IMSIs. The attack:

1. Attacker sets up a fake eNodeB broadcasting the target PLMN's identity with strong signal (stronger than nearby real eNodeBs).
2. UEs in range see the fake cell as the best available; they attempt attach.
3. Attach Request includes IMSI in cleartext (because there is no established security context yet — §§ 18, 19).
4. Fake eNodeB records the IMSI, then either rejects the attach or completes it and downgrades the UE to a weaker generation for further eavesdropping.

Why is this possible? Because the LTE authentication is mutual only *after* the UE reveals its IMSI. The very first message the UE sends is unauthenticated cleartext IMSI. Any device that speaks LTE well enough to broadcast SIB1 can collect IMSIs.

The GUTI mechanism (§ 16.2) is the partial defence — after the first attach, the UE uses GUTI, and IMSI stays hidden. But: the fake eNodeB can send `NAS: Identity Request (IMSI)` after the initial `Attach Request`, and the UE has no way to know this is malicious — the network legitimately might not recognise the GUTI (if the UE has been off for a long time) and might legitimately need the IMSI.

5G partially fixes this by encrypting the IMSI-equivalent (SUCI, Subscriber Concealment Identifier) with the home network's public key. LTE cannot be fixed short of network upgrades.

### 25.5. SMS-over-SS7 and the broken 2FA weakness

SS7 (Signalling System 7) is the pre-IP signalling network for 2G/3G. It has one catastrophic property: **no message-origin authentication.** Any entity connected to the SS7 network can send messages claiming to be from any other entity.

Concrete abuse: an attacker with SS7 access (achievable by bribing a small national operator or renting access from a data broker) can send a `SendRoutingInfoForSM` request claiming to be the recipient's home SMSC. The victim's operator responds with information about where the victim currently is, including how to route SMS to them. The attacker then sends an `UpdateLocation` (or similar) to redirect SMS routing through the attacker's system for a short window, intercepting incoming SMS.

Why 2FA-over-SMS is broken:

- Bank sends a 6-digit code to the user's phone number.
- Attacker (who separately obtained the user's password) intercepts the SMS via SS7.
- Attacker enters the code, completing the login.
- User sees no anomaly — the SMS may still arrive at their handset a moment later.

The fix is not on the cellular side (SS7 is fundamentally not authenticable). The fix is at the application layer: use TOTP (time-based one-time passwords via authenticator apps) or hardware tokens (WebAuthn / FIDO2) instead of SMS. Every serious security guidance since around 2016 has recommended migrating off SMS for 2FA.

The subtlety is that LTE itself is *not* affected: SMS-over-NAS or SMS-over-IMS in LTE uses the operator's internal secure channels. The SS7 exposure comes from **interconnect** — when the user's SMS transits between operators via SS7 (rather than IMS-to-IMS peering, which is authenticated), or when a legacy SMSC is involved.

---

## § 26. Additional physical-layer topics

### 26.1. MIMO — spatial multiplexing and diversity

**Multiple-Input Multiple-Output** exploits multiple antennas at both ends of the link to transmit multiple *spatial streams* simultaneously on the same time-frequency resources.

The mathematical model. With $N_t$ transmit and $N_r$ receive antennas, one OFDM subcarrier carries the equation

$$\mathbf{y} = H \mathbf{x} + \mathbf{n}$$

where $\mathbf{x} \in \mathbb{C}^{N_t}$ is the vector of symbols transmitted (one per transmit antenna), $\mathbf{y} \in \mathbb{C}^{N_r}$ is the received vector, $H \in \mathbb{C}^{N_r \times N_t}$ is the channel matrix, and $\mathbf{n}$ is noise. If $H$ has rank $r$, up to $r$ independent streams can be transmitted; the receiver inverts (or pseudo-inverts) $H$ to separate them.

Two operating modes:

- **Spatial multiplexing.** Rank of $H \geq 2$: transmit two independent streams, doubling throughput. Requires the channel to have rich scattering (multipath), which paradoxically makes MIMO work *better* in cluttered urban environments than in open rural ones.

- **Diversity / beamforming.** Rank of $H = 1$: transmit the same symbol from all antennas with different weights, so the receive antennas see coherent addition. Doesn't increase throughput but increases SNR — useful when $H$ is rank-deficient (line-of-sight rural).

The eNodeB picks between these per subframe based on the RI (Rank Indicator) the UE reports as part of CSI (§ 7.4).

LTE supports up to $4 \times 4$ MIMO in Release 8, growing to $8 \times 8$ in later releases. The UE's category (Cat 4, Cat 6, etc.) specifies its MIMO capability.

### 26.2. Fading models — Rayleigh, Rice, Nakagami

The complex channel gain $H[k]$ on a given subcarrier is a random variable whose distribution depends on the propagation environment.

- **Rayleigh fading.** No line-of-sight component. $|H|$ follows a Rayleigh distribution ($f(r) = \frac{r}{\sigma^2} e^{-r^2/(2\sigma^2)}$). Typical of dense urban with many scatterers, no direct path. RMS gain is $\sigma\sqrt{\pi/2}$.

- **Rician fading.** Line-of-sight component plus scatter. $|H|$ follows a Rice distribution. Parameter $K$ (the Rician K-factor) is the ratio of line-of-sight power to scatter power; $K = 0$ recovers Rayleigh, $K = \infty$ gives a constant gain.

- **Nakagami-$m$ fading.** A generalisation encompassing both, useful when field measurements don't fit Rayleigh or Rice cleanly. Parameter $m$ controls the shape; $m = 1$ is Rayleigh.

Rayleigh is the default assumption in LTE simulations because it is the worst-case for coding (no reliable line of sight to lean on) and it matches most urban cellular deployments.

### 26.3. Coherence time

Analogous to coherence bandwidth (§ 3.2) but in the time direction. If the UE and its environment move at velocity $v$, the channel decorrelates over a timescale

$$T_c \approx \frac{c}{v f_c}$$

(the reciprocal of Doppler shift). At 350 km/h and 2 GHz, $T_c \sim 0.5\,\text{ms}$. This is why CRS pilots must appear at least four times per subframe (§ 7.1) — one pilot every subframe would miss the mid-subframe channel change.

Coherence time affects HARQ efficiency indirectly: if the channel changes between the initial transmission and the retransmission, soft-combining across HARQ processes is less effective (the two blocks were transmitted through different channels).

### 26.4. SFN math — deriving paging occasions

The UE's specific paging occasion within its DRX cycle is determined by:

- **PF (Paging Frame)** — which radio frame within the DRX cycle contains this UE's paging.
- **PO (Paging Occasion)** — which subframe within that frame.

Formulas (from the standard):

$$\text{SFN} \bmod T = (T \bmod 10) \cdot (\text{UE\_ID} \bmod N)$$

where $T$ is the DRX cycle length in frames (32, 64, 128, or 256), $N$ is $\min(T, 4)$, and UE_ID is derived from the IMSI:

$$\text{UE\_ID} = \text{IMSI} \bmod 1024.$$

Different IMSIs hash to different PFs, spreading paging load across frames. A UE only listens for paging on its assigned PF/PO, saving battery — the other $\sim 90\%$ of paging subframes are irrelevant to this UE.

### 26.5. The 15 MHz FFT choice — 1536 or 2048 with padding

15 MHz LTE uses 900 subcarriers spanning 13.5 MHz. Two implementation choices for the transmitter's FFT:

- **1536-point FFT at 23.04 MHz sample rate.** Native, no padding. Requires mixed-radix FFT hardware ($1536 = 2^9 \cdot 3$, needing radix-3 support).
- **2048-point FFT at 30.72 MHz sample rate, with 1148 zero-padded subcarriers.** Reuses the same FFT hardware as 20 MHz LTE. Same over-the-air signal, but $\sim 33\%$ higher digital processing load because 30.72 MHz is being processed instead of 23.04 MHz.

Both produce identical RF signals. The trade is silicon area (one FFT design) vs power (running the larger FFT unnecessarily). Chipsets targeting markets with heavy 15 MHz deployment (some Asia-Pacific operators) implement the native 1536; chipsets targeting global multi-bandwidth support use the padded 2048.

The general principle at play: **zero-padding in the frequency domain corresponds to interpolation in the time domain.** A 2048-point IFFT of a signal with only 900 nonzero subcarriers produces a time-domain signal that is a $\sim 4/3$ upsampled version of what a native 1536-point IFFT would produce. Both contain the same information; the padded version just has more samples per second.

### 26.6. Airplane mode

"Airplane mode" is a UE-side setting that instructs the modem to turn off all radios (LTE, Wi-Fi, Bluetooth). The behaviour:

- **UE:** Sends `NAS: Detach Request` if currently attached, then powers down the RF. The MME receives the detach, releases resources, marks the UE as EMM-DEREGISTERED.
- **From the network's perspective:** the UE is deregistered — the same state as "powered off." No paging is delivered.

When airplane mode is turned off:
- **UE:** Powers on the radio, scans for cells, does a fresh attach (or a `NAS: Service Request` if the UE preserved its GUTI and the MME still has state).
- **Result:** identical to a cold boot from an EMM point of view.

### 26.7. Find My Phone — the mechanism

When a phone is powered on but the user has misplaced it, "Find My Phone" (or the Android equivalent) allows the phone to be located remotely. The mechanism:

1. User logs into Apple/Google's web service.
2. Service sends a push notification via APNs/FCM to the phone. This transits the internet, through the PGW, through the cellular network, to the phone.
3. Phone receives the push, enables GPS, gets a fix.
4. Phone sends its coordinates back over HTTPS.

None of this uses cellular-specific location mechanisms. It's pure IP over the LTE data connection. The reason it works when the phone is "just" in a pocket is that the phone maintains an active push-notification connection (a long-lived TCP connection) that keeps the RRC state alive with periodic keepalives.

If the phone is off, or in airplane mode, none of this works — the phone is unreachable at the network layer. In that case, the last reported location before the phone went offline is all the service has.

---

## § 27. Closing notes on how to read LTE specifications

The 3GPP specifications for LTE fill several thousand pages, distributed across dozens of TS ("Technical Specification") documents. The key ones and what each covers:

- **TS 36.211** — Physical channels and modulation (the FFT layout, PSS/SSS, PDCCH structure).
- **TS 36.212** — Multiplexing and channel coding (turbo codes, rate matching, DCI formats).
- **TS 36.213** — Physical layer procedures (HARQ, PDCCH mapping, CQI reporting).
- **TS 36.321** — MAC protocol specification.
- **TS 36.322** — RLC.
- **TS 36.323** — PDCP.
- **TS 36.331** — RRC.
- **TS 24.301** — NAS (EMM and ESM).
- **TS 33.401** — Security architecture (EPS-AKA, key hierarchy).
- **TS 29.274** — GTPv2-C (S11 signalling).
- **TS 29.281** — GTPv1-U.
- **TS 24.229** — IMS SIP profile.

Reading them requires learning the 3GPP dialect: state machines are given as flowcharts with cryptic labels, message formats as tables of bit fields, timing as tables of subframe indices. Once you know the vocabulary, the specs are precise and consistent.

The purpose of a document like this one is to compress the intent behind the specs into something you can hold in your head — so that when you go to the specs for a specific answer, you know which chapter to look for and what the answer should approximately look like before you find it.

---
