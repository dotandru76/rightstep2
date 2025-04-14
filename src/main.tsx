// src/main.tsx
console.log("--- main.tsx START ---"); // For debugging load order

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx'; // Your main App component
import './index.css'; // Your global styles
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { BrowserRouter } from 'react-router-dom';

// --- Initialize Firebase EARLY by importing the config file ---
console.log("--- main.tsx: Importing firebaseConfig ---"); // For debugging load order
import { app as initializedFirebaseApp } from './firebaseConfig';
console.log("--- main.tsx: Firebase instance name after import:", initializedFirebaseApp.name); // For debugging load order
// -------------------------------------------------------------

// Call the PWA element loader
defineCustomElements(window);

const rootElement = document.getElementById("root");

console.log("--- main.tsx END (before render) ---"); // For debugging load order

if (!rootElement) {
  console.error("CRITICAL: Failed to find the root element 'root' in your index.html!");
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}