import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Helper to extract Bearer token from headers
const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

// ✅ JWT: Protect general user routes
export const protectUser = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: !user ? 'User no longer exists' : 'User account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
    return res.status(401).json({ status: 'error', message });
  }
};

// ✅ JWT: Protect admin-only routes
export const protectAdmin = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: !user ? 'Admin no longer exists' : 'Admin account is deactivated'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only admins can access this route'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
    return res.status(401).json({ status: 'error', message });
  }
};

// ✅ Shared: Authorize specific roles (works after protectUser or checkSessionValidity)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// ✅ SESSION: Check express-session validity
export const checkSessionValidity = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ status: 'error', message: 'No active session, please log in' });
    }

    const user = await User.findByPk(req.session.userId);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: 'error', message: 'User account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Session check error', error: error.message });
  }
};
