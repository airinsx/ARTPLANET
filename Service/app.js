// Import Firebase modules using the correct syntax for modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase configuration (copy-paste from your Firebase Console)
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

// Get Firestore instance
const db = getFirestore(app);

// You can now use the db instance to access Firestore
