// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCYSWilmmxgvyLYFgXSCttBOLGAGRmfKVE",
  authDomain: "housemarketplace-34b0e.firebaseapp.com",
  projectId: "housemarketplace-34b0e",
  storageBucket: "housemarketplace-34b0e.appspot.com",
  messagingSenderId: "236283975749",
  appId: "1:236283975749:web:1e66093f38b6249652ab2c"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()