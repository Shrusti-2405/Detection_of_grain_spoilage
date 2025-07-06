const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const axios = require("axios");
const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Twilio Configuration - use environment variables
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const RECEIVER_PHONE = process.env.RECEIVER_PHONE_NUMBER;

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
const sensorRef = db.ref("SensorData");

app.use(cors());

// Function to send SMS alerts
const sendSMSAlert = async (message) => {
  try {
    if (!TWILIO_PHONE || !RECEIVER_PHONE) {
      console.error("Twilio phone numbers are not set properly");
      return;
    }

    const msg = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE,
      to: RECEIVER_PHONE,
    });
    console.log(`✅ SMS Alert Sent: ${msg.sid}`);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
  }
};

// Function to check sensor values and send alerts
const checkThresholdAndAlert = (data) => {
  if (data.Temperature > 35) {
    sendSMSAlert(`🔥 High Temperature Alert: ${data.Temperature}°C`);
  }
  if (data.Humidity > 70) {
    sendSMSAlert(`💧 High Humidity Alert: ${data.Humidity}%`);
  }
  if (data.CO2 > 800) {
    sendSMSAlert(`⚠️ High Gas Level Alert: ${data.CO2} PPM`);
  }
};

// **Real-time data streaming using Server-Sent Events (SSE)**
app.get("/api/SensorData", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log("Client connected to SSE");

  // Function to fetch ThingSpeak data
  const fetchThingSpeakData = async () => {
    try {
      const response = await axios.get(`https://api.thingspeak.com/channels/2824763/feeds.json?api_key=${process.env.THINGSPEAK_API_KEY}&results=1`);

      if (!response.data || !response.data.feeds || response.data.feeds.length === 0) {
        console.error("ThingSpeak response is empty");
        return null;
      }

      const feed = response.data.feeds[0];

      return {
        Temperature: feed?.field1 ? parseFloat(feed.field1) : 0,
        Humidity: feed?.field2 ? parseFloat(feed.field2) : 0,
        CO2: feed?.field3 ? parseFloat(feed.field3) : 0,
      };

    } catch (error) {
      console.error("Error fetching data from ThingSpeak:", error.response?.data || error.message);
      return null;
    }
  };

  // Function to send data to client & check for alerts
  const sendData = async (snapshot) => {
    try {
      const firebaseData = snapshot.val();
      const thingSpeakData = await fetchThingSpeakData();

      let co2Value = firebaseData?.GasLevel !== undefined ? parseFloat(firebaseData.GasLevel) || 0 
                    : thingSpeakData?.CO2 !== undefined ? parseFloat(thingSpeakData.CO2) || 0 
                    : 0;

      const data = {
        Temperature: firebaseData?.Temperature ?? thingSpeakData?.Temperature ?? 0,
        Humidity: firebaseData?.Humidity ?? thingSpeakData?.Humidity ?? 0,
        CO2: co2Value,
      };

      console.log("Final Data Sent:", data);
      res.write(`data: ${JSON.stringify(data)}\n\n`);

      // Check threshold values and send SMS alerts
      checkThresholdAndAlert(data);

    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Listen for Firebase changes
  sensorRef.on("value", sendData);

  // Keep the connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ keepAlive: true })}\n\n`);
  }, 30000);

  req.on("close", () => {
    console.log("Client disconnected from SSE");
    sensorRef.off("value", sendData);
    clearInterval(keepAlive);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
