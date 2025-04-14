// src/firebaseConfig.ts
console.log("--- firebaseConfig.ts START ---"); // For debugging load order

import { initializeApp, FirebaseApp } from "firebase/app";
// Optional: Import other services like Analytics if you use them
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration from your Firebase project settings
// *** PASTE YOUR ACTUAL WEB APP CONFIG VALUES HERE ***
const firebaseConfig = {
  apiKey: "AIzaSyAgztqKJGL1O15PerndtEPR1FyYN3hv9-0", // From your screenshot
  authDomain: "rightstep-7a5f4.firebaseapp.com",     // From your screenshot
  projectId: "rightstep-7a5f4",                   // From your screenshot
  storageBucket: "rightstep-7a5f4.appspot.com",     // Check this matches your Storage bucket name
  messagingSenderId: "666949495917",             // From your screenshot
  appId: "1:666949495917:web:2133e32629f1dac30fa364", // From your screenshot
  measurementId: "G-HDV66L47HB"                   // From your screenshot (Optional)
};

// Initialize Firebase
let app: FirebaseApp;
try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase Initialized Successfully in firebaseConfig.ts with Project ID:", firebaseConfig.projectId);
    // Optional: Initialize Analytics
    // if (firebaseConfig.measurementId) {
    //   getAnalytics(app);
    // }
} catch (error) {
    console.error("Firebase initialization error in firebaseConfig.ts:", error);
    throw error; // Rethrow to make it clear initialization failed
}

console.log("--- firebaseConfig.ts END ---"); // For debugging load order
// Export the initialized Firebase app instance
export { app };