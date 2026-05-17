const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ── Trust Proxy (for Render, Vercel, etc.) ──
app.set("trust proxy", 1);

// ── Security Middleware ──
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// ── CORS ──
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admissions", require("./routes/admissions"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/events", require("./routes/events"));
app.use("/api/news", require("./routes/news"));
app.use("/api/fees", require("./routes/fees"));
app.use("/api/students", require("./routes/students"));
app.use("/api/admin", require("./routes/admin"));

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Rose Buds API is running 🌹",
    timestamp: new Date(),
  });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── DB + Server Start ──
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;
