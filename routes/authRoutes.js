const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { setTokenCookie } = require("../controllers/authController");

// Email, Phone & Password Validation Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@*.])[A-Za-z\d@*.]{8,16}$/;

// -------- Signup Route --------
router.post("/signup", async (req, res) => {
  const { phone, email, password } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Phone number must be 10 digits." });
  }

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({ message: "Password must meet complexity rules." });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email or phone." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ phone, email, password: hashedPassword });
    console.log("Signup successful");

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// -------- Login Route --------
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      message: "Email, phone, or username and password are required.",
    });
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { username: identifier },
      ],
    }).select("+password"); // Important for password comparison

    if (!user) {
      return res
        .status(401)
        .json({ message: "The details you entered are incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "The details you entered are incorrect." });
    }

    const token = jwt.sign(
      { id: user._id }, // Changed from userId to id to match verification
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    // Return the setTokenCookie response directly
    return setTokenCookie(res, token, user);
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
