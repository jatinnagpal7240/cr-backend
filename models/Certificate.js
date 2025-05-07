// models/Certificate.js

const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  course: {
    type: String,
    required: true,
  },
  certificateUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;
