// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "campus-transport.firebaseapp.com",
  databaseURL: "https://campus-transport-default-rtdb.firebaseio.com",
  projectId: "campus-transport",
  storageBucket: "campus-transport.appspot.com",
  messagingSenderId: "620695857489",
  appId: "1:620695857489:web:0a282d2da3e5d011508b70",
  measurementId: "G-FM1F4GVSF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };