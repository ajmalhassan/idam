# Pane UI integration notes

Idam uses the vendored `@pane-ui/react` 0.1.0-alpha.1 package with React 19.2.8. Upstream: [ajmalhassan/pane-ui](https://github.com/ajmalhassan/pane-ui). See [provenance](vendor/README.md).

No independently reproducible Pane UI defect has been confirmed. The issues below were application integration problems and were fixed in Idam.

| Area | Integration finding |
| --- | --- |
| Fields and selection | Overrides must target Pane's actual `wp-text-area` and `wp-selection` markup. |
| Theme | Teal and stronger contrast require consumer token overrides. |
| Entrance motion | Initially visible Transition/TileSequence instances skip entrances; toggle visibility before paint when an entrance is required. |
| Tile layout | TileSequence adds wrappers. Apply spans and dimensions to those wrappers; override inherited minimum height for compact square tiles. |
| Task entry | Restore input focus after the save disables/re-enables the field. |
| Shortcut editing | Lock draft fields during a pending save to prevent later edits from being discarded. |

Pane components used include Theme, TileLink, Button, IconButton, Field, TextField, TextArea, Select, Checkbox, Dialog, MessageBanner, Transition, Stagger and TileSequence. Dialog focus containment, Escape and focus restoration were checked in bounded browser testing; full screen-reader coverage remains outstanding.

For future library defects, record a minimal reproduction, component/version, browser, expected/actual behavior and workaround. Check for duplicates before filing upstream, then link the issue here. Keep consumer defects in this repository.
