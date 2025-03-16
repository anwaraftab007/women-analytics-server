const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const haversine = require("haversine-distance"); // To calculate distance

router.post("/find-nearest-volunteers", async (req, res) => {
    try {
        const { user_id, latitude, longitude } = req.body;

        if (!user_id || !latitude || !longitude) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        // Fetch all volunteer drivers from Supabase
        const { data: drivers, error } = await supabase
            .from("users")
            .select("id, name, latitude, longitude")
            .eq("is_volunteer", true);

        if (error) {
            console.error("Error fetching drivers:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        let nearestDrivers = [];

        drivers.forEach(driver => {
            const userLocation = { lat: latitude, lon: longitude };
            const driverLocation = { lat: driver.latitude, lon: driver.longitude };

            // Calculate distance using Haversine formula
            const distance = haversine(userLocation, driverLocation) / 1000; // Convert meters to KM

            if (distance <= 5) { // Only include drivers within 5 km
                nearestDrivers.push({ ...driver, distance: distance.toFixed(2) });
            }
        });

        // Sort by nearest distance
        nearestDrivers.sort((a, b) => a.distance - b.distance);

        res.json({ nearestDrivers });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).send("Internal Server Error", err);
    }
});

module.exports = router;
