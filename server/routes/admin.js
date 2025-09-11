// server/routes/admin.js
const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/adminController");
const { registerByAdmin } = require("../controllers/authController"); // Import the new function
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// Settings routes
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// NEW: Route for admin to create new users
router.post("/create-user", registerByAdmin);

module.exports = router;
