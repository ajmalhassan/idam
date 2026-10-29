# Idam motion design

## Current direction — revision 2, 30 October 2026

User-requested flow: animate Idam → Begin → a big, centered name prompt → familiar places with live accent selection → start page. This replaces the automatic welcome handoff in revision 1. Keep the Metro typography, square tiles and dark background. The user controls the pace once the brand has appeared.

| Stage | Motion and behavior |
| --- | --- |
| Idam reveal | Four tiles assemble over 720ms with 110ms spacing. Wordmark resolves from 600–1360ms. |
| Invitation | Begin and a short welcome line fade in over 500ms. Wait indefinitely for a click. Skip animation lands here, not on the name screen. |
| Begin → name | Brand docks into the header over 760ms, then the centered name prompt turns in over 520ms. Name input receives focus; entry is optional. |
| Name → places | Continue exits over 340ms, then places enters over 520ms. Back reverses it and retains the draft. |
| Accent selection | Six swatches beside the place choices. Tile backgrounds interpolate over 680ms, delayed 55ms per tile. Rapid choices settle on the latest color. Selection checkmarks remain separate from color motion. |
| Save → home | Save must succeed before the 340ms exit. Home tile wave uses 620ms turns with a maximum 240ms total stagger; surrounding content settles by 920ms. New places keep the chosen accent. |
| Returning tabs | No reveal or Begin. Shorter tile entrance (300ms plus stagger); search remains usable. |

## Approved welcome proportions

The reveal wordmark is 66px on desktop and 44px on narrow screens, with a proportionally scaled four-tile mark. The caption sits 16px below the lockup. Begin uses Pane’s default button padding and 44px minimum height, with the browser theme’s square-ended forward SVG geometry at a heavier 2.4-unit stroke for this compact control.

## Behavior and constraints

- Pane Transition, Stagger and TileSequence own setup/home motion. The custom brand reveal uses Web Animations, with cleanup and cancellation settlement.
- First-run content stays local. Completing setup saves the name, accent and selected places. Failed writes leave the step and retry available. Existing shortcuts are never recolored or overwritten by a setup revisit.
- Reduced motion skips movement, including changes mid-run, but still waits for Begin. Clock ticks, typing and color selection do not restart the page entrance.
- Outgoing steps are inert. Name receives focus after entering; familiar places receives heading focus. No new runtime dependencies, permissions, accounts or network calls.
- The review page uses a separately bundled in-memory store. Replay never resets installed or normal preview data. Review files are excluded from the release ZIP.

## Review

Use `http://127.0.0.1:8765/review/index.html`: Experience the welcome, Replay welcome and Everyday entrance. Verification and dogfooding findings are recorded in extension/VERIFICATION.md and extension/DOGFOODING.md.
