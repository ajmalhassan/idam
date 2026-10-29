# Verification

## Solid active tabs — 30 October 2026

Replaced the tinted active fill and separate edge/underline with a uniform `#0078d7` fill and white text, including pinned tiles. Native multi-selection and drop-target exceptions remain unchanged.

Verified in the isolated Vivaldi profile: regular, pinned and right-side active tabs all computed to `rgb(0, 120, 215)` background, white text, no background image and no shadow. The active pinned tile's border matches its fill. Rebuilt the icon comparison and inspected [the actual browser screenshot](solid-active-tab.png). Earlier screenshots below retain the prior edge treatment.

## Pane alignment — 30 October 2026

Verified against Vivaldi 8.2.4133.94 on macOS in `/tmp/vivaldos-metro-icons-test`, with the current CSS injected into the native UI. The everyday profile was not changed or restarted.

- Read the start page's computed Pane tokens, confirming background, surface, foreground, muted text, border, accent, accent text and font. Its higher-specificity blue rule wins over a later blue declaration; the browser matches the effective `#0078d7` / `#62b7ff` pair.
- All 32 top-level CSS rules parsed. Background, surface, foreground, tab font size, active edge, pinned radius, absent heading and address-field focus checks passed.
- Compared the prior CSS to this version: native tab-position styles and bounding sizes remained identical (46 × 46 pinned tile; 268 × 33 regular tab at the tested density/width).
- Checked left and right vertical tabs: the selected edge moves to the correct side.
- Confirmed Pane font stack on the browser root and address input. Vivaldi's platform font rules required explicit overrides.
- DevTools forced hover/focus on Reload: expected surface highlight and 2 px foreground outline rendered. Reduced-motion emulation set the transition duration to 0 s.
- Rebuilt both icon theme archives from the CSS palette. SVG geometry and native button IDs are unchanged; the earlier native-import checks cover that structure, but this palette-only ZIP revision was not separately reimported.

[Actual browser screenshot with the Pane start page](pane-alignment.png). Existing screenshots below show earlier palettes. The previous limits still apply; the new changes were checked at 100% UI zoom. No Pane library bug was found; the blue-token cascade difference is in the extension's own stylesheet, which this browser-only task did not modify.

## Original verification — 28 October 2026

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
