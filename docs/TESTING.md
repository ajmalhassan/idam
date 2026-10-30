# Testing Idam

## Automated checks

From `extension/`:

```sh
npm ci
npm run check
npm run build
```

The 45 behavioral and build tests cover record validation, safe shortcut URLs, favicon fallback, onboarding, local-time greetings, daily rollover, task editing, tile ordering, backup validation, recovery and stale-tab protection. Formatting is checked before tests. The build verifies manifest icons and fingerprinted bundled assets.

## Browser checks

Install Playwright's Chromium once with `npx playwright install chromium`, then run `npm run check:browser`. The harness uses a new disposable profile and the built extension. It covers onboarding, task-entry focus, slow saves, offline reload, the new-tab override, backup/restore, stale tabs, drag ordering, responsive layout, reduced motion and icon fallback. Reports are written under ignored `.local/beta/`.

Optional arguments:

- `-- --baseline /path/to/previous/dist`: compare an installed update with a previous build.
- `-- --capture`: refresh current product screenshots using fictional data.
- `IDAM_BROWSER_EXECUTABLE`: select a compatible installed Chrome executable.

Vivaldi needs separate native checks; this harness does not establish Vivaldi compatibility.

## Recorded coverage for 0.6.1

Chrome 156 and Chromium 151 on macOS passed the automated installed-extension checks. A bounded Vivaldi 8.2 check covered onboarding, tasks, notes, reload persistence, the native new-tab route and a left vertical tab bar. Chrome process-restart persistence was checked in a disposable profile.

The browser CSS and both icon variants were checked in Vivaldi 8.2 on macOS. Native theme import resolved all ten icons; Back, Forward, Reload, Bookmarks, Downloads, History, Notes and Workspaces were observed in the UI. Home and Stop imported successfully but their live toolbar states were not exercised.

These checks do not establish full screen-reader, physical-touch, Edge, Windows or Linux coverage. The icon rename and packaging cleanup preserves the previously checked SVG geometry and browser CSS behavior.

## Release checks

1. Run automated checks and build from the source being released.
2. Inspect the ZIP: only production assets and required notices, with the expected manifest version and permissions. Exclude the development review page.
3. Test installation and update in disposable profiles; verify saved work survives.
4. Run `python3 vivaldi/icons/build.py`; inspect SVGs, archive mappings and preview. Native theme changes also require Vivaldi verification.
5. Review public files and screenshots for private content. Check README, download links, website and privacy policy.
6. Record the source commit and SHA-256 of each release asset. Publish only after reviewing that exact candidate.
