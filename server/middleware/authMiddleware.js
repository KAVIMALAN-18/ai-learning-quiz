const jwt = require("jsonwebtoken");
const { logger } = require("./logger");

// 1. Protect Middleware (Verify Token)
exports.protect = (req, res, next) => {
  let token;

  logger.info("🔒 Auth middleware triggered for: %s", req.originalUrl);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      logger.info("🎫 Token received (length): %d", token?.length);

      if (!process.env.JWT_SECRET) {
        logger.error("❌ JWT_SECRET is missing in process.env!");
        return res.status(500).json({ message: "Internal server error: Auth misconfiguration" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.info("✅ Token verified successfully for ID: %s", decoded.id || decoded.userId);

      req.user = { id: decoded.id || decoded.userId }; // Normalized user object
      next();
      return;
    } catch (error) {
      logger.error("❌ JWT Verification Failed: %s", error.message);
      return res.status(401).json({
        message: "Not authorized, token failed: " + error.message
      });
    }
  }

  if (!token) {
    logger.warn("⚠️ No Authorization token found in request headers");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// 2. Authorize Middleware (Check Role)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // req.user must be populated by protect middleware first
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // In a real app we might fetch the full user from DB here to check role
    // For now assuming role check logic is handled or role is passed in token
    // If role is NOT in token, this MVP check needs to fetch User.
    // Let's add a quick DB fetch if role is missing, strictly for safety.

    // NOTE: This assumes 'protect' has run.
    const User = require('../models/User'); // Lazy load to avoid circular dependency
    User.findById(req.user.id).then(user => {
      if (!user) return res.status(401).json({ message: 'User not found' });

      req.user.role = user.role; // Attach role to request

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
      }
      next();
    }).catch(err => {
      res.status(500).json({ message: 'Authorization failed' });
    });
  };
};
