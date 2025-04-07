const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const allowedOrigins = [
  "http://localhost:3000", // dev
  "http://192.168.29.80:3000", // your current local network frontend
  "https://codeandrun.in", // production frontend
];
// Middleware
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
