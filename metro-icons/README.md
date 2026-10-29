# Idam icon preview for Vivaldi

Ten original SVG icons, packaged as two native Vivaldi themes. This is a small design trial, not a replacement for every browser icon.

- **Flat**: open Back arrow, matching the rest of the set. Recommended.
- **Classic**: the same set with a circular Back button, recalling Windows Phone.

Run `python3 metro-icons/build.py` from the repository root, then open the generated `metro-icons/preview.html`. These are layout illustrations using the actual packaged SVGs. [Flat in Vivaldi](flat-vivaldi.png) and [Classic in Vivaldi](classic-vivaldi.png) are screenshots of the imported themes in the real browser with the existing Metro CSS.

## Install

1. Note your current theme and icon source so you can restore them.
2. Open **Settings → Themes → Library → Open Theme**.
3. Build the packages as above, then choose `idam-icons-flat-preview.zip` or `idam-icons-classic-preview.zip`, then confirm **Install** in Vivaldi's preview.
4. To keep your existing colors, select your original theme again. Under **Editor → Icons → Use Icon Set from**, choose the installed Idam Icons preview theme.

The ZIPs include a dark palette because Vivaldi distributes icon sets inside themes. Using **Use Icon Set from** lets you apply their icons to another theme. Your custom CSS continues to control layout, spacing and tab styling. Icons alone do not create the vertical tab layout.

To undo, select the previous icon source and theme. If the appearance switches later, check theme scheduling and the icon source of the scheduled theme.

## Included icons

| Control | Native theme button ID |
| --- | --- |
| Back | `Back` |
| Forward | `Forward` |
| Reload | `Reload` |
| Stop loading | `Stop` |
| Home | `Home` |
| Bookmarks panel | `PanelBookmarks` |
| Downloads panel | `PanelDownloads` |
| History panel | `PanelHistory` |
| Notes panel | `PanelNotes` |
| Workspaces | `WorkspaceButton` |

Other icons use Vivaldi's defaults. Website favicons are unaffected. Home appears only when that control is on your toolbar; Stop is a loading state.

## Construction and verification

- 28 × 28 SVG canvas with internal padding; most glyphs are approximately 16 px. The circular Back intentionally uses more of the canvas.
- `currentColor` strokes, inline presentation attributes, square terminals and consistent 1.6 px stroke width.
- No scripts, external resources, SVG style blocks, IDs, masks or filters.
- `settings.json` and all ten SVG files are at each ZIP's root. The manifest's `buttons` object maps native IDs to filenames.

Rebuild from this project directory with `python3 metro-icons/build.py`. This regenerates the SVGs, theme manifests, ZIPs and HTML comparison. It does not install anything.

The original icon artwork and theme structure were tested on **Vivaldi 8.2.4133.94, macOS, 29 October 2026**, in a separate disposable profile. Both ZIPs passed Vivaldi's native theme importer, which resolved all ten assets. Eight icons were observed in the native UI at 28 × 28 CSS pixels: Back, Forward, Reload, the four panels and Workspaces. Their computed stroke colors matched their inherited toolbar/panel colors. Screenshots were inspected for both variants.

Home and Stop passed import and are shown in the specimen; their live toolbar states were not exercised. Light themes, other OSes, other Vivaldi versions and different UI zoom levels have not been visually tested. The user's everyday profile was not modified.

During testing, the fresh profile's system theme schedule superseded the chosen theme. Disabling that schedule in the test profile and explicitly selecting the icon source resolved it. This was a test setup interaction, not a confirmed Vivaldi bug.

## Official references

- [Creating a custom icon set](https://help.vivaldi.com/desktop/appearance-customization/creating-custom-icon-set/) — SVG dimensions, color inheritance, sanitation and archive button mapping.
- [Browser themes](https://help.vivaldi.com/desktop/appearance-customization/browser-themes/) — theme editor and scheduling.
- [Shareable themes](https://help.vivaldi.com/desktop/appearance-customization/shareable-vivaldi-themes/) — importing theme ZIPs and testing in a clean profile.
- [Use icons from another theme](https://vivaldi.com/blog/tips/desktop-tips/tip-289/) — selecting an independent icon source.

Button IDs were also checked against the installed Vivaldi resources and confirmed by native import. Private browser APIs were used only for isolated verification; installation uses Vivaldi's normal theme UI.
