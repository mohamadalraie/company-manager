// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBiTe_nBJz9tX6OogpNxvRVtpjixIfr1cU",
    authDomain: "construction-management-4229e.firebaseapp.com",
    projectId: "construction-management-4229e",
    storageBucket: "construction-management-4229e.firebasestorage.app",
    messagingSenderId: "1000747317207",
    appId: "1:1000747317207:web:76c983595d72f22f6a7d92",
    measurementId: "G-DN0XF58T90"
 };

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
