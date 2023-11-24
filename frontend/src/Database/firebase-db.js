// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = process.env.REACT_APP_FIREBASE_APIKEY ? process.env.REACT_APP_FIREBASE_APIKEY : "www.key.com";

const authDomain = process.env.REACT_APP_FIREBASE_AUTHDOMAIN ? process.env.REACT_APP_FIREBASE_AUTHDOMAIN : "www.key.com";

const projectId = process.env.REACT_APP_FIREBASE_PROJECTID ? process.env.REACT_APP_FIREBASE_PROJECTID : "www.key.com";

const storageBucket = process.env.REACT_APP_FIREBASE_STORAGEBUCKET ? process.env.REACT_APP_FIREBASE_STORAGEBUCKET : "www.key.com";

const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID ? process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID : "www.key.com";

const appId = process.env.REACT_APP_FIREBASE_APPID ? process.env.REACT_APP_FIREBASE_APPID : "www.key.com";

const measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENTID ? process.env.REACT_APP_FIREBASE_MEASUREMENTID : "www.key.com";


const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);