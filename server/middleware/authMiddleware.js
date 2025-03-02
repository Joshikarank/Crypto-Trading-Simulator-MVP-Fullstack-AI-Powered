// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Check if the header starts with "Bearer" (case-insensitive)
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ error: "Invalid token format. Use 'Bearer <token>'." });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1].trim(); // Split by space and take the second part
    console.log("🔹 Clean Token:", token);

    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token:", decoded);

    // Ensure the payload contains userId
    if (!decoded.userId) {
      throw new Error("Invalid token: userId missing in payload");
    }

    // Set the userId in the request object
    req.userId = decoded.userId;
    console.log("✅ Extracted User ID from Token:", req.userId);

    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("❌ JWT Error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};