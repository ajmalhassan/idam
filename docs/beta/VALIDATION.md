# Idam 0.6.1 validation record

Checked 2026-10-30 on macOS 26.6.2, Apple M4 Pro, 24 GiB RAM. Only disposable profiles and fictional data were used. This is a bounded private-beta readiness check, not certification or proof across all machines.

## Result

No known blocking application defect remains from this pass. The 45 unit/build tests, formatter, release ZIP integrity check, and independent review pass. Installed Chromium and Google Chrome completed the browser suite. Native Vivaldi passed the bounded checks in its [separate report](vivaldi-validation.md).

| Area | Evidence |
| --- | --- |
| Fresh installation | Real unpacked extension loaded through CDP, then Begin → name → places → home, using native chrome.storage.local. Chromium 151.0.7922.34, Chrome 156.0.8078.74 and Vivaldi 8.2.4133.96. |
| Upgrade | Chrome and earlier Chromium run reloaded a 0.6.0 unpacked installation at the same path with 0.6.1 files; ID and all seeded records were preserved, onboarding bypassed. Uses Extensions.loadUnpacked, not an OS file picker. |
| Offline/reload | Chrome/Chromium: saved notes/tasks retained; new tasks could be saved and reloaded offline. Native Vivaldi retained its task/note under network emulation. |
| Browser restart | Chrome process closed/reopened with the same disposable profile; reloading the CDP-installed extension at the same path/ID retained all seeded records. This does not establish automatic re-enabling after a manual installation. [Raw report](validation/chrome-restart-report.json). |
| New tabs | Navigating chrome://newtab opened Idam in all three browsers. Vivaldi's plus button and startup-page setting were not separately exercised. |
| Backup/recovery | Native Chrome/Chromium export, import preview, mandatory acknowledgment, replacement, recovery copy and stale-tab blocking passed. Existing unit tests cover malformed files, write failures and changed previews. |
| Tiles/icons | Native drag changed order without opening a URL; order survived reload. Blocking external icon sources exercised the permission-backed native favicon endpoint. |
| Keyboard/dialogs | Task creation retains the input; follow-up typing cannot accidentally open Notes. Slow saves lock all shortcut inputs. Independent review verified failed-save focus, no focus stealing, duplicate-submit protection, Settings/Shortcut/Notes dialog names, focus containment, Escape and return focus. |
| Layout/motion | No horizontal overflow at 320, 800, 1040 and 1280px; dark initial rendering under light OS preference; no running animations with reduced motion. Vivaldi's real left tab bar was 240px and content 993×771. |
| Contrast | Corrected blue #006ac2 gives white text ~5.47:1; white priority placeholder fixes teal as well (~5.32:1). This is a targeted check, not an exhaustive WCAG audit. |
| Site | Actual screenshots loaded; 1440/375/320px layouts, keyboard FAQ/anchors, dark default, reduced motion, no overflow/page errors, download and privacy links passed. Downloaded ZIP matched the source SHA-256 and manifest 0.6.1. |

The manual Load unpacked file-picker flow, automatic re-enabling of CDP-installed extensions after browser restart, Edge, Windows/Linux, physical touch, and full screen-reader/200%-zoom coverage are not established by these runs. Use the five-person beta tasks to cover everyday installation and usage. No participants have been recruited automatically.

## Measured local timings

Five returning-tab samples each, headless native extension, 1280×800, reduced motion, no CPU throttling. Readiness is elapsed automation time from reload until a shortcut is visible plus two animation frames; it includes driver overhead and is not a field metric. FCP was unavailable in some Chromium samples, so it is not summarized.

| Browser | Samples | Median readiness | Range |
| --- | --- | --- | --- |
| Chrome 156.0.8078.74 | 5 | 49 ms | 49–50 ms |
| Chromium 151.0.7922.34 | 5 | 50 ms | 49–70 ms |

The fresh Chromium 0.6.1 setup reached Begin in 191 ms in one reduced-motion sample. This excludes browser process launch and intentionally omits the normal brand-reveal duration. These observations are not performance promises. Bundle sizes: 269,455 bytes JS (84,603 gzip), 51,364 bytes CSS (10,858 gzip). Playwright is development-only and is not shipped.

## Artifact provenance

Extension: `idam-new-tab-0.6.1.zip` (101,191 bytes). SHA-256:

```text
2f1d70233540eaadfc9dfb67e7fdde4d3b683135a93ac117c7bac88d6d7ab83d
```

The browser-tested JavaScript matches the packaged app.js SHA-256 recorded in [candidate metadata](validation/candidate.json). Candidate metadata records the historical validation baseline (6e35114 plus the beta-preparation changes at that time). The GitHub release draft identifies the final committed source. The website is live over HTTPS; extension publication and store submission remain with the owner.

Raw reports: [Chrome](validation/chrome-browser-report.json), [Chromium](validation/chromium-browser-report.json). Native [Vivaldi screenshot](validation/vivaldi-home.png). Store images use fictional content and the actual application; promotional graphics use the approved house logo.

## Test-harness limits resolved during this pass

The initial Vivaldi automation launch needed a bounded native startup procedure documented separately. An artificial Chrome slow-storage patch affected a subsequent notes test; reloading the page after instrumentation isolated the checks, and the unmodified persistence path passed. A CDP-loaded extension's runtime reload/startup behavior differs from a manual developer-mode installation; same-path reinstallation was used for upgrade checks. No product change was made to hide these harness failures.
