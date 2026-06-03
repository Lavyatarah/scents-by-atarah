// Firebase configuration - currently using localStorage for dev auth
// If you want to add real Firebase, install firebase SDK and uncomment below

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.VITE_FIREBASE_API_KEY || "",
//   authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
//   projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
//   storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
//   messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
//   appId: process.env.VITE_FIREBASE_APP_ID || "",
// };

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// Placeholder exports (not used in current implementation)
export const app = null;
export const auth = null;
export const db = null;
export const storage = null;

