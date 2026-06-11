const Task = require('../models/Task');

const taskService = {
  getTasks: async (userId, queryOptions = {}) => {
    const page = parseInt(queryOptions.page) || 1;
    const limit = parseInt(queryOptions.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { userId };

    if (queryOptions.search) {
      query.$or = [
        { title: { $regex: queryOptions.search, $options: 'i' } },
        { description: { $regex: queryOptions.search, $options: 'i' } }
      ];
    }

    if (queryOptions.status && queryOptions.status !== 'all') {
      query.status = queryOptions.status;
    }

    if (queryOptions.priority && queryOptions.priority !== 'all') {
      query.priority = queryOptions.priority;
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
  },

  getTaskById: async (id, userId) => {
    return await Task.findOne({ _id: id, userId });
  },

  createTask: async (taskData) => {
    return await Task.create(taskData);
  },

  updateTask: async (id, userId, updateData) => {
    return await Task.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );
  },

  deleteTask: async (id, userId) => {
    const result = await Task.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
};

module.exports = taskService;
