const express = require("express");
const db = require("../firebase");
const { parseXML, buildXML } = require("../utils/xmlParser");

const router = express.Router();

// Handle SOAP Requests
router.post("/Service", async (req, res) => {
  try {
    const soapAction = req.headers.soapaction?.replace(/\"/g, "");
    console.log(`Received SOAP Action: ${soapAction}`);

    const requestBody = await parseXML(req.body);

    switch (soapAction) {
      case "http://moviestarplanet.com/LoadDataForRegisterNewUser":
        return loadCustomizationOptions(res);

      case "http://moviestarplanet.com/IsActorNameUsed":
        return checkUsernameAvailability(requestBody, res);

      case "http://moviestarplanet.com/CreateNewUser":
        return createNewUser(requestBody, res);

      case "http://moviestarplanet.com/LoadActorDetails":
        return loadActorDetails(requestBody, res);

      default:
        res.status(400).send("Unknown SOAP Action");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Load customization options (eyes, noses, etc.)
function loadCustomizationOptions(res) {
  const response = {
    "soap:Envelope": {
      "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
      "soap:Body": {
        "LoadDataForRegisterNewUserResponse": {
          "$": { "xmlns": "http://moviestarplanet.com/" },
          "LoadDataForRegisterNewUserResult": {
            "eyes": {
              "Eye": [
                { "EyeId": 2, "Name": "male_eye1", "SWF": "male_eye1", "SkinId": 2 },
                { "EyeId": 3, "Name": "male_eye2", "SWF": "male_eye2", "SkinId": 2 },
                { "EyeId": 4, "Name": "Boy Next Door", "SWF": "MaleEyes1", "SkinId": 2 },
                { "EyeId": 22, "Name": "Pretty Perfect", "SWF": "female_eyes_2012_sweetstuff2_ms", "SkinId": 1 },
                { "EyeId": 23, "Name": "Fierce Feline", "SWF": "female_cateyes_2013__ms", "SkinId": 1 }
              ]
            },
            "noses": {
              "Nose": [
                { "NoseId": 4, "Name": "Regular", "SWF": "nose_3", "SkinId": 2 },
                { "NoseId": 5, "Name": "Full Nose", "SWF": "nose_4", "SkinId": 2 },
                { "NoseId": 15, "Name": "Freckles", "SWF": "nose_9_freckles", "SkinId": 2 },
                { "NoseId": 16, "Name": "Freckles", "SWF": "nose_8_freckles", "SkinId": 1 }
              ]
            },
            "mouths": {
              "Mouth": [
                { "MouthId": 5, "Name": "Nerdy Smile", "SWF": "male_mouth_2", "SkinId": 2 },
                { "MouthId": 7, "Name": "Cool Cat", "SWF": "female_mouth_3", "SkinId": 1 },
                { "MouthId": 8, "Name": "Hot Guy", "SWF": "male_mouth_3_2009", "SkinId": 2 },
                { "MouthId": 11, "Name": "Pierced", "SWF": "male_mouth_4", "SkinId": 2 },
                { "MouthId": 13, "Name": "Pierced", "SWF": "female_mouth_4", "SkinId": 1 },
                { "MouthId": 15, "Name": "Perfect Pout", "SWF": "poolparty_2011_mouthexpressions4", "SkinId": 1 }
              ]
            },
            "clothes": {
              "Cloth": [
                { "ClothesId": 65, "Name": "90s Man", "SWF": "hair_boys_honey_2", "ClothesCategoryId": 1, "Price": 400, "ShopId": 4, "SkinId": 2, "Scale": 0.3, "Vip": 2, "RegNewUser": 1, "sortorder": 0, "New": 0, "Discount": 0 },
                { "ClothesId": 79, "Name": "S8er Boi", "SWF": "Honey_bottoms_6_boys", "ClothesCategoryId": 3, "Price": 300, "ShopId": 2, "SkinId": 2, "Scale": 0, "Vip": 0, "RegNewUser": 1, "sortorder": 0, "New": 0, "Discount": 0 },
                { "ClothesId": 85, "Name": "Gangsta", "SWF": "Honey_Male_shirt_2", "ClothesCategoryId": 2, "Price": 350, "ShopId": 2, "SkinId": 2, "Scale": 0, "Vip": 0, "RegNewUser": 1, "sortorder": 0, "New": 0, "Discount": 0 }
              ]
            }
          }
        }
      }
    }
  };

  res.set("Content-Type", "text/xml");
  res.send(buildXML(response));
}

// Check if a username is already taken
async function checkUsernameAvailability(requestBody, res) {
  // Log the parsed request body to debug the structure
  console.log(JSON.stringify(requestBody, null, 2));

  // Check if the required structure exists in the requestBody
  if (
    !requestBody["soap:Envelope"] ||
    !requestBody["soap:Envelope"]["soap:Body"] ||
    !requestBody["soap:Envelope"]["soap:Body"][0] ||
    !requestBody["soap:Envelope"]["soap:Body"][0]["tns:IsActorNameUsed"] ||
    !requestBody["soap:Envelope"]["soap:Body"][0]["tns:IsActorNameUsed"][0]["tns:actorName"]
  ) {
    return res.status(400).send("Invalid SOAP request structure");
  }

  // Extract the actor name from the request
  const actorName = requestBody["soap:Envelope"]["soap:Body"][0]["tns:IsActorNameUsed"][0]["tns:actorName"][0];

  // Query the database to check if the actor name is taken
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("Name", "==", actorName).get();

  // Build the response XML
  const response = {
    "soap:Envelope": {
      "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
      "soap:Body": {
        "tns:IsActorNameUsedResponse": {
          "$": { "xmlns:tns": "http://moviestarplanet.com/" },
          "tns:IsActorNameUsedResult": snapshot.empty ? "false" : "true"
        }
      }
    }
  };

  res.set("Content-Type", "text/xml");
  res.send(buildXML(response));
}


// Create a new user
async function createNewUser(requestBody, res) {
  const newUser = requestBody["soap:Envelope"]["soap:Body"][0]["CreateNewUser"][0]["actor"][0];
  
  const userId = Date.now().toString(); // Generate a unique ID
  const userData = {
    ActorId: userId,
    Name: newUser["Name"][0],
    Level: 1,
    Money: 25000000,
    SkinSWF: newUser["SkinSWF"][0],
    SkinColor: newUser["SkinColor"][0],
    EyeId: newUser["EyeId"][0],
    MouthId: newUser["MouthId"][0],
    Password: newUser["Password"][0], // Store safely later
    Created: new Date().toISOString()
  };

  await db.collection("users").doc(userId).set(userData);

  const response = {
    "soap:Envelope": {
      "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
      "soap:Body": {
        "CreateNewUserResponse": {
          "$": { "xmlns": "http://moviestarplanet.com/" },
          "CreateNewUserResult": userData
        }
      }
    }
  };

  res.set("Content-Type", "text/xml");
  res.send(buildXML(response));
}

// Load user details
async function loadActorDetails(requestBody, res) {
  const actorId = requestBody["soap:Envelope"]["soap:Body"][0]["LoadActorDetails"][0]["actorId"][0];
  const userDoc = await db.collection("users").doc(actorId).get();

  if (!userDoc.exists) return res.status(404).send("User not found");

  const userData = userDoc.data();

  const response = {
    "soap:Envelope": {
      "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
      "soap:Body": {
        "LoadActorDetailsResponse": {
          "$": { "xmlns": "http://moviestarplanet.com/" },
          "LoadActorDetailsResult": userData
        }
      }
    }
  };

  res.set("Content-Type", "text/xml");
  res.send(buildXML(response));
}

module.exports = router;
