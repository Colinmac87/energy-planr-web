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
  apiKey: "AIzaSyADV_ac09cns4wMjsjyn6olU4Rph7lC8hY",
  authDomain: "energy-planr-dev.firebaseapp.com",
  projectId: "energy-planr-dev",
  storageBucket: "energy-planr-dev.appspot.com",
  messagingSenderId: "496131233494",
  appId: "1:496131233494:web:774b57e1b0562e8eca9b77",
  measurementId: "G-Q7JZKS0TTK",
};

// Initialize Firebase

let app, analytics, auth, db;

export const initFirebase = () => {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
};

export { app, analytics, auth, db };
