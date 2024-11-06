const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyADD501uxvf9JjBrINoYdK_OO9Hx6LefyI",
  authDomain: "chatify-f26a8.firebaseapp.com",
  projectId: "chatify-f26a8",
  storageBucket: "chatify-f26a8.firebasestorage.app",
  messagingSenderId: "53582935298",
  appId: "1:53582935298:web:cb872d92aae7fb3650be1b",
  measurementId: "G-7L670404BK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };
