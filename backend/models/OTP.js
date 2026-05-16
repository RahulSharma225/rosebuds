const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: null },
  otp: { type: String, required: true },
  method: { type: String, enum: ["email", "sms"], default: "email" },
  verified: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now, expires: 900 }, // Auto-delete after 15 minutes
});

module.exports = mongoose.model("OTP", otpSchema);
