# Vendored Pane UI

`pane-ui-react/` contains the standalone `@pane-ui/react` **0.1.0-alpha.1** package vendored during initial development. Upstream: [ajmalhassan/pane-ui](https://github.com/ajmalhassan/pane-ui), package directory `packages/react`. The exact upstream commit was not recorded.

The extension depends on it via `file:vendor/pane-ui-react`. Commit this package’s `dist/`, `package.json`, README, and [MIT license](pane-ui-react/LICENSE); they are inputs, not generated extension output. The lockfile pins its external dependencies. No sibling checkout is required.

To update, build the intended upstream revision, replace the package snapshot, record its version and commit here, update the extension lockfile, and run the extension checks and browser verification. Record encountered library issues in [integration notes](../DOGFOODING.md).
