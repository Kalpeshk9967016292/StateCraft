import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "statecraft-xj1ww",
  appId: "1:947902387560:web:366421b61f068b3adff2dd",
  storageBucket: "statecraft-xj1ww.firebasestorage.app",
  apiKey: "AIzaSyAq6XC6ZzramWYo-zZjrln-mIviAAKdfbY",
  authDomain: "statecraft-xj1ww.firebaseapp.com",
  messagingSenderId: "947902387560"
};


// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Initialize Analytics if supported
const initializeAnalytics = async () => {
    if (typeof window !== "undefined") {
        const isAnalyticsSupported = await isSupported();
        if (isAnalyticsSupported) {
            return getAnalytics(app);
        }
    }
    return null;
};


export { app, db, initializeAnalytics };
