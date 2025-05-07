const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const usernameRoutes = require("./routes/usernameRoutes");
const otpRoutes = require("./routes/otpRoutes");
const verifyEmailOtp = require("./routes/otp/email/verify"); // ✅ Fixed the import!
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

// Log current environment
console.log("Current NODE_ENV:", process.env.NODE_ENV);

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.29.80:3000",
  "https://www.codeandrun.in",
  "https://cr-frontend-eight.vercel.app",
  "https://codeandrun.in",
];

// ✅ CORS setup for cookies
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Global Middlewares
app.use(express.json());
app.use(cookieParser());

// Mounting Routes
app.use("/api", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/username", usernameRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/certificates", certificateRoutes);

// Special OTP Verify Route (direct mount)
app.post("/api/otp/email/verify", verifyEmailOtp);

// Connect to Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
