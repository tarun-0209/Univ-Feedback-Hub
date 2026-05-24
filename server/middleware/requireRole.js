const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by requireAuth middleware
    if (!req.user || !req.user.type) {
      return res.status(403).json({ message: "Access denied. User role not identified." });
    }

    if (!allowedRoles.includes(req.user.type)) {
      return res.status(403).json({ 
        message: `Access denied. Requires one of roles: ${allowedRoles.join(", ")}` 
      });
    }

    next();
  };
};

module.exports = requireRole;
