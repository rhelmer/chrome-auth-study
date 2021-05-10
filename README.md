# Mozilla Rally Chrome Auth Study
This is an experimental Rally study that uses authentication to return "givebacks" to the user. It is based on the [Rally Study Template](https://github.com/mozilla-rally/study-template/), and was written for the [Auth in studies & core add-on spike](https://github.com/mozilla-rally/rally-core-addon/issues/559).

The goals for this spike:
- [x] allow logging in through a Google or custom email + password providers.
- [x] when a study is first installed, it auto-authenticates if the browser has authenticated into their Google account or if I have authenticated into the custom email + password.
- [ ] 3. when you open your browser, the previously-installed study should be authenticated already.
- [x] 4. figure out how much GCP / Firebase meets our needs around these requirements.

## Supported NPM commands
The template comes with a set of pre-defined NPM commands (to run as `npm run <command>`) to help study authors:

* `build`: assembles the final addon. The bundler generated code is saved in the `dist/` directory.
* `dev`: assembles the addon in _developer mode_. In this mode data doesn't get submitted but, instead, is dumped to the [Browser Console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console). This mode allows for a smoother development process.
* `lint`: run linting on the add-on code.
* `package`: packages the final archive containing the bundled addon, is saved in the `web-ext-artifacts` directory.
* `start`: build the addon and run a Firefox instance and side-load the add-on for manual testing or debugging purposes.
* `test-integration`: perform the provided integration test for the final addon.
* `watch`: assembles the addon in _developer mode_, then runs the browser and watches the source code for changes, automatically reloading the extension when needed.

## Manual testing in the browser
To test, either load as a temporary add-on in Firefox (`about:debugging`) or Chrome ("developer mode" in `chrome://extensions`) or use `npm run start`.
