# Verification — 28 October 2026

## Pinned-tile update

Removed the large “tabs” heading and added cosmetic rules for the native experimental pinned-tab grid. Verified the `vivaldi-horizontal-pinned-tabs` flag identifier and its label in the installed binary; enabled `VivaldiHorizontalPinnedTabs` in the isolated test instance.

Final update checks passed in Vivaldi 8.2.4133.94:

- All 28 top-level CSS rules parsed.
- Header pseudo-element is absent (`content: none`).
- Native grid enabled; pinned titles absent and icons displayed in a row.
- Tiles have a 6 px radius and solid border; the selected tile has the blue accent border.
- Native tab-position styles are unchanged before/after loading the CSS.
- Visual inspection confirmed the new layout.

Tile size and number of columns remain controlled by Vivaldi. This is an icon-grid adaptation of the supplied reference, not a fixed three-column layout. Pointer dragging and multi-row wrapping were not separately exercised in this update. The screenshot below referenced by the original verification records the earlier version with the heading.

## Original implementation

Tested against the real UI of Vivaldi **8.2.4133.94**, macOS, using a separate profile under `/tmp/vivaldos-metro-test`. The stylesheet was injected into that profile's UI through its local debugging endpoint. The normal user profile was not configured or restarted.

## Results

| Check | Result |
| --- | --- |
| Browser CSS parser | All 25 top-level rules loaded |
| Baseline before CSS | Square-tab, Metro-sidebar and blue-marker checks all false |
| Final CSS | All three style checks true |
| Native geometry | Tab position styles, widths and heights identical with CSS enabled/disabled |
| Active tab | Blue inset edge, near-white text, dark accent fill |
| Right-side tabs | Marker switches to a negative 3 px inset on the right |
| Pinned tabs | Three real pinned tabs present and styled |
| Tab switching | Native API activation changed selected label and retained active marker |
| Address field focus | Blue focus border computed as `rgb(0, 120, 215)` |
| Tab focus styling | Native `.tab:focus-visible` computed as a solid 2 px near-white outline, checked using DevTools forced pseudo-state |
| Native Start Page | `rgb(8, 8, 9)` background, square icon dial, readable near-white title |
| Visual inspection | Actual browser screenshot saved as [original screenshot](../docs/metro-preview.png) |

The final geometry/style pass succeeded after the last CSS edit. A read-only reviewer checked selectors against Vivaldi's shipped `common.css`; no blocking findings remained. The focus selector was expanded to include the native `.tab` element. Intentional flattening of inactive colored-stack backgrounds is documented in the README.

## Limits

This is not certification of every browser state. Full pointer-drag/reorder/stack interactions, keyboard-only navigation, UI auto-hide, extremely narrow sidebars, other operating systems, and all light/transparent-theme combinations were not exercised. Native drag targets, marked-tab indicators, tab geometry, audio controls, and close controls were inspected and are not overwritten by the mod. Select Dark as the base theme as documented.

The actual file-loader/restart installation flow still needs to be performed in the user's chosen profile; the real-browser checks used injected CSS. Future Vivaldi releases may change internal selectors.
