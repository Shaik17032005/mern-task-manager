const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbDir = path.join(__dirname, '../data');
const dbFile = path.join(dbDir, 'db.json');

// Ensure database file and directory exist
const initDb = () => {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ users: [], tasks: [] }, null, 2));
  }
};

const readDb = () => {
  initDb();
  try {
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading fallback DB file, resetting database:', err.message);
    const emptyDb = { users: [], tasks: [] };
    fs.writeFileSync(dbFile, JSON.stringify(emptyDb, null, 2));
    return emptyDb;
  }
};

const writeDb = (data) => {
  initDb();
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

// Generate 24-character hex ID (similar to MongoDB ObjectId)
const generateId = () => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

const jsonDb = {
  // User operations
  findUserById: async (id) => {
    const db = readDb();
    return db.users.find(u => u.id === id || u._id === id);
  },

  findUserByEmail: async (email) => {
    const db = readDb();
    const cleanEmail = email.toLowerCase().trim();
    return db.users.find(u => u.email.toLowerCase().trim() === cleanEmail);
  },

  createUser: async (userData) => {
    const db = readDb();
    
    // Check if user already exists
    const existing = db.users.find(u => u.email.toLowerCase().trim() === userData.email.toLowerCase().trim());
    if (existing) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },

  comparePassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  // Task operations
  findTasks: async (userId, queryOptions = {}) => {
    const db = readDb();
    let userTasks = db.tasks.filter(t => t.userId === userId);

    // Apply Search
    if (queryOptions.search) {
      const searchLower = queryOptions.search.toLowerCase();
      userTasks = userTasks.filter(t => 
        t.title.toLowerCase().includes(searchLower) || 
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply Status Filter
    if (queryOptions.status && queryOptions.status !== 'all') {
      userTasks = userTasks.filter(t => t.status === queryOptions.status);
    }

    // Sort by createdAt descending
    userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Stats
    const totalCount = userTasks.length;

    // Apply Pagination
    const page = parseInt(queryOptions.page) || 1;
    const limit = parseInt(queryOptions.limit) || 10;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = userTasks.slice(startIndex, startIndex + limit);

    return {
      tasks: paginatedTasks,
      total: totalCount,
      pages: Math.ceil(totalCount / limit) || 1,
      page
    };
  },

  findTaskById: async (id, userId) => {
    const db = readDb();
    return db.tasks.find(t => t._id === id && t.userId === userId);
  },

  createTask: async (taskData) => {
    const db = readDb();
    const newTask = {
      _id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      userId: taskData.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.tasks.push(newTask);
    writeDb(db);
    return newTask;
  },

  updateTask: async (id, userId, updateData) => {
    const db = readDb();
    const index = db.tasks.findIndex(t => t._id === id && t.userId === userId);
    if (index === -1) return null;

    db.tasks[index] = {
      ...db.tasks[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    writeDb(db);
    return db.tasks[index];
  },

  deleteTask: async (id, userId) => {
    const db = readDb();
    const index = db.tasks.findIndex(t => t._id === id && t.userId === userId);
    if (index === -1) return false;

    db.tasks.splice(index, 1);
    writeDb(db);
    return true;
  }
};

module.exports = jsonDb;
