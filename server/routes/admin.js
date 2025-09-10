// server/routes/admin.js
const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/settings
router.get("/settings", getSettings);

// PUT /api/admin/settings
router.put("/settings", updateSettings);

module.exports = router;
