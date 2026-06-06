const mongoose = require('mongoose');

let fallbackMode = false;

const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
    
    // Connect with a 2-second timeout to fail fast if mongod is not running
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 2000,
    });
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    fallbackMode = false;
  } catch (error) {
    console.warn('\n================================================================');
    console.warn('WARNING: Failed to connect to MongoDB.');
    console.warn(`Error: ${error.message}`);
    console.warn('Running server in DATABASE FALLBACK MODE (JSON file DB).');
    console.warn('Tasks and users will be saved locally to backend/data/db.json.');
    console.warn('================================================================\n');
    fallbackMode = true;
  }
};

const isFallbackMode = () => fallbackMode;

module.exports = {
  connectDB,
  isFallbackMode
};
