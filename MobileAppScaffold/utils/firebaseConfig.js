import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs7m1x0Thkg9xah2mHGrpSaovNq2n7CLE",
  authDomain: "smart-meter-3c44b.firebaseapp.com",
  projectId: "smart-meter-3c44b",
  storageBucket: "smart-meter-3c44b.firebasestorage.app",
  messagingSenderId: "431202806532",
  appId: "1:431202806532:web:45a1081b3c566564c4fe51",
  measurementId: "G-JYT5E4XYMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
