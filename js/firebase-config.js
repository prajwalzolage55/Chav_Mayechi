import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js'

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

export { app, db, auth, analytics };