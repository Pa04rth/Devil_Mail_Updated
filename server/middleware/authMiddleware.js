const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication required. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden. Invalid or expired token." });
  }
};

module.exports = authMiddleware;
