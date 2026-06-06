const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey123!@#taskmanagementapp', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please add all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await userService.getUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    // Create user
    const user = await userService.createUser({ name, email, password });
    const userId = user._id || user.id;

    res.status(201).json({
      success: true,
      token: generateToken(userId),
      user: {
        id: userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Get user
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await userService.verifyPassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const userId = user._id || user.id;

    res.status(200).json({
      success: true,
      token: generateToken(userId),
      user: {
        id: userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    res.status(200).json({
      success: true,
      user: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error('Get Me Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error retrieving profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
