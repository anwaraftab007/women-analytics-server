const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const haversine = require("haversine-distance"); // To calculate distance

router.post("/find-nearest-volunteers", async (req, res) => {
        res.status(500).send("WOrking");
});

module.exports = router;
