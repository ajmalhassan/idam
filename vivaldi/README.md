# Idam for Vivaldi

<img src="../extension/public/icon.svg" alt="Idam home logo" width="64" height="64" />

A dark browser theme centered on vertical tabs: flat surfaces, roomier tab labels, a solid blue active tab, and favicon-only pinned tiles where Vivaldi supports them.

[Download idam.css](https://github.com/ajmalhassan/idam/releases/download/v0.6.1/idam.css) · [Matching icon sets](icons/README.md)

## Install the CSS

1. Download `idam.css` and place it in a permanent folder containing your browser CSS mods. If using this checkout, the folder is `vivaldi/`.
2. Open `vivaldi://flags/#vivaldi-css-mods`, enable **Allow CSS modifications**, and relaunch. Older versions expose the option under `vivaldi://experiments`.
3. In **Settings → Appearance → Custom UI Modifications**, select that folder.
4. Use a dark base theme. Disable theme scheduling and **Get Accent Color From Webpage** for a consistent palette.
5. In **Settings → Tabs → Tab Bar Position**, select **Left**. Right-side tabs are also styled. For more room, try Regular UI density, 115% UI zoom and a sidebar around 280–300 px wide.
6. Restart Vivaldi to load the CSS. Restart again after CSS edits.

The [icon ZIPs](icons/README.md) are installed separately through **Settings → Themes**. They provide toolbar and panel glyphs; CSS controls layout and spacing.

### Updating from the earlier folder names

The theme previously lived at `metro/metro.css`; it now lives at `vivaldi/idam.css`. If Vivaldi pointed directly at the old checkout folder, select `vivaldi/` instead. If you copied the old CSS elsewhere, replace it with `idam.css` and remove the old copy so both are not loaded. Custom variable overrides should change from `--metro-*` to `--idam-*`.

## Pinned tiles

On supported builds, enable **Horizontal pinned tabs in vertical tab bars** at `vivaldi://flags/#vivaldi-horizontal-pinned-tabs`, then relaunch. The theme styles the native favicon-only grid with dark surfaces, subtle borders and 6 px corners. Vivaldi controls tile dimensions and wrapping. Without that flag, full-width pinned tabs remain usable.

## Customize

Edit the `--idam-*` variables near the top of [idam.css](idam.css):

- `--idam-accent`: filled selections and the active tab.
- `--idam-accent-text`: brighter focus and accent text.
- `--idam-label-size`: tab labels, initially 13 px.
- `--idam-pin-radius`: pinned-tile corners; use `0px` for square tiles.

Colors and typography share Pane UI's foundations. The browser palette is a local CSS snapshot; changing the extension accent does not update it automatically. The icon packager reads this same palette. The theme downloads no fonts, scripts or images.

Native dragging, sizing, close/mute controls and tab stacks remain under Vivaldi's control. The theme does not create tabs, bookmarks, widgets or new-tab content. Other CSS mods targeting the same controls can conflict.

## Undo and compatibility

Move `idam.css` out of the selected CSS folder and restart Vivaldi. Restore your previous theme, icon source and tab position if desired.

Checked with Vivaldi 8.2 on macOS. Internal browser selectors and experimental flags may change between versions. See [testing coverage](../docs/TESTING.md).

## References

- [Vivaldi CSS customization](https://vivaldi.com/blog/tips/tip-9/)
- [Browser themes](https://help.vivaldi.com/desktop/appearance-customization/browser-themes/)
- [Custom icon sets](https://help.vivaldi.com/desktop/appearance-customization/creating-custom-icon-set/)
