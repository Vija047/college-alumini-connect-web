const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      message: "No token provided or token format is incorrect. Expected format: 'Bearer <token>'" 
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === 'undefined') {
    return res.status(401).json({ 
      message: "Token is undefined or empty" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: log or store user info
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ 
      message: "Token verification failed", 
      error: error.message 
    });
  }
};

module.exports = authMiddleware;
