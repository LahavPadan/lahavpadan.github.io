## Introduction

An ETW Trace/Logger Session is a global object that allows subscribing (and listening) to events from multiple ETW Providers.

Because Providers and Trace Sessions are global objects shared across all users, they require a Security Descriptor (SD — the standard Windows access-control structure attached to kernel objects) to guard against unauthorized access. (More on the SD in the [Security Descriptor](#security-descriptor) section.)

A Provider can also partition its events into multiple Channels for consumer convenience. The four default channels are **Admin**, **Analytic**, **Debug**, and **Operational**. Each channel gets its own log file under `%systemroot%\System32\winevt\Logs\`.

### Channel semantics

- **Admin** — end-user actionable events (errors a sysadmin can act on). *Enabled by default.*
- **Operational** — routine operational events, security-relevant. *Enabled by default.* Most EDR-interesting (Endpoint Detection and Response) logs live here (`Microsoft-Windows-Sysmon/Operational`, etc.).
- **Analytic** — high-volume diagnostic events. *Disabled by default.* Enable via `wevtutil sl <name> /e:true`.
- **Debug** — developer-level diagnostics. *Disabled by default.*

The default-off state of Analytic/Debug matters defensively: valuable security-relevant events (parts of `Microsoft-Windows-WMI-Activity/Trace`, several PowerShell channels) live in these channels and require explicit enablement.

## Events, Manifests, and Provider Types

Events are structured. A schema must be defined for them, along with which Provider and Channel they belong to. The most common mechanism is a **Manifest file** (XML, `.man` extension), in which additional channels beyond the defaults may also be defined.

Three provider types coexist in modern Windows, with very different visibility from a monitoring or reversing point of view:

1. **Classic (MOF-based)** — inherited from WMI (Windows Management Instrumentation), XP-era. Metadata compiled into MOF (Managed Object Format) files. Deprecated but still present.
2. **Manifest-based** — Vista and later. XML `.man` compiled with `mc.exe`; produces a resource DLL that registers the provider and its events. What most system providers are.
3. **TraceLogging** — Windows 10+. No manifest, no registration in the classical sense — provider metadata is embedded in each event and travels with it. Practical consequences:
   - Cannot be enumerated from the registry.
   - `logman query providers` does not show them until they fire at least one event.
   - Only visible when a session captures them and decodes the event's inline schema.
   - Much of the Windows 10+ Antimalware stack, Defender's own event stream, and newer Sysmon events use TraceLogging.

The Manifest allows Providers and Events to be registered in the system with the event log service, which runs inside `svchost.exe` as `wevtsvc.dll`.

Working with manifests:

- **Command:** `wevtutil.exe el` — list manifests on the system.
- **Command:** `wevtutil.exe gl <MANIFEST_NAME>` — query a specific manifest.
- **Command:** `wevtutil.exe im <MANIFEST_NAME>` — install a manifest.

## Session Mechanics

Sessions are responsible for pulling logs (via a System Thread called the **Logger Thread**). They first stage logs in an in-memory buffer and asynchronously flush to disk (which is why system overhead is minimal). They are also responsible for handing events to Consumers.

### Why the “minimal overhead” claim survives scrutiny

ETW's write path is engineered for millions of events/sec on commodity hardware because of three architectural decisions:

- **Per-CPU buffers.** Each session allocates one buffer per logical CPU. The emitting thread writes into its own CPU's buffer — no cross-CPU contention, no cache-line ping-pong.
- **Lockless write path.** Buffer append uses interlocked operations on the write pointer. Producers never take a spinlock in the common case.
- **Async flush.** The Logger Thread is the only entity draining buffers; emitters never wait on I/O.

An emit costs on the order of a few dozen cycles (filter check + bytewise copy). Disk cost is amortized across every event in a flush cycle.

Sessions can filter to receive only specific events from Providers by defining keywords (via the `MatchAnyKeyword` / `MatchAllKeyword` filter properties, together with a Level cap).

### Filter math (the fast-path arithmetic)

- **Level** — the event carries a severity byte (0–255; typically only 1–5 are used: Critical, Error, Warning, Info, Verbose). Session provides a cap; event passes if `event.level <= session.level`.
- **Keyword** — the event carries a 64-bit bitmask. Session provides two masks:
  - `MatchAnyKeyword`: event passes if `(event.keyword & any) != 0`, or if `any == 0` (session accepts all).
  - `MatchAllKeyword`: event passes if `(event.keyword & all) == all`.
- Both must pass. This is where high-throughput sessions cut noise cheaply — no allocations, no string work, just bitmask arithmetic on the emitter's fast path.

Sessions are also responsible for defining buffer size and overflow behavior — which records get overwritten. E.g., `Circular` mode overwrites the oldest records.

### File modes (chosen at `StartTrace`)

- `EVENT_TRACE_FILE_MODE_SEQUENTIAL` — write until `MaximumFileSize`, then drop new events.
- `EVENT_TRACE_FILE_MODE_CIRCULAR` — circular file buffer.
- `EVENT_TRACE_FILE_MODE_APPEND` — append to an existing file.
- `EVENT_TRACE_FILE_MODE_NEWFILE` — start a new numbered file at max size.
- `EVENT_TRACE_REAL_TIME_MODE` — no file; events delivered directly to a consumer callback. Frequently combined with a file mode for durability.

## Creating and Controlling Sessions

To create a Trace-Session, call `StartTrace` and then `OpenTrace`. The APIs serve similar purposes: `StartTrace` takes an `EVENT_TRACE_PROPERTIES` struct; `OpenTrace` takes an `EVENT_TRACE_LOGFILE`.

The Trace-Session receives events from a Provider via a callback registered in `EVENT_TRACE_LOGFILE->EventRecordCallback`. Each event is represented as an `EVENT_RECORD`.

End users operate on Traces via utilities like `logman.exe` (in ETW jargon, these are **ETW Controllers**). Under the hood, `logman` operates on Traces using `QueryTrace` and `ControlTrace`.

An ETW Trace Session has a unique name and a GUID. Providers have a GUID (and an optional "display name").

- **Command:** `logman query -ets` — show trace sessions on the system.
- **Command:** `logman query "EventLog-Application" -ets` — show which Providers a trace session is listening to (example uses the `EventLog-Application` session).
- **Command:** `logman query providers` — show all Providers registered on the system (append name or GUID to query a specific one).

Reminder: these commands miss [TraceLogging](#events-manifests-and-provider-types) providers that haven't fired any events yet.

## Provider Registration and the Emit Path

The idea is that multiple programs can populate a Provider with events. Using the Provider GUID, programs obtain a handle to the Provider (an object of type `ETW_REG_ENTRY`), which permits them to write events into the Provider.

- User-mode: `EtwEventRegister`.
- Kernel-mode: `EtwRegister`.

On the first call to `EtwRegister`/`EtwEventRegister`, the Provider's underlying object is created as `ETW_GUID_ENTRY`.

**Command:** `logman query providers -pid <PID>` — show Providers a program writes to.

### The complete data path from emit to disk

This is what the `ETW_REG_ENTRY` / `ETW_GUID_ENTRY` machinery actually does:

1. Emitter calls `EventWrite(handle, ...)`.
2. In `ntdll`, `EtwEventWrite` validates and invokes syscall `NtTraceEvent`.
3. Kernel walks the `ETW_GUID_ENTRY` list of sessions subscribed to this provider's GUID.
4. For each subscribed session, apply Level and Keyword filters.
5. If it passes, copy the event bytes into that session's per-CPU buffer for the current CPU.
6. Return to the emitter — the entire call is nonblocking.
7. The Logger Thread eventually drains buffers, writing to `.etl` or invoking the real-time consumer callback (or both).

### Note — Enable Provider

Before a Provider can be started, listened to, etc., it must be Enabled in a Logger Session. "Enabling" is a session calling `EnableTraceEx2` with the provider's GUID and a filter set. Until at least one session enables it, the emitter's `EventWrite` exits early at step 3 — the provider has no subscribers, so the write is a couple-of-nanoseconds no-op. This is the fast-path answer to why having thousands of unsubscribed providers registered on the system costs nothing.

## Regular vs System

Both Sessions and Providers have a Regular/System distinction.

### Note — System Providers

These allow tracing of ALPC, Hypervisor, Scheduler, Syscall, etc. Enabled via the `EnableFlags` field of `EVENT_TRACE_PROPERTIES` passed to `StartTrace`.

Examples of System Sessions: **Global Logger**, **Circular Kernel Context Logger**, **NT Kernel Logger**.

Drivers tend to use Global Logger and NT Kernel Logger.

- **NT Kernel Logger** receives logs from the Executive Kernel (`ntoskrnl.exe`) and important OS drivers.
- **Global Logger** is initialized in the second phase of NT kernel initialization, like AutoLogger. It listens to the same System Providers as NT Kernel Logger, but the difference is that Global Logger begins running first.
- **AutoLogger**, by contrast, is responsible for auto-starting Sessions (and the Providers they use — as long as those Providers are already Enabled on the system) at system boot.

AutoLogger sessions are registered under `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger`. The Providers referenced are not System Trace Providers (this is what separates AutoLogger from Global Logger).

### AutoLogger structure in detail

- Each subkey under `Autologger\` is a session definition, with values like `Start`, `MaxFileSize`, `Guid`, `LogFileMode`.
- Each session subkey has its own child keys, one per provider GUID, holding per-provider `Enabled`, `EnableLevel`, `MatchAnyKeyword`, `MatchAllKeyword`.
- ETW itself starts these sessions during boot, before most services come up — this is what makes AutoLogger the vehicle for early-boot capture (driver load order, BitLocker start events, WinLogon).
- **Attacker relevance:** adding a subkey here injects a rogue provider into a legitimate session, or creates a new persistent autologger session without a Service or Scheduled Task footprint. Changes to `Autologger\` subkeys are worth alerting on.

Unlike regular sessions, System Logger Sessions are limited to a single instance, and always run from system boot (which is why drivers choose them). Additionally, extra Providers cannot be added to them. (Note: there is an inherent limit on the number of user-defined sessions, defined by `HKLM\System\CurrentControlSet\Control\WMI\EtwMaxLoggers`.)

Sessions can also be registered locally within the same process — in which case they are available only to that process, not system-wide. This is the approach the kernel takes for its own private ETW usage. (In this case there is no session-count limit.)

### In-process private sessions in user mode

Modern EDRs and monitoring components use in-process sessions for their own captures. Registered with `EventRegister` and a callback in the same process — no `svchost` involvement, no persistence, no global visibility. This is how the .NET CLR's ETW provider (`Microsoft-Windows-DotNETRuntime`), the AMSI provider, and many WinRT diagnostic events are consumed — by the emitting process itself or a same-user helper. Because they do not appear in `logman query -ets`, the same property cuts both ways: EDRs use in-process sessions to be invisible to attackers, and attackers use in-process sessions to be invisible to EDRs.

## Note: Lost ETW Events

After creating a `UserSession` with `xperf.exe -on Base -start UserSession -on Microsoft-Windows-TCPIP`, then stopping it with `xperf.exe -stop UserSession -stop -d c:\temp\merged.etl`, a warning about the number of lost events sometimes appears.

Mitigations:

- Enlarge the buffer: `xperf.exe -on Base -start UserSession -on Microsoft-Windows-TCPIP -BufferSize 1024`.
- Reduce the number of Providers writing to this trace session.

### Why events are dropped

When a per-CPU buffer fills before the Logger Thread drains it, subsequent emits on that CPU are dropped. The session records the drop count in `EVENT_TRACE_PROPERTIES.EventsLost`. This is a bounded failure — the emitter never blocks — which is a deliberate design choice: ETW would rather drop events than slow the workload.

Additionally, the Logger Thread keeps a backup of events before their transfer, at `%systemroot%\System32\LogFiles\WMI\RtBackup\`. **Real-time traces only.**

### RtBackup detail

- Files are named `EtwRT<SessionName>.etl`.
- A session opened with `EVENT_TRACE_REAL_TIME_MODE` gets a shadow file in RtBackup so that if the real-time consumer detaches or falls behind, events aren't lost outright.
- These files are frequently overlooked forensic targets — they can contain events that a real-time consumer either processed and forgot, or missed entirely.

## Internals: WMI_LOGGER_CONTEXT and ETW_REG_ENTRY

The following internal state is important for DKOM (Direct Kernel Object Manipulation — writing to kernel structures from a privileged context to alter object state without going through the normal APIs) against ETW.

The state of an ETW Trace Session lives in a kernel in-memory structure called `WMI_LOGGER_CONTEXT` (derived from a more basic `WMI_LOGGER_INFORMATION`).

This reveals a tight relationship between WMI and ETW — expanded in the [WMI–ETW Relationship](#bonus-wmietw-relationship) bonus section.

Via `WMI_LOGGER_CONTEXT`, a session's ETW Consumers can be seen as the PIDs of their processes (contrast: for Providers, `logman` shows the PIDs listening to them through sessions).

Additionally, `WMI_LOGGER_CONTEXT` stores flags and the Security Descriptor of the Session — a duplication that can be exploited defensively, since the Security Descriptor also appears in the Registry.

### DKOM angles worth stating explicitly

With a kernel primitive, an attacker can:

- Zero out or replace the SD in `WMI_LOGGER_CONTEXT` to defeat access checks on session control.
- Modify buffer-list pointers to inhibit flush.
- Unlink the session from the ETW subsystem's session list, making it invisible to `logman query -ets`.

Defensive comparison against the registry-stored SD (in `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Security`) catches the first.

To register ETW Providers on the system, `EtwRegister` is used, which returns an `_ETW_REG_ENTRY` structure — somewhat resembling a handle to a registry hive in that it also belongs to the Object Manager and has an associated Security Descriptor.

`_ETW_REG_ENTRY` stores all Sessions that have subscribed to the Provider it represents.

## Note: Registry Locations

In the Registry, one finds:

- Registered Providers: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WINEVT\Publishers\{PROVIDER_GUID}`
- Registered Channels: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WINEVT\Channels`
- Some Trace Sessions are registered under:
  1. `HKLM\SYSTEM\CurrentControlSet\Services\EventLog\<LOGGER_NAME>`
  2. `HKLM\SYSTEM\CurrentControlSet\Control\AutoLogger\<LOGGER_NAME>`

As subkeys, all Providers a trace session listens to are listed.

## Windows Event Log (WinLog) — the Layer Above ETW

Windows Event Log ("WinLog") is often conflated with ETW itself, but the two are distinct layers with a specific relationship:

- ETW is the low-level event streaming infrastructure — providers, sessions, per-CPU buffers, `.etl` files.
- WinLog is a **specialized ETW consumer**, implemented by the Event Log Service (`wevtsvc.dll` in `svchost`), that persists events into `.evtx` files and exposes them to Event Viewer, `wevtutil query-events`, and the EventLog COM API.

Concretely:

- WinLog defines Channels (registered under `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WINEVT\Channels`). Each channel is backed by a persistent ETW session that WinLog owns.
- Providers that want their events to end up in Event Viewer register a channel in their manifest, pointing at a built-in log (Application, System, Security) or a custom channel.
- When such a provider emits, WinLog's session captures the event, and its channel-writer serializes it as an `EVENT_RECORD` into an `.evtx` chunk.
- Consumers reading Event Viewer are reading `.evtx` files, not raw ETW — they are one hop removed from the emitter.

This explains why:

- Not every ETW event appears in Event Viewer (only those routed through a channel).
- `.etl` and `.evtx` files exist side-by-side (different formats for different consumers).
- The evtx-tampering attacks below target the `.evtx` layer, which is downstream of ETW itself.

## Security Descriptor

Format: binary self-relative `SECURITY_DESCRIPTOR` stored as a REG_BINARY.

For both Providers and Trace Sessions, the SD is stored in the same Registry location: `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Security`. A subkey named for the Provider/Trace-Session GUID holds the SD.

### Access masks defined for ETW/WMI objects

- `WMIGUID_QUERY = 0x0001`
- `WMIGUID_SET = 0x0002`
- `WMIGUID_NOTIFICATION = 0x0004`
- `WMIGUID_READ_DESCRIPTION = 0x0008`
- `WMIGUID_EXECUTE = 0x0010`
- `TRACELOG_CREATE_REALTIME = 0x0020`
- `TRACELOG_CREATE_ONDISK = 0x0040`
- `TRACELOG_GUID_ENABLE = 0x0080`
- `TRACELOG_ACCESS_KERNEL_LOGGER = 0x0100`
- `TRACELOG_LOG_EVENT = 0x0200` (kernel-mode write)
- `TRACELOG_ACCESS_REALTIME = 0x0400`
- `TRACELOG_REGISTER_GUIDS = 0x0800`
- `WMIGUID_ALL_ACCESS = 0x0012_0FFF`

The one worth memorizing is `TRACELOG_GUID_ENABLE = 0x80` — the right a session needs to enable a provider. Provider SDs that grant this to `Everyone` are the ones an unprivileged process can subscribe to.

## ETW Threat Intelligence Provider (ETW-TI)

The single most important provider for defensive purposes: `Microsoft-Windows-Threat-Intelligence` (GUID `{f4e1897c-bb5d-5668-f1d8-040f4d8dd344}`), introduced in Windows 10 1809. Fires kernel-mode events for suspicious API activity — remote thread creation, cross-process memory writes/allocations, driver load, image mapping into other processes, and more. This is the primary source most EDRs use for post-execution behavioral detection.

### What makes ETW-TI different from every other provider

- **PPL-gated.** The provider's SD requires the subscribing process to be Protected Process Light (PPL — a lightweight variant of Windows' protected-process signing requirement, blocking non-Antimalware code from opening handles to the subscriber) at antimalware signer level. A regular SYSTEM process cannot subscribe — even with the SD's ACL (Access Control List) permitting it, the ETW subsystem enforces the PPL check separately in the kernel.
- Consequence: an attacker with SYSTEM cannot silence ETW-TI without first defeating the PPL check, which typically requires kernel code execution.
- Vendor EDRs subscribing to ETW-TI must ship a signed PPL binary.

### Attacker patterns targeting ETW-TI specifically

- Bring-your-own-vulnerable-driver (BYOVD) to obtain kernel primitives and either unlink the AV process from the PPL-check path or clear its `_PS_PROTECTION` field long enough to unregister the ETW subscription.
- Direct patch of `EtwWrite` (kernel) or the provider registration entry to skip the emit.
- Because ETW-TI events originate in `ntoskrnl.exe`, patching the emit site requires kernel primitives — user-mode `EtwEventWrite` patches (see [ETW Patching](#1a-etw-patching)) do not blind ETW-TI.

## Bonus: WMI–ETW Relationship

When working with ETW, the concept of WMI reappears repeatedly.

WMI's architecture also uses Providers, and communication with them goes through a COM/DCOM bridge and their Interfaces (in fact, ETW's Event Forwarding — the remote-collection scenario — uses the WinRM protocol).

WMI technology is embedded in every Windows driver.

Every Driver Object *has a slot* for `IRP_MJ_SYSTEM_CONTROL` in its Dispatch Table, which handles WMI IRPs from user mode. Whether a driver actually handles them is optional — a driver that doesn't supply its own `DispatchSystemControl` gets the I/O manager's default, which typically completes the IRP with `STATUS_NOT_SUPPORTED` via `WmiSystemControl`. Drivers that *do* want to be WMI-queryable supply a `DispatchSystemControl` and register their data blocks with `IoWMIRegistrationControl`. Storage, network, and HAL drivers typically do; most others don't.

Additional WMI touchpoints when working on ETW:

- Access-mask names — `WMIGUID_QUERY (0x1)`, `WMIGUID_SET (0x2)`, ..., `WMIGUID_ALL_ACCESS (0x120FFF)`.
- Additional constants — `TRACELOG_GUID_ENABLE (0x80)`, `TRACE_GUID_ACCESS_KERNEL_LOGGER (0x100)`, `TRACELOG_ACCESS_REALTIME (0x400)`.

`WMI_LOGGER_INFORMATION` appears in user-mode documentation as a more limited structure called `EVENT_TRACE_PROPERTIES`.

To serve as Providers, Windows Defender drivers (including the Windows Defender ELAM driver — Early Launch Anti-Malware, a driver class loaded before other boot drivers to protect the boot chain — `WdBoot.sys`) use **WPP Tracing** — designed to ease the developer experience and to work more efficiently than the synchronous `DbgPrint`.

The Windows Internals book claims WPP is built on ETW; Wikipedia claims it's built on WMI Tracing. Resolution: WPP is a source-code-generation macro system whose macros expand at compile time. On modern Windows (Vista onward), the runtime target of those macros is ETW — `WPP_INVOKE_WPP_DEBUG` and its siblings expand into `EtwWrite` calls against a provider whose GUID is embedded in the source, along with a `.tmf` (trace-message format) dictionary emitted for offline decoding. The Wikipedia claim reflects the pre-Vista state where WPP sat on WMI Tracing. Modern WPP is best thought of as "ETW with a friendlier developer syntax and a compile-time trace-message dictionary."

---

## Three examples of undermining log integrity:

### 1. Attacking the Logging Services

#### Attacking the Windows Event Log Service

- In `services.msc`: "Windows Event Log Service".
- In `sc.exe`: `sc queryex eventlog`.
- The process actually runs under `svchost.exe` hosting `wevtsvc.dll`.

Methods:

##### Set Startup Type to Disabled

Logs stop flowing to Windows Event Log.

##### Terminate or suspend `wevtsvc.dll` threads

(requires `THREAD_TERMINATE`/`THREAD_SUSPEND_RESUME` on a handle to the thread).

How to find such threads?

- Method 1: iterate every thread on the system and check which have `wevtsvc.dll` mapped in their process (does not require extensive handle opening).
- Method 2: query WMI, e.g. `wmic /namespace:\\root\cimv2 path Win32_Service Where "Name=eventlog" get ProcessId`.
- Method 3: query SCM, e.g. `sc queryex eventlog`.

##### Hook `wevtsvc.dll`

Windows Event Log Service is not Protected Process Light. Therefore, user-mode programs can hook the service (requires `SeDebugPrivilege`).

The service is responsible for opening Logger Sessions (via `StartTrace` and `OpenTrace`), among other things, for Event Viewer. So a hook can monitor `wevtsvc!EtwEventCallback`, which receives events from every Provider the Trace Sessions listen to.

#### Attacking the Windows Event Collector

Introduction — the Event Forwarding feature allows forwarding logs from endpoints to a central log server (typically the SIEM — Security Information and Event Management platform). Event Forwarding uses the Windows Event Collector Service, which in turn uses WinRM.

- In `services.msc`: "Windows Event Collector".
- In `sc.exe`: `sc queryex wecsvc`.

For it to work, Windows Event Collector must be running on both the Endpoint and the Central Logging Server, and WinRM must be enabled between them.

Methods:

- Block WinRM in the Firewall — e.g. `netsh advfirewall firewall set rule name="Windows Remote Management (HTTP-In)" new enable=no`.
- Prevent forwarding from the Endpoint: an XML subscription defines the events to be forwarded and the target channel on the central server. It can be modified via `wecutil delete-subscription <SUBSCRIPTION_NAME>`.

In the `Microsoft-Windows-Forwarding/Operational` log, error events appear — e.g. Event ID 102.

Note: the Windows Event Collector utility is `wecutil.exe`.

### 1a. ETW Patching

For the last several years, the default anti-forensic technique against user-mode ETW is patching, not service disruption:

- **`EtwEventWrite` patch (userland).** Overwrite the first few bytes of `ntdll!EtwEventWrite` with `ret` (or `xor eax, eax; ret`). All subsequent user-mode ETW emissions from that process no-op — no syscall, no session sees the event.
  - Scope: per-process (the patch lives in that process's ntdll copy).
  - Trivially detected by comparing ntdll's code section to disk, but many defensive stacks don't do this on every write path.
- **`NtTraceEvent` patch.** Same idea one layer down — patches the syscall entry in ntdll. Blocks callers that resolve `EtwEventWrite` dynamically or via `GetProcAddress` alternatives.
- **`EtwWrite` patch (kernel).** With kernel code execution, patches the kernel entry point. The only way to blind kernel providers, [ETW-TI](#etw-threat-intelligence-provider-etw-ti) included.
- **AMSI and CLR-specific variants.** `AmsiScanBuffer` and the CLR's ETW callback are common tributaries — same mechanism, targeted chokepoint.

#### Detection

- Code-integrity comparison of `ntdll` code section against disk.
- Some EDRs precompute known-good hashes for the first N bytes of ETW-relevant functions.
- For kernel-side patches, HVCI (Hypervisor-protected Code Integrity) is the answer — it forbids writable-executable kernel pages and enforces code-only pages as immutable.

### 2. Modifying Existing Logs

Introduction — logs in a Logger Session are stored and flushed to disk as files in a format called `.evtx`. The `.evtx` format is built from a continuous series of Event Records in memory; essentially, each represents one event. Every 64KB in the `.evtx` file is called a **chunk**.

Terminology note: ETW sessions themselves write `.etl` (raw ETW). `.evtx` is Event Log's downstream storage — WinLog's serialization of events it consumed from ETW into its channels. Tampering with `.evtx` affects Event Viewer's view; tampering with `.etl` affects tools like `xperf`/WPA. The techniques below assume `.evtx`.

Tampering targets for `.evtx` files (as files — the Logger case in `eventvwr.msc` — or in their in-memory form) might include changing certain events or hiding certain events. Several structural properties matter:

Records have variable size, so the size is stored in the record header.

- → A prior record can "eat" the next by having a large-enough size field. This effectively deletes the next record from parsers.

Each record has a "number" — its sequence position among the records in the `.evtx`.

- → To hide a record, the numbers of all subsequent records must be adjusted so the sequence remains contiguous.

Checksums are computed over the file header of the `.evtx`, the chunk header, and each event record.

- → After any content change in the `.evtx`, the checksum(s) must be recomputed.

#### Why the chunk concept exists

The chunk-header timestamp is *part* of the reason, but four aligned uses of the same 64KB granularity make chunks worth having:

1. **Time-range indexing.** Each chunk header carries a `FirstEventRecordTimestamp` / `LastEventRecordTimestamp` pair. Queries like "events between T1 and T2" seek chunk-by-chunk without decoding records — a large speedup on multi-GB logs.
2. **Recovery unit.** Each chunk has its own CRC32. A corrupted chunk can be discarded without invalidating the rest of the file — important for a file that is continuously appended to and can be truncated mid-write on a crash.
3. **Write unit.** The Event Log Service flushes at chunk boundaries. The durability granularity matches the recovery granularity.
4. **Template scope.** Chunks carry a private BinXML template table; repeated event structures reference the local template rather than restating the schema per record. Templates are scoped to the chunk, so each chunk is self-decoding.

The chunk is thus the intersection of write unit, recovery unit, time-range index unit, and template scope. The 64KB size is where all four alignments happened to land.

#### Bonus: Record Identifier vs Event ID

Records store a field called Record Identifier, determined by the type of Event — so an attacker doesn't need to update it separately.
In the case of the EventLog service, it's computed from Event ID and Qualifier, both defined in the Provider Manifest the event came from.
In other cases, it comes from the Provider's message DLL, and there is no relationship between it and the Event ID.

#### Bonus: Downsides of this approach

Since the EventLog service continuously uses the `.evtx` files, to avoid synchronization issues, the EventLog service must be stopped first — which itself generates its own event (service state change). The sequence has to be planned around what gets logged before the stop takes effect.

### 3. Attacking the Logger Session

#### Deleting the Trace Session

- Pass `EVENT_TRACE_CONTROL_STOP` to `ControlService` via the `ControlCode` parameter. (Alternatively, `NtTraceControl`.)
- PowerShell: `Stop-EtwTraceSession`.

#### Removing Providers from the Trace Session

- Pass the Provider's GUID to `EnableTraceEx2` via the `ProviderId` parameter, with `ControlCode` `EVENT_CONTROL_CODE_DISABLE_PROVIDER`.
- PowerShell: `Remove-EtwTraceProvider`.

#### Clearing content

Via `wevtutil.exe cl "ChannelName"`, or Event Viewer → right-click on the Channel → "Clear Log".
Generates Event ID 1102 and Event ID 104 in the Security Log — in all cases except the System Event Log.

#### Modifying Logger Session Registry settings

In a Logger Session's Registry key, notable values include:

- `MaxSize`. Setting it to the minimum 1024KB causes logs to be overwritten frequently.
- `Retention` of `0xFFFFFFFF` marks a policy where new logs will not overwrite old logs in the buffer. Effectively, no new logs appear from the moment this policy is set.

The combination of these two settings can be destructive.

Logger Session registry keys can be found at, for example:

1. `HKLM\SYSTEM\CurrentControlSet\Services\EventLog\<LOGGER_NAME>`
2. `HKLM\SYSTEM\CurrentControlSet\Control\AutoLogger\<LOGGER_NAME>`

### 4. Non-Privileged Write to Provider's Message DLL (Privilege Escalation)

To register a Provider on the system, a Message DLL and a Resource DLL must be registered. They appear as `MessageFileName` and `ResourceFileName` in the registry key at `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WINEVT\Publishers`.

Focus: the Message DLL. Its role is to produce the Description string inside the Event. For this it implements a function called `FormatMessage`. (Note: a message file — `.mc` extension — can be turned into a message DLL via the Message Compiler, e.g. `mc.exe`.)

If the DLL has non-privileged write permissions, replacing it yields execution under the context of Event Log (whose privileges — via the DACL — are higher than the writer's).

#### Mechanics

- The Event Log Service (`wevtsvc.dll` inside a shared `svchost.exe`) loads the Message DLL via `LoadLibrary` when it needs to render an event — typically when a consumer (Event Viewer, `wevtutil query-events`, an XML subscription) requests a formatted description.
- The load runs as the `svchost.exe` process principal, which for the `LocalService` service host group is `NT AUTHORITY\LOCAL SERVICE`, and elsewhere may be higher.
- If the attacker can write to the Message DLL's file path but the service host is a stronger principal, this is a classic **write-what-where privilege escalation** via forced load of an attacker-controlled DLL into a higher-privilege process.
- The trigger is trivially reachable: any event query for that provider's events causes the DLL to be loaded and cached.

#### Common vulnerable configurations

- Third-party installers that place message DLLs in world-writable folders (`C:\Program Files (x86)\<vendor>\` with a bad DACL, some `C:\ProgramData\` subfolders).
- Publishers whose `MessageFileName` points to a user-writable path — a manifest bug seen in shipped software.

#### Detection

- Baseline `MessageFileName` and `ResourceFileName` values under `HKLM\...\WINEVT\Publishers`.
- Alert on writes to those paths from non-`SYSTEM`/non-`TrustedInstaller` principals.
- Alert on modifications of the `MessageFileName` value itself — repointing to an attacker path is the same attack class.

---

## Detection Summary

Coverage sources against known tampering, in decreasing order of breadth:

- **Registry write auditing** on:
  - `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Security` (SD changes)
  - `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger` (rogue provider injection)
  - `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WINEVT\Publishers\*\MessageFileName` (Message DLL redirection)
- **Event Log integrity events:** 1102 (Security log cleared), 104 (log cleared for a channel), 6005/6006 (Event Log service start/stop), 7040 (service startup-type change).
- **Code integrity on `ntdll` ETW entry points** for user-mode patch detection.
- **HVCI** to force kernel-level ETW patches to require SMM or firmware compromise.
- **Baseline of active sessions** from `logman query -ets` — sudden disappearance of a session (especially an AutoLogger one) is a signal.
- **Presence and freshness of `.etl` files** in `%systemroot%\System32\LogFiles\WMI\` and `RtBackup\` — an unexpectedly empty RtBackup on a busy system suggests real-time consumer tampering.
- **Comparison of registry-stored SD against in-kernel SD** (in `WMI_LOGGER_CONTEXT`) — catches DKOM zeroing of the in-kernel copy.
