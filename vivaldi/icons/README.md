# Idam Icons for Vivaldi

Ten original SVG icons in two variants, packaged as native Vivaldi themes.

| Variant | Back button | Download | Editable SVGs |
| --- | --- | --- | --- |
| **Flat** | Open arrow | [idam-icons-flat.zip](https://github.com/ajmalhassan/idam/releases/download/v0.6.1/idam-icons-flat.zip) | [flat/](flat/) |
| **Classic** | Circular Back button | [idam-icons-classic.zip](https://github.com/ajmalhassan/idam/releases/download/v0.6.1/idam-icons-classic.zip) | [classic/](classic/) |

Both sets include Back, Forward, Reload, Stop, Home, Bookmarks, Downloads, History, Notes and Workspaces. Other controls retain Vivaldi's icons; website favicons are unchanged.

## Install

1. Download either ZIP above; do not extract it.
2. In Vivaldi, open **Settings → Themes → Library → Open Theme**.
3. Select the ZIP and confirm **Install** in the preview.
4. To use only its icons, return to your preferred color theme. Under **Editor → Icons → Use Icon Set from**, select **Idam Icons — Flat** or **Idam Icons — Classic**.

The ZIP includes a dark palette because Vivaldi distributes icon sets as themes. Install [idam.css](../README.md) separately for the vertical-tab layout. To undo, choose your previous theme and icon source. If the theme changes later, check theme scheduling.

## Build and edit

From the repository root:

```sh
python3 vivaldi/icons/build.py
```

The packager reads the checked-in SVGs in `flat/` and `classic/` and the colors in `vivaldi/idam.css`. It produces both ZIPs and a dark `icons.html` preview in ignored `vivaldi/dist/`. No dependencies beyond Python 3 are required.

Edit the SVG source files directly. Each has a 28 × 28 canvas, `currentColor` strokes, square terminals and inline presentation attributes. Keep both variants in sync except for Back. The packager checks the SVG structure and writes a `settings.json` mapping each native button ID to its SVG at the archive root. ZIPs also include the MIT license.

## Compatibility

The original SVG geometry and both theme variants passed native import in Vivaldi 8.2 on macOS. Eight icons were observed in the UI; Home and Stop imported but their live states were not exercised. Other operating systems, light themes and future Vivaldi versions need verification. See [testing](../../docs/TESTING.md).

Official guidance: [creating custom icons](https://help.vivaldi.com/desktop/appearance-customization/creating-custom-icon-set/), [shareable themes](https://help.vivaldi.com/desktop/appearance-customization/shareable-vivaldi-themes/), and [using icons from another theme](https://vivaldi.com/blog/tips/desktop-tips/tip-289/).
