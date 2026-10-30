# Five-person beta: seven days

Purpose: observe whether people can set up, use and recover their new-tab workspace, and identify reasons they keep or disable Idam. Five participants provide qualitative evidence, not a population estimate.

Recruit five volunteers with varied browser habits; aim to include Chrome and Vivaldi and someone who regularly uses a keyboard or assistive technology. These are recruitment targets, not invented participants. Edge is exploratory until native validation is complete. Do not recruit more people to compensate for a blocker before fixing it.

## Before inviting anyone

Complete the candidate gates in [README](README.md), attach the verified ZIP and guide to an accessible release location, and replace the single download placeholder below. Keep personal contact details outside this repository; use P01–P05 in observations. Ask permission before any screen sharing or recording. Default to written notes and sample content, with no analytics, session replay, browsing-history collection or automatic uploads.

## Invitation draft — not sent

> Hi — I'm testing Idam, a dark new-tab page with a daily priority, shortcuts, tasks and notes. Would you try the 0.6.1 beta for seven days and tell me what works or gets in your way?
>
> It installs manually in Chrome or Vivaldi. Please start with sample content. Your workspace is stored in your browser; shortcut icons can contact the saved site, Google or Favicon.im. Backups are unencrypted files. There is no account or usage tracking.
>
> Download and installation guide: [VERIFIED BETA DOWNLOAD AND GUIDE URL]
>
> The first session takes about 15–20 minutes, followed by a short day-one and day-seven check-in. You can stop whenever you want. Export before uninstalling if you want to keep anything you saved.
>
> Please reply here with feedback, or open an [Idam feedback issue](https://github.com/ajmalhassan/idam/issues/new). GitHub issues are public: include the browser, OS, version and steps, but leave out personal notes, private URLs and backup files. A simple “I stopped using it because…” is useful too.

## First session: observe before explaining

Say: “We're testing the product, not you. Use fictional content. Please say what you expect as you go; I'll hold instructions until you've tried.” Read one task at a time. Note unaided completion, hesitation, errors, prompts needed and the participant's words. Do not coach toward a particular control or praise a preferred outcome.

| Prompt to participant | Observer checks, not instructions to read aloud |
| --- | --- |
| Install from the guide and make your next new tab yours. | Folder choice, competing extension, setup/skip, ability to reach home. |
| Put something you want to finish today somewhere you can return to. | Whether priority is understood; where they choose to put it. |
| Keep two small reminders. Change one, then remove one you no longer need. | Task creation/edit/deletion; whether recovery is discoverable if they want it. |
| Save a short thought and come back to it in another new tab. | Notes discovery, save status, persistence; use sample text. |
| Add a place you visit. Put it where you'd expect to find it first. | Add/edit, reorder discoverability, drag vs arrow choice and persistence. |
| Find one of your saved places, then look up something on the web. | Local filtering versus submitted web search; accidental navigation. |
| Change the appearance or what appears on your home page. | Personalize, accent, show/hide without data-loss confusion. |
| Keep a copy you could use if this browser profile disappeared. | Export discovery, readable file/privacy understanding. |
| In this disposable sample workspace, bring back the supplied sample backup; then recover what was there before. | Preview/replace comprehension, warning acknowledgment, recovery. Never perform this on important user data. |
| Use the page without your usual pointing device, then leave the beta if you wanted to. | Focus order/visibility, named controls, exit discoverability. Assistive technology only with a participant comfortable using it. |

After each task ask “What did you expect?” and “What happened?” Avoid “Was that easy?” Record help as help, not successful unaided completion. Stop a task after repeated failure or participant discomfort; offer the guide after recording the issue.

## Day one and day seven messages — drafts

**Day one:** “Since installing Idam, when did you use it and what did you try? Was anything missing, unclear, slow or different after reopening the browser? Did you keep your previous new-tab setup? Please describe one moment that stood out. No screenshots or private content needed.”

**Day seven:** “Did you keep Idam enabled? What did you return to, and what did you ignore? Describe any time it interrupted you or failed to save. Would you keep using this version, and why or why not? What is the one change that would matter most? If you're leaving, export anything you want before uninstalling.”

## Participant tracker — empty template

Store only participant IDs here. Use “not asked”, “no reply”, “stopped”, or actual observations; do not fill missing answers with assumptions.

| ID | Browser / OS / version | Consent + install date | Day-one result | Day-seven enabled? / reason | Issues / next action |
| --- | --- | --- | --- | --- | --- |
| P01 | pending | not recruited | pending | pending | pending |
| P02 | pending | not recruited | pending | pending | pending |
| P03 | pending | not recruited | pending | pending | pending |
| P04 | pending | not recruited | pending | pending | pending |
| P05 | pending | not recruited | pending | pending | pending |

Observation format: `ID · date · candidate hash/version · task · expected · observed · help given · reproducible steps · severity · issue link · retest result`. Keep recordings/contact details private and agree their deletion date with participants. Aggregate learning without identifying quotes unless permission was given.

## Stop and triage rules

| Severity | Trigger | Action |
| --- | --- | --- |
| Stop distribution | Data loss/corruption, restore overwrites without acknowledgment, unexpected private-data transmission, or inability to recover the browser's normal new tab. | Pause invitations/updates immediately; ask affected testers to stop writes and disable Idam if needed. Preserve their own backups privately. Reproduce on synthetic data and fix before resuming. |
| Block release | Reproducible install failure on a claimed browser, persistent save failure, keyboard trap, inaccessible essential control, or core flow blocked with no workable alternative. | Track a concrete issue; fix and retest the affected browser/interaction before broader release. |
| Fix or document | Confusing controls, incorrect/generic favicon, visual defects, or nonblocking performance complaints. | Record conditions and frequency; prioritize by impact. Disclose unresolved limitations. |

Organizer checks feedback daily while the beta is active; no automated reminders are created by this document. Use sanitized reproductions in public issues. Do not ask for full workspace exports to debug routine issues.

At day seven, report counts as `n/5` with nonresponses separate, list the three strongest observations and every unresolved blocker, and decide **continue**, **revise and retest**, or **stop**. Proceed beyond beta only after all stop/release blockers are resolved and checked; neither five signups nor positive comments alone establish readiness.
