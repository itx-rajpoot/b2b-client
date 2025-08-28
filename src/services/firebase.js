import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  //  apiKey: "AIzaSyCJBPFZyI2Cvhqq9aoqs3fQ8pK3ZlDHnM4",
  // authDomain: "bitespot-43209.firebaseapp.com",
  // projectId: "bitespot-43209",
  // storageBucket: "bitespot-43209.firebasestorage.app",
  // messagingSenderId: "273627207267",
  // appId: "1:273627207267:web:32b7ccbf8ec7b77f498a56",
  // measurementId: "G-71BWX2GHHZ"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();
firebase.database();

export default firebase;
