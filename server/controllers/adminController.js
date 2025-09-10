// server/controllers/adminController.js
const Settings = require("../models/Settings");

// Get the current settings
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: "globalSettings" },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    // Exclude the refresh token from the response for security
    const settingsForClient = {
      mainPageSubject: settings.mainPageSubject,
      inboxPageSubject: settings.inboxPageSubject,
    };
    res.status(200).json(settingsForClient);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching settings",
      error: error.message,
    });
  }
};

// Update the settings
const updateSettings = async (req, res) => {
  const { mainPageSubject, inboxPageSubject, googleRefreshToken } = req.body;

  // Basic validation for subject arrays
  if (!Array.isArray(mainPageSubject) || !Array.isArray(inboxPageSubject)) {
    return res
      .status(400)
      .json({ message: "Subjects must be provided as arrays." });
  }

  try {
    const updateData = {
      mainPageSubject,
      inboxPageSubject,
    };

    // Only update the refresh token if a new, non-empty value is provided
    if (
      googleRefreshToken &&
      typeof googleRefreshToken === "string" &&
      googleRefreshToken.trim() !== ""
    ) {
      updateData.googleRefreshToken = googleRefreshToken.trim();
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { key: "globalSettings" },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({
      message: "Settings updated successfully!",
      settings: {
        // Send back the updated, client-safe settings
        mainPageSubject: updatedSettings.mainPageSubject,
        inboxPageSubject: updatedSettings.inboxPageSubject,
      },
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
