require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth"); // <-- MUST be correct

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


// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
