const nodemailer = require("nodemailer");
const Otp = require("../models/otp");

const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Setup mail transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendEmailOtp = async (email) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Save OTP to DB
  await Otp.create({ email, otp, expiresAt });

  const mailOptions = {
    from: `"Code & Run" <${EMAIL_FROM}>`,
    to: email,
    subject: "Your OTP for Code & Run Signup",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  return otp; // optional for dev logs
};

module.exports = sendEmailOtp;
