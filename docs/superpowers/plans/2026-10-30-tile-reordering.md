# Tile reordering implementation plan

**Goal:** Drag existing shortcut tiles into a new saved order while retaining keyboard/touch move buttons.

**Design:** Use Chromium's native drag-and-drop in edit mode, with a before/after insertion marker and native drag preview. Keep the grid stable during dragging; save only on a valid drop. Mixed small/wide tiles retain their sizes. Clear search before reordering so hidden tiles do not move unexpectedly. Escape/outside drops cancel. No new dependency, permission, folders, or onboarding changes.

**Architecture:** Add an ID-based reorder operation shared by drag and arrow controls. Read current storage at save time, preserve record fields and unrelated data, reject missing source/target, and use the existing save-error/retry path. Keep drag interaction state local to Shortcuts. Touch users retain single-tap arrow controls.

## Steps

- [x] Test before/after moves, bounds/no-ops, filtered IDs, latest fields, missing records, failures and retry in `extension/tests/shortcuts.test.mjs`.
- [x] Implement `reorderShortcut(store, sourceId, {targetId, side}|{delta})` in `extension/src/shortcut-actions.js`; wire through AppShell.
- [x] Add edit-mode drag interaction, insertion feedback, save status and accessibility in Shortcuts and home.css.
- [x] Verify actual Chromium drag, mixed sizes/wrapped rows, cancellation, search, keyboard moves, reload persistence, failed save, external drops and mobile layout in an isolated workspace.
- [x] Update release documentation/version, run full checks, package and review.

## Review focus

No deleted record resurrection; failed saves leave the displayed persisted order intact; dragging never opens a URL/editor; external drags cannot reorder; native drag cancellation clears indicators. Existing cross-tab last-completed-write semantics remain; this does not introduce transactions across ordinary edits.

**Outcome:** v0.6.0 built and packaged; 45 tests pass. Independent review caught and verified the fix for focus loss when storage refresh follows save completion. Backup/restore was committed and pushed separately as `181d024`; this feature remains available for user review.
