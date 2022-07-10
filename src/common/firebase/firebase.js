import firebase from "firebase";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import config from "./firebase.config";

function createFunction() {
  // Initialize Firebase app
  !firebase.apps.length && firebase.initializeApp(config);
  const analytics = firebase.analytics();
  // Intialize Auth
  const auth = firebase.auth();
  const providers = [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ];
  const ui = new firebaseui.auth.AuthUI(auth);
  return {
    analytics,
    providers,
    auth,
    ui,
  };
}

// Making Single instance
let firebaseInstance = null;
export const getFirebaseInstance = function () {
  if (!firebaseInstance) {
    firebaseInstance = createFunction();
  }
  return firebaseInstance;
};
