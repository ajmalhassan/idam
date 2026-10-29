# Idam — New Tab

A dark Metro-inspired new-tab extension for Chromium browsers, including Vivaldi, built with the standalone Pane UI React package. Optional onboarding, a daily priority, editable shortcut tiles, tasks with undo, expandable notes, clock, web search, and accent settings. No backend or account.

## Preview

Open **http://127.0.0.1:8765/newtab.html** while the preview server is running. Do not open `public/newtab.html`: it is an input template and has no built JavaScript beside it.

To restart the preview from this directory:

```sh
npm ci
npm run build
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Preview data uses browser localStorage. The installed extension uses `chrome.storage.local`; the two workspaces are separate.

## Welcome and motion (0.3.2)

First run: four tiles assemble into Idam, then a Begin button waits for you. Begin docks the brand and opens a large, centered name prompt. Continue opens familiar places with six accent choices: a staggered color wave previews your choice on the tiles. Newly added places keep that color on home; existing places retain their own colors. Back preserves your choices. Skip animation jumps to Begin; Skip setup saves your current choices. Returning tabs use a shorter entrance. Reduced motion removes movement while preserving the Begin step.

For a repeatable review, open **http://127.0.0.1:8765/review/index.html**. The page maps the flow and offers **Replay welcome** and **Everyday entrance**. It uses temporary memory data, independently of the normal preview and installed extension. Review files are excluded from the release ZIP.

## Install in Vivaldi

1. Disable Momentum in `vivaldi://extensions` so it does not compete for the new-tab page.
2. Enable **Developer mode** on that page.
3. Choose **Load unpacked** and select the `extension/dist` folder in your checkout.
4. In **Settings → Tabs → New Tab Page**, choose the extension-controlled start page (the label can appear as **Controlled by Extension**).
5. Open a new tab.

Alternatively, extract `idam-new-tab-0.3.2.zip` into a permanent folder and load that folder. Keep the folder in place. After rebuilding, click Reload on the Idam — New Tab card in `vivaldi://extensions` and reopen the tab.

To return to Momentum, disable Idam — New Tab and enable Momentum again.

## Overnight greeting (0.2.4)

Greetings follow the device’s local clock: morning from 05:00, afternoon from 12:00, and evening from 18:00 through 04:59. Midnight still starts a new calendar day for the daily priority.

## Extension icons (0.2.3)

The manifest now includes 16, 32, 48, and 128px PNG icons for installation and extension management. They are raster exports of `public/icon.svg`, which remains the page favicon. To update an existing unpacked installation, reload Idam in `vivaldi://extensions`; keep the same folder to retain its data.

## Branding update (0.2.2)

Metro Start is now **Idam — New Tab**, paired with **Idam for Vivaldi**. Built by Ajmal Hassan with Pane UI. The planned project address is `idam.ajmalhassan.com`; this local rename does not publish a website.

Keep using the existing unpacked extension folder when upgrading. Storage keys (`metro.v1.*` and the browser-preview key `metro-start-preview-v1`) remain unchanged to preserve saved work. Internal Metro CSS names and historical release archives remain compatible.

## Daily flow (0.2.0)

Fresh installs offer an optional name, accent, and shortcut selection. Skip goes straight home; selecting zero shortcuts is supported. Existing workspaces bypass setup and retain their saved records. **Personalize → Revisit setup** opens both steps again; existing shortcuts are retained, and missing selected defaults are added.

Set one daily priority, then mark it complete when you are done. The next local calendar day offers to carry the most recent unfinished priority or choose something new. Tasks and notes persist across days. A priority draft being edited at midnight stays on screen and can be saved for the new day.

Type in search to filter your saved places. Activate **Search web** (or press Enter) to search with your selected provider. Press **/** to focus search and **N** to expand notes when focus is outside a control. Escape closes dialogs. Personalize can hide tasks or notes without deleting their content.

To upgrade a loaded unpacked installation, keep the same extension folder, rebuild or replace its files, then reload its card in `vivaldi://extensions`. Pre-Git source backups are kept locally under `.local/archive/releases/` at the repository root; they are not required to build.

## Usage and storage

- Add shortcuts with a name and HTTP(S) URL. **Edit tiles** exposes editing and earlier/later controls.
- Complete tasks with their checkbox. Deleting a task provides Undo for the latest deletion in that tab.
- Notes save after a short pause and on blur. Check the save status before closing the tab; failed saves retain the draft and offer retry in the notes editor and home banner. Abrupt browser/process termination can lose an edit that has not yet saved.
- Settings changes, notes, and edits to the same record use the latest completed save across tabs. Separate task and shortcut records do not replace the whole workspace.
- Everything is local to the browser profile. This version has no sync/export. Uninstalling the extension clears its local data.

The only requested permission is `storage`; the manifest also registers a new-tab override. No remote scripts, fonts, favicon services, or background worker are used. Search and shortcut links navigate only when activated.

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
