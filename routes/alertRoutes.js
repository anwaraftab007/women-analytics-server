const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// ¿? Trigger SOS Alert
router.post("/sos", async (req, res) => {
  const { user_id, latitude, longitude } = req.body;

  if (!user_id || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // Save alert in database
  const { data, error } = await supabase
    .from("sos_alerts")
    .insert([{ user_id, latitude, longitude, timestamp: new Date() }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "SOS Alert Sent!", data });
});

module.exports = router;
