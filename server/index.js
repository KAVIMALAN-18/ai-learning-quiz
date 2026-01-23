require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const onboardingRoutes = require("./routes/onboarding");
const roadmapRoutes = require("./routes/roadmap");
const chatRoutes = require("./routes/chat");
const quizRoutes = require("./routes/quiz");

const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const { requestLogger, errorLogger } = require("./middleware/logger");

const app = express();

/* =========================
   ✅ PRODUCTION HARDENING
   ========================= */

// Security Headers
app.use(helmet());

// Gzip Compression
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter);

/* =========================
   ✅ GLOBAL MIDDLEWARE
   ========================= */

// Request Logging
app.use(requestLogger);

// CORS
// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL, // Production domain
  "https://*.vercel.app"    // Allow Vercel preview deployments
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Body parser
app.use(express.json());

console.log("✅ index.js loaded");

/* =========================
   ✅ ROUTES
   ========================= */

app.use("/api/auth", authRoutes);
console.log("✅ auth routes mounted");

app.use("/api/onboarding", onboardingRoutes);
console.log("✅ onboarding routes mounted");

app.use("/api/roadmap", roadmapRoutes);
console.log("✅ roadmap routes mounted");

app.use("/api/chat", chatRoutes);
console.log("✅ chat routes mounted");

app.use("/api/quiz", quizRoutes);
console.log("✅ quiz routes mounted");

// Health checks
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: "1.0.0"
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});


/* =========================
   ❌ GLOBAL ERROR HANDLER
   ========================= */
app.use(errorLogger);


/* =========================
   ✅ DATABASE + SERVER
   ========================= */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
