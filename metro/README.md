# Idam for Vivaldi

<img src="../extension/public/icon.svg" alt="Idam home logo" width="64" height="64" />

A Windows Phone inspired custom CSS theme, designed around **vertical tabs**: near-black surfaces, square corners, a solid blue active tab, and optional icon-only pinned tiles.

## Install

1. In Vivaldi, open `vivaldi://flags/#vivaldi-css-mods`. Enable **Allow CSS modifications** and relaunch. Older versions expose this under `vivaldi://experiments` as **Allow for using CSS modifications**.
2. Open **Settings → Appearance → Custom UI Modifications**, and select the **folder**:

   ```text
   /absolute/path/to/idam/metro
   ```

3. Under **Settings → Themes**, select **Dark** as the base theme. Disable theme scheduling and “Get Accent Color From Webpage” for a consistent appearance.
4. Under **Settings → Tabs → Tab Bar Position**, select **Left**. Right-side tabs are also styled. For a roomier layout, use **Regular** UI density, **115%** User Interface Zoom, and drag the sidebar divider to roughly **280–300 px**.
5. Restart Vivaldi to load the CSS. CSS edits also require a restart.

If you already use a custom CSS folder, copy `metro/metro.css` into it instead of changing the folder. Other mods that style the same controls can conflict.

## Icon-only pinned tiles

1. Open `vivaldi://flags/#vivaldi-horizontal-pinned-tabs`.
2. Set **Horizontal pinned tabs in vertical tab bars** to **Enabled**.
3. Relaunch Vivaldi.

This experimental feature is present in the tested Vivaldi 8.2 build. It supplies native favicon-only tiles above regular tabs. The CSS gives them dark surfaces, subtle borders, 6 px corners, and a solid blue active fill. Vivaldi chooses the tile size and wrapping; this does not force the reference image's three columns or wide rectangular tiles. If the flag is unavailable, ordinary full-width pinned tabs remain usable.

To undo the grid, set that flag back to **Default** and relaunch. Existing pins remain pinned.

## Included

- Flat dark address bar, panel strip, tab sidebar and status bar.
- Square tabs and toolbar buttons.
- Solid blue active tabs with white labels on either side.
- Readable inactive labels, hover states, pinned-tab surfaces and keyboard focus.
- A matching native Start Page with square Speed Dial thumbnails.
- Native tab dragging, resizing, close/mute controls and stack behavior remain under Vivaldi's control.

The mockup's asymmetric tiles and live-widget copy are concept content. This package styles Vivaldi's real Start Page without replacing bookmarks or adding widgets. Configure pinned tabs and tab stacks in Vivaldi; CSS does not create them. Horizontal tabs retain their native layout.

Inactive tab-stack fills are flattened to the Metro palette. Native stack frames, counters and indicators retain their stack colors.

## Customize

Edit the `--metro-*` variables at the top of `metro/metro.css`. Change `--metro-accent` for filled selections and `--metro-accent-text` for brighter field focus. The active tab uses the filled accent as one solid color, without an edge stripe or underline. Keep enough contrast with the dark sidebar.

The font stack uses Segoe UI when installed, then Helvetica Neue and Arial. No fonts, scripts, or images are downloaded by the theme.

The large “tabs” heading has been removed to reclaim vertical space. For fully square pinned tiles, set `--metro-pin-radius: 0px`.

## Pane UI alignment

The browser CSS mirrors the **effective blue theme in the Idam start page**, using the vendored Pane UI `0.1.0-alpha.1` tokens plus Idam's overrides. It uses `#0c0c0f` backgrounds, `#1c1c22` surfaces, `#f7f7f8` text, `#aaaab6` muted text, `#414148` borders, `#0078d7` filled accents and `#62b7ff` accent text/focus. The `--wp-*` values are a local snapshot, mapped to editable `--metro-*` aliases and then Vivaldi's native colors.

Tabs use 13 px labels to match the start page's shortcut labels. Toolbar and address-field fonts use the same Segoe UI / Helvetica Neue / Arial stack, overriding Vivaldi's platform-specific control fonts. Fields remain square; keyboard focus stays visible; toolbar hover transitions last 120 ms and are disabled with reduced motion. Native pressed/expanded control colors are preserved. The 6 px pinned-tile radius is retained from the requested reference.

This is visual alignment through standalone CSS, not a Pane React integration. Accent changes in the extension do **not** automatically update the browser: edit both accent tokens above to match. Pane's tile tilt/scale animation and large component spacing are not applied to browser drag targets. Vivaldi still owns tab dimensions, density and sidebar width.

The icon-theme builder reads this CSS's `--wp-*` palette when rebuilding its ZIPs and specimen. [View the browser and Pane start page together](pane-alignment.png).

## Undo

Move `metro.css` out of the custom CSS directory, or rename it to `metro.css.disabled`, then restart Vivaldi. Restore your previous base theme and tab position if desired.

## Compatibility and verification

Built against the UI shipped with **Vivaldi 8.2.4133.94 on macOS**, with real-browser checks in a separate temporary profile. No everyday-profile settings were changed. See [verification notes](VERIFICATION.md) for checks and limits. Vivaldi's UI selectors are internal and may change after browser updates.

## References

- [Vivaldi's CSS customization tip](https://vivaldi.com/blog/tips/tip-9/)
- [Vivaldi theme settings](https://help.vivaldi.com/desktop/appearance-customization/browser-themes/)
- [Tab stacks](https://help.vivaldi.com/desktop/tabs/tab-stacks/)

The installed Vivaldi stylesheet and `prefs_definitions.json` were used to verify current selectors and preferences.

## Idam icon preview

The [ten-icon Metro study](../metro-icons/README.md) includes native theme ZIPs, a visual comparison and actual Vivaldi screenshots. Choose a flat Back arrow or a Windows Phone inspired circular Back button. The guide explains how to use the icons with your existing colors and CSS.
