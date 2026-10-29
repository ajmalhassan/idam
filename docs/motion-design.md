# Idam motion design

Implemented motion direction for review, 30 October 2026. The chosen direction is a brief brand reveal before the first-run welcome, followed by Windows Phone-inspired setup and tile transitions. The intended feeling is polished, deliberate hospitality.

## Approaches

- **Brand reveal, then welcome — selected:** gives Idam a distinct first impression; adds a brief, skippable introduction.
- **Welcome animates immediately:** reaches setup sooner, with less emphasis on the brand. Considered as the alternative.

## First-run sequence

1. On the existing near-black background, four accent tiles turn into a two-by-two Idam mark in a tight wave (approximately 0–450 ms).
2. The IDAM wordmark resolves beside the mark (approximately 300–650 ms), followed by a brief hold.
3. The brand settles into the header and “make yourself at home” enters, followed by supporting text and controls. The brand docks at 980 ms, the welcome turnstile completes at approximately 1.24 seconds, and the last supporting element settles at approximately 1.4 seconds after local workspace loading completes.

These timings are implementation proposals and should be tuned in the browser. No sound, extra onboarding step, or artificial loading indicator. Keep a visible Skip intro control; skipping the reveal opens the welcome without completing setup. Existing Skip setup retains its separate meaning.

## Setup and home

- Setup advances through a turnstile exit and entrance; Back reverses the direction. Target total transition: 400–500 ms.
- Shortcut choices use the library's press response and a brief selection confirmation, preserving their button semantics.
- After a successful setup save, the selected shortcuts enter home as a coordinated tile wave, with priority, tasks and notes following. Target: 500–650 ms for this first arrival.
- Subsequent new tabs use a restrained 250–400 ms entrance. They do not replay the brand reveal or delay access to search and shortcuts.
- Clock ticks, task changes and typing never restart entrance sequences. Returning from a hidden tab does not replay the reveal.

## Implementation boundaries

Use the existing Pane UI Transition, TileSequence and Stagger components where their behavior fits. Their initially visible state deliberately skips presence entrances: explicitly coordinate show changes rather than relying on mounting to trigger a turn. Keep tile press transforms separate from the sequence's layout wrappers.

The reveal belongs to first-run onboarding. Completing or skipping setup prevents future automatic reveals; revisiting setup from Personalize bypasses the intro. An incomplete fresh setup may show the introduction again on a later load. Provide a replayable development preview without resetting personal data.

Honor reduced-motion preference by presenting the settled screen immediately, including changes to the preference during a transition. Handle rapid Back/Next, skipped intros, animation cancellation and storage failures without stranded hidden controls. Move focus into the incoming setup step after it becomes available; outgoing content must not remain focusable. No modification to the Vivaldi CSS theme, data model, or daily-priority rollover is planned.

## Verification

Review the actual motion in a browser at desktop and narrow widths. Check first run, skip intro, skip setup, backward navigation, home arrival, subsequent tabs, reduced motion, rapid input, focus order and failed saves. Confirm no horizontal overflow or first-frame flash. Record reproducible Pane UI defects in the dogfooding log and file upstream issues when warranted.
