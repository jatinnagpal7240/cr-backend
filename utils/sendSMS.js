const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const res = await client.messages.create({
      body: message,
      from: fromNumber,
      to: `+91${to}`, // Assuming Indian numbers
    });

    console.log("✅ SMS sent:", res.sid);
  } catch (err) {
    console.error("❌ Failed to send SMS:", err.message);
    throw err;
  }
};

module.exports = sendSMS;
