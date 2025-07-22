// Import the functions you need from the SDKs you need
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { getAuthToken } from "./Permissions";
import { getToken } from "firebase/messaging";

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


export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: 'BHLWyKpyT2Np1BR0mKnYbzBmHMDxSYmN_zHVrqGdyuIrnCM7TieG9WxFNWei8GtHhnSMRFksQJmBftn1zxHUog4', // 👈 مهم جداً
        }).then((currentToken) => {
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            // إرسال التوكن إلى سيرفر Laravel
            axios.post('/api/save-fcm-token', { token: currentToken }, {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            }).then(() => {
                console.log('Token saved to server.');
            }).catch(err => {
                console.error('Could not save token to server.', err);
            });
            resolve(currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
            reject('No token available');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          reject(err);
        });
      } else {
        console.log('Unable to get permission to notify.');
        reject('Permission not granted');
      }
    });
  });

export default app;