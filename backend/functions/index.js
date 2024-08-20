const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAcc = require(
    "./usf-parking-firebase-adminsdk-1pyqp-ad928ee0f3.json");
const express = require("express");
const cors = require("cors");

admin.initializeApp({credential: admin.credential.cert(serviceAcc)});
const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(cors());

/**
 * Starts the server, gets doc id's from parkingspaces
 * collection and establishes listeners for each
 * parkingspace doc id
 */

async function startServer() {
  try {
    const parkingSpaceRef = db.collection("parkingspaces");
    const parkingSpaceIds = [];

    const snapshot = await parkingSpaceRef.get();

    snapshot.forEach((doc) => {
      parkingSpaceIds.push(doc.id);
    });

    const parkingSpaceRefs = parkingSpaceIds.map(
        (id) => db.collection("parkingspaces").doc(id),
    );

    parkingSpaceRefs.forEach((parkingSpaceRef) => {
      const availableSensorsQuery = db.collection("sensors")
          .where("parkingspace", "==", parkingSpaceRef)
          .where("available", "==", true);

      availableSensorsQuery.onSnapshot((snapshot) => {
        const availableSensorsCount = snapshot.size;
        console.log(
            `Available sensors for ${parkingSpaceRef.id}: ${availableSensorsCount}`,
        );
        parkingSpaceRef.update({
          openspots: availableSensorsCount,
          lastupdated: admin.firestore.FieldValue.serverTimestamp(),
        })
            .then(() => {
              console.log(`Updated ${parkingSpaceRef.id}'s openspots field successfully`);
            })
            .catch((error) => {
              console.error("Error updating openspots field:", error);
            });
      }, (error) => {
        console.error("Error listening for available sensors:", error);
      });
    });
  } catch (error) {
    console.error("Error updating openspots field:", error);
  }
}

app.post("/sensordata", (req, res) => {
  const {sensorToken, status} = req.body;
  let availablityStatus;

  if (!sensorToken || status === undefined || status === null) {
    return res.status(400).json({error: "Missing required fields"});
  }

  if (status == true) {
    availablityStatus = true;
  } else if (status == false) {
    availablityStatus = false;
  } else {
    return res.status(400).json({error: "Invalid status type"});
  }

  const sensorRef = db.collection("sensors").doc(sensorToken);
  sensorRef.get()
      .then((doc) => {
        if (doc.exists) {
          return sensorRef.update({available: availablityStatus});
        } else {
          return res.status(404).json({error: "Invalid token"});
        }
      })
      .then(() => {
        res.json("Sensor succesfully updated");
      })
      .catch((error) => {
        console.log("Error updating sensor data:", error);
        res.status(500).json({error: "Internal server error"});
      });
});

startServer();

exports.app = functions.runWith({timeoutSeconds: 20}).https.onRequest(app);
