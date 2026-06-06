const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB, isFallbackMode } = require('./config/db');

// Connect to Database (with automatic local fallback)
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    dbMode: isFallbackMode()
      ? 'Fallback (Local JSON File)'
      : 'MongoDB Connected'
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
  console.log(
    `Database Mode: ${
      isFallbackMode() ? 'LOCAL JSON FILE FALLBACK' : 'MONGODB'
    }`
  );
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log('================================================================\n');
});