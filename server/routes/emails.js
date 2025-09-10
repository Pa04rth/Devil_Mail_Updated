// server/routes/emails.js
const express = require("express");
const router = express.Router();
const {
  fetchEmails,
  sendEmail,
  fetchSingleEmail,
  replyEmail,
  forwardEmail,
  searchEmailsAuthenticated,
  searchEmailsPublic,
} = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");

// --- PUBLIC ROUTE ---
// No auth middleware for the public search
router.post("/search-public", searchEmailsPublic);

// --- PROTECTED ROUTES ---
// All routes below this line require authentication
router.use(authMiddleware);

router.get("/inbox", fetchEmails);
router.get("/:id", fetchSingleEmail);
router.post("/send", sendEmail);
router.post("/reply", replyEmail);
router.post("/forward", forwardEmail);

// This replaces the old /search-emails route logic
router.post("/search-emails", searchEmailsAuthenticated);

module.exports = router;
