const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getRoadmap,
  updateStep,
  regenerateRoadmap,
} = require("../controllers/roadmap.controller");

// ==============================
// Roadmap Routes
// ==============================

// GET roadmap by topic
// /api/roadmap?topic=JavaScript
router.get("/", protect, getRoadmap);

// Update roadmap step completion
// /api/roadmap/:id/step/:index
router.put("/:id/step/:index", protect, updateStep);

// Regenerate roadmap
// /api/roadmap/:id/regenerate
router.post("/:id/regenerate", protect, regenerateRoadmap);

module.exports = router;
