# Native Vivaldi validation — Idam 0.6.1

Validated on 2026-10-30 using installed Vivaldi 8.2.4133.96 on macOS. This was the actual unpacked extension, with native `chrome.storage.local`, in a new temporary profile. The normal Vivaldi profile was never opened, copied, or modified.

## Result

Fresh onboarding, the home screen, task creation, note autosave, persistence across reload, and the native `chrome://newtab/` route passed. The full Vivaldi window rendered with a left vertical tab bar and no horizontal overflow in the extension content area. No product defect was found in this bounded native-browser check.

## Checks and evidence

| Check | Observed result |
| --- | --- |
| Fresh install | `Extensions.loadUnpacked` loaded `extension/dist`; `chrome.runtime.getManifest().version` returned `0.6.1`. |
| Onboarding | Begin → name `Beta QA` → familiar places → Open my start page. Name input received focus; four default choices were saved. |
| Native storage | `chrome.storage.local.get(null)` contained schema 2, initialized/onboarded flags, the name, settings, and four shortcut records. |
| Home layout | Content viewport 993 × 771 CSS pixels; document scroll dimensions also 993 × 771. Blue priority background computed as `rgb(0, 106, 194)`. |
| Vertical tabs | Vivaldi UI `#tabs-tabbar-container` had class `left` and width 240 px. Its toolbar had `aria-orientation="vertical"`; browser root included `tabs-left`. Native UI viewport was 1280 × 860 CSS pixels. |
| Task creation | Entered `Native Vivaldi task` and activated Add task. The task appeared, its record was present in native storage, and the document's active element was the New task input after save. |
| Notes | Opened Notes, entered `Native Vivaldi note`, waited for autosave, and returned home. Native storage and the note preview contained the same text. |
| Reload with network emulation | Applied CDP offline network conditions, reloaded the extension, and observed the saved task, note, name, and shortcuts. A request to `https://example.com/` rejected with `Failed to fetch`. Vivaldi continued to report `navigator.onLine === true`; this was network emulation, not an operating-system network disconnection. |
| Native new-tab route | Navigated the existing native tab to `chrome://newtab/`. Its document resolved to the Idam extension's `newtab.html`, showed the home screen, and retained the saved task and note. No additional extension-control preference was needed in this fresh test profile. |
| Screenshot | Inspected [vivaldi-home.png](validation/vivaldi-home.png): actual Vivaldi chrome, left tab bar, complete Idam home, task, and saved note. `.local/beta/vivaldi-home-content.png` is an earlier content-only capture. |

## Isolated launch procedure

Direct `launchPersistentContext` attempts had been unreliable. A raw Vivaldi process plus browser-level CDP succeeded with a 15-second startup wait and navigation of the existing `about:blank` target. This establishes a working procedure; it does not isolate which startup change resolved the earlier automation failure.

1. Create a new `/private/tmp/idam-vivaldi-probe-*` directory with an empty `Default` profile.
2. Write only these relevant preference values: `vivaldi.startup.has_seen_welcome_page: true`; startup `first_seen_version`, `last_seen_version`, and `crash_detection_last_seen_version: "8.2.4133.96"`; `has_seen_feature: 1`; `vivaldi.tabs.bar.position: 1`; `vivaldi.tabs.bar.width: 240`. A 1280 × 860 window was requested. No existing profile contents or cookies were copied.
3. Launch `/Applications/Vivaldi.app/Contents/MacOS/Vivaldi` with `--user-data-dir=<fresh directory> --remote-debugging-port=9338 --no-first-run --no-default-browser-check --disable-gpu --enable-unsafe-extension-debugging --password-store=basic --use-mock-keychain --disable-background-networking about:blank`.
4. Connect to `/json/version`'s browser WebSocket, wait 15 seconds, load the unpacked extension through `Extensions.loadUnpacked`, and attach to the existing `about:blank` page. Navigate that page to the returned extension ID's `newtab.html`.
5. Inspect Vivaldi's own `window.html` app target for its tab-bar state and capture the full-window screenshot through `Page.captureScreenshot`.
6. Close the isolated browser through `Browser.close`. All test sessions were closed; port 9338 was released.

The temporary diagnostic harness and raw output were `/private/tmp/idam-vivaldi-final.mjs` and `/private/tmp/idam-vivaldi-final.log`. No reusable production test script was added.

## Limits

The extension was installed through CDP, not by walking through Vivaldi's Load unpacked file picker. The new-tab route was navigated directly; the browser's plus button and startup-page preference were not separately exercised. Input values and button activation were driven through the DOM. An attempted CDP key injection reached Vivaldi's omnibox, so this run is not evidence of a complete native keyboard-only flow. Browser restart persistence, backup restore, update migration, screen-reader behavior, and other operating systems were outside this bounded check.
