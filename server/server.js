const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/emails");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
