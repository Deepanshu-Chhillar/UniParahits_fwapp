/**
 * UniParahits - Authentication & Role Authorization Middleware
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'uniparahits-sih-2026-secret-key-production';

// Verify JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token provided in demo mode, check for X-User-Id header or proceed
    const userIdHeader = req.headers['x-user-id'];
    if (userIdHeader) {
      req.user = { id: userIdHeader, role: req.headers['x-user-role'] || 'STUDENT' };
      return next();
    }
    return res.status(401).json({ success: false, error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Require minimum rank capability
function requireRank(minRank) {
  const RANK_ORDER = { 'E': 1, 'D': 2, 'C': 3, 'B': 4, 'A': 5 };
  return (req, res, next) => {
    const userRank = req.user?.rank || 'E';
    if ((RANK_ORDER[userRank] || 1) < (RANK_ORDER[minRank] || 1)) {
      return res.status(403).json({
        success: false,
        error: `Insufficient rank capability. Requires Rank ${minRank} or higher.`
      });
    }
    next();
  };
}

// Require role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires ${role} role.`
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRank,
  requireRole,
  JWT_SECRET,
};
