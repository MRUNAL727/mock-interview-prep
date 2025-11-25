import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy6EEMrEVbvc0RW-yeq_BkhdGRKs9AvkI",
  authDomain: "mock-interview-platform-7d4bc.firebaseapp.com",
  projectId: "mock-interview-platform-7d4bc",
  storageBucket: "mock-interview-platform-7d4bc.firebasestorage.app",
  messagingSenderId: "911861640660",
  appId: "1:911861640660:web:9e03182f1a55995b943a41",
  measurementId: "G-EVB8SDVRMM",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
