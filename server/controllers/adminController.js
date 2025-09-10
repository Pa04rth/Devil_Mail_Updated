// server/controllers/adminController.js
const Settings = require("../models/Settings");

// Get the current settings
const getSettings = async (req, res) => {
  try {
    // Find the single settings document, or create it if it doesn't exist
    const settings = await Settings.findOneAndUpdate(
      { key: "globalSettings" },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching settings",
      error: error.message,
    });
  }
};

// Update the settings
const updateSettings = async (req, res) => {
  const { mainPageSubject, inboxPageSubject } = req.body;

  if (!mainPageSubject || !inboxPageSubject) {
    return res
      .status(400)
      .json({ message: "Both subject fields are required." });
  }

  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      { key: "globalSettings" },
      { mainPageSubject, inboxPageSubject },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({
      message: "Settings updated successfully!",
      settings: updatedSettings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
