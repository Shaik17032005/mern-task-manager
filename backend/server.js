const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exit(1);
  }

  const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    dbMode: 'MongoDB Connected'
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);

  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n================================================================');
  console.log(`Server running on port ${PORT}`);
  console.log('Database Mode: MONGODB');
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log('================================================================\n');
});
};

startServer();