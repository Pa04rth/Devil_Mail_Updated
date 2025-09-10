// server/controllers/emailController.js
const { google } = require("googleapis");
const config = require("../config");
const Settings = require("../models/Settings"); // Import the Settings model

// Helper function to get the Gmail service
const getGmailService = () => {
  const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN,
  });
  return google.gmail({ version: "v1", auth: oauth2Client });
};

// Helper to format emails to prevent code duplication
const formatEmailFromResponse = (response) => {
  const detail = response.data;
  const headers = detail.payload.headers;
  const getHeader = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ||
    "";

  let body = "";
  if (detail.payload.parts) {
    const part =
      detail.payload.parts.find((p) => p.mimeType === "text/html") ||
      detail.payload.parts.find((p) => p.mimeType === "text/plain");
    if (part && part.body.data) {
      body = Buffer.from(part.body.data, "base64").toString("utf8");
    }
  } else if (detail.payload.body.data) {
    body = Buffer.from(detail.payload.body.data, "base64").toString("utf8");
  }

  return {
    id: detail.id,
    subject: getHeader("subject"),
    from: getHeader("from"),
    to: getHeader("to"),
    body,
    snippet: detail.snippet,
    timestamp: new Date(getHeader("date")),
    isRead: !detail.labelIds.includes("UNREAD"),
    threadId: detail.threadId,
  };
};

// --- AUTHENTICATED ---
const fetchEmails = async (req, res) => {
  try {
    const gmail = getGmailService();
    const targetEmail = req.user.email;

    const searchResponse = await gmail.users.messages.list({
      userId: "me",
      q: `to:${targetEmail}`,
      maxResults: 25,
    });

    const messages = searchResponse.data.messages;
    if (!messages || messages.length === 0) {
      return res.json([]);
    }

    const emailPromises = messages.map((msg) =>
      gmail.users.messages.get({ userId: "me", id: msg.id, format: "full" })
    );
    const emailResponses = await Promise.all(emailPromises);
    const formattedEmails = emailResponses.map(formatEmailFromResponse);

    res.json(formattedEmails);
  } catch (error) {
    console.error("Error fetching from Gmail API:", error);
    res.status(500).json({ error: "Failed to fetch emails from Gmail." });
  }
};

// --- MODIFIED for Authenticated Users ---
const searchEmailsAuthenticated = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  try {
    const settings = await Settings.findOne({ key: "globalSettings" });
    const subject = settings ? settings.inboxPageSubject : "Devil Mail"; // Fallback subject
    const gmail = getGmailService();

    const searchQuery = `to:(${email}) subject:(${subject})`;

    const searchResponse = await gmail.users.messages.list({
      userId: "me",
      q: searchQuery,
      maxResults: 50,
    });

    const messages = searchResponse.data.messages;
    if (!messages || messages.length === 0) {
      return res.json({ success: true, count: 0, searchQuery, emails: [] });
    }

    const emailPromises = messages.map((msg) =>
      gmail.users.messages.get({ userId: "me", id: msg.id, format: "full" })
    );
    const emailResponses = await Promise.all(emailPromises);
    const formattedEmails = emailResponses.map(formatEmailFromResponse);

    res.json({
      success: true,
      count: formattedEmails.length,
      searchQuery,
      emails: formattedEmails,
    });
  } catch (error) {
    console.error("Error searching emails:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to search emails." });
  }
};

// --- NEW Public Search Endpoint ---
const searchEmailsPublic = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  try {
    const settings = await Settings.findOne({ key: "globalSettings" });
    const subject = settings
      ? settings.mainPageSubject
      : "A New Device is using your account";
    const gmail = getGmailService();

    const searchQuery = `to:(${email}) subject:(${subject})`;

    const searchResponse = await gmail.users.messages.list({
      userId: "me",
      q: searchQuery,
      maxResults: 50,
    });

    const messages = searchResponse.data.messages;
    if (!messages || messages.length === 0) {
      return res.json({ success: true, count: 0, searchQuery, emails: [] });
    }

    const emailPromises = messages.map((msg) =>
      gmail.users.messages.get({ userId: "me", id: msg.id, format: "full" })
    );
    const emailResponses = await Promise.all(emailPromises);
    const formattedEmails = emailResponses.map(formatEmailFromResponse);

    res.json({
      success: true,
      count: formattedEmails.length,
      searchQuery,
      emails: formattedEmails,
    });
  } catch (error) {
    console.error("Error during public email search:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to search emails publicly." });
  }
};

const fetchSingleEmail = async (req, res) => {
  try {
    const gmail = getGmailService();
    const emailId = req.params.id;
    const emailResponse = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "full",
    });

    const formattedEmail = {
      id: emailResponse.data.id,
      subject: emailResponse.data.payload.headers.find(
        (h) => h.name === "Subject"
      )?.value,
      from: emailResponse.data.payload.headers.find((h) => h.name === "From")
        ?.value,
      body: formatEmailFromResponse(emailResponse).body,
    };
    res.json(formattedEmail);
  } catch (error) {
    console.error("Error fetching single email from Gmail API:", error);
    res.status(500).json({ error: "Failed to fetch single email." });
  }
};

const sendEmail = async (req, res) => {
  const fromEmail = req.user.email;
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const gmail = getGmailService();
    const email = [
      `From: ${fromEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      body,
    ].join("\n");
    const base64EncodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: base64EncodedEmail },
    });
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};

const replyEmail = async (req, res) => {
  const fromEmail = req.user.email;
  const { to, subject, body, originalId } = req.body;

  if (!to || !subject || !body || !originalId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: config.GOOGLE_REFRESH_TOKEN,
    });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const email = [
      `From: ${fromEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      body,
    ].join("\n");

    const base64EncodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64EncodedEmail,
        threadId: originalId, // reply in the same thread
      },
    });
    res.json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ error: "Failed to send reply." });
  }
};

const forwardEmail = async (req, res) => {
  const fromEmail = req.user.email;
  const { to, subject, body, originalId } = req.body;

  if (!to || !subject || !body || !originalId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: config.GOOGLE_REFRESH_TOKEN,
    });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const email = [
      `From: ${fromEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      body,
    ].join("\n");

    const base64EncodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64EncodedEmail,
        threadId: originalId, // forward in the same thread
      },
    });
    res.json({ message: "Email forwarded successfully" });
  } catch (error) {
    console.error("Error forwarding email:", error);
    res.status(500).json({ error: "Failed to forward email." });
  }
};

module.exports = {
  fetchEmails,
  sendEmail,
  fetchSingleEmail,
  replyEmail,
  forwardEmail,
  searchEmailsAuthenticated,
  searchEmailsPublic,
};
