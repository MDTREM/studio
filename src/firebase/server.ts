import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// This file does not have 'use client' and can be used in Server Components.

// Helper function to initialize Firebase if it hasn't been already.
// This is safe to call from both server and client.
const initializeFirebaseApp = (): FirebaseApp => {
  if (!getApps().length) {
    // When on the server, we must use the config object.
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

export function getSdks(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore; } {
  const firebaseApp = initializeFirebaseApp();
  const auth = getAuth(firebaseApp);
  auth.languageCode = 'pt';
  return {
    firebaseApp,
    auth: auth,
    firestore: getFirestore(firebaseApp)
  };
}
