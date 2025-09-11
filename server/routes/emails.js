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
  fetchSingleEmailPublic, // IMPORT THE NEW FUNCTION
} = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");

// --- PUBLIC ROUTES ---
router.post("/search-public", searchEmailsPublic);
// NEW: Public route to get a single email by ID
router.get("/public/:id", fetchSingleEmailPublic);

// --- PROTECTED ROUTES ---
router.use(authMiddleware);

router.get("/inbox", fetchEmails);
router.get("/:id", fetchSingleEmail);
router.post("/send", sendEmail);
router.post("/reply", replyEmail);
router.post("/forward", forwardEmail);
router.post("/search-emails", searchEmailsAuthenticated);

module.exports = router;
