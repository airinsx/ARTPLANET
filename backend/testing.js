const db = require("./firebase"); // Import your firebase setup

// Attempt to fetch documents from the 'users' collection
db.collection("users")
  .get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("No documents found in the 'users' collection.");
    } else {
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    }
  })
  .catch((error) => {
    console.error("Error getting documents: ", error);
  });
