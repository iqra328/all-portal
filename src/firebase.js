// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ← add this

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmGcJvPU01qW11KHQMIXySRg23Vk5f2tU",
  authDomain: "dashboard-adfb1.firebaseapp.com",
  projectId: "dashboard-adfb1",
  storageBucket: "dashboard-adfb1.appspot.com", // ← check this, ".app" nahi ".com"
  messagingSenderId: "1004560686749",
  appId: "1:1004560686749:web:79db639bb6d8851f917e74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORTS
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ← add this