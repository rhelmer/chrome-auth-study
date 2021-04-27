/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import "webextension-polyfill";

import firebase from "firebase/app";
import "firebase/auth";

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

const provider = new firebase.auth.GoogleAuthProvider();
firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    const credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
    console.debug("auth result:", result);
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    const credential = error.credential;
    // ...
    console.debug("auth error:", error);
  });

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
