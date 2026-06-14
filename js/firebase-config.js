import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDpRZeiSljMgP9wMj-IOMpObefprk1fl0w",
    authDomain: "chav-mayechi.firebaseapp.com",
    projectId: "chav-mayechi",
    storageBucket: "chav-mayechi.firebasestorage.app",
    messagingSenderId: "1002791831037",
    appId: "1:1002791831037:web:175ffcd6af4c8ccbd70594",
    measurementId: "G-N2VPM6KF1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, db, auth, analytics, storage };