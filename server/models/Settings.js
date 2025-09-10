// server/models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  // Using a singleton pattern with a unique key
  key: {
    type: String,
    default: "globalSettings",
    unique: true,
  },
  mainPageSubject: {
    type: String,
    required: true,
    default: "A New Device is using your account", // Default value
  },
  inboxPageSubject: {
    type: String,
    required: true,
    default: "Devil Mail", // Default value
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
