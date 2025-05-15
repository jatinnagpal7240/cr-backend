const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

// ✅ Session Verify
router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ success: true, user }); // ✅ Only one response sent
  } catch (err) {
    console.error("Session verify error:", err.message);
    if (!res.headersSent) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
});

// ✅ Logout route
router.get("/logout", (req, res) => {
  console.log("🔥 Logout route hit. Clearing cookie...");
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
