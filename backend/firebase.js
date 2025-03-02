const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

// Load service account JSON
const serviceAccount = require(path.join(__dirname, "serviceAccount.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();
module.exports = db;
