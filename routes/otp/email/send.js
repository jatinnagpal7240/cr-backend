const express = require("express");
const router = express.Router();
const sendEmailOtp = require("../../../utils/sendEmailOtp");

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    await sendEmailOtp(email);
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending email OTP:", error);
    res.status(500).json({ message: "Failed to send OTP. Try again later." });
  }
});

module.exports = router;
