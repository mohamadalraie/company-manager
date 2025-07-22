import { getMessaging, getToken } from "firebase/messaging";
import { app } from './firebaseConfig'; // Assuming 'app' is exported from your main config

// This is the new function to get the token
export const getFirebaseToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted.');
    }

    // 1. Manually register your renamed service worker
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-push-sw.js');
    console.log('Service worker registered successfully:', serviceWorkerRegistration);

    // 2. Get the token using the registration
    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, {
      vapidKey: 'BHLWyKpyT2Np1BR0mKnYbzBmHMDxSYmN_zHVrqGdyuIrnCM7TieG9WxFNWei8GtHhnSMRFksQJmBftn1zxHUog4',
      serviceWorkerRegistration: serviceWorkerRegistration, // 👈 Pass the registration here
    });

    if (currentToken) {
      console.log('FCM Token:', currentToken);
      // Send this token to your server
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token.', error);
    throw error;
  }
};