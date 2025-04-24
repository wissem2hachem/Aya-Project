const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify user authentication
const authenticate = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is authorized to modify a specific user's data
const authorizeUser = (req, res, next) => {
  try {
    const requestedUserId = req.params.userId || req.params.id;
    
    // Allow if the authenticated user is the requested user
    if (req.user._id.toString() === requestedUserId) {
      return next();
    }
    
    // Allow if user is HR or admin (assuming role-based access)
    if (req.user.role === 'hr' || req.user.role === 'admin') {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied. Not authorized.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { authenticate, authorizeUser }; 