const express = require("express");
const router = express.Router();
const haversine = require("haversine-distance"); // Ensure this is installed via npm
const supabase = require("../config/supabaseClient"); // Import your Supabase instance

router.post("/find-nearest-volunteers", async (req, res) => {
    try {
        const { user_id, latitude, longitude } = req.body;

        // Validate input
        if (!user_id || isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: "Missing or invalid parameters" });
        }

        // Fetch all volunteer drivers from Supabase
        const { data: drivers, error } = await supabase
            .from("users")
            .select("id, name, latitude, longitude")
            .eq("is_volunteer", true);

        if (error || !drivers) {
            console.error("Error fetching drivers:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        let nearestDrivers = drivers
            .map(driver => {
                const userLocation = { lat: parseFloat(latitude), lon: parseFloat(longitude) };
                const driverLocation = { lat: parseFloat(driver.latitude), lon: parseFloat(driver.longitude) };

                // Calculate distance in meters using Haversine formula
                const distance = haversine(userLocation, driverLocation) / 1000; // Convert meters to KM

                return distance <= 5 ? { ...driver, distance: distance.toFixed(2) } : null;
            })
            .filter(driver => driver !== null) // Remove null values
            .sort((a, b) => a.distance - b.distance); // Sort by nearest distance

        res.json({ nearestDrivers });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
