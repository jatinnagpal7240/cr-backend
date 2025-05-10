const express = require("express");
const router = express.Router();
const {
  uploadCertificate,
  getCertificateByEmailAndCourse,
  getUserCertificates,
} = require("../controllers/certificateController");
const { upload } = require("../utils/cloudinary");
const protect = require("../middleware/authMiddleware"); // <-- Make sure this path is correct

router.post("/upload", upload.single("certificate"), uploadCertificate);
router.get("/get", getCertificateByEmailAndCourse);

// ✅ New route to get certificates for the logged-in user
router.get("/my", protect, getUserCertificates);

module.exports = router;
