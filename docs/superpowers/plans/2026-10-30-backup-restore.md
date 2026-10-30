# Backup and restore implementation plan

Approved scope: versioned JSON export, strict import validation, a preview and explicit replacement confirmation, and a recovery copy before replacement. No sync, account, merge mode or extra permissions.

Use a focused backup module for format/validation/preview; a guarded storage adapter for cross-tab write coordination and replacement; and a Pane-based Settings section for export, file selection, preview, confirm and recovery download. Preserve the review page's memory-only storage isolation. Use a revision guard so stale tabs cannot write after replacement. Serialize mutation operations with Web Locks where supported; fail closed for restore where coordination is unavailable.

- [x] Test and implement strict versioned backups: round trip, malformed/unsafe/oversized records, duplicate IDs and unsupported versions.
- [x] Test and implement replacement: changed-preview detection, recovery persistence before replacement, failed saves, unrelated-key preservation and stale-tab protection.
- [x] Add Settings controls with accessible status/errors and explicit replacement confirmation. Remount the workspace after restore; stale tabs show a reload prompt.
- [x] Verify browser export/import, cancellation, failures, narrow-screen layout and recovery. Run all checks and package the extension. Document limits.
