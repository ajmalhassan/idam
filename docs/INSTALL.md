# Install Idam 0.6.1 beta

This beta is loaded manually from a ZIP, not installed from a published store listing. Download `idam-new-tab-0.6.1.zip` from the [GitHub release](https://github.com/ajmalhassan/idam/releases/tag/v0.6.1). No account is required. Use sample data first and read [Privacy](PRIVACY.md): displaying shortcuts can make external favicon requests.

## First installation

1. Extract `idam-new-tab-0.6.1.zip` into a permanent folder, such as `Documents/Idam-Beta`. The folder you select must directly contain `manifest.json` and `newtab.html`; the manifest version should be `0.6.1`.
2. **Keep that folder in place.** Do not move or delete it after installation. Loading the ZIP itself, the repository root or the unbuilt `extension/public` folder will not work.
3. Disable any other new-tab extension, such as Momentum, while testing Idam.
4. Follow the browser steps below, then open a new tab. Complete or skip setup. Add a sample task, wait for saves to finish, and reopen a new tab to check persistence.

| Browser | Load the extracted folder |
| --- | --- |
| Chrome | Enter `chrome://extensions`, turn on **Developer mode**, choose **Load unpacked**, and select the folder. If Chrome asks whether to retain the new-tab change, review and accept it to use Idam. |
| Vivaldi | Enter `vivaldi://extensions`, turn on **Developer mode**, choose **Load unpacked**, and select the folder. In **Settings → Tabs → New Tab Page**, enable **Controlled by Extension**. |
| Edge — validation pending | Enter `edge://extensions`, turn on **Developer mode**, choose **Load unpacked**, and select the folder. Review any browser prompt about changing the new tab. These installation steps are documented by Microsoft; Idam's native Edge behavior still needs testing. |

Official references, checked 2026-10-30: [Chrome unpacked installation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world), [Vivaldi extensions and new-tab control](https://help.vivaldi.com/desktop/appearance-customization/extensions/), [Edge sideloading and reload](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading).

If installation fails, confirm the selected folder contains `manifest.json`, Idam is enabled, and another extension is not controlling new tabs. Copy the error text and browser/OS version into a [feedback issue](https://github.com/ajmalhassan/idam/issues/new). Do not post private URLs, notes or backup files. If an organizational policy blocks developer mode, stop; do not bypass it.

## Update an existing unpacked installation

1. In **Personalize → backup & restore**, choose **Export backup**. Check that the file downloaded and keep it outside the installed folder. It contains readable, unencrypted workspace data.
2. Save pending edits and close other Idam tabs. Keep a separate copy of the previous extension files if you may need to revert.
3. Extract the new ZIP elsewhere, then replace the extension files **inside the same installed folder**. Do not uninstall, move the folder or load a second copy as your update method.
4. On the browser's extensions page, use Idam's **Reload** control; open a fresh new tab. Confirm the version, saved places, tasks, notes and priority. Unpacked beta updates are manual.

The localhost browser preview uses separate storage. A successful preview update does not update the installed extension's workspace.

## Stop testing, recover or roll back

- **Return to your previous new tab:** disable Idam on the extensions page, then re-enable your previous new-tab extension if applicable. Disabling is the first troubleshooting step; do not remove Idam before exporting data.
- **Undo a workspace import:** open **backup & restore → Export recovery copy**, then choose that exported file, inspect the preview, acknowledge replacement and select **Replace workspace**. Import replaces the entire saved workspace; it does not merge. Save drafts first. One local recovery copy is retained and replaced by the next import.
- **Revert application files:** export first, close Idam tabs, replace files in the same installed folder with a known-good release, then Reload. Check release compatibility before downgrading; older versions can lack current restore/write guards. Do not run old and new Idam tabs together.
- **Remove permanently:** export first if needed, then use **Remove** on the extensions page. Uninstalling removes local workspace and recovery data; downloaded files remain wherever you saved them. Deleting the installed folder is not a safe backup or update strategy.

If you see missing data or repeated save failures, stop editing and report the problem through GitHub issues. Do not repeatedly import or reinstall: doing so can replace the recovery copy or erase local evidence.
