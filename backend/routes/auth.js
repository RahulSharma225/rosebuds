const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { protect } = require("../middleware/auth");
const {
  generateOTP,
  sendOTPEmail,
  sendOTPSMS,
} = require("../utils/otpService");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ success: true, token, user });
};

// POST /api/auth/login (Step 1: Verify credentials and send OTP)
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    body("method")
      .optional()
      .isIn(["email", "sms"])
      .withMessage("Invalid delivery method"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password, method = "email" } = req.body;
      const user = await User.findOne({ email }).select("+password");

      if (!user || !(await user.comparePassword(password))) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      if (!user.isActive) {
        return res
          .status(401)
          .json({ success: false, message: "Account is deactivated" });
      }

      if (!user.phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for 2FA",
        });
      }

      // Generate OTP
      const otp = generateOTP();

      // Save OTP to database
      await OTP.deleteMany({ email }); // Clear old OTPs
      await OTP.create({
        email,
        phone: user.phone,
        otp,
        method,
        verified: false,
      });

      // Send OTP
      try {
        if (method === "email") {
          await sendOTPEmail(email, otp, user.name);
        } else if (method === "sms") {
          await sendOTPSMS(user.phone, otp);
        }
      } catch (err) {
        console.error("OTP delivery error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: `OTP sent to your ${method}`,
        email: email,
        requiresOTP: true,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// POST /api/auth/verify-otp (Step 2: Verify OTP and issue token)
router.post(
  "/verify-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, otp } = req.body;

      // Find OTP record
      const otpRecord = await OTP.findOne({ email });
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP expired. Please log in again.",
        });
      }

      // Check attempt limit
      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(429).json({
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        });
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        const remaining = otpRecord.maxAttempts - otpRecord.attempts;
        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${remaining} attempts remaining.`,
        });
      }

      // Mark as verified
      otpRecord.verified = true;
      await otpRecord.save();

      // Get user and issue token
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      // Clean up OTP record
      await OTP.deleteOne({ _id: otpRecord._id });

      sendToken(user, 200, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// POST /api/auth/send-verification-otp (For registration)
router.post(
  "/send-verification-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("method")
      .optional()
      .isIn(["email", "sms"])
      .withMessage("Invalid delivery method"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, name, method = "email" } = req.body;

      // Check if email already exists
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already registered. Please log in instead.",
        });
      }

      // Generate OTP
      const otp = generateOTP();

      // Store temporary OTP (won't create user yet)
      await OTP.deleteMany({ email });
      await OTP.create({
        email,
        phone: "",
        otp,
        method,
        verified: false,
      });

      // Send OTP
      try {
        if (method === "email") {
          await sendOTPEmail(email, otp, name);
        } else if (method === "sms") {
          // Phone will be added during verification
          console.log(
            `\n📱 SMS OTP for ${email}: ${otp} (Valid for 15 minutes)\n`,
          );
        }
      } catch (err) {
        console.error("OTP delivery error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: `OTP sent to your ${method}`,
        email: email,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// POST /api/auth/verify-registration-otp (Verify OTP and create account)
router.post(
  "/verify-registration-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("phone")
      .notEmpty()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Valid phone number is required (at least 10 digits)"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, otp, name, phone, password } = req.body;

      // Find OTP record
      const otpRecord = await OTP.findOne({ email });
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP expired. Please register again.",
        });
      }

      // Check attempt limit
      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(429).json({
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        });
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        const remaining = otpRecord.maxAttempts - otpRecord.attempts;
        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${remaining} attempts remaining.`,
        });
      }

      // OTP is valid, now create the user
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already registered. Please log in instead.",
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        password,
        role: "parent",
      });

      // Clean up OTP record
      await OTP.deleteOne({ _id: otpRecord._id });

      // Send token and user
      sendToken(user, 201, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// POST /api/auth/register (parent self-registration)
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone")
      .notEmpty()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Valid phone number is required (at least 10 digits)"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password, phone } = req.body;
      const existing = await User.findOne({ email });
      if (existing)
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });

      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: "parent",
      });
      sendToken(user, 201, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/auth/update-password
router.put(
  "/update-password",
  protect,
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const user = await User.findById(req.user._id).select("+password");
      if (!(await user.comparePassword(req.body.currentPassword))) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }
      user.password = req.body.newPassword;
      await user.save();
      sendToken(user, 200, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;
