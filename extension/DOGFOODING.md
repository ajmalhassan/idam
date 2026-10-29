# Pane UI dogfooding log

Consumer: Idam — New Tab, a Chromium Manifest V3 new-tab extension (formerly Metro Start).

Library: `@pane-ui/react` **0.1.0-alpha.1**, snapshot of the built package in the local `windows-phone-revival/packages/react` checkout. React **19.2.8**. The library repository is [ajmalhassan/pane-ui](https://github.com/ajmalhassan/pane-ui).

Track reproducible library issues in the Pane UI repository. Record reproduction evidence before filing. Keep extension bugs and integration misunderstandings separate; do not treat all unusual behavior as a library bug.

## Confirmed library issues

None confirmed yet.

## Investigation notes

- Standalone package has no Next.js or Tailwind dependency. The consumer can import components and scoped CSS directly.
- Bundle measurement will include React and retained Pane code; repository component budgets externalize React and do not represent total extension size.

## Filing checklist

For each confirmed issue: record component/version, reproduction steps or minimal code, expected/actual result, browser/environment, impact, consumer workaround, and GitHub issue URL. Search existing issues before creating a duplicate. Report behavior based on observations; identify any untested inference.

## Consumer issues encountered and fixed

- **Blank preview:** opening `public/newtab.html` displayed an empty shell because its bundle lives in `dist`. Served the built directory over localhost and opened the live preview. This is our preview setup issue, not Pane.
- **CSS integration mistakes:** our scratchpad and checkbox overrides used incorrect class names. Corrected them against the package's actual `wp-text-area` and `wp-selection` markup; no upstream issue filed.
- **Retry recovery:** the first implementation hid read failures on retry and cleared failed saves when an unrelated write succeeded. Replaced the global retry slot with keyed pending operations and added regression tests.
- **Duplicate task retry:** a failed task submission could leave an older pending creation behind. Keep the creation ID stable and replace the failed draft operation on resubmission.

## Dogfooding results

Pane Theme, TileLink, Button, IconButton, Field, TextField, TextArea, Select, Checkbox, Dialog, and MessageBanner are integrated. Tested tile editing, labeled fields, checkbox updates, initial dialog focus/focus restoration, and reduced-motion settings. The extension renders in Vivaldi 8.2.4133.94 with all resources bundled locally.

Build measurement includes React: approximately 231 KB JavaScript (72 KB gzip) and 34 KB CSS (7.6 KB gzip). The installed extension uses uncompressed files; gzip is a comparison measure.

**No reproducible Pane library defect was confirmed in this pass, so no GitHub issue was created.** Future confirmed defects should be filed in `ajmalhassan/pane-ui` after checking for duplicates.

## 0.2.0 daily-flow pass — 2026-10-29

- Exercised Pane components through optional onboarding, a repeatable setup flow, daily-priority controls, module settings, and an expanded notes Dialog.
- Notes Dialog focuses Scratchpad and restores focus to Open notes on Escape. Buttons, fields, checkboxes and tiles work in the native Vivaldi extension. At a 390px emulated viewport, the home page has no horizontal overflow and remains dark under a light OS preference.
- Consumer issues found and fixed: midnight remount discarded an unsaved priority draft; Personalize lacked the specified setup revisit path; failed note saves needed a reachable retry inside the modal; the in-app preview cached the old bundle, addressed with versioned asset URLs.
- Teal uses consumer CSS token overrides because the package's public accent enum lacks teal. This is customization, not a confirmed library defect.
- Production bundle including React: 242,855 bytes JavaScript (75,736 gzip), 41,332 bytes CSS (8,933 gzip). Installed files are uncompressed.
- No reproducible Pane library defect was confirmed in this pass, so no GitHub issue was filed. The encountered defects were in this extension's code/integration.

## 0.2.1 refactor — 2026-10-29

No new Pane APIs were needed. Shared Theme/brand wrappers and the note autosave hook retain existing integration behavior. Style consolidation was compared against the original cascade at five viewport widths and in setup/dialog states. No reproducible upstream issue was found. A temporary case-only app/App filename collision during extraction was caught by esbuild; the shell is now AppShell.jsx and the build treats casing/undefined-import diagnostics as errors.


## 0.2.3 extension icon fix — 2026-10-30

The installed extension had no icon because only the new-tab HTML favicon was declared. Added the manifest `icons` map and raster PNG exports at 16, 32, 48, and 128px; Chromium does not support SVGs for manifest icons. This is an extension-packaging issue, not a Pane UI defect. The build regression check catches missing declarations, missing files, and mismatched PNG dimensions.


## 0.2.4 overnight greeting — 2026-10-30

The home greeting said good morning at 00:23 because the consumer classified all hours before noon as morning. Morning now begins at 05:00 local time, with evening continuing overnight. Boundary coverage includes the reported time. This was consumer logic; no Pane UI issue was filed.


## 0.3.0 motion pass — 2026-10-30

Used Pane Transition, Stagger and TileSequence for setup turnstiles and the home wave. Initially visible Transition/TileSequence instances intentionally skip entrances, so the consumer changes show from false to true before paint. TileSequence adds layout wrappers: grid spans and tile heights are assigned to those wrappers in consumer CSS. Press transforms remain on the inner tile.

Checked inert exits, rapid navigation, externally cancelled animation recovery, reduced motion, failed writes/retry and settled filtering. No reproducible upstream defect was found; no GitHub issue was filed. Brand docking and the review adapter are application code. The review adapter is bundled separately and uses only memory, with release packaging excluding it.


## 0.3.1 invitation and color preview — 2026-10-30

Retained Pane Button/TextField, Transition, Stagger and TileSequence. Used Stagger's CSS duration variable for the slower cadence, and consumer CSS background transitions with per-tile delays for accent waves. Added magenta and green to the consumer shortcut tone model so all six setup accents survive decoding and stay editable. No reproducible Pane defect was encountered; no upstream issue was filed.


## 0.4.0 compact home — 2026-10-30

Pane TileSequence wrappers inherit a four-column minimum height from `.wp-tile-grid > *`. Changing the consumer grid to compact auto-filled columns without overriding that minimum made square wrappers expand beyond their tracks. Fixed in scoped consumer CSS (`min-height: 0; width: 100%`); this was an integration assumption, not a confirmed library defect. Kept Pane press motion, accessible tile links and edit controls. No upstream issue filed.
