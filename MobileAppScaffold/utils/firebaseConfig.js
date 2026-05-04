import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// SECURITY: Using environment variables to protect your keys
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDs7m1x0Thkg9xah2mHGrpSaovNq2n7CLE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "smart-meter-3c44b.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "smart-meter-3c44b",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "smart-meter-3c44b.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "431202806532",
  appId: process.env.FIREBASE_APP_ID || "1:431202806532:web:45a1081b3c566564c4fe51",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-JYT5E4XYMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
