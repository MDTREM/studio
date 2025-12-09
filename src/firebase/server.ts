
// This file is intentionally left blank to avoid server-side Firebase initializations
// that might conflict with the client-side instance.
// All Firebase interactions in this app are designed to be client-side.

// If you need to add server-side logic (e.g., in API routes or for Server Actions
// that require admin privileges), you would use the Firebase Admin SDK here.
// Example:
/*
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    // Your admin config
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
*/

// For now, we are keeping this file minimal.
// Note: The getSdks function was moved to the client-side index.ts and renamed to
// initializeFirebase to centralize initialization.
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// Helper function to initialize Firebase if it hasn't been already.
// This is safe to call from both server and client.
const initializeFirebaseApp = (): FirebaseApp => {
  if (!getApps().length) {
    // When on the server, we must use the config object.
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

// This function is intended for use in Server Components or API routes.
// It provides SDK instances without relying on the client-side context.
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
