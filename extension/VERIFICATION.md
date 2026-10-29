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


## 0.2.3 extension icons — 2026-10-30

- Root cause: the HTML declared an SVG favicon, but the manifest had no extension `icons` entry. Chromium requires supported raster assets for manifest icons.
- Extended the generated-build regression check; it failed with “Missing 16px extension icon” before the fix.
- Added PNG exports of the existing SVG at 16, 32, 48 and 128px and declared them in the manifest. The page favicon is unchanged.
- Formatting and all 16 tests pass. Rebuilt `dist/` and `idam-new-tab-0.2.3.zip`; verified every manifest icon exists inside the ZIP with matching PNG dimensions. Visually inspected the 128px export.
- The installed everyday Vivaldi profile was not changed. Reload the existing unpacked extension to verify the icon in its management UI.


## 0.2.4 overnight greeting — 2026-10-30

- The previous greeting treated all local hours before noon as morning. Extracted that behavior and reproduced the midnight failure in a regression test before fixing the overnight range.
- Morning now starts at 05:00, afternoon at 12:00, and evening at 18:00 and continues through 04:59. The existing local clock drives the greeting; calendar-day rollover is unchanged.
- Regression cases cover midnight, the reported 00:23 time, 04:59/05:00, 11:59/12:00, 17:59/18:00 and 23:59. Formatting and all 17 tests pass; production build and ZIP integrity checks pass.
- Updated the existing unpacked folder and packaged idam-new-tab-0.2.4.zip. The user's installed Vivaldi instance was not reloaded or modified.


## 0.3.0 onboarding motion — 2026-10-30

- Implemented brand reveal → optional name/accent → shortcut choices → successful save → home. Pane Transition and Stagger handle setup; TileSequence handles the shortcut entrance. Brand docking uses Web Animations and the same four-tile mark.
- `npm run check`: formatting clean, 21 tests pass. `npm run package`: ZIP integrity passes. Version 0.3.0; JavaScript 251,980 bytes (78,594 gzip), CSS 41,405 bytes (9,071 gzip).
- Browser verification in isolated Chromium contexts: name and teal accent retained through Back; five selected shortcuts arrive on home; rapid forward action ignored; outgoing transition is inert; external animation cancellation recovers to ready.
- Skip intro reaches setup without completing it. Skip setup saves defaults. Simulated storage write failure keeps setup and an actionable error visible; retry succeeds after restoring writes. Zero shortcut selections produce a usable empty home.
- Existing completed workspace reloads directly to daily home with no intro. Filtering shortcuts after arrival does not replay their sequence. Review replay leaves localStorage unchanged; production metafile contains no review modules, and ZIP contains no review files.
- Reduced-motion mode reaches ready with no intro and no running animations. At 390px, setup and home have no horizontal overflow and remain dark under a light OS preference. Changing motion preference after starting intro also reaches a settled welcome.
- Visually inspected the reveal at an intermediate frame, logo docking geometry, full home, and the replay flow map. A 300ms animation sample was paused only for inspection; review page runs at normal speed. Screenshot: screenshots/idam-motion-map.png.
- Independent code review found no blocking defects. The full welcome settles around 1.4 seconds rather than the original approximate 1.2-second target; documented as a timing choice for visual review.
- This pass tested the production bundle in Chromium, not a fresh native Vivaldi installation. Existing installed workspace data was not changed. The same unpacked dist folder is rebuilt for the user to reload after review.
