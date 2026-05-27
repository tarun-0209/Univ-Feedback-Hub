const AdminModel = require("../models/AdminScheema");
const jwt = require("jsonwebtoken");

const requireSetupOrAdmin = async (req, res, next) => {
  try {
    const adminCount = await AdminModel.countDocuments();
    
    // If no admins exist, allow the request to pass (initial setup phase)
    if (adminCount === 0) {
      return next();
    }

    // Otherwise, enforce standard admin authentication
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== "admin") {
        return res.status(403).json({ error: "Access denied. Requires admin role." });
      }
      
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Request is not authorized" });
    }
  } catch (error) {
    console.error("Setup Check Error:", error);
    res.status(500).json({ error: "Internal server error during setup check" });
  }
};

module.exports = requireSetupOrAdmin;
