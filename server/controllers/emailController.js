const { google } = require("googleapis");
const config = require("../config");

const fetchEmails = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: config.GOOGLE_REFRESH_TOKEN,
    });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

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

    const formattedEmails = emailResponses.map((response) => {
      const detail = response.data;
      const headers = detail.payload.headers;
      const getHeader = (name) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
          ?.value || "";
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
      };
    });
    res.json(formattedEmails);
  } catch (error) {
    console.error("Error fetching from Gmail API:", error);
    res.status(500).json({ error: "Failed to fetch emails from Gmail." });
  }
};

const fetchSingleEmail = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: config.GOOGLE_REFRESH_TOKEN,
    });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const emailId = req.params.id;

    const emailResponse = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "full",
    });

    const detail = emailResponse.data;
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

    const formattedEmail = {
      id: detail.id,
      subject: getHeader("subject"),
      from: getHeader("from"),
      to: getHeader("to"),
      body,
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
      },
    });
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};

module.exports = {
  fetchEmails,
  sendEmail,
  fetchSingleEmail,
};
