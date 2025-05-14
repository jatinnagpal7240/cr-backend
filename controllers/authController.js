const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const EmailOtp = require("../models/otp"); // ⭐ Add OTP model here

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "365d",
  });
};

// 🔐 Set secure cookie
const setTokenCookie = (res, token, user) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    },
  });
};

// ✅ Login
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "All fields required." });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    return setTokenCookie(res, token, user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Signup (Updated with OTP Check)
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, emailOtp } = req.body;

    if (!name || !email || !phone || !password || !emailOtp) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const otpRecord = await EmailOtp.findOne({ email, otp: emailOtp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (!otpRecord.verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await EmailOtp.deleteOne({ email }); // Clean up OTP after signup

    const token = generateToken(newUser);
    return setTokenCookie(res, token, newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  loginUser,
  registerUser,
  setTokenCookie,
  generateToken,
};

/**
 * ✅ JWT Auth Standardization Note
 *
 * All tokens are now generated with a consistent payload: { id: user._id }
 * This ensures:
 * - Uniform decoding across the app (e.g., req.cookies.token, getSession, /api/session/verify)
 * - Fewer bugs when accessing user data (decoded.id always works)
 * - Future-proofing for features like profile editing, token refresh, or role-based auth
 *
 * 🔒 Reminder: Keep only minimal safe user data in tokens to maintain security.
 */
