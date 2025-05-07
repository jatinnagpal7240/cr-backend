// controllers/certificateController.js
const Certificate = require("../models/Certificate");

const uploadCertificate = async (req, res) => {
  try {
    const { email, course } = req.body;

    if (!email || !course || !req.file?.path) {
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
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
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

module.exports = { uploadCertificate, getCertificateByEmailAndCourse };
