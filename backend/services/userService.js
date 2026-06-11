const User = require('../models/User');

const userService = {
  getUserById: async (id) => {
    return await User.findById(id).select('-password');
  },

  getUserByEmail: async (email) => {
    return await User.findOne({ email: email.toLowerCase().trim() }).select('-password');
  },

  getUserByEmailWithPassword: async (email) => {
    return await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  },

  createUser: async (userData) => {
    const user = await User.create(userData);
    // Refresh to get the avatar that was generated
    const savedUser = await User.findById(user._id).select('-password');
    return savedUser.toObject ? savedUser.toObject() : savedUser;
  },

  verifyPassword: async (user, enteredPassword) => {
    if (typeof user.matchPassword === 'function') {
      return await user.matchPassword(enteredPassword);
    }
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, user.password);
  }
};

module.exports = userService;
