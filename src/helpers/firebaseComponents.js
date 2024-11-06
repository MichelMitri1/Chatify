import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADStsbCX2wPmrKKmCDSXmoJJLfaz4Zudc",
  authDomain: "chatify-f37da.firebaseapp.com",
  projectId: "chatify-f37da",
  storageBucket: "chatify-f37da.appspot.com",
  messagingSenderId: "436248496102",
  appId: "1:436248496102:web:8e1bfb6f478684507c7827",
  measurementId: "G-WWCDX5FJJ3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
