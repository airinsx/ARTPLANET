// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);