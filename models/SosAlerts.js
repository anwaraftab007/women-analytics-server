const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true, // Unique because ek user ka ek hi active SOS hoga
  },
  username: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically current time lega
  },
});

// Export the model
module.exports = mongoose.model("SosAlert", sosAlertSchema);
