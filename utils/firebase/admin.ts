import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountJson) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing.");
      // Initialize a placeholder for build-time to prevent "default app does not exist" errors
      admin.initializeApp({ projectId: "demo-project" });
    }
  } catch (error) {
    console.warn("Firebase admin initialization error", error);
  }
}

const db = admin.firestore();

export { admin, db };
