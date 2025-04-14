// src/initFirebase.ts
import { initializeApp } from 'firebase/app';

// Your Firebase configuration
// WARNING: It's strongly recommended to use environment variables
// for sensitive information like API keys in production!
const firebaseConfig = {
  apiKey: "AIzaSyAGCoK3-Dx88CFSD9tfWii9PlVuoT0srgA", // Replace with your actual key if different, keep secure
  projectId: "rightstep-7a5f4",
  // --- CORRECTED BUCKET NAME ---
  // Use the name confirmed by `gsutil ls`
  storageBucket: "rightstep-7a5f4.firebasestorage.app",
  // -----------------------------
  messagingSenderId: "666949495917",
  appId: "1:666949495917:android:51414e3de9761f400fa364"
};

// Initialize Firebase and export the app instance directly
export const app = initializeApp(firebaseConfig);