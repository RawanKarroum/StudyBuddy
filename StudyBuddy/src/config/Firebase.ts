// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "study-buddy-82f74.firebaseapp.com",
  projectId: "study-buddy-82f74",
  storageBucket: "study-buddy-82f74.appspot.com",
  messagingSenderId: "248777893291",
  appId: "1:248777893291:web:248ee074fa649e85ff9eee",
  measurementId: "G-K7MTGSRTW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app)

export { db, auth, storage };