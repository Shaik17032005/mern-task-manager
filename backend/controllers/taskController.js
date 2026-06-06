const taskService = require('../services/taskService');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { search, status, page, limit } = req.query;

    const result = await taskService.getTasks(userId, {
      search,
      status,
      page,
      limit
    });

    res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: {
        total: result.total,
        pages: result.pages,
        page: result.page,
        limit: parseInt(limit) || 10
      }
    });
  } catch (error) {
    console.error('Get Tasks Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error retrieving tasks' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id || req.user.id;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Please add a title' });
    }

    const task = await taskService.createTask({
      title,
      description,
      userId
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create Task Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error creating task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user._id || req.user.id;
    const taskId = req.params.id;

    // Check if task exists and belongs to user
    const task = await taskService.getTaskById(taskId, userId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found or not authorized' });
    }

    const updatedTask = await taskService.updateTask(taskId, userId, {
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      status: status !== undefined ? status : task.status
    });

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Update Task Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const taskId = req.params.id;

    // Check if task exists and belongs to user
    const task = await taskService.getTaskById(taskId, userId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found or not authorized' });
    }

    const deleted = await taskService.deleteTask(taskId, userId);
    if (!deleted) {
      return res.status(400).json({ success: false, error: 'Could not delete task' });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete Task Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error deleting task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
