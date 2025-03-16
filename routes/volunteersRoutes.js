
const express = require("express");
const router = express.Router();
const haversine = require("haversine-distance"); // Ensure this is installed via npm
const supabase = require("../config/supabaseClient"); // Import your Supabase instance

router.post("/find-nearest-volunteers", async (req, res) => {
    try {
        console.log("¿? Received request body:", req.body); // Log incoming request

        const { user_id, latitude, longitude } = req.body;

        // Validate input
        if (!user_id || isNaN(latitude) || isNaN(longitude)) {
            console.error("¿? Invalid parameters:", { user_id, latitude, longitude });
            return res.status(400).json({ error: "Missing or invalid parameters" });
        }

        // Fetch all volunteer drivers from Supabase
        const { data: drivers, error } = await supabase
            .from("users")
            .select("id, name, latitude, longitude")
            .eq("is_volunteer", true);

        if (error || !drivers) {
            console.error("¿? Error fetching drivers:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        console.log("¿? Fetched drivers:", drivers); // Log fetched drivers

        let nearestDrivers = drivers
            .map(driver => {
                const userLocation = { lat: parseFloat(latitude), lon: parseFloat(longitude) };
                const driverLocation = { lat: parseFloat(driver.latitude), lon: parseFloat(driver.longitude) };

                // Validate driver location
                if (isNaN(driverLocation.lat) || isNaN(driverLocation.lon)) {
                    console.warn("¿ Skipping invalid driver location:", driver);
                    return null;
                }

                // Calculate distance in meters using Haversine formula
                const distance = haversine(userLocation, driverLocation) / 1000; // Convert meters to KM

                console.log(`¿? Distance to ${driver.name} (ID: ${driver.id}): ${distance.toFixed(2)} km`);

                return distance <= 5 ? { ...driver, distance: distance.toFixed(2) } : null;
            })
            .filter(driver => driver !== null) // Remove null values
            .sort((a, b) => a.distance - b.distance); // Sort by nearest distance

        console.log("¿? Final nearest drivers:", nearestDrivers); // Log final sorted list

        res.json({ nearestDrivers });

    } catch (err) {
        console.error("¿? Server error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
