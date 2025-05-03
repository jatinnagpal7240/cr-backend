const EmailOtp = require("../../../models/otp"); // Adjust the path if needed

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const otpRecord = await EmailOtp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (otpRecord.verified) {
      return res.status(400).json({ message: "OTP already used." });
    }

    // ✅ Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = verifyEmailOtp;
