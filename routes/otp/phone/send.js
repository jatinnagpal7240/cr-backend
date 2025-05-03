const express = require("express");
const router = express.Router();
const twilio = require("twilio");

// Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    // Send OTP via Twilio Verify
    const response = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      });

    res.status(200).json({ success: true, message: "OTP sent via Twilio." });
  } catch (error) {
    console.error("Twilio OTP Send Error:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
});

module.exports = router;
