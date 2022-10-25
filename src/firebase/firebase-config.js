// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA53G5-Tmb0-tZziP0LOBRVDt1ln5DSAQ0",
  authDomain: "monkey-blogging-9baa3.firebaseapp.com",
  projectId: "monkey-blogging-9baa3",
  storageBucket: "monkey-blogging-9baa3.appspot.com",
  messagingSenderId: "582725195240",
  appId: "1:582725195240:web:fc369489c84de2ee04405d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
