# Contributing to Idam

Use a focused change with a clear explanation and relevant validation. Report reproducible issues through [GitHub issues](https://github.com/ajmalhassan/idam/issues), including your browser, OS, Idam version and steps. Omit private workspace data and backups.

## Checks

From `extension/`, run `npm ci`, then `npm run check` and `npm run build`. Run `npm run check:browser` for changes to onboarding, persistence, backup/restore or tile interactions. See [testing](docs/TESTING.md) for setup and coverage limits.

For browser assets, run `python3 vivaldi/icons/build.py` from the root, inspect `vivaldi/dist/icons.html`, and verify theme changes in a disposable Vivaldi profile. Keep both icon variants at 28 × 28 with inherited colors. SVG files in `vivaldi/icons/` are the editable sources.

## Compatibility

Do not rename stored workspace keys without a tested migration. The `metro.v1.*` namespace and `metro-start-preview-v1` preview key predate the Idam name and are retained so existing users keep their data. These are storage identifiers, not product branding.

The browser theme uses `--idam-*` customization variables. Its settings are independent of the extension's settings. Changes to Vivaldi selectors need native-browser checks; a web preview cannot validate the browser frame.

## Public repository hygiene

Keep source, tests, useful contributor documentation, dependency notices and current fictional-data product images. Put agent plans, scratch notes, raw diagnostics, browser profiles and obsolete captures under ignored `.local/`, not in public docs. Generated packages belong in ignored build directories and release attachments.

Before pushing, review `git diff --cached`, inspect new images, check links and remove local machine paths or personal data. Never commit credentials, real workspace exports or browser profiles. Keep release notes and installation paths consistent with the files users download.

## Pane UI

The extension uses a vendored build of Pane UI. See [dependency provenance](extension/vendor/README.md) and [integration notes](extension/DOGFOODING.md). File reproducible library defects upstream; application-specific fixes belong here.

## License

Contributions are distributed under the project's [MIT license](LICENSE). Preserve third-party notices.
