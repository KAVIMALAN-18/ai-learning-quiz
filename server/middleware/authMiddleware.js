const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ❌ No token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Normalize user object (IMPORTANT)
    req.user = {
      id: decoded.id || decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is invalid or expired",
    });
  }
};

module.exports = authMiddleware;
