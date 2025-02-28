// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app);

// Function to fetch data from Firestore (example)
async function getUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

getUsers();  // Call the function to see the data
