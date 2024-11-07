// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl0CWGizitX3K19K8ZMqv8jFhhFmruHOU",
  authDomain: "diy-webapp.firebaseapp.com",
  projectId: "diy-webapp",
  storageBucket: "diy-webapp.firebasestorage.app",
  messagingSenderId: "383033885768",
  appId: "1:383033885768:web:55376356bdcf37ebb8847d",
  measurementId: "G-XMRTT4276V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)

export { auth, db, analytics, storage }