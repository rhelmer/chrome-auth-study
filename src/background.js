/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import "webextension-polyfill";

import { Rally, runStates } from "@mozilla/rally";

// Example: import a module.
import {
  initialize as exampleInitialize
} from './ExampleModule';


firebase.initializeApp({
  apiKey: "AIzaSyC9_JzEBLvWxTQGCSCfq2ij73TjANWQ4l0",
  authDomain: "moz-fx-dev-rhelmer-rallyauth.firebaseapp.com",
  projectId: "moz-fx-dev-rhelmer-rallyauth",
  storageBucket: "moz-fx-dev-rhelmer-rallyauth.appspot.com",
  messagingSenderId: "872283440703",
  appId: "1:872283440703:web:e19c8f1872205d90421a8a"
});

console.debug("firebase init:", firebase);

let port;
chrome.runtime.onConnect.addListener(p => {
  port = p;
  p.onMessage.addListener(message => {
    if ("email" in message && "password" in message) {
      login(message);
    } else if ("provider" in message && message.provider === "google") {
      googleSignIn();
    }
  });
});

function _openControlPanel() {
  chrome.runtime.openOptionsPage();
}

chrome.browserAction.onClicked.addListener(_openControlPanel);

function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
    .signInWithPopup(provider)
    .then(result => {
      const credential = result.credential;
      const token = credential.accessToken;
      const user = result.user;
      console.debug("auth result:", result);
      
      const storageRef = firebase.storage().ref();
      console.debug("storageRef:", storageRef);
      storageRef.child(`/users/${user.uid}/test.txt`).getDownloadURL()
        .then(async (url) => {
          console.debug("got download URL:", url);
          let result = await fetch(url);
          let text = await result.text();
          console.debug('result:', text);
          port.postMessage({ result: text });
        });
      port.postMessage({ result: text });
    }).catch(error => {
      console.debug("auth error:", error);
      port.postMessage({ error: error.message });
    });
}

function login({ email, password }) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.debug("logged in as:", user.uid);

      const storageRef = firebase.storage().ref();
      console.debug("storageRef:", storageRef);
      storageRef.child(`/users/${user.uid}/test.txt`).getDownloadURL()
        .then(async (url) => {
          console.debug("got download URL:", url);
          let result = await fetch(url);
          let text = await result.text();
          console.debug('result:', text);
          port.postMessage({ result: text });
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.debug("something went wrong:", errorCode, errorMessage);
      port.postMessage({ result: ":(" });
      port.postMessage({ error: errorMessage });
    });
}

const rally = new Rally();
rally.initialize(
  // A sample key id used for encrypting data.
  "sample-invalid-key-id",
  // A sample *valid* JWK object for the encryption.
  {
    "kty": "EC",
    "crv": "P-256",
    "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
    "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
    "kid": "Public key used in JWS spec Appendix A.3 example"
  },
  // The following constant is automatically provided by
  // the build system.
  __ENABLE_DEVELOPER_MODE__,
  (newState) => {
    if (newState === runStates.RUNNING) {
      console.log("The study can run.");
    } else {
      console.log("The study must stop.");
    }
  }
).then(resolve => {
  // Initialize the study and start it.
  // Example: initialize the example module.
  exampleInitialize();
}, reject => {
  // Do not start the study in this case. Something
  // went wrong.
});

_openControlPanel();