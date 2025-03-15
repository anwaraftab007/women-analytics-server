const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// ¿? Update Live Location
router.post("/update-location", async (req, res) => {
  const { user_id, latitude, longitude } = req.body;

  if (!user_id || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const { data, error } = await supabase
    .from("locations")
    .upsert([{ user_id, latitude, longitude, updated_at: new Date() }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Location updated successfully", data });
});

module.exports = router;
