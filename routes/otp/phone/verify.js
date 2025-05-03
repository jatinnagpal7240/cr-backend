const express = require("express");
const router = express.Router();
const twilio = require("twilio");

// Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required." });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      return res
        .status(200)
        .json({ success: true, message: "OTP verified successfully." });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }
  } catch (err) {
    console.error("Twilio OTP Verification Error:", err);
    res.status(500).json({ message: "OTP verification failed." });
  }
});

module.exports = router;
