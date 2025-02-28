// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcivk9-MzfaDgIqqJg21AxQ2EMkDxbDqk",
  authDomain: "xcxworld-bfa04.firebaseapp.com",
  projectId: "xcxworld-bfa04",
  storageBucket: "xcxworld-bfa04.firebasestorage.app",
  messagingSenderId: "24945210033",
  appId: "1:24945210033:web:fc92e8e43f3df7b846a890",
  measurementId: "G-4JFGTL2EL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app);

// Get Firestore instance
const db = getFirestore(app);

// Check if Firestore is working
console.log("Firestore instance:", db);

// You can now interact with Firestore, for example:
console.log("Now you can interact with your Firestore database.");