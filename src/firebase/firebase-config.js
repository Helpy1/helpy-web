// src/firebase-config.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signOut,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signInWithRedirect,
    getRedirectResult,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDP-ddZ5plQoCFYQkRwGjMfAolCA4HSUS4",
    authDomain: "helpy-6f93d.firebaseapp.com",
    projectId: "helpy-6f93d",
    storageBucket: "helpy-6f93d.appspot.com",
    messagingSenderId: "354817431726",
    appId: "1:354817431726:web:5044993d03d87f793a353f",
    measurementId: "G-VLYCLBYD84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, signInWithPopup, signOut, facebookProvider, signInWithPhoneNumber, RecaptchaVerifier, signInWithRedirect, getRedirectResult, db, storage };
export default app;
