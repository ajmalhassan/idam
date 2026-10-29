# Idam onboarding motion implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver the approved brand reveal → welcome → places → save → home flow and a replayable review page.

**Architecture:** A small pure journey reducer coordinates Pane Transition and TileSequence. BrandReveal owns the four-tile logo choreography; home has mount-only motion. A separate development build entry uses memory-backed storage and cannot touch installed or browser-preview records.

**Tech Stack:** React 19, vendored Pane UI, CSS/Web Animations, esbuild, Node tests.

**Spec:** ../../motion-design.md (user authorized end-to-end implementation on 30 October).

## Constraints

Dark first paint; no new runtime dependency; reduced motion settles immediately; first arrival 500–650ms; everyday arrival 250–400ms; intro around 1.2 seconds. No Vivaldi theme changes. Preserve data/storage keys. Controls must not strand on interruption or failed saves.

## Review focus

Rapid step presses; failed setup writes; reduced motion mid-run; existing users bypassing reveal; preview isolation. Exercise each in browser verification, with reducer guards covered by Node tests.

## Task 1: Journey state and intro

- [x] Write failing reducer tests for intro skip, forward/back, blocked rapid actions, failed save and completion.
- [x] Implement journey.js, motion hooks, and BrandReveal.jsx; use current accent and existing four-tile mark.
- [x] Run reducer tests and complete suite.

## Task 2: Setup and home

- [x] Wire Onboarding to the reducer and Pane Transition/Stagger; transfer focus after transitions and keep save errors actionable.
- [x] Retain setup through storage refresh until departure finishes. Home arrival uses Pane TileSequence without changing layout or losing shortcut identity.
- [x] Verify success, skip, back, zero shortcuts, retry and repeat tab behavior in the real bundle.

## Task 3: Replay and delivery

- [x] Add separate review/index.html build entry with in-memory data, replay control and stage/timing guide. Exclude review files from the extension ZIP.
- [x] Verify reduced motion, narrow viewport, first frame and focus; capture screenshots of actual UI and inspect animation samples.
- [x] Run formatting, full suite and packaging; document Pane findings and verification; independent review; commit and leave preview open for user review.

## Execution ledger

Ruling: work on a feature branch in the current checkout so the user's loaded extension directory remains stable; no worktree is needed for concurrent edits. The user explicitly requested building end to end for later review; proceed without another plan approval.

Ruling: review state stays in memory in a separately bundled page, avoiding production query flags and any reset of user data.


Completed: tasks 1–3. Reducer tests were added before implementation, then all 21 tests, formatting, package integrity and isolated-browser checks passed. Browser evidence is recorded in extension/VERIFICATION.md. Review screenshot is extension/screenshots/idam-motion-map.png.

Final review: fresh-context reviewer found no blocking defects. Minor timing note: welcome fully settles around 1.4s; retained for visual review, with actual timing documented in the spec. The extra approximately 0.2s is the cost of the current stagger.

Ruling: preserve the feature branch for the user's requested review; do not merge while they are away. Preexisting Vivaldi theme/icon edits are outside this motion change and remain in the checkout. Cost: the new release awaits integration after review.


## Revision 2 — user-directed pacing and color

Completed the explicit requested revision: wait at Begin after reveal, separate centered name prompt, move accents beside familiar places, animate a per-tile color wave, retain the selected color for new home tiles, and slow the transition cadence. New reducer and lifecycle assertions failed for the previous behavior, then passed; full suite 23/23. All-six-accent decoding regression also passes. Browser checks and independent review are recorded in extension/VERIFICATION.md. Current timing authority: docs/motion-design.md; revision 1 timing targets above are historical.
