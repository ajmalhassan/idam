# Idam — New Tab

<img src="public/icon.svg" alt="Idam home logo" width="64" height="64" />

A dark new-tab extension with colorful tiles for Chromium browsers, including Vivaldi, built with the standalone Pane UI React package. Optional onboarding, a daily priority, editable shortcut tiles, tasks with undo, expandable notes, clock, web search, and accent settings. No backend or account.

## Preview

Open **http://127.0.0.1:8765/newtab.html** while the preview server is running. Do not open `public/newtab.html`: it is an input template and has no built JavaScript beside it.

To restart the preview from this directory:

```sh
npm ci
npm run build
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Preview data uses browser localStorage. The installed extension uses `chrome.storage.local`; the two workspaces are separate.

## Beta polish (0.6.1)

Creating a task now keeps keyboard focus in the task input. Shortcut fields lock while a save is pending. The blue accent and daily-priority placeholder have stronger text contrast. Personalize explains automatic favicon lookups. No permissions or runtime dependencies were added.

The [beta kit](../docs/beta/README.md) includes installation/update instructions, privacy details, a seven-day test plan, release evidence and store copy. The [local landing page](../site/README.md) has the beta download and install guide.

## Reorder your places (0.6.0)

Choose **edit tiles**, then drag a tile onto the left or right half of another tile to place it before or after that tile. A white insertion line shows the destination. Drop to save; Escape or dropping outside the tiles cancels. Small and wide tiles keep their sizes.

The arrow buttons provide the same ordering controls with a keyboard or touch. Clear the search field before reordering. Failed saves leave the saved order intact and offer **Try again**. Dragging uses the browser's native desktop interaction; touch users can use the arrow buttons.

## Compact home (0.4.0)

The greeting and priority card use less vertical space, with tasks and notes beside your places. Small square tiles center the website favicon; names appear on hover and keyboard focus and remain available to screen readers. Wide tiles retain visible names. Existing shortcut records and sizes are preserved. Edit tiles reveals spacious editing/reordering controls. Longer task lists scroll inside their panel; notes open in the full editor.

The default desktop layout was checked at 1280×720 with four tasks: priority, shortcuts, tasks and notes fit in the viewport. Smaller windows stack sections and can scroll. Reload the unpacked extension for the updated UI and its `favicon` permission.

## Welcome and motion (0.3.2)

First run: a single triangular roof and two square tiles assemble into Idam, then a Begin button waits for you. Begin docks the brand and opens a large, centered name prompt. Continue opens familiar places with six accent choices: a staggered color wave previews your choice on the tiles. Newly added places keep that color on home; existing places retain their own colors. Back preserves your choices. Skip animation jumps to Begin; Skip setup saves your current choices. Returning tabs use a shorter entrance. Reduced motion removes movement while preserving the Begin step.

For a repeatable review, open **http://127.0.0.1:8765/review/index.html**. The page maps the flow and offers **Replay welcome** and **Everyday entrance**. It uses temporary memory data, independently of the normal preview and installed extension. Review files are excluded from the release ZIP.

## Install in Vivaldi

1. Disable Momentum in `vivaldi://extensions` so it does not compete for the new-tab page.
2. Enable **Developer mode** on that page.
3. Choose **Load unpacked** and select the `extension/dist` folder in your checkout.
4. In **Settings → Tabs → New Tab Page**, choose the extension-controlled start page (the label can appear as **Controlled by Extension**).
5. Open a new tab.

Alternatively, extract `idam-new-tab-0.6.1.zip` into a permanent folder and load that folder. Keep the folder in place. After rebuilding, click Reload on the Idam — New Tab card in `vivaldi://extensions` and reopen the tab.

To return to Momentum, disable Idam — New Tab and enable Momentum again.

## Overnight greeting (0.2.4)

Greetings follow the device’s local clock: morning from 05:00, afternoon from 12:00, and evening from 18:00 through 04:59. Midnight still starts a new calendar day for the daily priority.

## Extension icons (0.2.3)

The manifest now includes 16, 32, 48, and 128px PNG icons for installation and extension management. They are raster exports of `public/icon.svg`, which remains the page favicon. To update an existing unpacked installation, reload Idam in `vivaldi://extensions`; keep the same folder to retain its data.

## Branding update (0.2.2)

Metro Start is now **Idam — New Tab**, paired with **Idam for Vivaldi**. Built by Ajmal Hassan with Pane UI. The project website and privacy policy are live at https://idam.ajmalhassan.com/.

Keep using the existing unpacked extension folder when upgrading. Storage keys (`metro.v1.*` and the browser-preview key `metro-start-preview-v1`) remain unchanged to preserve saved work. Internal Metro CSS names and historical release archives remain compatible.

## Daily flow (0.2.0)

Fresh installs offer an optional name, accent, and shortcut selection. Skip goes straight home; selecting zero shortcuts is supported. Existing workspaces bypass setup and retain their saved records. **Personalize → Revisit setup** opens both steps again; existing shortcuts are retained, and missing selected defaults are added.

Set one daily priority, then mark it complete when you are done. The next local calendar day offers to carry the most recent unfinished priority or choose something new. Tasks and notes persist across days. A priority draft being edited at midnight stays on screen and can be saved for the new day.

Type in search to filter your saved places. Activate **Search web** (or press Enter) to search with your selected provider. Press **/** to focus search and **N** to expand notes when focus is outside a control. Escape closes dialogs. Personalize can hide tasks or notes without deleting their content.

To upgrade a loaded unpacked installation, keep the same extension folder, rebuild or replace its files, then reload its card in `vivaldi://extensions`. Pre-Git source backups are kept locally under `.local/archive/releases/` at the repository root; they are not required to build.

## Usage and storage

- Add shortcuts with a name and HTTP(S) URL. **Edit tiles** exposes editing and earlier/later controls.
- Complete tasks with their checkbox. Use the pencil to edit a task inline; Enter/checkmark saves and Escape/cross cancels. Empty edits are blocked, and failed saves retain the draft for retry. Editing preserves completion and creation time. Deleting a task provides Undo for the latest deletion in that tab.
- Notes save after a short pause and on blur. Check the save status before closing the tab; failed saves retain the draft and offer retry in the notes editor and home banner. Abrupt browser/process termination can lose an edit that has not yet saved.
- Settings changes, notes, and edits to the same record use the latest completed save across tabs. Separate task and shortcut records do not replace the whole workspace.
- Your workspace records are stored locally in the browser profile. This version has no cloud sync; use backup export/import to move or recover your workspace. Uninstalling the extension clears its local data.

Permissions remain `storage` and `favicon`; no access to all websites is requested. Icons use this sequence, with a three-second deadline per source:

1. The saved site's `/favicon.ico`.
2. Google's favicon lookup using `domain_url` (the scheme + origin, not the `domain` parameter), then Favicon.im's dedicated resolver (`throw-error-on-404=true`) on load failure/timeout. These services cover icons declared at other paths or on CDNs without site-specific code.
3. Chromium's local favicon endpoint in the installed extension (unavailable in the web preview).
4. Initials if every image fails to load.

External lookup services receive **only the hostname/origin**, never the saved path, query, fragment or a referrer. IP addresses, single-label hosts, and common local/reserved suffixes bypass public services. This is a syntactic check, not DNS resolution: a private service using a public-looking DNS name can still be sent to a provider. Successful lookups are reused in memory for an hour; total failures for one minute; concurrent requests for the same origin are shared. Browser HTTP caching also applies. No shortcut/task/note data is changed by icon lookup.

Provider coverage and freshness are not guaranteed: Google and Chromium can return a generic placeholder as a valid image, which cannot reliably be distinguished from a real icon through a cross-origin image element. Idam does not scrape authenticated pages, execute site scripts, or guarantee per-page icons for different apps on one origin. Favicon.im has a documented public API with rate limits; Google’s endpoint is an undocumented dependency. Both are external services without an uptime guarantee for this app. No remote scripts, remote fonts or background worker are used. Search and shortcut links navigate only when activated.

Research: [Chromium's favicon endpoint](https://developer.chrome.com/docs/extensions/how-to/ui/favicons), [HTML icon declarations](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel#icon), [Favicon.im's API and missing-icon option](https://favicon.im/), and [ArchiveBox's use of Google's favicon lookup](https://docs.archivebox.io/en/master/Configuration.html#save-favicon).


## Backup and restore (0.5.0)

Open **Personalize → backup & restore**:

- **Export backup** downloads a versioned JSON file containing saved settings, places, tasks, notes and all daily priorities. Unsaved drafts, favicon images and recovery copies are not included. No account, network upload or extra permission is needed.
- **Choose backup** validates the entire file before showing counts, date and the current workspace summary. Nothing changes until you acknowledge replacement and click **Replace workspace**. Import replaces rather than merges, and returns you to home.
- Idam saves one local recovery copy before replacement. **Export recovery copy** downloads it; select that file to preview and restore the previous workspace. A later restore replaces the local recovery copy. Keep an exported copy elsewhere: uninstalling Idam or losing the browser profile removes local recovery too.
- Files are readable, unencrypted JSON. Keep them private. Format version 1 and a 2 MB file limit are supported. Invalid fields, duplicate IDs, unsafe shortcut URLs and unsupported versions are rejected as a whole.
- If your saved workspace changes after preview, restore stops and asks you to select the file again. Other open Idam tabs show a reload prompt and cannot write old edits over the new workspace. Unsaved edits are discarded during replacement; save work first.

Restore coordinates writes through Web Locks in installed Chromium extensions and localhost previews. File-based/insecure previews without this API can export but cannot restore. Recovery is saved first, then the replacement uses one bulk storage write; Idam never clears storage before saving. Storage quota errors abort the operation, and the previous copy remains available if the replacement write fails. Old record keys are retained as null tombstones until reused; they are ignored by the UI and not exported. This is an application-level recovery mechanism, not a guarantee against disk failure or writes from older Idam versions that lack the guard.

The review page uses only temporary memory: exports contain review data, imports affect that review session, and a reload discards that session. It cannot restore your installed workspace.

Implementation references: [Chromium storage](https://developer.chrome.com/docs/extensions/reference/api/storage) and [Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API).

## Development

```sh
npm ci
npm run format       # format maintained source, tests and build scripts
npm run check        # formatting plus behavioral and generated-build tests
npm run build        # load-unpacked output in dist/
npm run package      # build and validate the versioned ZIP (requires zip/unzip)
```

`package.json` is the single release-version source. The build supplies the manifest version and fingerprints JS/CSS references from their contents; do not edit generated `dist` files or cache strings manually. Build tests rebuild `dist` as part of verification.

Source map:

- `src/app.jsx`: bootstrap and global stylesheet imports.
- `src/AppShell.jsx`: home composition and screen/dialog navigation.
- `src/MetroTheme.jsx`, `src/Brand.jsx`: shared presentation for home and onboarding.
- `src/Priority.jsx`, `src/priority.js`: priority UI and pure calendar/record rules.
- `src/Notes.jsx`, `src/useNoteDraft.js`: notes UI and autosave lifecycle.
- `src/model.js`, `src/lifecycle.js`: validated records, defaults, setup and migration.
- `src/storage.js`, `src/useWorkspace.js`, `src/operations.js`: storage adapters, subscription, and keyed retry handling.
- Other named components own their corresponding screen section or dialog; `src/app.css` holds the consolidated styles and responsive rules.

The 0.2.1 refactor retains 0.2.0 behavior and storage keys. Its baseline source and package are preserved in the ignored local archive.


The vendored `@pane-ui/react` 0.1.0-alpha.1 distribution is included for reproducible standalone builds; see [provenance](vendor/README.md). React and esbuild versions are pinned in `package-lock.json`. Pane's license is included in the package and build. Pane needs neither Next.js nor Tailwind here.

See [DOGFOODING.md](DOGFOODING.md) for encountered issues and [VERIFICATION.md](VERIFICATION.md) for checks and limits.


## Repeatable beta checks

After `npm ci` and `npm run build`, install the test browser once with `npx playwright install chromium`, then run `npm run check:browser`. It creates a fresh temporary browser profile, loads the actual unpacked extension, and checks onboarding, keyboard task entry, slow-save field locking, offline persistence, native new-tab override, backup/recovery, stale tabs, reordering and native favicon fallback. It does not use your everyday profile. Reports go to the ignored `.local/beta/` directory in the repository root.

Use `-- --baseline /absolute/path/to/previous/dist` to test a same-path extension update; use `-- --capture` to refresh fictional-data screenshots in `site/assets`. `IDAM_BROWSER_EXECUTABLE` can select a compatible installed executable such as Google Chrome. Vivaldi requires the separate native procedure recorded in the beta kit; this generic Playwright harness is not its verification procedure.

`npm run capture:promo` renders the approved brand graphics. After reviewing screenshots and running `npm run package`, `npm run prepare:beta` validates versions/images and assembles the ignored `releases/idam-beta-<version>/` folder and ZIP, including the static site, tested extension, guide and store images. It also supplies the site's stable download ZIP. These commands prepare local artifacts; they do not publish or contact testers.
