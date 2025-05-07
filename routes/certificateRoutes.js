const express = require("express");
const router = express.Router();
const {
  uploadCertificate,
  getCertificateByEmailAndCourse,
} = require("../controllers/certificateController");
const { upload } = require("../utils/cloudinary");

router.post("/upload", upload.single("certificate"), uploadCertificate);
router.get("/get", getCertificateByEmailAndCourse);

module.exports = router;
