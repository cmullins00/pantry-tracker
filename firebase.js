// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBw587xW4OFjSNUWmW0TmiYrH6dEDKJr_g",
  authDomain: "inventory-management-f5691.firebaseapp.com",
  projectId: "inventory-management-f5691",
  storageBucket: "inventory-management-f5691.appspot.com",
  messagingSenderId: "951764228553",
  appId: "1:951764228553:web:1a28a84cbd6891530cb018",
  measurementId: "G-67JV9LSC76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };