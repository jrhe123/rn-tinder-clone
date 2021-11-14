// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbAwtohrZji8wEG6amcSsgUC9M7DbCEI4",
  authDomain: "tinder-rn-29674.firebaseapp.com",
  projectId: "tinder-rn-29674",
  storageBucket: "tinder-rn-29674.appspot.com",
  messagingSenderId: "941684956060",
  appId: "1:941684956060:web:49ea615ead6e66a2bsd0659",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
