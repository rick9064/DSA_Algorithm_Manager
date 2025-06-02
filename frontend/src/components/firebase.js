// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKJD0Dq4EfiHNoxy0M2b3iypw6HLLySko",
  authDomain: "dsa-algorithm-manager.firebaseapp.com",
  projectId: "dsa-algorithm-manager",
  storageBucket: "dsa-algorithm-manager.appspot.com", 
  messagingSenderId: "469965890938",
  appId: "1:469965890938:web:e1055628a36bc86fbaa2c3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
