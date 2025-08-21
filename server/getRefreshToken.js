// To get a new refresh token, we need to prompt the user to authorize the app again.
// so do node getRefreshToken.js
const { google } = require("googleapis");
const path = require("path");
const readline = require("readline");
const dotenv = require("dotenv");

// Load .env file from the parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// The REDIRECT_URI must be one of the "Authorized redirect URIs" in your Google Cloud Console project
const REDIRECT_URI = "http://localhost:3001/oauth2callback";

// Check that we have the necessary credentials
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error(
    "ERROR: Please make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your .env file."
  );
  process.exit(1);
}

// These are the permissions our app will request from the user
const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];

// Create an OAuth2 client with the given credentials
const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

/**
 * Generates an authorization URL and prompts the user to grant access.
 */
function getNewToken() {
  // Generate the URL for the user to visit to grant access
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", // 'offline' is required to get a refresh token
    prompt: "consent", // 'consent' is required to force a new refresh token to be issued
    scope: SCOPES,
  });

  console.log("--------------------------------------------------");
  console.log("Authorize this app by visiting this url:");
  console.log("--------------------------------------------------");
  console.log(authUrl);
  console.log("--------------------------------------------------");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "After authorizing, enter the code from the URL here: ",
    async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log("\n✅  Successfully retrieved tokens!");

        if (tokens.refresh_token) {
          console.log("\n✨ Your new Refresh Token is: ✨");
          console.log("--------------------------------------------------");
          console.log(tokens.refresh_token);
          console.log("--------------------------------------------------");
          console.log(
            "\nCopy this token and paste it into your .env file as GOOGLE_REFRESH_TOKEN\n"
          );
        } else {
          console.error(
            "\n❌ ERROR: A refresh token was not provided by Google. Please ensure you are using 'prompt: \"consent\"' and 'access_type: \"offline\"'."
          );
        }
      } catch (err) {
        console.error("\n❌ Error retrieving access token", err.message);
      }
    }
  );
}

getNewToken();
