const express = require("express");
const router = express.Router();
const {
  fetchEmails,
  sendEmail,
  fetchSingleEmail,
} = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/inbox", authMiddleware, fetchEmails);
router.post("/send", authMiddleware, sendEmail);
router.get("/:id", authMiddleware, fetchSingleEmail);

module.exports = router;
