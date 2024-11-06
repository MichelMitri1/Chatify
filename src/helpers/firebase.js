const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAOMNlA9q2QsnlUfod6yE9xVmp5B-YegkQ",
  authDomain: "chatify-e98b6.firebaseapp.com",
  projectId: "chatify-e98b6",
  storageBucket: "chatify-e98b6.firebasestorage.app",
  messagingSenderId: "342756299177",
  appId: "1:342756299177:web:3fb79e5814b0bea1d074b8",
  measurementId: "G-1QSKGKJH3S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };
