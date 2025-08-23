const express = require("express");
const router = express.Router();
const {
  fetchEmails,
  sendEmail,
  fetchSingleEmail,
  replyEmail,
  forwardEmail,
} = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/inbox", authMiddleware, fetchEmails);
router.post("/send", authMiddleware, sendEmail);
router.get("/:id", authMiddleware, fetchSingleEmail);
router.post("/reply", authMiddleware, replyEmail);
router.post("/forward", authMiddleware, forwardEmail);

module.exports = router;
