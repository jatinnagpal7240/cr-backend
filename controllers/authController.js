import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "365d", // 1 year
  });
};

// 🔐 Set secure cookie
const setTokenCookie = (res, token) => {
  res.cookie("authToken", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // true on prod
    secure: false,
    sameSite: "None", // Crucial for cross site
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  });
  return res.status(200).json({ message: "Login successful" });
};

// ✅ Login
export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "All fields required." });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Signup
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const newUser = await User.create({ name, email, phone, password });

    const token = generateToken(newUser._id);
    setTokenCookie(res, token);

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
