import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration (from user)
const firebaseConfig = {
  apiKey: "AIzaSyBNrPmX1rh7wLkzzr8oRjJx1agS-xa-Uh4",
  authDomain: "liftup-e1bc3.firebaseapp.com",
  projectId: "liftup-e1bc3",
  storageBucket: "liftup-e1bc3.firebasestorage.app",
  messagingSenderId: "466023416635",
  appId: "1:466023416635:web:536d854335878015462d1e",
  measurementId: "G-H5FL6TD5PL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
export { analytics };

export default app;