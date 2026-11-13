const { verifyAdminToken } = require('../authUtils');

/**
 * Protect middleware: Verifies JWT token from Authorization header.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Authorization header missing.'
    });
  }

  const decoded = verifyAdminToken(authHeader);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token. Please log in again.'
    });
  }

  req.user = decoded;
  req.admin = decoded; // Backwards compatibility for existing routes
  next();
};

/**
 * Admin authorization middleware: Ensures req.user has role === 'admin'.
 */
const adminOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'Super Admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin authorization required for this action.'
    });
  }
  next();
};

module.exports = {
  protect,
  adminOnly
};
