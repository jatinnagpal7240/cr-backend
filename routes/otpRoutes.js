const express = require("express");
const router = express.Router();

// ✅ Modularized routes
const emailSend = require("./otp/email/send");
const emailVerify = require("./otp/email/verify");
const phoneSend = require("./otp/phone/send");
const phoneVerify = require("./otp/phone/verify");

router.use("/email/send", emailSend);
router.use("/email/verify", emailVerify);
router.use("/phone/send", phoneSend);
router.use("/phone/verify", phoneVerify);

module.exports = router;
