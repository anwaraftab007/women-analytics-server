const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const http = require("http");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// Import Routes
const locationRoutes = require("./routes/locationRoutes");
const alertRoutes = require("./routes/alertRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Use Routes
app.use("/api/location", locationRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/notification", notificationRoutes);

// ¿? Live Location Updates via WebSockets
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("updateLocation", async (data) => {
    console.log("Live location received:", data);

    // Save to Supabase
    const { user_id, latitude, longitude } = data;
    await supabase
      .from("locations")
      .upsert([{ user_id, latitude, longitude, updated_at: new Date() }]);

    // Broadcast to nearby users
    io.emit("locationUpdate", data);
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
