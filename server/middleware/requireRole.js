const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by requireAuth middleware
    if (!req.user || !req.user.type) {
      return res.status(403).json({ message: "Access denied. User role not identified." });
    }

    const userType = req.user.type.toLowerCase().trim();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().trim());

    if (!normalizedAllowedRoles.includes(userType)) {
      console.log(`RBAC Blocked: User type '${req.user.type}' not in allowed roles [${allowedRoles.join(", ")}]`);
      return res.status(403).json({ 
        message: `Access denied. Requires one of roles: ${allowedRoles.join(", ")}` 
      });
    }

    next();
  };
};

module.exports = requireRole;
