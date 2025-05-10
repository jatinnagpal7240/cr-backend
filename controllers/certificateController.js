// controllers/certificateController.js
const Certificate = require("../models/Certificate");

const uploadCertificate = async (req, res) => {
  try {
    const { email, course } = req.body;

    if (!email || !course || !req.file?.path) {
      console.warn("Missing fields:", { email, course, file: req.file });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const certificate = new Certificate({
      email,
      course,
      certificateUrl: req.file.path,
    });

    await certificate.save();

    res.status(200).json({ message: "Certificate uploaded", certificate });
  } catch (error) {
    console.error("Upload error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getCertificateByEmailAndCourse = async (req, res) => {
  try {
    const { email, course } = req.query;

    if (!email || !course) {
      return res.status(400).json({ message: "Email and course are required" });
    }

    const certificate = await Certificate.findOne({ email, course });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json(certificate);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ New controller to get all certificates of the logged-in user
const getUserCertificates = async (req, res) => {
  try {
    const userEmail = req.user.email; // This comes from your auth middleware
    const certificates = await Certificate.find({ email: userEmail }).sort({
      date: -1,
    });

    res.status(200).json({ certificates });
  } catch (error) {
    console.error("Fetch user certificates error:", error);
    res.status(500).json({ message: "Failed to fetch user certificates" });
  }
};

module.exports = {
  uploadCertificate,
  getCertificateByEmailAndCourse,
  getUserCertificates, // ✅ Export the new controller
};
