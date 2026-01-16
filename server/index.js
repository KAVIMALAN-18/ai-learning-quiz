require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const onboardingRoutes = require("./routes/onboarding");
const roadmapRoutes = require("./routes/roadmap");
const chatRoutes = require("./routes/chat");
const quizRoutes = require("./routes/quiz");

const app = express();

/* =========================
   ✅ GLOBAL MIDDLEWARE
   ========================= */

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
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

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

/* =========================
   ❌ GLOBAL ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

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
