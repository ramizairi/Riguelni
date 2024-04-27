import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBLfeEjbChYBP8Z2YmR1U-E4hhb7fP-iSY",
  authDomain: "riguelni-dfbb5.firebaseapp.com",
  projectId: "riguelni-dfbb5",
  storageBucket: "riguelni-dfbb5.appspot.com",
  messagingSenderId: "569837791009",
  appId: "1:569837791009:web:285290dd840fae66758060",
  measurementId: "G-MLWSHDJ7MG"
};


const app = initializeApp(firebaseConfig);
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);