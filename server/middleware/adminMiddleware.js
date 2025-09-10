// server/middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  // This middleware should run after authMiddleware
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required." });
  }
};

module.exports = adminMiddleware;
