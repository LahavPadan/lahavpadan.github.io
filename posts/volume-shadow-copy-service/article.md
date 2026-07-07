
Shadow Copy (a.k.a. VSS) is a snapshot/backup mechanism. It can be implemented in software or in hardware.
VSS operates at the **raw volume** level — i.e., beneath the filesystem. It stores a temporary snapshot of a volume and exposes it as a *separate* volume that consumers can read.

Example naming: if the original volume is `\Device\HarddiskVolume1\`, the shadow copy will appear as `\Device\HarddiskVolumeShadowCopy{N}\`.

The default provider is *Microsoft Software Shadow Copy Provider 1.0*, implemented in software by `volsnap.sys`. Its catalog files carry the GUID `{3808876b-c176-4e48-b7ae-51abd60b20d5}`.
Commercial providers (e.g., ShadowProtect) also ship as software providers; hardware providers are typically bundled with SAN/array firmware and expose snapshots through the same VSS API.

**Why is that specific GUID on disk?** It is the CLSID of the default provider itself (`MS Software Shadow Copy Provider`, registered under `HKLM\Software\Classes\CLSID\{3808876b-...}`). `volsnap` uses its own CLSID as a namespace prefix for the metadata files it writes, so the on-disk artifact is directly traceable to the provider that produced it. A hardware provider or ShadowProtect would leave a *different* GUID under `System Volume Information`, which is itself a triage signal.

---

## VSS Architecture: Writer / Requester / Provider

The Provider is one of three cooperating roles. Without the other two, a "raw volume snapshot" would not stay consistent with filesystem state:

- **Requester** — the process that *asks* for a snapshot. `vssadmin`, System Restore, Windows Backup, third-party backup agents, `wbadmin`, and ransomware doing `vssadmin delete shadows /all` are all Requesters.
- **Writer** — an in-process component in an application whose on-disk state must be *quiesced* (flushed and made internally consistent) before the snapshot moment. Examples: the NTFS writer, SQL Server writer, Exchange writer, Registry writer, IIS writer. `vssadmin list writers` enumerates them.
- **Provider** — the component that actually creates the snapshot. `volsnap` is the default; hardware providers push the work down to the array.

The snapshot lifecycle from the Provider's point of view is: Requester calls in → VSS service tells each Writer to *freeze* (flush caches, complete open transactions, block new writes) → Provider takes an atomic point-in-time picture → Writers *thaw*. The freeze/thaw window is bounded (~10 seconds by default); if a Writer overruns, the snapshot fails.

Without the Writer step, a raw-volume snapshot would be equivalent to a "crash-consistent" image — you'd catch NTFS mid-transaction, SQL mid-log-flush, etc. The Writer contract is what upgrades VSS from crash-consistent to *application-consistent*.

**Where volsnap sits in the storage stack:** it is a *volume filter driver*, layered above the volume manager but below the filesystem driver stack. That is why "raw volume" is the natural granularity — `volsnap` intercepts `IRP_MJ_WRITE` at the volume level, redirects the *old* contents of any about-to-be-modified block into the diff area, then lets the write proceed. The filesystem never has to know.

---

## The Copy-on-Write Mechanism (the load-bearing idea)

Without this, none of the block types below make sense. VSS on Windows is *copy-on-write with pre-image capture* (a.k.a. "differential copy-on-write"):

- The **live volume stays live**. There is no separate cloned volume anywhere.
- When a snapshot is taken at time T, effectively nothing is copied.
- Later, when a write comes in to block B on the live volume, `volsnap` first reads the *old* contents of B (the pre-image, the state B had at time T) and writes it into the diff area. *Only then* is the new write allowed to hit B on the live volume.
- Reading the shadow copy at any time after T reconstructs the state-at-T like this:
  - If block B has never been modified since T → read directly from the live volume.
  - If block B has been modified since T → read the pre-image from the diff area.

Consequences that fall out of this:

1. **Storage cost scales with churn, not with volume size.** A snapshot of a 1TB idle volume costs almost nothing; a snapshot of the same volume after a 200GB rewrite costs ~200GB.
2. **Snapshots are ephemeral.** The diff area has a bounded MaxSize (`vssadmin list shadowstorage`, `resize shadowstorage`). When it fills, the oldest snapshots are silently deleted. For forensics: the *presence* of many old snapshots implies low churn, and the *absence* of expected snapshots can mean either eviction or attacker deletion — the two are distinguishable via the Volsnap event log (`Microsoft-Windows-Volsnap`).
3. **The reconstruction walk (below) is a merge, not a search.** Each intermediate snapshot only records what changed *between* itself and the next; you need to compose them.

---

## Creating Shadow Copies on the System

`vssadmin` is a built-in utility for managing shadow copies (under `System32`).

System Restore exposes VSS creation to the GUI:

- Running `sysdm.cpl` → *System Protection* tab → pick a volume → *Create*.
- Running `rstrui.exe`.

**Scheduled creation.** A scheduled task drives periodic restore points. In `taskschd.msc`, under `Task Scheduler Library > Microsoft > Windows > SystemRestore`. Triggers can be added for boot, midnight, post–Windows Update, and post-install. Default *conditions*: runs only when the machine is idle; if not idle, deferred.

**Beyond the GUI (worth knowing for automation and for detection):**

- `wmic shadowcopy call create Volume='C:\'` and the WMI class `Win32_ShadowCopy` (deprecated for `wmic.exe`, still queryable via `Get-CimInstance Win32_ShadowCopy` in PowerShell). *Attacker relevance:* the same class exposes a `Delete()` method, which is one of the standard ransomware wipes.
- `checkpoint-computer -Description ...` (PowerShell) — the scripted equivalent of the *Create* button.
- The `IVssBackupComponents` COM interface — what real backup products actually call.

**Diff-area sizing.** `vssadmin resize shadowstorage /For=C: /On=C: /MaxSize=10%`. The default cap is around 10% of the volume, which puts a hard ceiling on how far back in time you can recover. For an active workstation this frequently means "yesterday, maybe."

---

## Bonus: Previous Versions

Given System Restore, right-click a file → *Properties* → *Previous Versions* tab → older versions appear.

Two sources feed this tab, and they are not equivalent:

- **VSS-backed previous versions** — the shell is literally opening the file inside a shadow copy and listing the resulting mtime/size. There is no separate storage; the "Previous Versions" list is a *view* over the shadow-copy chain.
- **File History–backed previous versions** — an entirely separate mechanism. Given a set of watched folders and an external drive, on every change to a file a copy is written to the external drive. The mechanism uses the NTFS **USN Journal** (`$UsnJrnl:$J`) as its change-detection primitive — it doesn't need to poll or scan; it consumes journal records and reacts to `FILE_CREATE`, `DATA_OVERWRITE`, `DATA_EXTEND`, `RENAME_NEW_NAME`, etc.

The tab merges both silently, which is why a file with no shadow-copy history can still show old versions if File History is active.

---

## Where Shadow Copy is Stored on Disk

### Terminology

Each snapshot is stored as a **Store**. The management structure over stores is the **Catalog**.

### The on-disk files

On the volume that holds the shadow copy (the backup of one volume may live on another volume), several management files exist:

- **Header** — at fixed offset `0x1e00` from the start of the volume.

  **Why 0x1e00?** `0x1e00 = 7680 bytes = sector 15` (assuming 512-byte sectors). NTFS's boot sector lives at sector 0, its backup at the last sector of the volume, and sectors 1–15 are reserved as boot code / bootstrap loader area. `volsnap` sits its header in the last reserved sector *before* the filesystem's own data area begins, which is why the offset is filesystem-agnostic and stable regardless of NTFS cluster size. On a 4Kn-formatted volume the effective offset can shift because "sector 15" is a different byte offset; the constant `0x1e00` assumes 512-byte logical sectors.

- **Catalog and Store metadata files** — represent the disk regions allocated to VSS *as files*. On the filesystem, these live under the `System Volume Information` directory at the root of any Windows-formatted volume.

  The Catalog points to the Store by storing offsets to **Block Range** and **Block List** structures that represent the Store. The Block Range holds the actual copied data plus its own management structures; the Block List is the index that tells you which live-volume address maps to which offset within the Block Range.

  Catalogs are stored as a **linked list** — each Catalog record stores the on-disk offset of the next Catalog.

  *File naming convention:* under the default provider, the catalog file's name is a GUID starting with `3808876b`; each store's file name concatenates a second GUID onto the catalog GUID, so it looks like `{3808876b-…}{STOREGUID}`. The nested-GUID pattern is a direct disambiguator when triaging `System Volume Information` — anything with the `3808876b` prefix is `volsnap`; anything else is a different provider (ShadowProtect, hardware provider, image backup writer, etc.).

---

## Restoring a Volume Using Shadow Copy

You walk the Stores **newest to oldest** (i.e., from the newest snapshot toward the oldest).

**Why?** Because VSS is differential: if nothing changed between snapshots N and N+1, snapshot N+1 doesn't re-store the data — it stores a *reference* back to snapshot N. Each such reference is encoded as a **Forwarder block** inside a Block List.

Simultaneously, an **overwrite rule** applies between blocks: if two "regular" blocks point at the same live-volume address (blocks cover data in 16KB-aligned chunks), the data in the *newer* block (belonging to the newer Store) overwrites the data in the older block during reconstruction.

**Why 16KB?** This is the internal allocation unit of the diff area. It is a compromise: too small and the block-list index balloons; too large and every small write on the live volume triggers a large pre-image copy (write amplification). 16KB is 4× the default NTFS cluster (4KB), so a typical single-cluster write invalidates one-quarter of a diff block, which is why the Overlay-block mechanism exists (see below).

The two rules together give you a simple reconstruction algorithm: walk the Stores newest-to-oldest; for each live-volume address, the first Store to give you a real (non-forwarder) block wins; forwarders defer the answer to an older Store; the catalog-level bitmap is the final fallback.

---

## Block Types in the Block List

- **Regular block** — a mapping-table entry from live-volume addresses (in 16KB units) to snapshot data — i.e., an offset within the corresponding Block Range.
  *Original data block = address on live volume; Relative data block = offset within the Block Range.*
  Highest priority of all block types.

- **Forwarder block** — redirects a newer snapshot to data held in an older snapshot. I.e., redirects a newer Store to data in an older Store.
  *Original data block = address on live volume; Relative data block = two offsets, one within the older Store's Block Range and one within the newer Store's.*
  Lowest priority of all block types. (Rationale: if any *real* block exists for this address at any newer level, use it; the forwarder is only meaningful when nothing more direct is found.)

- **Overlay block** — an exception to the overwrite rule. Multiple Overlay blocks can be *added on top of* an existing Regular block. Using them, you can record data changes smaller than 16KB.

  They define a **Bitmap** field marking a contiguous range of addresses as "zeroed by the volume." Each bit represents 256 bytes; the bitmap is 32 bits wide → the bitmap covers `32 × 256 = 8192 bytes = 8KB = half a 16KB block`.
  *Original data block = address on live volume; Relative data block = offset within the Block Range.*
  Priority equal to a Regular block — highest.

  **Why the bitmap covers exactly half a block.** The most consistent reading of the format is that an Overlay block is structurally *half-sized*: it carries up to 8KB of payload plus a 32-bit bitmap of which 256-byte sub-segments of that 8KB are actually valid. To fully re-cover a 16KB range with sub-block granularity, you would use *two* Overlay blocks, one for each half. This is what lets `volsnap` capture, say, a 4KB single-cluster overwrite (one Overlay block, 16 bits of the bitmap set) without the write-amplification cost of pre-imaging the full 16KB. The alternative reading — that the block is 16KB but only half is bitmap-indexed — is inconsistent with the "each bit represents 256 bytes" statement given a 32-bit width, so the half-block interpretation is the one that arithmetic supports.

- **Catalog-level bitmap.** In addition to the per-Overlay bitmap, each Store's Catalog defines a Store-wide bitmap with the same semantics (each bit tracks a region of the live volume).
  It has the *lowest* priority in the mechanism. That is, in the absence of any block describing a given live-volume address, we consult this bitmap, where each bit represents one block.

  **Why the Catalog also stores the offset to the previous Store's bitmap.** This is the reconstruction algorithm's "have we already answered this?" lookup. When walking newest-to-oldest, before descending into an older Store's Block List, the algorithm consults the current Store's bitmap to know which regions have already been resolved (either by copy-on-write in this Store or by earlier walks) and which regions still need answering. Storing the offset to the *previous* Store's bitmap chains these together — it's the same linked-list-of-stores pattern applied to the fallback path, so the walk can stop as soon as a bit is set in any earlier bitmap. Without this chain, the fallback would require re-parsing every earlier Store's Catalog on every miss.

---

## What Can Be Extracted for Investigation

- Old (possibly malicious) files that were deleted from the live volume but still exist in a shadow copy.
- Modified files (possibly maliciously) can be diffed against an older version present in a VSS. Timeline reconstruction is often more useful than any single file: the sequence of shadow copies gives you a coarse temporal grid of "what did this filesystem look like at these points."
- **SYSTEM-only files.** Files that are exclusively locked or ACL-restricted to `SYSTEM` at runtime (`SAM`, `SYSTEM`, `SECURITY` hives; `ntds.dit` on a DC; open Outlook `.ost` files) are readable inside a shadow copy because the shadow copy is a static point-in-time snapshot with no exclusive lock. This is the mechanism behind the classic "shadow copy the `SAM` hive to offline-crack the local admin" workflow — attackers use it, defenders use it for triage.
- **VSS deletion is itself a detection signal.** Common ransomware/wiper patterns: `vssadmin delete shadows /all /quiet`, `wmic shadowcopy delete`, `Get-WmiObject Win32_ShadowCopy | Remove-WmiObject`, `wbadmin delete catalog -quiet`, `bcdedit /set {default} recoveryenabled No`. Detection sources: 4104 (script block), 4688 with the CLI, `Microsoft-Windows-Volsnap/Operational` event ID 25 (shadow copy deleted), and the sudden step-change in `Win32_ShadowCopy` count.

---

## Parsing

- **libvshadow / vshadowmount** (Joachim Metz, libyal). The reference open-source implementation of the on-disk format. `vshadowinfo` lists snapshots; `vshadowmount` FUSE-mounts a raw image and exposes each snapshot as a separate device you can then loop-mount as NTFS. Also the *de facto* documentation for the format — the specification PDF in that repo is the closest thing to a public spec of the structures described above.
- **ShadowExplorer** — GUI browser over shadow copies on a live Windows system.
- **Live mount via junction**: `mklink /d C:\vss1 \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\` gives a directory that transparently exposes the shadow. Useful for triage; also, notably, a technique attackers use for post-exploitation reads (e.g., of the SAM).
- **KAPE**, **Autopsy + Sleuth Kit**, **VSS-Carver** for automated collection and carving out of unallocated/partial Store fragments.
- Volatility does *not* parse on-disk VSS but does surface `volsnap`-related driver state and the diff-area pointers in memory, which can help confirm that a suspected-deleted snapshot was in fact deleted rather than never created.

---

# `mstsc` / RDP Bitmap Cache

When `mstsc.exe` (or any RDP client) runs, a client-side bitmap cache is written to disk. Location:

```
%localappdata%\Microsoft\Terminal Server Client\Cache\
```

## What it contains

Binary files storing 64×64-pixel tiles. The tiles are cached fragments of what the remote screen was displaying, kept locally so the server doesn't have to retransmit unchanged regions of the display each frame. This is the "persistent bitmap cache" negotiated at RDP connection setup (part of the RDP Bitmap Cache capability set).

Two file families are typically present:

- `bcache*.bmc` — the *persistent* cache. Each file is a stream of records, each record roughly `{key1, key2, width, height, bpp, tile bytes...}`. The 64-bit key is what the RDP server used to reference the tile in cache-hit messages.
- `Cache*.bin` — per-session working cache. Same tile format, shorter lifetime.

**Why 64×64.** The cache is a compromise between per-tile overhead (each cached tile carries an 8-byte key and small header) and the granularity at which the server can reference "reuse this region." 64×64 is the historical MS-RDPBCGR default for the small-tile persistent cache; larger cache cells (256×256) exist but are for the "bitmap cache rev 2" cell and are not typically what these files hold.

## How to reassemble

At the tile level, use `bmc-tools` (ANSSI) or `RDP-Cached-Bitmap-Extractor` — both walk the record stream and emit each 64×64 tile as a PNG.

The hard part isn't the tile extraction; it's the two reconstructions the tiles do *not* natively encode:

1. **Spatial reconstruction (e.g. → 1920×1080).** The tiles do not carry `(x, y)` screen coordinates. The server references them by cache key, and where they get *drawn* is determined by MemBlt orders that are not persisted on the client. So on-disk, you have a bag of tiles with no layout. Reassembly is manual: cluster visually similar tiles, look for tiles containing text baselines that align, and jigsaw them together. `bmc-tools` outputs them in file order, which is *approximately* temporal but not spatial. This is why RDP cache reconstruction produces "collages" of session content, not screenshots.
2. **Temporal reconstruction (which screen came before which).** The record ordering *within* a cache file is chronological (append-only), but tiles get overwritten when the cache LRU-evicts. There is no wall-clock timestamp per tile. What you can use: file `mtime` per cache file, ordering of records within each file, and — for `bcache*.bmc` — the fact that different sessions to different servers tend to open different cache files. Cross-referencing with the RDP client event log (`Microsoft-Windows-TerminalServices-RDPClient/Operational`, event 1024 — connection attempts) usually lets you map cache-file mtime ranges to specific `hostname:port` sessions.

## Why this matters (defender's view)

The persistent bitmap cache captures *what the operator saw* during an outbound RDP session from this machine. If an attacker used this workstation as a jump host, the cache may contain fragments of the target machine's desktop — credentials in Notepad, terminal windows, SharePoint pages, whatever they touched. In many intrusions this is the only forensic trace of *what was done on the remote box* that survives on the source box, because the source machine holds no logs from the destination. The cache is also enabled by default and requires GPO (`Do not allow drive redirection` and related Terminal Services policies) plus a specific `Bitmap caching` toggle in mstsc to disable, so on unmanaged endpoints it is essentially always present.
