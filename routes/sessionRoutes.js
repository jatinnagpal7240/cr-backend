const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ✅ Session Verify
router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;

    // 🔍 Debug logs
    console.log("Cookies received:", req.cookies);
    console.log("Token received:", token);

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
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
