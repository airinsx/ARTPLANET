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


// Data for the "Admin" account
const adminData = {
    actorId: 1,
    name: "Admin",
    level: 20,
    skinSWF: "male",
    skinColor: 16764057,
    noseId: 4,
    eyeId: 8,
    mouthId: 5,
    money: 3202521,
    eyeColors: ["0x336600", "0x000000", "skincolor"],
    fame: 9111998,
    fortune: 2202831,
    friendCount: "NaN",
    isExtra: 0,
    invitedByActorId: -1,
    moderator: 0,
    valueOfGiftsReceived: 1100,
    valueOfGiftsGiven: 0,
    numberOfGiftsGiven: 0,
    numberOfGiftsReceived: 23,
    numberOfAutographsReceived: 2170,
    numberOfAutographsGiven: 0,
    timeOfLastAutographGiven: "1969-12-31 19:00:00Z",
    facebookId: "",
    boyfriendId: 0,
    boyfriendStatus: 0,
    membershipPurchasedDate: "1969-12-31T19:00:00",
    membershipTimeoutDate: "2100-09-26T20:00:00",
    membershipGiftReceivedDate: "2022-06-03T15:12:16",
    totalVipDays: 1000,
    actorClothesRels: [
      { actorClothesRelId: 1, clothesId: 1599, color: 13395507, isWearing: 1 },
      { actorClothesRelId: 2, clothesId: 2753, color: "0xC6D9EC,0x003366", isWearing: 1 },
      { actorClothesRelId: 3, clothesId: 83, color: "0x996633,0xd8b18b", isWearing: 1 },
      { actorClothesRelId: 4, clothesId: 1944, color: "0x9966cc,0xcccc99,0xffffff", isWearing: 1 }
    ],
    actorAnimationRels: [],
    actorMusicRels: [],
    actorBackgroundRels: [],
    boyFriend: {},
    eye: {
      eyeId: 8,
      name: "The Man",
      swf: "Honey_male_eyes_2_2009",
      skinId: 2
    },
    nose: {
      noseId: 4,
      name: "Regular",
      swf: "nose_3",
      skinId: 2
    },
    mouth: {
      mouthId: 5,
      name: "Nerdy Smile",
      swf: "male_mouth_2",
      skinId: 2
    }
  };
  
  // Add the admin data to Firestore under the "users" collection
  async function createAdminAccount() {
    try {
      const docRef = await addDoc(collection(db, "users"), adminData);
      console.log("Admin account created with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  
  // Call the function to create the admin account
  createAdminAccount();