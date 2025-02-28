// Firebase configuration
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
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Example: Accessing Firestore collection
  db.collection("users").get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data());
    });
  }).catch(error => {
    console.error("Error getting documents: ", error);
  });
  