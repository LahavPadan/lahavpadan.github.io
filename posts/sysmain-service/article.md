
Sysmain (called "SuperFetch" through Windows 7/8, renamed "SysMain" from Windows 10) is a Windows service intended to improve interactive responsiveness by learning what the user does and pre-warming the memory manager accordingly.

Concretely, it:

- Records an optimal ordering of files (exe, dll, sys) touched during boot, and writes this into `layout.ini` under the Prefetch folder. `layout.ini` is not just informational — the Windows defragmenter *consumes* it, physically reordering the referenced files so the next boot's I/O is contiguous. Optimization pipeline: Sysmain traces boot → `layout.ini` → defrag places boot files linearly → next boot reads them with fewer seeks. (On SSDs this half of the mechanism is inert — no seek to save.)
- Tracks pages in memory, filenames, and shared sections (the section objects mapping loaded DLLs and EXEs) — the raw material that later becomes prefetch traces.
- Records system-state transitions — standby, hibernation, user session switch — and even snapshots the "before" state so a future return to it is cheaper.
- Tracks usage patterns over time of day — when the machine is on, its peak-usage windows, its idle stretches.
- Architected around cooperating **Agents** (see under SuperFetch).

Sysmain is `AUTO_START`, i.e., started by the SCM automatically at boot with no user logon required.

**Note on the rename.** The service key is now `HKLM\SYSTEM\CurrentControlSet\Services\SysMain`. Forensic scripts still searching for "Superfetch" will silently miss it on Windows 10+.

## How Sysmain Gets its Data

Sysmain runs in **user mode**. It gets its data via two channels:

1. **IOCTLs to a filesystem minifilter driver, `FileInfo.sys`.**
   Provides file-level visibility (opens, closes, mappings, extends).

   Technically, `FileInfo.sys` is a **minifilter** under FLTMGR, not a legacy filter driver. Its altitude sits in the "FSFilter Bottom" band, so it observes I/O *after* the filesystem has resolved it — appropriate for "which pages of which files were touched" without perturbing the request.

2. **The `NtQuerySystemInformation` native API with several `InformationClass` values:**
   - `SystemSuperfetchInformation` — the load-bearing one. Surfaces per–page-frame data (PFN entries) from the kernel's PFN database, and process information carved out of the kernel `EPROCESS` structure.
   - `SystemProcessInformation` — running processes.
   - `SystemExtendedHandleInformation` — open handles.

**Why user-mode Sysmain needs a kernel bridge at all.** Prediction is grounded in *which physical pages* belong to *which process* and *how often each is faulted in*. The PFN database and `EPROCESS` are kernel structures — invisible from user mode without a syscall bridge. `SystemSuperfetchInformation` (class value 79) is a semi-documented class designed specifically to feed the Sysmain agents this data; if you wanted to build a comparable predictor from scratch, this is the class you'd have to reverse.

Sysmain is the umbrella service for **Prefetch, SuperFetch, ReadyBoost, ReadyBoot** (and, historically, **ReadyDrive**).

---

## Prefetch

### What it is

A per-executable trace file recording which pages/files are touched during the first ~10 seconds of initialization. Extension `.pf`. Location `%SystemRoot%\Prefetch\`.

- Signature: `SCCA` uncompressed.
- Signature: `MAM\x04` when compressed with MS-XPRESS (Huffman variant). Introduced Windows 8+ to shrink the folder.

Prefetch files exist for executables, boot components (EFI/boot binaries), and `layout.ini`. For the rest of this section, "prefetch file" means the executable trace unless otherwise noted.

### Why 10 seconds

Windows uses two trace windows:

- Application-launch trace: ~10 s after process start. Rationale: virtually all significant DLL loads and cold-init I/O of a normal desktop app complete in this window; past 10 s the activity is user-driven and not predictable from a trace.
- Boot trace: up to ~30 s from boot start, because the boot path touches many more files.

### The mechanism

A `.pf` file is **not** a copy of the code pages. It is a *plan* — a list of file references (the exe + its DLLs + data files) with per-file page ranges.

On the *next* launch of the same exe, the memory manager reads the `.pf` file **before the loader starts resolving imports** and asynchronously issues page reads for the recorded ranges. By the time the loader reaches those pages, they are either already in RAM (soft page fault instead of hard) or already in flight, so the hard page fault gets shortened.

This is why Prefetch speeds up **cold** launches but has essentially no effect on warm ones (the pages are already resident) and no effect at all if you disable it.

Enable/disable:

```
HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters\EnablePrefetcher
  0 = disabled, 1 = app only, 2 = boot only, 3 = both
```

### Contents of a .pf file

1. Full path to the executable, size of the executable.
2. Since Windows 8: internal timestamps for the last **8 executions**, stored *inside* the .pf file. Parsers also lift `$STANDARD_INFORMATION` and `$FILE_NAME` timestamps from the file's MFT record.
3. Filesystem timestamps of the .pf file itself. Under normal operation:
   - Create time = first ever execution (the .pf is created on first run and stays).
   - Last-modified time = most recent execution.

   *Important caveat:* if Sysmain rebuilds the .pf (e.g., the exe or its imports changed enough to invalidate the previous plan), the Create time *resets*. The eight internal timestamps are the reliable execution-history source; filesystem timestamps are the coarser fallback and are trivial to timestomp.
4. Execution count.
5. Directories and files referenced, **including the volume ID** — you get not just the path but *which drive*, which matters when reconstructing execution across removable media.
6. DLLs loaded during the traced window.

### Naming (with a forensic consequence)

Files are named `EXENAME-XXXXXXXX.pf` where `XXXXXXXX` is a hash of the full path of the executable (specific Windows hash function over the uppercased UTF-16 path).

- Two copies of the same exe under different paths get *different* .pf files. Forensically, this distinguishes `C:\Windows\notepad.exe` from `C:\Temp\notepad.exe` even if both have identical filesystem timestamps.
- Renaming or moving the exe changes the hash → new .pf on next run. The old .pf remains until eviction.

The folder retains up to **1024 entries** on Windows 8+ (128 on earlier). Oldest evict first.

### Priorities

Sysmain writes prefetch files using:

- Low-priority I/O (background priority) — throttled so it doesn't steal HDD bandwidth from user requests.
- Low-priority page allocations (memory priority **1**).

Contrast with SuperFetch's own working set below, which runs at memory priority **7**.

### SSD behavior

Windows 7 auto-disabled Prefetch on SSDs (random-read cost negligible → trace not worth maintaining). Windows 8+ re-enabled it even on SSDs because Prefetch also reduces CPU-side cost of app launch (fewer page faults means fewer context switches into the memory manager, not just less I/O). Practical implication for forensics: expect .pf files on modern Windows regardless of storage type.

### Forensic parsing

- **PECmd** (Zimmerman) — current de facto CLI parser; handles both `SCCA` and `MAM\x04`.
- **WinPrefetchView** (NirSoft) — GUI.
- Complementary execution artifacts: **Amcache** (`Amcache.hve`), **ShimCache** (`AppCompatCache` in registry), **UserAssist**, **SRUM** (Sysmain's sibling on the resource-tracking side), and **BAM/DAM**. No single one is complete; cross-check.

### Anti-forensics angle

Attackers routinely wipe Prefetch:

```
del /F /Q C:\Windows\Prefetch\*.pf
```

Detection: deletion events on `%SystemRoot%\Prefetch\` from anything other than `SYSTEM`/`TrustedInstaller` are anomalous. Even after deletion, folder cardinality vs baseline is diagnostic — a nearly-empty Prefetch folder on a machine with weeks of uptime is a strong signal.

Timestomping is harder than for most artifacts *because* the eight internal run timestamps live inside the file — spoofing them requires a proper rewrite, not the usual `SetFileTime`. Most timestomping tools only touch `$STANDARD_INFORMATION`, leaving the internal timestamps intact.

### Bonus: compressed .pf in the wild

A `MAM\x04`-compressed Prefetch folder is the default on Windows 8+ — nothing exceptional.

---

## SuperFetch

### Purpose

Preload pages likely to be needed. Prediction is via a **Markov chain**. The target of the improvement is *program launch responsiveness*, not disk layout.

### State transitions that feed the model

After state changes — hibernation, standby, fast-user-switching, launching a program, opening the Start menu / Control Panel / Open/Save dialog — Sysmain records the transition in database files.

The recorded quantity is a conditional probability: **given** the user is in program/state X, **what** is the probability they will transition to program/state Y next. The tables are therefore per-user (user U's transition graph is not user V's).

Each program is also associated with the pages it touches frequently (and its recent page-fault set), so once we predict *which* program is about to launch, we know *which pages* to prefetch on its behalf.

### The Markov graph

- Nodes: programs / system states.
- Edges: transition probabilities.
- Initial-state distribution.

DBs start empty; there is a burn-in period.

Given two structural properties on the graph:

1. **Irreducibility** — any state reachable from any other with positive probability.
2. **Aperiodicity** — return times to a state don't lock onto a period.

We get the standard guarantee: the state distribution converges to a **stationary distribution** independent of where we started. Practical consequence: after a vacation, or after moving to a new project, SuperFetch's predictions don't stay pinned to obsolete behavior — the stationary probabilities eventually reflect the new pattern.

### Why Markov and not something more expressive

The feature dates to Vista (2007) and runs continuously on every Windows box. Markov gets you: O(states²) storage and O(1) online update; provable convergence; no train/inference split; predictions that are explainable in one line. For a background service that must not perturb the workload it's optimizing, this beats a neural net — and Windows never revisited the choice.

### The 6-hour diurnal buckets

Sysmain builds four models per day — roughly morning, noon, evening, night, each ~6 hours. User behavior has strong daily periodicity that a single stationary distribution would smear over. Six-hour bucketing is a compromise: fine enough to separate work-day from after-hours, coarse enough that each bucket accumulates enough transitions to be statistically meaningful.

### Memory priority

Pages holding SuperFetch's own working set are considered critical and are allocated with **memory priority = 7** (the highest), pinning them against being swapped or trimmed. Compare with Prefetch's writes at priority 1. The reasoning: SuperFetch loses value if the prediction model itself is paged out — you'd defeat the point of prefetching by making the prefetcher slow.

### Relationship to the standby list (the load-bearing operational detail)

SuperFetch does **not** put predicted pages into a process's active working set. It puts them into the **standby list** — the tier of physical memory that holds pages cached but not committed to any particular process.

When a process demands a page that happens to be in standby, the memory manager promotes it from standby to active: a **soft** page fault, satisfied at RAM speed, no disk I/O.

If free memory pressure arises, the memory manager repurposes standby pages *first*. So SuperFetch can afford to be aggressive: worst case, its prefetched pages get repurposed when something else needs the RAM; best case, they arrive as free performance. This is what makes the whole scheme cost-safe.

### Location and naming

Since Windows Vista. Files live alongside Prefetch under `%SystemRoot%\Prefetch\`.

- Prefix: `Ag` (from "**Agent**" — the internal Sysmain componentization).
- Extension: `.db` (in contrast with Prefetch's `.pf`).

### Runtime scope difference vs Prefetch

Prefetch traces the first ~10 s of a process. SuperFetch runs for the process's whole lifetime, refining its per-app page set as usage continues.

### Databases of forensic interest

- `AgAppLaunch.db` — application-launch events with timestamps. Per-user execution history, comparable in value to UserAssist.
- `AgGlFaultHistory.db`, `AgGlFgAppHistory.db`, `AgGlGlobalHistory.db` — PFN-level information (fault history, foreground-app history, global page usage).
- `AgCx_<SID>.snp` — per-user compressed snapshot ("Cx" = compressed context), named by SID → immediate attribution of activity to a specific user account.

*Parser caveat:* the `.db` / `.snp` formats are undocumented and Microsoft has changed them between Windows versions. Community parsers (`agdbparser` and forks) work on specific builds and can silently fail on newer ones. When accuracy matters, cross-check Ag* extraction against Amcache and Prefetch rather than trusting it standalone.

---

## RdyBoost.sys — the confusing shared driver

**Disambiguation.** `RdyBoost.sys` is one driver implementing two similarly named but different features: **ReadyBoost** and **ReadyBoot**.

It is a **volume filter driver**, intercepting volume-level I/O to cache reads into various backing stores.

- **ReadyBoot** cache is **not** encrypted.
- **ReadyBoost** cache **is** encrypted (AES-128).

**Why the encryption asymmetry.** ReadyBoot's cache lives on the boot volume — specifically in an area accessible before/around the BitLocker unlock. The EFI system partition and pre-unlock boot data are already in the clear (the CPU has to execute them before decryption keys are available), so encrypting ReadyBoot's cache there would just add cycles without changing the threat model. ReadyBoost, in contrast, writes to *external removable media* that will physically leave the premises with the user — the relevant threat is a lost/stolen USB stick full of RAM snapshots, which is exactly what AES buys you.

Scope difference:

- ReadyBoost: caches for all volumes' data (whichever pages the memory manager elects to send there).
- ReadyBoot: caches specifically boot-volume I/O.

**Bonus:** `RdyBoost` loads in the second phase of NT kernel initialization.

---

## ReadyBoost

Uses a USB flash drive, SD card, or other removable device as a cache tier for main memory.

Installs a single file at the device root:

```
\ReadyBoost.sfcache
```

- Encrypted with **AES-128** operating on chunks of cached data.
- Key is machine-specific, stored under `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\EMDMgmt`, DPAPI-protected.

**Attack vector, stated precisely.** Pulling the USB from one machine and reading `.sfcache` on another does not yield plaintext. The concrete threat is *on the originating host*: local malware (or a forensic examiner with SYSTEM) can lift the key from the registry and decrypt `.sfcache`, which may contain fragments of process memory that were shunted through standby. Treat `.sfcache` as roughly as sensitive as standby-list contents on that host, not as an air-gap-crossing artifact.

Sysmain uses **External Memory Management** to decide whether a candidate device qualifies:

- Service host: `Emdmgmt.dll` under `svchost`.
- Kernel: volume filter `Ecache.sys`.

**Qualification thresholds** (approximate): ≥ ~2.5 MB/s for 4 KB random reads and ≥ ~1.75 MB/s for 512 KB random writes, sustained. A device that fails is refused — under-spec flash would slow the system rather than help.

**Size bounds:** 256 MB minimum. Max varies by filesystem — 4 GB with FAT32, 32 GB with NTFS, larger with ExFAT.

**Practical relevance today.** With commodity RAM and internal SSDs standard, ReadyBoost offers essentially no measurable improvement on modern systems and Windows 10+ often declines to enable it. When you *do* see `.sfcache` in the wild, treat it as an artifact from a low-RAM device or a legacy install; its forensic weight has correspondingly dropped.

---

## ReadyBoot

Uses a **RAM-resident** cache during boot to accelerate the boot process. Despite the driver overlap, this is not ReadyBoost.

Its action plan is stored as a binary blob in the registry:

```
HKLM\SYSTEM\CurrentControlSet\Services\rdyboost\Parameters\BootPlan
```

**What's inside a BootPlan.** An ordered list of file regions predicted to be read during the boot sequence, derived from past boot traces (the `.fx` files below). At boot, `RdyBoost` reads the plan and issues those reads *ahead of* when the boot code demands them, populating a RAM cache that boot-time reads then hit.

**BootPlan is deleted ~50 seconds after Sysmain starts.** Rationale: at this point boot is deemed complete, the cache has served its purpose, and holding a stale plan risks it being consumed on the next boot before Sysmain has had a chance to regenerate it against current file layout.

Under `%SystemRoot%\Prefetch\ReadyBoot\`, `.fx` files store traces of boot-time I/O operations. These are **ETW** (Event Tracing for Windows) trace files — the events come primarily from the `Microsoft-Windows-Kernel-Prefetch` provider (and adjacent kernel-boot providers). Because they're ETW, you can open them with `xperf` / WPA to inspect the recorded boot I/O timeline directly.

**Interaction with `layout.ini`.** The same trace data that generates the BootPlan also feeds `layout.ini`, which the defragmenter reads to physically reorder boot files. On HDDs the layout side is the more impactful of the two (seeks dominate cost); on SSDs only the BootPlan matters.

---

## ReadyDrive

Uses the nonvolatile flash memory built into **Hybrid Hard Drives** (HHD / SSHD) to accelerate boot and hibernation resume.

- Onboard flash typically 50 MB – 512 MB (this is the NAND buffer of the hybrid drive, distinct from the platter storage).
- Contents: hibernation-file regions, boot-critical data, possibly the Boot Configuration Database (BCD).

Data is written to the onboard flash via the **NV Cache feature set** introduced in **ATA-8-ACS**. Relevant commands include:

- `NV Cache Add LBAs to NV Cache Pinned Set`
- `NV Cache Remove from NV Cache Pinned Set`
- `NV Cache Query Misses`

**Current relevance.** ReadyDrive is a Vista/7-era feature. HHDs lost commercially to pure SSDs; you rarely encounter one on modern hardware. Windows still supports the mechanism, but on a machine with a real SSD it does nothing. If you're triaging a modern system, this is the least likely of the four subsystems to be actively in use.

---

## Putting it all together

The four features form a coherent memory-manager cooperation layer:

- **Prefetch** — trace-based: which pages *of a specific process* to warm on cold launch.
- **SuperFetch** — model-based: which *program* is the user about to launch, and preload its pages before the request.
- **ReadyBoot** — trace-based: which pages *of boot itself* to warm during boot.
- **ReadyBoost / ReadyDrive** — capacity extension: give the standby list a spillover tier (external flash or on-drive NAND respectively) beyond what RAM alone can hold.

All four are orchestrated by Sysmain via the same two data sources (`FileInfo.sys` for file events, `NtQuerySystemInformation` for PFN/EPROCESS).

---

## Forensic and detection summary

Execution history from Sysmain artifacts, ordered by reliability:

1. **Internal Prefetch timestamps (last 8 runs)** — most reliable; hard to spoof without full-file rewrite.
2. **`AgAppLaunch.db`** — per-user, timestamped, but format is version-dependent — validate against known-good samples for the target OS build.
3. **Prefetch file `$STANDARD_INFORMATION`** — coarse (first-run + most-recent-run only), easy to timestomp.
4. **`layout.ini` age** — indirect: gives a lower bound on "system has been in use since ~this time."

Anti-forensic and attacker patterns worth watching for:

- Wholesale deletion of `C:\Windows\Prefetch\*.pf` — obvious signal.
- Deletion of *specific* .pf files matching a malware name — subtler; detect by diffing folder contents against process-execution telemetry from another source (EDR, Sysmon 1, 4688).
- Setting `EnablePrefetcher` to 0 in the registry — future-proofs against generation but doesn't erase existing files. A mismatch between the reg value and the timestamps on existing .pf files is itself suspicious.
- SuperFetch/Sysmain service disabled or stopped — expected on server SKUs and some SSD-tuning guides, but on a normal workstation it's an outlier.
- Unexplained `.sfcache` at the root of an internal drive (rather than removable) — implausible for legitimate ReadyBoost and worth investigating.
