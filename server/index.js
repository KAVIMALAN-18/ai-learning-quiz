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
const mongoSanitize = require("express-mongo-sanitize");


const { requestLogger, errorLogger } = require("./middleware/logger");

const app = express();

/* =========================
   ✅ GLOBAL MIDDLEWARE
   ========================= */

// CORS configuration (MUST be first to handle preflight)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
].filter(Boolean);

app.use(
  cors({
    origin: process.env.NODE_ENV === "development" ? true : allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   ✅ PRODUCTION HARDENING
   ========================= */

// Security Headers
app.use(helmet());

// Gzip Compression
app.use(compression());

// Request Logging
app.use(requestLogger);

// Rate Limiting (Applied after CORS to allow preflight)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1000 : (parseInt(process.env.RATE_LIMIT_MAX) || 100),
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter);

// Trust proxy for Render/Railway/Vercel
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Body parser
app.use(express.json());

// Sanitize data against NoSQL injection
// app.use(mongoSanitize()); // Disabled: Conflicts with Express 5 read-only req.query

/* =========================
   ✅ ROUTES
   ========================= */

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/chat", chatRoutes);

const jobRoutes = require("./routes/jobs");
const recommendationRoutes = require("./routes/recommendations");
const mentorRoutes = require("./routes/mentor");
const adminRoutes = require("./routes/admin");
const certificateRoutes = require("./routes/certificates");
const profileRoutes = require("./routes/profile");

app.use("/api/quiz", quizRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/profile", profileRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes);

const courseRoutes = require("./routes/course.routes");
app.use("/api/courses", courseRoutes);

const aiRoutes = require("./routes/ai");
app.use("/api/ai", aiRoutes);

const careerRoutes = require("./routes/career.routes");
app.use("/api/career", careerRoutes);

const interviewRoutes = require("./routes/interview.routes");
app.use("/api/interview", interviewRoutes);

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

    // Auto-seed if catalog is empty
    const Course = require('./models/Course');
    const seedLearningSystem = require('./scripts/seedLearningSystem');

    Course.countDocuments().then(count => {
      if (count === 0) {
        console.log("ℹ️ Course catalog is empty. Running auto-seeding...");
        seedLearningSystem().then(() => {
          console.log("✅ Auto-seeding finished.");
        });
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
