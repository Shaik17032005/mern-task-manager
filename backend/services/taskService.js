const Task = require('../models/Task');
const jsonDb = require('./jsonDb');
const { isFallbackMode } = require('../config/db');

const taskService = {
  getTasks: async (userId, queryOptions = {}) => {
    if (isFallbackMode()) {
      return await jsonDb.findTasks(userId, queryOptions);
    } else {
      const page = parseInt(queryOptions.page) || 1;
      const limit = parseInt(queryOptions.limit) || 10;
      const skip = (page - 1) * limit;

      const query = { userId };

      // Apply Search (case-insensitive regex)
      if (queryOptions.search) {
        query.$or = [
          { title: { $regex: queryOptions.search, $options: 'i' } },
          { description: { $regex: queryOptions.search, $options: 'i' } }
        ];
      }

      // Apply Status Filter
      if (queryOptions.status && queryOptions.status !== 'all') {
        query.status = queryOptions.status;
      }

      const tasks = await Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Task.countDocuments(query);

      return {
        tasks,
        total,
        pages: Math.ceil(total / limit) || 1,
        page
      };
    }
  },

  getTaskById: async (id, userId) => {
    if (isFallbackMode()) {
      return await jsonDb.findTaskById(id, userId);
    } else {
      return await Task.findOne({ _id: id, userId });
    }
  },

  createTask: async (taskData) => {
    if (isFallbackMode()) {
      return await jsonDb.createTask(taskData);
    } else {
      return await Task.create(taskData);
    }
  },

  updateTask: async (id, userId, updateData) => {
    if (isFallbackMode()) {
      return await jsonDb.updateTask(id, userId, updateData);
    } else {
      return await Task.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true, runValidators: true }
      );
    }
  },

  deleteTask: async (id, userId) => {
    if (isFallbackMode()) {
      return await jsonDb.deleteTask(id, userId);
    } else {
      const result = await Task.deleteOne({ _id: id, userId });
      return result.deletedCount > 0;
    }
  }
};

module.exports = taskService;
