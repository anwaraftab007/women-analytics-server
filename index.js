
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const http = require("http");
const { supabase } = require("./config/supabaseClient"); // �? Import Supabase client

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// Import Routes
const locationRoutes = require("./routes/locationRoutes");
const alertRoutes = require("./routes/alertRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
const volunteersRoutes = require("./routes/volunteersRoutes");

// Use Routes
app.use("/api/location", locationRoutes);
app.use("/api/alert", alertRoutes);
// app.use("/api/notification", notificationRoutes);
// app.use("/api/volunteers", volunteersRoutes);

// �? Fixed Dummy API (Testing Route)
app.use("/testing", (req, res) => {
    const { use_u, lat, long } = req.body;

    if (!use_u || !lat || !long) {
        return res.status(400).json({ message: "Missing required fields!" });
    }

    res.json({
        status: "Working",
        message: "Received the details successfully!",
        data: {
            user_id: use_u,
            latitude: lat,
            longitude: long
        }
    });
});

// �? Live Location Updates via WebSockets
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("updateLocation", async (data) => {
        console.log("Live location received:", data);

        const { user_id, latitude, longitude } = data;

        // �? Error Handling for Supabase
        const { error } = await supabase
            .from("locations")
            .upsert([{ user_id, latitude, longitude, updated_at: new Date() }]);

        if (error) {
            console.error("Error updating location:", error.message);
            return socket.emit("error", { message: "Failed to update location." });
        }

        // �? Broadcast to all clients
        io.emit("locationUpdate", data);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});

// �? Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
