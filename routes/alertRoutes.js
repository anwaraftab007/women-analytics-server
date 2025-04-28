const express = require("express");
const router = express.Router();
const SosAlert = require("../models/SosAlerts");

// 🚨 Trigger or Update SOS Alert
router.post("/sos", async (req, res) => {
  const { user_id, username, latitude, longitude } = req.body;

  if (!user_id || !username || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Check if SOS already exists for user
    const existingSos = await SosAlert.findOne({ user_id });

    if (existingSos) {
      // Update the existing SOS alert
      existingSos.latitude = latitude;
      existingSos.longitude = longitude;
      existingSos.timestamp = new Date();
      await existingSos.save();

      return res.json({ message: "SOS Alert Updated!", data: existingSos });
    } else {
      // Create a new SOS alert
      const newSos = new SosAlert({
        user_id,
        username,
        latitude,
        longitude,
      });

      await newSos.save();
      return res.json({ message: "SOS Alert Created!", data: newSos });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
