# Chrome Web Store submission draft

Prepared 2026-10-30. Listing copy and image files are prepared; no submission has been made by this workflow. This listing covers the new-tab extension, not the separate Vivaldi CSS theme.

Chrome Web Store is the chosen primary distribution channel. Upload `extension/idam-new-tab-0.6.1.zip`, not the complete beta-kit ZIP. The developer account exists. The website and privacy policy are deployed with HTTPS verified and enforced on 2026-10-30. After approval and publication, use the actual listing URL as the landing page's primary install link. The Vivaldi CSS theme remains separate.

## Listing copy

**Name:** Idam — New Tab

**Summary (from the uploaded manifest):** Your space for shortcuts, tasks and notes. A personal new tab with colorful tiles, built with Pane UI.

**Full description:**

```text
Make each new tab your space for the day. Idam brings a daily priority, shortcut tiles, tasks, notes, a clock and web search into a personal page with colorful tiles, bold typography and purposeful motion.

Start with an optional name, accent and selection of places, or skip setup and get going.

• Choose one daily priority, mark it complete, or carry an unfinished priority into a new day.
• Add and edit shortcut tiles. Drag them into order on desktop, or use the arrow controls with a keyboard or touch.
• Keep tasks, edit them inline and undo the latest deletion in the current tab.
• Write notes in an expandable editor with save status and retry when a save fails.
• Type to filter your places. Submit a web search with DuckDuckGo, Google or Bing.
• Choose an accent and hide tasks or notes without deleting their content.
• Export a local JSON backup and preview a restore before replacing your workspace.

No account or cloud sync. Your workspace is saved in this browser profile. Idam has no analytics or advertising.

Privacy details: displaying shortcut icons can contact the saved site's origin, Google's favicon service and Favicon.im. Those icon requests omit saved URL paths, queries and fragments. Web searches are sent to your chosen provider only when submitted. Backup files are readable, unencrypted JSON and include your saved workspace, including full shortcut URLs.

Idam replaces your new-tab page. It requests storage to save your workspace locally and favicon to use Chromium's local icon fallback. It does not request access to all websites or your browsing history.

This beta does not sync across devices. Save drafts and export a backup before uninstalling; uninstalling removes local workspace and recovery data. Import replaces rather than merges. Icon coverage depends on the site and external services. Touch users can reorder with arrow controls; dragging targets desktop browsers.

Built by Ajmal Hassan with Pane UI.
Feedback: https://github.com/ajmalhassan/idam/issues/new
```

## Dashboard settings

- Category: **Workflow & Planning** (under Productivity).
- Language: **English**; English (United States) if a locale is required.
- Homepage: `https://idam.ajmalhassan.com/`.
- Privacy policy: `https://idam.ajmalhassan.com/privacy.html`.
- Support: `https://github.com/ajmalhassan/idam/issues`.
- Official URL: choose the verified Idam domain if available; do not select an unrelated domain.
- Promotional video: leave blank; none has been prepared.
- Distribution recommendation: Public for launch, or Unlisted for a link-only beta. Do not submit as Public if the intent is still a private beta.
- Pricing recommendation for this candidate: Free; no payment functionality is implemented.
- Regions: all supported regions if the intended launch is worldwide.
- Account/trader identity and contact email: use the publisher's actual account details. These cannot be inferred from the product code.

Both HTTPS URLs are live. GitHub Pages manages the certificate and redirects HTTP to HTTPS.


## Privacy practices / permission answers

Use these factual drafts for the final package, then review the live dashboard's wording. This is not permission to certify a submission automatically. Chrome requires the declarations and privacy policy to agree. [Official privacy-practices guidance](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).

| Field | Draft answer / verification |
| --- | --- |
| Single purpose | Replace the new-tab page with a personal daily workspace for priorities, saved places, tasks, notes, clock and search. |
| `storage` justification | Idam uses chrome.storage.local for the user's workspace and preferences, cross-tab change notifications, and a local pre-restore recovery copy. No cloud synchronization or developer upload is implemented. |
| `favicon` justification | Idam displays icons for saved shortcut origins. If direct-site and external favicon sources fail, this permission enables Chromium's local favicon endpoint as a fallback. |
| Host permissions | None requested in the manifest. This does not mean there are no network requests: remote favicon images load automatically. |
| Remote code | No remotely hosted executable code. Scripts/styles are packaged; external requests are favicon images or user-activated navigation/search. Confirm this in the final ZIP. |
| Developer collection | No Idam server receives workspace records or usage telemetry. Do not translate this into an unqualified “no data leaves your device” claim. |
| Local data handled | Optional name, full saved URLs/titles, task and note text, priorities and settings. They may contain personal information supplied by the user. |
| Third-party transmission | Saved origins/hostnames go to sites/Google/Favicon.im for icons; submitted search terms and activated destination URLs go to their destinations. These requests can disclose network metadata, including IP address. |
| Data-type checkboxes | Recommended conservative mapping: Personally identifiable information (optional name), Web history (user-saved URLs and origins used for icons, not history-API access), Website content (user-entered tasks, notes and priorities). Compare these with the live field definitions before certifying. Do not select “no data collected” solely because data is local or Idam has no backend. No health, financial, authentication, communications, location or activity-tracking feature is implemented. |
| Sale / unrelated use / lending certifications | The code implements no sale, ads, unrelated analytics or lending use. The publisher must independently confirm their broader practices and the required certifications; this file does not certify them. |
| Privacy-policy URL | `https://idam.ajmalhassan.com/privacy.html`; HTTPS verified on 2026-10-30. |

## Upload files

The prepared folder is `releases/chrome-web-store/`. It contains no ZIP; use the single extension package at `extension/idam-new-tab-0.6.1.zip`.

| Dashboard slot | File | Dimensions |
| --- | --- | --- |
| Store icon | `store-icon-128.png` | 128×128 |
| Screenshot 1 | `01-home.png` | 1280×800 |
| Screenshot 2 | `02-places.png` | 1280×800 |
| Screenshot 3 | `03-notes.png` | 1280×800 |
| Screenshot 4 | `04-setup.png` | 1280×800 |
| Global assets: small promo | `promo-small-440x280.png` | 440×280 |
| Global assets: marquee | `promo-marquee-1400x560.png` | 1400×560 |

The screenshots show the actual app with fictional data. The setup image shows revisiting setup with existing places selected. Keep that interpretation in captions. Backup preview is not part of this selected store set.

## Reviewer test instructions

```text
No login, subscription, license key or test credentials are required.

1. Install Idam and open a new tab. Disable another new-tab override if needed.
2. Choose Begin, enter an optional name, continue, choose places and an accent, and open the start page. Skip setup is also available.
3. Add and edit a shortcut; use Edit places to drag tiles or use their reorder arrows.
4. Set a daily priority; add, edit and complete a task; enter a note and wait for its save status.
5. Reload the new tab to confirm the workspace persists.
6. Open Personalize and backup & restore to export a JSON backup. Import offers a preview and requires confirmation before replacing the workspace.

Workspace data is local. Favicon requests contact saved-site origins and external icon providers as described in the privacy policy. No browsing-history API or host permissions are requested. No remotely hosted executable code is used.
```

## Sources

- [Listing fields and asset sizes](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Image guidance](https://developer.chrome.com/docs/webstore/images)
- [Privacy and permissions](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Local data must also be disclosed](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Workflow & Planning category](https://chromewebstore.google.com/category/extensions/productivity/workflow)

Prepared 30 October 2026. Store submission, publisher certifications and distribution choices remain with the publisher.
