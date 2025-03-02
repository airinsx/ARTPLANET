const admin = require("firebase-admin");
const path = require("path");

// Load service account JSON file from the current directory
const serviceAccount = require(path.join(__dirname, "serviceAccount.json"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://xcxworld-bfa04.firebaseio.com' // Replace with your project ID
});

// Firestore reference
const db = admin.firestore();

module.exports = db;
