# Mozilla Rally Chrome Auth Study
This is an experimental Rally study that uses authentication to return "givebacks" to the user. It is based on the [Rally Study Template](https://github.com/mozilla-rally/study-template/), and was written for the [Auth in studies & core add-on spike](https://github.com/mozilla-rally/rally-core-addon/issues/559).

The goals for this spike:
- [x] allow logging in through a Google or custom email + password providers.
- [x] when a study is first installed, it auto-authenticates if the browser has authenticated into their Google account or if I have authenticated into the custom email + password.
- [ ] 3. when you open your browser, the previously-installed study should be authenticated already.
- [x] 4. figure out how much GCP / Firebase meets our needs around these requirements.

On (4), Firebase provides several services but in this case we're just using [Firebase Auth](https://firebase.google.com/docs/auth) to provide password-based and Google auth, and the Firebase SDK to integrate with it. Firebase Auth also supports various identity providers (Google, Twitter, Facebook, GitHub, etc.) as well as phone-based auth.

There is no per-use fee for Firebase Auth [currently documented](https://firebase.google.com/pricing), although other Firebase and GCP service such as storage do. Firebase does provide [integration with other GCP services](https://firebase.google.com/docs/storage/gcp-integration) so it's not required to (for example) use Firestore, GC Storage Buckets may be used instead.

# Outstanding Questions
## Re-authentication
We *can* initiate a log-in pop-up at any time, but since the extension runs in the background, we must decide how to get user attention if our login token expires.

The known options are:

- open a new tab
- highlight the badge (if present)
- browser notification
- modify web content
- email (I know of at least one popular extension that does this)

Otherwise, initiating user authentiation will show a pop-up seemingly out of nowhere for the user. The pop-up does identify the service (Rally in this case) that
is requesting authentication.

## Firefox unsupported by Firebase SDK for Oauth

There is an [open PR that goes over the problems](https://github.com/firebase/firebase-js-sdk/issues/4002), but the tl;dr is that Firefox is not supported by the SDK.

We *might* be able to use `browser.identity` extension API from Firefox for Google provider, instead.

Firebase password-based auth works OK within a Firefox extension.

## Firebase SDK rollup module issues
Firebase throws errors and doesn't work properly when loading multiple modules after using rollup. "firebase is already loaded" is logged, and only one of storage or auth works at a time.

Worked around by loading from background page:
```
<script src="https://www.gstatic.com/firebasejs/8.4.2/firebase.js"></script>
<script type="module" src="../dist/background.js"></script>
```

## Phone-based auth from extensions
https://cloud.google.com/identity-platform/docs/web/chrome-extension has the warning: "Warning: Using phone or multi-factor authentication from a Chrome extension is not supported."

Not sure this is true anymore?
We almost certainly don't want to use this option so that's probably fine.

## General documentation issues
Lots of chrome docs point to "chrome app" docs which apply to both extensions and apps, but "apps are obsolete" messages abound...

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
