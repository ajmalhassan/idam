# Idam — New Tab 0.6.1 beta

Prepared 2026-10-30. Local candidate validated; public distribution is pending. This package is the new-tab extension. The Vivaldi CSS theme is installed separately.

## Changes

- Includes 0.6.0 desktop tile dragging: move a shortcut before or after another tile, including across rows. A white insertion line shows the destination; Escape or dropping outside cancels.
- Arrow controls offer keyboard/touch reordering. Clear the search filter before moving tiles. Failed saves preserve the saved order and offer retry.
- 0.6.1 corrects the keyboard task-creation focus behavior found during release testing. Follow-up typing stays in New task instead of triggering global shortcuts.

- Shortcut fields are disabled while saving, preventing later edits from being silently discarded.
- Darker blue surfaces and white priority placeholders improve contrast. Personalize explains automatic icon requests.

Also available in this beta: optional setup, daily priorities, editable tasks with deletion undo, expandable notes, accents, local search filtering and submitted web search, plus JSON backup/restore with one local recovery copy. Permissions remain `storage` and `favicon`.

## Update

Export a backup, save pending edits, close old Idam tabs, replace files in the same installed folder and Reload the extension. Do not uninstall or move/delete that folder to update. See [installation and recovery](INSTALL.md).

## Known limitations

- No cloud sync or account. Uninstalling removes local workspace and recovery data. Backups are unencrypted and imports replace rather than merge.
- Simultaneous changes to the same note/record use the latest completed save. Abrupt browser termination can lose unsaved drafts. Older versions do not provide all current restore protections.
- Favicons can trigger automatic requests to the saved origin, Google and Favicon.im. Some icons may be generic, missing or stale; public-looking internal hostnames can reach providers. See [Privacy](PRIVACY.md).
- Dragging targets desktop browsers; touch reordering uses arrow controls. Full screen-reader, physical touch and multi-OS coverage must be recorded explicitly rather than inferred from preview checks.
- See the [0.6.1 validation record](VALIDATION.md) for native browser checks, local timings and coverage limits.

Please report reproducible problems through the [feedback issue form](https://github.com/ajmalhassan/idam/issues/new), with the Idam version, browser/OS and steps. Issues are public; omit private content and backup files.
