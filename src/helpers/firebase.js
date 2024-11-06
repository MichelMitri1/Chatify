const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

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
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };
