const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const protect = async (req, res, next) => {
  let token;

  // Check if Bearer token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123!@#taskmanagementapp');

      // Get user from database (either Mongo or Fallback JSON)
      const userId = decoded.id || decoded._id;
      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      // Set user in request
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
