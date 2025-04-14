const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Check username availability
router.get("/check", async (req, res) => {
  const { username } = req.query;
  if (!username)
    return res.status(400).json({ message: "Username is required" });
  console.log("Checking for Username: ", username);
  const existing = await User.findOne({ username });
  console.log("Found user with Username: ", existing);
  if (existing) {
    return res.status(409).json({ message: "Username taken" });
  }
  res.status(200).json({ message: "Username available" });
});

// Set/Update username for current logged in user
router.post("/set", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "Username taken" });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username;
    await user.save();

    res.status(200).json({ message: "Username updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
