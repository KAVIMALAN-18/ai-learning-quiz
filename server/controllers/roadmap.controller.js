// Forward to canonical implementation to avoid duplicates and ensure
// consistent behavior.
const canonical = require("./roadmapController");

exports.generateRoadmap = canonical.generateRoadmap;
exports.getRoadmap = canonical.getRoadmap;
exports.updateStep = canonical.updateStep;
exports.regenerateRoadmap = canonical.regenerateRoadmap;
