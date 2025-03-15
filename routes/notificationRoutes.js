
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase Admin SDK from environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix for multiline private key
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
    }),
  });
}

// Send Alert Notification
router.post("/send-alert", async (req, res) => {
  try {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: "Missing user_id or message" });
    }

    // Fetch user FCM token from Supabase
    const { data, error } = await supabase
      .from("users")
      .select("fcm_token")
      .eq("id", user_id)
      .single();

    if (error || !data?.fcm_token) {
      return res.status(400).json({ error: "User FCM token not found" });
    }

    // Prepare FCM notification payload
    const payload = {
      notification: { title: "Emergency Alert", body: message },
      token: data.fcm_token,
    };

    // Send notification via Firebase
    await admin.messaging().send(payload);
    res.json({ success: true, message: "Notification sent successfully" });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
