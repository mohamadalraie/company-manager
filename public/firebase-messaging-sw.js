// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBiTe_nBJz9tX6OogpNxvRVtpjixIfr1cU",
    authDomain: "construction-management-4229e.firebaseapp.com",
    projectId: "construction-management-4229e",
    storageBucket: "construction-management-4229e.firebasestorage.app",
    messagingSenderId: "1000747317207",
    appId: "1:1000747317207:web:76c983595d72f22f6a7d92",
    measurementId: "G-DN0XF58T90"
});

const messaging = firebase.messaging();
