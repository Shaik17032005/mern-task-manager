const User = require('../models/User');
const jsonDb = require('./jsonDb');
const { isFallbackMode } = require('../config/db');

const userService = {
  getUserById: async (id) => {
    if (isFallbackMode()) {
      const user = await jsonDb.findUserById(id);
      if (!user) return null;
      // Return user without password
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    } else {
      return await User.findById(id).select('-password');
    }
  },

  getUserByEmail: async (email) => {
    if (isFallbackMode()) {
      return await jsonDb.findUserByEmail(email);
    } else {
      return await User.findOne({ email });
    }
  },

  createUser: async (userData) => {
    if (isFallbackMode()) {
      const user = await jsonDb.createUser(userData);
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    } else {
      const user = await User.create(userData);
      const { password, ...userWithoutPass } = user.toObject();
      return userWithoutPass;
    }
  },

  verifyPassword: async (user, enteredPassword) => {
    if (isFallbackMode()) {
      return await jsonDb.comparePassword(enteredPassword, user.password);
    } else {
      // In mongoose mode, user is a mongoose document and has matchPassword method.
      // But just in case it is serialized, we handle both.
      if (typeof user.matchPassword === 'function') {
        return await user.matchPassword(enteredPassword);
      }
      const bcrypt = require('bcryptjs');
      return await bcrypt.compare(enteredPassword, user.password);
    }
  }
};

module.exports = userService;
