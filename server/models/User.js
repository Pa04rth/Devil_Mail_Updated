// server/models/User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^.+@luxidevilott\.com$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid luxidevilott.com email!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // NEW FIELD
  emailType: {
    type: String,
    enum: ["single", "bulk"],
    default: "single", // Default for users from public registration
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema, "emails");
