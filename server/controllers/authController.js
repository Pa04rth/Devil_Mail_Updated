// server/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config");

// Existing public registration
const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      emailType: "single", // Publicly registered users are always 'single'
    });
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// NEW: Admin-only function to register users with a specific type
const registerByAdmin = async (req, res) => {
  const { username, email, password, emailType } = req.body;

  if (!username || !email || !password || !emailType) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!["single", "bulk"].includes(emailType)) {
    return res.status(400).json({ message: "Invalid email type specified." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      emailType, // Set the type from the admin's request
    });
    await newUser.save();
    res.status(201).json({
      message: `User ${username} registered successfully as ${emailType} type.`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATED: Login function now checks for emailType
const login = async (req, res) => {
  const { email, password, emailType } = req.body; // emailType is now expected

  if (!email || !password || !emailType) {
    return res
      .status(400)
      .json({ message: "Email, password, and email type are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // CRITICAL: Check if the user's stored type matches the type they selected on the login screen
    if (user.emailType !== emailType) {
      return res.status(401).json({
        message: `Invalid credentials for the selected '${emailType}' email type.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  register,
  login,
  registerByAdmin, // Export the new function
};
