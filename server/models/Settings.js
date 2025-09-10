// server/models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: "globalSettings",
    unique: true,
  },
  // Changed from String to an Array of Strings
  mainPageSubject: {
    type: [String],
    default: ["A New Device is using your account"],
  },
  // Changed from String to an Array of Strings
  inboxPageSubject: {
    type: [String],
    default: ["Devil Mail"],
  },
  // New field to store the refresh token
  googleRefreshToken: {
    type: String,
    default: null, // Default to null, so we can fall back to the .env file
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
