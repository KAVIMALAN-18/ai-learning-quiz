require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const onboardingRoutes = require("./routes/onboarding");
const roadmapRoutes = require("./routes/roadmap");
const chatRoutes = require("./routes/chat");

const app = express();

app.use(cors());
app.use(express.json());

// TEST LOG (IMPORTANT)
console.log("Auth routes loaded");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));
  console.log("✅ index.js loaded");


app.use("/api/auth", authRoutes);
console.log("✅ auth routes mounted at /api/auth");

app.use("/api/onboarding", onboardingRoutes);
console.log("✅ onboarding routes mounted at /api/onboarding");

app.use("/api/roadmap", roadmapRoutes);
console.log("✅ roadmap routes mounted at /api/roadmap");

app.use("/api/chat", chatRoutes);
console.log("✅ chat routes mounted at /api/chat");

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
