# Idam

<img src="extension/public/icon.svg" alt="Idam home logo" width="64" height="64" />

Your space in the browser. A personal workspace with colorful tiles by Ajmal Hassan, with a new-tab extension built using [Pane UI](https://github.com/ajmalhassan/pane-ui) and a matching Vivaldi theme.

| Product | What it includes | Guide |
| --- | --- | --- |
| **Idam — New Tab** | Daily priority, shortcuts, tasks, notes, clock and search for Chromium browsers | [Extension setup](extension/README.md) |
| **Idam for Vivaldi** | Dark custom CSS focused on vertical tabs, with optional native icon themes | [Theme setup](metro/README.md) · [Icon sets](metro-icons/README.md) |

Both products share a design direction but can be installed and released independently. The existing `metro/` and `metro-icons/` paths are retained so local CSS installations keep working.

## Develop the extension

Requires a modern Node.js release with npm. The code uses Node's built-in test runner. Packaging also requires `zip` and `unzip`; the preview command below requires Python 3.

```sh
cd extension
npm ci
npm run check
npm run build
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8765/newtab.html. To install locally, load `extension/dist` as an unpacked extension; see the [installation instructions](extension/README.md#install-in-vivaldi).

```sh
# From extension/: build and validate the extension ZIP
npm run package

# From the repository root: generate both Vivaldi icon themes
python3 metro-icons/build.py
```

The CSS theme requires no build.

## Repository layout

```text
extension/           React extension, tests, build scripts and vendored Pane UI
metro/               Vivaldi CSS and installation guide
metro-icons/         Icon-theme generator and native-browser verification images
docs/                Daily-flow design, beta kit and verification records
site/                Static beta landing page and privacy disclosure
```

Generated bundles, icon-theme outputs, dependencies and ZIPs are ignored. Keep the vendored Pane UI distribution and its license in Git: the extension builds from that local package. Older experiments and pre-Git backups are retained under `.local/archive/` on this machine and are not part of the repository.

## Design and verification

- [Daily flow](docs/daily-flow.md)
- [Extension verification](extension/VERIFICATION.md)
- [Theme verification](metro/VERIFICATION.md)
- [Pane UI dogfooding log](extension/DOGFOODING.md)
- [Vendored dependency provenance](extension/vendor/README.md)

Workspace records stay in the browser profile. There is no backend or account. Website icons can contact saved sites and external favicon services automatically; submitted searches and shortcut actions open their destinations. See the extension guide and [privacy disclosure](docs/beta/PRIVACY.md) for details.

Project repository: [ajmalhassan/idam](https://github.com/ajmalhassan/idam). Planned site: `idam.ajmalhassan.com` (not deployed).


## Small beta

The [0.6.1 beta kit](docs/beta/README.md) contains the current validation record, installation/update guide, privacy disclosure, store listing draft and a five-person observation plan. Preview the landing page by serving `site/` on localhost; see [site setup](site/README.md). Run the extension's `prepare:beta` command after packaging and screenshot review to assemble the local distribution kit. The planned domain and browser-store listing have not been published.
