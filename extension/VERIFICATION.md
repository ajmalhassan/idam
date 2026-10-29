# Verification — 2026-10-29, Metro Start 0.2.0

## Automated and browser checks

- Production esbuild build succeeds. All 15 Node tests pass: additive migration, fresh setup, zero shortcuts, safe setup revisit, local date keys, priority carry/completion rules, malformed records, destination validation, and failed-operation recovery.
- Isolated Chromium preview: completed fresh name/accent onboarding with zero shortcuts; set/completed/reopened priority; added/completed/deleted/restored a task; notes survived immediate editor close, reopen, and page reload.
- Simulated clock advance to the next day while editing a priority: draft remained visible, a new-day notice appeared, save created the new day's record and retained the old one.
- Final preview checks also passed for Skip setup (four default shortcuts, no fabricated tasks/notes) and shortcut creation, reorder, edit, and removal.
- Revisited setup from Personalize and added a default shortcut without replacing the saved notes or task. Existing-record preservation is additionally covered by a regression test.
- Injected preview storage write failure: note draft remained visible; after restoring storage, the in-dialog Try again action saved the draft successfully.
- Keyboard input checks: / focuses search; N opens notes; Escape closes it and restores focus to Open notes. Initial dialog focus is Scratchpad.
- 390×844 emulated viewport: document scroll width equals viewport width. Forced light system preference and reduced motion still produce the dark page. Desktop and narrow layouts were visually inspected.

## Native Vivaldi

- Loaded the unpacked build in the existing isolated Vivaldi 8.2.4133.94 test profile. Old shortcuts, task, and note migrated with schema 2 and bypassed onboarding.
- Native chrome.storage.local checks passed for carrying a prior unfinished priority into today, marking it complete, saving an expanded note, and revisiting setup while retaining six existing shortcuts.
- The prior 0.1.0 pass covered native shortcut creation/reorder/edit/removal. Those handlers were extracted with their behavior retained; this pass additionally checks setup-generated shortcut persistence.
- Everyday Vivaldi profile was not changed. Browser preview storage remains separate from extension storage.

## Review and limits

Independent review identified the midnight draft loss and missing setup revisit entry; both were corrected and checked in the browser. No Pane library defect was reproduced. See DOGFOODING.md.

Full screen-reader testing and multiple operating systems are not covered. Simultaneous edits to the same note or record use the latest completed save. Abrupt process termination can lose an edit whose save has not completed. Most form interactions used DOM input/click events; keyboard shortcuts and Escape used browser key input.

Screenshot: screenshots/metro-start-0.2-home.png. Backup: ../.local/archive/releases/metro-start-0.1.0.

## 0.2.1 refactor verification

- `npm run check`: formatting clean, all 16 tests pass. The new build test loads generated asset files and verifies their content fingerprints, manifest version, and unchanged storage permission.
- `npm run package`: production build and ZIP integrity check pass. Preserved the previous package and source under `../.local/archive/releases/metro-start-0.2.0-refactor-baseline`.
- Compared 26 computed CSS properties for 110 home elements at 390, 650, 900, 1440 and 1600px: zero differences. Additional comparisons for settings/notes dialogs, both setup steps, focused search and completed priority also returned zero differences. This checks the sampled states/properties, not every possible browser interaction.
- Extracted autosave hook: immediate-close save and injected-failure retry pass in the isolated preview. Daily priority completion passes. User preview refreshed at version 0.2.1 with existing records retained.
- One fresh reviewer approved the refactor with no material findings and independently checked behavioral tests, asset fingerprints, source equivalence, and manifest permissions. Their browser could not launch alongside the active test profile; browser checks were performed in the main session.
- No new native Vivaldi run was performed for this code-only refactor. The native 0.2.0 tests above still describe that release; the extracted logic remains equivalent, and 0.2.1 browser/package checks are recorded here.
- Screenshot: screenshots/metro-start-0.2.1-home.png. Final bundle: 243,030 bytes JavaScript, 39,381 bytes CSS (75,781 / 8,611 gzip).


## 0.2.2 Idam branding verification

- Renamed the extension wordmark, HTML title, manifest name and release package to Idam. Updated current documentation, the daily-flow mockup, CSS theme header, and native icon-theme names.
- `npm run check` passes: formatting clean and all 16 existing tests pass. `npm run package` rebuilds and validates `idam-new-tab-0.2.2.zip`.
- Both Idam icon packages rebuilt with all ten SVGs validated and existing theme IDs retained.
- In-app browser preview shows IDAM and the title Idam — New Tab at v=0.2.2; all six existing shortcut links remain present after refresh. Screenshot: screenshots/idam-0.2.2-home.png.
- Existing storage keys, CSS selectors, source/install paths and permissions remain unchanged. No additional native Vivaldi installation test was performed for this text-only branding update.
- Planned domain: idam.ajmalhassan.com. No DNS or hosted site was deployed. Historical release archives and verification records retain their original names.


## Pre-Git cleanup

Pre-Git backup paths above refer to this machine’s ignored local archive, not files included in a checkout. Historical screenshots remain alongside this document. The repository keeps the vendored Pane distribution while excluding generated application and icon-theme output.

A fresh temporary checkout containing only Git candidate files passed an offline `npm ci` using the local package cache, `npm run check` (16 tests), and `npm run package`. Both icon themes regenerated from the candidate source. The candidate set includes Pane’s `dist/` and license and excludes dependencies, application bundles, generated icon output, ZIPs and `.local/`. This checks checkout completeness on the current macOS host, not cross-platform installation or a cold network dependency fetch.
