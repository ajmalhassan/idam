# Idam — New Tab: privacy disclosure

Draft prepared 2026-10-30 for the 0.6.1 beta. This describes the extension's implementation; it is not a legal certification or a policy for any future website. The publisher must review it against the final package and provide a reachable copy before store submission.

## Your saved workspace

Idam stores your optional name, accent and display/search settings, shortcut titles and full URLs, tasks and their completion/creation metadata, notes, and dated daily priorities in your browser profile using `chrome.storage.local`. It also keeps internal setup/version markers and one local recovery copy when you restore a backup. A development web preview uses separate `localStorage`.

There is no Idam account, backend, cloud synchronization, telemetry, advertising or session recording in this version. The extension does not upload your workspace to the developer. It does not request browsing-history, tabs, broad website access or geolocation permissions. It does not read the contents of the websites you visit.

Local storage is not an encrypted vault. Anyone with sufficient access to your device/profile may be able to access it. Keep passwords, secrets and confidential material out of a beta workspace.

## Requests for shortcut icons

Displaying shortcuts can make network requests automatically, without clicking a shortcut. Idam tries these sources in order until an image loads:

1. The saved site's origin followed by `/favicon.ico`.
2. Google's S2 favicon service at `www.google.com`, with the site's scheme and origin in `domain_url`.
3. Favicon.im's resolver at `a.favicon.im`, with the hostname.
4. Chromium's local favicon endpoint in an installed extension; otherwise initials remain.

The resolver removes saved URL paths, queries and fragments and sets a no-referrer policy. It does not send the shortcut title, task text, notes or priority to the icon providers. Like other network requests, the receiving site/provider can see the request and network metadata such as your IP address; browser request and cookie policies apply. Idam does not control those services' retention or use of received requests.

IP literals, single-label names and common local/reserved suffixes skip public favicon services, but the direct site's `/favicon.ico` is still attempted. This is a hostname-pattern check, not DNS resolution: an internal service with a public-looking domain may still reach Google or Favicon.im. There is no user-facing “disable all external icons” control in this version. Do not save a sensitive hostname if you do not want these lookups.

Each source has a three-second deadline. Successful resolutions are reused in memory for an hour and total failures for one minute; browser HTTP caching also applies. Icons may be generic, unavailable or stale. These are remote images, not remotely executed scripts.

## Search and opening links

Typing in the search field filters saved places locally. A search is sent to your selected provider—DuckDuckGo, Google or Bing—only when you submit it with Enter or **Search web**. Opening a saved place navigates to its full saved URL, including any path/query. The destination's own privacy practices apply. Idam does not collect an analytics record of these actions.

## Backup, restore and deletion

**Export backup** downloads readable, unencrypted JSON with saved settings, full shortcut URLs, tasks, notes and all saved daily priorities. URL paths/query strings and anything sensitive typed into text fields are included. The default filename includes “idam”, backup/recovery type and a timestamp, not your name; treat both the file and any filename you choose as potentially sensitive when sharing. Import reads the chosen file locally and displays its filename for preview; it does not upload it.

Unsaved drafts, favicon image files and nested recovery copies are not exported. Import replaces the saved workspace after preview and acknowledgment, keeping one previous workspace as a local recovery copy. That copy is replaced on the next restore. It is not independent disaster recovery: export a separate copy if you need one.

You can edit or remove entries in Idam. A recovery copy or an older downloaded backup can still contain removed content. Uninstalling Idam removes its extension-local workspace and recovery copy; deleting the browser profile also removes them. Downloaded backups remain until you delete them yourself, including any copies in backups or cloud folders you use. Disabling the extension retains its data.

## Why the permissions exist

| Permission / declaration | Purpose |
| --- | --- |
| `storage` | Save workspace records and preferences locally, listen for updates across Idam tabs, and retain the pre-restore recovery copy. |
| `favicon` | Access Chromium's local favicon endpoint for saved shortcut origins when earlier icon sources fail. It is not a history-reading permission. |
| `chrome_url_overrides.newtab` | Show Idam when you open a new tab. This is a manifest declaration, not an extra website-access permission. |

The package has no background service worker, content scripts, remote scripts or remote fonts. The manifest requests only `storage` and `favicon`.

## Feedback and contact

Contact the maintainer through [Idam's GitHub issue form](https://github.com/ajmalhassan/idam/issues/new). Issues are public and handled by GitHub under its own policies. Do not post personal notes, private URLs, backups or sensitive screenshots. Beta feedback sent directly to the organizer is voluntary; the extension sends none automatically. Agree privately with the organizer before sharing sensitive diagnostic information.

Implementation references: [manifest](../../extension/public/manifest.json), [storage](../../extension/src/storage.js), [favicon sources](../../extension/src/favicon.js), [rendered icons](../../extension/src/SiteIcon.jsx), [search submission](../../extension/src/AppShell.jsx), [backup contents](../../extension/src/backup.js), [local download/import](../../extension/src/BackupControls.jsx), [restore/recovery](../../extension/src/guarded-store.js).
