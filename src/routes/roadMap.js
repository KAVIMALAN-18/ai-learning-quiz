const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  generateRoadmap,
  getRoadmap,
  updateStep,
  regenerateRoadmap,
} = require("../controllers/roadmap.controller");

// GET /api/roadmap?topic=JavaScript
router.get("/", authMiddleware, getRoadmap);

// POST /api/roadmap
router.post("/", authMiddleware, generateRoadmap);

// PATCH /api/roadmap/:id/step/:index
router.patch("/:id/step/:index", authMiddleware, updateStep);

// POST /api/roadmap/:id/regenerate
router.post("/:id/regenerate", authMiddleware, regenerateRoadmap);

module.exports = router;
