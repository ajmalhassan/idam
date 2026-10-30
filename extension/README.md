# Idam — New Tab

<img src="public/icon.svg" alt="Idam home logo" width="64" height="64" />

A dark new-tab workspace for Chromium browsers, built with [Pane UI](https://github.com/ajmalhassan/pane-ui). Includes daily priorities, editable shortcut tiles, tasks, notes, clock, web search and accent settings. No account or backend.

[Download 0.6.1 beta](https://github.com/ajmalhassan/idam/releases/download/v0.6.1/idam-new-tab-0.6.1.zip) · [Install and update](../docs/INSTALL.md) · [Privacy](../docs/PRIVACY.md) · [Website](https://idam.ajmalhassan.com/)

## Using Idam

- **Setup:** Begin → optional name → familiar places and accent → home. Personalize can reopen setup while preserving existing content. Reduced motion removes movement; returning tabs skip the brand reveal.
- **Daily priority:** choose one thing for today, complete it, or explicitly carry forward the most recent unfinished priority on a new day.
- **Places:** add HTTP(S) shortcuts, choose small or wide tiles, and use **edit tiles** to edit or reorder. Drag before/after a tile, or use arrow controls with a keyboard or touch. Clear search before reordering; Escape cancels a drag.
- **Tasks:** check to complete, use the pencil to edit, Enter/checkmark to save and Escape/cross to cancel. Deletion offers Undo in the same tab.
- **Notes:** open the editor for more room. Changes save after a pause and on blur; check save status before closing. Failed writes offer retry.
- **Search:** filters saved places. Enter or **Search web** opens the selected provider. Press `/` to focus search and `N` to open notes when not typing in another control.
- **Personalize:** change accents, module visibility and search provider, revisit setup, or export and restore a backup.

Workspaces start empty except for the shortcuts chosen during setup. Clock and greetings use local time; morning starts at 05:00, afternoon at 12:00, and evening at 18:00.

## Storage and recovery

Installed workspaces use `chrome.storage.local`; the development web preview uses separate `localStorage`. Tasks, shortcuts, notes, settings and priorities persist locally. There is no cloud sync. Uninstalling removes local workspace data.

Use **Personalize → backup & restore** to export unencrypted JSON. Imports validate the whole file and require confirmation before replacing the workspace. One recovery copy is retained locally. Save drafts before importing; older tabs are blocked from overwriting the restored workspace. See [installation and recovery](../docs/INSTALL.md).

Simultaneous changes to the same record use the latest completed save. Abrupt browser termination can lose unsaved drafts. Storage identifiers retain their earlier names for compatibility; do not rename them without a migration.

## Website icons and permissions

Permissions are `storage` and `favicon`. No access to all websites is requested. Icons try the saved origin's `/favicon.ico`, Google's favicon service, Favicon.im, then Chromium's local favicon endpoint; initials are the final fallback. Requests have per-source deadlines and use an in-memory cache.

External lookups omit saved URL paths, queries, fragments and referrers. IP addresses, single-label hosts and common reserved/local suffixes bypass public providers. A private hostname with a public-looking domain can still reach those services. See the full [privacy disclosure](../docs/PRIVACY.md).

## Development

From this directory:

```sh
npm ci
npm run check
npm run build
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:8765/newtab.html`; the unbuilt `public/newtab.html` is only a template. Load `dist/` as an unpacked extension to test native storage. Keep that installed folder in place when updating and reload the extension after rebuilding.

`npm run package` builds and validates the versioned ZIP. `package.json` owns the release version; the build injects it into the manifest and fingerprints bundled assets. The build includes Idam, Pane UI and bundled dependency license notices.

The separately bundled `/review/index.html` page offers replayable onboarding and home entrances with in-memory data. It cannot reset the normal workspace and is excluded from release ZIPs.

See [testing](../docs/TESTING.md) for `npm run check:browser`, isolated profiles and coverage limits. `npm run capture:promo` renders current store graphics; `check:browser -- --capture` captures the app using fictional data.

## Source map

- `src/AppShell.jsx`: home composition and navigation.
- `src/Onboarding.jsx`, `src/BrandReveal.jsx`, `src/journey.js`: first-run flow and motion.
- `src/model.js`, `src/lifecycle.js`: record validation, defaults and initialization.
- `src/storage.js`, `src/useWorkspace.js`, `src/operations.js`: storage, subscriptions and retries.
- `src/backup.js`, `src/guarded-store.js`: backup validation and restore protection.
- Named components own their respective sections; CSS controls layout and presentation.

The standalone Pane UI package is vendored for reproducible builds. See [provenance](vendor/README.md) and [integration notes](DOGFOODING.md).
