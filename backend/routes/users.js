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

      case "http://moviestarplanet.com/GetLatestServerException":
        return getLatestServerException(res);

      case "http://moviestarplanet.com/SaveEntitySnapshot":
        return saveEntitySnapshot(requestBody, res);

      case "http://moviestarplanet.com/getNowAsString":
        return getNowAsString(res);

      case "http://moviestarplanet.com/GetAppSetting":
        return getAppSetting(requestBody, res);

      case "http://moviestarplanet.com/LoadActorWithCurrentClothesBasicDataOnly":
        return loadActorWithCurrentClothes(requestBody, res);

      default:
        res.status(400).send("Unknown SOAP Action");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle GetLatestServerException (returns empty response)
function getLatestServerException(res) {
  const response = {
    "soap:Envelope": {
      "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
      "soap:Body": {
        "GetLatestServerExceptionResponse": {
          "$": { "xmlns": "http://moviestarplanet.com/" },
          "GetLatestServerExceptionResult": ""
        }
      }
    }
  };

  res.set("Content-Type", "text/xml");
  res.send(buildXML(response));
}

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
  try {
    if (
      !requestBody ||
      !requestBody["soap:Envelope"] ||
      !requestBody["soap:Envelope"]["soap:Body"] ||
      !requestBody["soap:Envelope"]["soap:Body"][0]["IsActorNameUsed"] ||
      !requestBody["soap:Envelope"]["soap:Body"][0]["IsActorNameUsed"][0]["actorName"]
    ) {
      return res.status(400).send("Invalid SOAP Request");
    }

    const actorName = requestBody["soap:Envelope"]["soap:Body"][0]["IsActorNameUsed"][0]["actorName"][0];

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("Name", "==", actorName).get();

    const response = {
      "soap:Envelope": {
        "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
        "soap:Body": {
          "IsActorNameUsedResponse": {
            "$": { "xmlns": "http://moviestarplanet.com/" },
            "IsActorNameUsedResult": snapshot.empty ? "false" : "true"
          }
        }
      }
    };

    res.set("Content-Type", "text/xml");
    res.send(buildXML(response));
  } catch (error) {
    console.error("Error in IsActorNameUsed:", error);
    res.status(500).send("Internal Server Error");
  }
}


// Create a new user
async function createNewUser(requestBody, res) {
  const newUser = requestBody["soap:Envelope"]["soap:Body"][0]["CreateNewUser"][0]["actor"][0];

  const userId = Date.now().toString(); // Generate a unique ID
  const userData = {
    ActorId: userId,
    Name: newUser["Name"][0],
    Level: parseInt(newUser["Level"][0]) || 1,
    Money: parseInt(newUser["Money"][0]) || 25000,
    Fame: parseInt(newUser["Fame"][0]) || 0,
    Fortune: parseInt(newUser["Fortune"][0]) || 0,
    SkinSWF: newUser["SkinSWF"][0],
    SkinColor: newUser["SkinColor"][0],
    EyeId: newUser["EyeId"][0],
    MouthId: newUser["MouthId"][0],
    Password: newUser["Password"][0], // 🚨 Store safely later!
    Created: new Date().toISOString(),
    LastLogin: null,
    Email: null,
    Moderator: parseInt(newUser["Moderator"][0]) || 0,
    ProfileText: newUser["ProfileText"][0] || "",
    Inventory: [],
    Friends: []
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

// SaveEntitySnapshot (Saves player state)
async function saveEntitySnapshot(requestBody, res) {
  try {
    const data = requestBody["soap:Envelope"]["soap:Body"][0]["SaveEntitySnapshot"][0];
    const entityId = data["entityId"][0];
    const entityType = data["EntityType"][0];
    const snapshotData = data["data"][0]; // Base64-encoded snapshot

    await db.collection("snapshots").doc(entityId).set({
      entityType,
      snapshotData,
      timestamp: new Date().toISOString(),
    });

    const response = {
      "soap:Envelope": {
        "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
        "soap:Body": {
          "SaveEntitySnapshotResponse": {
            "$": { "xmlns": "http://moviestarplanet.com/" },
            "SaveEntitySnapshotResult": {},
          },
        },
      },
    };

    res.set("Content-Type", "text/xml");
    res.send(buildXML(response));
  } catch (error) {
    console.error("Error in SaveEntitySnapshot:", error);
    res.status(500).send("Internal Server Error");
  }
}

// getNowAsString (Returns current server time)
function getNowAsString(res) {
  const response = {
    "soap:Envelope": {
      "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
      "soap:Body": {
        "getNowAsStringResponse": {
          "$": { "xmlns": "http://moviestarplanet.com/" },
          "getNowAsStringResult": new Date().toISOString().replace("T", " ").split(".")[0] + "Z",
        },
      },
    },
  };

  res.set("Content-Type", "text/xml");
  res.send(buildXML(response));
}

// GetAppSetting (Returns a setting like FMSAppName)
function getAppSetting(requestBody, res) {
  const key = requestBody["soap:Envelope"]["soap:Body"][0]["GetAppSetting"][0]["key"][0];

  const settings = {
    FMSAppName: "196.251.89.98/xcxworld", // Example setting
  };

  const response = {
    "soap:Envelope": {
      "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
      "soap:Body": {
        "GetAppSettingResponse": {
          "$": { "xmlns": "http://moviestarplanet.com/" },
          "GetAppSettingResult": settings[key] || "",
        },
      },
    },
  };

  res.set("Content-Type", "text/xml");
  res.send(buildXML(response));
}

// LoadActorWithCurrentClothesBasicDataOnly (Returns user’s avatar appearance)
async function loadActorWithCurrentClothes(requestBody, res) {
  try {
    const actorId = requestBody["soap:Envelope"]["soap:Body"][0]["LoadActorWithCurrentClothesBasicDataOnly"][0]["actorId"][0];

    const userDoc = await db.collection("users").doc(actorId).get();
    if (!userDoc.exists) return res.status(404).send("User not found");

    const userData = userDoc.data();
    const response = {
      "soap:Envelope": {
        "$": { "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/" },
        "soap:Body": {
          "LoadActorWithCurrentClothesBasicDataOnlyResponse": {
            "$": { "xmlns": "http://moviestarplanet.com/" },
            "LoadActorWithCurrentClothesBasicDataOnlyResult": userData,
          },
        },
      },
    };

    res.set("Content-Type", "text/xml");
    res.send(buildXML(response));
  } catch (error) {
    console.error("Error in LoadActorWithCurrentClothesBasicDataOnly:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = router;
