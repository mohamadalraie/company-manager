// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
// Add any other services you'll use, like getAnalytics

// Your web app's Firebase configuration (from your project settings)
const firebaseConfig = {
    apiKey: "AIzaSyBiTe_nBJz9tX6OogpNxvRVtpjixIfr1cU",
    authDomain: "construction-management-4229e.firebaseapp.com",
    projectId: "construction-management-4229e",
    storageBucket: "construction-management-4229e.firebasestorage.app",
    messagingSenderId: "1000747317207",
    appId: "1:1000747317207:web:76c983595d72f22f6a7d92",
    measurementId: "G-DN0XF58T90"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the Firebase services you want to use
const messaging = getMessaging(app);
// export const analytics = getAnalytics(app);

export default app;