// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";   
import { getFirestore } from "firebase/firestore";
import { firebase } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoI8JHqj1lAiOiAsB0PBed-uTuZH0fX6M",
  authDomain: "inventory-management-c70f5.firebaseapp.com",
  projectId: "inventory-management-c70f5",
  storageBucket: "inventory-management-c70f5.appspot.com",
  messagingSenderId: "1043743926369",
  appId: "1:1043743926369:web:f1d28b143f72071fb5a220",
  measurementId: "G-4FK2TE725H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};